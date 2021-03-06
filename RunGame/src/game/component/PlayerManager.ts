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
    /**天空盒 */
    private skyBox: Laya.Sprite3D;
    private manager: GameController;
    private playNode: Laya.Sprite3D;
    /**摄像机 */
    private camera: Laya.Camera;
    /**相机初始位置 */
    private camerapos:Laya.Vector3;
    private isMoveing:boolean = false;
    private localx = 0;
    private animator: Laya.Animator;
    private _playerPivot:Laya.Sprite3D;
    private _characterSlot:Laya.Sprite3D;
    public _playState:PlayState

    public jumpLength:number = 2;     // Distance jumped
	public jumpHeight:number = 1.2;
    public slideLength:number = 4;
    public m_JumpStart:number = 0;
    public m_SlideStart:number = 0;
    public minSpeed = 8.0;
    public maxSpeed = 15.0;
    public m_Speed:number;
    public worldDistance:number = 0;
    private model:Laya.SkinnedMeshSprite3D;
    private _playmaterial:Laya.UnlitMaterial;
    private currentAnimation: string;
    private retrogression: number = 0;
    private nextAction: any;

    constructor () {
        super();
    }

    onInit(): void {
        this.minSpeed = this.manager.jsonConfig.getConfig("player").minSpeed;
        this.maxSpeed = this.manager.jsonConfig.getConfig("player").maxSpeed;
        
        // this.AddListenerMessage(GameNotity.GameMessage_GameStart, this.onGameStart);
        this.AddListenerMessage(GameNotity.Game_UpdateMouseMove,this.onMouseMove);
        this.AddListenerMessage(GameNotity.Game_RoleRetrogression,this.onRoletrogression);
        // this.AddListenerMessage(GameNotity.GameMessage_testScene,this.onTestScene);
    }
    
    /**初始化 */
    public init (): void {
        this.isMoveing = false;
        this._playState = PlayState.none;
        this.scene3D = this.owner as Laya.Scene3D;
        this.skyBox = this.scene3D.getChildByName("SkyBox") as Laya.Sprite3D;
        this._playerPivot = <Laya.Sprite3D>this.scene3D.getChildByName("PlayerPivot");
        this._characterSlot = <Laya.Sprite3D>this._playerPivot.getChildByName("CharacterSlot");
        this.camera = this.scene3D.getChildByName("Main Camera") as Laya.Camera;
        this.camerapos = new Laya.Vector3(0,4,-5);
        this.manager = rab.RabGameManager.getInterest().getMyManager();
        // this.fightReady();
    }

    onTestScene()
    {
        if (this.camera != null) {
            console.log("相机" );
            this.camera.transform.localPositionY -= 1;
        }
    }

    /**加载角色 */
    public fightReady (): void {
        console.log("加载角色")
        this._playState = PlayState.init;
        this.isMoveing = false;
        this.localx = 0;
        this.worldDistance = 0;
        this.retrogression = 0;
        this.currentAnimation = "";
        this._playerPivot.transform.position = new Laya.Vector3(0,0,0);
        this.skyBox.transform.setWorldLossyScale(new Laya.Vector3(200, 200, 200));
        Tool.instance.setPosition(new Laya.Vector3(0,0,100), this.skyBox);
        this._playerPivot.addChild(this.camera);
        this.camera.transform.position = this.camerapos;
        this.playNode = Laya.loader.getRes("3d/prefab/Conventional/play_"+this.manager.playSelect+".lh");
        this._characterSlot.addChild(this.playNode);
        if(!this._characterSlot.getComponent(Play)) {
            this._characterSlot.addComponent(Play)
        }
        this._characterSlot.transform.position = new Laya.Vector3(0,0,0);
        this.playNode.transform.position = new Laya.Vector3(0,0,0);
        this.playNode.transform.localScale = new Laya.Vector3(1,1,1);
        this.playNode.transform.localRotationEulerY = 0;
        this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
        this.playAnimation("idle", 0);

        this.model = <Laya.SkinnedMeshSprite3D>this.playNode.getChildAt(0).getChildAt(0);
        if(this.model) {
            if(this.model.skinnedMeshRenderer) {
                this._characterSlot.getComponent(Play).onSetMaterial(<Laya.UnlitMaterial>this.model.skinnedMeshRenderer.material);
                this._characterSlot.getComponent(Play).stopFlash();
            }
        }
    }

    /**开始战斗 */
    public onGameStart (): void {
        this.isMoveing = true;
        this.currentAnimation = "";
        this._playState = PlayState.run;
        this.m_Speed = this.minSpeed;
        this.localx = 0;
        this.playNode.transform.localRotationEulerY = 0;
        this.playAnimation("run",0);
        this._characterSlot.transform.position = new Laya.Vector3(0,0,0);
    }

    /**退出战斗 */
    public fightExit (): void {
        this._characterSlot.getComponent(Play).stopFlash();
        this._playState = PlayState.death;
        this.isMoveing = false;
        this._characterSlot.removeChild(this.playNode);
        this._playerPivot.transform.position = new Laya.Vector3(0,0,0);
        this.scene3D.addChild(this.camera);
        this.camera.transform.position = this.camerapos
    }

    /**跳舞 */
    public onhappydance() {
        this._characterSlot.getComponent(Play).stopFlash();
        this.isMoveing = false;
        this._playState = PlayState.stop;
        this.playNode.transform.localRotationEulerY = 180;
        this.playAnimation("happydance",0.2);
    }

    public Ondeath() {
        this._playState = PlayState.death;
        this.isMoveing = false;

        Laya.timer.frameLoop(1, this, this.update);
    }

    /**复活 */
    public revive (): void {
        this.setPlayState(PlayState.run);
        this.playAnimation("run",0);
        this.isMoveing = true;
    }

    /**
     * 重新开始
     */
    public reStart() {
        this.skyBox.transform.setWorldLossyScale(new Laya.Vector3(200, 200, 200));
        Tool.instance.setPosition(new Laya.Vector3(0,0,100), this.skyBox);
        this._playerPivot.transform.position = new Laya.Vector3(0,0,0);
        this._playerPivot.addChild(this.camera);
        this.camera.transform.position = this.camerapos
        this.playAnimation("idle", 0);
        this._characterSlot.transform.position = new Laya.Vector3(0,0,0);
        this.worldDistance = 0;
        this.retrogression = 0;
    }
   
    public update (): void {
        let scaledSpeed = this.m_Speed * 0.02;
        let pos = this._playerPivot.transform.position;
        if (this.retrogression < 0.1) {
            if (this._playState == PlayState.death) {
                this._characterSlot.getComponent(Play).stopFlash();
                this.playAnimation("death",0.2);
                Laya.timer.clear(this, this.update);
                return;
            }
            else {
                pos.z += scaledSpeed;
                this.worldDistance += scaledSpeed;
                Tool.instance.addPosition(new Laya.Vector3(0,0,scaledSpeed), this.skyBox);
            }
        }
        else {
            pos.z -= scaledSpeed;
            this.worldDistance -= scaledSpeed;
            Tool.instance.addPosition(new Laya.Vector3(0,0,-scaledSpeed), this.skyBox);
            this.retrogression *= 0.9;
        }
        this._playerPivot.transform.position = pos;
        Tool.instance.addRotationEuler(new Laya.Vector3(0,1/60,0), this.skyBox);

        if(this._playState == PlayState.jump) {
            let correctJumpLength = this.jumpLength * (1.0 + this.speedRatio);
            let ratio = (this.worldDistance - this.m_JumpStart) / correctJumpLength;
            if (ratio >= 1) {
                this.playAnimation("run",0);
                this.setPlayState(PlayState.run);
            }
            else {
                this._characterSlot.transform.localPositionY = Math.sin(ratio * Math.PI) * this.jumpHeight;
                console.log("localPositionY:",this._characterSlot.transform.localPositionY )
            }
        }
        else if(this._playState == PlayState.slide){
            let correctSlideLength = this.slideLength * (1.0 + this.speedRatio);
			let ratio = (this.worldDistance - this.m_SlideStart) / correctSlideLength;
			if (ratio >= 1.0) {
                this.playAnimation("run",0);
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

    private onRoletrogression (): void {
        this.retrogression = 0.5;
    }

    private get speedRatio() {  return (this.m_Speed - this.minSpeed) / (this.maxSpeed - this.minSpeed);}

    private onMouseMove(data:Array<any>)
    {
        if(!this.isMoveing) {
            return;
        }
        
        if(this._playState != PlayState.run) {
            this.nextAction = data;
            return;
        }

        let speed: number = 1;
        if (this.manager.playSelect > 2) {
            speed = 0.8;
        }

        if(data[0] == 0) {
            if(this.localx< 1.25) {
                this.setPlayState(PlayState.right);
                // Laya.Tween.clearTween(this._characterSlot.transform);
                this.localx += 1.25;
                // Tool.instance.sprite3DMove(this._characterSlot,new Laya.Vector3(this.localx,0,0),200)
                Laya.Tween.to(this._characterSlot.transform,{localPositionX:this.localx},400*speed,null,Laya.Handler.create(this, () => {
                    this.playAnimation("run",0.2,speed);
                    this.setPlayState(PlayState.run);
                    if (this.nextAction != null) {
                        this.onMouseMove(this.nextAction);
                        this.nextAction = null;
                    }
                }));
                this.playAnimation("left",0,speed);
            }
        }
        else if(data[0] == 1) {
            if(this.localx > -1.25) {
                this.setPlayState(PlayState.left);
                // Laya.Tween.clearTween(this._characterSlot.transform);
                this.localx -= 1.25;
                // Tool.instance.sprite3DMove(this._characterSlot,new Laya.Vector3(this.localx,0,0),200)
                Laya.Tween.to(this._characterSlot.transform,{localPositionX:this.localx},400*speed,null,Laya.Handler.create(this, () => {
                    this.playAnimation("run",0.2,speed);
                    this.setPlayState(PlayState.run);
                    if (this.nextAction != null) {
                        this.onMouseMove(this.nextAction);
                        this.nextAction = null;
                    }
                }));
                this.playAnimation("right",0,speed);
            }
        }
        else if(data[0] == 2) {
            this.setPlayState(PlayState.jump);
            this.m_JumpStart = this.worldDistance;
            this.playAnimation("jump",0,speed);
        }
        else if(data[0] == 3) {
            this.setPlayState(PlayState.slide);
            this.m_SlideStart = this.worldDistance;
            this.playAnimation("slide",0,speed);
        }
    }

    public static MoveTowards(current:Laya.Vector3, target:Laya.Vector3,maxDistanceDelta:number):Laya.Vector3
    {
        let num:number = target.x - current.x;
        let num2:number = target.y - current.y;
        let num3 :number= target.z - current.z;
        let num4 :number= num * num + num2 * num2 + num3 * num3;
        if (num4 == 0 || (maxDistanceDelta >= 0 && num4 <= maxDistanceDelta * maxDistanceDelta)) {
            return target;
        }
        let num5:number = Math.sqrt(num4);
        return new Laya.Vector3(current.x + num / num5 * maxDistanceDelta, current.y + num2 / num5 * maxDistanceDelta, current.z + num3 / num5 * maxDistanceDelta);
    }

    private playAnimation (name: string, transitionDuration: number, speed: number = 1): void {
        if(this.animator == null || this.currentAnimation == name || this.currentAnimation == "happydance" || this.currentAnimation == "death") {
            return;
        }
        this.currentAnimation = name;
        this.animator.crossFade(name, transitionDuration);
        this.animator.speed = speed;
    }

    private setPlayState (state: PlayState) {
        if (this._playState == PlayState.death || this._playState == PlayState.stop){
            return;
        }

        this._playState = state;
    }
}