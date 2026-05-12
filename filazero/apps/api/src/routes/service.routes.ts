import { Router } from 'express'
import { adminDb } from '@filazero/firebase'

const router = Router({ mergeParams: true })

// Get all services for tenant
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.params
    
    const snapshot = await adminDb
      .collection('services')
      .where('tenantId', '==', tenantId)
      .where('isActive', '==', true)
      .orderBy('order', 'asc')
      .get()
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    res.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create service
router.post('/', async (req, res) => {
  try {
    const { tenantId } = req.params
    const { name, description, duration, price } = req.body
    
    const serviceData = {
      tenantId,
      name,
      description,
      duration,
      price,
      isActive: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await adminDb.collection('services').add(serviceData)
    
    res.status(201).json({ id: docRef.id, ...serviceData })
  } catch (error) {
    console.error('Error creating service:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as serviceRoutes }
