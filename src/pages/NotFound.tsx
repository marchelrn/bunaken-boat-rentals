import heroBunaken from "@/assets/hero-bunaken.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBunaken})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary-foreground">{t.notFound.title}</h1>
        <p className="mb-4 text-xl text-primary-foreground/90">{t.notFound.message}</p>
        <a href="/" className="text-seafoam underline hover:text-seafoam/90">
          {t.notFound.backHome}
        </a>
      </div>
    </div>
  );
};

export default NotFound;