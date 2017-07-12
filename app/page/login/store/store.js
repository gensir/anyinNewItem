window.reqres = new Backbone.Wreqr.RequestResponse();
require('../store/store.js')
reqres.setHandlers({
    "global": function (test) { console.log(test, "reqres") }
});


module.exports = window.reqres