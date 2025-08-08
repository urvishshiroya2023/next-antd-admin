import React, { forwardRef, useImperativeHandle, useState, ReactNode } from 'react';
import { Modal as AntdModal, Button, Space } from 'antd';
import { ButtonProps } from '../actions/Button';

export interface ModalProps {
  title?: ReactNode;
  children: ReactNode;
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  afterClose?: () => void;
  okText?: string;
  cancelText?: string;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmLoading?: boolean;
  width?: string | number;
  footer?: ReactNode | null;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  wrapClassName?: string;
  mask?: boolean;
  maskStyle?: React.CSSProperties;
  destroyOnClose?: boolean;
  forceRender?: boolean;
  zIndex?: number;
  // Custom props
  showFooter?: boolean;
  showCancelButton?: boolean;
  showOkButton?: boolean;
  okButtonLoading?: boolean;
  cancelButtonLoading?: boolean;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface ModalRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const Modal = forwardRef<ModalRef, ModalProps>((
  {
    title,
    children,
    visible: propVisible,
    onOk,
    onCancel,
    afterClose,
    okText = 'OK',
    cancelText = 'Cancel',
    okButtonProps,
    cancelButtonProps,
    confirmLoading = false,
    width = 520,
    footer: customFooter,
    closable = true,
    maskClosable = true,
    keyboard = true,
    centered = true,
    className = '',
    style = {},
    bodyStyle = {},
    wrapClassName = '',
    mask = true,
    maskStyle = {},
    destroyOnClose = false,
    forceRender = false,
    zIndex = 1000,
    // Custom props
    showFooter = true,
    showCancelButton = true,
    showOkButton = true,
    okButtonLoading = false,
    cancelButtonLoading = false,
    fullScreen = false,
    size = 'medium',
  },
  ref
) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = propVisible !== undefined;
  const visible = isControlled ? propVisible : internalVisible;

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    open: () => setInternalVisible(true),
    close: () => setInternalVisible(false),
    toggle: () => setInternalVisible(prev => !prev),
  }));

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    if (onOk) {
      onOk();
    } else {
      setInternalVisible(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalVisible(false);
    }
  };

  // Determine modal width based on size prop
  const getModalWidth = () => {
    if (fullScreen) return '100%';
    if (typeof width !== 'undefined') return width;
    
    const sizeMap = {
      small: 400,
      medium: 600,
      large: 800,
      xlarge: 1140,
    };
    
    return sizeMap[size] || 520;
  };

  // Render default footer if not provided
  const renderFooter = () => {
    if (customFooter !== undefined) return customFooter;
    if (!showFooter) return null;

    return (
      <Space>
        {showCancelButton && (
          <Button 
            onClick={handleCancel}
            loading={cancelButtonLoading}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
        )}
        {showOkButton && (
          <Button 
            type="primary" 
            onClick={handleOk}
            loading={confirmLoading || okButtonLoading}
            {...okButtonProps}
          >
            {okText}
          </Button>
        )}
      </Space>
    );
  };

  return (
    <AntdModal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={afterClose}
      width={getModalWidth()}
      footer={renderFooter()}
      closable={closable}
      maskClosable={maskClosable}
      keyboard={keyboard}
      centered={centered}
      className={`custom-modal ${fullScreen ? 'full-screen-modal' : ''} ${className}`}
      style={{
        maxWidth: '95vw',
        ...style,
      }}
      bodyStyle={{
        maxHeight: fullScreen ? 'calc(100vh - 110px)' : '70vh',
        overflowY: 'auto',
        ...bodyStyle,
      }}
      wrapClassName={wrapClassName}
      mask={mask}
      maskStyle={maskStyle}
      destroyOnClose={destroyOnClose}
      forceRender={forceRender}
      zIndex={zIndex}
    >
      {children}
    </AntdModal>
  );
});

Modal.displayName = 'Modal';

export default Modal;
