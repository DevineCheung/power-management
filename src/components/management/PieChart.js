import React, {useState, useEffect} from 'react';
import {Pie} from 'react-chartjs-2';
import Papa from 'papaparse';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [powerData, setPowerData] = useState({labels: [], datasets: []});
    const [billData, setBillData] = useState({labels: [], datasets: []});
    const [hiddenSegments, setHiddenSegments] = useState([]); // 追踪隐藏部分
    const [date, setDate] = useState('2024-12-15');

    const datasetLabels = ['微波炉', '热水壶', '冰箱', '洗碗机', '洗衣机', '其他电器'];
    const colors = ['#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#bdc3c7'];

    const fetchPowerData = async (selectedDate) => {
        const response = await fetch('/history_power/household_energy_2024.csv');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        Papa.parse(csvText, {
            header: false,
            complete: (result) => {
                const rows = result.data;
                const selectedRow = rows.find(row => row[0] === selectedDate.replace(/-/g, '/'));

                if (selectedRow && selectedRow.length >= 7) {
                    const totalPower = parseFloat(selectedRow[1]) || 0;
                    const powerValues = selectedRow.slice(2, 7).map(value => parseFloat(value) || 0);
                    const otherPower = totalPower - powerValues.reduce((sum, value) => sum + value, 0);
                    powerValues.push(Math.max(otherPower, 0));

                    setPowerData({
                        labels: datasetLabels,
                        datasets: [{
                            data: powerValues,
                            backgroundColor: colors.map(color => color + '33'),
                            borderColor: colors,
                            borderWidth: 3
                        }]
                    });
                }
            }
        });
    };

    const fetchBillData = async (selectedDate) => {
        const response = await fetch('/history_power/household_electricity_bill_2024.csv');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const result = await reader.read();
        const csvText = decoder.decode(result.value);

        Papa.parse(csvText, {
            header: false,
            complete: (result) => {
                const rows = result.data;
                const selectedRow = rows.find(row => row[0] === selectedDate.replace(/-/g, '/'));

                if (selectedRow && selectedRow.length >= 8) {
                    const totalBill = parseFloat(selectedRow[1]) || 0;
                    const billValues = selectedRow.slice(2, 7).map(value => parseFloat(value) || 0);
                    const otherBill = totalBill - billValues.reduce((sum, value) => sum + value, 0);
                    billValues.push(Math.max(otherBill, 0));

                    setBillData({
                        labels: datasetLabels,
                        datasets: [{
                            data: billValues,
                            backgroundColor: colors.map(color => color + '33'),
                            borderColor: colors,
                            borderWidth: 3
                        }]
                    });
                }
            }
        });
    };

    useEffect(() => {
        fetchPowerData(date);
        fetchBillData(date);
    }, [date]);

    const options = (unit, totalLabel) => ({
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (tooltipItems) {
                        const total = tooltipItems[0].dataset.data.reduce((sum, val) => sum + val, 0);
                        return `${totalLabel}: ${total.toFixed(2)} ${unit}`; // 在标题显示总数和单位
                    },
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw;
                        const total = tooltipItem.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${value.toFixed(2)} ${unit} (${percentage}%)`;
                    }
                }
            },
            legend: {
                display: false
            }
        },
        layout: {
            padding: { top: 10, bottom: 10 }
        }
    });


    const handleLegendClick = (index) => {
        setHiddenSegments(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const filteredPowerData = {
        ...powerData,
        datasets: powerData.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map((value, index) => hiddenSegments.includes(index) ? 0 : value)
        }))
    };

    const filteredBillData = {
        ...billData,
        datasets: billData.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map((value, index) => hiddenSegments.includes(index) ? 0 : value)
        }))
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    return (
        <div style={{width: '100%', margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>每日功耗与电费占比</h3>
                <div>
                    <label>选择日期: </label>
                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        style={{marginBottom: '10px', marginLeft: '10px'}}
                    />
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1px',
                flexWrap: 'wrap'
            }}>
                {powerData.labels.map((label, index) => (
                    <div key={index}
                         style={{display: 'flex', alignItems: 'center', margin: '0 10px', cursor: 'pointer'}}
                         onClick={() => handleLegendClick(index)}>
                        <div style={{
                            width: '36px',
                            height: '11px',
                            backgroundColor: powerData.datasets[0]?.backgroundColor[index],
                            marginRight: '5px',
                            border: `3px solid ${powerData.datasets[0]?.borderColor[index]}`
                        }}></div>
                        <span
                            style={{
                                fontSize: '14px',
                                color: '#666666',
                                textDecoration: hiddenSegments.includes(index) ? 'line-through' : 'none',
                                textDecorationThickness: hiddenSegments.includes(index) ? '2px' : 'auto', // 删除线粗细
                                textDecorationColor: hiddenSegments.includes(index) ? '#666666' : 'transparent' // 删除线颜色
                            }}
                        >
                          {label}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '0px', flexWrap: 'wrap'}}>
                <div style={{width: '36%', height: '280px', margin: '0 auto'}}>
                    <h4 style={{textAlign: 'center', marginBottom: '1px'}}>功耗占比</h4>
                    <Pie data={filteredPowerData} options={options('kWh', '今日总功耗')}/>
                </div>
                <div style={{width: '36%', height: '280px', margin: '0 auto'}}>
                    <h4 style={{textAlign: 'center', marginBottom: '1px'}}>电费占比</h4>
                    <Pie data={filteredBillData} options={options('元', '今日总电费')}/>
                </div>
            </div>
        </div>
    );
};

export default PieChart;
