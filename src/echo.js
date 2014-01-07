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

  if (element === window) {
    return 'window';
  }

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
      console.log('Detected ',evt, Echo.buildSelector(evt.target));
      Echo._triggerScrolling = true;
      fnc(evt, params);
    }
  }

  //DOM Events
  for (var i = 0; i < mouseEvents.length; i++) {
    Echo.register(document, mouseEvents[i], onExternalEvent);
  }

  function onScrollWhenEnabled(evt, params) {
    if(Echo._triggerScrolling) {
      onExternalEvent(evt, params);
    }
  }

  //Window Events
  Echo.register(window, 'scroll', onExternalEvent);
};

Echo._getDocDimension = function(dimension) {
    var D = document;
    return Math.max(
        D.body['scroll'+dimension], D.documentElement['scroll'+dimension],
        D.body['offset'+dimension], D.documentElement['offset'+dimension],
        D.body['client'+dimension], D.documentElement['client'+dimension]
    );
};

Echo._getDocHeight = function() {
  return Echo._getDocDimension('Height');
};

Echo._getDocWidth = function() {
  return Echo._getDocDimension('Width');
};

Echo.init = function(firebaseUrl) {
  Echo._id = Echo._randomString(8);
  Echo._session = null;
  try {
    Echo._session = new Firebase(firebaseUrl);
    Echo.chain(function(evt) {
      Echo._session.push({
        type: evt.type,
        target: Echo.buildSelector(evt.target),
        origin: Echo._id,
        xPercentage: window.pageXOffset / Echo._getDocWidth(),
        yPercentage: window.pageYOffset / Echo._getDocHeight()
      });
    });


    Echo._session.on('child_added', function(fEvt/*, fPrev*/) {
      var target = fEvt.child('target').val(),
          type = fEvt.child('type').val(),
          origin = fEvt.child('origin').val();
      if (target === null && type === 'scroll') {
        console.log('Scrolling!');
        var pageXOffset = fEvt.child('xPercentage').val() * Echo._getDocWidth(),
            pageYOffset = fEvt.child('yPercentage').val() * Echo._getDocHeight();
        Echo._triggerScrolling = false;
        window.scrollTo(pageXOffset,pageYOffset);
      } else if (target && origin !== Echo._id) {
        Echo.trigger(target, type);
      };
    });
  } catch(e) {
    if (Echo._session != null) {
      Echo._session = null;
    }
  }
  return Echo._session !== null;
};

//Echo.init('https://blah.firebaseio-demo.com/');