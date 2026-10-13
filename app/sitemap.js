import connectDB from '@/lib/db';
import Blog from '@/lib/models/Blog';
import Doctor from '@/lib/models/Doctor';
import HomeCareService from '@/lib/models/homeCare/HomeCareService';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.drjhatka.com';
  // Core Static Pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/our-medical-team',
    '/services/lab-test',
    '/services/ambulance',
    '/services/physiotherapy',
    '/services/doctor',
    '/services/icu',
    '/services/home-care',
    '/services/nursing',
    '/services/equipment',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  let blogRoutes = [];
  let doctorRoutes = [];

  try {
    await connectDB();

    // Fetch blogs for dynamic sitemap paths
    let blogs = [];
    try {
      blogs = await Blog.find({}, { slug: 1, updatedAt: 1 });
    } catch (e) {
      console.error("Failed to retrieve blogs for sitemap:", e);
    }

    // Fetch doctors for dynamic sitemap paths
    let doctors = [];
    try {
      doctors = await Doctor.find({}, { slug: 1, updatedAt: 1 });
    } catch (e) {
      console.error("Failed to retrieve doctors for sitemap:", e);
    }

    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    doctorRoutes = doctors.map((doc) => ({
      url: `${baseUrl}/doctor/${doc.slug}`,
      lastModified: doc.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Fetch active Home Care and Nursing Care services
    let homeCareServices = [];
    try {
      homeCareServices = await HomeCareService.find({ status: 'Active', showOnWebsite: true }, { slug: 1, category: 1, updatedAt: 1 });
    } catch (e) {
      console.error("Failed to retrieve home care services for sitemap:", e);
    }

    const homeCareRoutes = homeCareServices.map((svc) => ({
      url: `${baseUrl}/services/${svc.category === 'nursing-care' ? 'nursing-care' : 'home-care'}/${svc.slug}`,
      lastModified: svc.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes, ...doctorRoutes, ...homeCareRoutes];
  } catch (error) {
    console.warn("Sitemap builder could not connect to MongoDB. Building static routes only.", error.message);
  }

  return staticRoutes;
}
