import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";

/**
 * 排行榜界面
 */
export default class Rank extends rab.RabView {

    protected m_currView: ui.view.RankUI;
    protected myManager: GameController;
    private page: number;

    protected LoadView() {
        this.create<ui.view.RankUI>(ui.view.RankUI);
    }

    protected InitView() {
        this.m_currView.breakBtn.on(Laya.Event.CLICK, this, this.onBreak);
        Tool.instance.addButtonAnimation(this.m_currView.breakBtn);

        this.m_currView.rankList.selectEnable = true;
        this.m_currView.rankList.selectHandler = new Laya.Handler(this, this.onSelect);
        this.m_currView.rankList.renderHandler = new Laya.Handler(this, this.updateItem);

        this.OnRefreshView();
    }

    protected OnRefreshView() {
        this.page = 0;
        this.updateList();
    }

    private onBreak (): void {
        rab.UIManager.onHideView(ViewConfig.gameView.Rank);
        rab.UIManager.onCreateView(ViewConfig.gameView.PlatformView);
        rab.UIManager.onCreateView(ViewConfig.gameView.PendantView);
    }

    private updateList (): void {
        let array: Array<any> = [];
        let count: number = (9 >= this.m_currView.rankList.length)? 9:this.m_currView.rankList.length;
        for(let m: number = 0; m < count; m++){
            array.push("");
        }
        this.m_currView.rankList.array = array;
        for(let m: number = count; m < this.myManager.rank.length; m++){
            this.m_currView.rankList.addItem("");
        }
    }

    private initItem (index: number, item: Laya.Image, data: any): void {
        index += 1;

        let head: Laya.Image = item.getChildAt(0) as Laya.Image;
        head.skin = null;
        let headBox: Laya.Image = item.getChildAt(1) as Laya.Image;
        headBox.visible = false;
        let name: Laya.Label = item.getChildAt(2) as Laya.Label;
        name.text = "";
        let score: Laya.Image = item.getChildAt(3) as Laya.Image;
        for (let i: number = score.numChildren-1; i >= 0; i--) {
            let _score: Laya.Image = score.getChildAt(i) as Laya.Image;
            _score.skin = null;
        }

        if (data != null) {
            head.skin = data["avatar"];
            headBox.visible = true;
            name.text = data["name"];
            let string: Array<any> = (data["score"]+"").split("");
            for (let i: number = score.numChildren-1; i >= 0; i--) {
                let _score: Laya.Image = score.getChildAt(i) as Laya.Image;
                if (string.length > 0) {
                    _score.skin = "new/com/num/score/" + string.pop() + ".png";
                }
            }
        }

        if ((item.getChildByName("index") as Laya.Image).visible == true) {
            let _index: Laya.Image = item.getChildAt(4) as Laya.Image;
            _index.skin = null;
            for (let i: number = 0; i < _index.numChildren; i++) {
                _index.getChildAt(i).removeSelf();
                _index.getChildAt(i).destroy();
            }

            if (data != null) {
                if (index > 9) {
                    let string: Array<any> = (index+"").split("");
                    for (let i: number = 0; i < string.length; i++) {
                        let child: Laya.Image = new Laya.Image();
                        _index.addChild(child);
                        child.skin = "new/com/num/index/" + string[i] + ".png";
                        child.pos(-child.width/2+32*i, 0);
                    }
                }
                else {
                    _index.skin = "new/com/num/index/" + index + ".png";
                }
            }
        }
    }

    private updateItem(cell: Laya.Image, index: number): void {
        let item: Laya.Image = (cell.getChildAt(0).getChildAt(0) as Laya.Image);
        if (index < 3) {
            item.skin = "new/com/" + (index+1) + "st.png";
            (item.getChildByName("index") as Laya.Image).visible = false;
        }
        else {
            item.skin = "new/com/4st.png";
            (item.getChildByName("index") as Laya.Image).visible = true;
        }
        this.initItem(index, item, this.myManager.rank[index]);
    }

    private onSelect(index: number): void {
        
    }
}