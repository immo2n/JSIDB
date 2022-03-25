//PREFIXS
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

////PREFIXS of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

//CHECK WHEATER THE BROWSER HAS SUPPORT FOR IndexedDB
if (!window.indexedDB) {
    console.warn("JS IDB: Browser dose not support any stable version of IndexedDB.")
}

//window.idb_available will be set to 1 if avilable.
class jsidb {
//CREATOR
//TARGET OBJS IS AN ARRAY AND ARRAYS ARE TOO
create(name, target_objs, key_paths, version = 1, upgrade_data_array){
    if(!name || !key_paths || !target_objs) {
        console.warn('JS IDB _CREATE: Parameters are not satisfied.');
        return false;
    }

    var request = window.indexedDB.open(name, version);
    
    request.onerror = function (event) {
        console.warn('JS IDB _CREATE: Error creating database('+name+')');
        window.idb_available = 0;
    };
    
    request.onsuccess = function (event) {
        console.warn('JS IDB _CREATE: IDB SUCCESS(INITIATED ALL STORES)');
        window.jsidb_main = event.target.result;
        window.idb_available = 1;
    };
    
    //UPGRADE SECTION - (LIKE UPDATING THE DATABASE)
    request.onupgradeneeded = function (event) {
        //CREATE DATA STORES
        for(let i = 0; i < target_objs.length; i++){
            window.jsidb_main =  event.target.result;
        var objectStore = window.jsidb_main.createObjectStore(target_objs[i], {
            keyPath: key_paths[i]
        });
    }
    

        //THE upgrade_data_array IS THE PREVIOUS ARRAY HAVING THE VALUE, IF IN THE FLOW NEEDED TO STORE DATA OR JUST IGNOOR. - USUALLY UNNECESSARY
        if(upgrade_data_array){
        for (var i in upgrade_data_array) {
            objectStore.add(upgrade_data_array[i]);
        }
    }

    }
    return true;
}

//STORE DATA
//THE OBJECT MUST HAVE id VALUE AND SHOULD BE AN {} OBJECT!!!
addobj(object_store_name, object){
    if(!object_store_name || !object){
        return false;
    }
    var request = window.jsidb_main.transaction([object_store_name], "readwrite")
        .objectStore(object_store_name)
        .add(object);
    request.onerror = function (event) {
        console.warn('JS IDB _ADDOBJ: Transaction error on object '+object_store_name);
    }
    return true;
}

//DELETE OBJS
delobj(object_name, key){
    if(!object_name || !key){
        return false;
    }
    var request = window.jsidb_main.transaction([object_name], "readwrite")
        .objectStore(object_name)
        .delete(key);
    request.onsuccess = function (event) {
        return true;
    };
}

//UPDATE NEEDS THE OBJECT OR DATABASE TABLE NAME, THE ID OF THE FEED THEN THE ROW AS A VALUE(OBJ)
updateobj(object, key, value){
    //DELETE THEN ADD AGAIN
    this.delobj(object, key);
    this.addobj(object, value);
}

}