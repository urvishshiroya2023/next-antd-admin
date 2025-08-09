import { Statistic as AntdStatistic, Card } from 'antd';
import { StatisticProps } from 'antd/es/statistic/Statistic';
import React from 'react';

interface StatisticCardProps extends StatisticProps {
  title: string;
  icon?: React.ReactNode;
  valueStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  loading?: boolean;
  hoverable?: boolean;
  className?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  icon,
  valueStyle,
  bodyStyle = { padding: '12px' },
  loading = false,
  hoverable = false,
  className = '',
  ...statisticProps
}) => {
  return (
    <Card
      loading={loading}
      hoverable={hoverable}
      styles={{ body: bodyStyle }} // ✅ Updated to avoid deprecation warning
      className={className}
    >
      <AntdStatistic
        title={title}
        prefix={icon}
        valueStyle={valueStyle}
        {...statisticProps}
      />
    </Card>
  );
};

export default StatisticCard;
