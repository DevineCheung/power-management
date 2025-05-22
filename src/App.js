import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import EnergyManagement from './pages/EnergyManagement';
import ElectricityForecasting from './pages/ElectricityForecasting'
import ElectricityOptimization from "./pages/ElectricityOptimization"
import SystemManagement from "./pages/SystemManagement"
import HomePage from "./pages/Home";


function App() {
    return (
        <Router>
        <div className="dashboard">

                {/* 左侧菜单栏 */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2>家庭能量管理系统</h2>
                    </div>
                    <nav className="menu">
                        <ul>
                            <li><NavLink to="/home-page" activeClassName="active">首页</NavLink></li>
                            <li><NavLink to="/energy-management" activeClassName="active">用电统计</NavLink></li>
                            <li><NavLink to="/power-demand" activeClassName="active">用电需求预测</NavLink></li>
                            <li><NavLink to="/power-optimization" activeClassName="active">用电优化</NavLink></li>
                            <li><NavLink to="/system-management" activeClassName="active">系统管理</NavLink></li>
                        </ul>
                    </nav>
                </aside>

                {/* 主内容区域 */}
                <div className="main-content">

                    {/* 路由管理 */}
                    <Routes>
                        <Route path="/home-page" element={<HomePage />} />
                        <Route path="/energy-management" element={<EnergyManagement />} />
                        <Route path="/power-demand" element={<ElectricityForecasting />} />
                        <Route path="/power-optimization" element={<ElectricityOptimization />} />
                        <Route path="/system-management" element={<SystemManagement />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
