import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import HowItWorks from "./pages/HowItWorks";
import SubmitForm from "./pages/SubmitForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Samples from "./pages/Samples";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const App = () => {
  const handleClickAnywhere = (e: React.MouseEvent) => {
    // Ignore clicks on navbar or components
    const navElement = document.querySelector("nav");
    if (navElement && navElement.contains(e.target as Node)) {
      return;
    }
    // Ignore interactive elements
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("textarea") || target.closest("a")) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div onClick={handleClickAnywhere}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout/:planId" element={<Checkout />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/submit-form" element={<SubmitForm />} />
            <Route path="/submit" element={<SubmitForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/samples" element={<Samples />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  );
};

export default App;
