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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    "text-white leading-[140%] tracking-[-0.4px] font-medium",
=======
    "text-white text-medium leading-[140%] tracking-[-0.4px] font-medium",
>>>>>>> 666d093 (feat : 버튼 컴포넌트 구현)
=======
    "text-white leading-[140%] tracking-[-0.4px] font-medium",
>>>>>>> d3488f9 (feat : button들 구현)
=======
    "text-white text-medium leading-[140%] tracking-[-0.4px] font-medium",
>>>>>>> cb7c77f (feat : 버튼 컴포넌트 구현)
  ),
  {
    variants: {
      width: {
<<<<<<< HEAD
<<<<<<< HEAD
        default: "w-18",
        xl: "w-[310px]",
        lg: "w-[300px]",
        md: "w-[149px]",
        base: "w-[72px]",
        sm: "w-[60px]",
      },
      // state == style?
=======
        default : "w-18",
=======
        default: "w-18",
>>>>>>> cb7c77f (feat : 버튼 컴포넌트 구현)
        xl: "w-[310px]",
        md: "w-[149px]",
        sm: "w-[60px]",
      },
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 666d093 (feat : 버튼 컴포넌트 구현)
=======
      // state == style?
>>>>>>> d3488f9 (feat : button들 구현)
=======
>>>>>>> cb7c77f (feat : 버튼 컴포넌트 구현)
      state: {
        // default : inactive
        default: "border border-main-dark1",
        active: "bg-main-dark1",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        arrive: "bg-[#10B981]",
        non_arrive: "bg-[#E3E6EA]",
        escape: "bg-[#EF4444]",
        arrest: "bg-black border border-[#808080]",
        prison: "bg-[#EF444433] border border-[#EF4444]",
        instagram:
          "rounded-none border-2 border-transparent [background:linear-gradient(#1f1f1f,#1f1f1f)_padding-box,linear-gradient(to_right,#833AB4,#EE2A7B,#F9CE34)_border-box] h-11",
      },
    },
    compoundVariants: [
      // Confirm Button
      {
        state: "active",
        width: "xl",
        className:
          "bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold text-black text-[16px]",
      },
      { state: "default", width: "xl", className: "h-11 rounded-none" },
      // GameEnd Button
      {
        state: "active",
        width: "lg",
        className:
          "bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold text-black text-[16px]",
      },
=======
=======
        arrive: "bg-[#10B981]",
        non_arrive : "bg-[#E3E6EA]",
        escape : "bg-[#EF4444]",
        arrest : "bg-black border border-[#808080]",
        prison : "bg-[#EF444433] border border-[#EF4444]",
        instagram : "rounded-none border-2 border-transparent [background:linear-gradient(#1f1f1f,#1f1f1f)_padding-box,linear-gradient(to_right,#833AB4,#EE2A7B,#F9CE34)_border-box] h-11",
>>>>>>> d3488f9 (feat : button들 구현)
      },
    },
    compoundVariants : [
      // Confirm Button
      {state : "active", width: "xl", className: "bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold text-black text-[16px]"},
      {state : "default", width: "xl", className: "h-11 rounded-none"},
<<<<<<< HEAD
      // 참여자 목록 - 도착/미도착
      {state : "active", width: "sm", className: "bg-[#10B981] text-sm"},
      {state : "default", width : "sm", className: "bg-[#E3E6EA] text-[#808080] text-sm"},
>>>>>>> 666d093 (feat : 버튼 컴포넌트 구현)
=======
      // GameEnd Button
      {state : "active", width: "lg", className: "bg-main rounded-none shadow-[2px_2px_0_0_#008E58] h-11 font-bold text-black text-[16px]"},
>>>>>>> d3488f9 (feat : button들 구현)
=======
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
>>>>>>> cb7c77f (feat : 버튼 컴포넌트 구현)
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
export const Button = ({
  width,
  children,
  state,
<<<<<<< HEAD
<<<<<<< HEAD
  className,
=======
>>>>>>> 666d093 (feat : 버튼 컴포넌트 구현)
=======
  className,
>>>>>>> d3488f9 (feat : button들 구현)
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
<<<<<<< HEAD
<<<<<<< HEAD
      className={twMerge(buttonStyles({ width, state }), className)}
=======
      className={twMerge(buttonStyles({ width, state }))}
>>>>>>> 666d093 (feat : 버튼 컴포넌트 구현)
=======
      className={twMerge(buttonStyles({ width, state }), className)}
>>>>>>> d3488f9 (feat : button들 구현)
=======
export const Button = ({ width, children, state, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={twMerge(buttonStyles({ width, state }))}
>>>>>>> cb7c77f (feat : 버튼 컴포넌트 구현)
      {...props}
    >
      {children}
    </button>
  );
};
