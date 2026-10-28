import { FC } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textColor?: string;
}

const sizes = {
  sm: { mark: 24, text: "text-xl", container: "gap-1.5" },
  md: { mark: 32, text: "text-2xl", container: "gap-2" },
  lg: { mark: 40, text: "text-3xl", container: "gap-2.5" },
};

export const Logo: FC<LogoProps> = ({ size = "md", showText = true, textColor = "text-surface-900" }) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.container}`}>
      <img
        src="/logo.svg"
        alt={showText ? "" : "REYVENS"}
        aria-hidden={showText}
        width={s.mark}
        height={s.mark}
        className="shrink-0 object-contain"
      />

      {showText && (
        <span className={`font-geometric ${s.text} font-black leading-tight ${textColor}`}>
          REYVENS
        </span>
      )}
    </div>
  );
};
