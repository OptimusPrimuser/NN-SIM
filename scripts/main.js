let layers = {};
//let layerNO = 0;
var areConnectionsPositioned= new Map();
var connectionsMap = new Map();
var builtNN = null
//var layerIndex=string[];
var shuffledIndexes=[]
//function 
window.onresize = function(){
    //autoZoom();
    resetConnectionPositions();
}



var data=null
var inputCols=null
var outputCols=null
var colToIndex=null
var valueToUniqueLabel=null
window.onload = function () {
    
    var sentData = localStorage.getItem('data');
    sentData = JSON.parse(sentData);

    data = sentData["inputData"]
    inputCols = sentData["inputColumns"]
    outputCols = sentData["outputColumns"]
    colToIndex = sentData["columnToIndex"]
    valueToUniqueLabel = sentData["valueToUniqueLabel"]
    for(let i=0;i<data[0].length;i++){
        shuffledIndexes.push(i)
    }
    shuffledIndexes = shuffleArray(shuffledIndexes)
    createLayer(inputCols.length,0)
    createLayer(outputCols.length,1)
    addNodeConfig()
    addNodeConfig()
    makeConnections(layers,2)
    //autoZoom();
};



