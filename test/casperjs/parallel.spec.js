casper.test.begin('Parallel', 2, function suite(test) {

  casper.start("http://localhost:9000/parallel-init.html", function() {
    test.assertTitle("First CasperJS Test", "Page loads");
  });

  casper.then(function() {
    var typeOfParallel = casper.evaluate(function() {
      return typeof(Parallel);
    });
    test.assertEquals(typeOfParallel, "function", "Parallel is loaded");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin('Parallel responds to user events', 2, function suite(test) {

  casper.start("http://localhost:9000/parallel-event.html", function() {
    test.assertTitle("Event Register Test");
    test.assertTextExists("No event recognised", "Page loads");
  });

  casper.then(function() {
    this.click('a#link');
  });
    
  casper.then(function() {
    test.assertSelectorHasText("#event-type", "click", "Recognised Event Type");
    test.assertSelectorHasText("#event-target", "a#link", "Recognised Event Taget");
  });

  casper.run(function() {
    test.done();
  });
});
