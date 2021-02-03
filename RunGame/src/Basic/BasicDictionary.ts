
/**
 * 基础词典类
 */
export default class BasicDictionary<T> {

    /**名字列表 */
    private nameList: Array<string>;
    /**数值列表 */
    private valeList: Array<T>;

    constructor () {
        this.nameList = new Array<string>();
        this.valeList = new Array<T>();
    }

    /**添加词条 */
    public add (name: string, value: T): void {
        this.nameList.push(name);
        this.valeList.push(value);
    }

    /**通过名字删除词条 */
    public removeByName (name: string): void {
        let index: number = this.nameList.indexOf(name);
        if (index != -1) {
            this.nameList.splice(index, 1);
            this.valeList.splice(index, 1);
        }
    }

    /**通过索引删除词条 */
    public removeByIndex (index: number): void {
        this.nameList.splice(index, 1);
        this.valeList.splice(index, 1);
    }

    /**通过名字获得词条 */
    public getValueByName (name: string, isRemove: boolean = false): T {
        let index: number = this.nameList.indexOf(name);
        if (index != -1) {
            let value: T = this.valeList[index];
            if (isRemove == true) {
                this.nameList.splice(index, 1);
                this.valeList.splice(index, 1);
            }
            return value;
        }
        return null;
    }

    /**通过索引获得词条 */
    public getValueByIndex (index: number, isRemove: boolean = false): T {
        let value: T = this.valeList[index];
        if (isRemove == true) {
            this.nameList.splice(index, 1);
            this.valeList.splice(index, 1);
        }
        return value;
    }

    /**通过索引获得名字 */
    public getNameByIndex (index: number): string {
        return this.nameList[index];
    }

    /**设置词条 */
    public set (name: string, value: T): void {
        let index: number = this.nameList.indexOf(name);
        if (index != -1) {
            this.valeList[index] = value;
        }
    }

    /**获得长度 */
    public get length (): number {
        return this.nameList.length;
    }
}