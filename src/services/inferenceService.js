const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {

    if (!Buffer.isBuffer(image)) {
        throw new InputError('File yang diunggah bukan gambar. Mohon unggah file dengan format gambar.');
    }

    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
 
            const prediction = model.predict(tensor);
            const scores = await prediction.data();
            const confidenceScore = scores[0] * 100; // Probability of class 1 (Cancer)
            
            const result = scores[0] > 0.5 ? 'Cancer' : 'Non-cancer';
            const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';
            
            tensor.dispose();
            prediction.dispose();
            
            return { confidenceScore, result, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}
 
module.exports = predictClassification;
