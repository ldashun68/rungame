import rab from "../../rab/rab";
import { obstacleProp } from "../GameVO/DataType";

export default class ObstacleItem extends rab.GameObject {

    
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

    onInitProp(data:obstacleProp)
    {
        this.prop = data;
        this._obstacleId = data.id;
        // this._posz = posZ+data.length;
    }

    recover()
    {
        this.gameObject.removeSelf();
        Laya.Pool.recover("ObstacleID"+this._obstacleId+"",this.gameObject);
    }
   
}