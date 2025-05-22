import React, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import Papa from 'papaparse'; // 引入 papaparse
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// 注册 PieChart.js 的模块
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: []
    });
    const [startDate, setStartDate] = useState('2024-12-01');
    const [endDate, setEndDate] = useState('2024-12-15');

    const fetchData = async (start, end) => {
        const fileName = '/history_power/household_energy_2024.csv';
        const response = await fetch(fileName);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        Papa.parse(csvText, {
            complete: (result) => {
                const rows = result.data;
                if (rows.length > 0 && rows[0].length >= 7) {
                    const filteredRows = rows.filter(row => {
                        const date = new Date(row[0]);
                        return date >= new Date(start) && date <= new Date(end);
                    });

                    const labels = filteredRows.map(row => row[0]);
                    const columns = Array.from({length: 6}, (_, i) =>
                        filteredRows.map(row => parseFloat(row[i + 1]) || 0)
                    );

                    const datasetLabels = ['总能耗', '微波炉', '热水壶', '冰箱', '洗碗机', '洗衣机'];
                    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

                    const datasets = columns.map((colData, index) => ({
                        label: datasetLabels[index],
                        data: colData,
                        borderColor: colors[index],
                        backgroundColor: colors[index] + '33',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 2, // 默认圆点大小
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

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        if (new Date(value) > new Date(endDate)) {
            setEndDate(value);
        }
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        if (new Date(value) < new Date(startDate)) {
            setStartDate(value);
        }
    };

    // 自定义插件：悬停时放大所有线条的对应点
    const customPlugin = {
        id: 'customHover',
        beforeDatasetDraw(chart) {
            const {tooltip} = chart;
            if (tooltip && tooltip.active && tooltip.active.length > 0) {
                const activeIndex = tooltip.dataPoints[0].dataIndex;
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    const point = meta.data[activeIndex];
                    if (point) {
                        point.custom = point.custom || {};
                        point.custom.radius = 8; // 悬停时的点大小
                    }
                });
            } else {
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    meta.data.forEach((point) => {
                        if (point && point.custom) {
                            delete point.custom.radius; // 恢复默认样式
                        }
                    });
                });
            }
        }
    };

    // 注册插件
    ChartJS.register(customPlugin);

    return (
        <div style={{width: '98%', margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>家庭每日用电量</h3>
                <div>
                    <div>
                        <label>开始日期: </label>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={handleStartDateChange}
                            style={{marginBottom: '1px', marginLeft: '10px'}}
                        />
                        <label style={{marginLeft: '10px'}}>结束日期: </label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={handleEndDateChange}
                            style={{marginBottom: '1px', marginLeft: '10px'}}
                        />
                    </div>
                </div>
            </div>
            <div style={{height: '340px'}}>
                <Line data={data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {font: {size: 14}}
                        },
                        tooltip: {mode: 'index', intersect: false},
                    },
                    scales: {
                        x: {grid: {display: false}, ticks: {maxTicksLimit: 24}},
                        y: {
                            grid: {display: true}, ticks: {beginAtZero: true}, title: {
                                display: true,
                                text: '用电量 (kWh)'
                            }
                        },
                    }
                }}/>
            </div>
        </div>
    );
};

export default LineChart;
