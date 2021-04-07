/**
 * 消息接口类
 */

import { OpenScene } from "../game/GameVO/DataType";

abstract class RabEvent {

    constructor()
    {
        this.OnInit();
    }

    protected abstract OnInit();

    /**
     * 监听消息
     * @param name 消息类型
     * @param callbreakFun 回调
     * @param caller 事件侦听函数的执行域
     */
    protected AddListenerMessage(name,callbreakFun){
        EventListener.getInstance().AddNotice(name, this, callbreakFun);
    }

    /**
     * 移除消息监听
     * @param name 消息类型
     * @param args 回调
     */
    protected RemoveListenerMessage(name,callbreakFun){
        EventListener.getInstance().RemoveNotice(name, this,callbreakFun);
    }

    /**
     * 发送消息
     * @param name 消息类型
     * @param args 参数
     */
    protected SendMessage(name,...args: any[])
    {
        EventListener.getInstance().Emit(name,args);
        // dispatchEvent(new Event(name));
    }

    protected onDestroy()
    {
        EventListener.getInstance().RemoveAllNotice(this);
    }

    protected OnRemove()
    {
        EventListener.getInstance().RemoveAllNotice(this);
    }
}

/**
 * 定义字典 
 */
class _Dictionary<T1,T2>
{
    private _arr:_List<KeyValuePair<T1,T2>>=null;
    private _arrTemp:KeyValuePair<T1,T2>=null;

    constructor() {
        this._arr=new _List<KeyValuePair<T1,T2>>();       
    }

    /**
     * 添加
     * @param _key 
     * @param _value 
     */
    public add(_key,_value):void{  
        this._arrTemp=new KeyValuePair<T1,T2>(_key,_value);
        this._arr.add(this._arrTemp);
    }

    /**
     * 获得
     * @param key 
     */
    public get<T1>(key):T2{
        for (let index = 0; index < this._arr.count; index++) {
            const element = this._arr.get(index);
            if(element.key==key)
            return element.value;
        }

        return null; 
    }

    /**
     * 移除
     * @param key 
     */
    public remove(key):_List<T2>{
        var temp=new _List<T2>();
        for (let index = 0; index < this._arr.count; index++) {
            const element = this._arr.get(index);  
            if(element.key==key)
            {
                var v= this._arr.remove(element);
                temp.add(v);
            }        
        }
        return temp;
    }

    /**
     * 是否存在
     * @param key 
     */
    public contain<T1>(key){
        if(this.get<T1>(key)!=null)
        {
            return true;
        }
        return false;
    }

    /**
     * 长度
     */
    public get count() : number {
        return  this._arr.count;
    }

    /**清楚 */
    public clear(){
        this._arr.clear();
    }

    forEach(callbackfn: (value: KeyValuePair<T1,T2>, index: number, array: KeyValuePair<T1,T2>[]) => void, thisArg?: any){
        this._arr.forEach(callbackfn);
    };
}

class KeyValuePair<T1,T2>{

    public key: T1 = null;
    public value: T2 = null;

    constructor (key,value) {
        this.key=key;
        this.value=value;
    }
}

//定义列表 提供相关操作
export class _List<T>{

    private _arr:Array<T>=null;

    constructor()
    {
        this._arr=new Array<T>();
        // this._arr.forEach
    }

    public add(value){
        this._arr.push(value);
    }

    public get(index:number){
        return this._arr[index];
    }

    public contain(value):boolean{
        return this._arr.indexOf(value)!=-1;
    }

    public get count():number{
        return this._arr.length;
    }

    public remove(value:T):T{
        var index=this._arr.indexOf(value);
        if(index==-1)
        return null;
        this._arr.splice(index,1);
        return value;
    }

    public removeIndex(index:number){
        if(index> -1)
        {
            this._arr.splice(index,1);
        }
    }

    public clear(){
        for (let index = this._arr.length-1; index >=0; index--) {
            this._arr.pop();           
        }
    }

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any){
        this._arr.forEach(callbackfn,thisArg);
    };
}

/**
 * 游戏基础数据
 */
export interface RabGameInfo  {
    /**音效 0关闭 1开启 */
    audio:number,
    /**背景音效 0关闭 1开启 */
    music:number,
    /**振动 0关闭 1开启 */
    vibrate:number,
    /**上次打开时间 */
    lastTime:any,
}

interface IRabObj {
    onInit();
    onDestroy();
}

interface IRabView extends IRabObj {
    RefreshView(data:Array<any>):void;
    getMyView<T>():T;
    onShow():void;
    onResize():void;
    onHide():void;
    OnCloseView():void;
}

class UtilTool {

    private debug: boolean = true;

    public get isMobil():boolean
    {
        if(typeof wx != "undefined")
        {
            return true;
        }
        return false;
    }

    /**
     * 格式化时间 00：00
     * @param time 
     */
    public UpdateTime(time:number, isHour: boolean = false):string{
        time = time<0?0:time;
        let t = Math.ceil(time);
        let m = Math.floor(t / 60);
        let s = Math.floor(t % 60);

        if (isHour == true) {
            t = Math.floor(t / 3600);
            m = time - t*3600;
            m = Math.floor(m / 60);
        }

        let hs: string= (t>=10)?t+"":("0"+t);
        let ms: string = (m>=10)?m+"":("0"+m);
        let ss: string = (s>=10)?s+"":("0"+s);

        let timeStr: string;
        if (isHour == true) {
            timeStr = hs + ":" + ms + ":" + ss;
        }
        else {
            timeStr = ms + ":" + ss;
        }
        if (time <= 0) {
            if (isHour == true) {
                timeStr = "00:00:00";
            }
            else {
                timeStr = "00:00";
            }
        };
        return timeStr; 
    }

    public log(message?: any, ...optionalParams: any[]) {
        if(this.debug)
        {
           console.log(message,...optionalParams);
        }
    }

    /**
     * 科学计数法
     * @param value 数值
     * @param fix 保留小数
     */
    public formatter (value,fix = 2){
        let bits = ["M","B","T","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR"];
        if(value >= 100000000){
            fix = 3;
            bits = ["AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR"];
            for(let i=bits.length; i>0; i--){
                if(value >= Math.pow(100000000,i)){
                   return `${parseFloat((value/Math.pow(100000000,i)).toFixed(fix))+bits[i-1]}`;
                }
            }
        }
        else if(value >= 100000){
            for(let i=bits.length; i>0; i--){
                if(value >= Math.pow(10000,i)){
                   return `${parseFloat((value/Math.pow(10000,i)).toFixed(fix))+bits[i-1]}`;
                }
            }
        }
        return `${parseFloat(value.toFixed(fix))}`;
    }

