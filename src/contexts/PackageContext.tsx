import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/lib/translations";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface Route {
  name: string;
  price: string;
}

export interface PackageData {
  ID?: number;
  id?: number;
  name: string;
  description?: string;
  duration: string;
  capacity: string;
  features: string[];
  exclude: string[];
  routes: Route[];
  popular?: boolean;
  is_popular?: boolean;
  image_url?: string;
}

export interface AddOnData {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface PackageContextType {
  packages: PackageData[];
  addOns: AddOnData[];
  updatePackage: (id: number, data: Partial<PackageData>) => Promise<void>;
  addPackage: (data: Omit<PackageData, "id" | "ID">) => Promise<void>;
  updateAddOn: (id: number, data: Partial<AddOnData>) => void;
  addAddOn: (data: Omit<AddOnData, "id">) => void;
  removeAddOn: (id: number) => void;
  resetPackages: () => void;
  resetAddOns: () => void;
  savePackages: () => void;
  saveAddOns: () => void;
  refreshPackages: () => void;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

const initializeAddOns = (): AddOnData[] => {
  const t = translations.id;
  return [
    {
      id: 1,
      name: t.addOns.snorkeling.name,
      price: "Rp 150.000",
      description: t.addOns.snorkeling.description,
    },
    {
      id: 2,
      name: t.addOns.lunch.name,
      price: "Rp 50.000",
      description: t.addOns.lunch.description,
    },
  ];
};

export const PackageProvider = ({ children }: { children: ReactNode }) => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [addOns, setAddOns] = useState<AddOnData[]>(() => {
    const saved = localStorage.getItem("addons_data");
    return saved ? JSON.parse(saved) : initializeAddOns();
  });

  const fetchPackages = async () => {
    try {
        const response = await api.get("/packages");
        if (response.data && Array.isArray(response.data)) {
            const mappedPackages = response.data.map((pkg: any) => ({
                ...pkg,
                id: pkg.ID || pkg.id || 0,
                exclude: pkg.excludes || [], 
                popular: pkg.is_popular,
                features: pkg.features || [],
                routes: pkg.routes || []
            }));
            setPackages(mappedPackages);
        } else {
             setPackages([]);
        }
    } catch (error) {
        console.error("Failed to fetch packages", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    localStorage.setItem("addons_data", JSON.stringify(addOns));
  }, [addOns]);

  const updatePackage = async (id: number, data: Partial<PackageData>) => {
    try {
        const payload: any = { ...data };
        
        if (data.exclude) payload.excludes = data.exclude;
        if (data.popular !== undefined) payload.is_popular = data.popular;
        
        delete payload.id; 
        delete payload.ID;

        await api.put(`/admin/packages/${id}`, payload);
        toast.success("Paket berhasil diupdate");
        await fetchPackages(); 
    } catch (error) {
        console.error("Update failed", error);
        toast.error("Gagal update paket");
        throw error;
    }
  };

  const addPackage = async (data: Omit<PackageData, "id" | "ID">) => {
    try {
        const payload: any = { ...data };
        
        if (data.exclude) payload.excludes = data.exclude;
        if (data.popular !== undefined) payload.is_popular = data.popular;
        
        // Ensure required fields have defaults
        if (!payload.features) payload.features = [];
        if (!payload.routes) payload.routes = [];
        if (!payload.excludes) payload.excludes = [];

        await api.post("/admin/packages", payload);
        toast.success("Paket berhasil ditambahkan");
        await fetchPackages();
    } catch (error) {
        console.error("Add package failed", error);
        toast.error("Gagal menambahkan paket");
        throw error;
    }
  };

  const updateAddOn = (id: number, data: Partial<AddOnData>) => {
    setAddOns((prev) =>
      prev.map((addOn) => (addOn.id === id ? { ...addOn, ...data } : addOn))
    );
  };

  const addAddOn = (data: Omit<AddOnData, "id">) => {
    const newId = Math.max(...addOns.map((a) => a.id), 0) + 1;
    setAddOns((prev) => [...prev, { ...data, id: newId }]);
  };

  const removeAddOn = (id: number) => {
    setAddOns((prev) => prev.filter((addOn) => addOn.id !== id));
  };

  const resetPackages = () => {
     fetchPackages(); 
  };

  const resetAddOns = () => {
    setAddOns(initializeAddOns());
    localStorage.removeItem("addons_data");
  };

  const savePackages = () => {
    // No-op
  };

  const saveAddOns = () => {
    localStorage.setItem("addons_data", JSON.stringify(addOns));
  };

  return (
    <PackageContext.Provider
      value={{
        packages,
        addOns,
        updatePackage,
        addPackage,
        updateAddOn,
        addAddOn,
        removeAddOn,
        resetPackages,
        resetAddOns,
        savePackages,
        saveAddOns,
        refreshPackages: fetchPackages
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error("usePackages must be used within a PackageProvider");
  }
  return context;
};
