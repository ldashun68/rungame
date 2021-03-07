import Tool from "../../Basic/Tool";
import ObstacleItem from "./ObstacleItem";

/**
 * 简单的障碍物
 */
export default class ObstacleSimple extends ObstacleItem {
   

    protected onHit()
    {
        // let anim = this.gameObject.getComponent(Laya.Animation)
        console.log("简单的障碍物碰到就直接倒了");
        Tool.instance.sprite3DRotation(this.gameObject,new Laya.Vector3(90,0,0),100)
    }
}