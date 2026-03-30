import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toolsList } from "@/lib/tools";
import { Search } from "lucide-react";

const blogPosts = [
  { title: "Getting Started with JSON Formatting", href: "/blog" },
  { title: "Understanding Base64 Encoding", href: "/blog" },
  { title: "URL Encoding Best Practices", href: "/blog" },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-secondary/50 text-muted-foreground text-xs font-mono hover:bg-secondary hover:text-foreground transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search tools…</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search tools & blog posts…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {toolsList.map((tool) => (
              <CommandItem
                key={tool.href}
                value={tool.title}
                onSelect={() => runCommand(tool.href)}
                className="cursor-pointer"
              >
                <tool.icon className="mr-2 h-4 w-4 text-primary" />
                <div>
                  <span className="font-mono text-sm">{tool.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{tool.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Blog">
            {blogPosts.map((post) => (
              <CommandItem
                key={post.title}
                value={post.title}
                onSelect={() => runCommand(post.href)}
                className="cursor-pointer"
              >
                <span className="font-mono text-sm">{post.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
