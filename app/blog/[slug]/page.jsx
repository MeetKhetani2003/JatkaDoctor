import Image from "next/image";
import { Clock, ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import BlogAuthor from "@/lib/models/BlogAuthor";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  
  const blog = await Blog.findOne({ $or: [{ slug }, { _id: slug.length === 24 ? slug : null }] });
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Dr Jhatka Medicare'
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription,
    keywords: [blog.focusKeyword, blog.secondaryKeywords].filter(Boolean).join(", "),
    alternates: {
      canonical: blog.canonicalUrl || `https://www.drjhatka.com/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription,
      images: [blog.image || (blog.imageFileId ? `/api/images/${blog.imageFileId}` : '')].filter(Boolean),
      type: 'article',
      publishedTime: blog.publishDate || blog.createdAt,
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  
  const blog = await Blog.findOne({ $or: [{ slug }, { _id: slug.length === 24 ? slug : null }] }).populate('author');

  if (!blog) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Blog Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">Return to Blogs</Link>
        </div>
      </main>
    );
  }

  // Schema Generation
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.image || (blog.imageFileId ? `https://www.drjhatka.com/api/images/${blog.imageFileId}` : '')].filter(Boolean),
    "datePublished": blog.publishDate || blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": [{
      "@type": "Person",
      "name": blog.author?.name || (typeof blog.author === 'string' ? blog.author : 'Expert'),
      "url": "https://www.drjhatka.com/our-medical-team"
    }]
  };

  const faqSchema = blog.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.drjhatka.com/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.drjhatka.com/blog"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": blog.title,
      "item": `https://www.drjhatka.com/blog/${blog.slug}`
    }]
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/blog" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <span className="font-bold text-gray-900 truncate max-w-[250px]">
              {blog.title}
            </span>
          </div>
        </div>
      </header>

      <article className="mt-14 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-900">{blog.author?.name || (typeof blog.author === 'string' ? blog.author : 'Expert')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime || "5 min read"}</span>
            </div>
          </div>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
          <Image
            src={blog.image || (blog.imageFileId ? `/api/images/${blog.imageFileId}` : '')}
            alt={blog.imageAlt || blog.title}
            title={blog.imageTitle}
            fill
            className="object-cover"
            priority
          />
          {blog.imageCaption && (
            <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs p-2 text-center backdrop-blur-sm">
              {blog.imageCaption}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* FAQs */}
            {blog.faqs && blog.faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {blog.faqs.map((faq, i) => (
                    <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h3 className="font-bold text-gray-900">{faq.question}</h3>
                      <p className="mt-2 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Author Box Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  {blog.author?.photoUrl || blog.author?.photoFileId ? (
                    <Image src={blog.author?.photoUrl || `/api/images/${blog.author?.photoFileId}`} alt={blog.author?.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{blog.author?.name || (typeof blog.author === 'string' ? blog.author : 'Expert')}</p>
                  <p className="text-xs text-primary font-bold">{blog.author?.qualification}</p>
                  <p className="text-xs text-gray-500">{blog.author?.designation}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{blog.author?.bio || "A dedicated healthcare professional committed to providing the best insights and guidance for your health and wellness journey."}</p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
