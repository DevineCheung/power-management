// src/pages/ElectricityOptimization.js
import React from 'react';
import HistoryForecastLineChart from "../components/forecast/HistoryForecastLineChart";
import ComfortMode from "../components/optimize/ComfortMode";
import EconomicMode from "../components/optimize/EconomicMode";
import LowCarbonMode from "../components/optimize/LowCarbonMode";
import BalanceMode from "../components/optimize/BalanceMode";

function ElectricityOptimization() {
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


            <div className="optimization-dashboard-content">

                {/* 舒适模式 */}
                <div className="card chart card-6">
                    <ComfortMode/>
                </div>

                {/* 均衡模式 */}
                <div className="card chart card-6">
                    <BalanceMode/>
                </div>

                {/* 经济模式 */}
                <div className="card chart card-6">
                    <EconomicMode/>
                </div>

                {/* 低碳模式 */}
                <div className="card chart card-6">
                    <LowCarbonMode/>
                </div>

            </div>

        </div>
    )
        ;
}

export default ElectricityOptimization;
