import rab from "../rab/rab";
import GameData from "./GameVO/GameData";
import GameJsonConfig from "./GameVO/GameJsonConfig";
import Algorithm from "./GameVO/Algorithm";
import GameConfig from "./GameVO/GameConfig";
import GameNotity from "./GameNotity";
import ViewConfig from "../rab/viewConfig";
import { buildProp, passProp } from "./GameVO/DataType";
import Language from "./GameVO/Language";

export default class GameController extends rab.RabController {

    public static DEF_CURVE_ROAD:Laya.ShaderDefine;
    public static curve_params:number;
    /**重新初始化类型 */
    public gameInfo: GameData;
    /**游戏配置 */
    public gameConfig: GameConfig;

    /**算法类 */
    public algorithm: Algorithm;

    /**配置表整理获得 */
    public jsonConfig: GameJsonConfig;

    /**是否启动定时增加体力 */
    public isLoopAddTicket: boolean;
    /**每次增加的体力 */
    public loopAddTicketValue: number;
    /**定时增加体力时间间隔 */
    public loopAddTicketTimeGap: number;
    /**技能权重 */
    public skillWeight: number;
    /**士兵排序列表 */
    public soldierSort: Array<string>;
    /**战斗获得金币 */
    public fightGetCoin: number;
    /**战斗获得装备 */
    public fightGetEquip: Array<number>;
    /**攻击音效次数 */
    public attackSoundCount: number = 0;
    /**死亡音效次数 */
    public dieSoundCount: number = 0;
    /**震动次数 */
    public vibrateCount: number = 0;

    public playSelect:number = 1;

    public rank: Array<any>;

    public m_selectYear:Array<string>;

    private readonly curveScale:number = 0.1;
    private readonly curveOffset:number = 2.6;
    private readonly curveFactor:number = 0.43;

