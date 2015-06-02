var crypto = {};
crypto.indexedDB = {};

//open database
crypto.indexedDB.db = null;

crypto.indexedDB.open = function(callback) {
  
  var version = 1;
  
  var request = indexedDB.open("b22", version);
  
  request.onsuccess = function(e) {
    crypto.indexedDB.db = e.target.result;
    callback(crypto.indexedDB.db);

  };
  request.onerror = crypto.indexedDB.onerror;
};

//creating an object store
crypto.indexedDB.open = function(callback) {
  
  var version = 1;
  
  var request = indexedDB.open("b22", version);
  
  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = crypto.indexedDB.onerror;
    
    if(db.objectStoreNames.contains("oecdobj")){
      db.deleteObjectStore("oecdobj");
    }
    if(db.objectStoreNames.contains("placetype")){
      db.deleteObjectStore("placetype");
    }
    if(db.objectStoreNames.contains("sitevisit")){
      db.deleteObjectStore("sitevisit");
    }
    if(db.objectStoreNames.contains("actionitemsobj")){
      db.deleteObjectStore("actionitemsobj");
    }
    if(db.objectStoreNames.contains("fieldtripobj")){
      db.deleteObjectStore("fieldtripobj");
    }
    if(db.objectStoreNames.contains("placesitemsobj")){
      db.deleteObjectStore("placesitemsobj");
    }
    if(db.objectStoreNames.contains("qtnsitemsobj")){
      db.deleteObjectStore("qtnsitemsobj");
    }
    if(db.objectStoreNames.contains("qtionairesitemsobj")){
      db.deleteObjectStore("qtionairesitemsobj");
    }
    if(db.objectStoreNames.contains("images")){
      db.deleteObjectStore("images");
    }
    if(db.objectStoreNames.contains("images")){
      db.deleteObjectStore("images");
    }  
    if(db.objectStoreNames.contains("actionitemscomments")){
      db.deleteObjectStore("actionitemscomments");
    }  
    
    var store = db.createObjectStore("oecdobj", {autoIncrement: true});
    
    var placetypesstore = db.createObjectStore("placetype", {autoIncrement: true});
    
    var fieldtripstore = db.createObjectStore("fieldtripobj", {keyPath: "nid"});
    fieldtripstore.createIndex('nid', 'nid', { unique: true });
    
    var sitevisitstore = db.createObjectStore("sitevisit", {keyPath: "nid"});
    sitevisitstore.createIndex('nid', 'nid', { unique: true });
    sitevisitstore.createIndex('pnid', 'pnid', { unique: true });
    
    var actionitemstore = db.createObjectStore("actionitemsobj", {keyPath: "nid"});
    actionitemstore.createIndex('nid', 'nid', { unique: true });    
    
    var placesitemstore = db.createObjectStore("placesitemsobj", {keyPath: "nid"});
    placesitemstore.createIndex('nid', 'nid', { unique: true });
    
    var qtnsitemstore = db.createObjectStore("qtnsitemsobj", {keyPath: "nid"});
    qtnsitemstore.createIndex('nid', 'nid', { unique: true });
    
    var qtnairesitemstore = db.createObjectStore("qtionairesitemsobj", {keyPath: "qnid"});
    qtnairesitemstore.createIndex('qnid', 'qnid', { unique: true });
    
    var images = db.createObjectStore("images", {keyPath: "nid"});
    images.createIndex('nid', 'nid', { unique: true });
    
    var actionitemcomments = db.createObjectStore("actionitemscomments", {keyPath: "anid", autoIncrement: true});
    actionitemcomments.createIndex("anid", "anid", { unique: true });
    
  };
  
  request.onsuccess = function(e) {
    crypto.indexedDB.db = e.target.result;
    callback(crypto.indexedDB.db);
  };
  
  request.onerror = crypto.indexedDB.onerror;
};

