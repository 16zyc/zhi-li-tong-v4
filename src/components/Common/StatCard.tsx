import React from 'react';
import { Card } from 'antd';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  color?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  icon,
  trend,
  color = '#1a365d',
  onClick,
}) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      }}
      styles={{
        body: { padding: '20px 24px' },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color }}>{value}</span>
            {suffix && <span style={{ fontSize: 14, color: '#8c8c8c' }}>{suffix}</span>}
          </div>
          {trend && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                fontSize: 12,
                color: trend.direction === 'up' ? '#52c41a' : '#ff4d4f',
              }}
            >
              {trend.direction === 'up' ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
