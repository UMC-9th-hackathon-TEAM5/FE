// src/components/common/Card/BaseCard.tsx
import React from "react";

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function BaseCard({ children, className = "" }: BaseCardProps) {
  return (
    <section
      className={`bg-main-dark2 flex h-fit w-77.5 flex-col gap-5 p-4 ${className}`}
    >
      {children}
    </section>
  );
}
