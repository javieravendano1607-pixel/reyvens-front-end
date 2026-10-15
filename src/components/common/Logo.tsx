import { FC } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textColor?: string;
}

const sizes = {
  sm: { bear: 24, text: "text-xl", container: "gap-1.5" },
  md: { bear: 32, text: "text-2xl", container: "gap-2" },
  lg: { bear: 40, text: "text-3xl", container: "gap-2.5" },
};

export const Logo: FC<LogoProps> = ({ size = "md", showText = true, textColor = "text-primary-700" }) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.container}`}>
      <div
        className="relative flex-shrink-0"
        style={{ width: s.bear, height: s.bear }}
        aria-label="Logo Reyvens"
      >
        {/* Geometric bear head: triangle ears + circle face */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Ear left */}
          <polygon points="12,8 18,20 8,20" fill="#000000" />
          {/* Ear right */}
          <polygon points="36,8 42,20 32,20" fill="#000000" />
          {/* Face */}
          <circle cx="24" cy="26" r="14" fill="#000000" />
          {/* Nose */}
          <ellipse cx="24" cy="28" rx="3" ry="4" fill="#D32F2F" />
          {/* Eye left dot */}
          <circle cx="19" cy="24" r="1.5" fill="#FFFFFF" />
          {/* Eye right dot */}
          <circle cx="29" cy="24" r="1.5" fill="#FFFFFF" />
          {/* Muzzle hint */}
          <path d="M21 31 C24 33 27 33 30 31" stroke="#D32F2F" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Floating geometric RV badge */}
        <div
          className="absolute -bottom-1 -right-1 flex h-5 w-5 -rotate-6 items-center justify-center rounded-full bg-primary-600 text-[8px] font-black text-white"
          style={{ fontSize: "9px" }}
        >
          RV
        </div>
      </div>

      {showText && (
        <span className={`font-geometric ${s.text} font-black leading-tight ${textColor}`}>
          REYVENS
        </span>
      )}
    </div>
  );
};
