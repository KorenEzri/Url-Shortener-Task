//GET ALL URLS - DEFAULT BIN :)
const axios = require("axios");
const base_url = location.origin;

const readBin = async (location) => {
  if (process.env.NODE_ENV === "test") {
    location = "test";
  }
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
    } else if (location === "users") {
      return data.record;
    } else if (!data.record[0]) {
      return data;
    } else {
      for (let i = 0; i < binDataArray.length; i++) {
        allUrls.push(binDataArray[i]);
      }
      return allUrls;
    }
  } catch ({ message }) {
    console.log(message);
  }
};

const addToBin = async (url, location) => {
  let allUrls;
  if (!location) {
    location = "default";
    allUrls = await readBin();
  } else if (location) {
    usersFile = await readBin(location);
    if (!usersFile) {
      allUrls = usersFile.record;
    } else {
      allUrls = usersFile;
    }
  }
  if (Array.isArray(allUrls)) {
    console.log(url, allUrls, location);
    allUrls.push(url);
  } else {
    allUrls = allUrls.record;
    allUrls.push(url);
  }
  try {
    let response = await axios({
      method: "PUT",
      url: `${base_url}/b/${location}`,
      data: JSON.stringify(allUrls),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch ({ message }) {
    console.log(message);
  }
};

const registerToService = async (username, password, old) => {
  try {
    let { data: response } = await axios({
      method: "POST",
      url: `${base_url}`,
    });
    let userObj = {
      username,
      password,
      id: response,
    };
    if (old) {
      old.push(userObj);
    } else if (!old) {
      old = userObj;
    }
    let { data: res2 } = await axios.put(`${base_url}/b/users`, old);
  } catch ({ message }) {
    console.log(message);
  }
};

module.exports = { readBin, addToBin, registerToService };