/*Delete databases 
 * 
 * var databaseName = [ 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16', 'b17'];

var req;

for(var p = 0; p < databaseName.length; p++){
  req = window.indexedDB.deleteDatabase(databaseName[p]);
}

req.onsuccess = function (response) {
    console.log("Deleted database successfully");
};
req.onerror = function (error) {
    console.log("Couldn't delete database");
};
req.onblocked = function (onblock) {
    console.log("Couldn't delete database due to the operation being blocked");
};*/

//adding taxonomy data to object store
crypto.indexedDB.addTaxonomyData = function(db, storename, pObj) {
  var d = $.Deferred();
  var trans = db.transaction(storename, "readwrite");
  var store = trans.objectStore(storename);
  var request;
  
  if(pObj.length > 0) {
    for (var i in pObj) {
      request = store.add({
        "hname": pObj[i]['parent name'],
        "htid": pObj[i]['parent term id'],
        "dname": pObj[i]['name'], 
        "weight": pObj[i]['weight'], 
        "tid": pObj[i]['term id']
      });
    }
    
    request.onsuccess = function(e) {
      console.log('we have saved the '+storename+' data');
      d.resolve();
    };
    
    request.onerror = function(e) {
      console.log(e.value);
      d.resolve();
    };
  }else{
    console.log("Server returned no "+storename);
    d.resolve();
  }
  return d;
};

//adding fieldtrips data to object store
crypto.indexedDB.addFieldtripsData = function(db, fObj) {
  var d = $.Deferred();
  var trans = db.transaction("fieldtripobj", "readwrite");
  var store = trans.objectStore("fieldtripobj");
  var request;
  
  if(fObj.length > 0){
    for (var i in fObj) {
      request = store.add(fObj[i])
    }
    
    request.onsuccess = function(e) {
      d.resolve();
    };
    
    request.onerror = function(e) {
      d.reject(e);
    };
  }else{
    d.reject("No fieldtrips returned");
  }
  
  return d;
};

//adding questions data to object store
crypto.indexedDB.addQuestionsData = function(db, qObj) {
  var d = $.Deferred();
  var trans = db.transaction("qtnsitemsobj", "readwrite");
  var store = trans.objectStore("qtnsitemsobj");
  var request;
  
  if(qObj.length > 0){
    for (var i in qObj) {
      request = store.add(qObj[i])
    }
    
    request.onsuccess = function(e) {
      d.resolve();
    };
    
    request.onerror = function(e) {
      d.reject(e);
    };
  }else{
    d.reject("No Questions returned");
  }
  
  return d;
};

//adding sitevisits data to object store
crypto.indexedDB.addSiteVisitsData = function(db, sObj) {
  var d = $.Deferred();
  var trans = db.transaction("sitevisit", "readwrite");
  var sitevisitstore = trans.objectStore("sitevisit");
  var sitevisitrequest;
  var timestamp = new Date().getTime();
  
  if(controller.sizeme(sObj) > 0 && sObj['title'] == undefined){
    for (var i in sObj) {
      if(!(sObj[i]['dbsavetime'] && sObj[i]['editflag'])){
        sObj[i]['dbsavetime'] = timestamp;
        sObj[i]['editflag'] = 0;
        
      }
      
      sitevisitrequest = sitevisitstore.add(sObj[i]);
      
    }
    
    sitevisitrequest.onsuccess = function(e) {
      console.log("added site visits");
      d.resolve();
    };
    
    sitevisitrequest.onerror = function(e) {
      console.log("error adding site visits");
      d.reject(e);
    };
  }else{
    
    if(!(sObj['dbsavetime'] && sObj['editflag'])){
      sObj['dbsavetime'] = timestamp;
      sObj['editflag'] = 0;
      
    }
    sitevisitrequest = sitevisitstore.add(sObj);
    
    sitevisitrequest.onsuccess = function(e) {
      console.log("added site visits");
      d.resolve();
    };
    
    sitevisitrequest.onerror = function(e) {
      console.log("error adding site visits "+e.target.error.message);
      d.reject(e);
    };
    
  }
  
  
  return d;
};

