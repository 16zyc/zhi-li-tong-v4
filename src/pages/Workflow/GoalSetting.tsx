import { useState } from 'react'
import { Card, Tag, Progress, Row, Col, Typography } from 'antd'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ChevronLeft, Target, Lightbulb, Bot, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

echarts.use([RadarChart, CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent])

interface Goal {
  id: string
  name: string
  source: string
  department: string
  deadline: string
  status: 'confirmed' | 'draft' | 'review'
  indicators: number
  quality: number
  description: string
}

const goals: Goal[] = [
  { id: 'G-001', name: '京津冀协同发展年度目标', source: '市政府工作报告第2、3项', department: '协同政策处/协同疏解处', deadline: '2025-12-31', status: 'confirmed', indicators: 3, quality: 92, description: '编制协同发展规划，推进非首都功能疏解' },
  { id: 'G-002', name: '"一带一路"高质量发展目标', source: '市政府工作报告第9项', department: '开放处/空铁处', deadline: '2025-06-30', status: 'draft', indicators: 2, quality: 78, description: '出台实施方案，搭建综合服务平台' },
  { id: 'G-003', name: '营商环境改革目标', source: '市政府工作报告第25项', department: '营商改革处', deadline: '2025-09-30', status: 'review', indicators: 4, quality: 85, description: '制定6.0版改革方案，推进审批制度改革' },
  { id: 'G-004', name: '双碳政策体系建设目标', source: '市政府工作报告第31项', department: '资环处', deadline: '2025-12-31', status: 'confirmed', indicators: 3, quality: 88, description: '完善1+N政策体系，推进节能降碳改造' },
  { id: 'G-005', name: '科技创新中心建设目标', source: '市政府工作报告第15项', department: '高技术处/科创中心', deadline: '2025-12-31', status: 'draft', indicators: 2, quality: 72, description: '推动先行先试改革落地，支持新型研发机构' },
  { id: 'G-006', name: '民生保障目标', source: '市政府工作报告第42、50项', department: '价格处/投资处', deadline: '2025-11-30', status: 'confirmed', indicators: 3, quality: 90, description: '完善价格监测预警，推进城市更新' },
]

const statusMap: Record<Goal['status'], { color: string; label: string; icon: React.ReactNode }> = {
  confirmed: { color: 'green', label: '已确认', icon: <CheckCircle size={14} /> },
  draft: { color: 'blue', label: '草稿', icon: <Clock size={14} /> },
  review: { color: 'orange', label: '审核中', icon: <AlertCircle size={14} /> },
}

const radarOption = () => ({
  tooltip: {},
  radar: {
    indicator: [
      { name: '可量化性', max: 100 },
      { name: '时间明确性', max: 100 },
      { name: '职责匹配度', max: 100 },
      { name: '考评对齐度', max: 100 },
      { name: '资源可行性', max: 100 },
      { name: '风险可控性', max: 100 },
    ],
    shape: 'polygon' as const,
    splitNumber: 4,
    axisName: { fontSize: 12, color: '#666' },
    splitArea: { areaStyle: { color: ['rgba(26,54,93,0.02)', 'rgba(26,54,93,0.05)'] } },
  },
  series: [{
    type: 'radar',
    data: [{
      value: [85, 78, 92, 88, 75, 82],
      name: '目标质量评分',
      areaStyle: { color: 'rgba(26,54,93,0.15)' },
      lineStyle: { color: '#1a365d', width: 2 },
      itemStyle: { color: '#1a365d' },
    }],
  }],
})

const aiSuggestions = [
  '"一带一路"目标缺少量化指标，建议补充引资额、平台注册企业数等',
  '科技创新目标时间节点不够明确，建议拆分为季度里程碑',
  '营商环境改革目标建议增加企业满意度指标',
]

const alignmentData = [
  { goal: '京津冀协同发展年度目标', indicators: ['协同规划完成率', '疏解项目落地数', '区域协作机制建立'], rate: 95 },
  { goal: '"一带一路"高质量发展目标', indicators: ['实施方案出台', '平台注册企业数'], rate: 70 },
  { goal: '营商环境改革目标', indicators: ['改革方案发布', '审批时限压缩率', '企业满意度', '政务服务质量'], rate: 85 },
  { goal: '双碳政策体系建设目标', indicators: ['政策文件出台数', '节能改造完成率', '碳排放下降率'], rate: 90 },
  { goal: '科技创新中心建设目标', indicators: ['改革措施落地数', '新型研发机构数'], rate: 68 },
  { goal: '民生保障目标', indicators: ['价格预警响应率', '城市更新完成率', '民生满意度'], rate: 88 },
]

