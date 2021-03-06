import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";

/**
 * 胜利界面
 */
export default class GameWin extends rab.RabView {

    protected m_currView: ui.view.GameWinUI;

    private scene3D: Laya.Scene3D;
    private camera: Laya.Camera;
    private playNode: Laya.Sprite3D;
    private boxNode: Laya.Sprite3D;
    private animator: Laya.Animator;
    protected myManager:GameController;

    private ray:Laya.Ray = new Laya.Ray(new Laya.Vector3(0,0,0),new Laya.Vector3(0,0,0));
    private point: Laya.Vector2 = new Laya.Vector2();
    private _outHitResult:Laya.HitResult = new Laya.HitResult();
    private posX:number;
    private posY:number;

    protected LoadView() {
        this.create<ui.view.GameWinUI>(ui.view.GameWinUI);
        this._bannerPos = "GameWin";
    }

    protected InitView() {
        this.m_currView.winNode.y += (Laya.stage.height-1334)/2;

        this.m_currView.next.on(Laya.Event.CLICK, this, this.onNext);
        Tool.instance.addButtonAnimation(this.m_currView.next);

        this.m_currView.homeBtn.on(Laya.Event.CLICK, this, this.onHome);
        Tool.instance.addButtonAnimation(this.m_currView.homeBtn);

        this.m_currView.share.on(Laya.Event.CLICK, this, this.onShare);
        Tool.instance.addButtonAnimation(this.m_currView.share);

        this.m_currView.cover.on(Laya.Event.CLICK, this, () => {
            if (this.m_currView.bigPhoto.scaleX == 1 && this.m_currView.bigPhoto.alpha == 1) {
                Laya.Tween.clearAll(this.m_currView.bigPhoto);
                Laya.Tween.to(this.m_currView.bigPhoto, { alpha:0 }, 1000, Laya.Ease.quadInOut);
                Laya.Tween.clearAll(this.m_currView.cover);
                Laya.Tween.to(this.m_currView.cover, {}, 850, null, Laya.Handler.create(this, () => {
                    this.m_currView.cover.visible = false;
                    this.m_currView.bigPhoto.visible = false;
                    this.m_currView.bigPhoto.skin = null;
                }));
            }
        });

        this.m_currView.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

        this.OnRefreshView();
    }

    protected OnRefreshView() {
        this.create3DScene();
    }

    private create3DScene() {
        this.myManager.scene3D.active = false;
        //添加3D场景
        this.scene3D = this.m_currView.cloudNode.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        //添加照相机
        this.camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(0, 1, 0));
        this.camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
        //camera.clearFlag = 3;
        //添加方向光
        var directionLight: Laya.DirectionLight = this.scene3D.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        //添加自定义模型
        this.playNode = Laya.Sprite3D.instantiate(Laya.loader.getRes("3d/prefab/Conventional/play_"+this.myManager.playSelect+".lh"), this.scene3D),true,new Laya.Vector3(0,0,2);
        this.playNode.transform.localPosition = new Laya.Vector3(0,-0.1,-3);
        this.playNode.transform.localRotationEulerX = 0;
        this.playNode.active = true;

        Laya.timer.frameLoop(1,this,this.onUpdate);

        this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
        this.animator.play("happydance");
        Laya.timer.frameLoop(180, this.animator, () => {
            this.animator.play("idle")
            this.animator.play("happydance");
        }, null, false);

        this.boxNode = Laya.Sprite3D.instantiate(Laya.loader.getRes("3d/prefab/Conventional/box.lh"), this.scene3D),true,new Laya.Vector3(0,0,2);
        this.boxNode.transform.localPosition = new Laya.Vector3(0,0.3,-2);
        this.boxNode.transform.localRotationEulerX = 0;
        this.boxNode.active = true;
        (this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed = 0;
        this.boxAnimation();

        Laya.timer.once(5000, this, this.openBox);
    }

