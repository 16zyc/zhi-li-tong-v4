import { Card, Table, Tag, Button, Timeline, Row, Col, Typography, Space, Badge, Progress, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Search, Shield, FileCheck, AlertTriangle, CheckCircle, Clock, Camera, MapPin } from 'lucide-react'
import { taskData } from '@/mock/taskData'
import { departmentData } from '@/mock/departmentData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const auditRelatedTasks = taskData.filter(t => t.stage === 'verify' || t.department === '审计部')

const verifyTasks = [
  { id: 'V-001', name: 'XX产业园资金使用核验', project: 'XX产业园项目推进', type: '现场核验', status: 'pending', deadline: '2025-07-15' },
  { id: 'V-002', name: '东南亚投资合规审查', project: '东南亚投资项目', type: '合规检查', status: 'in_progress', deadline: '2025-07-20' },
  { id: 'V-003', name: '数据治理项目材料核验', project: '数据治理项目', type: '材料核验', status: 'pending', deadline: '2025-08-01' },
  { id: 'V-004', name: 'Q2财务报表审计', project: 'Q2绩效考核', type: '材料核验', status: 'completed', deadline: '2025-06-30' },
  { id: 'V-005', name: '审批流程合规检查', project: '审批流程优化', type: '合规检查', status: 'completed', deadline: '2025-06-25' },
]

const issues = [
  { id: 'I-001', name: 'XX产业园资金拨付超期', status: '待整改', dept: '战略部', deadline: '2025-07-10', level: 'high' },
  { id: 'I-002', name: '数据治理项目文档缺失', status: '整改中', dept: '信息中心', deadline: '2025-07-20', level: 'medium' },
  { id: 'I-003', name: '东南亚投资风险评估不完整', status: '待整改', dept: '战略部', deadline: '2025-07-25', level: 'high' },
  { id: 'I-004', name: '审批流程节点超时', status: '已整改', dept: '审批部', deadline: '2025-06-28', level: 'low' },
  { id: 'I-005', name: '人力资源培训记录缺失', status: '整改中', dept: '人力资源部', deadline: '2025-07-30', level: 'medium' },
]

const deptHeadMap = Object.fromEntries(departmentData.map(d => [d.name, d.head]))

const complianceData = [
  { name: '资金管理', value: 95 },
  { name: '流程合规', value: 88 },
  { name: '文档完整', value: 82 },
  { name: '风险管控', value: 90 },
  { name: '制度执行', value: 96 },
]

const recentRecords = [
  { time: '2025-06-14 16:30', action: '完成XX产业园现场核验', result: '发现2项问题，已提交整改通知', icon: <Camera size={14} color="#3b82f6" /> },
  { time: '2025-06-13 10:15', action: '审核东南亚投资可研报告', result: '风险评估不完整，退回补充', icon: <FileCheck size={14} color="#22c55e" /> },
  { time: '2025-06-12 14:00', action: '数据治理项目材料核验', result: '3份文档缺失，已通知信息中心', icon: <Search size={14} color="#f59e0b" /> },
  { time: '2025-06-11 09:30', action: '审批流程合规检查', result: '合规率达标，无异常', icon: <CheckCircle size={14} color="#22c55e" /> },
  { time: '2025-06-10 15:45', action: 'Q2财务报表审计', result: '数据一致，审计通过', icon: <Shield size={14} color="#8b5cf6" /> },
]

const typeColorMap: Record<string, string> = {
  '现场核验': 'blue',
  '材料核验': 'green',
  '合规检查': 'purple',
}

const statusLabelMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'default', label: '待核验' },
  in_progress: { color: 'processing', label: '核验中' },
  completed: { color: 'success', label: '已完成' },
}

const issueStatusMap: Record<string, { color: string; bg: string }> = {
  '待整改': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  '整改中': { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  '已整改': { color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
}

const issueLevelMap: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6',
}

const pieOption = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#8c8c8c', fontSize: 12 } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#1a365d' } },
    data: complianceData.map(d => ({
      name: d.name,
      value: d.value,
      itemStyle: {
        color: d.name === '资金管理' ? '#3b82f6' : d.name === '流程合规' ? '#22c55e' : d.name === '文档完整' ? '#f59e0b' : d.name === '风险管控' ? '#8b5cf6' : '#06b6d4',
      },
    })),
  }],
}