//adding site visit images to object store
crypto.indexedDB.addImages = function(db, iObj) {
  var d = $.Deferred();
  var trans = db.transaction("images", "readwrite");
  var store = trans.objectStore("images");
  
  var request = store.add(iObj);
  
  request.onsuccess = function(e) {
    
    d.resolve();
  };
  
  request.onerror = function(e) {
    
    d.resolve(e);
  };
  
  return d;
};

//adding action items data to object store
crypto.indexedDB.addActionItemsData = function(db, aObj) {
  var d = $.Deferred();
  var trans = db.transaction("actionitemsobj", "readwrite");
  var store = trans.objectStore("actionitemsobj");
  
  request = store.add(aObj);
  
  request.onsuccess = function(e) {
    console.log("saved actionitem "+aObj['nid'] );
    d.resolve();
  };
  
  request.onerror = function(e) {
    console.log("error saving actionitem "+aObj['nid'] );
    d.resolve(e);
  };
  
  return d;
};

//adding action item comments data to object store
crypto.indexedDB.addActionItemCommentsData = function(db, aObj) {
  var d = $.Deferred();
  var trans = db.transaction(["actionitemscomments"], "readwrite");
  var store = trans.objectStore("actionitemscomments");
  
  request = store.add(aObj);
  
  request.onsuccess = function(e) {
    console.log("saved");
    d.resolve();
  };
  
  request.onerror = function(e) {
    console.log("not saved");
    d.resolve(e);
  };
  
  return d;
};

//get all actionitem comments in database
crypto.indexedDB.getActionItemComments = function(db, cnid, state, callback) {
  var actionitemcomments = [];
  var trans = db.transaction(["actionitemscomments"], "readonly");
  var store = trans.objectStore("actionitemscomments");
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(actionitemcomments);
      return;
    }
    
    
    if(result.value[0]) {
      for(var index in result.value) {
        if(result.value[index]['anid'] == cnid && index != 'anid') {
          actionitemcomments.push(result.value[index]);    
        }
      }
        
    }else {
      if(result.value[state] == cnid) {
        actionitemcomments.push(result.value);    
      }
      
    }
    
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};


//Edit actionitem comments 
crypto.indexedDB.editItemComments = function(db, updates) {
  
  var d = $.Deferred();
  var trans = db.transaction(["actionitemscomments"], "readwrite");
  var store = trans.objectStore("actionitemscomments");
  var commentId = updates[0]['editcomment'];
  var state = "";
  if(updates['fresh_nid']) {
    state = "actionnid";
  }else {
    state = "anid";
  }
  
  crypto.indexedDB.getActionItemComments(db, commentId, state, function(itemComments) {
    crypto.indexedDB.saveActionComments(db, updates, itemComments, state, function(){
      d.resolve();
    });
  });
  
  return d;
};


//Get all action item comments
crypto.indexedDB.saveActionComments = function(db, updates, editedData, state, callback) {
  
  if(editedData.length > 0) {
    if(updates['title'] == editedData[0].comment_body.und[0].value && updates[0]['editcomment'] == editedData[0][state]) {
      editedData[0].submit = 1;
      
      var trans2 = db.transaction(["actionitemscomments"], "readwrite");
      var store2 = trans2.objectStore("actionitemscomments");
      
      // Put this updated object back into the database.
      var requestUpdate = store2.put(editedData[0]);
      requestUpdate.onerror = function(event) {
        // Do something with the error
        console.log("actionitem comments update failed");
        editedData.splice(0, 1);
        crypto.indexedDB.saveActionComments(db, updates, editedData, state, callback);
        
      };
      
      requestUpdate.onsuccess = function(event) {
        // Success - the data is updated!
        console.log("actionitem comments update success");
        editedData.splice(0, 1);
        crypto.indexedDB.saveActionComments(db, updates, editedData, state, callback);
      };
      
    } else {
      editedData.splice(0, 1);
      crypto.indexedDB.saveActionComments(db, updates, editedData, state, callback);
    }
  }else{
    callback();
  }
  
};

