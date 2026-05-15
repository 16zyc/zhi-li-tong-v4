import { Card, Table, Tag, Progress, Row, Col, Typography, Descriptions, Badge } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import {
  Target, Flag, GitBranch, BarChart3, Activity,
  AlertTriangle, Search, Award, MessageSquare, TrendingUp,
  ChevronLeft, Lightbulb,
} from 'lucide-react'
import { workflowStages, taskData } from '@/mock/taskData'

const { Title, Text } = Typography

echarts.use([PieChart, BarChart, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target size={20} />,
  Flag: <Flag size={20} />,
  GitBranch: <GitBranch size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Activity: <Activity size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  Search: <Search size={20} />,
  Award: <Award size={20} />,
  MessageSquare: <MessageSquare size={20} />,
  TrendingUp: <TrendingUp size={20} />,
}

const statusMap: Record<string, { color: string; label: string }> = {
  pending: { color: 'default', label: '待启动' },
  in_progress: { color: 'processing', label: '进行中' },
  completed: { color: 'success', label: '已完成' },
  overdue: { color: 'error', label: '已超期' },
}

const priorityMap: Record<string, { color: string; label: string }> = {
  high: { color: 'red', label: '高' },
  medium: { color: 'orange', label: '中' },
  low: { color: 'blue', label: '低' },
}

const aiSuggestionMap: Record<string, { title: string; items: string[] }> = {
  capture: { title: '任务捕获优化建议', items: ['建议接入OA系统自动同步待办任务', '语音转文字识别率可提升至95%以上', '新增信访渠道任务自动归类功能'] },
  goal: { title: '目标建立优化建议', items: ['3项批示待解析，建议优先处理', '招商引资目标与战略规划关联度不足', '建议增加目标可量化性校验'] },
  decompose: { title: '任务分解优化建议', items: ['XX产业园项目子任务粒度偏粗，建议进一步拆分', '运营部负载已达85%，建议重新分配', '2项外部协同任务需确认接收方'] },
  indicator: { title: '指标生成优化建议', items: ['3项指标与职责匹配度低于70%', '建议增加过程性指标权重', '数据采集自动化率可提升至80%'] },
  process: { title: '过程管理优化建议', items: ['2项任务近7天无进度更新', '设计招标环节平均耗时超出基准30%', '建议启用自动汇报生成功能'] },
  risk: { title: '风险预警优化建议', items: ['数据治理项目已触发红灯，建议立即介入', '3项任务临近节点但进度不足50%', '建议调整风险阈值，降低误报率'] },
  verify: { title: '查访核验优化建议', items: ['审计整改落实材料完整度仅60%', '建议启用OCR自动比对功能', '2项核验报告待生成'] },
  evaluate: { title: '考核评价优化建议', items: ['Q2评分进度30%，建议加速推进', '3个部门自评数据尚未提交', '建议启用AI辅助评分功能'] },
  feedback: { title: '绩效反馈优化建议', items: ['制度文件更新反馈报告待发送', '1项申诉待处理', '建议增加可视化对比图表'] },
  optimize: { title: '效能优化建议', items: ['审批流程平均耗时3.2天，可优化至2.5天', '目标设定环节为当前瓶颈', '建议沉淀3项最佳实践案例'] },
}

const capturePieOption = () => ({
  tooltip: { trigger: 'item' as const },
  legend: { bottom: 0, textStyle: { fontSize: 12 } },
  series: [{
    type: 'pie', radius: ['40%', '65%'],
    label: { fontSize: 12 },
    data: [
      { value: 3, name: '集团领导交办', itemStyle: { color: '#1a365d' } },
      { value: 2, name: '上级单位文件', itemStyle: { color: '#2a5298' } },
      { value: 1, name: '客户投诉', itemStyle: { color: '#d4a853' } },
      { value: 2, name: '内部审计报告', itemStyle: { color: '#e8983e' } },
      { value: 1, name: '制度规定', itemStyle: { color: '#52c41a' } },
    ],
  }],
})

const riskCards = [
  { level: '红灯', color: '#ff4d4f', bg: '#fff1f0', count: taskData.filter(t => t.riskLevel === 'red').length, desc: '需立即介入' },
  { level: '黄灯', color: '#faad14', bg: '#fff7e6', count: taskData.filter(t => t.riskLevel === 'yellow').length, desc: '需重点关注' },
  { level: '绿灯', color: '#52c41a', bg: '#f6ffed', count: taskData.filter(t => t.riskLevel === 'green' || (!t.riskLevel && t.status === 'in_progress')).length, desc: '正常推进' },
]

const evaluateBarOption = () => ({
  tooltip: { trigger: 'axis' as const },
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'category' as const, data: ['战略部', '运营部', '信息中心', '审计部', '人力资源部', '法务部'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value' as const, max: 100, axisLabel: { fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 28,
    data: [82, 75, 68, 88, 71, 79],
    itemStyle: {
      color: (params: { dataIndex: number }) => {
        const colors = ['#1a365d', '#2a5298', '#d4a853', '#52c41a', '#e8983e', '#722ed1']
        return colors[params.dataIndex]
      },
      borderRadius: [4, 4, 0, 0],
    },
  }],
})

