import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LocationsSection = () => {
  const { t } = useLanguage();

  const mapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3319.703838275641!2d124.83335254385824!3d1.4855455519636642!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3287750063284fbf%3A0xfad440bb4e6b69c5!2sDermaga%20Megamas%20Manado!5e1!3m2!1sid!2sid!4v1767595563586!5m2!1sid!2sid";

  // Google Maps link - ganti dengan link yang sesuai
  const mapsLink = "https://maps.app.goo.gl/4TjnjLXVTwhF9AQo9";

  return (
    <section id="locations" className="relative py-20 lg:py-28 bg-primary/5">
      {/* Top gradient transition from Packages */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-muted/50 via-primary/4 to-transparent" />
      {/* Bottom gradient transition to About */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/2 via-primary/100 to-transparent" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t.locations.title}
          </h2>
        </div>

        {/* Google Maps Card */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-card shadow-card">
            <div className="relative w-full h-[360px] md:h-[480px] lg:h-[520px]">
              <iframe
                src={mapsEmbedUrl}
                style={{ border: 0 }}
                width="900"
                height="650"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                title={t.locations.title}
              />
            </div>
          </div>

          {/* Button Link to Google Maps */}
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <Button
              variant="default"
              size="lg"
              asChild
              className="gap-2 shadow-md hover:shadow-lg"
            >
              <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                <MapPin className="w-5 h-5" />
                {t.locations.viewOnMaps}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
