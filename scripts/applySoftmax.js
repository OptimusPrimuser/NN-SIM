function applySoftMaxEvent(element){
    if(builtNN!=null){
        let layerNo=""+(parseInt(document.getElementById("layerValue").innerText)-1)  
        let layer = layers[layerNo]
        let nodeVals = []
        nodeVals.push(...builtNN.layers[layerNo].values)
        if (element.checked==true){
            nodeVals=applySoftMaxArray(nodeVals)
        }
        console.log(nodeVals)
        for(let node=0;node<layer.length;node++){
            layer[node].innerText = "" + (Math.round(nodeVals[node]*1000)/1000)
        }
    }
}

function applySoftMaxArray(arr){
    let sumArr=0
    for(let i=0;i<arr.length;i++){
        //console.log(Math.exp(arr[i]))
        arr[i] = Math.exp(arr[i])
        sumArr = arr[i]+sumArr
    }
    for(let i=0;i<arr.length;i++){
        arr[i] = arr[i]/sumArr
    }
    //console.log(arr)
    return arr
}