<template>
  <div class="echarts-box">
    <div id="myEcharts" :style="{ width: '900px', height: '300px' }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
// import { consoleLog } from 'echarts/types/src/util/log';
export default defineComponent({
  name: 'use api data echart3',
  setup() {
    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chartDom = document.getElementById('myEcharts')!;
      const myChart = echarts.init(chartDom);
      let option: echarts.EChartsOption;
      let data: never[];
      myChart.on('brushSelected', function (params: any) {
        console.log('params', params);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        var brushComponent = params.batch[0];
        console.log('brushcomponent', brushComponent);
        var sum = 0; // 统计选中项的数据值的和
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          // 对于每个 series：
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
          var dataIndices = brushComponent.selected[sIdx].dataIndex;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          for (var i = 0; i < dataIndices.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            var dataIndex = dataIndices[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.log(data[sIdx][dataIndex]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            sum += data[sIdx][dataIndex];
          }
        }
        console.log(sum); // 用某种方式输出统计值。
      });
      function getData() {
        let api =
          'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/aqi-beijing.json';
        // axios.get(api).then(function(res) {
        axios
          .get(api)
          .then((res) => {
            //請求成功
            console.log(res);
            data = res.data as never[];
            myChart.setOption(
              (option = {
                title: {
                  text: 'AQI Chart',
                  left: '1%',
                },
                tooltip: {
                  trigger: 'axis',
                },
                grid: [
                  {
                    left: '5%',
                    right: '15%',
                    bottom: '10%',
                  },
                  {
                    left: '5%',
                    right: '15%',
                    bottom: '10%',
                  },
                ],
                xAxis: {
                  id: 'xAxis',
                  type: 'category',
                  axisTick: {
                    alignWithLabel: true,
                  },
                  show: true,
                  data: data.map(function (item: string[]) {
                    return item[0];
                  }),
                },
                yAxis: {},
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
                  toolbox: ['rect', 'polygon', 'clear'],
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
                    data: data.map(function (item: number[]) {
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
                    data: data.map(function (item: number[]) {
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
              })
            );
            // option && myChart.setOption(option);
            console.log('option series', option.series);
          })
          .catch((err) => {
            // 請求失敗
            console.log(err);
          });
        // type EChartsOption = echarts.EChartsOption;
        // let chartDom = document.getElementById('myEcharts') as HTMLElement;
        // let myChart = echarts.init(chartDom);
        // let option: EChartsOption;
      }
      getData();

      myChart.on('mouseover', function (params: any) {
        console.log('滑鼠一過去的index');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(params.dataIndex);
      });
    });
  },
});
</script>

<style scoped></style>
