import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations } from "@/lib/translations";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Route {
  name: string;
  price: string;
  name_id?: string;
  name_en?: string;
}

export interface PackageData {
  ID?: number;
  id?: number;
  // Legacy fields (for backward compatibility)
  name: string;
  description?: string;
  // Multi-language fields
  name_id?: string;
  name_en?: string;
  description_id?: string;
  description_en?: string;
  duration: string;
  capacity: string;
  features: string[];
  features_id?: string[];
  features_en?: string[];
  include?: string[];
  includes_id?: string[];
  includes_en?: string[];
  exclude: string[];
  excludes_id?: string[];
  excludes_en?: string[];
  routes: Route[];
  routes_id?: Route[];
  routes_en?: Route[];
  popular?: boolean;
  is_popular?: boolean;
  image_url?: string;
}

export interface AddOnData {
  ID?: number;
  id?: number;
  // Legacy fields
  name: string;
  price: string;
  description?: string;
  // Multi-language fields
  name_id?: string;
  name_en?: string;
  description_id?: string;
  description_en?: string;
}

interface PackageContextType {
  packages: PackageData[];
  addOns: AddOnData[];
  updatePackage: (id: number, data: Partial<PackageData>) => Promise<void>;
  addPackage: (data: Omit<PackageData, "id" | "ID">) => Promise<void>;
  deletePackage: (id: number) => Promise<void>;
  updateAddOn: (id: number, data: Partial<AddOnData>) => Promise<void>;
  addAddOn: (data: Omit<AddOnData, "id" | "ID">) => Promise<void>;
  removeAddOn: (id: number) => Promise<void>;
  resetPackages: () => void;
  resetAddOns: () => void;
  savePackages: () => void;
  saveAddOns: () => void;
  refreshPackages: () => void;
  refreshAddOns: () => void;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const PackageProvider = ({ children }: { children: ReactNode }) => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [addOns, setAddOns] = useState<AddOnData[]>([]);
  const { language } = useLanguage();

