'use strict';
function Parallel() {
}

Parallel.init = function(firebaseUrl) {
  this._session = null;
  try {
    this._session = new Firebase(firebaseUrl);
  } catch(e) {
  }
	return this._session !== null;
};

Parallel.register = function(element, evt, fnc) {
  // W3C model
  if (element.addEventListener) {
    element.addEventListener(evt, fnc, true);
    return true;
  }
  // Microsoft model
  else if (element.attachEvent) {
    return element.attachEvent('on' + evt, fnc);
  }
  return false;
};

Parallel.trigger = function(element, evt) {

  if(typeof(element) === 'string') {
    element = document.querySelector(element);
  }

  var eventObj;
  if (document.createEvent) {
    eventObj = document.createEvent('HTMLEvents');
    eventObj.initEvent(evt, true, true);
  } else {
    eventObj = document.createEventObject();
    eventObj.eventType = evt;
  }
  eventObj.isParallelJs = true;

  if (document.createEvent) {
    element.dispatchEvent(eventObj);
  } else {
    element.fireEvent('on' + eventObj.eventType, eventObj);
  }
};

Parallel.selector = function(element) {
  if (!element.tagName) {
    return null;
  }
    
  function baseSelector(element) {
    if (!element.tagName) {
      return '';
    }
    var selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += '#'+element.id;
    }
    for (var i = 0; i < element.classList.length; i++) {
      selector += '.'+element.classList[i];
    }
    return selector;
  }
    
  var selector = element.parentNode ? baseSelector(element.parentNode) + ' ' : '';
  return selector + baseSelector(element);
};

Parallel.chain = function(fnc) {
  Parallel.register(document, 'click', function(evt, params){
    if (evt.isParallelJs) {
      console.log('Parallel Event');
      return;
    }
    fnc(evt, params);
  });
};
