import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const headerStyles = cva(
  clsx(
    "w-full h-15",
    "flex items-center px-2 py-2.5",
    "text-2xl font-bold text-main",
    "border border-white",
  ),
);

type HeaderStyleProps = VariantProps<typeof headerStyles>;

type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  className?: string;
  onLeftClick?: () => void;
} & HeaderStyleProps;

const Header = ({ title, leftChild, onLeftClick, className }: HeaderProps) => {
  return (
    <header className={clsx(headerStyles(), "justify-between", className)}>
      <button
        type="button"
        onClick={onLeftClick}
        className="flex shrink-0 items-center justify-start gap-2"
      >
        {leftChild}
      </button>
      {title && (
        <div className="mx-2 line-clamp-2 flex-1 text-center">{title}</div>
      )}
    </header>
  );
};

export default Header;
