
class CreateCode{
    static createCSV(inputCols,inputNames,outputCols,outputNames,shuffledIndexes){
        let colNames=''
        for(let i=0;i<inputNames.length;i++){
            colNames=colNames+","+inputNames[i]
        }
        for(let i=0;i<outputNames.length;i++){
            colNames=colNames+","+outputNames[i]
        }
        colNames = colNames.substring(1)
        let colData = ''
        // for(let i=0;i<inputCols[0].length;i++){
            
        //     let inputDataTemp=''
        //     for(let j=0;j<inputCols.length;j++){
        //         inputDataTemp=inputDataTemp+","+inputCols[j][i]
        //     }
        //     inputDataTemp = inputDataTemp.substring(1)

        //     let outputDataTemp=''
        //     for(let j=0;j<outputCols.length;j++){
        //         outputDataTemp=outputDataTemp+","+outputCols[j][i]
        //     }
        //     outputDataTemp = outputDataTemp.substring(1)
        //     colData=colData+"\n"+inputDataTemp+","+outputDataTemp
        // }
        for(let i=0;i<inputCols[0].length;i++){
            
            let inputDataTemp=''
            for(let j=0;j<inputCols.length;j++){
                inputDataTemp=inputDataTemp+","+inputCols[j][shuffledIndexes[i]]
            }
            inputDataTemp = inputDataTemp.substring(1)
        
            let outputDataTemp=''
            for(let j=0;j<outputCols.length;j++){
                outputDataTemp=outputDataTemp+","+outputCols[j][shuffledIndexes[i]]
            }
            outputDataTemp = outputDataTemp.substring(1)
            colData=colData+"\n"+inputDataTemp+","+outputDataTemp
        }
        let csvData = colNames+colData
        return csvData
    }

    static createNNCode(nnObj,layerLength,nodeLength,epoch,input_cols,output_cols,csvPath,modelName,outputSigmoid=false){
        let modelCode=``
        let nnLayer0Len=nodeLength[0]
        let nnLayer1Len=nodeLength[1]
        modelCode = modelCode + `model.add(Dense(${nnLayer1Len}, activation='relu', input_shape=(${nnLayer0Len},)))`+"\n"
        for(let i=2;i<layerLength-1;i++){
            let layerLen=nodeLength[i]
            modelCode = modelCode + `model.add(Dense(${layerLen}, activation='relu'))` +"\n"
        }
        let lastLayerLen=nodeLength[layerLength-1]
        if (outputSigmoid==true){
            modelCode = modelCode + `model.add(Dense(${lastLayerLen}, activation='sigmoid'))`
        }
        else{
            modelCode = modelCode + `model.add(Dense(${lastLayerLen}))` + "\n"
        }
        let template = `
        from pandas import read_csv 
        from sklearn.model_selection import train_test_split 
        from sklearn.preprocessing import LabelEncoder 
        from tensorflow.keras import Sequential 
        from tensorflow.keras.layers import Dense 
        path = '${csvPath}' 
        df = read_csv(path) 
        x=df[${JSON.stringify(input_cols)}] 
        y=df[${JSON.stringify(output_cols)}] 
        X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.33) 
        print('train length',X_train.shape,'test length', X_test.shape) 
        n_features = X_train.shape[1] 
        model = Sequential() 
        ${modelCode} 
        model.compile(optimizer='SGD',loss='mse', metrics=['accuracy']) 
        model.fit(X_train, y_train, epochs=${epoch}, batch_size=32) 
        loss, acc = model.evaluate(X_test, y_test) 
        print('Test Accuracy: %.3f' % acc) 
        model.save('${modelName}.keras') 
        `
        return template.replaceAll(/( ){2,}/g,'')
        
    }
}