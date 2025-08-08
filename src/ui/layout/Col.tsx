import React, { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

type ColSize = number | { span?: number; offset?: number; order?: number; pull?: number; push?: number };

export interface ColProps {
  children: ReactNode;
  span?: number;
  xs?: number | ColSize;
  sm?: number | ColSize;
  md?: number | ColSize;
  lg?: number | ColSize;
  xl?: number | ColSize;
  xxl?: number | ColSize;
  offset?: number;
  order?: number;
  pull?: number;
  push?: number;
  className?: string;
  style?: CSSProperties;
  gutter?: number | [number, number];
}

const Col: React.FC<ColProps> = ({
  children,
  span,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  offset = 0,
  order,
  pull,
  push,
  className = '',
  style = {},
  gutter = 0,
  ...rest
}) => {
  const getSizeClass = (size: string | number | ColSize | undefined, sizeName: string) => {
    if (typeof size === 'number') {
      return {
        [`ant-col-${sizeName}-${size}`]: size >= 0,
      };
    } else if (size && typeof size === 'object') {
      const classes: Record<string, boolean> = {};
      if (size.span !== undefined) {
        classes[`ant-col-${sizeName}-${size.span}`] = true;
      }
      if (size.offset !== undefined) {
        classes[`ant-col-${sizeName}-offset-${size.offset}`] = true;
      }
      if (size.order !== undefined) {
        classes[`ant-col-${sizeName}-order-${size.order}`] = true;
      }
      return classes;
    }
    return {};
  };

  const colClasses = classNames(
    'ant-col',
    {
      [`ant-col-${span}`]: span !== undefined,
      [`ant-col-offset-${offset}`]: offset,
      [`ant-col-order-${order}`]: order,
      [`ant-col-pull-${pull}`]: pull,
      [`ant-col-push-${push}`]: push,
      ...getSizeClass(xs, 'xs'),
      ...getSizeClass(sm, 'sm'),
      ...getSizeClass(md, 'md'),
      ...getSizeClass(lg, 'lg'),
      ...getSizeClass(xl, 'xl'),
      ...getSizeClass(xxl, 'xxl'),
    },
    className
  );

  const colStyle: CSSProperties = {
    paddingLeft: Array.isArray(gutter) ? gutter[0] / 2 : gutter / 2,
    paddingRight: Array.isArray(gutter) ? gutter[0] / 2 : gutter / 2,
    paddingTop: Array.isArray(gutter) ? gutter[1] / 2 : 0,
    paddingBottom: Array.isArray(gutter) ? gutter[1] / 2 : 0,
    ...style,
  };

  return (
    <div className={colClasses} style={colStyle} {...rest}>
      {children}
    </div>
  );
};

export default Col;
