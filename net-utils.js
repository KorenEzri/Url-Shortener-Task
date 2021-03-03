//GET ALL URLS - DEFAULT BIN :)
const axios = require("axios");
// const koren = require("@korenezri/jsondb");

const readBin = async () => {
  const allUrls = [];
  const { data } = await axios({
    method: "GET",
    url: "http://localhost:3001/b/default",
    data: {},
  });
  const binDataArray = data.record[0];
  if (binDataArray) {
    for (let i = 0; i < binDataArray.length; i++) {
      allUrls.push(binDataArray[i]);
    }
  }
  return allUrls;
};

// const addToBin = async (url, existingUrls) => {
//   let newUrlList = [];
//   if (existingUrls) {
//     newUrlList.concat(existingUrls);
//     newUrlList.push(url);
//   } else {
//     newUrlList = await readBin();
//     newUrlList.push(url);
//   }
//   let response = await axios({
//     method: "PUT",
//     url: "http://localhost:3001/b/default",
//     data: JSON.stringify(newUrlList),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

const addToBin = async (url, existingUrls) => {
  let allUrls = await readBin();
  allUrls.push(url);
  let response = await axios({
    method: "PUT",
    url: "http://localhost:3001/b/default",
    data: JSON.stringify(allUrls),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

module.exports = { readBin, addToBin };
