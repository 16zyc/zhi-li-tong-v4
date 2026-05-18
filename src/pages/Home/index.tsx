import { Card, Row, Col, Tag, Button, Progress, Badge, Typography, Space, List, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, AlertTriangle, Target, CheckCircle, Clock, Activity, Minus } from 'lucide-react'
import { taskData } from '@/mock/taskData'
import { departmentData } from '@/mock/departmentData'

const { Title, Text } = Typography

const redTasks = taskData.filter(t => t.riskLevel === 'red')
const yellowTasks = taskData.filter(t => t.riskLevel === 'yellow')
const pendingCount = taskData.filter(t => t.status === 'pending' || t.status === 'in_progress').length

const riskDotMap: Record<string, { color: string; label: string }> = {
  red: { color: '#ff4d4f', label: '红灯' },
  yellow: { color: '#faad14', label: '黄灯' },
  green: { color: '#52c41a', label: '绿灯' },
}

const sortedDepts = [...departmentData].sort((a, b) => b.score - a.score)
const topDepts = sortedDepts.slice(0, 3)
const bottomDepts = sortedDepts.slice(-2).reverse()

const aiSuggestions = [
  { icon: <AlertTriangle size={14} />, text: '行政部连续两季度下降，建议查看画像报告', type: 'warning' as const },
  { icon: <TrendingDown size={14} />, text: '信息中心数字化转型进度滞后，需重点关注', type: 'error' as const },
  { icon: <Target size={14} />, text: '招商引资目标完成率仅35%，建议加强推进力度', type: 'info' as const },
  { icon: <CheckCircle size={14} />, text: '财务部预算执行率95%，可推广优秀经验', type: 'success' as const },
]

const statCards = [
  { title: '战略目标完成率', value: 78, suffix: '%', icon: <Target size={22} />, trend: { value: 5.2, direction: 'up' as const }, bg: 'linear-gradient(135deg, #1a365d 0%, #2a5298 100%)', accent: '#52c41a', pulse: false },
  { title: '重点项目达成率', value: 92, suffix: '%', icon: <CheckCircle size={22} />, trend: { value: 0, direction: 'stable' as const }, bg: 'linear-gradient(135deg, #1a365d 0%, #1e4d8c 100%)', accent: '#1890ff', pulse: false },
  { title: '风险项目', value: redTasks.length, suffix: '个', icon: <AlertTriangle size={22} />, bg: 'linear-gradient(135deg, #8b1a1a 0%, #c0392b 100%)', accent: '#ff4d4f', pulse: true },
  { title: '待办任务', value: pendingCount, suffix: '项', icon: <Clock size={22} />, bg: 'linear-gradient(135deg, #8b6914 0%, #c9820a 100%)', accent: '#fa8c16', pulse: false },
]

const suggestionBgMap = { warning: '#fff7e6', error: '#fff1f0', success: '#f6ffed', info: '#e6f7ff' }
const suggestionColorMap = { warning: '#fa8c16', error: '#ff4d4f', success: '#52c41a', info: '#1890ff' }

