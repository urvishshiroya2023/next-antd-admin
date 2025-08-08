import { notification as antdNotification } from 'antd';
import { ArgsProps, NotificationInstance } from 'antd/es/notification/interface';
import { ReactNode } from 'react';

const DEFAULT_DURATION = 4.5; // seconds
const DEFAULT_PLACEMENT = 'topRight' as const;

type NotificationType = 'success' | 'info' | 'warning' | 'error';
type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface NotificationConfig extends Omit<ArgsProps, 'message' | 'description' | 'type'> {
  key?: string;
  message: ReactNode;
  description?: ReactNode;
  type?: NotificationType;
  duration?: number | null;
  placement?: NotificationPlacement;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onClose?: () => void;
}

class NotificationService {
  private static instance: NotificationService;
  private notification: NotificationInstance;
  private defaultConfig: Partial<NotificationConfig> = {
    duration: DEFAULT_DURATION,
    placement: DEFAULT_PLACEMENT,
  };

  private constructor() {
    // Initialize with Ant Design's notification
    this.notification = antdNotification;
    this.configure({});
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  configure(config: Partial<NotificationConfig>) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
    antdNotification.config({
      placement: this.defaultConfig.placement,
      top: 24,
      bottom: 24,
      duration: this.defaultConfig.duration ?? undefined,
    });
  }

  private open(config: NotificationConfig) {
    const { type = 'info', key, placement, ...restConfig } = config;
    
    // Apply default configuration
    const mergedConfig = {
      ...this.defaultConfig,
      ...restConfig,
      key,
    };

    // Open notification with the specified type
    this.notification[type]?.(mergedConfig);
  }

  success(config: Omit<NotificationConfig, 'type'>) {
    this.open({ ...config, type: 'success' });
  }

  error(config: Omit<NotificationConfig, 'type'>) {
    this.open({ ...config, type: 'error' });
  }

  info(config: Omit<NotificationConfig, 'type'>) {
    this.open({ ...config, type: 'info' });
  }

  warning(config: Omit<NotificationConfig, 'type'>) {
    this.open({ ...config, type: 'warning' });
  }

  close(key: string) {
    this.notification.destroy(key);
  }

  destroy() {
    this.notification.destroy();
  }

  // Helper methods for common notification patterns
  static success(message: ReactNode, description?: ReactNode, config?: Omit<NotificationConfig, 'message' | 'description' | 'type'>) {
    const notification = NotificationService.getInstance();
    notification.success({ message, description, ...config });
  }

  static error(message: ReactNode, description?: ReactNode, config?: Omit<NotificationConfig, 'message' | 'description' | 'type'>) {
    const notification = NotificationService.getInstance();
    notification.error({ message, description, ...config });
  }

  static info(message: ReactNode, description?: ReactNode, config?: Omit<NotificationConfig, 'message' | 'description' | 'type'>) {
    const notification = NotificationService.getInstance();
    notification.info({ message, description, ...config });
  }

  static warning(message: ReactNode, description?: ReactNode, config?: Omit<NotificationConfig, 'message' | 'description' | 'type'>) {
    const notification = NotificationService.getInstance();
    notification.warning({ message, description, ...config });
  }

  // Shortcut methods
  static show = NotificationService.info;
  static destroy = () => NotificationService.getInstance().destroy();
  static close = (key: string) => NotificationService.getInstance().close(key);
  static config = (config: Partial<NotificationConfig>) => 
    NotificationService.getInstance().configure(config);
}

// Export a singleton instance
export const notification = NotificationService.getInstance();

// Export static methods for convenience
export const {
  success,
  error,
  info,
  warning,
  show,
  destroy,
  close,
  config: configureNotification,
} = NotificationService;

// Export types
export type { NotificationPlacement, NotificationType };

export default notification;