    /**浅拷贝 */
    public objClone(obj:any):any{
        var dst:any = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                dst[prop] = obj[prop];
            }
        }
        return dst;
    }
    /**
     * 数据补全
     * @param org 原数据
     * @param type 目标数据
     */
    public supplement(org:any,type:any):any{
        Object.keys(type).forEach(function(key){
            if(org[key] != undefined){
                org[key] = type[key];
            }
        });
        return org;
    }

    /**
     * 计算两个时间的相差的天数
     * @param oldTime 
     * @param curTime 
     */
    public timestampToDay(oldTime:number,curTime:number){
        let d1 = Math.floor(curTime / (24 * 3600 * 1000));
        let d2 = Math.floor(oldTime / (24 * 3600 * 1000));
        return d1 - d2;
    }

    /**
     * 是否空字符串
     * @param str 
     */
    public isEmpty(str: string){
        if(str != null && str != "")
        {
            return true;
        }
        return false;
    }
}

class MusicManager {

    private static _instance:MusicManager;

    public static getInstance():MusicManager{
        if(this._instance == null){
            this._instance = new MusicManager();
        }
        return this._instance;
    }

    /**
     * 设置音乐音效状态
     * @param music  1:正常0：不播放
     * @param audio 1:正常0：不播放
     */
    setState(music, audio)
    {
        Laya.SoundManager.musicMuted = (music == 0)? false:true;
        Laya.SoundManager.soundMuted = (audio == 0)? false:true;
    }

    playMusic (url: string, volume: number = 0.2): void {
        Laya.SoundManager.musicVolume = volume;
        Laya.SoundManager.playMusic(url);
    }

    playSound (url: string, loop: number = 1, volume: number = 0.5, callback: Laya.Handler = null): void {
        Laya.SoundManager.soundVolume = volume;
        Laya.SoundManager.playSound(url, loop, callback);
    }

    stopSound (url: string): void {
        Laya.SoundManager.stopSound(url);
    }
}

/**
 * 游戏状态
 */
export enum GameState{
    init,
    /**游戏 未开始 */
    start,
    /**游戏中 */
    gameing,
    /**游戏暂停 */
    pause,
    /**结束 */
    over,
    /**退出 */
    exit
}

/**游戏平台渠道接入 */
class GameChannel {

    private _Manager:RabManager;

    constructor()
    {
        this._Manager = RabGameManager.getInterest().getMyManager<RabManager>();
    }

    get myManager(){
        if(!this._Manager)
        {
            this._Manager = RabGameManager.getInterest().getMyManager<RabManager>();
        }
        return this._Manager
    }

    onInitSDk()
    {
        rab.HTTP.init(this.myManager.gameConfig.serverurl);
    }

    /**
     * 初始化获得保存数据
     * @param gameInfo 数据对象
     * @param key 键值
     */
    initData(callback: Function)
    {
        let gameInfo: any = null;
        if(typeof wx != "undefined") {
            if(this.myManager.userInfo) {
                rab.HTTP.get("api/player",this.myManager.userInfo.token,(data)=>{
                    if (data.data != null && data.data.gamedata != null) {
                        gameInfo = JSON.parse(data.data.gamedata);
                    }

                    callback && callback(gameInfo);
                    rab.Util.log('初始化获得保存数据',data);
                });
            }
            else {
                callback && callback(gameInfo);
            }
        }
        else {
            var info = Laya.LocalStorage.getItem("gameInfo"); 
            if(info) {
                let data = JSON.parse(info);
                gameInfo = rab.Util.supplement(gameInfo,data);

                callback && callback(gameInfo);
                rab.Util.log('初始化获得保存数据===',data)
            }
        }
        
        rab.Util.log('初始化获得保存数据',gameInfo)
    }

    /**
     * 保存用户数据
     * @param gameInfo 
     * @param key 
     */
    SaveData(gameInfo:any,key:string = "gameinfo")
    {
        if(typeof wx != "undefined" && this.myManager.userInfo&&this.myManager.userInfo.token)
        {
            rab.HTTP.post("api/player",{
                "data":JSON.stringify(gameInfo),
                "token":this.myManager.userInfo.token
            },this,(data)=>{
                console.log("保存数据：",data);
            });
        }else{
            Laya.LocalStorage.setItem(key,JSON.stringify(gameInfo));
        }
    }

    onHide(breakcall:Function)
    {
        if(rab.Util.isMobil)
        {
            if(typeof wx != "undefined")
            {
                // wx.onHide(breakcall);
            }else{
                console.log("未接入平台");
            }
        }
    }

    onShow(breakcall:Function)
    {
        if(rab.Util.isMobil)
        {
            if(typeof wx != "undefined")
            {
                // wx.onShow(breakcall);
            }else{
                console.log("未接入平台");
            }
        }
    }

    /**
     * 在线跟新新版本
     */
    UpdateGame(call?:Function)
    {
        rab.wxSdk.UpdateGame(call);
    }

    /**
     * 激励点
     * @param pos 位置
     * @param way 方式 0:无 1：分享 2：视频 其他：功能未开放
     * @param succeed 成功
     * @param fail 失败
     */
    public stimulate(pos:string,succeed:Function,fail?:Function){
        let way = this.myManager.gameConfig.config[pos];
        switch(way){
            case 0:
                succeed();
                break;
            case 1:
                this.createShare(pos,succeed,fail);
                break;
            case 2:
                this.createVideo(pos,succeed,fail);
                break;
            default:
                fail&&fail();
                rab.wxSdk.showToast("该功能未开发!");
        }
    }

    /**
     * 分享
     * @param pos 位置
     * @param succeed 成功
     * @param fail 失败
     */
    createShare(_pos:string,succeed?:Function,fail?:Function,imageUrl?:string,title?:string,query?:any)
    {
        if(this.myManager.gameConfig.config.allow_share){
            if(typeof wx !='undefined')
            {
                wx.shareAppMessage({
                    title: '我在招商缤FUN跑酷成功超越障碍，快来看看吧！',
                    imageUrl: ''
                });
            }else
            {   
                console.log("未接入平台");
            }
        }else{
            rab.wxSdk.showToast("功能未启动");
            fail&&fail();
        }
    }

    /**
     * 视频
     * @param pos 位置
     * @param succeed 成功
     * @param fail 失败
     */
    createVideo(pos:string,succeed?:Function,fail?:Function)
    {
        if(typeof wx != 'undefined')
        {
            if(this.myManager.gameConfig.config.allow_video)
            {
                
            }else{
                rab.wxSdk.showToast("视频功能未启动");
                fail&&fail();
            }
            
        }else{
            console.log("未接入平台");
        }
        
    }

    private BannerAd: any;
    /**
     * 创建banner
     * @param pos 位置
     */
    public createBanner(_pos:string)
    {
        console.log("创建banner",_pos);
        if(_pos != "")
        {
            if (typeof wx != "undefined")
            {
                
            }else
            {
                console.log("未接入平台");
            }
        }
    }
    
