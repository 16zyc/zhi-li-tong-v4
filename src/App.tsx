import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppLayout from '@/components/Layout/AppLayout'
import Home from '@/pages/Home/index'
import WorkflowIndex from '@/pages/Workflow/index'
import StageDetail from '@/pages/Workflow/StageDetail'
import ZhiCe from '@/pages/Dashboard/ZhiCe'
import ZhiGuan from '@/pages/Dashboard/ZhiGuan'
import ZhiBan from '@/pages/Dashboard/ZhiBan'
import ZhiXun from '@/pages/Dashboard/ZhiXun'
import ZhiPing from '@/pages/Dashboard/ZhiPing'
import ZhiXun2 from '@/pages/Dashboard/ZhiXun2'
import Indicator from '@/pages/Repository/Indicator'
import Knowledge from '@/pages/Repository/Knowledge'
import Performance from '@/pages/Repository/Performance'
import Case from '@/pages/Repository/Case'
import Graph from '@/pages/Repository/Graph'
import Chat from '@/pages/Chat/index'

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1a365d',
          borderRadius: 6,
          colorBgContainer: '#ffffff',
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(96, 165, 250, 0.15)',
            darkItemHoverBg: 'rgba(255, 255, 255, 0.06)',
          },
          Layout: {
            siderBg: '#1a365d',
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard/zhice" element={<ZhiCe />} />
            <Route path="/dashboard/zhiguan" element={<ZhiGuan />} />
            <Route path="/dashboard/zhiban" element={<ZhiBan />} />
            <Route path="/dashboard/zhixun" element={<ZhiXun />} />
            <Route path="/dashboard/zhiping" element={<ZhiPing />} />
            <Route path="/dashboard/zhixun2" element={<ZhiXun2 />} />
            <Route path="/repository/indicator" element={<Indicator />} />
            <Route path="/repository/knowledge" element={<Knowledge />} />
            <Route path="/repository/performance" element={<Performance />} />
            <Route path="/repository/case" element={<Case />} />
            <Route path="/repository/graph" element={<Graph />} />
            <Route path="/workflow" element={<WorkflowIndex />} />
            <Route path="/workflow/:stage" element={<StageDetail />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}
