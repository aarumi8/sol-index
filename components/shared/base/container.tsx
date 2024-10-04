import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn(className, "bg-background rounded-lg shadow-md p-6 flex flex-col h-full border border-input")}>
      {children}
    </div>
  );
};

export default Container;