// src/pages/ElectricityForecasting.js
import React from 'react';
import ForecastLineChart from "../components/forecast/ForecastLineChart";
import HistoryForecastLineChart from "../components/forecast/HistoryForecastLineChart";



function ElectricityForecasting() {
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

            <div className="forecast-dashboard-content">

                {/* 折线图 */}
                <div className="card chart card-5">
                    <ForecastLineChart/>
                </div>

                {/* 折线图 */}
                <div className="card chart card-5">
                    <HistoryForecastLineChart/>
                </div>

            </div>
        </div>
    );
}


export default ElectricityForecasting;
