import { Card as AntdCard, CardProps, Typography } from 'antd';
import { ReactNode } from 'react';

const { Title } = Typography;

type TCardProps = CardProps & {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
};

const Card = ({
  title,
  extra,
  children,
  className = '',
  noPadding = false,
  ...props
}: TCardProps) => {
  return (
    <AntdCard
      className={`${className}`}
      styles={{body:{padding:"12px"}}} // ✅ Updated for AntD v5
      {...props}
    >
      {(title || extra) && (
        <div className="flex justify-between items-center mb-4">
          {title && <Title level={5} className="!mb-0">{title}</Title>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      {children}
    </AntdCard>
  );
};

export default Card;
