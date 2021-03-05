import rab from "./rab"
import SceneLoading from "../game/view/SceneLoading"
import Platform from "../game/view/Platform";
import Game from "../game/view/Game";
import Pendant from "../game/view/Pendant";
import Pause from "../game/view/Pause";
import GameWin from "../game/view/GameWin";
import GameFail from "../game/view/GameFail";
import GetTicket from "../game/view/GetTicket";
import GameSet from "../game/view/GameSet";
import NotClick from "../game/view/NotClick";
import RoleSelect from "../game/view/RoleSelect";
import Rank from "../game/view/Rank";
import PhotoWall from "../game/view/PhotoWall";


export default class ViewConfig {

    constructor() {
        rab.RabViewConfig.regClass("SceneLoading", SceneLoading);
        rab.RabViewConfig.regClass("PlatformView", Platform);
        rab.RabViewConfig.regClass("PendantView", Pendant);
        rab.RabViewConfig.regClass("GameView", Game);
        rab.RabViewConfig.regClass("PauseView", Pause);
        rab.RabViewConfig.regClass("GameWinView", GameWin);
        rab.RabViewConfig.regClass("GameFailView", GameFail);
        rab.RabViewConfig.regClass("GetTicketView", GetTicket);
        rab.RabViewConfig.regClass("GameSetView", GameSet);
        rab.RabViewConfig.regClass("NotClick", NotClick);
        rab.RabViewConfig.regClass("RoleSelect", RoleSelect);
        rab.RabViewConfig.regClass("Rank", Rank);
        rab.RabViewConfig.regClass("PhotoWall", PhotoWall);
    }

    static gameView = {
        SceneLoading:"SceneLoading",
        PlatformView:"PlatformView",
        PendantView:"PendantView",
        GameView:"GameView",
        PauseView:"PauseView",
        GameWinView:"GameWinView",
        GameFailView:"GameFailView",
        GetTicketView:"GetTicketView",
        GameSetView:"GameSetView",
        NotClick:"NotClick",
        RoleSelect:"RoleSelect",
        Rank:"Rank",
        PhotoWall:"PhotoWall"
    }
}