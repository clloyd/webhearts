var socket = undefined;
var uniqueId = undefined;
var iconType = undefined;

var colours = ["red", "blue", "green", "purple", "orange"];

function getXPath(element) {
  var xpath = '';
  for (; element && element.nodeType == 1; element = element.parentNode) {
    var id = $(element.parentNode).children(element.tagName).index(element) + 1;
    (id = '[' + id + ']');
    xpath = '/' + element.tagName.toLowerCase() + id + xpath;
  }
  return xpath;
}

function createHeartElement() {
  var heartSpan = document.createElement("span");
  heartSpan.classList.add("ext-emotion");
  heartSpan.classList.add("movement" + Math.floor(Math.random() * 6));
  setTimeout(function () {
    heartSpan.remove();
  }, 2000);

  return heartSpan
}

function showHeart(xPath, iconType) {
  var el = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

  if (getComputedStyle(el)["position"] === "static") {
    el.classList.add("enable-hearts");
  }

  if (!el) {
    return;
  }

  var element = createHeartElement();
  element.classList.add(iconType);
  el.appendChild(element);

  element.classList.add("is-animated")
}

function init() {
  if (uniqueId) {
    return;
  }

  if (!socket) {
    socket = io.connect('https://webhearts.herokuapp.com');
  }

  socket.on('ID_REQ', function (data) {
    uniqueId = data.id;
    socket.emit('ID_RES', { url: window.location.href });

    socket.on('TRIGGER_HEART', function (data) {

      console.log("Trigger", data)

      if (!iconType) {
        return;
      }

      if (data.url === window.location.href) {
        showHeart(data.xpath, data.iconType || "heart");
      }
    });

    document.addEventListener('click', function (e) {

      if (!iconType) {
        return;
      }


      var eventDetails = {
        xpath: getXPath(e.target),
        url: window.location.href,
        triggerId: uniqueId,
        iconType: iconType
      };

      console.log("SEND CLICK", eventDetails)

      if (eventDetails.xpath.indexOf("/html[1]/body[1]/") !== -1) {
        socket.emit('CLICK', eventDetails);
        showHeart(eventDetails.xpath, iconType)
      }
    })
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.iconType !== undefined) {
    iconType = request.iconType;
  }

  console.log("Recieved message", request)

  if (iconType && (!socket || !uniqueId)) {
    init();
  }
});

chrome.runtime.sendMessage({ triggerActiveRefresh: true });

