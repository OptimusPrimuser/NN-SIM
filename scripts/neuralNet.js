

// Matdata=Matrix.array(dim=[3,3],defaultVal=1,randomBool=false)
// console.log(Matdata)
// var mat1 = Matrix.randomArray([8000000])//[[1,2,3],[4,5,6],[7,8,9],[10,11,12]]
// var mat2 = Matrix.randomArray([8000000])//[[7,8],[9,10],[11,12],[13,14]]

class BackendLayer{
    constructor(numNode,nextNumNode){
        this.weights = Matrix.randomArray([nextNumNode,numNode])//nj.random([nextNumNode,numNode])
        this.weightsSum = Matrix.array([nextNumNode],0)//nj.zeros([nextNumNode])
        this.values = Matrix.randomArray([numNode])//nj.random([numNode])
        this.errorTotal = Matrix.array([numNode],0)//nj.zeros([numNode])
        this.errorMatrix = Matrix.array([nextNumNode,numNode])//nj.zeros([nextNumNode,numNode])
        this.updates = Matrix.randomArray([nextNumNode,numNode])//nj.random([nextNumNode,numNode])
        this.bias = Matrix.randomArray([nextNumNode,numNode])//nj.random([nextNumNode,numNode])
    }
}


class nn{
    constructor(specs,lr,mode){
        this.layers = []
        for(var numNodeIndex=0;numNodeIndex<specs.length-1;numNodeIndex++){
            this.layers.push(
                new BackendLayer(
                    specs[numNodeIndex],
                    specs[numNodeIndex+1]
                )
            )
        }
        this.layers.push(
            new BackendLayer(
                specs[specs.length-1],0
            )
        )
        this.gradientDirection=1
        this.lr=lr
        this.neuralMath = NeruralMathCPU
        // this.applySoftMax = applySoftMax
        if(mode==="gpu"){
            this.neuralMath = NeruralMathGPU
        }
    }

    printLayers(){
        for(var layerNo=0;layerNo<this.layers.length;layerNo++){

            var temp = {
                "layer_number": layerNo,
                "weights": this.layers[layerNo].weights,
                "weights_sum": this.layers[layerNo].weightsSum,
                "error": this.layers[layerNo].errorTotal,
                "error matrix":this.layers[layerNo].errorMatrix,
                "values": this.layers[layerNo].values,
                "bias":this.layers[layerNo].bias
            }
            console.log(temp)
        }
    }

    forward(in_data){
        if(this.layers[0].values.length!=in_data.length){
            return
        }
        this.layers[0].values = in_data
        var layersLength= this.layers.length
        for(var i=0;i<layersLength-2;i++){
            // this.layers[i].weightsSum=NeruralMath.convertToArray(
            //     NeruralMath.weightsSum(this.layers[i].weights)
            // )

            this.layers[i].weightsSum=this.neuralMath.weightsSum(i,this.layers[i].weights)
            

            // this.layers[i+1].values=NeruralMath.convertToArray(
            //     NeruralMath.calcLayerVal(
            //         this.layers[i].weights,
            //         this.layers[i].values,
            //         this.layers[i].bias
            //     )
            // )
            
            this.layers[i+1].values=this.neuralMath.calcLayerVal(
                i,
                this.layers[i].weights,
                this.layers[i].values,
                this.layers[i].bias,
                "relu"
            )
        }
        let secondLastIndex = layersLength-2
        this.layers[secondLastIndex].weightsSum = this.neuralMath.weightsSum(secondLastIndex,this.layers[secondLastIndex].weights)
        this.layers[secondLastIndex+1].values=this.neuralMath.calcLayerVal(
            secondLastIndex,
            this.layers[secondLastIndex].weights,
            this.layers[secondLastIndex].values,
            this.layers[secondLastIndex].bias,
            "None"
        )
        // if(this.applySoftMax==true){
        //     this.layers[layersLength-1].values = applySoftMaxArray(this.layers[layersLength-1].values)
        // }
        return this.layers[layersLength-1].values
    }

