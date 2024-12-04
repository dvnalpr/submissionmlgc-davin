const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

async function loadModel() {
    try{
        return tf.loadGraphModel(process.env.MODEL_URL);
    }catch(error){
        console.error("Gagal memuat model:",error);
        throw new Error("Gagal memuat model.")
    }
}
module.exports = loadModel;