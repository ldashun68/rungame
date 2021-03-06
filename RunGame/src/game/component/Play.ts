import rab from "../../rab/rab";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import ObstacleItem from "./ObstacleItem";

export default class Play extends rab.GameObject {

    private _playmaterial:Laya.UnlitMaterial;
    private _count:number = 0;

    onInit(): void {
        // this.model = <Laya.MeshSprite3D>this.gameObject.getChildByName('root').getChildByName('m')
    } 

    /**
     * 开始触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerEnter(other:laya.d3.physics.PhysicsComponent):void {
        //console.log("开始触发时执行",other);
        let prop:ObstacleItem = other.owner.getComponent(ObstacleItem);
        if(prop) {
            if (prop.isCoin() == false) {
                rab.MusicManager.playSound("res/audio/hit.wav", 1, 1);

                if (prop.isTruck() == true) {
                    if(prop.transform.localPositionX == 0) {
                        this.SendMessage(GameNotity.Game_UpdateMouseMove, 1);
                    }
                    else {
                        this.SendMessage(GameNotity.Game_UpdateMouseMove, 0);
                    }
                    this.SendMessage(GameNotity.Game_RoleRetrogression);
                }
                
                this.SendMessage(GameNotity.Game_TriggerEnter,prop);
                this.onFlash();
            }
            else {
                rab.MusicManager.playSound("res/audio/coin.wav", 1, 0.05);

                let manager: GameController = rab.RabGameManager.getInterest().getMyManager();
                manager.fightGetCoin += 1;
            }

            prop.onCollisionPlay();
        }
    }

    public onSetMaterial(material:Laya.UnlitMaterial) {
        this._playmaterial = material;
    }

    public stopFlash() {
        if(this._playmaterial) {
            this._count = 0;
            this._playmaterial.albedoIntensity = 1;
            Laya.timer.clearAll(this);
        }
    }

    private onFlash() {
        if (this._playmaterial) {
            this.stopFlash();
            if (this._count <= 0) {
                this._count = 8;
                Laya.timer.frameLoop(10, this, ()=>{
                    if (this._count > 0) {
                        this._count -= 1
                        console.log("这里要开始闪烁了");
                        // this._playmaterial.albedoColor = new Laya.Vector4(1,2,2,0.1);
                        if (this._playmaterial.albedoIntensity == 1) {
                            this._playmaterial.albedoIntensity = 2
                        }
                        else {
                            this._playmaterial.albedoIntensity = 1;
                        }
                    }
                    else {
                        Laya.timer.clearAll(this);
                    }
                });
            }
        }
    }

    // /**
    //  * 持续触发时执行
    //  * 此方法为虚方法，使用时重写覆盖即可
    //  */
    // onTriggerStay(other:laya.d3.physics.PhysicsComponent):void
    // {
    //     console.log("持续触发时执行",other);
    // }

    // /**
    //  * 结束触发时执行
    //  * 此方法为虚方法，使用时重写覆盖即可
    //  */
    // onTriggerExit(other:laya.d3.physics.PhysicsComponent):void
    // {
    //     console.log("结束触发时执行",other);
    // }
}