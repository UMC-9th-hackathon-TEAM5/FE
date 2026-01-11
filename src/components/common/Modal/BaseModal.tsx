import { ReactNode } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-100 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
