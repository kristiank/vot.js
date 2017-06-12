"use strict";

/* Main module and only global */
/* @todo: add documentation and description */
/* one-global pattern from Zakas 2012:72 */
var vot = {
  /* function for adding namespaces inside the module */
  namespace: function(ns) {
    var parts = ns.split(".");
    var object = this;
    var i, len;
    
    for (i=0, len=parts.length; i < len; i++) {
      if (!object[parts[i]]) {
        object[parts[i]] = {};
      }
      object = object[parts[i]];
    }
    
    return object;
  }
};


/* Polyfill functionality that is expected from the environment */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

/* Event functions */
vot.namespace("events");
/* Zakas 2012:57 */
vot.events.addListener = function addListener(target, type, handler) {
  if (target.addEventListener) {
    target.addEventListener(type, handler, false);
  } else if (target.attachEvent) {
    target.attachEvent("on" + type, handler);
  } else {
    target["on" + type] = handler;
  }
};
/* All logic for handling onKeyUp events */
vot.events.handleOnKeyUp = function(event) {
  // Enter key
  if (event.keyCode == 13) {
    vot.search.runSearch();
  }
};


/* Cursor manipulations */
vot.namespace("cursor");
vot.cursor.setCursor = function setCursor(name) {
	document.getElementsByTagName("html")[0].style.cursor = name;
};


/* Data */
vot.namespace("data");
vot.data.placenames = {
  // Lääne-Vadja tšüläd
  "J":  { "name": { "vot": "Jõgõperä", "rus": "Краколье"}, "area": "läänevadja"},
  "Ja": { "name": { "vot": "Jarvikoištšülä", "rus": "Бабино"}, "area": "läänevadja"},
  "K":  { "name": { "vot": "Kattila", "rus": "Котлы"}, "area": "läänevadja"},
  "Ke": { "name": { "vot": "Kerstova", "rus": "Керстово"}, "area": "läänevadja"},
  "Ki": { "name": { "vot": "Kikeritsa", "rus": "Кикерицы"}, "area": "läänevadja"},
  "Kõ": { "name": { "vot": "Kõrvõttula", "rus": "Корветино"}, "area": "läänevadja"},
  "L":  { "name": { "vot": "Lempola", "rus": "Раннолово"}, "area": "läänevadja"},
  "Li": { "name": { "vot": "Liivtšülä", "rus": "Пески"}, "area": "läänevadja"},
  "Lu": { "name": { "vot": "Luuditsa", "rus": "Лужицы"}, "area": "läänevadja"},
  "M":  { "name": { "vot": "Mati", "rus": "Маттия"}, "area": "läänevadja"},
  "Mu": { "name": { "vot": "Muukkova", "rus": "Мукково"}, "area": "läänevadja"},
  "P":  { "name": { "vot": "Pummala", "rus": "Пумалицы"}, "area": "läänevadja"},
  "Pi": { "name": { "vot": "Pihlaala", "rus": "Пиллово"}, "area": "läänevadja"},
  "Po": { "name": { "vot": "Pontizõõ", "rus": "Понделово"}, "area": "läänevadja"},
  "R":  { "name": { "vot": "Rudja", "rus": "Рудилово"}, "area": "läänevadja"},
  "Ra": { "name": { "vot": "Rajo", "rus": "Межники"}, "area": "läänevadja"},
  "Sa": { "name": { "vot": "Savvokkala", "rus": "Савикино"}, "area": "läänevadja"},
  "U":  { "name": { "vot": "Undova", "rus": "Ундово"}, "area": "läänevadja"},
  "V":  { "name": { "vot": "Velikkä", "rus": "Великино"}, "area": "läänevadja"},
  // Ida-Vadja tšüläd
  "I":  { "name": { "vot": "Itšäpäivä", "rus": "Иципино"}, "area": "idavadja"},
  "Ii": { "name": { "vot": "Iivanaisi", "rus": "Ивановское"}, "area": "idavadja"},
  "Kl": { "name": { "vot": "Kliimettina", "rus": "Климотино"}, "area": "idavadja"},
  "Ko": { "name": { "vot": "Kozlova", "rus": "Козлово"}, "area": "idavadja"},
  "Ma": { "name": { "vot": "Mahu", "rus": "Подмошье"}, "area": "idavadja"},
  "Ku": { "name": { "vot": "Kukkuzi", "rus": "Куровицы"}, "area": "idavadja"}
};
vot.data.getFullPlacename = function(abbr) {
  var item = vot.data.placenames[abbr];
  if (item == undefined) {
    //throw new Error("in vot.data.getFullPlacename(abbr): " + abbr + " does not exist!");
    console.log("in vot.data.getFullPlacename(abbr): " + abbr + " does not exist!");
    return {"name": {"vot": "", "rus": ""}, "area": ""};
  }
  else {
    return item;
  }
};
vot.data.monthnames = ["janvari","fevrali","martti","apreli","maija",
    "juni","juli","augusti","sentäbri","oktäbri","nojaabri","dekabri"];


