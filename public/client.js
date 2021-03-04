window.addEventListener("DOMContentLoaded", () => {
  const inputButton = document.querySelector("#input-button");
  const urlPresentor = document.querySelector("#url-presentor");

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
    const url = urlInput.value;
    const shortenedUrl = await shortenURLrequest(url);
    const resultedLink = createElements(
      "a",
      { id: `shortened-url`, href: `${shortenedUrl}`, target: `_blank` },
      `${shortenedUrl}`
    );
    urlPresentor.appendChild(resultedLink);
  };

  inputButton.addEventListener("click", () => {
    const existingUrl = document.querySelector("#shortened-url");
    if (existingUrl) {
      urlPresentor.removeChild(existingUrl);
    }
    getShortURL();
  });

  //RENDER "STATS" LIST
  const renderStatsList = async () => {
    const statsList = document.querySelector("#links");
    const allUrlObjects = await getAllUrlObjects();
    allUrlObjects.forEach((url) => {
      link_Item = createElements(
        "a",
        {
          class: "stored-url",
          href: `${url.long}`,
          target: "_blank",
        },
        `${url.short}`
      );
      list_Item = createElements("li", {
        class: "link-list-items",
      });
      list_Item.appendChild(link_Item);
      statsList.appendChild(list_Item);
    });
  };

  renderStatsList();
});
