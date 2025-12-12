"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Store } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface PDSShop {
  id: string
  shop_name: string
  shop_code: string | null
  address: string
  contact_person: string | null
  contact_phone: string | null
  operating_hours: string | null
  commodities_available: string[] | null
  license_number: string | null
  is_active: boolean
  latitude: number | null
  longitude: number | null
}

interface PDSShopsManagementClientProps {
  pacsId: string
  initialPDSShops: PDSShop[]
}

export default function PDSShopsManagementClient({ pacsId, initialPDSShops }: PDSShopsManagementClientProps) {
  const [pdsShops, setPDSShops] = useState<PDSShop[]>(initialPDSShops)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<PDSShop | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    shop_name: "",
    shop_code: "",
    address: "",
    contact_person: "",
    contact_phone: "",
    operating_hours: "",
    commodities: "",
    license_number: "",
    is_active: true,
    latitude: "",
    longitude: "",
  })

  const handleOpenDialog = (shop?: PDSShop) => {
    if (shop) {
      setEditingShop(shop)
      setFormData({
        shop_name: shop.shop_name,
        shop_code: shop.shop_code || "",
        address: shop.address,
        contact_person: shop.contact_person || "",
        contact_phone: shop.contact_phone || "",
        operating_hours: shop.operating_hours || "",
        commodities: shop.commodities_available?.join(", ") || "",
        license_number: shop.license_number || "",
        is_active: shop.is_active,
        latitude: shop.latitude?.toString() || "",
        longitude: shop.longitude?.toString() || "",
      })
    } else {
      setEditingShop(null)
      setFormData({
        shop_name: "",
        shop_code: "",
        address: "",
        contact_person: "",
        contact_phone: "",
        operating_hours: "",
        commodities: "",
        license_number: "",
        is_active: true,
        latitude: "",
        longitude: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.shop_name.trim() || !formData.address.trim()) {
      alert("Please fill in shop name and address")
      return
    }

    setIsSaving(true)
    const supabase = createClient()

    const shopData = {
      pacs_id: pacsId,
      shop_name: formData.shop_name.trim(),
      shop_code: formData.shop_code.trim() || null,
      address: formData.address.trim(),
      contact_person: formData.contact_person.trim() || null,
      contact_phone: formData.contact_phone.trim() || null,
      operating_hours: formData.operating_hours.trim() || null,
      commodities_available: formData.commodities
        ? formData.commodities
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : null,
      license_number: formData.license_number.trim() || null,
      is_active: formData.is_active,
      latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingShop) {
        // Update existing shop
        const { error } = await supabase.from("pacs_pds_shops").update(shopData).eq("id", editingShop.id)

        if (error) throw error

        setPDSShops(pdsShops.map((shop) => (shop.id === editingShop.id ? { ...shop, ...shopData } : shop)))
      } else {
        // Create new shop
        const { data, error } = await supabase.from("pacs_pds_shops").insert([shopData]).select().single()

        if (error) throw error

        setPDSShops([...pdsShops, data])
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving PDS shop:", error)
      alert("Failed to save PDS shop. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (shopId: string) => {
    if (!confirm("Are you sure you want to delete this PDS shop?")) return

    const supabase = createClient()
    const { error } = await supabase.from("pacs_pds_shops").delete().eq("id", shopId)

    if (error) {
      console.error("Error deleting PDS shop:", error)
      alert("Failed to delete PDS shop")
      return
    }

    setPDSShops(pdsShops.filter((shop) => shop.id !== shopId))
  }

  const handleToggleActive = async (shop: PDSShop) => {
    const supabase = createClient()
    const newStatus = !shop.is_active

    const { error } = await supabase
      .from("pacs_pds_shops")
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq("id", shop.id)

    if (error) {
      console.error("Error updating shop status:", error)
      alert("Failed to update shop status")
      return
    }

    setPDSShops(pdsShops.map((s) => (s.id === shop.id ? { ...s, is_active: newStatus } : s)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PDS Shops Management</h2>
          <p className="text-muted-foreground mt-1">Manage Public Distribution System shops</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add PDS Shop
        </Button>
      </div>

      {pdsShops.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground">No PDS shops added yet. Click "Add PDS Shop" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pdsShops.map((shop) => (
            <Card key={shop.id} className={!shop.is_active ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Store className="h-5 w-5 text-orange-600" />
                      {shop.shop_name}
                      {shop.shop_code && (
                        <span className="text-sm font-normal text-muted-foreground">({shop.shop_code})</span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{shop.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={shop.is_active} onCheckedChange={() => handleToggleActive(shop)} />
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(shop)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(shop.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {shop.contact_person && (
                    <div>
                      <span className="font-medium">Contact Person:</span> {shop.contact_person}
                    </div>
                  )}
                  {shop.contact_phone && (
                    <div>
                      <span className="font-medium">Phone:</span> {shop.contact_phone}
                    </div>
                  )}
                  {shop.operating_hours && (
                    <div>
                      <span className="font-medium">Operating Hours:</span> {shop.operating_hours}
                    </div>
                  )}
                  {shop.license_number && (
                    <div>
                      <span className="font-medium">License:</span> {shop.license_number}
                    </div>
                  )}
                </div>
                {shop.commodities_available && shop.commodities_available.length > 0 && (
                  <div className="mt-4">
                    <span className="font-medium text-sm">Commodities:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {shop.commodities_available.map((commodity, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {commodity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingShop ? "Edit PDS Shop" : "Add New PDS Shop"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shop_name">
                  Shop Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shop_name"
                  value={formData.shop_name}
                  onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                  placeholder="Enter shop name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shop_code">Shop Code</Label>
                <Input
                  id="shop_code"
                  value={formData.shop_code}
                  onChange={(e) => setFormData({ ...formData, shop_code: e.target.value })}
                  placeholder="Enter shop code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operating_hours">Operating Hours</Label>
              <Input
                id="operating_hours"
                value={formData.operating_hours}
                onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                placeholder="e.g., Mon-Fri: 9AM-5PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commodities">Available Commodities (comma-separated)</Label>
              <Input
                id="commodities"
                value={formData.commodities}
                onChange={(e) => setFormData({ ...formData, commodities: e.target.value })}
                placeholder="e.g., Rice, Wheat, Sugar, Oil"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                placeholder="Enter license number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="e.g., 12.9716"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="e.g., 77.5946"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active (visible on landing page)</Label>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-green-600 hover:bg-green-700">
                {isSaving ? "Saving..." : "Save PDS Shop"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
