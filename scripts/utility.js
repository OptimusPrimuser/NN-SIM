function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function defaultMapReturn(mapElement,key,defaultValue){
    if (mapElement.has(key)==false){
        return defaultValue
    }
    else{
        return mapElement.get(key)
    }
}

function doNothing(data){
    return data
}

function shuffleArray(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}