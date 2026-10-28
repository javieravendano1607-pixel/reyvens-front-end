import type { CSSProperties, FC, ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export const Skeleton: FC<SkeletonProps> = ({ className = "", style }) => (
  <span aria-hidden="true" className={`skeleton-shimmer block ${className}`} style={style} />
);

export const SkeletonText: FC<{ lines?: number; className?: string }> = ({ lines = 2, className = "" }) => (
  <span aria-hidden="true" className={`block space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton key={index} className={`h-3 rounded-full ${index === lines - 1 ? "w-2/3" : "w-full"}`} />
    ))}
  </span>
);

export const LoadingStatus: FC<{ label: string; children: ReactNode; className?: string }> = ({ label, children, className = "" }) => (
  <div role="status" aria-label={label} aria-busy="true" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);
