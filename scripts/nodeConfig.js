
function addNodeConfig(){
    /*
    <div class="layerNodeContainer" >
        
        <!-- layer lable -->
        <div >
            Layers {layer number}
        </div>

        <!-- no of nodes -->
        <div class="nodeVals">
            2
        </div>
        
        <!-- buttons for adding and subtracting -->
        <div>
            <div class="plusMinus addButton" onclick="addNode(this)">
                <!-- icon imported from svg -->
            </div>
        </div>
        <div>
            <div class="plusMinus subtractButton" onclick="subtractNode(this)">
                <!-- icon imported from svg -->
            </div>
        </div>
    </div> 
    */
    var nodeContainer = document.getElementById("nodeContainer")
    var i= document.getElementsByClassName("layerNodeContainer").length
    var nodeConfig = document.createElement("div")
    nodeConfig.className = "layerNodeContainer"
    nodeConfig.id = "layer-"+i+"-menu"
    var layerLabel =  document.createElement("div")
    layerLabel.innerText = "layer-"+(i)
    var nodeVal = document.createElement("div")
    nodeVal.id = "layer-"+(i)+"-nodeVal"
    nodeVal.className = "nodeVals"
    if(i==0){
        nodeVal.innerText = ""+(inputCols.length)
    }
    else{
        nodeVal.innerText = ""+(outputCols.length)
    }
    
    
    var plusContainer = document.createElement("div")
    var plusButton = document.createElement("div")
    plusButton.onclick = addNode
    plusButton.classList.add("plusMinus","addButton")
    plusContainer.append(plusButton)
    
    var minusContainer = document.createElement("div")
    var minusButton = document.createElement("div")
    minusButton.onclick = subtractNode
    minusButton.classList.add("plusMinus","subtractButton")
    minusContainer.append(minusButton)

    nodeConfig.appendChild(layerLabel)
    nodeConfig.appendChild(nodeVal)
    nodeConfig.appendChild(plusContainer)
    nodeConfig.appendChild(minusContainer)

    nodeContainer.appendChild(nodeConfig)
}

function removeNodeConfig(){
    var nodeContainer = document.getElementById("nodeContainer")
    lastChild = nodeContainer.childNodes[nodeContainer.childNodes.length -1]
    nodeContainer.removeChild(lastChild)
}   