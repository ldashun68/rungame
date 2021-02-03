import BasicDictionary from "../../Basic/BasicDictionary";
import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import { PlayState } from "../GameVO/DataType";
import Play from "./Play";

/**
 * 玩家管理器组件
 */
export default class PlayerManager extends rab.GameObject {
    
    public view: ui.view.GameUI;
    /**3D场景 */
    private scene3D: Laya.Scene3D;
    private manager: GameController
    private playNode: Laya.Sprite3D;
    /**摄像机 */
    private camera: Laya.Camera;
     /**相机初始位置 */
     private camerapos:Laya.Vector3;
    private startrun:boolean = false;
    private localx = 0;
    private animator: Laya.Animator;
    private animbol:boolean;
    /**是否开始跑了 */
    private isStart: boolean;
    private _playerPivot:Laya.Sprite3D;
    private _characterSlot:Laya.Sprite3D;
    public _playState:PlayState
    

    
    constructor () {
        super();
    }

    onInit(): void {
        this.AddListenerMessage(GameNotity.GameMessage_GameStart, this.onGameStart);
        this.AddListenerMessage(GameNotity.Game_UpdateMouseMove,this.onMouseMove)
    }
    
    /**初始化 */
    public init (): void {
        this.startrun = false;
        this.animbol = false
        this._playState = PlayState.none;
        this.scene3D = this.owner as Laya.Scene3D;
        this._playerPivot = <Laya.Sprite3D>this.scene3D.getChildByName("PlayerPivot");
        this._characterSlot = <Laya.Sprite3D>this._playerPivot.getChildByName("CharacterSlot");
        this.camera = this.scene3D.getChildByName("Main Camera") as Laya.Camera;
        this.camerapos = new Laya.Vector3(0,4,-5);
        this.manager = rab.RabGameManager.getInterest().getMyManager();
        // this.fightReady();
    }

    /**加载角色 */
    public fightReady (): void {
        // this.startAnimation();
        this._playState = PlayState.init;
        console.log("加载角色")
        this.startrun = false;
        this.animbol = false
        this.localx = 0;
        this._playerPivot.transform.position = new Laya.Vector3(0,0,0);
        this._playerPivot.addChild(this.camera);
        this.camera.transform.position = this.camerapos
        this.playNode = Laya.loader.getRes("3d/prefab/Conventional/play_"+this.manager.playSelect+".lh");
        this._characterSlot.addChild(this.playNode);
        if(!this._characterSlot.getComponent(Play))
        {
            this._characterSlot.addComponent(Play)
        }
        this._characterSlot.transform.position = new Laya.Vector3(0,0,0);
        this.playNode.transform.position = new Laya.Vector3(0,0,0);
        this.playNode.transform.localScale = new Laya.Vector3(1,1,1);
        this.playNode.transform.localRotationEulerY = 0;
        this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
        
        if(this.animator)
        {
            this.animator.crossFade('idle',0);
        }
    }

    /**开始战斗 */
    private onGameStart (): void {
        this.startrun = true;
        this._playState = PlayState.run;
        if(this.animator)
        {
            this.animator.crossFade('run',0);
            // this.animator.loop
        }
    }

    /**结束战斗 */
    public fightEnd (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        this._characterSlot.removeChild(this.playNode);
        this._playState = PlayState.death
    }

    /**退出战斗 */
    public fightExit (): void {
        this._playState = PlayState.death
        this.startrun = false;
        this._characterSlot.removeChild(this.playNode);
        // this.playNode.destroy();
        this._playerPivot.transform.position = new Laya.Vector3(0,0,0);
        this.scene3D.addChild(this.camera);
        this.camera.transform.position = this.camerapos
    }

    /**跳舞 */
    public onhappydance()
    {
        this.startrun = false;
        this._playState = PlayState.stop
        if(this.animator)
        {
            this.animator.crossFade('happydance',0);
            // this.animator.loop
        }
        
    }

    public Ondeath()
    {
        this._playState = PlayState.death
        this.startrun = false;
        if(this.animator)
        {
            this.animator.crossFade('death',0);
        }
        
    }

    /**复活 */
    public revive (): void {
        this._playState = PlayState.run
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        if(this.animator)
        {
            this.animator.crossFade('run',0);
        }
        this.startrun = true;
    }

    public reStart()
    {
        this._playState = PlayState.run
        this.startrun = true;
        this._playerPivot.transform.position = new Laya.Vector3(0,0,0);
        this._playerPivot.addChild(this.camera);
        this.camera.transform.position = this.camerapos
        // this._playerPivot.transform.localRotationEulerY = 0;
        if(this.animator)
        {
            this.animator.crossFade('run',0);
        }
    }

    private duration:number =0;
    public update (dt:number): void {
        let pos = this._playerPivot.transform.position;
        pos.z += dt;
        this._playerPivot.transform.position = pos;
        if(this.animator && this.animbol)
        {
            if(this.duration <= 0)
            {
                this.animbol = false
                this.animator.crossFade('run',0);
                this._playState = PlayState.run
            }
            this.duration -=0.02
        }
        // console.log("状态：",this.animator.getControllerLayer(0).getCurrentPlayState().duration);
    }

    private onMouseMove(data:Array<any>)
    {
        if(!this.startrun) return;
        console.log("鼠标方向：",data);
        if(data[0] == 0)
        {
            if(this.localx< 1.25)
            {
                Laya.Tween.clearTween(this._characterSlot.transform);
                this.localx += 1.25;
                Laya.Tween.to(this._characterSlot.transform,{localPositionX:this.localx},200)
            }
            
        }else if(data[0] == 1){
            if(this.localx > -1.25)
            {
                Laya.Tween.clearTween(this._characterSlot.transform);
                this.localx -= 1.25;
                Laya.Tween.to(this._characterSlot.transform,{localPositionX:this.localx},200);
            }
        }else if(data[0] == 2)
        {
            this._playState = PlayState.jump
            if(this.animator)
            {
                // this.duration =0.6
                // this.animbol = true;
                this.animator.crossFade('jump',0.1);
                Laya.Tween.to(this._characterSlot.transform,{localPositionY:1},200,null,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this._characterSlot.transform,{localPositionY:0},200,null,Laya.Handler.create(this,()=>{
                        this._playState = PlayState.run;
                        this.animator.crossFade('run',0);
                    }));
                }));
            }
        }else if(data[0] == 3)
        {
            this._playState = PlayState.slide
            if(this.animator)
            {
                this.duration =0.6
                this.animbol = true;
                this.animator.crossFade('slide',0.1);
            }
        }
    }
    
    // onLateUpdate() {
    //     let pos = this.playNode.transform.position;
    //     pos.z = this.cureentZ;
    //     let camerapos = this.camera.transform.position;
    //     camerapos.z += this.speed;
    //     this.playNode.transform.position = pos;
    //     this.camera.transform.position = camerapos;
    // }
}