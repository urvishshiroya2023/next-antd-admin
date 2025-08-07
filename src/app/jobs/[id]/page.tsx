"use client";

import React, { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Descriptions, 
  Tabs, 
  Timeline, 
  List, 
  Avatar, 
  Progress, 
  Divider, 
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message
} from "antd";
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PauseCircleOutlined, 
  CloseCircleOutlined,
  UserOutlined,
  PlusOutlined,
  FileTextOutlined,
  ToolOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  AlertFilled,
  FileDoneOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock data for job details
const jobDetails = {
  id: 'JOB-001',
  product: 'Diamond Ring',
  customer: 'John Smith',
  status: 'In Progress',
  priority: 'High',
  startDate: '2023-06-01',
  dueDate: '2023-06-15',
  progress: 65,
  assignedTo: 'Jane Doe',
  description: 'Custom diamond engagement ring with 1.5 carat center stone and pave diamond band.',
  materials: [
    { id: 'MAT-001', name: '18K White Gold', quantity: 5.2, unit: 'g' },
    { id: 'MAT-002', name: 'Diamond (1.5ct)', quantity: 1, unit: 'pcs' },
    { id: 'MAT-003', name: 'Pave Diamonds', quantity: 15, unit: 'pcs' },
  ],
  processes: [
    { id: 'PROC-001', name: 'Design', status: 'Completed', completedDate: '2023-06-02', assignedTo: 'Design Team' },
    { id: 'PROC-002', name: 'Wax Model', status: 'Completed', completedDate: '2023-06-05', assignedTo: 'Modeling Team' },
    { id: 'PROC-003', name: 'Casting', status: 'In Progress', dueDate: '2023-06-10', assignedTo: 'Casting Team' },
    { id: 'PROC-004', name: 'Stone Setting', status: 'Pending', dueDate: '2023-06-12', assignedTo: 'Stone Setting Team' },
    { id: 'PROC-005', name: 'Polishing', status: 'Pending', dueDate: '2023-06-14', assignedTo: 'Polishing Team' },
    { id: 'PROC-006', name: 'Quality Control', status: 'Pending', dueDate: '2023-06-15', assignedTo: 'QC Team' },
  ],
  notes: [
    { id: 'NOTE-001', author: 'Jane Doe', date: '2023-06-05 14:30', content: 'Customer approved the design. Proceeding to wax model.' },
    { id: 'NOTE-002', author: 'Mike Wilson', date: '2023-06-07 10:15', content: 'Wax model completed and approved. Ready for casting.' },
  ],
  files: [
    { id: 'FILE-001', name: 'design-specs.pdf', type: 'pdf', size: '2.4 MB', uploaded: '2023-06-01' },
    { id: 'FILE-002', name: 'customer-approval.jpg', type: 'image', size: '1.2 MB', uploaded: '2023-06-03' },
  ],
};

