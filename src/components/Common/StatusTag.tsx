import React from 'react';
import { Tag } from 'antd';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusTagProps {
  status: StatusType;
  text: string;
}

const statusColorMap: Record<StatusType, string> = {
  success: 'green',
  warning: 'orange',
  danger: 'red',
  info: 'blue',
  default: 'gray',
};

const StatusTag: React.FC<StatusTagProps> = ({ status, text }) => {
  return <Tag color={statusColorMap[status]}>{text}</Tag>;
};

export default StatusTag;
