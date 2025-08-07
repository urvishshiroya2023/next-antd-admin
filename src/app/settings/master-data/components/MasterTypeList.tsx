"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Space, Table, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const { Search } = Input;

// Mock data for master types
const masterTypes = [
  {
    id: '1',
    name: 'Product Categories',
    code: 'PROD_CAT',
    description: 'Categories for different types of products',
    hasSubtypes: true,
    status: 'active',
    itemsCount: 15,
  },
  {
    id: '2',
    name: 'Material Types',
    code: 'MAT_TYPE',
    description: 'Types of raw materials used in production',
    hasSubtypes: true,
    status: 'active',
    itemsCount: 8,
  },
  {
    id: '3',
    name: 'Quality Parameters',
    code: 'QUAL_PARAM',
    description: 'Parameters for quality control checks',
    hasSubtypes: false,
    status: 'active',
    itemsCount: 12,
  },
];

const MasterTypeList = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);

  const handleAddNew = () => {
    // Navigate to create new master type
    router.push('/settings/master-data/new');
  };

  const handleEdit = (type: any) => {
    // Navigate to edit master type
    router.push(`/settings/master-data/${type.id}/edit`);
  };

  const handleDelete = (type: any) => {
    setSelectedType(type);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // Handle delete logic
    console.log('Deleting:', selectedType);
    setIsDeleteModalVisible(false);
  };

  const handleViewItems = (type: any) => {
    // Navigate to view items for this master type
    router.push(`/settings/master-data/${type.id}/items`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.code}</div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Items',
      dataIndex: 'itemsCount',
      key: 'itemsCount',
      align: 'center',
      render: (count: number, record: any) => (
        <Button 
          type="link" 
          onClick={() => handleViewItems(record)}
          className="p-0"
        >
          {count} {record.hasSubtypes ? 'Subtypes' : 'Items'}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          />
          {record.hasSubtypes && (
            <Button 
              type="link" 
              onClick={() => handleViewItems(record)}
              className="p-0"
            >
              Manage Subtypes
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = masterTypes.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Master Data Types</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        >
          Add Master Type
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Search
            placeholder="Search master types..."
            allowClear
            enterButton={<SearchOutlined />}
            className="w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} master types`,
          }}
          onRow={(record) => ({
            onClick: () => handleViewItems(record),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        okType="danger"
      >
        <p>Are you sure you want to delete "{selectedType?.name}"?</p>
        <p className="text-red-500">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default MasterTypeList;
