<template>
  <div id="App1">
    <input type="text" placeholder="請輸入Channel" v-model="inputTodo">
    <p>{{inputTodos}}</p>
    <button v-on:click="Add">Add</button>
    <hr>
    <ol>
      <li v-for="(item,idx) in todos" :key='idx'>
        <input type="checkbox" v-model="item.finish">
        <input type="text" v-bind:disabled="item.finish" v-model="item.channel">
        <button v-if="item.finish" v-on:click="Del(idx)">X</button>
      </li>
    </ol>
    <hr>
    {{todos}}
  </div>
</template>

<script>
  export default {
    name: 'todo.vue',
    props:{
      inputTodos: String,
    //   channel: Number || String,
    //   StartTime: Number || String,
    //   EndTime: Number || String
    },
    data() {
      // let inputTodo = this.props.inputTodos
      // console.log('this.props.inputTodos: ', inputTodos)
      return {
        inputTodo:'',
        todos: [
          { channel: '1', StartTime:0,EndTime:0 },
          { channel: '2', StartTime:0,EndTime:0 },
          { channel: '3', StartTime:0,EndTime:0},
        ],
      }
    },
    mounted() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.inputTodo = this.inputTodos
    },
    watch:{
      inputTodos(){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/unbound-method
        this.inputTodo = this.inputTodos
      }
    },
    methods:{
      Add:function(){
        let tmpTodo={};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tmpTodo.channel=this.inputTodo;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        this.todos.push(tmpTodo);
        this.inputTodo='';
      },
      Del:function(idx){
        console.log(idx);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        this.todos.splice(idx,1);
      }
    }

  };
</script>

<style scoped>

</style>