    /**
     * 关闭banner
     */
    public closeBanner(pos:string="")
    {
        if(rab.Util.isMobil && pos != "")
        {
            if(typeof wx != 'undefined')
            {
                // wx.closeBanner(pos);
            }else{
                console.log("未接入平台");
            }
        }
    }

    public CreateInterstitialAd(pos:string)
    {
        
    }

    /**是否是IsPhoneX */
    IsPhoneX(): boolean {
        if (Laya.stage.height < 0.5) {
            return true;
        }
        return false;
    }

   /**
    * 返回导量列表
    * @param pos 
    */
    getAdGame(pos:string,success:Function,count:number = 10) {
        let adlist = null;
        if(typeof wx != 'undefined') {
            
        }
        else{
            console.log("导量未接平台");
        }
    }

    /**
    * 跳转到游戏
    * @param item 
    */
    onTapAdGame(pos:string,item:any,success?:Function,fail?:Function)
    {
        if(rab.Util.isMobil)
        {
            if(typeof wx != 'undefined')
            {
                
            }else{
                console.log("未接入平台");
            }
        }
    }

    /**埋点显示 */
    traceEvent(key:string,data?:any)
    {
        if(typeof wx != 'undefined')
        {
            if(data)
            {
                // wx.traceEvent(key,data);
            }else{
                // wx.traceEvent(key);
            }
           
        }
        console.log("埋点：",key);
    }

     /**
    * 拉起客服请求
    * @param title  标题 点击领取领取体力
    * @param img 图 https://maguai-xxz.oss-cn-beijing.aliyuncs.com/MIniGame/basicprofile.jpeg
    */
   openCustomerServiceConversation(title:string,img:string,success?:Function,fail?:Function)
   {
        if(typeof wx != 'undefined')
        {
            
            rab.wxSdk.openCustomerServiceConversation(title,img,(res)=>{
                this.myManager.iscustomerService =1;
                success&&success(res)
            },(res)=>{
                this.myManager.iscustomerService =0;
                fail&&fail(res);
            });
        }
   }

   

}

abstract class RabManager extends RabEvent{

    public isNew:boolean = false;
    /**是否经过引导 */
    public isGuid:boolean; 
    /**上次登陆日期 */
    private lastTime:any = {};
    /**每日奖励是否已经领取 */
    public everyDayGift:number = 0;
    /**
     * 游戏数据保存类型
     */
    protected _gameType:string = "";
    /**
     * 状态
     */
    protected state:GameState;
    /**游戏数据 */
    public gameInfo:RabGameInfo;
    /**
     * 游戏配置表
     */
    public gameConfig:RabGameConfig;
    /**随机名称 */
    protected randomUserName:Array<string>;

    /**新手引导未完成是否保存数据 */
    protected isSaveGuidDate:boolean; 

    /**配置表地址 */
    protected configPath:string;
    /**
     * 小游戏启动的场景ID
     */
    protected sceneId:number;

    public iscustomerService:number;

    /**服务器返回用户数据 */
    public userInfo:SerUserInfo;

    /**
     * 初始化
     */
    OnInit()
    {
        this.isSaveGuidDate = true;
        rab.SDKChannel.onShow((res)=>{
            this.sceneId =  res.scene;
            console.log("场景=====id==OnInit========",res.scene);
        })
        this.gameInfo = {
            music:1,
            audio :1,
            vibrate :1,
            lastTime : {},
        }
        this.onInitManaager();
        this.state = GameState.init;
    }

    protected abstract onInitManaager();

    /**游戏退出 */
    protected abstract onHide();

    /**
     * 初始化数据
     */
    protected InitGameInfo(callback: Function) {
        this.state = GameState.init;
        rab.SDKChannel.initData((gameInfo: any) => {
            if (gameInfo != null) {
                this.gameInfo = gameInfo;
            }
            rab.Util.log("获得数据",this.gameInfo);

            this.lastTime = this.gameInfo.lastTime;
            this.isGuid = this.isNoob();
            rab.SDKChannel.onHide(()=>{
                this.SaveData(-1)
            })
            rab.SDKChannel.onShow((res)=>{
                this.sceneId =  res.scene;
                console.log("场景=====id==========",res.scene);
                EventListener.getInstance().Emit(RabNotity.GameMessage_GameShowMessage,res.scene);
            });

            callback && callback();
        });
    }

    /**
     * 获得启动小游戏类型
     */
    public getSceneTyp():OpenScene
    {
        if(this.iscustomerService == 1)
        {
            //客服
            return OpenScene.customer;
        }
        if(this.sceneId  == 1131)
        {
            //浮窗
            return OpenScene.float;

        }else if(this.sceneId  == 1089)
        {
            //我的小程序
            return OpenScene.collection;

        }else if(this.sceneId == 1107)
        {
            //订阅消息打开小游戏
            return OpenScene.subscribe;
        }else if(this.sceneId == 1154)
        {
            //朋友圈内打开“单页模式”
            return OpenScene.moments;
        }
    }

    /**
     * 保存数据
     */
    public SaveData(typ:number)
    {
        rab.Util.log(typ,"===保存数据====",this.gameInfo);
        this.onHide();
        rab.SDKChannel.SaveData(this.gameInfo,this._gameType);
    }

    //--------------设置info--------------
     /**
     * 
     * @param typ 
     * @param val 
     */
    public setGameInfo(typ:string,val:number)
    {
        this.gameInfo[typ] = val;
    }

    /**
     * 添加金币
     * @param val 金币
     */
    public addProp(key:string,val:number)
    {
        this.gameInfo[key] += val;
        this.SendMessage(RabNotity.GameMessage_UpdateUserInfo,this.gameInfo[key]);
    }

    /**
     * 扣除属性
     * @param val 
     */
    public offProp(key:string,val:number):boolean
    {
        if(this.gameInfo[key] >= val)
        {
            this.gameInfo[key] -= val;
            this.SendMessage(RabNotity.GameMessage_UpdateUserInfo,this.gameInfo[key]);
            return true;
        }
       return false;
    }
    
    /**
     * 设置背景音乐
     * @param val 
     */
    public setMusic()
    {
        this.gameInfo.music = this.gameInfo.music?0:1;
        rab.MusicManager.setState(this.gameInfo.music, this.gameInfo.audio);
    }

    /**
     * 设置音效
     * @param val 
     */
    public setAudio()
    {
        this.gameInfo.audio = this.gameInfo.audio?0:1;
        rab.MusicManager.setState(this.gameInfo.music, this.gameInfo.audio);
    }

    /**
     * 设置振动
     * @param val 
     */
    public setVibrate()
    {
        this.gameInfo.vibrate = this.gameInfo.vibrate?0:1;
    }

