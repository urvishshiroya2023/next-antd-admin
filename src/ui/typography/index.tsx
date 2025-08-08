import React, { ReactNode } from 'react';
import classNames from 'classnames';

type TypographyType = 'secondary' | 'success' | 'warning' | 'danger' | 'primary';
type TitleLevel = 1 | 2 | 3 | 4 | 5;

interface BaseProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: TypographyType;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  italic?: boolean;
  disabled?: boolean;
  mark?: boolean;
  code?: boolean;
  copyable?: boolean | { text: string; onCopy?: () => void };
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TextProps extends BaseProps {
  ellipsis?: boolean | { rows?: number; expandable?: boolean; onExpand?: () => void };
}

export interface TitleProps extends BaseProps {
  level?: TitleLevel;
}

export interface ParagraphProps extends TextProps {
  spacing?: 'none' | 'tight' | 'normal' | 'loose';
}

const Typography = {
  Text: ({
    children,
    className = '',
    type,
    underline = false,
    delete: del = false,
    strong = false,
    italic = false,
    disabled = false,
    mark = false,
    code = false,
    copyable,
    ellipsis,
    onClick,
    style = {},
    ...rest
  }: TextProps) => {
    const classes = classNames(
      'ant-typography',
      {
        [`ant-typography-${type}`]: type,
        'ant-typography-underline': underline,
        'ant-typography-delete': del,
        'ant-typography-strong': strong,
        'ant-typography-italic': italic,
        'ant-typography-disabled': disabled,
        'ant-typography-mark': mark,
        'ant-typography-code': code,
        'ant-typography-ellipsis': ellipsis === true,
      },
      className
    );

    return (
      <span className={classes} style={style} onClick={onClick} {...rest}>
        {children}
      </span>
    );
  },

  Title: ({
    children,
    level = 1,
    className = '',
    type,
    ...rest
  }: TitleProps) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    const classes = classNames(
      'ant-typography',
      `ant-typography-h${level}`,
      {
        [`ant-typography-${type}`]: type,
      },
      className
    );

    return (
      <Component className={classes} {...rest}>
        {children}
      </Component>
    );
  },

  Paragraph: ({
    children,
    className = '',
    spacing = 'normal',
    ...rest
  }: ParagraphProps) => {
    const classes = classNames(
      'ant-typography',
      'ant-typography-paragraph',
      {
        'mb-0': spacing === 'none',
        'mb-2': spacing === 'tight',
        'mb-4': spacing === 'normal',
        'mb-6': spacing === 'loose',
      },
      className
    );

    return (
      <p className={classes} {...rest}>
        {children}
      </p>
    );
  },
};

export const { Text, Title, Paragraph } = Typography;
export default Typography;
