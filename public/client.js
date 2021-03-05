window.addEventListener("DOMContentLoaded", () => {
  const inputButton = document.querySelector("#input-button");
  const urlPresentor = document.querySelector("#url-presentor");
  const shortLinkList = document.querySelector("#links");
  const longLinkList = document.querySelector("#originals");
  const registerButton = document.querySelector("#register-button");
  const logInButton = document.querySelector("#login-button");
  let isLoggedIn = false;
  let user;
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
  setInterval(() => {
    console.log(isLoggedIn);
  }, 5000);
  //RENDER SHORTENED URL

  //STOPPED HERE
  const getShortURL = async (isLogged) => {
    const urlInput = document.querySelector("#url-input");
    const url = urlInput.value;
    let shortenedUrl;
    if (isLogged) {
      shortenedUrl = await shortenURLrequest(url, user);
    } else {
      shortenedUrl = await shortenURLrequest(url);
    }
    if (!shortenedUrl) {
      return alert("Invalid URL");
    }
    const resultedLink = createElements(
      "a",
      { id: `shortened-url`, href: `${shortenedUrl}`, target: `_blank` },
      `${shortenedUrl}`
    );
    urlPresentor.appendChild(resultedLink);
  };

  //FUNCTION: RENDER SHORT LINKS

  const renderAllShortLinks = async (allUrls) => {
    allUrls.forEach((url) => {
      link_list_item = createElements(
        "li",
        {
          class: "link-list-items",
        },
        createElements(
          "a",
          {
            class: "stored-url",
            href: `${url.long}`,
            target: "_blank",
          },
          `${url.short}`
        )
      );
      shortLinkList.appendChild(link_list_item);
    });
  };
  const renderAllLongLinks = async (allUrls) => {
    allUrls.forEach((url) => {
      const summary = createElements(
        "summary",
        { class: "stat-summary" },
        "Expand"
      );

      const original_link = createElements(
        "a",
        { class: "original-link", href: `${url.long}`, target: "_blank" },
        `${url.long}`
      );
      const original_link_item = createElements(
        "li",
        {
          class: "original-list-item",
        },
        original_link
      );
      const details = createElements(
        "details",
        { class: "stat-details" },
        summary,
        original_link_item
      );
      longLinkList.appendChild(details);
    });
  };
  const renderAllLinkIDs = async (allUrls) => {
    allUrls.forEach((url) => {
      id_list_item = createElements(
        "li",
        {
          class: "id-list-items",
        },
        createElements(
          "p",
          {
            class: "stored-url",
          },
          `${url.short}`
        )
      );
      shortLinkList.appendChild(link_list_item);
    });
  };

  //RENDER "STATS" LIST
  const renderStatsList = async (user) => {
    let allUrlObjects;
    if (isLoggedIn && user) {
      allUrlObjects = user.urls;
    } else {
      allUrlObjects = await getAllUrlObjects();
    }
    renderAllShortLinks(allUrlObjects);
    renderAllLongLinks(allUrlObjects);
  };

  //SIGN IN TO SERVICE
  const logUserInFromClient = async () => {
    const passwordInput = document.querySelector("#password-input").value;
    const usernameInput = document.querySelector("#username-input").value;
    user = await logIntoService(usernameInput, passwordInput);
    isLoggedIn = true;
    await pingLocation(user);
    if (!user.urls) {
      return;
    }
    renderStatsList(user);
  };

  // renderStatsList();

  inputButton.addEventListener("click", () => {
    const existingUrl = document.querySelector("#shortened-url");
    const urlPresentorPlaceholder = document.querySelector(
      "#presentor-placeholder"
    );
    if (isLoggedIn) {
      getShortURL("isLogged");
    } else {
      getShortURL();
    }

    if (existingUrl) {
      urlPresentor.removeChild(existingUrl);
      urlPresentor.style.backgroundColor = "rgba(245, 245, 245, 0.644);";
    }

    urlPresentor.style.backgroundColor = "unset";
    urlPresentorPlaceholder.hidden = true;
  });

  //REGISTER TO SERVICE
  registerButton.addEventListener("click", async () => {
    const passwordInput = document.querySelector("#password-input").value;
    const usernameInput = document.querySelector("#username-input").value;

    await registerToService(usernameInput, passwordInput);
  });

  logInButton.addEventListener("click", () => {
    logUserInFromClient();
  });
});
