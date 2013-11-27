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
  
  it("can trigger events on an element", function() {
    var Handler = function(){};
    Handler.onclick = function(arg){};
    spyOn(Handler, "onclick");
    var element = document.createElement("DIV");
    element.addEventListener("click", Handler.onclick);
    document.body.appendChild(element);
    
    expect(Handler.onclick).not.toHaveBeenCalled();
    Parallel.trigger(element,"click");
    expect(Handler.onclick).toHaveBeenCalled();
  });

  it("can trigger events based on a selector", function() {
    expect(true).toBe(false);
  });

  it("Events triggered bu Parallel are not processed by it", function() {
    expect(true).toBe(false);
  });

});
