function DriveService(){ 

  // Only fetch fields that we care about
  var DEFAULT_FIELDS = 'id,description,fileExtension,fileSize,modifiedDate,title';

  /**
   * Combines metadata & content into a single object & caches the result
   *
   * @param {Object} metadata File metadata
   * @param {String} content File content
   * @return {Object} combined object
   */
  var combineAndStoreResults = function(metadata, content) {
    var file = {
      metadata: metadata,
      content: content
    };
    return file;
  };

  /**
   * Load a file from Drive. Fetches both the metadata & content in parallel.
   *
   * @param {String} fileID ID of the file to load
   * @return {Promise} promise that resolves to an object containing the file metadata & content
   */
  this.loadFile = function(fileId) {
    return googleApi.then(function(gapi) {
      var metadataRequest = gapi.client.drive.files.get({
        fileId: fileId,
        fields: DEFAULT_FIELDS
      });
      var contentRequest = gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });
      return $q.all([$q.when(metadataRequest), $q.when(contentRequest)]);
    }).then(function(responses) {
      return combineAndStoreResults(responses[0].result, responses[1].body);
    });
  };

 /**
   * Save a file to Drive using the mutlipart upload protocol.
   *
   * @param {Object} metadata File metadata to save
   * @param {String} content File content
   * @return {Promise} promise that resolves to an object containing the current file metadata & content
   */
  this.saveFile = function(file, done) {
    console.log("file.id________"+JSON.stringify(file.id))
    function addContent(fileId) {
      return gapi.client.request({
          path: '/upload/drive/v3/files/' + fileId,
          method: 'PATCH',
          params: {
            uploadType: 'media'
          },
          body: file.content
        })
    }
    
    if (file.id) { //just update
      addContent(file.id).then(function(resp) {
        console.log('File just updated', resp.result)
        done(resp.result)
      })
    }else { //create and update
      gapi.client.drive.files.create({
        mimeType: 'application/vnd.google-apps.document',
        name: file.name,  
        fields: 'id'
      }).then(function(resp) {
        addContent(resp.result.id).then(function(resp) {
          console.log('created and added content', resp.result)
          done(resp.result)
        })
      });  
    }

  }
  
  this.listFiles = function(done) {
    var request = gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    });

    request.execute(function(resp) {
      console.log("resp________"+JSON.stringify(resp))
      done(resp.files)
    });
  }  
}
