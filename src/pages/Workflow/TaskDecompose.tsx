import { useState, useRef, useEffect } from 'react'
import { Card, Button, Tag, Table, Input, Spin, Statistic, Row, Col } from 'antd'
import { Send, FileText, CheckCircle, Inbox, Bot } from 'lucide-react'

interface DecomposedTask {
  id: number
  task: string
  source: string
  objective: string
  department: string
  status: 'decomposed' | 'cross_dept' | 'pending_confirm'
}

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

const decomposedTasks: DecomposedTask[] = [
  { id: 1, task: '配合自然资源部编制京津冀国土空间规划，会同天津、河北编制现代化首都都市圈空间协同规划', source: '市政府工作报告重点任务清单第2项', objective: '1.配合市规划自然资源委提出本市关于京津冀国土空间规划有关意见\n2.发挥京津冀联合办工作机制作用，配合编制现代化首都都市圈空间协同规划', department: '市京津冀协同办', status: 'decomposed' },
  { id: 2, task: '积极融入、主动服务共建"一带一路"，出台落实"八项行动"的具体措施', source: '市政府工作报告重点任务清单第9项', objective: '1.一季度研究出台北京市积极融入共建"一带一路"高质量发展实施方案\n2.搭建"一带一路"综合服务平台，建立企业服务机制', department: '开放处、空铁处', status: 'cross_dept' },
  { id: 3, task: '支持、协调和保障中央标志性项目落地，完成第二批市属行政事业单位搬迁', source: '市政府工作报告重点任务清单第13项', objective: '1.加强与国家发改委沟通衔接\n2.协调市国资委、市教委、市卫健委等部门，主动对接搬迁单位', department: '协同疏解处', status: 'pending_confirm' },
  { id: 4, task: '加快重点产业集聚区建设，推动数字经济标杆城市建设', source: '市政府工作报告重点任务清单第18项', objective: '1.制定数字经济标杆城市建设年度工作要点\n2.推进重点产业集聚区基础设施建设和项目落地', department: '高技术处', status: 'decomposed' },
  { id: 5, task: '深化营商环境改革，落实新一轮改革任务', source: '市政府工作报告重点任务清单第25项', objective: '1.制定营商环境6.0版改革实施方案\n2.推进审批制度改革，提升政务服务效能', department: '营商改革处', status: 'decomposed' },
  { id: 6, task: '推进碳达峰碳中和，完善双碳"1+N"政策体系', source: '市政府工作报告重点任务清单第31项', objective: '1.出台碳达峰实施方案配套文件\n2.推进重点领域节能降碳改造', department: '资环处', status: 'decomposed' },
  { id: 7, task: '加强重要民生商品保供稳价，做好价格监测预警', source: '市政府工作报告重点任务清单第42项', objective: '1.完善价格监测预警体系\n2.落实社会救助和保障标准与物价上涨挂钩联动机制', department: '价格处', status: 'pending_confirm' },
  { id: 8, task: '推动京津冀协同发展，支持雄安新区建设', source: '市政府工作报告重点任务清单第3项', objective: '1.制定年度京津冀协同发展工作要点\n2.推进雄安新区"三校一院"交钥匙项目后续工作', department: '市京津冀协同办', status: 'decomposed' },
  { id: 9, task: '加快国际科技创新中心建设，推动中关村先行先试改革', source: '市政府工作报告重点任务清单第15项', objective: '1.推动中关村24条先行先试改革措施落地\n2.支持新型研发机构建设', department: '高技术处、科创中心', status: 'cross_dept' },
  { id: 10, task: '推进城市更新行动，加快老旧小区改造', source: '市政府工作报告重点任务清单第50项', objective: '1.制定城市更新年度计划\n2.推进老旧小区改造新开工项目', department: '投资处', status: 'decomposed' },
]

const statusMap: Record<string, { color: string; label: string }> = {
  decomposed: { color: 'green', label: '已分解' },
  cross_dept: { color: 'blue', label: '跨处室' },
  pending_confirm: { color: 'orange', label: '待确认' },
}

const mockReplies: Record<string, string> = {
  分解: '任务分解已基于市政府工作报告重点任务清单、发改委综合考评实施方案和各处室职责目录三份材料完成。共生成10条分解结果，涉及8个处室，其中2条跨处室协作任务（开放处/空铁处、高技术处/科创中心）和2条待确认任务（协同疏解处、价格处），建议尽快与相关处室确认职责归属。',
  跨处室: '当前有2条跨处室协作任务：\n1. 开放处/空铁处——积极融入"一带一路"（第9项），涉及国际经贸和航空两个领域；\n2. 高技术处/科创中心——国际科技创新中心建设（第15项），涉及产业和科研两个方向。\n建议召开跨处室协调会明确主次责任。',
  待确认: '当前有2条待确认任务：\n1. 协同疏解处——中央标志性项目落地（第13项），需确认是否需其他处室配合；\n2. 价格处——民生商品保供稳价（第42项），需确认与市场监管部门的协作边界。\n建议尽快与相关处室沟通确认。',
  处室: '本次分解涉及8个处室：市京津冀协同办（2项）、开放处/空铁处（1项）、协同疏解处（1项）、高技术处（1项）、营商改革处（1项）、资环处（1项）、价格处（1项）、高技术处/科创中心（1项）、投资处（1项）。其中市京津冀协同办承担任务最多。',
  考评: '根据发改委综合考评实施方案，分解结果已与考评指标对齐。每条分解任务的"任务目标"字段均包含可量化的考核要点，便于后续跟踪和评价。建议结合考评周期设置里程碑节点。',
}

