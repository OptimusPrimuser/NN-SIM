

var attributes={
    "input": new Set(),
    "output": new Set()
}


var dtypeListFunctions={
    parseFloat : ["None","Min-Max","Log","Sigmoid"],
    parseString : ["Label-Encoding"]
}

var dtypeLabel ={
    parseFloat : "Number",
    parseString : "String"
}

var selectedFunctions = {}

var valueToUniqueLabel = {}
function parseString(data){
    return data.toString()
}

var orignalCleanedCSV = null
var modifiedCSV = null
var columnDtype = null
var columnToIndex = null
var colNamesData= null
//var columnNames = null

function loadDataOneHotEncoded(){
    var filePicker = document.getElementById("loadDataInputOneHotEncoded")
    var file = new FileReader()
    file.onload = (function(data) {
        localStorage.clear(); 
            data = data.target.result.split("\n")
            var dataOut  = loadCSVDataOneHotEncoded(data)
            displayCSVAttributes(dataOut["columnNames"],"input");
            displayCSVAttributes(dataOut["columnNames"],"output");
            displayAttributeDetails(dataOut["columnNames"],dataOut["columnDtype"])
            animationsTriggerLoadData()
            columnDtype = dataOut["columnDtype"]
            colNamesData = dataOut["columnNames"] 
            orignalCleanedCSV = JSON.parse(JSON.stringify(dataOut["data"]))
            modifiedCSV =  JSON.parse(JSON.stringify(dataOut["data"]))
            columnToIndex = dataOut["columnIndex"]
            filePicker.value  = null
        }
    );
    console.log(filePicker.files)
    file.readAsText(filePicker.files[0])
}

function loadData(){
    var filePicker = document.getElementById("loadDataInput")
    var file = new FileReader()
    file.onload = (function(data) {
        localStorage.clear(); 
            data = data.target.result.split("\n")
            var dataOut  = loadCSVData(data)
            displayCSVAttributes(dataOut["columnNames"],"input");
            displayCSVAttributes(dataOut["columnNames"],"output");
            displayAttributeDetails(dataOut["columnNames"],dataOut["columnDtype"])
            animationsTriggerLoadData()
            columnDtype = dataOut["columnDtype"]
            orignalCleanedCSV = JSON.parse(JSON.stringify(dataOut["data"]))
            modifiedCSV =  JSON.parse(JSON.stringify(dataOut["data"]))
            columnToIndex = dataOut["columnIndex"]
            filePicker.value  = null
        }
    );
    file.readAsText(filePicker.files[0])
}

function setEmptyCols(columns){
    //createCols
    var arr = []
    var arrIndex = {}
    for (var i=0; i<columns.length;i++){
        arrIndex[columns[i]]=i 
        arr.push([])
    }
    return [arr,arrIndex]
}


function setColDataType(dataRow){
    arrDtype = []
    dataRow = dataRow.split(",")
    for(var i =0; i< dataRow.length;i++){
        if (parseFloat(dataRow[i])){
            arrDtype.push(parseFloat)
        }
        else{
            arrDtype.push(parseString)
        }
    }
    return arrDtype
}

function removeEmptyColRows(dataRow){
    if (dataRow.indexOf("")==-1){
        //good row
        return true
    }
    else{
        //bad row
        return false
    }
}

function checkColNum(dataRow,colNames){
    if (dataRow.length!=colNames.length){
       return false
    }
}

function checkRows(dataRow,colNames){
    if(removeEmptyColRows(dataRow)==false)
        return false
    if(checkColNum(dataRow,colNames)==false)
        return false
    
}

