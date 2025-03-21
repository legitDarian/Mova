function MovaAPI(config) {
  if (!config) return "no config object"

  let context;
  if (!config.context || config.context === null) {
      if (document.getElementById("html5Iframe")) {
          context = document.getElementById("html5Iframe").contentWindow
      } else {
          throw new Error("config.context invalid")
      }
  } else {
      context = config.context;
  }

  let subject;
  try {
      subject = context.src.split("/")[4];
  } catch (error) {
      try {
        subject = html5Iframe.src.split("/")[4];
      } catch {}
  }

  const webpack = context[Object.keys(context).find(key => key.includes("webpack"))];
  const require = webpack.push([[Symbol()], {}, MovaOntop => MovaOntop]); // only works for a specific version of webpack

  // cache hook
  const sym = Symbol();
  context.Object.defineProperty(context.Object.prototype, sym, {
      get() {
          require.c = this 
          return {
              exports: {mova:"ontop"}
          };
      },
      set() {},
      configurable: true,
  });
  require(sym)
  delete context.Object.prototype[sym];

  // start return funcs

  function scan(...args) {
      let offset = 0
      let root = null
      let keys = args
      if (args.length > 0 && typeof args[0] === "object" && args[0] !== null) {
        root = args[0]
        keys = args.slice(1)
      }
      if (keys.length > 0 && typeof keys[keys.length - 1] === "number") {
        offset = keys[keys.length - 1]
        keys = keys.slice(0, keys.length - 1)
      }
      let queue = []
      if (root) {
        queue.push({ value: root, ancestors: [] })
      } else {
        if (!require || !require.c) {
          console.warn("Webpack Cache is not available")
          return null
        }
        Object.values(require.c).forEach(module => {
          queue.push({ value: module.exports, ancestors: [] })
        })
      }
      let iterations = 0
      let maxiterations = 10000
      while (queue.length > 0) {
        iterations++
        if (iterations > maxiterations) {
          console.warn("Max iterations reached")
          return null
        }
        const item = queue.shift()
        const obj = item.value
        if (typeof obj === "object" && obj !== null) {
          const allkeyspresent = keys.every(key => Object.prototype.hasOwnProperty.call(obj, key))
          if (allkeyspresent) {
            if (offset === 0) {
              return obj
            } else if (item.ancestors.length >= offset) {
              return item.ancestors[item.ancestors.length - offset]
            }
          }
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const child = obj[key]
              if (typeof child === "object" && child !== null) {
                queue.push({ value: child, ancestors: item.ancestors.concat(obj) })
              }
            }
          }
        }
      }
      console.warn("Not found")
      return null
    }

    // return all the important stuff, like the connector, webApiUtil, lessonApi, and token
    function getHook() {
      let returnObj = {};

      // try catch like eevrything so nothing crashes LOL
      try {
      returnObj.connector = scan("complete", "resume", "pause", "start", "close", 1)
      returnObj.connector.stateStore = scan(returnObj.connector, "delete", "fetch", "save")
      } catch {}

      try {
      returnObj.useModuleMapping = scan("useModuleMapping").useModuleMapping
      returnObj.webApiUtil = scan("webApiUtil").webApiUtil
      } catch {}
      
      try {
      returnObj.lessonApi = Object.values(context.document.getElementById("lesson"))[0].memoizedProps.children[0]._owner.stateNode._screenContainerRef._screenControllerViewRef.component.api
      } catch {

      try {
        returnObj.lessonApi = scan("screen", "navigation", "lesson")
      } catch {}
      }

      // funky way of grabbing the token
      try {
        Object.values(require.m).forEach((module, index) => {
          let decodedFn = Function.prototype.toString.apply(module).replace(/\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/g, match => {
              const hexCode = match.slice(2);
              return String.fromCharCode(parseInt(hexCode, 16));
          });

          if (decodedFn.includes("secret01")) {
              returnObj.token = Object.values(require(Object.keys(require.m)[index]))[0];
          }
      });
      } catch {}

      return returnObj;
    }

  return {
      subject,
      config,
      context,
      webpack,
      require,
      scan,
      getHook
  };
}

