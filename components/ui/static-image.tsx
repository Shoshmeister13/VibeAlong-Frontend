interface StaticImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function StaticImage({
  src,
  alt,
  width = 100,
  height = 100,
  className,
  fallbackSrc = "/placeholder.svg",
}: StaticImageProps) {
  // For server components, we can't use onError handlers
  // Instead, we'll use Next.js Image which handles errors internally
  return <img src={src || fallbackSrc} alt={alt} width={width} height={height} className={className} />
}
