var tpl = require('./tpl/step2.html');
var service = require('../../server/service').default;
var IDNo, enterpriseCode, result, that, username, id, firmId;
var flag = 0;
var step2 = Backbone.View.extend({
    el: '.container',
    initialize() {
        //		this.render();
    },
    events: {
        'click .findPasswordCodeBtn': 'phoneCode',
        'click #goStep3': 'goStep3',
        'keyup .countCode': 'checkCode',
        'keyup .passwd': 'passwd',
        'keyup .countPhone': 'inputSapceTrim',
        'onblur .checkPasswd': 'onBlur'
    },
    render: function (query) {
        that = this;
        firmId = localStorage.firmId || $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId;
        pointCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).pointCode;
        //      firmId = "440311062534"
        if (!firmId) {
            return;
        }
        this.getcompany(firmId);
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
        this.model.set({ "clickEle": $(event.target).data('id') })
        this.model.isValid()
        if ($(".passwd").val().length == 0) {
            $(".pswErrTip").html("请输入您的密码").css("color", "red").show();
            return;
        }
        if ($(".passwd").val().length < 8) {
            $(".pswErrTip").html("密码为8-20位数字、字母、特殊符号").css("color", "red").show();
            return;
        }
        if ($(".passwd").val() != $(".checkPasswd").val()) {
            $(".checkPasswdErrTip").html("您两次输入的密码不一致，请重新填写").show();
            return;
        } else {
            $(".checkPasswdErrTip").hide();
        }
        if ($(".legalID").val() != IDNo) {
            $(".legalIDErrTip").html("法人身份证号不正确").css({ "color": "red" });
            return;
        }
        this.model.set({ "clickEle": $(event.target).data('id') })
        this.model.isValid()
        if (!this.model.isValid()) {
            var mobile = $(".countPhone").val();
            var passwd = $(".passwd").val();
            enterpriseCode = result.uniformSocialCreditCode || result.organizationCode || null;
            var data = {
                "mobile": mobile,
                "password": passwd,
                "enterpriseCode": enterpriseCode,
                "username": username,
                "firmId": id,
                "pointCode":pointCode
            };
            service.registerUser(data).done(res => {
                if (res.code == 0) {
                    if (res.data == 100) {
                        localStorage.regStep = "#step4";
                        window.open('register.html#step4', '_self')
                    } else {
                        localStorage.regStep = "#step3";
                        window.open('register.html#step3', '_self')
                    }
                } else {
                    bootbox.alert(res.msg);
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
                $(".codeErrTip").html("请求成功").css({ "color": "#08c34e" });
            } else {
                service.checkSmsCode(code, phone).done(function (data) {
                    if (data.code == 0) {
                        flag = 1;
                        $(".codeErrTip").html(data.msg).css({ "color": "#08c34e" });
                    } else {
                        flag = 2;
                        $(".codeErrTip").html(data.msg).css({ "color": "red" });
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
            if ($test2.test($('.passwd').val())) { //满足中
                $(".pswMiddle").show();
                if ($test3.test($('.passwd').val())) {
                    $(".pswStrong").show();
                }
            } else {
                $(".pswStrong").hide();
                $(".pswMiddle").hide();
            }
        } else {
            $(".weak").hide();
            $(".pswMiddle").hide();
            $(".pswStrong").hide();
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
                bootbox.alert("firmId异常，无法获取到注册用户的信息",function(){window.open('login.html', '_self');})
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
                that.$el.html(tpl({ data: result }));
            } else {
                bootbox.alert(data.msg);
            }
        })
    }
});
module.exports = step2;