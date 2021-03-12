import BasicDictionary from "../../Basic/BasicDictionary";
import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import { passProp, PlayState, QueueT } from "../GameVO/DataType";
import BuildItem from "../GameVO/GamePool";
import CurveBlinnPhong from "./CurveBlinnPhong";
import ObstacleManager from "./ObstacleManager";
import PlayerManager from "./PlayerManager";

/**
 * 战斗管理器组件
 */
export default class FightManager extends rab.GameObject {
    
    public view: ui.view.GameUI;
    /**3D场景 */
    private scene3D: Laya.Scene3D;
    /**摄像机 */
    // private camera: Laya.Camera;
    /**地图数据 */
    private passData:passProp;
    /**基地 */
    private manager: GameController
    /**玩家管理器组件 */
    private playerManager: PlayerManager;
    /**障碍物 */
    private obstacleManager:ObstacleManager;
    /**基础资源 */
    private _basebuilds:Map<number,Laya.Sprite3D> = new Map<number,Laya.Sprite3D>();

    /**当前路的长度 */
    private _currLenght:number;
    /**是否开始跑了 */
    private isStart: boolean;
    /**当前显示的建筑物 */
    private builds:Array<BuildItem> = new Array<BuildItem>();
    /**当前角色位置 */
    /**相机初始位置 */
    // private camerapos:Laya.Vector3;
    /**生命大小 */
    private max_lifeCount:number;
    /**当前生命值 */
    private currlife:number;
    private winLenght:number = 50;

    constructor () {
        super();
    }

    onInit(): void {
        // this._basebuilds.clear();
        // this.AddListenerMessage(GameNotity.GameMessage_GameStart, this.onGameStart);
        this.AddListenerMessage(GameNotity.GameMessage_PauseGame, this.onGamePause);
        this.AddListenerMessage(GameNotity.GameMessage_GameContinue, this.onGameContinue);
        this.AddListenerMessage(GameNotity.Game_RemoveScene,this.onReMoveScene)
        this.AddListenerMessage(GameNotity.Game_TriggerEnter,this.onGameTriggerEnter);
        this.AddListenerMessage(GameNotity.GameMessage_Revive,this.onGameRevive)
        this.AddListenerMessage(GameNotity.GameMessage_ReGameStart,this.onGameReStart)
    }
    
    /**初始化 */
    public init (): void {
        this.max_lifeCount = 3;
        this.scene3D = this.owner as Laya.Scene3D;
        // this.camera = this.scene3D.getChildByName("Main Camera") as Laya.Camera;
        // this.camerapos = new Laya.Vector3(0,4,-2);
        // this.camera.transform.localRotationEulerX = 14;
        this.scene3D.enableFog = true;
        //设置雾化的颜色 65,138,229
        this.scene3D.fogColor = new Laya.Vector3(0.25,0.55,0.9);
        //设置雾化的起始位置，相对于相机的距离
        this.scene3D.fogStart = 7;
        //设置雾化最浓处的距离。
        this.scene3D.fogRange = 50;
        this.playerManager = this.scene3D.addComponent(PlayerManager);
        this.playerManager.view = this.view;
        this.playerManager.init();
        this.obstacleManager = this.scene3D.addComponent(ObstacleManager);
        this.obstacleManager.init();
    }

