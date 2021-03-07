export default class Language  {
    
    /**单例对象 */
    private static _instance: Language;
    /**获得“单例”对象 */
    public static get instance (): Language {
        if (this._instance == null) {
            this._instance = new Language();
        }
        return this._instance;
    }

    //cn中文、en英文
    private currLanguage:string = "cn";
    private cnTxt:any;
    private enTxt:any;

    public onInit(lan:string)
    {
        this.currLanguage = lan;
        this.cnTxt = {
            "startGame":"开始游戏",
            "rank":"排行榜",
            "pic":"照片墙",
            "set":"设置",
            "language":"语言",
            "break":"返回",
            "role_1":"角色选择",
            "role_2":"滑动旋转",
            "fail_1":"继续游戏",
            "fail_2":"重新开始",
            "fail_3":"返回大厅",
            "win_1":"下一关"
        }

        this.enTxt = {
            "startGame":"startGame",
            "rank":"rank",
            "pic":"pic",
            "set":"set",
            "language":"language",
            "break":"break",
            "role_1":"roleSlect",
            "role_2":"rotate",
            "fail_1":"continue",
            "fail_2":"ReGame",
            "fail_3":"BreakHome",
            "win_1":"NextPass"
        }
        // console.log("语言包：",this.cnTxt);
    }

    

    /**
     * 
     * @param lan cn中文、en英文
     */
    public SetLanguage(lan:string)
    {
        this.currLanguage = lan;
    }

    public getTxt(key:string):string
    {
        let txt = "";
        if(this.currLanguage == "cn")
        {
            txt = this.cnTxt[key]
        }else if(this.currLanguage == "en")
        {
            txt = this.enTxt[key]
        }
        return txt;
    }

    


}