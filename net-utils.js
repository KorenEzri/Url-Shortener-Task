//GET ALL URLS - DEFAULT BIN :)
const axios = require("axios");

const readBin = async () => {
  const allUrls = [];
  try {
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
  } catch (err) {
    console.log(err);
  }
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
  try {
    let response = await axios({
      method: "PUT",
      url: "http://localhost:3001/b/default",
      data: JSON.stringify(allUrls),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { readBin, addToBin };
