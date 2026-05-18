import { useState, useRef, useEffect } from 'react'
import { Input, Button, Upload, Badge } from 'antd'
import {
  Send,
  Paperclip,
  Bot,
  User,
  Sparkles,
  Zap,
  FileText,
  BarChart3,
  AlertTriangle,
  BookOpen,
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: string
}

interface UploadedDoc {
  uid: string
  name: string
  size: string
}

type AIStatus = 'idle' | 'thinking' | 'answering'

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content:
      '您好！我是智理助手，您的AI效能伙伴。我可以帮您分解任务、查询数据、生成报告。请问有什么可以帮您的？',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: '2',
    role: 'ai',
    content:
      '💡 您可以试试：\n• 输入"分解任务"查看年度任务分解\n• 上传文档让我帮您分析\n• 直接用自然语言提问',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  },
]

const quickCommands = [
  { key: 'task', label: '分解年度任务', icon: <Zap size={15} />, message: '帮我分解年度任务' },
  { key: 'performance', label: '生成绩效报告', icon: <BarChart3 size={15} />, message: '生成绩效报告' },
  { key: 'indicator', label: '查询指标数据', icon: <Sparkles size={15} />, message: '查询指标数据' },
  { key: 'case', label: '推荐经验案例', icon: <BookOpen size={15} />, message: '推荐经验案例' },
  { key: 'risk', label: '分析风险项目', icon: <AlertTriangle size={15} />, message: '分析风险项目' },
]

function generateReply(msg: string): string {
  const kw = msg.toLowerCase()
  if (kw.includes('任务') || kw.includes('分解')) {
    return '已为您进行年度任务分解：\n\n1️⃣ 招商引资目标 — 战略部负责，截止12月31日\n2️⃣ 营商环境优化 — 运营部负责，截止11月15日\n3️⃣ 数字化转型推进 — 信息中心负责，截止12月20日\n4️⃣ 人才引进计划 — 人事部负责，截止10月30日\n\n每项任务已自动分配责任人和时间节点，是否需要进一步调整？'
  }
  if (kw.includes('绩效') || kw.includes('报告')) {
    return '正在为您生成绩效报告，报告包含以下内容：\n\n📊 战略部：92分（A级，排名第1）\n📈 运营部：87分（B级，排名第3）\n📉 行政部：76分（C级，排名第7）\n\n⚠️ 行政部连续两季度下降，建议重点关注。\n\n报告预计3分钟内生成完毕，是否需要调整报告内容？'
  }
  if (kw.includes('指标') || kw.includes('数据')) {
    return '当前核心指标数据如下：\n\n🔹 GDP增速：7.2%（目标7.5%）\n🔹 固定资产投资：同比增长12.3%\n🔹 规上工业增加值：增长8.1%\n🔹 社会消费品零售总额：增长9.5%\n\n大部分指标运行在合理区间，GDP增速略低于目标，建议关注后续季度走势。'
  }
  if (kw.includes('风险') || kw.includes('预警')) {
    return '风险项目分析结果：\n\n🔴 高风险：\n  • 智慧园区项目 — 进度滞后32%，资金缺口1200万\n  \n🟡 中风险：\n  • 人才公寓建设 — 审批流程卡点，预计延期1个月\n  \n🟢 低风险：\n  • 数字政务平台 — 按计划推进，完成度85%\n\n建议优先关注智慧园区项目，是否需要生成风险处置方案？'
  }
  if (kw.includes('经验') || kw.includes('案例') || kw.includes('推荐')) {
    return '为您推荐以下经验案例：\n\n📖 案例1：某市"一网通办"改革实践\n  关键词：流程再造、数据共享、群众满意度提升23%\n\n📖 案例2：某区产业链招商创新模式\n  关键词：精准招商、产业链图谱、引资额增长45%\n\n📖 案例3：某县基层治理数字化转型\n  关键词：网格化管理、AI辅助决策、处置效率提升60%\n\n点击案例可查看详情，或告诉我您关注哪个领域。'
  }
  return '收到您的消息，我正在分析相关信息。您可以尝试以下操作：\n\n• 分解年度任务 — 将目标拆解为可执行任务\n• 生成绩效报告 — 自动生成绩效分析报告\n• 查询指标数据 — 查看核心经济指标\n• 分析风险项目 — 识别和评估项目风险\n• 推荐经验案例 — 获取优秀实践参考\n\n请告诉我您需要什么帮助？'
}

