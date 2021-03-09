/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

if (typeof wx != "undefined") {
    wx.loadSubpackage({
        name: 'sub1', // name 可以填 name 或者 root
        success: function(res) {
            window.wx.loadSubpackage({
                name: 'sub2', // name 可以填 name 或者 root
                success: function(res) {
                    // 分包加载成功后通过 success 回调
                    wx.loadSubpackage({
                        name: 'sub3', // name 可以填 name 或者 root
                        success: function(res) {
                            // Tool.instance.loadScene3D = true;
                            wx.loadSubpackage({
                                name: 'sub4', // name 可以填 name 或者 root
                                success: function(res) {
                                    
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
else {
    //-----libs-begin-----
    loadLib("libs/min/laya.core.min.js")
    loadLib("libs/min/laya.ani.min.js")
    loadLib("libs/min/laya.ui.min.js")
    loadLib("libs/min/laya.d3.min.js")
    loadLib("libs/min/laya.physics3D.min.js")
    //-----libs-end-------
    loadLib("js/bundle.js");
}