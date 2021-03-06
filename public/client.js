window.addEventListener("DOMContentLoaded", () => {
  const inputButton = document.querySelector("#input-button");
  const urlPresentor = document.querySelector("#url-presentor");
  const shortLinkList = document.querySelector("#links");
  const longLinkList = document.querySelector("#originals");
  const linkIDList = document.querySelector("#shortcut-id");
  const linkRedirectCountList = document.querySelector("#redirect-count");
  const registerButton = document.querySelector("#register-button");
  const logInButton = document.querySelector("#login-button");
  const allStats = document.querySelector("#stats-grid");
  let user;
  const storedUser = () => {
    if (!localStorage.getItem("user")) {
      localStorage.removeItem("user");
    } else {
      return JSON.parse(localStorage.getItem("user"));
    }
  };

  setInterval(async () => {
    pingServer();
  }, 2000);

  ///////////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // THIS CREATES ELEMENTS
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

  // THIS SENDS A PING TO THE DATABASE AND TELLS IT WHICH USER IS CURRENTLY LOGGED IN. IT ALSO RECEIVES VALUABLE INFORMATION TO UPDATE THE USER INSTANTLY.
  const pingServer = async () => {
    if (storedUser()) {
      const updatedUser = await pingLocation(storedUser());
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // THIS SENDS A REQUEST TO SHORTEN A URL, AND THEN GETS THAT SHORTENED URL
  const getShortURL = async (isLogged) => {
    const urlInput = document.querySelector("#url-input");
    const url = urlInput.value;
    let shortenedUrl;
    if (isLogged) {
      shortenedUrl = await shortenURLrequest(url, storedUser());
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
    if (isLogged) {
      await pingServer();
      renderStatsList(storedUser());
    } else {
      renderStatsList();
    }
    urlPresentor.appendChild(resultedLink);
  };

  // STATS LIST: A FUNCTION BUILT OUT OF FUNCTIONS
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
            href: `${url.short}`,
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
            class: "stored-id",
          },
          `${url.urlCode}`
        )
      );
      linkIDList.appendChild(id_list_item);
    });
  };
  const renderAllCounts = async (allUrls, userObj) => {
    if (!allUrls || userObj) {
      allUrls = [];
      userObj.urls.forEach((element) => {
        allUrls.push(element.long);
      });
    }
    const allCounts = await getClickStatistics();
    clearStatsList("SPAN");
    const allIDs = document.querySelectorAll(".stored-id");
    const countsArray = [];
    allIDs.forEach((shortID) => {
      let count = 0;
      for (let j = 0; j < allCounts.length; j++) {
        if (shortID.textContent === allCounts[j]) {
          count++;
        }
      }
      countsArray.push({ id: shortID.textContent, count });
    });

    let counter = 0;

    allUrls.forEach((url) => {
      id = url.urlCode;
      count = createElements(
        "span",
        {
          class: "count-list-items",
        },
        createElements(
          "p",
          {
            class: "redirect-count",
          },
          `${countsArray[counter].count}`
        )
      );
      linkRedirectCountList.appendChild(count);
      counter++;
    });
  };

  // CLEAR STATS LIST
  const clearStatsList = async (...elements) => {
    let nodeLists = [];
    elements.forEach((element) => {
      nodeList = allStats.getElementsByTagName(`${element}`);
      nodeLists.push(nodeList);
    });
    nodeLists.forEach((nodeList) => {
      while (nodeList[0]) nodeList[0].parentNode.removeChild(nodeList[0]);
    });
  };
  // RENDER ACTUAL "STATS" LIST
  const renderStatsList = async (user) => {
    if (user) {
      await pingLocation(user);
    }
    clearStatsList("LI", "DETAILS");
    let allUrlObjects;
    if (user) {
      allUrlObjects = user.urls;
    } else {
      allUrlObjects = await getAllUrlObjects();
    }
    renderAllShortLinks(allUrlObjects);
    renderAllLongLinks(allUrlObjects);
    renderAllLinkIDs(allUrlObjects);
    renderAllCounts(allUrlObjects);
  };

  // SIGN IN TO SERVICE
  const logUserInFromClient = async (username, password) => {
    const passwordInput = document.querySelector("#password-input").value;
    const usernameInput = document.querySelector("#username-input").value;
    if (username && password) {
      user = await logIntoService(username, password);
    } else {
      user = await logIntoService(usernameInput, passwordInput);
    }
    await pingLocation(user);
    if (!user.urls) {
      return;
    }
    renderStatsList(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // SIGN OUT OF SERVICE
  //////////////////////////////// EVENT LISTENERS //////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //SHORTEN A LINK
  inputButton.addEventListener("click", () => {
    const existingUrl = document.querySelector("#shortened-url");
    const urlPresentorPlaceholder = document.querySelector(
      "#presentor-placeholder"
    );
    if (localStorage.getItem("user")) {
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
    logUserInFromClient(usernameInput, passwordInput);
    localStorage.setItem("user", JSON.stringify(user));
  });
  //LOG IN TO SERVICE
  logInButton.addEventListener("click", () => {
    logUserInFromClient();
  });

  const linkUl = document.querySelector("#links");
  linkUl.addEventListener("click", async (e) => {
    if (e.target.tagName !== "A") {
      return;
    }
    await renderAllCounts(null, storedUser());
  });
  urlPresentor.addEventListener("click", async (e) => {
    if (e.target.tagName !== "A") {
      return;
    }
    await renderAllCounts(null, storedUser());
  });

  renderStatsList(storedUser());
});
