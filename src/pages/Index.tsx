import { Layout } from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { toolsList as tools } from "@/lib/tools";

const Index = () => {
  return (
    <Layout>
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-sm text-terminal-dim">$</span>
            <span className="font-mono text-sm text-primary animate-pulse-glow">_</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-foreground mb-4">
            Free Developer<br />
            <span className="text-primary text-glow">Utilities</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A collection of essential tools for developers. No sign-up, no tracking, no BS. Just tools that work.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
