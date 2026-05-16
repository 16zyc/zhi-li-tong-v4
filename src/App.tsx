import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/Layout/AppLayout'
import Home from '@/pages/Home/index'

const ZhiCe = lazy(() => import('@/pages/Dashboard/ZhiCe'))
const ZhiGuan = lazy(() => import('@/pages/Dashboard/ZhiGuan'))
const ZhiBan = lazy(() => import('@/pages/Dashboard/ZhiBan'))
const ZhiXun = lazy(() => import('@/pages/Dashboard/ZhiXun'))
const ZhiPing = lazy(() => import('@/pages/Dashboard/ZhiPing'))
const ZhiXun2 = lazy(() => import('@/pages/Dashboard/ZhiXun2'))
const Indicator = lazy(() => import('@/pages/Repository/Indicator'))
const Knowledge = lazy(() => import('@/pages/Repository/Knowledge'))
const Performance = lazy(() => import('@/pages/Repository/Performance'))
const Case = lazy(() => import('@/pages/Repository/Case'))
const Graph = lazy(() => import('@/pages/Repository/Graph'))
const WorkflowIndex = lazy(() => import('@/pages/Workflow/index'))
const StageDetail = lazy(() => import('@/pages/Workflow/StageDetail'))
const Chat = lazy(() => import('@/pages/Chat/index'))

const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
    <Spin size="large" tip="加载中..." />
  </div>
)

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
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}
