define([
    "text!./tpl/step3.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "bootbox",
    "../../lib/public",
    "jqueryForm"
    ],function(registerstep3,primary,service,bootbox,publicUtil,jqueryForm) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var imgModalBig=publicUtil.imgModalBig;
	var pictureFlag = [0, 0, 0];
	var enterpriseCode;
	
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        	
        },
        
        events: {
			'change #file0,#file1,#file2': 'changeImg',
			'click #goStep4': 'goStep4'           
        },  
        
        render: function(param) {
			this.$el.empty().html(template.compile(registerstep3,{})());
			this.$el.append(template.compile(primary,{})());
			enterpriseCode = localStorage.enterpriseCode||$.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
			pictureFlag = [0, 0, 0];
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			imgModalBig('.shadow1', { 'width': 500, 'src': '../../../app/asset/img/lince.jpg' });
			imgModalBig('.shadow2', { 'width': 500, 'src': '../../../app/asset/img/ID-front.png' });
			imgModalBig('.shadow3', { 'width': 500, 'src': '../../../app/asset/img/ID-back.png' });
        },
		changeImg: function(event) {
			var eve=event;
			var fileVal = $(event.target).val();
			if(!fileVal) {
				return;
			}
			var num = $(event.target).data('id');
			var preview = document.getElementById('photo' + num);
			var file = document.getElementById("file" + num);
			var regImage, imageType;
			if(!file.files) {
				var ret = file.value.split('\\');
				var imageName = ret[ret.length - 1];
				imageType = imageName.split('.');
				imageType = imageType[imageType.length - 1];
				regImage = /(png|jpe?g|gif|svg)(\?.*)?$/;
			} else {
				imageType = file.files[0].type;
				regImage = /image\/\w+/;
				if(file.files[0].size > 2 * 1024 * 1024) {
					bootbox.dialog({
						className: "realName",
						title: "<div class='title'></div>",
						message: "<div class='message'>图片大小不要超过2M</div>",
					})
					return false;
				}
			}
			if(!regImage.test(imageType)) {
				bootbox.dialog({
					className: "realName",
					title: "<div class='title'></div>",
					message: "<div class='message'>请上传图片格式的文件</div>",
				})
				return false;
			}
			var randomPercent = Math.floor(Math.random() * 19 + 80);
			var percentVal = 0;
			if(pictureFlag[num] != 0) {
				var data = pictureFlag[num];
				service.deletePhoto(data).done(function(data) {
					if(data.code == 0) {
						pictureFlag[num] = 0;
					} else {
						bootbox.alert(data.msg);
					}
				});
			}
			setTimeout(function() {
				$("#ajaxForm" + num).ajaxSubmit({
					url: '/mp/file',
					type: "post",
					dataType: "json",
					ContentType: "multipart/form-data",
					beforeSend: function() {
						$(".formPub").remove();
						$(event.target).parent().addClass("form");
						var div = $("<div/>");
						div.attr('class', 'formPub');
						div.appendTo($(event.target).parent());
						var progress = $("<div/>");
						progress.attr('class', 'progress');
						progress.appendTo($(".formPub"))
					},
					uploadProgress: function(event, position, total, percentComplete) {
						if(percentComplete < randomPercent) {
							percentVal = percentComplete;
						} else {
							percentVal = randomPercent;
						}
						$(".progress").css({ "width": percentComplete + '%' });
					},
					success: function(data) {
						var data = JSON.parse(data);
						if(data.code == 0) {
							var data = data.data.fullUrl;
							pictureFlag[num] = data;
							if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
	    						var userAgent = navigator.userAgent;
	                            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");  
	                            reIE.test(userAgent);  
	                            var fIEVersion = parseFloat(RegExp["$1"]);  
	                            if(fIEVersion <= 9)  { 
	                                $("#photo" + num).css("background", "url(" + data + ") no-repeat").css({"filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+data+", sizingMethod='scale')",
	        "-ms-filter":" progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+data+", sizingMethod='scale')"});
	                            }else if(fIEVersion >=10){
	                                $("#photo" + num).css("background", "url(" + data + ") no-repeat").css("background-size","163px 112px");
	                            } 
	    						$(".reset" + num).show();
								$("#file" + num).height(24);
								imgModalBig('#photo' + num, { 'width': 500, 'src': pictureFlag[num] });
							}else{
								$("#photo" + num).css("background", "url(" + data + ") no-repeat center");
								var reader = new FileReader();
								reader.readAsDataURL(file.files[0]);
								reader.onload = function(e) {
									var image = new Image();
									image.src = this.result;
									image.onload = function() {
										var height = image.height;
										var width = image.width;
										if((height / width) > (112 / 163)) {
											$("#photo" + num).css("background-size", "auto 112px");
										} else {
											$("#photo" + num).css("background-size", "163px auto");
										}
									};
									$(".reset" + num).show();
									$("#file" + num).height(24);
									imgModalBig('#photo' + num, { 'width': 500, 'src': pictureFlag[num] });
								}
							}	
							var obj = {
								"bizType": 5,
								"enterpriseCode": enterpriseCode, //组织机构代码 或 统一社会信用代码（优先）
								"urls": "["+data+"]"
							}
							var urls="?urls="+obj.urls+"&bizType="+obj.bizType+"&enterpriseCode="+obj.enterpriseCode
							service.attach(obj,urls).done(function(res) {
								if(res.code == 0) {
									
								} else {
									pictureFlag[num]=1;
									bootbox.alert(data.msg)
								}
							})
						} else {
							var dialog = bootbox.alert({
								className: "uploadPhoto",
								message: data.msg,
							})
							return;
						}
					},
					error: function(data) {
						var dialog = bootbox.alert({
							className: "uploadPhoto",
							message: (data.msg || "网络异常，请稍后再试"),
						})
						return;
					},
					complete: function(eve) {
						setTimeout(function() {
							$(eve.target).parent().removeClass("form");
							var navigatorName = "Microsoft Internet Explorer"; 
							if(navigator.appName == navigatorName){
								$(".formPub").remove();
							}else{
							    $(".formPub").remove();
							}
						}, 100);
					},
				})
			}, 200)
		},
		goStep4: function() {
			for(var i = 0; i < pictureFlag.length; i++) {
				if(pictureFlag[i] == 0) {
					var dialog = bootbox.alert({
						className: "uploadPhoto",
						message: "请上传全部图片",
					})
					return;
				}
			};
			for(var i = 0; i < pictureFlag.length; i++) {
				if(pictureFlag[i] == 1) {
					var dialog = bootbox.alert({
						className: "uploadPhoto",
						message: "图片保存失败",
					})
					return;
				}
			};
			var data={
				"status":0,
				"enterprise_code":enterpriseCode
			};
			service.updateStatus(data).done(function(data){
				if(data.code==0){
					localStorage.removeItem("enterpriseCode")
					localStorage.regStep="#step4";
					window.open('register.html#step4', '_self');
				}else{
					bootbox.alert(data.msg);
				}
			})
			
		}
    });
    return main;
});
