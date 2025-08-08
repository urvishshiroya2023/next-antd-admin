import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  message: React.ReactNode;
  description?: React.ReactNode;
  duration?: number;
  key?: string;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onClose?: () => void;
}

class ToastService {
  private static instance: ToastService;
  private notification: NotificationInstance;

  private constructor() {
    const { notification: antdNotification } = require('antd');
    this.notification = antdNotification;
    this.setupGlobalConfig();
  }

  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  private setupGlobalConfig() {
    this.notification.config({
      placement: 'topRight',
      duration: 4.5,
      maxCount: 3,
    });
  }

  private open(type: NotificationType, options: ToastOptions) {
    const { message, description, ...rest } = options;
    this.notification[type]({
      message,
      description,
      ...rest,
    });
  }

  success(options: ToastOptions) {
    this.open('success', options);
  }

  error(options: ToastOptions) {
    this.open('error', options);
  }

  info(options: ToastOptions) {
    this.open('info', options);
  }

  warning(options: ToastOptions) {
    this.open('warning', options);
  }

  destroy() {
    this.notification.destroy();
  }
}

// Export a singleton instance
export const toast = ToastService.getInstance();

// Hook for functional components
export const useToast = () => {
  return toast;
};

// React component wrapper
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This component is a no-op, but allows us to use the ToastProvider in the app
  // The actual notification is handled by the singleton instance
  return <>{children}</>;
};

// Convenience functions
export const showSuccess = (message: string, description?: string) => {
  toast.success({ message, description });
};

export const showError = (message: string, description?: string) => {
  toast.error({ message, description });
};

export const showInfo = (message: string, description?: string) => {
  toast.info({ message, description });
};

export const showWarning = (message: string, description?: string) => {
  toast.warning({ message, description });
};
