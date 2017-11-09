// Break out the application running from the configuration definition to
// assist with testing.
require(["config"], function() {
	// Kick off the application.
	require(["app", "routers/router_admin"], function(app, Router) {
		// Define your master router on the application namespace and trigger all
		// navigation from this instance.
		app.router = new Router();

		// Trigger the initial route and enable HTML5 History API support, set the
		// root folder to '/' by default.  Change in app.js.
		Backbone.history.start({
			root: app.root
		});
	});
});