    /**
     * 初始化场景
     */
    private onInitScene()
    {
        Laya.timer.resume();
        this.max_lifeCount = 3;
        for(var i = 0;i<this.builds.length;i++)
        {
            this.builds[i].recover();
        }
        this.builds = [];
        this._currLenght = 0;
        this.obstacleManager.onClearAll();
        for(var i = 0;i<10;i++)
        {
            this.oncreateNextBuild();
        }

        Laya.loader.create(["3d/prefab/Conventional/road.lh", "new/com/beijing.png"], Laya.Handler.create(this, () => {
            let road = this.instantiate(Laya.loader.getRes("3d/prefab/Conventional/road.lh"));
            this.scene3D.addChild(road);
            road.transform.position = new Laya.Vector3(0, 4, this.passData.length/2);
            road.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 100));
            road.getComponent(Laya.PhysicsCollider).collisionGroup = 10;

            let mat: CurveBlinnPhong = new CurveBlinnPhong();
            mat.mainTex = Laya.loader.getRes("new/com/beijing.png");
            mat.xoffset = 30;
            mat.yoffset = -30;
            mat.zdistance = 200;
            (road as Laya.MeshSprite3D).meshRenderer.sharedMaterial = mat;
        }));
    }

    /**准备战斗 */
    public fightReady (): void {
        this.scene3D.active = true;
        this.currlife = this.max_lifeCount;
        this.onLifeUpdate();
        this.isStart = false;
        this.playerManager.fightReady();
        this.manager = rab.RabGameManager.getInterest().getMyManager();
        this.passData = this.manager.CurrPassData();
        this.manager.fightGetCoin =0;
        this.updatePassProgressNode();
        let arr = this.manager.getPassBuild();
        for(var i = 0;i<this.passData.builds.length;i++)
        {
            this._basebuilds[this.passData.builds[i]]= Laya.loader.getRes("3d/build/Conventional/"+this.manager.getBuild(this.passData.builds[i]).res+".lh");
        }
        this.onInitScene();
        this.SendMessage(GameNotity.GameMessage_GameStart);
    }

    /**开始战斗 */
    public onGameStart (): void {
        this.scene3D.active = true;
        if(!this.isStart)
        {
            console.log("开始跑了");
            this.currlife = this.max_lifeCount;
            this.onLifeUpdate();
            this.isStart = true;
            this.playerManager.onGameStart();
            this.updatePassProgressNode();
        }
    }

    /**退出战斗 */
    public onGamewin (): void {
        this.isStart = false;
        this.manager.gameInfo.score += this.manager.CurrPassData().score;
        this.manager.onNextPass();
        this.playerManager.onhappydance();
        Laya.timer.once(2000, this, () => {
            rab.UIManager.onCreateView(ViewConfig.gameView.GameWinView);
        });
    }

    /**暂停战斗 */
    public onGamePause (): void {
        this.isStart = false;
        Laya.timer.pause();
    }

    /**继续战斗 */
    public onGameContinue (): void {
        this.isStart = true;
        Laya.timer.resume();
    }

    /**战斗结算 */
    public fightProfit (): void {
        Laya.timer.clearAll(this);
    }

    onUpdate (): void {
        if (this.isStart == true) {
            // this.fight();
            this.playerManager.update();
            this.updatePassProgressNode()
            this.onCreateBuild();
        }
    }
    /**
     * 动态加载
     */
    onCreateBuild()
    {
        if(this._currLenght - this.playerManager.worldDistance <= 90)
        {
            if(this._currLenght <= this.passData.length)
            {
                this.manager.fightGetCoin += 1;
                this.oncreateNextBuild();
            }
        }
        //TODO:到终点了做个动画就打开结算界面吧
        if(this.playerManager.worldDistance > this.passData.length-this.winLenght)
        {
            this.onGamewin();
        }
        //TODO:超出的回收了
        if(this.playerManager.worldDistance < this.passData.length-15)
        {
            if(this.playerManager.worldDistance > this.builds[0].PosZ)
            {
                this.builds.shift().recover();
            }
        }
    }

    /**角色碰到东西了 */
    onGameTriggerEnter(data:Array<any>)
    {
        if(this.isStart)
        {
            //TODO:这里还要判断一下如果是向上跳了或向下滑了的话碰到也不能算失败
            if(this.playerManager._playState == PlayState.jump)
            {
                if(data[0] == 1)
                {
                    //TODO:过了
                }else{
                    this.currlife -=1;
                    this.onLifeUpdate();
                    if(this.currlife == 0)
                    {
                        this.onGameFail();
                    }
                    
                }
            }else if(this.playerManager._playState == PlayState.slide)
            {
                if(data[1] == 1)
                {
                    //TODO:过了
                }else{
                    this.currlife -= 1;
                    this.onLifeUpdate();
                    if(this.currlife == 0)
                    {
                        this.onGameFail();
                    }
                }
            }else{
                this.currlife -=1;
                this.onLifeUpdate();
                if(this.currlife == 0) {
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

    /**复活 */
    onGameRevive() {
        if(!this.isStart) {
            this.isStart = true;
            this.playerManager.revive();
            rab.UIManager.onCloseView(ViewConfig.gameView.GameFailView);
            this.currlife = this.max_lifeCount;
            this.onLifeUpdate();
        }
    }

    /**
     * 重新开始
     */
    onGameReStart() {
        if(!this.isStart) {
            // this.isStart = true;
            Laya.timer.resume();
            this.currlife = this.max_lifeCount;
            this.onLifeUpdate();
            console.log("重新开始");
            this.onInitScene();
            this.playerManager.reStart();
            this.updatePassProgressNode();
            Laya.timer.once(300, this, () => {
                this.SendMessage(GameNotity.GameMessage_GameStart)
            });
            
            rab.UIManager.onCloseView(ViewConfig.gameView.GameFailView);
        }else{
            console.log("已经重新开始");
        }
    }

    /**回收场景了 */
    onReMoveScene() {
        console.log("回收场景了");
        for(var i = 0;i<this.builds.length;i++) {
            this.builds[i].recover();
        }
        this.builds = [];
        this.obstacleManager.onClearAll();
        for(var i =0;i<this.passData.builds.length;i++) {
            Laya.Pool.clearBySign("build_"+this.passData.builds[i]);
            this._basebuilds[this.passData.builds[i]].destroy();
        }
        this._basebuilds.clear();
        this.builds = [];
        this.playerManager.fightExit();
        rab.UIManager.onHideView(ViewConfig.gameView.GameView);
    }

    /**创建下一个建筑物 */
    private oncreateNextBuild():Laya.Sprite3D {
        let buildID = this.passData.builds[Math.floor(Math.random()*this.passData.builds.length)];
        let build:Laya.Sprite3D = Laya.Pool.getItem("build_"+buildID);
        let buildProp:BuildItem;
        if(!build) {
            build = this.instantiate(this._basebuilds[buildID],null,false,new Laya.Vector3(0, 0, this._currLenght));
            buildProp = build.addComponent(BuildItem);
        }
        else {
            build.transform.localPositionZ = this._currLenght;
            buildProp = build.getComponent(BuildItem);
        }
        console.log("buildID:",this._currLenght);
        this.scene3D.addChild(build);
        this.builds.push(buildProp);
        buildProp.onInitProp(this.manager.getBuild(buildID),this._currLenght);
        this._currLenght += this.manager.getBuild(buildID).length;
        if(this._currLenght > 20 && this._currLenght < this.passData.length-this.winLenght) {
            this.obstacleManager.onCreateobstacle(this.manager.getBuild(buildID), build.transform.position.z);
        }

        return build;
    }

    /**更新关卡进度节点 */
    private updatePassProgressNode (): void {
        this.view.progress_t.x = 2+(this.playerManager.worldDistance/(this.passData.length-this.winLenght)*(this.view.progress_t.width));
        this.view.coinText.value = ""+this.manager.fightGetCoin;
        this.view.iconNode.x = this.view.progress_t.x-13;
    }

    /**设置生命值 */
    private onLifeUpdate() {
        this.view.lifeText.value = this.currlife+"";
        this.view.life_bg.width = (this.currlife/this.max_lifeCount)*290;
    }
}