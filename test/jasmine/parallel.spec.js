describe("Initialisation", function() {

  beforeEach(function(){
   this.addMatchers({
     toBeA: function(expected) { return this.env.equals_(this.actual, jasmine.any(expected)); }
   });
 });

  it("requires a Firebase reference", function() {
    expect(Parallel.init()).toBe(false);
    expect(Parallel.init(false)).toBe(false);
    expect(Parallel.init("")).toBe(false);
    expect(Parallel.init("invalid")).toBe(false);
    expect(Parallel.init("https://something.firebaseio-demo.com/")).toBe(true);
    expect(Parallel.init("https://something.firebaseio.com/more/")).toBe(true);
  });
});

describe("DOM Manipulation", function() {
  it("can create a selector for a specific node", function() {
    
    var parent = document.createElement("DIV");
    parent.classList.add("parent");
    parent.classList.add("node");
    parent.id = "parent-id";
    var child = document.createElement("SPAN");
    child.className = "child node";
    child.id = "child-id";
    parent.appendChild(child);
    document.body.appendChild(parent);
    
    var docChild = document.querySelector("span.child");
    
    expect(docChild).not.toBeNull();
    
    expect(Parallel.selector(child)).toBe("div#parent-id.parent.node span#child-id.child.node");
  });
});

describe("Parallel Event Management", function() {

  var Handler = function(){},
      element = null;

  beforeEach(function(){
    document.body.innerHTML = '';
    Handler.handle = function(arg){}
    spyOn(Handler, "handle");
    Handler.onclick = function(arg){};
    spyOn(Handler, "onclick");
    element = document.createElement("DIV");
    element.id = 'unique';
    element.addEventListener("click", Handler.onclick);
    document.body.appendChild(element);
  });
  
  it("Can handle an Event", function() {
    Parallel.chain(Handler.handle);
    expect(Handler.handle).not.toHaveBeenCalled();

    var eventObj = document.createEvent('HTMLEvents');
    eventObj.initEvent('click', true, true);
    element.dispatchEvent(eventObj);
    expect(Handler.handle).toHaveBeenCalled();
  });

  it("can trigger events on an element", function() {
    expect(Handler.onclick).not.toHaveBeenCalled();
    Parallel.trigger(element,"click");
    expect(Handler.onclick).toHaveBeenCalled();
  });

  it("can trigger events based on a selector", function() {
    expect(Handler.onclick).not.toHaveBeenCalled();
    Parallel.trigger('div#unique',"click");
    expect(Handler.onclick).toHaveBeenCalled();
  });

  it("Events triggered bu Parallel are not processed by it", function() {
    expect(Handler.onclick).not.toHaveBeenCalled();
    Parallel.chain(Handler.handle);
    Parallel.trigger('div#unique','click');
    expect(Handler.onclick.calls.length).toBe(1);
    expect(Handler.handle.calls.length).toBe(0);
  });
});
