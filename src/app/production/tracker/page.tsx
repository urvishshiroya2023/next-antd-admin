"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/ui";
import { CheckCircleOutlined, ClockCircleOutlined, FilterOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Form, Input, Modal, Progress, Select, Space, Steps, Table, Tabs, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;
const { Title, Text } = Typography;

// Mock data for production orders
const productionOrders = [
  {
    id: 'PO-2023-001',
    jobId: 'JOB-001',
    product: 'Diamond Engagement Ring',
    productId: 'FG-001',
    quantity: 1,
    status: 'In Progress',
    priority: 'High',
    startDate: '2023-06-10',
    dueDate: '2023-06-25',
    assignedTo: 'John Smith',
    progress: 65,
    currentStage: 'Stone Setting',
    stages: [
      { name: 'Design Approved', status: 'completed', date: '2023-06-10', notes: 'Client approved the design' },
      { name: 'Wax Model', status: 'completed', date: '2023-06-12', notes: 'Wax model completed' },
      { name: 'Casting', status: 'completed', date: '2023-06-14', notes: 'Casting successful' },
      { name: 'Stone Setting', status: 'in-progress', date: '2023-06-16', notes: 'In progress' },
      { name: 'Polishing', status: 'pending', date: null, notes: '' },
      { name: 'Quality Check', status: 'pending', date: null, notes: '' },
      { name: 'Completed', status: 'pending', date: null, notes: '' },
    ],
  },
  {
    id: 'PO-2023-002',
    jobId: 'JOB-002',
    product: 'Gold Chain Necklace',
    productId: 'FG-002',
    quantity: 2,
    status: 'Not Started',
    priority: 'Medium',
    startDate: '2023-06-18',
    dueDate: '2023-06-30',
    assignedTo: 'Sarah Johnson',
    progress: 0,
    currentStage: 'Not Started',
    stages: [
      { name: 'Design Approved', status: 'pending', date: null, notes: '' },
      { name: 'Chain Making', status: 'pending', date: null, notes: '' },
      { name: 'Assembly', status: 'pending', date: null, notes: '' },
      { name: 'Polishing', status: 'pending', date: null, notes: '' },
      { name: 'Quality Check', status: 'pending', date: null, notes: '' },
      { name: 'Completed', status: 'pending', date: null, notes: '' },
    ],
  },
  {
    id: 'PO-2023-003',
    jobId: 'JOB-003',
    product: 'Pearl Earrings',
    productId: 'FG-003',
    quantity: 1,
    status: 'On Hold',
    priority: 'Low',
    startDate: '2023-06-05',
    dueDate: '2023-06-20',
    assignedTo: 'Mike Chen',
    progress: 30,
    currentStage: 'Casting',
    stages: [
      { name: 'Design Approved', status: 'completed', date: '2023-06-05', notes: 'Client approved' },
      { name: 'Wax Model', status: 'completed', date: '2023-06-08', notes: 'Wax model ready' },
      { name: 'Casting', status: 'in-progress', date: '2023-06-12', notes: 'Waiting for materials' },
      { name: 'Stone Setting', status: 'pending', date: null, notes: '' },
      { name: 'Polishing', status: 'pending', date: null, notes: '' },
      { name: 'Quality Check', status: 'pending', date: null, notes: '' },
      { name: 'Completed', status: 'pending', date: null, notes: '' },
    ],
  },
  {
    id: 'PO-2023-004',
    jobId: 'JOB-004',
    product: 'Men\'s Wedding Band',
    productId: 'FG-004',
    quantity: 1,
    status: 'Completed',
    priority: 'High',
    startDate: '2023-05-25',
    dueDate: '2023-06-15',
    completedDate: '2023-06-10',
    assignedTo: 'John Smith',
    progress: 100,
    currentStage: 'Completed',
    stages: [
      { name: 'Design Approved', status: 'completed', date: '2023-05-25', notes: 'Client approved' },
      { name: 'Fabrication', status: 'completed', date: '2023-05-28', notes: 'Fabrication complete' },
      { name: 'Engraving', status: 'completed', date: '2023-05-30', notes: 'Engraving completed' },
      { name: 'Polishing', status: 'completed', date: '2023-06-02', notes: 'Polished to high shine' },
      { name: 'Quality Check', status: 'completed', date: '2023-06-03', notes: 'Passed quality check' },
      { name: 'Packaging', status: 'completed', date: '2023-06-05', notes: 'Gift wrapped' },
      { name: 'Completed', status: 'completed', date: '2023-06-10', notes: 'Delivered to client' },
    ],
  },
];

const statusColors = {
  'Not Started': 'default',
  'In Progress': 'processing',
  'On Hold': 'warning',
  'Completed': 'success',
  'Cancelled': 'error',
};

const priorityColors = {
  'High': 'red',
  'Medium': 'orange',
  'Low': 'green',
};

export default function ProductionTrackerPage() {
  const { t } = useI18n();
  const router = useRouter();
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  
  // Filter data based on search and active tab
  const filteredData = productionOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.product.toLowerCase().includes(searchText.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const handleViewDetails = (record: any) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };
  
  const handleUpdateStatus = (values: any) => {
    // In a real app, this would update the order status via API
    message.success(`Production order ${selectedOrder?.id} status updated`);
    setIsModalVisible(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in-progress':
        return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return null;
    }
  };
  
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <a onClick={() => handleViewDetails(productionOrders.find(o => o.id === text))}>{text}</a>,
    },
    {
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <div>
          <div className="font-medium">{record.product}</div>
          <div className="text-xs text-gray-500">Job: {record.jobId}</div>
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
      filters: [
        { text: 'Not Started', value: 'Not Started' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'On Hold', value: 'On Hold' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: any) => (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>{record.currentStage}</span>
            <span>{record.progress}%</span>
          </div>
          <Progress 
            percent={record.progress} 
            size="small" 
            status={record.status === 'On Hold' ? 'exception' : 'active'}
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priorityColors[priority as keyof typeof priorityColors]}>
          {priority}
        </Tag>
      ),
      sorter: (a: any, b: any) => a.priority.localeCompare(b.priority),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string, record: any) => {
        const due = new Date(date);
        const today = new Date();
        const isOverdue = due < today && record.status !== 'Completed';
        
        return (
          <div className={isOverdue ? 'text-red-500' : ''}>
            {new Date(date).toLocaleDateString()}
            {isOverdue && <div className="text-xs">Overdue</div>}
          </div>
        );
      },
      sorter: (a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleViewDetails(record)}>View</Button>
          <Button size="small" onClick={() => router.push(`/jobs/${record.jobId}`)}>Job</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <Title level={3} className="mb-0">Production Tracker</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          New Production Order
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Search 
              placeholder="Search by order ID, product, or assignee..." 
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
          <div>
            <Button icon={<FilterOutlined />}>
              Filters
            </Button>
          </div>
        </div>
        
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Orders (${productionOrders.length})` },
            ...Object.entries(statusColors).map(([status, color]) => ({
              key: status,
              label: (
                <span>
                  <Tag color={color} style={{ marginRight: 8 }} />
                  {status} (
                    {productionOrders.filter(order => order.status === status).length}
                  )
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
          }}
          scroll={{ x: true }}
          onRow={(record) => ({
            onClick: () => handleViewDetails(record),
            style: { cursor: 'pointer' },
          })}
          className="mt-4"
        />
      </Card>
      
      {/* Production Order Details Modal */}
      <Modal
        title={`Production Order: ${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="update" 
            type="primary" 
            onClick={() => form.submit()}
            disabled={selectedOrder?.status === 'Completed'}
          >
            Update Status
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Text type="secondary" className="block mb-1">Product</Text>
                <Title level={5} className="mt-0">{selectedOrder.product}</Title>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Text type="secondary" className="block text-xs">Job ID</Text>
                    <Text>{selectedOrder.jobId}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block text-xs">Quantity</Text>
                    <Text>{selectedOrder.quantity}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block text-xs">Priority</Text>
                    <Tag color={priorityColors[selectedOrder.priority as keyof typeof priorityColors]}>
                      {selectedOrder.priority}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary" className="block text-xs">Assigned To</Text>
                    <Text>{selectedOrder.assignedTo}</Text>
                  </div>
                </div>
              </div>
              
              <div>
                <Text type="secondary" className="block mb-1">Timeline</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary" className="block text-xs">Start Date</Text>
                    <Text>{new Date(selectedOrder.startDate).toLocaleDateString()}</Text>
                  </div>
                  <div>
                    <Text type="secondary" className="block text-xs">Due Date</Text>
                    <Text className={new Date(selectedOrder.dueDate) < new Date() && selectedOrder.status !== 'Completed' ? 'text-red-500' : ''}>
                      {new Date(selectedOrder.dueDate).toLocaleDateString()}
                      {new Date(selectedOrder.dueDate) < new Date() && selectedOrder.status !== 'Completed' && ' (Overdue)'}
                    </Text>
                  </div>
                  {selectedOrder.completedDate && (
                    <div>
                      <Text type="secondary" className="block text-xs">Completed Date</Text>
                      <Text>{new Date(selectedOrder.completedDate).toLocaleDateString()}</Text>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Text type="secondary" className="block text-xs mb-2">Progress</Text>
                  <Progress 
                    percent={selectedOrder.progress} 
                    status={selectedOrder.status === 'On Hold' ? 'exception' : 'active'}
                  />
                  <div className="text-center text-sm mt-1">
                    {selectedOrder.currentStage}
                  </div>
                </div>
              </div>
            </div>
            
            <Divider>Production Stages</Divider>
            
            <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
              <Steps direction="vertical" current={selectedOrder.stages.findIndex((s: any) => s.status === 'pending') - 1}>
                {selectedOrder.stages.map((stage: any) => (
                  <Step
                    key={stage.name}
                    title={stage.name}
                    status={stage.status === 'completed' ? 'finish' : 
                            stage.status === 'in-progress' ? 'process' : 'wait'}
                    description={
                      <div className="mt-1">
                        {stage.date && (
                          <div className="text-xs text-gray-500">
                            {new Date(stage.date).toLocaleDateString()}
                          </div>
                        )}
                        {stage.notes && (
                          <div className="text-xs mt-1">{stage.notes}</div>
                        )}
                      </div>
                    }
                  />
                ))}
              </Steps>
              
              <Divider>Update Status</Divider>
              
              <Form.Item name="status" label="Update Stage Status" initialValue={selectedOrder.status}>
                <Select>
                  <Option value="Not Started">Not Started</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="On Hold">On Hold</Option>
                  <Option value="Completed" disabled={selectedOrder.status === 'Completed'}>Mark as Completed</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={3} placeholder="Add any notes about this update..." />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
