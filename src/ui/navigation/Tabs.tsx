import React from 'react';
import { Tabs as AntdTabs } from 'antd';
import type { TabsProps } from 'antd';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface TabsWrapperProps extends Omit<TabsProps, 'items'> {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsWrapperProps> = ({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  className = '',
  ...rest
}) => {
  const handleChange = (key: string) => {
    if (onChange) {
      onChange(key);
    }
  };

  return (
    <AntdTabs
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      onChange={handleChange}
      className={className}
      items={items}
      {...rest}
    />
  );
};

export default Tabs;
