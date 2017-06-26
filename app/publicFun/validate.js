var verify = {
    synError: function (key1, key2, unbindItem) {//内部对象类型（字符串）；input元素的id（字符串） ；input元素
        var key1Item = this.validateLog[key1],
            errorElem = $('#' + key2 + '-error');
        var key2Item = key1Item[key2],
            self = this,
            key2Elem = $('#' + key2);
        if (key2Item.errorLog) {
            errorElem.text(key2Item.errorLog).show();
            var originVal = $('#' + key2).val();
            if (key2Item.errorLog === '您输入的用户名或密码不正确') {
                key2Elem = $('#login_user, #login_password');
                originVal = {
                    login_user: $('#login_user').val(),
                    login_password: $('#login_password').val()
                };
                key2Elem.bind('keyup.checkChange', function () {
                    var id = $(this).attr('id');
                    if ($(this).val() !== originVal[id]) {
                        verify.validateLog[key1].login_user.errorLog = null;
                        verify.synError(key1, 'login_user', key2Elem);
                    }
                });
            } else {
                key2Elem.bind('keyup.checkChange', function () {
                    if ($(this).val() !== originVal) {
                        var id = $(this).attr('id');
                        verify.validateLog[key1][id].errorLog = null;
                        verify.synError(key1, id);
                    }
                });
            }
        } else {
            errorElem.text('').hide();
            if (unbindItem) {
                unbindItem.unbind('keyup.checkChange');
            } else {
                if (!(verify.validateLog[key1].login_user && verify.validateLog[key1].login_user.errorLog === '您输入的用户名或密码不正确')) {
                    $('#' + key2).unbind('keyup.checkChange');
                }
            }
        }
    },
    validateLog: {
        login: {
            login_user: {
                validateFun: function () {
                    var loginUser = verify.validateLog.login.login_user;
                    var elem = $("#login_user");
                    if (!/^1[34578]\d{9}$/.test(elem.val())) {
                        loginUser.errorLog = '请输入正确的手机号码';
                    }
                },
                errorLog: null,
                errorElem: '#login_user-error'
            },
            login_password: {
                validateFun: function () {
                    var loginPassword = verify.validateLog.login.login_password;
                    var elem = $("#login_password"),
                        elemVal = elem.val();
                    if (!chrnum.test(elemVal)) {
                        loginPassword.errorLog = '请输入6-18位字母、数字、特殊符号';
                    }
                },
                errorLog: null,
                errorElem: '#login_password-error'
            },
            login_idcode: {
                validateFun: function () {
                    var loginIdCode = verify.validateLog.login.login_idcode;
                    var needToValidate = !$('.hideIdCode').is(':hidden');
                    if (!needToValidate) {
                        loginIdCode.errorLog = null;
                        return;
                    }
                    var elem = $("#login_idcode"),
                        elemVal = elem.val();
                    if (elemVal.length === 0) {
                        loginIdCode.errorLog = '请输入验证码';
                    }
                },
                errorLog: null,
                errorElem: '#login_idcode-error' //TODO
            }
        },
        msgLogin: {
            loginPhone: {
                validateFun: function () {
                    var loginPhone = verify.validateLog.msgLogin.loginPhone;
                    var elem = $("#loginPhone");
                    if (!/^1[34578]\d{9}$/.test(elem.val())) {
                        loginPhone.errorLog = '请输入正确的手机号码';
                    }
                },
                errorLog: null,
                errorElem: '#login_user-error'
            },
            IDCode: {
                validateFun: function () {
                    var IDCode = verify.validateLog.msgLogin.IDCode;
                    var elem = $("#IDCode");
                    if (!/^\d{6}$/.test(elem.val())) {
                        IDCode.errorLog = '请输入正确的验证码'
                    }
                },
                errorLog: null,
                errorElem: '#IDCode-error'
            }
        },
        register: {
            register_user: {
                validateFun: function () {
                    var registerUser = verify.validateLog.register.register_user;
                    var elem = $("#register_user");
                    if (!/^1[34578]\d{9}$/.test(elem.val())) {
                        registerUser.errorLog = '请输入正确的手机号码';
                    }
                },
                errorLog: null,
                errorElem: '#register_user-error'
            },
            input_code: {
                validateFun: function () {
                    var registerUser = verify.validateLog.register.input_code;
                    var elem = $("#input_code");
                    if (!/^\d{6}$/.test(elem.val())) {
                        registerUser.errorLog = '请输入正确的验证码'
                    }
                },
                errorLog: null,
                errorElem: '#input_code-error'
            },
            register_password: {
                validateFun: function () {
                    var registerUser = verify.validateLog.register.register_password;
                    var elem = $("#register_password");
                    if (!chrnum.test(elem.val())) {
                        registerUser.errorLog = '请输入6-18位字母、数字、特殊符号';
                    }
                },
                errorLog: null,
                errorElem: '#register_password-error'
            }
        },
        forget: {
            forget_user: {
                validateFun: function () {
                    var forgetUser = verify.validateLog.forget.forget_user;
                    var elem = $("#forget_user");
                    if (!/^1[34578]\d{9}$/.test(elem.val())) {
                        forgetUser.errorLog = '请输入正确的手机号码';
                    }
                },
                errorLog: null,
                errorElem: '#register_user-error'
            },
            inputGetCode: {
                validateFun: function () {
                    var forgetUser = verify.validateLog.forget.inputGetCode;
                    var elem = $("#inputGetCode");
                    if (!/^\d{6}$/.test(elem.val())) {
                        forgetUser.errorLog = '请输入正确的验证码'
                    }
                },
                errorLog: null,
                errorElem: '#inputGetCode-error'
            },
            forget_password: {
                validateFun: function () {
                    var forgetUser = verify.validateLog.forget.forget_password;
                    var elem = $("#forget_password");
                    if (!chrnum.test(elem.val())) {
                        forgetUser.errorLog = '请输入6-18位字母、数字、特殊符号';
                    }
                },
                errorLog: null,
                errorElem: '#register_password-error'
            }
        }
    },
    action: function (item, func, _this) {//内部对象类型（字符串）；提交执行的函数；对象类型（变量名）
        var key, validateResult = true;
        for (key in this.validateLog[item]) {
            if (verify.validateLog[item].hasOwnProperty(key)) {
                var validateItem = verify.validateLog[item][key];
                validateItem.validateFun();
                if (validateItem.errorLog) {
                    validateResult = false;
                }
                verify.synError(item, key);
            }
        }
        if (validateResult) {
            func.call(_this);
        }
    }
};