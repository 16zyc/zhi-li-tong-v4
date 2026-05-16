import { Card, List, Tag, Button, Input, Progress, Row, Col, Typography, Space, Badge, Checkbox, Timeline } from 'antd'
import { ClipboardCheck, Upload, Search, FileText, Shield, Lightbulb, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { taskData } from '@/mock/taskData'
import { caseData } from '@/mock/caseData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: 'rgba(30, 41, 59, 0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  borderRadius: 12,
}

const myTasks = taskData
  .filter(t => t.responsible === '张三')
  .sort((a, b) => {
    const p: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return (p[a.priority] ?? 1) - (p[b.priority] ?? 1)
  })

const priorityMap: Record<string, { color: string; label: string }> = {
  high: { color: 'red', label: '紧急' },
  medium: { color: 'orange', label: '一般' },
  low: { color: 'blue', label: '低优' },
}

const statusMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'default', label: '待办' },
  in_progress: { color: 'processing', label: '进行中' },
  completed: { color: 'success', label: '已完成' },
}

const recentDocs = [
  { name: 'XX产业园用地预审报告', date: '2025-06-12' },
  { name: '东南亚投资可研报告', date: '2025-06-10' },
  { name: '招商引资季度汇总', date: '2025-06-08' },
  { name: '战略部周报模板', date: '2025-06-05' },
]

const formFields = [
  { label: '项目名称', value: 'XX产业园项目推进', auto: true },
  { label: '责任部门', value: '战略部', auto: true },
  { label: '报告周期', value: '2025年Q2', auto: true },
  { label: '当前进度', value: '65%', auto: true },
  { label: '风险说明', value: '', auto: false },
]

const complianceItems = [
  { label: '用地预审报告', done: true },
  { label: '环境影响评估', done: true },
  { label: '项目可行性研究报告', done: true },
  { label: '资金来源证明', done: true },
  { label: '规划设计方案', done: true },
  { label: '安全评估报告', done: false },
  { label: '社会稳定风险评估', done: false },
]

const relatedCases = caseData.filter(c =>
  c.tags.some(tag => ['项目管理', '协同', '审批', '协作'].includes(tag))
).slice(0, 3)

