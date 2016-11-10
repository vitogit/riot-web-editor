<app>
  <textarea id="textEditor">Write here</textarea>
  <a href="#" onclick={save}>save</a>
  <a href="#" onclick={load}>load</a>
  <a href="#" onclick={list}>list</a>

  <login authenticated={authenticated}></login>
  
  <script>
    var self = this
    this.authenticated = true
    this.CLIENT_ID = ''
    this.SCOPES = ['']
    this.loadApi = {'drive' : 'v2'}
    this.DEFAULT_FILE = {
      content: '',
      metadata: {
        id: null,
        title: 'untitled.txt',
        mimeType: 'text/plain',
        editable: true
      }
    };
    this.on('mount', function() {
      window.started_app = true;
      console.log('app mounted')
      this.checkAuth()
    })
    
    this.app_var = 'example'
    
    save(event) {
      console.log('save')
      // return drive.saveFile($scope.file.metadata, $scope.file.content).then(function(result) {
      //   redirectIfChanged(result.metadata.id);
      //   $scope.file = result;
      //   showMessage('File saved');
      //   return $scope.file;
      // }, function(err) {
      //   showMessage('Unable to save file');
      //   return $q.reject(err);
      // });      
    }
    load(event) {
      console.log('load')
    }
    list(event) {
      console.log('list')
    }    

    checkAuth() {
      if (gapi && gapi.auth) {
        riot.loginService.checkAuth(function(err, response){
          if (err){
            console.log('show login dialog')
            self.authenticated = false 
          } else {
            console.log('is logged in')
            self.authenticated = true 
          }
          self.update()

        })
      } else {
        setTimeout(this.checkAuth, 10);
      }
    }    
        
  </script>

</app>
