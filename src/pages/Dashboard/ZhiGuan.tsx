import { Card, Row, Col, Tag, Button, Badge, Typography, Space, Progress, List, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Users, FilePlus, ClipboardList, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const deptTasks = [
  { id: 'T-002', name: '研究出台"一带一路"高质量发展实施方案', department: '开放处/空铁处', deadline: '2025-06-30', progress: 75, status: 'in_progress', priority: 'high' },
  { id: 'T-003', name: '协调保障中央标志性项目落地', department: '市疏整促专项办', deadline: '2025-12-31', progress: 45, status: 'in_progress', priority: 'high' },
  { id: 'T-005', name: '制定营商环境6.0版改革实施方案', department: '营商政策处/营商协调处', deadline: '2025-09-30', progress: 40, status: 'in_progress', priority: 'high' },
  { id: 'T-006', name: '推进碳达峰碳中和政策体系建设', department: '资环处/能源处', deadline: '2025-12-31', progress: 55, status: 'in_progress', priority: 'high' },
  { id: 'T-009', name: '推动中关村先行先试改革落地', department: '高技术处', deadline: '2025-12-31', progress: 60, status: 'in_progress', priority: 'high' },
  { id: 'T-010', name: '推进城市更新年度计划', department: '投资处', deadline: '2025-11-30', progress: 50, status: 'in_progress', priority: 'medium' },
]
const delayedTasks = deptTasks.filter(t => t.progress < 50)
const expiringTasks = deptTasks.filter(t => t.deadline === '2025-06-30')

const deptLoadData = [
  { name: '市京津冀协同办', taskCount: 2, completedCount: 1, loadRate: 85 },
  { name: '开放处/空铁处', taskCount: 1, completedCount: 0, loadRate: 75 },
  { name: '营商政策处/营商协调处', taskCount: 1, completedCount: 0, loadRate: 70 },
  { name: '资环处/能源处', taskCount: 1, completedCount: 0, loadRate: 80 },
  { name: '高技术处', taskCount: 1, completedCount: 0, loadRate: 60 },
  { name: '投资处', taskCount: 1, completedCount: 0, loadRate: 50 },
  { name: '市疏整促专项办', taskCount: 1, completedCount: 0, loadRate: 65 },
  { name: '价格处/价综处', taskCount: 1, completedCount: 1, loadRate: 30 },
]

const workloadOption = {
  tooltip: {
    trigger: 'axis' as const,
    axisPointer: { type: 'shadow' as const },
    formatter: (params: { name: string; value: number }[]) => {
      const item = deptLoadData.find(d => d.name === params[0]?.name)
      if (!item) return ''
      return `${item.name}<br/>任务数：${item.taskCount}<br/>已完成：${item.completedCount}<br/>负载率：${item.loadRate}%`
    },
  },
  grid: { left: 120, right: 50, top: 10, bottom: 20 },
  xAxis: { type: 'value' as const, max: 100, axisLabel: { color: '#8c8c8c', formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } },
  yAxis: { type: 'category' as const, data: deptLoadData.map(d => d.name), axisLabel: { color: '#333', fontSize: 12 }, axisLine: { show: false }, axisTick: { show: false } },
  series: [{
    type: 'bar',
    data: deptLoadData.map(d => ({
      value: d.loadRate,
      itemStyle: {
        color: d.loadRate >= 80 ? '#f59e0b' : d.loadRate >= 60 ? '#3b82f6' : '#22c55e',
        borderRadius: [0, 4, 4, 0],
      },
    })),
    barWidth: 16,
    label: {
      show: true,
      position: 'right' as const,
      color: '#333',
      fontSize: 12,
      formatter: (params: { value: number }) => `${params.value}%`,
    },
  }],
}

export default function ZhiGuan() {
  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <ClipboardList size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
            智管助手 · 发改委工作台
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            李主任，当前在办任务
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>6项</Text>，
            其中<Text style={{ color: '#ef4444', fontWeight: 600 }}>{delayedTasks.length}项滞后</Text>，
            <Text style={{ color: '#f59e0b', fontWeight: 600 }}>{expiringTasks.length}项即将到期</Text>
          </Text>
        </div>
        <Badge count={3}>
          <Button type="text" style={{ color: '#8c8c8c' }} icon={<Clock size={18} />} />
        </Badge>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '在办任务', value: deptTasks.length, color: '#3b82f6', icon: <ClipboardList size={20} color="#3b82f6" /> },
          { label: '滞后任务', value: delayedTasks.length, color: '#ef4444', icon: <AlertTriangle size={20} color="#ef4444" />, pulse: true },
          { label: '即将到期', value: expiringTasks.length, color: '#f59e0b', icon: <Clock size={20} color="#f59e0b" /> },
          { label: '涉及处室', value: 8, color: '#22c55e', icon: <Users size={20} color="#22c55e" /> },
        ].map((item, i) => (
          <Col span={6} key={i}>
            <Card style={glassCard} styles={{ body: { padding: 16 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{item.label}</Text>
                  <div style={{ fontSize: 36, fontWeight: 700, color: item.color, marginTop: 4,
                    animation: item.pulse ? 'pulse 2s infinite' : undefined }}>
                    {item.value}
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
        <Col span={14}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>重点项目跟踪</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}>
            <List
              dataSource={deptTasks}
              renderItem={(t) => (
                <List.Item style={{ border: 'none', padding: '10px 0' }}>
                  <div style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: '#1a365d', fontWeight: 600 }}>{t.name}</Text>
                      <Tag color={t.priority === 'high' ? 'red' : 'blue'} style={{ margin: 0 }}>{t.priority === 'high' ? '重点' : '常规'}</Tag>
                    </div>
                    <Progress percent={t.progress} strokeColor={t.progress < 50 ? '#ef4444' : t.progress < 70 ? '#f59e0b' : '#3b82f6'} trailColor="#f0f0f0" size="small" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>牵头处室：{t.department} ｜ 截止：{t.deadline}</Text>
                      {t.progress < 50 && (
                        <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>进度滞后</Text>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>处室任务负载</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}>
            <ReactECharts option={workloadOption} style={{ height: 320 }} />
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
              <Space size={4}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>正常(&lt;60%)</Text></Space>
              <Space size={4}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>适中(60-80%)</Text></Space>
              <Space size={4}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>偏高(&ge;80%)</Text></Space>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={10}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>部门知识库动态</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '16px' } }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', flex: 1, padding: 16, background: 'rgba(59,130,246,0.08)', borderRadius: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>23</div>
                <Text style={{ color: '#8c8c8c', fontSize: 13 }}>本月新增材料</Text>
              </div>
              <div style={{ textAlign: 'center', flex: 1, padding: 16, background: 'rgba(34,197,94,0.08)', borderRadius: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>2</div>
                <Text style={{ color: '#8c8c8c', fontSize: 13 }}>新增经验案例</Text>
              </div>
            </div>
            <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CheckCircle size={14} color="#22c55e" />
                <Text style={{ color: '#333', fontSize: 13 }}>产业园审批流程优化案例已入库</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} color="#22c55e" />
                <Text style={{ color: '#333', fontSize: 13 }}>招商引资专项攻坚经验已沉淀</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>快捷操作</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '20px 16px' } }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: '新建任务', icon: <FilePlus size={24} color="#3b82f6" />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', onClick: () => message.info('正在打开新建任务表单...') },
                { label: '分配工作', icon: <Users size={24} color="#22c55e" />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', onClick: () => message.info('正在打开工作分配界面...') },
                { label: '生成汇报', icon: <ClipboardList size={24} color="#f59e0b" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', onClick: () => message.info('正在生成本部门工作汇报...') },
              ].map((a, i) => (
                <Button key={i} style={{ flex: 1, height: 80, background: a.bg, border: `1px solid ${a.color}30`, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={a.onClick}>
                  {a.icon}
                  <span style={{ color: a.color, fontWeight: 600, fontSize: 14 }}>{a.label}</span>
                </Button>
              ))}
            </div>
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
