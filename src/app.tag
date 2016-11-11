<app>
  <textarea id="textEditor">Write here</textarea>
  <a href="#" onclick={save}>save</a>
  <a href="#" onclick={load}>load</a>
  <a href="#" onclick={list}>list</a>

  
  <login authenticated={authenticated}></login>
  
  <div id="filesListSection">
    <ul>
      <li each={files}>
        <span data-id={id}>{name}</span>
      </li>
    </ul>
  </div>
  
  <script>
    var self = this
    this.authenticated = true
    this.CLIENT_ID = ''
    this.SCOPES = ['']
    this.DEFAULT_FILE = {
      content: '',
      id:null,
      name: 'notes.txt'
    };
    
    this.on('mount', function() {
      console.log('app mounted')
      window.started_app = true;
      this.checkAuth()
    })
    
    this.current_file = this.DEFAULT_FILE
    this.files = []
    save(event) {
      this.current_file.content = this.textEditor.value
      riot.driveService.saveFile(this.current_file, function(file){
        console.log("saved JSON.stringify(file________"+JSON.stringify(file))
        self.current_file = file
      })
    }

    load(event) {
      console.log('load')
    }
    list(event) {
      console.log('list')
      this.files = []
      riot.driveService.listFiles(function(files){
        self.files = files;
        console.log("list________"+JSON.stringify(files))
        self.update();
      })      
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
