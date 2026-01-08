export type Language = "id" | "en";

export const translations = {
  id: {
    // Navbar
    nav: {
      home: "Beranda",
      packages: "Paket Wisata",
      locations: "Lokasi",
      about: "Tentang Kami",
      contact: "Kontak",
      bookNow: "Pesan Sekarang",
    },
    // Hero Section
    hero: {
      title: "Jelajahi Keindahan",
      titleHighlight: "Pulau Bunaken",
      description:
        "Nikmati perjalanan tak terlupakan ke surga bawah laut Indonesia. Sewa kapal dari Manado dengan layanan profesional dan harga terjangkau.",
      viewPackages: "Lihat Paket Wisata",
      aboutUs: "Tentang Kami",
      scrollDown: "Scroll ke bawah",
    },
    // Packages Section
    packages: {
      badge: "Paket Wisata",
      title: "Pilih Paket",
      titleHighlight: "Terbaik",
      titleSuffix: "Anda",
      description:
        "Berbagai pilihan paket wisata yang dapat disesuaikan dengan kebutuhan dan budget Anda",
      popular: "Populer",
      perPerson: "/orang",
      startingFrom: "Dimulai dari",
      bookNow: "Pesan Sekarang",
      detailPackage: "Detail Paket",
      duration: "Durasi",
      capacity: "Kapasitas",
      selectRoute: "Pilih Rute",
      route: "Rute",
      addOns: {
        badge: "Tambahan",
        title: "Layanan Tambahan",
        description:
          "Tingkatkan pengalaman wisata Anda dengan layanan tambahan yang tersedia",
        inquire: "Tanya Info",
      },
      whatsapp: {
        package:
          "Halo! Saya tertarik dengan {packageName} untuk wisata ke Pulau Bunaken. Boleh minta info lebih lanjut?",
        route:
          "Halo! Saya tertarik dengan {packageName} rute {routeName} dengan harga {price}. Boleh minta info lebih lanjut?",
        addOn:
          "Halo! Saya ingin menanyakan tentang add-on {addOnName} untuk paket wisata. Boleh minta info lebih lanjut?",
      },
    },
    // Add-ons
    addOns: {
      snorkeling: {
        name: "Snorkling Equipment",
        description: "Set Snorkling Equipment (Fins & Mask)",
      },
      lunch: {
        name: "Makan Siang",
        description: "Makan Siang di Pulau Bunaken",
      },
    },
    // About Section
    about: {
      badge: "Tentang Kami",
      title: "Pengalaman",
      titleHighlight: "Terpercaya",
      titleSuffix: "Sejak 1992",
      description:
        "Bunaken Boat Charter adalah pioneer penyedia layanan sewa kapal terpercaya di Manado sejak 1992. Kami berkomitmen memberikan pengalaman wisata bahari terbaik dengan harga yang terjangkau. Dengan armada kapal yang terawat dan kru yang berpengalaman, perjalanan Anda ke taman nasional laut bunaken akan menjadi momen yang tak terlupakan.",
      stats: {
        trips: "Trip Sukses",
        customers: "Pelanggan Puas",
        years: "Tahun Pengalaman",
      },
      features: {
        safety: {
          title: "Keamanan Terjamin",
          description:
            "Kapal dilengkapi alat keselamatan standar internasional dan awak kapal berpengalaman.",
        },
        experience: {
          title: "Berpengalaman",
          description:
            "Lebih dari 8 tahun melayani wisatawan lokal dan mancanegara ke Bunaken.",
        },
        service: {
          title: "Pelayanan Terbaik",
          description:
            "Tim kami siap membantu menciptakan pengalaman wisata yang tak terlupakan.",
        },
        schedule: {
          title: "Jadwal Fleksibel",
          description:
            "Waktu keberangkatan dapat disesuaikan dengan keinginan Anda.",
        },
      },
    },
    // Locations Section
    locations: {
      title: "Lokasi",
      viewOnMaps: "Lihat di Google Maps",
    },
    // Footer
    footer: {
      description:
        "Penyedia layanan sewa kapal terpercaya untuk perjalanan wisata ke Pulau Bunaken. Nikmati keindahan bawah laut Indonesia bersama kami.",
      menu: "Menu",
      contact: "Hubungi Kami",
      address: "Jl. Boulevard, Manado\nSulawesi Utara, Indonesia",
      copyright: "© 2025 Bunaken Charter. All rights reserved.",
    },
    // WhatsApp Button
    whatsapp: {
      button: "Hubungi Kami",
      message: "Halo! Saya ingin bertanya tentang sewa kapal ke Pulau Bunaken.",
      ariaLabel: "Hubungi via WhatsApp",
    },
    // 404
    notFound: {
      title: "404",
      message: "Oops! Halaman tidak ditemukan",
      backHome: "Kembali ke Beranda",
    },
  },
  en: {
    // Navbar
    nav: {
      home: "Home",
      packages: "Tour Packages",
      locations: "Locations",
      about: "About Us",
      contact: "Contact",
      bookNow: "Book Now",
    },
    // Hero Section
    hero: {
      title: "Explore the Beauty of",
      titleHighlight: "Bunaken Island",
      description:
        "Enjoy an unforgettable journey to Indonesia's underwater paradise. Rent a boat from Manado with professional service and affordable prices.",
      viewPackages: "View Tour Packages",
      aboutUs: "About Us",
      scrollDown: "Scroll down",
    },
    // Packages Section
    packages: {
      badge: "Tour Packages",
      title: "Choose Your",
      titleHighlight: "Best",
      titleSuffix: "Package",
      description:
        "Various tour package options that can be tailored to your needs and budget",
      popular: "Popular",
      perPerson: "/person",
      startingFrom: "Starting from",
      bookNow: "Book Now",
      detailPackage: "Package Details",
      duration: "Duration",
      capacity: "Capacity",
      selectRoute: "Select Route",
      route: "Route",
      addOns: {
        badge: "Add-ons",
        title: "Additional Services",
        description:
          "Enhance your travel experience with available additional services",
        inquire: "Inquire",
      },
      whatsapp: {
        package:
          "Hello! I'm interested in {packageName} for a trip to Bunaken Island. Can I get more information?",
        route:
          "Hello! I'm interested in {packageName} route {routeName} with price {price}. Can I get more information?",
        addOn:
          "Hello! I would like to inquire about the {addOnName} add-on for the tour package. Can I get more information?",
      },
    },
    // Packages data
    packageData: {
      speed: {
        name: "Speed Boat",
        duration: "Full day",
        capacity: "1-5 People",
        features: ["Faster Journey", "Suitable for small groups"],
        exclude: ["Lunch", "Snorkeling Equipment"],
        routes: [
          { name: "Bunaken", price: "1.200.000" },
          { name: "Bunaken - Siladen", price: "Contact for price" },
        ],
      },
      katamaran: {
        name: "Catamaran Boat",
        duration: "Full Day",
        capacity: "10-15 People",
        features: ["More Exclusive Boat", "Larger Capacity"],
        exclude: ["Lunch", "Snorkeling Equipment"],
        routes: [
          { name: "Bunaken", price: "1.500.000" },
          { name: "Bunaken - Siladen", price: "2.000.000" },
          { name: "Bunaken - Siladen - Nain", price: "2.500.000" },
        ],
      },
      longboat: {
        name: "Long Boat",
        duration: "Full Day",
        capacity: "15-20 People",
        features: ["Largest Capacity", "Comfortable for Large Groups"],
        exclude: ["Lunch", "Snorkeling Equipment"],
        routes: [
          { name: "Bunaken", price: "1.500.000" },
          { name: "Bunaken - Siladen", price: "2.000.000" },
          { name: "Bunaken - Siladen - Nain", price: "Contact for price" },
        ],
      },
    },
    // Add-ons
    addOns: {
      snorkeling: {
        name: "Snorkeling Equipment",
        description: "Snorkeling Equipment Set (Fins & Mask)",
      },
      lunch: {
        name: "Lunch",
        description: "Lunch at Bunaken Island",
      },
    },
    // About Section
    about: {
      badge: "About Us",
      title: "Trusted",
      titleHighlight: "Experience",
      titleSuffix: "Since 2015",
      description:
        "Bunaken Boat Charter is a trusted boat rental service provider in Manado. We are committed to providing the best marine tourism experience at affordable prices. With a well-maintained fleet and experienced crew, your journey to Bunaken Island will be an unforgettable moment.",
      stats: {
        trips: "Successful Trips",
        customers: "Satisfied Customers",
        years: "Years of Experience",
      },
      features: {
        safety: {
          title: "Guaranteed Safety",
          description:
            "Boats are equipped with international standard safety equipment and experienced crew.",
        },
        experience: {
          title: "Experienced",
          description:
            "More than 8 years serving local and international tourists to Bunaken.",
        },
        service: {
          title: "Best Service",
          description:
            "Our team is ready to help create an unforgettable travel experience.",
        },
        schedule: {
          title: "Flexible Schedule",
          description: "Departure time can be adjusted to your preference.",
        },
      },
    },
    // Locations Section
    locations: {
      title: "Locations",
      viewOnMaps: "View on Google Maps",
    },
    // Footer
    footer: {
      description:
        "Trusted boat rental service provider for trips to Bunaken Island. Enjoy Indonesia's underwater beauty with us.",
      menu: "Menu",
      contact: "Contact Us",
      address: "Jl. Boulevard, Manado\nNorth Sulawesi, Indonesia",
      copyright: "© 2025 Bunaken Charter. All rights reserved.",
    },
    // WhatsApp Button
    whatsapp: {
      button: "Contact Us",
      message:
        "Hello! I would like to ask about boat rental to Bunaken Island.",
      ariaLabel: "Contact via WhatsApp",
    },
    // 404
    notFound: {
      title: "404",
      message: "Oops! Page not found",
      backHome: "Return to Home",
    },
  },
};

export type TranslationKey = keyof typeof translations.id;
