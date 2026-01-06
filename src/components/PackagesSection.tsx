import { useState } from "react";
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
  CheckCircle2,
  CircleMinus,
  ChevronDown,
  MapPin,
  Utensils,
  Waves,
} from "lucide-react";
import divingBunaken from "@/assets/diving-bunaken.jpg";
import sunsetBunaken from "@/assets/sunset-bunaken.jpg";
import heroBunaken from "@/assets/hero-bunaken.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePackages } from "@/contexts/PackageContext";

interface Route {
  name: string;
  price: string;
}

interface Package {
  id: number;
  name: string;
  duration: string;
  capacity: string;
  image: string;
  features: string[];
  exclude: string[];
  routes: Route[];
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

// Helper function to extract max capacity from string like "1-5 Orang" or "10-15 Orang"
const getMaxCapacity = (capacityString: string): number => {
  const match = capacityString.match(/(\d+)\s*-\s*(\d+)/);
  if (match) {
    return parseInt(match[2], 10); // Return the second number (max)
  }
  // Fallback: try to find any number
  const numberMatch = capacityString.match(/(\d+)/);
  return numberMatch ? parseInt(numberMatch[1], 10) : 1;
};

// Helper function to get minimum price from routes (excluding "-")
const getMinPrice = (routes: Route[]): number => {
  const prices = routes
    .map((route) => {
      // Remove dots and convert to number, skip if price is "-"
      if (
        route.price === "-" ||
        route.price.toLowerCase().includes("hubungi")
      ) {
        return null;
      }
      const priceStr = route.price.replace(/\./g, "");
      const priceNum = parseInt(priceStr, 10);
      return isNaN(priceNum) ? null : priceNum;
    })
    .filter((price): price is number => price !== null);

  return prices.length > 0 ? Math.min(...prices) : 0;
};

// Helper function to format price
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const PackagesSection = () => {
  const { t, language } = useLanguage();
  const { packages: packagesData } = usePackages();
  const [expandedPackage, setExpandedPackage] = useState<number | null>(null);

  // Map package images based on ID
  const packageImages: Record<number, string> = {
    1: heroBunaken,
    2: divingBunaken,
    3: sunsetBunaken,
  };

  // Convert PackageData to Package format with images
  const packages: Package[] = packagesData.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    duration: pkg.duration,
    capacity: pkg.capacity,
    image: packageImages[pkg.id] || heroBunaken,
    features: pkg.features,
    exclude: pkg.exclude,
    routes: pkg.routes,
    popular: pkg.popular || false,
  }));

  const { addOns: addOnsData } = usePackages();

  // Map add-ons with icons based on name
  const getAddOnIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("snorkel") || lowerName.includes("snorkling")) {
      return <Waves className="w-5 h-5" />;
    }
    if (
      lowerName.includes("makan") ||
      lowerName.includes("lunch") ||
      lowerName.includes("makan siang")
    ) {
      return <Utensils className="w-5 h-5" />;
    }
    return <Waves className="w-5 h-5" />; // Default icon
  };

  const addOns: AddOn[] = addOnsData.map((addOn) => ({
    id: addOn.id,
    name: addOn.name,
    price: addOn.price,
    description: addOn.description,
    icon: getAddOnIcon(addOn.name),
  }));

  const handleBookNow = (
    packageName: string,
    routeName: string,
    price: string
  ) => {
    const message = t.packages.whatsapp.route
      .replace("{packageName}", packageName)
      .replace("{routeName}", routeName)
      .replace("{price}", price);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const togglePackageDetails = (packageId: number) => {
    setExpandedPackage(expandedPackage === packageId ? null : packageId);
  };

  const handleAddOnInquiry = (addOnName: string) => {
    const message = t.packages.whatsapp.addOn.replace("{addOnName}", addOnName);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Sort packages so popular one is always in the center (index 1 for 3 columns)
  const sortedPackages = [...packages];
  if (sortedPackages.length === 3) {
    const popularIndex = sortedPackages.findIndex((pkg) => pkg.popular);
    if (popularIndex !== -1 && popularIndex !== 1) {
      // Swap popular package to center position
      [sortedPackages[popularIndex], sortedPackages[1]] = [
        sortedPackages[1],
        sortedPackages[popularIndex],
      ];
    }
  }

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
          {sortedPackages.map((pkg, index) => (
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
                <h3 className="font-display text-2xl font-bold text-card-foreground mb-2">
                  {pkg.name}
                </h3>
                {(() => {
                  const minPrice = getMinPrice(pkg.routes);

                  if (minPrice > 0) {
                    return (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-muted-foreground">
                          {t.packages.startingFrom}
                        </span>
                        <span className="font-display text-2xl font-bold text-primary">
                          Rp {formatPrice(minPrice)}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
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
                  onClick={() => togglePackageDetails(pkg.id)}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedPackage === pkg.id ? "rotate-180" : ""
                    }`}
                  />
                  {t.packages.detailPackage}
                </Button>
              </CardFooter>

              {/* Expanded Details */}
              {expandedPackage === pkg.id && (
                <CardContent className="pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {t.packages.selectRoute}
                      </h4>
                      <div className="space-y-3">
                        {pkg.routes.map((route, routeIdx) => (
                          <div
                            key={routeIdx}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="font-body font-medium text-card-foreground mb-1">
                                {route.name}
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="font-display text-xl font-bold text-primary">
                                  Rp {route.price}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleBookNow(pkg.name, route.name, route.price)
                              }
                              className="sm:ml-4 w-full sm:w-auto"
                            >
                              {t.packages.bookNow}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
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