//Get all action item comments
crypto.indexedDB.getAllActionComments = function(db) {
  var d = $.Deferred();
  var trans = db.transaction("actionitemscomments", "readonly");
  var store = trans.objectStore("actionitemscomments");
  var actionComments = [];
  
  store.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    
    if(cursor) {
      
      if(cursor.value.submit == 0) {
        actionComments.push(cursor.value);
      }
      
      cursor.continue();
      
    }else {
      console.log('Entries all displayed.');
      d.resolve(actionComments);
    }
    
  };
  
  return d;
};


//adding questions data to object store
crypto.indexedDB.addSavedQuestions = function(db, aObj) {
  var d = $.Deferred();
  var trans = db.transaction("qtionairesitemsobj", "readwrite");
  var store = trans.objectStore("qtionairesitemsobj");
  var request;
  
  request = store.add(aObj);
  
  request.onsuccess = function(e) {
    d.resolve();
  };
  
  request.onerror = function(e) {
    d.reject(e);
  };
  
  return d;
};

//adding place data to object store
crypto.indexedDB.addPlacesData = function(db, placeObj) {
  var d = $.Deferred();
  var trans = db.transaction("placesitemsobj", "readwrite");
  var store = trans.objectStore("placesitemsobj");
  var request;
  
  if(placeObj != undefined) {
    request = store.add(placeObj);
    
    request.onsuccess = function(e) {
      console.log("places saved");
      d.resolve();
    };
    
    request.onerror = function(e) {
      console.log("Not saved "+e.target.error.name);
      d.reject(e);
    };
  }else {
    d.reject("No places returned");
  }
  return d;
};


//count taxonomies
crypto.indexedDB.countTaxonomyItems = function(db, storename, callback) {
  
  var trans = db.transaction([storename], "readonly");
  var store = trans.objectStore(storename);
  var taxonomies = [];
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(taxonomies);
      return;
    }
    
    taxonomies.push(result.value);
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
  
};

