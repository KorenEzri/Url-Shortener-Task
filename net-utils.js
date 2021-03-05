//GET ALL URLS - DEFAULT BIN :)
const axios = require("axios");
const base_url = "http://localhost:3001";

const readBin = async (location) => {
  if (!location) location = "default";
  const allUrls = [];
  try {
    const { data } = await axios({
      method: "GET",
      url: `${base_url}/b/${location}`,
      data: {},
    });
    const binDataArray = data.record[0];
    if (location === "default" && binDataArray) {
      for (let i = 0; i < binDataArray.length; i++) {
        allUrls.push(binDataArray[i]);
      }
      return allUrls;
    } else {
      return data.record;
    }
  } catch (err) {
    console.log(err);
  }
};

const addToBin = async (url, existingUrls) => {
  let allUrls = await readBin();
  allUrls.push(url);
  try {
    let response = await axios({
      method: "PUT",
      url: `${base_url}/b/default`,
      data: JSON.stringify(allUrls),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch ({ message }) {
    console.log(message);
  }
};

const registerToService = async (username, password) => {
  try {
    let { data: response } = await axios({
      method: "POST",
      url: `${base_url}`,
    });
    console.log(response);
    let { data: res2 } = await axios.put(`${base_url}/b/users`, {
      username,
      password,
      id: response,
    });
  } catch ({ message }) {
    console.log(message);
  }
};

module.exports = { readBin, addToBin, registerToService };
