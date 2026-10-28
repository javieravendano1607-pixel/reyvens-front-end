import { FC, Fragment, ReactNode } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  dragHandle?: boolean;
  height?: string;
  rounded?: boolean;
}

export const BottomSheet: FC<BottomSheetProps> = ({ isOpen, onClose, children, dragHandle = true, height = "auto", rounded = true }) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <TransitionChild as={Fragment} enter="duration-150 ease-out" enterFrom="opacity-0" enterTo="opacity-100" leave="duration-100 ease-in" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-surface-900/55 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <TransitionChild as={Fragment} enter="duration-200 ease-out" enterFrom="translate-y-6 opacity-0 sm:scale-[0.98]" enterTo="translate-y-0 opacity-100 sm:scale-100" leave="duration-150 ease-in" leaveFrom="translate-y-0 opacity-100 sm:scale-100" leaveTo="translate-y-6 opacity-0 sm:scale-[0.98]">
          <DialogPanel className={`relative w-full max-w-2xl overflow-hidden bg-white shadow-2xl sm:rounded-2xl ${rounded ? "rounded-t-3xl" : ""} ${height}`} style={{ maxHeight: "90dvh" }}>
            {dragHandle && <div className="flex justify-center py-3 sm:hidden"><div className="h-1.5 w-10 rounded-full bg-surface-300" /></div>}
            <div className="max-h-[90dvh] overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">{children}</div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>
);
