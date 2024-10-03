import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn(className, "bg-white rounded-lg shadow-md p-6 flex flex-col h-full border-2 border-gray-100")}>
      {children}
    </div>
  );
};

export default Container;