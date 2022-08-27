function sendDataToNN(){
    let inputData = []
    let outputData = []
    let inputCols = Array.from(attributes["input"])
    let outputCols = Array.from(attributes["output"])
    let inputIndex = {}
    let outputIndex = {}
    for (var i=0;i<inputCols.length;i++){
        inputIndex[inputCols[i]]=i
        inputData.push(modifiedCSV[columnToIndex[inputCols[i]]])
    }
    for (var i=0;i<outputCols.length;i++){
        outputIndex[outputCols[i]]=i
        outputData.push(modifiedCSV[columnToIndex[outputCols[i]]])
    }
    selectedFunctionsList={}
    // console.log(colNamesData.length)

    for (const col in selectedFunctions) {

        selectedFunctionsList[col]=Array.from(selectedFunctions[col]);
    }
    
    data = {
        "inputData":inputData,
        "outputData":outputData,
        "inputColumns":inputCols,
        "outputColumns":outputCols,
        "inputIndex":inputIndex,
        "outputIndex":outputIndex,
        "valueToUniqueLabel":valueToUniqueLabel,
        "selectedFunctions": selectedFunctionsList
    }
    //nnData = data
    localStorage.setItem('data', JSON.stringify(data));
}

function sendDataToCoder(){
    let data = JSON.parse(localStorage.getItem('data'))
    nodeLen=[]
    for(let i=0;i<builtNN.layers.length;i++){
        nodeLen.push(builtNN.layers[i].values.length)
    }
    data['nnObj']=builtNN
    data['nodeLength']=nodeLen
    data['layerLength']=builtNN.layers.length
    data['csvPath']='data.csv'
    data['modelName']='model'
    data['epoch']=parseInt(document.getElementById('epoch').value)
    data['outSigmoid']=false
    data['shuffledIndexes']=shuffledIndexes
    localStorage.setItem('data', JSON.stringify(data));
}