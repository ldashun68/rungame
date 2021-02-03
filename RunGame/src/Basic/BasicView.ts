
/**
 * 基础视图类，为抽象类
 */
export default abstract class BasicView extends Laya.Component {

    /**视图 */
    protected abstract view: any;

    constructor () {
        super();

        this.createView();
    }

    /**显示视图 */
    public show (): void {
        this.view.visible = true;
        this.refreshView();
    }

    /**关闭视图 */
    public hide (): void {
        this.view.visible = false;
        this.clearView();
        Laya.timer.clearAll(this);
    }

    /**创建视图，会在构造函数中调用 */
    protected abstract createView (): void;

    /**刷新视图，会在show 中调用，第一次进入界面时不会调用，需手动调用 */
    protected abstract refreshView (): void;

    /**清理视图，会在hide 中调用，无需手动调用 */
    protected abstract clearView (): void;
}