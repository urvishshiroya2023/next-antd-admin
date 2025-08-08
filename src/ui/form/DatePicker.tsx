'use client'
import { ErrorMessage } from '@hookform/error-message';
import { DatePicker as AntdDatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const { RangePicker: AntdRangePicker } = AntdDatePicker;
const { Text } = Typography;

export interface DatePickerProps extends React.ComponentProps<typeof AntdDatePicker> {
  name: string;
  label?: string;
  wrapperClassName?: string;
  errorClassName?: string;
  format?: string;
}

export const DatePicker = forwardRef<typeof AntdDatePicker, DatePickerProps>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  format = 'YYYY-MM-DD',
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
          <AntdDatePicker
            {...field}
            {...rest}
            format={format}
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
            value={field.value ? dayjs(field.value) : null}
            onChange={(date, dateString) => {
              // field.onChange(date ? date?.toDate() as Date : null);
            }}
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

DatePicker.displayName = 'DatePicker';

// Range Picker Component
export const RangePicker = forwardRef<typeof AntdRangePicker, any>(({
  name,
  label,
  wrapperClassName = '',
  errorClassName = '',
  format = 'YYYY-MM-DD',
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
          <AntdRangePicker
            {...field}
            {...rest}
            format={format}
            status={errors[name] ? 'error' : ''}
            className="w-full"
            ref={ref as any}
            value={field.value?.map((date: Date) => (date ? dayjs(date) : null))}
            onChange={(dates, dateStrings) => {
              field.onChange(dates ? dates.map(date => date ? date.toDate() : null) : []);
            }}
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

RangePicker.displayName = 'RangePicker';
