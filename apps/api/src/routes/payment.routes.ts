import { Router, type Request, type Response } from 'express'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { db as adminDb } from '@filazero/firebase/server'
import { notificationService } from '../services/notification.service'
import { FieldValue } from 'firebase-admin/firestore'

const router = Router({ mergeParams: true })
const tenantsCollection = adminDb.collection('tenants')
const appointmentsCollection = adminDb.collection('appointments')
const servicesCollection = adminDb.collection('services')
const professionalsCollection = adminDb.collection('professionals')
const paymentsCollection = adminDb.collection('payments')

type TenantParams = {
  tenantId: string
}

type MercadoPagoWebhookPayload = {
  action?: string
  data?: {
    id?: number | string
  }
  type?: string
}

type MercadoPagoPaymentResponse = {
  external_reference?: string
  id?: number
  status?: string
}

function isMercadoPagoPaymentNotification(payload: unknown): payload is MercadoPagoWebhookPayload {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const notification = payload as MercadoPagoWebhookPayload
  const isPaymentNotification =
    notification.type === 'payment' || notification.action?.startsWith('payment.') === true

  return isPaymentNotification && typeof notification.data?.id !== 'undefined'
}

async function fetchMercadoPagoPayment(
  paymentId: string,
  accessToken: string
): Promise<MercadoPagoPaymentResponse | null> {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return null
  }

  return response.json() as Promise<MercadoPagoPaymentResponse>
}

async function resolveMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPaymentResponse | null> {
  const tenantSnapshot = await tenantsCollection.get()
  const accessTokens = new Set<string>()

  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    accessTokens.add(process.env.MERCADOPAGO_ACCESS_TOKEN)
  }

  tenantSnapshot.docs.forEach((tenantDoc) => {
    const accessToken = tenantDoc.data()?.mpAccessToken

    if (typeof accessToken === 'string' && accessToken.trim()) {
      accessTokens.add(accessToken)
    }
  })

  for (const accessToken of accessTokens) {
    const payment = await fetchMercadoPagoPayment(paymentId, accessToken)

    if (payment?.id) {
      return payment
    }
  }

  return null
}

function mapMercadoPagoStatus(status?: string): 'APPROVED' | 'PENDING' | 'REJECTED' {
  if (status === 'approved') {
    return 'APPROVED'
  }

  if (status === 'pending' || status === 'in_process') {
    return 'PENDING'
  }

  return 'REJECTED'
}

router.get('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params

    const snapshot = await paymentsCollection
      .where('tenantId', '==', tenantId)
      .orderBy('createdAt', 'desc')
      .get()

    const payments = snapshot.docs.map((paymentDoc) => ({
      id: paymentDoc.id,
      ...paymentDoc.data(),
    }))

    res.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/create', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params
    const { appointmentId } = req.body

    const tenantDoc = await tenantsCollection.doc(tenantId).get()
    const tenant = tenantDoc.data()

    if (!tenant?.mpAccessToken) {
      return res.status(400).json({ error: 'Payment not configured for this tenant' })
    }

    const appointmentDoc = await appointmentsCollection.doc(appointmentId).get()
    const appointment = appointmentDoc.data()

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }

    const serviceDoc = await servicesCollection.doc(String(appointment.serviceId)).get()
    const service = serviceDoc.data()

    const client = new MercadoPagoConfig({
      accessToken: tenant.mpAccessToken
    })

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [{
          id: appointmentId,
          title: service?.name || 'Agendamento',
          description: `Agendamento em ${tenant.name}`,
          quantity: 1,
          unit_price: Number(appointment.price),
          currency_id: 'BRL',
        }],
        external_reference: `${tenantId}:${appointmentId}`,
        notification_url: `${process.env.API_URL}/webhooks/mercadopago`,
        back_urls: {
          success: `${process.env.WEB_URL}/${tenant.slug}/booking/confirmation/${appointmentId}`,
          failure: `${process.env.WEB_URL}/${tenant.slug}/booking/payment/${appointmentId}`,
          pending: `${process.env.WEB_URL}/${tenant.slug}/booking/payment/${appointmentId}`,
        },
        auto_return: 'approved',
      }
    })

    await paymentsCollection.doc(appointmentId).update({
      mpPreferenceId: result.id,
      updatedAt: FieldValue.serverTimestamp()
    })

    const interactionData = (result as {
      point_of_interaction?: {
        transaction_data?: {
          qr_code?: string
          qr_code_base64?: string
        }
      }
    }).point_of_interaction?.transaction_data

    res.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      qrCode: interactionData?.qr_code,
      qrCodeBase64: interactionData?.qr_code_base64,
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/mercadopago', async (req: Request, res: Response) => {
  try {
    if (!isMercadoPagoPaymentNotification(req.body)) {
      return res.status(400).json({ error: 'Invalid Mercado Pago webhook payload' })
    }

    const paymentId = String(req.body.data!.id)
    const paymentDetails = await resolveMercadoPagoPayment(paymentId)

    if (!paymentDetails?.external_reference || !paymentDetails.id) {
      return res.status(404).json({ error: 'Mercado Pago payment not found' })
    }

    const [tenantId, appointmentId] = paymentDetails.external_reference.split(':')

    if (!tenantId || !appointmentId) {
      return res.status(400).json({ error: 'Invalid external reference' })
    }

    const paymentStatus = mapMercadoPagoStatus(paymentDetails.status)
    const isApproved = paymentStatus === 'APPROVED'

    await adminDb.runTransaction(async (transaction) => {
      const paymentRef = paymentsCollection.doc(appointmentId)
      const appointmentRef = appointmentsCollection.doc(appointmentId)

      transaction.update(paymentRef, {
        status: paymentStatus,
        mpPaymentId: paymentDetails.id,
        ...(isApproved ? { paidAt: FieldValue.serverTimestamp() } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      })

      transaction.update(appointmentRef, {
        status: isApproved ? 'CONFIRMED' : 'PENDING',
        ...(isApproved ? { confirmedAt: FieldValue.serverTimestamp() } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      })
    })

    if (isApproved) {
      try {
        const appointmentDoc = await appointmentsCollection.doc(appointmentId).get()
        const appointment = appointmentDoc.data()

        if (appointment) {
          const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
            servicesCollection.doc(String(appointment.serviceId)).get(),
            professionalsCollection.doc(String(appointment.professionalId)).get(),
            tenantsCollection.doc(tenantId).get(),
          ])

          const service = serviceDoc.data()
          const professional = professionalDoc.data()
          const tenant = tenantDoc.data()

          await notificationService.sendAppointmentConfirmation({
            clientName: appointment.clientName,
            clientPhone: appointment.clientPhone,
            serviceName: service?.name || 'Serviço',
            professionalName: professional?.name || 'Profissional',
            dateTime: (appointment.dateTime as FirebaseFirestore.Timestamp).toDate(),
            price: appointment.price,
            tenantName: tenant?.name || 'Estabelecimento',
            tenantAddress: tenant?.address,
            tenantPhone: tenant?.phone
          })
        }
      } catch (notifyError) {
        console.error('[WhatsApp] Erro ao enviar confirmação:', notifyError)
      }
    }

    res.status(200).send('OK')
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).send('Error')
  }
})

export { router as paymentRoutes }
