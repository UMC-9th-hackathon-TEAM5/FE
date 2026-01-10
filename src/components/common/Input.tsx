import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const inputStyles = cva(
  [
    "flex items-center",
    "px-4 py-2 transition-opacity duration-300",
    "h-9 bg-main-dark2 rounded-2",
    "text-sm font-medium text-white placeholder:text-main-variant",
  ],
  {
    variants: {
      width: {
        xl: "w-77.5",
        md: "w-75",
        sm: "w-37.25",
      },
    },
    defaultVariants: {
      width: "md",
    },
  },
);

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputStyles>;

const PasswordInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, width, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible((v) => !v);

    return (
      <div className={clsx("relative", inputStyles({ width }), className)}>
        <input
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none"
          value={props.value}
          onChange={props.onChange}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 flex items-center"
          aria-label="비밀번호 보기 전환"
        ></button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    const { type = "text", ...rest } = props;
    if (type === "password") {
      return <PasswordInput ref={ref} {...rest} />;
    }
    return (
      <input
        ref={ref}
        type={type}
        disabled={props.disabled}
        autoComplete="off"
        value={props.value}
        onChange={props.onChange}
        className={clsx(
          inputStyles({
            width: props.width,
          }),
          props.className,
        )}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
