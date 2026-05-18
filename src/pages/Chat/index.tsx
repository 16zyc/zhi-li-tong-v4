import { useState, useRef, useEffect, useCallback } from 'react'
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
import { useAppStore } from '../../store/useAppStore'

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

interface ConversationContext {
  role: string
  displayName: string
  history: string[]
  uploadedDocs: string[]
  topic: string
}

type IntentType =
  | 'task_decompose'
  | 'task_progress'
  | 'task_delay'
  | 'performance'
  | 'report'
  | 'indicator'
  | 'data_query'
  | 'risk'
  | 'supervise'
  | 'case'
  | 'policy'
  | 'knowledge'
  | 'greeting'
  | 'help'
  | 'thanks'
  | 'followup'
  | 'general'

function detectIntent(msg: string): IntentType {
  const m = msg.toLowerCase()

  if (m.match(/继续|然后|还有|详细|展开|第二个|具体|接着|再说|更多|深入/)) return 'followup'
  if (m.match(/分解|拆解|拆分|安排|部署|落实/)) return 'task_decompose'
  if (m.match(/进度|进展|完成|推进/)) return 'task_progress'
  if (m.match(/延期|滞后|拖延|卡点|堵塞/)) return 'task_delay'
  if (m.match(/绩效|考核|评价|评分|排名/)) return 'performance'
  if (m.match(/报告|汇报|总结|分析/)) return 'report'
  if (m.match(/指标|数据|统计|数字|趋势/)) return 'indicator'
  if (m.match(/多少|几个|数量|比例|占比/)) return 'data_query'
  if (m.match(/风险|预警|问题|异常|红灯/)) return 'risk'
  if (m.match(/督办|催办|整改|纠正/)) return 'supervise'
  if (m.match(/经验|案例|参考|借鉴|做法/)) return 'case'
  if (m.match(/制度|规定|规范|流程|政策/)) return 'policy'
  if (m.match(/知识|学习|培训|教程/)) return 'knowledge'
  if (m.match(/你好|您好|hi|hello|早上|下午|晚上/)) return 'greeting'
  if (m.match(/帮助|能做什么|功能|怎么用/)) return 'help'
  if (m.match(/谢谢|感谢|辛苦/)) return 'thanks'

  return 'general'
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRoleName(role: string): string {
  if (role === 'pfl') return '张总'
  if (role === 'pfm') return '李主任'
  return '管理员'
}

function getTimeGreet(): string {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

function buildDocPrefix(uploadedDocs: string[]): string {
  if (uploadedDocs.length === 0) return ''
  if (uploadedDocs.length === 1) return `基于您上传的「${uploadedDocs[0]}」，`
  return `基于您上传的${uploadedDocs.length}份文档，`
}

const REPLY_MAP: Record<string, Array<(ctx: ConversationContext) => string>> = {
  task_decompose: [
    (ctx) => {
      const prefix = buildDocPrefix(ctx.uploadedDocs)
      return `${prefix}📋 已为您进行年度任务智能分解：\n\n基于《2024年市政府工作报告重点任务清单》，共识别出涉及发改委职责的任务12项，已按处室职责精准匹配：\n\n1️⃣ 京津冀协同规划 → 协同政策处\n2️⃣ "一带一路"服务 → 开放处、空铁处\n3️⃣ 非首都功能疏解 → 协同疏解处\n4️⃣ 数字经济标杆 → 高技术处\n5️⃣ 营商环境改革 → 营商改革处\n\n每项任务已设定时间节点和量化指标。是否需要查看某项任务的详细分解？`
    },
    (ctx) => {
      const prefix = buildDocPrefix(ctx.uploadedDocs)
      return `${prefix}🔍 任务分解完成！本次共分解88条重点任务中涉及发改委的12项：\n\n✅ 已匹配处室：8个\n⚠️ 需跨处室协作：3项\n🔴 存在延期风险：2项\n\n建议优先关注：\n• 营商环境6.0改革 — 需本季度完成方案\n• 碳达峰政策体系 — 2个子项滞后\n\n需要我生成详细的任务分解表吗？`
    },
    (ctx) => {
      const prefix = buildDocPrefix(ctx.uploadedDocs)
      return `${prefix}已根据三份参考材料完成智能分解：\n\n📊 分解结果概览：\n• 市政府工作报告任务：88条 → 涉及发改委12条\n• 考评方案对应指标：6项核心指标\n• 涉及处室：8个业务处室\n\n🎯 关键发现：\n1. 开放处任务最重（3项牵头）\n2. 协同政策处跨部门协调需求最大\n3. 2项任务存在时间冲突\n\n要查看完整分解表格，请点击左侧"任务分解"菜单。`
    },
    (ctx) => {
      const prefix = buildDocPrefix(ctx.uploadedDocs)
      return `${prefix}📌 年度任务智能分解结果：\n\n按优先级排列：\n\n🔴 紧急且重要（3项）：\n  • 营商环境6.0改革方案 — Q3前完成\n  • 碳达峰政策体系构建 — 2个子项滞后\n  • 数字经济标杆城市建设 — 需跨5处室协同\n\n🟡 重要不紧急（5项）：\n  • 京津冀协同发展规划中期评估\n  • "一带一路"服务能力提升\n  • 非首都功能疏解跟踪\n  • 战略性新兴产业培育\n  • 绿色金融创新试点\n\n🟢 常规推进（4项）：\n  • 经济运行监测分析\n  • 价格调控与监管\n  • 信用体系建设\n  • 固定资产投资管理\n\n需要我针对某项任务生成详细执行计划吗？`
    },
  ],

  task_progress: [
    (ctx) => {
      const roleLabel = ctx.role === 'pfl' ? '从全局视角看' : '从操作层面看'
      return `📊 ${roleLabel}，当前重点任务推进情况：\n\n✅ 已完成（3项）：\n  • Q1经济运行分析报告 — 100%\n  • 营商环境5.0评估 — 100%\n  • 春季重点项目集中开工 — 100%\n\n🔄 进行中（5项）：\n  • 营商环境6.0改革方案 — 72%\n  • 碳达峰政策体系 — 58%\n  • 数字经济标杆方案 — 65%\n  • 京津冀协同中期评估 — 45%\n  • "一带一路"服务提升 — 80%\n\n⚠️ 需关注：碳达峰政策体系进度偏慢，建议增加资源投入。`
    },
    (ctx) => {
      return `📈 任务推进总览：\n\n全委重点任务：12项\n整体完成率：67.3%\n\n按处室进度排名：\n1. 协同疏解处 — 85% 🏆\n2. 开放处 — 78%\n3. 高技术处 — 72%\n4. 营商改革处 — 68%\n5. 协同政策处 — 55% ⚠️\n\n💡 建议：协同政策处需重点关注，2项任务接近预警线。`
    },
    (ctx) => {
      return `📋 本周任务推进快报：\n\n🟢 进展顺利：\n  • "一带一路"服务能力提升 — 本周完成3个节点\n  • 固定资产投资管理 — 数据采集完成\n\n🟡 正常推进：\n  • 数字经济标杆方案 — 本周完成初稿\n  • 营商环境6.0改革 — 征求意见中\n\n🔴 需协调：\n  • 碳达峰政策体系 — 等待上级文件，建议先推进可独立开展部分\n  • 京津冀协同评估 — 数据获取存在困难\n\n是否需要我生成详细的周报？`
    },
  ],

  task_delay: [
    (ctx) => {
      return `⚠️ 延期风险任务分析：\n\n🔴 高风险延期（2项）：\n  1. 碳达峰政策体系\n     • 原定完成：6月30日\n     • 当前进度：58%（应达75%）\n     • 延期原因：等待国家发改委指导文件\n     • 影响范围：3个关联处室\n     • 建议：先完成可独立推进的4个子项\n\n  2. 京津冀协同中期评估\n     • 原定完成：7月15日\n     • 当前进度：45%（应达60%）\n     • 延期原因：数据获取困难，2个区未按时提交\n     • 影响范围：全委考核指标\n     • 建议：启动催办机制，设定数据提交最后期限\n\n🟡 潜在风险（1项）：\n  • 数字经济标杆方案 — 进度65%，如不加速可能延期2周\n\n需要我生成延期任务处置方案吗？`
    },
    (ctx) => {
      return `🚨 滞后任务预警报告：\n\n当前存在滞后风险的任务共3项，占全委任务的25%：\n\n📌 滞后原因分析：\n• 外部依赖（等文件/等数据）：2项\n• 内部资源不足：1项\n• 跨部门协调不畅：1项\n\n🎯 建议措施：\n1. 对外部依赖项，先推进可独立完成部分，并行等待\n2. 对资源不足项，建议从低优先级任务调配1名骨干\n3. 对跨部门协调项，建议提请分管委领导协调会\n\n是否需要我为某项任务制定详细的追赶计划？`
    },
  ],

  performance: [
    (ctx) => {
      if (ctx.role === 'pfl') {
        return `📊 ${ctx.displayName}，绩效分析报告已生成：\n\n🏆 本季度排名：\n1. 战略部 92分 A级 ↑5.2%\n2. 财务部 90分 A级 ↑2.1%\n3. 运营部 87分 B级 → 持平\n4. 技术部 85分 B级 ↑1.5%\n5. 市场部 83分 B级 ↓0.8%\n6. 人力部 80分 B级 ↑0.5%\n7. 行政部 76分 C级 ↓3.8%\n8. 后勤部 74分 C级 ↓1.2%\n\n⚠️ 重点关注：\n• 行政部连续两季度下降，建议启动绩效改进计划\n• 信息中心数字化转型指标完成率仅45%\n\n💡 决策建议：\n1. 对C级部门启动绩效面谈\n2. 参考A级部门经验进行经验推广\n3. 建议下季度增设"跨部门协作"加分项\n\n是否需要生成详细的绩效改进建议？`
      }
      return `📊 绩效分析报告已生成：\n\n🏆 本季度排名：\n1. 战略部 92分 A级 ↑5.2%\n2. 财务部 90分 A级 ↑2.1%\n3. 运营部 87分 B级 → 持平\n...\n7. 行政部 76分 C级 ↓3.8%\n\n⚠️ 重点关注：\n• 行政部连续两季度下降，建议启动绩效改进计划\n• 信息中心数字化转型指标完成率仅45%\n\n是否需要生成详细的绩效改进建议？`
    },
    (ctx) => {
      return `📈 绩效考核情况汇总：\n\n全委平均分：85.3分\nA级部门：2个（战略部、财务部）\nB级部门：4个\nC级部门：2个（行政部、后勤部）\n\n💡 AI建议：\n1. 行政部建议参考财务部的预算管控经验\n2. 信息中心需增加数字化转型资源投入\n3. 建议建立跨部门协作机制提升整体效能\n\n需要我导出完整绩效报告吗？`
    },
    (ctx) => {
      return `📊 绩效趋势分析：\n\n近4个季度变化趋势：\n\n📈 上升部门：\n  • 战略部：82→85→89→92（持续上升🏆）\n  • 财务部：86→88→89→90（稳步上升）\n\n📉 下降部门：\n  • 行政部：82→80→79→76（连续3季度下降⚠️）\n  • 后勤部：78→77→76→74（缓慢下滑）\n\n➡️ 持平部门：\n  • 运营部：86→87→87→87（稳定但缺乏突破）\n\n🎯 关键洞察：\n1. 战略部上升主要得益于"创新项目"加分项\n2. 行政部下降与"服务满意度"指标直接相关\n3. 建议运营部设定突破性目标\n\n需要查看某个部门的详细绩效画像吗？`
    },
  ],

  report: [
    (ctx) => {
      const prefix = buildDocPrefix(ctx.uploadedDocs)
      return `${prefix}📝 正在为您生成综合分析报告，报告框架如下：\n\n一、总体运行情况\n  • 主要经济指标完成情况\n  • 重点任务推进概况\n  • 绩效考核总体评价\n\n二、亮点与成效\n  • 3项超额完成指标\n  • 2个创新实践案例\n  • 4项获上级肯定工作\n\n三、问题与挑战\n  • 2项滞后任务分析\n  • 3个风险预警事项\n  • 资源配置瓶颈\n\n四、对策建议\n  • 短期：5项立行立改措施\n  • 中期：3项制度优化建议\n  • 长期：2项战略调整方向\n\n报告预计3分钟内生成完毕，是否需要调整报告内容或侧重点？`
    },
    (ctx) => {
      return `📋 报告生成中，请稍候...\n\n已根据当前数据自动生成以下报告模块：\n\n✅ 经济运行分析模块 — 数据已就绪\n✅ 任务推进跟踪模块 — 数据已就绪\n✅ 绩效考核汇总模块 — 数据已就绪\n⏳ 风险预警分析模块 — 正在计算\n⏳ 对策建议模块 — 正在生成\n\n💡 智能发现：\n• 本季度GDP增速7.2%，略低于目标7.5%\n• 固定资产投资增速12.3%，超预期\n• 营商环境改革获市场主体好评率92%\n\n报告完成后将自动推送到您的待办列表。需要优先查看哪个模块？`
    },
  ],

  indicator: [
    (ctx) => {
      return `📊 当前核心指标数据如下：\n\n🔹 GDP增速：7.2%（目标7.5%）⚠️ 略低于目标\n🔹 固定资产投资：同比增长12.3% ✅ 超预期\n🔹 规上工业增加值：增长8.1% ✅ 达标\n🔹 社会消费品零售总额：增长9.5% ✅ 达标\n🔹 居民消费价格指数：102.1 ✅ 温和上涨\n🔹 城镇新增就业：12.8万人 ✅ 超额完成\n\n📈 趋势判断：\n• 经济运行总体平稳，GDP增速需关注\n• 投资和消费双轮驱动效果明显\n• 就业形势好于预期\n\n需要查看某项指标的历史趋势图吗？`
    },
    (ctx) => {
      return `📈 指标监测仪表盘：\n\n🟢 达标指标（4项）：\n  • 固定资产投资增速 12.3% > 目标10%\n  • 规上工业增加值增速 8.1% > 目标7%\n  • 社零总额增速 9.5% > 目标8%\n  • 城镇新增就业 12.8万 > 目标12万\n\n🟡 接近达标（1项）：\n  • GDP增速 7.2% < 目标7.5%（差距0.3个百分点）\n\n🔴 预警指标（1项）：\n  • 高技术制造业占比 28.5% < 目标30%（差距1.5个百分点）\n\n💡 建议：\n1. GDP增速可通过加速重点项目落地提升0.2-0.3个百分点\n2. 高技术制造业需加大招商引资力度\n\n需要我生成指标追赶方案吗？`
    },
    (ctx) => {
      return `📊 核心经济指标速览：\n\n┌─────────────────────┬────────┬────────┬──────┐\n│ 指标名称           │ 当前值 │ 目标值 │ 状态 │\n├─────────────────────┼────────┼────────┼──────┤\n│ GDP增速            │ 7.2%   │ 7.5%   │ 🟡   │\n│ 固定资产投资增速   │ 12.3%  │ 10%    │ 🟢   │\n│ 规上工业增加值增速 │ 8.1%   │ 7%     │ 🟢   │\n│ 社零总额增速       │ 9.5%   │ 8%     │ 🟢   │\n│ 高技术制造业占比   │ 28.5%  │ 30%    │ 🔴   │\n│ 城镇新增就业       │ 12.8万 │ 12万   │ 🟢   │\n└─────────────────────┴────────┴────────┴──────┘\n\n达标率：4/6（66.7%）\n整体评估：经济运行平稳，需关注GDP增速和高技术制造业占比两项指标。`
    },
  ],

  data_query: [
    (ctx) => {
      return `📊 数据查询结果：\n\n当前关键数据概览：\n\n🔢 任务数据：\n  • 重点任务总数：12项\n  • 已完成：3项（25%）\n  • 进行中：5项（42%）\n  • 待启动：4项（33%）\n\n📈 绩效数据：\n  • 全委平均分：85.3分\n  • A级部门：2个（25%）\n  • B级部门：4个（50%）\n  • C级部门：2个（25%）\n\n⚠️ 风险数据：\n  • 红灯项目：3个\n  • 黄灯项目：2个\n  • 绿灯项目：7个\n\n需要查看更详细的分类数据吗？`
    },
    (ctx) => {
      return `📈 按您的要求，汇总关键数据：\n\n本季度核心数据：\n\n1️⃣ 任务完成率：67.3%\n   较上季度提升5.2个百分点\n\n2️⃣ 绩效达标率：75%\n   6个部门中4个达标\n\n3️⃣ 风险控制率：58.3%\n   5个风险项中3个已处置\n\n4️⃣ 文档处理量：47份\n   较上季度增长12%\n\n5️⃣ 协同效率：82分\n   跨部门协作满意度评分\n\n需要导出数据报表吗？`
    },
  ],

  risk: [
    (ctx) => {
      return `🔴 风险项目分析结果：\n\n🔴 高风险（1项）：\n  • 智慧园区项目\n    进度滞后32%，资金缺口1200万\n    责任处室：高技术处\n    影响等级：★★★★★\n    建议措施：立即启动应急方案，申请追加预算\n\n🟡 中风险（2项）：\n  • 人才公寓建设\n    审批流程卡点，预计延期1个月\n    责任处室：人事处\n    影响等级：★★★☆☆\n    建议措施：协调审批部门加急处理\n\n  • 碳达峰政策体系\n    等待上级文件，2个子项无法推进\n    责任处室：环资处\n    影响等级：★★★☆☆\n    建议措施：先推进可独立开展部分\n\n🟢 低风险（1项）：\n  • 数字政务平台 — 按计划推进，完成度85%\n\n建议优先关注智慧园区项目，是否需要生成风险处置方案？`
    },
    (ctx) => {
      return `⚠️ 风险预警全景图：\n\n当前风险项目：4个\n风险指数：62.5（中等偏高）\n\n📊 风险分布：\n  资金风险：1项（智慧园区）\n  审批风险：1项（人才公寓）\n  政策依赖风险：1项（碳达峰）\n  技术风险：1项（数字政务，已可控）\n\n🕐 风险时间线：\n  本周需处置：智慧园区资金问题\n  下周需关注：人才公寓审批进展\n  本月需跟进：碳达峰政策文件出台\n\n🎯 处置优先级建议：\n1. 智慧园区 — 本周内提交追加预算申请\n2. 人才公寓 — 本周协调审批部门\n3. 碳达峰 — 持续跟踪，做好两手准备\n\n需要我为某个风险项目制定详细的处置方案吗？`
    },
    (ctx) => {
      return `🚨 风险扫描报告：\n\n经AI智能扫描，当前系统识别到以下风险信号：\n\n🔴 红灯预警（需立即处理）：\n  智慧园区项目 — 连续3周进度落后，资金消耗率异常\n  → 建议今日召开专题协调会\n\n🟡 黄灯提醒（需密切关注）：\n  碳达峰政策体系 — 外部依赖未解除\n  → 建议准备B方案\n  人才公寓建设 — 审批流程停滞\n  → 建议提请分管领导协调\n\n🟢 绿灯正常：\n  其余9项任务运行正常\n\n📊 风险趋势：\n  较上月：红灯项目+1，黄灯项目持平\n  整体风险等级：中等偏高\n\n需要我生成风险处置方案并下发督办通知吗？`
    },
  ],

  supervise: [
    (ctx) => {
      return `📋 督办事项管理：\n\n当前待督办事项：5项\n\n🔴 紧急督办（2项）：\n  1. 智慧园区项目资金追加申请\n     督办对象：高技术处\n     截止时间：本周五\n     当前状态：未响应\n\n  2. 人才公寓审批协调\n     督办对象：人事处\n     截止时间：下周三\n     当前状态：处理中\n\n🟡 常规督办（3项）：\n  3. Q2经济运行分析报告提交\n  4. 碳达峰政策体系进展汇报\n  5. 数字政务平台月度检查\n\n是否需要我发送督办通知？`
    },
    (ctx) => {
      return `🔔 催办任务清单：\n\n以下事项已超过预期完成时间或即将到期：\n\n⚠️ 已逾期（1项）：\n  • 智慧园区项目周报 — 逾期3天\n    → 建议立即催办\n\n⏰ 即将到期（2项）：\n  • 人才公寓审批进展 — 还剩3天\n  • Q2经济运行分析 — 还剩5天\n\n📌 建议催办方式：\n1. 已逾期项：发送加急催办通知+抄送分管领导\n2. 即将到期项：发送温馨提醒\n\n需要我执行催办操作吗？`
    },
  ],

  case: [
    (ctx) => {
      return `📖 为您推荐以下经验案例：\n\n📘 案例1：某市"一网通办"改革实践\n  关键词：流程再造、数据共享\n  成效：群众满意度提升23%，办事时限缩短65%\n  可借鉴度：★★★★★\n\n📗 案例2：某区产业链招商创新模式\n  关键词：精准招商、产业链图谱\n  成效：引资额增长45%，新兴产业占比提升12%\n  可借鉴度：★★★★☆\n\n📙 案例3：某县基层治理数字化转型\n  关键词：网格化管理、AI辅助决策\n  成效：处置效率提升60%，投诉量下降35%\n  可借鉴度：★★★★☆\n\n📕 案例4：某省营商环境5.0改革经验\n  关键词：制度创新、市场活力\n  成效：市场主体增长28%，营商环境排名上升15位\n  可借鉴度：★★★★★\n\n点击案例可查看详情，或告诉我您关注哪个领域。`
    },
    (ctx) => {
      return `🔍 根据当前工作重点，智能推荐相关案例：\n\n与"营商环境改革"相关：\n  📌 上海浦东"证照分离"改革\n  📌 深圳前海"秒批"制度创新\n  📌 浙江义乌"无证明城市"实践\n\n与"数字经济"相关：\n  📌 杭州"城市大脑"建设经验\n  📌 贵阳大数据产业培育模式\n  📌 成都数字文创产业生态构建\n\n与"碳达峰"相关：\n  📌 深圳碳排放权交易试点\n  📌 雄安新区绿色建筑标准\n  📌 苏州工业园区循环经济模式\n\n每个案例我都整理了详细的做法、成效和可借鉴要点。需要深入了解哪个？`
    },
  ],

  policy: [
    (ctx) => {
      return `📜 相关制度政策查询：\n\n📌 绩效考核制度：\n  • 《发改委绩效考核管理办法》（2024版）\n  • 《绩效指标设定与调整规范》\n  • 《绩效面谈与改进指导手册》\n\n📌 任务管理制度：\n  • 《重点任务分解与督办办法》\n  • 《跨部门协作工作规范》\n  • 《任务延期审批流程》\n\n📌 风险管理制度：\n  • 《项目风险预警与处置办法》\n  • 《重大事项报告制度》\n\n需要查看某项制度的详细内容吗？`
    },
    (ctx) => {
      return `📋 政策法规速查：\n\n近期更新政策：\n\n🆕 新发布：\n  • 《关于优化营商环境的实施意见》— 2024.03\n  • 《碳达峰碳中和行动方案》— 2024.02\n\n📝 修订中：\n  • 《绩效考核管理办法》— 预计Q3完成修订\n  • 《重点任务分解规范》— 征求意见阶段\n\n📊 政策执行情况：\n  • 营商环境实施意见 — 执行率82%\n  • 碳达峰行动方案 — 执行率58%\n\n需要我对比新旧政策差异，或查看执行情况详情吗？`
    },
  ],

  knowledge: [
    (ctx) => {
      return `📚 知识库与学习资源：\n\n🎓 在线课程：\n  1. 绩效管理实战 — 2.5小时\n  2. 政府数字化转型 — 3小时\n  3. 公文写作规范 — 1.5小时\n  4. 数据分析方法 — 2小时\n\n📖 知识专题：\n  • 营商环境改革知识图谱\n  • 碳达峰碳中和政策解读\n  • 数字经济发展趋势\n  • 京津冀协同发展要点\n\n🧠 能力测评：\n  • 绩效管理能力自测\n  • 数据分析能力评估\n  • 公文写作水平测试\n\n需要我推荐适合您的学习路径吗？`
    },
  ],

  greeting: [
    (ctx) => {
      const name = getRoleName(ctx.role)
      const greet = getTimeGreet()
      return `${name}，${greet}！👋\n\n我是智理助手，随时为您效劳。\n\n📊 当前系统状态：\n• 重点任务：12项（3项需关注）\n• 风险预警：3个红灯项目\n• 待办事项：5项\n\n有什么可以帮您的？`
    },
    (ctx) => {
      const name = getRoleName(ctx.role)
      const greet = getTimeGreet()
      return `${name}，${greet}！😊\n\n智理助手已就绪，今日为您准备了以下工作摘要：\n\n📌 今日重点：\n  • 智慧园区项目需提交资金追加申请\n  • 人才公寓审批进展需跟进\n  • Q2经济运行分析报告本周截止\n\n💡 您可以说：\n  • "查看任务进度"\n  • "分析风险项目"\n  • "生成绩效报告"\n\n请问需要什么帮助？`
    },
    (ctx) => {
      const name = getRoleName(ctx.role)
      const greet = getTimeGreet()
      return `${greet}，${name}！🌟\n\n很高兴为您服务！\n\n🎯 今日AI洞察：\n基于最新数据分析，有2项建议供您参考：\n1. 碳达峰政策体系建议准备B方案\n2. 战略部绩效经验值得全委推广\n\n需要我详细展开吗？`
    },
  ],

  help: [
    (ctx) => {
      return `🤖 智理助手功能指南：\n\n📋 任务管理：\n  • "分解年度任务" — 智能拆解重点任务\n  • "查看任务进度" — 跟踪任务推进情况\n  • "分析延期任务" — 识别滞后风险\n\n📊 绩效分析：\n  • "生成绩效报告" — 自动生成分析报告\n  • "查看考核排名" — 部门绩效对比\n  • "绩效趋势分析" — 多季度变化趋势\n\n📈 数据查询：\n  • "查询指标数据" — 核心经济指标\n  • "数据统计" — 关键数据汇总\n\n⚠️ 风险管理：\n  • "分析风险项目" — 风险识别与评估\n  • "督办催办" — 事项催办管理\n\n📖 知识参考：\n  • "推荐经验案例" — 优秀实践参考\n  • "查询政策制度" — 制度规范查询\n\n💡 您也可以直接用自然语言提问，我会智能理解您的需求！`
    },
  ],

  thanks: [
    (ctx) => {
      return pickRandom([
        '不客气！随时为您服务。如果还有其他问题，请随时告诉我 😊',
        '很高兴能帮到您！有需要随时找我 💪',
        '您太客气了！这是我应该做的。还有其他需要帮助的吗？🌟',
        '感谢您的认可！我会继续努力为您提供更好的服务 🤝',
      ])
    },
  ],
}

const FOLLOWUP_MAP: Record<string, Array<(ctx: ConversationContext) => string>> = {
  task_decompose: [
    (ctx) => `好的，继续为您展开任务分解的详细内容：\n\n📌 营商环境6.0改革方案（营商改革处牵头）：\n\n子任务分解：\n1. 市场准入便利化改革 — 6月完成\n2. 政务服务标准化提升 — 7月完成\n3. 监管执法优化 — 8月完成\n4. 公共服务数字化 — 9月完成\n5. 法治保障体系完善 — 10月完成\n\n资源配置：\n• 需要专职人员：5人\n• 预算需求：280万元\n• 外部协作：市场监管局、政务服务局\n\n需要查看其他任务的详细分解吗？`,
    (ctx) => `继续展开任务分解详情：\n\n📌 碳达峰政策体系构建（环资处牵头）：\n\n阶段划分：\n🔹 第一阶段（Q2）：政策框架搭建\n  • 碳排放核算标准制定\n  • 重点排放单位清单梳理\n\n🔹 第二阶段（Q3）：政策文件编制\n  • 碳达峰行动方案\n  • 行业减排路线图\n\n🔹 第三阶段（Q4）：政策落地实施\n  • 试点示范项目启动\n  • 碳排放权交易机制完善\n\n⚠️ 当前卡点：等待国家发改委指导文件，第一阶段2个子项无法推进。\n\n需要查看其他任务吗？`,
  ],
  task_progress: [
    (ctx) => `继续为您补充任务进度详情：\n\n📌 营商环境6.0改革方案 — 进度72%：\n\n✅ 已完成节点：\n  • 市场准入便利化改革（100%）\n  • 政务服务标准化提升（100%）\n\n🔄 进行中：\n  • 监管执法优化（65%）— 征求意见阶段\n  • 公共服务数字化（40%）— 系统开发中\n\n⏳ 待启动：\n  • 法治保障体系完善\n\n预计可按期完成，但需加速公共服务数字化进度。`,
  ],
  performance: [
    (ctx) => `继续为您展开绩效分析：\n\n📌 战略部绩效画像（92分，A级）：\n\n优势指标：\n  • 创新项目加分：+8分（全委最高）\n  • 任务完成率：95%\n  • 跨部门协作评分：90分\n\n提升空间：\n  • 文档规范性：82分（低于平均）\n  • 时效性：88分（有1项延期1天）\n\n经验亮点：\n  创新项目"产业链图谱"获上级肯定，建议全委推广。\n\n需要查看其他部门的绩效画像吗？`,
  ],
  risk: [
    (ctx) => `继续为您展开风险处置方案：\n\n📌 智慧园区项目风险处置方案：\n\n一、问题诊断\n  • 根因：前期规划不足，预算编制偏低\n  • 影响：项目整体延期风险，可能影响年度考核\n\n二、处置措施\n  短期（本周）：\n  1. 提交追加预算申请1200万\n  2. 调整项目里程碑，重新排期\n  3. 增派2名项目骨干支援\n\n  中期（本月）：\n  1. 建立周报机制，实时监控\n  2. 与施工方重新谈判工期\n  3. 启动备用供应商评估\n\n三、预期效果\n  如措施落实，预计可将延期控制在2周以内。\n\n需要我将此方案转为正式督办通知吗？`,
  ],
  indicator: [
    (ctx) => `继续为您展开指标详情：\n\n📌 GDP增速指标深度分析：\n\n当前值：7.2%  目标值：7.5%  差距：0.3个百分点\n\n分产业贡献：\n  • 第一产业：0.2个百分点（持平）\n  • 第二产业：2.8个百分点（下降0.1）\n  • 第三产业：4.2个百分点（上升0.2）\n\n追赶路径分析：\n  方案A：加速重点项目落地 → 预计提升0.2个百分点\n  方案B：促进消费回暖 → 预计提升0.1个百分点\n  方案C：A+B组合 → 预计提升0.3个百分点（推荐✅）\n\n需要我生成详细的指标追赶方案吗？`,
  ],
  report: [
    (ctx) => `继续为您展开报告内容：\n\n📌 第一部分：总体运行情况\n\n一、主要经济指标\n  GDP增速7.2%，固定资产投资增长12.3%，\n  社零总额增长9.5%，就业超额完成目标。\n\n二、重点任务推进\n  12项重点任务中，3项已完成，5项正常推进，\n  2项存在延期风险，2项待启动。\n\n三、绩效考核评价\n  全委平均分85.3分，较上季度提升1.2分，\n  A级部门2个，C级部门2个。\n\n需要我继续展开第二部分"亮点与成效"吗？`,
  ],
  case: [
    (ctx) => `继续为您展开案例详情：\n\n📌 案例1：某市"一网通办"改革实践\n\n背景：\n  该市原有审批事项1200余项，平均办事时限15个工作日，\n  群众满意度仅68%。\n\n做法：\n  1. 事项标准化 — 统一1200项事项的申请材料和办理流程\n  2. 数据共享 — 打通32个部门数据壁垒，实现"一次提交"\n  3. 流程再造 — 推行"秒批秒办"事项186项\n  4. 智能辅助 — AI预审+人工复核，审核效率提升3倍\n\n成效：\n  • 办事时限缩短65%\n  • 群众满意度提升至91%\n  • 政务服务成本降低40%\n\n可借鉴要点：\n  ✅ 事项标准化是基础\n  ✅ 数据共享是关键\n  ✅ 流程再造出效率\n\n需要查看其他案例吗？`,
  ],
}

const GENERAL_REPLIES: Array<(ctx: ConversationContext) => string> = [
  (ctx) => {
    const prefix = buildDocPrefix(ctx.uploadedDocs)
    return `${prefix}收到您的消息，我正在分析相关信息。\n\n您可以尝试以下操作：\n\n• "分解年度任务" — 将目标拆解为可执行任务\n• "查看任务进度" — 跟踪任务推进情况\n• "生成绩效报告" — 自动生成绩效分析报告\n• "查询指标数据" — 查看核心经济指标\n• "分析风险项目" — 识别和评估项目风险\n• "推荐经验案例" — 获取优秀实践参考\n• "查询政策制度" — 了解相关制度规范\n\n请告诉我您需要什么帮助？`
  },
  (ctx) => {
    return `我理解您的问题，让我为您梳理一下：\n\n基于当前系统数据，我可以为您提供以下方面的支持：\n\n📊 数据类：指标查询、数据统计、趋势分析\n📋 任务类：任务分解、进度跟踪、延期预警\n📈 绩效类：绩效报告、考核排名、改进建议\n⚠️ 风险类：风险识别、预警提醒、处置方案\n📖 知识类：经验案例、政策制度、培训学习\n\n请用更具体的关键词描述您的需求，我会给出更精准的回答！`
  },
  (ctx) => {
    const hour = new Date().getHours()
    const timeTip = hour < 12 ? '上午精力充沛，适合处理重要决策' : hour < 18 ? '下午适合跟进推进和协调沟通' : '晚上适合总结复盘和规划明日'
    return `好的，我来帮您分析。\n\n💡 ${timeTip}。\n\n您可以直接告诉我：\n• 想了解什么数据？\n• 需要处理什么任务？\n• 想查看什么报告？\n\n我会根据您的需求提供最相关的信息和建议。`
  },
]

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content:
      '您好！我是智理助手，您的AI效能伙伴。我可以帮您分解任务、查询数据、生成报告、分析风险。请问有什么可以帮您的？',
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

function generateSmartReply(
  userMsg: string,
  context: ConversationContext
): { reply: string; topic: string } {
  const intent = detectIntent(userMsg)

  if (intent === 'followup') {
    const lastTopic = context.topic
    if (lastTopic && FOLLOWUP_MAP[lastTopic]) {
      return { reply: pickRandom(FOLLOWUP_MAP[lastTopic])(context), topic: lastTopic }
    }
    if (lastTopic && REPLY_MAP[lastTopic]) {
      return { reply: pickRandom(REPLY_MAP[lastTopic])(context), topic: lastTopic }
    }
    return {
      reply: `好的，请问您想继续了解哪方面的内容？\n\n您可以告诉我具体的方向，比如：\n• 任务的详细分解\n• 绩效的深入分析\n• 指标的具体数据\n• 风险的处置方案\n\n我会为您继续展开。`,
      topic: lastTopic,
    }
  }

  const topicMap: Record<string, string> = {
    task_decompose: 'task_decompose',
    task_progress: 'task_progress',
    task_delay: 'task_delay',
    performance: 'performance',
    report: 'report',
    indicator: 'indicator',
    data_query: 'indicator',
    risk: 'risk',
    supervise: 'supervise',
    case: 'case',
    policy: 'policy',
    knowledge: 'knowledge',
  }

  const topic = topicMap[intent] || ''

  if (intent === 'greeting') {
    return { reply: pickRandom(REPLY_MAP.greeting)(context), topic: '' }
  }
  if (intent === 'help') {
    return { reply: pickRandom(REPLY_MAP.help)(context), topic: '' }
  }
  if (intent === 'thanks') {
    return { reply: pickRandom(REPLY_MAP.thanks)(context), topic }
  }

  if (REPLY_MAP[intent]) {
    return { reply: pickRandom(REPLY_MAP[intent])(context), topic }
  }

  return { reply: pickRandom(GENERAL_REPLIES)(context), topic }
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
  const [lastTopic, setLastTopic] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const currentUser = useAppStore((s) => s.currentUser)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, aiStatus])

  const buildContext = useCallback((): ConversationContext => {
    const recentHistory = messages
      .slice(-6)
      .map((m) => m.content)
    return {
      role: currentUser?.role || 'admin',
      displayName: currentUser?.displayName || '管理员',
      history: recentHistory,
      uploadedDocs: uploadedDocs.map((d) => d.name),
      topic: lastTopic,
    }
  }, [messages, uploadedDocs, lastTopic, currentUser])

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

    const ctx = buildContext()

    setTimeout(() => {
      const { reply, topic } = generateSmartReply(content, ctx)
      setLastTopic(topic)
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
      content: `📎 已收到文档「${file.name}」(${sizeKB} KB)，我已开始分析。\n\n您可以向我提问关于这份文档的内容，例如：\n• "帮我总结文档要点"\n• "提取文档中的关键指标"\n• "根据文档分解相关任务"\n\n我会基于文档内容为您提供更精准的回答。`,
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
