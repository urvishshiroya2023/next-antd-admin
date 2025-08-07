import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Jewelry ERP',
  description: 'Manage system settings and configurations',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings-layout">
      {children}
    </div>
  );
}
