"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ImageIcon, Leaf, Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { PACS } from "@/lib/types/pacs"
import Image from "next/image"

interface GalleryItem {
  id: string
  pacs_id: string
  image_url: string
  caption: string
  display_order: number
  created_at: string
}

interface GalleryManagementProps {
  pacs: PACS
  gallery: GalleryItem[]
}

export function GalleryManagement({ pacs, gallery: initialGallery }: GalleryManagementProps) {
  const router = useRouter()
  const supabase = createClient()
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({
    image_url: "",
    caption: "",
    display_order: gallery.length + 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("pacs_gallery")
          .update({
            image_url: formData.image_url,
            caption: formData.caption,
            display_order: formData.display_order,
          })
          .eq("id", editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("pacs_gallery").insert({
          pacs_id: pacs.id,
          image_url: formData.image_url,
          caption: formData.caption,
          display_order: formData.display_order,
        })

        if (error) throw error
      }

      setDialogOpen(false)
      setEditingItem(null)
      setFormData({ image_url: "", caption: "", display_order: gallery.length + 1 })
      router.refresh()
    } catch (error) {
      console.error("Error saving gallery item:", error)
      alert("Failed to save gallery item")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const { error } = await supabase.from("pacs_gallery").delete().eq("id", id)

      if (error) throw error

      setGallery(gallery.filter((item) => item.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      alert("Failed to delete gallery item")
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      image_url: item.image_url,
      caption: item.caption,
      display_order: item.display_order,
    })
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setFormData({ image_url: "", caption: "", display_order: gallery.length + 1 })
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="border-b border-green-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/admin/${pacs.slug}`}>
                <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-green-900">Gallery Management</h1>
                  <p className="text-xs text-green-600">{pacs.name}</p>
                </div>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} className="bg-green-700 hover:bg-green-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Image" : "Add New Image"}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? "Update image details" : "Add a new image to the gallery"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Input
                      id="caption"
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="Image description"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800">
                    {loading ? "Saving..." : editingItem ? "Update Image" : "Add Image"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {gallery.length === 0 ? (
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-900">No Images Yet</CardTitle>
              <CardDescription>Add images to showcase your PACS activities and facilities</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-16 w-16 text-green-300 mb-4" />
              <p className="text-green-600 mb-4">Your gallery is empty</p>
              <Button onClick={handleAddNew} className="bg-green-700 hover:bg-green-800">
                <Plus className="h-4 w-4 mr-2" />
                Add First Image
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <Card key={item.id} className="border-green-100 overflow-hidden">
                <div className="relative aspect-video bg-green-50">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={item.caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-green-900 font-medium mb-2">{item.caption}</p>
                  <p className="text-xs text-green-600 mb-4">Order: {item.display_order}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                      className="flex-1 border-green-200"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="flex-1">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
