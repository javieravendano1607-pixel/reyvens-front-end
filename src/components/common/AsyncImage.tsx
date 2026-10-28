import type { FC, ImgHTMLAttributes } from "react";
import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Skeleton } from "../ui/Skeleton";

const defaultFallback = "/images/demo/product-reference.svg";

interface AsyncImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "className"> {
  src?: string | null;
  fallbackSrc?: string;
  className?: string;
  imageClassName?: string;
}

export const AsyncImage: FC<AsyncImageProps> = ({
  src,
  fallbackSrc = defaultFallback,
  alt = "",
  className = "",
  imageClassName = "",
  loading = "lazy",
  ...imageProps
}) => {
  const originalSrc = src || fallbackSrc;
  const [imageState, setImageState] = useState<{ originalSrc: string; displaySrc: string; status: "loading" | "loaded" | "unavailable" }>({
    originalSrc,
    displaySrc: originalSrc,
    status: "loading",
  });
  const isCurrent = imageState.originalSrc === originalSrc;
  const displaySrc = isCurrent ? imageState.displaySrc : originalSrc;
  const status = isCurrent ? imageState.status : "loading";

  return (
    <span className={`relative block overflow-hidden ${className}`} aria-busy={status === "loading"}>
      {status === "loading" && <Skeleton className="absolute inset-0 z-[1] rounded-[inherit]" />}
      {status !== "unavailable" ? (
        <img
          {...imageProps}
          src={displaySrc}
          alt={alt}
          loading={loading}
          className={`h-full w-full object-cover transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"} ${imageClassName}`}
          onLoad={() => setImageState({ originalSrc, displaySrc, status: "loaded" })}
          onError={() => {
            if (fallbackSrc && displaySrc !== fallbackSrc) setImageState({ originalSrc, displaySrc: fallbackSrc, status: "loading" });
            else setImageState({ originalSrc, displaySrc, status: "unavailable" });
          }}
        />
      ) : (
        <span className="flex h-full min-h-12 w-full items-center justify-center bg-surface-100 text-surface-400" aria-hidden="true">
          <Icon name="ImageOff" size={20} />
        </span>
      )}
    </span>
  );
};
