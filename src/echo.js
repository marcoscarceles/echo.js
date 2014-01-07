'use strict';
function Echo() {
}

Echo._randomString = function(length) {
  var str = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for( var i=0; i < length; i++ ) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

Echo.init = function(firebaseUrl) {
  this._id = Echo._randomString(8);
  this._session = null;
  try {
    this._session = new Firebase(firebaseUrl);
  } catch(e) {
  }
	return this._session !== null;
};

Echo.register = function(element, evt, fnc) {
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

Echo.trigger = function(element, evt) {

  console.log('Triggering ', element, evt);

  if(typeof(element) === 'string') {
    element = Echo.querySelector(element);
  }
  //console.log("ELEMENT IS ", element);

  if (element) {
    var eventObj;
    if (document.createEvent) {
      eventObj = document.createEvent('HTMLEvents');
      eventObj.initEvent(evt, true, true);
    } else {
      eventObj = document.createEventObject();
      eventObj.eventType = evt;
    }
    eventObj.isEchoJs = true;

    if (document.createEvent) {
      element.dispatchEvent(eventObj);
    } else {
      element.fireEvent('on' + eventObj.eventType, eventObj);
    }
  }
};

Echo.selector = function(element) {
  if (!element.tagName) {
    return null;
  }
    
  function baseSelector(element) {
    if (!element.tagName) {
      return '';
    }
    var tagSelector = element.tagName.toLowerCase();
    if (element.id) {
      tagSelector += '#'+element.id;
    }
    for (var i = 0; i < element.classList.length; i++) {
      tagSelector += '.'+element.classList[i];
    }
    return tagSelector;
  }

  var pathSelector = baseSelector(element);
  
  while(document.querySelectorAll(pathSelector).length > 1 && element.parentNode.tagName) {
    pathSelector = baseSelector(element.parentNode) + '>' + pathSelector;
    element = element.parentNode;
  }
  
  return pathSelector;
};

Echo.buildSelector = function(element) {
  var selector = Echo.selector(element);
  var elements = document.querySelectorAll(selector);
  if (elements.length > 1) {

    for (var i = 0; i < elements.length; i ++ ) {
      elements[i].setAttribute('data-echojs-index',i);
      if (element === elements[i]) {
        selector += '[data-echojs-index="'+i+'"]';
      }
    }
    // var nodes = selector.split('>');
    // var partial = 'html>body';
    // for (var i = 2; i < nodes.length; i ++ ) {
    //     partial += '>' nodes[i];
    //     if (document.querySelectorAll(selector).length > 1) {}
    // }
  }
  return selector;
};

Echo.querySelector = function(selector) {

  var index = selector.lastIndexOf('[data-echojs');
  var querySelector = index > -1 ? selector.substring(0, index) : selector;
  var element = null;

  var elements = document.querySelectorAll(querySelector);
  if (elements.length > 1) {
    for (var i = 0; i < elements.length; i ++ ) {
      elements[i].setAttribute('data-echojs-index',i);
    }
    element = document.querySelector(selector);
  } else {
    element = elements[0];
  }
  return element;
};

Echo.chain = function(fnc) {

  var mouseEvents = ['mousedown','mouseup','click','mouseover','mouseout'];

  function onExternalEvent(evt, params){
    if (evt.isEchoJs) {
      return true;
    } else {
      console.log('Detected ',evt.type, Echo.buildSelector(evt.target));
      fnc(evt, params);
    }
  }

  for (var i = 0; i < mouseEvents.length; i++) {
    Echo.register(document, mouseEvents[i], onExternalEvent);
  }
};

Echo.chain(function(evt) {
  Echo._session.push({
    type: evt.type,
    target: Echo.buildSelector(evt.target),
    origin: Echo._id
  });
});

Echo.init('https://blah.firebaseio-demo.com/');

Echo._session.on('child_added', function(fEvt/*, fPrev*/) {
  var target = fEvt.child('target').val(),
      type = fEvt.child('type').val(),
      origin = fEvt.child('origin').val();
  if (origin !== Echo._id) {
    Echo.trigger(target, type);
  }
});
