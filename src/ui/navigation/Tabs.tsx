import React, { useState, useMemo, ReactNode, useCallback } from 'react';
import { Tabs as AntdTabs, TabsProps as AntdTabsProps } from 'antd';
import { Card } from '../display/Card';
import { Space } from '../layout/Space';
import { Text } from '../typography/Text';

export interface TabItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  closable?: boolean;
  forceRender?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface TabsProps extends Omit<AntdTabsProps, 'items' | 'onEdit'> {
  items: TabItem[];
  type?: 'line' | 'card' | 'editable-card';
  size?: 'small' | 'middle' | 'large';
  position?: 'top' | 'right' | 'bottom' | 'left';
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void;
  className?: string;
  tabBarExtraContent?: ReactNode | { left?: ReactNode; right?: ReactNode };
  tabBarGutter?: number;
  centered?: boolean;
  addIcon?: ReactNode;
  hideAdd?: boolean;
  destroyInactiveTabPane?: boolean;
  animated?: boolean | { inkBar?: boolean; tabPane?: boolean };
  moreIcon?: ReactNode;
  tabBarStyle?: React.CSSProperties;
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  renderTabBar?: (
    props: any,
    DefaultTabBar: React.ComponentType
  ) => React.ReactElement;
  tabBarClassName?: string;
  cardProps?: React.ComponentProps<typeof Card>;
  showCard?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  type = 'line',
  size = 'middle',
  position = 'top',
  defaultActiveKey,
  activeKey: propActiveKey,
  onChange,
  onEdit,
  className = '',
  tabBarExtraContent,
  tabBarGutter,
  centered,
  addIcon,
  hideAdd,
  destroyInactiveTabPane = false,
  animated = { inkBar: true, tabPane: false },
  moreIcon,
  tabBarStyle,
  tabPosition = 'top',
  renderTabBar,
  tabBarClassName,
  cardProps = {},
  showCard = true,
  ...rest
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || (items.length > 0 ? items[0].key : '')
  );

  const activeKey = propActiveKey || internalActiveKey;

  const handleChange = useCallback(
    (newActiveKey: string) => {
      if (!propActiveKey) {
        setInternalActiveKey(newActiveKey);
      }
      if (onChange) {
        onChange(newActiveKey);
      }
    },
    [onChange, propActiveKey]
  );

  const handleEdit = useCallback(
    (targetKey: string, action: 'add' | 'remove') => {
      if (onEdit) {
        onEdit(targetKey, action);
      }
    },
    [onEdit]
  );

  // Process tab items to include icons and other customizations
  const processedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        label: (
          <Space size="small">
            {item.icon && <span className="tab-icon">{item.icon}</span>}
            {item.label}
          </Space>
        ),
      })),
    [items]
  );

  // Render tab bar extra content
  const renderTabBarExtra = useMemo(() => {
    if (!tabBarExtraContent) return null;
    
    if (typeof tabBarExtraContent === 'object' && 'left' in tabBarExtraContent) {
      return {
        left: tabBarExtraContent.left,
        right: tabBarExtraContent.right,
      };
    }
    
    return tabBarExtraContent;
  }, [tabBarExtraContent]);

  const tabContent = (
    <AntdTabs
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      onChange={handleChange}
      onEdit={onEdit ? handleEdit : undefined}
      type={type}
      size={size}
      tabPosition={tabPosition}
      tabBarExtraContent={renderTabBarExtra}
      tabBarGutter={tabBarGutter}
      centered={centered}
      addIcon={addIcon}
      hideAdd={hideAdd}
      destroyInactiveTabPane={destroyInactiveTabPane}
      animated={animated}
      moreIcon={moreIcon}
      tabBarStyle={tabBarStyle}
      renderTabBar={renderTabBar}
      className={`custom-tabs ${className}`}
      tabBarClassName={tabBarClassName}
      items={processedItems}
      {...rest}
    />
  );

  if (showCard) {
    return (
      <Card noPadding className={className} {...cardProps}>
        {tabContent}
      </Card>
    );
  }

  return tabContent;
};

// TabPane component for better TypeScript support
interface TabPaneProps {
  tab: ReactNode;
  key: string;
  children: ReactNode;
  disabled?: boolean;
  forceRender?: boolean;
  className?: string;
  style?: React.CSSProperties;
  closeIcon?: ReactNode;
}

export const TabPane: React.FC<TabPaneProps> = ({ children }) => {
  return <>{children}</>;
};

// Helper component for tab content with title and description
export interface TabContentProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  extra?: ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({
  title,
  description,
  children,
  className = '',
  extra,
}) => {
  return (
    <div className={`tab-content ${className}`}>
      {(title || description || extra) && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <Text size="xl" weight="semibold" className="mb-1">
                  {title}
                </Text>
              )}
              {description && (
                <Text size="sm" color="muted">
                  {description}
                </Text>
              )}
            </div>
            {extra && <div>{extra}</div>}
          </div>
        </div>
      )}
      <div className="tab-content-body">{children}</div>
    </div>
  );
};

// Add display name for better debugging
Tabs.displayName = 'Tabs';
TabPane.displayName = 'TabPane';
TabContent.displayName = 'TabContent';

export default Tabs;
