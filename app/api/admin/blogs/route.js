import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let filter = {};
    if (search) {
      filter = { title: { $regex: search, $options: 'i' } };
    }
    
    const blogs = await Blog.find(filter)
      .populate('author')
      .sort({ createdAt: -1 });
      
    // Basic analytics
    const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
    const publishedCount = blogs.filter(b => b.status === 'Published').length;
      
    return NextResponse.json({
      blogs,
      analytics: {
        totalViews,
        publishedCount,
        totalCount: blogs.length
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    // Extract base fields
    const title = formData.get('title');
    const slug = formData.get('slug');
    const category = formData.get('category');
    const status = formData.get('status') || 'Draft';
    const author = formData.get('author');
    const content = formData.get('content');
    
    // SEO fields
    const metaTitle = formData.get('metaTitle');
    const metaDescription = formData.get('metaDescription');
    const focusKeyword = formData.get('focusKeyword');
    const secondaryKeywords = formData.get('secondaryKeywords');
    const canonicalUrl = formData.get('canonicalUrl');
    
    // Image SEO
    const imageAlt = formData.get('imageAlt');
    const imageTitle = formData.get('imageTitle');
    const imageCaption = formData.get('imageCaption');
    
    // FAQs
    const faqsRaw = formData.get('faqs');
    const faqs = faqsRaw ? JSON.parse(faqsRaw) : [];
    
    // Calculate Read Time
    const wordCount = content ? content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;
    
    // Handle Image Upload
    const file = formData.get('image');
    let imageFileId = null;
    let imageUrl = null;
    
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    } else if (typeof file === 'string' && file) {
      imageUrl = file;
    }
    
    const publishDate = formData.get('publishDate') ? new Date(formData.get('publishDate')) : new Date();

    const blog = new Blog({
      title,
      slug,
      category,
      status,
      publishDate,
      author: author || undefined,
      content,
      readTime,
      imageFileId,
      image: imageUrl,
      metaTitle,
      metaDescription,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      imageAlt,
      imageTitle,
      imageCaption,
      faqs
    });
    
    await blog.save();
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    // Return appropriate error if duplicate slug
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Blog slug already exists. Please choose a unique URL.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
