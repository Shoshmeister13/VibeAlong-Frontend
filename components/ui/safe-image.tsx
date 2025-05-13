"use client"

import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function SafeImage({ src, alt, width, height, className, fallbackSrc = "/placeholder.svg" }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}
