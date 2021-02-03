
/**
 * 基础事件类
 */
export default class BasicEvent {

    /**参数 */
    public args: any;
    /**函数 */
    public call: Laya.Handler;
    /**名字 */
    public name: string;

    constructor () {
        
    }

    /**执行事件函数 */
    public run (): boolean {
        if (this.call.caller == null) {
            return false;
        }
        else {
            this.call.runWith(this.args);
            return true;
        }
    }
}