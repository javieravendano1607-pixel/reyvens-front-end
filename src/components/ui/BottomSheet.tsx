import { FC, ReactNode, useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  dragHandle?: boolean;
  height?: string;
  rounded?: boolean;
}

export const BottomSheet: FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  dragHandle = true,
  height = "auto",
  rounded = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg bg-white transition-all duration-300 ${rounded ? "rounded-t-3xl" : ""} ${height}`}
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {dragHandle && (
          <div className="flex justify-center py-2">
            <div className="h-1.5 w-10 rounded-full bg-surface-300" />
          </div>
        )}
        <div className="max-h-[calc(90vh-48px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
