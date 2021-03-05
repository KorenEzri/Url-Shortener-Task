const base_request_url = "http://localhost:3001";
const main_request_url = "http://localhost:3000";

const shortenURLrequest = async (longUrl, user) => {
  try {
    let body;
    if (user) {
      id = user.id;
      body = { longUrl, id };
    } else {
      body = { longUrl };
    }
    const { data } = await axios({
      method: "PUT",
      url: `${main_request_url}/api/shorturl`,
      data: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    return data.short;
  } catch ({ message }) {
    console.log(message);
  }
};

const getAllUrlObjects = async () => {
  const allUrls = [];
  try {
    const { data } = await axios({
      method: "GET",
      url: `${base_request_url}/b/default`,
      data: {},
    });
    const binDataArray = data.record[0];
    if (binDataArray) {
      for (let i = 0; i < binDataArray.length; i++) {
        allUrls.push(binDataArray[i]);
      }
    }
    return allUrls;
  } catch ({ message }) {
    console.log(message);
  }
};

const registerToService = async (username, password) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: `${main_request_url}/register`,
      data: { username, password },
    });
    return alert(`Successfully registered as: ${username}`);
  } catch ({ message }) {
    console.log(message);
  }
};

const logIntoService = async (username, password) => {
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${main_request_url}/login`,
      data: { username, password },
    });
    return data;
  } catch ({ message }) {
    console.log(message);
  }
};

const pingLocation = async (user) => {
  try {
    await axios({
      method: "PUT",
      url: `${main_request_url}/ping`,
      data: user,
    });
    return;
  } catch ({ message }) {
    console.log(message);
  }
};
