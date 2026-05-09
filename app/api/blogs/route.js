import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { uploadToGridFS } from '@/lib/gridfs';

export async function GET() {
  try {
    await dbConnect();
    const items = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Blogs GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    const title = formData.get('title');
    const category = formData.get('category');
    const date = formData.get('date');
    const readTime = formData.get('readTime');
    const author = formData.get('author');
    const content = formData.get('content') || '';
    
    const imageFile = formData.get('image');
    const authorAvatarFile = formData.get('authorAvatar');
    
    if (!title || !category || !date || !readTime || !author || !imageFile || !authorAvatarFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Upload main image
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageId = await uploadToGridFS(imageBuffer, imageFile.name, imageFile.type);
    const imageUrl = `/api/images/${imageId}`;
    
    // Upload author avatar
    const avatarBuffer = Buffer.from(await authorAvatarFile.arrayBuffer());
    const avatarId = await uploadToGridFS(avatarBuffer, authorAvatarFile.name, authorAvatarFile.type);
    const avatarUrl = `/api/images/${avatarId}`;
    
    const newBlog = new Blog({
      title,
      category,
      date,
      readTime,
      author,
      content,
      image: imageUrl,
      authorAvatar: avatarUrl
    });
    
    await newBlog.save();
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Blogs POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
