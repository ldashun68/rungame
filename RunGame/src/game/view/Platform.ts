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
                rab.MusicManager.playMusic("sub4/audio/MainBGM.mp3");
            }
        });
    }

    protected OnRefreshView() {
        rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
        rab.MusicManager.playMusic("sub4/audio/MainBGM.mp3");
        this.onShowLanguage();
    }

    private onShowLanguage()
    {
        this.m_currView.startTxt.text = Language.instance.getTxt("startGame")
        this.m_currView.rankTxt.text = Language.instance.getTxt("rank")
        this.m_currView.picTxt.text = Language.instance.getTxt("pic")
        this.m_currView.setTxt.text = Language.instance.getTxt("set")
        this.m_currView.lanTxt.text = Language.instance.getTxt("language")
    }

    onstart()
    {
        // if(this.myManager.CurrPassData())
        // {
        //     rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
        //     let arr = this.myManager.getPassBuild();
        //     this.myManager.onLoad3dScene(() => {
        //             Laya.loader.create(arr, Laya.Handler.create(this, () => {
        //             this.SendMessage(GameNotity.Init_Loading);
                
        //         }));
        //     })
        // }else{
        //     console.log("没有新关卡了");
        // }
        this.myManager.onLoad3dScene(() => {
            rab.UIManager.onCreateView(ViewConfig.gameView.RoleSelect);
            rab.UIManager.onHideView(ViewConfig.gameView.PlatformView);
            rab.UIManager.onHideView(ViewConfig.gameView.PendantView);
        })
        
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
        rab.UIManager.onCreateView(ViewConfig.gameView.GameSetView);
    }

    /**排行版 */
    private onRank (): void {
        
    }

    /**照片墙 */
    private onPic (): void {
        
    }

    /**语言包 */
    private onLan (): void {
        this.myManager.onSetLanguage();
        this.onShowLanguage();
    }

}