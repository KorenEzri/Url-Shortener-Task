const shortenURLrequest = async (url) => {
  const { data } = await axios({
    method: "PUT",
    url: "http://localhost:3000/api/shorturl",
    data: JSON.stringify({ longUrl: url }),
    headers: { "Content-Type": "application/json" },
  });
  console.log(data);
  return data.short;
};
