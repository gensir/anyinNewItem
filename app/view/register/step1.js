define([
    "text!./tpl/step1.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "bootbox",
    "bootstrap-typeahead"
    ],function(registerstep1,primary,service,bootbox,typeahead) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
	var firmId, enterpriseCode,that;
	var flag = false;
	var cname = false;    
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        },
        render: function(param) {
        	that = this;
			this.$el.empty().html(template.compile(registerstep1,{})());
			this.$el.append(template.compile(primary,{})());
	        this.Emptyinput();
	        this.rules();
	        this.typeahead();
	        localStorage.clear();
	        document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        events: {
	        'click #xieyi': 'rules',
	        'click #reguser': 'reguser',
	        'keyup #yzmcode': 'checkCaptcha',
	        'click #up_yzmcode,.codeimg': 'CodeRefresh',
	        'change #Ename': 'checknameerror',
	        'blur #Ename': 'blurcheck' 
        },  
	    rules: function() {
	        if ($('#xieyi').is(':checked')) {
	            $('#reguser').attr("disabled", false);
	        } else {
	            $('#reguser').attr("disabled", true);
	        }
	    },
	    //IE中重置表单内容
	    Emptyinput: function() {
	        window.onload = function () {
	            document.reg.reset();
	        }
	    },
	    //企业名称模糊搜索
	    typeahead: function() {
	        $('#Ename').typeahead({
	            ajax: {
	                url: "/mp/check_organization/web/solr/company/list",
	                timeout: 500,
	                displayField: "name",
	                triggerLength: 1,
	                method: "post",
	                loadingClass: "loading-circle",
	                preDispatch: function (query) {
	                    return JSON.stringify({ pageNum: 1, pageSize: 10, params: { name: query } })
	                },
	                preProcess: function (data) {
	                    //showLoadingMask(false);
	                    if (data.code === false) {
	                        // Hide the list, there was some error
	                        return false;
	                    }
	                    // We good!
	                    return data.data;
	                }
	            }
	        })
	    },
	    //输入框blur后自动查询校验
	    blurcheck: function() {
	        var _this = this, timer
	        timer = setTimeout(function () {
	            _this.checkname();
	        }, 200);
	    },
	    //企业名称查询编码
	    checkname: function() {
	        var name = $.trim($("#Ename").val());
	        var data = { "params": { "name": name } }
	        if (name.length > 0) {
	            service.checkname(data).done(function(res) {
	                if (res.code == 0 && (res.data != "" || res.data.length != 0)) {
	                    enterpriseCode = res.data[0].creditCode || res.data[0].organizationCode;
	                    firmId = res.data[0].id;
	                    if (enterpriseCode == null) {
	                        cname = false;
	                        $("#Ename-error").html("企业信息异常，不可注册").css({ "color": "#f00" });
	                    } else {
	                        cname = true;
	                        that.checkUserIsExist(enterpriseCode);
	                    }
	                } else {
	                    cname = false;
	                    $("#Ename-error").html("企业不存在，不可注册").css({ "color": "#f00" });
	                }
	            })
	        }
	    },
	    //校验公司能否注册
	    checkUserIsExist: function(enterpriseCode) {
	        var data = {
	            "enterpriseCode": enterpriseCode
	        }
	        service.checkUserIsExist(data).done(function(res) {
	            if (res.code == 0) {
	                cname = true;
	                $("#Ename-error").html("该企业可注册").css({ "color": "#08c34e" });
	            } else if (res.code == 1) {
	                cname = false;
	                $("#Ename-error").html("当前企业已注册，<a href='login.html'>立即登录</a>").css({ "color": "#f00" });
	            } else if (res.code == 2) {
	                cname = false;
	                $("#Ename-error").html("当前企业已办理电子印章，使用UKEY<a href='login.html'>快速登录</a>").css({ "color": "#f00" });
	            } else if (res.code == 3) {
	                cname = false;
	                $("#Ename-error").html("很抱歉，该企业暂时不支持电子印章申请").css({ "color": "#f00" });
	            }
	        })
	    },
	    //重置企业名称错误提示
	    checknameerror: function() {
	        $('#Ename-error').html('').css({ "color": "#f00" });
	    },
	    //更换验证码
	    CodeRefresh: function() {
	        $('#yzmcode-error').html('').css({ "color": "#f00" });
	        $('#yzmcode').val("");
	        $(".codeimg").attr('src', '/mp/captcha.jpg?' + Math.random())
	    },
	    //校验图片验证码
	    checkCaptcha: function(data) {
	        if ($('#yzmcode').val().length >= 4) {
	            var data = {
	                "captcha": $('#yzmcode').val()
	            }
	            service.checkCaptcha(data).done(function(res) {
	                if (res.code == 0) {
	                    flag = true;
	                    $("#yzmcode-error").html("验证码正确").css({ "color": "#08c34e" });
	                } else {
	                    flag = false;
	                    $("#yzmcode-error").html(res.msg).css({ "color": "#f00" });
	                    $(".codeimg").attr('src', '/mp/captcha.jpg?' + Math.random());
	                }
	            })
	        } else {
	            $('#yzmcode-error').html('').css({ "color": "#f00" });
	        }
	    },
	    //提交注册验证
	    reguser: function(event) {
	        if ($.trim($("#Ename").val()) == "") {
	            $("#Ename-error").html("请输入企业名称").css({ "color": "#f00" });
	            cname = false;
	        }
	        if ($("#yzmcode").val().length < 4) {
	            $("#yzmcode-error").html("请输入4位验证码").css({ "color": "#f00" });
	            flag = false;
	        }
	        if (cname && flag) {
	            this.toreguser();
	        }        
	        // this.model.set({ "clickEle": $(event.target).data('id') });
	        // if (!this.model.isValid()) {
	        // }
	    },
	    //注册进入第二步
	    toreguser: function(data) {
	        var data = {
	            "firmId": firmId
	        }
	        service.toRegister(data).done(function(res) {
	            if (res.code == 0) {
	                localStorage.firmId = firmId;
	                localStorage.regStep = "#step2";
	                window.open('#step2', '_self')
	            } else {
	                bootbox.alert(res.msg);
	            }
	        })
	    },        
 
        lastFun:function(){
		
        }      
    });
    return main;
});