function loadCSVDataOneHotEncoded(data){
    var parsedData = loadCSVData(data)
    console.log(parsedData)
    var dataToBePushed = []
    var colNamesToBePushed = []
    var dtypeToBePushed = []
    var deleteIndex =[]
    for(var i=0;i<parsedData["columnDtype"].length;i++){
        if(parsedData["columnDtype"][i].name=="parseString"){
            let tempData = parsedData["data"][i]
            let encodedData = oneHotEncoding(tempData)
            deleteIndex.push(i)
            for(var k=0;k<encodedData["data"].length;k++){
                let colName= parsedData["columnNames"][i]
                let valName =encodedData["uniqueLabels"][k].replaceAll("-","_")
                dataToBePushed.push(encodedData["data"][k])
                colNamesToBePushed.push(colName+"_"+valName)
                dtypeToBePushed.push(parsedData["columnDtype"][i])
            }
        }
    }

    for(var i=0;i<deleteIndex.length;i++){
        parsedData["data"].splice(deleteIndex[i],1)
        parsedData["columnDtype"].splice(deleteIndex[i],1)
        var colName = parsedData["columnNames"].splice(deleteIndex[i],1)
        delete parsedData["columnIndex"][colName]
    }

    for(var i=0;i<dataToBePushed.length;i++){
        parsedData["data"].push(dataToBePushed[i])
        parsedData["columnDtype"].push(dtypeToBePushed[i])
        parsedData["columnNames"].push(colNamesToBePushed[i])
    }
    
    let tempIndexes ={}
    for(var i=0;i<parsedData["columnNames"].length;i++){
        tempIndexes[parsedData["columnNames"][i]]=i
    }
    
    parsedData["columnIndex"]=tempIndexes
    // console.log({
    //     "columnNames":columnNames,
    //     "columnIndex":columnIndex,
    //     "columnDtype":columnDtype,
    //     "data":goodData
    // })
    return {
        "columnNames":parsedData["columnNames"],
        "columnIndex":parsedData["columnIndex"],
        "columnDtype":parsedData["columnDtype"],
        "data": parsedData["data"]
    }
}

function loadCSVData(data){
    
    var columnNames = data[0]
    columnNames = columnNames.replaceAll("\"","")
    columnNames = columnNames.replaceAll("'","")
    columnNames = columnNames.replaceAll("\r","")
    columnNames = columnNames.replaceAll("-","_")
    console.log(columnNames)
    columnNames = columnNames.split(",")
    var temp = setEmptyCols(columnNames)
    
    var goodData =temp[0]
    var columnIndex = temp[1]
    firstRow= data[1]
    firstRow = firstRow.replaceAll("\"","")
    firstRow = firstRow.replaceAll("'","")
    firstRow = firstRow.replaceAll("\r","")
    var columnDtype = setColDataType(firstRow)

    for (var row=1;row<data.length;row++){
        var dataRow = data[row].replaceAll(" ","")
        dataRow = dataRow.replaceAll("\"","")
        dataRow = dataRow.replaceAll("'","")
        dataRow = dataRow.replaceAll("\r","")
        //console.log(dataRow)
        dataRow = dataRow.split(",")
        if (checkRows(dataRow,columnNames) == false)
            continue
        for(var col=0;col<dataRow.length;col++){
            goodData[col].push(columnDtype[col](dataRow[col]))
        }
    }
    console.log({
        "columnNames":columnNames,
        "columnIndex":columnIndex,
        "columnDtype":columnDtype,
        "data":goodData
    })
    return {
        "columnNames":columnNames,
        "columnIndex":columnIndex,
        "columnDtype":columnDtype,
        "data":goodData
    }
}

function animationsTriggerLoadData(){
    var selectorContainer = document.getElementById("selectorContainer")
    selectorContainer.style.animationName= "fade"
    selectorContainer.style.animationDuration = "0.5s"
    selectorContainer.style.animationDirection = "reverse"
    selectorContainer.style.animationFillMode = "forwards"
    selectorContainer.style.animationPlayState='running';
    selectorContainer.style.animationTimingFunction="ease"
    var button = document.getElementById("loadDataInputContainer")
    button.style.animationName= "fadeButtonTop"
    button.style.animationDuration = "1s"
    button.style.animationFillMode = "forwards"
    button.style.animationPlayState='running';
    button.style.animationTimingFunction="ease"
    button = document.getElementById("loadDataInputContainerOneHotEncoded")
    button.style.animationName= "fadeButtonBottom"
    button.style.animationDuration = "1s"
    // button.style.animationDelay = "0.25s"
    button.style.animationFillMode = "forwards"
    button.style.animationPlayState='running';
    button.style.animationTimingFunction="ease"
}

