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

describe("Registering Events", function() {

  it()

});