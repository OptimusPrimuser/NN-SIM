

var functionLabelToFunction = {
    "None": doNothing,
    "Min-Max": minMax,
    "Log":arrayLog,
    "Sigmoid": arraySigmoid,
    "Label-Encoding": labelEncoding,
    // "One-Hot-Encoding": oneHotEncoding
}

// var barChartAttr = new Set(['Label-Encoding'])
var labelMap = {}

function applyFunctions(element){
    var ul = element.parentElement.parentElement
    var colName = ul.id.replace("-selectorList-function","")
    var colFunctions = ul.childNodes
    var colDtype = columnDtype[columnToIndex[colName]]
    console.log(colDtype)
    var colData = JSON.parse(JSON.stringify(orignalCleanedCSV[columnToIndex[colName]])) 
    if(colFunctions.length==0){
        functionLabelToFunction["None"](colName,colData)
    }
    funcsName =new Set()
    for(var i=1;i<colFunctions.length;i++){
        var functionCheckbox = colFunctions[i].childNodes[1]
        if (functionCheckbox.checked ==true){
            //console.log(functionName,functionLabelToFunction[functionName])
            var functionName = functionCheckbox.id.replace("checkbox-"+colName+"-selectorList-function-","")
            funcsName.add(functionName)
            
            // if(functionName=="One-Hot-Encoding"){
            //     console.log(functionLabelToFunction[functionName](colName,colData))
            // }
            // else
            colData = functionLabelToFunction[functionName](colName,colData)
        }
    }
    selectedFunctions[colName]=funcsName
    //console.log(selectedFunctions)
    modifiedCSV[columnToIndex[colName]]=colData
    if (attributes["output"].has(colName))
    {
        inputCols = attributes["input"] 
        
            createGraphOnOutputChange(colData,colName,inputCols)
    }
    else if (attributes["input"].has(colName)){
        outputCols = attributes["output"] 
        // if(funcsName.has("One-Hot-Encoding")){
        //     for(let index=0;index<colData.length;index++){
        //         console.log(
        //             {
        //                 "colData":colData[index],
        //                 "colname":colName+"-"+valueToUniqueLabel[colName][index],
        //                 "outputCols":outputCols
        //             }
        //         )
        //         createGraphOnInputChange(colData[index],colName+"-"+valueToUniqueLabel[colName][index],outputCols)
        //     }
        // }
        // else
            createGraphOnInputChange(colData,colName,outputCols)
    }    
    
}