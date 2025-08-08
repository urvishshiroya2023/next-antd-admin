import * as yup from 'yup';

export const commonValidators = {
  required: (message = 'This field is required') => yup.string().required(message),
  email: (message = 'Please enter a valid email') => yup.string().email(message),
  min: (min: number, message = `Must be at least ${min} characters`) => 
    yup.string().min(min, message),
  max: (max: number, message = `Must be at most ${max} characters`) =>
    yup.string().max(max, message),
  password: (message = 'Password must be at least 8 characters') =>
    yup.string().min(8, message),
  confirmPassword: (ref: string, message = 'Passwords must match') =>
    yup.string().oneOf([yup.ref(ref), null], message),
  number: (message = 'Must be a number') => yup.number().typeError(message),
  positive: (message = 'Must be a positive number') =>
    yup.number().positive(message),
  url: (message = 'Must be a valid URL') => yup.string().url(message),
};

// Example schema for a login form
export const loginSchema = yup.object().shape({
  email: commonValidators.email().required('Email is required'),
  password: commonValidators.required('Password is required'),
});

// Example schema for a registration form
export const registerSchema = yup.object().shape({
  name: commonValidators.required('Name is required'),
  email: commonValidators.email().required('Email is required'),
  password: commonValidators.password().required('Password is required'),
  confirmPassword: commonValidators
    .confirmPassword('password')
    .required('Please confirm your password'),
});

export type ValidationSchema = yup.AnyObjectSchema;
