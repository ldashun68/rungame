import rab from "../../rab/rab";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import { buildProp } from "../GameVO/DataType";
import ObstacleItem from "./ObstacleItem";
import ObstacleSimple from "./ObstacleSimple";

export default class ObstacleManager extends rab.GameObject {

    private scene3D: Laya.Scene3D;
    private manager: GameController;
    private _buildProp:buildProp;
    private _baseobstacles:Map<number,Laya.Sprite3D> = new Map<number,Laya.Sprite3D>();
    private _initPos:number;
    private _obstacles:Array<ObstacleItem> = new Array<ObstacleItem>();
    private obstaclesID: number = 0;
    private randomX: number = 0;

    onInit(): void {
        this.AddListenerMessage(GameNotity.Game_RemoveScene,this.onReMoveScene)
        // this.AddListenerMessage(GameNotity.GameMessage_Revive,this.onGameRevive)
        this.AddListenerMessage(GameNotity.GameMessage_ReGameStart,this.onGameReStart)
    }

    /**初始化 */
    public init (): void {
        this.scene3D = this.owner as Laya.Scene3D;
        this.manager = rab.RabGameManager.getInterest().getMyManager();
    }

    /**
     * 创建一个障碍物
     */
    onCreateobstacle(data:buildProp, posZ:number)
    {
        console.log("创建一个障碍物", posZ);
        this._initPos = posZ+data.length;
        let arr = data.obstacle;
        this._buildProp = data;

        for(var i = 0;i<arr.length;i++) {
            if(!this._baseobstacles[arr[i]]) {
                this._baseobstacles[arr[i]] =
                Laya.loader.getRes("3d/prefab/Conventional/"+this.manager.jsonConfig.getObstacleData(arr[i]).res+".lh");
            }
        }
        let ObstacleID = this.obstaclesID;
        this.obstaclesID = this._buildProp.obstacle[Math.floor(Math.random()*this._buildProp.obstacle.length)];
        //let ObstacleID = this._buildProp.obstacle[0];
        while (this.obstaclesID == ObstacleID && (this.obstaclesID == 10 || this.obstaclesID == 100)) {
            this.obstaclesID = this._buildProp.obstacle[Math.floor(Math.random()*this._buildProp.obstacle.length)];
        }

        let randomX: number = this.randomX;
        while (randomX == this.randomX) {
            if(Math.random() < 0.3) {
                this.randomX = 0;
            }
            else if(Math.random() < 0.6) {
                this.randomX = 1;
            }
            else {
                this.randomX = 2;
            }
        }

        if (this.obstaclesID == 100) {
            let random: number = Math.round(Math.random()*2+2);
            for(var i = 0; i < random; i++) {
                this.createNextOb();
                this._initPos += 2;
            }
        }
        else {
            this.createNextOb();
        }

        if (this.obstaclesID == 100) {
            this.randomX = randomX;
        }
    }

    createNextOb () {
        let obstacle:Laya.Sprite3D = Laya.Pool.getItem("ObstacleID"+this.obstaclesID);
        let obstacleProp:ObstacleItem;
        if(!obstacle) {
            obstacle = this.instantiate(this._baseobstacles[this.obstaclesID],null,true,new Laya.Vector3(0, 0, this._initPos));
            obstacleProp = obstacle.addComponent(ObstacleSimple);
        }
        else {
            obstacle.transform.localPositionZ = this._initPos;
            obstacleProp = obstacle.getComponent(ObstacleSimple);
        }
        this.scene3D.addChild(obstacle);
        this._obstacles.push(obstacleProp);
        console.log("创建好了障碍物", this.obstaclesID);
        
        obstacle.transform.localPosition = new Laya.Vector3(0, 0, this._initPos);
        obstacleProp.onInitProp(this.manager.jsonConfig.getObstacleData(this.obstaclesID), this.randomX);
        obstacle.active = true;
    }

    public SpawnCoinAndPowerup()
	{
		// const increment = 1.5
		// let currentWorldPos = 0.0
		// let currentLane = Math.random()*3;

		// let powerupChance = Math.clamp01(Math.floor(m_TimeSincePowerup) * 0.5 * 0.001);
		// let premiumChance = Math.Clamp01(Math.floor(m_TimeSinceLastPremium) * 0.5 * 0.0001);

		// while (currentWorldPos < this._buildProp.length)
		// {
		// 	let pos;
		// 	let rot;


		// 	let laneValid = true;
		// 	let testedLane = currentLane;

		// 	currentLane = testedLane;

		// 	if(laneValid)
		// 	{
		// 		pos = pos + ((currentLane - 1) * laneOffset * (rot * Vector3.right));


        //         GameObject toUse;
		// 		if (Math.random() < powerupChance)
		// 		{
        //             int picked = Random.Range(0, consumableDatabase.consumbales.Length);

        //             //if the powerup can't be spawned, we don't reset the time since powerup to continue to have a high chance of picking one next track segment
        //             if (consumableDatabase.consumbales[picked].canBeSpawned)
        //             {
        //                 // Spawn a powerup instead.
        //                 m_TimeSincePowerup = 0.0f;
        //                 powerupChance = 0.0f;

        //                 toUse = Instantiate(consumableDatabase.consumbales[picked].gameObject, pos, rot) as GameObject;
        //                 toUse.transform.SetParent(segment.transform, true);
        //             }
		// 		}
		// 		else if (Math.random() < premiumChance)
		// 		{
		// 			m_TimeSinceLastPremium = 0.0f;
		// 			premiumChance = 0.0f;

		// 			toUse = Instantiate(currentTheme.premiumCollectible, pos, rot);
		// 			toUse.transform.SetParent(segment.transform, true);
		// 		}
		// 		else
		// 		{
		// 			toUse = Coin.coinPool.Get(pos, rot);
		// 		}

				
		// 	}

		// 	currentWorldPos += increment;
		// }

	}

    onClearAll()
    {
        for(var i =0;i<this._obstacles.length;i++)
        {
            this._obstacles[i].recover();
        }
        this._obstacles=[];
    }

    onReMoveScene()
    {
        this.onClearAll();
        for(var i = 0; i < this._buildProp.obstacle.length; i++)
        {
            Laya.Pool.clearBySign("ObstacleID"+this._buildProp.obstacle[i]);
        }
        this._baseobstacles.clear();
    }

    onGameReStart()
    {
        //this.onClearAll();
    }
    
}