  const fetchPackages = async () => {
    try {
      // Fetch all packages without language filter for admin dashboard
      // For main page, we'll use language parameter
      const langParam = language === "en" ? "en" : "id";
      const response = await api.get(`/packages?lang=${langParam}`);
      if (response.data && Array.isArray(response.data)) {
        const mappedPackages = response.data.map((pkg: any) => {
          // Transform routes from API format to frontend format
          // API returns routes as array of {name: string, price: string}
          const transformRoutes = (routes: any[]): Route[] => {
            if (!routes || !Array.isArray(routes)) return [];
            return routes.map((r: any) => {
              // Handle both API format (map[string]string) and RouteDetail format
              if (typeof r === "object" && r !== null) {
                // Ensure price is always a string, even if it's a number
                const priceValue =
                  r.price !== undefined && r.price !== null
                    ? String(r.price)
                    : "";
                return {
                  name: r.name || r.name_id || r.name_en || "",
                  price: priceValue,
                  name_id: r.name_id || r.name || "",
                  name_en: r.name_en || r.name || "",
                };
              }
              return { name: "", price: "", name_id: "", name_en: "" };
            });
          };

          // Transform routes_id and routes_en first
          const routesIdTransformed = transformRoutes(pkg.routes_id || []);
          const routesEnTransformed = transformRoutes(pkg.routes_en || []);
          const routesTransformed = transformRoutes(pkg.routes || []);

          // Use routes_id if routes is empty (for admin dashboard)
          // This ensures we always have routes data to display
          const finalRoutes =
            routesTransformed.length > 0
              ? routesTransformed
              : routesIdTransformed;

          return {
            ...pkg,
            id: pkg.ID || pkg.id || 0,
            ID: pkg.ID || pkg.id || 0,
            exclude: Array.isArray(pkg.excludes) ? pkg.excludes : [],
            popular: pkg.is_popular || false,
            features: Array.isArray(pkg.features) ? pkg.features : [],
            features_id: Array.isArray(pkg.features_id)
              ? pkg.features_id
              : Array.isArray(pkg.features)
              ? pkg.features
              : [],
            features_en: Array.isArray(pkg.features_en) ? pkg.features_en : [],
            include: Array.isArray(pkg.includes)
              ? pkg.includes
              : Array.isArray(pkg.includes_id)
              ? pkg.includes_id
              : [],
            includes_id: Array.isArray(pkg.includes_id)
              ? pkg.includes_id
              : Array.isArray(pkg.includes)
              ? pkg.includes
              : [],
            includes_en: Array.isArray(pkg.includes_en) ? pkg.includes_en : [],
            routes: finalRoutes,
            routes_id: routesIdTransformed,
            routes_en: routesEnTransformed,
            image_url: pkg.image_url || "",
            name: pkg.name || "",
            name_id: pkg.name_id || pkg.name || "",
            name_en: pkg.name_en || "",
            description: pkg.description || "",
            description_id: pkg.description_id || pkg.description || "",
            description_en: pkg.description_en || "",
            capacity: pkg.capacity || "",
            duration: pkg.duration || "",
          };
        });
        setPackages(mappedPackages);
      } else {
        // Only reset if we got a response but it's not an array
        // This means the API returned something unexpected
        console.warn("Packages response is not an array:", response.data);
        // Don't reset to empty array - keep existing data
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
      // Keep existing packages on error to prevent flickering
      // Don't reset to empty array on error
    }
  };

  const fetchAddOns = async () => {
    try {
      const response = await api.get("/addons");
      if (response.data && Array.isArray(response.data)) {
        const mappedAddOns = response.data.map((addOn: any) => ({
          ...addOn,
          id: addOn.ID || addOn.id || 0,
        }));
        setAddOns(mappedAddOns);
      } else {
        // Only reset if we got a response but it's not an array
        // This means the API returned something unexpected
        console.warn("Add-ons response is not an array:", response.data);
        // Don't reset to empty array - keep existing data
      }
    } catch (error) {
      console.error("Failed to fetch add-ons", error);
      // Keep existing add-ons on error to prevent flickering
      // Don't reset to empty array on error
    }
  };

  useEffect(() => {
    // Fetch both in parallel to avoid race conditions
    Promise.all([fetchPackages(), fetchAddOns()]).catch((error) => {
      console.error("Error fetching data:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Refetch when language changes

  const updatePackage = async (id: number, data: Partial<PackageData>) => {
    try {
      const payload: any = {};

      // Map multi-language fields - always include if defined
      if (data.name_id !== undefined) payload.name_id = data.name_id;
      if (data.name_en !== undefined) payload.name_en = data.name_en;
      if (data.description_id !== undefined)
        payload.description_id = data.description_id;
      if (data.description_en !== undefined)
        payload.description_en = data.description_en;

      // Map arrays - always include if defined
      if (data.routes_id !== undefined) {
        payload.routes_id = data.routes_id.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      }
      if (data.routes_en !== undefined) {
        payload.routes_en = data.routes_en.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      }
      if (data.features_id !== undefined)
        payload.features_id = data.features_id;
      if (data.features_en !== undefined)
        payload.features_en = data.features_en;
      if (data.includes_id !== undefined)
        payload.includes_id = data.includes_id;
      if (data.includes_en !== undefined)
        payload.includes_en = data.includes_en;
      if (data.excludes_id !== undefined)
        payload.excludes_id = data.excludes_id;
      if (data.excludes_en !== undefined)
        payload.excludes_en = data.excludes_en;

      // Legacy fields for backward compatibility
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined)
        payload.description = data.description;
      if (data.routes !== undefined) {
        payload.routes = data.routes.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      }
      if (data.features !== undefined) payload.features = data.features;
      if (data.exclude !== undefined) payload.excludes = data.exclude;
      if (data.popular !== undefined) payload.is_popular = data.popular;

      // Common fields
      if (data.capacity !== undefined) payload.capacity = data.capacity;
      if (data.duration !== undefined) payload.duration = data.duration;
      // Always include image_url if it exists and is not empty
      // Backend will preserve existing image_url if not provided or if empty string
      // Only send image_url if it has a value to prevent accidentally clearing it
      if (data.image_url !== undefined && data.image_url !== "") {
        payload.image_url = data.image_url;
      }
      // If image_url is undefined or empty, don't include it in payload
      // Backend will preserve the existing value

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
      const payload: any = {};

      // Map multi-language fields
      payload.name_id = data.name_id || data.name || "";
      payload.name_en = data.name_en || "";
      payload.description_id = data.description_id || data.description || "";
      payload.description_en = data.description_en || "";

      // Map arrays with proper format
      if (data.routes_id && data.routes_id.length > 0) {
        payload.routes_id = data.routes_id.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      } else if (data.routes && data.routes.length > 0) {
        payload.routes_id = data.routes.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      } else {
        payload.routes_id = [];
      }

      if (data.routes_en && data.routes_en.length > 0) {
        payload.routes_en = data.routes_en.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      } else {
        payload.routes_en = [];
      }

      payload.features_id = data.features_id || data.features || [];
      payload.features_en = data.features_en || [];
      payload.includes_id = data.includes_id || data.include || [];
      payload.includes_en = data.includes_en || [];
      payload.excludes_id = data.excludes_id || data.exclude || [];
      payload.excludes_en = data.excludes_en || [];

      // Legacy fields for backward compatibility
      payload.name = data.name || data.name_id || "";
      payload.description = data.description || data.description_id || "";
      if (data.routes && data.routes.length > 0) {
        payload.routes = data.routes.map((r: Route) => ({
          name_id: r.name_id || r.name || "",
          name_en: r.name_en || r.name || "",
          price: r.price || "",
        }));
      } else {
        payload.routes = payload.routes_id || [];
      }
      payload.features = data.features || data.features_id || [];
      payload.excludes = data.exclude || data.excludes_id || [];
      payload.is_popular = data.popular || false;

      // Common fields
      payload.capacity = data.capacity || "";
      payload.duration = data.duration || "";
      payload.image_url = data.image_url || "";

      await api.post("/admin/packages", payload);
      toast.success("Paket berhasil ditambahkan");
      await fetchPackages();
    } catch (error) {
      console.error("Add package failed", error);
      toast.error("Gagal menambahkan paket");
      throw error;
    }
  };

  const deletePackage = async (id: number) => {
    try {
      await api.delete(`/admin/packages/${id}`);
      toast.success("Paket berhasil dihapus");
      await fetchPackages();
    } catch (error) {
      console.error("Delete package failed", error);
      toast.error("Gagal menghapus paket");
      throw error;
    }
  };

  const updateAddOn = async (id: number, data: Partial<AddOnData>) => {
    try {
      const payload: any = { ...data };
      delete payload.id;
      delete payload.ID;

      await api.put(`/admin/addons/${id}`, payload);
      toast.success("Add-on berhasil diupdate");
      await fetchAddOns();
    } catch (error) {
      console.error("Update add-on failed", error);
      toast.error("Gagal update add-on");
      throw error;
    }
  };

  const addAddOn = async (data: Omit<AddOnData, "id" | "ID">) => {
    try {
      await api.post("/admin/addons", data);
      toast.success("Add-on berhasil ditambahkan");
      await fetchAddOns();
    } catch (error) {
      console.error("Add add-on failed", error);
      toast.error("Gagal menambahkan add-on");
      throw error;
    }
  };

  const removeAddOn = async (id: number) => {
    try {
      await api.delete(`/admin/addons/${id}`);
      toast.success("Add-on berhasil dihapus");
      await fetchAddOns();
    } catch (error) {
      console.error("Delete add-on failed", error);
      toast.error("Gagal menghapus add-on");
      throw error;
    }
  };

  const resetPackages = () => {
    fetchPackages();
  };

  const resetAddOns = () => {
    fetchAddOns();
  };

  const savePackages = () => {
    // No-op
  };

  const saveAddOns = () => {
    // No-op - data is saved via API
  };

  return (
    <PackageContext.Provider
      value={{
        packages,
        addOns,
        updatePackage,
        addPackage,
        deletePackage,
        updateAddOn,
        addAddOn,
        removeAddOn,
        resetPackages,
        resetAddOns,
        savePackages,
        saveAddOns,
        refreshPackages: fetchPackages,
        refreshAddOns: fetchAddOns,
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
