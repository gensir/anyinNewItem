var Util = {

};
var service = require('../server/service').default;
//域名键值对调用
export function GetQueryString(name, elseUrl) {

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

export function SetQueryString(obj) {
    var tempAry = [];
    for (var i in obj) {
        tempAry.push(i + "=" + encodeURIComponent(obj[i]));
    }
    var ret = tempAry.join("&");
    return ret;
}
//imgModalBig('.logo img',{width:'1000'})
export function imgModalBig(el, binding) {
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
export function sendmsg(ele) {
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
export function fileUp(service, event, pictureFlag, num) {
    var preview = document.getElementById('photo' + num);
    var file = document.getElementById("file" + num);
    var regImage, imageType;
    if (!file.files) {
        var ret = file.value.split('\\');
        var imageName = ret[ret.length - 1];
        imageType = imageName.split('.');
        imageType = imageType[imageType.length - 1];
        regImage = /(png|jpe?g|gif|svg)(\?.*)?$/;
    } else {
        imageType = file.files[0].type;
        regImage = /image\/\w+/;
        if (file.files[0].size > 2 * 1024 * 1024) {
            bootbox.dialog({
                className: "realName",
                title: "<div class='title'></div>",
                message: "<div class='message'>图片大小不要超过2M</div>",
            })
            return false;
        }
    }
    if (!regImage.test(imageType)) {
        bootbox.dialog({
            className: "realName",
            title: "<div class='title'></div>",
            message: "<div class='message'>请上传图片格式的文件</div>",
        })
        return false;
    }
    var randomPercent = Math.floor(Math.random() * 19 + 80);
    var percentVal = 0;
    if (pictureFlag[num] != 0) {
        var data = pictureFlag[num];
        service.deletePhoto(data).done(function (data) {
            if (data.code == 0) {
                console.log(data.msg);
                pictureFlag[num] = 0;
            } else {
                console.log(data.msg);
            }
        });
    }
    setTimeout(function () {
        $("#ajaxForm" + num).ajaxSubmit({
            url: '/mp/file',
            type: "post",
            dataType: "json",
            ContentType: "multipart/form-data",
            beforeSend: function () {
                $(".formPub").remove();
                $(event.target).parent().addClass("form");
                var div = $("<div/>");
                div.attr('class', 'formPub');
                div.appendTo($(event.target).parent());
                var progress = $("<div/>");
                progress.attr('class', 'progress');
                progress.appendTo($(".formPub"))
            },
            uploadProgress: function (event, position, total, percentComplete) {
                if (percentComplete < randomPercent) {
                    percentVal = percentComplete;
                } else {
                    percentVal = randomPercent;
                }
                $(".progress").css({ "width": percentComplete + '%' });
            },
            success: function (data) {
                if (data.code == 0) {
                    var data = data.data.fullUrl;
                    pictureFlag[num] = data;
                    $("#photo" + num).css("background", "url(" + data + ") no-repeat center");
                    var reader = new FileReader();
                    reader.readAsDataURL(file.files[0]);
                    reader.onload = function (e) {
                        var image = new Image();
                        image.src = this.result;
                        image.onload = function () {
                            var height = image.height;
                            var width = image.width;
                            if ((height / width) > (112 / 163)) {
                                $("#photo" + num).css("background-size", "auto 112px");
                            } else {
                                $("#photo" + num).css("background-size", "163px auto");
                            }
                        };
                        $(".reset" + num).show();
                        $("#file" + num).height(24);
                        imgModalBig('#photo' + num, { 'width': 500, 'src': pictureFlag[num] });
                    }
                } else {
                    var dialog = bootbox.alert({
                        className: "uploadPhoto",
                        message: data.msg,
                    })
                    return;
                }
            },
            error: function (data) {
                var dialog = bootbox.alert({
                    className: "uploadPhoto",
                    message: (data.msg || "网络异常，请稍后再试"),
                })
                return;
            },
            complete: function () {
                setTimeout(function () {
                    $(event.target).parent().removeClass("form");
                    $(".formPub").remove();
                }, 100);
            },
        })
    }, 200)
}

export function ukeys() {
    return {
        randomNum() {
            return service.getRandomNum().done(function (data) {
                //console.log(JSON.stringify(data))
            })
        },
        data:{
            ukey:null,
            availableUkey:false,
            ukeyName:[],
            PINResult:null,
            wang:1
        },
        ukeyInit(){
            // 这里就是注册表中CLSID文件夹根目录的文件夹名称
            try {
            //window.ukey=new ActiveXObject("IYIN_SIGNACTIVE.IYIN_SignActiveCtrl.1");
                this.data.ukey = new ActiveXObject("IYIN_SIGNACTIVE.IYIN_SignActiveCtrl.1");
                console.log(JSON.stringify(this),123)
            } catch (e) {
                this.data.availableUkey = true;
            //alert("****" + e.message);
            }
            if (!this.data.ukey) {
                return false;
            }
        },
        ukeyName() {
            this.ukeyInit();
            this.data.wang=3
            alert(this.data.wang)
            var nCount = this.data.ukey.GetCertCount();
            for (var i = 0; i < nCount; i++) {
                this.data.ukey.SetCertIndex(i);//获取第几个ukey
                this.data.ukeyName.push(this.data.ukey.GetCertInfo(0));
                // alert("第" + (i + 1) + "个证书信息如下：\n" +
                //     //"获取签名证书：\n"+ ukey.GetCertData(0) +
                //     //"获取加密证书：\n"+ ukey.GetCertData(1) +
                //     "获取证书名称：" + window.ukey.GetCertInfo(0) + "\n" +
                //     "获取证书OID： " + window.ukey.GetCertInfo(1) + "\n" +
                //     "获取证书类型:" + (window.ukey.GetCertInfo(2) == "0" ? "创业KEY" : "ODC-KEY") + "\n" +
                //     "获取印章编码：" + window.ukey.GetCertInfo(3)
                // );
            }
            return this.data.ukeyName
        },
        PIN(val,selectukeyInd){
            alert(this.data.wang)
        // 验证KEY密码
        if (val) {console.log(JSON.stringify(this),123)
            //this.ukeyInit();
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.SetCertPin(val);
        }
        }
    }
}