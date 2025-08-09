"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/ui";
import { CheckCircleOutlined, EditOutlined, FileExcelOutlined, FilePdfOutlined, FilterOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { App, Button, Col, DatePicker, Divider, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Tabs, Tag, Tooltip, Typography } from "antd";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// Mock data for rejection records
const rejectionData = [
  {
    id: 'REJ-2023-001',
    date: '2023-06-18',
    itemId: 'PO-2023-012',
    itemName: 'Diamond Ring',
    itemType: 'Semi-Finished',
    category: 'Rings',
    quantity: 1,
    unit: 'pcs',
    defectType: 'Casting Defect',
    defectSeverity: 'High',
    reportedBy: 'John Smith',
    status: 'Pending',
    notes: 'Porosity in the band',
    resolution: '',
    resolvedBy: '',
    resolvedDate: '',
  },
  {
    id: 'REJ-2023-002',
    date: '2023-06-15',
    itemId: 'RM-2023-045',
    itemName: '18K Gold Chain',
    itemType: 'Raw Material',
    category: 'Chains',
    quantity: 2,
    unit: 'meters',
    defectType: 'Dimensional Issue',
    defectSeverity: 'Medium',
    reportedBy: 'Sarah Johnson',
    status: 'In Review',
    notes: 'Inconsistent thickness',
    resolution: '',
    resolvedBy: '',
    resolvedDate: '',
  },
  {
    id: 'REJ-2023-003',
    date: '2023-06-10',
    itemId: 'FG-2023-078',
    itemName: 'Pearl Earrings',
    itemType: 'Finished Good',
    category: 'Earrings',
    quantity: 1,
    unit: 'pair',
    defectType: 'Quality Issue',
    defectSeverity: 'Critical',
    reportedBy: 'Mike Chen',
    status: 'Resolved',
    notes: 'Pearl not centered properly',
    resolution: 'Item reworked and passed quality check',
    resolvedBy: 'Jane Doe',
    resolvedDate: '2023-06-12',
  },
];

const itemTypes = ['Raw Material', 'Semi-Finished', 'Finished Good'];
const categories = ['Rings', 'Chains', 'Earrings', 'Pendants', 'Bracelets', 'Other'];
const defectTypes = ['Casting Defect', 'Dimensional Issue', 'Surface Finish', 'Quality Issue', 'Material Defect', 'Other'];
const severities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Pending', 'In Review', 'Resolved', 'Rejected'];

const statusColors = {
  'Pending': 'orange',
  'In Review': 'blue',
  'Resolved': 'green',
  'Rejected': 'red',
};

const severityColors = {
  'Low': 'green',
  'Medium': 'lime',
  'High': 'orange',
  'Critical': 'red',
};

export default function RejectionsPage() {
  const { t } = useI18n();
  const router = useRouter();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp ? App.useApp() : { message: Modal, modal: Modal };
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  
  // Filter data based on search and active tab
  const filteredData = rejectionData.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchText.toLowerCase()) ||
      record.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.itemId.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesTab = activeTab === 'all' || record.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const handleAddNew = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'Pending',
      unit: 'pcs',
      date: new Date(),
      defectSeverity: 'Medium'
    });
    setIsModalVisible(true);
  };
  
  const handleEdit = (record: any) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? new Date(record.date) : null,
      resolvedDate: record.resolvedDate ? new Date(record.resolvedDate) : null,
    });
    setIsModalVisible(true);
  };
  
  const handleSubmit = async (values: any) => {
    try {
      // In a real app, this would be an API call
      const action = currentRecord ? 'updated' : 'added';
      console.log('Form submitted with values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      message.success(`Rejection record ${action} successfully`);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Failed to save rejection record');
    }
  };
  
  const handleResolve = (values: any) => {
    // In a real app, this would update the status via API
    message.success('Rejection marked as resolved');
    setIsModalVisible(false);
  };
  
  const columns = [
    {
      title: 'Rejection ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <a onClick={() => handleEdit(rejectionData.find(r => r.id === text))}>{text}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Item',
      key: 'item',
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.itemName}</div>
          <div className="text-xs text-gray-500">{record.itemType} • {record.itemId}</div>
        </div>
      ),
    },
    {
      title: 'Defect',
      key: 'defect',
      render: (record: any) => (
        <div>
          <div>{record.defectType}</div>
          <Tag 
            color={severityColors[record.defectSeverity as keyof typeof severityColors]}
            className="mt-1"
          >
            {record.defectSeverity}
          </Tag>
        </div>
      ),
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
          <Tooltip title="View/Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
          {record.status !== 'Resolved' && record.status !== 'Rejected' && (
            <Tooltip title="Mark as Resolved">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentRecord(record);
                  form.setFieldsValue({
                    ...record,
                    status: 'Resolved',
                    resolvedBy: 'Current User', // In real app, get from auth context
                    resolvedDate: new Date(),
                  });
                  setIsModalVisible(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];
  
  // Calculate rejection statistics
  const rejectionStats = {
    total: rejectionData.length,
    byStatus: rejectionData.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySeverity: rejectionData.reduce((acc, curr) => {
      acc[curr.defectSeverity] = (acc[curr.defectSeverity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">Quality Rejections</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          New Rejection
        </Button>
      </div>
      
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="text-2xl font-semibold">{rejectionStats.total}</div>
            <div className="text-gray-500">Total Rejections</div>
          </Card>
        </Col>
        {Object.entries(rejectionStats.byStatus).map(([status, count]) => (
          <Col xs={24} sm={12} md={6} key={status}>
            <Card>
              <div className="text-2xl font-semibold">{count}</div>
              <div className="text-gray-500">
                <Tag color={statusColors[status as keyof typeof statusColors]}>
                  {status}
                </Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Search 
              placeholder="Search by ID, item, or reference..." 
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
            { key: 'all', label: `All Rejections (${rejectionData.length})` },
            ...statuses.map(status => ({
              key: status,
              label: (
                <span>
                  <Tag color={statusColors[status as keyof typeof statusColors]} style={{ marginRight: 8 }} />
                  {status} ({rejectionStats.byStatus[status] || 0})
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} rejections`,
          }}
          scroll={{ x: true }}
          className="mt-4"
        />
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        title={currentRecord ? 'Edit Rejection Record' : 'New Rejection Record'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={currentRecord ? 'Update' : 'Save'}
        cancelText="Cancel"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'Pending',
            unit: 'pcs',
            date: currentRecord?.date ? dayjs(currentRecord.date) : dayjs(),
            defectSeverity: 'Medium',
            ...currentRecord,
            // Ensure we don't override the date from currentRecord if it exists
            ...(currentRecord?.date ? { date: dayjs(currentRecord.date) } : {})
          }}
          preserve={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Rejection Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
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
                    <Option key={status} value={status}>
                      <Tag color={statusColors[status as keyof typeof statusColors]}>
                        {status}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider>Item Details</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="itemType"
                label="Item Type"
                rules={[{ required: true, message: 'Please select item type' }]}
              >
                <Select placeholder="Select item type">
                  {itemTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="itemId"
                label="Item ID/Reference"
                rules={[{ required: true, message: 'Please enter item reference' }]}
              >
                <Input placeholder="e.g., PO-2023-012, RM-123" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="itemName"
                label="Item Name/Description"
                rules={[{ required: true, message: 'Please enter item name' }]}
              >
                <Input placeholder="e.g., Diamond Ring, 18K Gold Chain" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="unit"
                label="Unit"
                rules={[{ required: true, message: 'Please select unit' }]}
              >
                <Select>
                  <Option value="pcs">Pieces</Option>
                  <Option value="g">Grams</Option>
                  <Option value="kg">Kilograms</Option>
                  <Option value="oz">Ounces</Option>
                  <Option value="meters">Meters</Option>
                  <Option value="pair">Pair</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider>Defect Information</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defectType"
                label="Defect Type"
                rules={[{ required: true, message: 'Please select defect type' }]}
              >
                <Select placeholder="Select defect type">
                  {defectTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="defectSeverity"
                label="Severity"
                rules={[{ required: true }]}
              >
                <Select>
                  {severities.map(severity => (
                    <Option key={severity} value={severity}>
                      <Tag color={severityColors[severity as keyof typeof severityColors]}>
                        {severity}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notes"
            label="Defect Details"
            rules={[{ required: true, message: 'Please provide defect details' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the defect in detail..." />
          </Form.Item>
          
          {form.getFieldValue('status') === 'Resolved' && (
            <>
              <Divider>Resolution Details</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="resolvedBy"
                    label="Resolved By"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="resolvedDate"
                    label="Resolution Date"
                    rules={[{ required: true, message: 'Please select resolution date' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="resolution"
                label="Resolution Details"
                rules={[{ required: true, message: 'Please provide resolution details' }]}
              >
                <Input.TextArea rows={3} placeholder="Describe how the issue was resolved..." />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
