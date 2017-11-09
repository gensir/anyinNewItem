define([],function(){
	var obj={};
	obj.GetQueryString=function(name, elseUrl) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    if (elseUrl !== undefined) {
	        var s = elseUrl.split("?")[1].match(reg);
	        if (s != null) return decodeURIComponent(s[2]); return null;
	    }
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return decodeURIComponent(r[2]); return null;
	}
	obj.SetQueryString=function(obj){
		var tempAry = [];
	    for (var i in obj) {
	        tempAry.push(i + "=" + encodeURIComponent(obj[i]));
	    }
	    var ret = tempAry.join("&");
	    return ret;
	}
	obj.imgModalBig=function(el,binding){
		$(el).click(function () {
	        if(binding==undefined){
	            var width=$(el).width();
	            var height="auto";
	            var bigImgSrc=$(el)[0].src;
	        }else {
	            var width = binding.width || $(el).width();
	            if(binding.height===undefined){
	                var height ="auto"
	            }else{
	                var height =parseInt(binding.height)+"px" //binding.height || $(el).height();
	            }
	            var bigImgSrc = binding.src || $(el)[0].src;
	        }
	        $(".directiveImgModule").remove();
	        $("body").append("<div class='directiveImgModule' style='position: fixed;top:0;width: 100%;height:100%;text-align:center;left: 0;z-index: 9999;background: rgba(102, 102, 102, 0.6);'>"+
	            "<div id='scaleBigModal'><img src='"+bigImgSrc+"' style='width:"+ parseInt(width)+"px;height: "+(height)+"'>"+
	            "<span id='closeModalimg' style='position: absolute;top:0;right: 4px;font-size: 18px;cursor:pointer;'>X</span></div></div>"
	        );
	        $("#scaleBigModal").css({position: "absolute",top:($(".directiveImgModule").height()-$("#scaleBigModal").find("img").height())/2,left:($(".directiveImgModule").width()-parseInt(width))/2})
	        $("body").on("click","#closeModalimg,.directiveImgModule",function(){
	            if(event.target==$("#scaleBigModal img")[0]){
	                return false;
	            };
	            $(".directiveImgModule").remove();
	        })
	    })
	}
	return obj;
})