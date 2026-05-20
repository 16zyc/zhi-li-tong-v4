import { Card, Tag, Badge, Tooltip, Typography, Row, Col, Progress } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  Target, Flag, GitBranch, BarChart3, Activity,
  AlertTriangle, Search, Award, MessageSquare, TrendingUp,
  ChevronRight, ArrowRight, Zap, FileText, CheckCircle2,
} from 'lucide-react'
import { workflowStages, taskData } from '@/mock/taskData'

const { Title, Text } = Typography

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

const stageTaskCount: Record<string, number> = {}
taskData.forEach(t => {
  stageTaskCount[t.stage] = (stageTaskCount[t.stage] || 0) + 1
})

const flowData = [
  {
    phase: '规划期',
    color: '#1a365d',
    bg: '#f0f4f8',
    stages: [0, 1, 2],
    desc: '从任务来源到可执行分解',
  },
  {
    phase: '执行期',
    color: '#2a5298',
    bg: '#eef3fb',
    stages: [3, 4, 5, 6],
    desc: '从指标设定到查访核验',
  },
  {
    phase: '评价期',
    color: '#d4a853',
    bg: '#fdf8ef',
    stages: [7, 8, 9],
    desc: '从考核评分到报告生成',
  },
]

const outputInputMap: Record<string, { input: string; output: string; example: string }> = {
  capture: { input: '政府工作报告、上级文件、领导批示', output: '任务清单', example: '88条重点任务' },
  goal: { input: '任务分解表 + 考评方案', output: '目标卡', example: '6项年度目标' },
  decompose: { input: '任务清单 + 处室职责', output: '任务分解表', example: '12项分解到8个处室' },
  indicator: { input: '任务分解表 + 考评方案', output: '指标体系', example: '24项考核指标' },
  process: { input: '任务分解表 + 指标体系', output: '进度报告', example: '15项任务跟踪' },
  risk: { input: '进度数据 + 阈值规则', output: '风险看板', example: '2红灯3黄灯' },
  verify: { input: '进度报告 + 证明材料', output: '核验报告', example: '8个处室核验' },
  evaluate: { input: '核验结果 + 指标数据', output: '考核结果', example: '12个处室评分' },
  feedback: { input: '考核结果 + 历史数据', output: '绩效健康报告', example: '改进建议12条' },
  report: { input: '全链路数据', output: '绩效分析报告', example: '5类报告模板' },
}

