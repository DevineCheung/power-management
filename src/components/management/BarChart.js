import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnnualPowerBarChart = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: []
    });

    const fetchData = async () => {
        const response = await fetch('/history_power/household_energy_monthly_2024.csv');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        Papa.parse(csvText, {
            complete: (result) => {
                const rows = result.data.filter(row => row.length === 7);
                if (rows.length > 0) {
                    const monthLabels = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                    const datasetLabels = ['总能耗', '微波炉', '热水壶', '冰箱', '洗碗机', '洗衣机'];
                    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

                    const datasets = datasetLabels.map((label, index) => ({
                        label,
                        data: rows.map(row => parseFloat(row[index + 1]).toFixed(2)),
                        backgroundColor: colors[index],
                        borderColor: colors[index],
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.8
                    }));

                    setData({
                        labels: monthLabels,
                        datasets
                    });
                }
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: { size: 14}, // 修改此处，将字体颜色设置为 #666666
                    // boxWidth: 36,
                    generateLabels: (chart) => {
                        return chart.data.datasets.map((dataset, index) => ({
                            text: dataset.label,
                            fillStyle: dataset.backgroundColor + '33',
                            strokeStyle: dataset.borderColor,
                            lineWidth: 3,
                            hidden: !chart.isDatasetVisible(index),
                            datasetIndex: index,
                            fontColor: '#666666' // 这里是设置字体颜色为橙色，你可以根据需要修改
                        }));
                    },
                }
            },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: {
                stacked: true,
                ticks: { font: { size: 12 } }
            },
            y: {
                stacked: true,
                ticks: {
                    beginAtZero: true,
                    font: { size: 12 }
                },
                title: {
                    display: true,
                    text: '用电量 (kWh)'
                }
            }
        }
    };


    return (
        <div style={{ width: '98%', margin: '0 auto' }}>
            <h3>家庭本年度用电量</h3>
            <div style={{ height: '320px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default AnnualPowerBarChart;
