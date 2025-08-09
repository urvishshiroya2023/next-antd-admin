"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/ui";
import { EditOutlined, EyeOutlined, FilterOutlined, GoldOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Statistic, Table, Tabs, Tag, Tooltip, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

// Mock data for finished goods
const finishedGoodsData = [
  { id: 'FG-001', sku: 'RNG-24K-001', name: 'Diamond Engagement Ring', category: 'Rings', material: '18K White Gold', weight: 5.2, weightUnit: 'g', price: 4500, cost: 2800, status: 'In Stock', quantity: 1, unit: 'pcs', location: 'Showcase A-01' },
  { id: 'FG-002', sku: 'NKL-14K-012', name: 'Infinity Necklace', category: 'Necklaces', material: '14K Yellow Gold', weight: 3.8, weightUnit: 'g', price: 1250, cost: 750, status: 'In Stock', quantity: 2, unit: 'pcs', location: 'Showcase B-03' },
  { id: 'FG-003', sku: 'ER-18K-045', name: 'Pearl Drop Earrings', category: 'Earrings', material: '18K Rose Gold', weight: 4.1, weightUnit: 'g', price: 3200, cost: 2100, status: 'Sold', quantity: 1, unit: 'pairs', location: 'Showcase C-02' },
  { id: 'FG-004', sku: 'BR-950-078', name: "Men's Wedding Band", category: 'Rings', material: 'Platinum 950', weight: 8.5, weightUnit: 'g', price: 3800, cost: 2450, status: 'On Hold', quantity: 1, unit: 'pcs', location: 'Showcase A-05' },
  { id: 'FG-005', sku: 'BRL-18K-033', name: 'Tennis Bracelet', category: 'Bracelets', material: '18K White Gold', weight: 12.3, weightUnit: 'g', price: 9500, cost: 6200, status: 'In Stock', quantity: 1, unit: 'pcs', location: 'Vault 1' },
];

const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants', 'Bangles'];
const statusColors = { 'In Stock': 'green', 'Sold': 'red', 'On Hold': 'orange', 'In Production': 'blue', 'Returned': 'purple' };

export default function FinishedGoodsPage() {
  const { t } = useI18n();
  const router = useRouter();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  
  // Filter data based on search and active tab
  const filteredData = finishedGoodsData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || item.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    return matchesSearch && matchesTab;
  });
  
  const handleAddNew = () => {
    setCurrentItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  
  const handleEdit = (record: any) => {
    setCurrentItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };
  
  const handleSubmit = (values: any) => {
    message.success(`Item ${currentItem ? 'updated' : 'added'} successfully`);
    setIsModalVisible(false);
  };
  
  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    {
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
            <GoldOutlined className="text-gray-500" />
          </div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500">{record.category} • {record.material}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.quantity} {record.unit}</div>
          <Tag color={statusColors[record.status as keyof typeof statusColors]} className="mt-1">
            {record.status}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Value',
      key: 'value',
      render: (record: any) => (
        <div className="text-right">
          <div className="font-medium">${record.price.toLocaleString()}</div>
          <div className="text-xs text-green-600">
            Margin: {Math.round(((record.price - record.cost) / record.price) * 100)}%
          </div>
        </div>
      ),
    },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => router.push(`/inventory/finished-goods/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalValue = finishedGoodsData
    .filter(item => item.status === 'In Stock')
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
  const totalItems = finishedGoodsData
    .filter(item => item.status === 'In Stock')
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">Finished Goods</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Add New
        </Button>
      </div>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Value" value={totalValue} prefix="$" precision={0} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Items in Stock" value={totalItems} precision={0} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Unique SKUs" value={finishedGoodsData.length} precision={0} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>
      
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Search 
              placeholder="Search by SKU or name..." 
              allowClear 
              enterButton={<Button type="primary"><SearchOutlined /></Button>}
              onSearch={setSearchText}
              className="w-full"
            />
          </div>
          <Button icon={<FilterOutlined />}>Filters</Button>
        </div>
        
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Items (${finishedGoodsData.length})` },
            ...Object.entries(statusColors).map(([status, color]) => ({
              key: status,
              label: (
                <span>
                  <Tag color={color} style={{ marginRight: 8 }} />
                  {status} ({finishedGoodsData.filter(item => item.status === status).length})
                </span>
              ),
            })),
          ]}
        />
        
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="mt-4"
        />
      </Card>
      
      <Modal
        title={`${currentItem ? 'Edit' : 'Add New'} Finished Good`}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select>
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="material" label="Material" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} addonAfter="g" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber prefix="$" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  {Object.entries(statusColors).map(([status, color]) => (
                    <Option key={status} value={status}>
                      <Tag color={color}>{status}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