//query taxonomy data from datastore
crypto.indexedDB.getAllTaxonomyItems = function(db, storename, callback) {
  var trans = db.transaction([storename], "readonly");
  var store = trans.objectStore(storename);
  
  var taxonomies = [];
  var category = "";
  var childarray = [];
  
  var i = 0;
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(taxonomies);
      return;
    }
    i = i + 1;
    
    if(category != result.value["hname"]) {
      category = result.value["hname"];
      
      var htid = result.value["htid"];
      var category_name = result.value["hname"];
      
      var childname = result.value["dname"];
      var childId = result.value["tid"];
      var childobject = {"cname": childname, "tid": childId};
      
      childarray = [];
      childarray.push(childobject);
      
      var taxonomyobject = {"hname": category_name, "htid": htid, "children": childarray};
      taxonomies.push(taxonomyobject);
      
    }else
    {
      
      var childname = result.value["dname"];
      var childId = result.value["tid"];
      var childobject = {"cname": childname, "tid": childId};
      
      taxonomies[taxonomies.length - 1]['children'].push(childobject);
    }
    
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//get all fieldtrips in database
crypto.indexedDB.getAllFieldtripItems = function(db, callback) {
  var fieldtrips = [];
  var trans = db.transaction(["fieldtripobj"], "readonly");
  var store = trans.objectStore("fieldtripobj");
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(fieldtrips);
      return;
    }
    
    fieldtrips.push(result.value);
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//get all questions in database
crypto.indexedDB.getAllQuestionItems = function(db, ftritem, callback) {
  var qtns = [];
  var trans = db.transaction(["qtnsitemsobj"], "readonly");
  var store = trans.objectStore("qtnsitemsobj");
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    
    if(!!result == false) {
      callback(qtns);
      return;
    }
    
    result["continue"]();
    
    if(ftritem['taxonomy_vocabulary_1'] != undefined) {
      //check for question to retrieve
      if(ftritem['taxonomy_vocabulary_1']['und'] != undefined && result.value.status == 1) {
        if(ftritem['taxonomy_vocabulary_1']['und'][0]['tid'] == result.value.taxonomy_vocabulary_1.und[0].tid) {
          qtns.push(result.value);
        }  
      }
      
    }
    
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//get all sitevisits in database
crypto.indexedDB.getAllSitevisits = function(db, callback) {
  var sitevisits = [];
  var trans = db.transaction(["sitevisit"], "readonly");
  var store = trans.objectStore("sitevisit");
  
  // Get everything in the store;
  //var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor();
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(sitevisits);
      return;
    }
    
    sitevisits.push(result.value);
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//search sitevisits using index of nid
crypto.indexedDB.getSitevisit = function(db, snid) {
  var d = $.Deferred();
  var trans = db.transaction(["sitevisit"], "readonly");
  var store = trans.objectStore("sitevisit");
  
  var index = store.index("nid");
  index.get(snid).onsuccess = function(event) {
    //callback(event.target.result);
    //d.resolve(event.target.result);
    ftritem = event.target.result;
  };
  
  trans.oncomplete = function(event) {
    d.resolve(ftritem);
  };
  
  trans.error = function(event) {
    //d.resolve(ftritem);
    console.log("get site visit error");
  };
  
  return d;
};

//search sitevisits using index of 
crypto.indexedDB.getSitevisitBypnid = function(db, pnid) {
  var d = $.Deferred();
  var trans = db.transaction(["sitevisit"], "readonly");
  var store = trans.objectStore("sitevisit");
  
  var index = store.index("pnid");
  index.get(pnid).onsuccess = function(event) {
    
    ftritem = event.target.result;
  };
  
  trans.oncomplete = function(event) {
    d.resolve(ftritem);
  };
  
  trans.error = function(event) {
    
    console.log("get site visit error");
  };
  
  return d;
};

//search images using index of nid
crypto.indexedDB.getImage = function(db, inid, newnid, vd, siteid) {
  var d = $.Deferred();
  var trans = db.transaction(["images"], "readonly");
  var store = trans.objectStore("images");
  var image = null;
  
  console.log("Searching for snid "+inid);
  
  var index = store.index("nid");
  index.get(inid).onsuccess = function(event) {
    image = event.target.result;
    if(image != undefined){
      console.log("Found images");
      d.resolve(image, newnid, vd, siteid);  
    }else{
      console.log("Not Found images");
      d.reject();      
    }
    
  };
  
  return d;
};

//edit image
crypto.indexedDB.editImage = function(db, inid, updates, newImages) {
  var d = $.Deferred();
  
  var trans = db.transaction(["images"], "readwrite");
  var store = trans.objectStore("images");
  
  var request = store.get(inid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting place to update "+pnid);
  };
  
  request.onsuccess = function(event) {
    // Get the old value that we want to update
    var data = request.result;
    
    if(newImages['names'].length > 0){
      for(var indx in data['names']) {
        for(var indx2 in newImages['names']) {
          if(data['names'][indx] == newImages['names'][indx2]) {
            data['names'].splice(indx, 1);
            data['base64s'].splice(indx, 1);
            data['kitkat'].splice(indx, 1);
            
          }
        }
      }
    }
    
    for(var key in updates){
      if(key == "names") {
        for(var index in data['names']) {
          for(var index2 in updates['names']) {
            if(data['names'][index] == updates['names'][index2]) {
              updates['names'].splice(index2, 1);
              updates['base64s'].splice(index2, 1);
              updates['kitkat'].splice(index2, 1);
              
            }
          }
        }
        
        for(var mark in updates['names']) {
          console.log("saving images "+updates['names'][mark]);
          
          data['names'].push(updates['names'][mark]);
          data['base64s'].push(updates['base64s'][mark]);
          data['kitkat'].push(updates['kitkat'][mark]);
          
        }
      }
      if(key == "title"){
        data['title'] = updates['title']; 
      }
      if(key == "submit"){
        data['submit'] = updates['submit']; 
      }
      if(key == "fresh_nid"){
        data['fresh_nid'] = updates['fresh_nid']; 
      }
    }
    
    var trans2 = db.transaction(["images"], "readwrite");
    var store2 = trans2.objectStore("images");
    
    // Put this updated object back into the database.
    var requestUpdate = store2.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("image update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("image update success");
      d.resolve();
    };
  };
  return d;
};

//search action items 
crypto.indexedDB.getActionItem = function(db, anid) {
  var d = $.Deferred();
  var trans = db.transaction(["actionitemsobj"], "readonly");
  var store = trans.objectStore("actionitemsobj");
  
  var index = store.index("nid");
  index.get(anid).onsuccess = function(event) {
    d.resolve(event.target.result);
  };
  
  return d;
};


//get all action items in database
crypto.indexedDB.getAllActionitems = function(db, callback) {
  var actionitems = [];
  var trans = db.transaction(["actionitemsobj"], "readwrite");
  var store = trans.objectStore("actionitemsobj");
  
  /*//Get everything in the store;
  var cursorRequest = store.openCursor();
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(actionitems);
    }
    
    actionitems.push(result.value);
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;*/
  
  var keyRange = IDBKeyRange.lowerBound(0);
  
  trans.oncomplete = function(evt) { 
    console.log("total items "+actionitems.length);
    callback(actionitems);
    
    
  };
  
  
  
  var cursorRequest = store.openCursor(keyRange);
  
  
  
  cursorRequest.onerror = function(error) {
    
    console.log(error);
    
  };
  
  
  
  cursorRequest.onsuccess = function(evt) {                   
    
    var cursor = evt.target.result;
    
    if (cursor) {
      
      console.log("Getting item "+cursor.value.title);
      actionitems.push(cursor.value);
      
      cursor.continue();
      
    }
  };
};

//get all user saved answers in database
crypto.indexedDB.getAllSavedAnswers = function(db, callback) {
  var answers = [];
  var trans = db.transaction(["qtionairesitemsobj"], "readonly");
  var store = trans.objectStore("qtionairesitemsobj");
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(answers);
      return;
    }
    
    answers.push(result.value);
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//get all locations or places in database
crypto.indexedDB.getAllplaces = function(db, callback) {
  var places = [];
  var trans = db.transaction(["placesitemsobj"], "readonly");
  var store = trans.objectStore("placesitemsobj");
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(places);
      return;
    }
    
    places.push(result.value);
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//get all images in database
crypto.indexedDB.getAllImages = function(db, callback) {
  var images = [];
  var trans = db.transaction(["images"], "readonly");
  var store = trans.objectStore("images");
  
  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);
  
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false) {
      callback(images);
      return;
    }
    
    images.push(result.value);
    
    result["continue"]();
  };
  
  cursorRequest.onerror = crypto.indexedDB.onerror;
};