export default function ZhiBan() {
  return (
    <div style={{ minHeight: 'auto', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', padding: 24, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            <ClipboardCheck size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
            智办助手 · 经办人工作台
          </Title>
          <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 6, display: 'block' }}>
            张三，您有
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>5项待办任务</Text>，
            <Text style={{ color: '#f59e0b', fontWeight: 600 }}>2项即将到期</Text>
          </Text>
        </div>
        <Space>
          <Badge count={2}><Button type="text" style={{ color: '#94a3b8' }} icon={<Clock size={18} />} /></Badge>
          <Badge count={1}><Button type="text" style={{ color: '#94a3b8' }} icon={<AlertCircle size={18} />} /></Badge>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={<Space><ClipboardCheck size={16} color="#3b82f6" /><Text style={{ color: '#fff', fontWeight: 600 }}>我的待办</Text><Tag color="blue">{myTasks.length}项</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid rgba(148,163,184,0.1)' }, body: { padding: '8px 16px' } }}
          >
            <List
              dataSource={myTasks}
              renderItem={task => {
                const p = priorityMap[task.priority] || priorityMap.medium
                const s = statusMap[task.status] || statusMap.pending
                return (
                  <List.Item style={{ border: 'none', padding: '8px 0' }}>
                    <div style={{ width: '100%', padding: 12, background: 'rgba(148,163,184,0.06)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Space size={8}>
                          <Text style={{ color: '#fff', fontWeight: 600, fontSize: 14 }} ellipsis>{task.name}</Text>
                          <Tag color={p.color} style={{ margin: 0 }}>{p.label}</Tag>
                          <Tag color={s.color} style={{ margin: 0 }}>{s.label}</Tag>
                        </Space>
                        <Space size={4}>
                          <Clock size={12} color="#94a3b8" />
                          <Text style={{ color: '#94a3b8', fontSize: 12 }}>{task.deadline}</Text>
                        </Space>
                      </div>
                      <Progress
                        percent={task.progress}
                        strokeColor={task.progress >= 80 ? '#22c55e' : task.progress >= 50 ? '#3b82f6' : '#f59e0b'}
                        trailColor="rgba(148,163,184,0.12)"
                        size="small"
                        style={{ marginBottom: 8 }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button size="small" type="primary" icon={<Upload size={12} style={{ verticalAlign: -1 }} />} style={{ borderRadius: 6 }}>更新进度</Button>
                        <Button size="small" style={{ background: 'rgba(148,163,184,0.12)', color: '#e2e8f0', border: 'none', borderRadius: 6 }} icon={<FileText size={12} style={{ verticalAlign: -1 }} />}>上传材料</Button>
                        <Button size="small" style={{ background: 'rgba(148,163,184,0.12)', color: '#e2e8f0', border: 'none', borderRadius: 6 }}>查看详情</Button>
                      </div>
                    </div>
                  </List.Item>
                )
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={<Space><Search size={16} color="#8b5cf6" /><Text style={{ color: '#fff', fontWeight: 600 }}>智能材料搜索</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid rgba(148,163,184,0.1)' }, body: { padding: '12px 16px' } }}
          >
            <Input
              prefix={<Search size={16} color="#94a3b8" />}
              placeholder="搜索材料、文件、流程模板…"
              size="large"
              style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, color: '#fff', marginBottom: 12 }}
            />
            <Row gutter={16}>
              <Col span={14}>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, display: 'block' }}>最近文档</Text>
                {recentDocs.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'rgba(148,163,184,0.06)', borderRadius: 6, marginBottom: 4 }}>
                    <Space size={6}><FileText size={13} color="#94a3b8" /><Text style={{ color: '#e2e8f0', fontSize: 13 }}>{d.name}</Text></Space>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>{d.date}</Text>
                  </div>
                ))}
              </Col>
              <Col span={10}>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, display: 'block' }}>知识库快捷入口</Text>
                <Space wrap>
                  {['制度文件', '流程模板', '审批指南', '项目案例'].map(k => (
                    <Tag key={k} style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, cursor: 'pointer' }}>{k}</Tag>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card
            title={<Space><FileText size={16} color="#3b82f6" /><Text style={{ color: '#fff', fontWeight: 600 }}>智能填报</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid rgba(148,163,184,0.1)' }, body: { padding: '16px' } }}
          >
            <div style={{ padding: '10px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, marginBottom: 12 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>当前任务：XX产业园项目推进 · 季度进度报告</Text>
            </div>
            {formFields.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < formFields.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none' }}>
                <Text style={{ color: '#94a3b8', fontSize: 13 }}>{f.label}</Text>
                <Space size={4}>
                  {f.auto && <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>自动填充</Tag>}
                  <Text style={{ color: f.value ? '#e2e8f0' : '#64748b', fontSize: 13 }}>{f.value || '待填写'}</Text>
                </Space>
              </div>
            ))}
            <Button type="primary" block style={{ marginTop: 12, borderRadius: 8, height: 36 }}>一键填报</Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<Space><Shield size={16} color="#22c55e" /><Text style={{ color: '#fff', fontWeight: 600 }}>合规检查</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid rgba(148,163,184,0.1)' }, body: { padding: '16px' } }}
          >
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: 14, background: 'rgba(34,197,94,0.08)', borderRadius: 8 }}>
                <CheckCircle size={20} color="#22c55e" style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: '#22c55e' }}>5项</div>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>已齐全</Text>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: 14, background: 'rgba(245,158,11,0.08)', borderRadius: 8 }}>
                <AlertCircle size={20} color="#f59e0b" style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>2项</div>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>待补充</Text>
              </div>
            </div>
            <div style={{ padding: '8px 12px', background: 'rgba(148,163,184,0.06)', borderRadius: 8 }}>
              {complianceItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                  <Checkbox checked={item.done} style={{ pointerEvents: 'none' }} />
                  <Text style={{ color: item.done ? '#e2e8f0' : '#f59e0b', fontSize: 13, textDecoration: item.done ? 'none' : 'underline' }}>{item.label}</Text>
                  {item.done ? <CheckCircle size={12} color="#22c55e" /> : <AlertCircle size={12} color="#f59e0b" />}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<Space><Lightbulb size={16} color="#f59e0b" /><Text style={{ color: '#fff', fontWeight: 600 }}>经验推荐</Text><Tag color="gold">基于当前任务智能匹配</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid rgba(148,163,184,0.1)' }, body: { padding: '12px 16px' } }}
          >
            <Timeline
              items={relatedCases.map(c => ({
                color: c.type === '成功案例' ? 'green' : c.type === '失败案例' ? 'red' : 'blue',
                children: (
                  <div style={{ padding: 12, background: 'rgba(148,163,184,0.06)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Lightbulb size={14} color="#f59e0b" />
                      <Text style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{c.title}</Text>
                      <Tag color={c.type === '成功案例' ? 'green' : c.type === '失败案例' ? 'red' : 'blue'} style={{ margin: 0 }}>{c.type}</Tag>
                      <Tag style={{ margin: 0 }}>{c.department}</Tag>
                    </div>
                    <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>{c.result}</Text>
                    <div style={{ marginTop: 6 }}>
                      <Space size={4} wrap>
                        {c.tags.map(t => <Tag key={t} style={{ fontSize: 11, margin: 0 }}>{t}</Tag>)}
                      </Space>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-card { background: transparent !important; }
        .ant-checkbox-inner { background: transparent !important; }
      `}</style>
    </div>
  )
}
