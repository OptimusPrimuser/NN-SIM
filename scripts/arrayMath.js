function minMax(colName,arr){
    //console.log(arr)
    var minimum = Math.min(...arr)
    var maximum = Math.max(...arr)
    for(var i =0; i< arr.length ; i++){
        arr[i] = (arr[i]-minimum)/(maximum-minimum)
    }
    return arr
}

function arrayLog(colName,arr){
    for(var i=0;i<arr.length;i++){
        arr[i] = Math.log(arr[i])
    }
    return arr
}

function arraySigmoid(colName,arr){
    for(var i=0;i<arr.length;i++){
        arr[i] = 1/(1-Math.exp(-arr[i]))
    }
    return arr
}

function sumArray(data){
    sum = 0
    for(var i =0; i<data.length;data++){
        sum = sum +data[i]
    }
    return sum
}