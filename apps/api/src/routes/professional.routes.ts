import { Router, type Request, type Response } from 'express'
import { db as adminDb } from '@filazero/firebase/server'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'

const router = Router({ mergeParams: true })
const professionalsCollection = collection(adminDb, 'professionals')

type TenantParams = {
  tenantId: string
}

// Get all professionals for tenant
router.get('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params
    
    const snapshot = await getDocs(
      query(
        professionalsCollection,
        where('tenantId', '==', tenantId),
        where('isActive', '==', true)
      )
    )
    
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
router.post('/', async (req: Request<TenantParams>, res: Response) => {
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
    
    const docRef = await addDoc(professionalsCollection, professionalData)
    
    res.status(201).json({ id: docRef.id, ...professionalData })
  } catch (error) {
    console.error('Error creating professional:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as professionalRoutes }
