import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import HeaderArrowIcon from "@/assets/arrow/arrow_back.svg?react";

const headerStyles = cva(
  clsx(
    "w-full h-15",
    "flex items-center px-5 py-2.5",
    "text-2xl font-bold text-main",
  ),
);

type HeaderStyleProps = VariantProps<typeof headerStyles>;

type HeaderProps = {
  title?: React.ReactNode;
  className?: string;
  onLeftClick?: () => void;
} & HeaderStyleProps;

const Header = ({ title, onLeftClick, className }: HeaderProps) => {
  return (
    <header className={clsx(headerStyles(), "justify-between", className)}>
      <button
        type="button"
        onClick={onLeftClick}
        className="flex shrink-0 items-center justify-start gap-2"
      >
        <HeaderArrowIcon />
      </button>
      {title && (
        <div className="mx-2 line-clamp-2 flex-1 text-center">{title}</div>
      )}
      <div className="h-6 w-6"></div>
    </header>
  );
};

export default Header;