    public onMouseUp():void
    {
        if ((this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed == 1) {
            return;
        }

        this.posX = this.point.x= Laya.MouseManager.instance.mouseX;
        this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
        this.camera.viewportPointToRay(this.point, this.ray);
        this.scene3D.physicsSimulation.rayCast(this.ray, this._outHitResult);
        if (this._outHitResult.succeeded) {
            if (this._outHitResult.collider.owner.name == "box") {
                this.openBox();
            }
        }
    }

    onUpdate() {
        this.m_currView.eff.rotation += 1;
    }

    protected onShowLanguage() {
        
    }

    private openBox (): void {
        Laya.timer.clear(this, this.openBox);

        Tool.instance.sprite3DStopTween(this.boxNode, Tool.instance.tweenType.rotation);
        (this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed = 1;
        this.boxNode.transform.rotationEuler = new Laya.Vector3();
        Laya.timer.frameOnce(10, this, () => {
            this.boxNode.transform.rotationEuler = new Laya.Vector3();
            this.onwin();
        });
        Laya.timer.frameOnce(60, this, () => {
            this.boxNode.active = false;
        });
    }

    private boxAnimation (): void {
        if ((this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed == 1) {
            return;
        }

        let r1: Laya.Vector3 = Tool.instance.getAddRotationEuler(new Laya.Vector3(0, 0, 15), this.boxNode);
        let r2: Laya.Vector3 = Tool.instance.getAddRotationEuler(new Laya.Vector3(0, 0, -15), this.boxNode);
        let r3: Laya.Vector3 = Tool.instance.getAddRotationEuler(new Laya.Vector3(0, 0, 15), this.boxNode);
        let r4: Laya.Vector3 = Tool.instance.getAddRotationEuler(new Laya.Vector3(), this.boxNode);
        let time: number = 50;

        Tool.instance.sprite3DRotation(this.boxNode, r1, time, null, () => {
            if ((this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed == 1) {
                return;
            }
            Tool.instance.sprite3DRotation(this.boxNode, r2, time*2, null, () => {
                if ((this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed == 1) {
                    return;
                }
                Tool.instance.sprite3DRotation(this.boxNode, r3, time*2, null, () => {
                    if ((this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed == 1) {
                        return;
                    }
                    Tool.instance.sprite3DRotation(this.boxNode, r4, time, null, () => {
                        if ((this.boxNode.getComponent(Laya.Animator) as Laya.Animator).speed == 1) {
                            return;
                        }
                        Laya.timer.once(1000, this, this.boxAnimation);
                    });
                });
            });
        });
    }

    onwin() {
        let index: number = this.myManager.openPhotowall();
        this.m_currView.award.visible = true;

        if (index <= 11) {
            Laya.timer.frameOnce(10, this, () => {
                this.m_currView.cover.visible = true;
                this.m_currView.cover.alpha = 0.5;
                this.m_currView.bigPhoto.visible = true;
                this.m_currView.bigPhoto.alpha = 1;
                this.m_currView.bigPhoto.skin = "new/com/Photo/pic_0" + index + "_b.png";
                Tool.instance.winowAniamtion(this.m_currView.bigPhoto, 0.5);
            });
        }

        let alpha = (sprite: Laya.Sprite, time: number) => {
            sprite.alpha = 0;
            Laya.Tween.to(sprite, {alpha: 1}, time);
        }

        this.m_currView.coinText.value = ""+this.myManager.fightGetCoin;
        this.m_currView.next.visible = true;
        this.m_currView.homeBtn.visible = true;
        this.m_currView.share.visible = true;
        alpha(this.m_currView.next, 200);
        alpha(this.m_currView.homeBtn, 200);
        alpha(this.m_currView.share, 200);
        this.myManager.addCoin(this.myManager.fightGetCoin);

        rab.MusicManager.playMusic("");
        rab.MusicManager.playSound("res/audio/win.mp3");
        this.SendMessage(GameNotity.Game_RemoveScene);
    }

    onHide () {
        this.myManager.scene3D.active = true;
        this.scene3D.removeSelf();
        this.scene3D.destroy();
        this.m_currView.award.visible = false;
        this.m_currView.next.visible = false;
        super.onHide();
    }

    /**返回主页按钮事件 */
    private onHome (): void {
        this.onHide();
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
    }

    private onShare (): void {
        rab.SDKChannel.createShare("win", () => {
            
        });
    }

    /**10倍领取按钮事件 */
    private onNext (): void {
        this.onHide();
        rab.UIManager.onCreateView(ViewConfig.gameView.RoleSelect);
    }
}