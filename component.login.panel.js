Vue.component('LoginPanel', {
  template: `
  <div class="container signin">
    <div class="row">
      <div class="col-10 mx-auto">
        <div class="panel panel-default">
          <div class="panel-heading">
            <div class="row">
              <h1 class="panel-title mx-auto">Login</h1>
            </div>
            <br>
          </div>
          <div class="panel-body">
            <form accept-charset="UTF-8" role="form">
              <fieldset>
                <div class="form-group">
                  <input class="form-control" placeholder="E-mail" name="email" type="text">
                </div>
                <div class="form-group">
                  <input class="form-control" placeholder="Password" name="password" type="password" value="">
                </div>
                <input class="submit button-signin btn-block" type="submit" value="Login">
              </fieldset>
            </form>
            <input @click='defaultpanel' class="back" type="submit" value="Back">
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
    defaultpanel: function () {
      this.$emit('defaultpanel')
    }
  }
})
