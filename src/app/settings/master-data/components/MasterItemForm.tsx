"use client";

import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select, Space, message, Breadcrumb } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

// Mock data for parent items
const mockParentItems = [
  { id: '1', name: 'Rings', code: 'RING' },
  { id: '2', name: 'Necklaces', code: 'NECK' },
  { id: '3', name: 'Earrings', code: 'EARR' },
];

// Mock master type data
const mockMasterType = (id: string) => ({
  '1': { id: '1', name: 'Product Categories', code: 'PROD_CAT' },
  '2': { id: '2', name: 'Material Types', code: 'MAT_TYPE' },
}[id] || { id, name: 'Unknown Type', code: 'UNKNOWN' });

interface MasterItemFormProps {
  masterTypeId: string;
  itemId?: string;
  parentItemId?: string;
  isEdit?: boolean;
}

const MasterItemForm = ({ 
  masterTypeId, 
  itemId, 
  parentItemId, 
  isEdit = false 
}: MasterItemFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parentItem, setParentItem] = useState<any>(null);
  
  const masterType = mockMasterType(masterTypeId);
  
  // Load item data if in edit mode
  useEffect(() => {
    if (isEdit && itemId) {
      // Simulate API call to fetch item data
      setLoading(true);
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const mockItemData = {
          name: 'Sample Item',
          code: 'SMPL',
          description: 'Sample description',
          status: 'active',
        };
        form.setFieldsValue(mockItemData);
        setLoading(false);
      }, 500);
    }
  }, [isEdit, itemId, form]);
  
  // Load parent item data if available
  useEffect(() => {
    if (parentItemId) {
      // In a real app, fetch parent item data from API
      const foundParent = mockParentItems.find(item => item.id === parentItemId);
      if (foundParent) {
        setParentItem(foundParent);
      }
    }
  }, [parentItemId]);

  const handleBack = () => {
    if (parentItemId) {
      router.push(`/settings/master-data/${masterTypeId}/items/${parentItemId}`);
    } else {
      router.push(`/settings/master-data/${masterTypeId}/items`);
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form values:', {
        ...values,
        masterTypeId,
        parentItemId: parentItemId || null,
      });
      
      message.success(
        isEdit 
          ? 'Item updated successfully!' 
          : 'Item created successfully!'
      );
      
      // Redirect back to the list
      if (parentItemId) {
        router.push(`/settings/master-data/${masterTypeId}/items/${parentItemId}`);
      } else {
        router.push(`/settings/master-data/${masterTypeId}/items`);
      }
      
      setLoading(false);
    }, 1000);
  };

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
      onClick: () => router.push(`/settings/master-data/${masterTypeId}/items/${parentItemId}`)
    });
  }

  breadcrumbItems.push({
    title: isEdit ? 'Edit Item' : 'New Item',
    onClick: () => {}
  });

  return (
    <div>
      <div className="mb-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
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

        <h2 className="text-xl font-semibold mb-6">
          {isEdit ? 'Edit' : 'Add New'} {parentItem ? 'Sub Item' : 'Item'}
        </h2>
      </div>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active',
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please enter a code' }]}
          >
            <Input placeholder="Enter code (e.g., RING, GOLD)" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          
          {parentItem && (
            <Form.Item
                name="parentName"
                label="Parent Item"
            >
              <Input 
                value={parentItem?.name} 
                disabled 
              />
            </Form.Item>
          )}
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter description (optional)" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          
          <div className="flex justify-end gap-2 mt-8">
            <Button onClick={handleBack}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEdit ? 'Update' : 'Save'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default MasterItemForm;
