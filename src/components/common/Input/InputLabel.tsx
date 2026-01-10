interface inputLabelProps {
  isRequired?: boolean;
  label: string;
}

const InputLabel = ({ label, isRequired = false }: inputLabelProps) => {
  return (
    <div className="text-main mb-3.5 w-full text-base font-medium">
      {label}
      {isRequired && <span className="ml-1">*</span>}
    </div>
  );
};

export default InputLabel;
