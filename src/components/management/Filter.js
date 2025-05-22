import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse'; // 引入 papaparse
import DatePicker from 'react-datepicker'; // 引入 react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // 引入样式
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 注册 PieChart.js 的模块
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const [data, setData] = useState({
        labels: [], // 时间标签
        datasets: [] // 数据集，初始为空
    });
    const [startDate, setStartDate] = useState(new Date('2012-12-15')); // 默认开始日期
    const [endDate, setEndDate] = useState(new Date('2012-12-15')); // 默认结束日期

    // 动态加载 CSV 数据
    const fetchData = async (start, end) => {
        const fileName = '/history_power/daily_power_consumption.csv'; // 数据文件路径
        const response = await fetch(fileName);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        // 使用 papaparse 解析 CSV 数据
        Papa.parse(csvText, {
            complete: (result) => {
                const rows = result.data;

                // 确保数据正确且存在七列
                if (rows.length > 0 && rows[0].length >= 7) {
                    // 获取日期范围内的数据
                    const filteredRows = rows.filter(row => {
                        const date = new Date(row[0]);
                        return date >= start && date <= end;
                    });

                    // 获取日期作为标签
                    const labels = filteredRows.map(row => row[0]);

                    // 提取每列数据（从第二列开始，假设第一列是日期）
                    const columns = Array.from({ length: 6 }, (_, i) =>
                        filteredRows.map(row => parseFloat(row[i + 1]) || 0) // 从第二列开始读取数据
                    );

                    // 定义每条曲线的样式
                    const datasetLabels = ['总功率', '微波炉', '热水壶', '冰箱', '洗碗机', '洗衣机'];
                    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

                    const datasets = columns.map((colData, index) => ({
                        label: datasetLabels[index],
                        data: colData,
                        borderColor: colors[index],
                        backgroundColor: colors[index] + '33', // 透明填充
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0 // 隐藏圆圈
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
        fetchData(startDate, endDate);
    }, [startDate, endDate]); // 每当日期范围更改时加载新数据

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
                        size: 14 // 设置图例字体大小
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
                    callback: function (value, index, values) {
                        return data.labels[index];  // 使用 CSV 中的日期作为 x 轴标签
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
                }
            }
        }
    };

    return (
        <div style={{ width: '98%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>用电功率分析</h3>
                <div>
                    <label>选择时间段: </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        style={{ marginBottom: '1px', marginLeft: '10px' }}
                    />
                    <span> 至 </span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="yyyy/MM/dd"
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        style={{ marginBottom: '1px', marginLeft: '10px' }}
                    />
                </div>
            </div>
            <div style={{ height: '320px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default LineChart;