    /**获取是否是同一天 */
    public getIsNewDay(): boolean {
        let count: number = 0;
        for (let index in this.gameInfo.lastTime) {
            if (count < 4) {
                if (this.gameInfo.lastTime[index] != this.lastTime[index]) {
                    return false;
                }
                else {
                    count++;
                }
            }
        }
        return true;
    }

    /**是否是新手 */
    protected isNoob():boolean{ 
        return this.lastTime.year == null;
    }
}

/**
 * 游戏管理器
 */

class RabGameManager {

    private static _interest:RabGameManager;
    private currManager:any;

    public static getInterest():RabGameManager
    {
        if(!this._interest)
        {
            this._interest =new RabGameManager();
        }
        return this._interest;
    }

    /**
     * 添加一个游戏管理器
     * @param manager 
     */
    AddManager(manager:RabManager)
    {
        this.currManager = manager;
    }

    /**
     * 返回当前游戏管理器
     * @param manager 
     */
    public getMyManager<T>(manager?:string):T
    {
        return (this.currManager) as T;
    }
}

class EventListener {
    static eventDispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();
    static _instance: EventListener;

    public static getInstance() {
        if (EventListener._instance == null) {
            EventListener._instance = new EventListener();
        }
        return EventListener._instance;
    }

    ///注册事件
    public Emit(InName, ...agv:any[]) {
        //派发事件
        // console.log("派发事件",InName,agv);
        EventListener.eventDispatcher.event(InName, agv);
    }

    //侦听事件
    public AddNotice(InName, caller, listener: Function, arg?: any[]): void {
        // console.log("侦听事件",InName);
        EventListener.eventDispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
    }

    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * @param InName		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @return 此 EventDispatcher 对象。
     */
    public RemoveNotice(InName, caller, listener: Function)
    {
        EventListener.eventDispatcher.off(InName,caller,listener);
    }

    /**
     * 移除caller为target的所有事件监听
     * @param	caller caller对象
     */
    public RemoveAllNotice(caller)
    {
        EventListener.eventDispatcher.offAllCaller(caller);
    }
}

abstract class RabObj implements IRabObj{

    protected _bannerPos:string = "";
    /** 我的管理器 */
    protected myManager:RabController;
    protected msgList:object;
    protected _state:GameState;
    
    constructor()
    {
        this.myManager = RabGameManager.getInterest().getMyManager<RabController>();
        this.msgList = {};
        this._state = GameState.init;
        this.onInit();
    }
    
    /**
     * 初始化方法
     */
    abstract onInit();

    /**
     * 监听消息
     * @param name	消息类型
     * @param callbreakFun	回调
     * @param caller	事件侦听函数的执行域
     */
    protected AddListenerMessage(name,callbreakFun){
        EventListener.getInstance().AddNotice(name, this, callbreakFun);
    }

    /**
     * 移除消息监听
     * @param name	消息类型
     * @param args	回调
     */
    protected  RemoveListenerMessage(name,callbreakFun){
        EventListener.getInstance().RemoveNotice(name, this,callbreakFun);
    }

    /**
     * 发送消息
     * @param name		消息类型
     * @param args	参数
     */
    protected SendMessage(name,...args: any[])
    {
        EventListener.getInstance().Emit(name,args);
    }

    onDestroy(): void {
        EventListener.getInstance().RemoveAllNotice(this);
    }

    ///获得字节点
    protected findChild(parent:Laya.Node, path:string)
    {
        var paths = path.split("/");
        var child = parent;      
        if(paths)
        {
            for (var i = 0; i < paths.length; ++i)
            {
                child = parent.getChildByName(paths[i]);
                parent = child;
            }
        }  
        return child;
    }

    /**
     * 长震动
     */
    protected vibrateLong()
    {
        if(rab.Util.isMobil && this.myManager.gameInfo.vibrate== 1)
        {
            rab.wxSdk.vibrateLong();
        }
    }

    /**
     * 短震动
     */
    protected vibrateShort()
    {
        if(rab.Util.isMobil && this.myManager.gameInfo.vibrate == 1)
        {
            rab.wxSdk.vibrateShort();
        }
    }

    /**
     * 小游戏胶囊位置
     */
    protected getMenuButtonBoundingClientRect()
    {
        if(rab.Util.isMobil)
        {
            return rab.wxSdk.getMenuButtonBoundingClientRect();
        }
        return null;
    }
}

abstract class RabView extends RabObj implements IRabView {
    /**
     * 当前页面对象子类必须实现的对象
     */
    protected abstract m_currView:any;
    private m_view:any;
    private designScaleBig:number;
    private designScaleSmall:number;
    protected m_bg:Laya.Image;
    protected viewUrl:string;
    /**页面传参 */
    protected _viewdata:Array<any>;

    onInit()
    {
        this.LoadView();
    }

    /**
     * 页面传参
     * @param path 
     * @param value 
     */
    public ViewData(path:string,value:Array<any>){
        this.viewUrl = path;
        this._viewdata = value;
    }

    /** 
     * 加载界面
     */
    protected abstract LoadView();

    /**
     * 返回当前页面
     * @param T
     * @param return 返回当前页面
     */
    public getMyView<T>():T {
        return <T>this.m_view;
    }
    
    /**
     * 创建页面资源
     * @param c		对象
     * @param T	对应的页面类型，主要是用来快速定位的
     * @return 当前创建页面 
     */
    protected create<T>(c: {new(): T}) { 
        this.m_view = new c();
        this.m_view.createChildren();
        this.m_currView = <T>this.m_view;
        this.onShow();
        this.InitView();
        return <T>this.m_view;
    }

    /**
     * 初始界面。
     */
    protected abstract InitView();

    /**
     * 刷新页面对外刷新接口
     */
    public RefreshView(data:Array<any>)
    {
        this._viewdata = data;
        this.onShow();
        this.OnRefreshView();
    }

    /**
     * 刷新页面
     */
    protected abstract OnRefreshView();

    /**
     * 重新显示界面
     */
    onShow() {
        Laya.stage.addChild(this.getMyView());
        this.m_view.visible = true;
        this.m_bg = this.m_currView.bg;
        let scaleW = Laya.stage.width/Laya.stage.designWidth;
        let scaleH =  Laya.stage.height/Laya.stage.designHeight;
        this.designScaleBig = Math.max(scaleH,scaleW);
        this.designScaleSmall = Math.min(scaleH,scaleW);
        this.onResize();
        this.createBanner();
        this.onShowLanguage();
    }

    /**语言包 */
    protected onShowLanguage()
    {

    }

    /**
     * 隐藏界面
     */
    onHide() {
        Laya.timer.clearAll(this);
        if(this.m_view) {
            this.m_view.visible = false;
        }
        Laya.stage.removeChild(this.getMyView());
        this.closeBanner();
    }

