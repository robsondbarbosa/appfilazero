import { Router, type Request, type Response } from 'express'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { db as adminDb } from '@filazero/firebase/admin'
import { notificationService } from '../services/notification.service'
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'

const router = Router({ mergeParams: true })
const tenantsCollection = collection(adminDb, 'tenants')
const appointmentsCollection = collection(adminDb, 'appointments')
const servicesCollection = collection(adminDb, 'services')
const professionalsCollection = collection(adminDb, 'professionals')
const paymentsCollection = collection(adminDb, 'payments')

type TenantParams = {
  tenantId: string
}

// Create payment preference
router.post('/create', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params
    const { appointmentId } = req.body
    
    // Get tenant data
    const tenantDoc = await getDoc(doc(tenantsCollection, tenantId))
    const tenant = tenantDoc.data()
    
    if (!tenant?.mpAccessToken) {
      return res.status(400).json({ error: 'Payment not configured for this tenant' })
    }
    
    // Get appointment data
    const appointmentDoc = await getDoc(doc(appointmentsCollection, appointmentId))
    const appointment = appointmentDoc.data()
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }
    
    // Get service data
    const serviceDoc = await getDoc(doc(servicesCollection, appointment.serviceId))
    const service = serviceDoc.data()
    
    // Create Mercado Pago preference
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
    
    // Update payment record
    await updateDoc(doc(paymentsCollection, appointmentId), {
      mpPreferenceId: result.id,
      updatedAt: new Date()
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

// Mercado Pago webhook
router.post('/mercadopago', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body
    
    if (type === 'payment' && data?.id) {
      // Get payment details from Mercado Pago
      // In production, verify signature
      
      const { external_reference, status, id: mpPaymentId } = req.body
      
      if (external_reference && status === 'approved') {
        const [tenantId, appointmentId] = external_reference.split(':')

        if (!tenantId || !appointmentId) {
          return res.status(400).json({ error: 'Invalid external reference' })
        }
        
        // Update in transaction
        await runTransaction(adminDb, async (transaction) => {
          const paymentRef = doc(paymentsCollection, appointmentId)
          transaction.update(paymentRef, {
            status: 'APPROVED',
            mpPaymentId,
            paidAt: new Date()
          })
          
          const appointmentRef = doc(appointmentsCollection, appointmentId)
          transaction.update(appointmentRef, {
            status: 'CONFIRMED',
            confirmedAt: new Date()
          })
        })
        
        console.log(`[Webhook] Payment approved for appointment ${appointmentId}`)
        
        // Enviar notificação WhatsApp de confirmação
        try {
          const appointmentDoc = await getDoc(doc(appointmentsCollection, appointmentId))
          const appointment = appointmentDoc.data()
          
          if (appointment) {
            const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
              getDoc(doc(servicesCollection, appointment.serviceId)),
              getDoc(doc(professionalsCollection, appointment.professionalId)),
              getDoc(doc(tenantsCollection, tenantId))
            ])
            
            const service = serviceDoc.data()
            const professional = professionalDoc.data()
            const tenant = tenantDoc.data()
            
            await notificationService.sendAppointmentConfirmation({
              clientName: appointment.clientName,
              clientPhone: appointment.clientPhone,
              serviceName: service?.name || 'Serviço',
              professionalName: professional?.name || 'Profissional',
              dateTime: appointment.dateTime.toDate(),
              price: appointment.price,
              tenantName: tenant?.name || 'Estabelecimento',
              tenantAddress: tenant?.address,
              tenantPhone: tenant?.phone
            })
            
            console.log(`[WhatsApp] Confirmação enviada para ${appointment.clientPhone}`)
          }
        } catch (notifyError) {
          console.error('[WhatsApp] Erro ao enviar confirmação:', notifyError)
          // Não falhar o webhook se a notificação falhar
        }
      }
    }
    
    res.status(200).send('OK')
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).send('Error')
  }
})

export { router as paymentRoutes }
