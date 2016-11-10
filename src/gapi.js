function on_gapi_loaded() {
  if (window.started_app) {
    window.init_gapi();
  } else {
    setTimeout(on_gapi_loaded, 10);
  }
}

function init_gapi() {
  console.log('init gapi')
  gapi.client.load('drive' , 'v2')
  console.log("gapi________"+JSON.stringify(''))
  console.log("gapiauth________"+JSON.stringify(gapi.auth))
  var tokens = gapi.auth.getToken();
    console.log("tokens________"+JSON.stringify(tokens))
      riot.mount('*')
  //this.checkAuth()

}
