"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useIsClient } from "@/hooks";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  PauseCircleOutlined,
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
  Menu,
  Modal,
  Progress,
  Row,
  Select,
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

// Mock data for jobs
const jobData = [
  {
    id: 'JOB-001',
    product: 'Diamond Ring',
    customer: 'John Smith',
    status: 'In Progress',
    priority: 'High',
    startDate: '2023-06-01',
    dueDate: '2023-06-15',
    progress: 65,
    assignedTo: 'Jane Doe',
  },
  {
    id: 'JOB-002',
    product: 'Gold Necklace',
    customer: 'Sarah Johnson',
    status: 'In Progress',
    priority: 'Medium',
    startDate: '2023-06-05',
    dueDate: '2023-06-20',
    progress: 30,
    assignedTo: 'Mike Wilson',
  },
  {
    id: 'JOB-003',
    product: 'Silver Bracelet',
    customer: 'Robert Brown',
    status: 'On Hold',
    priority: 'Low',
    startDate: '2023-05-25',
    dueDate: '2023-06-10',
    progress: 15,
    assignedTo: 'Emily Davis',
  },
  {
    id: 'JOB-004',
    product: 'Platinum Earrings',
    customer: 'Lisa Anderson',
    status: 'Completed',
    priority: 'High',
    startDate: '2023-05-20',
    dueDate: '2023-06-05',
    progress: 100,
    assignedTo: 'David Wilson',
  },
  {
    id: 'JOB-005',
    product: 'Gold Pendant',
    customer: 'Michael Clark',
    status: 'In Progress',
    priority: 'Medium',
    startDate: '2023-06-10',
    dueDate: '2023-06-25',
    progress: 45,
    assignedTo: 'Sarah Johnson',
  },
];

const statusColors = {
  'In Progress': 'processing',
  'Completed': 'success',
  'On Hold': 'warning',
  'Cancelled': 'error',
};

const priorityColors = {
  'High': 'red',
  'Medium': 'orange',
  'Low': 'blue',
};

export default function JobsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const isClient = useIsClient();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Received values of form: ', values);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <ClockCircleOutlined />;
      case 'Completed':
        return <CheckCircleOutlined />;
      case 'On Hold':
        return <PauseCircleOutlined />;
      case 'Cancelled':
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sorter: (a: any, b: any) => a.product.localeCompare(b.product),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a: any, b: any) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        isClient ? (
          <Tag 
            icon={getStatusIcon(status)}
            color={statusColors[status as keyof typeof statusColors]}
          >
            {status}
          </Tag>
        ) : (
          <span>{status}</span>
        )
      ),
      filters: [
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Completed', value: 'Completed' },
        { text: 'On Hold', value: 'On Hold' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        isClient ? (
          <Tag color={priorityColors[priority as keyof typeof priorityColors]}>
            {priority}
          </Tag>
        ) : (
          <span>{priority}</span>
        )
      ),
      filters: [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
      ],
      onFilter: (value: any, record: any) => record.priority === value,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div style={{ minWidth: 100 }}>
          <div style={{ marginBottom: 5 }}>{progress}%</div>
          {isClient ? (
            <Progress 
              percent={progress} 
              size="small" 
              status={progress === 100 ? 'success' : 'active'} 
              showInfo={false}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: '#f0f0f0',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  backgroundColor: progress === 100 ? '#52c41a' : '#1890ff',
                  transition: 'width 0.3s',
                  borderRadius: 'inherit'
                }} 
              />
            </div>
          )}
        </div>
      ),
      sorter: (a: any, b: any) => a.progress - b.progress,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      sorter: (a: any, b: any) => a.assignedTo.localeCompare(b.assignedTo),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewJob(record.id)}>
                View Details
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Edit
              </Menu.Item>
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

  const filteredData = jobData.filter((job) => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchText.toLowerCase()) ||
      job.product.toLowerCase().includes(searchText.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-2xl font-semibold">Jobs Management</h1>
          <p className="text-gray-500">Manage and track all jewelry production jobs</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showModal}
        >
          Create New Job
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[250px]">
            <Search 
              placeholder="Search jobs..." 
              allowClear 
              enterButton={<SearchOutlined />} 
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setStatusFilter(value || 'all')}
            >
              <Option value="all">All Statuses</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="On Hold">On Hold</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
            <Select
              placeholder="Priority"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setPriorityFilter(value || 'all')}
            >
              <Option value="all">All Priorities</Option>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
            <Button icon={<FilterOutlined />}>
              More Filters
            </Button>
          </div>
        </div>

        <Tabs 
          defaultActiveKey="all"
          items={[
            {
              key: 'all',
              label: 'All Jobs',
              children: (
                <Table 
                  columns={columns} 
                  dataSource={filteredData} 
                  rowKey="id"
                  scroll={{ x: 1300 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} jobs`,
                  }}
                />
              ),
            },
            {
              key: 'inProgress',
              label: 'In Progress',
              children: (
                <Table 
                  columns={columns} 
                  dataSource={filteredData.filter(job => job.status === 'In Progress')} 
                  rowKey="id"
                  scroll={{ x: 1300 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              ),
            },
            {
              key: 'completed',
              label: 'Completed',
              children: (
                <Table 
                  columns={columns} 
                  dataSource={filteredData.filter(job => job.status === 'Completed')} 
                  rowKey="id"
                  scroll={{ x: 1300 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              ),
            },
            {
              key: 'onHold',
              label: 'On Hold',
              children: (
                <Table 
                  columns={columns} 
                  dataSource={filteredData.filter(job => job.status === 'On Hold')} 
                  rowKey="id"
                  scroll={{ x: 1300 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              ),
            }
          ]}
        />
      </Card>

      {/* Create Job Modal */}
      <Modal
        title="Create New Job"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create Job
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="job_form"
          initialValues={{ priority: 'Medium' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="e.g., Diamond Ring, Gold Necklace" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customer"
                label="Customer Name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="Customer name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[{ required: true, message: 'Please select an assignee' }]}
              >
                <Select placeholder="Select assignee">
                  <Option value="Jane Doe">Jane Doe</Option>
                  <Option value="Mike Wilson">Mike Wilson</Option>
                  <Option value="Emily Davis">Emily Davis</Option>
                  <Option value="David Wilson">David Wilson</Option>
                  <Option value="Sarah Johnson">Sarah Johnson</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Job Description"
          >
            <Input.TextArea rows={4} placeholder="Enter job details, specifications, or special instructions" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
