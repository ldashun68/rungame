
import rab from "./rab";
import ViewConfig from "./viewConfig";

export default class Engine extends rab.RabObj {

    onInit() {
        new ViewConfig();
        rab.UIManager.onCreateView(ViewConfig.gameView.SceneLoading);
    }
}