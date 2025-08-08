import React, { forwardRef, useImperativeHandle, useState, ReactNode } from 'react';
import { Drawer as AntdDrawer, Button, Space } from 'antd';
import { ButtonProps, ButtonVariant } from '../actions/Button';

type PlacementType = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerProps {
  title?: ReactNode;
  children: ReactNode;
  visible?: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
  okText?: string;
  cancelText?: string;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  confirmLoading?: boolean;
  width?: string | number;
  height?: string | number;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  zIndex?: number;
  placement?: PlacementType;
  destroyOnClose?: boolean;
  forceRender?: boolean;
  // Custom props
  showFooter?: boolean;
  showCancelButton?: boolean;
  showOkButton?: boolean;
  okButtonLoading?: boolean;
  cancelButtonLoading?: boolean;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  onOk?: () => void;
  onCancel?: () => void;
}

export interface DrawerRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const Drawer = forwardRef<DrawerRef, DrawerProps>(
  (
    {
      title,
      children,
      visible: propVisible,
      onClose,
      onOk,
      onCancel,
      afterVisibleChange,
      okText = 'OK',
      cancelText = 'Cancel',
      okButtonProps,
      cancelButtonProps,
      confirmLoading = false,
      width = 378,
      height = 256,
      closable = true,
      maskClosable = true,
      keyboard = true,
      className = '',
      style = {},
      bodyStyle = {},
      headerStyle = {},
      maskStyle = {},
      zIndex = 1000,
      placement = 'right',
      destroyOnClose = false,
      forceRender = false,
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

    const handleClose = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (onClose) {
        onClose();
      } else if (onCancel) {
        onCancel();
      } else {
        setInternalVisible(false);
      }
    };

    const handleOk = (e: React.MouseEvent) => {
      if (onOk) {
        onOk();
      } else {
        setInternalVisible(false);
      }
    };

    // Determine drawer dimensions based on size and placement
    const getDrawerDimensions = () => {
      if (fullScreen) {
        return {
          width: '100%',
          height: '100%',
        };
      }

      const sizeMap = {
        small: { width: 300, height: 200 },
        medium: { width: 378, height: 256 },
        large: { width: 600, height: 400 },
      };

      const dimensions = sizeMap[size] || { width, height };

      // Adjust dimensions based on placement
      if (placement === 'top' || placement === 'bottom') {
        return {
          width: '100%',
          height: dimensions.height,
        };
      }

      return {
        width: dimensions.width,
        height: '100%',
      };
    };

    const { width: drawerWidth, height: drawerHeight } = getDrawerDimensions();

    // Render footer if needed
    const renderFooter = () => {
      if (!showFooter) return null;

      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {showCancelButton && (
            <Button
              onClick={onCancel || handleClose}
              loading={cancelButtonLoading}
              {...cancelButtonProps}
            >
              {cancelText}
            </Button>
          )}
          {showOkButton && (
            <Button
              type="primary"
              onClick={onOk || handleOk}
              loading={confirmLoading || okButtonLoading}
              {...okButtonProps}
            >
              {okText}
            </Button>
          )}
        </div>
      );
    };

    return (
      <AntdDrawer
        title={title}
        open={visible}
        onClose={handleClose}
        afterOpenChange={afterVisibleChange}
        width={drawerWidth}
        height={drawerHeight}
        closable={closable}
        maskClosable={maskClosable}
        keyboard={keyboard}
        className={`custom-drawer ${fullScreen ? 'full-screen-drawer' : ''} ${className}`}
        style={{
          ...style,
        }}
        bodyStyle={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          ...bodyStyle,
        }}
        headerStyle={{
          ...headerStyle,
        }}
        maskStyle={maskStyle}
        zIndex={zIndex}
        placement={placement}
        destroyOnClose={destroyOnClose}
        forceRender={forceRender}
        footer={renderFooter()}
      >
        <div 
          className="drawer-content"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 24px',
          }}
        >
          {children}
        </div>
      </AntdDrawer>
    );
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;
