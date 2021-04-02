import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import Language from "../GameVO/Language";

/**
 * 大厅界面
 */
export default class Platform extends rab.RabView {

    protected m_currView: ui.view.PlatformUI;

    /**点击列表 */
    private clickList: Array<number>;
    protected myManager:GameController;

    protected LoadView() {
        this.create<ui.view.PlatformUI>(ui.view.PlatformUI);
    }

    protected InitView() {
        Laya.timer.once(100, this, () => {
            this.OnRefreshView();
        });
        
        this.m_currView.startBtn.on(Laya.Event.CLICK, this, this.onstart);

        this.m_currView.set.on(Laya.Event.CLICK, this, this.onSet);
        Tool.instance.addButtonAnimation(this.m_currView.set);

        this.m_currView.rank.on(Laya.Event.CLICK, this, this.onRank);
        Tool.instance.addButtonAnimation(this.m_currView.rank);

        this.m_currView.pic.on(Laya.Event.CLICK, this, this.onPic);
        Tool.instance.addButtonAnimation(this.m_currView.pic);

        this.m_currView.lan.on(Laya.Event.CLICK, this, this.onLan);
        Tool.instance.addButtonAnimation(this.m_currView.lan);

        this.clickList = [];

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

        Laya3D.physicsSettings.fixedTimeStep = 1/30;

        this.AddListenerMessage(GameNotity.GameMessage_GameShowMessage, () => {
            if (this.m_currView.visible == true) {
                rab.MusicManager.playMusic("res/audio/bgm.mp3");
            }
        });

        this.myManager.getRank(() => {
            for (let index: number = 0; index < this.myManager.rank.length; index++) {
                this.m_currView.preload.skin = this.myManager.rank[index]["avatar"];
            }
        });
    }

    protected OnRefreshView() {
        rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
        rab.MusicManager.playMusic("res/audio/bgm.mp3");
        if(this.myManager.gameInfo.music == 0)
        {
            this.m_currView.set.skin = "ui/bd_syg.png";
        }else{
            this.m_currView.set.skin = "ui/bd_syk.png";
        }
    }

    /**语言包 */
    protected onShowLanguage() {
        
    }

    onstart()
    {
        let self = this;
        let complete = () => {
            rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
            self.myManager.onLoad3dScene(() => {
                Laya.loader.create([
                    "3d/prefab/Conventional/play_1.lh",
                    "3d/prefab/Conventional/play_2.lh",
                    "3d/prefab/Conventional/play_3.lh",
                    "3d/prefab/Conventional/play_4.lh",
                    "3d/prefab/Conventional/box.lh"
                ], Laya.Handler.create(this, () => {
                    rab.UIManager.onCreateView(ViewConfig.gameView.RoleSelect);
                    rab.UIManager.onHideView(ViewConfig.gameView.NotClick);
                    rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
                    rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
                }));
            });
        }

        rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
        complete();
    }

    updateRedPoint()
    {

    }

    onHide (): void {
        super.onHide();

        this.clickList = [];
    }

    /**设置按钮事件 */
    private onSet (): void {
        // rab.UIManager.onCreateView(ViewConfig.gameView.GameSetView);
        this.myManager.setMusic();
        this.myManager.setAudio();
        rab.MusicManager.playMusic("res/audio/bgm.mp3");
        if(this.myManager.gameInfo.music == 0)
        {
            this.m_currView.set.skin = "ui/bd_syg.png";
        }else{
            this.m_currView.set.skin = "ui/bd_syk.png";
        }
        this.myManager.SaveData(9);
    }

    /**排行版 */
    private onRank (): void {
        rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
        this.myManager.getRank(() => {
            rab.UIManager.onCreateView(ViewConfig.gameView.Rank);
            rab.UIManager.onHideView(ViewConfig.gameView.NotClick);
            rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
        });
    }

    /**照片墙 */
    private onPic (): void {
        rab.UIManager.onCreateView(ViewConfig.gameView.PhotoWall);
        rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
        rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
    }

    /**语言包 */
    private onLan (): void {
        this.myManager.onSetLanguage();
        this.onShowLanguage();
    }
}