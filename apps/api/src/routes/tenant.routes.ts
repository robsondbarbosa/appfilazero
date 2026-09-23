import { Router, type Request, type Response } from 'express'
import { db as adminDb } from '@filazero/firebase/server'
import { FieldValue } from 'firebase-admin/firestore'

const router = Router()
const tenantsCollection = adminDb.collection('tenants')

router.get('/id/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const tenantDoc = await tenantsCollection.doc(id).get()

    if (!tenantDoc.exists) {
      return res.status(404).json({ error: 'Tenant not found' })
    }

    const tenant = tenantDoc.data()

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' })
    }

    delete tenant.mpAccessToken
    delete tenant.mpPublicKey

    res.json({ id: tenantDoc.id, ...tenant })
  } catch (error) {
    console.error('Error fetching tenant by id:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const snapshot = await tenantsCollection
      .where('slug', '==', slug)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Tenant not found' })
    }

    const tenant = snapshot.docs[0].data()
    // Remove sensitive data
    delete tenant.mpAccessToken
    delete tenant.mpPublicKey

    res.json({ id: snapshot.docs[0].id, ...tenant })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, email, plan = 'FREE' } = req.body

    // Check if slug already exists
    const existing = await tenantsCollection
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (!existing.empty) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const tenantData = {
      name,
      slug,
      email,
      plan,
      primaryColor: '#D4AF37',
      secondaryColor: '#1A1A1A',
      bookingWindow: 30,
      cancelDeadline: 24,
      requirePayment: true,
      autoConfirm: false,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const docRef = await tenantsCollection.add(tenantData)

    res.status(201).json({ id: docRef.id, ...tenantData })
  } catch (error) {
    console.error('Error creating tenant:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const tenantRef = tenantsCollection.doc(id)
    const tenantDoc = await tenantRef.get()

    if (!tenantDoc.exists) {
      return res.status(404).json({ error: 'Tenant not found' })
    }

    const {
      name,
      email,
      phone,
      whatsapp,
      address,
      city,
      state,
      zipCode,
      description,
      primaryColor,
      secondaryColor,
      bookingWindow,
      cancelDeadline,
      requirePayment,
      autoConfirm,
    } = req.body

    const updates = {
      ...(typeof name === 'string' ? { name } : {}),
      ...(typeof email === 'string' ? { email } : {}),
      ...(typeof phone === 'string' ? { phone } : {}),
      ...(typeof whatsapp === 'string' ? { whatsapp } : {}),
      ...(typeof address === 'string' ? { address } : {}),
      ...(typeof city === 'string' ? { city } : {}),
      ...(typeof state === 'string' ? { state } : {}),
      ...(typeof zipCode === 'string' ? { zipCode } : {}),
      ...(typeof description === 'string' ? { description } : {}),
      ...(typeof primaryColor === 'string' ? { primaryColor } : {}),
      ...(typeof secondaryColor === 'string' ? { secondaryColor } : {}),
      ...(typeof bookingWindow === 'number' ? { bookingWindow } : {}),
      ...(typeof cancelDeadline === 'number' ? { cancelDeadline } : {}),
      ...(typeof requirePayment === 'boolean' ? { requirePayment } : {}),
      ...(typeof autoConfirm === 'boolean' ? { autoConfirm } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await tenantRef.update(updates)

    const nextTenant: Record<string, unknown> = {
      ...tenantDoc.data(),
      ...updates,
    }

    delete nextTenant.mpAccessToken
    delete nextTenant.mpPublicKey

    res.json({ id, ...nextTenant })
  } catch (error) {
    console.error('Error updating tenant:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as tenantRoutes }
