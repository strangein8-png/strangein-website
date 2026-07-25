import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogById } from '@/lib/blogsStore';
import LikeButton from '@/components/LikeButton';

export async function generateMetadata({ params }) {
  const blog = await getBlogById(params.slug);
  if (!blog) return { title: 'Blog not found — Strange In' };
  return {
    title: `${blog.title} — Strange In`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlogById(params.slug);
  if (!blog) notFound();

  return (
    <main className="blog-detail">
      <div className="blog-detail-inner">
        <Link href="/#blogs" className="btn-ghost blog-back">
          ← Back to blogs
        </Link>

        <div className={`blog-detail-hero ${blog.image ? '' : `grad ${blog.grad}`}`}>
          {blog.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={blog.image} alt={blog.title} className="blog-detail-photo" />
          )}
          <span className={`blog-cat ${blog.gold ? 'gold' : ''}`}>{blog.cat}</span>
        </div>

        <h1 className="blog-detail-title">{blog.title}</h1>

        <div className="blog-author blog-detail-author">
          <div className="av">
            <div>{blog.initials}</div>
          </div>
          <div className="who">
            <strong>{blog.author}</strong>
            <span>{blog.meta}</span>
          </div>
        </div>

        <p className="blog-detail-content">{blog.content}</p>

        <div className="blog-detail-footer">
          <LikeButton id={blog.id} initialLikes={blog.likes} className="blog-like blog-like-standalone" />
        </div>
      </div>
    </main>
  );
}