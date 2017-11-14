define('jqueryPlaceholder',[
    'jquery'
], function(jQuery) {
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
})