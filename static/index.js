(function () {

  var app = {
    data: function () {
      return {
        auth: {
          login: 'user1',
          password: 'admin',
        },
        facebookToken: null,
        appToken: null,
        status: '',
        message: null,
        exampleId: '',
        searchDevices: '',
      };
    },
    methods: {
      onSearchDevices: function () {
        this.message = null;
        fetch('/api/devices?search=' + this.searchDevices, {
          headers: {
            'Authorization': 'Bearer ' + this.appToken,
          }
        })
          .then(response => response.json())
          .then(result => this.message = result);
      },
      onFacebookAuth: function () {
        this.message = null;
        FB.login((response) => {
          this.message = response;
          if (response.authResponse) {
            this.facebookToken = response.authResponse.accessToken;

            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
              console.log('Good to see you, ' + response.name + '.');
              console.log(response);
            });
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, { scope: 'public_profile,email' });
      },
      onFacebookLoginStatus: function () {
        this.message = null;
        FB.getLoginStatus((response) => {
          this.message = response;
          if (response.status === 'connected') {
            this.facebookToken = response.authResponse.accessToken;
          }
        });
      },
      onFacebookLogin: function () {
        this.message = null;
        fetch('/api/auth', {
          method: 'POST',
          headers: {
            'FacebookAccessToken': this.facebookToken,
            // 'FacebookAccessToken': 'EAADLgsYDHE4BAO0t7iwV4Ik3dYRIdNhBdmXZBZAZCf6UmFvUTGQWVv8pk3wd3tXrWTm1nYBPYBxW2Yn7IIW2Lajk7KUDOFWhBKbX8fEhhDqZB3hhr4pQnJrLz4rGhWH7u1nQX4UBVKFJUZAlpBqkQmLTZBwaaN2mqIN4ZCig51WxAeWQ6JcUve6pT9NWnxuc8Ccl4AnrwBj8VCMKnEZCusZAZCLYyN5TC2bt2ib1AttkCRcecPHMzfDKqW',
          },
        })
          .then(response => response.json())
          .then(result => {
            this.message = result;
            this.appToken = result.token;
          });
      },
      onBasicLogin: function () {
        this.message = null;
        fetch('/api/auth', {
          method: 'POST',
          headers: {
            // 'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.auth)
        })
          .then(response => response.json())
          .then(result => {
            this.message = result;
            this.appToken = result.token;
          });
      },
      getUsers: function () {
        this.message = null;
        fetch('/api/users', {
          headers: {
            'Authorization': 'Bearer ' + this.appToken
          }
        })
          .then(response => response.json())
          .then(result => this.message = result);
      },
      getDevices: function () {
        this.message = null;
        fetch('/api/devices', {
          headers: {
            'Authorization': 'Bearer ' + this.appToken,
          }
        })
          .then(response => response.json())
          .then(result => this.message = result);
      },
      getOffices: function () {
        this.message = null;
        fetch('/api/offices', {
          headers: {
            'Authorization': 'Bearer ' + this.appToken,
          }
        })
          .then(response => response.json())
          .then(result => this.message = result);
      },
      getPlaces: function () {
        this.message = null;
        fetch('/api/places', {
          headers: {
            'Authorization': 'Bearer ' + this.appToken,
          }
        })
          .then(response => response.json())
          .then(result => this.message = result);
      },
        identify: function () {
            this.message = null;
            fetch('/api/identify/' + this.exampleId, {
                headers: {
                    'Authorization': 'Bearer ' + this.appToken,
                }
            })
                .then(response => response.json())
                .then(result => this.message = result);
        },
        getCurrentUser: function () {
            this.message = null;
            fetch('/api/users/current' + this.exampleId, {
                headers: {
                    'Authorization': 'Bearer ' + this.appToken,
                }
            })
                .then(response => response.json())
                .then(result => this.message = result);
        }
    }
  };


  new Vue(app).$mount('#app');

})();