// src/pages/SystemManagement.js
import React from 'react';

function SystemManagement() {
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

            <div>
                <h2>系统管理</h2>
                <p>这里是系统管理页面的内容。</p>
            </div>

            <div className="dashboard-content1">
                {/* 模式选择与碳排放 */}
                <div className="card chart card-2">
                    <h3>系统设置</h3>
                    <div className="right-top-container">
                        <div className="square">
                            <p>模式选择</p>
                        </div>
                        <div className="rectangle-container">
                            <div className="rectangle">
                                <p></p>
                            </div>
                            <div className="rectangle">
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
        ;
}

export default SystemManagement;
