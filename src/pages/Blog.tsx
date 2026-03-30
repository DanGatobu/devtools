import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPostsMetadata } from "@/data/blogPosts";

const posts = blogPostsMetadata;

const Blog = () => {
  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-8">Blog</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <article className="group border border-border rounded-lg p-6 bg-card card-glow transition-all duration-300 hover:card-glow-hover hover:border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary">{post.tag}</span>
                  <span className="text-xs font-mono text-muted-foreground">{post.date}</span>
                </div>
                <h2 className="text-lg font-mono font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-mono text-primary">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
