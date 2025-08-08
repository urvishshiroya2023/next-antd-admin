import React, { ReactNode } from 'react';
import { Space as AntdSpace } from 'antd';

type SpaceSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;

const spaceSizeMap: Record<SpaceSize, string> = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export interface SpaceProps {
  children: ReactNode;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
  split?: ReactNode;
  block?: boolean;
}

export const Space: React.FC<SpaceProps> = ({
  children,
  size = 'md',
  direction = 'horizontal',
  align,
  wrap = false,
  className = '',
  style = {},
  split,
  block = false,
}) => {
  const getSize = (sizeValue: SpaceSize) => {
    if (typeof sizeValue === 'number') {
      return `${sizeValue}px`;
    }
    return spaceSizeMap[sizeValue] || spaceSizeMap.md;
  };

  const spaceStyle: React.CSSProperties = {
    ...style,
    width: block ? '100%' : style?.width,
  };

  if (Array.isArray(size)) {
    spaceStyle.rowGap = getSize(size[1]);
    spaceStyle.columnGap = getSize(size[0]);
  } else {
    const gapSize = getSize(size);
    spaceStyle.gap = gapSize;
  }

  return (
    <AntdSpace
      direction={direction}
      align={align}
      wrap={wrap}
      className={`${block ? 'w-full' : ''} ${className}`}
      style={spaceStyle}
      split={split}
    >
      {children}
    </AntdSpace>
  );
};

// Add display name for better debugging
Space.displayName = 'Space';

export default Space;
