import clsx from "clsx";

interface inputLabelProps {
  isRequired?: boolean;
  label: string;
  className?: string;
}

const InputLabel = ({
  label,
  isRequired = false,
  className,
}: inputLabelProps) => {
  return (
    <span
      className={clsx("text-main ml-1 w-full text-base font-medium", className)}
    >
      {label}
      {isRequired && <span className="ml-1">*</span>}
    </span>
  );
};

export default InputLabel;
