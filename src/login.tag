<login>
  <div if={opts.authenticated}>
    Logged in
  </div>

  <div if={!opts.authenticated}>
    <p>Please sign-in with your Google account to continue.</p>
    <button onclick={login}>Sign-in</button>
  </div>

  <script>
    var self = this
    login() {
      console.log("login________")
        riot.loginService.login(function(err, response){
          if (err){
            console.log('Login error')
            self.parent.authenticated = false 
          } else {
            console.log('Login ok')
            self.parent.authenticated = true 
          }
          self.parent.update()
        })      
    }
  </script>  
</login>