    /**
     * 设置界面分辨率
     */
    onResize() {
        this.m_view.scale(this.designScaleSmall, this.designScaleSmall);
        if(this.m_bg)
        {
            this.m_bg.scale(this.designScaleBig, this.designScaleBig);
        }
    }
    
    /**
     * 关闭界面
     */
    OnCloseView()
    {
        this.closeBanner();
        rab.UIManager.onCloseView(this.viewUrl);
        Laya.timer.clearAll(this);
    }

    /**
     * 销毁界面
     */
    onDestroy(): void {
        super.onDestroy();
        this.closeBanner();
        Laya.timer.clearAll(this);
        if(this.m_view)
        {
            <Laya.View>this.m_view.destroy();
        }
    }

    /**移除界面 */
    OnRemove()
    {
        this.onHide();
        this.onDestroy();
    }

    ///-------------------------SDK------------------------
    /**
     * 创建banner
     * @param pos 位置
     */
    protected createBanner()
    {
        console.log("创建banner===========",this._bannerPos);
        rab.SDKChannel.createBanner(this._bannerPos);
    }
    
    /**
     * 关闭
     */
    protected closeBanner()
    {
        rab.SDKChannel.closeBanner(this._bannerPos);
    }
}

class ViewManager{

    private UIList:_Dictionary<string,RabView>= new _Dictionary<string,RabView>();

    /**
     * 创建页面UI
     * @param path 
     * @param optionalParams 
     */
    onCreateView(path:string,...optionalParams: any[])
    {
        if(this.UIList.contain(path))
        {
            this.UIList.get(path).onShow();
            this.UIList.get(path).RefreshView(optionalParams);
        }else{
            console.log("==创建页面==",path);
            var view: RabView = <RabView>(rab.RabViewConfig.getRegClass(path));
            Laya.stage.addChild(view.getMyView());
            this.UIList.add(path,view);
            this.UIList.get(path).ViewData(path,optionalParams);
        }
    }

    /**
     * 隐藏页面
     * @param Resname 
     */
    onHideView(Resname:string)
    {
        if(this.UIList.contain(Resname))
        {
            this.UIList.get(Resname).onHide();
        }
    }

    /**
     * 关闭页面
     * @param Resname 
     */
    onCloseView(Resname:string)
    {
        if(this.UIList.contain(Resname))
        {
            this.UIList.get(Resname).OnRemove();
            this.UIList.remove(Resname);
        }
    }

    /**
     * 页面是否显示
     */
    isShowView (Resname: string): boolean {
        if (this.UIList.contain(Resname) == true) {
            return (this.UIList.get(Resname).getMyView() as Laya.Scene).visible;
        }
        return false;
    }

    /**页面是否存在 */
    isContainView (Resname: string): boolean {
        return this.UIList.contain(Resname);
    }
}

export interface resCls {
    /**路径 标记 */
    className:string;
    /**实际类型 */
    classDef:any;
}

/**
 * 一个工具类
 */
class RabViewConfig {

    //**参考Laya的类工具类来实现 */
    private _clsList:_Dictionary<string,any>= new _Dictionary<string,any>();
    
    constructor()
    {
        this._clsList = new _Dictionary<string,any>();
    }

    /**
     * 注册 Class 映射，方便在class反射时获取。
     * @param className 映射的名字或者别名。
     * @param classDef 类的全名或者类的引用，全名比如:"laya.display.Sprite"。
     */
    public regClass(className:string,classDef:any):void
    {
        if(this._clsList.contain(className))
        {
            console.log("重复标签了");
        }else{
            this._clsList.add(className,classDef);
        }
        
    }

    /**
     * 根据类名短名字注册类，比如传入[Sprite]，功能同regClass("Sprite",Sprite);
     * @param classes 类数组
     */
    public regShortClassName(classes:Array<resCls>):void
    {
        for(var i = 0;i<classes.length;i++)
        {
            this.regClass(classes[i].className,classes[i].classDef);
        }
    }

    /**
     * 返回注册的 Class 映射。
     * @param className 映射的名字。
     */
    public getRegClass(className:string):any
    {
        if(this._clsList.contain(className))
        {
            return new (this._clsList.get(className))();
        }else
        {
            console.log("未找注册该类型");
            return null;
        }
    }
}

/**2d组件 */
class RabComponent extends Laya.Script implements IRabObj {

    /**
     * 初始化
     */
    onInit() {

    }

    /**
     * 监听消息
     * @param name	消息类型
     * @param callbreakFun	回调
     * @param caller	事件侦听函数的执行域
     */
    protected AddListenerMessage(name,callbreakFun){
        EventListener.getInstance().AddNotice(name, this, callbreakFun);
    }

    /**
     * 移除消息监听
     * @param name	消息类型
     * @param args	回调
     */
    protected  RemoveListenerMessage(name,callbreakFun){
        EventListener.getInstance().RemoveNotice(name, this,callbreakFun);
    }

    /**
     * 发送消息
     * @param name		消息类型
     * @param args	参数
     */
    protected SendMessage(name,...args: any[])
    {
        EventListener.getInstance().Emit(name,args);
    }

    onDestroy(): void {
        EventListener.getInstance().RemoveAllNotice(this);
    }
}

/**
 * 模拟U3D的GameObject
 */
abstract class GameObject extends Laya.Script3D implements IRabObj{

    private _gameObject:Laya.MeshSprite3D;
    private _transform:Laya.Transform3D;
    private localPosition:Laya.Vector3;

    onAwake()
	{
		this._gameObject = (<Laya.MeshSprite3D>(this.owner));
        this._transform = this.gameObject.transform;
        this.onInit();
    }

    /** 返回当前对象 MeshSprite3D */
    get gameObject(){
        if(!this._gameObject)
        {
            this._gameObject = (<Laya.MeshSprite3D>(this.owner));
            this._transform = this.gameObject.transform;
            this.localPosition = new Laya.Vector3(this._transform.localPositionX,this._transform.localPositionY,this._transform.localPositionZ);
        }
        return this._gameObject;
    }

    /**返回当前 transform*/
    get transform(){
        if(!this._transform)
        {
            this._gameObject = (<Laya.MeshSprite3D>(this.owner));
            this._transform = this.gameObject.transform;
            this.localPosition = new Laya.Vector3(this._transform.localPositionX,this._transform.localPositionY,this._transform.localPositionZ);
        }
        return this._transform;
    }

    /**
     * 游戏初始化的位置信息
     */
    get LocalPosition(){
        return this.localPosition;
    }

    /**
     * 设置本地坐标
     * @param x 
     * @param y 
     * @param z 
     */
    setLocalPosition(x?:number,y?:number,z?:number)
    {
        this.localPosition.x = x;
        this.localPosition.y =y;
        this.localPosition.z =z;
        this.transform.localPosition = this.localPosition;
    }

