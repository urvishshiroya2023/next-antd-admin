"use client";

import React, { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Descriptions, 
  Tabs, 
  Table, 
  Tag, 
  Space, 
  Statistic,
  Progress,
  Timeline,
  Badge,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Input,
  Select,
  message,
  Divider
} from "antd";
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  HistoryOutlined, 
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  GoldOutlined,
  DatabaseOutlined,
  DollarOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = {
  Title: ({ children, level = 4, className = "", ...props }: any) => (
    <h2 className={`text-lg font-semibold mb-4 ${className}`} {...props}>
      {children}
    </h2>
  ),
  Text: ({ children, type = "", className = "", ...props }: any) => (
    <span className={`${type} ${className}`} {...props}>
      {children}
    </span>
  )
};

// Mock data for material details
const materialDetails = {
  id: 'GOLD-001',
  name: '24K Gold Bar',
  type: 'Gold',
  purity: '24K',
  unit: 'gram',
  currentStock: 250.5,
  minStockLevel: 100,
  vendor: 'ABC Gold Refinery',
  vendorContact: 'John Doe (john@abcrefinery.com)',
  lastUpdated: '2023-06-10',
  status: 'In Stock',
  notes: 'High-quality 24K gold bars for premium jewelry production.',
  averageCost: 62.50,
  totalValue: 15625.00,
  lastPurchaseDate: '2023-06-05',
  lastUsedDate: '2023-06-10',
  
  specifications: [
    { label: 'Purity', value: '24K (99.9%)' },
    { label: 'Melting Point', value: '1,064°C' },
    { label: 'Density', value: '19.32 g/cm³' },
    { label: 'Alloy Composition', value: '99.9% Gold' },
  ],
  
  transactions: [
    {
      id: 'TXN-001',
      date: '2023-06-10',
      type: 'Consumption',
      quantity: -25,
      reference: 'JOB-001',
      notes: 'Used in Diamond Ring production',
      user: 'Jane Doe',
    },
    {
      id: 'TXN-002',
      date: '2023-06-05',
      type: 'Incoming',
      quantity: 100,
      reference: 'PO-2023-056',
      notes: 'New stock received',
      user: 'Mike Wilson',
    },
    {
      id: 'TXN-003',
      date: '2023-05-25',
      type: 'Incoming',
      quantity: 200,
      reference: 'PO-2023-042',
      notes: 'Quarterly restock',
      user: 'Mike Wilson',
    },
  ],
  
  usageHistory: [
    { month: 'Jan 2023', quantity: 45.5 },
    { month: 'Feb 2023', quantity: 38.2 },
    { month: 'Mar 2023', quantity: 42.7 },
    { month: 'Apr 2023', quantity: 51.3 },
    { month: 'May 2023', quantity: 48.9 },
    { month: 'Jun 2023', quantity: 25.0 },
  ],
  
  relatedJobs: [
    { id: 'JOB-001', product: 'Diamond Ring', status: 'In Progress', quantity: 25, date: '2023-06-10' },
    { id: 'JOB-045', product: 'Gold Chain', status: 'Completed', quantity: 15, date: '2023-05-28' },
    { id: 'JOB-032', product: 'Gold Bangle', status: 'Completed', quantity: 32, date: '2023-05-15' },
  ],
};

const transactionTypes = [
  { value: 'Incoming', label: 'Incoming Stock', color: 'green' },
  { value: 'Consumption', label: 'Consumption', color: 'red' },
  { value: 'Adjustment', label: 'Adjustment', color: 'orange' },
  { value: 'Return', label: 'Return', color: 'blue' },
  { value: 'Write-off', label: 'Write-off', color: 'gray' },
];

