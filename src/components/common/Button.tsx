import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
  clsx(
    // 모양
    "h-9.5 py-2",
    "rounded-lg",
    "flex items-center justify-center",
    "text-white text-medium leading-[140%] tracking-[-0.4px] font-medium",
  ),
  {
    variants: {
      width: {
        default: "w-18",
        default: "w-18",
        xl: "w-[310px]",
        md: "w-[149px]",
        sm: "w-[60px]",
      },
      state: {
        // default : inactive
        default: "border border-main-dark1",
        active: "bg-main-dark1",
      },
    },
    compoundVariants: [
      // confirm button
      {
        state: "active",
        width: "xl",
        className:
          "text-black bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold",
      },
      { state: "default", width: "xl", className: "h-11 rounded-none" },
      // 참여자 목록 - 도착/미도착
      { state: "active", width: "sm", className: "bg-[#10B981] text-sm" },
      {
        state: "default",
        width: "sm",
        className: "bg-[#E3E6EA] text-[#808080] text-sm",
      },
    ],
    defaultVariants: {
      state: "default",
      width: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export const Button = ({ width, children, state, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={twMerge(buttonStyles({ width, state }))}
      {...props}
    >
      {children}
    </button>
  );
};
