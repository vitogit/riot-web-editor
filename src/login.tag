<login>
  <div if={opts.authenticated}>
    Logged in
  </div>

  <div if={!opts.authenticated}>
    <p>Please sign-in with your Google account to continue.</p>
    <button onclick={login}>Sign-in</button>
  </div>

  <script>
    login() {
      console.log("login________")
    }
  </script>  
</login>
