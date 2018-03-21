Vue.component('navbar', {
  template: `
    <nav class="navbar navbar-expand-lg animated fadeInDown">
      <span class="navbar-brand" href="#">#todo</span>
        <ul class="navbar-nav mr-auto">
        </ul>
        <span class="navbar-text">
          <a @click="logout" class="logout" >Logout</a>
        </span>
    </nav>
  `,
  data: function () {
    return {

    }
  },
  methods: {
    logout: function () {
      this.$emit('logout');
    }
  }
})
