Vue.component('DefaultPanel', {
  template: `
  <div class="container signin">
    <div class="row">
      <div class="col-10 mx-auto">
        <div class="panel panel-default">
          <div class="choose-signin">
            <input @click="login" class="button-signin btn-block" type="submit" value="Login">
            <input @click="signup" class="button-signin btn-block" type="submit" value="Sign Up">
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data: function () {
    return {

    }
  },
  methods: {
    login: function () {
      this.$emit('loginpanel');
    },
    signup: function () {
      this.$emit('signuppanel');
    }
  }
})
