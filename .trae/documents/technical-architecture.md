## 1. 架构设计

```mermaid
flowchart TB
    subgraph Frontend["前端层"]
        UI["React UI 组件"]
        Router["React Router 路由"]
        Store["Zustand 状态管理"]
        Charts["ECharts 图表"]
    end

    subgraph MockData["模拟数据层"]
        MockAPI["Mock 数据服务"]
        IndicatorData["指标库数据"]
        KnowledgeData["知识库数据"]
        PerformanceData["绩效库数据"]
        CaseData["经验案例库数据"]
        GraphData["知识图谱数据"]
        TaskData["任务流程数据"]
    end

    subgraph Libs["第三方库"]
        Antd["Ant Design 组件库"]
        EChartsLib["ECharts 图表库"]
        Lucide["Lucide Icons"]
        Dayjs["Day.js 日期库"]
    end

    UI --> Router
    UI --> Store
    UI --> Charts
    UI --> Antd
    Charts --> EChartsLib
    Store --> MockAPI
    MockAPI --> IndicatorData
    MockAPI --> KnowledgeData
    MockAPI --> PerformanceData
    MockAPI --> CaseData
    MockAPI --> GraphData
    MockAPI --> TaskData
```

## 2. 技术说明

- **前端框架**：React 18 + TypeScript + Vite
- **UI 组件库**：Ant Design 5.x
- **样式方案**：Tailwind CSS 3.x + Ant Design Token 主题定制
- **状态管理**：Zustand
- **路由**：React Router DOM 6.x
- **图表可视化**：ECharts 5.x（通过 echarts-for-react）
- **知识图谱可视化**：ECharts Graph（力导向布局）
- **图标**：Lucide React
- **日期处理**：Day.js
- **数据层**：前端 Mock 数据（无后端依赖）
- **初始化工具**：vite-init (react-ts 模板)

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| `/` | 总览首页 - 态势仪表盘 |
| `/dashboard/zhice` | 智策工作台 - 领导驾驶舱 |
| `/dashboard/zhiguan` | 智管工作台 - 部门工作台 |
| `/dashboard/zhiban` | 智办工作台 - 经办人助手 |
| `/dashboard/zhixun` | 智巡工作台 - 审计核验 |
| `/dashboard/zhiping` | 智评工作台 - 考核评价 |
| `/dashboard/zhixun2` | 智训工作台 - 知识助手 |
| `/repository/indicator` | 四库一图 - 指标库 |
| `/repository/knowledge` | 四库一图 - 知识库 |
| `/repository/performance` | 四库一图 - 绩效库 |
| `/repository/case` | 四库一图 - 经验案例库 |
| `/repository/graph` | 四库一图 - 知识图谱 |
| `/workflow` | 十大环节 - 流程全景 |
| `/workflow/:stage` | 十大环节 - 各环节详情 |
| `/chat` | 对话即操作 - AI对话 |

## 4. 数据模型

### 4.1 核心数据模型定义

```mermaid
erDiagram
    INDICATOR ||--o{ INDICATOR_DIMENSION : "属于维度"
    INDICATOR ||--o{ INDICATOR_TARGET : "有目标值"
    DEPARTMENT ||--o{ TASK : "负责任务"
    DEPARTMENT ||--o{ INDICATOR : "适用指标"
    PERSON ||--o{ TASK : "执行任务"
    PERSON }|--|| DEPARTMENT : "隶属"
    TASK ||--o{ TASK : "子任务"
    TASK ||--o{ RISK : "存在风险"
    TASK ||--o{ DOCUMENT : "产生文档"
    TASK }|--|| INDICATOR : "关联指标"
    CASE ||--o{ TASK : "参考案例"
    KNOWLEDGE ||--o{ DEPARTMENT : "职责依据"
```

### 4.2 模拟数据定义

所有数据使用 TypeScript 接口定义，存储在 `src/mock/` 目录下：

- `indicatorData.ts`：指标库数据（20+条指标）
- `knowledgeData.ts`：知识库数据（制度文件、部门职责、业务流程）
- `performanceData.ts`：绩效库数据（评分、排名、画像）
- `caseData.ts`：经验案例库数据（成功/失败/最佳实践案例）
- `graphData.ts`：知识图谱数据（实体、关系、节点位置）
- `taskData.ts`：任务流程数据（十大环节各阶段任务）
- `departmentData.ts`：部门与人员数据
