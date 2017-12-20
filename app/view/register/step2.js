define([
    "text!./tpl/step2.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "../../../app/lib/ukeys",
    "../../lib/public",
    "bootbox"
], function (registerstep2, primary, service, ukeys, publicUtil, bootbox) {
    var IDNo, enterpriseCode, result, that, username, id, firmId, pointCode;
    var flag = 0;
    var Backbone = require('backbone');
    var template = require('art-template');
    var placeholder = publicUtil.placeholder;
    var main = Backbone.View.extend({
        el: '#main',
        initialize: function () {

        },
        events: {
            'click .findPasswordCodeBtn': 'phoneCode',
            'click #goStep3': 'goStep3',
            'keyup .countCode': 'checkCode',
            'keyup .passwd': 'passwd',
            'keyup .countPhone': 'inputSapceTrim',
            'onblur .checkPasswd': 'onBlur',
            'keyup .countPhone': 'changePhone'
        },
        render: function (param) {
            // service.jqueryplaceholder();
            //			this.$el.empty().html(template.compile(registerstep2,{})());
            //			this.$el.append(template.compile(primary,{})());

            that = this;
            firmId = localStorage.firmId || $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId;
            pointCode = localStorage.pointCode || $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).pointCode;
            //      firmId = "440311062534"
            if (!firmId) {
                window.open("register.html#step1", "_self");
                return;
            }
            if (!firmId) {//localStorage.loginODC && JSON.parse(localStorage.loginODC).keyType == 1 && ukeys.GetCertCount() != 0
                this.getcompanyODC()
            } else {
                this.getcompany(firmId);
            }
            document.body.scrollTop = document.documentElement.scrollTop = 0;

        },
        phoneCode: function (event) {

            this.model.set({ "clickEle": $(event.target).data('id') })
            this.model.isValid()
            //		if((/^1[34578]\d{9}$/.test($(".countPhone").val()))) {
            if (!this.model.isValid()) {
                var phone = $(".countPhone").val();
                var mobile = {
                    "mobile": phone
                }
                service.mobileIsNotExist(mobile).done(function (data) {
                    if (data.code == 0) {
                        var countdown = 60;
                        var ele = $(".findPasswordCodeBtn");
                        function settime() {
                            if (countdown == 0) {
                                ele.removeAttr("disabled");
                                ele.val("获取验证码");
                                countdown = 60;
                                clearTimeout(ele[0].settimes);
                                return false;
                            } else {
                                ele.attr("disabled", true);
                                ele.val("重新发送(" + countdown + ")");
                                countdown--;
                            }
                            ele[0].settimes = setTimeout(function () {
                                settime(ele)
                            }, 1000)
                        };
                        settime();
                        var code = $(".countCode").val();
                        if (code != "000000") {
                            service.getSMSVerifCode(phone).done(function (data) {
                                if (data.code == 0) {

                                } else {
                                    $(".phoneErrTip").html(data.msg).show();
                                }
                            })
                        }
                    } else if (data.code == 1) {
                        bootbox.alert(data.msg);
                    } else {
                        bootbox.alert(data.msg);
                    }
                })
            }
        },
        goStep3: function (event) {
            if (flag == 0) {
                $(".codeErrTip").html("请校验您的手机验证码").css({ "color": "red" });
                return;
            } else if (flag == 2) {
                $(".codeErrTip").html("您的手机验证码错误").css({ "color": "red" });
                return;
            };
            $(".checkPasswdErrTip").hide();
            if ($(".passwd").val().length == 0) {
                $(".pswErrTip").html("请输入您的密码").css("color", "red").show();
                return;
            }
            if ($(".passwd").val().length < 8) {
                $(".pswErrTip").html("*密码为8-20位数字、字母、特殊符号").css("color", "red").show();
                return;
            }
            if ($(".passwd").val() != $(".checkPasswd").val()) {
                $(".checkPasswdErrTip").html("您两次输入的密码不一致，请重新填写").show();
                $(".passwd").keyup(function(){
					if ($(".passwd").val() == $(".checkPasswd").val()){
						$(".checkPasswdErrTip").html("").hide();
					}else{
						$(".checkPasswdErrTip").html("您两次输入的密码不一致，请重新填写").show();	
					}
                })
                $(".checkPasswd").keyup(function(){
                	if ($(".passwd").val() == $(".checkPasswd").val()){
						$(".checkPasswdErrTip").html("").hide();
					}else{
						$(".checkPasswdErrTip").html("您两次输入的密码不一致，请重新填写").show();
					}
                })                
                return;
            } else {
                $(".checkPasswdErrTip").hide();
            }
            if ($(".legalID").val() != IDNo) {
                $(".legalIDErrTip").html("法人身份证号不正确").css({ "color": "red" });
                return;
            }
            var mobile = $(".countPhone").val();
            var passwd = $(".passwd").val();
            var code = $(".countCode").val();
            this.model.set({ "clickEle": $(event.target).data('id') })
            var validflag = this.model.isValid()
            var code = $(".countCode").val();
            var phone = $(".countPhone").val();
            // if (localStorage.loginODC && JSON.parse(localStorage.loginODC).keyType == 1 && ukeys.GetCertCount() != 0 && !id) {
            //     bootbox.alert("获取单位id异常，无法完成ODC注册", function () { window.open('login.html', '_self'); })
            //     return;
            // }
            if (code == "000000") {
                if (!validflag) {
                    enterpriseCode = result.uniformSocialCreditCode || result.organizationCode || null;
                    var data = {
                        "mobile": mobile,
                        "password": passwd,
                        "enterpriseCode": enterpriseCode,
                        "username": username,
                        "firmId": id,
                        "pointCode": pointCode
                    };
                    if (localStorage.loginODC && JSON.parse(localStorage.loginODC).keyType == 1 && ukeys.GetCertCount() != 0) {
                        data.esealCode = JSON.parse(localStorage.loginODC).esealCode || "12345678";
                        data.oid = JSON.parse(localStorage.loginODC).oid;
                        data.keyType = JSON.parse(localStorage.loginODC).keyType
                    }
                    service.registerUser(data).done(function (res) {
                        if (res.code == 0) {
                            if (res.data == 100) {
                                localStorage.clear();
                                window.open('register.html#step5', '_self')
                            } else {
                                localStorage.regStep = "#step3";
                                localStorage.removeItem("firmId");
                                window.open('register.html#step3', '_self')
                            }
                        } else {
                            bootbox.alert(res.msg);
                        }
                    })
                }
            } else {
                service.checkSmsCode(code, phone).done(function (data) {
                    if (data.code == 0) {
                        if (!validflag) {
                            enterpriseCode = result.uniformSocialCreditCode || result.organizationCode || null;
                            var data = {
                                "mobile": mobile,
                                "password": passwd,
                                "enterpriseCode": enterpriseCode,
                                "username": username,
                                "firmId": id,
                                "pointCode": pointCode
                            };
                            if (localStorage.loginODC && JSON.parse(localStorage.loginODC).keyType == 1 && ukeys.GetCertCount() != 0) {
                                data.esealCode = JSON.parse(localStorage.loginODC).esealCode || "12345678";
                                data.oid = JSON.parse(localStorage.loginODC).oid;
                                data.keyType = JSON.parse(localStorage.loginODC).keyType
                            }
                            service.registerUser(data).done(function (res) {
                                if (res.code == 0) {
                                    if (res.data == 100) {
                                        localStorage.clear();
                                        window.open('register.html#step5', '_self')
                                    } else {
                                        localStorage.regStep = "#step3";
                                        localStorage.removeItem("firmId");
                                        window.open('register.html#step3', '_self')
                                    }
                                } else {
                                    bootbox.alert(res.msg);
                                }
                            })
                        }
                    } else {
                        flag = 2;
                        $(".codeErrTip").html(data.msg).css({ "color": "red" }).show();
                        return;
                    }
                })
            }
        },
        checkCode: function () {
            if ($('.countCode').val().length == 6) {
                var code = $(".countCode").val();
                var phone = $(".countPhone").val();
                if (code == "000000") {
                    flag = 1;
                    $(".codeErrTip").html("校验成功").css({ "color": "#08c34e" }).show();
                } else {
                    service.checkSmsCode(code, phone).done(function (data) {
                        if (data.code == 0) {
                            flag = 1;
                            $(".codeErrTip").html(data.msg).css({ "color": "#08c34e" }).show();
                        } else {
                            flag = 2;
                            $(".codeErrTip").html(data.msg).css({ "color": "red" }).show();
                            return;
                        }
                    })
                }

            } else {
                flag = 0;
                $('.codeErrTip').html('');
            }
        },
        passwd: function () {
            $(".pswErrTip").hide().html("");
            var $test1 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+){8,20}$/; //  弱：纯数字，纯字母，纯特殊字符
            var $test2 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)[a-zA-Z\d!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$/; //中：字母+数字，字母+特殊字符，数字+特殊字符
            var $test3 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)(?![\d!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)[a-zA-Z\d!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$/; //强：字母+数字+特殊字符
            if ($test1.test($('.passwd').val())) { //满足弱
                $(".weak").show();
                $(".pswErrTip_red").hide();
                if ($test2.test($('.passwd').val())) { //满足中
                    $(".pswMiddle").show();
                    $(".pswErrTip_red").hide();
                    if ($test3.test($('.passwd').val())) {
                        $(".pswStrong").show();
                        $(".pswErrTip_red").hide();
                    }
                } else {
                    $(".pswStrong").hide();
                    $(".pswMiddle").hide();
                }
            } else {
                $(".weak").hide();
                $(".pswMiddle").hide();
                $(".pswStrong").hide();
                $(".pswErrTip_red").show();
            }
        },
        inputSapceTrim: function (e) {
            var keynum;
            if (window.event) // IE 
            {
                keynum = e.keyCode
            } else if (e.which) // Netscape/Firefox/Opera 
            {
                keynum = e.which
            }
            if (keynum == 32) {
                return false;
            }
            return true;
        },
        getcompany: function () {
            var data = {
                "firmId": firmId,
                "pointCode": pointCode
            }
            service.toRegister(data).done(function (data) {
                if (data.data == null) {
                    bootbox.alert("单位id异常，无法获取到注册用户的信息", function () { window.open('login.html', '_self'); })
                    return;
                }
                if (data.code == 0) {
                    //				data={
                    //				    "code": 0,
                    //				    "msg": "请求成功",
                    //				    "data": {
                    //				        "address": "宝安区松岗街道罗田第三工业区象山大道15号一楼西面",
                    //				        "businessLicenseNumber": "",
                    //				        "legalName": "张三疯",
                    //				        "name": "深圳菱正环保设备有限公司",
                    //				        "uniformSocialCreditCode": "914403005538853123",
                    //				        "idcardNumber":"4408231999155656",
                    //				        "id":"123456789"
                    //				    }
                    //				}
                    result = data.data;
                    id = result.id;
                    IDNo = result.idcardNumber;
                    username = data.data.name
                    localStorage.enterpriseCode = result.uniformSocialCreditCode || result.organizationCode;
                    that.$el.html(template.compile(registerstep2)({ data: result }));
                    that.$el.append(template.compile(primary, {})());
                } else {
                    bootbox.alert(data.msg);
                }
                placeholder();
            })
        },
        getcompanyODC: function () {
            var data = {
                "enterpriseCode": JSON.parse(localStorage.loginODC).enterpriseCode,
                "enterpriseName": JSON.parse(localStorage.loginODC).enterpriseName,
                "pointCode": JSON.parse(localStorage.loginODC).pointCode
            }
            service.toRegisterOdc(data).done(function (data) {
                console.log(data)
                if (data.data == null) {
                    bootbox.alert(data.msg, function () { window.open('login.html', '_self'); })
                    return;
                }
                if (data.code == 0) {
                    //				data={
                    //				    "code": 0,
                    //				    "msg": "请求成功",
                    //				    "data": {
                    //				        "address": "宝安区松岗街道罗田第三工业区象山大道15号一楼西面",
                    //				        "businessLicenseNumber": "",
                    //				        "legalName": "张三疯",
                    //				        "name": "深圳菱正环保设备有限公司",
                    //				        "uniformSocialCreditCode": "914403005538853123",
                    //				        "idcardNumber":"4408231999155656",
                    //				        "id":"123456789"
                    //				    }
                    //				}
                    result = data.data;
                    id = result.id;
                    IDNo = result.idcardNumber;
                    username = data.data.name
                    localStorage.enterpriseCode = result.uniformSocialCreditCode || result.organizationCode;

                    that.$el.html(template.compile(registerstep2)({ data: result }));
                    that.$el.append(template.compile(primary, {})());
                    // that.$el.html(tpl({ data: result }));
                    // if (localStorage.loginODC && JSON.parse(localStorage.loginODC).keyType == 1 && ukeys.GetCertCount() != 0 && !id) {
                    //     bootbox.alert("获取单位id异常，无法完成ODC注册", function () { window.open('login.html', '_self'); })
                    //     return;
                    // }
                } else {
                    bootbox.alert(data.msg);
                }
            })
        },
        changePhone: function () {
            $(".codeErrTip").hide();
            flag = 1;
        },
        lastFun: function () {

        }
    });
    return main;
});
