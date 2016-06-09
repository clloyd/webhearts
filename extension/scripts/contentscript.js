(function() {
  var socket = io.connect('http://localhost:9000');
  var uniqueId = undefined;

  var colours = ["red", "blue", "green", "purple", "orange"];

  function getXPath( element ) {
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
      var id = $(element.parentNode).children(element.tagName).index(element) + 1;
      (id = '[' + id + ']');
      xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
  }

  function createHeartElement() {
    var heartSpan = document.createElement("span");
    heartSpan.classList.add("heart");
    heartSpan.classList.add("red");
    heartSpan.classList.add("movement" + Math.floor(Math.random() * 6));
    // heartSpan.classList.add(colours[Math.floor(Math.random() * (colours.length + 1))]);
    setTimeout(function() {
      heartSpan.remove();
    }, 2000)

    return heartSpan
  }

  function showHeart(xPath) {
    var el = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

    if (getComputedStyle(el)["position"] === "static") {
      el.classList.add("enable-hearts");
    }

    if (!el) {
       return;
    }

    var element = createHeartElement();
    el.appendChild(element);

    element.classList.add("is-animated")
  }

  socket.on('ID_REQ', function(data) {
    uniqueId = data.id;

    console.log("Connected! Receved ID Request. Client ID: " + uniqueId);
    socket.emit('ID_RES', { url: window.location.href });

    socket.on('TRIGGER_HEART', function(data) {
      console.log('TRIGGER_HEART', data)
      if (data.url === window.location.href) {
        showHeart(data.xpath);
      }
    })

    document.addEventListener('click', function(e) {

      var eventDetails = {
        xpath: getXPath(e.target),
        url: window.location.href,
        triggerId: uniqueId
      }

      if (eventDetails.xpath.indexOf("/html[1]/body[1]/") !== -1) {
        console.log("Send Click", eventDetails)
        socket.emit('CLICK', eventDetails);
        showHeart(eventDetails.xpath)
      }
    })
  });
})();
