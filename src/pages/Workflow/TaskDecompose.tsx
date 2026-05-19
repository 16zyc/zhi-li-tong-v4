import { useState, useRef, useEffect } from 'react'
import {
  Card, Button, Tag, Table, Input, Spin, Statistic, Row, Col,
  Modal, Dropdown, Tooltip, Badge, Tabs, message,
} from 'antd'
import type { MenuProps } from 'antd'
import {
  Send, FileText, CheckCircle, Bot, Plus, X, Table2,
  Lock, AlertTriangle, Sparkles, Download, BookOpen,
} from 'lucide-react'

interface DecomposedTask {
  id: number
  task: string
  source: string
  objective: string
  systemDept: string
  actualDept: string
  deptSource: 'system' | 'historical' | 'manual'
  status: 'decomposed' | 'cross_dept' | 'pending_confirm' | 'duplicate' | 'similar'
  duplicateInfo?: string
  sourceFile: string
}

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

interface DuplicateDetail {
  id: number
  type: 'duplicate' | 'similar'
  existingTask: string
}

const duplicateResults = {
  duplicate: 2,
  similar: 3,
  newTasks: 5,
  details: [
    { id: 1, type: 'duplicate' as const, existingTask: 'T-001 编制京津冀协同发展年度工作要点' },
    { id: 3, type: 'similar' as const, existingTask: 'T-015 非首都功能疏解协调保障' },
    { id: 8, type: 'similar' as const, existingTask: 'T-001 编制京津冀协同发展年度工作要点' },
    { id: 9, type: 'duplicate' as const, existingTask: 'T-013 推动中关村先行先试改革落地' },
    { id: 10, type: 'similar' as const, existingTask: 'T-014 城市更新年度计划制定' },
  ],
}

const decomposedTasks: DecomposedTask[] = [
  {
    id: 1, task: '配合编制京津冀国土空间规划，会同天津、河北编制现代化首都都市圈空间协同规划',
    source: '市政府工作报告重点任务清单第2项',
    objective: '1.配合市规划自然资源委提出本市关于京津冀国土空间规划有关意见\n2.发挥京津冀联合办工作机制作用，配合编制现代化首都都市圈空间协同规划',
    systemDept: '协同政策处', actualDept: '协同政策处', deptSource: 'system',
    status: 'duplicate', duplicateInfo: '与已有任务"T-001 编制京津冀协同发展年度工作要点"重复',
    sourceFile: '政府工作报告',
  },
  {
    id: 2, task: '积极融入、主动服务共建"一带一路"，出台落实"八项行动"的具体措施',
    source: '市政府工作报告重点任务清单第9项',
    objective: '1.一季度研究出台北京市积极融入共建"一带一路"高质量发展实施方案\n2.搭建"一带一路"综合服务平台，建立企业服务机制',
    systemDept: '开放处', actualDept: '开放处/空铁处', deptSource: 'historical',
    status: 'cross_dept', sourceFile: '政府工作报告',
  },
  {
    id: 3, task: '支持、协调和保障中央标志性项目落地，完成第二批市属行政事业单位搬迁',
    source: '市政府工作报告重点任务清单第13项',
    objective: '1.加强与国家发改委沟通衔接\n2.协调市国资委、市教委、市卫健委等部门，主动对接搬迁单位',
    systemDept: '协同疏解处', actualDept: '协同疏解处', deptSource: 'system',
    status: 'similar', duplicateInfo: '与已有任务"T-015 非首都功能疏解协调保障"相似',
    sourceFile: '政府工作报告',
  },
  {
    id: 4, task: '加快重点产业集聚区建设，推动数字经济标杆城市建设',
    source: '市政府工作报告重点任务清单第18项',
    objective: '1.制定数字经济标杆城市建设年度工作要点\n2.推进重点产业集聚区基础设施建设和项目落地',
    systemDept: '社会处', actualDept: '审批处', deptSource: 'historical',
    status: 'decomposed', sourceFile: '营商环境行动计划',
  },
  {
    id: 5, task: '深化营商环境改革，落实新一轮改革任务',
    source: '市政府工作报告重点任务清单第25项',
    objective: '1.制定营商环境6.0版改革实施方案\n2.推进审批制度改革，提升政务服务效能',
    systemDept: '营商改革处', actualDept: '营商改革处', deptSource: 'system',
    status: 'decomposed', sourceFile: '营商环境行动计划',
  },
  {
    id: 6, task: '推进碳达峰碳中和，完善双碳"1+N"政策体系',
    source: '市政府工作报告重点任务清单第31项',
    objective: '1.出台碳达峰实施方案配套文件\n2.推进重点领域节能降碳改造',
    systemDept: '资环处', actualDept: '资环处', deptSource: 'historical',
    status: 'decomposed', sourceFile: '政府工作报告',
  },
  {
    id: 7, task: '加强重要民生商品保供稳价，做好价格监测预警',
    source: '市政府工作报告重点任务清单第42项',
    objective: '1.完善价格监测预警体系\n2.落实社会救助和保障标准与物价上涨挂钩联动机制',
    systemDept: '价格处', actualDept: '价格处', deptSource: 'system',
    status: 'pending_confirm', sourceFile: '民生实事任务',
  },
  {
    id: 8, task: '推动京津冀协同发展，支持雄安新区建设',
    source: '市政府工作报告重点任务清单第3项',
    objective: '1.制定年度京津冀协同发展工作要点\n2.推进雄安新区"三校一院"交钥匙项目后续工作',
    systemDept: '协同政策处', actualDept: '协同政策处', deptSource: 'system',
    status: 'similar', duplicateInfo: '与已有任务"T-001 编制京津冀协同发展年度工作要点"相似',
    sourceFile: '政府工作报告',
  },
  {
    id: 9, task: '加快国际科技创新中心建设，推动中关村先行先试改革',
    source: '市政府工作报告重点任务清单第15项',
    objective: '1.推动中关村24条先行先试改革措施落地\n2.支持新型研发机构建设',
    systemDept: '高技术处', actualDept: '高技术处/科创中心', deptSource: 'historical',
    status: 'duplicate', duplicateInfo: '与已有任务"T-013 推动中关村先行先试改革落地"重复',
    sourceFile: '政府工作报告',
  },
  {
    id: 10, task: '推进城市更新行动，加快老旧小区改造',
    source: '市政府工作报告重点任务清单第50项',
    objective: '1.制定城市更新年度计划\n2.推进老旧小区改造新开工项目',
    systemDept: '投资处', actualDept: '投资处', deptSource: 'system',
    status: 'similar', duplicateInfo: '与已有任务"T-014 城市更新年度计划制定"相似',
    sourceFile: '民生实事任务',
  },
]

