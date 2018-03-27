const $http = axios.create({
  // baseURL: 'http://localhost:3000/api'
  baseURL: 'http://todo.server.fadhilmch.com/api'
})

function buttonPush () {
  console.log('button pushed')
}


window.onload = function () {
  var app = new Vue({
    el: '#app',
    data: {
      userData: {
        id: localStorage.getItem('id'),
        name: localStorage.getItem('name'),
        token: localStorage.getItem('token'),
        email: localStorage.getItem('email')
      },
      todos: [],
      newTodo : "",
      visibility : 'all',
      editedTodo : null,
      editCache : '',
      newTags : [],
      quotes : {},
      loginState : 'default',
      userLogin: {
        identity:'',
        password:''
      },
      userCreate: {
        name: '',
        password: '',
        email: '',
        username: ''
      }
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
        // return this.userData.name;
        return this.userData.name.split(' ')[0];
      }

    },
    watch: {

    },
    methods: {
      login: function () {
        $http({
          method: 'post',
          url: '/users/login',
          data: {
            username : this.userLogin.identity,
            email : this.userLogin.email,
            password : this.userLogin.password
          }
        })
        .then(response => {
          console.log(`Response Login : ${JSON.stringify(response)}`);
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('id', response.data.data.id);
          localStorage.setItem('name', response.data.data.name);
          localStorage.setItem('email', response.data.data.email); 
          this.userLogin.identity = '';
          this.userLogin.password = '';
          location.reload();
        })
        .catch(response => {
          this.userLogin.identity = '';
          this.userLogin.password = ''; 
          swal({
            title: "Wrong email/username/password!",
            text: "Please Sign up first if you don't have account",
            icon: "error",
          });
        })
      },
      signup: function () {
        $http({
          method: 'post',
          url: '/users/signup',
          data: {
            username : this.userCreate.username,
            email : this.userCreate.email,
            password : this.userCreate.password,
            name : this.userCreate.name
          }
        })
        .then(response => {
          console.log(`Response Signup : ${JSON.stringify(response)}`);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('id', response.data.id);
          localStorage.setItem('email', response.data.email);
          this.userCreate.name = '';
          this.userCreate.password = '';
          this.userCreate.username = '';
          this.userCreate.email = '';
          location.reload();
        })
        .catch(response => {
          this.userCreate.name = '';
          this.userCreate.password = '';
          this.userCreate.username = '';
          this.userCreate.email = '';
          swal({
            title: "Email/Username already registered!",
            text: "Please login if you already have account or sign up if you don't have account",
            icon: "error",
          });
        })
      },
      logout: function () {
        FB.logout(function(response) {
          console.log('Logout from facebook')
          console.log(response)
          statusChangeCallback(response)
        })
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        // location.reload();
      },
      addTodo: function () {
        let value = this.newTodo && this.newTodo.trim();
        if(!value)
          return
        $http({
          method: 'post',
          url: `/todos/user/${this.userData.id}`,
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
        $http({
          method: 'put',
          url: `/todos/${todo._id}`,
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
        $http({
          method: 'put',
          url: `/todos/${todo._id}`,
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
        $http({
          method: 'delete',
          url: `/todos/${todo._id}`,
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
          $http({
            method: 'put',
            url: `/todos/${todo._id}`,
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

      sendEmail: function () {
        $http({
          method: 'post',
          url: `/todos/user/${this.userData.id}/send_email`,
          data: {
            email: this.userData.email
          },
          headers: {
            token: this.userData.token
          } 
        })
          .then(data => {
            //Notif Email
            swal({
              title: "#todo sent!",
              text: "Check your email to find your #todo",
              icon: "success",
            });
          })
          .catch(err => {
            console.log(`${JSON.stringify(err.response)}`)
            swal({
              title: "Problem on Sending Email",
              text: "Sorry for this problem",
              icon: "error",
            });
          })
      },

      cancelEdit: function(todo) {
        this.editedTodo = null;
        // console.log(`cache cancel ${this.editCache}`)
        todo.text = this.editCache;
        console.log(this.todos)
      },


      loadTodo: function() {
        $http({
          method: 'get',
          url: `/todos/user/${this.userData.id}`,
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

      loginfb () {
        console.log('masuk')
        checkLoginState();
      }

    },
    directives: {
      'focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      },
    },
    created: function(){
      if(this.userData.token!==null){
        this.loadTodo();
      }

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
