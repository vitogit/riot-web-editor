function on_gapi_loaded() {
  if (window.started_app) {
    window.init_gapi();
  } else {
    setTimeout(on_gapi_loaded, 10);
  }
}

function init_gapi() {
  gapi.client.load('drive' , 'v3')
  console.log("gapiclientloaded________")
  riot.mount('*')
}
