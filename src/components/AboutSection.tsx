import { Shield, Award, Heart, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description: "Kapal dilengkapi alat keselamatan standar internasional dan awak kapal berpengalaman.",
  },
  {
    icon: Award,
    title: "Berpengalaman",
    description: "Lebih dari 8 tahun melayani wisatawan lokal dan mancanegara ke Bunaken.",
  },
  {
    icon: Heart,
    title: "Pelayanan Terbaik",
    description: "Tim kami siap membantu menciptakan pengalaman wisata yang tak terlupakan.",
  },
  {
    icon: Clock,
    title: "Jadwal Fleksibel",
    description: "Waktu keberangkatan dapat disesuaikan dengan keinginan Anda.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <span className="text-primary font-body text-sm font-medium">Tentang Kami</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pengalaman <span className="text-primary">Terpercaya</span> Sejak 2015
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Bunaken Boat Charter adalah penyedia layanan sewa kapal terpercaya di Manado. 
              Kami berkomitmen memberikan pengalaman wisata bahari terbaik dengan harga yang terjangkau. 
              Dengan armada kapal yang terawat dan kru yang berpengalaman, perjalanan Anda ke Pulau Bunaken 
              akan menjadi momen yang tak terlupakan.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="font-display text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Trip Sukses</div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="font-display text-3xl font-bold text-primary">2000+</div>
                <div className="text-sm text-muted-foreground">Pelanggan Puas</div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-soft">
                <div className="font-display text-3xl font-bold text-primary">8+</div>
                <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
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