const statusMap: Record<string, { color: string; label: string }> = {
  decomposed: { color: 'green', label: '已分解' },
  cross_dept: { color: 'blue', label: '跨处室' },
  pending_confirm: { color: 'orange', label: '待确认' },
  duplicate: { color: 'red', label: '重复' },
  similar: { color: 'cyan', label: '相似' },
}

const baseKnowledgeList = [
  { key: 'evaluation', title: '市发展改革委2025年度综合考评实施方案', desc: '包含考评对象、指标、方式' },
  { key: 'departments', title: '全委各处室职责目录', desc: '各处室名称及职责描述' },
  { key: 'history', title: '往年任务分配记录', desc: '用于查重和优先级判断' },
]

interface TaskFile {
  key: string
  title: string
  count: number
}

const availableFiles: TaskFile[] = [
  { key: 'report', title: '2024年市政府工作报告重点任务清单', count: 88 },
  { key: 'business', title: '营商环境优化提升行动计划', count: 32 },
  { key: 'livelihood', title: '民生实事任务分工方案', count: 45 },
  { key: 'culture', title: '全国文化中心建设工作要点及分工', count: 28 },
]

const aiSuggestedGoals = [
  { id: 1, goal: '数字经济发展监测体系建设', dept: '高技术处', reason: '数字经济标杆城市需配套监测机制' },
  { id: 2, goal: '营商环境数字化评估平台搭建', dept: '营商改革处', reason: '6.0版改革需量化评估支撑' },
  { id: 3, goal: '京津冀产业协同发展跟踪评估', dept: '协同政策处', reason: '协同发展需建立跟踪评估闭环' },
]

const deptTaskMap: Record<string, { dept: string; tasks: DecomposedTask[] }> = {}
decomposedTasks.forEach(t => {
  const depts = t.actualDept.split('/')
  depts.forEach(d => {
    const trimmed = d.trim()
    if (!deptTaskMap[trimmed]) {
      deptTaskMap[trimmed] = { dept: trimmed, tasks: [] }
    }
    deptTaskMap[trimmed].tasks.push(t)
  })
})

