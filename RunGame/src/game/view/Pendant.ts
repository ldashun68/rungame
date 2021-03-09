import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";

/**
 * 挂件界面
 */
export default class Pendant extends rab.RabView {

    protected m_currView: ui.view.PendantUI;
    protected myManager: GameController;

    private isLoopAddTicket: boolean;
    private loopAddTicketTimeGap: number;

    protected LoadView() {
        this.create<ui.view.PendantUI>(ui.view.PendantUI);
    }

    protected InitView() {
        if (Tool.instance.isIPhoneX() == true) {
            this.m_currView.coinBox.y += 50;
            this.m_currView.ticketBox.y += 50;
        }

        this.m_currView.zOrder = 10;
        this.m_currView.mouseThrough = true;

        this.m_currView.coinBox.on(Laya.Event.CLICK, this, this.onCoin);
        Tool.instance.addButtonAnimation(this.m_currView.coinBox);

        this.m_currView.ticketBox.on(Laya.Event.CLICK, this, this.onTicket);
        Tool.instance.addButtonAnimation(this.m_currView.ticketBox);

        this.AddListenerMessage(GameNotity.Game_UpdateCoin, this.updateCoin);
        this.AddListenerMessage(GameNotity.Game_UpdateTicket, this.updateTicket);

        this.OnRefreshView();
    }

    protected OnRefreshView() {
        this.isLoopAddTicket = false;
        this.updateCoin();
        this.updateTicket();
    }

    /**金币框按钮事件 */
    private onCoin (): void {
        
    }

    /**体力框按钮事件 */
    private onTicket (): void {
        // if (rab.UIManager.isShowView(ViewConfig.gameView.GetTicketView) == false) {
        //     rab.UIManager.onCreateView(ViewConfig.gameView.GetTicketView);
        // }
    }

    /**更新金币 */
    private updateCoin (): void {
        (this.m_currView.coinBox.getChildByName("text") as Laya.Label).text = ""+rab.Util.formatter(this.myManager.gameInfo.coin);
    }

    /**更新体力 */
    private updateTicket (): void {
        (this.m_currView.ticketBox.getChildByName("text") as Laya.FontClip).value = ""+this.myManager.gameInfo.ticket;

        if (this.myManager.isLoopAddTicket == true && this.isLoopAddTicket == false) {
            this.isLoopAddTicket = true;
            this.loopAddTicketTimeGap = this.myManager.loopAddTicketTimeGap;
            
            this.updateTicketTime();
            Laya.timer.clear(this, this.updateTicketTime);
            Laya.timer.loop(1000, this, this.updateTicketTime);
        }
        else if (this.myManager.isLoopAddTicket == false) {
            this.isLoopAddTicket = false;
            this.loopAddTicketTimeGap = 0;
            (this.m_currView.ticketBox.getChildByName("timeText") as Laya.Label).text = "已满";

            Laya.timer.clear(this, this.updateTicketTime);
        }
    }

    /**更新体力倒计时 */
    private updateTicketTime (): void {
        this.loopAddTicketTimeGap -= 1000;
        if (this.loopAddTicketTimeGap >= 0) {
            if (this.loopAddTicketTimeGap == 0) {
                (this.m_currView.ticketBox.getChildByName("timeText") as Laya.Label).text = "00:00";
                let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
                this.loopAddTicketTimeGap = manager.loopAddTicketTimeGap;
            }
            else {
                (this.m_currView.ticketBox.getChildByName("timeText") as Laya.Label).text = rab.Util.UpdateTime(this.loopAddTicketTimeGap/1000);
            }
        }
    }
}