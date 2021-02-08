import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import Language from "../GameVO/Language";

export default class RoleSelect extends rab.RabView {
    protected m_currView: ui.view.RoleSelectUI;

    protected myManager:GameController;
    // private scene3D: Laya.Scene3D;
    private camera: Laya.Camera;
    private playNode: Laya.Sprite3D;
    private sky: Laya.Sprite3D;
    private selectId:number;
    private _playerPivot:Laya.Sprite3D;
    private _characterSlot:Laya.Sprite3D;
    private mouseDown:boolean = false;
    private _mouseDownType:number = 0;
    private _mouseDownX:number = 0;

    protected LoadView() {
        this.create<ui.view.RoleSelectUI>(ui.view.RoleSelectUI);
    }
    protected InitView() {
        this.m_currView.break.on(Laya.Event.CLICK, this, this.onBreak);
        Tool.instance.addButtonAnimation(this.m_currView.break);
        this.m_currView.r1.on(Laya.Event.CLICK, this, this.onSelectRole_1);
        // Tool.instance.addButtonAnimation(this.m_currView.r1);
        this.m_currView.r2.on(Laya.Event.CLICK, this, this.onSelectRole_2);
        // Tool.instance.addButtonAnimation(this.m_currView.r2);
        this.m_currView.r3.on(Laya.Event.CLICK, this, this.onSelectRole_3);
        // Tool.instance.addButtonAnimation(this.m_currView.r3);
        this.m_currView.r4.on(Laya.Event.CLICK, this, this.onSelectRole_4);
        // Tool.instance.addButtonAnimation(this.m_currView.r4);

        this.m_currView.left.on(Laya.Event.MOUSE_DOWN, this, this.onRotateLeft);
        Tool.instance.addButtonAnimation(this.m_currView.left);
        // this.m_currView.right.on(Laya.Event.CLICK, this, this.onRotateRight);
        // Tool.instance.addButtonAnimation(this.m_currView.right);
        this.m_currView.right.on(Laya.Event.MOUSE_DOWN, this, this.onRotateRight);
        Tool.instance.addButtonAnimation(this.m_currView.right);

        this.m_currView.left.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.m_currView.right.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

        this.m_currView.startBtn.on(Laya.Event.CLICK, this, this.onstart);
        Tool.instance.addButtonAnimation(this.m_currView.startBtn);
        Laya.timer.frameLoop(1,this,this.onFrameLoop)

        this.OnRefreshView();

        this.myManager.onLoad3dScene(() => {
            Laya.loader.create(["3d/prefab/Conventional/play_1.lh","3d/prefab/Conventional/play_2.lh","3d/prefab/Conventional/play_3.lh","3d/prefab/Conventional/play_4.lh"], Laya.Handler.create(this, () => {
            this.onShowRole(1);
        }));
    })
    }
    protected OnRefreshView() {
        // this.myManager.scene3D.removeSelf();
        
        
        this.camera = this.myManager.scene3D.getChildByName("Main Camera") as Laya.Camera;
        this.camera.transform.position = new Laya.Vector3(0,4,-5);
        // this.camera.clearFlag = 3;
        this._playerPivot = <Laya.Sprite3D>this.myManager.scene3D.getChildByName("PlayerPivot");
        this._characterSlot = <Laya.Sprite3D>this._playerPivot.getChildByName("CharacterSlot");
        this.sky = <Laya.Sprite3D>this._playerPivot.getChildByName("Sky");
        this.sky.active = false;
        // Laya.stage.setChildIndex(this.myManager.scene3D,Laya.stage.numChildren-1);
    }

    protected onShowLanguage()
    {
        // this.m_currView.breakTxt.text = Language.instance.getTxt("break");
        // this.m_currView.titleTxt.text = Language.instance.getTxt("role_1");
        // this.m_currView.roleTxt.text = Language.instance.getTxt("role_2");
        // this.m_currView.startTxt.text = Language.instance.getTxt("startGame");
    }

    onHide()
    {
        this.sky.active = true;
        super.onHide();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }

    onstart()
    {
        this.myManager.playSelect = this.selectId;
        if(this.myManager.CurrPassData())
        {
            rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);
            let arr = this.myManager.getPassBuild();
            this.myManager.onLoad3dScene(() => {
                    Laya.loader.create(arr, Laya.Handler.create(this, () => {
                    this.SendMessage(GameNotity.Init_Loading);
                }));
            })
        }else{
            console.log("没有新关卡了");
        }
    }

    onShowRole(id:number)
    {
        console.log("选择角色：",id);
        if(this.selectId == id)
        {
            return;
        }
        this.m_currView.select_1.visible = false;
        this.m_currView.select_2.visible = false;
        this.m_currView.select_3.visible = false;
        this.m_currView.select_4.visible = false;
        this.m_currView["select_"+id].visible = true;
        this.selectId = id;
        if(this.playNode)
        {
            this.playNode.removeSelf();
        }
        this.playNode = Laya.loader.getRes("3d/prefab/Conventional/play_"+id+".lh");
        this._characterSlot.addChild(this.playNode);
        this._characterSlot.transform.position = new Laya.Vector3(0,0,0);
        this.playNode.transform.position = new Laya.Vector3(0,1.8,0);
        this.playNode.transform.localScale = new Laya.Vector3(1.5,1.5,1.5);
        this.playNode.transform.localRotationEulerY = 180;
    }

    /**
     * 返回
     */
    private onBreak()
    {
        this.playNode.removeSelf();
        this.myManager.playSelect = this.selectId;
        rab.UIManager.onCloseView(ViewConfig.gameView.RoleSelect);
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
    }

    OnRemove()
    {
        super.OnRemove();
        if(this.playNode)
        {
            this.playNode.removeSelf();
        }
    }

    /**
     * 选择角色1
     */
    private onSelectRole_1()
    {
        this.onShowRole(1);
    }
    /**
     * 选择角色2
     */
    private onSelectRole_2()
    {
        this.onShowRole(2);
    }
    /**
     * 选择角色3
     */
    private onSelectRole_3()
    {
        this.onShowRole(3);
    }
    /**
     * 选择角色4
     */
    private onSelectRole_4()
    {
        this.onShowRole(4);
    }

    /**鼠标按下 */
    private onMouseDown(e)
    {
        this.mouseDown = true;
        this._mouseDownX = Laya.stage.mouseX;
    }

    private onMouseUp()
    {
        console.log("鼠标弹起");
        this.mouseDown = false;
        this._mouseDownType = 0;
        this._mouseDownX = 0;
    }

    private onMouseMove()
    {
        if(this.mouseDown)
        {
            if(this._mouseDownX - Laya.stage.mouseX > 0)
            {
                this.playNode.transform.rotate(new Laya.Vector3(0,-0.1,0));
            }else {
                this.playNode.transform.rotate(new Laya.Vector3(0,0.1,0));
            }
            this._mouseDownX = Laya.stage.mouseX;
        }
    }

    /**鼠标弹起 */
    private onFrameLoop()
    {
        if(this.mouseDown)
        {
            if(this._mouseDownType == 1)
            {
                this.playNode.transform.rotate(new Laya.Vector3(0,-0.1,0));
            }else if(this._mouseDownType == -1){
                this.playNode.transform.rotate(new Laya.Vector3(0,0.1,0));
            }
        }
    }

    private onRotateLeft()
    {
        this.mouseDown = true;
        this._mouseDownType = 1;
    }

    private onRotateRight()
    {
        this.mouseDown = true;
        this._mouseDownType = -1;
    }

}