<template>
  <v-form>
    <v-text-field v-model="newItemTitle"
                  label="What do you need to do?"
                  @keydown.enter.prevent="addTodo"
                  autofocus
                  :rules="[rules.minLength]"
                  required
    >
    </v-text-field>
  </v-form>
</template>

<script>
  const MIN_LENGTH_VALIDATION = 3;

  export default {
    name: 'InputField',
    data() {
      return {
        newItemTitle: '',
        rules: {
          minLength: value => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return (value.length >= MIN_LENGTH_VALIDATION) || `Required having at least ${MIN_LENGTH_VALIDATION} characters.`;
          }
        }
      };
    },
    methods: {
      addTodo() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (this.newItemTitle.length >= MIN_LENGTH_VALIDATION) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
          this.$store.dispatch('addTodo', this.newItemTitle);
          this.newItemTitle = '';
        }
      }
    }
  };
</script>
