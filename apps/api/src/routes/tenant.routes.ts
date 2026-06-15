import { Router } from 'express'
import { db as adminDb } from '@filazero/firebase/server'
import { addDoc, collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore'

const router = Router()
const tenantsCollection = collection(adminDb, 'tenants')

router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params
    const tenantDoc = await getDoc(doc(tenantsCollection, id))

    if (!tenantDoc.exists()) {
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

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    
    const snapshot = await getDocs(
      query(
        tenantsCollection,
        where('slug', '==', slug),
        where('isActive', '==', true),
        limit(1)
      )
    )
    
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

router.post('/', async (req, res) => {
  try {
    const { name, slug, email, plan = 'FREE' } = req.body
    
    // Check if slug already exists
    const existing = await getDocs(query(tenantsCollection, where('slug', '==', slug), limit(1)))
    
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await addDoc(tenantsCollection, tenantData)
    
    res.status(201).json({ id: docRef.id, ...tenantData })
  } catch (error) {
    console.error('Error creating tenant:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const tenantRef = doc(tenantsCollection, id)
    const tenantDoc = await getDoc(tenantRef)

    if (!tenantDoc.exists()) {
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
      updatedAt: new Date(),
    }

    await updateDoc(tenantRef, updates)

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
