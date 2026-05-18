import { Card, Typography, Table } from 'antd'

const { Title, Text } = Typography

const SystemPlaceholder = ({ title, desc }: { title: string; desc: string }) => (
  <Card style={{ borderRadius: 12 }}>
    <Title level={4} style={{ color: '#1a365d', marginBottom: 8 }}>{title}</Title>
    <Text type="secondary">{desc}</Text>
    <div style={{ marginTop: 24, textAlign: 'center', padding: 60, color: '#bfbfbf' }}>
      功能开发中，敬请期待...
    </div>
    <Table
      columns={[{ title: '序号', dataIndex: 'id', key: 'id' }]}
      dataSource={[]}
      pagination={false}
      size="small"
    />
  </Card>
)

export default function Config() {
  return <SystemPlaceholder title="系统配置" desc="管理系统全局参数、业务规则与功能开关" />
}
