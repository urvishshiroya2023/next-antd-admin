import { ErrorMessage } from '@hookform/error-message';
import { Input as AntdInput, InputProps as AntdInputProps, InputRef, Typography } from 'antd';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input/TextArea';
import React, { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const { Text } = Typography;

interface BaseInputProps {
  label?: string;
  wrapperClassName?: string;
  errorClassName?: string;
  leftIcon?: React.ReactNode;
}

export interface InputProps
  extends Omit<AntdInputProps, 'name' | 'defaultValue' | 'value'>,
    BaseInputProps {
  name: string;
}

export const Input = forwardRef<InputRef, InputProps>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  leftIcon,
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={`form-control ${wrapperClassName}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative w-full">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {leftIcon}
              </div>
            )}
            <AntdInput
              {...field}
              {...rest}
              ref={(e) => {
                field.ref(e);
                if (typeof ref === 'function') {
                  ref(e);
                } else if (ref) {
                  (ref as React.MutableRefObject<InputRef | null>).current = e;
                }
              }}
              status={errors[name] ? 'error' : undefined}
              className={`w-full ${leftIcon ? 'pl-10' : ''}`}
            />
          </div>
        )}
      />
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ message }) => (
          <Text type="danger" className={`text-xs mt-1 ${errorClassName}`}>
            {message}
          </Text>
        )}
      />
    </div>
  );
});

Input.displayName = 'Input';

//
// PasswordInput wrapper
//

export interface PasswordInputProps
  extends Omit<AntdInputProps, 'name' | 'defaultValue' | 'value'>,
    BaseInputProps {
  name: string;
}

export const PasswordInput = forwardRef<InputRef, PasswordInputProps>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={`form-control ${wrapperClassName}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntdInput.Password
            {...field}
            {...rest}
            ref={ref}
            status={errors[name] ? 'error' : undefined}
          />
        )}
      />
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ message }) => (
          <Text type="danger" className={`text-xs mt-1 ${errorClassName}`}>
            {message}
          </Text>
        )}
      />
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

//
// TextArea wrapper
//

export interface TextAreaProps extends Omit<AntdTextAreaProps, 'name' | 'defaultValue' | 'value'>, BaseInputProps {
  name: string;
}

export const TextArea = forwardRef<InputRef, TextAreaProps>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={`form-control ${wrapperClassName}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntdInput.TextArea
            {...field}
            {...rest}
            ref={ref}
            status={errors[name] ? 'error' : undefined}
          />
        )}
      />
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ message }) => (
          <Text type="danger" className={`text-xs mt-1 ${errorClassName}`}>
            {message}
          </Text>
        )}
      />
    </div>
  );
});

TextArea.displayName = 'TextArea';

//
// Search wrapper
//

export interface SearchProps
  extends Omit<React.ComponentProps<typeof AntdInput.Search>, 'name' | 'defaultValue' | 'value'>,
    BaseInputProps {
  name: string;
}

export const Search = forwardRef<InputRef, SearchProps>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={`form-control ${wrapperClassName}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntdInput.Search
            {...field}
            {...rest}
            ref={ref}
            status={errors[name] ? 'error' : undefined}
          />
        )}
      />
      <ErrorMessage
        name={name}
        errors={errors}
        render={({ message }) => (
          <Text type="danger" className={`text-xs mt-1 ${errorClassName}`}>
            {message}
          </Text>
        )}
      />
    </div>
  );
});

Search.displayName = 'Search';

export default Input;
