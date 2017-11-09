define([], function(){
    // 密码验证（数字，字母，中文标点符号）
    var verify = {
        result: true,
        synErrorInit:function() {
            var _this = this;
            $.extend({
                verify: function (log, ele, text) {
                    if (!(_this.istrue[log])(ele) || text) {
                        var text = text || _this.log[log]
                        $(ele + "-error").html(text)
                        _this.synError(ele);
                    };
                    if ($(ele + "-error").html()) {
                        _this.result = false;
                    };
                    return _this.result;
                },
                verifyEach: function (obj, callback) {
                    var isverify = true,
                        obj = obj || {};
                    $.each(obj, function (func, ele) {
                        $.verify(func, ele);
                        if ($(ele + "-error").html()) {
                            isverify = false;
                        };
                    });
                    if (isverify && typeof callback === "function") {
                        callback();
                    }
                    return isverify;
                }
            });

        },
        synError:function(ele) {
            var originVal = $(ele).val();
            if ($(ele + "-error").text()) {
                $(ele).on("keyup", function () {
                    if ($(this).val() != originVal) {
                        $(ele + "-error").html("")
                    }
                })
            } else {
                $(ele).unbind("keyup")
            }
        },
        log: {
            phone: '请输入正确的手机号码',
            passwd: '请输入6-18位字母、数字、特殊符号',
            valId: '法人身份证号不正确',
            space: '经办人姓名不能为空',
            idcode: '请输入18位社会信用代码',
            yzmcode: '请输入4位验证码'
        },
        istrue: {
            phone: function (ele) {
                var reg = /^1[34578]\d{9}$/;
                return reg.test($(ele).val());
            },
            passwd: function (ele) {
                var reg = /^([^(\s|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5)]|\w){6,}$/;
                return reg.test($(ele).val())
            },
            valId: function (ele) {
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                return reg.test($(ele).val())
            },
            space: function (ele) {
                var reg = /\S/;
                return reg.test($(ele).val())
            },
            idcode: function (ele) {
                var reg = /^[0-9a-zA-Z]{18}$/;
                return reg.test($(ele).val())
            },
            yzmcode: function (ele) {
                var reg = /^[A-Za-z0-9]{4}$/;
                return reg.test($(ele).val())
            }
        }
    }
    verify.synErrorInit();
    return verify;
});