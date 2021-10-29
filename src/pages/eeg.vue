<template>
    <div class="echarts-box">
        <div id="myEcharts" :style="{ width: '900px', height: 160 * channel.length + 'px' }"></div>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import * as echarts from 'echarts';
import axios from 'axios';

// Channel Name
const channel = ['A1', 'A2', 'O1', 'O2', 'T5', 'T6', 'T3', 'T4', 'F7', 'F8', 'Fp1', 'Fp2', 'P3', 'P4', 'C3', 'C4', 'F3', 'F4', 'PZ', 'Cz', 'Fz'];
// const channel = ['A1']

export default defineComponent({
    setup () {
        onMounted(() => {
            type EChartsOption = echarts.EChartsOption;
            let chartDom = document.getElementById('myEcharts')!
            let myChart = echarts.init(chartDom)
            let option: EChartsOption

            // 設定起始、結束時間
            let start_time = 0;
            let end_time = 10;

            // Load API JSON
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            let get_apiJSON = 'http://10.65.51.240:28081/api/v1/eegData?start_time=' +
                start_time +
                '&end_time=' +
                end_time;
            // 將數量換算成秒 ,number : 有幾筆資料
            function Convert_sec (number: number) {
                const dataArray = [];
                // 基底 
                let base = end_time / number
                let sum = 0;
                for (let i = 0; i < number; i++) {
                    sum = sum + base;
                    dataArray.push(sum)
                }
                return dataArray
            }

            const title: echarts.TitleComponentOption[] = [];
            const xAxis: echarts.XAXisComponentOption[] = [];
            const yAxis: echarts.YAXisComponentOption[] = [];
            const grid: echarts.GridComponentOption[] = [];
            const series: echarts.LineSeriesOption[] = [];

            axios.get(get_apiJSON).then((res) => {
                //請求成功
                console.log('請求成功')
                // 收全部的data
                let storge_data = res.data as never[]

                channel.forEach(function (eeg_parameter, idx) {
                    title.push({
                        textBaseline: 'middle',
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        top: ((idx + 0.5) * 100) / 0.6 + 'px',
                        left: '1%',
                        text: eeg_parameter,
                    });

                    xAxis.push({
                        name: 'time (sec)',
                        type: 'category',
                        boundaryGap: false,
                        data: Convert_sec(512 * end_time),
                        gridIndex: idx,
                    });

                    yAxis.push({
                        name: 'μv',
                        show: false,
                        type: 'value',
                        scale: true,
                        gridIndex: idx,
                    });

                    grid.push({
                        height: '100px',
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        top: (idx * 320) / 2 + 35 + 'px',
                        left: '13%',
                        right: '13%',
                        bottom: '20%'
                    });

                    series.push({
                        type: 'line',
                        name: '電位μv',
                        data: storge_data[idx],
                        smooth: true,
                        xAxisIndex: idx,
                        yAxisIndex: idx,
                    })
                });

                option = {
                    title: title,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    grid: grid,
                    series: series,
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        right: 80,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none',
                            },
                            restore: {},
                            saveAsImage: {},
                        },
                        iconStyle: {
                            borderColor: 'rgb(158,115,115)',
                            borderWidth: 2,
                            borderType: 'solid',
                        },
                    },
                    brush: {
                        id: 'brush',
                        geoIndex: 'all',
                        seriesIndex: 'all',
                        toolbox: ['rect', 'keep', 'clear'],
                        xAxisIndex: 'all',
                        throttleType: 'debounce',
                        throttleDelay: 600,
                        //   brushMode: 'multiple',
                        brushStyle: {
                            borderWidth: 3,
                            color: 'rgba(245,39,56,0)',
                            borderColor: 'rgba(220,20,57,0.8)',
                        },
                    },
                    dataZoom: [
                        {
                            startValue: '0'
                        },
                        {
                            type: 'inside'
                        }
                    ],

                }

                option && myChart.setOption(option);

            }).catch((error) => {
                //請求失敗
                alert('請求失敗，請重新嘗試...')
            })

        })
        return { channel }
    },
})
</script>
