const asyncHandler = require("express-async-handler");
const {db} = require("../firebase"); 

//@desc Get configuration list
//@route GET /api/config
//@access public
const getConfig = asyncHandler(async (req, res) => {

  const country = req.query.country ? req.query.country.toUpperCase() : null;


  const snapshot = await db.collection("configs").get();

  if (snapshot.empty) {
    res.status(404);
    throw new Error("No configuration documents found");
  }

  const configList = snapshot.docs.map(doc => doc.data());

  const configMap = {};
  configList.forEach(item => {
    if (item.key && item.clientVisible !== false) {
      let value = null;

      if (item.countryVersion && typeof item.countryVersion === "object") {
        if (country && item.countryVersion[country]) {
          value = item.countryVersion[country];
        } else if (item.countryVersion["default"]) {
          value = item.countryVersion["default"];
        }
      }

      configMap[item.key] = value ?? item.defaultValue ?? item.value ?? null;
          }
  });

  const response = {
    free_usage_limit: Number(configMap.scroll) || 0,
    support_email: configMap.support_email || '',
    privacy_page: "https://help.html",
    minimum_version: configMap.min_version || "1.0",
    latest_version: configMap.latest_version || "2.1",
  };

  for (const [key, value] of Object.entries(configMap)) {
    if (!(key in response)) {
      response[key] = value;
    }
  }

  res.status(200).json(response);
});

module.exports = { getConfig };