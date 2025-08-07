"use client";

import { UserOutlined, LockOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Tabs, Typography } from 'antd';
import React from 'react';
import UsersTab from './components/UsersTab';
import RolesPermissionsTab from './components/RolesPermissionsTab';
import MasterModulesTab from './components/MasterModulesTab';

const { Title } = Typography;

const SettingsPage = () => {
  return (
    <div className="p-4">
      <Title level={3} className="mb-6">Settings</Title>
      
      <Tabs
        defaultActiveKey="users"
        size="large"
        items={[
          {
            key: 'users',
            label: (
              <span>
                <UserOutlined className="mr-2" />
                Users
              </span>
            ),
            children: <UsersTab />,
          },
          {
            key: 'roles',
            label: (
              <span>
                <LockOutlined className="mr-2" />
                Roles & Permissions
              </span>
            ),
            children: <RolesPermissionsTab />,
          },
          {
            key: 'modules',
            label: (
              <span>
                <AppstoreOutlined className="mr-2" />
                Master Modules
              </span>
            ),
            children: <MasterModulesTab />,
          },
        ]}
      />
    </div>
  );
};

export default SettingsPage;
