"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import Button from "@/ui/actions/Button";
import Card from "@/ui/display/Card";
import Typography from "@/ui/typography";
import { useLocationManager } from "@/utils/locationManager";
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  GoldOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Progress, Table, Tag } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

// Mock data for the dashboard
const jobStatusData = [
  { status: 'In Progress', value: 24, color: '#1890ff' },
  { status: 'Completed', value: 18, color: '#52c41a' },
  { status: 'On Hold', value: 5, color: '#faad14' },
  { status: 'Cancelled', value: 2, color: '#ff4d4f' },
];

const recentJobs = [
  { id: 'JOB-001', product: 'Diamond Ring', status: 'In Progress', progress: 65, dueDate: '2023-06-15' },
  { id: 'JOB-002', product: 'Gold Necklace', status: 'In Progress', progress: 30, dueDate: '2023-06-20' },
  { id: 'JOB-003', product: 'Silver Bracelet', status: 'On Hold', progress: 10, dueDate: '2023-06-25' },
  { id: 'JOB-004', product: 'Platinum Earrings', status: 'Completed', progress: 100, dueDate: '2023-06-10' },
];

const inventoryLevels = [
  { material: 'Gold 18K', current: 250, min: 100, unit: 'g' },
  { material: 'Diamonds', current: 15, min: 5, unit: 'pcs' },
  { material: 'Silver 925', current: 500, min: 200, unit: 'g' },
  { material: 'Platinum', current: 180, min: 100, unit: 'g' },
];

// Status card component for consistent styling
const StatusCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  prefix = '', 
  suffix = '',
  trend,
  change
}: {
  title: string;
  value: string | number;
  icon: React.ReactElement<{ style?: React.CSSProperties }>;
  color: string;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down';
  change?: string;
}) => {
  return (
    <Card className="flex-1 min-w-[200px] h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Text type="secondary" className="text-sm">
              {title}
            </Text>
            <div className="text-2xl font-semibold mt-1">
              {prefix}{value}{suffix}
            </div>
          </div>
          <div 
            className="p-2 rounded-lg flex items-center justify-center" 
            style={{ backgroundColor: `${color}15` }}
          >
            {React.cloneElement(icon, { 
              style: { 
                ...icon.props.style, 
                color, 
                fontSize: '20px',
                display: 'flex'
              } 
            })}
          </div>
        </div>
        
        {(trend || change) && (
          <div className="mt-auto flex items-center">
            {trend === 'up' ? (
              <span className="text-green-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {change}
              </span>
            ) : trend === 'down' ? (
              <span className="text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {change}
              </span>
            ) : (
              <span className="text-gray-500">{change}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default function DashboardContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const locationManager = useLocationManager();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    locationManager.setCurrentLocation("/dashboard");
  }, [locationManager]);

  // Redirect to login if not authenticated and done loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state
  if (isLoading || !isAuthenticated || !isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Active Jobs',
      value: 24,
      icon: <ClockCircleOutlined />,
      color: '#1890ff',
      trend: 'up',
      change: '12%',
    },
    {
      title: 'Orders',
      value: 93,
      icon: <ShoppingCartOutlined />,
      color: '#722ed1',
      trend: 'up',
      change: '8%',
    },
    {
      title: 'Revenue',
      value: '112,893',
      icon: <GoldOutlined />,
      color: '#52c41a',
      prefix: '$',
      trend: 'up',
      change: '15%',
    },
    {
      title: 'Issues',
      value: 3,
      icon: <AlertOutlined />,
      color: '#ff4d4f',
      trend: 'down',
      change: '5%',
    },
  ];

  const jobStatusColumns = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Completed') color = 'green';
        if (status === 'On Hold') color = 'orange';
        if (status === 'Cancelled') color = 'red';
        
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress percent={progress} showInfo={false} strokeColor={progress === 100 ? '#52c41a' : '#1890ff'} />
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => {
        const dueDate = new Date(date);
        const today = new Date();
        const isOverdue = dueDate < today && dueDate.toDateString() !== today.toDateString();
        
        return (
          <span className={isOverdue ? 'text-red-500' : ''}>
            {dueDate.toLocaleDateString()}
            {isOverdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="!mb-1">Dashboard</Title>
          <Text type="secondary">Welcome back, {user?.name || 'User'}</Text>
        </div>
        <div className="flex space-x-2">
          <Button type="primary">
            <FileTextOutlined /> Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatusCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            prefix={stat.prefix}
            trend={stat.trend as 'up' | 'down' | undefined}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!mb-0">Recent Jobs</Title>
            <Button type="link" onClick={() => router.push('/jobs')}>
              View All
            </Button>
          </div>
          <Table 
            dataSource={recentJobs} 
            columns={jobStatusColumns} 
            pagination={false}
            rowKey="id"
          />
        </Card>

        {/* Job Status Overview */}
        <Card>
          <Title level={4} className="!mb-4">Job Status Overview</Title>
          <div className="space-y-4">
            {jobStatusData.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.status}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <Progress 
                  percent={item.value} 
                  showInfo={false} 
                  strokeColor={item.color}
                  trailColor="#f0f0f0"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Text type="secondary">Total Active Jobs</Text>
              <Text strong>49</Text>
            </div>
            <div className="mt-2">
              <Button type="link" size="small" onClick={() => router.push('/jobs')}>
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Levels */}
        <Card className="lg:col-span-1">
          <Title level={4} className="!mb-4">Inventory Levels</Title>
          <div className="space-y-4">
            {inventoryLevels.map((item) => {
              const percent = Math.round((item.current / (item.min * 2)) * 100);
              const status = percent < 50 ? 'exception' : percent < 100 ? 'active' : 'success';
              
              return (
                <div key={item.material}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.material}</span>
                    <span className="font-medium">
                      {item.current} / {item.min} {item.unit}
                    </span>
                  </div>
                  <Progress 
                    percent={Math.min(percent, 100)}
                    status={status as "success" | "normal" | "active" | "exception" | undefined}
                    showInfo={false}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button type="primary" onClick={() => router.push('/inventory')}>
              Manage Inventory
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <Title level={4} className="!mb-4">Recent Activity</Title>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LineChartOutlined className="text-4xl text-gray-300 mb-4" />
            <Text type="secondary" className="mb-4">
              No recent activity to display
            </Text>
            <Button type="primary" onClick={() => router.push('/activity')}>
              View Activity Log
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
