function LoginService(clientId, scope){ 
    //Check if the current token is valid (exists & not expired.)
    //@return {Boolean} True if token still valid (not expired)
    var isTokenValid = function() {
      console.log("istokenvalid________")
      var token = gapi.auth.getToken();
      return (token && Date.now() < token.expires_at);
    };


    //Builds a request object suitable for gapi.auth.authorize calls.
    // @param {Boolean} immediateMode True if auth should be checked silently
    var buildAuthRequest = function(immediateMode) {
      var request = {
        client_id: clientId,
        scope: scope,
        immediate: immediateMode
      };
      return request;
    };

    //Attempt authorization.
    var executeRequest = function(request, done) {
      if (isTokenValid()) {
        return gapi.auth.getToken();
      } else {
        gapi.auth.authorize(request, function(result) {
          if (result && !result.error) {
            return done(null, result)
            console.log("result good________"+JSON.stringify(result))
          } else {
            return done(result.error, null)
            //var error = result ? result.error : 'Unknown authentication error';
            console.log("error________"+JSON.stringify(error))
          }
        });
      }
    };


    this.login = function (done) {
      var request = buildAuthRequest(false);
      function afterAuth(err, response){
        if(err) {
          return done(err, null)
        }
        return done(null.response)
      }
      return executeRequest(request, afterAuth);
    };

    
    //Silently check to see if a user has already authorized the app.
    this.checkAuth = function(done) {
      var request = buildAuthRequest(true);
      function afterAuth(err, response){
        if(err) {
          return done(err, null)
        }
        return done(null,response)
      }
      return executeRequest(request, afterAuth);
    };

    this.showLoginDialog = function($event) {
      console.log('show dialog');
    };
}
