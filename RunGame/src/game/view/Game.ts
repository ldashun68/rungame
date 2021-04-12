import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import FightManager from "../component/fightManager";
import GameController from "../GameController";
import GameNotity from "../GameNotity";

/**
 * 游戏界面
 */
export default class Game extends rab.RabView {

    protected m_currView: ui.view.GameUI;
    /**3D场景 */
    // private scene3D: Laya.Scene3D;
    /**摄像机 */
    private camera: Laya.Camera;

    /**战斗管理器组件 */
    private fightManager: FightManager;

    /**游戏开始 */
    private gameStart:boolean = false;
    private mouseDown:boolean = false;
    private _mouseDownX:number = 0;
    private _mouseDownY:number = 0;
    protected myManager:GameController;
    private isclick:boolean = false;
    private countdown: number;

    protected LoadView() {
        this.create<ui.view.GameUI>(ui.view.GameUI);
    }

    protected InitView() {
        this.AddListenerMessage(GameNotity.GameMessage_GameStart, this.onGametart);
        
        this.m_currView.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        this.m_currView.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        // Laya.stage.on(Laya.Event.KEY_DOWN,this,this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP,this,this.onKeyUp);

        this.m_currView.pauseBtn.on(Laya.Event.CLICK, this, this.onPause);
        Tool.instance.addButtonAnimation(this.m_currView.pauseBtn);
        
        // this.scene3D = Laya.loader.getRes("3d/game/Conventional/game.ls");
        // Laya.stage.addChild(this.scene3D);
        this.camera = this.myManager.scene3D.getChildByName("Main Camera") as Laya.Camera;
        this.camera.clearFlag = Laya.CameraClearFlags.Sky;

        this.fightManager = this.myManager.scene3D.addComponent(FightManager);
        this.fightManager.view = this.m_currView;
        this.fightManager.init();
        console.log("创建游戏页面");
        this.OnRefreshView();
    }

    protected OnRefreshView() {
        console.log("刷新游戏页面");
        this.m_currView.guild.visible = true;
        this.gameStart = false;
        this.m_currView.timeDown.visible = false;
        this.fightManager.fightReady();
        this.m_currView.lifeText.value = "3";
        this.m_currView.icon.skin = "new/game/tou_0" + this.myManager.playSelect + ".png";
        Laya.loader.load("new/com/Photo/pic_0" + this.myManager.openPhotowall() + "_b.png");
        // this.m_currView.coinText.value = "0";
    }

    /**暂停按钮事件 */
    private onPause (): void {
        if (this.m_currView.timeDown.visible == false) {
            this.SendMessage(GameNotity.GameMessage_PauseGame);
            rab.UIManager.onCreateView(ViewConfig.gameView.PauseView);
        }
    }

    /**战斗开始 */
    private onGametart (data: any): void {
        if (this.m_currView.timeDown.visible == true) {
            return;
        }
        this.m_currView.guild.visible = false;
        this.m_currView.timeDown.visible = true;
        this.m_currView.timeDown.skin = "ui/3.png";
        this.countdown = 1;
        Laya.timer.frameLoop(1, this, this.update);
    }

    update () {
        if (this.countdown >= 240) {
            this.m_currView.timeDown.visible = false;
            this.fightManager.onGameStart();
            this.gameStart = true;
            Laya.timer.clear(this, this.update);
        }
        else if (this.countdown >= 180) {
            this.m_currView.timeDown.skin = "ui/go.png";
        }
        else if (this.countdown >= 120) {
            this.m_currView.timeDown.skin = "ui/1.png";
        }
        else if (this.countdown >= 60) {
            this.m_currView.timeDown.skin = "ui/2.png";
        }
        this.countdown++;
    }

    onKeyUp(e)
    {
        // console.log("键盘：",e);
        if(e.keyCode == 37)
        {
            this.SendMessage(GameNotity.Game_UpdateMouseMove,0)//左
        }else if(e.keyCode == 38)
        {
            this.SendMessage(GameNotity.Game_UpdateMouseMove,2)//上
        }else if(e.keyCode == 39)
        {
            this.SendMessage(GameNotity.Game_UpdateMouseMove,1)//右
        }else if(e.keyCode == 40)
        {
            this.SendMessage(GameNotity.Game_UpdateMouseMove,3)//下
        }
        else if(e.keyCode == 32)
        {
            this.SendMessage(GameNotity.GameMessage_testScene)//下
        }
    }

    /**鼠标按下 */
    private onMouseDown(e)
    {
        if(this.gameStart) {
            this.isclick = false;
            this.mouseDown = true;
            this._mouseDownX = Laya.stage.mouseX;
            this._mouseDownY = Laya.stage.mouseY;
            // console.log('onStartDragPicture e', Laya.stage.mouseX);
        }
        else if(!this.isclick) {
            this.isclick = true;
            this.m_currView.guild.visible = false;
            this.SendMessage(GameNotity.GameMessage_GameStart)
        }
    }

    /**鼠标弹起 */
    private onMouseUp(e)
    {
        if(this.gameStart && this.mouseDown)
        {
            this.mouseDown = false;
            if(Math.abs(this._mouseDownX - Laya.stage.mouseX ) > 1 || Math.abs(this._mouseDownY - Laya.stage.mouseY ) > 1)
            {
                let dre:number =-1;
                if(Math.abs(this._mouseDownX - Laya.stage.mouseX ) > Math.abs(this._mouseDownY - Laya.stage.mouseY ))
                {
                    if(this._mouseDownX - Laya.stage.mouseX > 0)
                    {
                        // console.log('左');
                        dre = 0;
                    }else{
                        // console.log('右');
                        dre = 1
                    }
                }else{
                    // if(this._mouseDownY - Laya.stage.mouseY > 0)
                    // {
                    //     // console.log('上');
                    //     dre = 2;
                    // }else{
                    //     // console.log('下');
                    //     dre = 3
                    // }
                }
                this.SendMessage(GameNotity.Game_UpdateMouseMove,dre)
            }
        }
    }
}