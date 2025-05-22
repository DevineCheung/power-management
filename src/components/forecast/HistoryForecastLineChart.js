import React, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import Papa from 'papaparse';
import {Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const HistoryForecastLineChart = () => {
    const [data, setData] = useState({labels: [], datasets: []});
    const [date, setDate] = useState('2024-12-15');
    const [activeIndex, setActiveIndex] = useState(0);


    const fetchData = async (selectedDate) => {
        const fileName = `${selectedDate.replace(/-/g, '_')}_forecast.csv`;
        const response = await fetch(`/forecast/${fileName}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        Papa.parse(csvText, {
            complete: (result) => {
                const rows = result.data;
                if (rows.length > 0 && rows[0].length >= 12) {
                    const labels = Array.from({length: 144}, (_, i) => `${String(Math.floor(i / 6)).padStart(2, '0')}:${String((i % 6) * 10).padStart(2, '0')}`);
                    const datasetLabels = ['总功率', '微波炉', '热水壶', '冰箱', '洗碗机', '洗衣机'];
                    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];

                    const datasets = datasetLabels.flatMap((label, index) => [
                        {
                            label: label,
                            data: rows.map(row => parseFloat(row[index * 2]) || 0),
                            borderColor: activeIndex === index ? colors[index] : '#cccccc',
                            borderWidth: 2,
                            backgroundColor: activeIndex === index ? colors[index] + '33' : '#cccccc',
                            borderDash: [],
                            hidden: activeIndex !== index,
                            pointRadius: 0
                        },
                        {
                            label: `${label} 预测`,
                            data: rows.map(row => parseFloat(row[index * 2 + 1]) || 0),
                            borderColor: activeIndex === index ? colors[index] : '#cccccc',
                            borderWidth: 2,
                            backgroundColor: activeIndex === index ? colors[index] + '33' : '#cccccc',
                            borderDash: [5, 5],
                            hidden: activeIndex !== index,
                            pointRadius: 0
                        }
                    ]);

                    setData({labels, datasets});
                }
            }
        });
    };

    useEffect(() => {
        fetchData(date);
    }, [date, activeIndex]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {size: 14},
                    color: '#666666'
                },
                onClick: (e, legendItem) => {
                    const index = Math.floor(legendItem.datasetIndex / 2);
                    setActiveIndex(activeIndex === index ? null : index);
                }
            },
            tooltip: {mode: 'index', intersect: false}
        },
        scales: {
            x: {
                ticks: {
                    callback: (value, index) => (index % 6 === 0 ? `${String(Math.floor(index / 6)).padStart(2, '0')}:00` : ''),
                    maxTicksLimit: 24
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '功率 (W)'
                }
            }
        }
    };

    return (
        <div style={{width: '98%', margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>历史预测数据</h3>
                <div>
                    <label>选择日期: </label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                           style={{marginLeft: '10px'}}/>
                </div>
            </div>
            <div style={{height: '330px'}}>
                <Line data={data} options={options}/>
            </div>
        </div>
    );
};

export default HistoryForecastLineChart;