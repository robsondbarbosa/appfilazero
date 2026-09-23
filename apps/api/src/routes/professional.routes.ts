import { Router, type Request, type Response } from 'express'
import { db as adminDb } from '@filazero/firebase/server'
import { FieldValue } from 'firebase-admin/firestore'

const router = Router({ mergeParams: true })
const professionalsCollection = adminDb.collection('professionals')

type TenantParams = {
  tenantId: string
}

// Get all professionals for tenant
router.get('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params

    const snapshot = await professionalsCollection
      .where('tenantId', '==', tenantId)
      .where('isActive', '==', true)
      .orderBy('name', 'asc')
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const docRef = await professionalsCollection.add(professionalData)

    res.status(201).json({ id: docRef.id, ...professionalData })
  } catch (error) {
    console.error('Error creating professional:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req: Request<TenantParams & { id: string }>, res: Response) => {
  try {
    const { tenantId, id } = req.params
    const professionalRef = professionalsCollection.doc(id)
    const professionalDoc = await professionalRef.get()

    if (!professionalDoc.exists || professionalDoc.data()?.tenantId !== tenantId) {
      return res.status(404).json({ error: 'Professional not found' })
    }

    const { name, bio, services, workingHours, isActive } = req.body

    const updates: Record<string, unknown> = {
      ...(typeof name === 'string' ? { name } : {}),
      ...(typeof bio === 'string' ? { bio } : {}),
      ...(Array.isArray(services) ? { services } : {}),
      ...(Array.isArray(workingHours) ? { workingHours } : {}),
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await professionalRef.update(updates)

    res.json({ id, ...professionalDoc.data(), ...updates })
  } catch (error) {
    console.error('Error updating professional:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req: Request<TenantParams & { id: string }>, res: Response) => {
  try {
    const { tenantId, id } = req.params
    const professionalRef = professionalsCollection.doc(id)
    const professionalDoc = await professionalRef.get()

    if (!professionalDoc.exists || professionalDoc.data()?.tenantId !== tenantId) {
      return res.status(404).json({ error: 'Professional not found' })
    }

    await professionalRef.update({
      isActive: false,
      updatedAt: FieldValue.serverTimestamp(),
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting professional:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as professionalRoutes }
