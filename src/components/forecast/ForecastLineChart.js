import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse'; // 引入 papaparse
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 注册 PieChart.js 的模块
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ForecastLineChart = () => {
    const [data, setData] = useState({
        labels: [], // 时间标签
        datasets: [] // 数据集，初始为空
    });
    const [date, setDate] = useState('2024-12-16'); // 默认日期

    // 动态加载 CSV 数据
    const fetchData = async (selectedDate) => {
        const fileName = `${selectedDate.replace(/-/g, '_')}.csv`; // 格式化日期为文件名
        const response = await fetch(`/forecast/${fileName}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        // 使用 papaparse 解析 CSV 数据
        Papa.parse(csvText, {
            complete: (result) => {
                const rows = result.data;

                // 确保数据正确且存在六列
                if (rows.length > 0 && rows[0].length >= 6) {
                    // 生成所有 144 个数据点的标签
                    const labels = Array.from({ length: 144 }, (_, i) => {
                        const hour = Math.floor(i / 6);  // 获取小时
                        const minute = (i % 6) * 10;    // 获取分钟
                        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    });

                    // 提取每列数据
                    const columns = Array.from({ length: 6 }, (_, i) =>
                        rows.map(row => parseFloat(row[i]) || 0) // 每列数据，处理空值
                    );

                    // 定义每条曲线的样式
                    const datasetLabels = ['总功率', '微波炉', '热水壶', '冰箱', '洗碗机', '洗衣机'];
                    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

                    const datasets = columns.map((colData, index) => ({
                        label: datasetLabels[index],
                        data: colData,
                        borderColor: colors[index],
                        backgroundColor: colors[index] + '33',
                        borderDash: [5, 1],       // 虚线样式 [虚线长度, 间隔长度]
                        fill: false,
                        tension: 0.4,
                        pointRadius: 1, // 默认圆点大小
                        hoverRadius: 6, // 悬停时圆点大小
                    }));

                    setData({
                        labels,
                        datasets
                    });
                }
            }
        });
    };

    // 加载初始数据
    useEffect(() => {
        fetchData(date);
    }, [date]); // 每当日期更改时加载新数据

    // 配置选项
    const options = {
        responsive: true,
        maintainAspectRatio: false, // 允许自定义宽高比例
        plugins: {
            legend: {
                display: true, // 显示图例
                position: 'top',
                labels: {
                    font: {
                        size: 14, // 设置图例字体大小
                        color: '#666666'
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
            datalabels: {
                display: false // 禁用数据标签
            },
        },
        scales: {
            x: {
                grid: {
                    display: false // 隐藏 x 轴网格线
                },
                ticks: {
                    // 显示所有整点（每小时的0分钟）
                    callback: function (value, index, values) {
                        const hour = Math.floor(index / 6); // 每小时的第一个数据点
                        const hourLabel = `${String(hour).padStart(2, '0')}:00`; // 获取整点标签
                        return hourLabel;
                    },
                    maxTicksLimit: 24 // 设置 x 轴标签最多显示 24 个
                }
            },
            y: {
                grid: {
                    display: true // 显示 y 轴网格线
                },
                ticks: {
                    beginAtZero: true // 从零开始显示
                },
                title: {
                    display: true,
                    text: '功率 (W)'
                }
            }
        }
    };

    // 日期选择器的变化
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    return (
        <div style={{ width: '98%', margin: '0 auto' }}> {/* 设置宽度为模块的98% */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>未来一日用电预测</h3>
            </div>
            <div style={{ height: '330px' }}> {/* 设置高度为300px */}
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default ForecastLineChart;
