# 智家 · 家庭能源管理系统

本项目为基于 React 构建的家庭能源管理系统“智家”，旨在帮助用户可视化家庭用电情况，预测未来用电需求，并提供节能优化建议，从而实现经济、低碳、高效的家庭能源管理。

---

## 🏠 项目功能模块

### 1. 首页模块
- 展示今日用电、今日电费、碳排放量
- 模式切换：低碳 / 舒适 / 正常
- 环境贡献（累计碳减排）
- 家庭碳足迹和能耗排行榜

### 2. 用电统计模块
- 每日功率曲线图（总功率+电器功率）
- 电器功耗占比图（饼图）
- 历史每日用电量趋势图
- 本年度总用电柱状图

### 3. 用电预测模块
- 未来 24 小时的功率预测曲线
- 历史功率与预测功率对比图

### 4. 用电优化模块
- 三种个性化调度模式（低碳、舒适、正常）
- 基于预测数据的智能用电调度建议
- 多目标优化算法支持节能与舒适度平衡

---

## 📁 项目目录结构

```bash
Power_management/
├── energy-dashboard/            # 主项目文件夹
│   ├── public/                  # 公共资源
│   │   ├── forecast/            # 预测相关静态数据
│   │   ├── history_power/       # 历史用电量数据
│   │   └── power_data/          # 每日功率数据
│   ├── src/                     # 前端源码
│   │   ├── components/          # 通用组件
│   │   ├── forecast/            # 预测模块组件
│   │   │   ├── ForecastLineChart.js
│   │   │   └── HistoryForecastLineChart.js
│   │   ├── management/          # 用电分析模块组件
│   │   │   ├── Barchart.js
│   │   │   ├── Filter.js
│   │   │   ├── HistoryPower.js
│   │   │   ├── LineChart.js
│   │   │   └── PieChart.js
│   │   ├── optimize/            # 用电优化模块组件
│   │   │   ├── ComfortMode.js
│   │   │   ├── LowCarbonMode.js
│   │   │   └── NormalMode.js
│   │   └── page/                # 页面文件
│   │       ├── Home.js
│   │       ├── EnergyManagement.js
│   │       ├── ElectricityForecasting.js
│   │       ├── ElectricityOptimization.js
│   │       └── SystemManagement.js
│   ├── App.js                   # 应用主入口
│   ├── index.js                 # React 初始化入口
│   ├── App.css                  # 全局样式
│   └── index.css                # 默认样式
├── package.json                 # 项目依赖配置
├── package-lock.json            # 锁定依赖版本
└── README.md                    # 项目说明文档
```

----

## 🚀 本地运行步骤

### 1. 克隆项目

```bash
git clone https://github.com/DevineCheung/power-management.git
cd power-management/energy-dashboard
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动项目

```bash
npm start
```

启动后浏览器访问：

```https
http://localhost:3000
```

------

## 🧰 技术栈与依赖

- **前端框架**：React.js
- **图表库**：Chart.js + react-chartjs-2
- **数据处理**：Papaparse（CSV 文件解析）
- **数据获取**：Fetch API
- **界面设计**：CSS 模块化 + 响应式布局
- **开发工具**：IntelliJ IDEA

------

## ⚙️ 未来改进方向

为进一步提升系统功能与体验，后续可考虑以下优化：

### ✅ 数据处理与读取方式

- 当前所有数据通过 `.csv` 文件读取，缺乏灵活性。
- 建议将数据存储迁移至数据库（如 MySQL、MongoDB），并开发后端接口进行数据管理。

### ✅ 首页模块优化

- 目前首页部分内容仍为静态图片，缺乏交互性。
- 后续可使用可视化图表替代静态展示，并强化用户操作体验。

### ✅ 用户系统缺失

- 目前系统为单用户设计，无用户身份管理。
- 应添加用户注册、登录、权限验证等模块，实现个性化数据隔离与分析。

### ✅ 后端服务搭建

- 当前为前端独立系统，建议引入 Node.js + Express 开发后端 API，实现前后端分离架构，支持用户管理、数据处理等功能。

### ✅ 实时数据展示

- 引入 WebSocket 实现家庭能耗的实时图表更新，提升可视化效果。

### ✅ 算法参数可配置

- 当前优化算法参数固定，建议提供参数设置界面，用户可调整舒适度、电价权重等优化偏好。

### ✅ 移动端兼容性

- 进一步优化界面在小屏幕设备（如手机、平板）上的显示效果，必要时采用 PWA 架构支持离线运行。

------

## 📬 联系方式

**作者**：[Devine Cheung](https://github.com/DevineCheung)

如有建议、问题或贡献意向，欢迎提交 [Issue](https://github.com/DevineCheung/power-management/issues) 或 [Pull Request](https://github.com/DevineCheung/power-management/pulls)。