const optimizeBarOption = () => ({
  tooltip: { trigger: 'axis' as const },
  grid: { left: 80, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'value' as const, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'category' as const, data: ['目标设定', '任务分解', '过程跟踪', '材料归档', '考核评分', '反馈沟通'], axisLabel: { fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 18,
    data: [4.2, 3.8, 3.1, 2.9, 2.5, 2.1],
    itemStyle: { color: '#d4a853', borderRadius: [0, 4, 4, 0] },
  }],
})

export default function StageDetail() {
  const { stage: stageKey } = useParams<{ stage: string }>()
  const navigate = useNavigate()
  const stage = workflowStages.find(s => s.key === stageKey)

  if (!stage) {
    return (
      <div className="flex items-center justify-center" style={{ height: 400 }}>
        <Text style={{ color: '#8c8c8c' }}>未找到该环节信息</Text>
      </div>
    )
  }

  const tasks = taskData.filter(t => t.stage === stageKey)
  const suggestion = aiSuggestionMap[stageKey] || { title: 'AI建议', items: [] }

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id', width: 90 },
    { title: '任务名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 120, render: (v: string) => <Tag>{v}</Tag> },
    { title: '责任部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '负责人', dataIndex: 'responsible', key: 'responsible', width: 80 },
    { title: '截止日期', dataIndex: 'deadline', key: 'deadline', width: 110 },
    {
      title: '进度', dataIndex: 'progress', key: 'progress', width: 140,
      render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 80 ? '#52c41a' : v >= 50 ? '#1890ff' : '#faad14'} />,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label}</Tag>,
    },
    {
      title: '优先级', dataIndex: 'priority', key: 'priority', width: 80,
      render: (v: string) => <Tag color={priorityMap[v]?.color}>{priorityMap[v]?.label}</Tag>,
    },
  ]

  const renderStageContent = () => {
    switch (stageKey) {
      case 'capture':
        return (
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>来源渠道分布</div>
            <ReactEChartsCore echarts={echarts} option={capturePieOption()} style={{ height: 280 }} />
          </Card>
        )
      case 'risk':
        return (
          <Row gutter={20}>
            {riskCards.map(r => (
              <Col span={8} key={r.level}>
                <Card style={{ borderRadius: 12, background: r.bg, border: `1px solid ${r.color}33` }} styles={{ body: { padding: '20px 24px' } }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: 13, color: r.color, fontWeight: 600, marginBottom: 4 }}>{r.level}</div>
                      <div style={{ fontSize: 32, fontWeight: 700, color: r.color }}>{r.count}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>{r.desc}</div>
                    </div>
                    <Badge color={r.color} />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )
      case 'evaluate':
        return (
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>各部门评分分布</div>
            <ReactEChartsCore echarts={echarts} option={evaluateBarOption()} style={{ height: 260 }} />
          </Card>
        )
      case 'optimize':
        return (
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>瓶颈分析（平均耗时/天）</div>
            <ReactEChartsCore echarts={echarts} option={optimizeBarOption()} style={{ height: 260 }} />
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2a5298 50%, #1a365d 100%)' }}
      >
        <ChevronLeft size={24} color="#fff" style={{ cursor: 'pointer' }} onClick={() => navigate('/workflow')} />
        <div
          className="flex items-center justify-center"
          style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        >
          {iconMap[stage.icon]}
        </div>
        <div>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>{stage.name}</Title>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{stage.description}</Text>
        </div>
      </div>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
        <Descriptions column={4} size="small">
          <Descriptions.Item label="AI能力">{stage.aiCapability}</Descriptions.Item>
          <Descriptions.Item label="输出物"><Tag color="blue">{stage.output}</Tag></Descriptions.Item>
          <Descriptions.Item label="负责Agent"><Tag color="gold">{stage.agent}</Tag></Descriptions.Item>
          <Descriptions.Item label="当前任务数">
            <Badge count={tasks.length} style={{ backgroundColor: '#1a365d' }} overflowCount={99} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: 0 } }}
        title={<span style={{ fontSize: 15, fontWeight: 600, color: '#1a365d' }}>任务列表</span>}
      >
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={false}
          style={{ padding: '0 16px 16px' }}
        />
      </Card>

      {renderStageContent()}

      <Card style={{ borderRadius: 12, borderLeft: '4px solid #d4a853' }} styles={{ body: { padding: '16px 24px' } }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} color="#d4a853" />
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1a365d' }}>{suggestion.title}</span>
          <Tag color="gold" style={{ marginLeft: 8 }}>AI生成</Tag>
        </div>
        <div className="space-y-2">
          {suggestion.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2" style={{ fontSize: 14, color: '#333' }}>
              <span style={{ color: '#d4a853', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
