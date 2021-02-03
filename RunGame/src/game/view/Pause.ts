import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameNotity from "../GameNotity";

/**
 * 暂停界面
 */
export default class Pause extends rab.RabView {

    protected m_currView: ui.view.PauseUI;

    protected LoadView() {
        this.create<ui.view.PauseUI>(ui.view.PauseUI);
        this._bannerPos = "Pause";
    }

    protected InitView() {
        this.m_currView.zOrder = 12;

        this.m_currView.continueBtn.on(Laya.Event.CLICK, this, this.onContinue);
        Tool.instance.addButtonAnimation(this.m_currView.continueBtn);

        this.m_currView.exitBtn.on(Laya.Event.CLICK, this, this.onDiscontinue);
        Tool.instance.addButtonAnimation(this.m_currView.exitBtn);
    }

    protected OnRefreshView() {
        
    }

    /**继续游戏按钮事件 */
    private onContinue (): void {
        this.SendMessage(GameNotity.GameMessage_GameContinue);
        this.onHide();
    }

    /**中止游戏按钮事件 */
    private onDiscontinue (): void {
        this.onHide();

        rab.UIManager.onHideView(ViewConfig.gameView.GameView);
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
    }
}