function RobotAvatar({ status }: { status: AIStatus }) {
  const animClass =
    status === 'thinking' ? 'robot-thinking' : status === 'answering' ? 'robot-answering' : 'robot-idle'

  return (
    <div className={`robot-avatar-wrapper ${animClass}`}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a365d" />
            <stop offset="100%" stopColor="#2b6cb0" />
          </linearGradient>
          <linearGradient id="robotFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2b6cb0" />
            <stop offset="100%" stopColor="#3182ce" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#63b3ed" />
            <stop offset="100%" stopColor="#3182ce" />
          </radialGradient>
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(49,130,206,0.15)" />
            <stop offset="70%" stopColor="rgba(49,130,206,0.05)" />
            <stop offset="100%" stopColor="rgba(49,130,206,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="60" cy="60" r="58" fill="url(#haloGrad)" className="halo-ring" />

        <circle cx="60" cy="60" r="46" fill="url(#robotBodyGrad)" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(99,179,237,0.3)" strokeWidth="1.5" className="robot-outer-ring" />

        <rect x="36" y="38" width="48" height="34" rx="10" fill="url(#robotFaceGrad)" />

        <circle cx="48" cy="55" r="6" fill="url(#eyeGlow)" filter="url(#glow)" className="robot-eye-left" />
        <circle cx="72" cy="55" r="6" fill="url(#eyeGlow)" filter="url(#glow)" className="robot-eye-right" />
        <circle cx="48" cy="54" r="2.5" fill="#ebf8ff" />
        <circle cx="72" cy="54" r="2.5" fill="#ebf8ff" />

        <path
          d="M48 67 Q60 75 72 67"
          fill="none"
          stroke="#63b3ed"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="robot-mouth"
        />

        <line x1="60" y1="14" x2="60" y2="28" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="12" r="4" fill="#63b3ed" filter="url(#glow)" className="robot-antenna-tip" />

        <rect x="42" y="80" width="36" height="6" rx="3" fill="rgba(99,179,237,0.4)" />
        <rect x="48" y="80" width="10" height="6" rx="3" fill="#63b3ed" className="robot-indicator-1" />
        <rect x="62" y="80" width="10" height="6" rx="3" fill="#63b3ed" className="robot-indicator-2" />
      </svg>
    </div>
  )
}

function MiniBotIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="url(#robotBodyGrad)" />
      <circle cx="10" cy="13" r="2.5" fill="#63b3ed" />
      <circle cx="18" cy="13" r="2.5" fill="#63b3ed" />
      <path d="M10 18 Q14 22 18 18" fill="none" stroke="#63b3ed" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="2" x2="14" y2="5" stroke="#63b3ed" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14" cy="1.5" r="1.5" fill="#63b3ed" />
    </svg>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle')
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, aiStatus])

  const handleSend = (text?: string) => {
    const content = text || inputValue.trim()
    if (!content || aiStatus === 'thinking') return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setAiStatus('thinking')

    setTimeout(() => {
      const reply = generateReply(content)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: reply,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setAiStatus('answering')
      setTimeout(() => {
        setMessages(prev => [...prev, aiMsg])
        setAiStatus('idle')
      }, 400)
    }, 1000)
  }

  const handleUpload = (file: File) => {
    const sizeKB = (file.size / 1024).toFixed(1)
    setUploadedDocs(prev => [
      ...prev,
      { uid: Date.now().toString(), name: file.name, size: `${sizeKB} KB` },
    ])
    const aiMsg: ChatMessage = {
      id: (Date.now() + 2).toString(),
      role: 'ai',
      content: `📎 已收到文档「${file.name}」(${sizeKB} KB)，我已开始分析。您可以继续向我提问关于这份文档的内容。`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, aiMsg])
    return false
  }

  const statusLabel = aiStatus === 'thinking' ? '思考中...' : aiStatus === 'answering' ? '回答中' : '在线'
  const statusColor = aiStatus === 'thinking' ? '#fa8c16' : aiStatus === 'answering' ? '#1890ff' : '#52c41a'

  return (
    <div style={{ height: '100%', display: 'flex', background: '#f7f8fa' }}>
      {/* Left Panel - AI Avatar */}
      <div
        style={{
          width: '30%',
          minWidth: 280,
          maxWidth: 360,
          background: '#fff',
          borderRight: '1px solid #eef0f4',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Avatar Section */}
        <div
          style={{
            padding: '32px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderBottom: '1px solid #eef0f4',
          }}
        >
          <RobotAvatar status={aiStatus} />
          <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700, color: '#1a365d', letterSpacing: 1 }}>
            智理助手
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#8c8c8c' }}>
            您的AI效能伙伴，随时为您服务
          </div>
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 12px',
              borderRadius: 12,
              background: statusColor === '#52c41a' ? '#f6ffed' : statusColor === '#fa8c16' ? '#fff7e6' : '#e6f7ff',
              fontSize: 12,
              color: statusColor,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: statusColor,
                animation: aiStatus === 'thinking' ? 'pulse 1s infinite' : 'none',
              }}
            />
            {statusLabel}
          </div>
        </div>

        {/* Quick Commands */}
        <div
          style={{
            padding: '16px 16px 8px',
            fontSize: 12,
            color: '#8c8c8c',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          快捷命令
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {quickCommands.map(cmd => (
            <div
              key={cmd.key}
              onClick={() => handleSend(cmd.message)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: '#f7f8fa',
                border: '1px solid #eef0f4',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#2b6cb0'
                e.currentTarget.style.background = '#ebf8ff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#eef0f4'
                e.currentTarget.style.background = '#f7f8fa'
              }}
            >
              <span style={{ color: '#2b6cb0', display: 'flex', alignItems: 'center' }}>{cmd.icon}</span>
              <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{cmd.label}</span>
            </div>
          ))}
        </div>

        {/* Uploaded Documents */}
        <div
          style={{
            padding: '20px 16px 8px',
            fontSize: 12,
            color: '#8c8c8c',
            fontWeight: 600,
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <FileText size={13} />
          已上传文档
          {uploadedDocs.length > 0 && (
            <Badge
              count={uploadedDocs.length}
              size="small"
              style={{ background: '#2b6cb0' }}
            />
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          {uploadedDocs.length === 0 ? (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                fontSize: 12,
                color: '#bfbfbf',
                background: '#f7f8fa',
                borderRadius: 8,
                border: '1px dashed #eef0f4',
              }}
            >
              暂无文档，可在右侧上传
            </div>
          ) : (
            uploadedDocs.map(doc => (
              <div
                key={doc.uid}
                style={{
                  padding: '8px 12px',
                  background: '#f7f8fa',
                  borderRadius: 8,
                  marginBottom: 6,
                  border: '1px solid #eef0f4',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FileText size={14} style={{ color: '#2b6cb0', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#333',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {doc.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#bfbfbf' }}>{doc.size}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            padding: '14px 28px',
            borderBottom: '1px solid #eef0f4',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#fff',
          }}
        >
          <Zap size={20} style={{ color: '#2b6cb0' }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1a365d' }}>对话即操作</span>
          <span style={{ fontSize: 13, color: '#8c8c8c', marginLeft: 4 }}>用自然语言驱动工作</span>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            background: '#f7f8fa',
          }}
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 20,
                alignItems: 'flex-start',
              }}
            >
              {msg.role === 'ai' && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(26,54,93,0.15)',
                  }}
                >
                  <Bot size={18} color="#63b3ed" />
                </div>
              )}
              <div style={{ maxWidth: '62%' }}>
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius:
                      msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: msg.role === 'user' ? '#1a365d' : '#fff',
                    whiteSpace: 'pre-line',
                    boxShadow: msg.role === 'user'
                      ? '0 2px 12px rgba(26,54,93,0.2)'
                      : '0 2px 12px rgba(0,0,0,0.06)',
                    border: msg.role === 'ai' ? '1px solid #eef0f4' : 'none',
                  }}
                >
                  <span
                    style={{
                      color: msg.role === 'user' ? '#fff' : '#333',
                      fontSize: 14,
                      lineHeight: 1.8,
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#bfbfbf',
                    marginTop: 6,
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    paddingLeft: msg.role === 'ai' ? 4 : 0,
                    paddingRight: msg.role === 'user' ? 4 : 0,
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
              {msg.role === 'user' && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2b6cb0 0%, #4299e1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(43,108,176,0.2)',
                  }}
                >
                  <User size={18} color="#fff" />
                </div>
              )}
            </div>
          ))}

          {aiStatus === 'thinking' && (
            <div style={{ display: 'flex', marginBottom: 20, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(26,54,93,0.15)',
                }}
              >
                <Bot size={18} color="#63b3ed" className="spin-icon" />
              </div>
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px 16px 16px 2px',
                  background: '#fff',
                  border: '1px solid #eef0f4',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ color: '#8c8c8c', fontSize: 14 }}>正在思考</span>
                <span className="thinking-dots" style={{ color: '#2b6cb0', fontSize: 14 }}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '14px 28px 20px',
            borderTop: '1px solid #eef0f4',
            flexShrink: 0,
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-end',
              background: '#f7f8fa',
              borderRadius: 14,
              border: '1px solid #eef0f4',
              padding: '8px 12px',
              transition: 'border-color 0.2s',
            }}
          >
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            >
              <Button
                type="text"
                icon={<Paperclip size={18} style={{ color: '#8c8c8c' }} />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                }}
              />
            </Upload>
            <Input.TextArea
              placeholder="输入指令或上传文档开始对话..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={aiStatus === 'thinking'}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                resize: 'none',
                fontSize: 14,
                boxShadow: 'none',
                padding: '8px 4px',
              }}
            />
            <Button
              type="primary"
              icon={<Send size={16} />}
              onClick={() => handleSend()}
              disabled={aiStatus === 'thinking' || !inputValue.trim()}
              style={{
                borderRadius: 10,
                width: 44,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: aiStatus === 'thinking' || !inputValue.trim() ? '#bfbfbf' : '#1a365d',
                borderColor: aiStatus === 'thinking' || !inputValue.trim() ? '#bfbfbf' : '#1a365d',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#bfbfbf', textAlign: 'center' }}>
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes answerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes dotBlink {
          0%, 20% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }
        @keyframes haloGlow {
          0%, 100% { r: 58; opacity: 1; }
          50% { r: 62; opacity: 0.6; }
        }
        @keyframes eyeBlink {
          0%, 45%, 55%, 100% { ry: 6; }
          50% { ry: 1; }
        }
        @keyframes indicatorPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .robot-idle {
          animation: breathe 3s ease-in-out infinite;
        }
        .robot-thinking {
          animation: breathe 1.5s ease-in-out infinite;
        }
        .robot-answering {
          animation: answerPulse 1s ease-in-out infinite;
        }
        .robot-idle .halo-ring {
          animation: haloGlow 3s ease-in-out infinite;
        }
        .robot-thinking .halo-ring {
          animation: haloGlow 1s ease-in-out infinite;
        }
        .robot-thinking .robot-outer-ring {
          stroke: rgba(250,140,22,0.5);
          stroke-dasharray: 8 4;
          animation: spin 3s linear infinite reverse;
        }
        .robot-answering .robot-outer-ring {
          stroke: rgba(24,144,255,0.5);
          stroke-dasharray: 12 4;
          animation: spin 4s linear infinite;
        }
        .robot-idle .robot-eye-left,
        .robot-idle .robot-eye-right {
          animation: eyeBlink 4s ease-in-out infinite;
        }
        .robot-thinking .robot-eye-left,
        .robot-thinking .robot-eye-right {
          animation: pulse 0.8s ease-in-out infinite;
        }
        .robot-idle .robot-indicator-1 {
          animation: indicatorPulse 2s ease-in-out infinite;
        }
        .robot-idle .robot-indicator-2 {
          animation: indicatorPulse 2s ease-in-out infinite 0.5s;
        }
        .spin-icon {
          animation: spin 1.5s linear infinite;
        }
        .thinking-dots span {
          animation: dotBlink 1.4s infinite;
        }
        .thinking-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .thinking-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}
