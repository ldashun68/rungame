import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import Language from "../GameVO/Language";

/**
 * 照片墙界面
 */
export default class PhotoWall extends rab.RabView {

    protected m_currView: ui.view.PhotoWallUI;
    protected myManager: GameController;
    private year: string;

    protected LoadView() {
        this.create<ui.view.PhotoWallUI>(ui.view.PhotoWallUI);
    }

    protected InitView() {
        this.m_currView.breakBtn.on(Laya.Event.CLICK, this, this.onBreak);
        Tool.instance.addButtonAnimation(this.m_currView.breakBtn);

        this.m_currView.year80GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year80"]);
        Tool.instance.addButtonAnimation(this.m_currView.year80GaryBtn);
        this.m_currView.year80YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year80"]);
        Tool.instance.addButtonAnimation(this.m_currView.year80YellowBtn);

        this.m_currView.year90GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year90"]);
        Tool.instance.addButtonAnimation(this.m_currView.year90GaryBtn);
        this.m_currView.year90YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year90"]);
        Tool.instance.addButtonAnimation(this.m_currView.year90YellowBtn);

        this.m_currView.year00GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year00"]);
        Tool.instance.addButtonAnimation(this.m_currView.year00GaryBtn);
        this.m_currView.year00YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year00"]);
        Tool.instance.addButtonAnimation(this.m_currView.year00YellowBtn);

        this.m_currView.year10GaryBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year10"]);
        Tool.instance.addButtonAnimation(this.m_currView.year10GaryBtn);
        this.m_currView.year10YellowBtn.on(Laya.Event.CLICK, this, this.onChooseYear, ["year10"]);
        Tool.instance.addButtonAnimation(this.m_currView.year10YellowBtn);

        this.m_currView.cover.on(Laya.Event.CLICK, this, () => {
            if (this.m_currView.bigPhoto.scaleX == 1 && this.m_currView.bigPhoto.alpha == 1) {
                Laya.Tween.clearAll(this.m_currView.bigPhoto);
                Laya.Tween.to(this.m_currView.bigPhoto, { alpha:0 }, 1000, Laya.Ease.quadInOut);
                Laya.Tween.clearAll(this.m_currView.cover);
                Laya.Tween.to(this.m_currView.cover, {}, 850, null, Laya.Handler.create(this, () => {
                    this.m_currView.cover.visible = false;
                    this.m_currView.bigPhoto.visible = false;
                }));
            }
        });

        this.m_currView.photoList.selectEnable = true;
        this.m_currView.photoList.mouseHandler = new Laya.Handler(this, this.onSelect);
        this.m_currView.photoList.renderHandler = new Laya.Handler(this, this.updateItem);

        this.OnRefreshView();
    }

    protected OnRefreshView() {
        this.year = "";
        this.onChooseYear("year80");
    }

    private onBreak (): void {
        rab.UIManager.onHideView(ViewConfig.gameView.PhotoWall);
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
        rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
    }

    private onChooseYear (data: any): void {
        if (data == this.year) {
            return;
        }

        this.year = data;
        for (let index: number = 1; index < this.m_currView.list.numChildren; index++) {
            let button: Laya.Image = this.m_currView.list.getChildAt(index) as Laya.Image;
            button.visible = false;
            if (button.name.indexOf(this.year) != -1 && button.name.indexOf("Gary") == -1) {
                button.visible = true;
            }
            else if (button.name.indexOf(this.year) == -1 && button.name.indexOf("Gary") != -1) {
                button.visible = true;
            }
        }

        let array: Array<any> = [];
        for(let m: number = 0; m < 12; m++){
            array.push("");
        }
        this.m_currView.photoList.array = array;
        this.m_currView.photoList.scrollTo(0);
    }

    private updateItem(cell: Laya.Image, index: number): void {
        let bool: boolean = false;
        if (index < this.myManager.gameInfo.photo[this.year]) {
            bool = true;
        }
        if (index >= 11) {
            (cell.getChildAt(0) as Laya.Image).visible = false;
        }

        if (bool == true) {
            (cell.getChildAt(0).getChildAt(0) as Laya.Image).skin = "new/com/Photo/pic_0" + (index+1) + ".png";
        }
        else {
            (cell.getChildAt(0).getChildAt(0) as Laya.Image).skin = "new/com/zhaopian X.png";
        }
    }

    private onSelect(e,index: number): void {
        if(this.m_currView.bigPhoto.visible)return
        let bool: boolean = false;
        if (index < this.myManager.gameInfo.photo[this.year]) {
            bool = true;
        }
        if (bool == true) {
            this.m_currView.cover.visible = true;
            this.m_currView.cover.alpha = 0.5;
            this.m_currView.bigPhoto.visible = true;
            this.m_currView.bigPhoto.alpha = 1;
            this.m_currView.bigPhoto.skin = "new/com/Photo/pic_0" + (index+1) + "_b.png"
            Tool.instance.winowAniamtion(this.m_currView.bigPhoto, 0.5);
        }
    }
}