async function displayCSVAttributes(items,typeVal){
    var selectorList = document.getElementById("selectorList-"+typeVal)
    for (var i=0;i<items.length;i++){
        var id=typeVal+"-"+items[i]
        var displayVal = items[i]
        var listItem = document.createElement("li")
        listItem.className = "selectorListItem"
        listItem.id = "selector-"+id
        //attributes[typeVal].add(id)
        var listItemContent = `
            <input type="checkbox" id="${id}" class="checkbox" onchange="addInputAttributes(this)">
            <label for="${id}" class="checboxLable">
            ${displayVal}
            </label>
        ` 
        listItem.innerHTML = listItemContent   
        selectorList.appendChild(listItem)
        //attributesFiller(id)
        await sleep(100)
    }
    //console.log(items)
    //selectorList.innerHTML = selectorList.innerHTML + listItems
    
}

function displayAttributeDetails(columnNames,columnDtype){
    for (var i =0; i<columnNames.length;i++){

        var typeVal = "function"
        var attrName = columnNames[i]
        var attrDtype = columnDtype[i].name
        var attrSelectorID = attrName+"-selectorList-"+typeVal
        var dtype = dtypeLabel[attrDtype] 
        var attributeBase = `
        <div class="attrDescription">
            <div>
                <span >
                    ${attrName}
                </span>
                <span>
                    ${dtype}
                </span>
            </div>
            <ul class="selectorList attributeList " id="${attrSelectorID}">

            </ul>
        </div>
        `

        var base = document.getElementById("attributes")
        base.innerHTML = base.innerHTML + attributeBase
        //console.log(attrDtype,columnDtype[i])
        //console.log(dtypeListFunctions)
        displayAttributeFunctions(
            attrName,dtypeListFunctions[columnDtype[i].name]
        )
    }
}

function displayAttributeFunctions(attrName,items){
    
    var typeVal = "function"
    var attrSelectorID = attrName+"-selectorList-"+typeVal
    var selectorList = document.getElementById(attrSelectorID)
    //console.log(items)
    for (var i=0;i<items.length;i++){
        var id="checkbox-"+attrSelectorID+"-"+items[i]
        //console.log(id)
        var displayVal = items[i]
        var listItem = document.createElement("li")
        listItem.className = "selectorListItem attributeListItem"
        listItem.id = "selector-"+id
        //attributes[typeVal].add(id)
        var listItemContent = `
            <input type="checkbox" id="${id}" class="checkbox" onchange="applyFunctions(this)">
            <label for="${id}" class="checboxLable">
            ${displayVal}
            </label>
        ` 
        listItem.innerHTML = listItemContent   
        selectorList.appendChild(listItem)
        //console.log(selectorList)
        //attributesFiller(id)
        //await sleep(300)
    }
}


function addInputAttributes(checkbox){
   //var attributeName = label.attributes.for.nodeValue
   //console.log(checkbox.checked,checkbox.id)
   var id = checkbox.id.split("-")
   typeVal = id[0]
   var attributeName = id.slice(1).join()
   if (checkbox.checked){
    attributes[typeVal].add(attributeName)
    if(typeVal=="output"){
        // if(columnDtype[columnToIndex[attributeName]]==parseString){
        //     console.log(valueToUniqueLabel)
        //     makeLabelOutputCharts(attributeName,attributes["input"],valueToUniqueLabel)
        //     return
        // }
        makeOutputCharts(attributeName,attributes["input"])
    }else if(typeVal=="input"){
        // if(columnDtype[columnToIndex[attributeName]]==parseString){
        //     makeLabelInputCharts(attributeName,attributes["output"],valueToUniqueLabel)
        //     return
        // }
        makeInputCharts(attributeName,attributes["output"])
    }
   }
   else{
        attributes[typeVal].delete(attributeName)
        if(typeVal=="output"){
            deleteOutputCharts(attributeName,attributes["input"])
        }else if(typeVal=="input"){
            deleteInputCharts(attributeName,attributes["output"])
        }
    }
   //console.log(attributes)
}

