"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Card } from "@/ui";
import { BarChartOutlined, DownloadOutlined, FileExcelOutlined, FilePdfOutlined, PieChartOutlined, TableOutlined } from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Tabs, Typography } from "antd";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chart.js/auto'; // Import chart.js components
import type { Dayjs } from 'dayjs';
import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ReportType {
  key: string;
  label: string;
  icon: React.ReactNode;
}

type PieChartData = ChartData<'pie', number[], string>;
type BarChartData = ChartData<'bar', number[], string>;

const reportTypes: ReportType[] = [
  { key: 'production', label: 'Production', icon: <BarChartOutlined /> },
  { key: 'quality', label: 'Quality', icon: <PieChartOutlined /> },
  { key: 'inventory', label: 'Inventory', icon: <TableOutlined /> },
];

const qualityData: PieChartData = {
  labels: ['Passed', 'Failed'],
  datasets: [{
    data: [92, 8],
    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
  }],
};

const productionData: BarChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { 
      label: 'Completed', 
      data: [12, 19, 15, 27, 23, 31], 
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    { 
      label: 'In Progress', 
      data: [8, 12, 10, 15, 18, 22], 
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const pieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'bottom' as const,
    },
  },
};

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('production');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const { t } = useI18n();

  const exportMenuItems = [
    { key: 'pdf', label: 'Export as PDF', icon: <FilePdfOutlined /> },
    { key: 'excel', label: 'Export as Excel', icon: <FileExcelOutlined /> },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <Typography.Title level={3} className="mb-0">Reports</Typography.Title>
        <Dropdown 
          menu={{ items: exportMenuItems }}
          trigger={['click']}
        >
          <Button type="primary">
            Export <DownloadOutlined />
          </Button>
        </Dropdown>
      </div>
      
      <Card>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={reportTypes.map(type => ({
              key: type.key,
              label: (
                <span>
                  {type.icon} {type.label}
                </span>
              ),
            }))}
          />
          <DatePicker.RangePicker 
            value={dateRange} 
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            className="w-full md:w-auto"
          />
        </div>
        
        {activeTab === 'production' && (
          <div>
            <Typography.Title level={4} className="mb-4">Production Overview</Typography.Title>
            <div className="h-80">
              <Bar 
                data={productionData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } },
                }} 
              />
            </div>
          </div>
        )}
        
        {activeTab === 'quality' && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <Typography.Title level={4} className="mb-4">Quality Pass Rate</Typography.Title>
              <div className="h-64">
                <Pie 
                  data={qualityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                  }}
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <Typography.Title level={4} className="mb-4">Quality Metrics</Typography.Title>
              <div className="space-y-4">
                {[
                  { metric: 'First Pass Yield', value: '92%', trend: 'up', change: '2%' },
                  { metric: 'Defect Rate', value: '3.2%', trend: 'down', change: '0.8%' },
                  { metric: 'Rework Rate', value: '4.8%', trend: 'down', change: '1.2%' },
                ].map((item, index) => (
                  <Card key={index} size="small">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-600">{item.metric}</div>
                        <div className="text-2xl font-bold">{item.value}</div>
                      </div>
                      <div className={`text-${item.trend === 'up' ? 'green' : 'red'}-500`}>
                        {item.trend === 'up' ? '↑' : '↓'} {item.change}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div>
            <Typography.Title level={4} className="mb-4">Inventory Status</Typography.Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Total Value', value: '$248,750', change: '+5.2%' },
                { title: 'Items in Stock', value: '1,248', change: '-3.1%' },
                { title: 'Low Stock Items', value: '18', change: '+2', isAlert: true },
              ].map((item, index) => (
                <Card key={index} size="small">
                  <div className="text-gray-600">{item.title}</div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className={`text-${item.isAlert ? 'red' : 'green'}-500`}>
                      {item.change}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportsPage;
