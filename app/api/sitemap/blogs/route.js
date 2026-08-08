import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/lib/models/Blog';

export async function GET() {
  try {
    await connectDB();
    
    // Only published blogs
    const blogs = await Blog.find({ status: 'Published' }).sort({ publishDate: -1 });
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.drjhatka.com';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Blog Listing Page -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

    blogs.forEach(blog => {
      const pubDate = blog.publishDate ? new Date(blog.publishDate).toISOString() : new Date(blog.createdAt).toISOString();
      xml += `  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });
    
    xml += `</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new NextResponse(`Error generating sitemap: ${error.message}`, { status: 500 });
  }
}
