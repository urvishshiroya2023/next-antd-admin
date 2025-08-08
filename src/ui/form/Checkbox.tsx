import React, { forwardRef } from 'react';
import { Checkbox as AntdCheckbox, Typography } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const { Group: CheckboxGroup } = AntdCheckbox;
const { Text } = Typography;

interface CheckboxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface CheckboxProps extends React.ComponentProps<typeof AntdCheckbox> {
  name: string;
  label?: string;
  options?: CheckboxOption[];
  wrapperClassName?: string;
  errorClassName?: string;
  direction?: 'horizontal' | 'vertical';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  name,
  label,
  options,
  wrapperClassName = '',
  errorClassName = '',
  direction = 'horizontal',
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();

  if (options) {
    return (
      <div className={`form-control ${wrapperClassName}`}>
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              {...field}
              {...rest}
              options={options}
              className={`flex ${direction === 'vertical' ? 'flex-col gap-2' : 'gap-4'}`}
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
  }

  return (
    <div className={`form-control ${wrapperClassName}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntdCheckbox
            {...field}
            {...rest}
            ref={ref}
            checked={field.value}
            onChange={e => field.onChange(e.target.checked)}
          >
            {label}
          </AntdCheckbox>
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

Checkbox.displayName = 'Checkbox';
