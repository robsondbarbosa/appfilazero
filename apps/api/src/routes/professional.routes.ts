import { Router } from 'express'
import { adminDb } from '@filazero/firebase'

const router = Router({ mergeParams: true })

// Get all professionals for tenant
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.params
    
    const snapshot = await adminDb
      .collection('professionals')
      .where('tenantId', '==', tenantId)
      .where('isActive', '==', true)
      .get()
    
    const professionals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    res.json(professionals)
  } catch (error) {
    console.error('Error fetching professionals:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create professional
router.post('/', async (req, res) => {
  try {
    const { tenantId } = req.params
    const { name, bio, services } = req.body
    
    const professionalData = {
      tenantId,
      name,
      bio,
      services: services || [],
      isActive: true,
      workingHours: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await adminDb.collection('professionals').add(professionalData)
    
    res.status(201).json({ id: docRef.id, ...professionalData })
  } catch (error) {
    console.error('Error creating professional:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as professionalRoutes }
