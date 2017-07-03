$(function() {
	var page = {
		pagenation: function(pageNumber) {
			$("#pageLimit li.index").remove();
			var firstShowPage, maxShowPage = 5
			if(pageNumber <= 3) {
				firstShowPage = 1
			} else {
				firstShowPage = pageNumber - 2;
			}
			var lastShowPage = maxShowPage + firstShowPage - 1;
			if(lastShowPage > this.totalPage) {
				lastShowPage = this.totalPage;
			}
			for(var i = firstShowPage; i <= lastShowPage; i++) {
				pageIndex = '<li class="index"><a>' + i + '</a></li>';
				$(".appendPage").before(pageIndex)
			};

			if(!this.active) { this.active = $("#pageLimit .index").eq(0) } else {
				this.active = $("#pageLimit a:contains(" + this.active.find('a').text() + ")").parents("li");
			};

			this.active.addClass("active").siblings().removeClass("active")
		},
		pageData: function() {
			this.active = '';
			this.totalPage = '';
			this.list = $(".interview_record .module")[0].outerHTML;
		}
	}
})