function getMockReply(input: string): string {
  for (const [key, reply] of Object.entries(mockReplies)) {
    if (input.includes(key)) return reply
  }
  return '感谢您的提问。我可以帮您分析任务分解结果、处室负载情况、跨处室协作详情等。请尝试输入"跨处室任务"、"待确认任务"或"处室分布"等关键词获取详细信息。'
}

const inputMaterials = [
  {
    key: 'report',
    title: '市政府工作报告重点任务清单',
    description: '包含全市年度重点任务',
    loaded: true,
    count: 88,
  },
  {
    key: 'evaluation',
    title: '发改委综合考评实施方案',
    description: '包含考评对象、指标、方式',
    loaded: true,
    count: null,
  },
  {
    key: 'departments',
    title: '全委各处室职责目录',
    description: '各处室名称及职责描述',
    loaded: true,
    count: null,
  },
]

export default function TaskDecompose() {
  const [decomposing, setDecomposing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: '我是任务分解助手，已为您加载3份参考材料。点击左侧"开始分解"即可生成分解结果，您也可以向我提问。' },
  ])
  const [chatInput, setChatInput] = useState('')
  const chatListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleDecompose = () => {
    setDecomposing(true)
    setShowResult(false)
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

  const normalCount = decomposedTasks.filter(t => t.status === 'decomposed').length
  const crossDeptCount = decomposedTasks.filter(t => t.status === 'cross_dept').length
  const pendingCount = decomposedTasks.filter(t => t.status === 'pending_confirm').length
  const deptSet = new Set(decomposedTasks.flatMap(t => t.department.split('、')))

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 60, align: 'center' as const },
    { title: '年度任务', dataIndex: 'task', key: 'task', width: 260, ellipsis: true },
    { title: '任务来源', dataIndex: 'source', key: 'source', width: 180, ellipsis: true },
    {
      title: '任务目标', dataIndex: 'objective', key: 'objective', width: 280,
      render: (v: string) => (
        <div style={{ whiteSpace: 'pre-line', fontSize: 13, lineHeight: '20px' }}>{v}</div>
      ),
    },
    { title: '牵头处室', dataIndex: 'department', key: 'department', width: 130 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80, align: 'center' as const,
      render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label}</Tag>,
    },
  ]

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 112px)' }}>
      <div style={{ width: '25%', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>
          📋 输入材料
        </div>
        {inputMaterials.map(m => (
          <Card
            key={m.key}
            size="small"
            style={{ borderRadius: 10, flex: '0 0 auto' }}
            styles={{ body: { padding: '14px 16px' } }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <div className="flex items-center gap-2">
                <FileText size={15} color="#1a365d" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1a365d' }}>{m.title}</span>
              </div>
              {m.loaded ? (
                <Tag icon={<CheckCircle size={12} />} color="success">已加载</Tag>
              ) : (
                <Tag icon={<Inbox size={12} />} color="default">未加载</Tag>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>
              {m.description}
              {m.count !== null && m.loaded && (
                <span style={{ color: '#1a365d', fontWeight: 500 }}>（{m.count}条）</span>
              )}
            </div>
          </Card>
        ))}
        <div style={{ flex: 1 }} />
        <Button
          type="primary"
          size="large"
          block
          loading={decomposing}
          onClick={handleDecompose}
          style={{
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 10,
            background: '#1a365d',
            boxShadow: '0 2px 8px rgba(26,54,93,0.3)',
          }}
        >
          {decomposing ? '正在分解...' : '开始分解'}
        </Button>
      </div>

      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d', marginBottom: 4 }}>
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
              flex: 1,
              background: '#fafafa',
              borderRadius: 12,
              border: '1px dashed #d9d9d9',
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
            <Row gutter={12}>
              <Col span={6}>
                <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px' } }}>
                  <Statistic title="已分解任务" value={decomposedTasks.length} valueStyle={{ color: '#1a365d', fontSize: 24 }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ borderRadius: 10 }} styles={{ body: { padding: '12px 16px' } }}>
                  <Statistic title="涉及处室" value={deptSet.size} valueStyle={{ color: '#2a5298', fontSize: 24 }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ borderRadius: 10, borderLeft: '3px solid #1890ff' }} styles={{ body: { padding: '12px 16px' } }}>
                  <Statistic title="跨处室协作" value={crossDeptCount} valueStyle={{ color: '#1890ff', fontSize: 24 }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ borderRadius: 10, borderLeft: '3px solid #faad14' }} styles={{ body: { padding: '12px 16px' } }}>
                  <Statistic title="待确认" value={pendingCount} valueStyle={{ color: '#faad14', fontSize: 24 }} />
                </Card>
              </Col>
            </Row>
            <Card
              style={{ borderRadius: 12, flex: 1, overflow: 'hidden' }}
              styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
            >
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                  dataSource={decomposedTasks}
                  columns={columns}
                  rowKey="id"
                  size="middle"
                  pagination={false}
                  style={{ padding: '12px 16px 16px' }}
                  scroll={{ y: 'calc(100vh - 380px)' }}
                />
              </div>
            </Card>
          </>
        )}
      </div>

      <div style={{ width: '25%', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d', marginBottom: 12 }}>
          🤖 分解助手
        </div>
        <Card
          style={{ borderRadius: 12, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
        >
          <div
            ref={chatListRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
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
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              gap: 8,
            }}
          >
            <Input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder='输入问题，如"跨处室任务详情"'
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
  )
}
