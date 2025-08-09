"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/ui";
import { EditOutlined, FileExcelOutlined, FilePdfOutlined, FilterOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { App, Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Tabs, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// Mock data for wastage records
const wastageData = [
  {
    id: 'WST-2023-001',
    date: '2023-06-15',
    materialId: 'GOLD-001',
    materialName: '24K Gold',
    category: 'Gold',
    weight: 2.5,
    unit: 'g',
    process: 'Casting',
    jobId: 'JOB-001',
    reportedBy: 'John Smith',
    status: 'Approved',
    notes: 'Normal casting waste',
    approvedBy: 'Jane Doe',
    approvedDate: '2023-06-15',
  },
  {
    id: 'WST-2023-002',
    date: '2023-06-10',
    materialId: 'SILVER-001',
    materialName: 'Sterling Silver',
    category: 'Silver',
    weight: 5.2,
    unit: 'g',
    process: 'Filing',
    jobId: 'JOB-002',
    reportedBy: 'Mike Chen',
    status: 'Pending',
    notes: 'Excessive filing waste',
    approvedBy: '',
    approvedDate: '',
  },
  {
    id: 'WST-2023-003',
    date: '2023-06-05',
    materialId: 'PLAT-001',
    materialName: 'Platinum 950',
    category: 'Platinum',
    weight: 1.8,
    unit: 'g',
    process: 'Polishing',
    jobId: 'JOB-003',
    reportedBy: 'Sarah Johnson',
    status: 'Rejected',
    notes: 'Unacceptable waste level',
    approvedBy: 'Jane Doe',
    approvedDate: '2023-06-06',
  },
];

const categories = ['Gold', 'Silver', 'Platinum', 'Palladium', 'Other'];
const processes = ['Casting', 'Filing', 'Polishing', 'Setting', 'Assembly', 'Other'];
const statuses = ['Pending', 'Approved', 'Rejected'];

const statusColors = {
  'Pending': 'orange',
  'Approved': 'green',
  'Rejected': 'red',
};

export default function WastagePage() {
  const { t } = useI18n();
  const router = useRouter();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp ? App.useApp() : { message: Modal, modal: Modal };
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  
  // Filter data based on search and active tab
  const filteredData = wastageData.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchText.toLowerCase()) ||
      record.materialName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.jobId.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesTab = activeTab === 'all' || record.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const handleAddNew = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'Pending',
      unit: 'g',
      date: null
    });
    setIsModalVisible(true);
  };
  
  const handleEdit = (record: any) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? new Date(record.date) : null,
      approvedDate: record.approvedDate ? new Date(record.approvedDate) : null,
    });
    setIsModalVisible(true);
  };
  
  const handleSubmit = async (values: any) => {
    try {
      // Format dates before submission
      const formattedValues = {
        ...values,
        date: values.date ? values.date.toISOString().split('T')[0] : null,
        approvedDate: values.approvedDate ? values.approvedDate.toISOString().split('T')[0] : null
      };
      
      // In a real app, this would be an API call
      const action = currentRecord ? 'updated' : 'added';
      console.log('Form submitted with values:', formattedValues);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      message.success(`Wastage record ${action} successfully`);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to save wastage record');
    }
  };
  
  const columns = [
    {
      title: 'Wastage ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <a onClick={() => handleEdit(wastageData.find(w => w.id === text))}>{text}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Material',
      key: 'material',
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.materialName}</div>
          <div className="text-xs text-gray-500">{record.category} • {record.weight}{record.unit}</div>
        </div>
      ),
    },
    {
      title: 'Process',
      dataIndex: 'process',
      key: 'process',
      filters: processes.map(process => ({ text: process, value: process })),
      onFilter: (value: any, record: any) => record.process === value,
    },
    {
      title: 'Job ID',
      dataIndex: 'jobId',
      key: 'jobId',
      render: (text: string) => <a onClick={() => router.push(`/jobs/${text}`)}>{text}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status}
        </Tag>
      ),
      filters: statuses.map(status => ({ text: status, value: status })),
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Reported By',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  // Calculate total wastage by category
  const totalWastage = wastageData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.weight;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">Material Wastage</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Record Wastage
        </Button>
      </div>
      
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {Object.entries(totalWastage).map(([category, weight]) => (
          <Col xs={24} sm={12} md={6} key={category}>
            <Card>
              <div className="text-2xl font-semibold">{weight}g</div>
              <div className="text-gray-500">{category} Wastage</div>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Search 
              placeholder="Search by ID, material, or job..." 
              allowClear 
              enterButton={
                <Button type="primary">
                  <SearchOutlined />
                </Button>
              }
              onSearch={setSearchText}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button icon={<FilePdfOutlined />}>
              PDF
            </Button>
            <Button icon={<FileExcelOutlined />}>
              Excel
            </Button>
            <Button icon={<FilterOutlined />}>
              Filters
            </Button>
          </div>
        </div>
        
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Records (${wastageData.length})` },
            ...statuses.map(status => ({
              key: status,
              label: (
                <span>
                  <Tag color={statusColors[status as keyof typeof statusColors]} style={{ marginRight: 8 }} />
                  {status} ({wastageData.filter(r => r.status === status).length})
                </span>
              ),
            })),
          ]}
        />
        
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
          }}
          scroll={{ x: true }}
          className="mt-4"
        />
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        title={currentRecord ? 'Edit Wastage Record' : 'Add New Wastage Record'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={currentRecord ? 'Update' : 'Save'}
        cancelText="Cancel"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'Pending',
            unit: 'g',
            date: new Date(),
            ...currentRecord
          }}
          preserve={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
                getValueProps={(value) => ({
                  value: value ? (value instanceof Date ? dayjs(value) : dayjs(value)) : null
                })}
                normalize={(value) => value ? value.format('YYYY-MM-DD') : null}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Material Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="materialName"
                label="Material Name"
                rules={[{ required: true, message: 'Please enter material name' }]}
              >
                <Input placeholder="e.g., 24K Gold, Sterling Silver" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="weight"
                label="Weight"
                rules={[{ required: true, message: 'Please enter weight' }]}
              >
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="unit" label="Unit">
                <Select>
                  <Option value="g">g</Option>
                  <Option value="kg">kg</Option>
                  <Option value="oz">oz</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="process"
                label="Process"
                rules={[{ required: true, message: 'Please select process' }]}
              >
                <Select placeholder="Select process">
                  {processes.map(process => (
                    <Option key={process} value={process}>
                      {process}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="jobId"
                label="Job ID"
              >
                <Input placeholder="e.g., JOB-001" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  {statuses.map(status => (
                    <Option key={status} value={status}>
                      <Tag color={statusColors[status as keyof typeof statusColors]}>
                        {status}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reportedBy"
                label="Reported By"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} placeholder="Add any notes about this wastage..." />
          </Form.Item>
          
          {form.getFieldValue('status') === 'Approved' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="approvedBy"
                  label="Approved By"
                  rules={[{ required: true, message: 'Please enter approver name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="approvedDate"
                  label="Approval Date"
                  rules={[{ required: true, message: 'Please select approval date' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  );
}
