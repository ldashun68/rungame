import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import { ui } from "../../ui/layaMaxUI";
import GameController from "../GameController";

/**
 * 游戏设置界面
 */
export default class GameSet extends rab.RabView {

    protected m_currView: ui.view.GameSetUI;

    protected LoadView() {
        this.create<ui.view.GameSetUI>(ui.view.GameSetUI);
        this._bannerPos = "GameSet";
    }

    protected InitView() {
        Laya.timer.once(100, this, () => {
            this.OnRefreshView();
        });

        this.m_currView.zOrder = 12;
        Tool.instance.getSpriteAt(this.m_currView.collectIImage, [1]).y += (Laya.stage.height-1334)/3;
        Tool.instance.getSpriteAt(this.m_currView.collectIImage, [2]).y += (Laya.stage.height-1334)/3;

        this.m_currView.cover.on(Laya.Event.CLICK, this, this.onHide);
        this.m_currView.closeBtn.on(Laya.Event.CLICK, this, this.onHide);
        Tool.instance.addButtonAnimation(this.m_currView.closeBtn);

        this.m_currView.soundOpenText.on(Laya.Event.CLICK, this, this.onSoundOpen);
        Tool.instance.addButtonAnimation(this.m_currView.soundOpenText);

        this.m_currView.soundCloseText.on(Laya.Event.CLICK, this, this.onSounClose);
        Tool.instance.addButtonAnimation(this.m_currView.soundCloseText);

        this.m_currView.vibrateOpenText.on(Laya.Event.CLICK, this, this.onVibrateOpen);
        Tool.instance.addButtonAnimation(this.m_currView.vibrateOpenText);

        this.m_currView.vibrateCloseText.on(Laya.Event.CLICK, this, this.onVibrateClose);
        Tool.instance.addButtonAnimation(this.m_currView.vibrateCloseText);

        this.m_currView.shareBtn.on(Laya.Event.CLICK, this, this.onShare);
        Tool.instance.addButtonAnimation(this.m_currView.shareBtn);

        this.m_currView.followBtn.on(Laya.Event.CLICK, this, this.onCollect);
        Tool.instance.addButtonAnimation(this.m_currView.followBtn);

        this.m_currView.subscribeBtn.on(Laya.Event.CLICK, this, this.onSubscribe);
        Tool.instance.addButtonAnimation(this.m_currView.subscribeBtn);

        this.m_currView.collectIImage.on(Laya.Event.CLICK, this, () => {
            this.m_currView.collectIImage.visible = false;
        });
        this.m_currView.collectIImage.getChildByName("closeBtn").on(Laya.Event.CLICK, this, () => {
            this.m_currView.collectIImage.visible = false;
        });
        Tool.instance.addButtonAnimation(this.m_currView.collectIImage.getChildByName("closeBtn") as Laya.Image);
    }

    protected OnRefreshView() {
        
        this.onInitData();
        this.m_currView.window.visible = true;
        Tool.instance.winowAniamtion(this.m_currView.window);
    }

    private onInitData()
    {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        if (manager.gameInfo.audio == 0) {
            this.m_currView.soundClose.visible = true;
            this.m_currView.soundOpen.visible = false;
            this.m_currView.soundCloseText.visible = false;
            this.m_currView.soundOpenText.visible = true;
        }
        else {
            this.m_currView.soundClose.visible = false;
            this.m_currView.soundOpen.visible = true;
            this.m_currView.soundCloseText.visible = true;
            this.m_currView.soundOpenText.visible = false;
        }
        if (manager.gameInfo.vibrate == 0) {
            this.m_currView.vibrateClose.visible = true;
            this.m_currView.vibrateOpen.visible = false;
            this.m_currView.vibrateCloseText.visible = false;
            this.m_currView.vibrateOpenText.visible = true;
        }
        else {
            this.m_currView.vibrateClose.visible = false;
            this.m_currView.vibrateOpen.visible = true;
            this.m_currView.vibrateCloseText.visible = true;
            this.m_currView.vibrateOpenText.visible = false;
        }
    }

    /**声音打开按钮事件 */
    private onSoundOpen (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        manager.gameInfo.audio = 1;
        manager.ResumeBGM();
        manager.SaveData();
        
        rab.MusicManager.playMusic("sub4/audio/MainBGM.mp3");

        this.onInitData();
    }

    /**声音关闭按钮事件 */
    private onSounClose (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        manager.gameInfo.audio = 0;
        manager.PauseBGM();
        manager.SaveData();

        this.onInitData();
    }

    /**震动打开按钮事件 */
    private onVibrateOpen (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        manager.gameInfo.vibrate = 1;
        manager.SaveData();

        this.onInitData();
    }

    /**震动关闭按钮事件 */
    private onVibrateClose (): void {
        let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
        manager.gameInfo.vibrate = 0;

        this.onInitData();
    }

    /**邀请按钮事件 */
    private onShare (): void {
        rab.SDKChannel.createShare("invite", () => {
            
        });
    }

    /**收藏按钮事件 */
    private onCollect (): void {
        this.m_currView.collectIImage.visible = true;
    }

    /**订阅按钮事件 */
    private onSubscribe (): void {
        // rab.SDKChannel.subscribeMessage("welfare", () => {
            
        // });
    }
}