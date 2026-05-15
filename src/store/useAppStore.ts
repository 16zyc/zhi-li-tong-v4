import { create } from 'zustand'

interface AppState {
  collapsed: boolean
  currentRole: string
  chatMessages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    actionCards?: Array<{
      type: string
      title: string
      description: string
      status?: string
    }>
  }>
  toggleCollapsed: () => void
  setCurrentRole: (role: string) => void
  addChatMessage: (msg: AppState['chatMessages'][0]) => void
  clearChat: () => void
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  currentRole: '集团领导',
  chatMessages: [
    {
      id: '1',
      role: 'assistant',
      content: '张总，下午好！当前重点关注：3个红灯项目，2项临近节点。需要我为您汇报详情吗？',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
  ],
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setCurrentRole: (role) => set({ currentRole: role }),
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
}))
