import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, Users, Utensils, Camera, Anchor, Waves, CheckCircle2 } from "lucide-react";
import divingBunaken from "@/assets/diving-bunaken.jpg";
import sunsetBunaken from "@/assets/sunset-bunaken.jpg";
import heroBunaken from "@/assets/hero-bunaken.jpg";

interface Package {
  id: number;
  name: string;
  price: string;
  duration: string;
  capacity: string;
  image: string;
  features: string[];
  popular?: boolean;
}

const packages: Package[] = [
  {
    id: 1,
    name: "Kapal Kecil",
    price: "Rp 170.000",
    duration: "4-5 Jam",
    capacity: "Max 6 Orang",
    image: heroBunaken,
    features: [
      "Penjemputan dari hotel",
      "Kapal tradisional nyaman",
      "Snorkeling equipment",
      "Air mineral",
    ],
  },
  {
    id: 2,
    name: "Kapal Besar",
    price: "Rp 120.000",
    duration: "Full Day",
    capacity: "Max 15 Orang",
    image: divingBunaken,
    features: [
      "Penjemputan dari hotel",
      "Speedboat modern",
      "Full diving equipment",
      "Instruktur profesional",
      "Makan siang",
      "Dokumentasi foto",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Kapal Sedang",
    price: "Rp 190.000",
    duration: "5-6 Jam",
    capacity: "Max 8 Orang",
    image: sunsetBunaken,
    features: [
      "Penjemputan dari hotel",
      "Kapal eksklusif",
      "Snorkeling equipment",
      "BBQ seafood dinner",
      "View sunset terbaik",
    ],
  },
];

const WHATSAPP_NUMBER = "6282196659515";

const PackagesSection = () => {
  const handleBookNow = (packageName: string) => {
    const message = encodeURIComponent(
      `Halo! Saya tertarik dengan ${packageName} untuk wisata ke Pulau Bunaken. Boleh minta info lebih lanjut?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <section id="packages" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Waves className="w-4 h-4 text-primary" />
            <span className="text-primary font-body text-sm font-medium">Paket Wisata</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Pilih Paket <span className="text-primary">Terbaik</span> Anda
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Berbagai pilihan paket wisata yang dapat disesuaikan dengan kebutuhan dan budget Anda
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  Populer
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
                <h3 className="font-display text-2xl font-bold text-card-foreground">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-primary">{pkg.price}</span>
                  <span className="text-muted-foreground text-sm">/orang</span>
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
                    <li key={idx} className="flex items-center gap-2 text-sm text-card-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
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
                  Pesan Sekarang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
