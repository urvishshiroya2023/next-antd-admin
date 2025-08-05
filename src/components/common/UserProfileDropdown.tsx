"use client";

import React from "react";
import { Dropdown, Avatar, Space, Typography } from "antd";
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  ProfileOutlined 
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";

const { Text } = Typography;

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const menuItems = [
    {
      key: "profile",
      label: t.nav.profile,
      icon: <ProfileOutlined />,
      onClick: () => router.push("/profile"),
    },
    {
      key: "settings",
      label: t.nav.settings,
      icon: <SettingOutlined />,
      onClick: () => router.push("/settings"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: t.nav.logout,
      icon: <LogoutOutlined />,
      onClick: logout,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      arrow
      trigger={['click']}
    >
      <div className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <Space>
          <Avatar
            src={user?.avatar}
            icon={<UserOutlined />}
            size="small"
          />
          <div className="hidden md:block text-left">
            <Text strong className="block text-sm">
              {user?.name}
            </Text>
            <Text type="secondary" className="text-xs capitalize">
              {user?.role}
            </Text>
          </div>
        </Space>
      </div>
    </Dropdown>
  );
}
