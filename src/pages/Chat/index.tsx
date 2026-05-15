import { useState, useRef, useEffect } from 'react'
import { Card, Input, Button, Tag, Avatar, Row, Col, Typography, Space, Badge } from 'antd'
import { Send, MessageSquare, Bot, User, Sparkles, Zap } from 'lucide-react'
import { taskData } from '@/mock/taskData'
import { performanceData } from '@/mock/performanceData'
import { caseData } from '@/mock/caseData'
import { indicatorData } from '@/mock/indicatorData'
import { useAppStore } from '@/store/useAppStore'

const { Title, Text } = Typography

const glassCard: React.CSSProperties = {
  background: 'rgba(30, 41, 59, 0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  borderRadius: 12,
}

const quickChips = ['有哪些风险项目？', '战略部考核多少分？', '帮我分解投资目标', '推荐相关案例']

function generateResponse(msg: string) {
  const kw = msg.toLowerCase()
  if (kw.includes('风险')) {
    const riskTasks = taskData.filter(t => t.riskLevel === 'red' || t.riskLevel === 'yellow')
    return {
      content: `当前共有 ${riskTasks.length} 个风险项目需要关注：`,
      actionCards: riskTasks.slice(0, 3).map(t => ({
        type: 'risk' as const,
        title: t.name,
        description: `${t.department} · 进度${t.progress}% · 风险等级：${t.riskLevel === 'red' ? '红灯' : '黄灯'}`,
        status: t.riskLevel === 'red' ? '红灯' : '黄灯',
      })),
    }
  }
  if (kw.includes('考核') || kw.includes('绩效') || kw.includes('分数') || kw.includes('得分')) {
    const dept = kw.includes('战略') ? '战略部' : kw.includes('运营') ? '运营部' : kw.includes('财务') ? '财务部' : ''
    const records = dept ? performanceData.filter(p => p.department === dept) : performanceData.slice(0, 3)
    return {
      content: dept ? `${dept}最新考核数据如下：` : '各部门最新考核数据如下：',
      actionCards: records.map(r => ({
        type: 'indicator' as const,
        title: `${r.department} · ${r.quarter}`,
        description: `得分：${r.score} · 等级：${r.level} · 排名：第${r.rank}名`,
        status: r.level,
      })),
    }
  }
  if (kw.includes('分解') || kw.includes('目标')) {
    const target = taskData.find(t => t.name.includes('招商') || t.name.includes('投资'))
    return {
      content: target ? `已为您分解"${target.name}"：` : '已为您进行目标分解：',
      actionCards: (target?.children || taskData.slice(0, 3)).map((c: typeof taskData[0]) => ({
        type: 'task' as const,
        title: c.name,
        description: `${c.department} · 截止${c.deadline} · 进度${c.progress}%`,
        status: c.status === 'completed' ? '已完成' : c.status === 'in_progress' ? '进行中' : '待开始',
      })),
    }
  }
  if (kw.includes('案例') || kw.includes('经验')) {
    const cases = caseData.filter(c => c.type === '成功案例' || c.type === '最佳实践').slice(0, 3)
    return {
      content: '为您推荐以下经验案例：',
      actionCards: cases.map(c => ({
        type: 'case' as const,
        title: c.title,
        description: `${c.type} · ${c.department} · ${c.result.slice(0, 30)}...`,
        status: c.type,
      })),
    }
  }
  return {
    content: '收到您的消息，我正在分析相关信息。您可以尝试询问风险项目、考核得分、目标分解或经验案例等内容，我将为您提供精准解答。',
    actionCards: [],
  }
}

export default function Chat() {
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { chatMessages, addChatMessage } = useAppStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSend = (text?: string) => {
    const content = text || inputValue.trim()
    if (!content || sending) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    addChatMessage(userMsg)
    setInputValue('')
    setSending(true)

    setTimeout(() => {
      const resp = generateResponse(content)
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: resp.content,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        actionCards: resp.actionCards,
      }
      addChatMessage(assistantMsg)
      setSending(false)
    }, 800)
  }

  const actionCardColorMap: Record<string, string> = {
    risk: '#ef4444',
    indicator: '#8b5cf6',
    task: '#3b82f6',
    case: '#22c55e',
  }

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              <Zap size={22} style={{ marginRight: 8, verticalAlign: -3, color: '#3b82f6' }} />
              对话即操作
            </Title>
            <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 4, display: 'block' }}>
              所有操作，一句话完成
            </Text>
          </div>
          <Badge status="success" text={<Text style={{ color: '#22c55e', fontSize: 13 }}>会话记忆已开启</Text>} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
            }}
          >
            {msg.role === 'assistant' && (
              <Avatar style={{ background: '#3b82f6', marginRight: 10, flexShrink: 0 }} size={36} icon={<Bot size={18} />} />
            )}
            <div style={{ maxWidth: '65%' }}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? '#3b82f6' : 'rgba(30, 41, 59, 0.9)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(148,163,184,0.12)',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14, lineHeight: 1.7, display: 'block' }}>{msg.content}</Text>
                {msg.actionCards && msg.actionCards.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    {msg.actionCards.map((card, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '10px 14px',
                          background: 'rgba(148,163,184,0.08)',
                          borderRadius: 8,
                          marginBottom: 6,
                          borderLeft: `3px solid ${actionCardColorMap[card.type] || '#3b82f6'}`,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <Text style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{card.title}</Text>
                          {card.status && (
                            <Tag color={card.status === '红灯' ? 'red' : card.status === '黄灯' ? 'orange' : card.status === 'A' ? 'green' : card.status === 'B' ? 'blue' : 'default'} style={{ fontSize: 11, margin: 0 }}>
                              {card.status}
                            </Tag>
                          )}
                        </div>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>{card.description}</Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Text style={{ color: '#475569', fontSize: 11, display: 'block', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.timestamp}
              </Text>
            </div>
            {msg.role === 'user' && (
              <Avatar style={{ background: '#8b5cf6', marginLeft: 10, flexShrink: 0 }} size={36} icon={<User size={18} />} />
            )}
          </div>
        ))}
        {sending && (
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <Avatar style={{ background: '#3b82f6', marginRight: 10, flexShrink: 0 }} size={36} icon={<Bot size={18} />} />
            <div style={{ padding: '12px 16px', borderRadius: '12px 12px 12px 2px', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148,163,184,0.12)' }}>
              <Space>
                <Sparkles size={14} color="#3b82f6" style={{ animation: 'pulse 1s infinite' }} />
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>正在思考...</Text>
              </Space>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '12px 24px 20px', borderTop: '1px solid rgba(148,163,184,0.1)', flexShrink: 0 }}>
        <div style={{ marginBottom: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickChips.map(chip => (
            <Tag
              key={chip}
              style={{ cursor: 'pointer', borderRadius: 16, padding: '2px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', fontSize: 12 }}
              onClick={() => handleSend(chip)}
            >
              <MessageSquare size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
              {chip}
            </Tag>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            size="large"
            placeholder={'输入您的指令，如「有哪些风险项目？」'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={() => handleSend()}
            style={{ flex: 1, borderRadius: 10 }}
            disabled={sending}
          />
          <Button
            type="primary"
            size="large"
            icon={<Send size={16} style={{ verticalAlign: -2 }} />}
            onClick={() => handleSend()}
            loading={sending}
            style={{ borderRadius: 10, width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