const mockReplies: Record<string, string> = {
  分解: '任务分解已基于市政府工作报告重点任务清单、发改委综合考评实施方案、各处室职责目录及往年任务分配记录四份材料完成。共生成10条分解结果，涉及8个处室。查重发现2条完全重复、3条相似任务。系统建议处室与往年分配有1处不一致（第4条：系统建议社会处，往年分配审批处），已采用往年优先原则。',
  查重: '查重结果：与已有任务完全重复2条（#1京津冀国土空间规划、#9中关村先行先试改革），相似3条（#3中央标志性项目、#8京津冀协同发展、#10城市更新行动），全新5条。建议对重复任务进行合并处理，相似任务需确认是否需要独立保留。',
  跨处室: '当前有2条跨处室协作任务：\n1. 开放处/空铁处——积极融入"一带一路"（第9项），涉及国际经贸和航空两个领域；\n2. 高技术处/科创中心——国际科技创新中心建设（第15项），涉及产业和科研两个方向。\n建议召开跨处室协调会明确主次责任。',
  待确认: '当前有1条待确认任务：\n1. 价格处——民生商品保供稳价（第42项），需确认与市场监管部门的协作边界。\n建议尽快与相关处室沟通确认。',
  处室: '本次分解涉及8个处室：协同政策处（2项）、开放处/空铁处（1项）、协同疏解处（1项）、审批处（1项）、营商改革处（1项）、资环处（1项）、价格处（1项）、高技术处/科创中心（1项）、投资处（1项）。其中1处采用了往年优先分配原则。',
  考评: '根据发改委综合考评实施方案，分解结果已与考评指标对齐。总量校验显示10/12项已覆盖，尚有2项未分解。3项目标缺少量化指标，建议补充。4个处室（法规处、人事处、机关党委、离退休处）暂无任务分配。',
  优先级: '往年优先原则已应用于1条任务：\n第4条"数字经济标杆城市建设"——系统建议社会处，但往年分配为审批处，已采用往年分配。该原则确保处室职责的连续性和稳定性，避免频繁调整带来的执行风险。',
  目标审核: '目标审核结果：\n✅ 总量校验：10/12项已覆盖，2项待补充\n✅ 往年对比：新增3项、延续7项、调整2项\n⚠️ 处室覆盖：8/12个处室已分配，4个处室无任务\n⚠️ 可量化性：3项目标缺少量化指标\n建议点击"AI自主制定目标"补充缺失项。',
}

function getMockReply(input: string): string {
  for (const [key, reply] of Object.entries(mockReplies)) {
    if (input.includes(key)) return reply
  }
  return '感谢您的提问。我可以帮您分析任务分解结果、查重情况、处室负载、跨处室协作、优先级处理、目标审核等。请尝试输入"查重结果"、"优先级说明"、"目标审核"等关键词获取详细信息。'
}

function getRowBg(task: DecomposedTask): string {
  const detail = duplicateResults.details.find(d => d.id === task.id)
  if (!detail) return ''
  if (detail.type === 'duplicate') return '#fffbe6'
  if (detail.type === 'similar') return '#e6f7ff'
  return ''
}

