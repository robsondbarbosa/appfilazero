import { Router, type Request, type Response } from 'express'
import { db as adminDb } from '@filazero/firebase/admin'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

const router = Router({ mergeParams: true })
const servicesCollection = collection(adminDb, 'services')

type TenantParams = {
  tenantId: string
}

// Get all services for tenant
router.get('/', async (req: Request<TenantParams>, res: Response) => {
  try {
    const { tenantId } = req.params
    
    const snapshot = await getDocs(
      query(
        servicesCollection,
        where('tenantId', '==', tenantId),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      )
    )
    
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
router.post('/', async (req: Request<TenantParams>, res: Response) => {
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
    
    const docRef = await addDoc(servicesCollection, serviceData)
    
    res.status(201).json({ id: docRef.id, ...serviceData })
  } catch (error) {
    console.error('Error creating service:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req: Request<TenantParams & { id: string }>, res: Response) => {
  try {
    const { tenantId, id } = req.params
    const { name, description, duration, price, order, isActive } = req.body

    const serviceRef = doc(servicesCollection, id)
    const serviceDoc = await getDoc(serviceRef)

    if (!serviceDoc.exists() || serviceDoc.data()?.tenantId !== tenantId) {
      return res.status(404).json({ error: 'Service not found' })
    }

    const updates = {
      ...(typeof name === 'string' ? { name } : {}),
      ...(typeof description === 'string' ? { description } : {}),
      ...(typeof duration === 'number' ? { duration } : {}),
      ...(typeof price === 'number' ? { price } : {}),
      ...(typeof order === 'number' ? { order } : {}),
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      updatedAt: new Date(),
    }

    await updateDoc(serviceRef, updates)

    res.json({ id, ...serviceDoc.data(), ...updates })
  } catch (error) {
    console.error('Error updating service:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req: Request<TenantParams & { id: string }>, res: Response) => {
  try {
    const { tenantId, id } = req.params
    const serviceRef = doc(servicesCollection, id)
    const serviceDoc = await getDoc(serviceRef)

    if (!serviceDoc.exists() || serviceDoc.data()?.tenantId !== tenantId) {
      return res.status(404).json({ error: 'Service not found' })
    }

    await updateDoc(serviceRef, {
      isActive: false,
      updatedAt: new Date(),
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as serviceRoutes }
