import { useState } from 'react'
import { Card, Table, Tag, Progress, Row, Col, Typography, Space, Badge, Button } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Award, Star, TrendingUp, AlertTriangle, CheckCircle, BarChart3, UserCheck } from 'lucide-react'
import { performanceData, departmentRankHistory } from '@/mock/performanceData'
import { departmentData } from '@/mock/departmentData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const levelColorMap: Record<string, string> = { A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#ef4444' }
const levelTagColor: Record<string, string> = { A: 'success', B: 'processing', C: 'warning', D: 'error' }

const statusMap: Record<string, { color: string; label: string }> = {
  completed: { color: 'success', label: '已评分' },
  in_progress: { color: 'processing', label: '评分中' },
  pending: { color: 'default', label: '待评分' },
}

const deptStatusList = performanceData.map((p, i) => ({
  ...p,
  status: i < 5 ? 'completed' : i < 6 ? 'in_progress' : 'pending',
}))

const highlights = [
  { dept: '财务部', text: '预算执行率95%，连续三季度排名上升', icon: <TrendingUp size={14} color="#22c55e" /> },
  { dept: '战略部', text: '战略目标完成率98%，重点项目按期交付', icon: <Star size={14} color="#f59e0b" /> },
  { dept: '运营部', text: '安全生产零事故，客户满意度提升5%', icon: <CheckCircle size={14} color="#3b82f6" /> },
  { dept: '审计部', text: '审计问题整改率92%，风险防控成效显著', icon: <BarChart3 size={14} color="#8b5cf6" /> },
]

const risks = [
  { dept: '行政部', text: '连续两季度排名下降，文档归档及时率低', level: 'high' },
  { dept: '人力资源部', text: '人才引进目标未完成，员工满意度需提升', level: 'medium' },
  { dept: '信息中心', text: '数字化转型进度滞后，系统响应待优化', level: 'medium' },
  { dept: '法务部', text: '法务审核周期偏长，影响业务推进效率', level: 'low' },
]

const excellenceCandidates = [
  { name: '张总监', dept: '财务部', score: 90.1, reason: '综合评分排名第一，预算执行与资金效率双优' },
  { name: '李总监', dept: '运营部', score: 88.3, reason: '安全生产零事故，客户满意度持续提升' },
  { name: '张总监', dept: '战略部', score: 92.5, reason: '战略目标完成率98%，重点项目按期交付' },
]

