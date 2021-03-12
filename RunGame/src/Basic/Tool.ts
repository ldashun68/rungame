import rab from "../rab/rab";
import BasicDictionary from "./BasicDictionary";


/**
 * 工具类
 */
export default class Tool {

    /**单例对象 */
    private static _instance: Tool;
    /**能否打印 */
    public allow_Log: boolean = true;
    /**能否测试 */
    public allow_test: boolean = false;
    /**屏幕缩放 */
    public widgetX: number = 1;
    public widgetY: number = 1;
    /**标签 */
    public lable: Laya.Label;
    /**手机帧率 */
    public phoneFrame: number = 60;
    /**引擎帧率 */
    public frameRate: string = Laya.Stage.FRAME_FAST;
    /**缓动列表 */
    public tweenList: Array<BasicDictionary<Laya.Tween>>;
    /**缓动类型 */
    public tweenType = {
        /**移动 */
        move: "move",
        /**缩放 */
        scale: "scale",
        /**旋转 */
        rotation: "rotation"
    }
    /**记载3D场景 */
    public loadScene3D: boolean = false;

    constructor () {
        this.tweenList = new Array<BasicDictionary<Laya.Tween>>();
        this.tweenList[this.tweenType.move]  = new BasicDictionary<Laya.Tween>();
        this.tweenList[this.tweenType.scale]  = new BasicDictionary<Laya.Tween>();
        this.tweenList[this.tweenType.rotation]  = new BasicDictionary<Laya.Tween>();

        this.widgetX = Laya.stage.width/750;
        this.widgetY = Laya.stage.height/1334;

        this.lable = new Laya.Label();
        Laya.stage.addChild(this.lable);
        this.lable.pos(Laya.stage.width*0.1, Laya.stage.height*0.2);
        this.lable.width = Laya.stage.width*0.8;
        this.lable.wordWrap = true;
        this.lable.color = "#ffffff";
        this.lable.fontSize = 50;
        this.lable.zOrder = 10000;
    }

    /**获得“单例”对象 */
    public static get instance (): Tool {
        if (this._instance == null) {
            this._instance = new Tool();
        }
        return this._instance;
    }

    /**打印 */
    public log (...value: any): void {
        if (this.allow_Log == true) {
            console.log(value);
        }
    }

    /**是否为iphoneX 类型 */
    public isIPhoneX (): boolean {
        if (Laya.stage.width*2 < Laya.stage.height) {
            return true;
        }
        return false;
    }

    /**性能优化 */
    public performanceOptimization (info: any): void {
        if (info.systemInfo.system.indexOf("iOS") != -1) {
            for (let index: number = 5; index < 12; index++) {
                if (info.systemInfo.model.indexOf("iPhone "+index) != -1) {
                    if (index < 10) {
                        this.phoneFrame = 45;
                        this.frameRate = Laya.Stage.FRAME_SLOW;
                        return;
                    }
                }
            }
        }
    }

    /**
     * 钳制
     * @param min 最小值
     * @param max 最大值
     * @param value 当前值
     */
    public clamp (min: number, max: number, current: number): number {
        if (current < min || current > max) {
            return (current < min) ? min:max;
        }
        return current;
    }

    /**
     * 获得随机列表
     * @param maxRandom 最大随机值
     * @param count 需要几个随机数
     */
    public getRandomList_1 (maxRandom: number, count: number): Array<number> {
        let list: Array<number> = [];
        let temp: Array<number> = [];

        for (let index: number = 0; index < maxRandom; index++) {
            temp.push(index);
        }

        for (let index: number = 0; index < count; index++) {
            let random: number = parseInt(""+(Math.random()*(temp.length-0.1)));
            list.push(temp[random]);
            temp.splice(random, 1);
        }
        return list;
    }

