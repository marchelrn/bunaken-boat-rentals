import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "6282196659515";

const WhatsAppButton = () => {
  const { t } = useLanguage();

  const handleClick = () => {
    const message = encodeURIComponent(t.whatsapp.message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-primary-foreground px-5 py-3 rounded-full shadow-card hover:shadow-glow hover:scale-105 transition-all duration-300 group"
      aria-label={t.whatsapp.ariaLabel}
    >
      <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
      <span className="font-body font-semibold hidden sm:inline">{t.whatsapp.button}</span>
    </button>
  );
};

export default WhatsAppButton;