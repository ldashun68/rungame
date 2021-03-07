import rab from "../../rab/rab";
import { buildProp } from "./DataType";

export default class BuildItem extends rab.GameObject {
    onInit(): void {
        
    }

    private _buildId:number;
    public get buildId():number
    {
        return this._buildId;
    }

    private _posz:number;
    public get PosZ():number
    {
        return this._posz;
    }

    onInitProp(data:buildProp,posZ:number)
    {
        this._buildId = data.id;
        this._posz = posZ+data.length;
    }

    recover()
    {
        this.gameObject.removeSelf();
        Laya.Pool.recover("build_"+this._buildId,this.gameObject);
    }

    onRemove()
    {

        //Laya.Pool.clearBySign();
    }
     
}