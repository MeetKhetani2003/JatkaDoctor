import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import BlogAuthor from '@/lib/models/BlogAuthor';

export async function GET() {
  try {
    await dbConnect();
    // Use find().populate to ensure author data is included.
    // Also only fetch Published blogs. If you want to show all for now, remove the filter.
    const items = await Blog.find({ status: 'Published' }).populate('author').sort({ publishDate: -1, createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Blogs GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
