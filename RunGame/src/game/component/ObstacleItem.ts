import rab from "../../rab/rab";
import { obstacleProp } from "../GameVO/DataType";

export default class ObstacleItem extends rab.GameObject {

    //simple
    onInit(): void {
        
    }

    public prop:obstacleProp;
    private _obstacleId:number;
    public get obstacleId():number
    {
        return this._obstacleId;
    }

    private _posz:number;
    public get PosZ():number
    {
        return this._posz;
    }

    public onInitProp(data:obstacleProp)
    {
        this.prop = data;
        this._obstacleId = data.id;
        // this._posz = posZ+data.length;
    }

    public recover()
    {
        this.gameObject.removeSelf();
        Laya.Pool.recover("ObstacleID"+this._obstacleId+"",this.gameObject);
    }

    /**碰到玩家的时候调用 */
    public onCollisionPlay()
    {
        console.log("障碍物碰到了");
        this.onHit();
    }

    /**
     * 受伤的效果显示
     */
    protected onHit()
    {

    }
   
}