//get a place items from database
crypto.indexedDB.getPlace = function(db, pnid, callback) {
  var trans = db.transaction(["placesitemsobj"], "readonly");
  var store = trans.objectStore("placesitemsobj");
  
  var index = store.index("nid");
  index.get(pnid).onsuccess = function(event) {
    callback(event.target.result);
  };
  
};

//get action item from database
crypto.indexedDB.getActionitem = function(db, anid, callback) {
  var trans = db.transaction(["actionitemsobj"], "readonly");
  var store = trans.objectStore("actionitemsobj");
  
  var index = store.index("nid");
  index.get(anid).onsuccess = function(event) {
    callback(event.target.result);
  };
  
};

//get fieldtrip item from database
crypto.indexedDB.getFieldtrip = function(db, fnid, callback) {
  var d = $.Deferred();
  
  var trans = db.transaction(["fieldtripobj"], "readonly");
  var store = trans.objectStore("fieldtripobj");
  
  var index = store.index("nid");
  index.get(fnid).onsuccess = function(event) {
    callback(event.target.result);
    d.resolve();
  };
  
  return d;
  
};

//edit fieldtrip
crypto.indexedDB.editFieldtrip = function(db, fnid, updates) {
  var d = $.Deferred();
  var trans = db.transaction(["fieldtripobj"], "readwrite");
  var store = trans.objectStore("fieldtripobj");
  
  var request = store.get(fnid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting fieldtrip to update "+fnid);
  };
  
  request.onsuccess = function(event) {
    var timestamp = new Date().getTime();
    
    // Get the old value that we want to update
    var data = request.result;
    if(updates['title'] != undefined){
      data.title = updates['title'];  
    }
    if(updates['editflag'] != undefined){
      data.editflag = updates['editflag'];  
    }
    if(updates['submit'] != undefined){
      data.submit = updates['submit'];  
    }
    
    // update the value(s) in the object that you want to change
    // Put this updated object back into the database.
    var requestUpdate = store.put(data);
    
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Fieldtrip update failed");
      d.resolve();
    };
    
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("Fieldtrip update success");
      //callback();
      d.resolve();
    };
  };
  return d;
};

