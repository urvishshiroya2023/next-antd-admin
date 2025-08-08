import { Card as AntdCard, Skeleton } from 'antd';
import React, { ReactNode } from 'react';
import Space from '../layout/Space';

const { Meta } = AntdCard;

export interface CardProps extends React.ComponentProps<typeof AntdCard> {
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  noPadding?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  actions?: ReactNode[];
  cover?: ReactNode;
  footer?: ReactNode;
  size?: 'default' | 'small';
}

export const Card = ({
  title,
  extra,
  children,
  loading = false,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  noPadding = false,
  hoverable = false,
  bordered = true,
  shadow = 'md',
  actions,
  cover,
  footer,
  size = 'default',
  ...rest
}: CardProps) => {
  const shadowClass = shadow !== 'none' ? `shadow-${shadow}` : '';
  const paddingClass = size === 'small' ? 'p-3' : '';

  const cardHeader = title || extra ? (
    <div className={`flex items-center justify-between ${headerClassName}`}>
      {title && <div className="text-lg font-medium">{title}</div>}
      {extra && <div>{extra}</div>}
    </div>
  ) : null;

  return (
    <AntdCard
      className={`${shadowClass} ${className} ${
        hoverable ? 'hover:shadow-lg transition-shadow duration-200' : ''
      }`}
      variant={bordered ? 'outlined' : 'borderless'}
      hoverable={hoverable}
      size={size}
      {...rest}
      title={cardHeader}
      cover={cover}
      actions={actions}
    >
      <Skeleton loading={loading} active>
        <div className={`${!noPadding ? paddingClass : ''} ${bodyClassName}`}>
          {children}
        </div>
        {footer && (
          <div className="border-t border-gray-100 mt-4 pt-4">
            {footer}
          </div>
        )}
      </Skeleton>
    </AntdCard>
  );
};

Card.Meta = Meta;

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

const CardHeader = ({
  title,
  description,
  extra,
  className = '',
}: CardHeaderProps) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
    {extra && <div>{extra}</div>}
  </div>
);

Card.Header = CardHeader;

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const CardFooter = ({
  children,
  className = '',
  align = 'right',
}: CardFooterProps) => {
  const alignment = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <div className={`mt-6 flex ${alignment} ${className}`}>
      <Space size="xxl">{children}</Space>
    </div>
  );
};

Card.Footer = CardFooter;

export default Card;
