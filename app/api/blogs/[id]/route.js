import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { deleteFromGridFS } from '@/lib/gridfs';

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
