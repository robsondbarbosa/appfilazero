import { Router } from 'express'
import { adminDb } from '@filazero/firebase'

const router = Router()

// Get tenant by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    
    const snapshot = await adminDb
      .collection('tenants')
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

// Create tenant (super admin only)
router.post('/', async (req, res) => {
  try {
    const { name, slug, email, plan = 'FREE' } = req.body
    
    // Check if slug already exists
    const existing = await adminDb
      .collection('tenants')
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
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await adminDb.collection('tenants').add(tenantData)
    
    res.status(201).json({ id: docRef.id, ...tenantData })
  } catch (error) {
    console.error('Error creating tenant:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as tenantRoutes }
