import React from 'react';
import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export interface LoadingProps extends SpinProps {
  /**
   * Whether to show the loading indicator
   * @default true
   */
  loading?: boolean;
  /**
   * Custom description
   */
  tip?: React.ReactNode;
  /**
   * Size of the loading indicator
   * @default 'default'
   */
  size?: 'small' | 'default' | 'large';
  /**
   * Whether to show only the spinner without the background
   * @default false
   */
  simple?: boolean;
  /**
   * Custom styles for the loading container
   */
  containerStyle?: React.CSSProperties;
  /**
   * Additional class name for the loading container
   */
  containerClassName?: string;
  /**
   * Whether to fill the parent container
   * @default false
   */
  full?: boolean;
  /**
   * Whether to center the loading indicator
   * @default true
   */
  center?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  loading = true,
  tip,
  size = 'default',
  simple = false,
  containerStyle = {},
  containerClassName = '',
  full = false,
  center = true,
  children,
  ...rest
}) => {
  if (!loading && children) {
    return <>{children}</>;
  }

  const spinner = (
    <Spin
      indicator={antIcon}
      tip={tip}
      size={size}
      spinning={loading}
      {...rest}
    >
      {children}
    </Spin>
  );

  if (simple) {
    return spinner;
  }

  const containerStyles: React.CSSProperties = {
    width: full ? '100%' : 'auto',
    height: full ? '100%' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: center ? 'center' : 'flex-start',
    justifyContent: center ? 'center' : 'flex-start',
    padding: full ? '2rem' : '1rem',
    ...containerStyle,
  };

  return (
    <div 
      className={`loading-container ${containerClassName}`} 
      style={containerStyles}
    >
      {spinner}
    </div>
  );
};

// Full page loading component
export const PageLoading: React.FC<Omit<LoadingProps, 'full'>> = (props) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 9999,
  }}>
    <Loading full center {...props} />
  </div>
);

// Inline loading component
export const InlineLoading: React.FC<Omit<LoadingProps, 'simple' | 'full'>> = (props) => (
  <Loading simple {...props} />
);

// Loading wrapper component
export const LoadingWrapper: React.FC<LoadingProps> = ({ children, ...props }) => (
  <Loading {...props}>
    {children}
  </Loading>
);

export default Loading;
