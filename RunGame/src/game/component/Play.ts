import rab from "../../rab/rab";
import GameNotity from "../GameNotity";
import ObstacleItem from "./ObstacleItem";

export default class Play extends rab.GameObject {


    
    onInit(): void {
        
    } 

    /**
     * 开始触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerEnter(other:laya.d3.physics.PhysicsComponent):void
    {
        console.log("开始触发时执行",other);
        let prop:ObstacleItem = other.owner.getComponent(ObstacleItem);
        if(prop)
        {
            this.SendMessage(GameNotity.Game_TriggerEnter,prop.prop.up,prop.prop.down);
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