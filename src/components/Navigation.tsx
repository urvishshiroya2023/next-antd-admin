"use client";

import React from "react";
import { Layout, Button, Space, Breadcrumb } from "antd";
import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { appConfig } from "@/config/app.config";
import { SidebarMenu } from "@/components/common/SidebarMenu";
import { SidebarHeader } from "@/components/common/SidebarHeader";
import { UserProfileDropdown } from "@/components/common/UserProfileDropdown";
import { LanguageSelector } from "@/components/LanguageSelector";

const { Header, Sider, Content } = Layout;

interface NavigationProps {
  children: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();

  // Don't show navigation on public routes
  const isPublicRoute = appConfig.publicRoutes.includes(pathname);
  
  if (!isAuthenticated || isPublicRoute) {
    return <>{children}</>;
  }

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

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
        }}
        width={280}
        collapsedWidth={80}
      >
        <SidebarHeader collapsed={collapsed} />
        <div className="flex-1 overflow-y-auto">
          <SidebarMenu />
        </div>
      </Sider>
      
      <Layout>
        <Header className="bg-white px-6 shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg hover:bg-gray-100"
              />
              
              <Breadcrumb
                items={getBreadcrumbItems()}
                className="hidden md:block"
              />
            </div>
            
            <Space size="middle">
              <LanguageSelector />
              <UserProfileDropdown />
            </Space>
          </div>
        </Header>
        
        <Content className="bg-gray-50 overflow-auto min-h-[calc(100vh-64px)]">
          <div className="p-6">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
