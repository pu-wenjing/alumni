# 时光纽带 - 校友录系统

一个现代化的校友社交平台，连接过去与未来的数字纽带。

## 项目简介

时光纽带是一个基于 Vue 3 + TypeScript 构建的校友录系统，提供校友管理、时光轴记录、班级密室、缘分雷达等功能模块，帮助校友们保持联系、分享回忆。

## 功能特性

### 🏠 首页
- 搜索校友、班级、年级或回忆
- 统计数据展示（班级数、活动数、同城校友）
- 数字递增动画效果
- 渐变发光搜索球

### ⏰ 时光轴
- 记录人生重要节点
- 左右交替时间线布局
- 滚动进度条动画
- 支持添加/编辑/删除节点
- 记忆胶囊功能

### 📡 缘分雷达
- 发现附近校友
- 按距离、行业、专业筛选
- 校友卡片展示
- 盲盒匹配功能

### 🏫 班级密室
- 班级列表管理
- 教室座位布局
- 在线状态显示
- 班级相册
- 课桌抽屉（私密留言）

### 💌 记忆胶囊
- 创建时间胶囊
- 设置开启日期
- 封存回忆

### 👤 个人中心
- 用户资料管理
- 登录/注册功能
- 主题切换（深色/浅色）

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS
- **动画**: GSAP
- **数据持久化**: LocalStorage

## 项目结构

```
alumni/
├── public/                  # 静态资源
│   └── graduate.png        # 背景图片
├── src/
│   ├── components/         # 组件
│   │   ├── features/       # 功能组件
│   │   │   ├── ChatWidget.vue      # 聊天组件
│   │   │   └── ParticleBackground.vue # 粒子背景
│   │   ├── layout/         # 布局组件
│   │   │   ├── Navigation.vue      # 导航栏
│   │   │   └── ProfilePanel.vue    # 个人面板
│   │   └── ui/             # UI组件
│   │       └── ThemeToggle.vue     # 主题切换
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── stores/             # 状态管理
│   │   ├── capsule.ts      # 胶囊状态
│   │   ├── theme.ts        # 主题状态
│   │   ├── timeline.ts     # 时光轴状态
│   │   └── user.ts         # 用户状态
│   ├── styles/             # 全局样式
│   │   └── main.css
│   ├── types/              # 类型定义
│   │   └── index.ts
│   ├── views/              # 页面视图
│   │   ├── CapsuleView.vue     # 记忆胶囊页
│   │   ├── ClassroomView.vue   # 班级密室页
│   │   ├── HomeView.vue        # 首页
│   │   ├── LoginView.vue       # 登录页
│   │   ├── ProfileView.vue     # 个人中心页
│   │   ├── RadarView.vue       # 缘分雷达页
│   │   └── TimelineView.vue    # 时光轴页
│   ├── App.vue             # 根组件
│   ├── env.d.ts            # 环境类型声明
│   └── main.ts             # 入口文件
├── design.html             # 设计稿
├── index.html              # HTML入口
├── package.json            # 项目配置
├── postcss.config.js       # PostCSS配置
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
├── tsconfig.node.json      # Node TypeScript配置
└── vite.config.ts          # Vite配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 设计说明

项目设计参考 `design.html` 设计稿，采用深色主题为主，玻璃态效果贯穿全局，配合粒子背景动画营造科技感。

### 主要设计元素

- **玻璃态效果**: 半透明背景 + 模糊滤镜
- **渐变色**: 蓝色到琥珀色的渐变主题
- **粒子背景**: Canvas 绘制的连接线粒子效果
- **动画**: GSAP 驱动的入场动画和交互动画

## 数据存储

项目使用 LocalStorage 进行数据持久化：

- `user`: 用户信息
- `timelineNodes`: 时光轴节点
- `capsules`: 记忆胶囊
- `theme`: 主题设置

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
