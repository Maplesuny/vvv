<template>
  <div class="echarts-box">
    <div id="myEcharts" :style="{ width: '900px', height: 46 * channel.length + 'px' }">

    </div>
    <div id="testtext" :style="{ width: '700px', height: 40 * channel.length + 'px' }">
      <q-btn label='Prompt' class="btn btn-primary" @click="prompt = true"/>
      <br>
      <br>
      <form @submit.prevent="addTodo()">
        <label>New ToDO</label>
      </form>
      <h2>Todo List</h2>
      <ul>
        <li v-for="(todo,index) in todos" :key = "index">
          <span :class='{done:todo.done}' @click='doneTodo(todo)'>
            {{todo.content}}
          </span>
          <q-btn label='Remove' class="btn btn-primary" @click="removeTodo(index)"></q-btn>
        </li>
      </ul>
      {{ ss_ing }}

      <q-dialog v-model="prompt" persistent>

        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Your address {{ ss_ing }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add address" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  import json from 'assets/10s.json';
  // Channel Name
  const channel = ['Fp1-A1','F3-A1','C3-A1','P3-A1','O1-A1','Fp2-A2','F4-A2','C4-A2','F4-A2','Q2-A2','F7-A1','T3-A1','T5-A1','F8-A2','T4-A2','T6-A2','F3','F4','PZ','Cz','Fz','ECG',];
  export default defineComponent({
    setup() {
      let select_start = ref(0);
      let select_end = ref(0);
      let ss_ing = ref('');
      let rnage_start: any;
      let range_end: any;

      const newTodo = ref('');
      const defaultData = [{
        done: false,
        content: 'Write a blog post'
      }];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const test = localStorage.getItem('todos')
      //const todosData = JSON.parse(test);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let test_string: unknown;
      test_string = JSON.parse(localStorage.getItem('currentUser') || '{}');



      onMounted(() => {
        type EChartsOption = echarts.EChartsOption;
        let chartDom = document.getElementById('myEcharts')!;
        let myChart = echarts.init(chartDom);
        let option: EChartsOption;
        // 設定起始、結束時間
        let start_time = 0;
        let end_time = 10;
        let get_apiJSON = json;
        // 將數量換算成秒 ,number : 有幾筆資料
        function Convert_sec(number: number) {
          const dataArray = [];
          // 基底
          let base = end_time / number;
          let sum = 0;
          for (let i = 0; i < number; i++) {
            sum = sum + base;
            dataArray.push(sum);
          }
          return dataArray;
        }
        const title: echarts.TitleComponentOption[] = [];
        const xAxis: echarts.XAXisComponentOption[] = [];
        const yAxis: echarts.YAXisComponentOption[] = [];
        const grid: echarts.GridComponentOption[] = [];
        const series: echarts.LineSeriesOption[] = [];
        // axios.get(get_apiJSON).then((res) => {
        const res = json;
        //請求成功
        console.log('請求成功');
        // 收全部的data
        // let storge_data = res.data as never[]
        let storge_data = json;
        // 計算收進來的data有幾個[]
        // console.log(Object.keys(storge_data).length)
        let count_channel: number[] = [];
        for (let i = 0; i < Object.keys(storge_data).length; i++) {
          count_channel.push(i);
        }

        let last_element_index = count_channel.length - 1;
        channel.forEach(function(eeg_parameter, idx) {
          if (idx != last_element_index) {
            title.push({
              textBaseline: 'middle',
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              top: (idx * 330) / 8 + 40 + 'px',
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
                show: true,
              },
            });
            grid.push({
              height: '30px',
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              top: (idx * 330) / 8 + 40 + 'px',
              left: '13%',
              right: '13%',
              containLabel: false,
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
            });
          } else {
            title.push({
              textBaseline: 'middle',
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              top: (idx * 330) / 8 + 40 + 'px',
              left: '1%',
              text: eeg_parameter,
              bottom: '20',
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
                show: true,
              },
            });
            grid.push({
              height: '30px',
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              top: (idx * 330) / 8 + 40 + 'px',
              left: '13%',
              right: '13%',
              containLabel: false,
            });
            series.push({
              type: 'line',
              data: storge_data[idx],
              symbol: 'none',
              color: '#3a3c42',
              smooth: true,
              xAxisIndex: idx,
              yAxisIndex: idx,
            });
          }
        });
        option = {
          animation: false,
          title: title,
          xAxis: xAxis,
          yAxis: yAxis,
          grid: grid,
          series: series,
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: count_channel,
            // zoomOnMouseWheel: 'alt'
            },
            {
              type: 'slider',
              startValue: 0,
              handleIcon:
                'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              textStyle: {
                height: 0.5,
                color: 'rgba(160, 25, 25, 1)',
              },
            },
          ],
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            // right: 5,
            bottom: 'auto',
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
              symbolSize: 20,
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
        };

        function select_brushType(params: any, whichLinx: string) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
          let brushComponent = params.batch[0];
          // 判斷是 lineX 或 rect
          if (whichLinx !== 'lineX') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            rnage_start = brushComponent.areas[0].range[0][0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            range_end = brushComponent.areas[0].range[0][1];
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            rnage_start = brushComponent.areas[0].range[0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            range_end = brushComponent.areas[0].range[1];
          }
          console.log('rnage_start', rnage_start);
          console.log('rnage_end', range_end);
          // 再將rnage座標轉作為xy的座標(coordRange的值)
          let coordRange_start = myChart.convertFromPixel({ seriesIndex: 0 }, [
            rnage_start,
          ])[0];
          let corrdRange_end = myChart.convertFromPixel({ seriesIndex: 0 }, [
            range_end,
          ])[0];
          console.log('coordRange_end', corrdRange_end);
          // 因為取出的座標是點數，要除上總點數，1秒512個點，有幾秒要乘上去
          select_start.value = (coordRange_start / (512 * end_time)) * end_time;
          select_end.value = (corrdRange_end / (512 * end_time)) * end_time;
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          ss_ing.value =
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            'Rect Range of :' +
            select_start.value +
            ' second 到 ' +
            select_end.value +
            ' second';
          console.log('ss_ing', ss_ing.value);
        }

        myChart.on('brushSelected', function(params: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
          let brushComponent = params.batch[0];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (brushComponent.areas[0] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            let type = brushComponent.areas[0].brushType;
            select_brushType(params, type);
          }
        });

        option && myChart.setOption(option);
      });

      return { channel, ss_ing ,prompt:ref(false)};
    },
  });
</script>
<style scoped>
.echarts-box {
  display: flex;
}
</style>
