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
import { usePackages, PackageData, AddOnData } from "@/contexts/PackageContext";
import { LogOut, Save, RotateCcw, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { logout } = useAdmin();
  const {
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

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleEdit = (pkg: PackageData) => {
    setEditingPackage({ ...pkg });
    setEditingRouteIndex(null);
  };

  const handleSave = async () => {
    if (editingPackage) {
      try {
        // Check if this is a new package (no id) or existing package
        if (!editingPackage.id && !editingPackage.ID) {
          // New package
          const { id, ID, ...packageData } = editingPackage;
          await addPackage(packageData);
          setEditingPackage(null);
          setShowAddPackage(false);
          toast({
            title: "Berhasil",
            description: "Package berhasil ditambahkan",
          });
        } else {
          // Update existing package
          const packageId = editingPackage.id || editingPackage.ID || 0;
          await updatePackage(packageId, editingPackage);
          setEditingPackage(null);
          toast({
            title: "Berhasil",
            description: "Package berhasil diperbarui",
          });
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
  };

  const handleNewPackage = () => {
    setEditingPackage({
      name: "",
      duration: "",
      capacity: "",
      features: [],
      exclude: [],
      routes: [],
      popular: false,
    });
    setShowAddPackage(true);
  };

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin mereset semua package ke default?")) {
      resetPackages();
      toast({
        title: "Berhasil",
        description: "Package telah direset ke default",
      });
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
  const handleSaveAddOn = () => {
    if (editingAddOn) {
      if (editingAddOn.id === 0) {
        // Jika id 0, berarti ini add-on baru
        const { id, ...rest } = editingAddOn;
        addAddOn(rest);
      } else {
        // Jika ada id, berarti update yang lama
        updateAddOn(editingAddOn.id, editingAddOn);
      }
      saveAddOns(); // Simpan ke storage
      setEditingAddOn(null);
      setShowAddAddOn(false);
      toast({ title: "Berhasil", description: "Layanan tambahan diperbarui" });
    }
  };

  // Fungsi untuk menghapus add-on
  const handleDeleteAddOn = (id: number) => {
    if (confirm("Hapus layanan tambahan ini?")) {
      removeAddOn(id);
      saveAddOns();
      toast({ title: "Berhasil", description: "Layanan tambahan dihapus" });
    }
  };

  // Memperbaiki fungsi Reset Add-Ons yang tadi kosong
  const handleResetAddOns = () => {
    if (confirm("Reset semua add-ons ke default?")) {
      resetAddOns();
      toast({ title: "Berhasil", description: "Add-ons telah direset" });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola package dan harga</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Packages
            </Button>
            <Button variant="outline" onClick={handleResetAddOns}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Add-Ons
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Packages Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Paket Wisata</h2>
            <p className="text-muted-foreground">
              Kelola paket wisata yang tersedia
            </p>
          </div>
          {!showAddPackage &&
            (!editingPackage ||
              (editingPackage.id === undefined &&
                editingPackage.ID === undefined)) && (
              <Button onClick={handleNewPackage}>
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    Tambah Package Baru
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Package
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Batal
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Package</Label>
                      <Input
                        value={editingPackage.name}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            name: e.target.value,
                          })
                        }
                        placeholder="Contoh: Kapal Speed"
                      />
                    </div>
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

                  {/* Routes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">
                        Rute & Harga
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPackage({
                            ...editingPackage,
                            routes: [
                              ...editingPackage.routes,
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
                      {editingPackage.routes.map((route, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            placeholder="Nama rute (e.g., Bunaken)"
                            value={route.name}
                            onChange={(e) => {
                              const updatedRoutes = [...editingPackage.routes];
                              updatedRoutes[idx] = {
                                ...route,
                                name: e.target.value,
                              };
                              setEditingPackage({
                                ...editingPackage,
                                routes: updatedRoutes,
                              });
                            }}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Harga (e.g., 1.200.000)"
                            value={route.price}
                            onChange={(e) => {
                              const updatedRoutes = [...editingPackage.routes];
                              updatedRoutes[idx] = {
                                ...route,
                                price: e.target.value,
                              };
                              setEditingPackage({
                                ...editingPackage,
                                routes: updatedRoutes,
                              });
                            }}
                            className="w-40"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPackage({
                                ...editingPackage,
                                routes: editingPackage.routes.filter(
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

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Fitur</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPackage({
                            ...editingPackage,
                            features: [...editingPackage.features, ""],
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Fitur
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editingPackage.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const updatedFeatures = [
                                ...editingPackage.features,
                              ];
                              updatedFeatures[idx] = e.target.value;
                              setEditingPackage({
                                ...editingPackage,
                                features: updatedFeatures,
                              });
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPackage({
                                ...editingPackage,
                                features: editingPackage.features.filter(
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

                  {/* Exclude */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">
                        Tidak Termasuk
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPackage({
                            ...editingPackage,
                            exclude: [...editingPackage.exclude, ""],
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Item
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editingPackage.exclude.map((exclude, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={exclude}
                            onChange={(e) => {
                              const updatedExclude = [
                                ...editingPackage.exclude,
                              ];
                              updatedExclude[idx] = e.target.value;
                              setEditingPackage({
                                ...editingPackage,
                                exclude: updatedExclude,
                              });
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPackage({
                                ...editingPackage,
                                exclude: editingPackage.exclude.filter(
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
                </div>
              </CardContent>
            </Card>
          )}

        {/* Packages List */}
        <div className="space-y-6">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <CardDescription>
                      {pkg.capacity} • {pkg.duration}
                      {pkg.popular && (
                        <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          Popular
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {!editingPackage ||
                  (editingPackage.id !== pkg.id &&
                    editingPackage.ID !== pkg.ID) ? (
                    <Button onClick={() => handleEdit(pkg)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
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
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nama Package</Label>
                        <Input
                          value={editingPackage.name}
                          onChange={(e) =>
                            setEditingPackage({
                              ...editingPackage,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
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

                    {/* Routes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Rute & Harga
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddRoute(pkg.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Rute
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {editingPackage.routes.map((route, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              placeholder="Nama rute (e.g., Bunaken)"
                              value={route.name}
                              onChange={(e) =>
                                handleUpdateRoute(
                                  pkg.id,
                                  idx,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                            <Input
                              placeholder="Harga (e.g., 1.200.000)"
                              value={route.price}
                              onChange={(e) =>
                                handleUpdateRoute(
                                  pkg.id,
                                  idx,
                                  "price",
                                  e.target.value
                                )
                              }
                              className="w-40"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRoute(pkg.id, idx)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Fitur</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFeature(pkg.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Fitur
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {editingPackage.features.map((feature, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) =>
                                handleUpdateFeature(pkg.id, idx, e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(pkg.id, idx)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exclude */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Tidak Termasuk
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddExclude(pkg.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Item
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {editingPackage.exclude.map((exclude, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={exclude}
                              onChange={(e) =>
                                handleUpdateExclude(pkg.id, idx, e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveExclude(pkg.id, idx)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Rute & Harga:</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rute</TableHead>
                            <TableHead>Harga</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pkg.routes.map((route, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{route.name}</TableCell>
                              <TableCell>Rp {route.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Fitur:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tidak Termasuk:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {pkg.exclude.map((exclude, idx) => (
                          <li key={idx}>{exclude}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-Ons Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Layanan Tambahan (Add-Ons)</h2>
              <p className="text-muted-foreground">
                Kelola layanan tambahan yang tersedia
              </p>
            </div>
            {!showAddAddOn && !editingAddOn && (
              <Button onClick={handleNewAddOn}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Add-On
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Add/Edit Add-On Form */}
            {(showAddAddOn || editingAddOn) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingAddOn?.id === 0
                      ? "Tambah Add-On Baru"
                      : "Edit Add-On"}
                  </CardTitle>
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
            {addOns.map((addOn) => (
              <Card key={addOn.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{addOn.name}</CardTitle>
                      <CardDescription>{addOn.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAddOn(addOn)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddOn(addOn.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
