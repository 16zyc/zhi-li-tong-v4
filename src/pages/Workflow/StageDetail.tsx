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
  capture: { title: '任务捕获优化建议', items: ['建议接入OA系统自动同步公文任务', '领导批示语义识别准确率达93%', '新增信访渠道任务自动归类功能'] },
  goal: { title: '目标制定优化建议', items: ['5项批示待解析为可量化目标', '建议增加目标与考评指标的关联校验', '3项目标缺少明确时间节点'] },
  decompose: { title: '任务分解优化建议', items: ['营商环境改革任务粒度偏粗，建议进一步拆分', '开放处负载已达80%，建议重新评估分配', '2项跨处室任务需确认主次责任'] },
  indicator: { title: '指标生成优化建议', items: ['4项指标与处室职责匹配度低于75%', '建议增加过程性指标权重至40%', '数据采集自动化率可提升至85%'] },
  process: { title: '过程跟踪优化建议', items: ['2项政策研究任务近7天无进度更新', '规划编制环节平均耗时超出基准25%', '建议启用自动汇报生成功能'] },
  risk: { title: '风险预警优化建议', items: ['节能降碳改造已触发红灯，建议立即介入', '3项任务临近节点但进度不足50%', '建议调整风险阈值，降低误报率'] },
  verify: { title: '查访核验优化建议', items: ['价格监测体系建设材料完整度仅65%', '建议启用OCR自动比对功能', '2项核验报告待生成'] },
  evaluate: { title: '考核评价优化建议', items: ['Q2评分进度60%，建议加速推进', '3个处室自评数据尚未提交', '建议启用AI辅助评分功能'] },
  feedback: { title: '绩效反馈优化建议', items: ['Q1反馈报告已发送至8个处室', '1项申诉待处理（资环处）', '建议增加可视化对比图表'] },
  report: { title: '报告生成优化建议', items: ['年度报告模板已更新为2025版', '建议增加跨年度趋势对比分析', '3个处室数据尚未汇总完成'] },
}

const capturePieOption = () => ({
  tooltip: { trigger: 'item' as const },
  legend: { bottom: 0, textStyle: { fontSize: 12 } },
  series: [{
    type: 'pie', radius: ['40%', '65%'],
    label: { fontSize: 12 },
    data: [
      { value: 5, name: '市政府工作报告', itemStyle: { color: '#1a365d' } },
      { value: 3, name: '上级单位文件', itemStyle: { color: '#2a5298' } },
      { value: 2, name: '领导批示', itemStyle: { color: '#d4a853' } },
      { value: 2, name: '内部审计报告', itemStyle: { color: '#e8983e' } },
      { value: 3, name: '制度规定', itemStyle: { color: '#52c41a' } },
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
  xAxis: { type: 'category' as const, data: ['市京津冀协同办', '开放处', '营商政策处', '资环处', '高技术处', '投资处'], axisLabel: { fontSize: 11 } },
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

const reportBarOption = () => ({
  tooltip: { trigger: 'axis' as const },
  grid: { left: 100, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'value' as const, max: 100, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'category' as const, data: ['绩效分析报告', '处室画像报告', '风险预警报告', '改进建议报告', '年度总结报告', '专项分析报告'], axisLabel: { fontSize: 11 } },
  series: [{
    type: 'bar', barWidth: 18,
    data: [85, 72, 90, 65, 20, 55],
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
      case 'report':
        return (
          <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>报告完成度分布</div>
            <ReactEChartsCore echarts={echarts} option={reportBarOption()} style={{ height: 260 }} />
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
