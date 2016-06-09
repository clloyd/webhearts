var selectors = document.querySelectorAll('[data-select-icon]')

for (var index = 0; index < selectors.length; index++) {
    var el = selectors[index];
    el.addEventListener("click", setActiveType)    
}

function setActiveType(e) {
    const newIcon = e.target.getAttribute("data-select-icon");
    console.log("NEWICON" + newIcon)
    chrome.runtime.sendMessage({newActiveIcon: newIcon})
}