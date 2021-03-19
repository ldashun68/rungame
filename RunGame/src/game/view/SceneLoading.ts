import rab from "../../rab/rab";
import { ui } from "../../ui/layaMaxUI";
import ViewConfig from "../../rab/viewConfig";
import GameNotity from "../GameNotity";
import GameController from "../GameController";
import Tool from "../../Basic/Tool";


/**
 * 资源加载界面
 */
export default class SceneLoading extends rab.RabView {
    
    protected m_currView: ui.view.LoadingUI;
    private progressWidth: number;
    private current: number;

    protected LoadView() {
        this.create<ui.view.LoadingUI>(ui.view.LoadingUI);
    }

    protected InitView() {
        this.current = 0;
        this.progressWidth = this.m_currView.imgProgress.width;
        this.m_currView.lbProgress.text = "";
        this.m_currView.imgProgress.width = 0;

        Laya.timer.frameLoop(1, this, this.updateProgress);

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

        this.AddListenerMessage(GameNotity.GameMessage_LoadingEnd,this.onLoadEnd);

        rab.RabGameManager.getInterest().AddManager(new GameController());
    }

    protected OnRefreshView() {
        
    }

    /**
     * 加载Json 
     */
    onLoadRes() {
      
    }
 
     /**
     * 处理加载进度条
     */
    updateProgress(){
        if (this.current < 1) {
            this.m_currView.imgProgress.width = this.progressWidth * this.current;
            this.m_currView.lbProgress.text = `加载中...(${Math.floor(this.current*100)}%)`;
            this.current += 0.001;
        }
    }

    /**
     * 所有资源加载完成
     */
    onComplete() {
        this.m_currView.imgProgress.width = this.m_currView.boxProgress.width;
        this.m_currView.lbProgress.text = "加载完成!";
        this.OnEnterGame();
        return;
    }

    /**
     * 加载完成
     */
    onLoadEnd() {
        console.log("====加载完成=======");
        this.OnEnterGame();
    }

    /**
     * 登录服务器成功进入游戏
     */
    OnEnterGame() {
        console.log("====登录服务器成功进入游戏=======");
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();

        let enterGame = () => {
            let array = [];
            array.push("res/atlas/ui.atlas");
            array.push("res/atlas/new/com.atlas");
            array.push("res/atlas/new/game.atlas");
            array.push("res/atlas/new/role.atlas");
            array.push("res/atlas/new/com/Photo.atlas");
            array.push("res/atlas/new/com/num/index.atlas");
            array.push("res/atlas/new/com/num/score.atlas");

            Laya.loader.load(array, Laya.Handler.create(this, (error: any, data: any) => {
                console.log(error, data);

                rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
                this.OnCloseView();
            }));
        }

        if (typeof wx != "undefined") {
            enterGame();
            Tool.instance.loadScene3D = true;
        }
        else {
            enterGame();
            Tool.instance.loadScene3D = true;
        }
    }
}