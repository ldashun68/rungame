import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameNotity from "../GameNotity";

/**
 * 禁止触摸界面
 */
export default class NotClick extends rab.RabView {

    protected m_currView: ui.view.NotClickUI;

    private templet: Laya.Templet;
    private cloud: Laya.Skeleton;
    private cloudTotal: number;

    protected LoadView() {
        this.create<ui.view.NotClickUI>(ui.view.NotClickUI);
    }

    protected InitView() {
        this.m_currView.zOrder = 10000;

        this.m_currView.click.on(Laya.Event.CLICK, this, null);
        Laya.timer.loop(300, this, () => {
            if (this.m_currView.loadText.text == "加载中.") {
                this.m_currView.loadText.text = "加载中..";
            }
            else if (this.m_currView.loadText.text == "加载中..") {
                this.m_currView.loadText.text = "加载中...";
            }
            else if (this.m_currView.loadText.text == "加载中...") {
                this.m_currView.loadText.text = "加载中.";
            }
        });
        this.AddListenerMessage(GameNotity.Init_Loading, this.initLoading);
        this.OnRefreshView();
    }

    protected OnRefreshView() {
        this.m_currView.bg.visible = true;
        this.m_currView.loadNode.visible = true;
    }

    onHide () {
        super.onHide();
        if (this.cloud != null) {
            this.cloud.destroy(true);
            this.cloud = null;
        }
    }

    private initLoading (): void {
        this.loadCloud();
    }

    loadCloud() {
        let cloud = () => {
            this.cloud = this.templet.buildArmature(1);
            this.m_currView.addChild(this.cloud);
            this.cloud.x = Laya.stage.width/2;
            this.cloud.y = Laya.stage.height/2;
            this.cloudTotal = this.cloud.total;
            this.onHideCloud();
        }

        if (this.templet != null) {
            cloud();
        }
        else {
            this.templet = new Laya.Templet();
            this.templet.on(Laya.Event.COMPLETE, this, (Templet:Laya.Templet, name: string) => {
                cloud();
            }, [this.templet, "animation"]);
            this.templet.loadAni("effect/cloud/effect_yun.sk");
        }
    }
    
    onHideCloud() {
        this.cloud.play("animation", false, true, 0, this.cloudTotal*(1/60)*1000);
        Laya.timer.once(this.cloudTotal*(1/60)*1000, this, () => {
            rab.UIManager.onCreateView(ViewConfig.gameView.GameView);
            rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
            rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onCloseView(ViewConfig.gameView.RoleSelect);
            let resume = () => {
                if (rab.UIManager.isContainView(ViewConfig.gameView.GameView) == true) {
                    this.m_currView.bg.visible = false;
                    this.m_currView.loadNode.visible = false;
                    this.cloud.play("animation", false, true, this.cloudTotal*(1/60)*1000, this.cloudTotal*(1/60)*2000);

                    Laya.timer.clear(this, resume);
                    Laya.timer.once(this.cloudTotal*(1/60)*1000, this, this.onHide, null, false);
                }
            }
            Laya.timer.frameLoop(5, this, resume);
        }, null, false);
    }
}