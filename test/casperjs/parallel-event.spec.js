'use strict';
casper.test.begin('Parallel event handling', function suite(test) {

  casper.start("http://localhost:9000/parallel-event.html", function() {
    test.assertTitle("Event Register Test");
    test.assertSelectorHasText("#original-effect", "Pristine");
    test.assertTextExists("No event recognised", "Page loads");
  });

  casper.then(function() {
    this.click('a#link');
  });
    
  casper.then(function() {
    test.assertSelectorHasText("#event-type", "click", "Recognised Event Type");
    test.assertSelectorHasText("#event-target", "a#link", "Recognised Event Taget");
    test.assertSelectorHasText("#original-effect", "Altered", "Does not prevent the original event effect");
  });

  casper.run(function() {
    test.done();
  });
});
