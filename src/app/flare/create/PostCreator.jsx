"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import directUpload from "./directUpload";
import { useUser } from "@/lib/UserContext"
import { notFound, useRouter } from "next/navigation"

export default function SocialPost() {
  const [thought, setThought] = useState("")
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const user = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({ content: thought }),
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        if (data.success) return data.post_id;
      }
    }).then(async (post_id) => {
      if (images && images.length > 0) {
        const {success, message} = await directUpload(post_id, images);
        if (!success) throw message;
        return post_id;
      }

    }).then((post_id) => {
      globalThis.location.href = `/flare?id=${post_id}`;
    }).catch(console.log);
    
    e.preventDefault()
    setThought("")
    setImages([])
    setPreviews([]);
    
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    const remainingSlots = 4 - images.length
    if (remainingSlots <= 0) {
      alert("Maximum 4 images allowed")
      return
    }

    const validFiles = files.slice(0, remainingSlots).filter((file) => file.type.startsWith("image/"))

    if (validFiles.length !== files.length) {
      alert("Only image files are allowed")
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file))

    setImages((prev) => [...prev, ...validFiles])
    setPreviews((prev) => [...prev, ...newPreviews])

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (!user) {
      router.refresh();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Card className="max-w-3xl mx-auto bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="share your thoughts"
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button type="submit" disabled={isSending} className="bg-blue-600 hover:bg-blue-700 text-white">
                { isSending ? "posting" : "post" }
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
            />
          </form>
        </CardContent>

        <CardFooter className="flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {previews.map((preview, index) => (
              <AspectRatio key={index} ratio={1} className="relative group bg-gray-700 rounded-md overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt={`Preview ${index + 1}`} fill className="object-cover" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AspectRatio>
            ))}

            {images.length < 4 && (
              <AspectRatio ratio={1}>
                <label
                  htmlFor="image-input"
                  className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-300">Add Image</p>
                  <p className="text-xs text-gray-400 mt-1">{4 - images.length} remaining</p>
                </label>
              </AspectRatio>
            )}

            {[...Array(Math.max(3 - images.length, 0))].map((_, i) => (
              <AspectRatio key={i} ratio={1}>
                <div className="flex items-center justify-center h-full border border-gray-700 rounded-md bg-gray-800 border-transparent bg-transparent">
                  <p className="text-sm text-gray-400">.</p>
                </div>
              </AspectRatio>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}