export default function MaterialDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactionForm] = Form.useForm();
  const [editForm] = Form.useForm();
  
  const material = materialDetails; // In a real app, this would be fetched using the ID from params

  const handleAddTransaction = (values: any) => {
    console.log('New transaction:', values);
    message.success('Transaction recorded successfully');
    setIsTransactionModalVisible(false);
    transactionForm.resetFields();
  };

  const handleUpdateMaterial = (values: any) => {
    console.log('Updated material:', values);
    message.success('Material updated successfully');
    setIsEditModalVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'On Order':
        return 'processing';
      default:
        return 'default';
    }
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeInfo = transactionTypes.find(t => t.value === type);
        return (
          <Tag color={typeInfo?.color || 'default'}>
            {typeInfo?.label || type}
          </Tag>
        );
      },
      filters: transactionTypes.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (record: any) => (
        <span className={record.quantity > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {record.quantity > 0 ? `+${record.quantity}` : record.quantity}
        </span>
      ),
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: string) => (
        <div className="flex items-center">
          <UserOutlined className="mr-1" />
          {user}
        </div>
      ),
    },
  ];

  const jobColumns = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <a onClick={() => router.push(`/jobs/${id}`)} className="text-blue-500 cursor-pointer">
          {id}
        </a>
      ),
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
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'green' : status === 'In Progress' ? 'blue' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Quantity Used',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const stats = [
    {
      title: 'Current Stock',
      value: material.currentStock,
      suffix: material.unit,
      icon: <DatabaseOutlined className="text-blue-500" />,
    },
    {
      title: 'Minimum Level',
      value: material.minStockLevel,
      suffix: material.unit,
      icon: <BarChartOutlined className="text-orange-500" />,
    },
    {
      title: 'Average Cost',
      value: material.averageCost,
      prefix: '$',
      precision: 2,
      icon: <DollarOutlined className="text-green-500" />,
    },
    {
      title: 'Total Value',
      value: material.totalValue,
      prefix: '$',
      precision: 2,
      icon: <DollarOutlined className="text-purple-500" />,
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="mb-2"
        >
          Back to Raw Materials
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold flex items-center">
                {material.name}
                <Tag 
                  color={getStatusColor(material.status)}
                  className="ml-2"
                >
                  {material.status}
                </Tag>
              </h1>
            </div>
            <p className="text-gray-500">Material ID: {material.id}</p>
          </div>
          
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => {
                editForm.setFieldsValue({
                  ...material,
                  specifications: material.specifications.map(s => `${s.label}: ${s.value}`).join('\n')
                });
                setIsEditModalVisible(true);
              }}
            >
              Edit
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsTransactionModalVisible(true)}
            >
              Record Transaction
            </Button>
          </Space>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card className="h-full">
                <div className="flex items-center">
                  <div className="mr-4 p-3 rounded-full bg-gray-50">
                    {React.cloneElement(stat.icon, { className: 'text-2xl' })}
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">{stat.title}</div>
                    <div className="text-xl font-semibold">
                      {stat.prefix}
                      {typeof stat.value === 'number' && stat.precision !== undefined 
                        ? stat.value.toFixed(stat.precision) 
                        : stat.value}
                      {stat.suffix && ` ${stat.suffix}`}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card className="mb-6">
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={[
                  {
                    key: 'transactions',
                    label: 'Transaction History',
                    children: (
                      <Table 
                        columns={transactionColumns} 
                        dataSource={material.transactions} 
                        rowKey="id"
                        pagination={{
                          pageSize: 5,
                          showSizeChanger: false,
                        }}
                      />
                    ),
                    icon: <HistoryOutlined />,
                  },
                  {
                    key: 'jobs',
                    label: 'Related Jobs',
                    children: (
                      <Table 
                        columns={jobColumns} 
                        dataSource={material.relatedJobs} 
                        rowKey="id"
                        pagination={{
                          pageSize: 5,
                          showSizeChanger: false,
                        }}
                      />
                    ),
                    icon: <FileTextOutlined />,
                  },
                ]}
              />
            </Card>

            <Card title="Stock Level History" className="mb-6">
              <div className="h-64">
                <div className="text-center text-gray-400 py-12">
                  <BarChartOutlined className="text-4xl mb-2" />
                  <div>Stock level history chart will be displayed here</div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Material Details" className="mb-6">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Material ID">{material.id}</Descriptions.Item>
                <Descriptions.Item label="Name">{material.name}</Descriptions.Item>
                <Descriptions.Item label="Type">{material.type}</Descriptions.Item>
                <Descriptions.Item label="Purity">{material.purity}</Descriptions.Item>
                <Descriptions.Item label="Unit">{material.unit}</Descriptions.Item>
                <Descriptions.Item label="Vendor">{material.vendor}</Descriptions.Item>
                <Descriptions.Item label="Last Updated">{material.lastUpdated}</Descriptions.Item>
              </Descriptions>
              
              <Divider orientation="left" className="mt-6 mb-4">Stock Status</Divider>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Minimum Level: {material.minStockLevel} {material.unit}</span>
                  <span>Current: {material.currentStock} {material.unit}</span>
                </div>
                <Progress 
                  percent={Math.min((material.currentStock / (material.minStockLevel * 1.5)) * 100, 100)} 
                  status={
                    material.currentStock < material.minStockLevel * 0.3 ? 'exception' :
                    material.currentStock < material.minStockLevel ? 'warning' : 'success'
                  }
                  showInfo={false}
                />
              </div>
              
              <Divider orientation="left" className="mt-6 mb-4">Specifications</Divider>
              <div className="space-y-2">
                {material.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-500">{spec.label}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
              
              <Divider orientation="left" className="mt-6 mb-4">Notes</Divider>
              <div className="bg-gray-50 p-3 rounded">
                {material.notes || 'No notes available'}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Record Transaction Modal */}
      <Modal
        title="Record Material Transaction"
        open={isTransactionModalVisible}
        onOk={() => transactionForm.submit()}
        onCancel={() => setIsTransactionModalVisible(false)}
        width={600}
      >
        <Form
          form={transactionForm}
          layout="vertical"
          onFinish={handleAddTransaction}
          initialValues={{
            materialId: material.id,
            materialName: material.name,
            type: 'Consumption',
            date: new Date(),
            quantity: 1,
          }}
        >
          <Form.Item name="materialId" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item label="Material">
            <Input value={material.name} disabled />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Transaction Type"
                rules={[{ required: true }]}
              >
                <Select>
                  {transactionTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reference"
                label="Reference"
              >
                <Input placeholder="PO #, Job #, etc." />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} placeholder="Any additional notes about this transaction" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Material Modal */}
      <Modal
        title="Edit Material"
        open={isEditModalVisible}
        onOk={() => editForm.submit()}
        onCancel={() => setIsEditModalVisible(false)}
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateMaterial}
          initialValues={{
            ...material,
            specifications: material.specifications.map(s => `${s.label}: ${s.value}`).join('\n')
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Material Name"
                rules={[{ required: true, message: 'Please enter material name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Material Type"
                rules={[{ required: true, message: 'Please select material type' }]}
              >
                <Select>
                  <Option value="Gold">Gold</Option>
                  <Option value="Silver">Silver</Option>
                  <Option value="Diamond">Diamond</Option>
                  <Option value="Gemstone">Gemstone</Option>
                  <Option value="Platinum">Platinum</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="purity"
                label="Purity/Karat"
              >
                <Select placeholder="Select purity" allowClear>
                  <Option value="24K">24K Gold</Option>
                  <Option value="22K">22K Gold</Option>
                  <Option value="18K">18K Gold</Option>
                  <Option value="14K">14K Gold</Option>
                  <Option value="925">Sterling Silver (925)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="Unit of Measure"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="gram">Gram</Option>
                  <Option value="kilogram">Kilogram</Option>
                  <Option value="piece">Piece</Option>
                  <Option value="carat">Carat</Option>
                  <Option value="ounce">Ounce</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="minStockLevel"
                label="Minimum Stock Level"
                rules={[{ required: true, type: 'number', min: 0 }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vendor"
                label="Vendor/Supplier"
                rules={[{ required: true, message: 'Please enter vendor name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="In Stock">In Stock</Option>
                  <Option value="Low Stock">Low Stock</Option>
                  <Option value="Out of Stock">Out of Stock</Option>
                  <Option value="On Order">On Order</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="specifications"
            label="Specifications"
          >
            <Input.TextArea rows={4} placeholder="Enter specifications in format: Key: Value (one per line)" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} placeholder="Any additional notes about this material" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
