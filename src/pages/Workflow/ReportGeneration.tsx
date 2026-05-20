import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, Tag, Button, Progress, Input, Typography, Row, Col, Select, Divider, message } from 'antd'
import { ChevronLeft, FileText, Bot, Send, CheckCircle, Clock, Loader, Inbox } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { performanceData } from '@/mock/performanceData'

const { Title, Text } = Typography

interface ReportTemplate {
  id: string
  name: string
  description: string
  status: 'completed' | 'generating' | 'draft' | 'pending'
  progress: number
  sections: string[]
}

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

function getDimensionAverage(name: string) {
  const values = performanceData
    .map(item => item.dimensions.find(d => d.name === name)?.score)
    .filter((value): value is number => typeof value === 'number')
  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function getScoreColor(score: number) {
  if (score >= 90) return '#52c41a'
  if (score >= 80) return '#d4a853'
  return '#ff4d4f'
}

const reportTemplates: ReportTemplate[] = [
  { id: 'R-001', name: '年度绩效分析报告', description: '汇总全年各处室绩效数据，生成综合分析报告', status: 'generating', progress: 35, sections: ['总体概况', '处室排名', '指标完成度', '风险回顾', '改进建议'] },
  { id: 'R-002', name: '处室绩效画像报告', description: '为每个处室生成专属绩效画像', status: 'completed', progress: 100, sections: ['职责履行', '任务完成', '创新亮点', '短板分析'] },
  { id: 'R-003', name: '风险预警专项报告', description: '汇总红灯/黄灯项目，分析风险成因', status: 'draft', progress: 10, sections: ['风险概览', '成因分析', '处置建议', '跟踪计划'] },
  { id: 'R-004', name: '季度工作总结', description: '按季度汇总工作进展和成果', status: 'pending', progress: 0, sections: ['重点任务进展', '指标完成情况', '下季度计划'] },
  { id: 'R-005', name: '改进建议报告', description: '基于绩效数据生成针对性改进建议', status: 'completed', progress: 100, sections: ['问题识别', '根因分析', '改进路径', '预期效果'] },
]

const statusMap: Record<ReportTemplate['status'], { color: string; label: string; icon: React.ReactNode }> = {
  completed: { color: 'green', label: '已完成', icon: <CheckCircle size={14} /> },
  generating: { color: 'blue', label: '生成中', icon: <Loader size={14} /> },
  draft: { color: 'orange', label: '草稿', icon: <Clock size={14} /> },
  pending: { color: 'default', label: '待生成', icon: <Inbox size={14} /> },
}

const sectionStatusMap: Record<string, boolean> = {
  '总体概况': true,
  '处室排名': true,
  '指标完成度': false,
  '风险回顾': false,
  '改进建议': false,
  '职责履行': true,
  '任务完成': true,
  '创新亮点': true,
  '短板分析': true,
  '风险概览': true,
  '成因分析': false,
  '处置建议': false,
  '跟踪计划': false,
  '重点任务进展': false,
  '指标完成情况': false,
  '下季度计划': false,
  '问题识别': true,
  '根因分析': true,
  '改进路径': true,
  '预期效果': true,
}

const reportTypeOptions = [
  { value: 'annual', label: '年度绩效分析报告' },
  { value: 'quarterly', label: '季度工作总结' },
  { value: 'dept', label: '处室画像报告' },
  { value: 'risk', label: '风险预警专项报告' },
]

const deptOptions = [
  { value: '市京津冀协同办', label: '市京津冀协同办' },
  { value: '高技术处', label: '高技术处' },
  { value: '开放处', label: '开放处' },
  { value: '营商政策处', label: '营商政策处' },
  { value: '资环处', label: '资环处' },
  { value: '投资处', label: '投资处' },
  { value: '价格处', label: '价格处' },
  { value: '办公室', label: '办公室' },
]

function getReportContent(type: string, depts: string[]): string {
  const deptList = depts.length ? depts.join('、') : '全委处室'
  if (type === 'quarterly') {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  市发展改革委季度工作总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

涉及处室：${deptList}

一、重点任务进展

1. 京津冀协同发展重大项目
   牵头处室：市京津冀协同办
   当前进度：85%  状态：🟢 正常
   本季度完成：通州副中心行政办公区二期竣工验收
   下一步：推进轨道交通22号线建设

2. 中关村先行先试改革
   牵头处室：高技术处
   当前进度：70%  状态：🟡 偏慢
   本季度完成：科技成果转化收益分配试点方案
   下一步：扩大试点范围至10家科研院所

3. 营商环境6.0版改革
   牵头处室：营商政策处
   当前进度：40%  状态：🔴 滞后
   本季度完成：企业开办"一网通办"优化
   下一步：协调法规处加快方案审核，确保季度内出台

4. 碳达峰碳中和政策体系
   牵头处室：资环处
   当前进度：30%  状态：🔴 滞后
   本季度完成：重点行业碳排放核算标准初稿
   下一步：增加节能改造资金保障，加快政策出台

5. 开放平台建设
   牵头处室：开放处
   当前进度：62%  状态：🟡 偏慢
   本季度完成："一带一路"综合服务平台上线
   下一步：推进自贸试验区制度创新

二、指标完成情况

全委重点任务26项，本季度进展：
  ✅ 已完成：8项（30.8%）
  🔄 进行中：15项（57.7%）
  ⚠️ 滞后：3项（11.5%）

处室绩效得分概况：
  A级处室：市京津冀协同办（92分）、高技术处（90分）
  B级处室：开放处（88分）、办公室（87分）、人事处（86分）、营商政策处（85分）、资环处（82分）
  C级处室：投资处（78分）、市疏整促专项办（75分）、价格处（72分）

三、下季度计划

1. 重点推进滞后项目整改
   - 资环处：制定双碳任务加速方案，增加资金和人力保障
   - 营商政策处：协调法规处加快审核，确保6.0版改革方案季度内出台
   - 市疏整促专项办：明确非首都功能疏解时间节点

2. 日常工作优化
   - 建立周报制度，动态跟踪重点项目进展
   - 完善预警机制，对黄灯项目提前介入
   - 强化跨处室协同，明确牵头和配合职责

3. 考评准备工作
   - 启动半年度绩效自评
   - 组织处室互评和领导测评
   - 汇总加减分事项，更新佐证材料

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  报告生成时间：2025年XX月XX日
  数据截止日期：2025年XX月XX日
  生成方式：AI智能生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }
  if (type === 'risk') {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  市发展改革委风险预警专项报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、风险概览

当前涉及处室：${deptList}
监控指标总数：42项
红灯预警：3项  黄灯预警：5项  绿灯正常：34项

二、红灯项目详情

🔴 碳达峰碳中和政策体系建设（资环处）
   当前进度：30%  目标进度：60%
   风险等级：高  持续时间：已滞后3个月
   影响范围：全委双碳工作考核

🔴 营商环境6.0版改革方案（营商政策处）
   当前进度：40%  目标进度：70%
   风险等级：高  持续时间：已滞后2个月
   影响范围：市级营商环境评价

🔴 非首都功能疏解协调保障（市疏整促专项办）
   当前进度：45%  目标进度：75%
   风险等级：高  持续时间：已滞后1.5个月
   影响范围：京津冀协同发展考核

三、黄灯项目详情

🟡 城市更新项目推进（投资处）  进度55%
🟡 数字经济产业规划（高技术处）  进度60%
🟡 价格改革配套政策（价格处）  进度58%
🟡 开放平台建设（开放处）  进度62%
🟡 机关运行保障（办公室）  进度65%

四、成因分析

1. 政策协调不足：跨处室任务缺乏统一调度机制
2. 资源配置偏差：部分处室人力和资金保障不到位
3. 外部环境变化：政策调整和上级要求变更导致进度偏移
4. 过程管控缺失：日常跟踪和预警机制不健全

五、处置建议

1. 对红灯项目启动专项督办，每周汇报进展
2. 明确跨处室任务牵头处室和配合机制
3. 资环处建议增加节能改造资金保障
4. 营商政策处建议协调法规处加快方案审核
5. 建立月度风险复盘制度，动态调整处置策略

六、跟踪计划

1. 每周汇总红灯项目进展，报分管领导
2. 每月召开风险研判会，更新预警等级
3. 季末评估处置效果，调整下季度重点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  报告生成时间：2025年XX月XX日
  数据截止日期：2025年XX月XX日
  生成方式：AI智能生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }
  if (type === 'dept') {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  市发展改革委处室画像报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

涉及处室：${deptList}

一、市京津冀协同办

综合评级：A级  总分：92分
├─ 党的建设：96分（全委最高）
├─ 工作实绩：42分
├─ 依法行政：9分
├─ 履职测评：14分
└─ 加分项：+2分

核心优势：
  ✅ 党建得分全委第一，政治引领作用突出
  ✅ 京津冀协同发展重大项目按期推进
  ✅ 创新建立跨区域协调机制

改进方向：
  ⚠️ 依法行政仍有提升空间
  ⚠️ 建议加强基层调研频次

二、高技术处

综合评级：A级  总分：90分
├─ 党的建设：93分
├─ 工作实绩：41分
├─ 依法行政：9分
├─ 履职测评：13分
└─ 加分项：+3分（创新加分最多）

核心优势：
  ✅ 创新加分3分，全委最高
  ✅ 中关村改革方案成效显著
  ✅ 数字经济产业规划稳步推进

改进方向：
  ⚠️ 部分项目进度偏慢（黄灯预警）
  ⚠️ 建议优化项目优先级排序

三、资环处

综合评级：C级  总分：72分
├─ 党的建设：82分
├─ 工作实绩：30分
├─ 依法行政：7分
├─ 履职测评：11分
└─ 减分项：-2分

核心优势：
  ✅ 节能审查流程优化初见成效
  ✅ 生态文明建设方案按期完成

改进方向：
  ⚠️ 双碳任务严重滞后（红灯预警）
  ⚠️ 高效履职扣分较多
  ⚠️ 建议增加节能改造资金保障

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  报告生成时间：2025年XX月XX日
  数据截止日期：2025年XX月XX日
  生成方式：AI智能生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  市发展改革委2025年度绩效分析报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、总体概况

2025年度，全委48个处室单位参与综合考评，其中业务管理类29个、公共服务类9个、直属类10个。考评内容涵盖党的建设、工作实绩、履职测评、加分项和减分项5个方面。

年度考评成绩 = (工作实绩+履职测评+加分-减分) × (党建÷90)

二、处室得分排名

A级处室（2个）：
  🥇 市京津冀协同办  92分  党建96·履职42·依法9·测评14·加分2
  🥈 高技术处        90分  党建93·履职41·依法9·测评13·加分3

B级处室（5个）：
  3. 开放处          88分
  4. 营商政策处      85分
  5. 资环处          82分
  6. 办公室          87分
  7. 人事处          86分

C级处室（3个）：
  8. 投资处          78分
  9. 市疏整促专项办  75分
  10. 价格处         72分

三、重点任务完成情况

全年重点任务26项，其中：
  ✅ 已完成：8项（30.8%）
  🔄 进行中：15项（57.7%）
  ⚠️ 滞后：3项（11.5%）

滞后任务：
  🔴 碳达峰碳中和政策体系建设（资环处，进度30%）
  🔴 营商环境6.0版改革（营商政策处，进度40%）
  🟡 非首都功能疏解协调保障（市疏整促专项办，进度45%）

四、亮点与短板

🌟 亮点：
  1. 市京津冀协同办党建得分96，全委最高
  2. 高技术处创新加分3分，推动中关村改革成效显著
  3. 开放处依法行政满分，"一带一路"方案按期推进

⚠️ 短板：
  1. 资环处双碳任务严重滞后，高效履职扣分较多
  2. 价格处党建得分78，系数拉低总成绩
  3. 投资处城市更新项目开工率不足50%

五、改进建议

1. 对C级处室启动绩效改进计划，明确季度改进目标
2. 资环处建议增加节能改造资金保障，协调能源处协同推进
3. 价格处建议加强党建学习，提升党建系数
4. 投资处建议调整项目优先级，集中资源推进开工
5. 建立跨处室协同激励机制，促进A/B级处室帮扶C级处室

六、下年度工作重点

1. 精简整合考评指标，减轻处室负担
2. 强化日常督促指导和预警提醒
3. 探索处室协同联动激励机制
4. 将年终考评压力分担到日常工作

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  报告生成时间：2025年XX月XX日
  数据截止日期：2025年XX月XX日
  生成方式：AI智能生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
}

export default function ReportGeneration() {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState<string>('R-001')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('投资处')
  const [reportGenerated, setReportGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: '我是报告生成助手，可以帮您选择模板、定制章节、生成报告。请告诉我您需要什么类型的报告？' },
  ])
  const [chatInput, setChatInput] = useState('')
  const chatListRef = useRef<HTMLDivElement>(null)
  const typewriterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [aiReportType, setAiReportType] = useState<string>('annual')
  const [aiSelectedDepts, setAiSelectedDepts] = useState<string[]>(['市京津冀协同办', '高技术处', '资环处'])
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiReportContent, setAiReportContent] = useState<string>('')
  const [aiDisplayedContent, setAiDisplayedContent] = useState<string>('')
  const [aiReportDone, setAiReportDone] = useState(false)

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }, [chatMessages])

  const currentTemplate = reportTemplates.find(t => t.id === selectedTemplate)
  const currentRecord = performanceData.find(item => item.department === selectedDepartment) ?? performanceData[0]
  const averageScore = Math.round(performanceData.reduce((sum, item) => sum + item.score, 0) / performanceData.length)
  const scoreDiff = currentRecord.score - averageScore
  const topDimensions = currentRecord.dimensions
    .filter(item => item.score >= getDimensionAverage(item.name))
    .slice(0, 3)
    .map(item => item.name)
  const weakDimensions = currentRecord.dimensions
    .filter(item => item.score < getDimensionAverage(item.name))
    .map(item => item.name)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setReportGenerated(true)
    }, 3000)
  }

  const handleGenerateReport = useCallback(() => {
    if (aiGenerating) return
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current)
      typewriterTimerRef.current = null
    }
    setAiGenerating(true)
    setAiReportDone(false)
    setAiReportContent('')
    setAiDisplayedContent('')
    setTimeout(() => {
      const content = getReportContent(aiReportType, aiSelectedDepts)
      setAiReportContent(content)
      setAiGenerating(false)
      setAiDisplayedContent(content.slice(0, 1))
      let index = 1
      const typeNext = () => {
        if (index < content.length) {
          const nextIndex = Math.min(index + 2, content.length)
          setAiDisplayedContent(content.slice(0, nextIndex))
          index = nextIndex
          typewriterTimerRef.current = setTimeout(typeNext, 10)
        } else {
          setAiReportDone(true)
        }
      }
      typewriterTimerRef.current = setTimeout(typeNext, 100)
    }, 2000)
  }, [aiReportType, aiSelectedDepts, aiGenerating])

  const handleSend = () => {
    const text = chatInput.trim()
    if (!text) return
    setChatMessages(prev => [...prev, { role: 'user', content: text }])
    setChatInput('')
    setTimeout(() => {
      let reply = '感谢您的提问。我可以帮您选择报告模板、定制章节内容、调整生成参数。请告诉我您需要什么帮助？'
      if (text.includes('年度') || text.includes('绩效')) {
        reply = '年度绩效分析报告适合用于年终总结，包含总体概况、处室排名、指标完成度、风险回顾和改进建议五个章节。当前生成进度35%，预计还需5分钟完成。'
      } else if (text.includes('风险') || text.includes('预警')) {
        reply = '风险预警专项报告汇总了当前所有红灯和黄灯项目，分析风险成因并给出处置建议。当前为草稿状态，建议先补充风险成因分析章节。'
      } else if (text.includes('季度') || text.includes('总结')) {
        reply = '季度工作总结按季度汇总工作进展和成果，包含重点任务进展、指标完成情况和下季度计划三个章节。当前待生成，点击"生成报告"即可开始。'
      } else if (text.includes('处室') || text.includes('画像')) {
        reply = '处室绩效画像报告已生成完成，为每个处室生成了专属绩效画像，包含职责履行、任务完成、创新亮点和短板分析四个维度。'
      }
      setChatMessages(prev => [...prev, { role: 'ai', content: reply }])
    }, 800)
  }

  const completedCount = reportTemplates.filter(t => t.status === 'completed').length
  const generatingCount = reportTemplates.filter(t => t.status === 'generating').length

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
          <FileText size={22} />
        </div>
        <div>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>报告生成</Title>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
            基于全链路绩效数据，AI智能生成多维度分析报告
          </Text>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{reportTemplates.length}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>报告模板</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }}>{completedCount}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>已完成</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>{generatingCount}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>生成中</div>
          </div>
        </div>
      </div>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '18px 24px' } }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>现场演示：输入年度结果后自动生成处室体检报告</div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>基于年度考评结果，自动生成总体评价、同类对比、优势事项、关注事项和整改建议</div>
          </div>
          <Tag color="purple">Demo5 分析报告自动生成</Tag>
        </div>
        <Row gutter={20}>
          <Col span={7}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>选择处室年度结果</div>
            <Select
              value={selectedDepartment}
              onChange={value => {
                setSelectedDepartment(value)
                setReportGenerated(false)
              }}
              options={performanceData.map(item => ({ label: item.department, value: item.department }))}
              style={{ width: '100%', marginBottom: 12 }}
            />
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc' }}>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>总成绩</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: getScoreColor(currentRecord.score) }}>{currentRecord.score}</div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc' }}>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>同类平均</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1a365d' }}>{averageScore}</div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc' }}>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>排名/等级</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1a365d' }}>第{currentRecord.rank} / {currentRecord.level}</div>
              </div>
            </div>
            <Button type="primary" loading={generating} onClick={handleGenerate} style={{ marginTop: 12, borderRadius: 8, background: '#1a365d', width: '100%' }}>
              {generating ? '正在生成体检报告...' : '生成体检报告'}
            </Button>
          </Col>
          <Col span={17}>
            <div style={{ border: '1px solid #eef2f7', borderRadius: 10, padding: '16px 18px', minHeight: 348, background: reportGenerated ? '#fff' : '#fbfcfe' }}>
              {!reportGenerated && !generating && (
                <div className="flex items-center justify-center" style={{ height: 310, color: '#8c8c8c', fontSize: 14 }}>
                  选择处室后点击生成，系统将自动撰写年度综合考评体检报告。
                </div>
              )}
              {generating && (
                <div className="flex items-center justify-center" style={{ height: 310, color: '#1a365d', fontSize: 14 }}>
                  正在汇总年度结果、计算同类平均、识别优势与短板...
                </div>
              )}
              {reportGenerated && (
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1a365d', marginBottom: 8 }}>
                    关于{currentRecord.department}2025年度综合考评体检报告
                  </div>
                  <div style={{ fontSize: 14, color: '#333', lineHeight: '24px' }}>
                    根据2025年度综合考评工作安排，{currentRecord.department}年度总成绩{currentRecord.score}分，
                    {scoreDiff >= 0 ? '高于' : '低于'}同类平均分{averageScore}分{Math.abs(scoreDiff)}分，排名第{currentRecord.rank}位，评价等级为{currentRecord.level}。
                    系统结合党的建设、工作实绩、依法行政、履职测评和加减分情况，形成如下体检结论。
                  </div>
                  <Row gutter={10} style={{ marginTop: 14 }}>
                    {currentRecord.dimensions.map(item => {
                      const avg = getDimensionAverage(item.name)
                      return (
                        <Col span={8} key={item.name} style={{ marginBottom: 10 }}>
                          <div style={{ padding: 10, borderRadius: 8, background: item.score >= avg ? '#f6ffed' : '#fff7e6', border: `1px solid ${item.score >= avg ? '#b7eb8f' : '#ffd591'}` }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                              <span style={{ fontSize: 12, color: '#666' }}>{item.name}</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: item.score >= avg ? '#52c41a' : '#d4a853' }}>{item.score}</span>
                            </div>
                            <Progress percent={Math.min(Math.round((item.score / item.maxScore) * 100), 100)} showInfo={false} size="small" strokeColor={item.score >= avg ? '#52c41a' : '#d4a853'} />
                            <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>同类平均：{avg}</div>
                          </div>
                        </Col>
                      )
                    })}
                  </Row>
                  <Divider style={{ margin: '8px 0 12px' }} />
                  <Row gutter={12}>
                    <Col span={12}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a365d', marginBottom: 6 }}>优势事项</div>
                      <div style={{ fontSize: 13, color: '#555', lineHeight: '22px' }}>
                        {topDimensions.length ? `${topDimensions.join('、')}表现高于同类平均。` : '暂无明显高于同类平均的优势指标。'}
                        {currentRecord.highlights.map(item => ` ${item}。`).join('')}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#8a5a00', marginBottom: 6 }}>关注事项</div>
                      <div style={{ fontSize: 13, color: '#555', lineHeight: '22px' }}>
                        {weakDimensions.length ? `${weakDimensions.join('、')}低于同类平均，需重点改进。` : '各项指标整体保持稳定。'}
                        {currentRecord.improvements.map(item => ` ${item}。`).join('')}
                      </div>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#fdf8ef', border: '1px solid #f2dfb8' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#8a5a00', marginBottom: 6 }}>整改建议</div>
                    <div style={{ fontSize: 13, color: '#555', lineHeight: '22px' }}>
                      建议围绕低于平均的指标建立问题清单，按季度跟踪整改；对扣分事项补充过程佐证材料，对可争取加分事项提前谋划申报。
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        title="🤖 AI报告生成器"
        style={{ borderRadius: 12, marginBottom: 16, borderLeft: '4px solid #1a365d' }}
        styles={{ body: { padding: 20 } }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>报告类型</div>
            <Select style={{ width: '100%' }} value={aiReportType} onChange={setAiReportType} options={reportTypeOptions} />
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>处室范围</div>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={aiSelectedDepts}
              onChange={setAiSelectedDepts}
              options={deptOptions}
              placeholder="选择处室（可多选）"
            />
          </Col>
          <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button type="primary" size="large" onClick={handleGenerateReport} loading={aiGenerating} style={{ width: '100%', background: '#1a365d', height: 40 }}>
              🤖 AI生成报告
            </Button>
          </Col>
        </Row>
      </Card>

      {(aiGenerating || aiDisplayedContent) && (
        <Card
          style={{ borderRadius: 12, marginBottom: 16 }}
          styles={{ body: { padding: 20 } }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d' }}>
              {aiGenerating ? '⏳ AI正在分析数据、撰写报告...' : '📄 报告预览'}
            </div>
            {aiGenerating && <Tag color="processing" icon={<Loader size={12} />}>生成中</Tag>}
            {aiReportDone && <Tag color="success" icon={<CheckCircle size={12} />}>生成完成</Tag>}
          </div>
          <div
            style={{
              background: '#fafbfc',
              border: '1px solid #eef2f7',
              borderRadius: 8,
              padding: '20px 24px',
              fontFamily: '"SF Mono", "Menlo", "Monaco", "Courier New", monospace',
              fontSize: 13,
              lineHeight: '22px',
              color: '#333',
              whiteSpace: 'pre-wrap',
              minHeight: 200,
              maxHeight: 500,
              overflowY: 'auto',
            }}
          >
            {aiGenerating && !aiDisplayedContent ? (
              <div className="flex items-center justify-center" style={{ height: 160, color: '#1a365d', fontSize: 14 }}>
                正在汇总年度结果、计算同类平均、识别优势与短板...
              </div>
            ) : (
              <>{aiDisplayedContent}<span style={{ animation: 'blink 1s infinite', color: '#1a365d' }}>▌</span></>
            )}
          </div>
          {aiReportDone && (
            <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  const blob = new Blob([aiReportContent], { type: 'application/msword' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${reportTypeOptions.find(o => o.value === aiReportType)?.label || '报告'}.doc`
                  a.click()
                  URL.revokeObjectURL(url)
                  message.success('Word文件已导出')
                }}
                style={{ borderRadius: 8 }}
              >
                📥 导出Word
              </Button>
              <Button
                type="primary"
                onClick={() => message.success('Excel文件已导出')}
                style={{ borderRadius: 8, background: '#1a365d' }}
              >
                📊 导出Excel
              </Button>
            </div>
          )}
        </Card>
      )}

      <div style={{ display: 'flex', gap: 20, minHeight: 'calc(100vh - 260px)' }}>
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>报告模板</div>
          <div className="space-y-3">
            {reportTemplates.map(tpl => (
              <Card
                key={tpl.id}
                style={{
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: selectedTemplate === tpl.id ? '2px solid #1a365d' : '1px solid #f0f0f0',
                  transition: 'border-color 0.2s',
                }}
                styles={{ body: { padding: '14px 20px' } }}
                onClick={() => setSelectedTemplate(tpl.id)}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} color="#1a365d" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a365d' }}>{tpl.name}</span>
                    <Tag color={statusMap[tpl.status].color} icon={statusMap[tpl.status].icon}>
                      {statusMap[tpl.status].label}
                    </Tag>
                  </div>
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>{tpl.sections.length} 个章节</span>
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{tpl.description}</div>
                {tpl.status !== 'pending' && (
                  <Progress
                    percent={tpl.progress}
                    size="small"
                    strokeColor={tpl.status === 'completed' ? '#52c41a' : '#1890ff'}
                  />
                )}
              </Card>
            ))}
          </div>

          {currentTemplate && (
            <Card
              style={{ borderRadius: 12, flex: 1 }}
              styles={{ body: { padding: '16px 24px', display: 'flex', flexDirection: 'column', height: '100%' } }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d' }}>{currentTemplate.name} - 章节预览</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{currentTemplate.description}</div>
                </div>
                <Button
                  type="primary"
                  loading={generating}
                  onClick={handleGenerate}
                  style={{ borderRadius: 8, background: '#1a365d' }}
                >
                  {generating ? '正在生成...' : '生成报告'}
                </Button>
              </div>
              <div className="space-y-2" style={{ flex: 1 }}>
                {currentTemplate.sections.map((section, i) => {
                  const done = sectionStatusMap[section] ?? false
                  return (
                    <div
                      key={section}
                      className="flex items-center justify-between"
                      style={{
                        padding: '10px 16px',
                        background: done ? '#f6ffed' : '#fafafa',
                        borderRadius: 8,
                        border: done ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, color: '#8c8c8c', width: 20 }}>{i + 1}.</span>
                        <span style={{ fontSize: 14, color: done ? '#1a365d' : '#8c8c8c', fontWeight: done ? 500 : 400 }}>
                          {section}
                        </span>
                      </div>
                      {done ? (
                        <Tag color="success" icon={<CheckCircle size={12} />} style={{ margin: 0 }}>已完成</Tag>
                      ) : generating ? (
                        <Tag color="processing" icon={<Loader size={12} />} style={{ margin: 0 }}>生成中</Tag>
                      ) : (
                        <Tag style={{ margin: 0 }}>待生成</Tag>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>

        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>AI生成助手</div>
          <Card
            style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
          >
            <div
              ref={chatListRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className="flex gap-2"
                  style={{ flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
                >
                  {msg.role === 'ai' && (
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, #1a365d 0%, #2a5298 100%)',
                      }}
                    >
                      <Bot size={16} color="#fff" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: msg.role === 'user' ? '#1a365d' : '#f5f7fa',
                      color: msg.role === 'user' ? '#fff' : '#333',
                      fontSize: 13,
                      lineHeight: '20px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onPressEnter={handleSend}
                placeholder='输入问题，如"年度绩效报告"'
                style={{ borderRadius: 8 }}
              />
              <Button
                type="primary"
                onClick={handleSend}
                style={{ borderRadius: 8, background: '#1a365d', flexShrink: 0 }}
                icon={<Send size={14} />}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
