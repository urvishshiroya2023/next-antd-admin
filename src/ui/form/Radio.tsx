import React, { forwardRef } from 'react';
import { Radio as AntdRadio, Typography } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const { Group: RadioGroup, Button: RadioButton } = AntdRadio;
const { Text } = Typography;

interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioProps extends React.ComponentProps<typeof AntdRadio> {
  name: string;
  label?: string;
  options: RadioOption[];
  wrapperClassName?: string;
  errorClassName?: string;
  direction?: 'horizontal' | 'vertical';
  buttonStyle?: 'outline' | 'solid';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  name,
  label,
  options,
  wrapperClassName = '',
  errorClassName = '',
  direction = 'horizontal',
  buttonStyle,
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();
  const isButtonGroup = buttonStyle === 'outline' || buttonStyle === 'solid';
  const RadioComponent = isButtonGroup ? RadioButton : AntdRadio;

  return (
    <div className={`form-control ${wrapperClassName}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            {...field}
            {...rest}
            className={`flex ${direction === 'vertical' ? 'flex-col gap-2' : 'gap-4'}`}
            buttonStyle={buttonStyle}
          >
            {options.map((option) => (
              <RadioComponent
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </RadioComponent>
            ))}
          </RadioGroup>
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

Radio.displayName = 'Radio';
