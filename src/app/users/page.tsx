"use client";

import React from "react";
import { Table, Card, Button, Space, Tag, Avatar } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { withRouteGuard } from "@/components/RouteGuard";

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "editor",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "viewer",
    status: "inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
  },
];

function UsersPage() {
  const { user } = useAuth();

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colors = {
          admin: "red",
          editor: "blue",
          viewer: "green",
        };
        return <Tag color={colors[role as keyof typeof colors]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => console.log("Edit user:", record.id)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => console.log("Delete user:", record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">User Management</h1>
        <p className="text-gray-600">
          Manage users and their permissions (Admin only)
        </p>
      </div>

      <Card
        title="Users"
        extra={
          <Button type="primary">
            Add New User
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mockUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
}

// Protect this page - only admins can access
export default withRouteGuard(UsersPage, {
  requiresAuth: true,
  allowedRoles: ["admin"],
  redirectTo: "/dashboard",
});
