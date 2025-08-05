"use client";

import React from "react";
import { Card, Row, Col, Statistic, Button, Space, Typography } from "antd";
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, EyeOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useLocationManager } from "@/utils/locationManager";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const locationManager = useLocationManager();

  React.useEffect(() => {
    locationManager.setCurrentLocation("/dashboard");
  }, [locationManager]);

  return (
    <div>
      <div className="mb-6">
        <Title level={2} className="!mb-2">{t.nav.dashboard}</Title>
        <Text type="secondary" className="text-lg">
          {t.dashboard.welcome}, {user?.name}!
        </Text>
        <Space className="mt-4">
          <Button onClick={logout} type="primary" danger>
            {t.nav.logout}
          </Button>
          <Button onClick={() => console.log(locationManager.getLocationHistory())}>
            View Location History
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={t.dashboard.totalUsers}
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={t.dashboard.orders}
              value={93}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={t.dashboard.revenue}
              value={112893}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title={t.dashboard.pageViews}
              value={8846}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t.dashboard.recentActivity} className="h-64" hoverable>
            <p>{t.dashboard.noRecentActivity}</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t.dashboard.quickActions} className="h-64" hoverable>
            <Space direction="vertical" className="w-full">
              <Button type="primary" block>
                {t.dashboard.createNewUser}
              </Button>
              <Button block>{t.dashboard.viewReports}</Button>
              <Button block>{t.dashboard.manageSettings}</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
