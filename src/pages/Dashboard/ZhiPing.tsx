import { useState, useRef, useEffect } from 'react'
import { Card, Table, Tag, Progress, Row, Col, Typography, Space, Badge, Button, Select, Input, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { Award, Star, TrendingUp, AlertTriangle, CheckCircle, BarChart3, UserCheck } from 'lucide-react'
import { performanceData, departmentRankHistory } from '@/mock/performanceData'
import { departmentData } from '@/mock/departmentData'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 12,
}

const levelColorMap: Record<string, string> = { A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#ef4444' }
const levelTagColor: Record<string, string> = { A: 'success', B: 'processing', C: 'warning', D: 'error' }

const deptCategoryMap: Record<string, { label: string; color: string }> = {
  '市京津冀协同办': { label: '业务管理类', color: 'blue' },
  '高技术处': { label: '业务管理类', color: 'blue' },
  '开放处': { label: '业务管理类', color: 'blue' },
  '营商政策处': { label: '业务管理类', color: 'blue' },
  '资环处': { label: '业务管理类', color: 'blue' },
  '投资处': { label: '业务管理类', color: 'blue' },
  '市疏整促专项办': { label: '业务管理类', color: 'blue' },
  '价格处': { label: '业务管理类', color: 'blue' },
}

const statusMap: Record<string, { color: string; label: string }> = {
  completed: { color: 'success', label: '已评分' },
  in_progress: { color: 'processing', label: '评分中' },
  pending: { color: 'default', label: '待评分' },
}

const deptStatusList = performanceData.map((p, i) => ({
  ...p,
  status: i < 5 ? 'completed' : i < 6 ? 'in_progress' : 'pending',
}))

const highlights = [
  { dept: '市京津冀协同办', text: '党建得分96，高效履职42分，综合排名第一', icon: <TrendingUp size={14} color="#22c55e" /> },
  { dept: '高技术处', text: '创新平台建设超额完成，加减分项获3分加分', icon: <Star size={14} color="#f59e0b" /> },
  { dept: '开放处', text: '对外开放政策落地顺利，依法行政满分9分', icon: <CheckCircle size={14} color="#3b82f6" /> },
  { dept: '营商政策处', text: '营商环境优化措施获好评，高效履职37分', icon: <BarChart3 size={14} color="#8b5cf6" /> },
]

const risks = [
  { dept: '投资处', text: '高效履职得分偏低(32/45)，建议加强重点任务推进力度', level: 'high' },
  { dept: '价格处', text: '依法行政扣分较多，建议加强规范性文件合法性审核', level: 'high' },
  { dept: '市疏整促专项办', text: '党建得分低于90(80分)，总成绩受系数影响较大', level: 'medium' },
  { dept: '资环处', text: '加减分项被扣1分，需关注减分事项整改', level: 'low' },
]

const excellenceCandidates = [
  { name: '市京津冀协同办', dept: '业务管理类', score: 92, reason: '党建得分96，高效履职42分，综合排名第一' },
  { name: '高技术处', dept: '业务管理类', score: 90, reason: '创新平台建设超额完成，加减分项获3分加分' },
  { name: '开放处', dept: '业务管理类', score: 88, reason: '对外开放政策落地顺利，依法行政得分8/10' },
]

const evaluatorDepts = [
  { value: '资环处', label: '资环处' },
  { value: '投资处', label: '投资处' },
  { value: '营商政策处', label: '营商政策处' },
  { value: '价格处', label: '价格处' },
]

const deptIndicators: Record<string, { name: string; target: string; unit: string }[]> = {
  '资环处': [
    { name: '双碳政策文件出台', target: '3项', unit: '项' },
    { name: '节能降碳改造项目', target: '20个', unit: '个' },
    { name: '单位GDP能耗下降', target: '3%', unit: '%' },
    { name: '能源双控目标完成', target: '达标', unit: '' },
  ],
  '投资处': [
    { name: '城市更新年度计划', target: '按期完成', unit: '' },
    { name: '老旧小区改造开工', target: '100个', unit: '个' },
    { name: '危旧楼房改建', target: '20万㎡', unit: '万㎡' },
    { name: '固定资产投资增速', target: '5%', unit: '%' },
  ],
  '营商政策处': [
    { name: '营商环境6.0方案', target: '按期印发', unit: '' },
    { name: '"一业一证"扩面', target: '20个行业', unit: '个行业' },
    { name: '企业办事时限压缩', target: '30%', unit: '%' },
    { name: '企业满意度', target: '85分', unit: '分' },
  ],
  '价格处': [
    { name: '价格监测预警体系', target: '建成运行', unit: '' },
    { name: '重要商品价格监测覆盖率', target: '95%', unit: '%' },
    { name: '价格联动机制启动', target: '及时启动', unit: '' },
    { name: '价格举报处理率', target: '100%', unit: '%' },
  ],
}

const defaultIndicatorValues: Record<string, Record<string, string>> = {
  '资环处': { '双碳政策文件出台': '1项', '节能降碳改造项目': '8个', '单位GDP能耗下降': '1.5%', '能源双控目标完成': '未达标' },
  '投资处': { '城市更新年度计划': '延迟2个月', '老旧小区改造开工': '65个', '危旧楼房改建': '12万㎡', '固定资产投资增速': '3.2%' },
  '营商政策处': { '营商环境6.0方案': '已印发', '"一业一证"扩面': '14个行业', '企业办事时限压缩': '22%', '企业满意度': '78分' },
  '价格处': { '价格监测预警体系': '部分建成', '重要商品价格监测覆盖率': '88%', '价格联动机制启动': '延迟启动', '价格举报处理率': '96%' },
}

const judgmentResults: Record<string, string> = {
  '资环处': `📊 资环处 · 2025年度考核研判报告

━━━ 高效履职（45分）━━━

📌 双碳政策文件出台
  目标：3项 ｜ 实际：1项 ｜ 完成率：33%
  ❌ 未达标 → 扣3分（差2项未完成）
  💡 建议：加快剩余2项配套文件起草，争取Q3完成

📌 节能降碳改造项目
  目标：20个 ｜ 实际：8个 ｜ 完成率：40%
  ❌ 未达标 → 扣5分（严重滞后）
  💡 建议：工业领域改造项目需重点推进，建议增加资金保障

📌 单位GDP能耗下降
  目标：3% ｜ 实际：1.5% ｜ 完成率：50%
  ⚠️ 部分达标 → 扣2分（差距1.5个百分点）
  💡 建议：加强重点用能单位监管，推动节能技术改造

📌 能源双控目标完成
  目标：达标 ｜ 实际：未达标
  ❌ 未达标 → 扣3分

━━━ 扣分汇总 ━━━
高效履职：原45分 → 预计31分（扣14分）
依法行政：预计8/10分（扣2分，规范性文件审核滞后）
履职测评：预计11/15分

━━━ 综合研判 ━━━
预计总成绩：(31+8+11+0-1) × (86÷90) = 49 × 0.956 = 46.8分
等级预判：D级（低于60分）
⚠️ 风险提示：资环处当前为红灯状态，如不加速推进，年度考评可能降至D级

🎯 改进建议：
1. 优先推进双碳政策文件出台（Q3前完成2项）
2. 协调财政增加节能改造资金保障
3. 加强与能源处协同推进双控目标`,

  '投资处': `📊 投资处 · 2025年度考核研判报告

━━━ 高效履职（45分）━━━

📌 城市更新年度计划
  目标：按期完成 ｜ 实际：延迟2个月
  ❌ 未达标 → 扣4分（进度严重滞后）
  💡 建议：建立月度督办机制，确保Q3前补回进度

📌 老旧小区改造开工
  目标：100个 ｜ 实际：65个 ｜ 完成率：65%
  ⚠️ 部分达标 → 扣3分（差35个未开工）
  💡 建议：加快项目审批流程，协调各区优先保障开工

📌 危旧楼房改建
  目标：20万㎡ ｜ 实际：12万㎡ ｜ 完成率：60%
  ⚠️ 部分达标 → 扣3分（差距8万㎡）
  💡 建议：推动存量危旧楼房纳入改建计划，增加施工力量

📌 固定资产投资增速
  目标：5% ｜ 实际：3.2% ｜ 完成率：64%
  ⚠️ 部分达标 → 扣2分（差距1.8个百分点）
  💡 建议：加大重大项目储备和落地力度，引导社会资本参与

━━━ 扣分汇总 ━━━
高效履职：原45分 → 预计33分（扣12分）
依法行政：预计9/10分
履职测评：预计12/15分

━━━ 综合研判 ━━━
预计总成绩：(33+9+12+0-0) × (88÷90) = 54 × 0.978 = 52.8分
等级预判：C级（50-60分区间）
⚠️ 风险提示：投资处城市更新任务滞后明显，需重点关注项目开工率

🎯 改进建议：
1. 建立城市更新项目月度调度机制
2. 加快老旧小区改造审批和资金拨付
3. 协调住建部门增加危旧楼房改建施工力量
4. 加大招商引资力度，提升固定资产投资增速`,

  '营商政策处': `📊 营商政策处 · 2025年度考核研判报告

━━━ 高效履职（45分）━━━

📌 营商环境6.0方案
  目标：按期印发 ｜ 实际：已印发
  ✅ 达标 → 不扣分
  💡 亮点：方案按时印发，获市领导批示肯定

📌 "一业一证"扩面
  目标：20个行业 ｜ 实际：14个行业 ｜ 完成率：70%
  ⚠️ 部分达标 → 扣2分（差6个行业未覆盖）
  💡 建议：加快剩余行业调研论证，争取Q3完成扩面

📌 企业办事时限压缩
  目标：30% ｜ 实际：22% ｜ 完成率：73%
  ⚠️ 部分达标 → 扣2分（差距8个百分点）
  💡 建议：推进"一网通办"深度应用，压缩审批环节

📌 企业满意度
  目标：85分 ｜ 实际：78分 ｜ 完成率：92%
  ⚠️ 接近达标 → 扣1分（差7分）
  💡 建议：聚焦企业痛点优化服务流程，提升办事体验

━━━ 扣分汇总 ━━━
高效履职：原45分 → 预计38分（扣7分）
依法行政：预计9/10分
履职测评：预计13/15分

━━━ 综合研判 ━━━
预计总成绩：(38+9+13+1-0) × (91÷90) = 61 × 1.011 = 61.7分
等级预判：B级（60-75分区间）
✅ 整体态势：营商政策处总体进展平稳，6.0方案按期印发是重要加分项

🎯 改进建议：
1. 加快"一业一证"剩余6个行业扩面落地
2. 深化"一网通办"改革，压缩企业办事时限
3. 开展企业满意度专项提升行动，力争达到85分目标`,

  '价格处': `📊 价格处 · 2025年度考核研判报告

━━━ 高效履职（45分）━━━

📌 价格监测预警体系
  目标：建成运行 ｜ 实际：部分建成
  ❌ 未达标 → 扣3分（体系未全面运行）
  💡 建议：加快数据对接和系统调试，确保Q3全面运行

📌 重要商品价格监测覆盖率
  目标：95% ｜ 实际：88% ｜ 完成率：93%
  ⚠️ 接近达标 → 扣1分（差7个百分点）
  💡 建议：扩大监测品种范围，补充新兴商品监测点

📌 价格联动机制启动
  目标：及时启动 ｜ 实际：延迟启动
  ❌ 未达标 → 扣3分（联动机制响应不及时）
  💡 建议：完善价格预警阈值设置，建立自动触发机制

📌 价格举报处理率
  目标：100% ｜ 实际：96% ｜ 完成率：96%
  ⚠️ 接近达标 → 扣1分（4%举报未处理）
  💡 建议：增派处理力量，确保所有举报在规定时限内办结

━━━ 扣分汇总 ━━━
高效履职：原45分 → 预计37分（扣8分）
依法行政：预计7/10分（扣3分，价格规范性文件审核滞后）
履职测评：预计11/15分

━━━ 综合研判 ━━━
预计总成绩：(37+7+11+0-1) × (84÷90) = 54 × 0.933 = 50.4分
等级预判：C级（50-60分区间）
⚠️ 风险提示：价格处依法行政扣分较多，价格联动机制响应不及时可能引发舆情风险

🎯 改进建议：
1. 加快价格监测预警体系全面运行，确保数据实时对接
2. 建立价格联动自动触发机制，杜绝延迟启动
3. 加强规范性文件合法性审核，减少依法行政扣分
4. 增加举报处理力量，确保100%处理率`,
}

export default function ZhiPing() {
  const [selectedDept, setSelectedDept] = useState(performanceData[0])
  const [evaluatorOpen, setEvaluatorOpen] = useState(false)
  const [evaluatorDept, setEvaluatorDept] = useState<string | undefined>(undefined)
  const [indicatorValues, setIndicatorValues] = useState<Record<string, string>>({})
  const [judging, setJudging] = useState(false)
  const [judgmentResult, setJudgmentResult] = useState<string>('')
  const [displayedResult, setDisplayedResult] = useState<string>('')
  const [judgmentDone, setJudgmentDone] = useState(false)
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current)
    }
  }, [])

  const handleEvaluatorDeptChange = (dept: string) => {
    setEvaluatorDept(dept)
    setIndicatorValues(defaultIndicatorValues[dept] || {})
    setJudgmentResult('')
    setDisplayedResult('')
    setJudgmentDone(false)
  }

  const handleJudge = () => {
    if (!evaluatorDept) return
    setJudging(true)
    setJudgmentResult('')
    setDisplayedResult('')
    setJudgmentDone(false)
    const result = judgmentResults[evaluatorDept] || ''
    setTimeout(() => {
      setJudging(false)
      setJudgmentResult(result)
      let idx = 0
      const type = () => {
        if (idx <= result.length) {
          setDisplayedResult(result.slice(0, idx))
          idx += 2
          typewriterRef.current = setTimeout(type, 15)
        } else {
          setJudgmentDone(true)
        }
      }
      type()
    }, 2000)
  }

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: selectedDept.dimensions.map(d => ({ name: d.name, max: d.maxScore })),
      shape: 'polygon' as const,
      splitNumber: 4,
      axisName: { color: '#8c8c8c', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
      splitArea: { areaStyle: { color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: selectedDept.dimensions.map(d => d.score),
        name: selectedDept.department,
        areaStyle: { color: 'rgba(59,130,246,0.2)' },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
      }],
    }],
  }

  const columns = [
    {
      title: '处室',
      dataIndex: 'department',
      key: 'department',
      render: (t: string, r: typeof deptStatusList[0]) => {
        const cat = deptCategoryMap[t]
        return (
          <Space size={4}>
            <Button type="text" size="small" style={{ color: '#1a365d', fontWeight: 600, padding: 0 }} onClick={() => setSelectedDept(r)}>{t}</Button>
            {cat && <Tag color={cat.color} style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0 }}>{cat.label}</Tag>}
          </Space>
        )
      },
    },
    {
      title: '总分',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: typeof deptStatusList[0], b: typeof deptStatusList[0]) => a.score - b.score,
      render: (t: number) => <Text style={{ color: '#1a365d', fontWeight: 700, fontSize: 16 }}>{t}</Text>,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (t: string) => <Tag color={levelTagColor[t]} style={{ fontWeight: 600 }}>{t}级</Tag>,
    },
    {
      title: '维度评分',
      key: 'dimensions',
      width: 280,
      render: (_: unknown, r: typeof deptStatusList[0]) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          {r.dimensions.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#8c8c8c', fontSize: 11, width: 48, flexShrink: 0 }}>{d.name}</Text>
              <Progress
                percent={Math.round((d.score / d.maxScore) * 100)}
                strokeColor={d.score / d.maxScore >= 0.9 ? '#22c55e' : d.score / d.maxScore >= 0.8 ? '#3b82f6' : '#f59e0b'}
                trailColor="#f0f0f0"
                size="small"
                style={{ flex: 1 }}
              />
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (t: string) => {
        const s = statusMap[t]
        return <Tag color={s.color}>{s.label}</Tag>
      },
    },
  ]

  const avgScore = (performanceData.reduce((s, d) => s + d.score, 0) / performanceData.length).toFixed(1)
  const aLevelCount = performanceData.filter(d => d.level === 'A').length

  return (
    <div style={{ minHeight: 'auto', background: 'transparent', padding: 24, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ color: '#1a365d', margin: 0 }}>
            <Award size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
            智评助手 · 综合考评工作台
          </Title>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 6, display: 'block' }}>
            2025年度综合考评进行中，48个处室单位参评，已完成
            <Text style={{ color: '#3b82f6', fontWeight: 600 }}>29/48</Text>处室评分
          </Text>
        </div>
        <Space>
          <Badge count={3}><Button type="text" style={{ color: '#8c8c8c' }} icon={<AlertTriangle size={18} />} /></Badge>
          <Badge count={5}><Button type="text" style={{ color: '#8c8c8c' }} icon={<CheckCircle size={18} />} /></Badge>
        </Space>
      </div>

      <div style={{ background: '#f0f4f8', padding: 12, borderRadius: 8, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#1a365d', fontWeight: 600 }}>📊 数据来源</span>
        <span style={{ fontSize: 12, color: '#666' }}>指标体系 ← 指标生成环节</span>
        <span style={{ fontSize: 12, color: '#999' }}>→</span>
        <span style={{ fontSize: 12, color: '#666' }}>过程数据 ← 过程跟踪/智巡核验</span>
        <span style={{ fontSize: 12, color: '#999' }}>→</span>
        <span style={{ fontSize: 12, color: '#666' }}>处室自评 ← 处室提交</span>
        <span style={{ fontSize: 12, color: '#999' }}>→</span>
        <span style={{ fontSize: 12, color: '#1a365d', fontWeight: 600 }}>智评汇总</span>
      </div>

      <Card
        title={<span style={{ fontSize: 15, fontWeight: 600 }}>🤖 AI考核研判器</span>}
        extra={<Button type="link" onClick={() => setEvaluatorOpen(!evaluatorOpen)}>{evaluatorOpen ? '收起' : '展开'}</Button>}
        style={{ borderRadius: 12, marginBottom: 16 }}
        styles={{ body: { padding: evaluatorOpen ? 20 : 0, display: evaluatorOpen ? 'block' : 'none' } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text style={{ color: '#1a365d', fontWeight: 600, marginRight: 12 }}>选择处室</Text>
          <Select
            placeholder="请选择需要研判的处室"
            style={{ width: 240 }}
            options={evaluatorDepts}
            value={evaluatorDept}
            onChange={handleEvaluatorDeptChange}
          />
        </div>

        {evaluatorDept && deptIndicators[evaluatorDept] && (
          <div style={{ marginBottom: 16 }}>
            <Text style={{ color: '#1a365d', fontWeight: 600, display: 'block', marginBottom: 12 }}>
              📋 {evaluatorDept} · 考评指标进展录入
            </Text>
            <Row gutter={[16, 12]}>
              {deptIndicators[evaluatorDept].map((ind) => (
                <Col span={12} key={ind.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: '#666', fontSize: 13, width: 160, flexShrink: 0, textAlign: 'right' }}>
                      {ind.name}
                      <Text style={{ color: '#999', fontSize: 11, marginLeft: 4 }}>(目标: {ind.target})</Text>
                    </Text>
                    <Input
                      size="small"
                      placeholder={`请输入${ind.name}实际进展`}
                      value={indicatorValues[ind.name] || ''}
                      onChange={(e) => setIndicatorValues({ ...indicatorValues, [ind.name]: e.target.value })}
                      style={{ flex: 1 }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Button
                type="primary"
                loading={judging}
                onClick={handleJudge}
                style={{ borderRadius: 8, fontWeight: 600, paddingInline: 32 }}
              >
                {judging ? 'AI研判中...' : '🤖 AI自动研判'}
              </Button>
            </div>
          </div>
        )}

        {(judging || displayedResult) && (
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
            borderRadius: 10,
            padding: 20,
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {judging && !displayedResult && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
                <Text style={{ color: '#3b82f6', fontWeight: 600, fontSize: 15 }}>
                  AI正在分析考核数据，生成研判报告...
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text style={{ color: '#999', fontSize: 12 }}>正在比对指标完成情况 · 计算扣分项 · 生成改进建议</Text>
                </div>
              </div>
            )}
            {displayedResult && (
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
                fontSize: 13,
                lineHeight: 1.8,
                color: '#1a365d',
                margin: 0,
              }}>
                {displayedResult}
                {!judgmentDone && <span style={{ animation: 'blink 1s infinite' }}>▌</span>}
              </pre>
            )}
            {judgmentDone && (
              <div style={{ marginTop: 16, textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                <Text style={{ color: '#999', fontSize: 12 }}>— 研判报告生成完毕 —</Text>
              </div>
            )}
          </div>
        )}
      </Card>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: '参评处室', value: 48, suffix: '个', color: '#3b82f6', icon: <BarChart3 size={20} color="#3b82f6" /> },
          { label: '已完成', value: 29, suffix: '个', color: '#22c55e', icon: <CheckCircle size={20} color="#22c55e" /> },
          { label: 'A级处室', value: aLevelCount, suffix: '个', color: '#f59e0b', icon: <Star size={20} color="#f59e0b" /> },
          { label: '平均得分', value: avgScore, suffix: '分', color: '#8b5cf6', icon: <TrendingUp size={20} color="#8b5cf6" /> },
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

      <Card style={{ ...glassCard, marginBottom: 20 }} styles={{ body: { padding: '12px 20px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#1a365d', fontWeight: 600 }}>📐 考评成绩计算公式</span>
          <span style={{ fontSize: 13, color: '#333', fontFamily: 'monospace' }}>
            年度考评成绩 = (工作实绩得分 + 履职测评得分 + 加分项得分 - 减分得分) × (党的建设得分 ÷ 90)
          </span>
          <Tag color="blue" style={{ marginLeft: 'auto' }}>党建系数调节</Tag>
        </div>
      </Card>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={<Space><BarChart3 size={16} color="#3b82f6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>智能评分面板</Text><Tag color="blue">点击处室查看画像</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: 0 } }}
          >
            <Table
              dataSource={deptStatusList}
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
        <Col span={10}>
          <Card
            title={<Space><UserCheck size={16} color="#8b5cf6" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>{selectedDept.department} · 处室画像</Text></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 16px 16px' } }}
          >
            <ReactECharts option={radarOption} style={{ height: 280 }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              {selectedDept.dimensions.map(d => (
                <div key={d.name} style={{ textAlign: 'center' }}>
                  <Text style={{ color: levelColorMap[selectedDept.level], fontWeight: 700, fontSize: 16 }}>{d.score}</Text>
                  <div><Text style={{ color: '#8c8c8c', fontSize: 11 }}>{d.name}</Text></div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={14}>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title={<Space><Star size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>亮点识别</Text></Space>}
                style={glassCard}
                styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 12px' } }}
              >
                {highlights.map((h, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {h.icon}
                      <Text style={{ color: '#22c55e', fontWeight: 600, fontSize: 13 }}>{h.dept}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6 }}>{h.text}</Text>
                  </div>
                ))}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={<Space><AlertTriangle size={16} color="#ef4444" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>风险预警</Text></Space>}
                style={glassCard}
                styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '8px 12px' } }}
              >
                {risks.map((r, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, marginBottom: 6, borderLeft: `3px solid ${r.level === 'high' ? '#ef4444' : r.level === 'medium' ? '#f59e0b' : '#3b82f6'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Tag color={r.level === 'high' ? 'red' : r.level === 'medium' ? 'orange' : 'blue'} style={{ margin: 0, fontSize: 11 }}>{r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低'}</Tag>
                      <Text style={{ color: '#1a365d', fontWeight: 600, fontSize: 13 }}>{r.dept}</Text>
                    </div>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6 }}>{r.text}</Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<Space><Award size={16} color="#f59e0b" /><Text style={{ color: '#1a365d', fontWeight: 600 }}>卓越推荐</Text><Tag color="gold">AI智能推荐</Tag></Space>}
            style={glassCard}
            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '12px 16px' } }}
          >
            <Row gutter={16}>
              {excellenceCandidates.map((c, i) => (
                <Col span={8} key={i}>
                  <div style={{ padding: 16, background: 'rgba(245,158,11,0.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.12)', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                      <Award size={22} color="#f59e0b" />
                    </div>
                    <Text style={{ color: '#1a365d', fontWeight: 700, fontSize: 16, display: 'block' }}>{c.name}</Text>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, display: 'block', marginBottom: 4 }}>{c.dept}</Text>
                    <Tag color="gold" style={{ marginBottom: 8 }}>{c.score}分</Tag>
                    <Text style={{ color: '#8c8c8c', fontSize: 12, lineHeight: 1.6, display: 'block' }}>{c.reason}</Text>
                    <Button size="small" type="primary" style={{ borderRadius: 6, marginTop: 10 }} icon={<Star size={12} style={{ verticalAlign: -1 }} />} onClick={() => message.success('已生成本年度评优推荐名单')}>推荐评优</Button>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-table { background: transparent !important; }
        .ant-table-thead > tr > th { background: #fafafa !important; color: #8c8c8c !important; border-bottom: 1px solid #f0f0f0 !important; }
        .ant-table-tbody > tr > td { border-bottom: 1px solid #f0f0f0 !important; color: #333 !important; background: transparent !important; }
        .ant-table-tbody > tr:hover > td { background: rgba(0,0,0,0.02) !important; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
