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
    "text-white leading-[140%] tracking-[-0.4px] font-medium",
  ),
  {
    variants: {
      width: {
        default: "w-18",
        xl: "w-[310px]",
        lg : "w-[300px]",
        md: "w-[149px]",
        base: "w-[72px]",
        sm: "w-[60px]",
      },
      // state == style?
      state: {
        // default : inactive
        default: "border border-main-dark1",
        active: "bg-main-dark1",
        arrive: "bg-[#10B981]",
        non_arrive : "bg-[#E3E6EA]",
        escape : "bg-[#EF4444]",
        arrest : "bg-black border border-[#808080]",
        prison : "bg-[#EF444433] border border-[#EF4444]",
        instagram : "rounded-none border-2 border-transparent [background:linear-gradient(#1f1f1f,#1f1f1f)_padding-box,linear-gradient(to_right,#833AB4,#EE2A7B,#F9CE34)_border-box] h-11",
      },
    },
<<<<<<< HEAD
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
=======
    compoundVariants : [
      // Confirm Button
      {state : "active", width: "xl", className: "bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold text-black text-[16px]"},
      {state : "default", width: "xl", className: "h-11 rounded-none"},
      // GameEnd Button
      {state : "active", width: "lg", className: "bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold text-black text-[16px]"},
>>>>>>> 9fcebd0 (feat : button들 구현)
    ],
    defaultVariants: {
      state: "default",
      width: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

<<<<<<< HEAD
export const Button = ({ width, children, state, ...props }: ButtonProps) => {
=======
export const Button = ({
  width,
  children,
  state,
  className,
  ...props
}: ButtonProps) => {
>>>>>>> 9fcebd0 (feat : button들 구현)
  return (
    <button
      type="button"
      className={twMerge(buttonStyles({ width, state }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
