import rab from "../../rab/rab";
import GameController from "../GameController";
import GameNotity from "../GameNotity";
import { buildProp } from "../GameVO/DataType";
import ObstacleItem from "./ObstacleItem";

export default class ObstacleManager extends rab.GameObject {

    private scene3D: Laya.Scene3D;
    private manager: GameController;
    private _buildProp:buildProp;
    private _baseobstacles:Map<number,Laya.Sprite3D> = new Map<number,Laya.Sprite3D>();
    private _initPos:number;
    private _obstacles:Array<ObstacleItem> = new Array<ObstacleItem>();
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
    onCreateobstacle(data:buildProp,posz:number)
    {
        this._initPos = posz;
        let obstacle = [];
        let arr = data.obstacle;
        this._buildProp = data;
        for(var i = 0;i<arr.length;i++)
        {
            if(!this._baseobstacles[arr[i]])
            {
                this._baseobstacles[arr[i]] = Laya.loader.getRes("3d/prefab/Conventional/"+this.manager.jsonConfig.getObstacleData(arr[i]).res+".lh");
            }
        }
        if(Math.random() > 0.2)
        {
            this.createNextOb();
        }
    }

    createNextOb()
    {
        let ObstacleID = this._buildProp.obstacle[Math.floor(Math.random()*this._buildProp.obstacle.length)];
        let obstacle:Laya.Sprite3D = Laya.Pool.getItem("ObstacleID"+ObstacleID);
        let obstacleProp:ObstacleItem;
        if(!obstacle)
        {
            obstacle = this.instantiate(this._baseobstacles[ObstacleID],null,false,new Laya.Vector3(0, 0, this._initPos));
            obstacleProp = obstacle.addComponent(ObstacleItem);
        }else{
            obstacle.transform.localPositionZ = this._initPos;
            obstacleProp = obstacle.getComponent(ObstacleItem);
        }
        this._obstacles.push(obstacleProp);
        obstacleProp.onInitProp(this.manager.jsonConfig.getObstacleData(ObstacleID));
        if(this.manager.jsonConfig.getObstacleData(ObstacleID).pos == 1)
        {
            obstacle.transform.localPositionX = 0;
        }else{
            if(Math.random() < 0.3)
            {
                obstacle.transform.localPositionX = 1.2;
            }else if(Math.random() < 0.6)
            {
                obstacle.transform.localPositionX = 0;
            }else
            {
                obstacle.transform.localPositionX = -1.2;
            }
            
        }
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
        for(var i =0;i<this._buildProp.obstacle.length;i++)
        {
            Laya.Pool.clearBySign("ObstacleID"+this._buildProp.obstacle[i]);
        }
        this._baseobstacles.clear();
    }

    onGameReStart()
    {
        this.onClearAll();
    }
    
}