import { Button } from "@/components/ui/button";
import { Anchor, ChevronDown } from "lucide-react";
import heroBunaken from "@/assets/hero-bunaken.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  
  const scrollToPackages = () => {
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBunaken})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-seafoam/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float animation-delay-400" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-md rounded-full px-5 py-2 mb-6">
            <span className="text-primary-foreground font-body text-sm tracking-wide">
              {t.hero.badge}
            </span>
          </div>
        </div>

        <h1 className="opacity-0 animate-fade-in-up animation-delay-200 font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          {t.hero.title}
          <br />
          <span className="text-seafoam">{t.hero.titleHighlight}</span>
        </h1>

        <p className="opacity-0 animate-fade-in-up animation-delay-400 font-body text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.hero.description}
        </p>

        <div className="opacity-0 animate-fade-in-up animation-delay-600 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="xl"
            onClick={scrollToPackages}
          >
            {t.hero.viewPackages}
          </Button>
          <Button 
            variant="outline" 
            size="xl"
            className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            asChild
          >
            <a href="#about">{t.hero.aboutUs}</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button 
        onClick={scrollToPackages}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/80 hover:text-primary-foreground transition-colors animate-bounce"
        aria-label={t.hero.scrollDown}
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};

export default HeroSection;