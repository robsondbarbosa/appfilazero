import { Router } from 'express'
import { adminDb } from '@filazero/firebase'
import { AppointmentStatus } from '@filazero/types'

const router = Router({ mergeParams: true })

// Get appointments for tenant
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.params
    const { professionalId, date } = req.query
    
    let query = adminDb
      .collection('appointments')
      .where('tenantId', '==', tenantId)
      .orderBy('dateTime', 'asc')
    
    if (professionalId) {
      query = query.where('professionalId', '==', professionalId)
    }
    
    const snapshot = await query.get()
    
    let appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Filter by date if provided (client-side filtering for date range)
    if (date) {
      const filterDate = new Date(date as string)
      const nextDay = new Date(filterDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      appointments = appointments.filter(apt => {
        const aptDate = apt.dateTime.toDate()
        return aptDate >= filterDate && aptDate < nextDay
      })
    }
    
    res.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create appointment with double-booking prevention
router.post('/', async (req, res) => {
  try {
    const { tenantId } = req.params
    const { 
      clientName, 
      clientEmail, 
      clientPhone,
      serviceId, 
      professionalId, 
      dateTime,
      duration,
      price,
      notes 
    } = req.body
    
    const startTime = new Date(dateTime)
    const endTime = new Date(startTime.getTime() + duration * 60000)
    
    // Transaction to prevent double-booking
    const result = await adminDb.runTransaction(async (transaction) => {
      // Check for conflicts
      const conflictsQuery = await adminDb
        .collection('appointments')
        .where('professionalId', '==', professionalId)
        .where('status', 'not-in', ['CANCELLED', 'NO_SHOW'])
        .get()
      
      const conflicts = conflictsQuery.docs.filter(doc => {
        const apt = doc.data()
        const aptStart = apt.dateTime.toDate()
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000)
        
        return (startTime < aptEnd && endTime > aptStart)
      })
      
      if (conflicts.length > 0) {
        throw new Error('TIME_CONFLICT')
      }
      
      // Create appointment
      const appointmentRef = adminDb.collection('appointments').doc()
      const appointmentData = {
        tenantId,
        clientName,
        clientEmail,
        clientPhone,
        serviceId,
        professionalId,
        dateTime: startTime,
        duration,
        price,
        status: AppointmentStatus.PENDING,
        notes: notes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      transaction.set(appointmentRef, appointmentData)
      
      // Create payment record
      const paymentRef = adminDb.collection('payments').doc(appointmentRef.id)
      transaction.set(paymentRef, {
        appointmentId: appointmentRef.id,
        tenantId,
        status: 'PENDING',
        amount: price,
        createdAt: new Date()
      })
      
      return { id: appointmentRef.id, ...appointmentData }
    })
    
    res.status(201).json(result)
  } catch (error: any) {
    if (error.message === 'TIME_CONFLICT') {
      return res.status(409).json({ error: 'Horário já reservado' })
    }
    console.error('Error creating appointment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Cancel appointment
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params
    
    await adminDb.collection('appointments').doc(id).update({
      status: AppointmentStatus.CANCELLED,
      cancelledAt: new Date(),
      updatedAt: new Date()
    })
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as appointmentRoutes }
