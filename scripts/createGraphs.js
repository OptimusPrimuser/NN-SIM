
var chartMap ={}

function createGraphOnInputChange(attribute,attributeName,outputs){
    outputs= Array.from(outputs)
    for(var i=0;i<outputs.length;i++){
        var outputColData = modifiedCSV[columnToIndex[outputs[i]]]
        //console.log(outputColData,attribute)
        modifyScatterChart(attribute,attributeName,outputColData,outputs[i])
    }
}

function createGraphOnOutputChange(outputColData,outputName,inputs){
    inputs= Array.from(inputs)
    for(var i=0;i<inputs.length;i++){
        var inputColData = modifiedCSV[columnToIndex[inputs[i]]]
        //console.log(inputColData,outputName)
        modifyScatterChart(inputColData,inputs[i],outputColData,outputName)
    }
}

function makeInputCharts(inputName,outputList){
    outputList = Array.from(outputList)
    var inputColData = modifiedCSV[columnToIndex[inputName]]
    for(var i=0;i<outputList.length;i++){
        var outputName = outputList[i]
        var outputColData = modifiedCSV[columnToIndex[outputName]]
        //console.log(outputColData,attribute)
        createScatterChart(inputColData,inputName,outputColData,outputName)
    }
}

function makeOutputCharts(outputName,inputList){
    inputList = Array.from(inputList)
    var outputColData = modifiedCSV[columnToIndex[outputName]]
    for(var i=0;i<inputList.length;i++){
        var inputName = inputList[i]
        var inputColData = modifiedCSV[columnToIndex[inputName]]
        //console.log(outputColData,attribute)
        createScatterChart(inputColData,inputName,outputColData,outputName)
    }
}

async function deleteOutputCharts(outputName,inputList){
    inputList = Array.from(inputList)
    for(var i=0;i<inputList.length;i++){
        var inputName = inputList[i]
        var canvasContainerId="canvas-"+inputName+"-"+outputName
        var canvasContainer = document.getElementById(canvasContainerId)
        canvasContainer.style.animationName= "fade"
        canvasContainer.style.animationDuration = "0.5s"
        canvasContainer.style.animationFillMode = "forwards"
        canvasContainer.style.animationPlayState='running';
        canvasContainer.style.animationTimingFunction="ease"
        await sleep(500)
        canvasContainer.remove()
    }
}

async function deleteInputCharts(inputName,outputList){
    outputList = Array.from(outputList)
    for(var i=0;i<outputList.length;i++){
        var outputName = outputList[i]
        var canvasContainerId="canvas-"+inputName+"-"+outputName
        var canvasContainer = document.getElementById(canvasContainerId)
        canvasContainer.style.animationName= "fade"
        canvasContainer.style.animationDuration = "0.5s"
        canvasContainer.style.animationFillMode = "forwards"
        canvasContainer.style.animationPlayState='running';
        canvasContainer.style.animationTimingFunction="ease-in-out"
        await sleep(500)
        canvasContainer.remove()
    }
}



function scatterChart(x,x_name,y,y_name,chartContainer){
    var id = x_name+"-"+y_name
    console.log(x_name,y_name)
    var dataChart=[]
    for(var i=0;i<y.length;i++){
        dataChart.push({x:x[i],y:y[i]})
    }
    var scatter= new Chart(
        chartContainer,
        {
            type: "scatter",
            data:{
                datasets:[
                    {
                        label: "x = "+x_name+" y = "+y_name,
                        borderColor: 'rgb(75, 192, 192)',
                        data: dataChart
                    }
                ]
            },
            options:{ xAxes: [{
                type: 'linear',
                suggestedMax: Math.max(...x)
                // ...
            }]}
        }
    )
    chartMap[id] = scatter
}


function labelExplainerAdd(x,x_name,y,y_name,canvasContainer){
    if(columnDtype[columnToIndex[x_name]]==parseString ){
        var labelStr =""
        x_labels= Array.from(new Set(x))
        for(var k=0;k<x_labels.length;k++){
            labelStr = labelStr + " ||"  + x_labels[k]+ ":" + valueToUniqueLabel[x_labels[k]] 
        }
        labelStr = labelStr.substring(3)
        var labelExplained = document.createElement("div")
        labelExplained.innerText = x_name+ " Labels to Numbers → " + labelStr
        labelExplained.id = "label-explain-"+canvasContainer.id
        canvasContainer.appendChild(labelExplained)
    }
    if(columnDtype[columnToIndex[y_name]]==parseString ){
        var labelStr =""
        y_labels= Array.from(new Set(y))
        for(var k=0;k<y_labels.length;k++){
            labelStr = labelStr+" ||" + y_labels[k]+ ":" + valueToUniqueLabel[y_labels[k]] 
        }
        labelStr = labelStr.substring(3)
        var labelExplained = document.createElement("div")
        labelExplained.innerText = y_name+ " Labels to Numbers → " + labelStr
        labelExplained.id = "label-explain-"+canvasContainer.id
        canvasContainer.appendChild(labelExplained)
    }
}

