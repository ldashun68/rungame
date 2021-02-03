
/**
 * 地图配置表
 */
export default class MapConfig{
	mapid:number;
	role:Array<number>;
	npc:Array<NpcConf>;
	obstacles:Array<obstaclesConf>;
	count:number;
	enemy:Array<NpcConf>;
	end:Array<EndEnemyConf>
}

export class EndEnemyConf
{
	name:string;//名称
	count:number;//数量
	hp:number;//血量
}

export class NpcConf
{
	name:string;//名称
	pos:Array<Array<number>>;//位置
}

/**
 * 障碍物
 */
export class obstaclesConf
{
	name:string;//名称
	pos:Array<Array<number>>;//位置
	model:string;
}

/**
 * 升级配置表
 */
export class UpgradeConf
{
	id:number;//名称
	coin:number;//位置
	ret:{atk:string,coin:number,def:string};
}

/***
 * 背包配置表
 */

 export class SkinConf
 {
	 id:number;//编号
	 icon2:string;//图片地址
	 res:string;//
 }

 export class SkinProp
 {
	 id:number;//编号
	 index:number;
	 typ:number;
 }


export namespace cval {

	class Table {
		dict: { [key: string]: any }
		constructor() {
			this.dict = {};
		}
		readData(key, data: any) {
			this.dict[key] = data;
		}

		getTableData<T>(key: string, id: any):T {
			return this.dict[key][id];
		}
		getTable(key: string) {
			return this.dict[key];
		}

		/**
		 * 
		 * @param key 是否加载
		 */
		IsLoad(key:string)
		{
			if(this.dict[key])
			{
				return false
			}
			return true;
		}
	}
	export var table: Table = new Table();
}
