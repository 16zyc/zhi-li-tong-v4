import { Card, Row, Col, Tag, Button, Badge, Typography, Space, Progress, List } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Users, FilePlus, ClipboardList, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { taskData } from '@/mock/taskData'
import { departmentData, personData } from '@/mock/departmentData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const deptTasks = taskData.filter(t => t.department === '战略部')
const delayedTasks = deptTasks.filter(t => t.riskLevel === 'red')
const expiringTasks = deptTasks.filter(t => t.riskLevel === 'yellow')
const importantProjects = [
  { name: 'XX产业园项目推进', progress: 65, status: '延期', tag: 'red', person: '张三', deadline: '2025-12-31', lag: 15, suggestion: '参考案例库中「并行推进法」经验，协调信息中心增派资源' },
  { name: '东南亚投资项目', progress: 42, status: '即将到期', tag: 'orange', person: '张三', deadline: '2025-09-30', lag: 0, suggestion: '' },
  { name: '招商引资目标', progress: 35, status: '延期', tag: 'red', person: '张三', deadline: '2025-12-31', lag: 22, suggestion: '参考案例库中「专项攻坚模式」，启动专项督办调整策略' },
  { name: '审批流程优化', progress: 50, status: '进行中', tag: 'blue', person: '李四', deadline: '2025-09-30', lag: 0, suggestion: '' },
]

const workloadOption = {
  tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
  grid: { left: 60, right: 40, top: 10, bottom: 20 },
  xAxis: { type: 'value' as const, max: 100, axisLabel: { color: '#8c8c8c', formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } } },
  yAxis: { type: 'category' as const, data: personData.map(p => p.name), axisLabel: { color: '#333', fontSize: 13 }, axisLine: { show: false }, axisTick: { show: false } },
  series: [{
    type: 'bar',
    data: personData.map(p => ({
      value: p.workload,
      itemStyle: {
        color: p.workload >= 100 ? '#ef4444' : p.workload >= 80 ? '#f59e0b' : '#3b82f6',
        borderRadius: [0, 4, 4, 0],
      },
    })),
    barWidth: 18,
    label: {
      show: true,
      position: 'right' as const,
      color: '#333',
      fontSize: 12,
      formatter: (params: { value: number }) => {
        if (params.value >= 100) return `${params.value}% 建议调整`
        return `${params.value}%`
      },
    },
  }],
}

const statusColorMap: Record<string, string> = { red: '#ef4444', orange: '#f59e0b', blue: '#3b82f6' }

export default function ZhiGuan() {
  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <ClipboardList size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
            智管助手 · 战略部工作台
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            李总，本部门在办项目
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>12个</Text>，
            其中<Text style={{ color: '#ef4444', fontWeight: 600 }}>2个延期</Text>，
            <Text style={{ color: '#f59e0b', fontWeight: 600 }}>3个即将到期</Text>
          </Text>
        </div>
        <Badge count={3}>
          <Button type="text" style={{ color: '#8c8c8c' }} icon={<Clock size={18} />} />
        </Badge>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '在办项目', value: 12, color: '#3b82f6', icon: <ClipboardList size={20} color="#3b82f6" /> },
          { label: '延期项目', value: 2, color: '#ef4444', icon: <AlertTriangle size={20} color="#ef4444" />, pulse: true },
          { label: '即将到期', value: 3, color: '#f59e0b', icon: <Clock size={20} color="#f59e0b" /> },
          { label: '本月新增', value: 5, color: '#22c55e', icon: <FilePlus size={20} color="#22c55e" /> },
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
              dataSource={importantProjects}
              renderItem={(p) => (
                <List.Item style={{ border: 'none', padding: '10px 0' }}>
                  <div style={{ width: '100%', padding: 12, background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ color: '#1a365d', fontWeight: 600 }}>{p.name}</Text>
                      <Tag color={p.tag} style={{ margin: 0 }}>{p.status}</Tag>
                    </div>
                    <Progress percent={p.progress} strokeColor={statusColorMap[p.tag] || '#3b82f6'} trailColor="#f0f0f0" size="small" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>负责人：{p.person} ｜ 截止：{p.deadline}</Text>
                      {p.lag > 0 && (
                        <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>滞后{p.lag}%</Text>
                      )}
                    </div>
                    {p.suggestion && (
                      <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(239,68,68,0.08)', borderRadius: 6, borderLeft: '3px solid #ef4444' }}>
                        <Text style={{ color: '#fbbf24', fontSize: 12 }}>💡 {p.suggestion}</Text>
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title={<Text style={{ color: '#1a365d', fontWeight: 600 }}>人员工作负荷</Text>} style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}>
            <ReactECharts option={workloadOption} style={{ height: 260 }} />
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
              <Space size={4}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>正常</Text></Space>
              <Space size={4}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>偏高</Text></Space>
              <Space size={4}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>超载</Text></Space>
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
                { label: '新建任务', icon: <FilePlus size={24} color="#3b82f6" />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                { label: '分配工作', icon: <Users size={24} color="#22c55e" />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
                { label: '生成汇报', icon: <ClipboardList size={24} color="#f59e0b" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              ].map((a, i) => (
                <Button key={i} style={{ flex: 1, height: 80, background: a.bg, border: `1px solid ${a.color}30`, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
