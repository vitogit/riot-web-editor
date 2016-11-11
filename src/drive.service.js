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
  this.saveFile = function(metadata, content, done) {
      var path;
      var method;
      console.log("metadata.id________"+metadata.id)
      if (metadata.id) {
        path = '/upload/drive/v2/files/' + encodeURIComponent(metadata.id);
        method = 'PUT';
      } else {
        path = '/upload/drive/v2/files';
        method = 'POST';
      }
      
     var multipart = new MultiPartBuilder()
        .append('application/json', JSON.stringify(metadata))
        .append(metadata.mimeType, content)
        .finish();      
      
      var uploadRequest = gapi.client.request({
        path: path,
        method: method,
        params: {
          uploadType: 'multipart',
          fields: DEFAULT_FIELDS
        },
        headers: { 'Content-Type' : multipart.type },
        body: multipart.body
      });
      
      uploadRequest.execute(function(resp) {
        console.log("JSON.stringify(resp)________"+JSON.stringify(resp))
        console.log("JSON.stringify(resp)________"+JSON.stringify(resp.result))
        var file = combineAndStoreResults(resp, content);
        done(file)
      });
    }
}
