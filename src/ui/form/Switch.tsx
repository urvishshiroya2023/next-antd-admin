import React, { forwardRef } from 'react';
import { Switch as AntdSwitch, Typography } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const { Text } = Typography;

export interface SwitchProps extends React.ComponentProps<typeof AntdSwitch> {
  name: string;
  label?: string;
  wrapperClassName?: string;
  errorClassName?: string;
  labelPosition?: 'left' | 'right';
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  labelPosition = 'right',
  ...rest
}, ref) => {
  const { control, formState: { errors } } = useFormContext();

  const switchElement = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AntdSwitch
          {...field}
          {...rest}
          ref={ref}
          checked={field.value}
          onChange={(checked, e) => {
            field.onChange(checked);
            if (rest.onChange) {
              rest.onChange(checked, e);
            }
          }}
        />
      )}
    />
  );

  return (
    <div className={`form-control ${wrapperClassName}`}>
      <div className="flex items-center gap-2">
        {label && labelPosition === 'left' && (
          <label className="text-sm font-medium">{label}</label>
        )}
        {switchElement}
        {label && labelPosition === 'right' && (
          <label className="text-sm font-medium">{label}</label>
        )}
      </div>
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

Switch.displayName = 'Switch';
