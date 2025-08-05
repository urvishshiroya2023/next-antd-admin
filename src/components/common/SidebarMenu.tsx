"use client";

import React from "react";
import { Menu } from "antd";
import { 
  DashboardOutlined, 
  UserOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { appConfig } from "@/config/app.config";

interface MenuItemType {
  key: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
}

export function SidebarMenu() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  // Define menu items with role-based access
  const menuItems: MenuItemType[] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: t.nav.dashboard,
    },
    {
      key: "/analytics",
      icon: <BarChartOutlined />,
      label: t.nav.analytics,
      roles: ["admin", "editor", "viewer"],
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: t.nav.users,
      roles: ["admin"],
    },
    {
      key: "/reports",
      icon: <FileTextOutlined />,
      label: "Reports", // Add to translations later
      roles: ["admin", "editor"],
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: t.nav.settings,
      roles: ["admin"],
    },
  ];

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    return menuItems.filter(item => {
      if (!item.roles) return true; // No role restriction
      return user?.role && item.roles.includes(user.role);
    });
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const filteredItems = getFilteredMenuItems();

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={filteredItems.map(item => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      }))}
      onClick={handleMenuClick}
      className="border-r-0 h-full"
      theme="dark"
      style={{
        backgroundColor: 'transparent',
        borderRight: 'none',
      }}
    />
  );
}
