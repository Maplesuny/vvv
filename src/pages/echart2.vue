<template>
    <div class="echarts-box">
        <div id="myEcharts" :style="{ width: '900px', height: '300px' }"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

export default defineComponent({
    setup () {
      let numArray = [];
      let xaxis_start;
      let xaxis_end;
        onMounted(() => {
            // 基於準備好的Dom,初始化echart 實例 (add ! 避免ts2345 null 的錯誤訊息)
            const chartDom = document.getElementById('myEcharts')!;
            const myChart = echarts.init(chartDom);
            // let json_url =
            //   'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/aqi-beijing.json';
            let start_time = 0;
            let end_time = 2;
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            let json_url = 'http://10.65.51.240:28081/api/v1/eegData?start_time=' +
                start_time +
                '&end_time=' +
                end_time;

            let data: never[];
            function count (number: number) {
                const arr = [];
                // 基底
                let base = end_time / number;
                let sum = 0;
                for (let i = 0; i < number; i++) {
                    sum = sum + base;
                    arr.push(sum);
                }
                return arr;
            }

            //   alert(count(1024).length)
            axios
                .get(json_url)
                .then((res) => {
                    // 請求成功
                    console.log('請求成功', res);
                    data = res.data as never[];
                    let data1 = data[0];
                    let option = {
                        title: {
                            text: 'Label Demo',
                            left: '1%',
                            top: '2%'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer:{
                                type:'shadow',
                                crossStyle:{
                                    color:'#fff'
                                }
                            }
                        },
                        grid: [
                            {
                                top:'40%',
                                left: '8%',
                            },
                        ],
                        xAxis: {
                            name: 'time (sec)',
                            type: 'category',
                            data: count(512 * end_time),
                        },

                        yAxis: [
                            {
                                name:'μv',
                                type: 'value',
                                scale: true,
                            },
                        ],

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
                                startValue: '2014-06-01',
                            },
                            {
                                type: 'inside',
                            },
                        ],
                        series: [
                            {
                                name: '電位μv',
                                type: 'line',
                                smooth: true,
                                xAxisIndex: 0,
                                yAxisIndex: 0,
                                data: data1,
                            },
                        ],
                    };

                    myChart.on('mouseover', function (params: any) {
                        // console.log('滑鼠一過去的index');
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        // console.log('我是dataindex', params.dataIndex);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        console.log('y軸', option.series[0].data[params.dataIndex]);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        console.log('x軸', option.xAxis.data[params.dataIndex]); // 轉換成我們要的時間
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        // console.log('我是option.series', option.series);
                    });

                    myChart.on('brushSelected', function (paraams: any) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                        let brushComponent = paraams.batch[0];
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        if (brushComponent.areas[0] !== undefined) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                            numArray = brushComponent.areas[0].coordRange[0];
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                            xaxis_start = brushComponent.areas[0].coordRange[0][0];
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                            xaxis_end = brushComponent.areas[0].coordRange[0][1];
                            // console.log('numArray', numArray);
                            // console.log('start', xaxis_start);
                            // console.log('end', xaxis_end);
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-plus-operands
                            console.log('Range of :' + option.xAxis.data[xaxis_start] + ' second 到 ' + option.xAxis.data[xaxis_end] + ' second');
                        }
                    });
                    //   使用剛指定的配置和資料顯示圖表
                    myChart.setOption(option);
                })
                .catch((err) => {
                    //請求失敗
                    alert('請求失敗');
                    console.log('請求失敗', err);
                });
        });
    },
});
</script>
