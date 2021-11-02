<template>
    <div class="echarts-box">
        <div id="myEcharts" :style="{ width: '900px', height: 40 * channel.length + 'px' }"></div>
        <div id="testtext" :style="{ width: '700px', height: 33.7 * channel.length + 'px' }">
            <p>Value will put here</p>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import * as echarts from 'echarts';
import axios from 'axios';


// Channel Name
const channel = ['Fp1-A1', 'F3-A1', 'C3-A1', 'P3-A1', 'O1-A1', 'Fp2-A2', 'F4-A2', 'C4-A2', 'F4-A2', 'Q2-A2', 'F7-A1', 'T3-A1', 'T5-A1', 'F8-A2', 'T4-A2', 'T6-A2', 'F3', 'F4', 'PZ', 'Cz', 'Fz', 'ECG'];
// const channel = ['A1']

export default defineComponent({
    setup () {
        let numArray = [];
        let xaxis_start;
        let xaxis_end;
        var array_min = 0
        let array_max = 0
        onMounted(() => {
            type EChartsOption = echarts.EChartsOption;
            let chartDom = document.getElementById('myEcharts')!
            let myChart = echarts.init(chartDom)
            // let option: EChartsOption

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
            // const datazoom: echarts.DataZoomComponentOption[] = []

            axios.get(get_apiJSON).then((res) => {
                //請求成功
                console.log('請求成功')
                // 收全部的data
                let storge_data = res.data as never[]
                // array_data 專們給比大小用
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                let array_data = res.data

                // 計算收進來的data有幾個[]
                // console.log(Object.keys(storge_data).length)
                let count_channel: number[] = []
                for (let i = 0; i < Object.keys(storge_data).length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    let compare_min = Math.min(...array_data[i])
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    let compare_max = Math.max(...array_data[i])

                    if (array_max < compare_max) {
                        array_max = compare_max
                    } else if (array_min > compare_min) {
                        array_min = compare_min
                    }

                    count_channel.push(i)
                }
                console.log('min:', array_min)
                console.log('max', array_max)

                let last_element_index = count_channel.length - 1
                // 根據Channel數量開始跑迴圈依序push
                channel.forEach(function (eeg_parameter, idx) {
                    if (idx != last_element_index) {
                        title.push({
                            textBaseline: 'middle',
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            top: (idx * 320) / 9 + 40 + 'px',
                            left: '1%',
                            text: eeg_parameter,
                        });
                        xAxis.push({
                            show: false,
                            // name: 'time (sec)',
                            type: 'category',
                            boundaryGap: false,
                            data: Convert_sec(512 * end_time),
                            gridIndex: idx,
                        });
                        yAxis.push({
                            show: false,
                            type: 'value',
                            scale: true,
                            gridIndex: idx,
                            // 隱藏網格線
                            splitLine: {
                                show: true
                            },
                        });
                        grid.push({
                            height: '10px',
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            top: (idx * 320) / 9 + 40 + 'px',
                            left: '13%',
                            right: '13%',
                            containLabel: false

                        });
                        series.push({
                            type: 'line',
                            data: storge_data[idx],
                            // 去掉小圓點
                            symbol: 'none',
                            color: '#3a3c42',
                            smooth: true,
                            xAxisIndex: idx,
                            yAxisIndex: idx,
                        })
                    } else {
                        title.push({
                            textBaseline: 'middle',
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            top: (idx * 320) / 9 + 40 + 'px',
                            left: '1%',
                            text: eeg_parameter,
                            bottom:'20'
                        });
                        xAxis.push({
                            show: true,
                            name: 'time (sec)',
                            type: 'category',
                            boundaryGap: false,
                            data: Convert_sec(512 * end_time),
                            gridIndex: idx,
                        });
                        yAxis.push({
                            show: false,
                            type: 'value',
                            scale: true,
                            gridIndex: idx,
                            // 隱藏網格線
                            splitLine: {
                                show: true
                            },
                        });
                        grid.push({
                            height: '30px',
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            top: (idx * 320) / 9 + 40 + 'px',
                            left: '13%',
                            right: '13%',
                            containLabel: false
                        });
                        series.push({
                            type: 'line',
                            data: storge_data[idx],
                            symbol: 'none',
                            color: '#3a3c42',
                            smooth: true,
                            xAxisIndex: idx,
                            yAxisIndex: idx,
                        })
                    }
                });
                let option = {
                    animation: false,
                    title: title,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    grid: grid,
                    series: series,
                    dataZoom: [{
                        type: 'inside',
                        xAxisIndex: count_channel,
                        zoomOnMouseWheel: 'alt'
                    }, {
                        type: 'slider',
                        startValue: 0,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        textStyle: {
                            height: 0.5,
                            color: 'rgba(160, 25, 25, 1)'
                        },
                    },
                    ],
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
                        brushLink: 'all',
                        toolbox: ['rect', 'keep', 'lineX', 'clear'],
                        inBrush: {
                            opacity: 1,
                            symbolSize: 20
                        },
                        // 調整是否可平移
                        transformable: false,
                        throttleType: 'debounce',
                        throttleDelay: 600,
                        //   brushMode: 'multiple',
                        brushStyle: {
                            borderWidth: 3,
                            color: 'rgba(245,39,56,0)',
                            borderColor: 'rgba(220,20,57,0.8)',
                        },
                    },
                    visualMap: [{
                        top: 50,
                        right: 20,
                        type: 'continuous',
                        max: array_max,
                        min: array_min,
                        precision: 3,
                        text: ['Hight', 'Low'],
                        // Map顯示數字
                        // calculable: true,
                        inRange: {
                            color: ['black', 'black'],
                            colorLightness: [0.2, 0.8]
                        },

                    }]

                }
                myChart.on('brushSelected', function (paraams: any) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                    let brushComponent = paraams.batch[0];
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    numArray = brushComponent.areas[0]
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                    xaxis_start = brushComponent.areas[0].range[0];
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                    xaxis_end = brushComponent.areas[0].range[1];

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                    // let aa = option.xAxis[21].data[xaxis_start]
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    //    console.log(brushComponent)
                    //    console.log(option)
               
                });
               
                option && myChart.setOption(option);
                
            }).catch((error) => {
                //請求失敗
                alert('請求失敗，請重新嘗試...')
            })


        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { channel }
    },
})
</script>

<style scoped>
.echarts-box {
    display: flex;
}
</style>
