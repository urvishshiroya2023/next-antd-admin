"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useIsClient } from "@/hooks";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Select as AntdSelect, Form, Input, message } from 'antd';
import { useRouter } from "next/navigation";
import { useState } from "react";
const { TextArea } = Input;
const { Option } = AntdSelect;

import Button from "@/ui/components/Button";
import Table from "@/ui/data-display/Table";
import Tag from "@/ui/data-display/Tag";
import Progress from "@/ui/feedback/Progress";
import Search from "@/ui/forms/Search";
import Card from "@/ui/layout/Card";
import { Col, Row } from "@/ui/layout/Grid";
import Tabs from "@/ui/navigation/Tabs";
import Dropdown from "@/ui/overlay/Dropdown";
import Modal from "@/ui/overlay/Modal";
// Use Ant Design's Input.Search directly since we don't have a custom Search component
const { Search: AntdSearch } = Input;

// Mock data for jobs
const jobData: JobType[] = [
  {
    id: 'JOB-001',
    product: 'Diamond Ring',
    customer: 'John Smith',
    status: 'In Progress',
    priority: 'High',
    progress: 65,
    dueDate: '2023-06-15',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'JOB-002',
    product: 'Gold Necklace',
    customer: 'Emily Davis',
    status: 'Completed',
    priority: 'Medium',
    progress: 100,
    dueDate: '2023-05-28',
    assignedTo: 'Mike Wilson',
  },
  {
    id: 'JOB-003',
    product: 'Silver Bracelet',
    customer: 'Robert Brown',
    status: 'On Hold',
    priority: 'Low',
    progress: 20,
    dueDate: '2023-06-20',
    assignedTo: 'Lisa Chen',
  },
  {
    id: 'JOB-004',
    product: 'Platinum Earrings',
    customer: 'Jessica Lee',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    dueDate: '2023-06-10',
    assignedTo: 'David Kim',
  },
  {
    id: 'JOB-005',
    product: 'Pearl Necklace',
    customer: 'Michael Johnson',
    status: 'In Progress',
    priority: 'Medium',
    progress: 80,
    dueDate: '2023-06-05',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'JOB-006',
    product: 'Sapphire Ring',
    customer: 'Jennifer Wilson',
    status: 'Cancelled',
    priority: 'Low',
    progress: 0,
    dueDate: '2023-05-25',
    assignedTo: 'Mike Wilson',
  },
  {
    id: 'JOB-007',
    product: 'Gold Chain',
    customer: 'Daniel Brown',
    status: 'Completed',
    priority: 'Medium',
    progress: 100,
    dueDate: '2023-05-30',
    assignedTo: 'Lisa Chen',
  },
];

// Status and priority colors
const statusColors = {
  'In Progress': 'blue',
  'Completed': 'green',
  'On Hold': 'orange',
  'Cancelled': 'red',
};

const priorityColors = {
  'High': 'red',
  'Medium': 'orange',
  'Low': 'green',
};

interface JobType {
  id: string;
  product: string;
  customer: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  dueDate: string;
  assignedTo: string;
}

interface JobFormValues {
  product: string;
  customer: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedTo: string;
}

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'In Progress':
      return <SyncOutlined spin />;
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

const JobsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<JobFormValues>();
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
      .then((values: JobFormValues) => {
        console.log('Form values:', values);
        form.resetFields();
        setIsModalVisible(false);
        message.success('Job created successfully!');
      })
      .catch((info: any) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleMenuClick = (info: { key: string; keyPath: string[]; domEvent: any }) => {
    if (info.key === 'view' && info.domEvent?.currentTarget) {
      // Get the row key from the closest tr element
      const row = info.domEvent.currentTarget.closest('tr');
      if (row) {
        const jobId = row.dataset?.rowKey;
        if (jobId) {
          router.push(`/jobs/${jobId}`);
        }
      }
    } else if (info.key === 'edit') {
      // Handle edit action
      message.info('Edit action clicked');
    } else if (info.key === 'delete') {
      // Handle delete action
      Modal.confirm({
        title: 'Delete Job',
        content: 'Are you sure you want to delete this job?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          message.success('Job deleted successfully');
        },
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Filter job data based on search and filter criteria
  const filteredData = (jobData || []).filter((job: JobType) => {
    if (!job) return false;
    
    const searchLower = (searchText || '').toLowerCase();
    const jobId = job.id || '';
    const jobProduct = job.product || '';
    const jobCustomer = job.customer || '';
    
    const matchesSearch = 
      jobId.toLowerCase().includes(searchLower) ||
      jobProduct.toLowerCase().includes(searchLower) ||
      jobCustomer.toLowerCase().includes(searchLower);
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = !priorityFilter || priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) as JobType[];

  // Define columns for the table
  const columns = [
    {
      title: 'Job ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: JobType, b: JobType) => a.id.localeCompare(b.id),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      sorter: (a: JobType, b: JobType) => a.product.localeCompare(b.product),
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
      sorter: (a: JobType, b: JobType) => a.assignedTo.localeCompare(b.assignedTo),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: JobType) => {
        const items = [
          {
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => handleMenuClick({ 
              key: 'view', 
              keyPath: ['view'],
              domEvent: { target: document.createElement('div') } 
            })
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => {}
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {}
          }
        ];
        
        return (
          <Dropdown 
            items={items}
            trigger={['click']}
          >
            <Button variant="text" icon={<MoreOutlined />} aria-label="More actions">
              <span className="sr-only">More actions</span>
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Jobs Management</h1>
          <p className="text-gray-500">Manage and track all jewelry production jobs</p>
        </div>
        <Button 
          variant="primary"
          icon={<PlusOutlined />} 
          onClick={showModal}
        >
          Create New Job
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[250px]">
              <Search 
                placeholder="Search jobs..." 
                allowClear 
                enterButton={<SearchOutlined />} 
                onSearch={handleSearch}
                className="w-full"
              />
          </div>
          <div className="flex gap-2 flex-wrap">
            <AntdSelect
              placeholder="Select status"
              allowClear
              style={{ width: 200 }}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'On Hold', label: 'On Hold' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
              onChange={(value) => setStatusFilter(value || 'all')}
              value={statusFilter}
            />
            <AntdSelect
              placeholder="Select priority"
              allowClear
              style={{ width: 150 }}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
              onChange={(value) => setPriorityFilter(value || 'all')}
              value={priorityFilter}
            />
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
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" variant="default" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            variant="primary" 
            onClick={() => form.submit()}
          >
            Create Job
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="job_form"
          initialValues={{ priority: 'Medium' }}
          onFinish={handleOk}
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
              <Form.Item<JobFormValues>
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <AntdSelect>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </AntdSelect>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<JobFormValues>
                name="assignedTo"
                label="Assigned To"
                rules={[{ required: true, message: 'Please select an assignee' }]}
              >
                <AntdSelect placeholder="Select assignee">
                  <Option value="Jane Doe">Jane Doe</Option>
                  <Option value="Mike Wilson">Mike Wilson</Option>
                  <Option value="Emily Davis">Emily Davis</Option>
                  <Option value="David Wilson">David Wilson</Option>
                  <Option value="Sarah Johnson">Sarah Johnson</Option>
                </AntdSelect>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Job Description"
            rules={[{ required: true, message: 'Please enter job description' }]}
          >
            <TextArea rows={4} placeholder="Enter job details, specifications, or special instructions" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobsPage;
