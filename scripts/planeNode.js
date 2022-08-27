
function createNode(parentElement, no) {
    var node = document.createElement("div");
    node.className = "node";
    node.innerHTML = "" + (no);
    node.id = (parentElement.id) + "-" + (no);
    node.onmouseenter = updateNodeConnections
    // node.onmouseleave = connectionUnFocus
    layers[parentElement.id].push(node);
    var li = document.createElement("li");
    li.appendChild(node);
    parentElement.appendChild(li);
    return node
}


function addNodeToGraph(layerNo){

    var layer = document.getElementById(""+layerNo)
    
    var node =createNode(layer,layer.childElementCount)
    console.log(parseInt(layerNo)+1)
    console.log(layers)
    var nextLayer = layers[""+(parseInt(layerNo)+1)]
    var perviousLayer = layers[""+(parseInt(layerNo)-1)]
    if (nextLayer){
        nodeToLayerConnection(node,nextLayer)
        if (perviousLayer){
            layertoNodeConnection(node,perviousLayer)
        }
    }
    else{
        
        layertoNodeConnection(node,perviousLayer)
    }
    
}

function deleteNodeFromGraph(layerNo){
    console.log(layerNo)
    var layer = layers[""+layerNo]
    var node = layer[layer.length-1]
    var listItem = node.parentElement
    var unorderedList = listItem.parentElement
    var nextLayer = layers[""+(parseInt(layerNo)+1)]
    var perviousLayer = layers[""+(parseInt(layerNo)-1)]
    console.log(perviousLayer)
    if (nextLayer){
        deleteNextLayerConnections(node)
        if (perviousLayer){
            deletePreviousLayerConnections(perviousLayer)
        }
    }
    else{
        
        deletePreviousLayerConnections(perviousLayer)
    }
    unorderedList.removeChild(listItem)
    layers[""+layerNo].pop()
}


