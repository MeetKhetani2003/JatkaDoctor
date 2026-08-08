import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const blog = await Blog.findById(params.id).populate('author');
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const updateData = {};
    
    // Extract base fields
    const fields = [
      'title', 'slug', 'category', 'status', 'author', 'content',
      'metaTitle', 'metaDescription', 'focusKeyword', 'secondaryKeywords', 'canonicalUrl',
      'imageAlt', 'imageTitle', 'imageCaption'
    ];
    
    fields.forEach(f => {
      const val = formData.get(f);
      if (val !== null) updateData[f] = val;
    });
    
    // FAQs
    const faqsRaw = formData.get('faqs');
    if (faqsRaw) {
      updateData.faqs = JSON.parse(faqsRaw);
    }
    
    // Calculate Read Time if content changed
    if (updateData.content) {
      const wordCount = updateData.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
      updateData.readTime = `${Math.ceil(wordCount / 200)} min read`;
    }
    
    if (formData.get('publishDate')) {
      updateData.publishDate = new Date(formData.get('publishDate'));
    }
    
    // Handle Image Upload
    const file = formData.get('image');
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      updateData.imageFileId = await uploadToGridFS(buffer, file.name, file.type);
    } else if (typeof file === 'string' && file) {
      updateData.image = file;
    }
    
    const blog = await Blog.findByIdAndUpdate(params.id, updateData, { new: true });
    return NextResponse.json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Blog slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Blog.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
