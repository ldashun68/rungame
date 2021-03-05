import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import ViewConfig from "../../rab/viewConfig";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import Language from "../GameVO/Language";

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

        this.m_currView.upBtn.on(Laya.Event.CLICK, this, this.onUp);
        Tool.instance.addButtonAnimation(this.m_currView.upBtn);

        this.m_currView.downBtn.on(Laya.Event.CLICK, this, this.onDown);
        Tool.instance.addButtonAnimation(this.m_currView.downBtn);

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

    private onUp (): void {
        if (this.page == 0) {
            return;
        }

        this.page -= 1;
        if (this.page == 0) {
            this.m_currView.item1.visible = true;
            this.m_currView.item2.visible = true;
            this.m_currView.item3.visible = true;
            this.m_currView.item11.visible = false;
            this.m_currView.item12.visible = false;
            this.m_currView.item13.visible = false;
        }

        this.updateList();
    }

    private onDown (): void {
        if ((this.page+1)*10 >= this.myManager.rank.length) {
            return;
        }

        if (this.page == 0) {
            this.m_currView.item1.visible = false;
            this.m_currView.item2.visible = false;
            this.m_currView.item3.visible = false;
            this.m_currView.item11.visible = true;
            this.m_currView.item12.visible = true;
            this.m_currView.item13.visible = true;
        }
        this.page += 1;

        this.updateList();
    }

    private updateList (): void {
        let tag: number = 0;
        for (let index: number = this.page*10; index < this.page*10+10; index++) {
            this.initItem(index, this.m_currView.itemNode.getChildAt(tag) as Laya.Image, this.myManager.rank[index]);
            tag += 1;
        }
        for (let index: number = 10; index < 13; index++) {
            tag = this.page*10+(index-10);
            this.initItem(tag, this.m_currView.itemNode.getChildAt(index) as Laya.Image, this.myManager.rank[tag]);
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

        if (item.numChildren == 5) {
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
}