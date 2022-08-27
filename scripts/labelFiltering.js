function saveToLabelMap(uniqueLabels){

}

function labelEncoding(colName,arr){
    var index=1
    var uniqueLabels={}
    var valToLabel={}
    for(var i=0;i<arr.length;i++){
        if(!uniqueLabels[arr[i]])
        {
            uniqueLabels[arr[i]]=index
            console.log(uniqueLabels)
            valToLabel[index]=arr[i]
            index=index+1
        }
        arr[i]=uniqueLabels[arr[i]]
    }
    valueToUniqueLabel[colName]=valToLabel
    console.log(uniqueLabels)
    console.log(arr)
    return arr
}

function oneHotEncoding(arr){
    var index=1
    var uniqueLabels={}
    var valToLabel={}
    let labels = []
    for(var i=0;i<arr.length;i++){
        if(!uniqueLabels[arr[i]])
        {
            uniqueLabels[arr[i]]=index
            labels.push(arr[i])
            console.log(uniqueLabels)
            valToLabel[index]=arr[i]
            index=index+1
        }
        arr[i]=uniqueLabels[arr[i]]
    }
    temp = new Array(index-1).fill(null).map(function(){ return new Array(arr.length).fill(0)})
    for(var i=0;i<arr.length;i++){
        temp [arr[i]-1] [i] = 1
    }
    arr = temp
    return {"data":arr,"valueToLabel":valToLabel,"uniqueLabels":labels}
}