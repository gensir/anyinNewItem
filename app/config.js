// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
	paths: {
		// Make vendor easier to access.
		"vendor": "../vendor",

		// Almond is used to lighten the output filesize.
		"almond": "../vendor/bower/almond/almond",

		// Opt for Lo-Dash Underscore compatibility build over Underscore.
		"underscore": "../vendor/bower/lodash/dist/lodash.underscore",

		// Map remaining vendor dependencies.
		"jquery": "../vendor/bower/jquery/dist/jquery",
		"backbone": "../vendor/bower/backbone/backbone",
		"text": "../vendor/bower/text/text",
		"art-template":"../vendor/bower/template-web/template-web",
		"css": "../vendor/bower/require-css/css",
        "bootbox":"../vendor/bower/bootbox/bootbox.min",
        "bootstrap":"../vendor/bower/bootstrap/dist/js/bootstrap.min",
        "datetimepicker": "../vendor/bower/datetimepicker/bootstrap-datetimepicker.min",
        "typeahead": "../vendor/bower/bootstrap-typeahead/bootstrap-typeahead",
        "colResizable": "../vendor/plugin/colResizable-1.6",
        "bootstrap-typeahead":"../vendor/bower/bootstrap-typeahead/bootstrap-typeahead",
        "cookie":"../vendor/bower/jquery-cookie/jquery.cookie"
        
	},
	shim: {
		// This is required to ensure Backbone works as expected within the AMD
		// environment.
		"backbone": {
			// These are the two hard dependencies that will be loaded first.
			deps: ["jquery", "underscore","art-template","cookie"],

			// This maps the global `Backbone` object to `require("backbone")`.
			exports: "Backbone"
        },
        "bootstrap": {
            deps: [ 'jquery' ],
            exports: 'bootstrap'
        },
        "bootbox": {
            deps: [ 'jquery', 'bootstrap'],
            exports: 'bootbox'
        },        
        'datetimepicker': {
            deps: [ 'jquery' ],
            exports: 'datetimepicker'
        },
        'typeahead': {
            deps: [ 'jquery' ],
            exports: 'typeahead'
        },
        'colResizable':{
            deps: [ 'jquery' ],
            exports: 'colResizable'
        }
	}
});