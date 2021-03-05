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
        return (this.jsonData['pass'].length);
        // return data;
    }

    /**获得关卡数据 */
    public getPassData(index:number):passProp
    {
        return <passProp>(this.jsonData['pass'][index]);
        // return data;
    }

    /**获得关卡数据 */
    public getBuildData(id:number):buildProp
    {
        return this._builds[id];
        // return data;
    }

    /**获得障碍物数据 */
    public getObstacleData(id:number):obstacleProp
    {
        return this._obstacles[id];
        // return data;
    }
}