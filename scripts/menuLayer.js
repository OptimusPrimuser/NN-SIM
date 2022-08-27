function addLayer(){
    var element = document.getElementById("layerValue")
    var numLayers = parseInt(element.innerText)
    element.innerText = ""+(numLayers+1) 
    addNodeConfig()
    createLayer(outputCols.length,numLayers)
    var perviousLayer = layers[""+(numLayers-1)]
    var currentLayer = layers[""+(numLayers)]
    makeLayerConnection(perviousLayer,currentLayer)
}

function subtractLayer(){
    var element = document.getElementById("layerValue")
    var layers = parseInt(element.innerText)
    if (layers<=2){
        return
    }
    element.innerText = ""+(layers-1) 
    removeNodeConfig()
    deleteLayer()
    // element.innerText = ""+(layers-1) 
    adjustNodesOfLastLayer()
    console.log("layer-"+(layers-1)+"-nodeVal")
    document.getElementById("layer-"+(layers-2)+"-nodeVal").innerText = outputCols.length
}