function RingChart({ percent, size = 160, strokeWidth = 14, color = '#d4a853', label, subLabel }: {
  percent: number; size?: number; strokeWidth?: number; color?: string; label: string; subLabel: string
}) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - percent / 100)
  return (
    <div style={{ width: size, height: size, margin: '0 auto', position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(26,54,93,0.08)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#1a365d', lineHeight: 1.2 }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>{subLabel}</div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2a5298 50%, #1a365d 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>张总，下午好！</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4, display: 'block' }}>
              当前重点关注：
              <Tag color="red" style={{ marginLeft: 8 }}>{redTasks.length}个红灯项目</Tag>
              <Tag color="orange">2项临近节点</Tag>
            </Text>
          </div>
          <Space>
            <Button type="primary" ghost style={{ color: '#d4a853', borderColor: '#d4a853' }} onClick={() => navigate('/dashboard/zhice')}>查看风险看板</Button>
            <Button type="primary" ghost style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => navigate('/dashboard/zhiban')}>今日待办</Button>
          </Space>
        </div>
      </div>

      <Row gutter={20}>
        {statCards.map((card, i) => (
          <Col span={6} key={i}>
            <Card style={{ background: card.bg, border: 'none', borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{card.title}</div>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{card.value}</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{card.suffix}</span>
                  </div>
                  {card.trend && card.trend.direction === 'up' && card.trend.value > 0 && (
                    <div className="flex items-center gap-1 mt-2" style={{ fontSize: 12, color: card.accent }}>
                      <TrendingUp size={14} /><span>↑ {card.trend.value}%</span>
                    </div>
                  )}
                  {card.trend && card.trend.direction === 'stable' && (
                    <div className="flex items-center gap-1 mt-2" style={{ fontSize: 12, color: card.accent }}>
                      <Minus size={14} /><span>持平</span>
                    </div>
                  )}
                </div>
                <div className={`flex items-center justify-center ${card.pulse ? 'animate-pulse' : ''}`}
                  style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={20}>
        <Col span={14}>
          <Card style={{ borderRadius: 12, height: '100%' }} styles={{ body: { padding: 0 } }}>
            <div className="px-6 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <Space>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>风险项目预警</span>
                <Badge count={redTasks.length} style={{ backgroundColor: '#ff4d4f' }}><Tag color="red">红灯</Tag></Badge>
                <Badge count={yellowTasks.length} style={{ backgroundColor: '#faad14' }}><Tag color="orange">黄灯</Tag></Badge>
              </Space>
              <Button type="link" style={{ color: '#1a365d' }}>查看全部</Button>
            </div>
            <List
              dataSource={[...redTasks, ...yellowTasks]}
              renderItem={item => (
                <List.Item className="px-6" style={{ padding: '12px 24px' }}
                  actions={[
                    <Button key="handle" type="link" size="small" style={{ color: '#1a365d' }}>处理</Button>,
                    <Button key="detail" type="link" size="small">详情</Button>,
                  ]}>
                  <List.Item.Meta
                    avatar={<div style={{ width: 10, height: 10, borderRadius: '50%', background: riskDotMap[item.riskLevel!]?.color, marginTop: 6, boxShadow: item.riskLevel === 'red' ? '0 0 8px #ff4d4f' : undefined }} />}
                    title={<span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}<Tag color={item.riskLevel === 'red' ? 'red' : 'orange'} style={{ marginLeft: 8, fontSize: 11 }}>{riskDotMap[item.riskLevel!]?.label}</Tag></span>}
                    description={<span style={{ fontSize: 12, color: '#8c8c8c' }}>{item.department} · {item.description} · 截止 {item.deadline}</span>}
                  />
                  <div style={{ width: 80 }}><Progress percent={item.progress} size="small" strokeColor={item.riskLevel === 'red' ? '#ff4d4f' : '#faad14'} /></div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card style={{ borderRadius: 12, height: '100%' }} styles={{ body: { padding: 0 } }}>
            <div className="px-6 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>部门红黑榜</span>
              <Button type="link" style={{ color: '#1a365d' }}>详细排名</Button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3" style={{ fontSize: 13, color: '#52c41a', fontWeight: 600 }}>
                  <TrendingUp size={14} /> 红榜 · 表现优秀
                </div>
                {topDepts.map((dept, i) => (
                  <div key={dept.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #fafafa' }}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center"
                        style={{ width: 22, height: 22, borderRadius: '50%', fontSize: 12, fontWeight: 700, background: i === 0 ? '#d4a853' : i === 1 ? '#b0b0b0' : '#cd7f32', color: '#fff' }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag color={dept.level === 'A' ? 'green' : 'blue'}>{dept.level}级</Tag>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1a365d' }}>{dept.score}</span>
                      <TrendingUp size={14} color="#52c41a" />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3" style={{ fontSize: 13, color: '#ff4d4f', fontWeight: 600 }}>
                  <TrendingDown size={14} /> 黑榜 · 需要关注
                </div>
                {bottomDepts.map(dept => (
                  <div key={dept.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #fafafa' }}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center"
                        style={{ width: 22, height: 22, borderRadius: '50%', fontSize: 12, fontWeight: 700, background: '#8c8c8c', color: '#fff' }}>
                        {dept.rank}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag color={dept.level === 'C' ? 'red' : 'orange'}>{dept.level}级</Tag>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#ff4d4f' }}>{dept.score}</span>
                      <TrendingDown size={14} color="#ff4d4f" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={10}>
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d', marginBottom: 8 }}>战略目标完成总览</div>
            <RingChart percent={78} label="78%" subLabel="战略目标完成率" />
          </Card>
        </Col>
        <Col span={14}>
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2" style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>
                <Activity size={18} style={{ color: '#d4a853' }} /> AI智能建议
              </div>
              <Tag color="gold">实时分析</Tag>
            </div>
            <List
              dataSource={aiSuggestions}
              renderItem={item => (
                <List.Item style={{ padding: '10px 0', border: 'none' }}>
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 28, height: 28, borderRadius: 8, background: suggestionBgMap[item.type], color: suggestionColorMap[item.type] }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: 14, color: '#333', lineHeight: '28px' }}>{item.text}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
