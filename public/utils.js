const shortenURLrequest = async (longUrl) => {
  try {
    const { data } = await axios({
      method: "PUT",
      url: "http://localhost:3000/api/shorturl",
      data: JSON.stringify({ longUrl }),
      headers: { "Content-Type": "application/json" },
    });
    return data.short;
  } catch (error) {
    console.log(error);
  }
};

const getAllUrlObjects = async () => {
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
