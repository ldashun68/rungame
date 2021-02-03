
/**
 * 配置数据
 * 在线参数
 */

import rab, { RabGameConfig } from "../../rab/rab";

export default interface GameConfig extends RabGameConfig {

    debug:boolean;
    version:string;
    loadJson:{
        
    };
    loadui:Array<string>;

    config:{
        /**是否分享 */
        allow_share:boolean;
        /**是否视频 */
        allow_video:boolean;
        /**视频失败是否分享 */
        video_faill_share:boolean;
        allow_adGame:boolean;
        showShareMenu:boolean;
        /**广告banner的数据 */
        bannerConf:Array<any>;
        /**广告视频的数据 */
        videoConf:Array<any>;
        /**插屏广告配置 */
        intervalsConf:Array<any>;
        /**banner刷新时间 */
        adIntervals:number;
        /**分享位置 */
        shareConfig:Array<any>;
        /**分享超时 */
        shareDuration:number;
        tipWay:number;

        welfare:{};
        upgradeWay:number;
        chooseSkillWay:number;
        winGetCoinWay:number;
        getTicketWay:number;
        shopBigCoinWay:number;
        shopSmallCoinWay:number;
        shopBoxCoinWay:number;
        reviveWay:number;
    }
}