import { Router } from 'express'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { adminDb } from '@filazero/firebase'
import { notificationService } from '../services/notification.service'

const router = Router({ mergeParams: true })

// Create payment preference
router.post('/create', async (req, res) => {
  try {
    const { tenantId } = req.params
    const { appointmentId } = req.body
    
    // Get tenant data
    const tenantDoc = await adminDb.collection('tenants').doc(tenantId).get()
    const tenant = tenantDoc.data()
    
    if (!tenant?.mpAccessToken) {
      return res.status(400).json({ error: 'Payment not configured for this tenant' })
    }
    
    // Get appointment data
    const appointmentDoc = await adminDb.collection('appointments').doc(appointmentId).get()
    const appointment = appointmentDoc.data()
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' })
    }
    
    // Get service data
    const serviceDoc = await adminDb.collection('services').doc(appointment.serviceId).get()
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
    await adminDb.collection('payments').doc(appointmentId).update({
      mpPreferenceId: result.id,
      updatedAt: new Date()
    })
    
    res.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      qrCode: result.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Mercado Pago webhook
router.post('/mercadopago', async (req, res) => {
  try {
    const { type, data } = req.body
    
    if (type === 'payment' && data?.id) {
      // Get payment details from Mercado Pago
      // In production, verify signature
      
      const { external_reference, status, id: mpPaymentId } = req.body
      
      if (external_reference && status === 'approved') {
        const [tenantId, appointmentId] = external_reference.split(':')
        
        // Update in transaction
        await adminDb.runTransaction(async (transaction) => {
          const paymentRef = adminDb.collection('payments').doc(appointmentId)
          transaction.update(paymentRef, {
            status: 'APPROVED',
            mpPaymentId,
            paidAt: new Date()
          })
          
          const appointmentRef = adminDb.collection('appointments').doc(appointmentId)
          transaction.update(appointmentRef, {
            status: 'CONFIRMED',
            confirmedAt: new Date()
          })
        })
        
        console.log(`[Webhook] Payment approved for appointment ${appointmentId}`)
        
        // Enviar notificação WhatsApp de confirmação
        try {
          const appointmentDoc = await adminDb.collection('appointments').doc(appointmentId).get()
          const appointment = appointmentDoc.data()
          
          if (appointment) {
            const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
              adminDb.collection('services').doc(appointment.serviceId).get(),
              adminDb.collection('professionals').doc(appointment.professionalId).get(),
              adminDb.collection('tenants').doc(tenantId).get()
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
