// src/pages/Home.js
import React from 'react';
import '../App.css';

function HomePage() {
    return (
        <div className="main-content">
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


            <div className="dashboard-content">
                {/* 模式选择与碳排放 */}
                <img src="/logo.svg" alt="Logo" width="100%" height="90%"/>
            </div>
        </div>

    )
        ;
}

export default HomePage;