    /**
     * 初始化方法
     */
    abstract onInit(): void;

    /**
     * 监听消息
     * @param name	消息类型
     * @param callbreakFun	回调
     * @param caller	事件侦听函数的执行域
     */
    protected AddListenerMessage(name,callbreakFun){
        EventListener.getInstance().AddNotice(name, this, callbreakFun);
    }

    /**
     * 移除消息监听
     * @param name	消息类型
     * @param args	回调
     */
    protected  RemoveListenerMessage(name,callbreakFun){
        EventListener.getInstance().RemoveNotice(name, this,callbreakFun);
    }

    /**
     * 发送消息
     * @param name		消息类型
     * @param args	参数
     */
    protected SendMessage(name,...args: any[])
    {
        EventListener.getInstance().Emit(name,args);
        // dispatchEvent(new Event(name));
    }

    onDestroy(): void {
        EventListener.getInstance().RemoveAllNotice(this);
    }

    /**
     * 隐藏模型
     */
    onHide()
    {
        if(this.gameObject)
        {
            this.gameObject.active = false;
        }
    }

    /**显示模型 */
    onShow()
    {
        if(this.gameObject)
        {
            this.gameObject.active = true;
        }
    }

    /**
     * 销毁
     */
    onRemove()
    {
        if(this.gameObject)
        {
            this.gameObject.destroy();
        }
        this.destroy();
    }

    /**
     * 寻找子节点
     * @param node 
     * @param path 
     */
    protected findChild(node:Laya.Node,path:string)
    {
        let url = path.split('/');
        let parent = node;
        let child = node;
        if(node && url)
        {
            for(var i = 0;i<url.length;i++)
            {
                child = <Laya.Sprite3D>parent.getChildByName(url[i]);
                parent = child;
            }
        }

        return child;

    }

     /**
     * 克隆
     * @param item 
     * @param parent 
     * @param worldPositionStays 
     * @param position 
     * @param rotation 
     */
    protected instantiate(original:Laya.Sprite3D,parent?:Laya.Sprite3D,worldPositionStays?: boolean, position?: Laya.Vector3, rotation?: Laya.Quaternion):Laya.Sprite3D
    {
      return Laya.Sprite3D.instantiate(original, this._gameObject, worldPositionStays, position);
    }
}

class RabNotity {

    static UIMessage_hideGame:string = "UIMessage_hideGame";
    static UIMessage_Login:string = "UIMessage_Login";
    
    static GameMessage_ChangeScene:string = "GameMessage_ChangeScene";
    static GameMessage_UpdateUserInfo:string = "GameMessage_UpdateUserInfo";
    static GameMessage_GameShowMessage:string = "GameMessage_GameShowMessage";


    static GameMessage_LoadingEnd:string = "GameMessage_LoadingEnd";
    static GameMessage_LoadProgess:string = "GameMessage_LoadProgess";
    
    
    static GameMessage_GameStart:string = "GameMessage_GameStart";
    static GameMessage_GameContinue:string = "GameMessage_GameContinue";
    static GameMessage_ReGameStart:string = "GameMessage_ReGameStart";
    static GameMessage_GameWin:string = "GameMessage_GameWin";
    static GameMessage_GameLose:string = "GameMessage_GameLose";
    static GameMessage_GameBlack:string = "GameMessage_GameBlack";
    static GameMessage_Revive:string = "GameMessage_Revive";
    static GameMessage_GameOver:string = "GameMessage_GameOver";
    static GameMessage_PauseGame:string = "GameMessage_PauseGame";

    static GameMessage_BackExcitation:string = "GameMessage_BackExcitation";

    static Game_LoadGameScene:string = "Game_LoadGameScene";
    static Game_RemoveGameScene:string = "Game_RemoveGameScene";
    static GameMessage_RefreshScene:string = "GameMessage_RefreshScene";
    static GameMessage_testScene:string = "GameMessage_testScene";

    //-------------------------------------

}

/**服务器返回用户数据 */
export interface SerUserInfo
{
    avatar:string,
    expires_in:number,
    gamedata:any,
    nickname:string,
    token:string

}

abstract class RabController extends RabManager {

    /**
     * json资源数据
     */
    public jsonData:any={};
    /**3D场景 */
    public scene3D: Laya.Scene3D;

    onInitManaager()
    {
        this.onInitUserDate();
        this._gameType = "maingame";
        rab.SDKChannel.UpdateGame();
        rab.Util.log("初始化管理器");
        let path = "json/config.json";

        Laya.loader.load(path , Laya.Handler.create(this, ()=>{
            rab.Util.log("加载配置表===",path);
            this.gameConfig= Laya.loader.getRes(path);
            this.InitConfig();
        }));
    } 

     /**
     * 加载配置表完成
     * @param res 
     */
    private InitConfig()
    {
        rab.Util.log("最新配置表",this.gameConfig);
        rab.SDKChannel.onInitSDk();
        this.onInitServer(this.gameConfig.appid,this.gameConfig.secret,this.gameConfig.gamename,this.gameConfig.version);
    }

    /**
     * 登录服务器
     */
    private onInitServer(appid:number,secret:string,name:string,version:string)
    {
        rab.Util.log("初始化服务器");
        if(rab.Util.isMobil && typeof wx != "undefined")
        {
            this.loginServer()
        }
        else{
            this.loginServer()
        }
    }

    /**登录返回 */
    private LoginBreak() {
        wx.hideLoading();
        rab.SDKChannel.traceEvent("loginsuccess")
        this.OnEnterGame();
        // this.OnReConfig(wx.conf);
    }

    /**
     * 登录服务器
     */
    private loginServer() {
        rab.Util.log("登录服务器");
        if(rab.Util.isMobil) {
            wx.showLoading({ title: '登录中' });
            rab.wxSdk.onLoginWXServer((data)=>{
                if(data)
                {
                    console.log("登录服务器验证",data);
                    this.userInfo = data;
                    console.log("登录服务器验证====",this.userInfo.token);
                    this.LoginBreak();
                }else{
                    console.log("新用户先进游戏",data);
                    this.LoginBreak();
                }
            },(data)=>{
                this.userInfo = data;
                console.log("登录服务器验证====",this.userInfo.token);
            });
        }
        else{
            rab.HTTP.post(this.gameConfig.serverurl+"/api/authCode",{"code":'aaa'},this,()=>{
                this.OnEnterGame();
            })
            
        }
    }

    /**
     * 可以执行下一步了
     */
    private OnEnterGame() {
        if(rab.Util.isMobil) {
            this.InitGameInfo(() => {
                this.loadView();
            });
        }
        else {
            this.InitGameInfo(null);
            this.loadView();
        }

        if(this.getIsNewDay()) {
            //TODO:今天新的一天处理一些其他问题签到 每日提示等
        }
    }

