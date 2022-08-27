
var pyCode=''
var tableCode=''
var sentData=null
var splitRows=[]
function main(){
    let data=localStorage.getItem('data')
    data= JSON.parse(data)
    sentData = data
    pyCode = pythonCode(
        data['nnObj'],
        data['layerLength'],
        data['nodeLength'],
        data['epoch'],
        data['inputColumns'],
        data['outputColumns'],
        data['csvPath'],
        data['modelName'],
        data['outSigmoid']
    )
    pyCodeUI(pyCode)

    tableCode=csvCode(
        data['inputData'],
        data['inputColumns'],
        data['outputData'],
        data['outputColumns'],
        data['shuffledIndexes']
    )
    splitRows=tableCode.split('\n')
    csvCodeUI()
}

function pythonCode(nnObj,layerLength,nodeLength,epoch,input_cols,output_cols,csvPath,modelName,outputSigmoid){
    let code = CreateCode.createNNCode(nnObj,layerLength,nodeLength,epoch,input_cols,output_cols,csvPath,modelName,outputSigmoid)
    return code
}

async function pyCodeUI(code){
    let element = document.getElementById('pythonCode')
    element.innerHTML = hljs.highlight(code, {language: 'python'}).value
}

function csvCode(inputCols,inputNames,outputCols,outputNames,shuffledIndexes){
    let code = CreateCode.createCSV(inputCols,inputNames,outputCols,outputNames,shuffledIndexes)
    return code
}

async function csvCodeUI(){
    let rows = splitRows
    let table = document.getElementById('csvTable')
    rangeStart = table.children.length
    rangeEnd = rows.length>rangeStart+10?rangeStart+10:rows.length
    for(let i=rangeStart; i<rangeEnd; i++){
        var rowElement = document.createElement('tr')
        rowElement.className = 'csvRow'
        rowElement.id = `csvTable-${i}`
        table.appendChild(rowElement)
        let cols = rows[i].split(',')
        for(let j=0;j< cols.length;j++){
            let columnElement = document.createElement('td')
            console.log(parseFloat(cols[j]),parseFloat(cols[j])!=parseFloat(''))
            columnElement.innerText = isNaN(parseFloat(cols[j]))?cols[j]:Math.round(cols[j]*1000)/1000
            columnElement.className = 'csvCol'
            if(i==0){
                columnElement.className = 'headCol csvCol'
            }
            columnElement.id =  `csvTable-${i}-${j}`  
            rowElement.appendChild(columnElement)
        }
    } 
    console.log(rangeStart,rowElement.style.height)
    table.scroll({
        top: rangeStart*rowElement.clientHeight,
        behavior: 'smooth'
      });
}

function downloadAsZIP(){
    var zip = new JSZip();
    zip.file("main.py", pyCode);
    zip.file(sentData["csvPath"],tableCode)
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(content);
        a.href = url;
        a.download = "nnCode.zip";
        a.click();
        a.remove()
        //(content, "nnCode.zip");
    });
}


window.onload = function () {  
    main()
    // hljs.highlightAll()
    // let element = document.getElementById('pythonCode')
    // hljs.highlightElement(element)
}