/* UI functions */
vot.namespace("ui");
/* puts margin notes containing the meaning number for easier navigation */
vot.ui.putMeaningNumbersAside = function putMeaningNumbersAside() {
  /* get the meaning numbers */
  var tnrs = document.getElementsByTagName("vot:tnr");
  /* make a copy of each and assign it a class "aside" */
  for (var i = 0, len = tnrs.length; i < len; i++) {
    var tnr = tnrs[i];
    var tnrAside = document.createElement("tnrAside"); // no NS
    tnrAside.textContent = tnr.textContent || tnr.innerText;;
    tnrAside.className += " aside";
    /* append the copy inside the original */
    tnr.appendChild(tnrAside);
  }
};
/* puts tooltips for placanames containing the full names in votic and russian */
vot.ui.putPlacenameDescriptionTitles = function() {
  var placenameElements = document.getElementsByTagName("vot:koht");    
  for (var i = 0, len = placenameElements.length; i < len; i++) {
    var placenameElement = placenameElements[i];
    var placenameAbbr = placenameElement.textContent || placenameElement.innerText;
    // trim and remove special characters that might be in the placename abbreviation
    //placenameAbbr = placenameAbbr.trim();
    placenameAbbr = placenameAbbr.replace(/\W+/g, "");
    var placenameData = vot.data.getFullPlacename(placenameAbbr);
    var titleString = placenameData["name"]["vot"] + " " + placenameData["name"]["rus"];
    placenameElement.title = titleString;
  }
};


/* Search functions */
vot.namespace("search");
vot.search.runSearch = function runSearch() {
	/* get search parameters */
	var searchParams = new Array();
	var formElements = document.getElementsByTagName("input");
  var param = {};
  
	for (var i = 0; i < formElements.length; i++) {
		param = {};
		param.value = formElements[i].value;
		param.name = formElements[i].name;
		if (param.value != "") {
			searchParams.push(param);
		}
	}
	
	/* if no parameters are entered, then clear the screen, else run a search */
  if (searchParams.length == 0) {
    document.getElementById("search-results").innerHTML = "";
    vot.cursor.setCursor("default");
    return;
  } else {
    vot.cursor.setCursor("progress");
    
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        /* display responseText as search-results */
        document.getElementById("search-results").innerHTML = xmlhttp.responseText;
        vot.cursor.setCursor("default");
        vot.ui.putMeaningNumbersAside();
        vot.ui.putPlacenameDescriptionTitles();
      } // @todo: add try searching again on failure
    };
    /* create the search url */
    var url = "combined-search?";
    for (i = 0; i < searchParams.length; i++) {
      if (i > 0) {
        url += "&"
      }
      param = searchParams[i];
      url += param.name + "=" + param.value;
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
};


/* Start-up when page is finished loading */
/* Flanagan 2011:322 */
// Register the function f to run when the document finishes loading.
// If the document has already loaded, run it asynchronously ASAP.
vot.namespace("onLoad");
vot.onLoad = function onLoad(f) {
  if (onLoad.loaded) {
    // If document is already loaded
    window.setTimeout(f, 0);
    // Queue f to be run as soon as possible
  }
  else if (window.addEventListener) {
    // Standard event registration method
    window.addEventListener("load", f, false);
  }
  else if (window.attachEvent) {
    // IE8 and earlier use this instead
    window.attachEvent("onload", f);
  }
};
// Start by setting a flag that indicates that the document is not loaded yet.
vot.onLoad.loaded = false;
// And register a function to set the flag when the document does load.
vot.onLoad(function() { onLoad.loaded = true; });
// add bindings for searching
vot.onLoad(
  function() {
    var formElements = document.getElementsByTagName("input");
    
    for (var i = 0; i < formElements.length; i++) {
      var formElement = formElements[i];
      
      vot.events.addListener(
        formElement, "keyup", vot.events.handleOnKeyUp
      );
    }
  }
);

