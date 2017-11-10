define([
    "text!../tpl/indexPage.html",
//    "text!../tpl/comTable.html",
    "../../app/lib/service",
    "datetimepicker",
    "typeahead",
    "colResizable"
    ],function(indexPageTpl, service) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
            render: function () {
				this.$el.empty().html(template.compile(indexPageTpl)({}));
				this.lastFun();
            },
            events: {
                "click .startfind": "startfind",
                "click .details li.index":"togglePage"                
            },
            lastFun:function(){
				
				var pageNum=1;
				var pageSize=3;
				var data={
					"firmId": "440311064427"
				}
				service.getEsealList(pageNum, pageSize, data).done(res => {
		            var Esealobj;
		            if (res.code != 0) {
		                console.log(res);
		            } else {
		                console.log(res);
		
		            }
		        });
				
				

            }
        });
        return main;
    }
);