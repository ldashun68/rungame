
/**
 * 基础对象池类
 */
export default class BasicPool {

    /**获得对象方式 */
    public getType = {
        /**是否激活 */
        active: "active"
    }
    /**当前获得对象方式 */
    private currentGetType: string;
    /**对象池 */
    private pool: Array<any>;

    constructor () {
        this.pool = [];
    }

    /**设置获得对象方式 */
    public setGetType (getType: string): void {
        this.currentGetType = getType;
    }

    /**添加对象 */
    public add (sprite: any): void {
        this.pool.push(sprite);
    }

    /**获得对象 */
    public get (): any {
        for (let index in this.pool) {
            if (this.currentGetType == this.getType.active) {
                if (this.pool[index].active == false) {
                    return this.pool[index]
                }
            }
        }
        return null;
    }

    /**放回对象池 */
    public recover (sprite: any): void {
        if (this.currentGetType == this.getType.active) {
            sprite.active = false;
        }
    }

    /**重置对象池 */
    public reset (): void {
        for (let index in this.pool) {
            this.recover(this.pool[index]);
        }
    }
}