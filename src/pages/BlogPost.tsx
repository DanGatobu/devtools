import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { blogPostsMetadata } from "@/data/blogPosts";
import { fullBlogContent } from "@/data/blogPosts-content.js";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams();
  
  // Find the post by slug
  const post = blogPostsMetadata.find(p => p.slug === slug);
  
  useEffect(() => {
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <Layout>
        <div className="container py-10 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <h1 className="text-2xl font-mono font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  // Get the full content for this post
  const content = fullBlogContent[post.id];

  return (
    <Layout>
      <article className="container py-10 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary">{post.tag}</span>
            <span className="text-xs font-mono text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
          />
        </div>
      </article>
    </Layout>
  );
};

// Simple markdown to HTML converter
function formatMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up
  html = html.replace(/<p><h/g, '<h');
  html = html.replace(/<\/h(\d)><\/p>/g, '</h$1>');
  html = html.replace(/<p><pre>/g, '<pre>');
  html = html.replace(/<\/pre><\/p>/g, '</pre>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  
  return html;
}

export default BlogPost;
