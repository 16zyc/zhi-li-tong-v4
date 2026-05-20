import { useState } from 'react'
import { Card, Tag, Progress, Row, Col, Typography, Button, Input, Select, Divider } from 'antd'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { ChevronLeft, Target, Lightbulb, Bot, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { TextArea } = Input

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

interface GeneratedGoalPlan {
  category: string
  annualGoal: string
  junePlan: string
  septemberPlan: string
  score: number
  checks: { name: string; passed: boolean; desc: string }[]
}

interface ProgressJudgement {
  status: 'green' | 'yellow' | 'red'
  label: string
  conclusion: string
  evidence: string[]
  deduction: string
  suggestion: string
}

const goals: Goal[] = [
  { id: 'G-001', name: '京津冀协同发展年度目标', source: '市政府工作报告第2、3项', department: '市京津冀协同办/市疏整促专项办', deadline: '2025-12-31', status: 'confirmed', indicators: 3, quality: 92, description: '编制协同发展规划，推进非首都功能疏解' },
  { id: 'G-002', name: '"一带一路"高质量发展目标', source: '市政府工作报告第9项', department: '开放处/空铁处', deadline: '2025-06-30', status: 'draft', indicators: 2, quality: 78, description: '出台实施方案，搭建综合服务平台' },
  { id: 'G-003', name: '营商环境改革目标', source: '市政府工作报告第25项', department: '营商政策处', deadline: '2025-09-30', status: 'review', indicators: 4, quality: 85, description: '制定6.0版改革方案，推进审批制度改革' },
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

const demoTaskSamples = [
  {
    label: '指标数值类：建设规模减量',
    value: '扎实推进建设规模减量，治理违法建设2000万平方米，实现城乡建设用地再减量约5.4平方公里。',
  },
  {
    label: '文件印发类：协同规划',
    value: '编制出台现代化首都都市圈空间协同规划，加强重点领域协同发展政策对接，着力建设通勤圈、功能圈、产业协同圈。',
  },
  {
    label: '工程项目类：副中心枢纽',
    value: '基本建成副中心站综合交通枢纽，推进轨道交通M101线一期、六环高线公园等重点工程建设。',
  },
]

const defaultTaskInput = demoTaskSamples[0].value
const defaultTargetInput = '现代化首都都市圈空间协同规划：6月底前完成征求意见，9月底前正式印发。'
const defaultProgressInput = '当前进展：已完成部门征求意见并经委党组会审定，已报送市政府常务会议待审议，尚未正式印发。佐证材料包括委党组会会议纪要、市政府常务会议审议请示。'

function buildGoalPlan(task: string): GeneratedGoalPlan {
  if (/违法建设|万平方米|平方公里|指标/.test(task)) {
    return {
      category: '指标数值类',
      annualGoal: '完成治理违法建设2000万平方米，实现城乡建设用地再减量约5.4平方公里，并完成年度核验归档。',
      junePlan: '6月底前完成年度治理任务的60%，同步形成阶段性台账和问题清单。',
      septemberPlan: '9月底前全面完成治理任务，完成场清地净核验和用地减量数据复核。',
      score: 94,
      checks: [
        { name: '目标量化', passed: true, desc: '已提取2000万平方米、5.4平方公里两个量化指标' },
        { name: '节点明确', passed: true, desc: '已形成6月、9月两个季度预案' },
        { name: '可核验', passed: true, desc: '可通过治理台账、用地数据和现场核验材料验证' },
      ],
    }
  }

  if (/规划|办法|方案|印发|出台/.test(task)) {
    return {
      category: '文件印发类',
      annualGoal: '完成文件调研起草、征求意见、合法性审查、会议审议和正式印发实施。',
      junePlan: '6月底前完成调研起草、征求意见和委内会议审议。',
      septemberPlan: '9月底前完成合法性审查、政策一致性评估并正式印发。',
      score: 88,
      checks: [
        { name: '程序完整', passed: true, desc: '已按文件印发流程倒排关键节点' },
        { name: '节点明确', passed: true, desc: '已明确6月审议、9月印发' },
        { name: '风险提示', passed: false, desc: '上级会议审议时间存在不确定性，需预留缓冲' },
      ],
    }
  }

  return {
    category: '工程项目类',
    annualGoal: '完成项目入库、立项申报、批复、招投标、开工建设及阶段性进度目标。',
    junePlan: '6月底前完成项目入库、立项申报和前期审批手续。',
    septemberPlan: '9月底前完成招投标并形成实质性建设进展。',
    score: 84,
    checks: [
      { name: '流程匹配', passed: true, desc: '已按工程项目审批建设流程倒排工期' },
      { name: '数据来源', passed: true, desc: '可关联项目库、审批系统和建设进展材料' },
      { name: '目标细化', passed: false, desc: '需责任处室补充具体工程量和投资进度' },
    ],
  }
}

function judgeProgress(target: string, progress: string): ProgressJudgement {
  const targetNeedsIssue = /印发|出台/.test(target)
  const hasNegativeIssue = /尚未正式印发|未正式印发|未印发|未出台|尚未出台/.test(progress)
  const hasIssued = !hasNegativeIssue && /已印发|正式印发|发布实施|已出台/.test(progress)
  const hasSubmitted = /报送|待审议|会议待审|常务会议/.test(progress)
  const hasDraft = /起草|征求意见|党组会|审定/.test(progress)

  if (targetNeedsIssue && hasIssued) {
    return {
      status: 'green',
      label: '已达标',
      conclusion: '对照年度目标和季度预案，该任务已完成正式印发要求，目标实现情况为已按计划实现。',
      evidence: ['正式印发文件', '发文流程记录', '任务办结材料'],
      deduction: '建议不扣分，可进入办结核验。',
      suggestion: '归档印发文件和实施反馈材料，作为年度评价依据。',
    }
  }

  if (targetNeedsIssue && hasSubmitted) {
    return {
      status: 'red',
      label: '部分滞后',
      conclusion: '对照9月底正式印发目标，当前处于上级会议审议前置环节，尚未达到正式印发要求。',
      evidence: ['委党组会会议纪要', '报送市政府常务会议审议请示'],
      deduction: '按文件印发类评分规则，建议按“完成会议审议前置工作”计70分左右，扣减30分；最终以考评主体复核为准。',
      suggestion: '建议发出督办提醒，明确会议审议时间和正式印发倒排节点。',
    }
  }

  if (hasDraft) {
    return {
      status: 'yellow',
      label: '存在风险',
      conclusion: '当前已形成阶段性成果，但距离季度目标仍有关键程序未完成。',
      evidence: ['调研起草材料', '征求意见记录', '委内审议材料'],
      deduction: '建议暂不直接扣分，纳入黄灯跟踪；若到期仍未完成，按滞后节点扣10-30分。',
      suggestion: '建议补齐后续审查、评估和会议审议节点计划。',
    }
  }

  return {
    status: 'yellow',
    label: '需补充材料',
    conclusion: '当前进展描述不足，无法完整证明目标实现情况。',
    evidence: ['需补充会议纪要、请示、公告或产出物'],
    deduction: '建议先退回补充材料，暂缓评分。',
    suggestion: '请责任处室补充关键节点佐证材料后重新研判。',
  }
}

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
  const [taskInput, setTaskInput] = useState(defaultTaskInput)
  const [goalPlan, setGoalPlan] = useState<GeneratedGoalPlan>(() => buildGoalPlan(defaultTaskInput))
  const [targetInput, setTargetInput] = useState(defaultTargetInput)
  const [progressInput, setProgressInput] = useState(defaultProgressInput)
  const [judgement, setJudgement] = useState<ProgressJudgement>(() => judgeProgress(defaultTargetInput, defaultProgressInput))

  const confirmedCount = goals.filter(g => g.status === 'confirmed').length
  const draftCount = goals.filter(g => g.status === 'draft').length
  const reviewCount = goals.filter(g => g.status === 'review').length
  const avgQuality = Math.round(goals.reduce((s, g) => s + g.quality, 0) / goals.length)
  const statusColor = judgement.status === 'green' ? '#52c41a' : judgement.status === 'yellow' ? '#faad14' : '#ff4d4f'

  const handleGenerateGoal = () => {
    setGoalPlan(buildGoalPlan(taskInput))
  }

  const handleJudgeProgress = () => {
    setJudgement(judgeProgress(targetInput, progressInput))
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

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '18px 24px' } }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>现场演示：输入任务后自动制定目标</div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>按任务类型识别、倒排季度预案，并输出目标质量校验</div>
          </div>
          <Tag color="blue">Demo2 目标制定与调整</Tag>
        </div>
        <Row gutter={20}>
          <Col span={11}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>任务内容</div>
            <Select
              value={taskInput}
              onChange={value => setTaskInput(value)}
              options={demoTaskSamples}
              style={{ width: '100%', marginBottom: 10 }}
            />
            <TextArea
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              autoSize={{ minRows: 5, maxRows: 7 }}
              style={{ borderRadius: 8 }}
            />
            <Button type="primary" onClick={handleGenerateGoal} style={{ marginTop: 12, borderRadius: 8, background: '#1a365d' }}>
              自动制定目标
            </Button>
          </Col>
          <Col span={13}>
            <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
              <Tag color="gold">{goalPlan.category}</Tag>
              <span style={{ fontSize: 13, color: '#8c8c8c' }}>目标质量分</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: goalPlan.score >= 90 ? '#52c41a' : '#faad14' }}>{goalPlan.score}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: '年度目标', value: goalPlan.annualGoal },
                { label: '6月预案', value: goalPlan.junePlan },
                { label: '9月预案', value: goalPlan.septemberPlan },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #eef2f7', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: '#1a365d', lineHeight: '22px' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <Divider style={{ margin: '14px 0' }} />
            <Row gutter={10}>
              {goalPlan.checks.map(check => (
                <Col span={8} key={check.name}>
                  <div style={{ padding: 10, borderRadius: 8, background: check.passed ? '#f6ffed' : '#fff7e6', border: `1px solid ${check.passed ? '#b7eb8f' : '#ffd591'}`, minHeight: 86 }}>
                    <Tag color={check.passed ? 'success' : 'warning'} style={{ marginBottom: 6 }}>{check.name}</Tag>
                    <div style={{ fontSize: 12, color: '#666', lineHeight: '18px' }}>{check.desc}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '18px 24px' } }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>现场演示：目标与进展自动比对研判</div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>输入目标和当前进展，系统输出达标结论、支撑依据、扣分建议和督办建议</div>
          </div>
          <Tag color="red">Demo3/Demo4 过程预警与评价</Tag>
        </div>
        <Row gutter={20}>
          <Col span={11}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>目标/季度预案</div>
            <TextArea
              value={targetInput}
              onChange={e => setTargetInput(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{ borderRadius: 8, marginBottom: 12 }}
            />
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>当前进展及佐证材料</div>
            <TextArea
              value={progressInput}
              onChange={e => setProgressInput(e.target.value)}
              autoSize={{ minRows: 5, maxRows: 7 }}
              style={{ borderRadius: 8 }}
            />
            <Button type="primary" onClick={handleJudgeProgress} style={{ marginTop: 12, borderRadius: 8, background: '#1a365d' }}>
              研判是否达标
            </Button>
          </Col>
          <Col span={13}>
            <div style={{ padding: '14px 16px', borderRadius: 10, background: judgement.status === 'green' ? '#f6ffed' : judgement.status === 'yellow' ? '#fff7e6' : '#fff1f0', border: `1px solid ${statusColor}55` }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a365d' }}>研判结论</span>
                <Tag color={judgement.status === 'green' ? 'success' : judgement.status === 'yellow' ? 'warning' : 'error'}>{judgement.label}</Tag>
              </div>
              <div style={{ fontSize: 14, color: '#333', lineHeight: '22px' }}>{judgement.conclusion}</div>
            </div>
            <Row gutter={12} style={{ marginTop: 12 }}>
              <Col span={12}>
                <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', minHeight: 132 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 8 }}>校验依据</div>
                  {judgement.evidence.map(item => (
                    <div key={item} style={{ fontSize: 13, color: '#555', lineHeight: '22px' }}>· {item}</div>
                  ))}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', minHeight: 132 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a365d', marginBottom: 8 }}>扣分建议</div>
                  <div style={{ fontSize: 13, color: '#555', lineHeight: '22px' }}>{judgement.deduction}</div>
                </div>
              </Col>
            </Row>
            <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#fdf8ef', border: '1px solid #f2dfb8' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#8a5a00', marginBottom: 6 }}>督办建议</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: '22px' }}>{judgement.suggestion}</div>
            </div>
          </Col>
        </Row>
      </Card>

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
