import { Shield, Award, Heart, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t.about.features.safety.title,
      description: t.about.features.safety.description,
    },
    {
      icon: Award,
      title: t.about.features.experience.title,
      description: t.about.features.experience.description,
    },
    {
      icon: Heart,
      title: t.about.features.service.title,
      description: t.about.features.service.description,
    },
    {
      icon: Clock,
      title: t.about.features.schedule.title,
      description: t.about.features.schedule.description,
    },
  ];

  return (
    <section id="about" className="relative py-20 lg:py-28 bg-muted/80">
      {/* Top gradient transition from Locations */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/8 via-muted/50 to-transparent" />

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.about.title}{" "}
              <span className="text-primary">{t.about.titleHighlight}</span>{" "}
              {t.about.titleSuffix}
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              {t.about.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="font-display text-3xl font-bold text-primary">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.about.stats.trips}
                </div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="font-display text-3xl font-bold text-primary">
                  2000+
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.about.stats.customers}
                </div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="font-display text-3xl font-bold text-primary">
                  8+
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.about.stats.years}
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