export default function GoalSetting() {
  const navigate = useNavigate()
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const confirmedCount = goals.filter(g => g.status === 'confirmed').length
  const draftCount = goals.filter(g => g.status === 'draft').length
  const reviewCount = goals.filter(g => g.status === 'review').length
  const avgQuality = Math.round(goals.reduce((s, g) => s + g.quality, 0) / goals.length)

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
          <Target size={22} />
        </div>
        <div>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>目标制定</Title>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
            基于捕获的任务，结合处室职责和考评方案，制定可量化、可考核的工作目标
          </Text>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ fontSize: 13, color: '#8c8c8c' }}>目标总数</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a365d' }}>{goals.length}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 10, borderLeft: '3px solid #52c41a' }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ fontSize: 13, color: '#8c8c8c' }}>已确认</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#52c41a' }}>{confirmedCount}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 10, borderLeft: '3px solid #1890ff' }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ fontSize: 13, color: '#8c8c8c' }}>草稿/审核中</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1890ff' }}>{draftCount + reviewCount}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 10, borderLeft: '3px solid #d4a853' }} styles={{ body: { padding: '12px 16px' } }}>
            <div style={{ fontSize: 13, color: '#8c8c8c' }}>平均质量分</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#d4a853' }}>{avgQuality}</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={20}>
        <Col span={14}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>目标列表</div>
          <div className="space-y-3">
            {goals.map(goal => (
              <Card
                key={goal.id}
                style={{
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: selectedGoal === goal.id ? '2px solid #1a365d' : '1px solid #f0f0f0',
                  transition: 'border-color 0.2s',
                }}
                styles={{ body: { padding: '16px 20px' } }}
                onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
              >
                <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a365d' }}>{goal.name}</span>
                    <Tag color={statusMap[goal.status].color} icon={statusMap[goal.status].icon}>
                      {statusMap[goal.status].label}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>质量</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: goal.quality >= 85 ? '#52c41a' : goal.quality >= 75 ? '#faad14' : '#ff4d4f' }}>
                      {goal.quality}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{goal.description}</div>
                <div className="flex items-center gap-4" style={{ fontSize: 12, color: '#8c8c8c' }}>
                  <span>来源：{goal.source}</span>
                  <span>处室：{goal.department}</span>
                  <span>截止：{goal.deadline}</span>
                  <span>指标数：{goal.indicators}</span>
                </div>
                {selectedGoal === goal.id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 8 }}>考评指标对齐度</div>
                    <Progress
                      percent={alignmentData.find(a => a.goal === goal.name)?.rate ?? 0}
                      strokeColor={alignmentData.find(a => a.goal === goal.name)?.rate ?? 0 >= 85 ? '#52c41a' : alignmentData.find(a => a.goal === goal.name)?.rate ?? 0 >= 70 ? '#faad14' : '#ff4d4f'}
                      size="small"
                    />
                    <div className="flex flex-wrap gap-1" style={{ marginTop: 6 }}>
                      {alignmentData.find(a => a.goal === goal.name)?.indicators.map(ind => (
                        <Tag key={ind} style={{ fontSize: 11 }}>{ind}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Col>

        <Col span={10}>
          <div className="space-y-4">
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>目标质量检查</div>
              <ReactEChartsCore echarts={echarts} option={radarOption()} style={{ height: 300 }} />
              <div className="grid grid-cols-3 gap-2" style={{ marginTop: 8 }}>
                {[
                  { name: '可量化性', score: 85 },
                  { name: '时间明确性', score: 78 },
                  { name: '职责匹配度', score: 92 },
                  { name: '考评对齐度', score: 88 },
                  { name: '资源可行性', score: 75 },
                  { name: '风险可控性', score: 82 },
                ].map(d => (
                  <div key={d.name} style={{ textAlign: 'center', padding: '6px 0', background: '#fafafa', borderRadius: 6 }}>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{d.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: d.score >= 85 ? '#52c41a' : d.score >= 75 ? '#faad14' : '#ff4d4f' }}>
                      {d.score}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ borderRadius: 12, borderLeft: '4px solid #d4a853' }} styles={{ body: { padding: '16px 20px' } }}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} color="#d4a853" />
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a365d' }}>AI智能建议</span>
                <Tag color="gold" style={{ marginLeft: 8 }}>AI生成</Tag>
              </div>
              <div className="space-y-3">
                {aiSuggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2" style={{ fontSize: 13, color: '#333', lineHeight: '20px' }}>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(212,168,83,0.12)', marginTop: 1 }}
                    >
                      <Bot size={12} color="#d4a853" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 16 }}>目标与考评指标对齐情况</div>
        <Row gutter={[16, 12]}>
          {alignmentData.map(item => (
            <Col span={8} key={item.goal}>
              <Card
                size="small"
                style={{ borderRadius: 10, background: item.rate >= 85 ? '#f6ffed' : item.rate >= 70 ? '#fff7e6' : '#fff1f0' }}
                styles={{ body: { padding: '12px 16px' } }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 6 }}>{item.goal}</div>
                <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>对齐度</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: item.rate >= 85 ? '#52c41a' : item.rate >= 70 ? '#faad14' : '#ff4d4f' }}>
                    {item.rate}%
                  </span>
                </div>
                <Progress
                  percent={item.rate}
                  showInfo={false}
                  size="small"
                  strokeColor={item.rate >= 85 ? '#52c41a' : item.rate >= 70 ? '#faad14' : '#ff4d4f'}
                />
                <div className="flex flex-wrap gap-1" style={{ marginTop: 6 }}>
                  {item.indicators.map(ind => (
                    <Tag key={ind} style={{ fontSize: 11 }}>{ind}</Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}