    /**随机玩家名称 */
    public RandomUserName():string {
        let index = Math.floor(Math.random()*this.randomUserName.length);
        return this.randomUserName[index];
    }

    /**
     * 加载完成配置表
     * @param arr 
     */
    private LoadInitRes() {
        let count: number = 0;
        Object.keys(this.gameConfig.loadJson).forEach((key)=>{
            this.jsonData[key] = Laya.loader.getRes(this.gameConfig.loadJson[key]);
            count++;
        });

        let complete = () => {
            if (count == this.gameConfig["loadJsonCount"]) {
                this.SendMessage(rab.RabNotity.GameMessage_LoadingEnd);
                rab.Util.log("LoadInitRes=", this.jsonData);
                this.onStartGame();

                Laya.timer.clear(this, complete);
            }
        }

        Laya.timer.frameLoop(1, this, complete);
    }

    /**
     * 与加载资源
     */
    private loadView() {
        var arr = [];
        // rab.Util.log("loadView===", this.gameConfig)
        Object.keys(this.gameConfig.loadJson).forEach((key)=>{
            arr.push(this.gameConfig.loadJson[key]);
        });
        Object.keys(this.gameConfig.loadui).forEach((key)=>{
            arr.push(this.gameConfig.loadui[key]);
        });
        rab.Util.log("view资源加载",arr);

        if (arr.length > 0) {
            Laya.loader.load(arr , Laya.Handler.create(this, ()=>{
                rab.Util.log("资源加载完成");
                this.LoadInitRes();
            }));
        }
        else {
            this.LoadInitRes();
        }
    }

    /**
     * 3d场景加载
     */
    public onLoad3dScene(callback: Function) {
        if(this.scene3D)
        {
            callback && callback();
        }else{
            Laya.loader.create(this.gameConfig.scene3d, Laya.Handler.create(this, ()=>{
                //TODO:加载完成通知加载页面
                rab.Util.log("3d场景加载成功");
                this.scene3D = Laya.loader.getRes(this.gameConfig.scene3d);
                Laya.stage.addChild(this.scene3D);
                this.scene3D.zOrder = -1;
                callback && callback();
            }), null);
        }
    }

    /**
     * 初始化游戏配置信息
     */
    private OnReConfig(conf) {
        rab.Util.log("更新在线参数", conf);
        
        for(var o in this.gameConfig.config){
            if(conf[o]!= null)
            {
                this.gameConfig.config[o] = conf[o];
            }
        }

        for(var o in this.gameConfig.config){
            let end = "Way";
            var d = o.length - end.length;
            if(d >= 0&&o.lastIndexOf(end) == d){
                this.gameConfig.config[o] = this.judgeUserWay(o);
            }
        }
    }

    /**
     * 判断用户激励的方式0:是默认 1:分享 2:视频 3:其他
     * @param pos 位置
     */
    private judgeUserWay(pos:string):number{
        let way = this.gameConfig.config[pos];
        if(way == 1 && !this.gameConfig.config.allow_share){
            if(this.gameConfig.config.allow_video){
                way = 2;
            }else{
                way = 3;
            }
        }
        if(way == 2 && !this.gameConfig.config.allow_video){
            if(this.gameConfig.config.allow_share){
                way = 1;
            }else{
                way = 3;
            }
        }
        return way;
    }

    /**
     * 开始游戏
     */
    protected abstract onStartGame();

    /**
     * 初始化用户数据
     */
    protected abstract onInitUserDate();

    /**
     * 预加载资源
     * @param path 
     */
    protected onPreLoadRes(path)
    {
        
    }
}

/**
 * 配置数据
 * 在线参数
 */
export interface RabGameConfig {

    debug:boolean;
    version:string;
    loadJson:{
        
    };
    loadui:Array<string>;
    /**小萌牛平台ID */
    appid:number;
    /**游戏名称 */
    gamename:string;
    /**平台秘钥 */
    secret:string;
    /**服务器地址 */
    serverurl:string;

    config:{
        allow_share:boolean;
        allow_video:boolean;
        video_faill_share:boolean;
        adIntervals:number;
        shareDuration:number;
        allow_adGame:boolean;
        showShareMenu:boolean;

        welfare:{};
        upgradeWay:number;
        chooseSkillWay:number;
        winGetCoinWay:number;
        getTicketWay:number;
        shopBigCoinWay:number;
        shopSmallCoinWay:number;
        shopBoxCoinWay:number;
        reviveWay:number;
    };
    scene3d:string
}

/**WXSDK */
class wxSdk{

    constructor() {
        console.log("初始化微信SDK");
    }

   

    /**提示框 */
    public showModal(opt:any){
        if(rab.Util.isMobil)
        {
            wx.showModal({
                title: opt.title||"提示",
                content: opt.content||"提示内容",
                success(res) {
                    if (res.confirm) {
                    console.log("confirm, continued");
                    opt.success&&opt.success();
                    } else if (res.cancel) {
                    console.log("cancel, cold");
                    opt.cancel&&opt.cancel();
                    } else {
                    // what happend?
                    }
                },
                fail() {
                    console.log(`showModal调用失败`);
                }
            });
        }else{
            console.log(`提示框`);
        }
    }

