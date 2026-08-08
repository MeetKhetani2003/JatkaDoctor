"use client";

import { useEffect, useState, use } from "react";
import BlogForm from "../../components/BlogForm";
import { Loader2 } from "lucide-react";

export default function EditBlogPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog || blog.error) {
    return <div>Blog not found or error loading blog.</div>;
  }

  return (
    <div>
      <BlogForm initialData={blog} isEdit={true} />
    </div>
  );
}
