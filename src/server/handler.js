const crypto = require('crypto');
const storeData = require('../services/storeData');
const predictClassification = require('../services/inferenceService');
// const InputError = require('../exceptions/InputError');
const { Firestore } =require('@google-cloud/firestore');
require('dotenv').config();
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  // if (!image || !image.hapi || !image.hapi.filename) {
  //   throw new InputError('File gambar tidak ditemukan atau tidak valid.');
  // }

  // const extension = path.extname(image.hapi.filename).toLowerCase();
  // if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
  //   throw new InputError('Hanya file dengan ekstensi .jpg, .jpeg, atau .png yang diperbolehkan.');
  // }

  const { result, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  
  const data = {
    id: id,
    result: result,
    suggestion: suggestion,
    createdAt: createdAt,
  }
  
  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data
  })
  response.code(201);
  return response;
}

const predictHistories = async (_request, h) => {
  try {
    const db = new Firestore();

    const snapshot = await db.collection("predictions").get();

    if (snapshot.empty) {
      return h.response({
        status: "success",
        data: [],
      }).code(200);
    }

    const data = snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        history: {
          result: docData.result || null,
          createdAt: docData.createdAt || null,
          suggestion: docData.suggestion || null,
          id: doc.id,
        },
      };
    });

    return h.response({
      status: "success",
      data,
    }).code(200);
  } catch (error) {
    console.error("Failed to retrieve prediction histories:", error);
    return h.response({
      status: "fail",
      message: error.message || "Internal Server Error",
    }).code(500);
  }
};


module.exports = { postPredictHandler, predictHistories };