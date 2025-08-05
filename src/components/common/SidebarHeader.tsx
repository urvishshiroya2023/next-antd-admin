"use client";

import React from "react";
import { Typography, Space } from "antd";
import { useI18n } from "@/contexts/I18nContext";

const { Title } = Typography;

interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="p-4 text-center border-b border-gray-600" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
      {collapsed ? (
        <div className="text-xl font-bold text-white h-8 flex items-center justify-center bg-blue-600 rounded">
          A
        </div>
      ) : (
        <Space direction="vertical" size={0} className="w-full">
          <Title level={4} className="!mb-0 !text-white">
            {t.nav.adminPanel}
          </Title>
          <div className="text-xs text-gray-300">v1.0.0</div>
        </Space>
      )}
    </div>
  );
}