export default function ZhiPing() {
  const [selectedDept, setSelectedDept] = useState(performanceData[0])

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: selectedDept.dimensions.map(d => ({ name: d.name, max: d.maxScore })),
      shape: 'polygon' as const,
      splitNumber: 4,
      axisName: { color: '#8c8c8c', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
      splitArea: { areaStyle: { color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: selectedDept.dimensions.map(d => d.score),
        name: selectedDept.department,
        areaStyle: { color: 'rgba(59,130,246,0.2)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
      }],
    }],
  }

  const columns = [
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (t: string, r: typeof deptStatusList[0]) => (
        <Button type="text" size="small" style={{ color: '#1a365d', fontWeight: 600, padding: 0 }} onClick={() => setSelectedDept(r)}>{t}</Button>
      ),
    },
    {
      title: '总分',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: typeof deptStatusList[0], b: typeof deptStatusList[0]) => a.score - b.score,
      render: (t: number) => <Text style={{ color: '#1a365d', fontWeight: 700, fontSize: 16 }}>{t}</Text>,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (t: string) => <Tag color={levelTagColor[t]} style={{ fontWeight: 600 }}>{t}级</Tag>,
    },
    {
      title: '维度评分',
      key: 'dimensions',
      width: 280,
      render: (_: unknown, r: typeof deptStatusList[0]) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          {r.dimensions.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#8c8c8c', fontSize: 11, width: 48, flexShrink: 0 }}>{d.name}</Text>
              <Progress
                percent={Math.round((d.score / d.maxScore) * 100)}
                strokeColor={d.score / d.maxScore >= 0.9 ? '#22c55e' : d.score / d.maxScore >= 0.8 ? '#3b82f6' : '#f59e0b'}
                trailColor="#f0f0f0"
                size="small"
                style={{ flex: 1 }}
              />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (t: string) => {
        const s = statusMap[t]
        return <Tag color={s.color}>{s.label}</Tag>
      },
    },
  ]

  const avgScore = (performanceData.reduce((s, d) => s + d.score, 0) / performanceData.length).toFixed(1)
  const aLevelCount = performanceData.filter(d => d.level === 'A').length

  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <Award size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
            智评助手 · 考核评价工作台
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            赵总监，Q2绩效考核进行中，已完成
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>5/8</Text>部门评分
          </Text>
        </div>
        <Space>
          <Badge count={3}><Button type="text" style={{ color: '#8c8c8c' }} icon={<AlertTriangle size={18} />} /></Badge>
          <Badge count={5}><Button type="text" style={{ color: '#8c8c8c' }} icon={<CheckCircle size={18} />} /></Badge>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '参评部门', value: 8, suffix: '个', color: '#3b82f6', icon: <BarChart3 size={20} color="#3b82f6" /> },
          { label: '已完成', value: 5, suffix: '个', color: '#22c55e', icon: <CheckCircle size={20} color="#22c55e" /> },
          { label: 'A级部门', value: aLevelCount, suffix: '个', color: '#f59e0b', icon: <Star size={20} color="#f59e0b" /> },
          { label: '平均得分', value: avgScore, suffix: '分', color: '#8b5cf6', icon: <TrendingUp size={20} color="#8b5cf6" /> },
        ].map((item, i) => (
          <Col span={6} key={i}>
            <Card style={glassCard} styles={{ body: { padding: 16 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{item.label}</Text>
                  <div style={{ fontSize: 32, fontWeight: 700, color: item.color, marginTop: 4 }}>
                    {item.value}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>{item.suffix}</span>
                  </div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={<Space><BarChart3 size={16} color="#3b82f6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>智能评分面板</Text><Tag color="blue">点击部门查看画像</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: 0 } }}
          >
            <Table
              dataSource={deptStatusList}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="middle"
              style={{ background: 'transparent' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={10}>
          <Card
            title={<Space><UserCheck size={16} color="#8b5cf6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>{selectedDept.department} · 部门画像</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 16px 16px' } }}
          >
            <ReactECharts option={radarOption} style={{ height: 280 }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              {selectedDept.dimensions.map(d => (
                <div key={d.name} style={{ textAlign: 'center' }}>
                  <Text style={{ color: levelColorMap[selectedDept.level], fontWeight: 700, fontSize: 16 }}>{d.score}</Text>
                  <div><Text style={{ color: '#8c8c8c', fontSize: 11 }}>{d.name}</Text></div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title={<Space><Star size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>亮点识别</Text></Space>}
                style={glassCard}
                styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 12px' } }}
              >
                {highlights.map((h, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {h.icon}
                      <Text style={{ color: '#22c55e', fontWeight: 600, fontSize: 13 }}>{h.dept}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6 }}>{h.text}</Text>
                  </div>
                ))}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={<Space><AlertTriangle size={16} color="#ef4444" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>风险预警</Text></Space>}
                style={glassCard}
                styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 12px' } }}
              >
                {risks.map((r, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, marginBottom: 6, borderLeft: `3px solid ${r.level === 'high' ? '#ef4444' : r.level === 'medium' ? '#f59e0b' : '#3b82f6'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Tag color={r.level === 'high' ? 'red' : r.level === 'medium' ? 'orange' : 'blue'} style={{ margin: 0, fontSize: 11 }}>{r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低'}</Tag>
                      <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 13 }}>{r.dept}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6 }}>{r.text}</Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<Space><Award size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>卓越推荐</Text><Tag color="gold">AI智能推荐</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Row gutter={16}>
              {excellenceCandidates.map((c, i) => (
                <Col span={8} key={i}>
                  <div style={{ padding: 16, background: 'rgba(245,158,11,0.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.12)', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                      <Award size={22} color="#f59e0b" />
                    </div>
                    <Text style={{ color: '#1a365d', fontWeight: 700, fontSize: 16, display: 'block' }}>{c.name}</Text>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block', marginBottom: 4 }}>{c.dept}</Text>
                    <Tag color="gold" style={{ marginBottom: 8 }}>{c.score}分</Tag>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6, display: 'block' }}>{c.reason}</Text>
                    <Button size="small" type="primary" style={{ borderRadius: 6, marginTop: 10 }} icon={<Star size={12} style={{ verticalAlign: -1 }} />}>推荐评优</Button>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-table { background: transparent !important; }
        .ant-table-thead > tr > th { background: #fafafa !important; color: #8c8c8c !important; border-bottom: 1px solid #f0f0f0 !important; }
        .ant-table-tbody > tr > td { border-bottom: 1px solid #f0f0f0 !important; color: #333 !important; background: transparent !important; }
        .ant-table-tbody > tr:hover > td { background: rgba(0,0,0,0.02) !important; }
      `}</style>
    </div>
  )
}
