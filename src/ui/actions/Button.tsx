import React, { forwardRef, ForwardedRef } from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { Space } from '../layout/Space';

type SpaceSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;

type AntdButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text';
type ButtonSize = 'large' | 'middle' | 'small';
type ButtonShape = 'default' | 'circle' | 'round';
type ButtonHtmlType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'link' | 'dashed' | 'text' | 'filled';
type ColorScheme = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';

export interface ButtonProps extends Omit<AntdButtonProps, 'type' | 'size'> {
  type?: AntdButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  htmlType?: ButtonHtmlType;
  icon?: React.ReactNode;
  loading?: boolean | { delay?: number };
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  ghost?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // Custom props
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'solid' | 'outlined' | 'ghost' | 'link' | 'dashed' | 'text' | 'filled';
  colorScheme?: ColorScheme;
  isLoading?: boolean;
  spinner?: React.ReactElement;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
  type = 'default',
  size = 'middle',
  shape,
  htmlType = 'button',
  icon,
  loading,
  block,
  danger,
  disabled,
  ghost,
  href,
  target,
  rel,
  className = '',
  style = {},
  children,
  leftIcon,
  rightIcon,
  fullWidth,
  variant,
  colorScheme = 'primary',
  isLoading: isLoadingProp,
  spinner,
  ...rest
}, ref) => {
  // Map our variant to Ant Design's button type
  const getButtonType = (): AntdButtonType => {
    if (variant === 'outlined') return 'default';
    if (variant === 'ghost') return 'text';
    if (variant === 'link') return 'link';
    if (variant === 'dashed') return 'dashed';
    if (variant === 'text') return 'text';
    return type || 'default';
  };

  // Generate button class names based on props
  const buttonClasses = [
    'custom-button',
    `btn-${colorScheme}`,
    variant ? `btn-${variant}` : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle button content with icons
  const buttonContent = (
    <>
      {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </>
  );

  // Handle loading state
  const isLoading = loading || isLoadingProp;
  const loadingIcon = spinner || (
    <span className="btn-loading-icon">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );

  // Handle button variant styles
  const buttonStyle = {
    ...style,
    ...(variant === 'outlined' && {
      borderColor: 'currentColor',
      backgroundColor: 'transparent',
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
    }),
  };

  return (
    <AntdButton
      ref={ref as any}
      type={getButtonType()}
      size={size}
      shape={shape}
      htmlType={htmlType}
      icon={icon}
      loading={isLoading}
      block={block}
      danger={danger}
      disabled={disabled}
      ghost={ghost}
      href={href}
      target={target}
      rel={rel}
      className={buttonClasses}
      style={buttonStyle}
      {...rest}
    >
      {isLoading ? (
        <Space size="sm" direction="horizontal">
          {loadingIcon}
          {children}
        </Space>
      ) : (
        buttonContent
      )}
    </AntdButton>
  );
});

Button.displayName = 'Button';

// Button Group component
export const ButtonGroup = AntdButton.Group;

// Export button types
export type { ButtonType, ButtonSize, ButtonShape, ButtonHtmlType };

export default Button;
