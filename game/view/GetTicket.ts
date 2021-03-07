import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";

/**
 * 领取体力界面
 */
export default class GetTicket extends rab.RabView {

    protected m_currView: ui.view.GetTicketUI;

    protected LoadView() {
        this.create<ui.view.GetTicketUI>(ui.view.GetTicketUI);
        this._bannerPos = "GetTicket";
    }

    protected InitView() {
        Laya.timer.once(100, this, () => {
            this.OnRefreshView();
        });

        this.m_currView.zOrder = 12;

        this.m_currView.cover.on(Laya.Event.CLICK, this, this.onHide);
        this.m_currView.closeBtn.on(Laya.Event.CLICK, this, this.onHide);
        Tool.instance.addButtonAnimation(this.m_currView.closeBtn);

        this.m_currView.getTicketBtn.on(Laya.Event.CLICK, this, this.onGetTicket);
        Tool.instance.addButtonAnimation(this.m_currView.getTicketBtn);

        let Templet2:Laya.Templet = new Laya.Templet();
        Templet2.on(Laya.Event.COMPLETE, this, (Templet:Laya.Templet, name: string) => {
            let skeleton: Laya.Skeleton = Templet.buildArmature(1);
            this.m_currView.window.addChild(skeleton);
            skeleton.x = this.m_currView.window.width/2;
            skeleton.y = this.m_currView.window.height/2-30;
            skeleton.stop();
            skeleton.play(name, true);

            let skeleton2: Laya.Skeleton = Templet.buildArmature(1);
            this.m_currView.window.addChild(skeleton2);
            skeleton2.x = this.m_currView.window.width/2;
            skeleton2.y = this.m_currView.window.height/2-30;
            Laya.timer.once(500, this, () => {
                skeleton2.stop();
                skeleton2.play(name, true);
            });
        }, [Templet2, "stars"]);
        Templet2.loadAni("effect/star/effetc_stars.sk");
    }

    protected OnRefreshView() {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        this.m_currView.currentTIcketText.value = manager.gameInfo.ticket+"/"+manager.gameInfo.maxTicket;
        this.m_currView.getTicketText.text = "领取"+manager.getVideoAddTicket()+"点体力";
        this.m_currView.window.visible = true;

        Tool.instance.winowAniamtion(this.m_currView.window);
    }

    /**领取体力按钮 */
    private onGetTicket (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        rab.SDKChannel.stimulate("getTicketWay", ()=>{
            manager.addTicket(manager.getVideoAddTicket());
        });

        this.onHide();
    }
}