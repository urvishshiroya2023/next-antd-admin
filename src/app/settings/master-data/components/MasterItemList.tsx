"use client";

import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Table, Tag, Modal, Breadcrumb } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Search } = Input;

// Mock data for master items
const mockMasterItems: Record<string, any[]> = {
  '1': [
    { id: '1-1', name: 'Rings', code: 'RING', status: 'active', parentId: null },
    { id: '1-2', name: 'Necklaces', code: 'NECK', status: 'active', parentId: null },
    { id: '1-3', name: 'Earrings', code: 'EARR', status: 'active', parentId: null },
  ],
  '2': [
    { id: '2-1', name: 'Gold', code: 'GOLD', status: 'active', parentId: null },
    { id: '2-2', name: 'Silver', code: 'SLVR', status: 'active', parentId: null },
    { id: '2-3', name: 'Platinum', code: 'PLAT', status: 'inactive', parentId: null },
  ],
};

// Mock master type data
const mockMasterType = (id: string) => ({
  '1': { id: '1', name: 'Product Categories', code: 'PROD_CAT' },
  '2': { id: '2', name: 'Material Types', code: 'MAT_TYPE' },
}[id] || { id, name: 'Unknown Type', code: 'UNKNOWN' });

interface MasterItemListProps {
  masterTypeId: string;
  parentItem?: { id: string; name: string };
}

const MasterItemList = ({ masterTypeId, parentItem }: MasterItemListProps) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const masterType = mockMasterType(masterTypeId);
  const items = mockMasterItems[masterTypeId] || [];
  
  const handleAddNew = () => {
    const basePath = `/settings/master-data/${masterTypeId}/items`;
    const path = parentItem 
      ? `${basePath}/${parentItem.id}/new` 
      : `${basePath}/new`;
    router.push(path);
  };

  const handleEdit = (item: any) => {
    const basePath = `/settings/master-data/${masterTypeId}/items`;
    const path = parentItem 
      ? `${basePath}/${parentItem.id}/edit/${item.id}` 
      : `${basePath}/edit/${item.id}`;
    router.push(path);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // Handle delete logic
    console.log('Deleting:', selectedItem);
    setIsDeleteModalVisible(false);
  };

  const handleViewSubItems = (item: any) => {
    const basePath = `/settings/master-data/${masterTypeId}/items`;
    const path = parentItem 
      ? `${basePath}/${parentItem.id}/items/${item.id}`
      : `${basePath}/${item.id}`;
    router.push(path);
  };

  const handleBack = () => {
    if (parentItem) {
      // Go up one level in the hierarchy
      const pathParts = window.location.pathname.split('/');
      const newPath = pathParts.slice(0, -2).join('/');
      router.push(newPath);
    } else {
      // Go back to master types list
      router.push('/settings/master-data');
    }
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
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
          />
        </Space>
      ),
    },
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  // Build breadcrumb items
  const breadcrumbItems = [
    { title: 'Master Data', onClick: () => router.push('/settings/master-data') },
    { 
      title: masterType.name,
      onClick: () => router.push(`/settings/master-data/${masterTypeId}/items`)
    },
  ];

  if (parentItem) {
    breadcrumbItems.push({
      title: parentItem.name,
      onClick: () => {}
    });
  }

  return (
    <div>
      <div className="mb-4">
        <Button 
          type="text" 
          icon={<DatabaseOutlined />} 
          onClick={handleBack}
          className="p-0 mb-2"
        >
          Back
        </Button>
        
        <Breadcrumb className="mb-4">
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item 
              key={index} 
              onClick={item.onClick}
              className={index === breadcrumbItems.length - 1 ? 'text-gray-500' : 'cursor-pointer hover:text-blue-500'}
            >
              {item.title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {parentItem ? `${parentItem.name} - Sub Items` : masterType.name}
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add {parentItem ? 'Sub Item' : 'Item'}
          </Button>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <Search
            placeholder={`Search ${parentItem ? 'sub items' : 'items'}...`}
            allowClear
            enterButton={<SearchOutlined />}
            className="w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} ${parentItem ? 'sub items' : 'items'}`,
          }}
          onRow={(record) => ({
            onClick: () => handleViewSubItems(record),
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
        <p>Are you sure you want to delete "{selectedItem?.name}"?</p>
        <p className="text-red-500">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default MasterItemList;
