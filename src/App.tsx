import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import JsonFormatter from "./pages/JsonFormatter.tsx";
import Base64Tool from "./pages/Base64Tool.tsx";
import UrlTool from "./pages/UrlTool.tsx";
import ColorTool from "./pages/ColorTool.tsx";
import RegexTool from "./pages/RegexTool.tsx";
import JwtTool from "./pages/JwtTool.tsx";
import CodeFormatterPage from "./pages/CodeFormatterPage.tsx";
import CodeDiff from "./pages/CodeDiff.tsx";
import XmlTool from "./pages/XmlTool.tsx";
import Blog from "./pages/Blog.tsx";
import FeedbackPopup from "./components/FeedbackPopup.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  // Show popup after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Re-show popup after dismissal (30 seconds)
  const handlePopupDismiss = () => {
    setShowFeedbackPopup(false);
    setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 30000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showFeedbackPopup && <FeedbackPopup onDismiss={handlePopupDismiss} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/json" element={<JsonFormatter />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/url" element={<UrlTool />} />
            <Route path="/color" element={<ColorTool />} />
            <Route path="/regex" element={<RegexTool />} />
            <Route path="/jwt" element={<JwtTool />} />
            <Route path="/code-formatter" element={<CodeFormatterPage />} />
            <Route path="/code-diff" element={<CodeDiff />} />
            <Route path="/xml" element={<XmlTool />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
