import tpl from './tpl/step1.html'
var step1 = Backbone.View.extend({
    el: '.container',
    initialize(){
        this.render();
    },
    events:{
        'click #xieyi': 'rules',
        'click #reguser':'reguser',
    },
    
    rules:function(){
        if($('#xieyi').is(':checked')) {
            $('#reguser').prop("disabled", false);
        } else {
            $('#reguser').prop("disabled", true);
        }
    },

    reguser: function(event) {
		this.model.set({ "clickEle": $(event.target).data('id') });
		this.model.isValid();
	},

    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step1;