window.reqres  = new Backbone.Wreqr.RequestResponse();

            reqres.setHandlers({
                "global": function (test) { console.log(test,"reqres") }
            });

module.exports = window.reqres