export default function TaskDecompose() {
  const [decomposing, setDecomposing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: '我是任务分解助手，已为您加载3份底座知识和1份任务文件。点击左侧"开始分解"即可生成分解结果，支持查重、优先级判断和目标审核。' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [taskFiles, setTaskFiles] = useState<TaskFile[]>([availableFiles[0]])
  const [taskBookVisible, setTaskBookVisible] = useState(false)
  const [taskBookType, setTaskBookType] = useState<'full' | 'dept'>('full')
  const [aiGoalsVisible, setAiGoalsVisible] = useState(false)
  const [adoptedGoals, setAdoptedGoals] = useState<number[]>([])
  const chatListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleDecompose = () => {
    setDecomposing(true)
    setShowResult(false)
    setAiGoalsVisible(false)
    setAdoptedGoals([])
    setTimeout(() => {
      setDecomposing(false)
      setShowResult(true)
    }, 3000)
  }

  const handleSend = () => {
    const text = chatInput.trim()
    if (!text) return
    setChatMessages(prev => [...prev, { role: 'user', content: text }])
    setChatInput('')
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: getMockReply(text) }])
    }, 800)
  }

  const handleAddFile = () => {
    const remaining = availableFiles.filter(f => !taskFiles.some(tf => tf.key === f.key))
    if (remaining.length === 0) {
      message.info('已添加全部可用文件')
      return
    }
    setTaskFiles(prev => [...prev, remaining[0]])
  }

  const handleRemoveFile = (key: string) => {
    setTaskFiles(prev => prev.filter(f => f.key !== key))
  }

  const handleExportWord = () => {
    message.success('已生成Word文件，正在下载...')
  }

  const handleExportExcel = () => {
    message.success('已生成Excel文件，正在下载...')
  }

  const handleTaskBook = (type: 'full' | 'dept') => {
    setTaskBookType(type)
    setTaskBookVisible(true)
  }

  const handleAdoptGoal = (id: number) => {
    setAdoptedGoals(prev => [...prev, id])
    message.success('已采纳该目标')
  }

  const handleIgnoreGoal = (id: number) => {
    setAdoptedGoals(prev => prev.filter(g => g !== id))
  }

  const taskBookMenuItems: MenuProps['items'] = [
    { key: 'full', label: '全量任务书' },
    { key: 'dept', label: '分处室任务书' },
  ]

  const handleTaskBookMenu: MenuProps['onClick'] = ({ key }) => {
    handleTaskBook(key as 'full' | 'dept')
  }

  const normalCount = decomposedTasks.filter(t => t.status === 'decomposed').length
  const crossDeptCount = decomposedTasks.filter(t => t.status === 'cross_dept').length
  const pendingCount = decomposedTasks.filter(t => t.status === 'pending_confirm').length
  const duplicateCount = decomposedTasks.filter(t => t.status === 'duplicate').length
  const similarCount = decomposedTasks.filter(t => t.status === 'similar').length
  const deptSet = new Set(decomposedTasks.flatMap(t => t.actualDept.split('/').map(d => d.trim())))

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 50, align: 'center' as const },
    {
      title: '年度任务', dataIndex: 'task', key: 'task', width: 200, ellipsis: true,
      render: (v: string, record: DecomposedTask) => {
        const detail = duplicateResults.details.find(d => d.id === record.id)
        if (detail) {
          return (
            <Tooltip title={detail.type === 'duplicate' ? `与已有任务"${detail.existingTask}"重复` : `与已有任务"${detail.existingTask}"相似`}>
              <span>{v}</span>
            </Tooltip>
          )
        }
        return v
      },
    },
    { title: '来源文件', dataIndex: 'sourceFile', key: 'sourceFile', width: 100 },
    {
      title: '系统建议处室', dataIndex: 'systemDept', key: 'systemDept', width: 100,
      render: (v: string, record: DecomposedTask) => {
        if (record.deptSource === 'historical' && v !== record.actualDept) {
          return <span style={{ textDecoration: 'line-through', color: '#bfbfbf' }}>{v}</span>
        }
        return v
      },
    },
    {
      title: '实际分配处室', dataIndex: 'actualDept', key: 'actualDept', width: 120,
      render: (v: string, record: DecomposedTask) => {
        if (record.deptSource === 'historical' && v !== record.systemDept) {
          return (
            <Tooltip title={`系统建议：${record.systemDept}，往年分配：${v}，已采用往年分配`}>
              <span style={{ color: '#52c41a', fontWeight: 600 }}>{v}</span>
              <Tag color="green" style={{ marginLeft: 4, fontSize: 11 }}>往年优先</Tag>
            </Tooltip>
          )
        }
        return v
      },
    },
    {
      title: '任务目标', dataIndex: 'objective', key: 'objective', width: 220,
      render: (v: string) => (
        <div style={{ whiteSpace: 'pre-line', fontSize: 12, lineHeight: '18px' }}>{v}</div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 70, align: 'center' as const,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label}</Tag>,
    },
  ]

  const fullBookColumns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 50, align: 'center' as const },
    { title: '年度任务', dataIndex: 'task', key: 'task', ellipsis: true },
    { title: '来源文件', dataIndex: 'sourceFile', key: 'sourceFile', width: 120 },
    { title: '实际分配处室', dataIndex: 'actualDept', key: 'actualDept', width: 120 },
    {
      title: '任务目标', dataIndex: 'objective', key: 'objective', width: 300,
      render: (v: string) => <div style={{ whiteSpace: 'pre-line', fontSize: 12 }}>{v}</div>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80, align: 'center' as const,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label}</Tag>,
    },
  ]

  const deptBookColumns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 50, align: 'center' as const },
    { title: '年度任务', dataIndex: 'task', key: 'task', ellipsis: true },
    {
      title: '任务目标', dataIndex: 'objective', key: 'objective', width: 400,
      render: (v: string) => <div style={{ whiteSpace: 'pre-line', fontSize: 12 }}>{v}</div>,
    },
    { title: '来源文件', dataIndex: 'sourceFile', key: 'sourceFile', width: 120 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80, align: 'center' as const,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label}</Tag>,
    },
  ]

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 112px)' }}>
      {/* 左侧 22% */}
      <div style={{ width: '22%', minWidth: 260, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 2 }}>
          📋 输入材料
        </div>

        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 2, marginTop: 4 }}>底座知识（始终预装）</div>
        {baseKnowledgeList.map(m => (
          <Card
            key={m.key}
            size="small"
            style={{ borderRadius: 8, background: '#f5f5f5', border: '1px solid #e8e8e8' }}
            styles={{ body: { padding: '10px 14px' } }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={13} color="#8c8c8c" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#595959' }}>{m.title}</span>
              </div>
              <Tag icon={<CheckCircle size={11} />} color="success" style={{ fontSize: 11 }}>已加载</Tag>
            </div>
            <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 4 }}>{m.desc}</div>
          </Card>
        ))}

        <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 2, marginTop: 8 }}>任务文件</div>
        {taskFiles.map(f => (
          <Card
            key={f.key}
            size="small"
            style={{ borderRadius: 8 }}
            styles={{ body: { padding: '10px 14px' } }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} color="#1a365d" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1a365d' }}>《{f.title}》</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: '#1a365d', fontWeight: 500 }}>{f.count}条</span>
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<X size={14} />}
                  onClick={() => handleRemoveFile(f.key)}
                  style={{ padding: 0, minWidth: 20 }}
                />
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="dashed"
          block
          icon={<Plus size={14} />}
          onClick={handleAddFile}
          style={{ borderRadius: 8, fontSize: 13 }}
          disabled={taskFiles.length >= availableFiles.length}
        >
          添加文件
        </Button>

        <div style={{ flex: 1 }} />

        <Button
          type="primary"
          size="large"
          block
          loading={decomposing}
          onClick={handleDecompose}
          style={{
            height: 46, fontSize: 15, fontWeight: 600, borderRadius: 10,
            background: '#1a365d', boxShadow: '0 2px 8px rgba(26,54,93,0.3)',
          }}
        >
          {decomposing ? '正在分解...' : '开始分解'}
        </Button>
      </div>

      {/* 中间 52% */}
      <div style={{ width: '52%', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 2 }}>
          🎯 任务分解结果
        </div>

        {decomposing && (
          <div className="flex items-center justify-center" style={{ flex: 1 }}>
            <Spin size="large" tip="AI正在分解任务..." />
          </div>
        )}

        {!decomposing && !showResult && (
          <div
            className="flex items-center justify-center"
            style={{
              flex: 1, background: '#fafafa', borderRadius: 12, border: '1px dashed #d9d9d9',
            }}
          >
            <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
              <FileText size={48} strokeWidth={1} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14 }}>点击左侧"开始分解"生成分解结果</div>
            </div>
          </div>
        )}

        {!decomposing && showResult && (
          <>
            <Row gutter={10}>
              <Col span={5}>
                <Card size="small" style={{ borderRadius: 8 }} styles={{ body: { padding: '10px 14px' } }}>
                  <Statistic title="已分解任务" value={decomposedTasks.length} valueStyle={{ color: '#1a365d', fontSize: 22 }} />
                </Card>
              </Col>
              <Col span={5}>
                <Card size="small" style={{ borderRadius: 8 }} styles={{ body: { padding: '10px 14px' } }}>
                  <Statistic title="涉及处室" value={deptSet.size} valueStyle={{ color: '#2a5298', fontSize: 22 }} />
                </Card>
              </Col>
              <Col span={4}>
                <Card size="small" style={{ borderRadius: 8, borderLeft: '3px solid #1890ff' }} styles={{ body: { padding: '10px 14px' } }}>
                  <Statistic title="跨处室" value={crossDeptCount} valueStyle={{ color: '#1890ff', fontSize: 22 }} />
                </Card>
              </Col>
              <Col span={5}>
                <Card size="small" style={{ borderRadius: 8, borderLeft: '3px solid #ff4d4f' }} styles={{ body: { padding: '10px 14px' } }}>
                  <Statistic title="重复任务" value={duplicateCount} valueStyle={{ color: '#ff4d4f', fontSize: 22 }} />
                </Card>
              </Col>
              <Col span={5}>
                <Card size="small" style={{ borderRadius: 8, borderLeft: '3px solid #13c2c2' }} styles={{ body: { padding: '10px 14px' } }}>
                  <Statistic title="相似任务" value={similarCount} valueStyle={{ color: '#13c2c2', fontSize: 22 }} />
                </Card>
              </Col>
            </Row>

            {/* 查重结果卡片 */}
            <Card
              size="small"
              style={{ borderRadius: 8, borderLeft: '3px solid #faad14' }}
              styles={{ body: { padding: '10px 16px' } }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <AlertTriangle size={15} color="#faad14" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#595959' }}>查重结果：</span>
                </div>
                <Tag color="red">重复 {duplicateResults.duplicate} 条</Tag>
                <Tag color="cyan">相似 {duplicateResults.similar} 条</Tag>
                <Tag color="green">新增 {duplicateResults.newTasks} 条</Tag>
                <span style={{ fontSize: 12, color: '#8c8c8c', marginLeft: 'auto' }}>
                  重复行标黄、相似行标蓝，悬停查看详情
                </span>
              </div>
            </Card>

            {/* 工具栏 */}
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <Button icon={<FileText size={14} />} onClick={handleExportWord} style={{ borderRadius: 6 }}>
                导出Word
              </Button>
              <Button icon={<Table2 size={14} />} onClick={handleExportExcel} style={{ borderRadius: 6 }}>
                导出Excel
              </Button>
              <Dropdown menu={{ items: taskBookMenuItems, onClick: handleTaskBookMenu }} placement="bottomLeft">
                <Button icon={<BookOpen size={14} />} style={{ borderRadius: 6 }}>
                  生成任务书 ▾
                </Button>
              </Dropdown>
            </div>

            {/* 分解结果表格 */}
            <Card
              style={{ borderRadius: 10, flex: 1, overflow: 'hidden' }}
              styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
            >
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                  dataSource={decomposedTasks}
                  columns={columns}
                  rowKey="id"
                  size="middle"
                  pagination={false}
                  style={{ padding: '8px 12px 12px' }}
                  scroll={{ y: 'calc(100vh - 520px)' }}
                  rowClassName={(record) => {
                    const detail = duplicateResults.details.find(d => d.id === record.id)
                    if (detail?.type === 'duplicate') return 'row-duplicate'
                    if (detail?.type === 'similar') return 'row-similar'
                    return ''
                  }}
                  onRow={(record) => ({
                    style: { background: getRowBg(record) },
                  })}
                />
              </div>
            </Card>

            {/* 目标审核区域 */}
            <Card
              size="small"
              title={<span style={{ fontSize: 13, fontWeight: 600 }}>📊 目标审核</span>}
              style={{ borderRadius: 8, flexShrink: 0 }}
              styles={{ body: { padding: '10px 16px' } }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <CheckCircle size={14} color="#52c41a" />
                    <span style={{ fontSize: 12, color: '#595959' }}>总量校验：分解任务总数 vs 考评方案要求</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a365d', paddingLeft: 22 }}>
                    10/12项已覆盖
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <CheckCircle size={14} color="#52c41a" />
                    <span style={{ fontSize: 12, color: '#595959' }}>往年对比</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a365d', paddingLeft: 22 }}>
                    新增3项、延续7项、调整2项
                  </div>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <AlertTriangle size={14} color="#faad14" />
                    <span style={{ fontSize: 12, color: '#595959' }}>处室覆盖</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#faad14', paddingLeft: 22 }}>
                    8/12个处室已分配任务，4个处室无任务
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <AlertTriangle size={14} color="#faad14" />
                    <span style={{ fontSize: 12, color: '#595959' }}>目标可量化性</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#faad14', paddingLeft: 22 }}>
                    3项目标缺少量化指标
                  </div>
                </Col>
              </Row>
            </Card>

            {/* AI自主制定目标 */}
            <Card
              size="small"
              style={{ borderRadius: 8, flexShrink: 0 }}
              styles={{ body: { padding: '10px 16px' } }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} color="#722ed1" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#595959' }}>自主制定目标</span>
                </div>
                <Button
                  type="primary"
                  size="small"
                  icon={<Sparkles size={12} />}
                  onClick={() => setAiGoalsVisible(!aiGoalsVisible)}
                  style={{ borderRadius: 6, background: '#722ed1', fontSize: 12 }}
                >
                  {aiGoalsVisible ? '收起目标' : 'AI自主制定目标'}
                </Button>
              </div>
              {aiGoalsVisible && (
                <div style={{ marginTop: 10 }}>
                  {aiSuggestedGoals.map(g => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between"
                      style={{
                        padding: '8px 12px', marginBottom: 6, borderRadius: 6,
                        background: adoptedGoals.includes(g.id) ? '#f6ffed' : '#fafafa',
                        border: adoptedGoals.includes(g.id) ? '1px solid #b7eb8f' : '1px solid #f0f0f0',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a365d' }}>
                          建议新增：{g.goal}
                          <Tag color="purple" style={{ marginLeft: 6, fontSize: 11 }}>{g.dept}</Tag>
                        </div>
                        <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>{g.reason}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {adoptedGoals.includes(g.id) ? (
                          <Tag color="success" style={{ fontSize: 11 }}>已采纳</Tag>
                        ) : (
                          <>
                            <Button
                              type="link"
                              size="small"
                              style={{ color: '#52c41a', fontSize: 12, padding: 0 }}
                              onClick={() => handleAdoptGoal(g.id)}
                            >
                              采纳
                            </Button>
                            <Button
                              type="link"
                              size="small"
                              style={{ color: '#bfbfbf', fontSize: 12, padding: 0 }}
                              onClick={() => handleIgnoreGoal(g.id)}
                            >
                              忽略
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* 右侧 26% */}
      <div style={{ width: '26%', minWidth: 260, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 10 }}>
          🤖 分解助手
        </div>
        <Card
          style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
        >
          <div
            ref={chatListRef}
            style={{
              flex: 1, overflowY: 'auto', padding: '14px',
              display: 'flex', flexDirection: 'column', gap: 10,
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
                      width: 30, height: 30, borderRadius: 8,
                      background: 'linear-gradient(135deg, #1a365d 0%, #2a5298 100%)',
                    }}
                  >
                    <Bot size={15} color="#fff" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '80%', padding: '9px 12px',
                    borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                    background: msg.role === 'user' ? '#1a365d' : '#f5f7fa',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    fontSize: 12, lineHeight: '19px', whiteSpace: 'pre-line',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder='输入问题，如"查重结果"、"优先级说明"'
              style={{ borderRadius: 8, fontSize: 12 }}
            />
            <Button
              type="primary"
              onClick={handleSend}
              style={{ borderRadius: 8, background: '#1a365d', flexShrink: 0 }}
              icon={<Send size={13} />}
            />
          </div>
        </Card>
      </div>

      {/* 任务书 Modal */}
      <Modal
        title={taskBookType === 'full' ? '全量任务书' : '分处室任务书'}
        open={taskBookVisible}
        onCancel={() => setTaskBookVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setTaskBookVisible(false)}>关闭</Button>,
          <Button key="export" type="primary" icon={<Download size={14} />} onClick={() => { message.success('已生成任务书文件，正在下载...'); setTaskBookVisible(false) }} style={{ background: '#1a365d' }}>
            导出任务书
          </Button>,
        ]}
      >
        {taskBookType === 'full' ? (
          <Table
            dataSource={decomposedTasks}
            columns={fullBookColumns}
            rowKey="id"
            size="small"
            pagination={false}
            scroll={{ y: 400 }}
          />
        ) : (
          <Tabs
            items={Object.values(deptTaskMap).map(({ dept, tasks }) => ({
              key: dept,
              label: (
                <span>
                  <Badge count={tasks.length} size="small" style={{ marginRight: 6 }}>{dept}</Badge>
                </span>
              ),
              children: (
                <Table
                  dataSource={tasks}
                  columns={deptBookColumns}
                  rowKey="id"
                  size="small"
                  pagination={false}
                />
              ),
            }))}
          />
        )}
      </Modal>
    </div>
  )
}
