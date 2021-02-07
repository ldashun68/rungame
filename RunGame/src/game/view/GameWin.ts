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

    protected flagEffect: Laya.Skeleton;

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

        let Templet1:Laya.Templet = new Laya.Templet();
        Templet1.on(Laya.Event.COMPLETE, this, (Templet:Laya.Templet, name: string) => {
            let skeleton: Laya.Skeleton = Templet.buildArmature(1);
            this.m_currView.addChild(skeleton);
            skeleton.x = Laya.stage.width/2;
            skeleton.y = Laya.stage.height/2;
            skeleton.stop();
            skeleton.play(name, true);
        }, [Templet1, "lizi"]);
        Templet1.loadAni("effect/bg/bg_lizi.sk");

        let Templet2:Laya.Templet = new Laya.Templet();
        Templet2.on(Laya.Event.COMPLETE, this, (Templet:Laya.Templet, name: string) => {
            this.flagEffect = Templet.buildArmature(1);
            this.m_currView.addChild(this.flagEffect);
            this.flagEffect.x = Laya.stage.width/2;
            this.flagEffect.y = 500;
            this.flagEffect.stop();
            
            this.OnRefreshView();
        }, [Templet2, "shengli"]);
        Templet2.loadAni("effect/gameWin/shengli.sk");
    }

    protected OnRefreshView() {
        this.flagEffect.play("shengli", false);
        this.flagEffect.visible = true;

        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
       
        
        this.onwin();
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
        super.onHide();
        
        this.flagEffect.stop();
        this.flagEffect.visible = false;

        this.m_currView.award.visible = false;
        this.m_currView.next.visible = false;

        
        // this.SendMessage()
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