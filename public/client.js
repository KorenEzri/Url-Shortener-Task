window.addEventListener("DOMContentLoaded", () => {
  const inputButton = document.querySelector("#input-button");
  const createElements = (type, attributes, ...children) => {
    const element = document.createElement(type);
    for (key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    return element;
  };

  const getShortURL = async () => {
    const urlInput = document.querySelector("#url-input");
    const urlPresentor = document.querySelector("#url-presentor");
    const url = urlInput.value;
    const shortenedUrl = await shortenURLrequest(url);
    const resultedLink = createElements(
      "a",
      { href: `${shortenedUrl}`, target: `_blank` },
      `${shortenedUrl}`
    );
    urlPresentor.appendChild(resultedLink);
  };
  inputButton.addEventListener("click", () => {
    getShortURL();
  });
});
