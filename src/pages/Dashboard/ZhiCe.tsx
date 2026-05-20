import { useMemo } from 'react'
import { Card, Row, Col, Tag, Button, Badge, Typography, Space, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Eye, Zap, Star, Award, Bell } from 'lucide-react'
import { taskData } from '@/mock/taskData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const redTasks = taskData.filter(t => t.riskLevel === 'red')
const yellowTasks = taskData.filter(t => t.riskLevel === 'yellow')

const ringOption = (value: number, color: string) => ({
  series: [{
    type: 'pie',
    radius: ['62%', '82%'],
    center: ['50%', '50%'],
    startAngle: 90,
    silent: true,
    label: { show: true, position: 'center', formatter: `${value}%`, fontSize: 22, fontWeight: 700, color: '#1a365d' },
    data: [
      { value, itemStyle: { color } },
      { value: 100 - value, itemStyle: { color: 'rgba(0,0,0,0.06)' } },
    ],
  }],
})

const gaugeOption = {
  series: [{
    type: 'gauge',
    startAngle: 210,
    endAngle: -30,
    min: 0,
    max: 100,
    radius: '90%',
    progress: { show: true, width: 14, itemStyle: { color: '#f59e0b' } },
    axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(0,0,0,0.06)']] } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    pointer: { show: false },
    anchor: { show: false },
    title: { show: true, offsetCenter: [0, '60%'], fontSize: 14, color: '#8c8c8c' },
    detail: { valueAnimation: true, fontSize: 32, fontWeight: 700, color: '#f59e0b', offsetCenter: [0, '20%'], formatter: '{value}%' },
    data: [{ value: 68, name: '战略目标综合完成率' }],
  }],
}

const aiSuggestions = [
  { icon: <AlertTriangle size={16} color="#ef4444" />, title: '资环处碳达峰任务预警', desc: '资环处碳达峰任务已触发红灯，建议立即召开专题协调会' },
  { icon: <Zap size={16} color="#f59e0b" />, title: '营商政策处改革方案滞后', desc: '营商政策处改革方案制定进度滞后，建议增加人员投入' },
  { icon: <TrendingUp size={16} color="#22c55e" />, title: '投资处城市更新项目关注', desc: '投资处城市更新项目开工率不足50%，建议调整项目优先级' },
]

const medalColors = ['#f59e0b', '#94a3b8', '#cd7f32']

