import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const inputStyles = cva(
  [
    "relative",
    "flex items-center",
    "px-4 py-2 transition-opacity duration-300",
    "h-9 bg-main-dark2 rounded-lg",
    "text-sm font-medium text-white placeholder:text-gray",
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

export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    const { type = "text", placeholder, ...rest } = props;

    return (
      <input
        ref={ref}
        type={type}
        disabled={props.disabled}
        autoComplete="off"
        value={props.value}
        onChange={props.onChange}
        placeholder={placeholder}
        {...rest}
        className={twMerge(
          clsx(
            inputStyles({ width: props.width }),
            type === "datetime-local" && "datetime-local-input pr-10",
            props.className,
          ),
        )}
      />
    );
  },
);

export default Input;
