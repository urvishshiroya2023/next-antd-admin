"use client";

import { LanguageSelector } from "@/components/LanguageSelector";
import { appConfig } from "@/config/app.config";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  AlertOutlined,
  AppstoreOutlined,
  BellOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  GoldOutlined,
  HomeOutlined,
  InboxOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Badge, Button, Layout, Space, theme, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface NavigationProps {
  children: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  // Don't show navigation on public routes
  const isPublicRoute = appConfig.publicRoutes.includes(pathname);
  
  if (!isAuthenticated || isPublicRoute) {
    return <>{children}</>;
  }

  // Menu items for the sidebar
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
      label: t.nav.dashboard || 'Dashboard',
      href: '/dashboard',
    },
    {
      key: 'jobs',
      icon: <FileTextOutlined style={{ fontSize: '18px' }} />,
      label: 'Jobs',
      href: '/jobs',
    },
    {
      key: 'inventory',
      icon: <InboxOutlined style={{ fontSize: '18px' }} />,
      label: 'Inventory',
      children: [
        {
          key: 'raw-materials',
          icon: <GoldOutlined />,
          label: 'Raw Materials',
          href: '/inventory/raw-materials',
        },
        {
          key: 'finished-goods',
          icon: <CheckCircleOutlined />,
          label: 'Finished Goods',
          href: '/inventory/finished-goods',
        },
      ],
    },
    {
      key: 'production',
      icon: <BuildOutlined style={{ fontSize: '18px' }} />,
      label: 'Production',
      children: [
        {
          key: 'tracker',
          icon: <LineChartOutlined />,
          label: 'Production Tracker',
          href: '/production/tracker',
        },
        {
          key: 'wastage',
          icon: <AlertOutlined />,
          label: 'Wastage',
          href: '/production/wastage',
        },
        {
          key: 'rejections',
          icon: <CloseCircleOutlined />,
          label: 'Rejections',
          href: '/production/rejections',
        },
      ],
    },
    {
      key: 'quality',
      icon: <CheckCircleOutlined />,
      label: 'Quality Control',
      href: '/quality',
    },
    {
      key: 'reports',
      icon: <FileDoneOutlined />,
      label: 'Reports',
      href: '/reports',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: 'Users',
          href: '/settings/users',
        },
        {
          key: 'roles',
          icon: <TeamOutlined />,
          label: 'Roles & Permissions',
          href: '/settings/roles',
        },
        {
          key: 'master-data',
          icon: <ToolOutlined />,
          label: 'Master Data',
          href: '/settings/master-data',
        },
      ],
    },
  ];

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const items = [
      {
        href: '/dashboard',
        title: (
          <Space>
            <HomeOutlined />
            <span>{t.nav.dashboard}</span>
          </Space>
        ),
      },
    ];

    pathSegments.forEach((segment, index) => {
      if (segment !== 'dashboard') {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const title = t.nav[segment as keyof typeof t.nav] || segment.charAt(0).toUpperCase() + segment.slice(1);
        items.push({ href, title: <span>{title}</span> });
      }
    });

    return items;
  };

  const renderSidebar = () => (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={{
        background: '#1a1f33',
        boxShadow: '2px 0 8px 0 rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'auto',
        transition: 'all 0.2s',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      theme="dark"
    >
      <div 
        className={`flex items-center justify-${collapsed ? 'center' : 'start'} h-20 cursor-pointer`}
        onClick={() => router.push('/dashboard')}
      >
        {collapsed ? (
          <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            <span className="text-white font-bold text-xl">J</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
              <span className="text-white font-bold text-xl">J</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white whitespace-nowrap">Jewelry ERP</span>
              <span className="text-xs text-gray-400">v2.0.0</span>
            </div>
          </div>
        )}
      </div>
      
      {/* <div className="px-4 py-3">
        <div className="relative">
          <Input 
            placeholder="Search..." 
            prefix={<SearchOutlined className="text-gray-400" />} 
            className="rounded-lg h-10"
            style={{ 
              background: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              '--placeholder-color': 'rgba(255, 255, 255, 0.97) !important'
            } as React.CSSProperties}
          />
        </div>
      </div> */}

      <div className="mt-4">
        {menuItems.map(item => (
          <div key={item.key} className="px-2">
            {item.href ? (
              <div 
                className={`flex items-center h-10 px-4 rounded-lg cursor-pointer transition-colors ${
                  pathname === item.href 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => router.push(item.href!)}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            ) : (
              <div className="mb-2">
                <div className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {!collapsed && item.label}
                </div>
                {item.children?.map(child => (
                  <div 
                    key={child.key}
                    className={`flex items-center h-10 px-4 rounded-lg cursor-pointer transition-colors ${
                      pathname === child.href 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => router.push(child.href!)}
                  >
                    <span className="mr-3">{child.icon}</span>
                    {!collapsed && <span>{child.label}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900/30">
        <div 
          className="flex items-center p-2 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          <LogoutOutlined className="text-lg" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </div>
      </div>
      )}
    </Sider>
  );

  const renderHeader = () => (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
        height: 64,
        marginLeft: collapsed ? 80 : 260,
        transition: 'all 0.2s',
      }}
    >
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: 48, height: 48 }}
        />
        <div className="hidden md:flex items-center ml-4">
          <AppstoreOutlined className="mr-2 text-gray-500" />
          <Text type="secondary" className="text-sm">
            {pathname.split('/').filter(Boolean).map(part => 
              part.charAt(0).toUpperCase() + part.slice(1)
            ).join(' > ')}
          </Text>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined className="text-lg" />} 
          className="hidden md:flex items-center justify-center"
        />
        <Badge count={5} size="small" className="hidden md:block">
          <Button 
            type="text" 
            icon={<BellOutlined className="text-lg" />} 
            className="flex items-center justify-center"
          />
        </Badge>
        
        <div className="h-8 border-l mx-2"></div>
        
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-lg">
          <Avatar 
            size={32} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: colorPrimary }}
            src={user?.avatar}
          />
          {!collapsed && (
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.role || 'Admin'}</div>
            </div>
          )}
        </div>
        
        <LanguageSelector />
      </div>
    </Header>
  );

  const renderContent = () => (
    <div 
      style={{
        marginLeft: collapsed ? 80 : 260,
        padding: '16px',
        minHeight: 'calc(100vh - 64px)',
        background: '#f0f2f5',
        transition: 'all 0.2s',
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-sm p-4"
        style={{ minHeight: 'calc(100vh - 112px)' }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {renderSidebar()}
      <Layout>
        {renderHeader()}
        {renderContent()}
      </Layout>
    </Layout>
  );
}
