import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> a6a7be4 (feat : RoleButton 컴포넌트 구현)
=======
>>>>>>> 83c7f93 (wip-page:"팟 상세" 페이지 구현 중)
=======
=======

>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
const buttonStyles = cva(
  clsx(
    // 기본 모양
    "w-18 h-9.5 py-3 gap-2",
    "flex flex-col items-center justify-center",
    "rounded-lg cursor-pointer",
    "text-white",
  ),
  {
    variants: {
      state: {
        default: "border border-main-dark1",
        active: "",
      },
      roleType: {
        police: "",
        thief: "",
        random: "",
      },
    },
    compoundVariants: [
      { state: "active", roleType: "police", className: "bg-[#3B82F6]" },
      { state: "active", roleType: "thief", className: "bg-[#1E293B]" },
      { state: "active", roleType: "random", className: "bg-[#8B5CF6]" },
    ],
    defaultVariants: {
      state: "default",
    },
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  },
=======
  }
>>>>>>> a6a7be4 (feat : RoleButton 컴포넌트 구현)
=======
  },
>>>>>>> 83c7f93 (wip-page:"팟 상세" 페이지 구현 중)
=======
  },
=======
  }
>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
);

// Role 정의
const ROLE_DATA = {
  police: { icon: "👮🏻", label: "경찰" },
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
  thief: { icon: "🥷🏻", label: "도둑" },
  random: { icon: "🎲", label: "랜덤" },
} as const;

interface RoleButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
=======
  thief:  { icon: "🥷🏻", label: "도둑" },
  random: { icon: "🎲", label: "랜덤" },
} as const;

interface RoleButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
<<<<<<< HEAD
>>>>>>> a6a7be4 (feat : RoleButton 컴포넌트 구현)
=======
  thief: { icon: "🥷🏻", label: "도둑" },
  random: { icon: "🎲", label: "랜덤" },
} as const;

interface RoleButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
>>>>>>> 83c7f93 (wip-page:"팟 상세" 페이지 구현 중)
=======
>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
    VariantProps<typeof buttonStyles> {
  roleType: keyof typeof ROLE_DATA;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export const RoleButton = ({
  className,
  state,
  roleType,
  ...props
}: RoleButtonProps) => {
  const content = ROLE_DATA[roleType];
=======
export const RoleButton = ({ 
  className, 
  state, 
  roleType, 
  ...props 
}: RoleButtonProps) => {
  
=======
export const RoleButton = ({ state, roleType, ...props }: RoleButtonProps) => {
>>>>>>> 83c7f93 (wip-page:"팟 상세" 페이지 구현 중)
=======
export const RoleButton = ({ state, roleType, ...props }: RoleButtonProps) => {
=======
export const RoleButton = ({ 
  className, 
  state, 
  roleType, 
  ...props 
}: RoleButtonProps) => {
  
>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
  const content = ROLE_DATA[roleType];
<<<<<<< HEAD

>>>>>>> a6a7be4 (feat : RoleButton 컴포넌트 구현)
=======
>>>>>>> e75944f (feat : RoleButton 컴포넌트 구현)
  return (
    <button
      type="button"
      className={buttonStyles({ state, roleType })}
      {...props}
    >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
      <div className="flex w-full items-center justify-center gap-2 text-sm">
        <p className="">{content.icon}</p>
        <p className="leading-[140%] font-normal tracking-[-0.4px] whitespace-nowrap">
          {content.label}
        </p>
      </div>
    </button>
  );
};
=======
      <div className="w-full flex items-center justify-center gap-2 text-sm">
<<<<<<< HEAD
=======
      <div className="flex w-full items-center justify-center gap-2 text-sm">
>>>>>>> 83c7f93 (wip-page:"팟 상세" 페이지 구현 중)
        <p className="">{content.icon}</p>
        <p className="leading-[140%] font-normal tracking-[-0.4px] whitespace-nowrap">
          {content.label}
        </p>
=======
        <p className="">{content.icon}</p>
        <p className="font-normal whitespace-nowrap leading-[140%] tracking-[-0.4px]">{content.label}</p>
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
      </div>
    </button>
  );
};
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> a6a7be4 (feat : RoleButton 컴포넌트 구현)
=======
>>>>>>> 83c7f93 (wip-page:"팟 상세" 페이지 구현 중)
=======
>>>>>>> dfa6f9e (feat : RoleButton 컴포넌트 구현)
>>>>>>> 9c38835 (feat : RoleButton 컴포넌트 구현)
