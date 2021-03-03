const shortenURLrequest = async (url) => {
  try {
    const { data } = await axios({
      method: "PUT",
      url: "http://localhost:3000/api/shorturl",
      data: JSON.stringify({ longUrl: url }),
      headers: { "Content-Type": "application/json" },
    });
    return data.short;
  } catch (error) {
    console.log(error);
  }
};