    /**
     * 初始化资源
     */
    protected onInitUserDate() {

        GameController.DEF_CURVE_ROAD = Laya.Shader3D.getDefineByName("CURVE_ROAD");
        GameController.curve_params = Laya.Shader3D.propertyNameToID("u_curveParam");
        rab.Util.log("onInitUserDate=====")
        this.gameInfo.audio = 1;
        this.gameInfo.music = 1;
        this.gameInfo.vibrate = 1;
        this.gameInfo.coin = 0;
        this.gameInfo.score = 0;
        this.gameInfo.ticket = 30;
        this.gameInfo.maxTicket = 30;
        this.gameInfo.pass = 0;
        this.gameInfo.currentPass = 0;
        this.gameInfo.language = "cn";//cn中文、en英文

        this.gameInfo.photo = {
            year80: 0,
            year90: 0,
            year00: 0,
            year10: 0,
        };

        this.gameInfo.lastTime = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
        };
        this.m_selectYear = ["year80","year90","year00","year10"]
    }

    /**语言设置 */
    public onSetLanguage()
    {
        if(this.gameInfo.language == "cn")
        {
            this.gameInfo.language = "en"
        }else{
            this.gameInfo.language = "cn"
        }
        Language.instance.SetLanguage(this.gameInfo.language);
        this.SaveData(0);
    }

    public setScene()
    {
        let v4:Laya.Vector4 = new Laya.Vector4();
        v4.x = this.curveScale;
        v4.y = this.curveOffset;
        v4.z = this.curveFactor;
        //step3.设置全局的道路弯曲参数
        let sv = (this.scene3D["_shaderValues"] as Laya.ShaderData)//'u_curveParam': Shader3D.PERIOD_SCENE
        sv.addDefine(GameController.DEF_CURVE_ROAD);
        //参数说明V4.x 第一个参数是z轴系数，决定弯曲曲率，越大弯曲越快
        //V4.y 第二个参数，弯曲起点偏移，越大越往里推移
        //v4.z 第三个参数，弯曲曲率系数，可以默认设置1，优先修改x参数，再考虑此参数调整
        sv.setVector(GameController.curve_params,v4)//第一个参数是z轴系数，巨顶
    }

    protected onHide() {

    }

    /**
     * 可以执行下一步了
     */
    protected onStartGame() {
        this.algorithm = new Algorithm(this.gameConfig, this.gameInfo);
        this.jsonConfig = new GameJsonConfig(this.jsonData);
        this.isLoopAddTicket = false;
        this.loopAddTicketTimeGap = 60000;
        this.loopAddTicketValue = 1;
        this.fightGetCoin = 0;
        this.fightGetEquip = [];
        this.skillWeight = 0;
        this.soldierSort = [];
        this.rank = [];

        if (this.gameInfo.score == 0) {
            this.onAddLevelDate();
        }
        this.updateTime();
        Language.instance.onInit(this.gameInfo.language);
        rab.MusicManager.setState(this.gameInfo.music, this.gameInfo.audio);
    }

    /**更新时间 */
    public updateTime (): void {
        let date: Date = new Date();
        let minute: number = 0;
        if (this.gameInfo.lastTime.year < date.getFullYear()) {
            this.gameInfo.ticket = this.gameInfo.maxTicket;
        }
        else if (this.gameInfo.lastTime.month < date.getMonth()) {
            this.gameInfo.ticket = this.gameInfo.maxTicket;
        }
        else if (this.gameInfo.lastTime.day < date.getDay()) {
            this.gameInfo.ticket = this.gameInfo.maxTicket;
        }
        else if (this.gameInfo.lastTime.hour < date.getHours()) {
            this.gameInfo.ticket = this.gameInfo.maxTicket;

            let hour = date.getHours() - this.gameInfo.lastTime.hour;
            minute = date.getMinutes() - this.gameInfo.lastTime.minute;
            minute += hour*60;
        }
        else if (this.gameInfo.lastTime.minute < date.getMinutes()) {
            minute = date.getMinutes() - this.gameInfo.lastTime.minute;
            while (minute >= 1 && this.gameInfo.ticket < this.gameInfo.maxTicket) {
                this.addTicket(this.loopAddTicketValue);
                minute -= 1;
            }

            minute = date.getMinutes() - this.gameInfo.lastTime.minute;
        }
        else if (this.gameInfo.lastTime.second < date.getSeconds()) {
            
        }

        this.gameInfo.lastTime.year = date.getFullYear();
        this.gameInfo.lastTime.month = date.getMonth();
        this.gameInfo.lastTime.day = date.getDay();
        this.gameInfo.lastTime.hour = date.getHours();
        this.gameInfo.lastTime.minute = date.getMinutes();
        this.gameInfo.lastTime.second = date.getSeconds();
    }

    /**增加（扣除）金币，返回false 金币不足 */
    public addCoin (coin: number): boolean {
        if (this.gameInfo.coin + coin < 0) {
            return false;
        }

        this.gameInfo.coin += coin;
        this.SaveData(1);
        this.SendMessage(GameNotity.Game_UpdateCoin, this.gameInfo.coin);
        return true;
    }

    /**增加（扣除）体力，返回false 金币不足 */
    public addTicket (ticket: number): boolean {
        if (this.gameInfo.ticket + ticket < 0) {
            rab.UIManager.onCreateView(ViewConfig.gameView.GetTicketView);
            return false;
        }

        this.gameInfo.ticket += ticket;
        if (this.gameInfo.ticket >= this.gameInfo.maxTicket) {
            this.isLoopAddTicket = false;
            Laya.timer.clear(this, this.loopAddTicket);
        }
        else if (this.isLoopAddTicket == false) {
            this.isLoopAddTicket = true;
            Laya.timer.loop(this.loopAddTicketTimeGap, this, this.loopAddTicket);
        }

        this.SaveData(2);
        this.SendMessage(GameNotity.Game_UpdateTicket, this.gameInfo.ticket);
        return true;
    }

    public openPhotowall(): number {
        return this.gameInfo.photo[this.m_selectYear[this.playSelect-1]] += 1;
    }

    /**定时增加体力 */
    private loopAddTicket (): void {
        this.addTicket(this.loopAddTicketValue);
    }

    /**获得观看视频后增加的体力 */
    public getVideoAddTicket (): number {
        return 15;
    }

    /**获得复活所需金币 */
    public getReviveCoin (): number {
        return 2800;
    }

    /**获得金币宝箱的金币 */
    public getCoinBox (): number {
        return 8000;
    }

    /**获得大量金币 */
    public getCoinBig (): number {
        return 1500;
    }

    /**获得小量金币 */
    public getCoinSmall (): number {
        return 500;
    }

    /**获得兵种最大数量 */
    public getSoldierMaxCount (): number {
        return 30;
    }

    /**获得已通关数 */
    public getPass (): number {
        return this.gameInfo.pass;
    }

    /**获得当前通关数 */
    public getCurrentPass (): number {
        return this.gameInfo.currentPass;
    }

    /**下一关当前通关数 */
    public onNextPass () {
        this.gameInfo.currentPass += 1;
    }

    /**当前关卡属性 */
    public CurrPassData():passProp
    {
        if(this.gameInfo.photo[this.m_selectYear[this.playSelect-1]] >= this.jsonConfig.getPassCount()) {
            this.gameInfo.currentPass = 11;
            //this.gameInfo.pass = 0;
        }
       let data = this.jsonConfig.getPassData(this.m_selectYear[this.playSelect-1], this.gameInfo.currentPass)
       return data;
    }

    /**
     * 建筑物属性
     * @param id 
     */
    public getBuild(id):buildProp
    {
       return this.jsonConfig.getBuildData(id);
    }

    public getPassBuild():Array<string>
    {
        let build = ["3d/prefab/Conventional/play_"+this.playSelect+".lh"];
        let pass: passProp = this.CurrPassData();
        let arr = pass.builds;
        for(var i = 0;i<arr.length;i++)
        {
            build.push("3d/build/Conventional/"+this.jsonConfig.getBuildData(arr[i]).res+".lh");
            let arr2 = pass.obstacles;
            for(var j = 0;j<arr2.length;j++)
            {
                if(build.indexOf("3d/prefab/Conventional/"+this.jsonConfig.getObstacleData(arr2[j]).res+".lh") == -1)
                {
                    build.push("3d/prefab/Conventional/"+this.jsonConfig.getObstacleData(arr2[j]).res+".lh");
                }
            }
        }
        return build
    }

    /**
    * 添加闯关数据
    */
    public onAddLevelDate()
    {
       if(rab.Util.isMobil && this.userInfo && this.userInfo.token)
       {
            rab.HTTP.post("api/playLog",{
                "passLv": 0,
                "failLv": 0,
                "score":this.gameInfo.score,
                "token":this.userInfo.token
            },this,(data)=>{
                rab.Util.log('添加闯关数据',data);
            });
       }
    }

   public getRank(callback: Function)
   {
        if(rab.Util.isMobil && this.userInfo && this.userInfo.token)
        {
            rab.HTTP.get("api/rankList",this.userInfo.token,(data)=>{
                this.rank = data.data;
                callback && callback();
                rab.Util.log('获得排行榜数据',this.rank);
            });
        }
        else {
            callback && callback();
        }
   }
}