import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";

/**
 * 失败界面
 */
export default class GameFail extends rab.RabView {

    protected m_currView: ui.view.GameFailUI;

    private time: number;
    protected LoadView() {
        this.create<ui.view.GameFailUI>(ui.view.GameFailUI);
        this._bannerPos = "GameFail";
    }

    protected InitView() {
        this.m_currView.resrart.on(Laya.Event.CLICK, this, this.onRestar);
        Tool.instance.addButtonAnimation(this.m_currView.resrart);

        this.m_currView.continue.on(Laya.Event.CLICK, this, this.oncontinue);
        Tool.instance.addButtonAnimation(this.m_currView.continue);

        this.m_currView.home.on(Laya.Event.CLICK, this, this.onHome);
        Tool.instance.addButtonAnimation(this.m_currView.home);


        this.OnRefreshView();

        // this.AddListenerMessage(GameNotity.Game_FightF ail, this.fightFail);
    }

    protected OnRefreshView() {
        this.time = 3;
        // this.m_currView.homeBtn.visible = false;
        // this.m_currView.timeText.visible = true;
        // this.m_currView.timeText.value = ""+this.time;

        Laya.timer.loop(1000, this, this.countDown);
    }

    /**战斗失败 */
    private fightFail (data: any): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        
    }

    /**金币复活按钮事件 */
    private onRestar (): void {
        this.SendMessage(GameNotity.GameMessage_ReGameStart);
    }

    /**视频复活按钮事件 */
    private oncontinue (): void {
        this.SendMessage(GameNotity.GameMessage_Revive);
    }

    /**返回主页按钮事件 */
    private onHome (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        manager.addCoin(manager.fightGetCoin);
        
        this.onHide();
        // rab.UIManager.onHideView(ViewConfig.gameView.GameView);
        this.SendMessage(GameNotity.Game_RemoveScene);
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
    }

    /**倒计时 */
    private countDown() {
        this.time--;
        // this.m_currView.timeText.value = ""+this.time;
        // if (this.time == 0) {
        //     this.m_currView.homeBtn.visible = true;
        //     this.m_currView.timeText.visible = false;

        //     Laya.timer.clear(this, this.countDown);
        // }
    }
}