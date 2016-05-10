import realm from '../components/realm';

/**
 * Get the count from the server for last sync.
 * @return server's last sync count.
 */
var getSyncCount = function() {

};

/**
 * Synchronizes the data recieved from the server to the local database.
 * @param {object} syncChunk - contains all data from the server that must be
 *     synced in local database.
 * @pre - No conflicts are detected in sync data
 * @post = The database will be in sync with server
 * @return true indicating sync is successful, otherwise failure
 */
var localSyncFromServer = function(syncChunk) {
  // TODO: Possibly consider naming function as a full sync function
  // Get the keys and sort them numerically
  var usnNumbers = Object.keys(syncChunk);
  // For each usn apply object to database
  usnNumbers.forEach(function(usn, index, collection) {
    var realmSyncID = syncChunk[usn].realmSyncId;
    var type = syncChunk[usn].type;
    var object = syncChunk[usn].body;
    var filteredText = 'realmSyncId = "' + realmSyncID + '"';
    let objectToBeModified = realm.object(type).filtered(realmSyncID);
    if (objectToBeModified !== undefined) {
      objectToBeModified = syncChunk[usn].body;
    } else {
      realm.write(() => {
        realm.create(type, object);
      });
    }
  });
};