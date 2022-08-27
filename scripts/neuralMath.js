

const gpu = new GPU(); 

function appendTolist(data,element){
    data.push(element)
    return data
}

GPUkernels={}
class NeruralMathGPU{
    
    static calcLayerVal(layerNo,weights,values,bias){
        var calc=GPUkernels["calcLayer"+layerNo];
        if (!calc){
            const kernel = gpu.createKernel(
                function(weights,weightsLen,values,bias){
                    let value =0
                    for(var i=0;i<weightsLen;i++){
                        value= value +weights[this.thread.x][i]*values[this.thread.x]+bias[this.thread.x][i]
                    }
                    if (value<0){
                        value=0
                    }
                    return value
                }
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')
            calc = kernel.setOutput({x:weights.length})
            GPUkernels["calcLayer"+layerNo]=calc
        }
        
        
        //console.log(kernel)
        var res = calc(weights,weights[0].length,values,bias)
        //console.log(res)
        return res
    }
    
    static weightsSum(layerNo,weights){
        var calc=GPUkernels["weightsSum"+layerNo];
        if (!calc){
            const kernel = gpu.createKernel(
                function(weights,weightsLen){
                    let value =0
                    for(var i=0;i<weightsLen;i++){
                        value= value +weights[this.thread.x][i]
                    }
                    
                    return value
                }
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')
            calc = kernel.setOutput({x:weights.length})
            GPUkernels["weightsSum"+layerNo]=calc
        }
        
        var res = calc(weights,weights[0].length)
        
        return res
    }

    static errorMatrixSum(layerNo,errorMat){
        var calc=GPUkernels["errorMatrixSum"+layerNo];
        if (!calc){
            const kernel = gpu.createKernel(
            function(errorMat,matLen){
                    var value =0
                    for(var i=0;i<matLen;i++){
                        value = value + errorMat[this.thread.x][i]
                    }
                    return value
                }
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')
            calc = kernel.setOutput({x:errorMat.length})
            GPUkernels["errorMatrixSum"+layerNo]=calc
        }
        const res = calc(errorMat,errorMat[0].length)
        return res
    }

    static transposeMatrix(layerNo,matrix){
        var calc=GPUkernels["transposeMatrix"+layerNo];
        if (!calc){
                const kernel = gpu.createKernel(
                function(mat){
                    return mat[this.thread.x][this.thread.y]
                } 
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')

            calc = kernel.setOutput(
                {
                    x:matrix.length,
                    y:matrix[0].length
                }
            )
            GPUkernels["transposeMatrix"+layerNo]=calc
        }
        
        var res = calc(matrix)
        return res
    }

    static meanSquareError(target,predicted){
        var calc=GPUkernels[-1];
        if (!calc){    
            const kernel = gpu.createKernel(
                function(targetVals,predictedVals){
                    return Math.pow(targetVals[this.thread.x]-predictedVals[this.thread.x],2)
                }
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')
            calc = kernel.setOutput({x:target.length})
            GPUkernels[-1]=calc
        }
        
        var res = calc(target,predicted)
        return res
    }

    static transposeMultiplyAndDivide(layerNo,transposeMat,multiplyMat,divideMat){
        var calc=GPUkernels["transposeMultiplyAndDivide"+layerNo];
        if (!calc){    
            const kernel = gpu.createKernel(
                function(transposeMat,matSize,multiplyMat,divideMat){
                    return transposeMat[this.thread.x][this.thread.y]*multiplyMat[this.thread.x]/divideMat[this.thread.x]//sum
                } 
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')

            calc = kernel.setOutput(
                {
                    x:transposeMat.length,
                    y:transposeMat[0].length
                }
            )
            GPUkernels["transposeMultiplyAndDivide"+layerNo]=calc
        }
        
        var res = calc(transposeMat,transposeMat.length,multiplyMat,divideMat)
        return res
    }

    //weights=weights+errMat*value*lr*gd
    static adjustWeights(layerNo,weights,errMat,value,lr,gd){
        var calc=GPUkernels["adjustWeights"+layerNo];
        if (!calc){    
            const kernel = gpu.createKernel(
                function(weights,errMat,value,lr,gd){
                    return weights[this.thread.y][this.thread.x]+errMat[this.thread.y][this.thread.x]*value[this.thread.x]*lr*gd
                } 
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')

            calc = kernel.setOutput(
                {
                    x:weights[0].length,
                    y:weights.length
                }
            )
            GPUkernels["adjustWeights"+layerNo]=calc
        }
        
        var res = calc(weights,errMat,value,lr,gd)
        return res
    }

    //bias+errMat*lr*gd
    static adjustBias(layerNo,bias,errMat,lr,gd){
        var calc=GPUkernels["adjustBias"+layerNo];
        if (!calc){    
            const kernel = gpu.createKernel(
                function(bias,errMat,lr,gd){
                    return bias[this.thread.y][this.thread.x]+errMat[this.thread.y][this.thread.x]*lr*gd
                } 
            )
            //kernel.dynamicOutput =true
kernel.setOptimizeFloatMemory(true)
kernel.setTactic('speed')

            calc = kernel.setOutput(
                {
                    x:bias[0].length,
                    y:bias.length
                }
            )
            GPUkernels["adjustBias"+layerNo]=calc
        }
        
        var res = calc(bias,errMat,lr,gd)
        return res
    }
    static convertToArray(data){
        return data.toArray()
    }
    
}

class NeruralMathCPU{
    //done
    static calcLayerVal(layerNo,weights,values,bias,activation){
        var res = new Float32Array(weights.length)
        for(var i=0;i<weights.length;i++){
            var sum = 0 
            for(var j=0;j<weights[0].length;j++){
                let val = weights[i][j]*values[i]+bias[i][j] 
                if(activation="relu"){
                    if (val<0){
                        val = 0 
                    }
                }
                sum = sum + val
            }
            if(activation="relu"){
                if (sum<0){
                    sum=0
                }
            }
            res[i]=sum
        }
        return res
    }
    //done
    static weightsSum(layerNo,weights){
        var res = new Float32Array(weights.length)
        for(var i=0;i<weights.length;i++){
            var sum = 0 
            for(var j=0;j<weights[0].length;j++){
                sum = sum + weights[i][j] 
            }
            res[i]=sum
        }
        return res
    }
    //done
    static errorMatrixSum(layerNo,errorMat){
        var res = new Float32Array(errorMat.length)
        for(var i =0;i<errorMat.length;i++){
            var sum =0
            for(var j=0;j<errorMat[0].length;j++){
                sum = sum + errorMat[i][j]
            }
            res[i]=sum
        }
        return res
    }
    
    static transposeMatrix(layerNo,matrix){
        var res = new Array(matrix[0].length).fill(null).map(function(){return new Float32Array(matrix.length)})
        for(var i=0;i<matrix.length;i++){
            for(var j=0;j<matrix[0].length;j++){
                res[j][i]=matrix[i][j]
            }
        }        
        return res
    }

    static meanSquareError(target,predicted){
        var res = new Float32Array(target.length)
        for(var i=0;i<target.length;i++){
            let tar = target[i]
            let pred = predicted[i]
            // tar= 1/1-Math.exp(-tar)
            // pred= 1/1-Math.exp(-pred)
            res[i]=Math.pow(tar-pred,2)
        }
        return res
    }

    static transposeMultiplyAndDivide(layerNo,transposeMat,multiplyMat,divideMat){
        var res = new Array(transposeMat[0].length).fill(null).map(function(){return new Float32Array(transposeMat.length)})
        for(var j=0;j<transposeMat[0].length;j++){
            for(var i=0;i<transposeMat.length;i++){
                res[j][i]=transposeMat[i][j]*multiplyMat[i]/divideMat[i]
            }
        }
        return res
    }

    //weights=weights+errMat*value*lr*gd
    static adjustWeights(layerNo,weights,errMat,value,lr,gd){
        var res = new Array(weights.length).fill(null).map(function(){return new Float32Array(weights[0].length)})
        for(var i=0;i<weights.length;i++){
            for(var j=0;j<weights[0].length;j++){
                res[i][j] = weights[i][j]+errMat[i][j]*value[j]*lr*gd
            }
        }
        return res
    }

    //bias+errMat*lr*gd
    static adjustBias(layerNo,bias,errMat,lr,gd){
        var res = new Array(bias.length).fill(null).map(function(){return new Float32Array(bias[0].length)})
        for(var i=0;i<bias.length;i++){
            for(var j=0;j<bias[0].length;j++){
                res[i][j] = bias[i][j]+errMat[i][j]*lr*gd
            }
        }
        return res
    }

    // static adjustWeightsSoftMax(layerNo,weights,errMat,value,lr,gd){
    //     var res = new Array(weights.length).fill(null).map(function(){return new Float32Array(weights[0].length)})
    //     for(var i=0;i<weights.length;i++){
    //         for(var j=0;j<weights[0].length;j++){
    //             res[i][j] = weights[i][j]+errMat[i][j]*value[j]*lr*gd
    //         }
    //     }
    //     return res
    // }
    static convertToArray(data){
        return data.toArray()
    }
    
}

