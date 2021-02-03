/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.view {
    export class GameUI extends Scene {
		public cloudNode:Laya.Sprite;
		public pendantNode:Laya.Image;
		public lifeNode:Laya.Image;
		public lifeText:Laya.FontClip;
		public coinNode:Laya.Image;
		public coinText:Laya.FontClip;
		public progressNode:Laya.Image;
		public currentPassText:Laya.FontClip;
		public nextPassText:Laya.FontClip;
		public progress_b:Laya.Image;
		public progress_m:Laya.Image;
		public progress_t:Laya.Image;
		public pauseBtn:Laya.Image;
		public mapName:Laya.Label;
		public timeTxt:Laya.FontClip;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"top":0,"right":0,"name":"Game","left":0,"height":1334,"centerY":0,"centerX":0,"bottom":0},"compId":2,"child":[{"type":"Script","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":53},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cloudNode","name":"cloudNode","height":1334},"compId":274},{"type":"Image","props":{"y":135,"x":375,"width":750,"var":"pendantNode","name":"pendantNode","height":230,"anchorY":0.5,"anchorX":0.5},"compId":248,"child":[{"type":"Image","props":{"y":164,"x":120,"var":"lifeNode","skin":"ui/coinBg1.png","name":"lifeNode","anchorY":0.5,"anchorX":0.5},"compId":249,"child":[{"type":"Image","props":{"y":41.5,"x":65.5,"skin":"ui/redPoint.png","anchorY":0.5,"anchorX":0.5},"compId":250},{"type":"FontClip","props":{"y":37,"x":162,"var":"lifeText","value":"0","skin":"ui/coinNum.png","sheet":"0123456789","name":"lifeText","anchorY":0.5,"anchorX":0.5},"compId":251}]},{"type":"Image","props":{"y":253,"x":120,"var":"coinNode","skin":"ui/coinBg1.png","anchorY":0.5,"anchorX":0.5},"compId":275,"child":[{"type":"Image","props":{"y":41.5,"x":65.5,"skin":"ui/coin1.png","anchorY":0.5,"anchorX":0.5},"compId":276},{"type":"FontClip","props":{"y":37,"x":162,"var":"coinText","value":"0","skin":"ui/coinNum.png","sheet":"0123456789","name":"coinText","anchorY":0.5,"anchorX":0.5},"compId":277}]},{"type":"Image","props":{"y":50,"x":375,"width":300,"var":"progressNode","name":"progressNode","height":100,"anchorY":0.5,"anchorX":0.5},"compId":252,"child":[{"type":"Image","props":{"y":58,"x":29,"skin":"ui/grayBox.png","name":"currentPass","anchorY":0.5,"anchorX":0.5},"compId":255},{"type":"Image","props":{"y":58,"x":271,"skin":"ui/grayBox.png","name":"nextPass","anchorY":0.5,"anchorX":0.5},"compId":256},{"type":"FontClip","props":{"y":58,"x":29,"var":"currentPassText","value":"10","skin":"ui/passNum.png","sheet":"0123456789/","scaleY":1.2,"scaleX":1.2,"name":"currentPassText","anchorY":0.5,"anchorX":0.5},"compId":257},{"type":"FontClip","props":{"y":58,"x":271,"var":"nextPassText","value":"11","skin":"ui/passNum.png","sheet":"0123456789/","scaleY":1.2,"scaleX":1.2,"name":"nextPassText","anchorY":0.5,"anchorX":0.5},"compId":258},{"type":"Image","props":{"y":44.5,"x":54,"var":"progress_b","skin":"ui/load1.png","name":"progress_b"},"compId":259,"child":[{"type":"Image","props":{"y":0,"x":2,"var":"progress_m","skin":"ui/load1.png","scaleX":0.98,"renderType":"mask","name":"progress_m"},"compId":262},{"type":"Image","props":{"y":15,"x":2,"var":"progress_t","skin":"ui/load2.png","scaleY":0.95,"name":"progress_t","anchorY":0.5,"anchorX":1},"compId":260}]},{"type":"Image","props":{"y":57,"x":-147,"var":"pauseBtn","skin":"ui/pauseBtn.png","name":"pauseBtn","anchorY":0.5,"anchorX":0.5},"compId":263},{"type":"Label","props":{"y":10,"var":"mapName","text":"场景名称","fontSize":30,"color":"#ffffff","centerX":0,"bold":true},"compId":278}]}]},{"type":"FontClip","props":{"var":"timeTxt","value":"3","skin":"ui/failNum.png","sheet":"0123456789","centerY":0,"centerX":0,"align":"center"},"compId":279}],"loadList":["ui/coinBg1.png","ui/redPoint.png","ui/coinNum.png","ui/coin1.png","ui/grayBox.png","ui/passNum.png","ui/load1.png","ui/load2.png","ui/pauseBtn.png","ui/failNum.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameUI.uiView);
        }
    }
    REG("ui.view.GameUI",GameUI);
    export class GameFailUI extends Scene {
		public resrart:Laya.Image;
		public restartTxt:Laya.Label;
		public continue:Laya.Image;
		public continueTxt:Laya.Label;
		public home:Laya.Image;
		public breakHomeTxt:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"GameFail","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"height":2000,"alpha":0.75},"compId":43,"child":[{"type":"Rect","props":{"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":45}]},{"type":"Image","props":{"y":667,"width":300,"var":"resrart","skin":"ui/btn_blue_small2.png","height":102,"centerX":0},"compId":53,"child":[{"type":"Label","props":{"var":"restartTxt","text":"重新开始","fontSize":50,"centerY":0,"centerX":0},"compId":54}]},{"type":"Image","props":{"y":494,"width":300,"var":"continue","skin":"ui/btn_blue_small2.png","height":102,"centerX":0},"compId":51,"child":[{"type":"Label","props":{"var":"continueTxt","text":"继续游戏","fontSize":50,"centerY":0,"centerX":0},"compId":52}]},{"type":"Image","props":{"y":816,"width":300,"var":"home","skin":"ui/btn_blue_small2.png","height":102,"centerX":0},"compId":55,"child":[{"type":"Label","props":{"var":"breakHomeTxt","text":"回到主菜单","fontSize":50,"centerY":0,"centerX":0},"compId":56}]}],"loadList":["ui/btn_blue_small2.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameFailUI.uiView);
        }
    }
    REG("ui.view.GameFailUI",GameFailUI);
    export class GameSetUI extends Scene {
		public cover:Laya.Sprite;
		public window:Laya.Image;
		public closeBtn:Laya.Image;
		public soundClose:Laya.Image;
		public soundOpen:Laya.Image;
		public soundCloseText:Laya.Label;
		public soundOpenText:Laya.Label;
		public vibrateClose:Laya.Image;
		public vibrateOpen:Laya.Image;
		public vibrateCloseText:Laya.Label;
		public vibrateOpenText:Laya.Label;
		public list:Laya.List;
		public shareBtn:Laya.Image;
		public followBtn:Laya.Image;
		public subscribeBtn:Laya.Image;
		public collectIImage:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"GameSet","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cover","name":"cover","height":1334,"alpha":0.75},"compId":43,"child":[{"type":"Rect","props":{"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":45},{"type":"Script","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":16}]},{"type":"Image","props":{"y":667,"x":375,"width":750,"visible":false,"var":"window","name":"window","mouseThrough":true,"height":1000,"anchorY":0.5,"anchorX":0.5},"compId":24,"child":[{"type":"Script","props":{"right":0,"left":0,"centerY":0,"runtime":"laya.ui.Widget"},"compId":25},{"type":"Image","props":{"y":91,"x":375,"skin":"ui/bg_5.png","sizeGrid":"100,20,20,20","height":680,"anchorX":0.5},"compId":50,"child":[{"type":"Image","props":{"y":48,"x":618,"var":"closeBtn","skin":"ui/closeBtn.png","name":"closeBtn","anchorY":0.5,"anchorX":0.5},"compId":51},{"type":"Image","props":{"y":47,"x":330,"skin":"ui/setText.png","anchorY":0.5,"anchorX":0.5},"compId":58},{"type":"Image","props":{"y":212,"x":330,"width":600,"skin":"ui/bg_8.png","sizeGrid":"15,15,15,15","height":200,"anchorY":0.5,"anchorX":0.5},"compId":59},{"type":"Image","props":{"y":168,"x":126,"skin":"ui/soundText.png","anchorY":0.5,"anchorX":0.5},"compId":60},{"type":"Image","props":{"y":171,"x":409,"width":341,"skin":"ui/load5.png","sizeGrid":"0,15,0,15","name":"sound","anchorY":0.5,"anchorX":0.5},"compId":61,"child":[{"type":"Image","props":{"y":20,"x":86,"var":"soundClose","skin":"ui/load3.png","name":"soundClose","anchorY":0.5,"anchorX":0.5},"compId":62},{"type":"Image","props":{"y":20,"x":255,"var":"soundOpen","skin":"ui/load4.png","name":"soundOpen","anchorY":0.5,"anchorX":0.5},"compId":63},{"type":"Label","props":{"y":21,"x":86,"width":166,"var":"soundCloseText","valign":"middle","text":"关","strokeColor":"#080808","stroke":3,"name":"soundCloseText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":64},{"type":"Label","props":{"y":21,"x":255,"width":166,"var":"soundOpenText","valign":"middle","text":"开","strokeColor":"#080808","stroke":3,"name":"soundOpenText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":65}]},{"type":"Image","props":{"y":253,"x":126,"skin":"ui/vibrateText.png","anchorY":0.5,"anchorX":0.5},"compId":71},{"type":"Image","props":{"y":256,"x":409,"width":341,"skin":"ui/load5.png","sizeGrid":"0,15,0,15","name":"vibrate","anchorY":0.5,"anchorX":0.5},"compId":72,"child":[{"type":"Image","props":{"y":20,"x":86,"var":"vibrateClose","skin":"ui/load3.png","name":"vibrateClose","anchorY":0.5,"anchorX":0.5},"compId":73},{"type":"Image","props":{"y":20,"x":255,"var":"vibrateOpen","skin":"ui/load4.png","name":"vibrateOpen","anchorY":0.5,"anchorX":0.5},"compId":74},{"type":"Label","props":{"y":21,"x":86,"width":166,"var":"vibrateCloseText","valign":"middle","text":"关","strokeColor":"#080808","stroke":3,"name":"vibrateCloseText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":75},{"type":"Label","props":{"y":21,"x":255,"width":166,"var":"vibrateOpenText","valign":"middle","text":"开","strokeColor":"#080808","stroke":3,"name":"vibrateOpenText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":76}]},{"type":"List","props":{"y":419,"x":330,"width":600,"var":"list","spaceX":25,"repeatY":1,"repeatX":5,"name":"list","height":100,"anchorY":0.5,"anchorX":0.5},"compId":79,"child":[{"type":"Box","props":{"y":50,"x":50,"width":100,"renderType":"render","name":"render","height":100,"anchorY":0.5,"anchorX":0.5},"compId":78,"child":[{"type":"Image","props":{"y":50,"x":50,"width":100,"skin":"ui/bg_7.png","sizeGrid":"15,15,17,15","height":100,"anchorY":0.5,"anchorX":0.5},"compId":81}]},{"type":"HScrollBar","props":{"name":"scrollBar"},"compId":80}]},{"type":"Image","props":{"y":585,"x":495.5,"var":"shareBtn","skin":"ui/btn_yellow_small.png","name":"shareBtn","anchorY":0.5,"anchorX":0.5},"compId":82,"child":[{"type":"Image","props":{"y":55,"x":144,"skin":"ui/shareText.png","anchorY":0.5,"anchorX":0.5},"compId":83}]},{"type":"Image","props":{"y":601,"x":104,"width":150,"var":"followBtn","skin":"ui/btn_blue_small2.png","name":"followBtn","height":80,"anchorY":0.5,"anchorX":0.5},"compId":84,"child":[{"type":"Image","props":{"y":40,"x":75,"skin":"ui/followText.png","anchorY":0.5,"anchorX":0.5},"compId":85}]},{"type":"Image","props":{"y":601,"x":267,"width":150,"var":"subscribeBtn","skin":"ui/btn_blue_small2.png","name":"subscribeBtn","height":80,"anchorY":0.5,"anchorX":0.5},"compId":86,"child":[{"type":"Image","props":{"y":40,"x":75,"skin":"ui/subscribeText.png","anchorY":0.5,"anchorX":0.5},"compId":87}]}]}]},{"type":"Image","props":{"y":0,"x":0,"width":750,"visible":false,"var":"collectIImage","name":"collectIImage","height":2000},"compId":88,"child":[{"type":"Sprite","props":{"y":0,"x":0,"alpha":0.75},"compId":89,"child":[{"type":"Rect","props":{"y":0,"x":0,"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":90}]},{"type":"Image","props":{"y":638,"x":375,"skin":"ui/collectIImage.png","anchorY":0.5,"anchorX":0.5},"compId":91},{"type":"Image","props":{"y":190,"x":693,"skin":"ui/closeBtn.png","name":"closeBtn","anchorY":0.5,"anchorX":0.5},"compId":92}]}],"loadList":["ui/bg_5.png","ui/closeBtn.png","ui/setText.png","ui/bg_8.png","ui/soundText.png","ui/load5.png","ui/load3.png","ui/load4.png","ui/vibrateText.png","ui/bg_7.png","ui/btn_yellow_small.png","ui/shareText.png","ui/btn_blue_small2.png","ui/followText.png","ui/subscribeText.png","ui/collectIImage.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameSetUI.uiView);
        }
    }
    REG("ui.view.GameSetUI",GameSetUI);
    export class GameWinUI extends Scene {
		public bg:Laya.Image;
		public winNode:Laya.Image;
		public award:Laya.Image;
		public coinText:Laya.FontClip;
		public next:Laya.Image;
		public nextTxt:Laya.Label;
		public homeBtn:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"y":0,"x":0,"width":750,"name":"GameWin","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Image","props":{"var":"bg","top":0,"skin":"ui/bg_1.jpg","right":0,"name":"bg","left":0,"bottom":0},"compId":15},{"type":"Image","props":{"zOrder":1,"var":"winNode","top":0,"right":0,"name":"winNode","left":0,"bottom":0,"anchorX":0.5},"compId":24,"child":[{"type":"Image","props":{"visible":false,"var":"award","name":"award","centerY":0,"centerX":0,"anchorX":0.5},"compId":33,"child":[{"type":"Image","props":{"y":55,"skin":"ui/coin1.png","centerX":-100,"anchorY":0.5,"anchorX":0.5},"compId":35},{"type":"FontClip","props":{"y":55,"var":"coinText","value":"2000","skin":"ui/coinNum.png","sheet":"0123456789","scaleY":1.2,"scaleX":1.2,"name":"coinText","centerX":23,"anchorY":0.5,"anchorX":0},"compId":36},{"type":"Label","props":{"y":30,"text":"+","strokeColor":"#000000","stroke":3,"fontSize":55,"font":"SimHei","color":"#ffffff","centerX":-60,"bold":true},"compId":37}]},{"type":"Image","props":{"y":938,"visible":false,"var":"next","skin":"ui/btn_yellow_small.png","name":"next","centerX":0,"anchorY":0.5,"anchorX":0.5},"compId":18,"child":[{"type":"Label","props":{"var":"nextTxt","text":"下一关","fontSize":50,"centerY":0,"centerX":0},"compId":53}]},{"type":"Image","props":{"y":938,"x":129,"visible":false,"var":"homeBtn","skin":"ui/grayBox.png","name":"homeBtn","anchorY":0.5,"anchorX":0.5},"compId":20}]}],"loadList":["ui/bg_1.jpg","ui/coin1.png","ui/coinNum.png","ui/btn_yellow_small.png","ui/grayBox.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameWinUI.uiView);
        }
    }
    REG("ui.view.GameWinUI",GameWinUI);
    export class GetTicketUI extends Scene {
		public cover:Laya.Sprite;
		public window:Laya.Image;
		public closeBtn:Laya.Image;
		public currentTIcketText:Laya.FontClip;
		public getTicketBtn:Laya.Image;
		public getTicketText:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"GetTicket","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cover","name":"cover","height":1334,"alpha":0.75},"compId":43,"child":[{"type":"Rect","props":{"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":45},{"type":"Script","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":16}]},{"type":"Image","props":{"y":667,"x":375,"width":750,"mouseThrough":true,"height":1000,"anchorY":0.5,"anchorX":0.5},"compId":24,"child":[{"type":"Script","props":{"right":0,"left":0,"centerY":0,"runtime":"laya.ui.Widget"},"compId":25},{"type":"Image","props":{"y":375,"x":375,"width":660,"visible":false,"var":"window","skin":"ui/bg_5.png","name":"window","height":571,"anchorY":0.5,"anchorX":0.5},"compId":50,"child":[{"type":"Image","props":{"y":48,"x":618,"var":"closeBtn","skin":"ui/closeBtn.png","name":"closeBtn","anchorY":0.5,"anchorX":0.5},"compId":51},{"type":"Image","props":{"y":47,"x":330,"skin":"ui/getTicketText.png","anchorY":0.5,"anchorX":0.5},"compId":57},{"type":"Image","props":{"y":259,"x":330,"skin":"ui/bg_4.png","anchorY":0.5,"anchorX":0.5},"compId":52},{"type":"Image","props":{"y":244,"x":330,"skin":"ui/light3.png","scaleY":1.5,"scaleX":1.5,"anchorY":0.5,"anchorX":0.5},"compId":53},{"type":"Image","props":{"y":244,"x":330,"skin":"ui/ticket2.png","anchorY":0.5,"anchorX":0.5},"compId":58},{"type":"FontClip","props":{"y":365,"x":330,"var":"currentTIcketText","value":"30/30","skin":"ui/passNum.png","sheet":"0123456789/","scaleY":1.5,"scaleX":1.5,"name":"currentTIcketText","anchorY":0.5,"anchorX":0.5},"compId":54},{"type":"Image","props":{"y":495,"x":330,"var":"getTicketBtn","skin":"ui/btn_blue_small.png","name":"getTicketBtn","anchorY":0.5,"anchorX":0.5},"compId":55,"child":[{"type":"Label","props":{"y":56.5,"x":141.5,"var":"getTicketText","text":"领取15点体力","strokeColor":"#8b8b8b","stroke":3,"name":"getTicketText","fontSize":40,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5},"compId":56}]}]}]}],"loadList":["ui/bg_5.png","ui/closeBtn.png","ui/getTicketText.png","ui/bg_4.png","ui/light3.png","ui/ticket2.png","ui/passNum.png","ui/btn_blue_small.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GetTicketUI.uiView);
        }
    }
    REG("ui.view.GetTicketUI",GetTicketUI);
    export class LoadingUI extends Scene {
		public bg:Laya.Image;
		public logo:Laya.Image;
		public boxProgress:Laya.Box;
		public imgProgress:Laya.Image;
		public lbProgress:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"Loading","height":1334,"centerY":0,"centerX":0},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":15},{"type":"Image","props":{"var":"bg","top":0,"skin":"load/bg.jpg","right":0,"left":0,"bottom":0,"anchorX":0.5},"compId":4,"child":[{"type":"Image","props":{"y":645,"x":350,"var":"logo","skin":"load/logo.png","anchorY":0.5,"anchorX":0.5},"compId":12}]},{"type":"Box","props":{"x":200,"var":"boxProgress","right":200,"left":200,"height":41,"bottom":320},"compId":9,"child":[{"type":"Image","props":{"width":350,"top":5,"skin":"load/bar1.png","sizeGrid":"0,20,0,20","right":0,"left":0,"height":27,"bottom":9},"compId":10},{"type":"Image","props":{"y":8,"x":5,"width":340,"var":"imgProgress","skin":"load/bar2.png","sizeGrid":"0,20,0,20","height":20},"compId":11}]},{"type":"Label","props":{"var":"lbProgress","text":"Progress","fontSize":22,"color":"#f9f9f9","centerX":0,"bottom":298},"compId":7}],"loadList":["load/bg.jpg","load/logo.png","load/bar1.png","load/bar2.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(LoadingUI.uiView);
        }
    }
    REG("ui.view.LoadingUI",LoadingUI);
    export class NotClickUI extends Scene {
		public bg:Laya.Image;
		public click:Laya.Image;
		public loadNode:Laya.Image;
		public loadText:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"NotClick","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Image","props":{"var":"bg","top":0,"skin":"ui/bg_1.jpg","right":0,"left":0,"bottom":0},"compId":28},{"type":"Image","props":{"var":"click","top":0,"right":0,"name":"click","left":0,"bottom":0},"compId":24},{"type":"Image","props":{"width":200,"visible":false,"var":"loadNode","skin":"ui/grayBox.png","sizeGrid":"15,15,15,15","name":"loadNode","height":75,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5},"compId":26,"child":[{"type":"Label","props":{"y":37.5,"x":23,"var":"loadText","text":"加载中...","strokeColor":"#2c2c2c","stroke":2,"name":"loadText","fontSize":40,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0},"compId":27}]}],"loadList":["ui/bg_1.jpg","ui/grayBox.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(NotClickUI.uiView);
        }
    }
    REG("ui.view.NotClickUI",NotClickUI);
    export class PauseUI extends Scene {
		public bg:Laya.Image;
		public continueBtn:Laya.Image;
		public exitBtn:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"Pause","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"height":2000,"alpha":0.5},"compId":24,"child":[{"type":"Rect","props":{"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":23}]},{"type":"Image","props":{"width":750,"var":"bg","skin":"ui/bg_2.png","name":"bg","height":1334},"compId":15},{"type":"Image","props":{"y":676,"x":375,"var":"continueBtn","skin":"ui/btn_yellow_small.png","name":"continueBtn","anchorY":0.5,"anchorX":0.5},"compId":18,"child":[{"type":"Image","props":{"y":53.5,"x":141.5,"skin":"ui/continueText.png","scaleY":1.1,"scaleX":1.1,"anchorY":0.5,"anchorX":0.5},"compId":19}]},{"type":"Image","props":{"y":829,"x":375,"var":"exitBtn","text":"退出","strokeColor":"#2c2c2c","stroke":1,"skin":"ui/exitText.png","name":"exitBtn","fontSize":40,"font":"SimHei","color":"#2c2c2c","anchorY":0.5,"anchorX":0.5},"compId":20},{"type":"Image","props":{"y":466,"x":375,"skin":"ui/pauseText.png","scaleY":1.1,"scaleX":1.1,"anchorX":0.5},"compId":22}],"loadList":["ui/bg_2.png","ui/btn_yellow_small.png","ui/continueText.png","ui/exitText.png","ui/pauseText.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(PauseUI.uiView);
        }
    }
    REG("ui.view.PauseUI",PauseUI);
    export class PendantUI extends Scene {
		public ticketBox:Laya.Image;
		public coinBox:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"Pendant","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Image","props":{"y":54,"x":134,"width":180,"var":"ticketBox","skin":"ui/grayBox.png","sizeGrid":"10,10,10,10","name":"ticketBox","height":50,"anchorY":0.5,"anchorX":0.5},"compId":4,"child":[{"type":"Image","props":{"y":-1,"x":-24.5},"compId":6},{"type":"Image","props":{"y":-4,"x":159.5},"compId":7},{"type":"Label","props":{"y":27,"x":98.9267578125,"text":"10:00","strokeColor":"#000000","stroke":2,"name":"timeText","fontSize":30,"color":"#ffffff","anchorY":0.5,"anchorX":0.5},"compId":9},{"type":"FontClip","props":{"y":46,"x":15.9267578125,"value":"30","skin":"ui/coinNum.png","sheet":"0123456789","scaleY":0.8,"scaleX":0.8,"name":"text","anchorY":0.5,"anchorX":0.5},"compId":15}]},{"type":"Image","props":{"y":54,"x":370,"width":180,"var":"coinBox","skin":"ui/grayBox.png","sizeGrid":"10,10,10,10","name":"coinBox","height":50,"anchorY":0.5,"anchorX":0.5},"compId":10,"child":[{"type":"Image","props":{"y":-4,"x":-23.5,"skin":"ui/coin1.png"},"compId":11},{"type":"Image","props":{"y":-4,"x":159.5},"compId":12},{"type":"Label","props":{"y":27,"x":98.9267578125,"text":"100 万","strokeColor":"#000000","stroke":2,"name":"text","fontSize":30,"color":"#ffffff","anchorY":0.5,"anchorX":0.5},"compId":13}]}],"loadList":["ui/grayBox.png","ui/coinNum.png","ui/coin1.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(PendantUI.uiView);
        }
    }
    REG("ui.view.PendantUI",PendantUI);
    export class PlatformUI extends Scene {
		public set:Laya.Image;
		public setTxt:Laya.Label;
		public lan:Laya.Image;
		public lanTxt:Laya.Label;
		public rank:Laya.Image;
		public rankTxt:Laya.Label;
		public pic:Laya.Image;
		public picTxt:Laya.Label;
		public startBtn:Laya.Image;
		public startTxt:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"runtime":"runtime/ImgEffect.ts","name":"Platform","height":1334,"centerY":0,"centerX":0},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":119},{"type":"Image","props":{"top":0,"skin":"ui/bg_1.jpg","right":0,"left":0,"bottom":0},"compId":127},{"type":"Image","props":{"right":0,"left":0,"bottom":300,"anchorY":1,"anchorX":0.5},"compId":130,"child":[{"type":"Image","props":{"y":0,"x":390,"width":150,"var":"set","skin":"ui/btn_blue_small2.png","height":102},"compId":255,"child":[{"type":"Label","props":{"var":"setTxt","text":"设置","fontSize":40,"centerY":0,"centerX":0},"compId":256}]},{"type":"Image","props":{"y":0,"x":565,"width":150,"var":"lan","skin":"ui/btn_blue_small2.png","height":102},"compId":253,"child":[{"type":"Label","props":{"var":"lanTxt","text":"语言","fontSize":40,"centerY":0,"centerX":0},"compId":254}]},{"type":"Image","props":{"y":0,"x":36,"width":150,"var":"rank","skin":"ui/btn_blue_small2.png","height":102},"compId":249,"child":[{"type":"Label","props":{"var":"rankTxt","text":"排行版","fontSize":40,"centerY":0,"centerX":0},"compId":250}]},{"type":"Image","props":{"y":0,"x":212,"width":150,"var":"pic","skin":"ui/btn_blue_small2.png","height":102},"compId":251,"child":[{"type":"Label","props":{"var":"picTxt","text":"照片墙","fontSize":40,"centerY":0,"centerX":0},"compId":252}]}]},{"type":"Image","props":{"var":"startBtn","skin":"ui/btn_start.png","name":"startBtn","centerX":0,"bottom":500,"anchorY":0.5,"anchorX":0.5},"compId":244,"child":[{"type":"Label","props":{"y":0,"x":0,"var":"startTxt","text":"开始游戏","fontSize":60,"color":"#ffffff","centerY":0,"centerX":0,"bold":true},"compId":257}]}],"loadList":["ui/bg_1.jpg","ui/btn_blue_small2.png","ui/btn_start.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(PlatformUI.uiView);
        }
    }
    REG("ui.view.PlatformUI",PlatformUI);
    export class RoleSelectUI extends Scene {
		public cloudNode:Laya.Sprite;
		public break:Laya.Image;
		public breakTxt:Laya.Label;
		public titleTxt:Laya.Label;
		public roleTxt:Laya.Label;
		public r2:Laya.Image;
		public r1:Laya.Image;
		public r3:Laya.Image;
		public r4:Laya.Image;
		public startBtn:Laya.Image;
		public startTxt:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cloudNode","name":"cloudNode","height":1334},"compId":4},{"type":"Image","props":{"y":62,"x":36,"var":"break","skin":"ui/btn_blue_small2.png"},"compId":22,"child":[{"type":"Label","props":{"var":"breakTxt","text":"返回","fontSize":45,"centerY":0,"centerX":0},"compId":38}]},{"type":"Label","props":{"var":"titleTxt","top":100,"text":"角色选择","fontSize":80,"centerX":0,"bold":true},"compId":23},{"type":"Label","props":{"var":"roleTxt","top":200,"text":"滑动旋转","fontSize":45,"centerX":0},"compId":35},{"type":"Image","props":{"var":"r2","skin":"role/box.png","centerX":-60,"bottom":100},"compId":26,"child":[{"type":"Image","props":{"skin":"role/r2.png","centerY":0,"centerX":0},"compId":27}]},{"type":"Image","props":{"var":"r1","skin":"role/box.png","centerX":-180,"bottom":100},"compId":24,"child":[{"type":"Image","props":{"skin":"role/r1.png","centerY":0,"centerX":0},"compId":25}]},{"type":"Image","props":{"var":"r3","skin":"role/box.png","centerX":60,"bottom":100},"compId":28,"child":[{"type":"Image","props":{"skin":"role/r3.png","centerY":0,"centerX":0},"compId":29}]},{"type":"Image","props":{"var":"r4","skin":"role/box.png","centerX":180,"bottom":100},"compId":32,"child":[{"type":"Image","props":{"skin":"role/r4.png","centerY":0,"centerX":0},"compId":33}]},{"type":"Image","props":{"var":"startBtn","skin":"ui/btn_start.png","name":"startBtn","centerX":0,"bottom":220,"anchorY":0.5,"anchorX":0.5},"compId":39,"child":[{"type":"Label","props":{"y":0,"x":0,"var":"startTxt","text":"开始游戏","fontSize":60,"color":"#ffffff","centerY":0,"centerX":0,"bold":true},"compId":40}]}],"loadList":["ui/btn_blue_small2.png","role/box.png","role/r2.png","role/r1.png","role/r3.png","role/r4.png","ui/btn_start.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(RoleSelectUI.uiView);
        }
    }
    REG("ui.view.RoleSelectUI",RoleSelectUI);
}