//edit actionitem information
crypto.indexedDB.editActionitem = function(db, anid, updates) {
  var d = $.Deferred();
  
  var trans = db.transaction(["actionitemsobj"], "readwrite");
  var store = trans.objectStore("actionitemsobj");
  
  var request = store.get(anid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting action items to update "+anid);
  };
  request.onsuccess = function(event) {
    // Get the old value that we want to update
    var data = request.result;
    data.submit = updates['submit'];
    data['fresh_nid'] = updates['fresh_nid'];
    
    // Put this updated object back into the database.
    var requestUpdate = store.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Action item update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      //store['delete'](anid);
      console.log("Action item update success");
      d.resolve();
    };
  };
  return d;
};

//edit place
crypto.indexedDB.editPlace = function(db, pnid, updates) {
  var d = $.Deferred();
  
  var trans = db.transaction(["placesitemsobj"], "readwrite");
  var store = trans.objectStore("placesitemsobj");
  
  var request = store.get(pnid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting place to update "+pnid);
  };
  
  request.onsuccess = function(event) {
    // Get the old value that we want to update
    var data = request.result;
    
    for(var key in updates){
      if(key == "email"){
        if(data['field_place_email']['und']) {
          data['field_place_email']['und'][0]['email'] = updates['email'];  
        }        
      }
      if(key == "phone"){
        if(data['field_place_phone']['und']){
          data['field_place_phone']['und'][0]['value'] = updates['phone'];  
        }
      }
      if(key == "website"){
        if(data['field_place_website']['und']){
          data['field_place_website']['und'][0]['url'] = updates['website'];  
        }
        
      }
      if(key == "name"){
        if(data['field_place_responsible_person'].length > 0){
          data['field_place_responsible_person']['und'][0]['value'] = updates['name'];  
        }else if(controller.sizeme(data['field_place_responsible_person']) > 0 ){
          data['field_place_responsible_person']['und'][0]['value'] = updates['name'];
        }
        
      }
      if(key == "gpslat"){
        data['field_place_lat_long']['und'][0]['lat'] = updates['gpslat']; 
      }
      if(key == "gpslon"){
        data['field_place_lat_long']['und'][0]['lon'] = updates['gpslon']; 
      }
      if(key == "editflag"){
        data['editflag'] = updates['editflag']; 
      }
      if(key == "title"){
        data['title'] = updates['title']; 
      }
      if(key == "submit"){
        data['submit'] = updates['submit']; 
      }
      if(key == "fresh_nid"){
        data['fresh_nid'] = updates['fresh_nid']; 
      }
      if(key == "placetype"){
        data['taxonomy_vocabulary_1']['und'][0]['tid'] = updates['placetype']; 
      }
    }
    
    var trans2 = db.transaction(["placesitemsobj"], "readwrite");
    var store2 = trans2.objectStore("placesitemsobj");
    
    // Put this updated object back into the database.
    var requestUpdate = store2.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Place update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      // Success - the data is updated!
      console.log("Place update success");
      d.resolve(pnid);
    };
  };
  return d;
};