function labelExplainerModify(x,x_name,y,y_name){
    var id = x_name+"-"+y_name
    if(columnDtype[columnToIndex[x_name]]==parseString ){
        var labelStr =""
        x_labels= Array.from(new Set(x))
        for(var k=0;k<x_labels.length;k++){
            labelStr = labelStr + " ||"  + x_labels[k]+ ":" + valueToUniqueLabel[x_labels[k]] 
        }
        labelStr = labelStr.substring(3)
        var labelExplained = document.getElementById("label-explain-"+"canvas-"+id)
        labelExplained.innerText = x_name+ " Labels to Numbers → " + labelStr
    }
    if(columnDtype[columnToIndex[y_name]]==parseString ){
        var labelStr =""
        y_labels= Array.from(new Set(y))
        for(var k=0;k<y_labels.length;k++){
            labelStr = labelStr+" ||" + y_labels[k]+ ":" + valueToUniqueLabel[y_labels[k]] 
        }
        labelStr = labelStr.substring(3)
        var labelExplained = document.getElementById("label-explain-"+"canvas-"+id)
        labelExplained.innerText = y_name+ " Labels to Numbers → " + labelStr
    } 
}

function createScatterChart(x,x_name,y,y_name){
    var id = x_name+"-"+y_name
    
    var canvasContainer = document.createElement("div")
    canvasContainer.className = "canvasContainer"
    canvasContainer.id= "canvas-"+id
    
    var chartContainer = document.createElement("canvas")
    chartContainer.className = "graphCanvas"
    chartContainer.id =  id

    canvasContainer.appendChild(chartContainer)
    
    //labelExplainerAdd(x,x_name,y,y_name,canvasContainer)
    scatterChart(x,x_name,y,y_name,chartContainer)
    var baseElement=document.getElementById("graphs")
    baseElement.appendChild(chartContainer.parentElement)
}

function modifyScatterChart(x,x_name,y,y_name){
        var id = x_name+"-"+y_name
        var chartContainer = document.getElementById(id)
        if(!chartContainer)
        {   
            return
        }
        
        chartMap[id].destroy()
        
        scatterChart(x,x_name,y,y_name,chartContainer)
        //labelExplainerModify(x,x_name,y,y_name)
   
}

//todo
function makeLabelInputCharts(inputName,outputList,valToLabel){
    outputList = Array.from(outputList)
    var inputColData = modifiedCSV[columnToIndex[inputName]]
    for(var i=0;i<outputList.length;i++){
        var outputName = outputList[i]
        var outputColData = modifiedCSV[columnToIndex[outputName]]
        //console.log(outputColData,attribute)
        var inLabels = Array.from(new Set(inputColData) )
        console.log(inLabels)
        var labelStr =""
        for(var k=0;k<inLabels.length;k++){
            console.log(inLabels[k])
            labelStr = " ,"+ labelStr + inLabels[k]+ ":" + valToLabel[inLabels[k]] 
        }
        labelStr = labelStr.substring(2)
        createLabelScatterChart(inputColData,inputName,outputColData,outputName,labelStr)
    }
}

function makeLabelOutputCharts(outputName,inputList,valToLabel){
    inputList = Array.from(inputList)
    var outputColData = modifiedCSV[columnToIndex[outputName]]
    for(var i=0;i<inputList.length;i++){
        var inputName = inputList[i]
        var inputColData = modifiedCSV[columnToIndex[inputName]]
        //console.log(outputColData,attribute)
        var outLabels = Array.from(new Set(outputColData) )
        var labelStr =""
        for(var k=0;k<outLabels.length;k++){
            console.log(outLabels[k],valToLabel[outLabels[k]])
            labelStr = labelStr+" || "+ outLabels[k]+ ":" + valToLabel[outLabels[k]] 
        }
        labelStr = labelStr.substring(4)
        console.log(labelStr)
        createLabelScatterChart(inputColData,inputName,outputColData,outputName,labelStr)
    }
}

function createLabelScatterChart(x,x_name,y,y_name,labelStr){
    var id = x_name+"-"+y_name
    
    var canvasContainer = document.createElement("div")
    canvasContainer.className = "canvasContainer"
    canvasContainer.id= "canvas-"+id
    
    var labelExplained = document.createElement("div")
    labelExplained.innerText = labelStr

    var chartContainer = document.createElement("canvas")
    chartContainer.className = "graphCanvas"
    chartContainer.id =  id

    canvasContainer.appendChild(chartContainer)
    canvasContainer.appendChild(labelExplained)
    scatterChart(x,x_name,y,y_name,chartContainer)
    var baseElement=document.getElementById("graphs")
    baseElement.appendChild(chartContainer.parentElement)
}

// function  makeScatterChart(x,x_name,y,y_name){
//     var id = x_name+"-"+y_name
//     var chartContainer = document.getElementById(id)
//     if(!chartContainer)
//     {   
//         var canvasContainer = document.createElement("div")
//         canvasContainer.className = "canvasContainer"
//         canvasContainer.id= "canvas-"+id
//         chartContainer = document.createElement("canvas")
//         chartContainer.className = "graphCanvas"
//         canvasContainer.appendChild(chartContainer)
//     }
//     else{
//         chartMap[id].destroy()
//     }
//     chartContainer.id =  x_name+"-"+y_name
//     var dataChart=[]
//     for(var i=0;i<y.length;i++){
//         dataChart.push({x:x[i],y:y[i]})
//     }
//     console.log(dataChart)
//     var lineChart= new Chart(
//         chartContainer,
//         {
//             type: "scatter",
//             data:{
//                 datasets:[
//                     {
//                         label: "x = "+x_name+" y = "+y_name,
//                         borderColor: 'rgb(75, 192, 192)',
//                         data: dataChart
//                     }
//                 ]
//             },
//             options:{ xAxes: [{
//                 type: 'linear',
//                 suggestedMax: Math.max(...x)
//                 // ...
//             }]}
//         }
//     )
//     chartMap[id] = lineChart
//     var baseElement=document.getElementById("graphs")
//     baseElement.appendChild(chartContainer.parentElement)
//     //console.log(baseElement)
// }