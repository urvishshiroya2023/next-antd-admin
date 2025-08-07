"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  GoldOutlined,
  HistoryOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Mock data for raw materials
const rawMaterialsData = [
  {
    id: 'GOLD-001',
    name: '24K Gold Bar',
    type: 'Gold',
    purity: '24K',
    unit: 'gram',
    currentStock: 250.5,
    minStockLevel: 100,
    vendor: 'ABC Gold Refinery',
    lastUpdated: '2023-06-10',
    status: 'In Stock',
  },
  {
    id: 'DIA-001',
    name: 'Diamond 1CT',
    type: 'Diamond',
    clarity: 'VS1',
    color: 'D',
    unit: 'piece',
    currentStock: 15,
    minStockLevel: 5,
    vendor: 'Diamond World',
    lastUpdated: '2023-06-12',
    status: 'Low Stock',
  },
  {
    id: 'SILV-001',
    name: 'Sterling Silver',
    type: 'Silver',
    purity: '925',
    unit: 'gram',
    currentStock: 1200,
    minStockLevel: 500,
    vendor: 'Silver Traders',
    lastUpdated: '2023-06-08',
    status: 'In Stock',
  },
];

// Mock data for material transactions
const transactionData = [
  {
    id: 'TXN-001',
    materialId: 'GOLD-001',
    type: 'Incoming',
    quantity: 50,
    date: '2023-06-10',
    reference: 'PO-2023-001',
    notes: 'Initial stock',
  },
  {
    id: 'TXN-002',
    materialId: 'GOLD-001',
    type: 'Consumption',
    quantity: -25,
    date: '2023-06-11',
    reference: 'JOB-001',
    notes: 'Used in Diamond Ring',
  },
];

const materialTypes = ['Gold', 'Silver', 'Diamond', 'Gemstone', 'Platinum', 'Palladium'];
const units = ['gram', 'kilogram', 'piece', 'carat', 'ounce'];
const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'];