const columns = [
  { title: '任务名称', dataIndex: 'name', key: 'name', render: (t: string) => <Text style={{ color: '#1a365d', fontWeight: 600 }}>{t}</Text> },
  { title: '所属项目', dataIndex: 'project', key: 'project', render: (t: string) => <Text style={{ color: '#8c8c8c' }}>{t}</Text> },
  { title: '核验类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={typeColorMap[t]}>{t}</Tag> },
  { title: '状态', dataIndex: 'status', key: 'status', render: (t: string) => { const s = statusLabelMap[t]; return <Tag color={s.color}>{s.label}</Tag> } },
  { title: '截止日期', dataIndex: 'deadline', key: 'deadline', render: (t: string) => <Space size={4}><Clock size={12} color="#8c8c8c" /><Text style={{ color: '#8c8c8c', fontSize: 12 }}>{t}</Text></Space> },
  {
    title: '操作', key: 'action', render: (_: unknown, r: typeof verifyTasks[0]) => (
      <Space size={4}>
        {r.status !== 'completed' && <Button size="small" type="primary" style={{ borderRadius: 6 }} icon={<Search size={12} style={{ verticalAlign: -1 }} />} onClick={() => message.info('正在启动核验流程...')}>开始核验</Button>}
        <Button size="small" style={{ background: '#f5f5f5', color: '#666', border: 'none', borderRadius: 6 }} icon={<FileCheck size={12} style={{ verticalAlign: -1 }} />} onClick={() => message.info('正在加载相关材料...')}>查看材料</Button>
        <Button size="small" style={{ background: '#f5f5f5', color: '#666', border: 'none', borderRadius: 6 }} icon={<Shield size={12} style={{ verticalAlign: -1 }} />} onClick={() => message.info('正在生成核验报告...')}>生成报告</Button>
      </Space>
    ),
  },
]

export default function ZhiXun() {
  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <Shield size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#8b5cf6' }} />
            智巡助手 · 审计核验工作台
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            钱总监，当前有
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>3项核验任务</Text>，
            <Text style={{ color: '#f59e0b', fontWeight: 600 }}>2项问题待整改</Text>
          </Text>
        </div>
        <Space>
          <Badge count={2}><Button type="text" style={{ color: '#8c8c8c' }} icon={<AlertTriangle size={18} />} /></Badge>
          <Badge count={3}><Button type="text" style={{ color: '#8c8c8c' }} icon={<Clock size={18} />} /></Badge>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '核验任务', value: auditRelatedTasks.length, suffix: '项', color: '#3b82f6', icon: <Search size={20} color="#3b82f6" /> },
          { label: '待整改', value: 2, suffix: '项', color: '#f59e0b', icon: <AlertTriangle size={20} color="#f59e0b" /> },
          { label: '已完成', value: 5, suffix: '项', color: '#22c55e', icon: <CheckCircle size={20} color="#22c55e" /> },
          { label: '合规率', value: 92, suffix: '%', color: '#8b5cf6', icon: <Shield size={20} color="#8b5cf6" /> },
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
            title={<Space><Search size={16} color="#3b82f6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>核验任务列表</Text><Tag color="blue">{verifyTasks.filter(v => v.status !== 'completed').length}项待处理</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: 0 } }}
          >
            <Table
              dataSource={verifyTasks}
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
        <Col span={14}>
          <Card
            title={<Space><AlertTriangle size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>问题跟踪</Text><Tag color="orange">{issues.filter(i => i.status === '待整改').length}项待整改</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            {issues.map(issue => {
              const sm = issueStatusMap[issue.status]
              return (
                <div key={issue.id} style={{ padding: '10px 14px', background: sm.bg, borderRadius: 8, marginBottom: 8, borderLeft: `3px solid ${issueLevelMap[issue.level]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Space size={8}>
                      <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 14 }}>{issue.name}</Text>
                      <Tag color={sm.color === '#ef4444' ? 'red' : sm.color === '#f59e0b' ? 'orange' : 'green'} style={{ margin: 0 }}>{issue.status}</Tag>
                    </Space>
                    <Space size={4}>
                      <Clock size={12} color="#8c8c8c" />
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>{issue.deadline}</Text>
                    </Space>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={4}>
                      <MapPin size={12} color="#8c8c8c" />
                      <Text style={{ color: '#8c8c8c', fontSize: 12 }}>责任部门：{issue.dept}（{deptHeadMap[issue.dept] || '—'}）</Text>
                    </Space>
                    <Space size={4}>
                      {issue.status !== '已整改' && <Button size="small" type="primary" style={{ borderRadius: 6, fontSize: 12 }} onClick={() => message.success('已发送催办通知')}>催办整改</Button>}
                      <Button size="small" style={{ background: '#f5f5f5', color: '#666', border: 'none', borderRadius: 6, fontSize: 12 }} onClick={() => message.info('正在加载整改详情...')}>详情</Button>
                    </Space>
                  </div>
                </div>
              )
            })}
          </Card>
        </Col>
        <Col span={10}>
          <Card
            title={<Space><Shield size={16} color="#8b5cf6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>合规检查结果</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 16px 16px' } }}
          >
            <ReactECharts option={pieOption} style={{ height: 240 }} />
            <div style={{ marginTop: 8 }}>
              {complianceData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <Text style={{ color: '#8c8c8c', fontSize: 12, width: 64 }}>{d.name}</Text>
                  <Progress
                    percent={d.value}
                    strokeColor={d.value >= 90 ? '#22c55e' : d.value >= 85 ? '#3b82f6' : '#f59e0b'}
                    trailColor="#f0f0f0"
                    size="small"
                    style={{ flex: 1 }}
                  />
                  <Text style={{ color: d.value >= 90 ? '#22c55e' : d.value >= 85 ? '#3b82f6' : '#f59e0b', fontSize: 12, fontWeight: 600, width: 36, textAlign: 'right' }}>{d.value}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<Space><Clock size={16} color="#06b6d4" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>近期核验记录</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Timeline
              items={recentRecords.map(r => ({
                color: r.result.includes('问题') || r.result.includes('缺失') || r.result.includes('不完整') ? 'red' : 'green',
                children: (
                  <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Space size={8}>
                        {r.icon}
                        <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 14 }}>{r.action}</Text>
                      </Space>
                      <Text style={{ color: '#64748b', fontSize: 12 }}>{r.time}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 13, lineHeight: 1.6 }}>{r.result}</Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-table { background: transparent !important; }
        .ant-table-thead > tr > th { background: #fafafa !important; color: #8c8c8c !important; border-bottom: 1px solid #f0f0f0 !important; }
        .ant-table-tbody > tr > td { border-bottom: 1px solid #f0f0f0 !important; color: #333 !important; background: transparent !important; }
        .ant-table-tbody > tr:hover > td { background: rgba(0,0,0,0.02) !important; }
        .ant-timeline-item-content { margin-inline-start: 20px !important; }
      `}</style>
    </div>
  )
}
