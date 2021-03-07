import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameNotity from "../GameNotity";

/**
 * 禁止触摸界面
 */
export default class NotClick extends rab.RabView {

    protected m_currView: ui.view.NotClickUI;

    private cloud: Laya.Skeleton;

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
        this.m_currView.bg.visible = false;
        this.m_currView.loadNode.visible = false;
    }

    private initLoading (): void {
        this.loadCloud();
    }

    loadCloud()
    {
        // this.m_currView.bg.visible = false;
        // this.m_currView.loadNode.visible = false;
        let Templet1:Laya.Templet = new Laya.Templet();
            Templet1.on(Laya.Event.COMPLETE, this, (Templet:Laya.Templet, name: string) => {
                this.cloud = Templet.buildArmature(1);
                this.m_currView.addChild(this.cloud);
                this.cloud.x = Laya.stage.width/2;
                this.cloud.y = Laya.stage.height/2;
                this.cloud.stop();
                this.onHideCloud();
            }, [Templet1, "animation"]);
            Templet1.loadAni("effect/cloud/effect_yun.sk");
    }
    onHideCloud()
    {
        this.cloud.play("animation", false);
        Laya.timer.frameOnce(this.cloud.total, this, () => {
            if (rab.UIManager.isContainView(ViewConfig.gameView.GameView) == false) {
                this.cloud.paused();
                
                let resume = () => {
                    if (rab.UIManager.isContainView(ViewConfig.gameView.GameView) == true) {
                        this.cloud.resume();

                        Laya.timer.clear(this, resume);
                        Laya.timer.frameOnce(this.cloud.total, this, this.onHide);
                    }
                }
                Laya.timer.frameOnce(1, this, resume);
            }
            else {
                Laya.timer.frameOnce(this.cloud.total, this, this.onHide);
            }

            rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
            rab.UIManager.onCloseView(ViewConfig.gameView.RoleSelect);
            // rab.UIManager.onCloseView(ViewConfig.gameView.NotClick);
            rab.UIManager.onCreateView(ViewConfig.gameView.GameView);
        });
    }
}