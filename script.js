/*
 * Guide pour l'élaboration d'un script afin d'implémenter un algorithme de classification avec Brain.js 
 */

const brain = require('brainjs');
// => Cf. https://github.com/BrainJS/brain.js


// Si CSV via une URL :
 const axios = require('axios');
// => Cf. https://github.com/axios/axios/

/**
 * Récupère les données CSV à partir d'un fichier local ou d'une URL (à choisir pour le TP)
 * @param urlOrFilename
 * @returns csvData
 */
async function getCsvData(urlOrFilename) {
    const response = await axios.get(urlOrFilename, {responseType: 'blob'});
    return response.data;
}

/**
 * Traite les données  CSV pour avoir des données sous forme de tableau JavaScript
 * @param csvData
 * @returns rawData
 */
async function parseCsv(csvData) {
    // TODO
    let rawData = [];

    let rows = csvData.split("\n").slice(1);

    rows.forEach(elem => {
        let element = elem.split(",");

        switch (element[element.length-1]){
            case 'Setosa':
                element[element.length-1] = [1,0,0];
                break;
            case 'Versicolor':
                element[element.length-1] = [0,1,0];
                break;
            case 'Virginica':
                element[element.length-1] = [0,0,1];
                break;
        }

        let elem_input = [parseFloat(element[0]), parseFloat(element[1]), parseFloat(element[2]), parseFloat(element[3])];
        let elem_output = element[element.length-1];

        rawData.push({input: elem_input, output: elem_output});

    });

    return rawData;
    
}


/**
 * Prépare le jeu de données d'entraînement au format Brain.js
 * @param rawData
 * @returns trainingData
 */
async function prepareTrainingData(rawData) {
    let net = new brain.NeuralNetwork({
        binaryThresh: 0.5,
        hiddenLayers: [3, 3, 2],
        activation: "sigmoid",
    });
    net.train(rawData,{
        iterations:1000,
        learningRate:0.3
    });

    return net;
}


/**
 * Fonction principale du script
 */
async function main() {

    const csvData = await getCsvData('https://gist.githubusercontent.com/cbouvard/2f334a970cf543a507526bdca7d1cae4/raw/d535262ceea8fe71e4915b682ca01dc5e6d750f1/iris.csv');

    const rawDataFormatted = await parseCsv(csvData);

    // TODO: Créer un NeuralNetwork de Brain.js
    // TODO: Entraîner le modèle (fonction train)
    let brainJsFormat = await prepareTrainingData(rawDataFormatted);

    // TODO : Tester avec le lancement de prédiction (fonction run)
    // Astuce : la fonction run renvoie un tableau typé. Pour obtenir un tableau classique, utiliser la fonction Array.from
    //let resultDataBrain = await runTrainingData(rawDataFormatted[85].input);
    let resultDataBrain = brainJsFormat.run(rawDataFormatted[85].input);

    console.log("RawData input : "+  rawDataFormatted[85].input+"\n");
    console.log("Résultat de l'analyse: \n\nSetosa = "+ (parseInt(resultDataBrain[0]*100)) 
    + "%\nVersicolor = " + (parseInt(resultDataBrain[1]*100)) 
    + "%\nVirginica = " + (parseInt(resultDataBrain[2]*100)) + "%");
}

main();