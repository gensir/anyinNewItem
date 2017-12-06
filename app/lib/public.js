define([],function(){
    var Util = {
        	imgModalBig:imgModalBig,
        	GetQueryString:GetQueryString,
        	SetQueryString:SetQueryString,
        	sendmsg:sendmsg,
            placeholder:placeholder
        };
        //域名键值对调用
        function GetQueryString(name, elseUrl) {
        
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            if (elseUrl !== undefined) {
                var s = elseUrl.split("?")[1].match(reg);
                if (s != null) return decodeURIComponent(s[2]);
                return null;
            }
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return null;
        }
        
        function SetQueryString(obj) {
            var tempAry = [];
            for (var i in obj) {
                tempAry.push(i + "=" + encodeURIComponent(obj[i]));
            }
            var ret = tempAry.join("&");
            return ret;
        }
        //imgModalBig('.logo img',{width:'1000'})
        function imgModalBig(el, binding) {
            $(el).click(function () {
                if (binding == undefined) {
                    var width = $(el).width();
                    var height = "auto";
                    var bigImgSrc = $(el)[0].src;
                } else {
                    var width = binding.width || $(el).width();
                    if (binding.height === undefined) {
                        var height = "auto"
                    } else {
                        var height = parseInt(binding.height) + "px" //binding.height || $(el).height();
                    }
                    var bigImgSrc = binding.src || $(el)[0].src;
                }
                $(".directiveImgModule").remove();
                $("body").append("<div class='directiveImgModule' style='position: fixed;top:0;width: 100%;height:100%;text-align:center;left: 0;z-index: 9999;background: rgba(102, 102, 102, 0.6);'>" +
                    "<div id='scaleBigModal'><img src='" + bigImgSrc + "' style='width:" + parseInt(width) + "px;height: " + (height) + "'>" +
                    "<span id='closeModalimg' style='position: absolute;top:0;right: 4px;font-size: 18px;cursor:pointer;'>X</span></div></div>"
                );
                $("#scaleBigModal").css({ position: "absolute", top: ($(".directiveImgModule").height() - $("#scaleBigModal").find("img").height()) / 2, left: ($(".directiveImgModule").width() - parseInt(width)) / 2 })
                $("body").on("click", "#closeModalimg,.directiveImgModule", function () {
                    if (event.target == $("#scaleBigModal img")[0]) {
                        return false;
                    };
                    $(".directiveImgModule").remove();
                })
            })
        }
        function sendmsg(ele) {
            var num = 60;
            if (!(ele.val() || ele.html())) {
                try {
                    throw new Error("html or value can not be empty!")
                } catch (err) {
                    throw err
                }
            }
        
            var send = setInterval(function () {
                if (num <= 0) {
                    clearInterval(send);
                    ele.val("获取短信验证码").html("获取短信验证码");
                    ele.attr("disabled", false)
                } else {
                    num--;
                    ele.attr("disabled", true)
                    ele.val("重新发送(" + num + ")").html("重新发送(" + num + ")");
        
                }
            }, 1000)
        
        }
        function placeholder() {
            var JPlaceHolder = {
                //检测
                _check: function () {
                    return 'placeholder' in document.createElement('input');
                },
                //初始化
                init: function () {
                    if (!this._check()) {
                        var _this=this;
                        setTimeout(function () {
                            _this.fix();
                        }, 100);
        
                    }
                },
                //修复
                fix: function () {
                    jQuery(':input[placeholder]').each(function (index, element) {
                        var self = $(this), txt = self.attr('placeholder');
                        self.wrap($('<div></div>').css({ position: 'relative', zoom: '1', border: 'none', background: 'none', padding: 'none', margin: 'none' }));
                        var pos = self.position(), h = self.outerHeight(true), l = self.height(), paddingleft = self.css('padding-left');
                        var holder = $('<span class="placeholder"></span>').text(txt).css({ position: 'absolute', left: pos.left, top: pos.top, height: h, lienHeight: l, paddingLeft: paddingleft, color: '#999' }).appendTo(self.parent());
                        self.focusin(function (e) {
                            holder.hide();
                        }).focusout(function (e) {
                            if (!self.val()) {
                                holder.show();
                            }
                        });
                        holder.click(function (e) {
                            holder.hide();
                            self.focus();
                        });
                    });
                }
            };
            //执行
            JPlaceHolder.init();
            return JPlaceHolder;
        }
        return Util;
})