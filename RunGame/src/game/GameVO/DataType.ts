import BasicDictionary from "../../Basic/BasicDictionary";


/**启动场景类型 */
export enum OpenScene
{
    /** 浮窗*/
    float,
    /** 收藏我的小游戏*/
    collection,
    /**客服 */
    customer,
    /** 订阅*/
    subscribe,
    /** 朋友圈*/
    moments
}

export enum PlayState
{
    /**默认 */
    none,
    /**初始化 */
    init,
    /** 跑*/
    run,
    /** 跳*/
    jump,
    /**下滑 */
    slide,
    /** 停止*/
    stop,
    /** 死亡*/
    death
}


/**关卡数据结构 */
export interface passProp {
    //{"id":10001,"builds":[],"name":"城市中","length":120,"score":320,"coin":"120","diamonds":30},
    /**id */
    id:number;
    /**关卡中的建筑物 */
    builds:Array<number>;
    /**名称 */
    name:string;
    /**长度 */
    length:number;
    /**通关分数 */
    score:number;
    /**关卡金币 */
    coin:number;
    /**关卡钻石 */
    diamonds:number;

}

/**建筑物数据结构 */
export interface buildProp {
    //{"id":10004,"name":"郊区车库1","res":"SuburbsGarage01","length":9,"obstacle":[]},
    /**id */
    id:number;
    /**障碍物 */
    obstacle:Array<number>;
    /**名称 */
    name:string;
    /**长度 */
    length:number;
    /**资源 */
    res:string;
}

/**障碍物数据结构 */
export interface obstacleProp {
    //{"id":10001,"name":"桶","res":"ObstacleBin","up":1,"down":0},
    /**id */
    id:number;
    /**名称 */
    name:string;
    /**资源 */
    res:string;
    /**向上跳可以通过 1：能 0:不能 */
    up:number;
    /**向下跳可以通过 1：能 0:不能 */
    down:number;
    /**位置 0：X轴随机 1：不能随机 */
    pos:number
}

/**
* pop的返回值当data为空时返回undefined
* 使用了泛型约束
*/
export class QueueT<T> {
	private data: Array<T>;
	push = (item: T) => this.data.push(item);
	pop = (): T | undefined => this.data.shift();
}