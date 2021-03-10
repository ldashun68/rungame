import Tool from "../../Basic/Tool";
import rab from "../../rab/rab";
import GameNotity from "../GameNotity";
import { obstacleProp } from "../GameVO/DataType";

export default class ObstacleItem extends rab.GameObject {

    //simple
    onInit(): void {
        
    }

    public prop:obstacleProp;
    private _obstacleId:number;
    private _posz:number;

    public get obstacleId():number
    {
        return this._obstacleId;
    }

    public get PosZ():number
    {
        return this._posz;
    }

    public onInitProp(data:obstacleProp)
    {
        this.prop = data;
        this._obstacleId = data.id;
        this.transform.setWorldLossyScale(new Laya.Vector3(1, 1, 1));
        if (this._obstacleId != 100) {
            this.transform.localRotationEulerX = 0;
        }
        else {
            this.transform.localRotationEulerX = -90;
            this.idleAnimation();
        }
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
    protected onHit() {
        if (this.isCoin() == true) {
            Laya.timer.clear(this, this.idleAnimation);
            Tool.instance.sprite3DStopTween(this.owner as Laya.Sprite3D, Tool.instance.tweenType.rotation);
            let prop1: Laya.Vector3 = Tool.instance.getAddPosition(new Laya.Vector3(0, 2, 0), this.owner as Laya.Sprite3D);
            Tool.instance.sprite3DMove(this.owner as Laya.Sprite3D, prop1, 100);
            Tool.instance.sprite3DScale(this.owner as Laya.Sprite3D, new Laya.Vector3(0.3, 0.3, 0.3), 100, null,
                () => {
                    this.transform.setWorldLossyScale(new Laya.Vector3(0, 0, 0));
                }
            );
        }
        if (this.isTruck() == true) {
            
        }
    }

    protected idleAnimation () {
        if (this.isCoin() == true) {
            let prop: Laya.Vector3 = Tool.instance.getAddRotationEuler(new Laya.Vector3(0, 0, 90), this.owner as Laya.Sprite3D);
            Tool.instance.sprite3DRotation(this.owner as Laya.Sprite3D, prop, 1000);
            Laya.timer.once(1000, this, this.idleAnimation, null);
        }
    }

    /**是否为货车 */
    public isTruck (): boolean {
        return this.obstacleId == 10;
    }

    /**是否为金币 */
    public isCoin (): boolean {
        return this.obstacleId == 100;
    }
}