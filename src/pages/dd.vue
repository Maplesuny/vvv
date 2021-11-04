<template>
  <div class="echarts-box">
    <h4>v-for 字串篩選</h4>
    <input type='text' class='form-control' v-model="filterText" @keyup="filterData"/>
    <p>球隊名單</p>
    <ui>
      <li v-for="item in filterArray" :key="item.name">
        {{item.name}}
      </li>
    </ui>
  </div>
</template>

<script>
  export default {
    el:'#echarts-box',
    data() {
      return {
        arrayData: [
          { name: '恰恰', team: '中信', avg: 0.389 },
          { name: '恰恰2', team: '中油', avg: 0.289 },
          { name: '恰恰3', team: '中油', avg: 0.189 },
          { name: '恰恰4', team: '中信', avg: 0.389 },
        ],
        filterArray: [],
        filterText: ''
      };
    },
    methods:{
      filterData: function(){
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let vm = this;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        vm.filterArray = vm.arrayData.filter(item=>{
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
          return item.team.match(vm.filterText);
        });
      }
    }
  };
</script>
