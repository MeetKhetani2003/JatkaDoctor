import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { deleteFromGridFS, uploadToGridFS } from '@/lib/gridfs';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Blog GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Extract gridfs IDs from URLs: /api/images/ID
    const imageId = blog.image.split('/api/images/')[1];
    if (imageId) {
      try {
        await deleteFromGridFS(imageId);
      } catch (e) {
        console.error("Error deleting image from GridFS", e);
      }
    }
    
    const avatarId = blog.authorAvatar.split('/api/images/')[1];
    if (avatarId) {
      try {
        await deleteFromGridFS(avatarId);
      } catch (e) {
        console.error("Error deleting avatar from GridFS", e);
      }
    }
    
    await Blog.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Blog DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    const formData = await request.formData();
    
    const title = formData.get('title');
    const category = formData.get('category');
    const date = formData.get('date');
    const readTime = formData.get('readTime');
    const author = formData.get('author');
    const content = formData.get('content') || '';
    
    if (!title || !category || !date || !readTime || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    let imageUrl = blog.image;
    const imageFile = formData.get('image');
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      // Delete old image
      const oldImageId = blog.image.split('/api/images/')[1];
      if (oldImageId) {
        try {
          await deleteFromGridFS(oldImageId);
        } catch (e) {
          console.error("Error deleting old image:", e);
        }
      }
      // Upload new image
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageId = await uploadToGridFS(imageBuffer, imageFile.name, imageFile.type);
      imageUrl = `/api/images/${imageId}`;
    }
    
    let avatarUrl = blog.authorAvatar;
    const authorAvatarFile = formData.get('authorAvatar');
    if (authorAvatarFile && typeof authorAvatarFile !== 'string' && authorAvatarFile.size > 0) {
      // Delete old avatar
      const oldAvatarId = blog.authorAvatar.split('/api/images/')[1];
      if (oldAvatarId) {
        try {
          await deleteFromGridFS(oldAvatarId);
        } catch (e) {
          console.error("Error deleting old avatar:", e);
        }
      }
      // Upload new avatar
      const avatarBuffer = Buffer.from(await authorAvatarFile.arrayBuffer());
      const avatarId = await uploadToGridFS(avatarBuffer, authorAvatarFile.name, authorAvatarFile.type);
      avatarUrl = `/api/images/${avatarId}`;
    }
    
    blog.title = title;
    blog.category = category;
    blog.date = date;
    blog.readTime = readTime;
    blog.author = author;
    blog.content = content;
    blog.image = imageUrl;
    blog.authorAvatar = avatarUrl;
    
    await blog.save();
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Blog PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
