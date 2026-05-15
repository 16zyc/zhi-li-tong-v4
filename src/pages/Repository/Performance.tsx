import { useState } from 'react'
import { Table, Card, Select, Tag, Progress, Row, Col, Space, Typography, Badge } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Award, TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react'
import { performanceData, departmentRankHistory } from '@/mock/performanceData'
import type { PerformanceRecord } from '@/mock/types'

const { Title, Text } = Typography

const levelConfig: Record<string, { color: string; bg: string }> = {
  A: { color: '#1d4ed8', bg: '#dbeafe' },
  B: { color: '#059669', bg: '#d1fae5' },
  C: { color: '#d97706', bg: '#fef3c7' },
  D: { color: '#dc2626', bg: '#fee2e2' },
}

const quarters = ['2025-Q1', '2024-Q4', '2024-Q3', '2024-Q2', '2024-Q1']

const dimensionColors = ['#1d4ed8', '#059669', '#d97706', '#7c3aed', '#0891b2']

const rankIcon = (rank: number) => {
  if (rank === 1) return <Award size={16} color="#f59e0b" />
  if (rank === 2) return <Award size={16} color="#94a3b8" />
  if (rank === 3) return <Award size={16} color="#b45309" />
  return <span style={{ color: '#64748b', fontWeight: 600 }}>{rank}</span>
}

const scoreTrend = (dept: string) => {
  const h = departmentRankHistory.find(d => d.department === dept)
  if (!h) return null
  return h.q4 > h.q1 ? <TrendingUp size={14} color="#059669" /> : <TrendingDown size={14} color="#dc2626" />
}

export default function PerformancePage() {
  const [quarter, setQuarter] = useState('2025-Q1')
  const [selected, setSelected] = useState<PerformanceRecord | null>(null)

  const filtered = performanceData.filter(d => d.quarter === quarter).sort((a, b) => a.rank - b.rank)

  const radarOption = selected ? {
    tooltip: {},
    radar: {
      indicator: selected.dimensions.map(d => ({ name: d.name, max: d.maxScore })),
      radius: '65%',
      axisName: { color: '#475569', fontSize: 12 },
      splitArea: { areaStyle: { color: ['#f8fafc', '#f1f5f9'] } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: selected.dimensions.map(d => d.score),
        name: selected.department,
        areaStyle: { color: 'rgba(29,78,216,0.15)' },
        lineStyle: { color: '#1d4ed8', width: 2 },
        itemStyle: { color: '#1d4ed8' },
      }],
    }],
  } : {}

  const trendOption = selected ? (() => {
    const h = departmentRankHistory.find(d => d.department === selected.department)
    if (!h) return {}
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], axisLine: { lineStyle: { color: '#cbd5e1' } }, axisLabel: { color: '#64748b' } },
      yAxis: { type: 'value', min: 70, axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
      series: [{
        type: 'line',
        data: [h.q1, h.q2, h.q3, h.q4],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#1d4ed8', width: 2 },
        itemStyle: { color: '#1d4ed8', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(29,78,216,0.2)' }, { offset: 1, color: 'rgba(29,78,216,0.01)' }] } },
        markLine: { silent: true, data: [{ yAxis: 90, lineStyle: { color: '#059669', type: 'dashed' } }, { yAxis: 80, lineStyle: { color: '#d97706', type: 'dashed' } }] },
      }],
    }
  })() : {}

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      render: (v: number) => <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{rankIcon(v)}</div>,
    },
    { title: '部门', dataIndex: 'department', key: 'department', width: 120 },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 90,
      sorter: (a: PerformanceRecord, b: PerformanceRecord) => a.score - b.score,
      render: (v: number) => <Text strong style={{ color: '#1e293b' }}>{v}</Text>,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 70,
      render: (v: string) => {
        const cfg = levelConfig[v]
        return <Tag style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.bg, fontWeight: 600 }}>{v}</Tag>
      },
    },
    {
      title: '各维度得分',
      dataIndex: 'dimensions',
      key: 'dimensions',
      width: 280,
      render: (dims: PerformanceRecord['dimensions']) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          {dims.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span style={{ width: 56, color: '#64748b', flexShrink: 0 }}>{d.name}</span>
              <Progress percent={Math.round((d.score / d.maxScore) * 100)} size="small" strokeColor={dimensionColors[i]} showInfo={false} style={{ flex: 1 }} />
              <span style={{ color: dimensionColors[i], fontWeight: 500, width: 36, textAlign: 'right' }}>{d.score}/{d.maxScore}</span>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '亮点',
      dataIndex: 'highlights',
      key: 'highlights',
      width: 200,
      render: (v: string[]) => v.map((t, i) => (
        <div key={i} style={{ fontSize: 12, color: '#059669', marginBottom: 2 }}>✓ {t}</div>
      )),
    },
    {
      title: '待改进',
      dataIndex: 'improvements',
      key: 'improvements',
      width: 200,
      render: (v: string[]) => v.map((t, i) => (
        <div key={i} style={{ fontSize: 12, color: '#d97706', marginBottom: 2 }}>△ {t}</div>
      )),
    },
  ]

  const avgScore = filtered.length ? (filtered.reduce((s, d) => s + d.score, 0) / filtered.length).toFixed(1) : '—'
  const aCount = filtered.filter(d => d.level === 'A').length
  const topDept = filtered[0]?.department || '—'

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#1e293b' }}>绩效库</Title>
          <Text type="secondary">完整记录每一次考核的成绩单</Text>
        </div>
        <Select value={quarter} onChange={setQuarter} style={{ width: 160 }} options={quarters.map(q => ({ label: q, value: q }))} />
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" style={{ borderLeft: '3px solid #1d4ed8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={20} color="#1d4ed8" />
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>参评部门</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1d4ed8' }}>{filtered.length}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderLeft: '3px solid #059669' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={20} color="#059669" />
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>平均得分</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#059669' }}>{avgScore}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderLeft: '3px solid #7c3aed' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={20} color="#7c3aed" />
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>A级部门</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#7c3aed' }}>{aCount}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderLeft: '3px solid #d97706' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={20} color="#d97706" />
              <div>
                <div style={{ fontSize: 12, color: '#64748b' }}>榜首部门</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#d97706' }}>{topDept}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={selected ? 14 : 24}>
          <Card>
            <Table
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              size="middle"
              pagination={false}
              onRow={record => ({
                onClick: () => setSelected(selected?.id === record.id ? null : record),
                style: { cursor: 'pointer', background: selected?.id === record.id ? '#eff6ff' : undefined },
              })}
            />
          </Card>
        </Col>

        {selected && (
          <Col span={10}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Card
                title={
                  <Space>
                    <Badge color="#1d4ed8" />
                    <span style={{ fontWeight: 600 }}>{selected.department}</span>
                    <Tag style={{ color: levelConfig[selected.level].color, background: levelConfig[selected.level].bg, borderColor: levelConfig[selected.level].bg, fontWeight: 600 }}>{selected.level}</Tag>
                    <Text type="secondary">{selected.score}分</Text>
                    {scoreTrend(selected.department)}
                  </Space>
                }
                size="small"
              >
                <ReactECharts option={radarOption} style={{ height: 280 }} />
              </Card>

              <Card title={<Space><TrendingUp size={16} color="#1d4ed8" /><span>季度趋势</span></Space>} size="small">
                <ReactECharts option={trendOption} style={{ height: 220 }} />
              </Card>
            </Space>
          </Col>
        )}
      </Row>
    </div>
  )
}
