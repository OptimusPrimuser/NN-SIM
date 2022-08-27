
function makeNodeConnection(start,end){
    var connection = new LeaderLine(
                LeaderLine.mouseHoverAnchor(
                    {
                        element:start, 
                        showEffectName:'draw',
                        style:{backgroundColor: 'black'},///'rgba(255,255,255,0.5)',},
                        hoverStyle:{backgroundColor: 'black'},//'rgba(255,255,255,0.5)',}
                    }
                ),
                end,
                {
                    size: 2,
                    endPlugSize:1,
                    path:'straight',
                    startSocket: 'right',
                    endSocket: 'left',
                    
                }
        )
    
    var data = defaultMapReturn(connectionsMap,start.id,new Array())
    data.push(connection)
    connectionsMap.set(start.id, data)
    areConnectionsPositioned.set(start.id,false)
    return connection
}


function nodeToLayerConnection(node,layer){
    for(var layerIndex=0; layerIndex<layer.length;layerIndex++){
        makeNodeConnection(node,layer[layerIndex])
    }
}

function layertoNodeConnection(node,layer){
    for(var layerIndex=0; layerIndex<layer.length;layerIndex++){
        makeNodeConnection(layer[layerIndex],node)
    }
}

function makeLayerConnection(firstLayer,secondLayer){
    for(var firstIndex=0; firstIndex<firstLayer.length;firstIndex++){
        for(var secondIndex=0; secondIndex<secondLayer.length;secondIndex++){
            makeNodeConnection(firstLayer[firstIndex],secondLayer[secondIndex])
        }    
    }    
}

function updateNodeConnections(element){
    //console.log(element)
    var elementId= element.target.id
    if (areConnectionsPositioned.get(elementId)==false){
        updateConnections(connectionsMap.get(elementId))
        areConnectionsPositioned.set(elementId,true);
    }
    //element.target.style.backgroundColor = 'black'//'rgba(255,255,255,0.5)'
}

function deletePreviousLayerConnections(layer){
    for (var i=0; i<layer.length;i++){
        var key = layer[i].id
        var deleteConnection = connectionsMap.get(key).pop()
        console.log("layer",key,connectionsMap.get(key))
        deleteConnection.remove()
    }
}

function deleteNextLayerConnections(node){
    var connections = connectionsMap.get(node.id)
    for (var i =0; i< connections.length;i++){
        connections[i].remove()
    }
    connectionsMap.delete(node.id)
}
async function updateConnections(connections){
    //console.log(connections)
    for (var i=0;i<connections.length; i++){
        //console.log(connections[i]['position'])
        connections[i].position()
        //break
    }
}

function makeConnections(layers,layerNO){
    //console.log(layers)
    for (var layerIndex=0;layerIndex<layerNO-1;layerIndex++){
        makeLayerConnection(layers[layerIndex],layers[layerIndex+1])
    }        
}

function resetConnectionPositions(){
    console.log("lol")
    //console.log(areConnectionsPositioned.keys)
    for(var key of areConnectionsPositioned.keys()){
        //console.log(key)
        areConnectionsPositioned.set(key,false)
    }
}

function resetLayerConnectionPositions(layerNo){
    console.log("layers",layers[layerNo])
    for(i=0;i<layers[layerNo].length;i++){
        key = layers[layerNo][i].id
        areConnectionsPositioned.set(key,false)
    }
}