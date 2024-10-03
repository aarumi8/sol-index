import clsx from 'clsx';
import React from 'react';

type TitleSize = 'xss' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
}

export const Title: React.FC<Props> = ({ text, size = 'sm', className }) => {
  const mapTagBySize = {
    xss: 'h6',
    xs: 'h5',
    sm: 'h4',
    md: 'h3',
    lg: 'h2',
    xl: 'h1',
    '2xl': 'h1',
  } as const;

  const mapClassNameBySize = {
    xss: 'text-[12px] ys-text',
    xs: 'text-[16px] ys-text',
    sm: 'text-[22px] ys-text',
    md: 'text-[26px] ys-text',
    lg: 'text-[32px] ys-display',
    xl: 'text-[40px] ys-display',
    '2xl': 'text-[48px] ys-display',
  } as const;

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};