    /**
     * 提示
     * @param msg 提示文字
     */
    showToast(msg:string,time?:number){
        if(rab.Util.isMobil){
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: time||2000
            });
        }else{
            console.log(msg);
        }
    }

    /**
     * 长震动
     */
    vibrateLong()
    {
        if(typeof wx != "undefined")
        {
            wx.vibrateLong();
        }
    }

    /**
     * 短震动
     */
    vibrateShort()
    {
        if(typeof wx != "undefined")
        {
            wx.vibrateShort();
        }
    }
    /**
     * 小游戏胶囊位置
     */
    getMenuButtonBoundingClientRect()
    {
        if(typeof wx != "undefined")
        {
            return wx.getMenuButtonBoundingClientRect();
        }
        return null;
    }

    /**
     * 在线跟新新版本
     */
    UpdateGame(call?:Function)
    {
        if(typeof wx != "undefined")
        {
            if (typeof wx.getUpdateManager === 'function') {
                const updateManager = wx.getUpdateManager();
                
                updateManager.onCheckForUpdate(function (res) {
                    call&&call(1);
                    console.log("===新版本====="+res.hasUpdate)
                })
                updateManager.onUpdateReady(function () {
                    console.log("===新版本并重启=====")
                    updateManager.applyUpdate();
                    call&&call(1);
                })
                updateManager.onUpdateFailed(function () {
                    // 新的版本下载失败
                    console.log("版本更新失败");
                    call&&call(0);
                })
            }else{
                call&&call(1);
            }
        }else{
            call&&call(1);
        }
    }

    /**
     * 拉起客服提示
     */
    public openCustomerServiceConversation(title:string,img:string,success?:Function,fail?:Function)
    {
        if(rab.Util.isMobil)
        {
            if(wx.openCustomerServiceConversation)
            {
                wx.openCustomerServiceConversation({
                    showMessageCard: true,
                    sendMessageTitle:title,
                    sendMessageImg:img,
                    success:(res)=>{
                        success&&success(res);
                    },
                    fail:(res)=>{
                        fail&&fail(res);
                    }
                })
            }
        }
    }

    /**
     * 判断版本号大小
     * @param {*} _version 
     */
    public getSystemInfo(_version='2.3.0')
    {
        const version = wx.getSystemInfoSync().SDKVersion || "1.1.0";
        if (this.compareVersion(version, _version) >= 0) {
            //支持功能
            return true;
        } else {
            return false;
        }
    }

    public compareVersion(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)
        
        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }
        
        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])
        
            if (num1 > num2) {
            return 1
            } else if (num1 < num2) {
            return -1
            }
        }
        
        return 0;
    }


    /**微信登录 */
    public onLoginWXServer(breakcall:Function,breakcall2:Function,path:string="api/authCode")
    {
        if(rab.Util.isMobil) {
            wx.login({
                success:(res)=> {
                    if (res.code) {
                        let code = res.code;
                        console.log("登录code",res.code);
                        
                        rab.HTTP.post(path,{"code":res.code},this,(data)=>{
                            console.log("登录code返回：",data);
                            if(data.data != null)
                            {
                                breakcall && breakcall(data.data);
                            }else{
                                breakcall && breakcall(null);
                                this.onCreateUserInfo(code,breakcall2);
                            }
                        });
                    }
                    else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }else{
            
        }
    }

    private getUserInfo(code:string,breakcall:Function)
    {
        wx.getUserInfo({
            withCredentials: true,
            lang: "zh_CN",
            success:(res)=>{
                var userInfo = res.userInfo;
                console.log("用户信息：",userInfo);
                rab.HTTP.post("api/wxLogin",{
                    "code":code,
                    "rawData":res.rawData,
                    "signature":res.signature,
                    "encryptedData":res.encryptedData,
                    "iv":res.iv
                },this,(data)=>{
                    console.log("登录服务器返回：",data);
                    breakcall&&breakcall(data.data);
                })
            },
            fail: () => {

            },
            complete: () => {

            }
    })
    }

    public onCreateUserInfo(code:string,breakcall:Function)
    {

        if(rab.Util.isMobil)
        {
            wx.hideLoading();
            wx.getSetting({
                success:(res)=>{
                    if(res.authSetting['scope.userInfo'])
                    {
                        //已经授权了
                        this.getUserInfo(code,breakcall)
                    }else{
                        let button = wx.createUserInfoButton({
                            type: 'image',
                            image: 'load/rect5.png',
                            style: {
                                left: 0,
                                top: 0,
                                width: 1000,
                                height: 1000,
                                borderRadius: 4
                            }
                          })
                          button.onTap((res) => {
                            if(res.errMsg=="getUserInfo:ok")
                            {
                                console.log("授权用户信息")
                                //清除微信授权按钮
                                button.destroy()
                                this.getUserInfo(code,breakcall)
                            }
                            else
                            {
                                console.log("授权失败")
                            }
                          })
                    }
                }
            })
        }
    }

    public wxHttp(path:string,_data:any,breakcall:Function,_method:string="POST")
    {
        if(rab.Util.isMobil)
        {
            wx.request({
                url: path, //仅为示例，并非真实的接口地址
                method:_method,
                data: JSON.stringify(_data),
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success:(res)=> {
                    console.log(res.data)
                    breakcall&&breakcall(res.data);
                }
            })
        }
    }

    public wxGETHttp(path:string,token:string,breakcall:Function)
    {
        if(rab.Util.isMobil)
        {
            wx.request({
                url: path, //仅为示例，并非真实的接口地址
                method:"GET",
                header: {
                    'Accept': 'application/json', // 默认值
                    'Authorization':token?`Bearer ${token}`:''

                },
                success:(res)=> {
                    console.log(res.data)
                    breakcall&&breakcall(res.data);
                }
            })
        }
    }
}


class HTTP{
 
    private callback:any;
    private caller:any;
 
    private http:Laya.HttpRequest;

    private _serverUrl:string;
    init(path:string) {
        this._serverUrl = path;
    }
 
    constructor() {
        this.http = new Laya.HttpRequest;
    }
 
    public get(url:string,token:string,callback:any):HTTP{
        if(rab.Util.isMobil)
        {
            console.log("wxurlget",url,"===data===")
            rab.wxSdk.wxGETHttp(this._serverUrl+"/"+url,token,callback)
        }else
        {
            this.caller = null;
            this.callback = callback;
            //this.http.once(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
            this.http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
            this.http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
            this.http.send(this._serverUrl+"/"+url, null, 'get', 'text');
        }
        return this;
    }
 
     public post(url:string,data:any,caller:any,callback:any,contentType:string="application/json"):HTTP{

        if(rab.Util.isMobil)
        {
            console.log("wxurl",url,"===data===",data)
            rab.wxSdk.wxHttp(this._serverUrl+"/"+url,data,callback)
        }else
        {
            this.caller = caller;
            this.callback = callback;
            console.log("url",url,"===data===",data)
            //this.http.once(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
            this.http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
            this.http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
            if(contentType==null){
                this.http.send(this._serverUrl+"/"+url, JSON.stringify(data), 'post', 'json');
            }else{
                this.http.send(this._serverUrl+"/"+url, JSON.stringify(data), 'post', 'json',["content-type",contentType]);
            }
        }
        
        return this;
    }

    public wxHttp(url:string,data:any,callback:any)
    {
        rab.wxSdk.wxHttp(this._serverUrl+"/"+url,data,callback)
    }

    
 
 
    private onHttpRequestError(e: any): void {
        this.callback.apply(this.caller,[{state:500,msg:e}]);
    }
 
    private onHttpRequestComplete(e: any): void {
        this.callback.apply(this.caller,[{state:200,data:this.http.data}]);
    }
}


var rab = {
    RabObj:RabObj,
    RabView:RabView,
    GameObject:GameObject,
    MusicManager:MusicManager.getInstance(),
    RabGameManager:RabGameManager,
    RabController:RabController,
    RabNotity:RabNotity,
    HTTP:new HTTP(),
    wxSdk:new wxSdk(),
    UIManager:new ViewManager(),
    SDKChannel:new GameChannel(),
    Util:new UtilTool(),
    RabViewConfig:new RabViewConfig(),
    RabComponent:RabComponent,
    EventListener:EventListener.getInstance(),
}
export default rab;