    /**
     * 获得随机列表
     * @param traget 列表
     * @param count 需要几个随机数
     */
    public getRandomList_2 (traget: Array<any>, count: number): Array<any> {
        let list: Array<any> = [];
        let temp: Array<any> = [];
        let index: number = 0;

        for (let i in traget) {
            temp.push(index);
            index++;
        }

        for (let i: number = 0; i < count; i++) {
            let random: number = parseInt(""+(Math.random()*(temp.length-0.1)));
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

    /**获得弧度 */
    public getRadian (angle: number): number {
        return angle * Math.PI / 180;
    }

    /**获得夹角 */
    public getAngle(px: number, py: number, mx: number, my: number): number {
        var x = Math.abs(px-mx);
        var y = Math.abs(py-my);
        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

        if(mx>px&&my>py){//鼠标在第四象限
            angle = 180 - angle;
        }

        if(mx==px&&my>py){//鼠标在y轴负方向上
            angle = 180;
        }

        if(mx>px&&my==py){//鼠标在x轴正方向上
            angle = 90;
        }

        if(mx<px&&my>py){//鼠标在第三象限
            angle = 180+angle;
        }

        if(mx<px&&my==py){//鼠标在x轴负方向
            angle = 270;
        }

        if(mx<px&&my<py){//鼠标在第二象限
            angle = 360 - angle;
        }
        return angle;
    }

    /**
     * 围绕一个物体旋转
     * @param sprite 需要旋转的物体
     * @param center 被环绕的物体
     * @param axis 向上向量
     * @param angle 旋转角度
     */
    public rotateAround(sprite: Laya.Vector3, center: Laya.Vector3, axis: Laya.Vector3, angle: number): Laya.Vector3 {
        let v1: Laya.Vector3 = new Laya.Vector3();
        let v2: Laya.Vector3 = new Laya.Vector3();
        let v3: Laya.Vector3 = new Laya.Vector3();
        let v4: Laya.Quaternion = new Laya.Quaternion();
        let v5: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.add(new Laya.Vector3(), sprite, v1);
        Laya.Vector3.subtract(v1, center, v2);
        Laya.Quaternion.createFromAxisAngle(axis, angle, v4);
        Laya.Vector3.transformQuat(v2, v4, v3);
        Laya.Vector3.add(v3, center, v5);
        return v5;
    }

    /**已知一个向量，一个夹角，求另一个向量 */
    public getVector(v1: Laya.Vector3, v2: Laya.Vector3, angle: number): Laya.Vector3 {
        let quaternion: Laya.Quaternion = new Laya.Quaternion();
        Laya.Quaternion.createFromYawPitchRoll(angle * (Math.PI / 180), 0, 0, quaternion);
        Laya.Vector3.transformQuat(v1, quaternion, v2);
        return v2;
    }

    /**获得世界角度 */
    public getWorldAngle (start: Laya.Vector3, end: Laya.Vector3): number {
        return 360 * (Math.atan2(start.x, start.z) - Math.atan2(end.x, end.z) / (2 * Math.PI));
    }

    /**
     * 两点之间的距离
     * @param point1 1号点
     * @param point2 2号点
     */
    public twoPointDistance (point1: Laya.Vector2, point2: Laya.Vector2): number {
        let v1: Laya.Vector3 = new Laya.Vector3(point1.x, 0, point1.y);
        let v2: Laya.Vector3 = new Laya.Vector3(point2.x, 0, point2.y);
        let distance: number = Laya.Vector3.distance(v1, v2);
        return distance;
    }

    /**
     * 加载3D模型，处理皮肤更换
     * @param name 模型名字
     * @param callback 回调函数
     */
    public loadModel (name: string, callback: Laya.Handler): void {
        let sprite: Laya.Sprite3D = Laya.loader.getRes(name + ".lh");
        if (sprite != null) {
            if (callback != null) {
                callback.runWith(sprite);
            }
        }
        else {
            Laya.loader.create(name + ".lh", Laya.Handler.create(this, (sprite: Laya.Sprite3D): void => {
                if (callback != null) {
                    callback.runWith(sprite);
                }
            }));
        }
    }

    /**
     * 清理3D模型
     * @param name 模型名字
     * @param callback 回调函数
     */
    public clearModel (name: string): void {
        let path: string = "res/3d/prefab/Conventional/";
        Laya.loader.clearRes(path + name + ".lh");
    }

    /**
     * 通过名字从节点中获得Sprite 子节点
     * @param node 节点
     * @param name 子节点名字数组
     */
    public getSpriteByName (node: Laya.Node, name: Array<string>): Laya.Sprite {
        while (name.length > 0) {
            let str: string = name.shift();
            if (str == "") {
                node = node.getChildAt(0);
            }
            else {
                node = node.getChildByName(str);
            }
        }
        return (node as Laya.Sprite);
    }

    /**
     * 通过索引从节点中获得Sprite 子节点
     * @param node 节点
     * @param name 子节点名字数组
     */
    public getSpriteAt (node: Laya.Node, index: Array<number>): Laya.Sprite {
        while (index.length > 0) {
            let str: number = index.shift();
            node = node.getChildAt(str);
        }
        return (node as Laya.Sprite);
    }

    /**
     * 通过名字从节点中获得Sprite3D 子节点
     * @param node 节点
     * @param name 子节点名字数组
     */
    public getSprite3DByName (node: Laya.Node, name: Array<string>): Laya.Sprite3D {
        while (name.length > 0) {
            let str: string = name.shift();
            if (str == "") {
                node = node.getChildAt(0);
            }
            else {
                node = node.getChildByName(str);
            }
        }
        return (node as Laya.Sprite3D);
    }

    /**
     * 通过索引从节点中获得Sprite 子节点
     * @param node 节点
     * @param name 子节点名字数组
     */
    public getSprite3DAt (node: Laya.Node, index: Array<number>): Laya.Sprite3D {
        while (index.length > 0) {
            let str: number = index.shift();
            node = node.getChildAt(str);
        }
        return (node as Laya.Sprite3D);
    }

    /**
     * 同步两个节点的transform
     * @param data 修改数据
     * @param out 节点
     */
    public syncTransform (data: Laya.Sprite3D, out: Laya.Sprite3D): void {
        out.transform.position = data.transform.position;
        out.transform.rotation = data.transform.rotation;
        out.transform.setWorldLossyScale(data.transform.getWorldLossyScale());
    }

    /**
     * 对节点的position 进行赋值修改
     * @param data 修改数据
     * @param out 节点
     * @param isLocal 是否为本地坐标
     */
    public setPosition (data: Laya.Vector3, out: Laya.Sprite3D, isLocal: boolean = false): void {
        if (isLocal == false) {
            out.transform.position = this.getPosition(data, out, isLocal);
        }
        else {
            out.transform.localPosition = this.getPosition(data, out, isLocal);
        }
    }

    /**
     * 基于out 节点的position 进行赋值修改，并返回
     * @param data 修改数据
     * @param out 节点
     * @param isLocal 是否为本地坐标
     */
    public getPosition (data: Laya.Vector3, out: Laya.Sprite3D, isLocal: boolean = false): Laya.Vector3 {
        let position: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
        if (isLocal == false) {
            Laya.Vector3.add(position, out.transform.position, position);
        }
        else {
            Laya.Vector3.add(position, out.transform.localPosition, position);
        }
        position.x = isNaN(data.x)?position.x:data.x;
        position.y = isNaN(data.y)?position.y:data.y;
        position.z = isNaN(data.z)?position.z:data.z;
        return position;
    }

    /**
     * 基于out 节点的position 进行加法修改
     * @param data 修改数据
     * @param out 节点
     */
    public addPosition (data: Laya.Vector3, out: Laya.Sprite3D): void {
        out.transform.position = this.getAddPosition(data, out);
    }

    /**
     * 基于out 节点的position 进行加法修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getAddPosition (data: Laya.Vector3, out: Laya.Sprite3D): Laya.Vector3 {
        let position: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.add(position, out.transform.position, position);
        position.x += data.x;
        position.y += data.y;
        position.z += data.z;
        return position;
    }

    /**
     * 对节点的scale 进行赋值修改
     * @param data 修改数据
     * @param out 节点
     */
    public setScale (data: Laya.Vector3, out: Laya.Sprite3D): void {
        out.transform.setWorldLossyScale(this.getScale(data, out));
    }

    /**
     * 基于out 节点的scale 进行赋值修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getScale (data: Laya.Vector3, out: Laya.Sprite3D): Laya.Vector3 {
        let scale: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.add(scale, out.transform.getWorldLossyScale(), scale);
        scale.x = isNaN(data.x)?scale.x:data.x;
        scale.y = isNaN(data.y)?scale.y:data.y;
        scale.z = isNaN(data.z)?scale.z:data.z;
        return scale;
    }

    /**
     * 基于out 节点的scale 进行加法修改
     * @param data 修改数据
     * @param out 节点
     */
    public addScale (data: Laya.Vector3, out: Laya.Sprite3D): void {
        out.transform.setWorldLossyScale(this.getAddScale(data, out));
    }

    /**
     * 基于out 节点的scale 进行加法修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getAddScale (data: Laya.Vector3, out: Laya.Sprite3D, isLocal: boolean = false): Laya.Vector3 {
        let scale: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
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

    /**
     * 对节点的rotationEuler 进行赋值修改
     * @param data 修改数据
     * @param out 节点
     */
    public setRotationEuler (data: Laya.Vector3, out: Laya.Sprite3D): void {
        out.transform.rotationEuler = this.getRotationEuler(data, out);
    }

    /**
     * 基于out 节点的rotationEuler 进行赋值修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getRotationEuler (data: Laya.Vector3, out: Laya.Sprite3D): Laya.Vector3 {
        let rotation: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.add(rotation, out.transform.rotationEuler, rotation);
        rotation.x = isNaN(data.x)?rotation.x:data.x;
        rotation.y = isNaN(data.y)?rotation.y:data.y;
        rotation.z = isNaN(data.z)?rotation.z:data.z;
        return rotation;
    }

    /**
     * 基于out 节点的rotationEuler 进行加法修改
     * @param data 修改数据
     * @param out 节点
     */
    public addRotationEuler (data: Laya.Vector3, out: Laya.Sprite3D): void {
        out.transform.rotationEuler = this.getAddRotationEuler(data, out);
    }

    /**
     * 基于out 节点的rotationEuler 进行加法修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getAddRotationEuler (data: Laya.Vector3, out: Laya.Sprite3D): Laya.Vector3 {
        let rotation: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
        Laya.Vector3.add(rotation, out.transform.rotationEuler, rotation);
        rotation.x += data.x;
        rotation.y += data.y;
        rotation.z += data.z;
        return rotation;
    }

    /**
     * 对节点的quaternion 进行赋值修改
     * @param data 修改数据
     * @param out 节点
     */
    public setQuaternion (data: Laya.Quaternion, out: Laya.Sprite3D): void {
        out.transform.rotation = this.getQuaternion(data, out);
    }

    /**
     * 基于out 节点的quaternion 进行赋值修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getQuaternion (data: Laya.Quaternion, out: Laya.Sprite3D): Laya.Quaternion {
        let rotation: Laya.Quaternion = new Laya.Quaternion(0, 0, 0, 0);
        Laya.Quaternion.add(rotation, out.transform.rotation, rotation);
        rotation.x = isNaN(data.x)?rotation.x:data.x;
        rotation.y = isNaN(data.y)?rotation.y:data.y;
        rotation.z = isNaN(data.z)?rotation.z:data.z;
        rotation.w = isNaN(data.w)?rotation.w:data.w;
        return rotation;
    }

    /**
     * 基于out 节点的quaternion 进行加法修改
     * @param data 修改数据
     * @param out 节点
     */
    public addQuaternion (data: Laya.Quaternion, out: Laya.Sprite3D): void {
        out.transform.rotation = this.getAddQuaternion(data, out);
    }

    /**
     * 基于out 节点的quaternion 进行加法修改，并返回
     * @param data 修改数据
     * @param out 节点
     */
    public getAddQuaternion (data: Laya.Quaternion, out: Laya.Sprite3D): Laya.Quaternion {
        let rotation: Laya.Quaternion = new Laya.Quaternion(0, 0, 0, 0);
        Laya.Quaternion.add(rotation, out.transform.rotation, rotation);
        rotation.x += data.x;
        rotation.y += data.y;
        rotation.z += data.z;
        rotation.w += data.w;
        return rotation;
    }

    public addButtonAnimation (image: Laya.Sprite, isPlaySound: boolean = true, isScale: boolean = true): void {
        let canClick: boolean = false;
        let onDown = (event: Laya.Event): void => {
            if (isScale == true) {
                image.scaleX = (image.scaleX > 0)? 0.9:-0.9;
                image.scaleY = (image.scaleY > 0)? 0.9:-0.9;
            }
            canClick = true;
            event.stopPropagation();

            if (isPlaySound == true) {
                rab.MusicManager.playSound("res/audio/click.wav");
            }
        };
        let onUp = (event: Laya.Event): void => {
            if (canClick == true) {
                if (isScale == true) {
                    image.scaleX = (image.scaleX > 0)? 1:-1;
                    image.scaleY = (image.scaleY > 0)? 1:-1;
                }
                event.stopPropagation();
            }
            canClick = false;
        };
        let onOut = (event: Laya.Event): void => {
            if (canClick == true) {
                if (isScale == true) {
                    image.scaleX = (image.scaleX > 0)? 1:-1;
                    image.scaleY = (image.scaleY > 0)? 1:-1;
                }
                event.stopPropagation();
            }
            canClick = false;
        };
        image.on(Laya.Event.MOUSE_DOWN, this, onDown);
        image.on(Laya.Event.MOUSE_UP, this, onUp);
        image.on(Laya.Event.MOUSE_OUT, this, onOut);
    }

    public removeButtonAnimation (image: Laya.Sprite): void {
        image.offAll(Laya.Event.MOUSE_DOWN);
        image.offAll(Laya.Event.MOUSE_UP);
        image.offAll(Laya.Event.MOUSE_OUT);
    }

    /**是否在执行缓动动画 */
    public isSprite3DTween (sprite: Laya.Sprite3D): boolean {
        return (this.tweenList[this.tweenType.move].getValueByName(sprite.id) != null) || (this.tweenList[this.tweenType.scale].getValueByName(sprite.id) != null) ||
        (this.tweenList[this.tweenType.rotation].getValueByName(sprite.id) != null);
    }

    /**删除缓动动画 */
    public sprite3DStopTween (sprite: Laya.Sprite3D, type: string = this.tweenType.move): void {
        let stop = (tween: Laya.Tween) => {
            tween.pause();
            tween.clear();
            tween.recover();
        }
        
        for (let index: number = 0; index < this.tweenList[type].length; index++) {
            let tween: Laya.Tween = this.tweenList[type].getValueByName(sprite.id);
            if (tween != null) {
                stop(tween);
                
                this.tweenList[type].removeByName(sprite.id);
                index--;
            }
        }
    }

    /**
     * 缩放动画
     * @param sprite 3D精灵
     * @param props 目标属性
     * @param duration 持续时间
     * @param ease 缓动类型
     * @param completed 完成回调
     * @param progress 每帧回调
     */
    public sprite3DScale(sprite: Laya.Sprite3D, props: Laya.Vector3, duration: number,
        ease?: Function, completed?: Function, progress?: Function) {
        this.sprite3DStopTween(sprite, this.tweenType.scale);
        this.tweenList[this.tweenType.scale].add(sprite.id,
            this.tweenUpdate(sprite, sprite.transform.getWorldLossyScale(), props, duration, ease,
                () => {
                    this.sprite3DStopTween(sprite, this.tweenType.scale);
                    completed && completed();
                },
                (toPos: Laya.Vector3) => {
                    sprite.transform.setWorldLossyScale(toPos);
                    progress && progress();
                }
            )
        );
    }

    /**
     * 移动动画
     * @param sprite 3D精灵
     * @param props 目标属性
     * @param duration 持续时间
     * @param ease 缓动类型
     * @param completed 完成回调
     * @param progress 每帧回调
     */
    public sprite3DMove(sprite: Laya.Sprite3D, props: Laya.Vector3, duration: number,
        ease?: Function, completed?: Function, progress?: Function) {
        this.sprite3DStopTween(sprite, this.tweenType.move);
        this.tweenList[this.tweenType.move].add(sprite.id,
            this.tweenUpdate(sprite, sprite.transform.position, props, duration, ease,
                () => {
                    this.sprite3DStopTween(sprite, this.tweenType.move);
                    completed && completed();
                },
                (toPos: Laya.Vector3) => {
                    sprite.transform.position = toPos;
                    progress && progress();
                }
            )
        );
    }

    /**
     * 旋转动画
     * @param sprite 3D精灵
     * @param props 目标属性
     * @param duration 持续时间
     * @param ease 缓动类型
     * @param completed 完成回调
     * @param progress 每帧回调
     */
    public sprite3DRotation(sprite: Laya.Sprite3D, props: Laya.Vector3, duration: number,
        ease?: Function, completed?: Function, progress?: Function) {
        this.sprite3DStopTween(sprite, this.tweenType.rotation);
        this.tweenList[this.tweenType.rotation].add(sprite.id,
            this.tweenUpdate(sprite, sprite.transform.rotationEuler, props, duration, ease,
                () => {
                    this.sprite3DStopTween(sprite, this.tweenType.rotation);
                    completed && completed();
                },
                (toPos: Laya.Vector3) => {
                    sprite.transform.rotationEuler = toPos;
                    progress && progress();
                }
            )
        );
    }

    /**缓动动画帧循环 */
    private tweenUpdate (sprite: Laya.Sprite3D, initProps: Laya.Vector3, endProps: Laya.Vector3, duration: number,
        ease?: Function, completed?: Function, progress?: Function): Laya.Tween {
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
                if (sprite == null || sprite.destroyed) return;
                v3.x = initProp.x;
                v3.y = initProp.y;
                v3.z = initProp.z;
                progress && progress(v3);
            })
        };
        return Laya.Tween.to(initProp, endProp, duration, ease, new Laya.Handler(this, completed));
    }

    /**
     * 摄像机抖动动画
     * @param cmera 摄像机对象
     * @param currentPos 摄像机当前位置
     * @param min 抖动最小值
     * @param max 抖动最大值
     * @param completed 完成回调函数
     */
    public cmeraShakeAnimation (cmera: Laya.Sprite3D, currentPos: Laya.Vector3, min: number, max: number, completed?: Function): void {
        let shake: number = max;
        let animation = function () {
            if (shake > min) {
                let x: number = Math.random()*shake - shake/2; 
                let y: number = Math.random()*shake - shake/2; 
                let pos: Laya.Vector3 = new Laya.Vector3();
                Laya.Vector3.add(new Laya.Vector3(x, y, 0), currentPos, pos);
                this.setPosition(pos, cmera);
                shake = shake/1.05; 
            }
            else {
                this.setPosition(currentPos, cmera);
                Laya.timer.clear(this, animation);

                completed && completed();
            }
        }
        Laya.timer.clear(this, animation);
        Laya.timer.frameLoop(1, this, animation);
    }

    /**弹窗动画 */
    public winowAniamtion (window: Laya.Sprite, minScale?: number, callback?: Function): void {
        window.scale(minScale, minScale);
        Laya.Tween.clearAll(window);
        Laya.Tween.to(window, {scaleX: 1.05, scaleY: 1.05}, 100, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(window, {scaleX: 1, scaleY: 1}, 50, null, Laya.Handler.create(this, () => {
                callback && callback();
            }));
        }));
    }

    /**闪烁动画 */
    public twinkleAniamtion (sprite: Laya.Sprite): void {
        Laya.Tween.clearAll(sprite);
        sprite.alpha = 0;
        Laya.Tween.to(sprite, { alpha: 0.5 }, 100, null, null, 0);
        Laya.Tween.to(sprite, { alpha: 0.25 }, 100, null, null, 100);
        Laya.Tween.to(sprite, { alpha: 0.5 }, 100, null, null, 200);
        Laya.Tween.to(sprite, { alpha: 0.25 }, 100, null, Laya.Handler.create(this, () => {
            sprite.alpha = 0;
        }), 300);
    }

    /**计算器 */
    public calculator (key: string): number {
        let value: number = 0;
        if ((key[0] == "(" && key[key.length-1] == ")") ||
        (key[0] == "(" && key[key.length-2] == ")")) {
            key = key.replace("(", "");
            key = key.replace(")", "");
        }
        if (key[key.length-1] != "=") {
            key += "=";
        }
        key = key.replace(" ", "");
        
        let index: number = 0;
        let parentheses: string = "";
        while (index != -1) {
            index = key.indexOf("(");
            if (index != -1) {
                parentheses = key.slice(index, key.indexOf(")")+1);
                key = key.replace(parentheses, ""+this.calculator(parentheses));
            }
        }

        let calculat = (s: string) => {
            let a1: number = key.lastIndexOf("+", index-1);
            let b1: number = key.indexOf("*", index+1);
            let c1: number = key.indexOf("+", index+1);
            let d1: number = key.indexOf("=", index+1);

            let a2: string = "";
            let b2: string = "";
            let c2: number = 0;

            if (a1 == -1) {
                a2 = key.substr(0, index);
            }
            else {
                a2 = key.substr(a1+1, index-a1-1);
            }

            if (b1 == -1) {
                if (c1 == -1) {
                    b2 = key.substr(index+1, d1-index-1);
                }
                else {
                    b2 = key.substr(index+1, c1-index-1);
                }
            }
            else {
                b2 = key.substr(index+1, b1-index-1);
            }

            if (s == "*") {
                c2 += parseInt(a2)*parseInt(b2);
            }
            else if (s == "+") {
                c2 += parseInt(a2)+parseInt(b2);
            }

            key = key.replace(a2+s+b2, ""+c2);
        }

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

        value = parseInt(key.substr(0, key.length-1));
        return value;
    }
}