const statusIcons = {
  'In Progress': <ClockCircleFilled style={{ color: '#1890ff' }} />,
  'Completed': <CheckCircleFilled style={{ color: '#52c41a' }} />,
  'On Hold': <AlertFilled style={{ color: '#faad14' }} />,
  'Cancelled': <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [noteForm] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const handleAddNote = (values: any) => {
    console.log('New note:', values);
    message.success('Note added successfully');
    setIsNoteModalVisible(false);
    noteForm.resetFields();
  };

  const handleUpdateJob = (values: any) => {
    console.log('Updated job:', values);
    message.success('Job updated successfully');
    setIsEditModalVisible(false);
  };

  const getProcessIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'In Progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'On Hold':
        return <PauseCircleOutlined style={{ color: '#faad14' }} />;
      case 'Cancelled':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="mb-2"
        >
          Back to Jobs
        </Button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              {jobDetails.product}
              <Tag 
                color={
                  jobDetails.status === 'In Progress' ? 'processing' :
                  jobDetails.status === 'Completed' ? 'success' :
                  jobDetails.status === 'On Hold' ? 'warning' : 'error'
                }
                className="ml-2"
              >
                {jobDetails.status}
              </Tag>
              <Tag color={jobDetails.priority === 'High' ? 'red' : jobDetails.priority === 'Medium' ? 'orange' : 'blue'}>
                {jobDetails.priority} Priority
              </Tag>
            </h1>
            <p className="text-gray-500">Job ID: {jobDetails.id}</p>
          </div>
          
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setIsEditModalVisible(true)}>
              Edit Job
            </Button>
            <Button type="primary" icon={<FileDoneOutlined />}>
              Complete Job
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} lg={16}>
          <Card className="mb-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Job Progress</h3>
              <Progress 
                percent={jobDetails.progress} 
                status={jobDetails.progress === 100 ? 'success' : 'active'} 
                size="small"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Start: {jobDetails.startDate}</span>
                <span>Due: {jobDetails.dueDate}</span>
              </div>
            </div>

            <Divider className="my-4" />
            
            <h3 className="text-lg font-medium mb-4">Production Process</h3>
            <Timeline mode="left">
              {jobDetails.processes.map((process) => (
                <Timeline.Item 
                  key={process.id}
                  dot={getProcessIcon(process.status)}
                  color={
                    process.status === 'Completed' ? 'green' :
                    process.status === 'In Progress' ? 'blue' :
                    process.status === 'On Hold' ? 'orange' : 'gray'
                  }
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium mb-1">{process.name}</p>
                      <p className="text-sm text-gray-500">Assigned to: {process.assignedTo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {process.status === 'Completed' ? (
                          <span className="text-green-500">Completed on {process.completedDate}</span>
                        ) : (
                          <span className="text-gray-500">Due: {process.dueDate}</span>
                        )}
                      </p>
                      {process.status === 'In Progress' && (
                        <Button type="link" size="small" className="p-0">
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Card title="Notes & Comments" className="mb-4">
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={() => setIsNoteModalVisible(true)}
              className="mb-4"
              block
            >
              Add Note
            </Button>
            
            <List
              itemLayout="horizontal"
              dataSource={jobDetails.notes}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <div className="flex justify-between">
                        <span>{item.author}</span>
                        <span className="text-gray-500 text-sm">{item.date}</span>
                      </div>
                    }
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Job Details" className="mb-4">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Job ID">{jobDetails.id}</Descriptions.Item>
              <Descriptions.Item label="Product">{jobDetails.product}</Descriptions.Item>
              <Descriptions.Item label="Customer">{jobDetails.customer}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag 
                  color={
                    jobDetails.status === 'In Progress' ? 'processing' :
                    jobDetails.status === 'Completed' ? 'success' :
                    jobDetails.status === 'On Hold' ? 'warning' : 'error'
                  }
                >
                  {jobDetails.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={jobDetails.priority === 'High' ? 'red' : jobDetails.priority === 'Medium' ? 'orange' : 'blue'}>
                  {jobDetails.priority}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">{jobDetails.startDate}</Descriptions.Item>
              <Descriptions.Item label="Due Date">{jobDetails.dueDate}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">{jobDetails.assignedTo}</Descriptions.Item>
            </Descriptions>
            
            <Divider className="my-4" />
            
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700">{jobDetails.description}</p>
            
            <Divider className="my-4" />
            
            <h4 className="font-medium mb-2">Materials</h4>
            <List
              size="small"
              dataSource={jobDetails.materials}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            
            <Divider className="my-4" />
            
            <h4 className="font-medium mb-2">Files & Attachments</h4>
            <List
              size="small"
              dataSource={jobDetails.files}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<FileTextOutlined />}
                    title={
                      <a href="#" className="text-blue-500">
                        {item.name}
                      </a>
                    }
                    description={`${item.size} • Uploaded on ${item.uploaded}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Add Note Modal */}
      <Modal
        title="Add Note"
        open={isNoteModalVisible}
        onOk={() => noteForm.submit()}
        onCancel={() => setIsNoteModalVisible(false)}
      >
        <Form
          form={noteForm}
          layout="vertical"
          onFinish={handleAddNote}
        >
          <Form.Item
            name="content"
            label="Note"
            rules={[{ required: true, message: 'Please enter your note' }]}
          >
            <TextArea rows={4} placeholder="Enter your note here..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        title="Edit Job Details"
        open={isEditModalVisible}
        onOk={() => editForm.submit()}
        onCancel={() => setIsEditModalVisible(false)}
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateJob}
          initialValues={{
            product: jobDetails.product,
            customer: jobDetails.customer,
            status: jobDetails.status,
            priority: jobDetails.priority,
            startDate: jobDetails.startDate,
            dueDate: jobDetails.dueDate,
            assignedTo: jobDetails.assignedTo,
            description: jobDetails.description,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product"
                label="Product"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customer"
                label="Customer"
                rules={[{ required: true }]
              }
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="On Hold">On Hold</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[{ required: true }]
              }
              >
                <Select>
                  <Option value="Jane Doe">Jane Doe</Option>
                  <Option value="Mike Wilson">Mike Wilson</Option>
                  <Option value="Emily Davis">Emily Davis</Option>
                  <Option value="David Wilson">David Wilson</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
