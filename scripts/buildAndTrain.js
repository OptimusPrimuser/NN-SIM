function buildAndTrainNN(){
    var nodeVals = document.getElementsByClassName("nodeVals")
   
    var nodeArgument =[]
    for(var i=0;i<nodeVals.length;i++){
        nodeArgument.push(parseInt(nodeVals[i].innerHTML)) 
    }
    var learningRate = parseFloat(document.getElementById("lr").value)
    var epoch = parseInt(document.getElementById("epoch").value)
    //let applySoftmax = document.getElementById("applySoftmax").checked 
    var neuralNet = new nn(nodeArgument,learningRate,"cpu")
    let sentData = JSON.parse(localStorage.getItem('data'))
    let inputData = Matrix.transposeMatrix(sentData["inputData"])
    let outputData = Matrix.transposeMatrix(sentData["outputData"])
    let dataLen = inputData.length

    let errorVal = null
    let iteration=0
    builtNN = neuralNet
    let currentEpoch = setInterval(
        function(){
            iteration = iteration+1
            for(i=0;i<dataLen;i++){
                if (Math.random()>0.9){
                    continue
                }
                // console.log(shuffledIndexes[i])
                // console.log(inputData[shuffledIndexes[i]])
                errorVal =  neuralNet.train(inputData[shuffledIndexes[i]],outputData[shuffledIndexes[i]])
            }
            // console.log(iteration,errorVal)
            updateTrainingUI(iteration,errorVal)
            // if(iteration%100==0){
               
            // }
            updateNodesUI(neuralNet)
            if (iteration==epoch){
                clearInterval(currentEpoch)
            }
        },0
    )
    // CreateCode.createCSV(sentData['inputData'],sentData['inputColumns'],sentData['outputData'],sentData['outputColumns'])
    // CreateCode.createNNCode(neuralNet,epoch,sentData['inputColumns'],sentData['outputColumns'],'temp.csv','model')
}

function updateTrainingUI(currentEpoch,errorVal){
    let currentEpochElement = document.getElementById("currentEpochs")
    let errorSumElement = document.getElementById("errorSum")
    currentEpochElement.innerText = ""+(currentEpoch)
    console.log(errorVal)
    errorSumElement.innerText  = "" + (Math.round(errorVal*1000)/1000)
    //document.getElementById("currentEpochs").innerText = ""+(currentEpoch)
    //document.getElementById("errorSum").innerText = "" + (Math.round(errorVal*1000)/1000)
    
}

function updateNodesUI(nnObj){
    for(let layerNum = 0;layerNum<nnObj.layers.length-1;layerNum++){
        let values = nnObj.layers[layerNum].values
        //console.log(values)
        for(let nodeNum=0; nodeNum<values.length; nodeNum++){
           layers[""+(layerNum)][nodeNum].innerText = ""+(Math.round(values[nodeNum]*1000)/1000)
        }
    }  
    let lastIndex=nnObj.layers.length-1
    let values = nnObj.layers[lastIndex].values  
    let nodeVals = []
    nodeVals.push(...values)
    let applySoftmax = document.getElementById("applySoftmax").checked
    // console.log(applySoftmax)
    if(applySoftmax==true){
        nodeVals=applySoftMaxArray(nodeVals)
    }
    for(let nodeNum=0; nodeNum<values.length; nodeNum++){
        layers[""+(lastIndex)][nodeNum].innerText = ""+(Math.round(nodeVals[nodeNum]*1000)/1000)
     }
}