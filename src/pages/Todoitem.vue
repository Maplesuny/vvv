<template>
  <v-layout sm6 align-start justify-space-between row sm10>
    <v-flex align-center xs10>
      <v-textarea :value = "title"
                  ref = "input"
                  v-bind:class = "[todo.done ? 'is-done' : '']"
                  @blur = "editingCompleted"
                  @keydown.enter.prevent = "editingCompleted"
                  @dblclick= "edit"
                  :readonly = "isReadOnly"
                  solo
                  :rules="[rules.minLength]"
                  :rows = "1"
                  auto-grow>
      </v-textarea>
    </v-flex>
    <v-layout row>
      <v-btn icon @click="edit()">
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn icon @click="toggleTodo(todo)">
        <v-icon>done</v-icon>
      </v-btn>
      <v-btn icon @click="deleteTodo(todo)">
        <v-icon>delete_forever</v-icon>
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
  import { mapActions } from 'vuex';
  const MIN_LENGTH_VALIDATION = 3;

  export default {
    name: 'TodoItem',
    props: ['todo'],
    data() {
      return {
        isReadOnly: true,
        rules: {
          minLength: value => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return (value.length >= MIN_LENGTH_VALIDATION) || `Required having at least ${MIN_LENGTH_VALIDATION} characters.`;
          }
        }
      };
    },
    computed: {
      title() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
        return this.todo.title;
      }
    },
    methods: {
      ...mapActions([
        'editTodo',
        'toggleTodo',
        'deleteTodo'
      ]),
      edit() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        this.isReadOnly = this.todo.done;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        this.$refs.input.focus();
      },
      editingCompleted(e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const newTitle = e.target.value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const validation = (newTitle.length >= MIN_LENGTH_VALIDATION);

        if (!this.isReadOnly && validation) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          void this.editTodo({ todo: this.todo, title: newTitle });
          this.isReadOnly = true;
        }
      }
    }
  };
</script>

<style>
.is-done {
  text-decoration: line-through;
}
</style>
