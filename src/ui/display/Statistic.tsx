import React, { ReactNode } from 'react';
import classNames from 'classnames';

type NumberType = 'success' | 'warning' | 'danger' | 'secondary' | 'primary';

interface StatisticProps {
  title?: ReactNode;
  value: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  className?: string;
  style?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  loading?: boolean;
  type?: NumberType;
  size?: 'default' | 'small' | 'large';
}

const Statistic: React.FC<StatisticProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  className = '',
  style = {},
  valueStyle = {},
  titleStyle = {},
  loading = false,
  type,
  size = 'default',
}) => {
  const renderValue = () => {
    if (loading) {
      return <div className="ant-skeleton ant-skeleton-active ant-skeleton-paragraph"></div>;
    }

    let displayValue = value;
    
    // Format number with precision if it's a number
    if (typeof value === 'number' && precision !== undefined) {
      displayValue = value.toFixed(precision);
    }

    return (
      <div 
        className={classNames('ant-statistic-content-value', {
          [`ant-statistic-content-value-${type}`]: type,
          'text-2xl': size === 'small',
          'text-3xl': size === 'default',
          'text-4xl': size === 'large',
        })}
        style={valueStyle}
      >
        {prefix && <span className="ant-statistic-content-prefix">{prefix}</span>}
        <span className="ant-statistic-content-value-int">{displayValue}</span>
        {suffix && <span className="ant-statistic-content-suffix">{suffix}</span>}
      </div>
    );
  };

  return (
    <div 
      className={classNames('ant-statistic', className)} 
      style={style}
    >
      {title && (
        <div 
          className={classNames('ant-statistic-title', {
            'text-sm': size === 'small',
            'text-base': size === 'default' || size === 'large',
          })}
          style={titleStyle}
        >
          {title}
        </div>
      )}
      <div className="ant-statistic-content">
        {renderValue()}
      </div>
    </div>
  );
};

export default Statistic;
