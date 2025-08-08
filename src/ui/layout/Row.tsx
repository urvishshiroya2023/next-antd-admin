import React, { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

export interface RowProps {
  children: ReactNode;
  gutter?: number | [number, number];
  align?: 'top' | 'middle' | 'bottom';
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

const Row: React.FC<RowProps> = ({
  children,
  gutter = 0,
  align = 'top',
  justify = 'start',
  wrap = true,
  className = '',
  style = {},
  ...rest
}) => {
  const rowStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: wrap ? 'wrap' : 'nowrap',
    marginLeft: typeof gutter === 'number' ? -gutter / 2 : -gutter[0] / 2,
    marginRight: typeof gutter === 'number' ? -gutter / 2 : -gutter[0] / 2,
    marginTop: typeof gutter === 'number' ? 0 : -gutter[1] / 2,
    marginBottom: typeof gutter === 'number' ? 0 : -gutter[1] / 2,
    alignItems: align,
    justifyContent: justify,
    ...style,
  };

  return (
    <div className={classNames('ant-row', className)} style={rowStyle} {...rest}>
      {children}
    </div>
  );
};

export default Row;
