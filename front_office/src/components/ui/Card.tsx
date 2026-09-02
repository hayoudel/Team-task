import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm ${
        hover ? "hover:shadow-lg transition-all duration-200" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