//edit site visit
crypto.indexedDB.editSitevisit = function(db, snid, updates) {
  var d = $.Deferred();
  
  var trans = db.transaction(["sitevisit"], "readwrite");
  var store = trans.objectStore("sitevisit");
  
  var request = store.get(snid);
  request.onerror = function(event) {
    // Handle errors!
    console.log("Error getting site visit to update "+snid);
  };
  request.onsuccess = function(event) {
    // Get the old value that we want to update
    var data = request.result;
    
    for(var key in updates){
      console.log("we have these keys "+key);
      if(key == "title"){
        data['title'] = updates['title'];  
      } 
      if(key == "date"){
        var thedate = "";
        if(updates['date'].indexOf('T') != -1) {
          thedate = updates['date'].substring(0, updates['date'].indexOf('T'));  
        }else {
          thedate = updates['date'];
        }
        
        data['field_ftritem_date_visited']['und'][0]['value'] = thedate;
      }
      if(key  == "summary"){
        data['field_ftritem_public_summary']['und'][0]['value'] = updates['summary'];
      }
      if(key  == "report"){
        data['field_ftritem_narrative']['und'][0]['value'] = updates['report'];
      }
      if(key == "submit"){
        data['submit'] = updates['submit'];
      }
      if(key == "editflag"){
        data['editflag'] = updates['editflag'];
      }
      if(key == "fresh_nid"){
        data['fresh_nid'] = updates['fresh_nid'];
      }
    }
    
    var trans2 = db.transaction(["sitevisit"], "readwrite");
    var store2 = trans2.objectStore("sitevisit");
    
    // Put this updated object back into the database.
    var requestUpdate = store2.put(data);
    requestUpdate.onerror = function(event) {
      // Do something with the error
      console.log("Site visit update failed");
      d.reject();
    };
    requestUpdate.onsuccess = function(event) {
      
      d.resolve();
    };
  };
  
  return d;
};

//delete place
crypto.indexedDB.deletePlace = function(db, pnid) {
  var trans = db.transaction(["placesitemsobj"], "readwrite");
  var store = trans.objectStore("placesitemsobj");
  
  var request = store['delete'](pnid);
  
  request.onsuccess = function(e) {
    console.log("Deleted sitevisit "+pnid);
  };
  
  request.onerror = function(e) {
    console.log(e);
  };
};

//delete sitevisit
crypto.indexedDB.deleteSitevisit = function(db, snid) {
  var trans = db.transaction(["sitevisit"], "readwrite");
  var store = trans.objectStore("sitevisit");
  
  var request = store['delete'](snid);
  
  request.onsuccess = function(e) {
    console.log("Deleted sitevisit "+snid);
  };
  
  request.onerror = function(e) {
    console.log(e);
  };
};

//delete image
crypto.indexedDB.deleteImage = function(db, id) {
  var trans = db.transaction(["images"], "readwrite");
  var store = trans.objectStore("images");
  
  var request = store['delete'](id);
  
  request.onsuccess = function(e) {
    console.log("Deleted image "+id);
  };
  
  request.onerror = function(e) {
    console.log(e);
  };
};

//delete action item
crypto.indexedDB.deleteActionitem = function(db, id) {
  var trans = db.transaction(["actionitemsobj"], "readwrite");
  var store = trans.objectStore("actionitemsobj");
  
  var request = store['delete'](id);
  
  request.onsuccess = function(e) {
    console.log("deleted action item "+id);
  };
  
  request.onerror = function(e) {
    console.log(e);
  };
};

//get and delete all nodes in database
crypto.indexedDB.clearDatabase = function(db, counter, callback) {
  
  if(counter > controller.objectstores.length - 1) {
    callback();
  }else {
    var trans = db.transaction([controller.objectstores[counter]], "readwrite");
    var store = trans.objectStore(controller.objectstores[counter]);
    
    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);
    
    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      if(!!result == false) {
        counter = counter + 1;
        crypto.indexedDB.clearDatabase(db, counter, callback);
        
      }
      
      if(result != null) {
        store['delete'](result.key);
        result["continue"]();
      }
      
    };
    
    cursorRequest.onerror = crypto.indexedDB.onerror;  
  }
  
};