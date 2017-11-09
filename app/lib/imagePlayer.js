/*
    require : jquery.js && jquery.mousewheel.min.js
*/
$.extend({
    initImagePlayer:function(options){
        var defaults={
            list:[],//图片数组
            index:0,//展示图片下表
            status:0,//旋转状态
            companyData:{},//单位信息
            scale:10,//缩放倍数
            width:0,//保存原始缩放宽度
            height:0,//保存原始缩放高度
            maxWidth:554,//原始图片最大宽度
            maxHeight:400,//原始图片最大高度
            isMouseDown:false,//保存鼠标点住不放的状态
            shiftingLeft:0,//保存图片拖动时的偏移量
            shiftingTop:0,//保存图片拖动时的偏移量
            tempX:0,//保存鼠标点下图片时的坐标
            tempY:0,
            lastShiftingLeft:0,//上一次偏移剩下的偏移量
            lastShiftingTop:0,
            type:null//应用的场景
        }
        var settings=$.extend(defaults,options);
        function initCompanyData(){
            //属性为null或undefined置空
            for(key in settings.companyData){
                if(!settings.companyData[key]){
                    settings.companyData[key]=''
                }
            }
        }
        function getTemplate(){
            if(settings.type === 'compare'){
                var str=[
                    '<div class="elastic-licence">',
                    '<div class="elastic-licence-content">',
                    '<span class="close">x</span>',
                    '<div class="companyData clearfix">',
                    '<div class="companyData-item fl" title="">',
                    '印章名称：','<span id="img-player-sealname">',
                    '</span>','</div>',
                    '<div class="companyData-item fl" title="">',
                    '印章编码：','<span id="img-player-sealid">',
                    '</span>','</div>',
                    '</div>',
                    '<div class="elastic-licence-screen">',
                    '<div>',
                    '<img src="',settings.list[settings.index].path,'" class="elastic-img" id="elastic-img">',
                    '</div>',
                    '<span class="iconfont icon-rt last-img"></span>',
                    '<span class="iconfont icon-htbarrowright02 next-img"></span>',
                    '<span class="iconfont icon-enlarge-normal img-enlarge"></span>',
                    '<span class="iconfont icon-suoxiao img-narrow"></span>',
                    '<span class="iconfont icon-rotate-right img-rotate"></span>',
                    '</div>',
                    '</div>',
                    '</div>'
                ]                
            }else{
                var str=[
                    '<div class="elastic-licence">',
                    '<div class="elastic-licence-content">',
                    '<span class="close">x</span>',
                    '<div class="companyData clearfix">',
                    '<div class="companyData-item fl" title="',settings.companyData.name,'">',
                    '单位名称：',settings.companyData.name,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.businessLicenseNumber,'">',
                    '旧营业执照（15位）：',settings.companyData.businessLicenseNumber,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.uniformSocialCreditCode,'">',
                    '统一社会信用代码：',settings.companyData.uniformSocialCreditCode,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.typeText,'">',
                    '单位类型：',settings.companyData.typeText,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.natureText,'">',
                    '企业性质：',settings.companyData.natureText,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.legalName,'">',
                    '法人姓名：',settings.companyData.legalName,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.operatorName,'">',
                    '经办人姓名：',settings.companyData.operatorName,
                    '</div>',
                    '<div class="companyData-item fl" title="',settings.companyData.address,'">',
                    '单位地址：',settings.companyData.address,
                    '</div>',
                    '</div>',
                    '<div class="elastic-licence-screen">',
                    '<div>',
                    '<img src="',settings.list[settings.index].path,'" class="elastic-img" id="elastic-img">',
                    '</div>',
                    '<span class="iconfont icon-rt last-img"></span>',
                    '<span class="iconfont icon-htbarrowright02 next-img"></span>',
                    '<span class="iconfont icon-enlarge-normal img-enlarge"></span>',
                    '<span class="iconfont icon-suoxiao img-narrow"></span>',
                    '<span class="iconfont icon-rotate-right img-rotate"></span>',
                    '</div>',
                    '</div>',
                    '</div>'
                ];
            }
            return str.join(" ");
        }
        function setInfo(){
            if(settings.type ==='compare'){
                $('#img-player-sealname').text(settings.list[settings.index].sealName);
                $('#img-player-sealid').text(settings.list[settings.index].sealId);
            }
        }
        function destroyImagePlayer(){
            $(".img-rotate").off();
            $(".img-enlarge").off();
            $(".img-narrow").off()
            $(".last-img").off();
            $(".next-img").off()
            $('.elastic-licence-screen div').off();
        }
        function setImagePosition(){
            var el=$('.elastic-licence-screen img')
            // el.addClass('rotate-'+settings.status)
            var wrapWidth=$('.elastic-licence-screen').width()
            var wrapHeight=$('.elastic-licence-screen').height()
            var width=el.width();
            var height=el.height();
            el.css({
                left:(wrapWidth-width)/2+settings.shiftingLeft,
                top:(wrapHeight-height)/2+settings.shiftingTop,
            })
        }
        function enlargeImageSize(){
            settings.scale+=1;
            var el=$('.elastic-licence-screen img')
            el.css({
                width:settings.width*settings.scale/10,
                height:settings.width*settings.scale/10,
            })
            setImagePosition();
        }
        function narrowImageSize(){
            settings.scale-=1;
            var el=$('.elastic-licence-screen img')
            el.css({
                width:settings.width*settings.scale/10,
                height:settings.width*settings.scale/10,
            })
            setImagePosition();
        }
        function imageRotate(){
            settings.status=(settings.status+1)%4;
            $('.elastic-licence-screen img').removeClass();
            $('.elastic-licence-screen img').addClass('rotate-'+settings.status);
        }
        function moveImage(e){
            if(settings.isMouseDown){
                e.preventDefault();
                var obj=$('.elastic-licence-screen img');
                settings.shiftingLeft=e.pageX-settings.tempX+settings.lastShiftingLeft
                settings.shiftingTop=e.pageY-settings.tempY+settings.lastShiftingTop
                setImagePosition();
            }
        }
        
        function saveImageSize(){
            var el=$('.elastic-licence-screen img')
            var width=el.width();
            var height=el.height();
            var proportion=width/height;
            if(width>settings.maxWidth){
                width=settings.maxWidth;
                height=width/proportion
            }
            if(height>settings.maxHeight){
                height=settings.maxHeight;
                width=proportion*height;
            }
            settings.width=width;
            settings.height=height;
            settings.shiftingLeft=0;
            settings.shiftingTop=0;
            settings.scale=10;
            settings.status=0;
            el.css({
                width:settings.width,
                height:settings.height
            }).removeClass().addClass('rotate-'+settings.status)
        }
        function setLastImage(){
            if(settings.index>0){
                settings.index-=1;
                var el=$('.elastic-licence-screen img');
                el.css({
                    width:'auto',
                    height:'auto'
                }).attr('src',settings.list[settings.index].path)
                setInfo();
                saveImageSize();
                setImagePosition()
            }
        }
        function setNextImage(){
            if(settings.index<settings.list.length-1){
                settings.index+=1;
                var el=$('.elastic-licence-screen img');
                el.css({
                    width:'auto',
                    height:'auto'
                }).attr('src',settings.list[settings.index].path)
                setInfo();
                saveImageSize();
                setImagePosition()
            }
        }
        function initOperateBtns(){
            $(".img-rotate").click(function(){
                imageRotate()
            })
            $(".img-enlarge").click(function(){
                enlargeImageSize()
            })
            $(".img-narrow").click(function(){
                narrowImageSize()
            })
            $(".last-img").click(function(){
                setLastImage()
            })
            $(".next-img").click(function(){
                setNextImage()
            })

            $('.elastic-licence-screen div').mousewheel(function(ev,delta){
                if(delta>0){
                    enlargeImageSize()
                }else{
                    narrowImageSize()
                }
            })
            $('.elastic-licence-screen div').mousedown(function(e){
                settings.isMouseDown=true;
                settings.tempX=e.pageX;
                settings.tempY=e.pageY;
            }).mousemove(moveImage).mouseup(function(e){
                settings.isMouseDown=false;
                settings.lastShiftingLeft=settings.shiftingLeft
                settings.lastShiftingTop=settings.shiftingTop
            }).mouseout(function(){
                settings.isMouseDown=false;
                settings.lastShiftingLeft=settings.shiftingLeft
                settings.lastShiftingTop=settings.shiftingTop
            })
            $(".close,.elastic-licence").click(function(){
                destroyImagePlayer();
                $(".elastic-licence").remove();
            })
            $(".elastic-licence-content").click(function(e){
                e.stopPropagation();
            })
        }
        function init(){
            initCompanyData();
            var str=getTemplate();
            $("body").append(str);
            setInfo();
            saveImageSize();
            setImagePosition();
            initOperateBtns();
        }
        init();
    }
})