const iNav = {
    getTOT: async () => {
        const elaReq = await fetch(atob("'aHR0cHM6Ly9sb2dpbi5pLXJlYWR5LmNvbS9hY3Rpdml0eS1jb21wb25lbnQvc3R1ZGVudC90aW1lLW9uLXRhc2svZWxh'"), {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "referrer": atob('aHR0cHM6Ly9sb2dpbi5pLXJlYWR5LmNvbS9zdHVkZW50L2Rhc2hib2FyZC9ob21l'),
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        const mathReq = await fetch(atob('aHR0cHM6Ly9sb2dpbi5pLXJlYWR5LmNvbS9hY3Rpdml0eS1jb21wb25lbnQvc3R1ZGVudC90aW1lLW9uLXRhc2svbWF0aA=='), {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "referrer": atob('aHR0cHM6Ly9sb2dpbi5pLXJlYWR5LmNvbS9zdHVkZW50L2Rhc2hib2FyZC9ob21l'),
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        return {
            ela: await elaReq.text(),
            math: await mathReq.text(),
        };
    },

    ela: {
        dash: () => {
            document.getElementById("reading-button-button") && document.getElementById("reading-button-button").click()
            document.getElementById("Reading-button") && document.getElementById("Reading-button").click()
        },
        lesson: () => {
          document.getElementsByClassName("eqg73sh1 node_modules--cainc-cauliflower-src-components-card-___Card__clickable embu0a00 css-se9j0h-createComponent-ClickableCard-NarrowCard-ONACTIVEFOCUS-ONFOCUS-OUTLINESTYLE-OUTLINESTYLE_CARD node_modules--cainc-cauliflower-src-components-card-___Card__card bg-success")[0].click()
        },
    },

    math: {
        dash: () => {
            document.getElementById("math-button-button") && document.getElementById("math-button-button").click()
            document.getElementById("Math-button") && document.getElementById("Math-button").click()
        },
        lesson: () => {
          document.getElementsByClassName("eqg73sh1 node_modules--cainc-cauliflower-src-components-card-___Card__clickable embu0a00 css-se9j0h-createComponent-ClickableCard-NarrowCard-ONACTIVEFOCUS-ONFOCUS-OUTLINESTYLE-OUTLINESTYLE_CARD node_modules--cainc-cauliflower-src-components-card-___Card__card bg-success")[0].click()
        },
    },

    startLesson: () => {
        Object.values(document.getElementById("lesson-splash-continue-button-button"))[1].onClick()
    },
    closeReadingHook: () => {
        setInterval(() => {
            if (document.getElementById('closereading_lesson')) {
                document.getElementById('closereading_lesson').contentWindow.Math.random = () => {
                    return "Mova"
                }
            }
        }, 5);
    }
}

setInterval(() => {
    if (document.getElementById("StudentDashboard-g38")) {
        iNav.dashHook = Object.values(document.getElementById("StudentDashboard-g38"))[1].children[0]._owner.stateNode.props
        iNav.toggleCheats = iNav.dashHook.dispatchToggleCheatButtonsAction;
        iNav.goto = iNav.dashHook.navigationToPageByRelativeUrl
        iNav.student = iNav.dashHook.student
    }
}, 100)

const iModal = {
  constants: {
    container: "presentation",
    headerClass: "css-19hcsz9-Typography",
    descriptionClass: "css-1ql0wvf-Typography",
    errorRoute: "/student/error/modal",
    dashRoute: "/student/dashboard/home",
    buttonId: "continue-button-button",
    dashId : "StudentDashboard-g38",
    cardClass : "e1vvjwpf1-card-body",

    get dashHook() {
      return Object.values(document.getElementById(this.dashId))[1].children[0]._owner.stateNode;
    },
  },
  cachedGoto: null,
  closeModal: function () {
    iModal.goto(iModal.constants.dashRoute);
  },
  goto: function (route) {
    return this.cachedGoto(route);
  },
  showModal: function (config) {
    if (iModal.cachedGoto === null) {
      iModal.cachedGoto = iModal.constants.dashHook.props.navigationToPageByRelativeUrl;
    }

    function handleMutation(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.role === iModal.constants.container && document.getElementById(iModal.constants.dashId) === null) {
              let card = document.getElementsByClassName(iModal.constants.cardClass)[0];
              let header = document.getElementsByClassName(iModal.constants.headerClass)[0];
              let desc = document.getElementsByClassName(iModal.constants.descriptionClass)[0];
              let button = document.getElementById(iModal.constants.buttonId);

              if (config.width) {
                card.style.width = config.width
              }
              
              header[config.useInnerHTML ? 'innerHTML' : 'textContent'] = config.title;
              desc[config.useInnerHTML ? 'innerHTML' : 'textContent'] = config.description;

              if (config.callback) {
                button.onclick = config.callback;
              } else {
                button.onclick = iModal.closeModal
              }
              
              observer.disconnect();
            }
          });
        }
      }
    }

    const observer = new MutationObserver(handleMutation);
    observer.observe(document, { childList: true, subtree: true });
    iModal.goto(iModal.constants.errorRoute);
  },
};

/*
example iModal usage:

iModal.showModal({
  "useInnerHTML": true,
  "title" : "say gex",
  "description" : "gay sex!!!1!11!",
  "width" : "610px",
  "callback" : iModal.closeModal,
});
*/

if (typeof exports !== 'undefined') {
  module.exports = { MovaAPI, iNav, iModal };
} else {
  window.MovaAPI = MovaAPI;
  window.iNav = iNav;
  window.iModal = iModal;
}