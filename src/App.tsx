import { useState, useEffect } from 'react';
import { HelmetProvider } from "react-helmet-async";
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
// Phase 1
import PasswordGeneratorTool from "./pages/PasswordGeneratorTool.tsx";
import WordCounterTool from "./pages/WordCounterTool.tsx";
import QRCodeTool from "./pages/QRCodeTool.tsx";
import CaseConverterTool from "./pages/CaseConverterTool.tsx";
import UUIDGeneratorTool from "./pages/UUIDGeneratorTool.tsx";
import LoremIpsumTool from "./pages/LoremIpsumTool.tsx";
import HashGeneratorTool from "./pages/HashGeneratorTool.tsx";
import PercentageCalculatorTool from "./pages/PercentageCalculatorTool.tsx";
import TimestampConverterTool from "./pages/TimestampConverterTool.tsx";
import NumberBaseTool from "./pages/NumberBaseTool.tsx";
// Phase 2
import ImageBase64Tool from "./pages/ImageBase64Tool.tsx";
import CssGradientTool from "./pages/CssGradientTool.tsx";
import CssBoxShadowTool from "./pages/CssBoxShadowTool.tsx";
import JsonCsvTool from "./pages/JsonCsvTool.tsx";
import MarkdownTool from "./pages/MarkdownTool.tsx";
import AgeCalculator from "./pages/AgeCalculator.tsx";
import ColorPaletteTool from "./pages/ColorPaletteTool.tsx";
import MinifierTool from "./pages/MinifierTool.tsx";
import CronTool from "./pages/CronTool.tsx";
import TextBinaryTool from "./pages/TextBinaryTool.tsx";
// Phase 3
import UnitConverterTool from "./pages/UnitConverterTool.tsx";
import TextToolsTool from "./pages/TextToolsTool.tsx";
import MathToolsTool from "./pages/MathToolsTool.tsx";
import DateTimeTool from "./pages/DateTimeTool.tsx";
import RandomGeneratorTool from "./pages/RandomGeneratorTool.tsx";
import FancyTextTool from "./pages/FancyTextTool.tsx";
import MorseCodeTool from "./pages/MorseCodeTool.tsx";
import FinanceToolsTool from "./pages/FinanceToolsTool.tsx";
import StringEncoderTool from "./pages/StringEncoderTool.tsx";
import DataConverterTool from "./pages/DataConverterTool.tsx";
// Phase 4
import ImageToolsTool from "./pages/ImageToolsTool.tsx";
import ChartMakerTool from "./pages/ChartMakerTool.tsx";
import CssToolsTool from "./pages/CssToolsTool.tsx";
import SocialMediaTool from "./pages/SocialMediaTool.tsx";
import SeoToolsTool from "./pages/SeoToolsTool.tsx";
import InteractiveToolsTool from "./pages/InteractiveToolsTool.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
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
    <HelmetProvider>
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
            {/* Phase 1 */}
            <Route path="/password-generator" element={<PasswordGeneratorTool />} />
            <Route path="/word-counter" element={<WordCounterTool />} />
            <Route path="/qr-code" element={<QRCodeTool />} />
            <Route path="/case-converter" element={<CaseConverterTool />} />
            <Route path="/uuid-generator" element={<UUIDGeneratorTool />} />
            <Route path="/lorem-ipsum" element={<LoremIpsumTool />} />
            <Route path="/hash-generator" element={<HashGeneratorTool />} />
            <Route path="/percentage-calculator" element={<PercentageCalculatorTool />} />
            <Route path="/timestamp-converter" element={<TimestampConverterTool />} />
            <Route path="/number-base" element={<NumberBaseTool />} />
            {/* Phase 2 */}
            <Route path="/image-base64" element={<ImageBase64Tool />} />
            <Route path="/css-gradient" element={<CssGradientTool />} />
            <Route path="/css-box-shadow" element={<CssBoxShadowTool />} />
            <Route path="/json-csv" element={<JsonCsvTool />} />
            <Route path="/markdown" element={<MarkdownTool />} />
            <Route path="/age-calculator" element={<AgeCalculator />} />
            <Route path="/color-palette" element={<ColorPaletteTool />} />
            <Route path="/minifier" element={<MinifierTool />} />
            <Route path="/cron" element={<CronTool />} />
            <Route path="/text-binary" element={<TextBinaryTool />} />
            {/* Phase 3 */}
            <Route path="/unit-converter" element={<UnitConverterTool />} />
            <Route path="/text-tools" element={<TextToolsTool />} />
            <Route path="/math-tools" element={<MathToolsTool />} />
            <Route path="/date-time" element={<DateTimeTool />} />
            <Route path="/random-generators" element={<RandomGeneratorTool />} />
            <Route path="/fancy-text" element={<FancyTextTool />} />
            <Route path="/morse-code" element={<MorseCodeTool />} />
            <Route path="/finance-tools" element={<FinanceToolsTool />} />
            <Route path="/string-encoder" element={<StringEncoderTool />} />
            <Route path="/data-converter" element={<DataConverterTool />} />
            {/* Phase 4 */}
            <Route path="/image-tools" element={<ImageToolsTool />} />
            <Route path="/chart-maker" element={<ChartMakerTool />} />
            <Route path="/css-tools" element={<CssToolsTool />} />
            <Route path="/social-media" element={<SocialMediaTool />} />
            <Route path="/seo-tools" element={<SeoToolsTool />} />
            <Route path="/interactive-tools" element={<InteractiveToolsTool />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
