import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const ComfortMode = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    // 分时电价配置
    const pricePeriods = [
        { start: 0, end: 6, price: 0.35 },
        { start: 6, end: 10, price: 0.55 },
        { start: 10, end: 14, price: 0.85 },
        { start: 14, end: 18, price: 0.55 },
        { start: 18, end: 22, price: 0.85 },
        { start: 22, end: 24, price: 0.35 }
    ];

    // 预定义的设备名称和颜色
    const deviceNames = ['空调', '冰箱', '洗衣机', '洗碗机', '微波炉', '热水壶'];
    const colors = ['#91ace0', '#bfbfbf', '#eae276', '#800080', '#00b050', '#ff0000'];

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/optimization/lowcarbon_appliance_schedule.csv');
            const text = await response.text();

            Papa.parse(text, {
                encoding: 'GB18030',
                complete: (result) => {
                    // 跳过第一行数据（标题行）
                    const validData = result.data.slice(2).filter(row => row.length > 1);

                    // 生成电价曲线数据
                    const priceData = result.data[1].map(v => parseFloat(v) || 0);

                    // 构建设备数据集
                    const datasets = deviceNames.map((name, index) => ({
                        label: name,
                        data: validData[index]?.slice(1).map(v => parseFloat(v)) || [],
                        backgroundColor: colors[index],
                        borderColor: colors[index],
                        borderWidth: 1,
                        borderRadius: 2,  // 减小圆角适应更宽条形
                        barPercentage: 3,  // 增大条形宽度
                        categoryPercentage: 1.0  // 增大类别宽度
                    }));

                    // 添加电价曲线数据集
                    datasets.push({
                        type: 'line',
                        label: '光伏发电',
                        data: priceData,
                        borderColor: '#000',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        yAxisID: 'y2',
                        pointRadius: 0
                    });

                    setChartData({
                        labels: Array.from({length: 144}, (_, i) =>
                            `${String(Math.floor(i/6)).padStart(2,'0')}:${String((i%6)*10).padStart(2,'0')}`),
                        datasets
                    });
                }
            });
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                onClick: (e, legendItem, legend) => {
                    const index = legendItem.datasetIndex;
                    const ci = legend.chart;
                    if (index !== undefined) {
                        ci.setDatasetVisibility(index, !ci.isDatasetVisible(index));
                        ci.update();
                    }
                },
                labels: {
                    color: '#66666',
                    font: { size: 18 },
                    usePointStyle: true,
                    boxWidth: 24,
                    boxHeight: 12,
                    padding: 24,
                    generateLabels: (chart) => {
                        return chart.data.datasets.map((dataset, index) => {
                            // 设备图例配置
                            if (dataset.type !== 'line') {
                                return {
                                    text: dataset.label,
                                    fillStyle: dataset.backgroundColor,
                                    strokeStyle: dataset.borderColor,
                                    pointStyle: 'rect',
                                    boxWidth: 24,
                                    boxHeight: 12,
                                    lineWidth: 0,
                                    hidden: !chart.isDatasetVisible(index),
                                    datasetIndex: index
                                };
                            }
                            // 电价曲线图例配置
                            return {
                                text: dataset.label,
                                fillStyle: 'transparent',
                                strokeStyle: dataset.borderColor,
                                lineWidth: 2,
                                lineDash: [5, 5], // 虚线样式
                                pointStyle: 'line', // 线状图例
                                hidden: !chart.isDatasetVisible(index),
                                datasetIndex: index
                            };
                        });
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    callback: function(value, index) {
                        if (index % 6 === 0) {
                            const hour = index / 6;
                            return `${String(hour).padStart(2, '0')}:00`;
                        }
                        return null;
                    },
                    maxTicksLimit: 24,
                    autoSkip: false
                }
            },
            y: {
                title: { display: true, text: '功率消耗 (kW)'},
                beginAtZero: true
            },
            y2: {
                position: 'right',
                title: { display: true, text: '光伏发电 (kW)' },
                grid: { drawOnChartArea: false }
            }
        }
    };

    return (
        <div style={{ width: '98%', margin: '2px auto' }}>
            <h3 style={{ marginBottom: '0px', marginTop: '0px' }}>低碳模式</h3>
            <div style={{ height: '245px' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ComfortMode;