import { FC } from "react";
import { Icon } from "../ui/Icon";

interface LevelBadgeProps {
  level: string;
  points: number;
  showProgress?: boolean;
  progressMax?: number;
}

const levelInfo: Record<string, { label: string; color: string; icon: string }> = {
  BRONCE: { label: "BRONCE", color: "bg-surface-200 text-surface-800", icon: "Medal" },
  PLATA: { label: "PLATA", color: "bg-surface-300 text-surface-900", icon: "Medal" },
  ORO: { label: "ORO", color: "bg-surface-800 text-white", icon: "Medal" },
  DIAMANTE: { label: "DIAMANTE", color: "bg-primary-800 text-white", icon: "Crown" },
};

export const LevelBadge: FC<LevelBadgeProps> = ({ level, points, showProgress = false, progressMax = 5000 }) => {
  const info = levelInfo[level] || levelInfo.BRONCE;
  const progress = Math.min((points / progressMax) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${info.color}`}>
        <Icon name={info.icon} size={16} />
      </span>
      <span className="text-xs font-bold text-surface-700">{info.label}</span>
      {showProgress && (
        <div className="flex-1">
          <div className="h-2 w-full rounded-full bg-surface-200">
            <div
              className="h-2 rounded-full bg-primary-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};


