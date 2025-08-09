"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/ui";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FilterOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, DatePicker, Dropdown, Input, Select, Space, Table, Tabs, Tag, Typography } from "antd";
import type { Dayjs } from 'dayjs';
import React, { useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// Mock data for quality checks
const qualityChecks = [
  {
    id: 'QC-2023-001',
    product: 'Diamond Ring 18K',
    batch: 'B-2023-045',
    status: 'passed',
    checkedBy: 'John Doe',
    checkedAt: '2023-06-20 14:30',
    notes: 'All quality parameters within limits',
  },
  {
    id: 'QC-2023-002',
    product: 'Gold Chain 22K',
    batch: 'B-2023-046',
    status: 'failed',
    checkedBy: 'Jane Smith',
    checkedAt: '2023-06-19 11:15',
    notes: 'Surface finish not meeting standards',
  },
  {
    id: 'QC-2023-003',
    product: 'Silver Pendant',
    batch: 'B-2023-047',
    status: 'pending',
    checkedBy: '',
    checkedAt: '',
    notes: 'Awaiting inspection',
  },
];

const QualityPage = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchText, setSearchText] = useState('');

  const filteredChecks = qualityChecks.filter(check => {
    const matchesTab = activeTab === 'all' || check.status === activeTab;
    const matchesSearch = check.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         check.product.toLowerCase().includes(searchText.toLowerCase()) ||
                         check.batch.toLowerCase().includes(searchText.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const statusFilters = [
    { value: 'all', label: 'All', color: 'default', count: qualityChecks.length },
    { value: 'passed', label: 'Passed', color: 'success', count: qualityChecks.filter(c => c.status === 'passed').length },
    { value: 'failed', label: 'Failed', color: 'error', count: qualityChecks.filter(c => c.status === 'failed').length },
    { value: 'pending', label: 'Pending', color: 'processing', count: qualityChecks.filter(c => c.status === 'pending').length },
  ];

  const columns = [
    {
      title: 'Check ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.checkedAt || 'Not checked yet'}</Text>
        </Space>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>Batch: {record.batch}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string; icon: React.ReactNode }> = {
          passed: { text: 'Passed', color: 'success', icon: <CheckCircleOutlined /> },
          failed: { text: 'Failed', color: 'error', icon: <CloseCircleOutlined /> },
          pending: { text: 'Pending', color: 'processing', icon: <ClockCircleOutlined /> },
        };
        const statusInfo = statusMap[status] || { text: status, color: 'default', icon: null };
        return (
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: 'Checked By',
      dataIndex: 'checkedBy',
      key: 'checkedBy',
      render: (text: string) => text || '-',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text: string) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <Title level={3} className="mb-0">Quality Control</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          New Quality Check
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by ID, product, or batch..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%', maxWidth: 400 }}
            />
          </div>
          <div className="flex items-center gap-2">
            <RangePicker 
              value={dateRange} 
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
              className="w-full md:w-auto"
            />
            <Dropdown
              menu={{
                items: [
                  { key: 'export-pdf', label: 'Export as PDF' },
                  { key: 'export-excel', label: 'Export as Excel' }
                ]
              }}
              trigger={['click']}
            >
              <Button icon={<FilterOutlined />}>
                Filter & Export
              </Button>
            </Dropdown>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={statusFilters.map(filter => ({
            key: filter.value,
            label: (
              <Badge count={filter.count} size="small" offset={[5, 0]}>
                <span style={{ marginRight: 8 }}>{filter.label}</span>
              </Badge>
            ),
          }))}
        />

        <Table
          columns={columns}
          dataSource={filteredChecks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} quality checks`,
          }}
          rowClassName={(record) => `quality-check-row quality-check-${record.status}`}
        />
      </Card>

      <style jsx global>{`
        .quality-check-row:hover {
          cursor: pointer;
          background-color: #fafafa;
        }
        .quality-check-passed {
          border-left: 3px solid #52c41a;
        }
        .quality-check-failed {
          border-left: 3px solid #f5222d;
        }
        .quality-check-pending {
          border-left: 3px solid #1890ff;
        }
      `}</style>
    </div>
  );
};

export default QualityPage;
