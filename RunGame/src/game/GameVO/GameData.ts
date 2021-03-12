import { RabGameInfo } from "../../rab/rab";

/**
 * 游戏数据对象
 * 保存的数据
 */
export default interface GameData extends RabGameInfo  {
    /**退出时间 */
    lastTime: any;
    /**背景音乐开关，0关/1开 */
    music: number;
    /**音效开关，0关/1开 */
    sound: number;
    /**振动开关，0关/1开 */
    vibrate: number;
    /**金币 */
    coin: number;
    /**分数 */
    score: number;
    /**体力 */
    ticket: number;
    /**最大体力 */
    maxTicket: number;
    /**已通关的关卡 */
    pass: number;
    /**当前关卡 */
    currentPass: number;
    /**语言包 */
    language:string;
    /**照片墙 */
    photo: {
        year80: number,
        year90: number,
        year00: number,
        year10: number,
    }
}