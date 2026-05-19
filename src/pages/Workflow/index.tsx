import React from 'react'
import { Card, Row, Col, Tag, Badge, Tooltip, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  Target, Flag, GitBranch, BarChart3, Activity,
  AlertTriangle, Search, Award, MessageSquare, TrendingUp,
  ArrowRight, ArrowLeft, ChevronRight,
} from 'lucide-react'
import { workflowStages, taskData } from '@/mock/taskData'

const { Title, Text } = Typography

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target size={22} />,
  Flag: <Flag size={22} />,
  GitBranch: <GitBranch size={22} />,
  BarChart3: <BarChart3 size={22} />,
  Activity: <Activity size={22} />,
  AlertTriangle: <AlertTriangle size={22} />,
  Search: <Search size={22} />,
  Award: <Award size={22} />,
  MessageSquare: <MessageSquare size={22} />,
  TrendingUp: <TrendingUp size={22} />,
}

const topRow = workflowStages.slice(0, 6)
const bottomRow = [...workflowStages.slice(6)].reverse()

const stageTaskCount: Record<string, number> = {}
taskData.forEach(t => {
  stageTaskCount[t.stage] = (stageTaskCount[t.stage] || 0) + 1
})

const maxCount = Math.max(...Object.values(stageTaskCount), 1)

const barColors = [
  '#1a365d', '#2a5298', '#3b7dd8', '#d4a853',
  '#e8983e', '#c0392b', '#52c41a', '#1890ff',
  '#722ed1', '#13c2c2',
]

export default function WorkflowIndex() {
  const navigate = useNavigate()

  const renderStageCard = (stage: typeof workflowStages[0], index: number) => {
    const count = stageTaskCount[stage.key] || 0
    const isActive = count > 0

    return (
      <Col span={4} key={stage.key}>
        <Card
          hoverable
          onClick={() => navigate(`/workflow/${stage.key}`)}
          style={{
            borderRadius: 12,
            border: isActive ? '2px solid #d4a853' : '1px solid #f0f0f0',
            boxShadow: isActive ? '0 0 12px rgba(212,168,83,0.3)' : 'none',
            cursor: 'pointer',
            height: '100%',
          }}
          styles={{ body: { padding: '20px 16px' } }}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="flex items-center justify-center mb-3"
              style={{
                width: 48, height: 48, borderRadius: 12,
                background: isActive ? 'linear-gradient(135deg, #1a365d 0%, #2a5298 100%)' : '#f5f5f5',
                color: isActive ? '#fff' : '#8c8c8c',
              }}
            >
              {iconMap[stage.icon]}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a365d', marginBottom: 6 }}>
              {stage.name}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px', marginBottom: 8 }}>
              {stage.description.slice(0, 18)}…
            </div>
            <Tooltip title={`负责Agent: ${stage.agent}`}>
              <Tag color="blue" style={{ fontSize: 11, margin: 0 }}>{stage.agent}</Tag>
            </Tooltip>
            {isActive && (
              <Badge
                count={count}
                style={{ backgroundColor: '#d4a853', marginTop: 8 }}
                overflowCount={99}
              />
            )}
          </div>
        </Card>
      </Col>
    )
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6"
        style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2a5298 50%, #1a365d 100%)' }}
      >
        <Title level={4} style={{ color: '#fff', margin: 0 }}>十大环节</Title>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4, display: 'block' }}>
          全链路作战条令——从任务捕获到报告生成
        </Text>
      </div>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '28px 24px' } }}>
        <Row gutter={[16, 16]} align="middle">
          {topRow.map((stage, i) => (
            <React.Fragment key={stage.key}>
              {renderStageCard(stage, i)}
              {i < topRow.length - 1 && (
                <Col flex="none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <ArrowRight size={18} color="#d4a853" />
                </Col>
              )}
            </React.Fragment>
          ))}
        </Row>

        <div className="flex justify-end" style={{ padding: '8px 0' }}>
          <div style={{ width: 52, height: 40, borderRight: '2px solid #d4a853', borderBottom: '2px solid #d4a853', borderRadius: '0 0 12px 0' }} />
        </div>

        <Row gutter={[16, 16]} align="middle" justify="end">
          {bottomRow.map((stage, i) => (
            <React.Fragment key={stage.key}>
              {i > 0 && (
                <Col flex="none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <ArrowLeft size={18} color="#d4a853" />
                </Col>
              )}
              {renderStageCard(stage, i)}
            </React.Fragment>
          ))}
        </Row>
      </Card>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d', marginBottom: 16 }}>
          各环节任务分布
        </div>
        <div className="space-y-3">
          {workflowStages.map((stage, i) => {
            const count = stageTaskCount[stage.key] || 0
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
            return (
              <div key={stage.key} className="flex items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/workflow/${stage.key}`)}>
                <span style={{ width: 80, fontSize: 13, fontWeight: 500, color: '#333', textAlign: 'right' }}>
                  {stage.name}
                </span>
                <div style={{ flex: 1, height: 24, background: '#f5f5f5', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
                      background: `linear-gradient(90deg, ${barColors[i]} 0%, ${barColors[i]}cc 100%)`,
                      borderRadius: 6,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span style={{ width: 36, fontSize: 14, fontWeight: 600, color: barColors[i], textAlign: 'right' }}>
                  {count}
                </span>
                <ChevronRight size={14} color="#bfbfbf" />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
