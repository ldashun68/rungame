import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import Language from "../GameVO/Language";

/**
 * 胜利界面
 */
export default class GameWin extends rab.RabView {

    protected m_currView: ui.view.GameWinUI;

    private scene3D: Laya.Scene3D;
    private playNode: Laya.Sprite3D;
    protected myManager:GameController;
    // protected flagEffect: Laya.Skeleton;

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
        this.OnRefreshView();
    }

    protected OnRefreshView() {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
       
        this.create3DScene();
        this.onwin();
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
        camera.clearFlag = 3;
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
    }
    onUpdate()
    {
        this.m_currView.eff.rotation += 1;
    }

    protected onShowLanguage()
    {
        // this.m_currView.nextTxt.text = Language.instance.getTxt("win_1");
    }

    onwin()
    {

        this.m_currView.award.visible = true;

        let alpha = (sprite: Laya.Sprite, time: number) => {
            sprite.alpha = 0;
            Laya.Tween.to(sprite, {alpha: 1}, time);
        }

        this.m_currView.next.visible = true;
        this.m_currView.homeBtn.visible = true;
        alpha(this.m_currView.next, 200);
        alpha(this.m_currView.homeBtn, 200);

        rab.MusicManager.playMusic("");
        rab.MusicManager.playSound("sub4/audio/win.mp3");
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
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        manager.addCoin(manager.fightGetCoin);
        this.onHide();
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
    }

    /**10倍领取按钮事件 */
    private onNext (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        this.onHide();
        rab.UIManager.onCreateView(ViewConfig.gameView.RoleSelect);
    }
}