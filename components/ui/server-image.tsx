import Image from "next/image"

interface ServerImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function ServerImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder.svg",
}: ServerImageProps) {
  // Use Next.js Image component which handles errors properly in Server Components
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width || 500}
      height={height || 300}
      className={className}
      // Next.js Image handles errors internally without onError prop
    />
  )
}
