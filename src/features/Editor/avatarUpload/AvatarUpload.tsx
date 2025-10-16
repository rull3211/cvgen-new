import React, { useState, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import AvatarImage from '../../../components/avatarImage/AvatarImage'
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

  const TARGET_SIZE = 250 // final avatar size in px

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

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = TARGET_SIZE
    canvas.height = TARGET_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, x, y } = croppedAreaPixels

    // Draw cropped portion scaled to TARGET_SIZE
    ctx.drawImage(image, x, y, width, height, 0, 0, TARGET_SIZE, TARGET_SIZE)

    // Optional: circular mask
    const circleCanvas = document.createElement('canvas')
    circleCanvas.width = TARGET_SIZE
    circleCanvas.height = TARGET_SIZE
    const circleCtx = circleCanvas.getContext('2d')
    if (!circleCtx) return

    circleCtx.beginPath()
    circleCtx.arc(
      TARGET_SIZE / 2,
      TARGET_SIZE / 2,
      TARGET_SIZE / 2,
      0,
      2 * Math.PI,
    )
    circleCtx.closePath()
    circleCtx.clip()
    circleCtx.drawImage(canvas, 0, 0, TARGET_SIZE, TARGET_SIZE)

    // Export as webp for smaller size
    const croppedDataUrl = circleCanvas.toDataURL('image/webp', 0.2)
    onChange(croppedDataUrl)
    setImageSrc(null)
  }

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
    })

  return (
    <div className={styles.avatarupload}>
      {imageSrc ? (
        <div className={styles.croppercontainer}>
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
          <div className={styles.croppercontrols}>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className={styles.zoomslider}
            />
            <button onClick={createCroppedImage} className={styles.savebutton}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.avatardisplay}>
          <div className={styles.avatarpreview}>
            <AvatarImage src={src} />
          </div>
          <label htmlFor="avatar-upload-input" className={styles.uploadbutton}>
            Upload Avatar
          </label>
          <input
            id="avatar-upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.uploadinput}
          />
        </div>
      )}
    </div>
  )
}
