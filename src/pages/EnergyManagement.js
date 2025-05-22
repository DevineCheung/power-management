import React from 'react';
import Chart from '../components/management/PieChart';
import LineChart from '../components/management/LineChart';
import HistoryPower from '../components/management/HistoryPower';
import BarChart from '../components/management/BarChart'
import '../App.css';

function EnergyManagement() {
    return (
        <div className="main-content">
            {/* 添加顶部导航栏 */}
            <header className="navbar">
                <div className="navbar-left">
                    <img src="/logo512.png" alt="Logo" width="50" height="50"/>
                </div>
                {/* 添加欢迎文字并居中显示 */}
                <div className="navbar-center">
                    <p>欢迎使用"智家"家庭能量管理系统</p>
                </div>
                <div className="navbar-right">
                    <img src="/logo512.png" alt="Logo" width="50" height="50"/>
                </div>
            </header>

            <div className="dashboard-content1">

                {/* 折线图 */}
                <div className="card chart card-1">
                    <LineChart/>
                </div>

                {/* 用电量占比分析 */}
                <div className="card chart card-2">
                    <Chart/>
                </div>

                {/* 总用电量分析 */}
                <div className="card chart card-3">
                    <HistoryPower/>
                </div>

                <div className="card chart card-4">
                    <BarChart/>
                </div>

            </div>
        </div>
    );
}

export default EnergyManagement;