export default function RawMaterialsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  // Initialize form instances
  const [form] = Form.useForm();
  const [transactionForm] = Form.useForm();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showTransactionModal = (material: any = null) => {
    if (material) {
      transactionForm.setFieldsValue({
        materialId: material.id,
        materialName: material.name,
        type: 'Consumption',
        quantity: 1,
        date: new Date(),
      });
    } else {
      transactionForm.setFieldsValue({
        type: 'Incoming',
        date: new Date(),
      });
    }
    setIsTransactionModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Material data:', values);
      message.success('Material saved successfully');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const handleTransactionSubmit = async () => {
    try {
      const values = await transactionForm.validateFields();
      console.log('Transaction data:', values);
      message.success('Transaction recorded successfully');
      transactionForm.resetFields();
      setIsTransactionModalVisible(false);
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsTransactionModalVisible(false);
  };

  const handleViewMaterial = (id: string) => {
    router.push(`/inventory/raw-materials/${id}`);
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

  const materialColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center">
          {record.type === 'Gold' && <GoldOutlined className="mr-2 text-yellow-500" />}
          {record.type === 'Diamond' && <DatabaseOutlined className="mr-2 text-blue-500" />}
          {record.type === 'Silver' && <DatabaseOutlined className="mr-2 text-gray-400" />}
          {text}
        </div>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: materialTypes.map(type => ({ text: type, value: type })),
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: 'Purity/Details',
      key: 'details',
      render: (record: any) => (
        <span>{record.purity || record.clarity || '-'}</span>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.currentStock} {record.unit}</div>
          <div className="text-xs text-gray-500">Min: {record.minStockLevel} {record.unit}</div>
          <Progress 
            percent={Math.min((record.currentStock / (record.minStockLevel * 1.5)) * 100, 100)} 
            size="small" 
            showInfo={false}
            status={
              record.currentStock < record.minStockLevel * 0.3 ? 'exception' :
              record.currentStock < record.minStockLevel ? 'warning' : 'success'
            }
          />
        </div>
      ),
      sorter: (a: any, b: any) => a.currentStock - b.currentStock,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      filters: statuses.map(status => ({ text: status, value: status })),
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a: any, b: any) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewMaterial(record.id)}>
                View Details
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Edit
              </Menu.Item>
              <Menu.Item key="transaction" icon={<HistoryOutlined />} onClick={() => showTransactionModal(record)}>
                Record Transaction
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Material',
      key: 'material',
      render: (record: any) => {
        const material = rawMaterialsData.find(m => m.id === record.materialId);
        return material ? material.name : record.materialId;
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Incoming' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (record: any) => (
        <span className={record.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
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
  ];

  const filteredMaterials = rawMaterialsData.filter((material) => {
    const matchesSearch = 
      material.id.toLowerCase().includes(searchText.toLowerCase()) ||
      material.name.toLowerCase().includes(searchText.toLowerCase()) ||
      material.vendor.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
    const matchesType = typeFilter === 'all' || material.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Raw Materials Management</h1>
          <p className="text-gray-500">Manage and track all raw materials inventory</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            Add Material
          </Button>
          <Button 
            type="default" 
            icon={<HistoryOutlined />} 
            onClick={() => showTransactionModal()}
          >
            Record Transaction
          </Button>
        </Space>
      </div>

      <Card>
        <Tabs defaultActiveKey="materials" onChange={setActiveTab}>
          <TabPane tab="Materials" key="materials">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[250px]">
                <Search 
                  placeholder="Search materials..." 
                  allowClear 
                  enterButton={<SearchOutlined />} 
                  onSearch={(value) => setSearchText(value)}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select
                  placeholder="Filter by Type"
                  allowClear
                  style={{ width: 150 }}
                  onChange={(value) => setTypeFilter(value || 'all')}
                >
                  <Option value="all">All Types</Option>
                  {materialTypes.map(type => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="Filter by Status"
                  allowClear
                  style={{ width: 150 }}
                  onChange={(value) => setStatusFilter(value || 'all')}
                >
                  <Option value="all">All Statuses</Option>
                  {statuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
                <Button icon={<FilterOutlined />}>
                  More Filters
                </Button>
              </div>
            </div>

            <Table 
              columns={materialColumns} 
              dataSource={filteredMaterials} 
              rowKey="id"
              scroll={{ x: 1300 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} materials`,
              }}
            />
          </TabPane>
          
          <TabPane tab="Transactions" key="transactions">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 max-w-md">
                <Search 
                  placeholder="Search transactions..." 
                  allowClear 
                  enterButton={<SearchOutlined />} 
                  onSearch={(value) => setSearchText(value)}
                  style={{ width: '100%' }}
                />
              </div>
              <RangePicker />
            </div>
            
            <Table 
              columns={transactionColumns} 
              dataSource={transactionData} 
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Add/Edit Material Modal */}
      <Modal
        title="Add New Raw Material"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          name="material_form"
          initialValues={{
            status: 'In Stock',
            unit: 'gram',
            minStockLevel: 0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Material Name"
                rules={[{ required: true, message: 'Please enter material name' }]}
              >
                <Input placeholder="e.g., 24K Gold, VS1 Diamond" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Material Type"
                rules={[{ required: true, message: 'Please select material type' }]}
              >
                <Select placeholder="Select material type" showSearch>
                  <Option value="all">All Types</Option>
                  {materialTypes.map(type => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
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
                  {units.map(unit => (
                    <Option key={unit} value={unit}>{unit}</Option>
                  ))}
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
                <Input placeholder="Vendor name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  {statuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} placeholder="Any additional notes about this material" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Record Transaction Modal */}
      <Modal
        title="Record Material Transaction"
        open={isTransactionModalVisible}
        onOk={handleTransactionSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={transactionForm}
          layout="vertical"
          name="transaction_form"
          initialValues={{
            type: 'Incoming',
            date: new Date(),
            quantity: 1
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="type"
                label="Transaction Type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Incoming">Incoming Stock</Option>
                  <Option value="Consumption">Consumption</Option>
                  <Option value="Adjustment">Adjustment</Option>
                  <Option value="Return">Return</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="materialId"
                label="Material"
                rules={[{ required: true, message: 'Please select a material' }]}
              >
                <Select
                  showSearch
                  placeholder="Select material"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={rawMaterialsData.map(material => ({
                    value: material.id,
                    label: `${material.name} (${material.id})`,
                  }))}
                />
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
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="reference"
                label="Reference"
              >
                <Input placeholder="PO #, Job #, etc." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="costPerUnit"
                label="Cost per Unit"
              >
                <InputNumber 
                  min={0} 
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value?.replace(/\$\s?|(,*)/g, '') || ''}
                  style={{ width: '100%' }} 
                />
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
    </div>
  );
}
