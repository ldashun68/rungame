
import CurveBlinnPhong from "../game/component/CurveBlinnPhong";
import rab from "./rab";
import ViewConfig from "./viewConfig";

export default class Engine extends rab.RabObj {

    onInit() {
        new ViewConfig();
        CurveBlinnPhong.initShader();
        rab.UIManager.onCreateView(ViewConfig.gameView.SceneLoading);
    }
}