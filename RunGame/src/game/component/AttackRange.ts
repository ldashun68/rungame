import BasicDictionary from "../../Basic/BasicDictionary";

/**
 * 范围攻击组件
 */
export default class AttackRange extends Laya.Script3D {

    /**攻击范围内的敌人列表 */
    public enemyList: BasicDictionary<Laya.Sprite3D>;
    /**碰撞器 */
    public colliderShape: Laya.BoxColliderShape;

    /**初始化 */
    public init (): void {
        this.enemyList = new BasicDictionary<Laya.Sprite3D>();

    }

    onTriggerEnter (other: Laya.PhysicsComponent): void {
        if (other.owner.name.indexOf("soldier") != -1 || other.owner.name.indexOf("base") != -1) {
            let traget: Laya.Sprite3D = other.owner as Laya.Sprite3D;
            if (this.isEnemy(traget) == true) {
                this.enemyList.add(traget.name, traget);
            }
        }
    }

    onTriggerExit (other: Laya.PhysicsComponent): void {
        if (other.owner.name.indexOf("soldier") != -1 || other.owner.name.indexOf("base") != -1) {
            let traget: Laya.Sprite3D = other.owner as Laya.Sprite3D;
            if (this.isEnemy(traget) == true) {
                this.enemyList.removeByName(traget.name);
            }
        }
    }

    /**是否互为敌人 */
    private isEnemy (traget: Laya.Node): boolean {
        return (this.owner.parent.parent.parent.name.indexOf("player") != traget.name.indexOf("player") && traget.name.indexOf("base") == -1) ||
        (this.owner.parent.parent.parent.name.indexOf("enemy") != -1 && traget.name.indexOf("base") != -1);
    }
}