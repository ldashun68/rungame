
declare namespace wx{ 
        /**胶囊位置 */
        export function getMenuButtonBoundingClientRect();
        /**提示框 */
        export function showModal(data:any);
        /*** 提示*/
        export function showToast(data:any);
        /*** 使手机发生较短时间的振动（15 ms）*/
        export function vibrateShort();
        /*** 使手机发生较长时间的振动（400 ms)*/
        export function vibrateLong();
        /** 跟新小游戏 */
        export function getUpdateManager();
        /** 系统参数 */
        export function getSystemInfoSync();
        /**插屏 */
        export function createInterstitialAd(data:any);
        /** */
        export function onShareAppMessage(data:any);
        export function shareAppMessage(data:any);
        /**获取小游戏启动时的参数 */
        export function getLaunchOptionsSync():any;
        /**隐藏loging图标 */
        export function hideLoading();
        /**显示loging图标 */
        export function showLoading(opt:any);
        /**拉起客服 */
        export function openCustomerServiceConversation(opt:any)
        /**订阅消息 */
        export function requestSubscribeSystemMessage(opt:any);
        /**一次型订阅 */
        export function requestSubscribeMessage(opt:any)
        /**获取用户的当前设置 */
        export function getSetting(opt:any)
        /**微信服务器登录 */
        export function login(opt:any);
        /**调用接口 */
        export function request(opt:any);
        /**分包 */
        export function loadSubpackage(opt:any);

        export function getData(v1:any, v2:any);
}

//--小萌牛统计平台
declare namespace ws{ 
        /**SDK初始化 */
        export function init(data:any);
        /** 登录*/
        export function login();
        /**登录返回 */
        export function onLoginComplete(callbreak:Function);
        /**返回平台配置信息 */
        export var conf:any;
        /** 用户数据保存*/
        export var user:any;
        /**登录状态 */
        export function  getLoginStatus();
        /**获得数据 */
        export function getData(key:string,data:any);
        export function setData(key:string,data:any);
        export function postData();
        //**分享 */
        export function share(opt:any);
        /**激烈视频拉取 */
        export function createVideo(opt:any);
        /**显示提示框 */
        export function alert(content:string);
        /**获得 */
        export function getGameAd(opt:any);
        /**跳转 */
        export function tapGameAd(opt:any);
        /**打开banner */
        export function createBanner(opt:any);
        /**关闭banner */
        export function closeBanner(pos:string);
        /**事件埋点 */
        export function traceEvent(key:string);
        /**事件埋点 */
        export function traceEvent(key:string,data:any);
        /**隐藏 */
        export function onHide(back:Function);
        /**显示 */
        export function onShow(back:Function);
        /**邀请好友列表 */
        export function getInviteCount(opt:any);
        /** 订阅消息 */
        export function subscribeMessage(pot:any);
        /**
         * 开始录屏
         * @param time 时长
         * @param typ 0：自动 1：手动
         */
        export function createRecord(time:number,typ:number);
        /**结束录屏 */
        export function stopRecord(typ:number);
}

declare namespace tt{ 
        /**胶囊位置 */
        export function getMenuButtonBoundingClientRect();
        /**提示框 */
        export function showModal(data:any);
        /*** 提示*/
        export function showToast(data:any);
        /*** 使手机发生较短时间的振动（15 ms）*/
        export function vibrateShort();
        /*** 使手机发生较长时间的振动（400 ms)*/
        export function vibrateLong();
        /** 跟新小游戏 */
        export function getUpdateManager();
        /** 系统参数 */
        export function getSystemInfoSync();
        /**插屏 */
        export function createInterstitialAd(data:any);
        /** */
        export function onShareAppMessage(data:any);
        /**获取小游戏启动时的参数 */
        export function getLaunchOptionsSync():any;
        /**隐藏loging图标 */
        export function hideLoading();
        /**显示loging图标 */
        export function showLoading(opt:any);
        /**登录 */
        export function login(opt:any);
}

//module.exports = wx;