import { Anchor, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer
      id="contact"
      className="bg-ocean-deep text-primary-foreground py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-xl font-bold">
                Bunaken Charter
              </span>
            </div>
            <p className="font-body text-primary-foreground/80 leading-relaxed mb-6 max-w-md">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/markhotampi/"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/markho.tampi"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              {t.footer.menu}
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a
                  href="#packages"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.packages}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              {t.footer.contact}
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 whitespace-pre-line">
                  {t.footer.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-coral flex-shrink-0" />
                <a
                  href="tel:+6281234567890"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  +62 821-9665-9515
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-coral flex-shrink-0" />
                <a
                  href="mailto:info@bunakencharter.com"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  info@bunakencharter.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="font-body text-sm text-primary-foreground/60">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
