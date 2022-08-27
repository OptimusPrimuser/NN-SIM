function createLayer(numNodes, layerNo) {
    var layerBase = document.getElementById("layerPlane");
    var layer = document.createElement("ul");
    layer.className = "layer";
    layer.id = "" + (layerNo);
    layers[layer.id] = [];
    //layerNO= layerNO+1
    for (var i = 0; i < numNodes; i++)
        createNode(layer, i);
    layerBase.appendChild(layer);
}

function deleteLayer(){
    var layerPlane = document.getElementById("layerPlane")
    var index = layerPlane.childNodes.length -1
    console.log("index",index,layerPlane.childNodes)
    var lastChild = layerPlane.childNodes[index]
    // there is also a extra text node
    // children = text layer1 layer2 ....
    // layers = 0:nodes, 1:nodes, 2:nodes.... 
    var iterations = layers[""+(index-1)].length 
    for(var i=0;i<iterations;i++){
        console.log("iteration",i,"length",layers[""+(index-1)].length)
        deleteNodeFromGraph(index-1)
    }
    layerPlane.removeChild(lastChild)
    delete layers[index -1]
}

function adjustNodesOfLastLayer(){
    var layerPlane = document.getElementById("layerPlane")
    var index = layerPlane.childNodes.length -1
    console.log("index",index,layerPlane.childNodes)
    var lastChild = layerPlane.childNodes[index]
    var iterations = layers[""+(index-1)].length
    let outputSize =  outputCols.length
    if(outputSize>iterations){
        for(var i=iterations;i<outputSize;i++){
            console.log("iteration",i,"length",layers[""+(index-1)].length)
            addNodeToGraph(index-1)
        }    
    }
    else{
        for(var i=outputSize;i<iterations;i++){
            console.log("iteration",i,"length",layers[""+(index-1)].length)
            deleteNodeFromGraph(index-1)
        }   
    }
}