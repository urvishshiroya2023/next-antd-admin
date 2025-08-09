"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  StatisticCard,
  Toast
} from "@/ui";
import { useLocationManager } from "@/utils/locationManager";
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FormOutlined,
  GoldOutlined,
  LineChartOutlined,
  PlusOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Progress, Table, Tag, Typography } from "antd";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

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

// Define form data type first
type ProductFormData = {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  status: string;
  description: string;
  terms: boolean;
};

// Form validation schema
const productSchema = yup.object({
  name: yup.string().required('Product name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  inStock: yup.boolean().required('Please specify if the product is in stock'),
  status: yup.string().required('Please select a status'),
  description: yup.string().default('').max(500, 'Description must be less than 500 characters'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required()
}).required();

// Infer the form values type from the schema
type FormValues = yup.InferType<typeof productSchema>;

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const locationManager = useLocationManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      inStock: true,
      status: 'draft',
      description: '',
      terms: false
    }
  });

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' }
  ];

  const categoryOptions = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Kitchen', value: 'home' },
    { label: 'Beauty', value: 'beauty' },
  ];

  const onSubmit = (data: ProductFormData) => {
    console.log('Form submitted:', data);
    Toast.success('Success', 'Product has been saved successfully!');
    handleCloseModal();
    handleCloseDrawer();
    reset();
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  React.useEffect(() => {
    locationManager.setCurrentLocation("/dashboard");
  }, [locationManager]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Tag icon={<ClockCircleOutlined />} color="processing">{status}</Tag>;
      case 'Completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag>;
      case 'On Hold':
        return <Tag icon={<AlertOutlined />} color="warning">{status}</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
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
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" status={progress === 100 ? 'success' : 'active'} />
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Dashboard</Title>
        <Space>
          <Button variant="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            Add Product (Modal)
          </Button>
          <Button variant="primary" icon={<FormOutlined />} onClick={handleOpenDrawer}>
            Add Product (Drawer)
          </Button>
        </Space>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Active Jobs"
            value={24}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title={t.dashboard.orders}
            value={93}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title={t.dashboard.revenue}
            value={112893}
            prefix={<GoldOutlined />}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title={t.dashboard.pageViews}
            value={8846}
            prefix={<LineChartOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Materials Low in Stock"
            value={3}
            prefix={<AlertOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Completed Jobs (This Month)"
            value={18}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Gold Stock"
            value={250}
            precision={2}
            suffix="g"
            prefix={<GoldOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Col>
      </Row>

      {/* Job Status Overview */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Recent Jobs" className="h-full">
            <Table 
              columns={columns} 
              dataSource={recentJobs} 
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Job Status Overview" className="h-full">
            {jobStatusData.map((item) => (
              <div key={item.status} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>{item.status}</span>
                  <span>{item.value} Jobs</span>
                </div>
                <Progress 
                  percent={(item.value / 50) * 100} 
                  showInfo={false} 
                  strokeColor={item.color}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Inventory Levels */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Inventory Levels">
            <Row gutter={[16, 16]}>
              {inventoryLevels.map((item) => {
                const percent = (item.current / (item.min * 1.5)) * 100;
                const status = item.current < item.min ? 'exception' : 
                              item.current < item.min * 1.2 ? 'warning' : 'success';
                
                return (
                  <Col xs={24} sm={12} md={6} key={item.material}>
                    <div className="text-center">
                      <Text strong className="block mb-2">{item.material}</Text>
                      <Progress
                        type="dashboard"
                        percent={Math.min(percent, 100)}
                        status={status as "normal" | "success" | "active" | "exception" | undefined}
                        size="default"
                        format={() => (
                          <div className="text-center">
                            <div className="text-xl font-semibold">{item.current}</div>
                            <div className="text-sm text-gray-500">/ {item.min} {item.unit} min</div>
                          </div>
                        )}
                      />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className="mt-6" gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t.dashboard.recentActivity} className="h-64" >
            <p>{t.dashboard.noRecentActivity}</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t.dashboard.quickActions} className="h-64" >
            <Space direction="vertical" className="w-full">
              <Button variant="primary" block>
                {t.dashboard.createNewUser}
              </Button>
              <Button variant="default" block>{t.dashboard.viewReports}</Button>
              <Button variant="default" block>{t.dashboard.manageSettings}</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
