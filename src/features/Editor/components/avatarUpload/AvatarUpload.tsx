import React, { useState, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import AvatarImage from './conponents/AvatarImage'
import styles from './AvatarUpload.module.scss'
export default function AvatarUpload({
  onChange,
  src,
}: {
  onChange: (fileDataUrl: string) => void
  src: string
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // Handle upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  // Convert cropped area to circular image
  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, x, y } = croppedAreaPixels
    canvas.width = width
    canvas.height = height

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height)

    // circle mask
    const circleCanvas = document.createElement('canvas')
    circleCanvas.width = width
    circleCanvas.height = height
    const circleCtx = circleCanvas.getContext('2d')
    if (!circleCtx) return

    circleCtx.beginPath()
    circleCtx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI)
    circleCtx.closePath()
    circleCtx.clip()
    circleCtx.drawImage(canvas, 0, 0)

    const croppedDataUrl = circleCanvas.toDataURL('image/jpeg')
    onChange(croppedDataUrl) // send cropped avatar up
    setImageSrc(null) // close cropper
  }

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
    })

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* If cropping */}
      {imageSrc ? (
        <div className="relative w-64 h-64 bg-gray-900 rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div className="absolute bottom-3 left-0 w-full flex flex-col items-center space-y-2">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-3/4"
            />
            <button
              onClick={createCroppedImage}
              className="px-4 py-1 bg-green-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center">
          {/* Avatar Preview */}
          <div className={`${styles.avatarpreview}  `}>
            <AvatarImage src={src} />
          </div>

          {/* Upload Button */}
          <label
            htmlFor="avatar-upload"
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition"
          >
            Upload Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
