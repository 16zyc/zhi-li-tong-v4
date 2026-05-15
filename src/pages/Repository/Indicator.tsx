import { useState } from 'react'
import { Table, Card, Tag, Select, Input, Row, Col, Statistic, Space, Badge, Typography, Progress } from 'antd'
import { BarChart3, Filter, Search, AlertTriangle, TrendingUp } from 'lucide-react'
import { indicatorData, indicatorDimensions } from '@/mock/indicatorData'

const { Title, Text } = Typography

const dimensionColorMap: Record<string, string> = {
  '战略执行': 'blue',
  '运营效率': 'green',
  '协同配合': 'orange',
  '创新改善': 'purple',
}

const statusConfig: Record<string, { color: string; text: string }> = {
  normal: { color: '#52c41a', text: '正常' },
  warning: { color: '#faad14', text: '预警' },
  danger: { color: '#ff4d4f', text: '异常' },
}

const warningCount = indicatorData.filter(i => i.status === 'warning').length
const dangerCount = indicatorData.filter(i => i.status === 'danger').length

const stats = [
  { title: '指标总数', value: indicatorData.length, icon: <BarChart3 size={20} />, color: '#1d4ed8' },
  { title: '维度数', value: indicatorDimensions.length, icon: <Filter size={20} />, color: '#2563eb' },
  { title: '预警指标', value: warningCount + dangerCount, icon: <AlertTriangle size={20} />, color: '#d97706' },
  { title: '本月新增', value: 3, icon: <TrendingUp size={20} />, color: '#059669' },
]

export default function IndicatorPage() {
  const [dimension, setDimension] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [keyword, setKeyword] = useState('')

  const filtered = indicatorData.filter(item => {
    if (dimension && item.dimension !== dimension) return false
    if (status && item.status !== status) return false
    if (keyword && !item.name.includes(keyword) && !item.id.includes(keyword)) return false
    return true
  })

  const columns = [
    { title: '指标ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '指标名称', dataIndex: 'name', key: 'name', width: 160 },
    {
      title: '维度',
      dataIndex: 'dimension',
      key: 'dimension',
      width: 110,
      render: (v: string) => <Tag color={dimensionColorMap[v]}>{v}</Tag>,
    },
    { title: '计算公式', dataIndex: 'formula', key: 'formula', width: 220, ellipsis: true },
    { title: '数据来源', dataIndex: 'dataSource', key: 'dataSource', width: 130 },
    { title: '适用部门', dataIndex: 'department', key: 'department', width: 110 },
    { title: '历史均值', dataIndex: 'historicalAvg', key: 'historicalAvg', width: 100 },
    { title: '当前目标', dataIndex: 'currentTarget', key: 'currentTarget', width: 100 },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 90,
      render: (v: number) => <Progress percent={v} size="small" strokeColor="#1d4ed8" />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v: string) => {
        const cfg = statusConfig[v]
        return <Badge color={cfg.color} text={<Text style={{ color: cfg.color }}>{cfg.text}</Text>} />
      },
    },
  ]

  const expandedRowRender = (record: (typeof indicatorData)[0]) => (
    <div style={{ padding: '12px 24px', background: '#f8fafc', borderRadius: 8 }}>
      <Row gutter={[32, 16]}>
        <Col span={12}>
          <Text type="secondary">计算公式</Text>
          <div style={{ marginTop: 4, fontSize: 14 }}>{record.formula}</div>
        </Col>
        <Col span={12}>
          <Text type="secondary">数据来源</Text>
          <div style={{ marginTop: 4, fontSize: 14 }}>{record.dataSource}</div>
        </Col>
        <Col span={8}>
          <Text type="secondary">权重配置</Text>
          <div style={{ marginTop: 4 }}><Progress percent={record.weight} strokeColor="#1d4ed8" /></div>
        </Col>
        <Col span={16}>
          <Text type="secondary">目标历史</Text>
          <div style={{ marginTop: 4, display: 'flex', gap: 16 }}>
            <span>Q1: —</span>
            <span>Q2: —</span>
            <span>Q3: {record.historicalAvg}</span>
            <span style={{ color: '#1d4ed8', fontWeight: 600 }}>当前: {record.currentTarget}</span>
          </div>
        </Col>
      </Row>
    </div>
  )

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#1e293b' }}>指标库</Title>
        <Text type="secondary">统一全集团绩效考核的度量单位</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <Col span={6} key={s.title}>
            <Card size="small" style={{ borderLeft: `3px solid ${s.color}` }}>
              <Statistic
                title={s.title}
                value={s.value}
                prefix={<span style={{ color: s.color, marginRight: 8 }}>{s.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }} size="middle">
          <Select
            placeholder="维度筛选"
            allowClear
            style={{ width: 140 }}
            value={dimension}
            onChange={setDimension}
            options={indicatorDimensions.map(d => ({ label: d, value: d }))}
          />
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 140 }}
            value={status}
            onChange={setStatus}
            options={Object.entries(statusConfig).map(([k, v]) => ({ label: v.text, value: k }))}
          />
          <Input
            placeholder="搜索指标名称或ID"
            prefix={<Search size={14} style={{ color: '#94a3b8' }} />}
            allowClear
            style={{ width: 220 }}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          size="middle"
          expandable={{ expandedRowRender }}
          pagination={{ pageSize: 8, showTotal: t => `共 ${t} 条` }}
          rowClassName={() => 'cursor-pointer'}
        />
      </Card>
    </div>
  )
}
