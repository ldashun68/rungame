import { buildProp, obstacleProp, passProp } from "./DataType";

export default class GameJsonConfig {

    private _builds:Map<number,buildProp> = new Map<number,buildProp>();
    private _obstacles:Map<number,obstacleProp> = new Map<number,obstacleProp>();
    private jsonData:any;

    constructor(data:any) {
        this.jsonData = data;

        let build = this.jsonData['build'];
        for(var i = 0;i<build.length;i++)
        {
            let prop = <buildProp>build[i]
            this._builds[prop.id] = prop;
        }

        let obstacles = this.jsonData['obstacle'];
        for(var i = 0;i<obstacles.length;i++)
        {
            let prop = <obstacleProp>obstacles[i]
            this._obstacles[prop.id] = prop;
        }
    }

    /**
     * 加载表
     * @param name 
     */
    public getConfig(name:string): any {
        return this.jsonData[name];
    }

    public getPassCount():number
    {
        return 11;//(this.jsonData['pass'].length);
        // return data;
    }

    /**获得关卡数据 */
    public getPassData(year: string, index:number):passProp
    {
        let passIndex: Array<number> = [];
        passIndex["year80"] = 0;
        passIndex["year90"] = 11;
        passIndex["year00"] = 22;
        passIndex["year10"] = 33;

        let build: Array<Array<number>> = [];
        build["year80"] = [10001,10002,10003,10004,10005,10006,10007,10008];
        build["year90"] = [20001,20002,20003,20004,20005,20006,20007,20008];
        build["year00"] = [30001,30002,30003,30004,30005,30006,30007,30008];
        build["year10"] = [40001,40002,40003,40004,40005,40006,40007,40008];

        let obstacle: Array<Array<number>> = [];
        obstacle["year80"] = [9,10,100];
        obstacle["year90"] = [10,11,100];
        obstacle["year00"] = [11,12,13,100];
        obstacle["year10"] = [12,13,14,100];
        
        let i = index + passIndex[year];
        let pass: passProp = <passProp>(this.jsonData['pass'][i]);
        pass.builds = build[year];
        pass.obstacles = obstacle[year];
        return pass;
    }

    /**获得关卡数据 */
    public getBuildData(id:number):buildProp
    {
        return this._builds[id];
    }

    /**获得障碍物数据 */
    public getObstacleData(id:number):obstacleProp
    {
        return this._obstacles[id];
        // return data;
    }
}