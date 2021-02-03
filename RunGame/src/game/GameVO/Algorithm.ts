import GameData from "./GameData";
import GameConfig from "./GameConfig";

/**
 * 算法类
 */
export default class Algorithm  {

   /**游戏配置 */
   private gameConfig:GameConfig;
   private gameInfo:GameData;

   constructor(gameConfig:GameConfig,gameinfo:GameData){
       this.gameConfig = gameConfig;
       this.gameInfo = gameinfo;
   }
}