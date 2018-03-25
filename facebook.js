function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      // testAPI();
      console.log("send to server")
      console.log(`Auth Token: ${response.authResponse.accessToken}`)
      axios({
      method: 'post',
        url: 'http://localhost:3000/api/users/signinfb',
        headers: {
          token_fb : response.authResponse.accessToken
        }
      })
        .then(data => {
          console.log(`response login fb: ${JSON.stringify(data)}`);
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('id', data.data._id);
          localStorage.setItem('name', data.data.name);
          localStorage.setItem('email', data.data.email);
          // location.reload();
        })
        .catch(err => {
          console.log('login failed');
        })
    } else {
      // The person is not logged into your app or we are unable to tell.
      console.log('not connected')
      // document.getElementById('status').innerHTML = 'Please log ' +
      //   'into this app.';
    }
  }

  // Funtion executed when someone finished the login
  function checkLoginState() {
    console.log('masuk checkloginstate')
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  function logout () {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        FB.logout(function(response) {
          console.log('logout facebook')
          console.log(response)
        })
      }
    })
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    location.reload();
  }

  function loginfb () {
    FB.login(response => {
      if(response.authResponse) {
        console.log('ini auth response')
        console.log(response.authResponse)
        console.log('Welcome! Fecthing you information..')
        $http({
          method: 'post',
          url: '/users/signinfb',
          headers: {
            token_fb : response.authResponse.accessToken
          }
        })
        .then(data => {
          console.log(`response login fb: ${JSON.stringify(data)}`);
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('id', data.data._id);
          localStorage.setItem('name', data.data.name);
          localStorage.setItem('email', data.data.email);
          location.reload();
        })
        .catch(err => {
          console.log('login failed');
        }) 
      }
    })
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '201452943945327',
      cookie     : true,  // enable cookies to allow the server to access
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });

    // FB.getLoginStatus(function(response) {
    //   statusChangeCallback(response);
    // });

  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=201452943945327&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.

  // function testAPI() {
  //   console.log('Welcome!  Fetching your information.... ');
  //   FB.api('/me', function(response) {
  //     console.log('Successful login for: ' + response.name);
  //     document.getElementById('status').innerHTML =
  //       'Thanks for logging in, ' + response.name + '!';
  //   });
  // }
