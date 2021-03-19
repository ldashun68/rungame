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
    private scene3D: Laya.Scene3D;
    private playNode: Laya.Sprite3D;
    private selectId:number;
    private mouseDown:boolean = false;
    private _mouseDownType:number = 0;
    private _mouseDownX:number = 0;
    private animator: Laya.Animator;

    protected LoadView() {
        this.create<ui.view.RoleSelectUI>(ui.view.RoleSelectUI);
    }
    protected InitView() {
        this.m_currView.break.on(Laya.Event.CLICK, this, this.onBreak);
        Tool.instance.addButtonAnimation(this.m_currView.break);
        this.m_currView.r1.on(Laya.Event.CLICK, this, this.onSelectRole_1);
        this.m_currView.r2.on(Laya.Event.CLICK, this, this.onSelectRole_2);
        this.m_currView.r3.on(Laya.Event.CLICK, this, this.onSelectRole_3);
        this.m_currView.r4.on(Laya.Event.CLICK, this, this.onSelectRole_4);
        this.m_currView.left.on(Laya.Event.MOUSE_DOWN, this, this.onRotateLeft);
        Tool.instance.addButtonAnimation(this.m_currView.left);
        this.m_currView.right.on(Laya.Event.MOUSE_DOWN, this, this.onRotateRight);
        Tool.instance.addButtonAnimation(this.m_currView.right);

        this.m_currView.left.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.m_currView.right.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

        this.m_currView.startBtn.on(Laya.Event.CLICK, this, this.onstart);
        Tool.instance.addButtonAnimation(this.m_currView.startBtn);
        Laya.timer.frameLoop(1,this,this.onFrameLoop);

        this.OnRefreshView();
    }

    protected OnRefreshView() {

        this.m_currView.roleName_1.text = "JACK";
        this.m_currView.roleName_2.text = "小明";
        this.m_currView.roleName_3.text = "大叔";
        this.m_currView.roleName_4.text = "大爷";
        // this.myManager.scene3D.active = false;
        this.create3DScene();
    }

    private create3DScene() {
        if (this.scene3D != null) {
            return;
        }

        this.myManager.scene3D.active = false;
        //添加3D场景
        this.scene3D = this.m_currView.cloudNode.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        //添加照相机
        var camera: Laya.Camera = (this.scene3D.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 1, 0));
        camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
        //camera.clearFlag = 3;
        //添加方向光
        var directionLight: Laya.DirectionLight = this.scene3D.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        
        this.onShowRole(1);
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
        this.myManager.scene3D.active = true;
        this.scene3D.removeSelf();
        this.scene3D.destroy();
        console.log("this.scene3D.destroy");
        super.onHide();
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    }

    onstart() {
        this.myManager.playSelect = this.selectId;
        if(this.myManager.CurrPassData()) {
            if (this.myManager.addTicket(-1) == true) {
                rab.UIManager.onCreateView(ViewConfig.gameView.NotClick);

                let self = this;
                let complete = () => {
                    let arr = self.myManager.getPassBuild();
                    arr.push("3d/build/Conventional/road80.lh");
                    arr.push("3d/build/Conventional/road90.lh");
                    self.myManager.onLoad3dScene(() => {
                            Laya.loader.create(arr, Laya.Handler.create(self, () => {
                            self.SendMessage(GameNotity.Init_Loading);
                        }));
                    });
                }

                complete();
            }
        }
        else {
            console.log("没有新关卡了");
        }
    }

    onShowRole(id:number)
    {
        console.log("选择角色：",id);
        if (this.selectId == id) {
            return;
        }

        this.m_currView.select_1.visible = false;
        this.m_currView.select_2.visible = false;
        this.m_currView.select_3.visible = false;
        this.m_currView.select_4.visible = false;
        this.m_currView["select_"+id].visible = true;
        this.selectId = id;

        if (this.playNode) {
            this.playNode.destroy();
        }
        this.playNode = Laya.Sprite3D.instantiate(Laya.loader.getRes("3d/prefab/Conventional/play_"+id+".lh"), this.scene3D,true,new Laya.Vector3(0,0,0));
        this.playNode.active = true;
        this.playNode.transform.localPosition = new Laya.Vector3(0,0.3,-3.5);
        this.playNode.transform.localRotationEulerX = 0;

        this.m_currView.roleName_1.color ="#929b9e";
        this.m_currView.roleName_2.color ="#929b9e";
        this.m_currView.roleName_3.color ="#929b9e";
        this.m_currView.roleName_4.color ="#929b9e";

        (this.m_currView["roleName_"+id] as Laya.Label).color = "#ffffff";
    }

    /**
     * 返回
     */
    private onBreak()
    {
        // this.playNode.removeSelf();
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