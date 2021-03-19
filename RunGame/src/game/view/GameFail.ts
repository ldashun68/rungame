import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import Language from "../GameVO/Language";

/**
 * 失败界面
 */
export default class GameFail extends rab.RabView {

    protected m_currView: ui.view.GameFailUI;

    private time: number;
    private scene3D: Laya.Scene3D;
    private playNode: Laya.Sprite3D;
    private animator: Laya.Animator;
    protected myManager:GameController;

    protected LoadView() {
        this.create<ui.view.GameFailUI>(ui.view.GameFailUI);
        this._bannerPos = "GameFail";
    }

    protected InitView() {
        this.m_currView.resrart.on(Laya.Event.CLICK, this, this.onRestar);
        Tool.instance.addButtonAnimation(this.m_currView.resrart);

        this.m_currView.share.on(Laya.Event.CLICK, this, this.onShare);
        Tool.instance.addButtonAnimation(this.m_currView.share);

        this.m_currView.home.on(Laya.Event.CLICK, this, this.onHome);
        Tool.instance.addButtonAnimation(this.m_currView.home);


        this.OnRefreshView();
    }

    protected OnRefreshView() {
        this.time = 3;
        
        this.m_currView.coinText.value = ""+this.myManager.fightGetCoin;
        this.myManager.addCoin(this.myManager.fightGetCoin);

        this.create3DScene();
    }

    private create3DScene()
    {
        this.myManager.scene3D.active = false;
        //添加3D场景
        this.scene3D = this.m_currView.cloudNode.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        //添加照相机
        var camera: Laya.Camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 1, 0));
        camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
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
        // console.log("失败页面创建3D场景");

        this.animator = this.playNode.getChildAt(0).getComponent(Laya.Animator);
        this.animator.play("death");
        Laya.timer.frameLoop(180, this.animator, () => {
            this.animator.play("idle")
            this.animator.play("death");
        }, null, false);
    }

    protected onShowLanguage()
    {
        
    }

    /**重新挑战 */
    private onRestar (): void {
        this.SendMessage(GameNotity.GameMessage_ReGameStart);
    }

    /**分享 */
    private onShare (): void {
        
    }

    /**返回主页按钮事件 */
    private onHome (): void {
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