export default function ZhiCe() {
  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return '上午好'
    if (h < 18) return '下午好'
    return '晚上好'
  }, [])

  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <Star size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#f59e0b' }} />
            智策助手 · 领导驾驶舱
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            主任，{greeting}！当前重点关注：
            <Text style={{ color: '#ef4444', fontWeight: 600 }}>{redTasks.length}个红灯项目</Text>，
            <Text style={{ color: '#f59e0b', fontWeight: 600 }}>2项临近节点</Text>
          </Text>
        </div>
        <Badge count={5}>
          <Button type="text" style={{ color: '#8c8c8c' }} icon={<Bell size={18} />} />
        </Badge>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '战略目标完成率', value: 68, color: '#3b82f6', icon: <Shield size={20} color="#3b82f6" />, unit: '%' },
          { label: '重点项目达成率', value: 72, color: '#22c55e', icon: <Award size={20} color="#22c55e" />, unit: '%' },
          { label: '风险项目', value: 2, color: '#ef4444', icon: <AlertTriangle size={20} color="#ef4444" />, pulse: true, unit: '个' },
          { label: '待决策事项', value: 3, color: '#f59e0b', icon: <Eye size={20} color="#f59e0b" />, unit: '项' },
        ].map((item, i) => (
          <Col span={6} key={i}>
            <Card style={glassCard} styles={{ body: { padding: 16 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{item.label}</Text>
                  <div style={{ fontSize: i < 2 ? 28 : 36, fontWeight: 700, color: item.color, marginTop: 4,
                    animation: item.pulse ? 'pulse 2s infinite' : undefined }}>
                    {item.value}{item.unit}
                  </div>
                </div>
                {i < 2 ? (
                  <div style={{ width: 72, height: 72 }}>
                    <ReactECharts option={ringOption(item.value as number, item.color)} style={{ height: 72 }} />
                  </div>
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={14}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>风险项目预警</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}>
            <Text style={{ color: '#ef4444', fontWeight: 600, fontSize: 13 }}>红灯项目 {redTasks.length}个</Text>
            <div style={{ marginTop: 8 }}>
              {redTasks.map(t => (
                <div key={t.id} style={{ borderLeft: '3px solid #ef4444', background: 'rgba(239,68,68,0.06)', padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#1a365d', fontWeight: 600 }}>{t.name}</Text>
                    <Tag color="red" style={{ margin: 0 }}>红灯</Tag>
                  </div>
                  <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block', marginTop: 4 }}>{t.description}</Text>
                  <Space size={6} style={{ marginTop: 8 }}>
                    <Button size="small" type="primary" danger onClick={() => message.success('已发送督办通知')}>一键督办</Button>
                    <Button size="small" style={{ background: '#f5f5f5', color: '#666', border: 'none' }} onClick={() => message.info('正在加载任务详情...')}>查看详情</Button>
                    <Button size="small" style={{ background: '#f5f5f5', color: '#666', border: 'none' }} onClick={() => message.info('正在检索相关案例...')}>参考案例</Button>
                  </Space>
                </div>
              ))}
            </div>
            <Text style={{ color: '#f59e0b', fontWeight: 600, fontSize: 13, display: 'block', marginTop: 12 }}>黄灯项目 {yellowTasks.length}个</Text>
            <div style={{ marginTop: 8 }}>
              {yellowTasks.map(t => (
                <div key={t.id} style={{ borderLeft: '3px solid #f59e0b', background: 'rgba(245,158,11,0.06)', padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#1a365d', fontWeight: 600 }}>{t.name}</Text>
                    <Tag color="orange" style={{ margin: 0 }}>黄灯</Tag>
                  </div>
                  <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block', marginTop: 4 }}>{t.description}</Text>
                  <Space size={6} style={{ marginTop: 8 }}>
                    <Button size="small" style={{ background: '#f59e0b', color: '#fff', border: 'none' }} onClick={() => message.success('已发送督办通知')}>一键督办</Button>
                    <Button size="small" style={{ background: '#f5f5f5', color: '#666', border: 'none' }} onClick={() => message.info('正在加载任务详情...')}>查看详情</Button>
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={10}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>处室效能排名</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}>
            {[
              { name: '市京津冀协同办', score: 92, medal: '🥇' },
              { name: '高技术处', score: 90, medal: '🥈' },
              { name: '开放处', score: 88, medal: '🥉' },
              { name: '人事处', score: 87, medal: '4' },
              { name: '办公室', score: 85, medal: '5' },
            ].map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', background: i < 3 ? 'rgba(34,197,94,0.06)' : 'rgba(0,0,0,0.02)', borderRadius: 8, marginTop: i === 0 ? 0 : 8 }}>
                <span style={{ fontSize: i < 3 ? 22 : 16, fontWeight: 700, color: i < 3 ? medalColors[i] : '#8c8c8c', width: 32, textAlign: 'center' }}>
                  {d.medal}
                </span>
                <div style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: '#1a365d', fontWeight: 600 }}>{d.name}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text style={{ color: i < 3 ? '#22c55e' : '#f59e0b', fontWeight: 700, fontSize: 18 }}>{d.score}</Text>
                  <div style={{ color: i < 3 ? '#22c55e' : '#f59e0b', fontSize: 12 }}>
                    {i < 3 ? <TrendingUp size={12} style={{ verticalAlign: -1 }} /> : <TrendingDown size={12} style={{ verticalAlign: -1 }} />}
                    {i < 3 ? '↑' : '↓'}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={10}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>战略完成总览</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 16px 16px' } }}>
            <ReactECharts option={gaugeOption} style={{ height: 220 }} />
          </Card>
        </Col>
        <Col span={14}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>🤖 AI智能建议</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}>
            {aiSuggestions.map((s, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.04)', borderRadius: 8, marginBottom: i < 2 ? 10 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {s.icon}
                  <Text style={{ color: '#1a365d', fontWeight: 600 }}>{s.title}</Text>
                </div>
                <Text style={{ color: '#8c8c8c', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
