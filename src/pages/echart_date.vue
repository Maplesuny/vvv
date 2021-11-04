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
    setup() {
      onMounted(() => {
        // 基於準備好的Dom,初始化echart 實例 (add ! 避免ts2345 null 的錯誤訊息)
        const chartDom = document.getElementById('myEcharts')!;
        const myChart = echarts.init(chartDom);
        let json_url =
          'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/aqi-beijing.json';
        //   let json_url = 'http://10.65.51.240:28081/api/v1/eegData';
        let data: never[];
        axios
          .get(json_url)
          .then((res) => {
            // 請求成功
            console.log('請求成功', res);

            data = res.data as never[];
            // console.log('first', data[0]);
            let data1 = data[0];
            let option = {
              title: {
                text: 'Chart Demo',
                left: '1%',
              },
              tooltip: {
                trigger: 'axis',
              },
              grid: [
                {
                  left: '8%',
                  right: '15%',
                  bottom: '10%',
                },
              ],
              xAxis: [
                {
                  id: 'xAis',
                  type: 'category',
                  axisTick: {
                    alignWithLabel: true,
                  },
                  data: data.map(function(item: string[]) {
                    return item[0];
                  }),
                },
              ],
              yAxis: [{}],
              toolbox: {
                right: 10,
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
                brushMode: 'multiple',
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
              visualMap: {
                top: 50,
                right: 10,
                pieces: [
                  {
                    gt: 0,
                    lte: 50,
                    color: '#93CE07',
                  },
                  {
                    gt: 50,
                    lte: 100,
                    color: '#FBDB0F',
                  },
                  {
                    gt: 100,
                    lte: 150,
                    color: '#FC7D02',
                  },
                  {
                    gt: 150,
                    lte: 200,
                    color: '#FD0100',
                  },
                  {
                    gt: 200,
                    lte: 300,
                    color: '#AA069F',
                  },
                  {
                    gt: 300,
                    color: '#AC3B2A',
                  },
                ],
                outOfRange: {
                  color: '#999',
                },
              },
              series: [
                {
                  name: 'AQI chart',
                  id: 0,
                  type: 'line',
                  xAxisIndex: 0,
                  yAxisIndex: 0,
                  data: data.map(function(item: number[]) {
                    return item[0];
                  }),
                  markLine: {
                    silent: true,
                    lineStyle: {
                      color: '#333',
                    },
                  },
                },
                {
                  name: 'AQI chart',
                  type: 'line',
                  xAxisIndex: 0,
                  yAxisIndex: 0,
                  data: data.map(function(item: number[]) {
                    return item[1];
                  }),
                  markLine: {
                    silent: true,
                    lineStyle: {
                      color: '#333',
                    },
                  },
                },
              ],
            };

            myChart.on('mouseover', function(params: any) {
              // console.log('滑鼠一過去的index');
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              // console.log('我是dataindex', params.dataIndex);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              console.log('x軸', option.series[0].data[params.dataIndex]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            // console.log('我是option.series', option.series);
            });

            myChart.on('brushSelected', function(paraams: any) {
              let numArray = [];
              let xaxis_start;
              let xaxis_end;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
              let brushComponent = paraams.batch[0];

              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (brushComponent.areas[0] !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                numArray = brushComponent.areas[0].coordRange;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
                xaxis_start = brushComponent.areas[0].coordRange[0][0];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                xaxis_end = brushComponent.areas[0].coordRange[0][1];
                // console.log('numArray', numArray);
                // console.log('start', xaxis_start);
                // console.log('start', xaxis_end);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-plus-operands
                console.log('Range of :' + option.series[0].data[xaxis_start] + '  到 ' + option.series[0].data[xaxis_end] );
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
