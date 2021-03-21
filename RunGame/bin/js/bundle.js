(function () {
    'use strict';

    class ImgEffect extends Laya.Script {
        constructor() {
            super(...arguments);
            this.moveSpeed = 5;
            this.state = 0;
        }
        onAwake() {
            this.myImg = this.owner;
            this.moveSpeed = 0.3;
        }
        moveX(x) {
            this.myImg.centerX += (x * 1.5);
        }
        get centerX() {
            return this.myImg.centerX;
        }
        get centerY() {
            return this.myImg.centerY;
        }
        SetCenter(x, y) {
            this.myImg.centerY = y;
            Laya.Tween.to(this.myImg, { centerX: x }, 100, null);
        }
        MoveX(x, complete) {
            Laya.Tween.to(this.myImg, { centerX: x }, 100, null, complete);
        }
        RotationAnim() {
            Laya.timer.frameLoop(1, this, this.onUpdata);
            this.state = 1;
        }
        onUpdata() {
            if (this.state == 1) {
                this.myImg.rotation += this.moveSpeed;
            }
        }
        StopRotationAnim() {
            Laya.timer.clearAll(this);
            this.state = 0;
        }
        scale(x, y) {
            if (!y) {
                y = x;
            }
            this.myImg.scale(x, y);
        }
        Unlock(index, visible) {
            if (this.myImg.numChildren > index) {
                this.myImg.getChildAt(index).visible = visible;
            }
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("runtime/ImgEffect.ts", ImgEffect);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "view/Game.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class CurveBlinnPhong extends Laya.BlinnPhongMaterial {
        constructor() {
            super();
            this.MAIN_TEX = Laya.Shader3D.propertyNameToID("u_MainTex");
            this.X_OFFSET = Laya.Shader3D.propertyNameToID("u_XOffset");
            this.Y_OFFSET = Laya.Shader3D.propertyNameToID("u_YOffset");
            this.Z_Distance = Laya.Shader3D.propertyNameToID("u_ZDistance");
            this.setShaderName("CustomCurveShader");
            this.enableVertexColor = false;
            this.albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 0.0);
            this.xoffset = 15.0;
            this.yoffset = -15.0;
            this.zdistance = 200.0;
        }
        static initShader() {
            var attributeMap = {
                "a_Position": Laya.VertexMesh.MESH_POSITION0,
                "a_Normal": Laya.VertexMesh.MESH_NORMAL0,
                "a_Textcoord": Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                "a_Textcorrd1": Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
                "a_Tangent": Laya.VertexMesh.MESH_TANGENT0,
                "a_Color": Laya.VertexMesh.MESH_COLOR0,
            };
            var uniformMap = {
                "u_MainTex": Laya.Shader3D.PERIOD_MATERIAL,
                "u_MvpMatrix": Laya.Shader3D.PERIOD_SPRITE,
                "u_View": Laya.Shader3D.PERIOD_CAMERA,
                "u_Projection": Laya.Shader3D.PERIOD_CAMERA,
                "u_WorldMat": Laya.Shader3D.PERIOD_SPRITE,
                "u_XOffset": Laya.Shader3D.PERIOD_MATERIAL,
                "u_YOffset": Laya.Shader3D.PERIOD_MATERIAL,
                "u_ZDistance": Laya.Shader3D.PERIOD_MATERIAL
            };
            var vs = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec2 a_Textcoord;

            uniform mat4 u_WorldMat;
            uniform mat4 u_MvpMatrix;
            uniform mat4 u_View;
            uniform mat4 u_Projection;

            uniform float u_XOffset;
            uniform float u_YOffset;
            uniform float u_ZDistance;

            varying vec2 v_textcoord;

            void main() {
                v_textcoord = a_Textcoord;
                vec4 vPos = (u_View * u_WorldMat) * a_Position;
                float zOff = vPos.z / u_ZDistance;
                vPos += vec4(u_XOffset, u_YOffset, 0.0, 0.0) * zOff * zOff;
                gl_Position = u_Projection * vPos;
            }
        `;
            var ps = `
            #ifdef HIGHPRECISION
            precision highp float;
            #else
            precision mediump float;
            #endif

            #include "Lighting.glsl";

            uniform sampler2D u_MainTex;
            varying vec2 v_textcoord;

            void main() {
                vec4 col = texture2D(u_MainTex, v_textcoord);
                gl_FragColor = col;
            }
        `;
            var shader = Laya.Shader3D.add("CustomCurveShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
        set mainTex(value) {
            this._shaderValues.setTexture(this.MAIN_TEX, value);
        }
        set xoffset(value) {
            this._shaderValues.setNumber(this.X_OFFSET, value);
        }
        set yoffset(value) {
            this._shaderValues.setNumber(this.Y_OFFSET, value);
        }
        set zdistance(value) {
            this._shaderValues.setNumber(this.Z_Distance, value);
        }
    }

    var OpenScene;
    (function (OpenScene) {
        OpenScene[OpenScene["float"] = 0] = "float";
        OpenScene[OpenScene["collection"] = 1] = "collection";
        OpenScene[OpenScene["customer"] = 2] = "customer";
        OpenScene[OpenScene["subscribe"] = 3] = "subscribe";
        OpenScene[OpenScene["moments"] = 4] = "moments";
    })(OpenScene || (OpenScene = {}));
    var PlayState;
    (function (PlayState) {
        PlayState[PlayState["none"] = 0] = "none";
        PlayState[PlayState["init"] = 1] = "init";
        PlayState[PlayState["left"] = 2] = "left";
        PlayState[PlayState["right"] = 3] = "right";
        PlayState[PlayState["run"] = 4] = "run";
        PlayState[PlayState["jump"] = 5] = "jump";
        PlayState[PlayState["slide"] = 6] = "slide";
        PlayState[PlayState["stop"] = 7] = "stop";
        PlayState[PlayState["death"] = 8] = "death";
    })(PlayState || (PlayState = {}));
    class QueueT {
        constructor() {
            this.push = (item) => this.data.push(item);
            this.pop = () => this.data.shift();
        }
    }

    class RabEvent {
        constructor() {
            this.OnInit();
        }
        AddListenerMessage(name, callbreakFun) {
            EventListener.getInstance().AddNotice(name, this, callbreakFun);
        }
        RemoveListenerMessage(name, callbreakFun) {
            EventListener.getInstance().RemoveNotice(name, this, callbreakFun);
        }
        SendMessage(name, ...args) {
            EventListener.getInstance().Emit(name, args);
        }
        onDestroy() {
            EventListener.getInstance().RemoveAllNotice(this);
        }
        OnRemove() {
            EventListener.getInstance().RemoveAllNotice(this);
        }
    }
    class _Dictionary {
        constructor() {
            this._arr = null;
            this._arrTemp = null;
            this._arr = new _List();
        }
        add(_key, _value) {
            this._arrTemp = new KeyValuePair(_key, _value);
            this._arr.add(this._arrTemp);
        }
        get(key) {
            for (let index = 0; index < this._arr.count; index++) {
                const element = this._arr.get(index);
                if (element.key == key)
                    return element.value;
            }
            return null;
        }
        remove(key) {
            var temp = new _List();
            for (let index = 0; index < this._arr.count; index++) {
                const element = this._arr.get(index);
                if (element.key == key) {
                    var v = this._arr.remove(element);
                    temp.add(v);
                }
            }
            return temp;
        }
        contain(key) {
            if (this.get(key) != null) {
                return true;
            }
            return false;
        }
        get count() {
            return this._arr.count;
        }
        clear() {
            this._arr.clear();
        }
        forEach(callbackfn, thisArg) {
            this._arr.forEach(callbackfn);
        }
        ;
    }
    class KeyValuePair {
        constructor(key, value) {
            this.key = null;
            this.value = null;
            this.key = key;
            this.value = value;
        }
    }
    class _List {
        constructor() {
            this._arr = null;
            this._arr = new Array();
        }
        add(value) {
            this._arr.push(value);
        }
        get(index) {
            return this._arr[index];
        }
        contain(value) {
            return this._arr.indexOf(value) != -1;
        }
        get count() {
            return this._arr.length;
        }
        remove(value) {
            var index = this._arr.indexOf(value);
            if (index == -1)
                return null;
            this._arr.splice(index, 1);
            return value;
        }
        removeIndex(index) {
            if (index > -1) {
                this._arr.splice(index, 1);
            }
        }
        clear() {
            for (let index = this._arr.length - 1; index >= 0; index--) {
                this._arr.pop();
            }
        }
        forEach(callbackfn, thisArg) {
            this._arr.forEach(callbackfn, thisArg);
        }
        ;
    }
    class UtilTool {
        constructor() {
            this.debug = true;
        }
        get isMobil() {
            if (typeof wx != "undefined") {
                return true;
            }
            return false;
        }
        UpdateTime(time, isHour = false) {
            time = time < 0 ? 0 : time;
            let t = Math.ceil(time);
            let m = Math.floor(t / 60);
            let s = Math.floor(t % 60);
            if (isHour == true) {
                t = Math.floor(t / 3600);
                m = time - t * 3600;
                m = Math.floor(m / 60);
            }
            let hs = (t >= 10) ? t + "" : ("0" + t);
            let ms = (m >= 10) ? m + "" : ("0" + m);
            let ss = (s >= 10) ? s + "" : ("0" + s);
            let timeStr;
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
            }
            ;
            return timeStr;
        }
        log(message, ...optionalParams) {
            if (this.debug) {
                console.log(message, ...optionalParams);
            }
        }
        formatter(value, fix = 2) {
            let bits = ["M", "B", "T", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR"];
            if (value >= 100000000) {
                fix = 3;
                bits = ["AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR"];
                for (let i = bits.length; i > 0; i--) {
                    if (value >= Math.pow(100000000, i)) {
                        return `${parseFloat((value / Math.pow(100000000, i)).toFixed(fix)) + bits[i - 1]}`;
                    }
                }
            }
            else if (value >= 100000) {
                for (let i = bits.length; i > 0; i--) {
                    if (value >= Math.pow(10000, i)) {
                        return `${parseFloat((value / Math.pow(10000, i)).toFixed(fix)) + bits[i - 1]}`;
                    }
                }
            }
            return `${parseFloat(value.toFixed(fix))}`;
        }
        objClone(obj) {
            var dst = {};
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    dst[prop] = obj[prop];
                }
            }
            return dst;
        }
        supplement(org, type) {
            Object.keys(type).forEach(function (key) {
                if (org[key] != undefined) {
                    org[key] = type[key];
                }
            });
            return org;
        }
        timestampToDay(oldTime, curTime) {
            let d1 = Math.floor(curTime / (24 * 3600 * 1000));
            let d2 = Math.floor(oldTime / (24 * 3600 * 1000));
            return d1 - d2;
        }
        isEmpty(str) {
            if (str != null && str != "") {
                return true;
            }
            return false;
        }
    }
    class MusicManager {
        static getInstance() {
            if (this._instance == null) {
                this._instance = new MusicManager();
            }
            return this._instance;
        }
        setState(music, audio) {
            Laya.SoundManager.musicMuted = (music == 0) ? false : true;
            Laya.SoundManager.soundMuted = (audio == 0) ? false : true;
        }
        playMusic(url, volume = 0.2) {
            Laya.SoundManager.musicVolume = volume;
            Laya.SoundManager.playMusic(url);
        }
        playSound(url, loop = 1, volume = 0.5, callback = null) {
            Laya.SoundManager.soundVolume = volume;
            Laya.SoundManager.playSound(url, loop, callback);
        }
        stopSound(url) {
            Laya.SoundManager.stopSound(url);
        }
    }
    var GameState;
    (function (GameState) {
        GameState[GameState["init"] = 0] = "init";
        GameState[GameState["start"] = 1] = "start";
        GameState[GameState["gameing"] = 2] = "gameing";
        GameState[GameState["pause"] = 3] = "pause";
        GameState[GameState["over"] = 4] = "over";
        GameState[GameState["exit"] = 5] = "exit";
    })(GameState || (GameState = {}));
    class GameChannel {
        constructor() {
            this._Manager = RabGameManager.getInterest().getMyManager();
        }
        get myManager() {
            if (!this._Manager) {
                this._Manager = RabGameManager.getInterest().getMyManager();
            }
            return this._Manager;
        }
        onInitSDk() {
            rab.HTTP.init(this.myManager.gameConfig.serverurl);
        }
        initData(callback) {
            let gameInfo = null;
            if (typeof wx != "undefined") {
                if (this.myManager.userInfo) {
                    rab.HTTP.get("api/player", this.myManager.userInfo.token, (data) => {
                        if (data.data != null && data.data.gamedata != null) {
                            gameInfo = JSON.parse(data.data.gamedata);
                        }
                        callback && callback(gameInfo);
                        rab.Util.log('初始化获得保存数据', data);
                    });
                }
                else {
                    callback && callback(gameInfo);
                }
            }
            else {
                var info = Laya.LocalStorage.getItem("gameInfo");
                if (info) {
                    let data = JSON.parse(info);
                    gameInfo = rab.Util.supplement(gameInfo, data);
                    callback && callback(gameInfo);
                    rab.Util.log('初始化获得保存数据===', data);
                }
            }
            rab.Util.log('初始化获得保存数据', gameInfo);
        }
        SaveData(gameInfo, key = "gameinfo") {
            if (typeof wx != "undefined") {
                rab.HTTP.post("api/player", {
                    "data": JSON.stringify(gameInfo),
                    "token": this.myManager.userInfo.token
                }, this, (data) => {
                    console.log("保存数据：", data);
                });
            }
            else {
                Laya.LocalStorage.setItem(key, JSON.stringify(gameInfo));
            }
        }
        onHide(breakcall) {
            if (rab.Util.isMobil) {
                if (typeof wx != "undefined") {
                }
                else {
                    console.log("未接入平台");
                }
            }
        }
        onShow(breakcall) {
            if (rab.Util.isMobil) {
                if (typeof wx != "undefined") {
                }
                else {
                    console.log("未接入平台");
                }
            }
        }
        UpdateGame(call) {
            rab.wxSdk.UpdateGame(call);
        }
        stimulate(pos, succeed, fail) {
            let way = this.myManager.gameConfig.config[pos];
            switch (way) {
                case 0:
                    succeed();
                    break;
                case 1:
                    this.createShare(pos, succeed, fail);
                    break;
                case 2:
                    this.createVideo(pos, succeed, fail);
                    break;
                default:
                    fail && fail();
                    rab.wxSdk.showToast("该功能未开发!");
            }
        }
        createShare(_pos, succeed, fail, imageUrl, title, query) {
            if (this.myManager.gameConfig.config.allow_share) {
                if (typeof wx != 'undefined') {
                    if (!rab.wxSdk.getSystemInfo()) {
                    }
                    else {
                    }
                }
                else {
                    console.log("未接入平台");
                }
            }
            else {
                rab.wxSdk.showToast("功能未启动");
                fail && fail();
            }
        }
        createVideo(pos, succeed, fail) {
            if (typeof wx != 'undefined') {
                if (this.myManager.gameConfig.config.allow_video) {
                }
                else {
                    rab.wxSdk.showToast("视频功能未启动");
                    fail && fail();
                }
            }
            else {
                console.log("未接入平台");
            }
        }
        createBanner(_pos) {
            console.log("创建banner", _pos);
            if (_pos != "") {
                if (typeof wx != "undefined") {
                }
                else {
                    console.log("未接入平台");
                }
            }
        }
        closeBanner(pos = "") {
            if (rab.Util.isMobil && pos != "") {
                if (typeof wx != 'undefined') {
                }
                else {
                    console.log("未接入平台");
                }
            }
        }
        CreateInterstitialAd(pos) {
        }
        IsPhoneX() {
            if (Laya.stage.height < 0.5) {
                return true;
            }
            return false;
        }
        getAdGame(pos, success, count = 10) {
            let adlist = null;
            if (typeof wx != 'undefined') {
            }
            else {
                console.log("导量未接平台");
            }
        }
        onTapAdGame(pos, item, success, fail) {
            if (rab.Util.isMobil) {
                if (typeof wx != 'undefined') {
                }
                else {
                    console.log("未接入平台");
                }
            }
        }
        traceEvent(key, data) {
            if (typeof wx != 'undefined') {
                if (data) {
                }
                else {
                }
            }
            console.log("埋点：", key);
        }
        openCustomerServiceConversation(title, img, success, fail) {
            if (typeof wx != 'undefined') {
                rab.wxSdk.openCustomerServiceConversation(title, img, (res) => {
                    this.myManager.iscustomerService = 1;
                    success && success(res);
                }, (res) => {
                    this.myManager.iscustomerService = 0;
                    fail && fail(res);
                });
            }
        }
    }
    class RabManager extends RabEvent {
        constructor() {
            super(...arguments);
            this.isNew = false;
            this.lastTime = {};
            this.everyDayGift = 0;
            this._gameType = "";
        }
        OnInit() {
            this.isSaveGuidDate = true;
            rab.SDKChannel.onShow((res) => {
                this.sceneId = res.scene;
                console.log("场景=====id==OnInit========", res.scene);
            });
            this.gameInfo = {
                music: 1,
                audio: 1,
                vibrate: 1,
                lastTime: {},
            };
            this.onInitManaager();
            this.state = GameState.init;
        }
        InitGameInfo(callback) {
            this.state = GameState.init;
            rab.SDKChannel.initData((gameInfo) => {
                if (gameInfo != null) {
                    this.gameInfo = gameInfo;
                }
                rab.Util.log("获得数据", this.gameInfo);
                this.lastTime = this.gameInfo.lastTime;
                this.isGuid = this.isNoob();
                rab.SDKChannel.onHide(() => {
                    this.SaveData(-1);
                });
                rab.SDKChannel.onShow((res) => {
                    this.sceneId = res.scene;
                    console.log("场景=====id==========", res.scene);
                    EventListener.getInstance().Emit(RabNotity.GameMessage_GameShowMessage, res.scene);
                });
                callback && callback();
            });
        }
        getSceneTyp() {
            if (this.iscustomerService == 1) {
                return OpenScene.customer;
            }
            if (this.sceneId == 1131) {
                return OpenScene.float;
            }
            else if (this.sceneId == 1089) {
                return OpenScene.collection;
            }
            else if (this.sceneId == 1107) {
                return OpenScene.subscribe;
            }
            else if (this.sceneId == 1154) {
                return OpenScene.moments;
            }
        }
        SaveData(typ) {
            rab.Util.log(typ, "===保存数据====", this.gameInfo);
            this.onHide();
            rab.SDKChannel.SaveData(this.gameInfo, this._gameType);
        }
        setGameInfo(typ, val) {
            this.gameInfo[typ] = val;
        }
        addProp(key, val) {
            this.gameInfo[key] += val;
            this.SendMessage(RabNotity.GameMessage_UpdateUserInfo, this.gameInfo[key]);
        }
        offProp(key, val) {
            if (this.gameInfo[key] >= val) {
                this.gameInfo[key] -= val;
                this.SendMessage(RabNotity.GameMessage_UpdateUserInfo, this.gameInfo[key]);
                return true;
            }
            return false;
        }
        setMusic() {
            this.gameInfo.music = this.gameInfo.music ? 0 : 1;
            rab.MusicManager.setState(this.gameInfo.music, this.gameInfo.audio);
        }
        setAudio() {
            this.gameInfo.audio = this.gameInfo.audio ? 0 : 1;
            rab.MusicManager.setState(this.gameInfo.music, this.gameInfo.audio);
        }
        setVibrate() {
            this.gameInfo.vibrate = this.gameInfo.vibrate ? 0 : 1;
        }
        getIsNewDay() {
            let count = 0;
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
        isNoob() {
            return this.lastTime.year == null;
        }
    }
    class RabGameManager {
        static getInterest() {
            if (!this._interest) {
                this._interest = new RabGameManager();
            }
            return this._interest;
        }
        AddManager(manager) {
            this.currManager = manager;
        }
        getMyManager(manager) {
            return (this.currManager);
        }
    }
    class EventListener {
        static getInstance() {
            if (EventListener._instance == null) {
                EventListener._instance = new EventListener();
            }
            return EventListener._instance;
        }
        Emit(InName, ...agv) {
            EventListener.eventDispatcher.event(InName, agv);
        }
        AddNotice(InName, caller, listener, arg) {
            EventListener.eventDispatcher.on(InName, caller, listener, (arg == null) ? null : ([arg]));
        }
        RemoveNotice(InName, caller, listener) {
            EventListener.eventDispatcher.off(InName, caller, listener);
        }
        RemoveAllNotice(caller) {
            EventListener.eventDispatcher.offAllCaller(caller);
        }
    }
    EventListener.eventDispatcher = new Laya.EventDispatcher();
    class RabObj {
        constructor() {
            this._bannerPos = "";
            this.myManager = RabGameManager.getInterest().getMyManager();
            this.msgList = {};
            this._state = GameState.init;
            this.onInit();
        }
        AddListenerMessage(name, callbreakFun) {
            EventListener.getInstance().AddNotice(name, this, callbreakFun);
        }
        RemoveListenerMessage(name, callbreakFun) {
            EventListener.getInstance().RemoveNotice(name, this, callbreakFun);
        }
        SendMessage(name, ...args) {
            EventListener.getInstance().Emit(name, args);
        }
        onDestroy() {
            EventListener.getInstance().RemoveAllNotice(this);
        }
        findChild(parent, path) {
            var paths = path.split("/");
            var child = parent;
            if (paths) {
                for (var i = 0; i < paths.length; ++i) {
                    child = parent.getChildByName(paths[i]);
                    parent = child;
                }
            }
            return child;
        }
        vibrateLong() {
            if (rab.Util.isMobil && this.myManager.gameInfo.vibrate == 1) {
                rab.wxSdk.vibrateLong();
            }
        }
        vibrateShort() {
            if (rab.Util.isMobil && this.myManager.gameInfo.vibrate == 1) {
                rab.wxSdk.vibrateShort();
            }
        }
        getMenuButtonBoundingClientRect() {
            if (rab.Util.isMobil) {
                return rab.wxSdk.getMenuButtonBoundingClientRect();
            }
            return null;
        }
    }
    class RabView extends RabObj {
        onInit() {
            this.LoadView();
        }
        ViewData(path, value) {
            this.viewUrl = path;
            this._viewdata = value;
        }
        getMyView() {
            return this.m_view;
        }
        create(c) {
            this.m_view = new c();
            this.m_view.createChildren();
            this.m_currView = this.m_view;
            this.onShow();
            this.InitView();
            return this.m_view;
        }
        RefreshView(data) {
            this._viewdata = data;
            this.onShow();
            this.OnRefreshView();
        }
        onShow() {
            Laya.stage.addChild(this.getMyView());
            this.m_view.visible = true;
            this.m_bg = this.m_currView.bg;
            let scaleW = Laya.stage.width / Laya.stage.designWidth;
            let scaleH = Laya.stage.height / Laya.stage.designHeight;
            this.designScaleBig = Math.max(scaleH, scaleW);
            this.designScaleSmall = Math.min(scaleH, scaleW);
            this.onResize();
            this.createBanner();
            this.onShowLanguage();
        }
        onShowLanguage() {
        }
        onHide() {
            Laya.timer.clearAll(this);
            if (this.m_view) {
                this.m_view.visible = false;
            }
            Laya.stage.removeChild(this.getMyView());
            this.closeBanner();
        }
        onResize() {
            this.m_view.scale(this.designScaleSmall, this.designScaleSmall);
            if (this.m_bg) {
                this.m_bg.scale(this.designScaleBig, this.designScaleBig);
            }
        }
        OnCloseView() {
            this.closeBanner();
            rab.UIManager.onCloseView(this.viewUrl);
            Laya.timer.clearAll(this);
        }
        onDestroy() {
            super.onDestroy();
            this.closeBanner();
            Laya.timer.clearAll(this);
            if (this.m_view) {
                this.m_view.destroy();
            }
        }
        OnRemove() {
            this.onHide();
            this.onDestroy();
        }
        createBanner() {
            console.log("创建banner===========", this._bannerPos);
            rab.SDKChannel.createBanner(this._bannerPos);
        }
        closeBanner() {
            rab.SDKChannel.closeBanner(this._bannerPos);
        }
    }
    class ViewManager {
        constructor() {
            this.UIList = new _Dictionary();
        }
        onCreateView(path, ...optionalParams) {
            if (this.UIList.contain(path)) {
                this.UIList.get(path).onShow();
                this.UIList.get(path).RefreshView(optionalParams);
            }
            else {
                console.log("==创建页面==", path);
                var view = (rab.RabViewConfig.getRegClass(path));
                Laya.stage.addChild(view.getMyView());
                this.UIList.add(path, view);
                this.UIList.get(path).ViewData(path, optionalParams);
            }
        }
        onHideView(Resname) {
            if (this.UIList.contain(Resname)) {
                this.UIList.get(Resname).onHide();
            }
        }
        onCloseView(Resname) {
            if (this.UIList.contain(Resname)) {
                this.UIList.get(Resname).OnRemove();
                this.UIList.remove(Resname);
            }
        }
        isShowView(Resname) {
            if (this.UIList.contain(Resname) == true) {
                return this.UIList.get(Resname).getMyView().visible;
            }
            return false;
        }
        isContainView(Resname) {
            return this.UIList.contain(Resname);
        }
    }
    class RabViewConfig {
        constructor() {
            this._clsList = new _Dictionary();
            this._clsList = new _Dictionary();
        }
        regClass(className, classDef) {
            if (this._clsList.contain(className)) {
                console.log("重复标签了");
            }
            else {
                this._clsList.add(className, classDef);
            }
        }
        regShortClassName(classes) {
            for (var i = 0; i < classes.length; i++) {
                this.regClass(classes[i].className, classes[i].classDef);
            }
        }
        getRegClass(className) {
            if (this._clsList.contain(className)) {
                return new (this._clsList.get(className))();
            }
            else {
                console.log("未找注册该类型");
                return null;
            }
        }
    }
    class RabComponent extends Laya.Script {
        onInit() {
        }
        AddListenerMessage(name, callbreakFun) {
            EventListener.getInstance().AddNotice(name, this, callbreakFun);
        }
        RemoveListenerMessage(name, callbreakFun) {
            EventListener.getInstance().RemoveNotice(name, this, callbreakFun);
        }
        SendMessage(name, ...args) {
            EventListener.getInstance().Emit(name, args);
        }
        onDestroy() {
            EventListener.getInstance().RemoveAllNotice(this);
        }
    }
    class GameObject extends Laya.Script3D {
        onAwake() {
            this._gameObject = (this.owner);
            this._transform = this.gameObject.transform;
            this.onInit();
        }
        get gameObject() {
            if (!this._gameObject) {
                this._gameObject = (this.owner);
                this._transform = this.gameObject.transform;
                this.localPosition = new Laya.Vector3(this._transform.localPositionX, this._transform.localPositionY, this._transform.localPositionZ);
            }
            return this._gameObject;
        }
        get transform() {
            if (!this._transform) {
                this._gameObject = (this.owner);
                this._transform = this.gameObject.transform;
                this.localPosition = new Laya.Vector3(this._transform.localPositionX, this._transform.localPositionY, this._transform.localPositionZ);
            }
            return this._transform;
        }
        get LocalPosition() {
            return this.localPosition;
        }
        setLocalPosition(x, y, z) {
            this.localPosition.x = x;
            this.localPosition.y = y;
            this.localPosition.z = z;
            this.transform.localPosition = this.localPosition;
        }
        AddListenerMessage(name, callbreakFun) {
            EventListener.getInstance().AddNotice(name, this, callbreakFun);
        }
        RemoveListenerMessage(name, callbreakFun) {
            EventListener.getInstance().RemoveNotice(name, this, callbreakFun);
        }
        SendMessage(name, ...args) {
            EventListener.getInstance().Emit(name, args);
        }
        onDestroy() {
            EventListener.getInstance().RemoveAllNotice(this);
        }
        onHide() {
            if (this.gameObject) {
                this.gameObject.active = false;
            }
        }
        onShow() {
            if (this.gameObject) {
                this.gameObject.active = true;
            }
        }
        onRemove() {
            if (this.gameObject) {
                this.gameObject.destroy();
            }
            this.destroy();
        }
        findChild(node, path) {
            let url = path.split('/');
            let parent = node;
            let child = node;
            if (node && url) {
                for (var i = 0; i < url.length; i++) {
                    child = parent.getChildByName(url[i]);
                    parent = child;
                }
            }
            return child;
        }
        instantiate(original, parent, worldPositionStays, position, rotation) {
            return Laya.Sprite3D.instantiate(original, this._gameObject, worldPositionStays, position);
        }
    }
    class RabNotity {
    }
    RabNotity.UIMessage_hideGame = "UIMessage_hideGame";
    RabNotity.UIMessage_Login = "UIMessage_Login";
    RabNotity.GameMessage_ChangeScene = "GameMessage_ChangeScene";
    RabNotity.GameMessage_UpdateUserInfo = "GameMessage_UpdateUserInfo";
    RabNotity.GameMessage_GameShowMessage = "GameMessage_GameShowMessage";
    RabNotity.GameMessage_LoadingEnd = "GameMessage_LoadingEnd";
    RabNotity.GameMessage_LoadProgess = "GameMessage_LoadProgess";
    RabNotity.GameMessage_GameStart = "GameMessage_GameStart";
    RabNotity.GameMessage_GameContinue = "GameMessage_GameContinue";
    RabNotity.GameMessage_ReGameStart = "GameMessage_ReGameStart";
    RabNotity.GameMessage_GameWin = "GameMessage_GameWin";
    RabNotity.GameMessage_GameLose = "GameMessage_GameLose";
    RabNotity.GameMessage_GameBlack = "GameMessage_GameBlack";
    RabNotity.GameMessage_Revive = "GameMessage_Revive";
    RabNotity.GameMessage_GameOver = "GameMessage_GameOver";
    RabNotity.GameMessage_PauseGame = "GameMessage_PauseGame";
    RabNotity.GameMessage_BackExcitation = "GameMessage_BackExcitation";
    RabNotity.Game_LoadGameScene = "Game_LoadGameScene";
    RabNotity.Game_RemoveGameScene = "Game_RemoveGameScene";
    RabNotity.GameMessage_RefreshScene = "GameMessage_RefreshScene";
    RabNotity.GameMessage_testScene = "GameMessage_testScene";
    class RabController extends RabManager {
        constructor() {
            super(...arguments);
            this.jsonData = {};
        }
        onInitManaager() {
            this.onInitUserDate();
            this._gameType = "maingame";
            rab.SDKChannel.UpdateGame();
            rab.Util.log("初始化管理器");
            let path = "json/config.json";
            Laya.loader.load(path, Laya.Handler.create(this, () => {
                rab.Util.log("加载配置表===", path);
                this.gameConfig = Laya.loader.getRes(path);
                this.InitConfig();
            }));
        }
        InitConfig() {
            rab.Util.log("最新配置表", this.gameConfig);
            rab.SDKChannel.onInitSDk();
            this.onInitServer(this.gameConfig.appid, this.gameConfig.secret, this.gameConfig.gamename, this.gameConfig.version);
        }
        onInitServer(appid, secret, name, version) {
            rab.Util.log("初始化服务器");
            if (rab.Util.isMobil && typeof wx != "undefined") {
                this.loginServer();
            }
            else {
                this.loginServer();
            }
        }
        LoginBreak() {
            wx.hideLoading();
            rab.SDKChannel.traceEvent("loginsuccess");
            this.OnEnterGame();
        }
        loginServer() {
            rab.Util.log("登录服务器");
            if (rab.Util.isMobil) {
                wx.showLoading({ title: '登录中' });
                rab.wxSdk.onLoginWXServer((data) => {
                    console.log("登录服务器验证", data);
                    this.userInfo = data;
                    console.log("登录服务器验证====", this.userInfo.token);
                    this.LoginBreak();
                });
            }
            else {
                rab.HTTP.post(this.gameConfig.serverurl + "/api/authCode", { "code": 'aaa' }, this, () => {
                    this.OnEnterGame();
                });
            }
        }
        OnEnterGame() {
            if (rab.Util.isMobil) {
                this.InitGameInfo(() => {
                    this.loadView();
                });
            }
            else {
                this.InitGameInfo(null);
                this.loadView();
            }
            if (this.getIsNewDay()) {
            }
        }
        RandomUserName() {
            let index = Math.floor(Math.random() * this.randomUserName.length);
            return this.randomUserName[index];
        }
        LoadInitRes() {
            let count = 0;
            Object.keys(this.gameConfig.loadJson).forEach((key) => {
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
            };
            Laya.timer.frameLoop(1, this, complete);
        }
        loadView() {
            var arr = [];
            Object.keys(this.gameConfig.loadJson).forEach((key) => {
                arr.push(this.gameConfig.loadJson[key]);
            });
            Object.keys(this.gameConfig.loadui).forEach((key) => {
                arr.push(this.gameConfig.loadui[key]);
            });
            rab.Util.log("view资源加载", arr);
            if (arr.length > 0) {
                Laya.loader.load(arr, Laya.Handler.create(this, () => {
                    rab.Util.log("资源加载完成");
                    this.LoadInitRes();
                }));
            }
            else {
                this.LoadInitRes();
            }
        }
        onLoad3dScene(callback) {
            if (this.scene3D) {
                callback && callback();
            }
            else {
                Laya.loader.create(this.gameConfig.scene3d, Laya.Handler.create(this, () => {
                    rab.Util.log("3d场景加载成功");
                    this.scene3D = Laya.loader.getRes(this.gameConfig.scene3d);
                    Laya.stage.addChild(this.scene3D);
                    this.scene3D.zOrder = -1;
                    callback && callback();
                }), null);
            }
        }
        OnReConfig(conf) {
            rab.Util.log("更新在线参数", conf);
            for (var o in this.gameConfig.config) {
                if (conf[o] != null) {
                    this.gameConfig.config[o] = conf[o];
                }
            }
            for (var o in this.gameConfig.config) {
                let end = "Way";
                var d = o.length - end.length;
                if (d >= 0 && o.lastIndexOf(end) == d) {
                    this.gameConfig.config[o] = this.judgeUserWay(o);
                }
            }
        }
        judgeUserWay(pos) {
            let way = this.gameConfig.config[pos];
            if (way == 1 && !this.gameConfig.config.allow_share) {
                if (this.gameConfig.config.allow_video) {
                    way = 2;
                }
                else {
                    way = 3;
                }
            }
            if (way == 2 && !this.gameConfig.config.allow_video) {
                if (this.gameConfig.config.allow_share) {
                    way = 1;
                }
                else {
                    way = 3;
                }
            }
            return way;
        }
        onPreLoadRes(path) {
        }
    }
    class wxSdk {
        constructor() {
            console.log("初始化微信SDK");
        }
        showModal(opt) {
            if (rab.Util.isMobil) {
                wx.showModal({
                    title: opt.title || "提示",
                    content: opt.content || "提示内容",
                    success(res) {
                        if (res.confirm) {
                            console.log("confirm, continued");
                            opt.success && opt.success();
                        }
                        else if (res.cancel) {
                            console.log("cancel, cold");
                            opt.cancel && opt.cancel();
                        }
                        else {
                        }
                    },
                    fail() {
                        console.log(`showModal调用失败`);
                    }
                });
            }
            else {
                console.log(`提示框`);
            }
        }
        showToast(msg, time) {
            if (rab.Util.isMobil) {
                wx.showToast({
                    title: msg,
                    icon: 'none',
                    duration: time || 2000
                });
            }
            else {
                console.log(msg);
            }
        }
        vibrateLong() {
            if (typeof wx != "undefined") {
                wx.vibrateLong();
            }
        }
        vibrateShort() {
            if (typeof wx != "undefined") {
                wx.vibrateShort();
            }
        }
        getMenuButtonBoundingClientRect() {
            if (typeof wx != "undefined") {
                return wx.getMenuButtonBoundingClientRect();
            }
            return null;
        }
        UpdateGame(call) {
            if (typeof wx != "undefined") {
                if (typeof wx.getUpdateManager === 'function') {
                    const updateManager = wx.getUpdateManager();
                    updateManager.onCheckForUpdate(function (res) {
                        call && call(1);
                        console.log("===新版本=====" + res.hasUpdate);
                    });
                    updateManager.onUpdateReady(function () {
                        console.log("===新版本并重启=====");
                        updateManager.applyUpdate();
                        call && call(1);
                    });
                    updateManager.onUpdateFailed(function () {
                        console.log("版本更新失败");
                        call && call(0);
                    });
                }
                else {
                    call && call(1);
                }
            }
            else {
                call && call(1);
            }
        }
        openCustomerServiceConversation(title, img, success, fail) {
            if (rab.Util.isMobil) {
                if (wx.openCustomerServiceConversation) {
                    wx.openCustomerServiceConversation({
                        showMessageCard: true,
                        sendMessageTitle: title,
                        sendMessageImg: img,
                        success: (res) => {
                            success && success(res);
                        },
                        fail: (res) => {
                            fail && fail(res);
                        }
                    });
                }
            }
        }
        getSystemInfo(_version = '2.3.0') {
            const version = wx.getSystemInfoSync().SDKVersion || "1.1.0";
            if (this.compareVersion(version, _version) >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        compareVersion(v1, v2) {
            v1 = v1.split('.');
            v2 = v2.split('.');
            const len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (let i = 0; i < len; i++) {
                const num1 = parseInt(v1[i]);
                const num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                }
                else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
        onLoginWXServer(breakcall, path = "api/authCode") {
            if (rab.Util.isMobil) {
                wx.login({
                    success: (res) => {
                        if (res.code) {
                            let code = res.code;
                            console.log("登录code", res.code);
                            rab.HTTP.post(path, { "code": res.code }, this, (data) => {
                                console.log("登录code返回：", data);
                                if (data.data != null && data.data.gamedata != null) {
                                    breakcall && breakcall(data.data);
                                }
                                else {
                                    this.onCreateUserInfo(code, breakcall);
                                }
                            });
                        }
                        else {
                            console.log('登录失败！' + res.errMsg);
                        }
                    }
                });
            }
            else {
            }
        }
        getUserInfo(code, breakcall) {
            wx.getUserInfo({
                withCredentials: true,
                lang: "zh_CN",
                success: (res) => {
                    var userInfo = res.userInfo;
                    console.log("用户信息：", userInfo);
                    rab.HTTP.post("api/wxLogin", {
                        "code": code,
                        "rawData": res.rawData,
                        "signature": res.signature,
                        "encryptedData": res.encryptedData,
                        "iv": res.iv
                    }, this, (data) => {
                        console.log("登录服务器返回：", data);
                        breakcall && breakcall(data.data);
                    });
                },
                fail: () => {
                },
                complete: () => {
                }
            });
        }
        onCreateUserInfo(code, breakcall) {
            if (rab.Util.isMobil) {
                wx.getSetting({
                    success: (res) => {
                        if (res.authSetting['scope.userInfo']) {
                            this.getUserInfo(code, breakcall);
                        }
                        else {
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
                            });
                            button.onTap((res) => {
                                if (res.errMsg == "getUserInfo:ok") {
                                    console.log("授权用户信息");
                                    button.destroy();
                                    this.getUserInfo(code, breakcall);
                                }
                                else {
                                    console.log("授权失败");
                                }
                            });
                        }
                    }
                });
            }
        }
        wxHttp(path, _data, breakcall, _method = "POST") {
            if (rab.Util.isMobil) {
                wx.request({
                    url: path,
                    method: _method,
                    data: JSON.stringify(_data),
                    header: {
                        'content-type': 'application/json'
                    },
                    success: (res) => {
                        console.log(res.data);
                        breakcall && breakcall(res.data);
                    }
                });
            }
        }
        wxGETHttp(path, token, breakcall) {
            if (rab.Util.isMobil) {
                wx.request({
                    url: path,
                    method: "GET",
                    header: {
                        'Accept': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : ''
                    },
                    success: (res) => {
                        console.log(res.data);
                        breakcall && breakcall(res.data);
                    }
                });
            }
        }
    }
    class HTTP {
        constructor() {
            this.http = new Laya.HttpRequest;
        }
        init(path) {
            this._serverUrl = path;
        }
        get(url, token, callback) {
            if (rab.Util.isMobil) {
                console.log("wxurlget", url, "===data===");
                rab.wxSdk.wxGETHttp(this._serverUrl + "/" + url, token, callback);
            }
            else {
                this.caller = null;
                this.callback = callback;
                this.http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
                this.http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
                this.http.send(this._serverUrl + "/" + url, null, 'get', 'text');
            }
            return this;
        }
        post(url, data, caller, callback, contentType = "application/json") {
            if (rab.Util.isMobil) {
                console.log("wxurl", url, "===data===", data);
                rab.wxSdk.wxHttp(this._serverUrl + "/" + url, data, callback);
            }
            else {
                this.caller = caller;
                this.callback = callback;
                console.log("url", url, "===data===", data);
                this.http.once(Laya.Event.COMPLETE, this, this.onHttpRequestComplete);
                this.http.once(Laya.Event.ERROR, this, this.onHttpRequestError);
                if (contentType == null) {
                    this.http.send(this._serverUrl + "/" + url, JSON.stringify(data), 'post', 'json');
                }
                else {
                    this.http.send(this._serverUrl + "/" + url, JSON.stringify(data), 'post', 'json', ["content-type", contentType]);
                }
            }
            return this;
        }
        wxHttp(url, data, callback) {
            rab.wxSdk.wxHttp(this._serverUrl + "/" + url, data, callback);
        }
        onHttpRequestError(e) {
            this.callback.apply(this.caller, [{ state: 500, msg: e }]);
        }
        onHttpRequestComplete(e) {
            this.callback.apply(this.caller, [{ state: 200, data: this.http.data }]);
        }
    }
    var rab = {
        RabObj: RabObj,
        RabView: RabView,
        GameObject: GameObject,
        MusicManager: MusicManager.getInstance(),
        RabGameManager: RabGameManager,
        RabController: RabController,
        RabNotity: RabNotity,
        HTTP: new HTTP(),
        wxSdk: new wxSdk(),
        UIManager: new ViewManager(),
        SDKChannel: new GameChannel(),
        Util: new UtilTool(),
        RabViewConfig: new RabViewConfig(),
        RabComponent: RabComponent,
        EventListener: EventListener.getInstance(),
    };

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var view;
        (function (view) {
            class GameUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GameUI.uiView);
                }
            }
            GameUI.uiView = { "type": "Scene", "props": { "width": 750, "top": 0, "right": 0, "name": "Game", "left": 0, "height": 1334, "centerY": 0, "centerX": 0, "bottom": 0 }, "compId": 2, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 53 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "var": "cloudNode", "name": "cloudNode", "height": 1334 }, "compId": 274 }, { "type": "Image", "props": { "y": 231, "x": 375, "width": 750, "var": "pendantNode", "name": "pendantNode", "height": 230, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 248, "child": [{ "type": "Image", "props": { "var": "progressNode", "name": "progressNode", "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 252, "child": [{ "type": "Image", "props": { "y": -54, "x": -308, "var": "pauseBtn", "skin": "new/com/b_zhanting.png", "name": "pauseBtn", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 263 }, { "type": "Image", "props": { "skin": "new/game/qizhi.png", "right": -286, "name": "nextPass", "centerY": 24, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 256 }, { "type": "Image", "props": { "width": 540, "var": "progress_b", "skin": "new/game/jindutiao3.png", "sizeGrid": "6,15,6,15", "name": "progress_b", "height": 26, "centerY": 61, "centerX": 23 }, "compId": 259, "child": [{ "type": "Image", "props": { "width": 540, "var": "progress_m", "top": 0, "skin": "new/game/jindutiao3.png", "sizeGrid": "6,15,6,15", "scaleX": 0.98, "renderType": "mask", "name": "progress_m", "left": 0, "bottom": 0 }, "compId": 262 }, { "type": "Image", "props": { "x": 0, "width": 540, "var": "progress_t", "skin": "new/game/jingdutiao2.png", "sizeGrid": "6,15,6,15", "scaleY": 0.95, "name": "progress_t", "centerY": -1, "anchorY": 0.5, "anchorX": 1 }, "compId": 260 }] }, { "type": "Image", "props": { "x": -247, "var": "iconNode", "skin": "new/game/zhi.png", "centerY": 49, "anchorX": 0.5 }, "compId": 286, "child": [{ "type": "Image", "props": { "var": "icon", "skin": "new/game/tou_02.png", "centerY": -31, "centerX": 0 }, "compId": 287 }] }] }, { "type": "Image", "props": { "y": 116, "x": 172, "width": 290, "var": "lifeNode", "skin": "new/game/jingdutiaodi1.png", "sizeGrid": "13,13,13,13", "name": "lifeNode", "height": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 249, "child": [{ "type": "Image", "props": { "width": 290, "var": "life_bg", "top": 4, "skin": "new/game/jingdutiao1.png", "left": 4 }, "compId": 281 }, { "type": "Image", "props": { "top": -10, "skin": "new/game/aixin.png", "left": -10, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 250 }, { "type": "FontClip", "props": { "x": 162, "var": "lifeText", "value": "0", "skin": "ui/coinNum.png", "sheet": "0123456789", "name": "lifeText", "centerY": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 251 }] }, { "type": "Image", "props": { "y": 216, "x": 172, "width": 290, "var": "coinNode", "skin": "new/game/jinbidi.png", "sizeGrid": "13,13,13,13", "name": "codeNode", "height": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 282, "child": [{ "type": "Image", "props": { "top": -10, "skin": "new/game/jinbi.png", "left": -10, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 284 }, { "type": "FontClip", "props": { "x": 162, "var": "coinText", "value": "0", "skin": "ui/coinNum.png", "sheet": "0123456789", "centerY": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 285 }] }] }, { "type": "Image", "props": { "var": "timeDown", "skin": "new/game/3.png", "centerY": -160, "centerX": 0 }, "compId": 280 }, { "type": "Box", "props": { "width": 750, "var": "guild", "right": 0, "left": 0, "height": 308, "bottom": 94 }, "compId": 291, "child": [{ "type": "Image", "props": { "skin": "new/game/jiantou.png", "left": 74, "centerY": -107 }, "compId": 288 }, { "type": "Image", "props": { "skin": "new/game/jiantou.png", "scaleX": -1, "right": 185, "centerY": -107 }, "compId": 289 }, { "type": "Image", "props": { "skin": "new/game/t_xzhxyhdjs.png", "centerX": 12, "bottom": -37 }, "compId": 290 }] }], "loadList": ["new/com/b_zhanting.png", "new/game/qizhi.png", "new/game/jindutiao3.png", "new/game/jingdutiao2.png", "new/game/zhi.png", "new/game/tou_02.png", "new/game/jingdutiaodi1.png", "new/game/jingdutiao1.png", "new/game/aixin.png", "ui/coinNum.png", "new/game/jinbidi.png", "new/game/jinbi.png", "new/game/3.png", "new/game/jiantou.png", "new/game/t_xzhxyhdjs.png"], "loadList3D": [] };
            view.GameUI = GameUI;
            REG("ui.view.GameUI", GameUI);
            class GameFailUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GameFailUI.uiView);
                }
            }
            GameFailUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "GameFail", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Image", "props": { "y": -1, "x": 0, "top": -1, "skin": "new/com/beijing.png", "left": 0 }, "compId": 83, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 84 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 85 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 86 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 87 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 88 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 89 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 90 }] }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "var": "cloudNode", "height": 1334 }, "compId": 73 }, { "type": "Image", "props": { "x": 375, "var": "resrart", "skin": "new/com/bd_cxtz.png", "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 53 }, { "type": "Image", "props": { "x": 605, "var": "share", "skin": "new/com/b_fenxiang.png", "bottom": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 51 }, { "type": "Image", "props": { "x": 140, "var": "home", "skin": "new/com/b_zhuye.png", "bottom": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 55 }, { "type": "Image", "props": { "top": 54, "skin": "new/com/t_tzsb.png", "centerX": 0 }, "compId": 58 }, { "type": "VBox", "props": { "y": 312, "right": 0, "left": 0, "height": 100 }, "compId": 62, "child": [{ "type": "Image", "props": { "skin": "new/game/jinbi.png", "centerY": 0, "centerX": -118 }, "compId": 59 }, { "type": "FontClip", "props": { "var": "coinText", "value": "0", "skin": "ui/failNum.png", "sheet": "0123456789", "name": "coinText", "centerY": 1, "centerX": 44 }, "compId": 61 }] }], "loadList": ["new/com/beijing.png", "new/com/bd_cxtz.png", "new/com/b_fenxiang.png", "new/com/b_zhuye.png", "new/com/t_tzsb.png", "new/game/jinbi.png", "ui/failNum.png"], "loadList3D": [] };
            view.GameFailUI = GameFailUI;
            REG("ui.view.GameFailUI", GameFailUI);
            class GameSetUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GameSetUI.uiView);
                }
            }
            GameSetUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "GameSet", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "var": "cover", "name": "cover", "height": 1334, "alpha": 0.75 }, "compId": 43, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 2000, "fillColor": "#000000" }, "compId": 45 }, { "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 16 }] }, { "type": "Image", "props": { "y": 667, "x": 375, "width": 750, "visible": false, "var": "window", "name": "window", "mouseThrough": true, "height": 1000, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24, "child": [{ "type": "Script", "props": { "right": 0, "left": 0, "centerY": 0, "runtime": "laya.ui.Widget" }, "compId": 25 }, { "type": "Image", "props": { "y": 91, "x": 375, "skin": "ui/bg_5.png", "sizeGrid": "100,20,20,20", "height": 680, "anchorX": 0.5 }, "compId": 50, "child": [{ "type": "Image", "props": { "y": 48, "x": 618, "var": "closeBtn", "skin": "ui/closeBtn.png", "name": "closeBtn", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 51 }, { "type": "Image", "props": { "y": 47, "x": 330, "skin": "ui/setText.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 58 }, { "type": "Image", "props": { "y": 212, "x": 330, "width": 600, "skin": "ui/bg_8.png", "sizeGrid": "15,15,15,15", "height": 200, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 59 }, { "type": "Image", "props": { "y": 168, "x": 126, "skin": "ui/soundText.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 60 }, { "type": "Image", "props": { "y": 171, "x": 409, "width": 341, "skin": "ui/load5.png", "sizeGrid": "0,15,0,15", "name": "sound", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 61, "child": [{ "type": "Image", "props": { "y": 20, "x": 86, "var": "soundClose", "skin": "ui/load3.png", "name": "soundClose", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 62 }, { "type": "Image", "props": { "y": 20, "x": 255, "var": "soundOpen", "skin": "ui/load4.png", "name": "soundOpen", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 63 }, { "type": "Label", "props": { "y": 21, "x": 86, "width": 166, "var": "soundCloseText", "valign": "middle", "text": "关", "strokeColor": "#080808", "stroke": 3, "name": "soundCloseText", "height": 38, "fontSize": 30, "font": "SimHei", "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 64 }, { "type": "Label", "props": { "y": 21, "x": 255, "width": 166, "var": "soundOpenText", "valign": "middle", "text": "开", "strokeColor": "#080808", "stroke": 3, "name": "soundOpenText", "height": 38, "fontSize": 30, "font": "SimHei", "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 65 }] }, { "type": "Image", "props": { "y": 253, "x": 126, "skin": "ui/vibrateText.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 71 }, { "type": "Image", "props": { "y": 256, "x": 409, "width": 341, "skin": "ui/load5.png", "sizeGrid": "0,15,0,15", "name": "vibrate", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 72, "child": [{ "type": "Image", "props": { "y": 20, "x": 86, "var": "vibrateClose", "skin": "ui/load3.png", "name": "vibrateClose", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 73 }, { "type": "Image", "props": { "y": 20, "x": 255, "var": "vibrateOpen", "skin": "ui/load4.png", "name": "vibrateOpen", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 74 }, { "type": "Label", "props": { "y": 21, "x": 86, "width": 166, "var": "vibrateCloseText", "valign": "middle", "text": "关", "strokeColor": "#080808", "stroke": 3, "name": "vibrateCloseText", "height": 38, "fontSize": 30, "font": "SimHei", "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 75 }, { "type": "Label", "props": { "y": 21, "x": 255, "width": 166, "var": "vibrateOpenText", "valign": "middle", "text": "开", "strokeColor": "#080808", "stroke": 3, "name": "vibrateOpenText", "height": 38, "fontSize": 30, "font": "SimHei", "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 76 }] }, { "type": "List", "props": { "y": 419, "x": 330, "width": 600, "var": "list", "spaceX": 25, "repeatY": 1, "repeatX": 5, "name": "list", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 79, "child": [{ "type": "Box", "props": { "y": 50, "x": 50, "width": 100, "renderType": "render", "name": "render", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 78, "child": [{ "type": "Image", "props": { "y": 50, "x": 50, "width": 100, "skin": "ui/bg_7.png", "sizeGrid": "15,15,17,15", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 81 }] }, { "type": "HScrollBar", "props": { "name": "scrollBar" }, "compId": 80 }] }, { "type": "Image", "props": { "y": 585, "x": 495.5, "var": "shareBtn", "skin": "ui/btn_yellow_small.png", "name": "shareBtn", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 82 }, { "type": "Image", "props": { "y": 601, "x": 104, "width": 150, "var": "followBtn", "skin": "ui/btn_blue_small2.png", "name": "followBtn", "height": 80, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 84 }, { "type": "Image", "props": { "y": 601, "x": 267, "width": 150, "var": "subscribeBtn", "skin": "ui/btn_blue_small2.png", "name": "subscribeBtn", "height": 80, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 86 }] }] }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 750, "visible": false, "var": "collectIImage", "name": "collectIImage", "height": 2000 }, "compId": 88, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "alpha": 0.75 }, "compId": 89, "child": [{ "type": "Rect", "props": { "y": 0, "x": 0, "width": 750, "lineWidth": 1, "height": 2000, "fillColor": "#000000" }, "compId": 90 }] }, { "type": "Image", "props": { "y": 638, "x": 375, "skin": "ui/collectIImage.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 91 }, { "type": "Image", "props": { "y": 190, "x": 693, "skin": "ui/closeBtn.png", "name": "closeBtn", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 92 }] }], "loadList": ["ui/bg_5.png", "ui/closeBtn.png", "ui/setText.png", "ui/bg_8.png", "ui/soundText.png", "ui/load5.png", "ui/load3.png", "ui/load4.png", "ui/vibrateText.png", "ui/bg_7.png", "ui/btn_yellow_small.png", "ui/btn_blue_small2.png", "ui/collectIImage.png"], "loadList3D": [] };
            view.GameSetUI = GameSetUI;
            REG("ui.view.GameSetUI", GameSetUI);
            class GameWinUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GameWinUI.uiView);
                }
            }
            GameWinUI.uiView = { "type": "Scene", "props": { "y": 0, "x": 0, "width": 750, "name": "GameWin", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Image", "props": { "y": -1, "x": 0, "top": -1, "skin": "new/com/beijing.png", "left": 0 }, "compId": 70, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 71 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 72 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 73 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 74 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 75 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 76 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 77 }] }, { "type": "Image", "props": { "var": "eff", "skin": "new/com/guangxiao.png", "rotation": 0, "centerY": 108, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 66 }, { "type": "Sprite", "props": { "y": -1, "x": 0, "width": 750, "var": "cloudNode", "name": "cloudNode", "height": 1334 }, "compId": 65 }, { "type": "Image", "props": { "zOrder": 1, "var": "winNode", "top": 0, "right": 0, "name": "winNode", "left": 0, "bottom": 0, "anchorX": 0.5 }, "compId": 24, "child": [{ "type": "Image", "props": { "y": 190, "x": 375, "skin": "new/com/t_tzcg.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 64 }, { "type": "Image", "props": { "y": 325, "x": 375, "width": 750, "visible": false, "var": "award", "name": "award", "height": 100, "anchorX": 0.5 }, "compId": 33, "child": [{ "type": "Image", "props": { "y": 55, "skin": "new/game/jinbi.png", "centerX": -100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 35 }, { "type": "FontClip", "props": { "y": 55, "var": "coinText", "value": "0", "skin": "ui/coinNum.png", "sheet": "0123456789", "scaleY": 1.2, "scaleX": 1.2, "name": "coinText", "centerX": 23, "anchorY": 0.5, "anchorX": 0 }, "compId": 36 }] }, { "type": "Image", "props": { "x": 375, "visible": false, "var": "next", "skin": "new/com/bd_xyg.png", "name": "next", "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18 }, { "type": "Image", "props": { "x": 140, "width": 100, "visible": false, "var": "homeBtn", "skin": "new/com/b_zhuye.png", "name": "homeBtn", "height": 107, "bottom": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 54 }, { "type": "Image", "props": { "x": 605, "width": 100, "visible": true, "var": "share", "skin": "new/com/b_fenxiang.png", "height": 107, "bottom": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20 }] }, { "type": "Image", "props": { "zOrder": 2, "visible": false, "var": "cover", "top": 0, "skin": "new/com/rect3.png", "right": 0, "name": "cover", "left": 0, "bottom": 0, "alpha": 0.75 }, "compId": 67 }, { "type": "Image", "props": { "zOrder": 3, "visible": false, "var": "bigPhoto", "skin": "new/com/Photo/pic_01_b.png", "name": "bigPhoto", "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 68 }], "loadList": ["new/com/beijing.png", "new/com/guangxiao.png", "new/com/t_tzcg.png", "new/game/jinbi.png", "ui/coinNum.png", "new/com/bd_xyg.png", "new/com/b_zhuye.png", "new/com/b_fenxiang.png", "new/com/rect3.png", "new/com/Photo/pic_01_b.png"], "loadList3D": [] };
            view.GameWinUI = GameWinUI;
            REG("ui.view.GameWinUI", GameWinUI);
            class GetTicketUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(GetTicketUI.uiView);
                }
            }
            GetTicketUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "GetTicket", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "var": "cover", "name": "cover", "height": 1334, "alpha": 0.75 }, "compId": 43, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 2000, "fillColor": "#000000" }, "compId": 45 }, { "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 16 }] }, { "type": "Image", "props": { "y": 667, "x": 375, "width": 750, "mouseThrough": true, "height": 1000, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24, "child": [{ "type": "Script", "props": { "right": 0, "left": 0, "centerY": 0, "runtime": "laya.ui.Widget" }, "compId": 25 }, { "type": "Image", "props": { "y": 375, "x": 375, "width": 660, "visible": false, "var": "window", "skin": "ui/bg_5.png", "name": "window", "height": 571, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 50, "child": [{ "type": "Image", "props": { "y": 48, "x": 618, "var": "closeBtn", "skin": "ui/closeBtn.png", "name": "closeBtn", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 51 }, { "type": "Image", "props": { "y": 47, "x": 330, "skin": "ui/getTicketText.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 57 }, { "type": "Image", "props": { "y": 259, "x": 330, "skin": "ui/bg_4.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 52 }, { "type": "Image", "props": { "y": 244, "x": 330, "skin": "ui/light3.png", "scaleY": 1.5, "scaleX": 1.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 53 }, { "type": "Image", "props": { "y": 244, "x": 330, "skin": "ui/ticket2.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 58 }, { "type": "FontClip", "props": { "y": 365, "x": 330, "var": "currentTIcketText", "value": "30/30", "skin": "ui/passNum.png", "sheet": "0123456789/", "scaleY": 1.5, "scaleX": 1.5, "name": "currentTIcketText", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 54 }, { "type": "Image", "props": { "y": 495, "x": 330, "var": "getTicketBtn", "skin": "ui/btn_blue_small.png", "name": "getTicketBtn", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 55, "child": [{ "type": "Label", "props": { "y": 56.5, "x": 141.5, "var": "getTicketText", "text": "领取15点体力", "strokeColor": "#8b8b8b", "stroke": 3, "name": "getTicketText", "fontSize": 40, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 56 }] }] }] }], "loadList": ["ui/bg_5.png", "ui/closeBtn.png", "ui/getTicketText.png", "ui/bg_4.png", "ui/light3.png", "ui/ticket2.png", "ui/passNum.png", "ui/btn_blue_small.png"], "loadList3D": [] };
            view.GetTicketUI = GetTicketUI;
            REG("ui.view.GetTicketUI", GetTicketUI);
            class LoadingUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(LoadingUI.uiView);
                }
            }
            LoadingUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "Loading", "height": 1334, "centerY": 0, "centerX": 0 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 15 }, { "type": "Image", "props": { "y": -1, "x": 0, "top": -1, "skin": "new/com/beijing.png", "name": "bg", "left": 0 }, "compId": 36, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 37 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 38 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 39 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 40 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 41 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 42 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 43 }] }, { "type": "Box", "props": { "x": 200, "var": "boxProgress", "right": 200, "left": 200, "height": 41, "bottom": 320 }, "compId": 9, "child": [{ "type": "Image", "props": { "width": 350, "top": 5, "skin": "load/bar1.png", "sizeGrid": "0,20,0,20", "right": 0, "left": 0, "height": 27, "bottom": 9 }, "compId": 10 }, { "type": "Image", "props": { "y": 8, "x": 5, "width": 340, "var": "imgProgress", "skin": "load/bar2.png", "sizeGrid": "0,20,0,20", "height": 20 }, "compId": 11 }] }, { "type": "Label", "props": { "var": "lbProgress", "text": "Progress", "fontSize": 22, "color": "#f9f9f9", "centerX": 0, "bottom": 298 }, "compId": 7 }], "loadList": ["new/com/beijing.png", "load/bar1.png", "load/bar2.png"], "loadList3D": [] };
            view.LoadingUI = LoadingUI;
            REG("ui.view.LoadingUI", LoadingUI);
            class NotClickUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(NotClickUI.uiView);
                }
            }
            NotClickUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "NotClick", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Image", "props": { "y": -2, "x": 0, "var": "bg", "top": -1, "skin": "new/com/beijing.png", "name": "bg", "left": 0 }, "compId": 45, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 46 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 47 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 48 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 49 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 50 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 51 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 52 }] }, { "type": "Image", "props": { "var": "click", "top": 0, "right": 0, "name": "click", "left": 0, "bottom": 0 }, "compId": 24 }, { "type": "Image", "props": { "width": 200, "visible": false, "var": "loadNode", "skin": "new/com/paihangbangdiban.png", "sizeGrid": "20,20,20,20", "name": "loadNode", "height": 75, "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 26, "child": [{ "type": "Label", "props": { "y": 37.5, "x": 23, "var": "loadText", "text": "加载中...", "strokeColor": "#2c2c2c", "stroke": 2, "name": "loadText", "fontSize": 40, "font": "SimHei", "color": "#ffffff", "anchorY": 0.5, "anchorX": 0 }, "compId": 27 }] }], "loadList": ["new/com/beijing.png", "new/com/paihangbangdiban.png"], "loadList3D": [] };
            view.NotClickUI = NotClickUI;
            REG("ui.view.NotClickUI", NotClickUI);
            class PauseUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(PauseUI.uiView);
                }
            }
            PauseUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "Pause", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "alpha": 0.5 }, "compId": 24, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 2000, "fillColor": "#000000" }, "compId": 23 }] }, { "type": "Image", "props": { "width": 558, "skin": "new/com/tanchuang.png", "sizeGrid": "56,56,56,56", "pivotY": -42, "pivotX": -58, "height": 662, "centerY": 0, "centerX": 0 }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 169, "x": 279, "var": "continueBtn", "skin": "new/com/b_jxyx.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18 }, { "type": "Image", "props": { "y": 514, "x": 279, "var": "home", "text": "退出", "strokeColor": "#2c2c2c", "stroke": 1, "skin": "new/com/b_zcd.png", "fontSize": 40, "font": "SimHei", "color": "#2c2c2c", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20 }, { "type": "Image", "props": { "y": 274, "x": 279, "var": "restart", "skin": "new/com/b_cxks.png", "anchorX": 0.5 }, "compId": 22 }] }], "loadList": ["new/com/tanchuang.png", "new/com/b_jxyx.png", "new/com/b_zcd.png", "new/com/b_cxks.png"], "loadList3D": [] };
            view.PauseUI = PauseUI;
            REG("ui.view.PauseUI", PauseUI);
            class PendantUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(PendantUI.uiView);
                }
            }
            PendantUI.uiView = { "type": "Scene", "props": { "width": 750, "name": "Pendant", "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Image", "props": { "y": 54, "x": 134, "width": 180, "var": "ticketBox", "skin": "new/game/jingdutiao1.png", "sizeGrid": "10,10,10,10", "name": "ticketBox", "height": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": -1, "x": -24.5, "skin": "new/game/aixin.png" }, "compId": 6 }, { "type": "Image", "props": { "y": -4, "x": 159.5 }, "compId": 7 }, { "type": "Label", "props": { "y": 25, "x": 117, "text": "10:00", "strokeColor": "#000000", "stroke": 2, "name": "timeText", "fontSize": 30, "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "FontClip", "props": { "y": 39.5, "x": 20.5, "value": "30", "skin": "ui/coinNum.png", "sheet": "0123456789", "scaleY": 0.8, "scaleX": 0.8, "name": "text", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15 }] }, { "type": "Image", "props": { "y": 54, "x": 370, "width": 180, "var": "coinBox", "skin": "new/game/jinbidi.png", "sizeGrid": "10,10,10,10", "name": "coinBox", "height": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10, "child": [{ "type": "Image", "props": { "y": -4, "x": -23.5, "skin": "new/game/jinbi.png" }, "compId": 11 }, { "type": "Image", "props": { "y": -4, "x": 159.5 }, "compId": 12 }, { "type": "Label", "props": { "y": 27, "x": 98.9267578125, "text": "0", "strokeColor": "#000000", "stroke": 2, "name": "text", "fontSize": 30, "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 13 }] }], "loadList": ["new/game/jingdutiao1.png", "new/game/aixin.png", "ui/coinNum.png", "new/game/jinbidi.png", "new/game/jinbi.png"], "loadList3D": [] };
            view.PendantUI = PendantUI;
            REG("ui.view.PendantUI", PendantUI);
            class PhotoWallUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(PhotoWallUI.uiView);
                }
            }
            PhotoWallUI.uiView = { "type": "Scene", "props": { "width": 750, "runtime": "runtime/ImgEffect.ts", "name": "PhotoWall", "height": 1334, "centerY": 0, "centerX": 0 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 119 }, { "type": "Image", "props": { "y": -1, "x": 0, "top": -1, "skin": "new/com/beijing.png", "left": 0 }, "compId": 545, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 546 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 547 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 548 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 549 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 550 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 551 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 552 }] }, { "type": "Image", "props": { "y": 70, "x": 87, "var": "breakBtn", "top": 16, "skin": "new/com/b_fanhui.png", "name": "breakBtn", "left": 37, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 244 }, { "type": "Image", "props": { "width": 700, "var": "list", "skin": "new/com/tanchuang.png", "sizeGrid": "75,77,75,65", "name": "list", "height": 1080, "centerY": 111, "centerX": 7, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 488, "child": [{ "type": "Image", "props": { "y": -177, "x": 217, "skin": "new/com/t_zpq.png" }, "compId": 489 }, { "type": "Image", "props": { "y": -39, "var": "year80GaryBtn", "skin": "new/com/b_80years1.png", "name": "year80GaryBtn", "centerX": -261, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 490 }, { "type": "Image", "props": { "y": -39, "var": "year80YellowBtn", "skin": "new/com/b_80years.png", "name": "year80YellowBtn", "centerX": -261, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 491 }, { "type": "Image", "props": { "y": -39, "var": "year90GaryBtn", "skin": "new/com/b_90years1.png", "name": "year90GaryBtn", "centerX": -91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 492 }, { "type": "Image", "props": { "y": -39, "var": "year90YellowBtn", "skin": "new/com/b_90years.png", "name": "year90YellowBtn", "centerX": -91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 493 }, { "type": "Image", "props": { "y": -39, "var": "year00GaryBtn", "skin": "new/com/b_00years1.png", "name": "year00GaryBtn", "centerX": 79, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 494 }, { "type": "Image", "props": { "y": -39, "var": "year00YellowBtn", "skin": "new/com/b_00years.png", "name": "year00YellowBtn", "centerX": 79, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 495 }, { "type": "Image", "props": { "y": -39, "var": "year10GaryBtn", "skin": "new/com/b_10years1.png", "name": "year10GaryBtn", "centerX": 249, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 496 }, { "type": "Image", "props": { "y": -39, "var": "year10YellowBtn", "skin": "new/com/b_10years.png", "name": "year10YellowBtn", "centerX": 249, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 497 }] }, { "type": "List", "props": { "y": 778, "x": 375, "width": 600, "var": "photoList", "spaceY": 22, "spaceX": 30, "repeatY": 6, "repeatX": 2, "name": "photoList", "height": 980, "centerY": 111, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 526, "child": [{ "type": "Box", "props": { "y": 5, "x": 10, "width": 275, "name": "render", "height": 310 }, "compId": 525, "child": [{ "type": "Image", "props": { "y": 145.5, "x": 137.5, "width": 275, "skin": "new/com/zhaopian.png", "name": "item", "height": 291, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 529, "child": [{ "type": "Image", "props": { "y": 170, "x": 137.5, "skin": "new/com/zhaopian X.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 530 }, { "type": "Label", "props": { "y": 38, "x": 137.5, "text": "老照片", "fontSize": 30, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 531 }] }] }, { "type": "VScrollBar", "props": { "y": 14, "x": 1046, "name": "scrollBar" }, "compId": 536 }] }, { "type": "Image", "props": { "visible": false, "var": "cover", "top": 0, "skin": "new/com/rect3.png", "right": 0, "name": "cover", "left": 0, "bottom": 0, "alpha": 0.75 }, "compId": 522 }, { "type": "Image", "props": { "visible": false, "var": "bigPhoto", "skin": "new/com/Photo/pic_01_b.png", "name": "bigPhoto", "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 523 }], "loadList": ["new/com/beijing.png", "new/com/b_fanhui.png", "new/com/tanchuang.png", "new/com/t_zpq.png", "new/com/b_80years1.png", "new/com/b_80years.png", "new/com/b_90years1.png", "new/com/b_90years.png", "new/com/b_00years1.png", "new/com/b_00years.png", "new/com/b_10years1.png", "new/com/b_10years.png", "new/com/zhaopian.png", "new/com/zhaopian X.png", "new/com/rect3.png", "new/com/Photo/pic_01_b.png"], "loadList3D": [] };
            view.PhotoWallUI = PhotoWallUI;
            REG("ui.view.PhotoWallUI", PhotoWallUI);
            class PlatformUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(PlatformUI.uiView);
                }
            }
            PlatformUI.uiView = { "type": "Scene", "props": { "width": 750, "runtime": "runtime/ImgEffect.ts", "name": "Platform", "height": 1334, "centerY": 0, "centerX": 0 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 119 }, { "type": "Image", "props": { "top": 0, "skin": "ui/bg_1.jpg", "right": 0, "left": 0, "bottom": 0 }, "compId": 127 }, { "type": "Sprite", "props": { "y": 204, "x": 65, "texture": "ui/LOGO.png" }, "compId": 258 }, { "type": "Image", "props": { "right": 0, "left": 0, "height": 200, "bottom": 100, "anchorY": 1, "anchorX": 0.5 }, "compId": 130, "child": [{ "type": "Image", "props": { "y": 140, "x": 189, "var": "set", "skin": "new/com/bd_syk.png", "centerY": 40, "centerX": -186, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 255 }, { "type": "Image", "props": { "y": 140, "x": 561, "var": "lan", "skin": "new/com/bd_yy.png", "centerY": 40, "centerX": 186, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 253 }, { "type": "Image", "props": { "y": 0, "x": 189, "var": "rank", "skin": "new/com/bd_phb.png", "centerY": -100, "centerX": -186, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 249 }, { "type": "Image", "props": { "y": 0, "x": 561, "var": "pic", "skin": "new/com/bd_zpq.png", "centerY": -100, "centerX": 186, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 251 }] }, { "type": "Image", "props": { "var": "startBtn", "skin": "new/com/bd_ksyx.png", "name": "startBtn", "centerX": 14, "bottom": 541, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 244 }, { "type": "Image", "props": { "y": 72, "x": -380, "var": "preload", "name": "preload" }, "compId": 264 }], "loadList": ["ui/bg_1.jpg", "ui/LOGO.png", "new/com/bd_syk.png", "new/com/bd_yy.png", "new/com/bd_phb.png", "new/com/bd_zpq.png", "new/com/bd_ksyx.png"], "loadList3D": [] };
            view.PlatformUI = PlatformUI;
            REG("ui.view.PlatformUI", PlatformUI);
            class RankUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(RankUI.uiView);
                }
            }
            RankUI.uiView = { "type": "Scene", "props": { "width": 750, "runtime": "runtime/ImgEffect.ts", "name": "Rank", "height": 1334, "centerY": 0, "centerX": 0 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 119 }, { "type": "Image", "props": { "y": 16, "x": 37, "top": -1, "skin": "new/com/beijing.png", "left": 0 }, "compId": 562, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 563 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 564 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 565 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 566 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 567 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 568 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 569 }] }, { "type": "Image", "props": { "var": "breakBtn", "top": 16, "skin": "new/com/b_fanhui.png", "name": "breakBtn", "left": 37, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 244 }, { "type": "Image", "props": { "width": 680, "var": "list", "skin": "new/com/paihangbangdiban.png", "sizeGrid": "25,25,25,25", "name": "list", "height": 1100, "centerY": 50, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 270, "child": [{ "type": "Image", "props": { "y": -91, "x": 212, "skin": "new/com/t_paihangb.png" }, "compId": 269 }, { "type": "Image", "props": { "y": 1120, "visible": false, "var": "upBtn", "skin": "new/com/b_shangyiye.png", "name": "upBtn", "centerX": -150, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 271 }, { "type": "Image", "props": { "y": 1120, "visible": false, "var": "downBtn", "skin": "new/com/b_xiayiye.png", "name": "downBtn", "centerX": 150, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 272 }, { "type": "List", "props": { "y": 507, "x": 340, "width": 630, "var": "rankList", "spaceY": 0, "spaceX": 0, "repeatY": 9, "repeatX": 1, "name": "rankList", "height": 1080, "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 487, "child": [{ "type": "Box", "props": { "y": 10, "width": 630, "name": "render", "height": 120 }, "compId": 488, "child": [{ "type": "Image", "props": { "y": 50.5, "x": 315, "width": 630, "name": "item", "height": 105, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 489, "child": [{ "type": "Image", "props": { "y": 50.5, "width": 630, "skin": "new/com/4st.png", "sizeGrid": "0,15,0,109", "name": "item", "anchorY": 0.5, "anchorX": 0 }, "compId": 496, "child": [{ "type": "Image", "props": { "y": 51.5, "x": 144, "width": 60, "skin": "new/com/beijing.png", "name": "head", "height": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 539, "child": [{ "type": "Image", "props": { "y": 31, "x": 31, "width": 58, "skin": "new/game/jingdutiaodi1.png", "sizeGrid": "5,5,5,5", "renderType": "mask", "pivotY": 30, "pivotX": 30, "height": 58 }, "compId": 540 }] }, { "type": "Image", "props": { "y": 51.5, "x": 144, "width": 60, "skin": "new/com/kuang4.png", "pivotY": 30, "pivotX": 30, "height": 60 }, "compId": 541 }, { "type": "Label", "props": { "y": 56.5, "x": 190, "text": "松下纱荣子", "strokeColor": "#621311", "stroke": 0, "fontSize": 25, "font": "Microsoft YaHei", "color": "#00a3ff", "anchorY": 0.5 }, "compId": 542 }, { "type": "Image", "props": { "y": 51.5, "x": 332, "width": 300, "name": "score", "height": 100, "anchorY": 0.5 }, "compId": 543, "child": [{ "type": "Image", "props": { "y": 49, "x": 0, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 544 }, { "type": "Image", "props": { "y": 49, "x": 32, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 545 }, { "type": "Image", "props": { "y": 49, "x": 64, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 546 }, { "type": "Image", "props": { "y": 49, "x": 96, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 547 }, { "type": "Image", "props": { "y": 50, "x": 128, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 548 }, { "type": "Image", "props": { "y": 50, "x": 160, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 549 }, { "type": "Image", "props": { "y": 50, "x": 192, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 550 }, { "type": "Image", "props": { "y": 50, "x": 224, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 551 }, { "type": "Image", "props": { "y": 49, "x": 256, "skin": "new/com/num/score/0.png", "anchorY": 0.5 }, "compId": 552 }] }, { "type": "Image", "props": { "y": 52, "x": 57, "width": 29, "skin": "new/com/num/index/0.png", "pivotY": 22, "pivotX": 15, "name": "index", "height": 44 }, "compId": 553 }] }] }] }, { "type": "VScrollBar", "props": { "y": 14, "x": 1046, "name": "scrollBar" }, "compId": 492 }] }] }], "loadList": ["new/com/beijing.png", "new/com/b_fanhui.png", "new/com/paihangbangdiban.png", "new/com/t_paihangb.png", "new/com/b_shangyiye.png", "new/com/b_xiayiye.png", "new/com/4st.png", "new/game/jingdutiaodi1.png", "new/com/kuang4.png", "new/com/num/score/0.png", "new/com/num/index/0.png"], "loadList3D": [] };
            view.RankUI = RankUI;
            REG("ui.view.RankUI", RankUI);
            class RoleSelectUI extends Scene {
                constructor() {
                    super();
                }
                createChildren() {
                    super.createChildren();
                    this.createView(RoleSelectUI.uiView);
                }
            }
            RoleSelectUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 3 }, { "type": "Image", "props": { "y": -1, "x": 0, "top": -1, "skin": "new/com/beijing.png", "left": 0 }, "compId": 83, "child": [{ "type": "Image", "props": { "y": 1, "x": 495, "skin": "new/com/beijing.png" }, "compId": 84 }, { "type": "Image", "props": { "y": 388, "x": 0, "skin": "new/com/beijing.png" }, "compId": 85 }, { "type": "Image", "props": { "y": 388, "x": 495, "skin": "new/com/beijing.png" }, "compId": 86 }, { "type": "Image", "props": { "y": 769, "x": 0, "skin": "new/com/beijing.png" }, "compId": 87 }, { "type": "Image", "props": { "y": 769, "x": 495, "skin": "new/com/beijing.png" }, "compId": 88 }, { "type": "Image", "props": { "y": 1152, "x": 0, "skin": "new/com/beijing.png" }, "compId": 89 }, { "type": "Image", "props": { "y": 1152, "x": 495, "skin": "new/com/beijing.png" }, "compId": 90 }] }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "var": "cloudNode", "name": "cloudNode", "height": 1334 }, "compId": 4 }, { "type": "Image", "props": { "y": 79, "x": 73, "var": "break", "top": 26, "skin": "new/com/b_fanhui.png", "left": 23, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22 }, { "type": "Image", "props": { "y": 985, "x": 375, "var": "startBtn", "skin": "new/com/bd_ksyx.png", "name": "startBtn", "centerX": 0, "bottom": 277, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 39 }, { "type": "Image", "props": { "var": "r1", "skin": "new/role/touxiangk.png", "centerX": -282, "bottom": 80, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24, "child": [{ "type": "Image", "props": { "var": "img_1", "skin": "new/role/touxiang_02.png", "centerY": 0, "centerX": 0 }, "compId": 25 }, { "type": "Image", "props": { "skin": "new/role/mingzidi.png", "centerX": 0, "bottom": -60 }, "compId": 43, "child": [{ "type": "Label", "props": { "var": "roleName_1", "text": "JACK", "fontSize": 30, "color": "#929b9e", "centerY": 0, "centerX": 0, "bold": true }, "compId": 42 }] }, { "type": "Image", "props": { "var": "select_1", "skin": "new/role/touxiangk2.png", "centerY": 0, "centerX": 0 }, "compId": 44 }] }, { "type": "Image", "props": { "var": "r2", "skin": "new/role/touxiangk.png", "centerX": -94, "bottom": 80 }, "compId": 45, "child": [{ "type": "Image", "props": { "var": "img_2", "skin": "new/role/touxiang_02.png", "centerY": 0, "centerX": 0 }, "compId": 46 }, { "type": "Image", "props": { "skin": "new/role/mingzidi.png", "centerX": 0, "bottom": -60 }, "compId": 47, "child": [{ "type": "Label", "props": { "var": "roleName_2", "text": "JACK", "fontSize": 30, "color": "#929b9e", "centerY": 0, "centerX": 0, "bold": true }, "compId": 48 }] }, { "type": "Image", "props": { "var": "select_2", "skin": "new/role/touxiangk2.png", "centerY": 0, "centerX": 0 }, "compId": 49 }] }, { "type": "Image", "props": { "var": "r3", "skin": "new/role/touxiangk.png", "centerX": 94, "bottom": 80 }, "compId": 55, "child": [{ "type": "Image", "props": { "var": "img_3", "skin": "new/role/touxiang_02.png", "centerY": 0, "centerX": 0 }, "compId": 56 }, { "type": "Image", "props": { "skin": "new/role/mingzidi.png", "centerX": 0, "bottom": -60 }, "compId": 57, "child": [{ "type": "Label", "props": { "var": "roleName_3", "text": "JACK", "fontSize": 30, "color": "#929b9e", "centerY": 0, "centerX": 0, "bold": true }, "compId": 58 }] }, { "type": "Image", "props": { "var": "select_3", "skin": "new/role/touxiangk2.png", "centerY": 0, "centerX": 0 }, "compId": 59 }] }, { "type": "Image", "props": { "var": "r4", "skin": "new/role/touxiangk.png", "centerX": 282, "bottom": 80 }, "compId": 60, "child": [{ "type": "Image", "props": { "var": "img_4", "skin": "new/role/touxiang_02.png", "centerY": 0, "centerX": 0 }, "compId": 61 }, { "type": "Image", "props": { "skin": "new/role/mingzidi.png", "centerX": 0, "bottom": -60 }, "compId": 62, "child": [{ "type": "Label", "props": { "var": "roleName_4", "text": "JACK", "fontSize": 30, "color": "#929b9e", "centerY": 0, "centerX": 0, "bold": true }, "compId": 63 }] }, { "type": "Image", "props": { "var": "select_4", "skin": "new/role/touxiangk2.png", "centerY": 0, "centerX": 0 }, "compId": 64 }] }, { "type": "Image", "props": { "y": 160, "x": 204, "var": "title", "skin": "new/com/t_jsxz.png" }, "compId": 65 }, { "type": "Image", "props": { "var": "left", "skin": "new/com/xuanzhuan2.png", "left": 105, "centerY": -61 }, "compId": 66 }, { "type": "Image", "props": { "var": "right", "skin": "new/com/xuanzhuan.png", "right": 100, "centerY": -55 }, "compId": 72 }], "loadList": ["new/com/beijing.png", "new/com/b_fanhui.png", "new/com/bd_ksyx.png", "new/role/touxiangk.png", "new/role/touxiang_02.png", "new/role/mingzidi.png", "new/role/touxiangk2.png", "new/com/t_jsxz.png", "new/com/xuanzhuan2.png", "new/com/xuanzhuan.png"], "loadList3D": [] };
            view.RoleSelectUI = RoleSelectUI;
            REG("ui.view.RoleSelectUI", RoleSelectUI);
        })(view = ui.view || (ui.view = {}));
    })(ui || (ui = {}));

    class GameNotity extends rab.RabNotity {
    }
    GameNotity.Init_Loading = "Init_Loading";
    GameNotity.Game_UpdateCoin = "Game_UpdateCoin";
    GameNotity.Game_UpdateTicket = "Game_UpdateTicket";
    GameNotity.Game_UpdateMouseMove = "Game_UpdateMouseMove";
    GameNotity.Game_RemoveScene = "Game_RemoveScene";
    GameNotity.Game_TriggerEnter = "Game_TriggerEnter";
    GameNotity.Game_RoleRetrogression = "Game_RoleRetrogression";

    class GameJsonConfig {
        constructor(data) {
            this._builds = new Map();
            this._obstacles = new Map();
            this.jsonData = data;
            let build = this.jsonData['build'];
            for (var i = 0; i < build.length; i++) {
                let prop = build[i];
                this._builds[prop.id] = prop;
            }
            let obstacles = this.jsonData['obstacle'];
            for (var i = 0; i < obstacles.length; i++) {
                let prop = obstacles[i];
                this._obstacles[prop.id] = prop;
            }
        }
        getConfig(name) {
            return this.jsonData[name];
        }
        getPassCount() {
            return 11;
        }
        getPassData(year, index) {
            let passIndex = [];
            passIndex["year80"] = 0;
            passIndex["year90"] = 11;
            passIndex["year00"] = 11;
            passIndex["year10"] = 11;
            let build = [];
            build["year80"] = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008];
            build["year90"] = [20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008];
            build["year00"] = [20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008];
            build["year10"] = [20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008];
            let obstacle = [];
            obstacle["year80"] = [9, 10, 100];
            obstacle["year90"] = [10, 11, 100];
            obstacle["year00"] = [10, 11, 100];
            obstacle["year10"] = [10, 11, 100];
            let i = index + passIndex[year];
            let pass = (this.jsonData['pass'][i]);
            pass.builds = build[year];
            pass.obstacles = obstacle[year];
            return pass;
        }
        getBuildData(id) {
            return this._builds[id];
        }
        getObstacleData(id) {
            return this._obstacles[id];
        }
    }

    class Algorithm {
        constructor(gameConfig, gameinfo) {
            this.gameConfig = gameConfig;
            this.gameInfo = gameinfo;
        }
    }

    class Language {
        constructor() {
            this.currLanguage = "cn";
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new Language();
            }
            return this._instance;
        }
        onInit(lan) {
            this.currLanguage = lan;
            this.cnTxt = {
                "startGame": "开始游戏",
                "rank": "排行榜",
                "pic": "照片墙",
                "set": "设置",
                "language": "语言",
                "break": "返回",
                "role_1": "角色选择",
                "role_2": "滑动旋转",
                "fail_1": "继续游戏",
                "fail_2": "重新开始",
                "fail_3": "返回大厅",
                "win_1": "下一关"
            };
            this.enTxt = {
                "startGame": "startGame",
                "rank": "rank",
                "pic": "pic",
                "set": "set",
                "language": "language",
                "break": "break",
                "role_1": "roleSlect",
                "role_2": "rotate",
                "fail_1": "continue",
                "fail_2": "ReGame",
                "fail_3": "BreakHome",
                "win_1": "NextPass"
            };
        }
        SetLanguage(lan) {
            this.currLanguage = lan;
        }
        getTxt(key) {
            let txt = "";
            if (this.currLanguage == "cn") {
                txt = this.cnTxt[key];
            }
            else if (this.currLanguage == "en") {
                txt = this.enTxt[key];
            }
            return txt;
        }
    }

    class GameController extends rab.RabController {
        constructor() {
            super(...arguments);
            this.attackSoundCount = 0;
            this.dieSoundCount = 0;
            this.vibrateCount = 0;
            this.playSelect = 1;
            this.curveScale = 0.1;
            this.curveOffset = 2.6;
            this.curveFactor = 0.43;
        }
        onInitUserDate() {
            GameController.DEF_CURVE_ROAD = Laya.Shader3D.getDefineByName("CURVE_ROAD");
            GameController.curve_params = Laya.Shader3D.propertyNameToID("u_curveParam");
            rab.Util.log("onInitUserDate=====");
            this.gameInfo.audio = 1;
            this.gameInfo.music = 1;
            this.gameInfo.vibrate = 1;
            this.gameInfo.coin = 0;
            this.gameInfo.score = 0;
            this.gameInfo.ticket = 30;
            this.gameInfo.maxTicket = 30;
            this.gameInfo.pass = 0;
            this.gameInfo.currentPass = 0;
            this.gameInfo.language = "cn";
            this.gameInfo.photo = {
                year80: 0,
                year90: 0,
                year00: 0,
                year10: 0,
            };
            this.gameInfo.lastTime = {
                year: 0,
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
            };
            this.m_selectYear = ["year80", "year90", "year00", "year10"];
        }
        onSetLanguage() {
            if (this.gameInfo.language == "cn") {
                this.gameInfo.language = "en";
            }
            else {
                this.gameInfo.language = "cn";
            }
            Language.instance.SetLanguage(this.gameInfo.language);
            this.SaveData(0);
        }
        setScene() {
            let v4 = new Laya.Vector4();
            v4.x = this.curveScale;
            v4.y = this.curveOffset;
            v4.z = this.curveFactor;
            let sv = this.scene3D["_shaderValues"];
            sv.addDefine(GameController.DEF_CURVE_ROAD);
            sv.setVector(GameController.curve_params, v4);
        }
        onHide() {
        }
        onStartGame() {
            this.algorithm = new Algorithm(this.gameConfig, this.gameInfo);
            this.jsonConfig = new GameJsonConfig(this.jsonData);
            this.isLoopAddTicket = false;
            this.loopAddTicketTimeGap = 60000;
            this.loopAddTicketValue = 1;
            this.fightGetCoin = 0;
            this.fightGetEquip = [];
            this.skillWeight = 0;
            this.soldierSort = [];
            this.rank = [];
            if (this.gameInfo.score == 0) {
                this.onAddLevelDate();
            }
            this.updateTime();
            Language.instance.onInit(this.gameInfo.language);
            rab.MusicManager.setState(this.gameInfo.music, this.gameInfo.audio);
        }
        updateTime() {
            let date = new Date();
            let minute = 0;
            if (this.gameInfo.lastTime.year < date.getFullYear()) {
                this.gameInfo.ticket = this.gameInfo.maxTicket;
            }
            else if (this.gameInfo.lastTime.month < date.getMonth()) {
                this.gameInfo.ticket = this.gameInfo.maxTicket;
            }
            else if (this.gameInfo.lastTime.day < date.getDay()) {
                this.gameInfo.ticket = this.gameInfo.maxTicket;
            }
            else if (this.gameInfo.lastTime.hour < date.getHours()) {
                this.gameInfo.ticket = this.gameInfo.maxTicket;
                let hour = date.getHours() - this.gameInfo.lastTime.hour;
                minute = date.getMinutes() - this.gameInfo.lastTime.minute;
                minute += hour * 60;
            }
            else if (this.gameInfo.lastTime.minute < date.getMinutes()) {
                minute = date.getMinutes() - this.gameInfo.lastTime.minute;
                while (minute >= 1 && this.gameInfo.ticket < this.gameInfo.maxTicket) {
                    this.addTicket(this.loopAddTicketValue);
                    minute -= 1;
                }
                minute = date.getMinutes() - this.gameInfo.lastTime.minute;
            }
            else if (this.gameInfo.lastTime.second < date.getSeconds()) {
            }
            this.gameInfo.lastTime.year = date.getFullYear();
            this.gameInfo.lastTime.month = date.getMonth();
            this.gameInfo.lastTime.day = date.getDay();
            this.gameInfo.lastTime.hour = date.getHours();
            this.gameInfo.lastTime.minute = date.getMinutes();
            this.gameInfo.lastTime.second = date.getSeconds();
        }
        addCoin(coin) {
            if (this.gameInfo.coin + coin < 0) {
                return false;
            }
            this.gameInfo.coin += coin;
            this.SaveData(1);
            this.SendMessage(GameNotity.Game_UpdateCoin, this.gameInfo.coin);
            return true;
        }
        addTicket(ticket) {
            if (this.gameInfo.ticket + ticket < 0) {
                rab.UIManager.onCreateView(ViewConfig.gameView.GetTicketView);
                return false;
            }
            this.gameInfo.ticket += ticket;
            if (this.gameInfo.ticket >= this.gameInfo.maxTicket) {
                this.isLoopAddTicket = false;
                Laya.timer.clear(this, this.loopAddTicket);
            }
            else if (this.isLoopAddTicket == false) {
                this.isLoopAddTicket = true;
                Laya.timer.loop(this.loopAddTicketTimeGap, this, this.loopAddTicket);
            }
            this.SaveData(2);
            this.SendMessage(GameNotity.Game_UpdateTicket, this.gameInfo.ticket);
            return true;
        }
        openPhotowall() {
            return this.gameInfo.photo[this.m_selectYear[this.playSelect - 1]] += 1;
        }
        loopAddTicket() {
            this.addTicket(this.loopAddTicketValue);
        }
        getVideoAddTicket() {
            return 15;
        }
        getReviveCoin() {
            return 2800;
        }
        getCoinBox() {
            return 8000;
        }
        getCoinBig() {
            return 1500;
        }
        getCoinSmall() {
            return 500;
        }
        getSoldierMaxCount() {
            return 30;
        }
        getPass() {
            return this.gameInfo.pass;
        }
        getCurrentPass() {
            return this.gameInfo.currentPass;
        }
        onNextPass() {
            this.gameInfo.currentPass += 1;
        }
        CurrPassData() {
            if (this.gameInfo.photo[this.m_selectYear[this.playSelect - 1]] >= this.jsonConfig.getPassCount()) {
                this.gameInfo.currentPass = 11;
            }
            let data = this.jsonConfig.getPassData(this.m_selectYear[this.playSelect - 1], this.gameInfo.currentPass);
            return data;
        }
        getBuild(id) {
            return this.jsonConfig.getBuildData(id);
        }
        getPassBuild() {
            let build = ["3d/prefab/Conventional/play_" + this.playSelect + ".lh"];
            let pass = this.CurrPassData();
            let arr = pass.builds;
            for (var i = 0; i < arr.length; i++) {
                build.push("3d/build/Conventional/" + this.jsonConfig.getBuildData(arr[i]).res + ".lh");
                let arr2 = pass.obstacles;
                for (var j = 0; j < arr2.length; j++) {
                    if (build.indexOf("3d/prefab/Conventional/" + this.jsonConfig.getObstacleData(arr2[j]).res + ".lh") == -1) {
                        build.push("3d/prefab/Conventional/" + this.jsonConfig.getObstacleData(arr2[j]).res + ".lh");
                    }
                }
            }
            return build;
        }
        onAddLevelDate() {
            if (rab.Util.isMobil) {
                rab.HTTP.post("api/playLog", {
                    "passLv": 0,
                    "failLv": 0,
                    "score": this.gameInfo.score,
                    "token": this.userInfo.token
                }, this, (data) => {
                    rab.Util.log('添加闯关数据', data);
                });
            }
        }
        getRank(callback) {
            if (rab.Util.isMobil) {
                rab.HTTP.get("api/rankList", this.userInfo.token, (data) => {
                    this.rank = data.data;
                    callback && callback();
                    rab.Util.log('获得排行榜数据', this.rank);
                });
            }
            else {
                callback && callback();
            }
        }
    }

    class BasicDictionary {
        constructor() {
            this.nameList = new Array();
            this.valeList = new Array();
        }
        add(name, value) {
            this.nameList.push(name);
            this.valeList.push(value);
        }
        removeByName(name) {
            let index = this.nameList.indexOf(name);
            if (index != -1) {
                this.nameList.splice(index, 1);
                this.valeList.splice(index, 1);
            }
        }
        removeByIndex(index) {
            this.nameList.splice(index, 1);
            this.valeList.splice(index, 1);
        }
        getValueByName(name, isRemove = false) {
            let index = this.nameList.indexOf(name);
            if (index != -1) {
                let value = this.valeList[index];
                if (isRemove == true) {
                    this.nameList.splice(index, 1);
                    this.valeList.splice(index, 1);
                }
                return value;
            }
            return null;
        }
        getValueByIndex(index, isRemove = false) {
            let value = this.valeList[index];
            if (isRemove == true) {
                this.nameList.splice(index, 1);
                this.valeList.splice(index, 1);
            }
            return value;
        }
        getNameByIndex(index) {
            return this.nameList[index];
        }
        set(name, value) {
            let index = this.nameList.indexOf(name);
            if (index != -1) {
                this.valeList[index] = value;
            }
        }
        get length() {
            return this.nameList.length;
        }
    }

    class Tool {
        constructor() {
            this.allow_Log = true;
            this.allow_test = false;
            this.widgetX = 1;
            this.widgetY = 1;
            this.phoneFrame = 60;
            this.frameRate = Laya.Stage.FRAME_FAST;
            this.tweenType = {
                move: "move",
                scale: "scale",
                rotation: "rotation"
            };
            this.loadScene3D = false;
            this.tweenList = new Array();
            this.tweenList[this.tweenType.move] = new BasicDictionary();
            this.tweenList[this.tweenType.scale] = new BasicDictionary();
            this.tweenList[this.tweenType.rotation] = new BasicDictionary();
            this.widgetX = Laya.stage.width / 750;
            this.widgetY = Laya.stage.height / 1334;
            this.lable = new Laya.Label();
            Laya.stage.addChild(this.lable);
            this.lable.pos(Laya.stage.width * 0.1, Laya.stage.height * 0.2);
            this.lable.width = Laya.stage.width * 0.8;
            this.lable.wordWrap = true;
            this.lable.color = "#ffffff";
            this.lable.fontSize = 50;
            this.lable.zOrder = 10000;
        }
        static get instance() {
            if (this._instance == null) {
                this._instance = new Tool();
            }
            return this._instance;
        }
        log(...value) {
            if (this.allow_Log == true) {
                console.log(value);
            }
        }
        isIPhoneX() {
            if (Laya.stage.width * 2 < Laya.stage.height) {
                return true;
            }
            return false;
        }
        performanceOptimization(info) {
            if (info.systemInfo.system.indexOf("iOS") != -1) {
                for (let index = 5; index < 12; index++) {
                    if (info.systemInfo.model.indexOf("iPhone " + index) != -1) {
                        if (index < 10) {
                            this.phoneFrame = 45;
                            this.frameRate = Laya.Stage.FRAME_SLOW;
                            return;
                        }
                    }
                }
            }
        }
        clamp(min, max, current) {
            if (current < min || current > max) {
                return (current < min) ? min : max;
            }
            return current;
        }
        getRandomList_1(maxRandom, count) {
            let list = [];
            let temp = [];
            for (let index = 0; index < maxRandom; index++) {
                temp.push(index);
            }
            for (let index = 0; index < count; index++) {
                let random = parseInt("" + (Math.random() * (temp.length - 0.1)));
                list.push(temp[random]);
                temp.splice(random, 1);
            }
            return list;
        }
        getRandomList_2(traget, count) {
            let list = [];
            let temp = [];
            let index = 0;
            for (let i in traget) {
                temp.push(index);
                index++;
            }
            for (let i = 0; i < count; i++) {
                let random = parseInt("" + (Math.random() * (temp.length - 0.1)));
                index = 0;
                for (let j in traget) {
                    if (index == temp[random]) {
                        list.push(traget[j]);
                        break;
                    }
                    index++;
                }
                temp.splice(random, 1);
            }
            return list;
        }
        getRadian(angle) {
            return angle * Math.PI / 180;
        }
        getAngle(px, py, mx, my) {
            var x = Math.abs(px - mx);
            var y = Math.abs(py - my);
            var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var cos = y / z;
            var radina = Math.acos(cos);
            var angle = Math.floor(180 / (Math.PI / radina));
            if (mx > px && my > py) {
                angle = 180 - angle;
            }
            if (mx == px && my > py) {
                angle = 180;
            }
            if (mx > px && my == py) {
                angle = 90;
            }
            if (mx < px && my > py) {
                angle = 180 + angle;
            }
            if (mx < px && my == py) {
                angle = 270;
            }
            if (mx < px && my < py) {
                angle = 360 - angle;
            }
            return angle;
        }
        rotateAround(sprite, center, axis, angle) {
            let v1 = new Laya.Vector3();
            let v2 = new Laya.Vector3();
            let v3 = new Laya.Vector3();
            let v4 = new Laya.Quaternion();
            let v5 = new Laya.Vector3();
            Laya.Vector3.add(new Laya.Vector3(), sprite, v1);
            Laya.Vector3.subtract(v1, center, v2);
            Laya.Quaternion.createFromAxisAngle(axis, angle, v4);
            Laya.Vector3.transformQuat(v2, v4, v3);
            Laya.Vector3.add(v3, center, v5);
            return v5;
        }
        getVector(v1, v2, angle) {
            let quaternion = new Laya.Quaternion();
            Laya.Quaternion.createFromYawPitchRoll(angle * (Math.PI / 180), 0, 0, quaternion);
            Laya.Vector3.transformQuat(v1, quaternion, v2);
            return v2;
        }
        getWorldAngle(start, end) {
            return 360 * (Math.atan2(start.x, start.z) - Math.atan2(end.x, end.z) / (2 * Math.PI));
        }
        twoPointDistance(point1, point2) {
            let v1 = new Laya.Vector3(point1.x, 0, point1.y);
            let v2 = new Laya.Vector3(point2.x, 0, point2.y);
            let distance = Laya.Vector3.distance(v1, v2);
            return distance;
        }
        loadModel(name, callback) {
            let sprite = Laya.loader.getRes(name + ".lh");
            if (sprite != null) {
                if (callback != null) {
                    callback.runWith(sprite);
                }
            }
            else {
                Laya.loader.create(name + ".lh", Laya.Handler.create(this, (sprite) => {
                    if (callback != null) {
                        callback.runWith(sprite);
                    }
                }));
            }
        }
        clearModel(name) {
            let path = "res/3d/prefab/Conventional/";
            Laya.loader.clearRes(path + name + ".lh");
        }
        getSpriteByName(node, name) {
            while (name.length > 0) {
                let str = name.shift();
                if (str == "") {
                    node = node.getChildAt(0);
                }
                else {
                    node = node.getChildByName(str);
                }
            }
            return node;
        }
        getSpriteAt(node, index) {
            while (index.length > 0) {
                let str = index.shift();
                node = node.getChildAt(str);
            }
            return node;
        }
        getSprite3DByName(node, name) {
            while (name.length > 0) {
                let str = name.shift();
                if (str == "") {
                    node = node.getChildAt(0);
                }
                else {
                    node = node.getChildByName(str);
                }
            }
            return node;
        }
        getSprite3DAt(node, index) {
            while (index.length > 0) {
                let str = index.shift();
                node = node.getChildAt(str);
            }
            return node;
        }
        syncTransform(data, out) {
            out.transform.position = data.transform.position;
            out.transform.rotation = data.transform.rotation;
            out.transform.setWorldLossyScale(data.transform.getWorldLossyScale());
        }
        setPosition(data, out, isLocal = false) {
            if (isLocal == false) {
                out.transform.position = this.getPosition(data, out, isLocal);
            }
            else {
                out.transform.localPosition = this.getPosition(data, out, isLocal);
            }
        }
        getPosition(data, out, isLocal = false) {
            let position = new Laya.Vector3(0, 0, 0);
            if (isLocal == false) {
                Laya.Vector3.add(position, out.transform.position, position);
            }
            else {
                Laya.Vector3.add(position, out.transform.localPosition, position);
            }
            position.x = isNaN(data.x) ? position.x : data.x;
            position.y = isNaN(data.y) ? position.y : data.y;
            position.z = isNaN(data.z) ? position.z : data.z;
            return position;
        }
        addPosition(data, out) {
            out.transform.position = this.getAddPosition(data, out);
        }
        getAddPosition(data, out) {
            let position = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.add(position, out.transform.position, position);
            position.x += data.x;
            position.y += data.y;
            position.z += data.z;
            return position;
        }
        setScale(data, out) {
            out.transform.setWorldLossyScale(this.getScale(data, out));
        }
        getScale(data, out) {
            let scale = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.add(scale, out.transform.getWorldLossyScale(), scale);
            scale.x = isNaN(data.x) ? scale.x : data.x;
            scale.y = isNaN(data.y) ? scale.y : data.y;
            scale.z = isNaN(data.z) ? scale.z : data.z;
            return scale;
        }
        addScale(data, out) {
            out.transform.setWorldLossyScale(this.getAddScale(data, out));
        }
        getAddScale(data, out, isLocal = false) {
            let scale = new Laya.Vector3(0, 0, 0);
            if (isLocal == false) {
                Laya.Vector3.add(scale, out.transform.getWorldLossyScale(), scale);
            }
            else {
                Laya.Vector3.add(scale, out.transform.localScale, scale);
            }
            scale.x += data.x;
            scale.y += data.y;
            scale.z += data.z;
            return scale;
        }
        setRotationEuler(data, out) {
            out.transform.rotationEuler = this.getRotationEuler(data, out);
        }
        getRotationEuler(data, out) {
            let rotation = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.add(rotation, out.transform.rotationEuler, rotation);
            rotation.x = isNaN(data.x) ? rotation.x : data.x;
            rotation.y = isNaN(data.y) ? rotation.y : data.y;
            rotation.z = isNaN(data.z) ? rotation.z : data.z;
            return rotation;
        }
        addRotationEuler(data, out) {
            out.transform.rotationEuler = this.getAddRotationEuler(data, out);
        }
        getAddRotationEuler(data, out) {
            let rotation = new Laya.Vector3(0, 0, 0);
            Laya.Vector3.add(rotation, out.transform.rotationEuler, rotation);
            rotation.x += data.x;
            rotation.y += data.y;
            rotation.z += data.z;
            return rotation;
        }
        setQuaternion(data, out) {
            out.transform.rotation = this.getQuaternion(data, out);
        }
        getQuaternion(data, out) {
            let rotation = new Laya.Quaternion(0, 0, 0, 0);
            Laya.Quaternion.add(rotation, out.transform.rotation, rotation);
            rotation.x = isNaN(data.x) ? rotation.x : data.x;
            rotation.y = isNaN(data.y) ? rotation.y : data.y;
            rotation.z = isNaN(data.z) ? rotation.z : data.z;
            rotation.w = isNaN(data.w) ? rotation.w : data.w;
            return rotation;
        }
        addQuaternion(data, out) {
            out.transform.rotation = this.getAddQuaternion(data, out);
        }
        getAddQuaternion(data, out) {
            let rotation = new Laya.Quaternion(0, 0, 0, 0);
            Laya.Quaternion.add(rotation, out.transform.rotation, rotation);
            rotation.x += data.x;
            rotation.y += data.y;
            rotation.z += data.z;
            rotation.w += data.w;
            return rotation;
        }
        addButtonAnimation(image, isPlaySound = true, isScale = true) {
            let canClick = false;
            let onDown = (event) => {
                if (isScale == true) {
                    image.scaleX = (image.scaleX > 0) ? 0.9 : -0.9;
                    image.scaleY = (image.scaleY > 0) ? 0.9 : -0.9;
                }
                canClick = true;
                event.stopPropagation();
                if (isPlaySound == true) {
                    rab.MusicManager.playSound("res/audio/click.wav");
                }
            };
            let onUp = (event) => {
                if (canClick == true) {
                    if (isScale == true) {
                        image.scaleX = (image.scaleX > 0) ? 1 : -1;
                        image.scaleY = (image.scaleY > 0) ? 1 : -1;
                    }
                    event.stopPropagation();
                }
                canClick = false;
            };
            let onOut = (event) => {
                if (canClick == true) {
                    if (isScale == true) {
                        image.scaleX = (image.scaleX > 0) ? 1 : -1;
                        image.scaleY = (image.scaleY > 0) ? 1 : -1;
                    }
                    event.stopPropagation();
                }
                canClick = false;
            };
            image.on(Laya.Event.MOUSE_DOWN, this, onDown);
            image.on(Laya.Event.MOUSE_UP, this, onUp);
            image.on(Laya.Event.MOUSE_OUT, this, onOut);
        }
        removeButtonAnimation(image) {
            image.offAll(Laya.Event.MOUSE_DOWN);
            image.offAll(Laya.Event.MOUSE_UP);
            image.offAll(Laya.Event.MOUSE_OUT);
        }
        isSprite3DTween(sprite) {
            return (this.tweenList[this.tweenType.move].getValueByName(sprite.id) != null) || (this.tweenList[this.tweenType.scale].getValueByName(sprite.id) != null) ||
                (this.tweenList[this.tweenType.rotation].getValueByName(sprite.id) != null);
        }
        sprite3DStopTween(sprite, type = this.tweenType.move) {
            let stop = (tween) => {
                tween.pause();
                tween.clear();
                tween.recover();
            };
            for (let index = 0; index < this.tweenList[type].length; index++) {
                let tween = this.tweenList[type].getValueByName(sprite.id);
                if (tween != null) {
                    stop(tween);
                    this.tweenList[type].removeByName(sprite.id);
                    index--;
                }
            }
        }
        sprite3DScale(sprite, props, duration, ease, completed, progress) {
            this.sprite3DStopTween(sprite, this.tweenType.scale);
            this.tweenList[this.tweenType.scale].add(sprite.id, this.tweenUpdate(sprite, sprite.transform.getWorldLossyScale(), props, duration, ease, () => {
                this.sprite3DStopTween(sprite, this.tweenType.scale);
                completed && completed();
            }, (toPos) => {
                sprite.transform.setWorldLossyScale(toPos);
                progress && progress();
            }));
        }
        sprite3DMove(sprite, props, duration, ease, completed, progress) {
            this.sprite3DStopTween(sprite, this.tweenType.move);
            this.tweenList[this.tweenType.move].add(sprite.id, this.tweenUpdate(sprite, sprite.transform.position, props, duration, ease, () => {
                this.sprite3DStopTween(sprite, this.tweenType.move);
                completed && completed();
            }, (toPos) => {
                sprite.transform.position = toPos;
                progress && progress();
            }));
        }
        sprite3DRotation(sprite, props, duration, ease, completed, progress) {
            this.sprite3DStopTween(sprite, this.tweenType.rotation);
            this.tweenList[this.tweenType.rotation].add(sprite.id, this.tweenUpdate(sprite, sprite.transform.rotationEuler, props, duration, ease, () => {
                this.sprite3DStopTween(sprite, this.tweenType.rotation);
                completed && completed();
            }, (toPos) => {
                sprite.transform.rotationEuler = toPos;
                progress && progress();
            }));
        }
        tweenUpdate(sprite, initProps, endProps, duration, ease, completed, progress) {
            let v3 = new Laya.Vector3();
            let initProp = {
                x: initProps.x,
                y: initProps.y,
                z: initProps.z
            };
            let endProp = {
                x: endProps.x,
                y: endProps.y,
                z: endProps.z,
                update: new Laya.Handler(this, function () {
                    if (sprite == null || sprite.destroyed)
                        return;
                    v3.x = initProp.x;
                    v3.y = initProp.y;
                    v3.z = initProp.z;
                    progress && progress(v3);
                })
            };
            return Laya.Tween.to(initProp, endProp, duration, ease, new Laya.Handler(this, completed));
        }
        cmeraShakeAnimation(cmera, currentPos, min, max, completed) {
            let shake = max;
            let animation = function () {
                if (shake > min) {
                    let x = Math.random() * shake - shake / 2;
                    let y = Math.random() * shake - shake / 2;
                    let pos = new Laya.Vector3();
                    Laya.Vector3.add(new Laya.Vector3(x, y, 0), currentPos, pos);
                    this.setPosition(pos, cmera);
                    shake = shake / 1.05;
                }
                else {
                    this.setPosition(currentPos, cmera);
                    Laya.timer.clear(this, animation);
                    completed && completed();
                }
            };
            Laya.timer.clear(this, animation);
            Laya.timer.frameLoop(1, this, animation);
        }
        winowAniamtion(window, minScale, callback) {
            window.scale(minScale, minScale);
            Laya.Tween.clearAll(window);
            Laya.Tween.to(window, { scaleX: 1.05, scaleY: 1.05 }, 100, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(window, { scaleX: 1, scaleY: 1 }, 50, null, Laya.Handler.create(this, () => {
                    callback && callback();
                }));
            }));
        }
        twinkleAniamtion(sprite) {
            Laya.Tween.clearAll(sprite);
            sprite.alpha = 0;
            Laya.Tween.to(sprite, { alpha: 0.5 }, 100, null, null, 0);
            Laya.Tween.to(sprite, { alpha: 0.25 }, 100, null, null, 100);
            Laya.Tween.to(sprite, { alpha: 0.5 }, 100, null, null, 200);
            Laya.Tween.to(sprite, { alpha: 0.25 }, 100, null, Laya.Handler.create(this, () => {
                sprite.alpha = 0;
            }), 300);
        }
        calculator(key) {
            let value = 0;
            if ((key[0] == "(" && key[key.length - 1] == ")") ||
                (key[0] == "(" && key[key.length - 2] == ")")) {
                key = key.replace("(", "");
                key = key.replace(")", "");
            }
            if (key[key.length - 1] != "=") {
                key += "=";
            }
            key = key.replace(" ", "");
            let index = 0;
            let parentheses = "";
            while (index != -1) {
                index = key.indexOf("(");
                if (index != -1) {
                    parentheses = key.slice(index, key.indexOf(")") + 1);
                    key = key.replace(parentheses, "" + this.calculator(parentheses));
                }
            }
            let calculat = (s) => {
                let a1 = key.lastIndexOf("+", index - 1);
                let b1 = key.indexOf("*", index + 1);
                let c1 = key.indexOf("+", index + 1);
                let d1 = key.indexOf("=", index + 1);
                let a2 = "";
                let b2 = "";
                let c2 = 0;
                if (a1 == -1) {
                    a2 = key.substr(0, index);
                }
                else {
                    a2 = key.substr(a1 + 1, index - a1 - 1);
                }
                if (b1 == -1) {
                    if (c1 == -1) {
                        b2 = key.substr(index + 1, d1 - index - 1);
                    }
                    else {
                        b2 = key.substr(index + 1, c1 - index - 1);
                    }
                }
                else {
                    b2 = key.substr(index + 1, b1 - index - 1);
                }
                if (s == "*") {
                    c2 += parseInt(a2) * parseInt(b2);
                }
                else if (s == "+") {
                    c2 += parseInt(a2) + parseInt(b2);
                }
                key = key.replace(a2 + s + b2, "" + c2);
            };
            index = 0;
            while (index != -1) {
                index = key.indexOf("*");
                if (index != -1) {
                    calculat("*");
                }
            }
            index = 0;
            while (index != -1) {
                index = key.indexOf("+");
                if (index != -1) {
                    calculat("+");
                }
            }
            value = parseInt(key.substr(0, key.length - 1));
            return value;
        }
    }

    class SceneLoading extends rab.RabView {
        LoadView() {
            this.create(ui.view.LoadingUI);
        }
        InitView() {
            this.current = 0;
            this.progressWidth = this.m_currView.imgProgress.width;
            this.m_currView.lbProgress.text = "";
            this.m_currView.imgProgress.width = 0;
            Laya.timer.frameLoop(1, this, this.updateProgress);
            let Templet1 = new Laya.Templet();
            Templet1.on(Laya.Event.COMPLETE, this, (Templet, name) => {
                let skeleton = Templet.buildArmature(1);
                this.m_currView.addChild(skeleton);
                skeleton.x = Laya.stage.width / 2;
                skeleton.y = Laya.stage.height / 2;
                skeleton.stop();
                skeleton.play(name, true);
            }, [Templet1, "lizi"]);
            Templet1.loadAni("effect/bg/bg_lizi.sk");
            this.AddListenerMessage(GameNotity.GameMessage_LoadingEnd, this.onLoadEnd);
            rab.RabGameManager.getInterest().AddManager(new GameController());
        }
        OnRefreshView() {
        }
        onLoadRes() {
        }
        updateProgress() {
            if (this.current < 1) {
                this.m_currView.imgProgress.width = this.progressWidth * this.current;
                this.m_currView.lbProgress.text = `加载中...(${Math.floor(this.current * 100)}%)`;
                this.current += 0.001;
            }
        }
        onComplete() {
            this.m_currView.imgProgress.width = this.m_currView.boxProgress.width;
            this.m_currView.lbProgress.text = "加载完成!";
            this.OnEnterGame();
            return;
        }
        onLoadEnd() {
            console.log("====加载完成=======");
            this.OnEnterGame();
        }
        OnEnterGame() {
            console.log("====登录服务器成功进入游戏=======");
            let manager = rab.RabGameManager.getInterest().getMyManager();
            let enterGame = () => {
                let array = [];
                array.push("res/atlas/ui.atlas");
                array.push("res/atlas/new/com.atlas");
                array.push("res/atlas/new/game.atlas");
                array.push("res/atlas/new/role.atlas");
                array.push("res/atlas/new/com/Photo.atlas");
                array.push("res/atlas/new/com/num/index.atlas");
                array.push("res/atlas/new/com/num/score.atlas");
                Laya.loader.load(array, Laya.Handler.create(this, (error, data) => {
                    console.log(error, data);
                    rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
                    this.OnCloseView();
                }));
            };
            if (typeof wx != "undefined") {
                enterGame();
                Tool.instance.loadScene3D = true;
            }
            else {
                enterGame();
                Tool.instance.loadScene3D = true;
            }
        }
    }

    class Platform extends rab.RabView {
        LoadView() {
            this.create(ui.view.PlatformUI);
        }
        InitView() {
            Laya.timer.once(100, this, () => {
                this.OnRefreshView();
            });
            this.m_currView.startBtn.on(Laya.Event.CLICK, this, this.onstart);
            this.m_currView.set.on(Laya.Event.CLICK, this, this.onSet);
            Tool.instance.addButtonAnimation(this.m_currView.set);
            this.m_currView.rank.on(Laya.Event.CLICK, this, this.onRank);
            Tool.instance.addButtonAnimation(this.m_currView.rank);
            this.m_currView.pic.on(Laya.Event.CLICK, this, this.onPic);
            Tool.instance.addButtonAnimation(this.m_currView.pic);
            this.m_currView.lan.on(Laya.Event.CLICK, this, this.onLan);
            Tool.instance.addButtonAnimation(this.m_currView.lan);
            this.clickList = [];
            let Templet1 = new Laya.Templet();
            Templet1.on(Laya.Event.COMPLETE, this, (Templet, name) => {
                let skeleton = Templet.buildArmature(1);
                this.m_currView.addChild(skeleton);
                skeleton.x = Laya.stage.width / 2;
                skeleton.y = Laya.stage.height / 2;
                skeleton.stop();
                skeleton.play(name, true);
            }, [Templet1, "lizi"]);
            Templet1.loadAni("effect/bg/bg_lizi.sk");
            Laya3D.physicsSettings.fixedTimeStep = 1 / 30;
            this.AddListenerMessage(GameNotity.GameMessage_GameShowMessage, () => {
                if (this.m_currView.visible == true) {
                    rab.MusicManager.playMusic("res/audio/bgm.mp3");
                }
            });
            this.myManager.getRank(() => {
                for (let index = 0; index < this.myManager.rank.length; index++) {
                    this.m_currView.preload.skin = this.myManager.rank[index]["avatar"];
                }
            });
        }
        OnRefreshView() {
            rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
            rab.MusicManager.playMusic("res/audio/bgm.mp3");
            if (this.myManager.gameInfo.music == 0) {
                this.m_currView.set.skin = "ui/bd_syg.png";
            }
            else {
                this.m_currView.set.skin = "ui/bd_syk.png";
            }
        }
        onShowLanguage() {
        }
        onstart() {
            let self = this;
            let complete = () => {
                rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
                self.myManager.onLoad3dScene(() => {
                    Laya.loader.create(["3d/prefab/Conventional/play_1.lh", "3d/prefab/Conventional/play_2.lh", "3d/prefab/Conventional/play_3.lh", "3d/prefab/Conventional/play_4.lh"], Laya.Handler.create(this, () => {
                        rab.UIManager.onCreateView(ViewConfig.gameView.RoleSelect);
                        rab.UIManager.onHideView(ViewConfig.gameView.NotClick);
                        rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
                        rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
                    }));
                });
            };
            rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
            complete();
        }
        updateRedPoint() {
        }
        onHide() {
            super.onHide();
            this.clickList = [];
        }
        onSet() {
            this.myManager.setMusic();
            this.myManager.setAudio();
            rab.MusicManager.playMusic("res/audio/bgm.mp3");
            if (this.myManager.gameInfo.music == 0) {
                this.m_currView.set.skin = "ui/bd_syg.png";
            }
            else {
                this.m_currView.set.skin = "ui/bd_syk.png";
            }
            this.myManager.SaveData(9);
        }
        onRank() {
            rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
            this.myManager.getRank(() => {
                rab.UIManager.onCreateView(ViewConfig.gameView.Rank);
                rab.UIManager.onHideView(ViewConfig.gameView.NotClick);
                rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
                rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
            });
        }
        onPic() {
            rab.UIManager.onCreateView(ViewConfig.gameView.PhotoWall);
            rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
        }
        onLan() {
            this.myManager.onSetLanguage();
            this.onShowLanguage();
        }
    }

    class BuildItem extends rab.GameObject {
        onInit() {
        }
        get buildId() {
            return this._buildId;
        }
        get PosZ() {
            return this._posz;
        }
        onInitProp(data, posZ) {
            this._buildId = data.id;
            this._posz = posZ + data.length;
        }
        recover() {
            this.gameObject.removeSelf();
            Laya.Pool.recover("build_" + this._buildId, this.gameObject);
        }
        onRemove() {
        }
    }

    class ObstacleItem extends rab.GameObject {
        onInit() {
        }
        get obstacleId() {
            return this._obstacleId;
        }
        get PosZ() {
            return this._posz;
        }
        onInitProp(data, randomX) {
            this.prop = data;
            this._obstacleId = data.id;
            if (this._obstacleId != 100) {
                this.transform.localRotationEulerX = 0;
            }
            else {
                this.transform.localRotationEulerX = -90;
                this.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 1));
                this.transform.localScale = new Laya.Vector3(1, 1, 1);
                this.idleAnimation();
            }
            if (data.pos == 1) {
                this.transform.localPositionX = 0;
            }
            else if (data.pos == 2) {
                if (Math.random() < 0.5) {
                    this.transform.localPositionX = 0;
                }
                else {
                    this.transform.localPositionX = -1.2;
                }
            }
            else {
                if (randomX == 0) {
                    this.transform.localPositionX = 1.2;
                }
                else if (randomX == 1) {
                    this.transform.localPositionX = 0;
                }
                else {
                    this.transform.localPositionX = -1.2;
                }
            }
            if (this.owner.name == "ObstacleRoadblocks") {
                if (this.transform.localPositionX < -1) {
                    this.owner.getChildAt(0).transform.localPositionX = -0.2;
                }
                else if (this.transform.localPositionX > 1) {
                    this.owner.getChildAt(0).transform.localPositionX = 0.2;
                }
                else {
                    this.owner.getChildAt(0).transform.localPositionX = 0;
                }
            }
        }
        recover() {
            this.gameObject.removeSelf();
            Laya.Pool.recover("ObstacleID" + this._obstacleId + "", this.gameObject);
        }
        onCollisionPlay() {
            console.log("障碍物碰到了");
            this.onHit();
        }
        onHit() {
            if (this.isCoin() == true) {
                Laya.timer.clear(this, this.idleAnimation);
                Tool.instance.sprite3DStopTween(this.owner, Tool.instance.tweenType.rotation);
                let prop1 = Tool.instance.getAddPosition(new Laya.Vector3(0, 2, 0), this.owner);
                this.transform.setWorldLossyScale(new Laya.Vector3(0.3, 0.3, 0.3));
                Tool.instance.sprite3DMove(this.owner, prop1, 100, null, () => {
                    this.owner.active = false;
                });
            }
            if (this.isTruck() == true) {
            }
        }
        idleAnimation() {
            if (this.isCoin() == true) {
                let prop = Tool.instance.getAddRotationEuler(new Laya.Vector3(0, 0, 90), this.owner);
                Tool.instance.sprite3DRotation(this.owner, prop, 1000);
                Laya.timer.once(1000, this, this.idleAnimation, null);
            }
        }
        isTruck() {
            return this.obstacleId == 10;
        }
        isCoin() {
            return this.obstacleId == 100;
        }
    }

    class ObstacleSimple extends ObstacleItem {
        onHit() {
            super.onHit();
            console.log("简单的障碍物碰到就直接倒了");
            if (this.isTruck() == false && this.isCoin() == false) {
                Tool.instance.sprite3DRotation(this.gameObject, new Laya.Vector3(90, 0, 0), 100);
            }
        }
    }

    class ObstacleManager extends rab.GameObject {
        constructor() {
            super(...arguments);
            this._baseobstacles = new Map();
            this._obstacles = new Array();
            this.obstaclesID = 0;
            this.randomX = 0;
        }
        onInit() {
            this.AddListenerMessage(GameNotity.Game_RemoveScene, this.onReMoveScene);
        }
        init() {
            this.scene3D = this.owner;
            this.manager = rab.RabGameManager.getInterest().getMyManager();
        }
        onCreateobstacle(data, posZ) {
            console.log("创建一个障碍物 Z轴", posZ);
            this._initPos = posZ;
            let arr = data.obstacles;
            this._passProp = data;
            for (var i = 0; i < arr.length; i++) {
                if (!this._baseobstacles[arr[i]]) {
                    this._baseobstacles[arr[i]] =
                        Laya.loader.getRes("3d/prefab/Conventional/" + this.manager.jsonConfig.getObstacleData(arr[i]).res + ".lh");
                }
            }
            let ObstacleID = this.obstaclesID;
            this.obstaclesID = this._passProp.obstacles[Math.floor(Math.random() * this._passProp.obstacles.length)];
            while (this.obstaclesID == ObstacleID && (this.obstaclesID == 10 || this.obstaclesID == 100)) {
                this.obstaclesID = this._passProp.obstacles[Math.floor(Math.random() * this._passProp.obstacles.length)];
            }
            let randomX = this.randomX;
            while (randomX == this.randomX) {
                if (Math.random() < 0.3) {
                    this.randomX = 0;
                }
                else if (Math.random() < 0.6) {
                    this.randomX = 1;
                }
                else {
                    this.randomX = 2;
                }
            }
            if (this.obstaclesID == 100) {
                let random = Math.round(Math.random() * 2 + 2);
                for (var i = 0; i < random; i++) {
                    this.createNextOb();
                    this._initPos += 2;
                }
            }
            else {
                this.createNextOb();
            }
            if (this.obstaclesID == 100) {
                this.randomX = randomX;
            }
        }
        createNextOb() {
            let obstacle = Laya.Pool.getItem("ObstacleID" + this.obstaclesID);
            let obstacleProp;
            if (!obstacle) {
                obstacle = this.instantiate(this._baseobstacles[this.obstaclesID], null, true, new Laya.Vector3(0, 0, this._initPos));
                obstacleProp = obstacle.addComponent(ObstacleSimple);
            }
            else {
                obstacle.transform.localPositionZ = this._initPos;
                obstacleProp = obstacle.getComponent(ObstacleSimple);
            }
            this.scene3D.addChild(obstacle);
            this._obstacles.push(obstacleProp);
            console.log("创建好了障碍物 ID", this.obstaclesID);
            obstacle.transform.localPosition = new Laya.Vector3(0, 0, this._initPos);
            obstacleProp.onInitProp(this.manager.jsonConfig.getObstacleData(this.obstaclesID), this.randomX);
            obstacle.active = true;
        }
        SpawnCoinAndPowerup() {
        }
        onClearAll() {
            for (var i = 0; i < this._obstacles.length; i++) {
                this._obstacles[i].recover();
            }
            this._obstacles = [];
        }
        onReMoveScene() {
            this.onClearAll();
            for (var i = 0; i < this._passProp.obstacles.length; i++) {
                Laya.Pool.clearBySign("ObstacleID" + this._passProp.obstacles[i]);
            }
            this._baseobstacles.clear();
        }
    }

    class Play extends rab.GameObject {
        constructor() {
            super(...arguments);
            this._count = 0;
        }
        onInit() {
        }
        onTriggerEnter(other) {
            let prop = other.owner.getComponent(ObstacleItem);
            if (prop) {
                if (prop.isCoin() == false) {
                    rab.MusicManager.playSound("res/audio/hit.wav", 1, 1);
                    if (prop.isTruck() == true) {
                        if (prop.transform.localPositionX == 0) {
                            this.SendMessage(GameNotity.Game_UpdateMouseMove, 1);
                        }
                        else {
                            this.SendMessage(GameNotity.Game_UpdateMouseMove, 0);
                        }
                        this.SendMessage(GameNotity.Game_RoleRetrogression);
                    }
                    this.SendMessage(GameNotity.Game_TriggerEnter, prop);
                    this.onFlash();
                }
                else {
                    rab.MusicManager.playSound("res/audio/coin.wav", 1, 0.05);
                    let manager = rab.RabGameManager.getInterest().getMyManager();
                    manager.fightGetCoin += 1;
                }
                prop.onCollisionPlay();
            }
        }
        onSetMaterial(material) {
            this._playmaterial = material;
        }
        stopFlash() {
            if (this._playmaterial) {
                this._count = 0;
                this._playmaterial.albedoIntensity = 1;
                Laya.timer.clearAll(this);
            }
        }
        onFlash() {
            if (this._playmaterial) {
                this.stopFlash();
                if (this._count <= 0) {
                    this._count = 8;
                    Laya.timer.frameLoop(10, this, () => {
                        if (this._count > 0) {
                            this._count -= 1;
                            console.log("这里要开始闪烁了");
                            if (this._playmaterial.albedoIntensity == 1) {
                                this._playmaterial.albedoIntensity = 2;
                            }
                            else {
                                this._playmaterial.albedoIntensity = 1;
                            }
                        }
                        else {
                            Laya.timer.clearAll(this);
                        }
                    });
                }
            }
        }
    }

    class PlayerManager extends rab.GameObject {
        constructor() {
            super();
            this.isMoveing = false;
            this.localx = 0;
            this.jumpLength = 2;
            this.jumpHeight = 1.2;
            this.slideLength = 4;
            this.m_JumpStart = 0;
            this.m_SlideStart = 0;
            this.minSpeed = 5.0;
            this.maxSpeed = 15.0;
            this.worldDistance = 0;
            this.retrogression = 0;
        }
        onInit() {
            this.AddListenerMessage(GameNotity.Game_UpdateMouseMove, this.onMouseMove);
            this.AddListenerMessage(GameNotity.Game_RoleRetrogression, this.onRoletrogression);
        }
        init() {
            this.isMoveing = false;
            this._playState = PlayState.none;
            this.scene3D = this.owner;
            this._playerPivot = this.scene3D.getChildByName("PlayerPivot");
            this._characterSlot = this._playerPivot.getChildByName("CharacterSlot");
            this.camera = this.scene3D.getChildByName("Main Camera");
            this.camerapos = new Laya.Vector3(0, 4, -5);
            this.manager = rab.RabGameManager.getInterest().getMyManager();
        }
        onTestScene() {
            if (this.camera != null) {
                console.log("相机");
                this.camera.transform.localPositionY -= 1;
            }
        }
        fightReady() {
            console.log("加载角色");
            this._playState = PlayState.init;
            this.isMoveing = false;
            this.localx = 0;
            this.worldDistance = 0;
            this.retrogression = 0;
            this.currentAnimation = "";
            this._playerPivot.transform.position = new Laya.Vector3(0, 0, 0);
            this._playerPivot.addChild(this.camera);
            this.camera.transform.position = this.camerapos;
            this.playNode = Laya.loader.getRes("3d/prefab/Conventional/play_" + this.manager.playSelect + ".lh");
            this._characterSlot.addChild(this.playNode);
            if (!this._characterSlot.getComponent(Play)) {
                this._characterSlot.addComponent(Play);
            }
            this._characterSlot.transform.position = new Laya.Vector3(0, 0, 0);
            this.playNode.transform.position = new Laya.Vector3(0, 0, 0);
            this.playNode.transform.localScale = new Laya.Vector3(1, 1, 1);
            this.playNode.transform.localRotationEulerY = 0;
            this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
            this.playAnimation("idle", 0);
            this.model = this.playNode.getChildAt(0).getChildAt(0);
            if (this.model) {
                if (this.model.skinnedMeshRenderer) {
                    this._characterSlot.getComponent(Play).onSetMaterial(this.model.skinnedMeshRenderer.material);
                    this._characterSlot.getComponent(Play).stopFlash();
                }
            }
        }
        onGameStart() {
            this.isMoveing = true;
            this.currentAnimation = "";
            this._playState = PlayState.run;
            this.m_Speed = this.minSpeed;
            this.localx = 0;
            this.playNode.transform.localRotationEulerY = 0;
            this.playAnimation("run", 0);
            this._characterSlot.transform.position = new Laya.Vector3(0, 0, 0);
        }
        fightExit() {
            this._characterSlot.getComponent(Play).stopFlash();
            this._playState = PlayState.death;
            this.isMoveing = false;
            this._characterSlot.removeChild(this.playNode);
            this._playerPivot.transform.position = new Laya.Vector3(0, 0, 0);
            this.scene3D.addChild(this.camera);
            this.camera.transform.position = this.camerapos;
        }
        onhappydance() {
            this._characterSlot.getComponent(Play).stopFlash();
            this.isMoveing = false;
            this._playState = PlayState.stop;
            this.playNode.transform.localRotationEulerY = 180;
            this.playAnimation("happydance", 0.2);
        }
        Ondeath() {
            this._playState = PlayState.death;
            this.isMoveing = false;
            Laya.timer.frameLoop(1, this, this.update);
        }
        revive() {
            this.setPlayState(PlayState.run);
            this.playAnimation("run", 0);
            this.isMoveing = true;
        }
        reStart() {
            this._playerPivot.transform.position = new Laya.Vector3(0, 0, 0);
            this._playerPivot.addChild(this.camera);
            this.camera.transform.position = this.camerapos;
            this.playAnimation("idle", 0);
            this._characterSlot.transform.position = new Laya.Vector3(0, 0, 0);
            this.worldDistance = 0;
            this.retrogression = 0;
        }
        update() {
            let scaledSpeed = this.m_Speed * 0.02;
            let pos = this._playerPivot.transform.position;
            if (this.retrogression < 0.1) {
                if (this._playState == PlayState.death) {
                    this._characterSlot.getComponent(Play).stopFlash();
                    this.playAnimation("death", 0.2);
                    Laya.timer.clear(this, this.update);
                    return;
                }
                else {
                    pos.z += scaledSpeed;
                    this.worldDistance += scaledSpeed;
                }
            }
            else {
                pos.z -= scaledSpeed;
                this.worldDistance -= scaledSpeed;
                this.retrogression *= 0.9;
            }
            this._playerPivot.transform.position = pos;
            if (this._playState == PlayState.jump) {
                let correctJumpLength = this.jumpLength * (1.0 + this.speedRatio);
                let ratio = (this.worldDistance - this.m_JumpStart) / correctJumpLength;
                if (ratio >= 1) {
                    this.playAnimation("run", 0);
                    this.setPlayState(PlayState.run);
                }
                else {
                    this._characterSlot.transform.localPositionY = Math.sin(ratio * Math.PI) * this.jumpHeight;
                    console.log("localPositionY:", this._characterSlot.transform.localPositionY);
                }
            }
            else if (this._playState == PlayState.slide) {
                let correctSlideLength = this.slideLength * (1.0 + this.speedRatio);
                let ratio = (this.worldDistance - this.m_SlideStart) / correctSlideLength;
                if (ratio >= 1.0) {
                    this.playAnimation("run", 0);
                    this.setPlayState(PlayState.run);
                }
            }
            if (this.m_Speed < this.maxSpeed) {
                this.m_Speed += 0.2 * 0.02;
            }
            else {
                this.m_Speed = this.maxSpeed;
            }
        }
        onRoletrogression() {
            this.retrogression = 1;
        }
        get speedRatio() { return (this.m_Speed - this.minSpeed) / (this.maxSpeed - this.minSpeed); }
        onMouseMove(data) {
            if (!this.isMoveing)
                return;
            if (this._playState != PlayState.run)
                return;
            if (data[0] == 0) {
                if (this.localx < 1.25) {
                    this.setPlayState(PlayState.right);
                    this.localx += 1.25;
                    Laya.Tween.to(this._characterSlot.transform, { localPositionX: this.localx }, 400, null, Laya.Handler.create(this, () => {
                        this.playAnimation("run", 0);
                        this.setPlayState(PlayState.run);
                    }));
                    this.playAnimation("left", 0);
                }
            }
            else if (data[0] == 1) {
                if (this.localx > -1.25) {
                    this.setPlayState(PlayState.left);
                    this.localx -= 1.25;
                    Laya.Tween.to(this._characterSlot.transform, { localPositionX: this.localx }, 400, null, Laya.Handler.create(this, () => {
                        this.playAnimation("run", 0);
                        this.setPlayState(PlayState.run);
                    }));
                    this.playAnimation("right", 0);
                }
            }
            else if (data[0] == 2) {
                this.setPlayState(PlayState.jump);
                this.m_JumpStart = this.worldDistance;
                this.playAnimation("jump", 0);
            }
            else if (data[0] == 3) {
                this.setPlayState(PlayState.slide);
                this.m_SlideStart = this.worldDistance;
                this.playAnimation("slide", 0);
            }
        }
        static MoveTowards(current, target, maxDistanceDelta) {
            let num = target.x - current.x;
            let num2 = target.y - current.y;
            let num3 = target.z - current.z;
            let num4 = num * num + num2 * num2 + num3 * num3;
            if (num4 == 0 || (maxDistanceDelta >= 0 && num4 <= maxDistanceDelta * maxDistanceDelta)) {
                return target;
            }
            let num5 = Math.sqrt(num4);
            return new Laya.Vector3(current.x + num / num5 * maxDistanceDelta, current.y + num2 / num5 * maxDistanceDelta, current.z + num3 / num5 * maxDistanceDelta);
        }
        playAnimation(name, transitionDuration) {
            if (this.animator == null || this.currentAnimation == name || this.currentAnimation == "happydance" || this.currentAnimation == "death") {
                return;
            }
            this.currentAnimation = name;
            this.animator.crossFade(name, transitionDuration);
        }
        setPlayState(state) {
            if (this._playState == PlayState.death || this._playState == PlayState.stop) {
                return;
            }
            this._playState = state;
        }
    }

    class FightManager extends rab.GameObject {
        constructor() {
            super();
            this._basebuilds = new Map();
            this.builds = new Array();
            this.winLenght = 50;
        }
        onInit() {
            this.AddListenerMessage(GameNotity.GameMessage_PauseGame, this.onGamePause);
            this.AddListenerMessage(GameNotity.GameMessage_GameContinue, this.onGameContinue);
            this.AddListenerMessage(GameNotity.Game_RemoveScene, this.onReMoveScene);
            this.AddListenerMessage(GameNotity.Game_TriggerEnter, this.onGameTriggerEnter);
            this.AddListenerMessage(GameNotity.GameMessage_Revive, this.onGameRevive);
            this.AddListenerMessage(GameNotity.GameMessage_ReGameStart, this.onGameReStart);
        }
        init() {
            this.max_lifeCount = 3;
            this.scene3D = this.owner;
            this.scene3D.enableFog = false;
            this.scene3D.fogColor = new Laya.Vector3(0.25, 0.55, 0.9);
            this.scene3D.fogStart = 30;
            this.scene3D.fogRange = 50;
            this.playerManager = this.scene3D.addComponent(PlayerManager);
            this.playerManager.view = this.view;
            this.playerManager.init();
            this.obstacleManager = this.scene3D.addComponent(ObstacleManager);
            this.obstacleManager.init();
        }
        onInitScene() {
            Laya.timer.resume();
            for (var i = 0; i < this.builds.length; i++) {
                this.builds[i].recover();
            }
            this.builds = [];
            this._buildPosZ = 0;
            this._obstaclePosZ = 10;
            this.max_lifeCount = 3;
            this.obstacleManager.onClearAll();
            for (var i = 0; i < 10; i++) {
                this.oncreateNextBuild();
            }
            this.manager.setScene();
        }
        fightReady() {
            this.scene3D.active = true;
            this.currlife = this.max_lifeCount;
            this.onLifeUpdate();
            this.isStart = false;
            this.playerManager.fightReady();
            this.manager = rab.RabGameManager.getInterest().getMyManager();
            this.passData = this.manager.CurrPassData();
            this.manager.fightGetCoin = 0;
            this.updatePassProgressNode();
            let arr = this.manager.getPassBuild();
            this.passData.builds.sort();
            for (var i = 0; i < this.passData.builds.length; i++) {
                this._basebuilds[this.passData.builds[i]] = Laya.loader.getRes("3d/build/Conventional/" + this.manager.getBuild(this.passData.builds[i]).res + ".lh");
            }
            this.onInitScene();
            this.SendMessage(GameNotity.GameMessage_GameStart);
        }
        onGameStart() {
            this.scene3D.active = true;
            if (!this.isStart) {
                console.log("开始跑了");
                this.currlife = this.max_lifeCount;
                this.addCoinTime = 60;
                this.onLifeUpdate();
                this.isStart = true;
                this.playerManager.onGameStart();
                this.updatePassProgressNode();
            }
        }
        onGamewin() {
            this.isStart = false;
            this.manager.gameInfo.score += this.manager.CurrPassData().length + this.manager.fightGetCoin;
            this.manager.onNextPass();
            this.manager.onAddLevelDate();
            this.playerManager.onhappydance();
            Laya.timer.once(2000, this, () => {
                rab.UIManager.onCreateView(ViewConfig.gameView.GameWinView);
            });
        }
        onGamePause() {
            this.isStart = false;
            Laya.timer.pause();
        }
        onGameContinue() {
            this.isStart = true;
            Laya.timer.resume();
        }
        fightProfit() {
            Laya.timer.clearAll(this);
        }
        onUpdate() {
            if (this.isStart == true) {
                this.playerManager.update();
                this.updatePassProgressNode();
                this.onCreateBuild();
                this.addCoinTime--;
                if (this.addCoinTime <= 0) {
                    this.addCoinTime = 60;
                    this.manager.fightGetCoin += 1;
                }
            }
        }
        onCreateBuild() {
            if (this._buildPosZ - this.playerManager.worldDistance <= 100) {
                if (this._buildPosZ <= this.passData.length) {
                    this.oncreateNextBuild();
                }
            }
            if (this.playerManager.worldDistance > this.passData.length - this.winLenght) {
                this.onGamewin();
            }
            if (this.playerManager.worldDistance < this.passData.length - 15) {
                if (this.playerManager.worldDistance > this.builds[0].PosZ) {
                    this.builds.shift().recover();
                }
            }
        }
        onGameTriggerEnter(data) {
            let prop = data[0];
            if (this.isStart) {
                if (this.playerManager._playState == PlayState.jump) {
                    if (prop.prop.up == 1) {
                    }
                    else {
                        this.currlife -= 1;
                        this.onLifeUpdate();
                        if (this.currlife == 0) {
                            this.onGameFail();
                        }
                    }
                }
                else if (this.playerManager._playState == PlayState.slide) {
                    if (prop.prop.down == 1) {
                    }
                    else {
                        this.currlife -= 1;
                        this.onLifeUpdate();
                        if (this.currlife == 0) {
                            this.onGameFail();
                        }
                    }
                }
                else {
                    this.currlife -= 1;
                    this.onLifeUpdate();
                    if (this.currlife == 0) {
                        this.onGameFail();
                    }
                }
            }
        }
        onGameFail() {
            this.isStart = false;
            this.manager.fightGetCoin = 0;
            this.playerManager.Ondeath();
            Laya.timer.once(2000, this, () => {
                rab.UIManager.onCreateView(ViewConfig.gameView.GameFailView);
            });
        }
        onGameRevive() {
            if (!this.isStart) {
                this.isStart = true;
                this.playerManager.revive();
                rab.UIManager.onCloseView(ViewConfig.gameView.GameFailView);
                this.currlife = this.max_lifeCount;
                this.onLifeUpdate();
            }
        }
        onGameReStart() {
            if (!this.isStart) {
                Laya.timer.resume();
                this.currlife = this.max_lifeCount;
                this.onLifeUpdate();
                console.log("重新开始");
                this.playerManager.reStart();
                this.onInitScene();
                this.updatePassProgressNode();
                Laya.timer.once(300, this, () => {
                    this.SendMessage(GameNotity.GameMessage_GameStart);
                });
                rab.UIManager.onCloseView(ViewConfig.gameView.GameFailView);
            }
            else {
                console.log("已经重新开始");
            }
        }
        onReMoveScene() {
            console.log("回收场景了");
            for (var i = 0; i < this.builds.length; i++) {
                this.builds[i].recover();
            }
            this.builds = [];
            this.obstacleManager.onClearAll();
            for (var i = 0; i < this.passData.builds.length; i++) {
                Laya.Pool.clearBySign("build_" + this.passData.builds[i]);
                this._basebuilds[this.passData.builds[i]].destroy();
            }
            this._basebuilds.clear();
            this.builds = [];
            this.playerManager.fightExit();
            rab.UIManager.onHideView(ViewConfig.gameView.GameView);
        }
        oncreateNextBuild() {
            let buildID = this.passData.builds[Math.floor(Math.random() * this.passData.builds.length)];
            let build = Laya.Pool.getItem("build_" + buildID);
            let buildProp;
            if (!build) {
                build = this.instantiate(this._basebuilds[buildID], null, false, new Laya.Vector3(0, 0, this._buildPosZ));
                buildProp = build.addComponent(BuildItem);
            }
            else {
                build.transform.localPositionZ = this._buildPosZ;
                buildProp = build.getComponent(BuildItem);
            }
            this.scene3D.addChild(build);
            this.builds.push(buildProp);
            buildProp.onInitProp(this.manager.getBuild(buildID), this._buildPosZ);
            console.log("buildID:", buildID);
            this._buildPosZ += this.manager.getBuild(buildID).length;
            while (this._obstaclePosZ < this._buildPosZ && this._obstaclePosZ < this.passData.length - this.winLenght - 15) {
                this._obstaclePosZ += 15;
                this.obstacleManager.onCreateobstacle(this.passData, this._obstaclePosZ);
            }
            if (this.manager.playSelect == 1) {
                Tool.instance.setPosition(new Laya.Vector3(8.1, 0, build.transform.position.z), build);
                Tool.instance.setRotationEuler(new Laya.Vector3(-90, 0, 0), build);
            }
            else {
                Tool.instance.setPosition(new Laya.Vector3(-3.6, 2.08, build.transform.position.z), build);
                Tool.instance.setRotationEuler(new Laya.Vector3(0, -180, 0), build);
            }
            return build;
        }
        updatePassProgressNode() {
            this.view.progress_t.x = 2 + (this.playerManager.worldDistance / (this.passData.length - this.winLenght) * (this.view.progress_t.width));
            this.view.coinText.value = "" + this.manager.fightGetCoin;
            this.view.iconNode.x = this.view.progress_t.x - this.view.progress_t.width / 2 + 20;
        }
        onLifeUpdate() {
            this.view.lifeText.value = this.currlife + "";
            this.view.life_bg.width = (this.currlife / this.max_lifeCount) * 290;
        }
    }

    class Game extends rab.RabView {
        constructor() {
            super(...arguments);
            this.gameStart = false;
            this.mouseDown = false;
            this._mouseDownX = 0;
            this._mouseDownY = 0;
            this.isclick = false;
        }
        LoadView() {
            this.create(ui.view.GameUI);
        }
        InitView() {
            this.AddListenerMessage(GameNotity.GameMessage_GameStart, this.onGametart);
            this.m_currView.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            this.m_currView.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
            this.m_currView.pauseBtn.on(Laya.Event.CLICK, this, this.onPause);
            Tool.instance.addButtonAnimation(this.m_currView.pauseBtn);
            this.camera = this.myManager.scene3D.getChildByName("Main Camera");
            this.fightManager = this.myManager.scene3D.addComponent(FightManager);
            this.fightManager.view = this.m_currView;
            this.fightManager.init();
            console.log("创建游戏页面");
            this.OnRefreshView();
        }
        OnRefreshView() {
            console.log("刷新游戏页面");
            this.m_currView.guild.visible = true;
            this.gameStart = false;
            this.m_currView.timeDown.visible = false;
            this.fightManager.fightReady();
            this.m_currView.lifeText.value = "3";
        }
        onPause() {
            if (this.m_currView.timeDown.visible == false) {
                this.SendMessage(GameNotity.GameMessage_PauseGame);
                rab.UIManager.onCreateView(ViewConfig.gameView.PauseView);
            }
        }
        onGametart(data) {
            if (this.m_currView.timeDown.visible == true) {
                return;
            }
            this.m_currView.guild.visible = false;
            this.m_currView.timeDown.visible = true;
            this.m_currView.timeDown.skin = "ui/3.png";
            this.countdown = 1;
            Laya.timer.frameLoop(1, this, this.update);
        }
        update() {
            if (this.countdown >= 240) {
                this.m_currView.timeDown.visible = false;
                this.fightManager.onGameStart();
                this.gameStart = true;
                Laya.timer.clear(this, this.update);
            }
            else if (this.countdown >= 180) {
                this.m_currView.timeDown.skin = "ui/go.png";
            }
            else if (this.countdown >= 120) {
                this.m_currView.timeDown.skin = "ui/1.png";
            }
            else if (this.countdown >= 60) {
                this.m_currView.timeDown.skin = "ui/2.png";
            }
            this.countdown++;
        }
        onKeyUp(e) {
            if (e.keyCode == 37) {
                this.SendMessage(GameNotity.Game_UpdateMouseMove, 0);
            }
            else if (e.keyCode == 38) {
                this.SendMessage(GameNotity.Game_UpdateMouseMove, 2);
            }
            else if (e.keyCode == 39) {
                this.SendMessage(GameNotity.Game_UpdateMouseMove, 1);
            }
            else if (e.keyCode == 40) {
                this.SendMessage(GameNotity.Game_UpdateMouseMove, 3);
            }
            else if (e.keyCode == 32) {
                this.SendMessage(GameNotity.GameMessage_testScene);
            }
        }
        onMouseDown(e) {
            if (this.gameStart) {
                this.isclick = false;
                this.mouseDown = true;
                this._mouseDownX = Laya.stage.mouseX;
                this._mouseDownY = Laya.stage.mouseY;
            }
            else if (!this.isclick) {
                this.isclick = true;
                this.m_currView.guild.visible = false;
                this.SendMessage(GameNotity.GameMessage_GameStart);
            }
        }
        onMouseUp(e) {
            if (this.gameStart && this.mouseDown) {
                this.mouseDown = false;
                if (Math.abs(this._mouseDownX - Laya.stage.mouseX) > 1 || Math.abs(this._mouseDownY - Laya.stage.mouseY) > 1) {
                    let dre = -1;
                    if (Math.abs(this._mouseDownX - Laya.stage.mouseX) > Math.abs(this._mouseDownY - Laya.stage.mouseY)) {
                        if (this._mouseDownX - Laya.stage.mouseX > 0) {
                            dre = 0;
                        }
                        else {
                            dre = 1;
                        }
                    }
                    else {
                    }
                    this.SendMessage(GameNotity.Game_UpdateMouseMove, dre);
                }
            }
        }
    }

    class Pendant extends rab.RabView {
        LoadView() {
            this.create(ui.view.PendantUI);
        }
        InitView() {
            if (Tool.instance.isIPhoneX() == true) {
                this.m_currView.coinBox.y += 50;
                this.m_currView.ticketBox.y += 50;
            }
            this.m_currView.zOrder = 10;
            this.m_currView.mouseThrough = true;
            this.m_currView.coinBox.on(Laya.Event.CLICK, this, this.onCoin);
            Tool.instance.addButtonAnimation(this.m_currView.coinBox);
            this.m_currView.ticketBox.on(Laya.Event.CLICK, this, this.onTicket);
            Tool.instance.addButtonAnimation(this.m_currView.ticketBox);
            this.AddListenerMessage(GameNotity.Game_UpdateCoin, this.updateCoin);
            this.AddListenerMessage(GameNotity.Game_UpdateTicket, this.updateTicket);
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.isLoopAddTicket = false;
            this.updateCoin();
            this.updateTicket();
        }
        onCoin() {
        }
        onTicket() {
        }
        updateCoin() {
            this.m_currView.coinBox.getChildByName("text").text = "" + rab.Util.formatter(this.myManager.gameInfo.coin);
        }
        updateTicket() {
            this.m_currView.ticketBox.getChildByName("text").value = "" + this.myManager.gameInfo.ticket;
            if (this.myManager.isLoopAddTicket == true && this.isLoopAddTicket == false) {
                this.isLoopAddTicket = true;
                this.loopAddTicketTimeGap = this.myManager.loopAddTicketTimeGap;
                this.updateTicketTime();
                Laya.timer.clear(this, this.updateTicketTime);
                Laya.timer.loop(1000, this, this.updateTicketTime);
            }
            else if (this.myManager.isLoopAddTicket == false) {
                this.isLoopAddTicket = false;
                this.loopAddTicketTimeGap = 0;
                this.m_currView.ticketBox.getChildByName("timeText").text = "已满";
                Laya.timer.clear(this, this.updateTicketTime);
            }
        }
        updateTicketTime() {
            this.loopAddTicketTimeGap -= 1000;
            if (this.loopAddTicketTimeGap >= 0) {
                if (this.loopAddTicketTimeGap == 0) {
                    this.m_currView.ticketBox.getChildByName("timeText").text = "00:00";
                    let manager = rab.RabGameManager.getInterest().getMyManager();
                    this.loopAddTicketTimeGap = manager.loopAddTicketTimeGap;
                }
                else {
                    this.m_currView.ticketBox.getChildByName("timeText").text = rab.Util.UpdateTime(this.loopAddTicketTimeGap / 1000);
                }
            }
        }
    }

    class Pause extends rab.RabView {
        LoadView() {
            this.create(ui.view.PauseUI);
            this._bannerPos = "Pause";
        }
        InitView() {
            this.m_currView.zOrder = 12;
            this.m_currView.continueBtn.on(Laya.Event.CLICK, this, this.onContinue);
            Tool.instance.addButtonAnimation(this.m_currView.continueBtn);
            this.m_currView.restart.on(Laya.Event.CLICK, this, this.onRestar);
            Tool.instance.addButtonAnimation(this.m_currView.restart);
            this.m_currView.home.on(Laya.Event.CLICK, this, this.onDiscontinue);
            Tool.instance.addButtonAnimation(this.m_currView.home);
        }
        OnRefreshView() {
        }
        onRestar() {
            this.SendMessage(GameNotity.GameMessage_ReGameStart);
            this.onHide();
        }
        onContinue() {
            this.SendMessage(GameNotity.GameMessage_GameContinue);
            this.onHide();
        }
        onDiscontinue() {
            this.onHide();
            Laya.timer.resume();
            this.SendMessage(GameNotity.Game_RemoveScene);
            rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
        }
    }

    class GameWin extends rab.RabView {
        LoadView() {
            this.create(ui.view.GameWinUI);
            this._bannerPos = "GameWin";
        }
        InitView() {
            this.m_currView.winNode.y += (Laya.stage.height - 1334) / 2;
            this.m_currView.next.on(Laya.Event.CLICK, this, this.onNext);
            Tool.instance.addButtonAnimation(this.m_currView.next);
            this.m_currView.homeBtn.on(Laya.Event.CLICK, this, this.onHome);
            Tool.instance.addButtonAnimation(this.m_currView.homeBtn);
            this.m_currView.cover.on(Laya.Event.CLICK, this, () => {
                if (this.m_currView.bigPhoto.scaleX == 1 && this.m_currView.bigPhoto.alpha == 1) {
                    Laya.Tween.clearAll(this.m_currView.bigPhoto);
                    Laya.Tween.to(this.m_currView.bigPhoto, { alpha: 0 }, 1000, Laya.Ease.quadInOut);
                    Laya.Tween.clearAll(this.m_currView.cover);
                    Laya.Tween.to(this.m_currView.cover, {}, 850, null, Laya.Handler.create(this, () => {
                        this.m_currView.cover.visible = false;
                        this.m_currView.bigPhoto.visible = false;
                        this.m_currView.bigPhoto.skin = null;
                    }));
                }
            });
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.create3DScene();
            this.onwin();
        }
        create3DScene() {
            this.myManager.scene3D.active = false;
            this.scene3D = this.m_currView.cloudNode.addChild(new Laya.Scene3D());
            var camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 1, 0));
            camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
            var directionLight = this.scene3D.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            this.playNode = Laya.Sprite3D.instantiate(Laya.loader.getRes("3d/prefab/Conventional/play_" + this.myManager.playSelect + ".lh"), this.scene3D), true, new Laya.Vector3(0, 0, 2);
            this.playNode.transform.localPosition = new Laya.Vector3(0, -0.1, -3);
            this.playNode.transform.localRotationEulerX = 0;
            this.playNode.active = true;
            Laya.timer.frameLoop(1, this, this.onUpdate);
            this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
            this.animator.play("happydance");
            Laya.timer.frameLoop(180, this.animator, () => {
                this.animator.play("idle");
                this.animator.play("happydance");
            }, null, false);
        }
        onUpdate() {
            this.m_currView.eff.rotation += 1;
        }
        onShowLanguage() {
        }
        onwin() {
            let index = this.myManager.openPhotowall();
            this.m_currView.award.visible = true;
            if (index <= 11) {
                Laya.timer.once(300, this, () => {
                    this.m_currView.cover.visible = true;
                    this.m_currView.cover.alpha = 0.5;
                    this.m_currView.bigPhoto.visible = true;
                    this.m_currView.bigPhoto.alpha = 1;
                    this.m_currView.bigPhoto.skin = "new/com/Photo/pic_0" + (index) + "_b.png";
                    Tool.instance.winowAniamtion(this.m_currView.bigPhoto, 0.5);
                });
            }
            let alpha = (sprite, time) => {
                sprite.alpha = 0;
                Laya.Tween.to(sprite, { alpha: 1 }, time);
            };
            this.m_currView.coinText.value = "" + this.myManager.fightGetCoin;
            this.m_currView.next.visible = true;
            this.m_currView.homeBtn.visible = true;
            alpha(this.m_currView.next, 200);
            alpha(this.m_currView.homeBtn, 200);
            this.myManager.addCoin(this.myManager.fightGetCoin);
            rab.MusicManager.playMusic("");
            rab.MusicManager.playSound("res/audio/win.mp3");
            this.SendMessage(GameNotity.Game_RemoveScene);
        }
        onHide() {
            this.myManager.scene3D.active = true;
            this.scene3D.removeSelf();
            this.scene3D.destroy();
            this.m_currView.award.visible = false;
            this.m_currView.next.visible = false;
            super.onHide();
        }
        onHome() {
            this.onHide();
            rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
        }
        onNext() {
            this.onHide();
            rab.UIManager.onCreateView(ViewConfig.gameView.RoleSelect);
        }
    }

    class GameFail extends rab.RabView {
        LoadView() {
            this.create(ui.view.GameFailUI);
            this._bannerPos = "GameFail";
        }
        InitView() {
            this.m_currView.resrart.on(Laya.Event.CLICK, this, this.onRestar);
            Tool.instance.addButtonAnimation(this.m_currView.resrart);
            this.m_currView.share.on(Laya.Event.CLICK, this, this.onShare);
            Tool.instance.addButtonAnimation(this.m_currView.share);
            this.m_currView.home.on(Laya.Event.CLICK, this, this.onHome);
            Tool.instance.addButtonAnimation(this.m_currView.home);
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.time = 3;
            this.m_currView.coinText.value = "" + this.myManager.fightGetCoin;
            this.myManager.addCoin(this.myManager.fightGetCoin);
            this.create3DScene();
        }
        create3DScene() {
            this.myManager.scene3D.active = false;
            this.scene3D = this.m_currView.cloudNode.addChild(new Laya.Scene3D());
            var camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 1, 0));
            camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
            var directionLight = this.scene3D.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            this.playNode = Laya.Sprite3D.instantiate(Laya.loader.getRes("3d/prefab/Conventional/play_" + this.myManager.playSelect + ".lh"), this.scene3D), true, new Laya.Vector3(0, 0, 2);
            this.playNode.transform.localPosition = new Laya.Vector3(0, -0.1, -3);
            this.playNode.transform.localRotationEulerX = 0;
            this.playNode.active = true;
            this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
            this.animator.play("death");
            Laya.timer.frameLoop(180, this.animator, () => {
                this.animator.play("idle");
                this.animator.play("death");
            }, null, false);
        }
        onShowLanguage() {
        }
        onRestar() {
            this.SendMessage(GameNotity.GameMessage_ReGameStart);
        }
        onShare() {
        }
        onHome() {
            this.onHide();
            this.SendMessage(GameNotity.Game_RemoveScene);
            rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
        }
        onHide() {
            this.myManager.scene3D.active = true;
            this.scene3D.removeSelf();
            this.scene3D.destroy();
            super.onHide();
        }
    }

    class GetTicket extends rab.RabView {
        LoadView() {
            this.create(ui.view.GetTicketUI);
            this._bannerPos = "GetTicket";
        }
        InitView() {
            Laya.timer.once(100, this, () => {
                this.OnRefreshView();
            });
            this.m_currView.zOrder = 12;
            this.m_currView.cover.on(Laya.Event.CLICK, this, this.onHide);
            this.m_currView.closeBtn.on(Laya.Event.CLICK, this, this.onHide);
            Tool.instance.addButtonAnimation(this.m_currView.closeBtn);
            this.m_currView.getTicketBtn.on(Laya.Event.CLICK, this, this.onGetTicket);
            Tool.instance.addButtonAnimation(this.m_currView.getTicketBtn);
            let Templet2 = new Laya.Templet();
            Templet2.on(Laya.Event.COMPLETE, this, (Templet, name) => {
                let skeleton = Templet.buildArmature(1);
                this.m_currView.window.addChild(skeleton);
                skeleton.x = this.m_currView.window.width / 2;
                skeleton.y = this.m_currView.window.height / 2 - 30;
                skeleton.stop();
                skeleton.play(name, true);
                let skeleton2 = Templet.buildArmature(1);
                this.m_currView.window.addChild(skeleton2);
                skeleton2.x = this.m_currView.window.width / 2;
                skeleton2.y = this.m_currView.window.height / 2 - 30;
                Laya.timer.once(500, this, () => {
                    skeleton2.stop();
                    skeleton2.play(name, true);
                });
            }, [Templet2, "stars"]);
            Templet2.loadAni("effect/star/effetc_stars.sk");
        }
        OnRefreshView() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            this.m_currView.currentTIcketText.value = manager.gameInfo.ticket + "/" + manager.gameInfo.maxTicket;
            this.m_currView.getTicketText.text = "领取" + manager.getVideoAddTicket() + "点体力";
            this.m_currView.window.visible = true;
            Tool.instance.winowAniamtion(this.m_currView.window);
        }
        onGetTicket() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            rab.SDKChannel.stimulate("getTicketWay", () => {
                manager.addTicket(manager.getVideoAddTicket());
            });
            this.onHide();
        }
    }

    class GameSet extends rab.RabView {
        LoadView() {
            this.create(ui.view.GameSetUI);
            this._bannerPos = "GameSet";
        }
        InitView() {
            Laya.timer.once(100, this, () => {
                this.OnRefreshView();
            });
            this.m_currView.zOrder = 12;
            Tool.instance.getSpriteAt(this.m_currView.collectIImage, [1]).y += (Laya.stage.height - 1334) / 3;
            Tool.instance.getSpriteAt(this.m_currView.collectIImage, [2]).y += (Laya.stage.height - 1334) / 3;
            this.m_currView.cover.on(Laya.Event.CLICK, this, this.onHide);
            this.m_currView.closeBtn.on(Laya.Event.CLICK, this, this.onHide);
            Tool.instance.addButtonAnimation(this.m_currView.closeBtn);
            this.m_currView.soundOpenText.on(Laya.Event.CLICK, this, this.onSoundOpen);
            Tool.instance.addButtonAnimation(this.m_currView.soundOpenText);
            this.m_currView.soundCloseText.on(Laya.Event.CLICK, this, this.onSounClose);
            Tool.instance.addButtonAnimation(this.m_currView.soundCloseText);
            this.m_currView.vibrateOpenText.on(Laya.Event.CLICK, this, this.onVibrateOpen);
            Tool.instance.addButtonAnimation(this.m_currView.vibrateOpenText);
            this.m_currView.vibrateCloseText.on(Laya.Event.CLICK, this, this.onVibrateClose);
            Tool.instance.addButtonAnimation(this.m_currView.vibrateCloseText);
            this.m_currView.shareBtn.on(Laya.Event.CLICK, this, this.onShare);
            Tool.instance.addButtonAnimation(this.m_currView.shareBtn);
            this.m_currView.followBtn.on(Laya.Event.CLICK, this, this.onCollect);
            Tool.instance.addButtonAnimation(this.m_currView.followBtn);
            this.m_currView.subscribeBtn.on(Laya.Event.CLICK, this, this.onSubscribe);
            Tool.instance.addButtonAnimation(this.m_currView.subscribeBtn);
            this.m_currView.collectIImage.on(Laya.Event.CLICK, this, () => {
                this.m_currView.collectIImage.visible = false;
            });
            this.m_currView.collectIImage.getChildByName("closeBtn").on(Laya.Event.CLICK, this, () => {
                this.m_currView.collectIImage.visible = false;
            });
            Tool.instance.addButtonAnimation(this.m_currView.collectIImage.getChildByName("closeBtn"));
        }
        OnRefreshView() {
            this.onInitData();
            this.m_currView.window.visible = true;
            Tool.instance.winowAniamtion(this.m_currView.window);
        }
        onInitData() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            if (manager.gameInfo.audio == 0) {
                this.m_currView.soundClose.visible = true;
                this.m_currView.soundOpen.visible = false;
                this.m_currView.soundCloseText.visible = false;
                this.m_currView.soundOpenText.visible = true;
            }
            else {
                this.m_currView.soundClose.visible = false;
                this.m_currView.soundOpen.visible = true;
                this.m_currView.soundCloseText.visible = true;
                this.m_currView.soundOpenText.visible = false;
            }
            if (manager.gameInfo.vibrate == 0) {
                this.m_currView.vibrateClose.visible = true;
                this.m_currView.vibrateOpen.visible = false;
                this.m_currView.vibrateCloseText.visible = false;
                this.m_currView.vibrateOpenText.visible = true;
            }
            else {
                this.m_currView.vibrateClose.visible = false;
                this.m_currView.vibrateOpen.visible = true;
                this.m_currView.vibrateCloseText.visible = true;
                this.m_currView.vibrateOpenText.visible = false;
            }
        }
        onSoundOpen() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            manager.gameInfo.audio = 1;
            manager.SaveData(4);
            rab.MusicManager.playMusic("res/audio/MainBGM.mp3");
            this.onInitData();
        }
        onSounClose() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            manager.gameInfo.audio = 0;
            manager.SaveData(5);
            this.onInitData();
        }
        onVibrateOpen() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            manager.gameInfo.vibrate = 1;
            manager.SaveData(6);
            this.onInitData();
        }
        onVibrateClose() {
            let manager = rab.RabGameManager.getInterest().getMyManager();
            manager.gameInfo.vibrate = 0;
            this.onInitData();
        }
        onShare() {
            rab.SDKChannel.createShare("invite", () => {
            });
        }
        onCollect() {
            this.m_currView.collectIImage.visible = true;
        }
        onSubscribe() {
        }
    }

    class NotClick extends rab.RabView {
        LoadView() {
            this.create(ui.view.NotClickUI);
        }
        InitView() {
            this.m_currView.zOrder = 10000;
            this.m_currView.click.on(Laya.Event.CLICK, this, null);
            Laya.timer.loop(300, this, () => {
                if (this.m_currView.loadText.text == "加载中.") {
                    this.m_currView.loadText.text = "加载中..";
                }
                else if (this.m_currView.loadText.text == "加载中..") {
                    this.m_currView.loadText.text = "加载中...";
                }
                else if (this.m_currView.loadText.text == "加载中...") {
                    this.m_currView.loadText.text = "加载中.";
                }
            });
            this.AddListenerMessage(GameNotity.Init_Loading, this.initLoading);
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.m_currView.bg.visible = true;
            this.m_currView.loadNode.visible = true;
        }
        onHide() {
            super.onHide();
            if (this.cloud != null) {
                this.cloud.destroy(true);
                this.cloud = null;
            }
        }
        initLoading() {
            this.loadCloud();
        }
        loadCloud() {
            let cloud = () => {
                this.cloud = this.templet.buildArmature(1);
                this.m_currView.addChild(this.cloud);
                this.cloud.x = Laya.stage.width / 2;
                this.cloud.y = Laya.stage.height / 2;
                this.cloudTotal = this.cloud.total;
                this.onHideCloud();
            };
            if (this.templet != null) {
                cloud();
            }
            else {
                this.templet = new Laya.Templet();
                this.templet.on(Laya.Event.COMPLETE, this, (Templet, name) => {
                    cloud();
                }, [this.templet, "animation"]);
                this.templet.loadAni("effect/cloud/effect_yun.sk");
            }
        }
        onHideCloud() {
            this.cloud.play("animation", false, true, 0, this.cloudTotal * (1 / 60) * 1000);
            Laya.timer.once(this.cloudTotal * (1 / 60) * 1000, this, () => {
                rab.UIManager.onCreateView(ViewConfig.gameView.GameView);
                rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
                rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
                rab.UIManager.onCloseView(ViewConfig.gameView.RoleSelect);
                let resume = () => {
                    if (rab.UIManager.isContainView(ViewConfig.gameView.GameView) == true) {
                        this.m_currView.bg.visible = false;
                        this.m_currView.loadNode.visible = false;
                        this.cloud.play("animation", false, true, this.cloudTotal * (1 / 60) * 1000, this.cloudTotal * (1 / 60) * 2000);
                        Laya.timer.clear(this, resume);
                        Laya.timer.once(this.cloudTotal * (1 / 60) * 1000, this, this.onHide, null, false);
                    }
                };
                Laya.timer.frameLoop(5, this, resume);
            }, null, false);
        }
    }

    class RoleSelect extends rab.RabView {
        constructor() {
            super(...arguments);
            this.mouseDown = false;
            this._mouseDownType = 0;
            this._mouseDownX = 0;
        }
        LoadView() {
            this.create(ui.view.RoleSelectUI);
        }
        InitView() {
            this.m_currView.break.on(Laya.Event.CLICK, this, this.onBreak);
            Tool.instance.addButtonAnimation(this.m_currView.break);
            this.m_currView.r1.on(Laya.Event.CLICK, this, this.onSelectRole_1);
            this.m_currView.r2.on(Laya.Event.CLICK, this, this.onSelectRole_2);
            this.m_currView.r3.on(Laya.Event.CLICK, this, this.onSelectRole_3);
            this.m_currView.r4.on(Laya.Event.CLICK, this, this.onSelectRole_4);
            this.m_currView.left.on(Laya.Event.MOUSE_DOWN, this, this.onRotateLeft);
            Tool.instance.addButtonAnimation(this.m_currView.left);
            this.m_currView.right.on(Laya.Event.MOUSE_DOWN, this, this.onRotateRight);
            Tool.instance.addButtonAnimation(this.m_currView.right);
            this.m_currView.left.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.m_currView.right.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            this.m_currView.startBtn.on(Laya.Event.CLICK, this, this.onstart);
            Tool.instance.addButtonAnimation(this.m_currView.startBtn);
            Laya.timer.frameLoop(1, this, this.onFrameLoop);
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.m_currView.roleName_1.text = "JACK";
            this.m_currView.roleName_2.text = "小明";
            this.m_currView.roleName_3.text = "大叔";
            this.m_currView.roleName_4.text = "大爷";
            this.create3DScene();
        }
        create3DScene() {
            if (this.scene3D != null) {
                return;
            }
            this.myManager.scene3D.active = false;
            this.scene3D = this.m_currView.cloudNode.addChild(new Laya.Scene3D());
            var camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 1, 0));
            camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
            var directionLight = this.scene3D.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            this.onShowRole(1);
        }
        onShowLanguage() {
        }
        onHide() {
            this.myManager.scene3D.active = true;
            this.scene3D.removeSelf();
            this.scene3D.destroy();
            console.log("this.scene3D.destroy");
            super.onHide();
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        }
        onstart() {
            this.myManager.playSelect = this.selectId;
            if (this.myManager.CurrPassData()) {
                if (this.myManager.addTicket(-1) == true) {
                    rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
                    let self = this;
                    let complete = () => {
                        let arr = self.myManager.getPassBuild();
                        arr.push("3d/build/Conventional/road80.lh");
                        arr.push("3d/build/Conventional/road90.lh");
                        self.myManager.onLoad3dScene(() => {
                            Laya.loader.create(arr, Laya.Handler.create(self, () => {
                                self.SendMessage(GameNotity.Init_Loading);
                            }));
                        });
                    };
                    complete();
                }
            }
            else {
                console.log("没有新关卡了");
            }
        }
        onShowRole(id) {
            console.log("选择角色：", id);
            if (this.selectId == id) {
                return;
            }
            this.m_currView.select_1.visible = false;
            this.m_currView.select_2.visible = false;
            this.m_currView.select_3.visible = false;
            this.m_currView.select_4.visible = false;
            this.m_currView["select_" + id].visible = true;
            this.selectId = id;
            if (this.playNode) {
                this.playNode.destroy();
            }
            this.playNode = Laya.Sprite3D.instantiate(Laya.loader.getRes("3d/prefab/Conventional/play_" + id + ".lh"), this.scene3D, true, new Laya.Vector3(0, 0, 0));
            this.playNode.active = true;
            this.playNode.transform.localPosition = new Laya.Vector3(0, 0.3, -3.5);
            this.playNode.transform.localRotationEulerX = 0;
            this.m_currView.roleName_1.color = "#929b9e";
            this.m_currView.roleName_2.color = "#929b9e";
            this.m_currView.roleName_3.color = "#929b9e";
            this.m_currView.roleName_4.color = "#929b9e";
            this.m_currView["roleName_" + id].color = "#ffffff";
        }
        onBreak() {
            this.playNode.removeSelf();
            this.myManager.playSelect = this.selectId;
            rab.UIManager.onCloseView(ViewConfig.gameView.RoleSelect);
            rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
        }
        OnRemove() {
            super.OnRemove();
            if (this.playNode) {
                this.playNode.removeSelf();
            }
        }
        onSelectRole_1() {
            this.onShowRole(1);
        }
        onSelectRole_2() {
            this.onShowRole(2);
        }
        onSelectRole_3() {
            this.onShowRole(3);
        }
        onSelectRole_4() {
            this.onShowRole(4);
        }
        onMouseDown(e) {
            this.mouseDown = true;
            this._mouseDownX = Laya.stage.mouseX;
        }
        onMouseUp() {
            console.log("鼠标弹起");
            this.mouseDown = false;
            this._mouseDownType = 0;
            this._mouseDownX = 0;
        }
        onMouseMove() {
            if (this.mouseDown) {
                if (this._mouseDownX - Laya.stage.mouseX > 0) {
                    this.playNode.transform.rotate(new Laya.Vector3(0, -0.1, 0));
                }
                else {
                    this.playNode.transform.rotate(new Laya.Vector3(0, 0.1, 0));
                }
                this._mouseDownX = Laya.stage.mouseX;
            }
        }
        onFrameLoop() {
            if (this.mouseDown) {
                if (this._mouseDownType == 1) {
                    this.playNode.transform.rotate(new Laya.Vector3(0, -0.1, 0));
                }
                else if (this._mouseDownType == -1) {
                    this.playNode.transform.rotate(new Laya.Vector3(0, 0.1, 0));
                }
            }
        }
        onRotateLeft() {
            this.mouseDown = true;
            this._mouseDownType = 1;
        }
        onRotateRight() {
            this.mouseDown = true;
            this._mouseDownType = -1;
        }
    }

    class Rank extends rab.RabView {
        LoadView() {
            this.create(ui.view.RankUI);
        }
        InitView() {
            this.m_currView.breakBtn.on(Laya.Event.CLICK, this, this.onBreak);
            Tool.instance.addButtonAnimation(this.m_currView.breakBtn);
            this.m_currView.rankList.selectEnable = true;
            this.m_currView.rankList.selectHandler = new Laya.Handler(this, this.onSelect);
            this.m_currView.rankList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.page = 0;
            this.updateList();
        }
        onBreak() {
            rab.UIManager.onHideView(ViewConfig.gameView.Rank);
            rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
        }
        updateList() {
            let array = [];
            let count = (9 >= this.m_currView.rankList.length) ? 9 : this.m_currView.rankList.length;
            for (let m = 0; m < count; m++) {
                array.push("");
            }
            this.m_currView.rankList.array = array;
            for (let m = count; m < this.myManager.rank.length; m++) {
                this.m_currView.rankList.addItem("");
            }
        }
        initItem(index, item, data) {
            index += 1;
            let head = item.getChildAt(0);
            head.skin = null;
            let headBox = item.getChildAt(1);
            headBox.visible = false;
            let name = item.getChildAt(2);
            name.text = "";
            let score = item.getChildAt(3);
            for (let i = score.numChildren - 1; i >= 0; i--) {
                let _score = score.getChildAt(i);
                _score.skin = null;
            }
            if (data != null) {
                head.skin = data["avatar"];
                headBox.visible = true;
                name.text = data["name"];
                let string = (data["score"] + "").split("");
                for (let i = score.numChildren - 1; i >= 0; i--) {
                    let _score = score.getChildAt(i);
                    if (string.length > 0) {
                        _score.skin = "new/com/num/score/" + string.pop() + ".png";
                    }
                }
            }
            if (item.getChildByName("index").visible == true) {
                let _index = item.getChildAt(4);
                _index.skin = null;
                for (let i = 0; i < _index.numChildren; i++) {
                    _index.getChildAt(i).removeSelf();
                    _index.getChildAt(i).destroy();
                }
                if (data != null) {
                    if (index > 9) {
                        let string = (index + "").split("");
                        for (let i = 0; i < string.length; i++) {
                            let child = new Laya.Image();
                            _index.addChild(child);
                            child.skin = "new/com/num/index/" + string[i] + ".png";
                            child.pos(-child.width / 2 + 32 * i, 0);
                        }
                    }
                    else {
                        _index.skin = "new/com/num/index/" + index + ".png";
                    }
                }
            }
        }
        updateItem(cell, index) {
            let item = cell.getChildAt(0).getChildAt(0);
            if (index < 3) {
                item.skin = "new/com/" + (index + 1) + "st.png";
                item.getChildByName("index").visible = false;
            }
            else {
                item.skin = "new/com/4st.png";
                item.getChildByName("index").visible = true;
            }
            this.initItem(index, item, this.myManager.rank[index]);
        }
        onSelect(index) {
        }
    }

    class PhotoWall extends rab.RabView {
        LoadView() {
            this.create(ui.view.PhotoWallUI);
        }
        InitView() {
            this.m_currView.breakBtn.on(Laya.Event.CLICK, this, this.onBreak);
            Tool.instance.addButtonAnimation(this.m_currView.breakBtn);
            this.m_currView.year80GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year80"]);
            Tool.instance.addButtonAnimation(this.m_currView.year80GaryBtn);
            this.m_currView.year80YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year80"]);
            Tool.instance.addButtonAnimation(this.m_currView.year80YellowBtn);
            this.m_currView.year90GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year90"]);
            Tool.instance.addButtonAnimation(this.m_currView.year90GaryBtn);
            this.m_currView.year90YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year90"]);
            Tool.instance.addButtonAnimation(this.m_currView.year90YellowBtn);
            this.m_currView.year00GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year00"]);
            Tool.instance.addButtonAnimation(this.m_currView.year00GaryBtn);
            this.m_currView.year00YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year00"]);
            Tool.instance.addButtonAnimation(this.m_currView.year00YellowBtn);
            this.m_currView.year10GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year10"]);
            Tool.instance.addButtonAnimation(this.m_currView.year10GaryBtn);
            this.m_currView.year10YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year10"]);
            Tool.instance.addButtonAnimation(this.m_currView.year10YellowBtn);
            this.m_currView.cover.on(Laya.Event.CLICK, this, () => {
                if (this.m_currView.bigPhoto.scaleX == 1 && this.m_currView.bigPhoto.alpha == 1) {
                    Laya.Tween.clearAll(this.m_currView.bigPhoto);
                    Laya.Tween.to(this.m_currView.bigPhoto, { alpha: 0 }, 1000, Laya.Ease.quadInOut);
                    Laya.Tween.clearAll(this.m_currView.cover);
                    Laya.Tween.to(this.m_currView.cover, {}, 850, null, Laya.Handler.create(this, () => {
                        this.m_currView.cover.visible = false;
                        this.m_currView.bigPhoto.visible = false;
                    }));
                }
            });
            this.m_currView.photoList.selectEnable = true;
            this.m_currView.photoList.mouseHandler = new Laya.Handler(this, this.onSelect);
            this.m_currView.photoList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.OnRefreshView();
        }
        OnRefreshView() {
            this.year = "";
            this.onChooseYear("year80");
        }
        onBreak() {
            rab.UIManager.onHideView(ViewConfig.gameView.PhotoWall);
            rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
        }
        onChooseYear(data) {
            if (data == this.year) {
                return;
            }
            this.year = data;
            for (let index = 1; index < this.m_currView.list.numChildren; index++) {
                let button = this.m_currView.list.getChildAt(index);
                button.visible = false;
                if (button.name.indexOf(this.year) != -1 && button.name.indexOf("Gary") == -1) {
                    button.visible = true;
                }
                else if (button.name.indexOf(this.year) == -1 && button.name.indexOf("Gary") != -1) {
                    button.visible = true;
                }
            }
            let array = [];
            for (let m = 0; m < 12; m++) {
                array.push("");
            }
            this.m_currView.photoList.array = array;
            this.m_currView.photoList.scrollTo(0);
        }
        updateItem(cell, index) {
            let bool = false;
            if (index < this.myManager.gameInfo.photo[this.year]) {
                bool = true;
            }
            if (index >= 11) {
                cell.getChildAt(0).visible = false;
            }
            if (bool == true) {
                cell.getChildAt(0).getChildAt(0).skin = "new/com/Photo/pic_0" + (index + 1) + ".png";
            }
            else {
                cell.getChildAt(0).getChildAt(0).skin = "new/com/zhaopian X.png";
            }
        }
        onSelect(e, index) {
            if (this.m_currView.bigPhoto.visible)
                return;
            let bool = false;
            if (index < this.myManager.gameInfo.photo[this.year]) {
                bool = true;
            }
            if (bool == true) {
                this.m_currView.cover.visible = true;
                this.m_currView.cover.alpha = 0.5;
                this.m_currView.bigPhoto.visible = true;
                this.m_currView.bigPhoto.alpha = 1;
                this.m_currView.bigPhoto.skin = "new/com/Photo/pic_0" + (index + 1) + "_b.png";
                Tool.instance.winowAniamtion(this.m_currView.bigPhoto, 0.5);
            }
        }
    }

    class ViewConfig {
        constructor() {
            rab.RabViewConfig.regClass("SceneLoading", SceneLoading);
            rab.RabViewConfig.regClass("PlatformView", Platform);
            rab.RabViewConfig.regClass("PendantView", Pendant);
            rab.RabViewConfig.regClass("GameView", Game);
            rab.RabViewConfig.regClass("PauseView", Pause);
            rab.RabViewConfig.regClass("GameWinView", GameWin);
            rab.RabViewConfig.regClass("GameFailView", GameFail);
            rab.RabViewConfig.regClass("GetTicketView", GetTicket);
            rab.RabViewConfig.regClass("GameSetView", GameSet);
            rab.RabViewConfig.regClass("NotClick", NotClick);
            rab.RabViewConfig.regClass("RoleSelect", RoleSelect);
            rab.RabViewConfig.regClass("Rank", Rank);
            rab.RabViewConfig.regClass("PhotoWall", PhotoWall);
        }
    }
    ViewConfig.gameView = {
        SceneLoading: "SceneLoading",
        PlatformView: "PlatformView",
        PendantView: "PendantView",
        GameView: "GameView",
        PauseView: "PauseView",
        GameWinView: "GameWinView",
        GameFailView: "GameFailView",
        GetTicketView: "GetTicketView",
        GameSetView: "GameSetView",
        NotClick: "NotClick",
        RoleSelect: "RoleSelect",
        Rank: "Rank",
        PhotoWall: "PhotoWall"
    };

    class Engine extends rab.RabObj {
        onInit() {
            new ViewConfig();
            CurveBlinnPhong.initShader();
            rab.UIManager.onCreateView(ViewConfig.gameView.SceneLoading);
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(750, 1334);
            else
                Laya.init(750, 1334, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            Laya.Stat.show();
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            let value = Laya.LocalStorage.getItem("version");
            let currentVersion = "0";
            if (value !== currentVersion) {
            }
            console.log("===初始引擎=======");
            new Engine();
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map
