import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Clock,
  Users,
  Camera,
  Anchor,
  Waves,
  CheckCircle2,
  CircleMinus,
} from "lucide-react";
import divingBunaken from "@/assets/diving-bunaken.jpg";
import sunsetBunaken from "@/assets/sunset-bunaken.jpg";
import heroBunaken from "@/assets/hero-bunaken.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

interface Package {
  id: number;
  name: string;
  price: string;
  duration: string;
  capacity: string;
  image: string;
  features: string[];
  exclude: string[];
  popular?: boolean;
}

interface AddOn {
  id: number;
  name: string;
  price: string;
  description: string;
  icon: React.ReactNode;
}

const WHATSAPP_NUMBER = "6282196659515";

const PackagesSection = () => {
  const { t, language } = useLanguage();

  const packages: Package[] = [
    {
      id: 1,
      name: t.packageData.smallBoat.name,
      price: "Rp 170.000",
      duration: t.packageData.smallBoat.duration,
      capacity: t.packageData.smallBoat.capacity,
      image: heroBunaken,
      features: t.packageData.smallBoat.features,
      exclude: t.packageData.smallBoat.exclude,
    },
    {
      id: 2,
      name: t.packageData.largeBoat.name,
      price: "Rp 120.000",
      duration: t.packageData.largeBoat.duration,
      capacity: t.packageData.largeBoat.capacity,
      image: divingBunaken,
      features: t.packageData.largeBoat.features,
      exclude: t.packageData.largeBoat.exclude,
      popular: true,
    },
    {
      id: 3,
      name: t.packageData.mediumBoat.name,
      price: "Rp 190.000",
      duration: t.packageData.mediumBoat.duration,
      capacity: t.packageData.mediumBoat.capacity,
      image: sunsetBunaken,
      features: t.packageData.mediumBoat.features,
      exclude: t.packageData.mediumBoat.exclude,
    },
  ];

  const addOns: AddOn[] = [
    {
      id: 1,
      name: t.addOns.snorkeling.name,
      price: "Rp 150.000",
      description: t.addOns.snorkeling.description,
      icon: <Waves className="w-5 h-5" />,
    },
    {
      id: 2,
      name: t.addOns.lunch.name,
      price: "Rp 50.000",
      description: t.addOns.lunch.description,
      icon: <Camera className="w-5 h-5" />,
    },
  ];

  const handleBookNow = (packageName: string) => {
    const message = t.packages.whatsapp.package.replace(
      "{packageName}",
      packageName
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleAddOnInquiry = (addOnName: string) => {
    const message = t.packages.whatsapp.addOn.replace("{addOnName}", addOnName);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section id="packages" className="relative py-20 lg:py-28 bg-primary/1">
      {/* Top gradient transition from Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 via-primary/5 to-transparent" />
      {/* Bottom gradient transition to Locations */}

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.packages.title}{" "}
            <span className="text-primary">{t.packages.titleHighlight}</span>{" "}
            {t.packages.titleSuffix}
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            {t.packages.description}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg, index) => (
            <Card
              key={pkg.id}
              className={`group relative overflow-hidden border-border/50 shadow-card hover:shadow-glow transition-all duration-500 ${
                pkg.popular ? "ring-2 ring-accent" : ""
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-sunset text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {t.packages.popular}
                </div>
              )}

              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              <CardHeader className="pb-2">
                <h3 className="font-display text-2xl font-bold text-card-foreground">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-primary">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {t.packages.perPerson}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick Info */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{pkg.capacity}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-card-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Excluded Items */}
                <ul className="space-y-2">
                  {pkg.exclude.map((excluded, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CircleMinus className="w-4 h-4 text-not-available flex-shrink-0" />
                      <span className="text-not-available/90">{excluded}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={pkg.popular ? "coral" : "default"}
                  size="lg"
                  className="w-full"
                  onClick={() => handleBookNow(pkg.name)}
                >
                  <Anchor className="w-4 h-4" />
                  {t.packages.bookNow}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.packages.addOns.title}
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              {t.packages.addOns.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addOn, index) => (
              <Card
                key={addOn.id}
                className="group border-border/50 shadow-card hover:shadow-glow transition-all duration-300 hover:border-primary/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {addOn.icon}
                    </div>
                    <h3 className="font-display text-xl font-bold text-card-foreground">
                      {addOn.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-bold text-primary">
                      {addOn.price}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {addOn.description}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddOnInquiry(addOn.name)}
                  >
                    {t.packages.addOns.inquire}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
