import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin } from "@/contexts/AdminContext";
import {
  usePackages,
  PackageData,
  AddOnData,
  Route,
} from "@/contexts/PackageContext";
import {
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  Languages,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const { logout, changePassword } = useAdmin();
  const {
    packages,
    addOns,
    updatePackage,
    addPackage,
    deletePackage,
    updateAddOn,
    addAddOn,
    removeAddOn,
    savePackages,
    saveAddOns,
  } = usePackages();
  const navigate = useNavigate();
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(
    null
  );
  const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(
    null
  );
  const [editingAddOn, setEditingAddOn] = useState<AddOnData | null>(null);
  const [showAddAddOn, setShowAddAddOn] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [deletePackageDialog, setDeletePackageDialog] = useState<{
    open: boolean;
    package: PackageData | null;
  }>({ open: false, package: null });
  const [deleteAddOnDialog, setDeleteAddOnDialog] = useState<{
    open: boolean;
    addOnId: number | null;
  }>({ open: false, addOnId: null });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<"id" | "en">("id");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleEdit = (pkg: PackageData) => {
    // Fetch full package data with all languages
    // Ensure routes are properly mapped with price values
    const transformRoutesForEdit = (routes: any[]): Route[] => {
      if (!routes || !Array.isArray(routes)) return [];
      return routes.map((r: any) => ({
        name: r.name || r.name_id || r.name_en || "",
        price: r.price !== undefined && r.price !== null ? String(r.price) : "",
        name_id: r.name_id || r.name || "",
        name_en: r.name_en || r.name || "",
      }));
    };

    const fullPackage: PackageData = {
      ...pkg,
      name_id: pkg.name_id || pkg.name || "",
      name_en: pkg.name_en || "",
      description_id: pkg.description_id || pkg.description || "",
      description_en: pkg.description_en || "",
      routes_id: transformRoutesForEdit(pkg.routes_id || pkg.routes || []),
      routes_en: transformRoutesForEdit(pkg.routes_en || []),
      routes: transformRoutesForEdit(pkg.routes || pkg.routes_id || []),
      features_id: pkg.features_id || pkg.features || [],
      features_en: pkg.features_en || [],
      includes_id: pkg.includes_id || pkg.include || [],
      includes_en: pkg.includes_en || [],
      excludes_id: pkg.excludes_id || pkg.exclude || [],
      excludes_en: pkg.excludes_en || [],
    };
    setEditingPackage(fullPackage);
    setEditingRouteIndex(null);
    setActiveLangTab("id"); // Reset to ID tab
    // Set image preview if image_url exists
    if (pkg.image_url) {
      const fullImageUrl = pkg.image_url.startsWith("http")
        ? pkg.image_url
        : `https://bunakencharter.up.railway.app${pkg.image_url}`;
      setImagePreview(fullImageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async () => {
    if (editingPackage) {
      try {
        // Prepare package data with all multi-language fields
        const packageData: Partial<PackageData> = {
          name_id: editingPackage.name_id || editingPackage.name || "",
          name_en: editingPackage.name_en || "",
          description_id:
            editingPackage.description_id || editingPackage.description || "",
          description_en: editingPackage.description_en || "",
          routes_id: editingPackage.routes_id || editingPackage.routes || [],
          routes_en: editingPackage.routes_en || [],
          features_id:
            editingPackage.features_id || editingPackage.features || [],
          features_en: editingPackage.features_en || [],
          includes_id:
            editingPackage.includes_id || editingPackage.include || [],
          includes_en: editingPackage.includes_en || [],
          excludes_id:
            editingPackage.excludes_id || editingPackage.exclude || [],
          excludes_en: editingPackage.excludes_en || [],
          name: editingPackage.name_id || editingPackage.name || "",
          description:
            editingPackage.description_id || editingPackage.description || "",
          routes: editingPackage.routes_id || editingPackage.routes || [],
          features: editingPackage.features_id || editingPackage.features || [],
          exclude: editingPackage.excludes_id || editingPackage.exclude || [],
          capacity: editingPackage.capacity || "",
          duration: editingPackage.duration || "",
          popular: editingPackage.popular || false,
          // Always include image_url - preserve existing value if available
          // Only send if it exists to prevent clearing it in backend
          image_url: editingPackage.image_url || "",
        };

        // Check if this is a new package (no id) or existing package
        if (!editingPackage.id && !editingPackage.ID) {
          // New package
          await addPackage(packageData as Omit<PackageData, "id" | "ID">);
          setEditingPackage(null);
          setShowAddPackage(false);
          setImagePreview(null);
          // Toast notification sudah dikirim dari PackageContext
        } else {
          // Update existing package
          const packageId = editingPackage.id || editingPackage.ID || 0;
          await updatePackage(packageId, packageData);
          setEditingPackage(null);
          setImagePreview(null);
          // Toast notification sudah dikirim dari PackageContext
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menyimpan package",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setEditingPackage(null);
    setEditingRouteIndex(null);
    setShowAddPackage(false);
    setImagePreview(null);
  };

  const handleNewPackage = () => {
    setEditingPackage({
      id: 0,
      name: "",
      name_id: "",
      name_en: "",
      description: "",
      description_id: "",
      description_en: "",
      duration: "",
      capacity: "",
      features: [],
      features_id: [],
      features_en: [],
      include: [],
      includes_id: [],
      includes_en: [],
      exclude: [],
      excludes_id: [],
      excludes_en: [],
      routes: [],
      routes_id: [],
      routes_en: [],
      popular: false,
      image_url: "",
    });
    setShowAddPackage(true);
    setImagePreview(null);
    setActiveLangTab("id");
  };

  const handleDeletePackage = (pkg: PackageData) => {
    // Ensure we have a complete copy of the package with all properties
    // Use the package name if available, otherwise use a default
    const packageName = pkg.name?.trim() || "Package";
    const packageCopy: PackageData = {
      ...pkg,
      name: packageName,
      id: pkg.id || pkg.ID,
      ID: pkg.ID || pkg.id,
    };
    setDeletePackageDialog({ open: true, package: packageCopy });
  };

  const confirmDeletePackage = async () => {
    if (!deletePackageDialog.package) return;
    const packageId =
      deletePackageDialog.package.id || deletePackageDialog.package.ID;
    if (!packageId) return;

    try {
      await deletePackage(packageId);
      setDeletePackageDialog({ open: false, package: null });
      // Toast notification sudah dikirim dari PackageContext
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus package",
        variant: "destructive",
      });
      setDeletePackageDialog({ open: false, package: null });
    }
  };

  const handleAddRoute = (packageId: number) => {
    if (editingPackage && editingPackage.id === packageId) {
      setEditingPackage({
        ...editingPackage,
        routes: [...editingPackage.routes, { name: "", price: "" }],
      });
      setEditingRouteIndex(editingPackage.routes.length);
    }
  };

  const handleRemoveRoute = (packageId: number, routeIndex: number) => {
    if (editingPackage && editingPackage.id === packageId) {
      setEditingPackage({
        ...editingPackage,
        routes: editingPackage.routes.filter((_, idx) => idx !== routeIndex),
      });
      if (editingRouteIndex === routeIndex) {
        setEditingRouteIndex(null);
      }
    }
  };

  const handleUpdateRoute = (
    packageId: number,
    routeIndex: number,
    field: "name" | "price",
    value: string
  ) => {
    if (editingPackage && editingPackage.id === packageId) {
      const updatedRoutes = [...editingPackage.routes];
      updatedRoutes[routeIndex] = {
        ...updatedRoutes[routeIndex],
        [field]: value,
      };
      setEditingPackage({
        ...editingPackage,
        routes: updatedRoutes,
      });
    }
  };

  const handleUpdateFeature = (
    packageId: number,
    featureIndex: number,
    value: string
  ) => {
    if (editingPackage && editingPackage.id === packageId) {
      const updatedFeatures = [...editingPackage.features];
      updatedFeatures[featureIndex] = value;
      setEditingPackage({
        ...editingPackage,
        features: updatedFeatures,
      });
    }
  };

  const handleAddFeature = (packageId: number) => {
    if (editingPackage && editingPackage.id === packageId) {
      setEditingPackage({
        ...editingPackage,
        features: [...editingPackage.features, ""],
      });
    }
  };

  const handleRemoveFeature = (packageId: number, featureIndex: number) => {
    if (editingPackage && editingPackage.id === packageId) {
      setEditingPackage({
        ...editingPackage,
        features: editingPackage.features.filter(
          (_, idx) => idx !== featureIndex
        ),
      });
    }
  };

  const handleUpdateExclude = (
    packageId: number,
    excludeIndex: number,
    value: string
  ) => {
    if (editingPackage && editingPackage.id === packageId) {
      const updatedExclude = [...editingPackage.exclude];
      updatedExclude[excludeIndex] = value;
      setEditingPackage({
        ...editingPackage,
        exclude: updatedExclude,
      });
    }
  };

  const handleAddExclude = (packageId: number) => {
    if (editingPackage && editingPackage.id === packageId) {
      setEditingPackage({
        ...editingPackage,
        exclude: [...editingPackage.exclude, ""],
      });
    }
  };

  const handleRemoveExclude = (packageId: number, excludeIndex: number) => {
    if (editingPackage && editingPackage.id === packageId) {
      setEditingPackage({
        ...editingPackage,
        exclude: editingPackage.exclude.filter(
          (_, idx) => idx !== excludeIndex
        ),
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description:
          "Format file tidak didukung. Gunakan: JPG, PNG, GIF, atau WEBP",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file terlalu besar. Maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploadingImage(true);
    try {
      const response = await api.uploadFile(
        "/admin/packages/upload-image",
        file
      );
      if (response.data && response.data.image_url) {
        const imageUrl = response.data.image_url;
        if (editingPackage) {
          setEditingPackage({
            ...editingPackage,
            image_url: imageUrl,
          });
        }
        toast({
          title: "Berhasil",
          description: "Gambar berhasil diupload",
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description:
          error.response?.message || error.message || "Gagal mengupload gambar",
        variant: "destructive",
      });
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (editingPackage) {
      setEditingPackage({
        ...editingPackage,
        image_url: "",
      });
    }
    setImagePreview(null);
  };

  // Helper function to get image URL for preview
  const getPackageImageUrl = (pkg: PackageData): string | null => {
    if (pkg.image_url) {
      if (pkg.image_url.startsWith("http")) {
        return pkg.image_url;
      }
      return `https://bunakencharter.up.railway.app${pkg.image_url}`;
    }
    return null;
  };

  // Fungsi untuk menyiapkan form tambah add-on baru
  const handleNewAddOn = () => {
    setEditingAddOn({ id: 0, name: "", price: "", description: "" });
    setShowAddAddOn(true);
  };

  // Fungsi untuk masuk ke mode edit add-on yang sudah ada
  const handleEditAddOn = (addOn: AddOnData) => {
    setEditingAddOn({ ...addOn });
  };

  // Fungsi untuk membatalkan pengeditan add-on
  const handleCancelAddOn = () => {
    setEditingAddOn(null);
    setShowAddAddOn(false);
  };

  // Fungsi untuk menyimpan add-on (baik baru maupun edit)
  const handleSaveAddOn = async () => {
    if (editingAddOn) {
      try {
        if (!editingAddOn.id && !editingAddOn.ID) {
          // New add-on
          const { id, ID, ...addOnData } = editingAddOn;
          await addAddOn(addOnData);
          setEditingAddOn(null);
          setShowAddAddOn(false);
          // Toast notification sudah dikirim dari PackageContext
        } else {
          // Update existing add-on
          const addOnId = editingAddOn.id || editingAddOn.ID || 0;
          await updateAddOn(addOnId, editingAddOn);
          setEditingAddOn(null);
          // Toast notification sudah dikirim dari PackageContext
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menyimpan add-on",
          variant: "destructive",
        });
      }
    }
  };

  // Fungsi untuk menghapus add-on
  const handleDeleteAddOn = (id: number) => {
    setDeleteAddOnDialog({ open: true, addOnId: id });
  };

  const confirmDeleteAddOn = async () => {
    if (deleteAddOnDialog.addOnId === null) return;
    try {
      await removeAddOn(deleteAddOnDialog.addOnId);
      setDeleteAddOnDialog({ open: false, addOnId: null });
      // Toast notification sudah dikirim dari PackageContext
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus add-on",
        variant: "destructive",
      });
      setDeleteAddOnDialog({ open: false, addOnId: null });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kelola package dan harga
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              className="w-full sm:w-auto"
            >
              Ubah Password
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Packages Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Paket Wisata</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kelola paket wisata yang tersedia
            </p>
          </div>
          {!showAddPackage &&
            (!editingPackage ||
              (editingPackage.id === undefined &&
                editingPackage.ID === undefined)) && (
              <Button onClick={handleNewPackage} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Package
              </Button>
            )}
        </div>

        {/* Add New Package Form */}
        {showAddPackage &&
          editingPackage &&
          !editingPackage.id &&
          !editingPackage.ID && (
            <Card className="mb-6 border-2 border-primary">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl sm:text-2xl">
                    Tambah Package Baru
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleSave} className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Package
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full sm:w-auto"
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Language Tabs */}
                  <Tabs
                    value={activeLangTab}
                    onValueChange={(v) => setActiveLangTab(v as "id" | "en")}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="id">
                        <Languages className="w-4 h-4 mr-2" />
                        Bahasa Indonesia
                      </TabsTrigger>
                      <TabsTrigger value="en">
                        <Languages className="w-4 h-4 mr-2" />
                        English
                      </TabsTrigger>
                    </TabsList>

                    {/* Bahasa Indonesia Tab */}
                    <TabsContent value="id" className="space-y-6 mt-4">
                      {/* Basic Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Package (ID)</Label>
                          <Input
                            value={
                              editingPackage.name_id ||
                              editingPackage.name ||
                              ""
                            }
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                name_id: e.target.value,
                                name: e.target.value, // Also update legacy field
                              })
                            }
                            placeholder="Contoh: Kapal Speed"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Deskripsi (ID)</Label>
                          <Input
                            value={
                              editingPackage.description_id ||
                              editingPackage.description ||
                              ""
                            }
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                description_id: e.target.value,
                                description: e.target.value, // Also update legacy field
                              })
                            }
                            placeholder="Deskripsi package"
                          />
                        </div>
                      </div>

                      {/* Routes ID */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold">
                            Rute & Harga (ID)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentRoutes =
                                editingPackage.routes_id ||
                                editingPackage.routes ||
                                [];
                              setEditingPackage({
                                ...editingPackage,
                                routes_id: [
                                  ...currentRoutes,
                                  {
                                    name: "",
                                    price: "",
                                    name_id: "",
                                    name_en: "",
                                  },
                                ],
                                routes: [
                                  ...currentRoutes,
                                  { name: "", price: "" },
                                ],
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Rute
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(
                            editingPackage.routes_id ||
                            editingPackage.routes ||
                            []
                          ).map((route, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <Input
                                placeholder="Nama rute (e.g., Bunaken)"
                                value={route.name_id || route.name || ""}
                                onChange={(e) => {
                                  const currentRoutes =
                                    editingPackage.routes_id ||
                                    editingPackage.routes ||
                                    [];
                                  const updatedRoutes = [...currentRoutes];
                                  updatedRoutes[idx] = {
                                    ...route,
                                    name_id: e.target.value,
                                    name: e.target.value,
                                  };
                                  setEditingPackage({
                                    ...editingPackage,
                                    routes_id: updatedRoutes,
                                    routes: updatedRoutes.map((r) => ({
                                      name: r.name_id || r.name || "",
                                      price: r.price,
                                    })),
                                  });
                                }}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Harga (e.g., 1.200.000)"
                                value={route.price}
                                onChange={(e) => {
                                  const currentRoutes =
                                    editingPackage.routes_id ||
                                    editingPackage.routes ||
                                    [];
                                  const updatedRoutes = [...currentRoutes];
                                  updatedRoutes[idx] = {
                                    ...route,
                                    price: e.target.value,
                                  };
                                  setEditingPackage({
                                    ...editingPackage,
                                    routes_id: updatedRoutes,
                                    routes: updatedRoutes.map((r) => ({
                                      name: r.name_id || r.name || "",
                                      price: r.price,
                                    })),
                                  });
                                }}
                                className="w-40"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentRoutes =
                                    editingPackage.routes_id ||
                                    editingPackage.routes ||
                                    [];
                                  setEditingPackage({
                                    ...editingPackage,
                                    routes_id: currentRoutes.filter(
                                      (_, i) => i !== idx
                                    ),
                                    routes: currentRoutes
                                      .filter((_, i) => i !== idx)
                                      .map((r) => ({
                                        name: r.name_id || r.name || "",
                                        price: r.price,
                                      })),
                                  });
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features ID */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold">
                            Fitur (ID)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentFeatures =
                                editingPackage.features_id ||
                                editingPackage.features ||
                                [];
                              setEditingPackage({
                                ...editingPackage,
                                features_id: [...currentFeatures, ""],
                                features: [...currentFeatures, ""],
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Fitur
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(
                            editingPackage.features_id ||
                            editingPackage.features ||
                            []
                          ).map((feature, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const currentFeatures =
                                    editingPackage.features_id ||
                                    editingPackage.features ||
                                    [];
                                  const updatedFeatures = [...currentFeatures];
                                  updatedFeatures[idx] = e.target.value;
                                  setEditingPackage({
                                    ...editingPackage,
                                    features_id: updatedFeatures,
                                    features: updatedFeatures,
                                  });
                                }}
                                className="flex-1"
                                placeholder="Fitur package"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentFeatures =
                                    editingPackage.features_id ||
                                    editingPackage.features ||
                                    [];
                                  setEditingPackage({
                                    ...editingPackage,
                                    features_id: currentFeatures.filter(
                                      (_, i) => i !== idx
                                    ),
                                    features: currentFeatures.filter(
                                      (_, i) => i !== idx
                                    ),
                                  });
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Includes ID */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold">
                            Include (ID)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentIncludes =
                                editingPackage.includes_id ||
                                editingPackage.include ||
                                [];
                              setEditingPackage({
                                ...editingPackage,
                                includes_id: [...currentIncludes, ""],
                                include: [...currentIncludes, ""],
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Include
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(
                            editingPackage.includes_id ||
                            editingPackage.include ||
                            []
                          ).map((include, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={include}
                                onChange={(e) => {
                                  const currentIncludes =
                                    editingPackage.includes_id ||
                                    editingPackage.include ||
                                    [];
                                  const updatedIncludes = [...currentIncludes];
                                  updatedIncludes[idx] = e.target.value;
                                  setEditingPackage({
                                    ...editingPackage,
                                    includes_id: updatedIncludes,
                                    include: updatedIncludes,
                                  });
                                }}
                                className="flex-1"
                                placeholder="Item yang termasuk (e.g., Asuransi perjalanan laut)"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentIncludes =
                                    editingPackage.includes_id ||
                                    editingPackage.include ||
                                    [];
                                  setEditingPackage({
                                    ...editingPackage,
                                    includes_id: currentIncludes.filter(
                                      (_, i) => i !== idx
                                    ),
                                    include: currentIncludes.filter(
                                      (_, i) => i !== idx
                                    ),
                                  });
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* English Tab */}
                    <TabsContent value="en" className="space-y-6 mt-4">
                      {/* Basic Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Package Name (EN)</Label>
                          <Input
                            value={editingPackage.name_en || ""}
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                name_en: e.target.value,
                              })
                            }
                            placeholder="Example: Speedboat"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description (EN)</Label>
                          <Input
                            value={editingPackage.description_en || ""}
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                description_en: e.target.value,
                              })
                            }
                            placeholder="Package description"
                          />
                        </div>
                      </div>

                      {/* Routes EN */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold">
                            Routes & Price (EN)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentRoutes =
                                editingPackage.routes_en || [];
                              setEditingPackage({
                                ...editingPackage,
                                routes_en: [
                                  ...currentRoutes,
                                  {
                                    name: "",
                                    price: "",
                                    name_id: "",
                                    name_en: "",
                                  },
                                ],
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Route
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(editingPackage.routes_en || []).map(
                            (route, idx) => (
                              <div
                                key={idx}
                                className="flex gap-2 items-center"
                              >
                                <Input
                                  placeholder="Route name (e.g., Bunaken)"
                                  value={route.name_en || route.name || ""}
                                  onChange={(e) => {
                                    const currentRoutes =
                                      editingPackage.routes_en || [];
                                    const updatedRoutes = [...currentRoutes];
                                    updatedRoutes[idx] = {
                                      ...route,
                                      name_en: e.target.value,
                                      name: e.target.value,
                                    };
                                    setEditingPackage({
                                      ...editingPackage,
                                      routes_en: updatedRoutes,
                                    });
                                  }}
                                  className="flex-1"
                                />
                                <Input
                                  placeholder="Price (e.g., 1,200,000)"
                                  value={route.price}
                                  onChange={(e) => {
                                    const currentRoutes =
                                      editingPackage.routes_en || [];
                                    const updatedRoutes = [...currentRoutes];
                                    updatedRoutes[idx] = {
                                      ...route,
                                      price: e.target.value,
                                    };
                                    setEditingPackage({
                                      ...editingPackage,
                                      routes_en: updatedRoutes,
                                    });
                                  }}
                                  className="w-40"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentRoutes =
                                      editingPackage.routes_en || [];
                                    setEditingPackage({
                                      ...editingPackage,
                                      routes_en: currentRoutes.filter(
                                        (_, i) => i !== idx
                                      ),
                                    });
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Features EN */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold">
                            Features (EN)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentFeatures =
                                editingPackage.features_en || [];
                              setEditingPackage({
                                ...editingPackage,
                                features_en: [...currentFeatures, ""],
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Feature
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(editingPackage.features_en || []).map(
                            (feature, idx) => (
                              <div key={idx} className="flex gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) => {
                                    const currentFeatures =
                                      editingPackage.features_en || [];
                                    const updatedFeatures = [
                                      ...currentFeatures,
                                    ];
                                    updatedFeatures[idx] = e.target.value;
                                    setEditingPackage({
                                      ...editingPackage,
                                      features_en: updatedFeatures,
                                    });
                                  }}
                                  className="flex-1"
                                  placeholder="Package feature"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFeatures =
                                      editingPackage.features_en || [];
                                    setEditingPackage({
                                      ...editingPackage,
                                      features_en: currentFeatures.filter(
                                        (_, i) => i !== idx
                                      ),
                                    });
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Common Fields (not language-specific) */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Kapasitas</Label>
                      <Input
                        value={editingPackage.capacity}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            capacity: e.target.value,
                          })
                        }
                        placeholder="Contoh: 1-5 Orang"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Durasi</Label>
                      <Input
                        value={editingPackage.duration}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            duration: e.target.value,
                          })
                        }
                        placeholder="Contoh: Full day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        <input
                          type="checkbox"
                          checked={editingPackage.popular || false}
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              popular: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        Popular Package
                      </Label>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label className="text-lg font-semibold">
                      Gambar Package
                    </Label>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative w-full max-w-md">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Label
                          htmlFor="image-upload-new"
                          className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImage ? "Mengupload..." : "Upload Gambar"}
                        </Label>
                        <input
                          id="image-upload-new"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        {editingPackage.image_url && !imagePreview && (
                          <span className="text-sm text-muted-foreground">
                            Gambar saat ini: {editingPackage.image_url}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Format yang didukung: JPG, PNG, GIF, WEBP. Maksimal 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Edit Package Form */}
        {editingPackage && editingPackage.id && !showAddPackage && (
          <Card className="mb-6 border-2 border-primary">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl sm:text-2xl break-words">
                  Edit Package:{" "}
                  {editingPackage.name_id || editingPackage.name || "Package"}
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleSave} className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Language Tabs */}
                <Tabs
                  value={activeLangTab}
                  onValueChange={(v) => setActiveLangTab(v as "id" | "en")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="id">
                      <Languages className="w-4 h-4 mr-2" />
                      Bahasa Indonesia
                    </TabsTrigger>
                    <TabsTrigger value="en">
                      <Languages className="w-4 h-4 mr-2" />
                      English
                    </TabsTrigger>
                  </TabsList>

                  {/* Bahasa Indonesia Tab */}
                  <TabsContent value="id" className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nama Package (ID)</Label>
                        <Input
                          value={
                            editingPackage.name_id || editingPackage.name || ""
                          }
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              name_id: e.target.value,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Deskripsi (ID)</Label>
                        <Input
                          value={
                            editingPackage.description_id ||
                            editingPackage.description ||
                            ""
                          }
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              description_id: e.target.value,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Routes ID */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Rute & Harga (ID)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentRoutes =
                              editingPackage.routes_id ||
                              editingPackage.routes ||
                              [];
                            setEditingPackage({
                              ...editingPackage,
                              routes_id: [
                                ...currentRoutes,
                                {
                                  name: "",
                                  price: "",
                                  name_id: "",
                                  name_en: "",
                                },
                              ],
                              routes: [
                                ...currentRoutes,
                                { name: "", price: "" },
                              ],
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Rute
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(
                          editingPackage.routes_id ||
                          editingPackage.routes ||
                          []
                        ).map((route, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              placeholder="Nama rute (e.g., Bunaken)"
                              value={route.name_id || route.name || ""}
                              onChange={(e) => {
                                const currentRoutes =
                                  editingPackage.routes_id ||
                                  editingPackage.routes ||
                                  [];
                                const updatedRoutes = [...currentRoutes];
                                updatedRoutes[idx] = {
                                  ...route,
                                  name_id: e.target.value,
                                  name: e.target.value,
                                };
                                setEditingPackage({
                                  ...editingPackage,
                                  routes_id: updatedRoutes,
                                  routes: updatedRoutes.map((r) => ({
                                    name: r.name_id || r.name || "",
                                    price: r.price,
                                  })),
                                });
                              }}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Harga (e.g., 1.200.000)"
                              value={route.price}
                              onChange={(e) => {
                                const currentRoutes =
                                  editingPackage.routes_id ||
                                  editingPackage.routes ||
                                  [];
                                const updatedRoutes = [...currentRoutes];
                                updatedRoutes[idx] = {
                                  ...route,
                                  price: e.target.value,
                                };
                                setEditingPackage({
                                  ...editingPackage,
                                  routes_id: updatedRoutes,
                                  routes: updatedRoutes.map((r) => ({
                                    name: r.name_id || r.name || "",
                                    price: r.price,
                                  })),
                                });
                              }}
                              className="w-40"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentRoutes =
                                  editingPackage.routes_id ||
                                  editingPackage.routes ||
                                  [];
                                setEditingPackage({
                                  ...editingPackage,
                                  routes_id: currentRoutes.filter(
                                    (_, i) => i !== idx
                                  ),
                                  routes: currentRoutes
                                    .filter((_, i) => i !== idx)
                                    .map((r) => ({
                                      name: r.name_id || r.name || "",
                                      price: r.price,
                                    })),
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Includes ID */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Include (ID)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentIncludes =
                              editingPackage.includes_id ||
                              editingPackage.include ||
                              [];
                            setEditingPackage({
                              ...editingPackage,
                              includes_id: [...currentIncludes, ""],
                              include: [...currentIncludes, ""],
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Include
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(
                          editingPackage.includes_id ||
                          editingPackage.include ||
                          []
                        ).map((include, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={include}
                              onChange={(e) => {
                                const currentIncludes =
                                  editingPackage.includes_id ||
                                  editingPackage.include ||
                                  [];
                                const updatedIncludes = [...currentIncludes];
                                updatedIncludes[idx] = e.target.value;
                                setEditingPackage({
                                  ...editingPackage,
                                  includes_id: updatedIncludes,
                                  include: updatedIncludes,
                                });
                              }}
                              className="flex-1"
                              placeholder="Item yang termasuk (e.g., Asuransi perjalanan laut)"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentIncludes =
                                  editingPackage.includes_id ||
                                  editingPackage.include ||
                                  [];
                                setEditingPackage({
                                  ...editingPackage,
                                  includes_id: currentIncludes.filter(
                                    (_, i) => i !== idx
                                  ),
                                  include: currentIncludes.filter(
                                    (_, i) => i !== idx
                                  ),
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features ID */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Fitur (ID)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentFeatures =
                              editingPackage.features_id ||
                              editingPackage.features ||
                              [];
                            setEditingPackage({
                              ...editingPackage,
                              features_id: [...currentFeatures, ""],
                              features: [...currentFeatures, ""],
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Fitur
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(
                          editingPackage.features_id ||
                          editingPackage.features ||
                          []
                        ).map((feature, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const currentFeatures =
                                  editingPackage.features_id ||
                                  editingPackage.features ||
                                  [];
                                const updatedFeatures = [...currentFeatures];
                                updatedFeatures[idx] = e.target.value;
                                setEditingPackage({
                                  ...editingPackage,
                                  features_id: updatedFeatures,
                                  features: updatedFeatures,
                                });
                              }}
                              className="flex-1"
                              placeholder="Fitur package"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentFeatures =
                                  editingPackage.features_id ||
                                  editingPackage.features ||
                                  [];
                                setEditingPackage({
                                  ...editingPackage,
                                  features_id: currentFeatures.filter(
                                    (_, i) => i !== idx
                                  ),
                                  features: currentFeatures.filter(
                                    (_, i) => i !== idx
                                  ),
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* English Tab */}
                  <TabsContent value="en" className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Package Name (EN)</Label>
                        <Input
                          value={editingPackage.name_en || ""}
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              name_en: e.target.value,
                            })
                          }
                          placeholder="Example: Speedboat"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description (EN)</Label>
                        <Input
                          value={editingPackage.description_en || ""}
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              description_en: e.target.value,
                            })
                          }
                          placeholder="Package description"
                        />
                      </div>
                    </div>

                    {/* Routes EN */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Routes & Price (EN)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentRoutes =
                              editingPackage.routes_en || [];
                            setEditingPackage({
                              ...editingPackage,
                              routes_en: [
                                ...currentRoutes,
                                {
                                  name: "",
                                  price: "",
                                  name_id: "",
                                  name_en: "",
                                },
                              ],
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Route
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(editingPackage.routes_en || []).map((route, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              placeholder="Route name (e.g., Bunaken)"
                              value={route.name_en || route.name || ""}
                              onChange={(e) => {
                                const currentRoutes =
                                  editingPackage.routes_en || [];
                                const updatedRoutes = [...currentRoutes];
                                updatedRoutes[idx] = {
                                  ...route,
                                  name_en: e.target.value,
                                  name: e.target.value,
                                };
                                setEditingPackage({
                                  ...editingPackage,
                                  routes_en: updatedRoutes,
                                });
                              }}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Price (e.g., 1,200,000)"
                              value={route.price}
                              onChange={(e) => {
                                const currentRoutes =
                                  editingPackage.routes_en || [];
                                const updatedRoutes = [...currentRoutes];
                                updatedRoutes[idx] = {
                                  ...route,
                                  price: e.target.value,
                                };
                                setEditingPackage({
                                  ...editingPackage,
                                  routes_en: updatedRoutes,
                                });
                              }}
                              className="w-40"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentRoutes =
                                  editingPackage.routes_en || [];
                                setEditingPackage({
                                  ...editingPackage,
                                  routes_en: currentRoutes.filter(
                                    (_, i) => i !== idx
                                  ),
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features EN */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Features (EN)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentFeatures =
                              editingPackage.features_en || [];
                            setEditingPackage({
                              ...editingPackage,
                              features_en: [...currentFeatures, ""],
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Feature
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(editingPackage.features_en || []).map(
                          (feature, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const currentFeatures =
                                    editingPackage.features_en || [];
                                  const updatedFeatures = [...currentFeatures];
                                  updatedFeatures[idx] = e.target.value;
                                  setEditingPackage({
                                    ...editingPackage,
                                    features_en: updatedFeatures,
                                  });
                                }}
                                className="flex-1"
                                placeholder="Package feature"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentFeatures =
                                    editingPackage.features_en || [];
                                  setEditingPackage({
                                    ...editingPackage,
                                    features_en: currentFeatures.filter(
                                      (_, i) => i !== idx
                                    ),
                                  });
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Includes EN */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Include (EN)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentIncludes =
                              editingPackage.includes_en || [];
                            setEditingPackage({
                              ...editingPackage,
                              includes_en: [...currentIncludes, ""],
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Include
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(editingPackage.includes_en || []).map(
                          (include, idx) => (
                            <div key={idx} className="flex gap-2">
                              <Input
                                value={include}
                                onChange={(e) => {
                                  const currentIncludes =
                                    editingPackage.includes_en || [];
                                  const updatedIncludes = [...currentIncludes];
                                  updatedIncludes[idx] = e.target.value;
                                  setEditingPackage({
                                    ...editingPackage,
                                    includes_en: updatedIncludes,
                                  });
                                }}
                                className="flex-1"
                                placeholder="Included item (e.g., Marine travel insurance)"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentIncludes =
                                    editingPackage.includes_en || [];
                                  setEditingPackage({
                                    ...editingPackage,
                                    includes_en: currentIncludes.filter(
                                      (_, i) => i !== idx
                                    ),
                                  });
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Common Fields */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Kapasitas</Label>
                    <Input
                      value={editingPackage.capacity}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          capacity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Durasi</Label>
                    <Input
                      value={editingPackage.duration}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <input
                        type="checkbox"
                        checked={editingPackage.popular || false}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            popular: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Popular Package
                    </Label>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-lg font-semibold">
                    Gambar Package
                  </Label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-full max-w-md">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <Label
                        htmlFor={`image-upload-edit-${editingPackage.id}`}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingImage ? "Mengupload..." : "Upload Gambar"}
                      </Label>
                      <input
                        id={`image-upload-edit-${editingPackage.id}`}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      {editingPackage.image_url && !imagePreview && (
                        <span className="text-sm text-muted-foreground">
                          Gambar saat ini: {editingPackage.image_url}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format yang didukung: JPG, PNG, GIF, WEBP. Maksimal 5MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packages List */}
        <div className="space-y-6">
          {Array.isArray(packages) && packages.length > 0 ? (
            packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      {/* Package Image */}
                      {getPackageImageUrl(pkg) && (
                        <div className="flex-shrink-0">
                          <img
                            src={getPackageImageUrl(pkg)!}
                            alt={pkg.name}
                            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      )}
                      {/* Package Info */}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl sm:text-2xl break-words">
                          {pkg.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm sm:text-base">
                          {pkg.capacity} • {pkg.duration}
                          {pkg.popular && (
                            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                              Popular
                            </span>
                          )}
                        </CardDescription>
                        {pkg.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {!editingPackage ||
                    (editingPackage.id !== pkg.id &&
                      editingPackage.ID !== pkg.ID) ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pkg)}
                          className="w-full sm:w-auto"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg)}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleSave}
                          className="w-full sm:w-auto"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="w-full sm:w-auto"
                        >
                          Batal
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingPackage &&
                  (editingPackage.id === pkg.id ||
                    editingPackage.ID === pkg.ID) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Package sedang diedit di form di atas</p>
                      <p className="text-sm mt-2">
                        Gunakan form edit di bagian atas halaman untuk mengubah
                        data
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Description */}
                      {pkg.description && (
                        <div>
                          <h3 className="font-semibold mb-2 text-base sm:text-lg">
                            Deskripsi:
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground break-words">
                            {pkg.description}
                          </p>
                        </div>
                      )}

                      {/* Routes & Price */}
                      <div>
                        <h3 className="font-semibold mb-3 text-lg">
                          Rute & Harga:
                        </h3>
                        {(() => {
                          // Use routes_id if available, otherwise fallback to routes
                          const displayRoutes =
                            pkg.routes_id &&
                            Array.isArray(pkg.routes_id) &&
                            pkg.routes_id.length > 0
                              ? pkg.routes_id
                              : pkg.routes &&
                                Array.isArray(pkg.routes) &&
                                pkg.routes.length > 0
                              ? pkg.routes
                              : [];

                          return Array.isArray(displayRoutes) &&
                            displayRoutes.length > 0 ? (
                            <div className="border rounded-lg overflow-hidden overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="min-w-[120px]">
                                      Rute
                                    </TableHead>
                                    <TableHead className="text-left sm:text-right">
                                      Harga
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {displayRoutes.map(
                                    (route: any, idx: number) => (
                                      <TableRow key={idx}>
                                        <TableCell className="font-medium">
                                          {route?.name || route?.name_id || ""}
                                        </TableCell>
                                        <TableCell className="text-left sm:text-right font-semibold text-primary">
                                          {route?.price
                                            ? `Rp ${String(route.price)}`
                                            : "Rp -"}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              Tidak ada rute yang tersedia
                            </p>
                          );
                        })()}
                      </div>

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 text-base sm:text-lg">
                            Fitur:
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pkg.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2 bg-muted/50 rounded-md"
                              >
                                <span className="text-primary mt-0.5 flex-shrink-0">
                                  ✓
                                </span>
                                <span className="text-xs sm:text-sm break-words">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Includes */}
                      {pkg.include && pkg.include.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 text-base sm:text-lg">
                            Include:
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pkg.include.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2 bg-primary/5 rounded-md"
                              >
                                <span className="text-primary mt-0.5 flex-shrink-0">
                                  ✓
                                </span>
                                <span className="text-xs sm:text-sm break-words">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Tidak ada package yang tersedia</p>
            </div>
          )}
        </div>

        {/* Add-Ons Section */}
        <div className="mt-12">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Layanan Tambahan (Add-Ons)
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Kelola layanan tambahan yang tersedia
              </p>
            </div>
            {!showAddAddOn && !editingAddOn && (
              <Button onClick={handleNewAddOn} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Add-On
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Form Tambah Add-On Baru (hanya muncul di atas jika sedang menambah baru) */}
            {showAddAddOn &&
              editingAddOn &&
              !editingAddOn.id &&
              !editingAddOn.ID && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tambah Add-On Baru</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nama Add-On</Label>
                        <Input
                          value={editingAddOn?.name || ""}
                          onChange={(e) =>
                            setEditingAddOn({
                              ...editingAddOn!,
                              name: e.target.value,
                            })
                          }
                          placeholder="Contoh: Snorkling Equipment"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Harga</Label>
                        <Input
                          value={editingAddOn?.price || ""}
                          onChange={(e) =>
                            setEditingAddOn({
                              ...editingAddOn!,
                              price: e.target.value,
                            })
                          }
                          placeholder="Contoh: Rp 150.000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Deskripsi</Label>
                        <Input
                          value={editingAddOn?.description || ""}
                          onChange={(e) =>
                            setEditingAddOn({
                              ...editingAddOn!,
                              description: e.target.value,
                            })
                          }
                          placeholder="Contoh: Set Snorkling Equipment (Fins & Mask)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveAddOn}>
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button variant="outline" onClick={handleCancelAddOn}>
                          Batal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Add-Ons List */}
            {Array.isArray(addOns) && addOns.length > 0 ? (
              addOns.map((addOn) => (
                <div key={addOn.id} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="break-words">
                            {addOn.name}
                          </CardTitle>
                          <CardDescription className="break-words">
                            {addOn.description}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {editingAddOn &&
                          (editingAddOn.id === addOn.id ||
                            editingAddOn.ID === addOn.ID ||
                            editingAddOn.id === addOn.ID ||
                            editingAddOn.ID === addOn.id) ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button
                                onClick={handleSaveAddOn}
                                size="sm"
                                className="w-full sm:w-auto"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Simpan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelAddOn}
                                className="w-full sm:w-auto"
                              >
                                Batal
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAddOn(addOn)}
                                className="w-full sm:w-auto"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAddOn(addOn.id)}
                                className="w-full sm:w-auto"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {addOn.price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Form Edit muncul di bawah add-on yang sedang di-edit */}
                  {editingAddOn &&
                    editingAddOn.id === addOn.id &&
                    editingAddOn.id !== 0 && (
                      <Card className="border-2 border-primary">
                        <CardHeader>
                          <CardTitle>Edit Add-On</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Nama Add-On</Label>
                              <Input
                                value={editingAddOn?.name || ""}
                                onChange={(e) =>
                                  setEditingAddOn({
                                    ...editingAddOn!,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Contoh: Snorkling Equipment"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Harga</Label>
                              <Input
                                value={editingAddOn?.price || ""}
                                onChange={(e) =>
                                  setEditingAddOn({
                                    ...editingAddOn!,
                                    price: e.target.value,
                                  })
                                }
                                placeholder="Contoh: Rp 150.000"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Deskripsi</Label>
                              <Input
                                value={editingAddOn?.description || ""}
                                onChange={(e) =>
                                  setEditingAddOn({
                                    ...editingAddOn!,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Contoh: Set Snorkling Equipment (Fins & Mask)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleSaveAddOn}>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelAddOn}
                              >
                                Batal
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Tidak ada add-on yang tersedia</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Package Dialog */}
      <AlertDialog
        open={deletePackageDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePackageDialog({ open: false, package: null });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Package</AlertDialogTitle>
            <AlertDialogDescription>
              {deletePackageDialog.package &&
              deletePackageDialog.package.name &&
              deletePackageDialog.package.name.trim() !== "" ? (
                <>
                  Apakah Anda yakin ingin menghapus package{" "}
                  <strong>"{deletePackageDialog.package.name}"</strong>?
                  Tindakan ini tidak dapat dibatalkan dan semua data package
                  akan dihapus permanen.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin menghapus package ini? Tindakan ini
                  tidak dapat dibatalkan dan semua data package akan dihapus
                  permanen.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePackage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Add-On Dialog */}
      <AlertDialog
        open={deleteAddOnDialog.open}
        onOpenChange={(open) =>
          setDeleteAddOnDialog({ open, addOnId: deleteAddOnDialog.addOnId })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Layanan Tambahan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus layanan tambahan ini? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAddOn}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <AlertDialog
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ubah Password</AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan password lama dan password baru Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Password Lama</Label>
              <Input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                placeholder="Masukkan password lama"
              />
            </div>
            <div className="space-y-2">
              <Label>Password Baru</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Masukkan password baru (min. 6 karakter)"
              />
            </div>
            <div className="space-y-2">
              <Label>Konfirmasi Password Baru</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Konfirmasi password baru"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowChangePassword(false);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (passwordData.newPassword.length < 6) {
                  toast({
                    title: "Error",
                    description: "Password baru minimal 6 karakter",
                    variant: "destructive",
                  });
                  return;
                }
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                  toast({
                    title: "Error",
                    description: "Password baru dan konfirmasi tidak cocok",
                    variant: "destructive",
                  });
                  return;
                }
                const result = await changePassword(
                  passwordData.oldPassword,
                  passwordData.newPassword
                );
                if (result.success) {
                  toast({
                    title: "Berhasil",
                    description: result.message || "Password berhasil diubah",
                  });
                  setShowChangePassword(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                } else {
                  toast({
                    title: "Error",
                    description:
                      result.message ||
                      "Gagal mengubah password. Pastikan password lama benar.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Ubah Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
