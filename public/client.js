window.addEventListener("DOMContentLoaded", () => {
  // CONSTS

  //BUTTONS
  const inputButton = document.querySelector("#input-button");
  const registerButton = document.querySelector("#register-button");
  const logInButton = document.querySelector("#login-button");
  const logOutButton = document.querySelector("#logout-button");
  // STAT LIST CONSTS
  const shortLinkList = document.querySelector("#links");
  const longLinkList = document.querySelector("#originals");
  const linkIDList = document.querySelector("#shortcut-id");
  const linkRedirectCountList = document.querySelector("#redirect-count");
  const creationDateList = document.querySelector("#creation-date");
  const allStats = document.querySelector("#stats-grid");
  const linkUl = document.querySelector("#links");
  // SHORT URL RESULT (ABOVE STAT TABLE) CONSTS
  const urlPresentor = document.querySelector("#url-presentor");
  // WELCOME TAG
  const welcomeTag = document.querySelector("#greet-user");
  // LOCALSTORAGE AND USER AUTH FUNCS AND VARIABLES
  let user;

  /////////// FUNCTIONS ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // FUNCTION getStoredUserObject() - THIS REMOVES THE USER OBJECT FROM LOCALSTORAGE IF IT'S UNDEFINED, ELSE IT FETCHES AND RETURNS IT
  const getStoredUserObject = () => {
    if (!localStorage.getItem("user")) {
      localStorage.removeItem("user");
      return false;
    } else {
      return JSON.parse(localStorage.getItem("user"));
    }
  };

  // THIS SENDS A PING TO THE DATABASE AND TELLS IT WHICH USER IS CURRENTLY LOGGED IN. IT ALSO RECEIVES VALUABLE INFORMATION TO UPDATE THE USER INSTANTLY.
  const pingServer = async () => {
    if (getStoredUserObject()) {
      const updatedUser = await pingLocation(getStoredUserObject());
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };
  setInterval(async () => {
    pingServer();
  }, 2000);

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

  // THIS SENDS A REQUEST TO SHORTEN A URL, AND THEN GETS THAT SHORTENED URL
  const getShortURL = async (isLogged) => {
    const urlInput = document.querySelector("#url-input");
    const url = urlInput.value;
    let shortenedUrl;
    if (isLogged) {
      shortenedUrl = await shortenURLrequest(url, getStoredUserObject());
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
      renderStatsList(getStoredUserObject());
    } else {
      renderStatsList();
    }
    urlPresentor.appendChild(resultedLink);
  };

  // RENDER STATS LIST: A FUNCTION BUILT OUT OF FUNCTIONS

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
      // checks if received a user object or only urls
      allUrls = [];
      userObj.urls.forEach((element) => {
        // take the urls from user object and turn them into the regular ol' allUrls array.
        allUrls.push(element.long);
      });
    }
    const allCounts = await getClickStatistics(); // getClickStatistics() will fetch the statistics.json file, receieving an array with shortened IDs
    clearStatsList("SPAN"); // clear the "span" elements - as in, all the "redirect count" from the stats table.
    const allIDs = document.querySelectorAll(".stored-id");
    const countsArray = [];
    allIDs.forEach((shortID) => {
      // for each ID, check how many clicks it got and assign the info as an object
      let count = 0;
      allCounts.forEach((counter) => {
        if (shortID.textContent === counter) {
          count++;
        }
      });
      countsArray.push({ id: shortID.textContent, count });
    });

    let counter = 0;
    // do what we always do with data: PUT IT IN A FKIN TABLE
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
  const renderAllDates = async (allUrls) => {
    allUrls.forEach((url) => {
      date_list_item = createElements(
        "li",
        {
          class: "date-list-items",
        },
        createElements(
          "p",
          {
            class: "stored-date",
          },
          `${url.creationDate}`
        )
      );
      creationDateList.appendChild(date_list_item);
    });
  };

  // THIS FUNCTION CLEARS THE STATS LIST
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

  // RENDER ACTUAL STATS LIST
  const renderStatsList = async (user) => {
    if (user) {
      // pingLocation(user) - lets the server know who is the user that is currently logged in, to updated it accordingly.
      await pingLocation(user);
    }

    clearStatsList("LI", "DETAILS"); // clear the stats list to avoid double-rendering

    let allUrlObjects;
    if (user) {
      allUrlObjects = user.urls;
    } else {
      allUrlObjects = await getAllUrlObjects(); // if no user is currently signed in, this will get a list of all the default bin's URL objects
    }

    renderAllShortLinks(allUrlObjects);
    renderAllLongLinks(allUrlObjects);
    renderAllLinkIDs(allUrlObjects);
    renderAllCounts(allUrlObjects);
    renderAllDates(allUrlObjects);
  };

  // SIGN IN TO SERVICE
  const logUserInFromClient = async (username, password) => {
    const passwordInput = document.querySelector("#password-input").value;
    const usernameInput = document.querySelector("#username-input").value;
    welcomeTag.style.display = "flex";
    if (username && password) {
      user = await logIntoService(username, password); // sends a request to the main server to authenticate the user
    } else {
      /// This is about whether or not the user is currently "remembered"
      user = await logIntoService(usernameInput, passwordInput);
    }
    await pingLocation(user); // let DBserver know this is indeed the user that needs to be updated.
    if (!user.urls) {
      return;
    }
    localStorage.setItem("user", JSON.stringify(user)); // remember user
    renderStatsList(user); // render relevant stats for user
    await greetSignedInUser(); // greet user
  };

  // SIGN OUT OF SERVICE
  const signUserOutFromClient = async () => {
    localStorage.removeItem("user");
    renderStatsList();
    greetSignedInUser("loggingOut"); // remove user greeting
  };

  // GREET THE USER THAT'S CURRENTLY LOGGED IN
  const greetSignedInUser = async (loggingOut) => {
    const alreadyWelcomed = document.querySelector(
      "#greet-user > h1.welcome-h1"
    );
    if (loggingOut) {
      // if signing out, remove welcome tag completely
      welcomeTag.style.display = "none";
    } else if (alreadyWelcomed) {
      // remove the old welcome tag first
      alreadyWelcomed.remove();
    }
    if (getStoredUserObject()) {
      // add a new welcome tag if user exists
      const greetUser = createElements(
        // render user's name
        "h1",
        { class: "welcome-h1" },
        `${getStoredUserObject().username}`
      );
      welcomeTag.appendChild(greetUser);
    }
  };

  //////////////////////////////// EVENT LISTENERS //////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // SHORTEN A LINK
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

  // REGISTER TO SERVICE
  registerButton.addEventListener("click", async () => {
    const passwordInput = document.querySelector("#password-input").value;
    const usernameInput = document.querySelector("#username-input").value;
    await registerToService(usernameInput, passwordInput);
    logUserInFromClient(usernameInput, passwordInput);
    localStorage.setItem("user", JSON.stringify(user));
  });
  // LOG IN TO SERVICE
  logInButton.addEventListener("click", async () => {
    await logUserInFromClient();
  });

  // LOG OUT OF SERVICE
  logOutButton.addEventListener("click", async () => {
    signUserOutFromClient();
  });

  // UPDATE REDIRECT COUNT COLUMN OF STAT LIST WHENEVER SOMEONE CLICKS A LINK
  linkUl.addEventListener("mouseup", async (e) => {
    if (e.target.tagName !== "A") {
      return;
    }
    await pingServer(); // fetch info from server and update localstorage.
    await renderAllCounts(null, getStoredUserObject()); // render count column
  });

  // UPDATE REDIRECT COUNT COLUMN OF STAT LIST WHENEVER SOMEONE CLICKS THE PRESENTED LINK (BIG ONE ABOVE STAT LIST)
  urlPresentor.addEventListener("click", async (e) => {
    renderAllCounts(null, getStoredUserObject());
  });

  ///////////////////////////////////////////////// AUTOMATIC RENDERINGS WHEN PAGE LOADS ////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // STAT LIST
  renderStatsList(getStoredUserObject()); // renders with the stored user if there is one. else, renders default.

  // WELCOME TAG
  if (getStoredUserObject()) {
    greetSignedInUser();
  } else {
    welcomeTag.style.display = "none";
  }
});
