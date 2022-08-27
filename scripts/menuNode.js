

function addNode(buttonElement){
    var layerMenu=buttonElement.target.parentElement.parentElement.id
    console.log(buttonElement.target.parentElement)
    console.log(layerMenu)
    var layerNo=layerMenu.split("-")[1]
    var totalLayers = parseInt(document.getElementById("layerValue").innerText)
    if(parseInt(layerNo)==totalLayers-1 || parseInt(layerNo)==0){
        console.log(parseInt(layerNo),totalLayers-1)
        return
    }
    var nodeLable = document.getElementById("layer-"+layerNo+"-nodeVal")
    var nodes = parseInt(nodeLable.innerText)
    nodeLable.innerText = ""+(parseInt(nodes)+1) 
    addNodeToGraph(layerNo)
    resetLayerConnectionPositions(layerNo)
    //console.log(buttonElement.parentElement.parentElement.id)
}

function subtractNode(buttonElement){
    var layerMenu=buttonElement.target.parentElement.parentElement.id
    console.log(buttonElement.target.parentElement)
    console.log(layerMenu)
    var layerNo=layerMenu.split("-")[1]
    var totalLayers = parseInt(document.getElementById("layerValue").innerText)
    if(parseInt(layerNo)==totalLayers-1 || parseInt(layerNo)==0){
        console.log(parseInt(layerNo),totalLayers-1)
        return
    }
    var nodeLable = document.getElementById("layer-"+layerNo+"-nodeVal")
    var nodes = parseInt(nodeLable.innerText)
    if (nodes<=1){
        return
    }
    nodeLable.innerText = ""+(parseInt(nodes)-1)
    deleteNodeFromGraph(layerNo)
    //console.log(buttonElement.parentElement.parentElement.id)
}
