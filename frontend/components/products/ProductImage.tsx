import Image, { type ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "alt"> & { alt?: string };

/**
 * Images from Supabase Storage or the backend are now allowed via remotePatterns
 * in next.config.ts, so next/image can optimise them directly.
 */
export default function ProductImage({ alt = "", ...props }: ProductImageProps) {
  return <Image {...props} alt={alt} />;
}