    spreadError(errorVal){
        var layersLength = this.layers.length
        let temp = sumArray(errorVal)
        //console.log(temp,isNaN(temp),!isFinite(temp))
        // if (isNaN(sumArray(errorVal)) || temp==Number.POSITIVE_INFINITY ){
        //     for(let i=0;i<errorVal.length;i++){
        //         errorVal[i]=Number.MAX_SAFE_INTEGER
        //     }
        // }
        // else if(temp==Number.NEGATIVE_INFINITY){
        //     for(let i=0;i<errorVal.length;i++){
        //         errorVal[i]=-Number.MAX_SAFE_INTEGER
        //     }
        // }
        if(sumArray(this.layers[layersLength-1].errorTotal)<sumArray(errorVal)){
            //this.gradientDirection = this.gradientDirection*-1
            this.gradientDirection = this.gradientDirection*(-1)
            //return
        } 
        this.layers[layersLength-1].errorTotal = errorVal
        for(var i=layersLength-2;i>-1;i--){
            
            // this.layers[i].errorMatrix = NeruralMath.convertToArray(
            //     NeruralMath.transposeMultiplyAndDivide(
            //         this.layers[i].weights,
            //         this.layers[i+1].errorTotal,
            //         this.layers[i].weightsSum
            //     )
            // )

            this.layers[i].errorMatrix = this.neuralMath.transposeMultiplyAndDivide(
                i,
                this.layers[i].weights,
                this.layers[i+1].errorTotal,
                this.layers[i].weightsSum
            )

            
            // this.layers[i].errorTotal = NeruralMath.convertToArray(
            //     NeruralMath.errorMatrixSum(
            //         this.layers[i].errorMatrix
            //     )
            // )

            this.layers[i].errorTotal = this.neuralMath.errorMatrixSum(i,this.layers[i].errorMatrix)

            // this.layers[i].errorMatrix = NeruralMath.convertToArray(
            //     NeruralMath.transposeMatrix(this.layers[i].errorMatrix)
            // )
            this.layers[i].errorMatrix = this.neuralMath.transposeMatrix(i,this.layers[i].errorMatrix) 
            // console.log("gpu",NeruralMath.convertToArray(
            //     NeruralMath.transposeMatrix(this.layers[i].errorMatrix)
            // ))
            // console.log("cpu",this.neuralMath.transposeMatrix(this.layers[i].errorMatrix))
            // console.log(
            //     {
            //         "error mat": this.layers[i].errorMatrix,
            //         "error mat Shape":[
            //             this.layers[i].errorMatrix.length,
            //             this.layers[i].errorMatrix[0].length
            //         ],
            //         "error total": this.layers[i].errorTotal,
            //         "error total shape": this.layers[i].errorTotal.length
            //     }
            // )
        }
    }

    gradientDescent(){
        for(var i=0;i<this.layers.length-1;i++){
            var weights = this.layers[i].weights
            var bias = this.layers[i].bias
            var errMat = this.layers[i].errorMatrix
            var x = this.layers[i].values

            this.layers[i].weights = this.neuralMath.adjustWeights(
                    i,
                    this.layers[i].weights,
                    this.layers[i].errorMatrix,
                    this.layers[i].values,
                    this.lr,
                    this.gradientDirection    
                )
            
            this.layers[i].bias = this.neuralMath.adjustBias(
                i,
                this.layers[i].bias,
                this.layers[i].errorMatrix,
                this.lr,
                this.gradientDirection    
            )
            
        }
    }

    train(in_data,target_data){
        var predicted = this.forward(in_data)
        // console.log('predicted',predicted)
        var errorVal = this.neuralMath.meanSquareError(target_data,predicted)//NeruralMath.convertToArray(NeruralMath.meanSquareError(target_data,predicted))
        this.spreadError(errorVal)
        this.gradientDescent()
        return sumArray(errorVal)
    }

}


//testNet.printLayers()
// //testNet.getShape()
//testNet.printLayers()
//console.log(testNet.forward([4,5,6]))
//console.log(NeruralMath.meanSquareError([4,4,4],[1,2,3]))
//console.log("After Forward")
//testNet.printLayers()


// console.time("cpu")
// var testNet = new nn([3,5000,5000,5000,5000,2],0.001,"cpu")
// for (var i=0;i<10;i++)
//     testNet.train([4,5,6],[5,3])
// console.timeEnd("cpu")

// console.time("gpu")
// var testNet = new nn([3,5000,5000,5000,5000,2],0.001,"gpu")
// for (var i=0;i<10;i++)
//     testNet.train([4,5,6],[5,3])
// console.timeEnd("gpu")


// console.time("cpu")
// NeruralMathCPU.meanSquareError(mat1,mat2)
// console.timeEnd("cpu")

// console.time("gpu")
// NeruralMathGPU.meanSquareError(mat1,mat2)
// console.timeEnd("gpu")

//testNet.printLayers()
//NeruralMath.transposeMultiplyAndDivide(mat1,mat2)
//testNet.train([4,5,6],[5,3])

// var debugInfo = gpu.context.getExtension('WEBGL_debug_renderer_info')
// console.log(gpu.context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))