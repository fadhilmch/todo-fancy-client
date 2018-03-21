window.onload = function () {


  var app = new Vue({
    el: '#app',
    data: {
      userData: {
        id: localStorage.getItem('userId'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        token: localStorage.getItem('token'),
        picture: localStorage.getItem('picture'),
      },
      todos: [],
      newTodo : "",
      visibility : 'all',
      editedTodo : null,
      editCache : '',
      newTags : [],
      quotes : {},
      loginState : 'default',


    },
    computed: {
      filteredTodos: function(){
        switch(this.visibility){
          case 'all':
              return this.todos;
            break;
          case 'active':
              return this.todos.filter(todo => {
                return !todo.status;
              })
            break;
          case 'completed':
            return this.todos.filter(todo => {
              return todo.status;
            })
            break;
          case 'important':
            return this.todos.filter(todo => {
              return todo.starred;
            })
            break;
        }
      },
      uncompletedTodo: function() {
        let count = 0;
        this.todos.forEach(todo => {
          if(todo.status == false)
            count++;
        });
        // console.log(`ini count ${count}`)
        return count;
      },
      checkCompleted: function() {
        let count = 0;
        this.todos.forEach(todo => {
          if(todo.status == true)
            count++;
        });
        // console.log(`ini count ${count}`)
        return count;
      },
      firstName: function(){
        return this.userData.name.split(' ')[0];
      }

    },
    watch: {

    },
    methods: {
      addTodo: function () {
        let value = this.newTodo && this.newTodo.trim();
        if(!value)
          return
        axios({
          method: 'post',
          url: `http://localhost:3000/api/todos/user/${this.userData.id}`,
          data: {
            text: value,
            userId: this.userData.id,
          },
          headers: {
            token: this.userData.token,
          }
        })
          .then(data => {
            this.loadTodo();
            this.newTodo = '';
          })
          .catch(err => {
            console.log(`${JSON.stringify(err.response)}`)
          })
      },

      nextInput: function() {
        document.getElementById('tags').focus();
      },

      statusToggle: function(todo){
        axios({
          method: 'put',
          url: `http://localhost:3000/api/todos/${todo._id}`,
          data: {
            status: todo.status,
          },
          headers: {
            token: this.userData.token,
          }
        })
          .then(data => {
            console.log('succeed udpate')
            console.log(data)
            console.log(this.todos)
            this.loadTodo();

          })
          .catch(err => {
            console.log(`${JSON.stringify(err.response)}`)
          })
      },

      starredToggle: function(todo) {
        axios({
          method: 'put',
          url: `http://localhost:3000/api/todos/${todo._id}`,
          data: {
            starred: todo.starred,
          },
          headers: {
            token: this.userData.token,
          }
        })
          .then(data => {
            console.log('succeed udpate')
            console.log(data)
            console.log(this.todos)
            this.loadTodo();

          })
          .catch(err => {
            console.log(`${JSON.stringify(err.response)}`)
          })
      },

      deleteTodo: function(todo) {
        axios({
          method: 'delete',
          url: `http://localhost:3000/api/todos/${todo._id}`,
          headers: {
            token: this.userData.token,
          }
        })
          .then(() => {
            this.loadTodo();
          })
          .catch(err => {
            console.log(`${JSON.stringify(err.response)}`)
          })
      },

      editTodo: function(todo) {
        this.editCache = todo.text;
        this.editedTodo = todo;
      },

      doneEdit: function(todo) {
        if (!this.editedTodo) {
          return
        }
        this.editedTodo = null;
        todo.text = todo.text.trim();
        if(!todo.text) {
          this.deleteTodo(todo);
        }
        else{
          axios({
            method: 'put',
            url: `http://localhost:3000/api/todos/${todo._id}`,
            data: {
              text: todo.text,
            },
            headers: {
              token: this.userData.token,
            }
          })
            .then(data => {
              console.log('succeed udpate')
              console.log(data)
              console.log(this.todos)
              this.loadTodo();

            })
            .catch(err => {
              console.log(`${JSON.stringify(err.response)}`)
            })
        }
      },

      cancelEdit: function(todo) {
        this.editedTodo = null;
        // console.log(`cache cancel ${this.editCache}`)
        todo.text = this.editCache;
        console.log(this.todos)
      },


      loadTodo: function() {
        axios({
          method: 'get',
          url: `http://localhost:3000/api/todos/user/${this.userData.id}`,
          headers: {
            token: this.userData.token
          }
        })
          .then(response => {
            this.todos = response.data.data.map(val => val);
            console.log(`ini list todo ${this.todos}`);
            console.log(this.todos)

          })
          .catch(err => {
            console.log(`${JSON.stringify(err.response)}`)
          })
      },

      selectCategory: function(condition) {
        switch(condition){
          case 'all':
            this.visibility = 'all'
            break;
          case 'active':
            this.visibility = 'active'
            break;
          case 'completed':
            this.visibility = 'completed'
            break;
          case 'important':
            this.visibility = 'important'
            break;
        }
      },

      completeAll: function(){
        this.todos.forEach(todo => {
          todo.status = true;
          this.statusToggle(todo);
        })
      },

      deleteAll: function(){
        this.todos.forEach(todo => {
          this.deleteTodo(todo);
        })
      },

      clearComplete: function(){
        this.todos.forEach(todo => {
          if(todo.status == true){
            this.deleteTodo(todo);
          }
        })
      },

      toggleLoginState: function (state) {
        console.log(state)
        this.loginState = state;
      },

      logout: function () {

      },

    },
    directives: {
      'focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      },
    },
    created: function(){
      this.loadTodo();
      axios({
        method: 'get',
        url: 'https://favqs.com/api/qotd',
      }).then(data => {
        console.log('quotes')
        console.log(data)
        this.quotes = {
          author: data.data.quote.author,
          text: data.data.quote.body,
        }
      })
    },
  })
}
