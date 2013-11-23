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
