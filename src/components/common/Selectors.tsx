import { FC } from "react";
import { Icon } from "../ui/Icon";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (size: string) => void;
}

export const SizeSelector: FC<SizeSelectorProps> = ({ sizes, selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={`h-10 w-10 rounded-lg border-2 font-medium transition-all duration-200 ${
            selected === size
              ? "border-primary-600 bg-primary-600 text-white"
              : "border-surface-300 bg-white text-surface-700 hover:border-surface-400"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

interface ColorSelectorProps {
  colors: { name: string; value: string; hex: string }[];
  selected: string | null;
  onChange: (color: string) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({ colors, selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onChange(color.hex)}
          className={`relative h-10 w-10 rounded-full border-2 transition-all duration-200 ${
            selected === color.hex ? "border-surface-800 ring-2 ring-surface-400" : "border-surface-300"
          }`}
          title={color.name}
          style={{ backgroundColor: color.hex === "#FFFFFF" ? "#FFFFFF" : color.hex }}
        >
          {selected === color.hex && (
            <Icon name="Check" size={16} color={color.hex === "#000000" || color.hex === "#1a1a1a" ? "#FFFFFF" : "#000000"} />
          )}
        </button>
      ))}
    </div>
  );
};

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  onChange: (qty: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ quantity, max = 99, onChange }) => {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-300 bg-surface-50 text-surface-700 disabled:opacity-40"
      >
        <Icon name="Minus" size={16} />
      </button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-300 bg-surface-50 text-surface-700 disabled:opacity-40"
      >
        <Icon name="Plus" size={16} />
      </button>
    </div>
  );
};
