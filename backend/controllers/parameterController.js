const asyncHandler = require("express-async-handler");
const { db } = require("../firebase.js"); 

//@desc Get all parameters
//@route GET /api/parameters
//@access public
const getParameters = asyncHandler(async(req, res) => {

  const snapshot = await db.collection('configs').get();

  if (snapshot.empty) {
    res.status(404);
    throw new Error('No configuration documents found');
  }

  const configList = snapshot.docs.map(doc => ({
    id: doc.id,       
    ...doc.data(),     
  }));

  res.status(200).json(configList);
});

//@desc Create new parameter
//@route POST /api/parameters
//@access public
const createParameter = asyncHandler(async(req, res) => {
    
  const {key, value, description, clientVisible } = req.body;

  if(!key || !value || !description) {
      res.status(400);
      throw new Error("All fields are mandatory.");
  }
  
  //create current date and time as String.
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  const dateCreatedStr = `${day}/${month}/${year}, ${hour}:${minute}`;

  const clientVisibleVal = typeof clientVisible === "boolean" ? clientVisible : true;

  const docRef = db.collection("configs").doc(key);

  const newDoc = {
    key: key,
    value,
    description,
    createdDate: dateCreatedStr,
    clientVisible: clientVisibleVal,
    version: 1,
  };

  await docRef.set(newDoc);

  res.status(201).json({
    message: "New parameter created.",
    parameter: newDoc,
  })
});

//@desc Update parameter
//@route PUT /api/parameters/:id
//@access public
const updateParameter = asyncHandler(async(req, res) => {

  console.log("Update request body:", req.body);

  const { id } = req.params;
  const { key, value, description, clientVisible, version, countryVersion } = req.body;

  if (version === undefined ) {
    return res.status(400).send({
      error: "Missing parameter version in request."
    });
  };

  const docRef = db.collection("configs").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    res.status(404);
    throw new Error("Parameter with id: " + id + " not found.");
  }

  const currentData = doc.data();

  if(currentData.version !== version) {
    return res.status(409).json({
      error: "Version conflict, parameter has been updated by someone else.",
    });
  };

  const updateFields = {};

  if (key !== undefined) updateFields.key = key;
  if (value !== undefined) updateFields.value = value;
  if (description !== undefined) updateFields.description = description;
  if (typeof clientVisible === "boolean") updateFields.clientVisible = clientVisible;
  if (countryVersion !== undefined) {
    updateFields.countryVersion = countryVersion;
  }

  if (Object.keys(updateFields).length === 0) {
    res.status(400).json({ error: "'key', 'value', 'description', 'countryVersion' or 'clientVisible' must be provided." });
    return;
  }

  //increase version number for optimistic locking
  updateFields.version = version + 1;

  await docRef.update(updateFields);

  const updatedDoc = (await docRef.get()).data();

  res.status(200).json( {
    message: "Parameter with id:" + req.params.id + " updated.",
    updatedParameter: updatedDoc
  });
});

//@desc Delete parameter
//@route DELETE /api/parameters/:id
//@access public
const deleteParameter = asyncHandler(async(req, res) => {
  const { id } = req.params;

  const docRef = db.collection("configs").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    res.status(404);
    throw new Error("Parameter with id: " + id + " not found.");
  }

  await docRef.delete();

  res.status(200).json({
    message: "Parameter with id: " + id + " deleted."
  });
});

module.exports = {getParameters, createParameter, updateParameter, deleteParameter};