export default function WorkflowIndex() {
  const navigate = useNavigate()
  const totalTasks = taskData.length
  const completedStages = new Set(taskData.map(t => t.stage)).size

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          borderRadius: 12,
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1a365d 0%, #2a5298 50%, #1a365d 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>十大环节 · 全链路作战条令</Title>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4, display: 'block' }}>
              从任务捕获到报告生成，每个环节有明确的输入、AI处理和输出
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{totalTasks}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>在管任务</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#d4a853' }}>{completedStages}/10</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>活跃环节</div>
            </div>
          </div>
        </div>
      </div>

      {flowData.map((phase, phaseIdx) => (
        <div key={phase.phase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                padding: '4px 14px',
                borderRadius: 6,
                background: phase.color,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {phase.phase}
            </div>
            <span style={{ fontSize: 13, color: '#8c8c8c' }}>{phase.desc}</span>
            {phaseIdx < flowData.length - 1 && (
              <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
            )}
          </div>

          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
            {phase.stages.map((stageIdx, i) => {
              const stage = workflowStages[stageIdx]
              const count = stageTaskCount[stage.key] || 0
              const isActive = count > 0
              const io = outputInputMap[stage.key]

              return (
                <div key={stage.key} style={{ flex: 1, display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/workflow/${stage.key}`)}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      border: isActive ? `2px solid ${phase.color}` : '1px solid #f0f0f0',
                      boxShadow: isActive ? `0 2px 12px ${phase.color}22` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    styles={{ body: { padding: '16px 14px', display: 'flex', flexDirection: 'column', height: '100%' } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                          background: isActive ? phase.color : '#f5f5f5',
                          color: isActive ? '#fff' : '#8c8c8c',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {iconMap[stage.icon]}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a365d', lineHeight: '20px' }}>
                          {stage.name}
                        </div>
                        <Tooltip title={`负责: ${stage.agent}`}>
                          <Tag color={isActive ? 'blue' : 'default'} style={{ fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 4px' }}>
                            {stage.agent}
                          </Tag>
                        </Tooltip>
                      </div>
                      {isActive && (
                        <Badge count={count} style={{ backgroundColor: phase.color, marginLeft: 'auto' }} overflowCount={99} />
                      )}
                    </div>

                    <div style={{ flex: 1 }} />

                    <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: 10, marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <FileText size={11} style={{ color: '#8c8c8c', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: '#8c8c8c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          输入: {io?.input.slice(0, 16)}…
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <Zap size={11} style={{ color: phase.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: phase.color, fontWeight: 500 }}>
                          AI: {stage.aiCapability.slice(0, 14)}…
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={11} style={{ color: '#52c41a', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: '#52c41a', fontWeight: 500 }}>
                          输出: {io?.output}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {i < phase.stages.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 2px', flexShrink: 0 }}>
                      <ArrowRight size={16} color={phase.color} style={{ opacity: 0.5 }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {phaseIdx < flowData.length - 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowRight size={14} color="#d4a853" style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          )}
        </div>
      ))}

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '20px 24px' } }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a365d', marginBottom: 16 }}>
          环节价值说明
        </div>
        <Row gutter={[16, 12]}>
          {workflowStages.map((stage, i) => {
            const io = outputInputMap[stage.key]
            const count = stageTaskCount[stage.key] || 0
            return (
              <Col span={12} key={stage.key}>
                <div
                  style={{
                    display: 'flex', gap: 12, padding: '12px 14px',
                    background: '#fafafa', borderRadius: 8, cursor: 'pointer',
                    border: '1px solid #f0f0f0', transition: 'all 0.2s',
                  }}
                  onClick={() => navigate(`/workflow/${stage.key}`)}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#1a365d'
                    e.currentTarget.style.background = '#f0f4f8'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#f0f0f0'
                    e.currentTarget.style.background = '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: '#1a365d', color: '#fff', flexShrink: 0, fontSize: 14, fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a365d' }}>{stage.name}</span>
                      {count > 0 && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>{count}项任务</Tag>}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', lineHeight: '18px', marginBottom: 4 }}>
                      {stage.description}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#8c8c8c' }}>
                      <span>📥 {io?.input.slice(0, 20)}…</span>
                      <span>📤 {io?.output}</span>
                      <span>📊 {io?.example}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ChevronRight size={14} color="#bfbfbf" />
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </Card>

      <Card style={{ borderRadius: 12, borderLeft: '4px solid #d4a853' }} styles={{ body: { padding: '16px 24px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={18} color="#d4a853" />
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1a365d' }}>十大环节的核心价值</span>
        </div>
        <div style={{ fontSize: 14, color: '#555', lineHeight: '26px' }}>
          十大环节是绩效考评的<span style={{ fontWeight: 600, color: '#1a365d' }}>全流程数字化闭环</span>：
          每个环节都有明确的输入（从哪来）、AI智能处理（做什么）、输出（到哪去），
          上一环节的输出自动成为下一环节的输入，确保数据不断裂、责任不落空。
          <br />
          <span style={{ fontWeight: 600, color: '#1a365d' }}>规划期</span>解决"做什么"——从政府工作报告中捕获任务、制定目标、分解到处室；
          <span style={{ fontWeight: 600, color: '#2a5298' }}>执行期</span>解决"怎么做"——生成指标、跟踪进度、预警风险、核验成果；
          <span style={{ fontWeight: 600, color: '#d4a853' }}>评价期</span>解决"做得怎样"——考核评分、绩效反馈、生成报告。
        </div>
      </Card>
    </div>
  )
}
