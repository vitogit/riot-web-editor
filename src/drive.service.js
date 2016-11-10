  // Only fetch fields that we care about
  var DEFAULT_FIELDS = 'id,title,mimeType,userPermission,editable,copyable,fileSize';

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
  this.saveFile = function(metadata, content) {
    return googleApi.then(function(gapi) {
      var path;
      var method;

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
      return $q.when(uploadRequest);
    }).then(function(response) {
      return combineAndStoreResults(response.result, content);
    });
  };
