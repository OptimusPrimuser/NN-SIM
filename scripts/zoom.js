function setZoom(zoomX,zoomY) {
    console.log(zoomX,zoomY)
    zoomX= zoomX<=0?zoomX+1:zoomX
    zoomY= zoomY<=0?zoomY+1:zoomY
    console.log(zoomX,zoomY)
    var layerPlane = document.getElementById("layerPlane");
    layerPlane.style.transform = "scaleX(" + (zoomX) + ") scaleY("+(zoomY)+")";
    //updateConnections(connections)
}

function manualZoom(zoom){
    zoom=zoom*0.01
    var layerPlane = document.getElementById("layerPlane");
    layerPlane.style.transform = "scaleX(" + (zoom) + ") scaleY("+(zoom)+")";
    //updateConnections(connections)
    resetConnectionPositions()
}

function autoZoom(){
    var layerPlaneBase = document.getElementById("layerPlaneBase");
    var layerPlane = document.getElementById("layerPlane");
    var scaleX = (-1+(layerPlane.offsetWidth/layerPlaneBase.offsetWidth))
    var scaleY = (-1+(layerPlane.offsetHeight/layerPlaneBase.offsetHeight))
    setZoom(scaleX,scaleY)
}