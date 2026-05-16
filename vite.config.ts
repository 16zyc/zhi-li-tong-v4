import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import cdn from 'vite-plugin-cdn-import'

export default defineConfig({
  base: './',
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-router': ['react-router-dom'],
          'vendor-echarts': ['echarts', 'echarts-for-react'],
          'vendor-utils': ['zustand', 'clsx', 'tailwind-merge', 'lucide-react'],
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    cdn({
      modules: [
        {
          name: 'react',
          var: 'React',
          path: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
        },
        {
          name: 'react-dom',
          var: 'ReactDOM',
          path: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
        },
        {
          name: 'antd',
          var: 'antd',
          path: 'https://cdn.jsdelivr.net/npm/antd@5.29.3/dist/antd.min.js',
          css: 'https://cdn.jsdelivr.net/npm/antd@5.29.3/dist/reset.min.css',
        },
        {
          name: 'dayjs',
          var: 'dayjs',
          path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.20/dayjs.min.js',
        },
      ],
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths()
  ],
})
