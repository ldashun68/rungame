import rab from "../rab/rab";


export default class GameNotity extends rab.RabNotity {

    /**初始加载 */
    static Init_Loading: string = "Init_Loading";
    /**更新金币 */
    static Game_UpdateCoin: string = "Game_UpdateCoin";
    /**更新体力 */
    static Game_UpdateTicket: string = "Game_UpdateTicket";

    static Game_UpdateMouseMove: string = "Game_UpdateMouseMove";
    static Game_RemoveScene: string = "Game_RemoveScene";
    static Game_TriggerEnter:string ="Game_TriggerEnter";
}
