"use client";

import React from "react";
import { Dropdown, Button, Space } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useI18n } from "@/contexts/I18nContext";
import { locales, localeNames, localeFlags, Locale } from "@/config/i18n.config";

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  const menuItems = locales.map((loc) => ({
    key: loc,
    label: (
      <Space>
        <span>{localeFlags[loc]}</span>
        <span>{localeNames[loc]}</span>
      </Space>
    ),
    onClick: () => setLocale(loc),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems, selectedKeys: [locale] }}
      placement="bottomRight"
      arrow
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        className="flex items-center"
      >
        <Space>
          <span>{localeFlags[locale]}</span>
          <span className="hidden sm:inline">{localeNames[locale]}</span>
        </Space>
      </Button>
    </Dropdown>
  );
}
