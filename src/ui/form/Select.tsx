import React, { forwardRef } from 'react';
import { Select as AntdSelect, Typography } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const { Option } = AntdSelect;
const { Text } = Typography;

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.ComponentProps<typeof AntdSelect> {
  name: string;
  label?: string;
  options: SelectOption[];
  wrapperClassName?: string;
  errorClassName?: string;
  mode?: 'multiple' | 'tags' | undefined;
}

export const Select = forwardRef<typeof AntdSelect, SelectProps>(({
  name,
  label,
  options,
  wrapperClassName = '',
  errorClassName = '',
  mode,
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
          <AntdSelect
            {...field}
            {...rest}
            mode={mode}
            status={errors[name] ? 'error' : ''}
            className="w-full"
            ref={(e) => {
              if (typeof ref === 'function') {
                ref(e);
              } else if (ref) {
                // @ts-ignore
                ref.current = e;
              }
            }}
          >
            {options.map((option) => (
              <Option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Option>
            ))}
          </AntdSelect>
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

Select.displayName = 'Select';

export const MultiSelect = forwardRef<typeof AntdSelect, SelectProps>((props, ref) => (
  <Select mode="multiple" {...props} ref={ref} />
));

MultiSelect.displayName = 'MultiSelect';
