class Matrix{
    static array(dim,defaultVal){
        // dim = dim.filter(val => val != 0) 
        var evalStr = ""
        for(var i=0;i<dim.length;i++){
            if(i==dim.length-1){
                evalStr = evalStr + "new Float32Array("+(dim[i])+").fill(null).map(function(){ return "+(defaultVal)+"})".repeat(dim.length)
                            continue
            }
            evalStr = evalStr + "new Array("+(dim[i])+").fill(null).map(function(){ return "
        }
        return (eval(evalStr))
    }
    static randomArray(dim){
        // dim = dim.filter(val => val != 0)
        var evalStr = ""
        for(var i=0;i<dim.length;i++){
            if(i==dim.length-1){
                evalStr = evalStr + "new Float32Array("+(dim[i])+").fill(null).map(function(){ return Math.random() "+"})".repeat(dim.length)
                            continue
            }
            evalStr = evalStr + "new Array("+(dim[i])+").fill(null).map(function(){ return "
        }
        return (eval(evalStr))
    }

    static transposeMatrix(matrix){
        var res = new Array(matrix[0].length).fill(null).map(function(){return new Float32Array(matrix.length)})
        for(var i=0;i<matrix.length;i++){
            for(var j=0;j<matrix[0].length;j++){
                res[j][i]=matrix[i][j]
            }
        }        
        return res
    }
}