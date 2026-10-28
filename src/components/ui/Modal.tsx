import { FC, ReactNode } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { Icon } from "../ui/Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, size = "md", closeOnOverlay = true, showCloseButton = true }) => {
  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" };
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={closeOnOverlay ? onClose : () => undefined} className="relative z-50">
        <TransitionChild as={Fragment} enter="duration-150 ease-out" enterFrom="opacity-0" enterTo="opacity-100" leave="duration-100 ease-in" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-surface-900/55 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <TransitionChild as={Fragment} enter="duration-150 ease-out" enterFrom="translate-y-2 scale-[0.98] opacity-0" enterTo="translate-y-0 scale-100 opacity-100" leave="duration-100 ease-in" leaveFrom="translate-y-0 scale-100 opacity-100" leaveTo="translate-y-2 scale-[0.98] opacity-0">
            <DialogPanel className={`relative w-full ${sizeClasses[size]} rounded-2xl bg-white p-5 shadow-xl sm:p-7`}>
              {showCloseButton && <button type="button" onClick={onClose} aria-label="Cerrar ventana" className="icon-control absolute right-3 top-3"><Icon name="X" size={19} /></button>}
              {title && <DialogTitle className="mb-5 pr-8 text-lg font-bold text-surface-900">{title}</DialogTitle>}
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
