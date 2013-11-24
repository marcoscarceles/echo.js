describe("Initialisation", function() {

  beforeEach(function(){
   this.addMatchers({
     toBeA: function(expected) { return this.env.equals_(this.actual, jasmine.any(expected)); }
   });
 });

  it("requires a Firebase reference", function() {
    expect(Parallel.init()).toBe(null);
    expect(Parallel.init(null)).toBe(null);
    expect(Parallel.init("")).toBe(null);
    expect(Parallel.init("firebase")).toEqual(jasmine.any(Parallel));
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
  
  it(" can trigger events", function() {
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
});
