import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchDialog } from "@/components/SearchDialog";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md h-14 flex items-center px-4 gap-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <Link to="/" className="flex items-center gap-2 group">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-mono font-bold text-foreground text-lg tracking-tight">
                dev<span className="text-primary">tools</span>
              </span>
            </Link>

            <div className="ml-auto">
              <SearchDialog />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border py-8">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                <div>
                  <h3 className="font-mono font-bold text-foreground mb-3">DevTools</h3>
                  <p className="text-sm text-muted-foreground">Free developer utilities for everyday coding tasks</p>
                </div>
                
                <div>
                  <h4 className="font-mono font-semibold text-foreground mb-3 text-sm">Tools</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/json" className="text-muted-foreground hover:text-primary transition-colors">JSON Formatter</Link></li>
                    <li><Link to="/base64" className="text-muted-foreground hover:text-primary transition-colors">Base64 Tool</Link></li>
                    <li><Link to="/url" className="text-muted-foreground hover:text-primary transition-colors">URL Tool</Link></li>
                    <li><Link to="/color" className="text-muted-foreground hover:text-primary transition-colors">Color Tool</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono font-semibold text-foreground mb-3 text-sm">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                    <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                    <li><a href="mailto:rdan99848@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-mono font-semibold text-foreground mb-3 text-sm">Support</h4>
                  <a 
                    href="https://buymeacoffee.com/dandev2026" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
                  >
                    ☕ Buy me a coffee
                  </a>
                  <div className="mt-2">
                    <img src="/qr-code.png" alt="Support QR Code" className="w-20 h-20 rounded" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 pt-6 border-t border-border">
                <div className="flex gap-6">
                  <a href="https://www.linkedin.com/in/dan-gatobu-012544214/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn" aria-label="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                    </svg>
                  </a>
                  <a href="https://www.upwork.com/freelancers/~01128993ebc1bd665b" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Upwork" aria-label="Upwork">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M56 32l336 0c30.9 0 56 25.1 56 56l0 336c0 30.9-25.1 56-56 56L56 480c-30.9 0-56-25.1-56-56L0 88C0 57.1 25.1 32 56 32zM270.9 274.2c6.6-52.9 25.9-69.5 51.4-69.5c25.3 0 44.9 20.2 44.9 49.7s-19.7 49.7-44.9 49.7c-27.9 0-46.3-21.5-51.4-29.9zm-26.7-41.8c-8.2-15.5-14.3-36.3-19.2-55.6l-29.7 0-33.2 0 0 78.1c0 28.4-12.9 49.4-38.2 49.4s-39.8-20.9-39.8-49.3l.3-78.1-36.2 0 0 78.1c0 22.8 7.4 43.5 20.9 58.2c13.9 15.2 32.8 23.2 54.8 23.2c43.7 0 74.2-33.5 74.2-81.5l0-52.5c4.6 17.3 15.4 50.5 36.2 79.7L215 392.6l36.8 0 12.8-78.4c4.2 3.5 8.7 6.6 13.4 9.4c12.3 7.8 26.4 12.2 40.9 12.6l.1 0c.5 0 1.1 0 1.6 0c.6 0 1.1 0 1.7 0c45.1 0 80.9-34.9 80.9-81.9s-35.9-82.2-80.9-82.2c-45.4 0-70.9 29.7-78.1 60.1z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/DanGatobu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="GitHub" aria-label="GitHub">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 496 512">
                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-sm text-muted-foreground font-mono">&copy; 2026 DevTools. Made with ❤️ by Dan Gatobu</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
