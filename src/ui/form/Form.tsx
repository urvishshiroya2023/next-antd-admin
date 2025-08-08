import React, { ReactNode } from 'react';
import { Form as AntdForm } from 'antd';
import { FormProvider, useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ValidationSchema } from '../utils/validationSchemas';

interface FormProps<T extends FieldValues> {
  children: ReactNode | ((methods: UseFormReturn<T>) => ReactNode);
  onSubmit: (data: T) => void;
  defaultValues?: T;
  schema?: ValidationSchema;
  layout?: 'horizontal' | 'vertical' | 'inline';
  className?: string;
}

export function Form<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  schema,
  layout = 'vertical',
  className = '',
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues: defaultValues as any,
    resolver: schema ? yupResolver(schema) : undefined,
  });

  return (
    <FormProvider {...methods}>
      <AntdForm
        layout={layout}
        onFinish={methods.handleSubmit(onSubmit)}
        className={className}
      >
        {typeof children === 'function' ? children(methods) : children}
      </AntdForm>
    </FormProvider>
  );
}

export { FormItem } from 'antd';
