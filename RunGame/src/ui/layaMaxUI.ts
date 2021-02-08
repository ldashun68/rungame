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
		public life_bg:Laya.Image;
		public lifeText:Laya.FontClip;
		public progressNode:Laya.Image;
		public progress_b:Laya.Image;
		public progress_m:Laya.Image;
		public progress_t:Laya.Image;
		public pauseBtn:Laya.Image;
		public iconNode:Laya.Image;
		public icon:Laya.Image;
		public coinNode:Laya.Image;
		public coinText:Laya.FontClip;
		public timeDown:Laya.Image;
		public guild:Laya.Box;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"top":0,"right":0,"name":"Game","left":0,"height":1334,"centerY":0,"centerX":0,"bottom":0},"compId":2,"child":[{"type":"Script","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":53},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cloudNode","name":"cloudNode","height":1334},"compId":274},{"type":"Image","props":{"y":135,"x":375,"width":750,"var":"pendantNode","name":"pendantNode","height":230,"anchorY":0.5,"anchorX":0.5},"compId":248,"child":[{"type":"Image","props":{"y":193,"x":174,"width":290,"var":"lifeNode","skin":"new/game/jingdutiaodi1.png","sizeGrid":"13,13,13,13","name":"lifeNode","height":60,"anchorY":0.5,"anchorX":0.5},"compId":249,"child":[{"type":"Image","props":{"width":290,"var":"life_bg","top":4,"skin":"new/game/jingdutiao1.png","left":4},"compId":281},{"type":"Image","props":{"top":-10,"skin":"new/game/aixin.png","left":-10,"anchorY":0.5,"anchorX":0.5},"compId":250},{"type":"FontClip","props":{"x":162,"var":"lifeText","value":"0","skin":"ui/coinNum.png","sheet":"0123456789","name":"lifeText","centerY":0,"anchorY":0.5,"anchorX":0.5},"compId":251}]},{"type":"Image","props":{"width":540,"var":"progressNode","top":54,"name":"progressNode","height":26,"centerX":60,"anchorY":0.5,"anchorX":0.5},"compId":252,"child":[{"type":"Image","props":{"skin":"new/game/qizhi.png","right":7,"name":"nextPass","centerY":-23,"anchorY":0.5,"anchorX":0.5},"compId":256},{"type":"Image","props":{"width":540,"var":"progress_b","skin":"new/game/jindutiao3.png","sizeGrid":"6,15,6,15","name":"progress_b","height":26,"centerY":0,"centerX":0},"compId":259,"child":[{"type":"Image","props":{"width":540,"var":"progress_m","top":0,"skin":"new/game/jindutiao3.png","sizeGrid":"6,15,6,15","scaleX":0.98,"renderType":"mask","name":"progress_m","left":0,"bottom":0},"compId":262},{"type":"Image","props":{"x":0,"width":540,"var":"progress_t","skin":"new/game/jingdutiao2.png","sizeGrid":"6,15,6,15","scaleY":0.95,"name":"progress_t","centerY":-1,"anchorY":0.5,"anchorX":1},"compId":260}]},{"type":"Image","props":{"y":10,"x":-91,"var":"pauseBtn","skin":"new/com/b_zhanting.png","name":"pauseBtn","anchorY":0.5,"anchorX":0.5},"compId":263},{"type":"Image","props":{"x":340,"var":"iconNode","skin":"new/game/zhi.png","centerY":-13},"compId":286,"child":[{"type":"Image","props":{"var":"icon","skin":"new/game/tou_02.png","centerY":-31,"centerX":0},"compId":287}]}]},{"type":"Image","props":{"y":294,"x":174,"width":290,"var":"coinNode","skin":"new/game/jinbidi.png","sizeGrid":"13,13,13,13","name":"codeNode","height":60,"anchorY":0.5,"anchorX":0.5},"compId":282,"child":[{"type":"Image","props":{"top":-10,"skin":"new/game/jinbi.png","left":-10,"anchorY":0.5,"anchorX":0.5},"compId":284},{"type":"FontClip","props":{"x":162,"var":"coinText","value":"0","skin":"ui/coinNum.png","sheet":"0123456789","centerY":0,"anchorY":0.5,"anchorX":0.5},"compId":285}]}]},{"type":"Image","props":{"var":"timeDown","skin":"new/game/3.png","centerY":-160,"centerX":0},"compId":280},{"type":"Box","props":{"width":750,"var":"guild","right":0,"left":0,"height":308,"bottom":94},"compId":291,"child":[{"type":"Image","props":{"skin":"new/game/jiantou.png","left":74,"centerY":-107},"compId":288},{"type":"Image","props":{"skin":"new/game/jiantou.png","scaleX":-1,"right":185,"centerY":-107},"compId":289},{"type":"Image","props":{"skin":"new/game/t_xzhxyhdjs.png","centerX":12,"bottom":-37},"compId":290}]}],"loadList":["new/game/jingdutiaodi1.png","new/game/jingdutiao1.png","new/game/aixin.png","ui/coinNum.png","new/game/qizhi.png","new/game/jindutiao3.png","new/game/jingdutiao2.png","new/com/b_zhanting.png","new/game/zhi.png","new/game/tou_02.png","new/game/jinbidi.png","new/game/jinbi.png","new/game/3.png","new/game/jiantou.png","new/game/t_xzhxyhdjs.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameUI.uiView);
        }
    }
    REG("ui.view.GameUI",GameUI);
    export class GameFailUI extends Scene {
		public cloudNode:Laya.Sprite;
		public resrart:Laya.Image;
		public share:Laya.Image;
		public home:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"GameFail","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Image","props":{"top":0,"skin":"new/com/beijing.png","left":0},"compId":65,"child":[{"type":"Image","props":{"y":0,"x":529,"skin":"new/com/beijing.png"},"compId":66},{"type":"Image","props":{"y":417,"x":0,"skin":"new/com/beijing.png"},"compId":67},{"type":"Image","props":{"y":417,"x":529,"skin":"new/com/beijing.png"},"compId":68},{"type":"Image","props":{"y":834,"x":0,"skin":"new/com/beijing.png"},"compId":69},{"type":"Image","props":{"y":834,"x":529,"skin":"new/com/beijing.png"},"compId":70},{"type":"Image","props":{"y":1243,"x":0,"skin":"new/com/beijing.png"},"compId":71},{"type":"Image","props":{"y":1243,"x":529,"skin":"new/com/beijing.png"},"compId":72}]},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cloudNode","name":"cloudNode","height":1334},"compId":57},{"type":"Image","props":{"y":1226,"x":375,"var":"resrart","skin":"new/com/bd_cxtz.png","centerX":0,"bottom":41,"anchorY":0.5,"anchorX":0.5},"compId":53},{"type":"Image","props":{"y":1230,"x":609,"var":"share","skin":"new/com/b_fenxiang.png","centerX":234,"bottom":50,"anchorY":0.5,"anchorX":0.5},"compId":51},{"type":"Image","props":{"y":1230,"x":138,"var":"home","skin":"new/com/b_zhuye.png","centerX":-237,"bottom":50,"anchorY":0.5,"anchorX":0.5},"compId":55},{"type":"Image","props":{"top":30,"skin":"new/com/t_tzsb.png","centerX":0},"compId":58},{"type":"VBox","props":{"top":300,"right":0,"left":0,"height":100},"compId":62,"child":[{"type":"Image","props":{"skin":"new/game/jinbi.png","centerY":0,"centerX":-118},"compId":59},{"type":"FontClip","props":{"value":"99999","skin":"ui/failNum.png","sheet":"0123456789","centerY":1,"centerX":44},"compId":61}]}],"loadList":["new/com/beijing.png","new/com/bd_cxtz.png","new/com/b_fenxiang.png","new/com/b_zhuye.png","new/com/t_tzsb.png","new/game/jinbi.png","ui/failNum.png"],"loadList3D":[]};
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
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"GameSet","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cover","name":"cover","height":1334,"alpha":0.75},"compId":43,"child":[{"type":"Rect","props":{"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":45},{"type":"Script","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":16}]},{"type":"Image","props":{"y":667,"x":375,"width":750,"visible":false,"var":"window","name":"window","mouseThrough":true,"height":1000,"anchorY":0.5,"anchorX":0.5},"compId":24,"child":[{"type":"Script","props":{"right":0,"left":0,"centerY":0,"runtime":"laya.ui.Widget"},"compId":25},{"type":"Image","props":{"y":91,"x":375,"skin":"ui/bg_5.png","sizeGrid":"100,20,20,20","height":680,"anchorX":0.5},"compId":50,"child":[{"type":"Image","props":{"y":48,"x":618,"var":"closeBtn","skin":"ui/closeBtn.png","name":"closeBtn","anchorY":0.5,"anchorX":0.5},"compId":51},{"type":"Image","props":{"y":47,"x":330,"skin":"ui/setText.png","anchorY":0.5,"anchorX":0.5},"compId":58},{"type":"Image","props":{"y":212,"x":330,"width":600,"skin":"ui/bg_8.png","sizeGrid":"15,15,15,15","height":200,"anchorY":0.5,"anchorX":0.5},"compId":59},{"type":"Image","props":{"y":168,"x":126,"skin":"ui/soundText.png","anchorY":0.5,"anchorX":0.5},"compId":60},{"type":"Image","props":{"y":171,"x":409,"width":341,"skin":"ui/load5.png","sizeGrid":"0,15,0,15","name":"sound","anchorY":0.5,"anchorX":0.5},"compId":61,"child":[{"type":"Image","props":{"y":20,"x":86,"var":"soundClose","skin":"ui/load3.png","name":"soundClose","anchorY":0.5,"anchorX":0.5},"compId":62},{"type":"Image","props":{"y":20,"x":255,"var":"soundOpen","skin":"ui/load4.png","name":"soundOpen","anchorY":0.5,"anchorX":0.5},"compId":63},{"type":"Label","props":{"y":21,"x":86,"width":166,"var":"soundCloseText","valign":"middle","text":"关","strokeColor":"#080808","stroke":3,"name":"soundCloseText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":64},{"type":"Label","props":{"y":21,"x":255,"width":166,"var":"soundOpenText","valign":"middle","text":"开","strokeColor":"#080808","stroke":3,"name":"soundOpenText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":65}]},{"type":"Image","props":{"y":253,"x":126,"skin":"ui/vibrateText.png","anchorY":0.5,"anchorX":0.5},"compId":71},{"type":"Image","props":{"y":256,"x":409,"width":341,"skin":"ui/load5.png","sizeGrid":"0,15,0,15","name":"vibrate","anchorY":0.5,"anchorX":0.5},"compId":72,"child":[{"type":"Image","props":{"y":20,"x":86,"var":"vibrateClose","skin":"ui/load3.png","name":"vibrateClose","anchorY":0.5,"anchorX":0.5},"compId":73},{"type":"Image","props":{"y":20,"x":255,"var":"vibrateOpen","skin":"ui/load4.png","name":"vibrateOpen","anchorY":0.5,"anchorX":0.5},"compId":74},{"type":"Label","props":{"y":21,"x":86,"width":166,"var":"vibrateCloseText","valign":"middle","text":"关","strokeColor":"#080808","stroke":3,"name":"vibrateCloseText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":75},{"type":"Label","props":{"y":21,"x":255,"width":166,"var":"vibrateOpenText","valign":"middle","text":"开","strokeColor":"#080808","stroke":3,"name":"vibrateOpenText","height":38,"fontSize":30,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"},"compId":76}]},{"type":"List","props":{"y":419,"x":330,"width":600,"var":"list","spaceX":25,"repeatY":1,"repeatX":5,"name":"list","height":100,"anchorY":0.5,"anchorX":0.5},"compId":79,"child":[{"type":"Box","props":{"y":50,"x":50,"width":100,"renderType":"render","name":"render","height":100,"anchorY":0.5,"anchorX":0.5},"compId":78,"child":[{"type":"Image","props":{"y":50,"x":50,"width":100,"skin":"ui/bg_7.png","sizeGrid":"15,15,17,15","height":100,"anchorY":0.5,"anchorX":0.5},"compId":81}]},{"type":"HScrollBar","props":{"name":"scrollBar"},"compId":80}]},{"type":"Image","props":{"y":585,"x":495.5,"var":"shareBtn","skin":"ui/btn_yellow_small.png","name":"shareBtn","anchorY":0.5,"anchorX":0.5},"compId":82},{"type":"Image","props":{"y":601,"x":104,"width":150,"var":"followBtn","skin":"ui/btn_blue_small2.png","name":"followBtn","height":80,"anchorY":0.5,"anchorX":0.5},"compId":84},{"type":"Image","props":{"y":601,"x":267,"width":150,"var":"subscribeBtn","skin":"ui/btn_blue_small2.png","name":"subscribeBtn","height":80,"anchorY":0.5,"anchorX":0.5},"compId":86}]}]},{"type":"Image","props":{"y":0,"x":0,"width":750,"visible":false,"var":"collectIImage","name":"collectIImage","height":2000},"compId":88,"child":[{"type":"Sprite","props":{"y":0,"x":0,"alpha":0.75},"compId":89,"child":[{"type":"Rect","props":{"y":0,"x":0,"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":90}]},{"type":"Image","props":{"y":638,"x":375,"skin":"ui/collectIImage.png","anchorY":0.5,"anchorX":0.5},"compId":91},{"type":"Image","props":{"y":190,"x":693,"skin":"ui/closeBtn.png","name":"closeBtn","anchorY":0.5,"anchorX":0.5},"compId":92}]}],"loadList":["ui/bg_5.png","ui/closeBtn.png","ui/setText.png","ui/bg_8.png","ui/soundText.png","ui/load5.png","ui/load3.png","ui/load4.png","ui/vibrateText.png","ui/bg_7.png","ui/btn_yellow_small.png","ui/btn_blue_small2.png","ui/collectIImage.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(GameSetUI.uiView);
        }
    }
    REG("ui.view.GameSetUI",GameSetUI);
    export class GameWinUI extends Scene {
		public winNode:Laya.Image;
		public award:Laya.Image;
		public coinText:Laya.FontClip;
		public next:Laya.Image;
		public homeBtn:Laya.Image;
		public share:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"y":0,"x":0,"width":750,"name":"GameWin","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Image","props":{"top":0,"skin":"new/com/beijing.png","left":0},"compId":56,"child":[{"type":"Image","props":{"y":0,"x":529,"skin":"new/com/beijing.png"},"compId":57},{"type":"Image","props":{"y":417,"x":0,"skin":"new/com/beijing.png"},"compId":58},{"type":"Image","props":{"y":417,"x":529,"skin":"new/com/beijing.png"},"compId":59},{"type":"Image","props":{"y":834,"x":0,"skin":"new/com/beijing.png"},"compId":60},{"type":"Image","props":{"y":834,"x":529,"skin":"new/com/beijing.png"},"compId":61},{"type":"Image","props":{"y":1243,"x":0,"skin":"new/com/beijing.png"},"compId":62},{"type":"Image","props":{"y":1243,"x":529,"skin":"new/com/beijing.png"},"compId":63}]},{"type":"Image","props":{"zOrder":1,"var":"winNode","top":0,"right":0,"name":"winNode","left":0,"bottom":0,"anchorX":0.5},"compId":24,"child":[{"type":"Image","props":{"visible":false,"var":"award","name":"award","centerY":-377,"centerX":0,"anchorX":0.5},"compId":33,"child":[{"type":"Image","props":{"y":55,"skin":"new/game/jinbi.png","centerX":-100,"anchorY":0.5,"anchorX":0.5},"compId":35},{"type":"FontClip","props":{"y":55,"var":"coinText","value":"2000","skin":"ui/coinNum.png","sheet":"0123456789","scaleY":1.2,"scaleX":1.2,"name":"coinText","centerX":23,"anchorY":0.5,"anchorX":0},"compId":36}]},{"type":"Image","props":{"visible":false,"var":"next","skin":"new/com/bd_xyg.png","name":"next","centerX":0,"bottom":47,"anchorY":0.5,"anchorX":0.5},"compId":18},{"type":"Image","props":{"x":112,"width":100,"visible":false,"var":"homeBtn","skin":"new/com/b_zhuye.png","pivotY":107,"pivotX":22,"name":"homeBtn","height":107,"bottom":54},"compId":54},{"type":"Image","props":{"x":577,"width":100,"visible":false,"var":"share","skin":"new/com/b_fenxiang.png","pivotY":107,"pivotX":22,"height":107,"bottom":47},"compId":20},{"type":"Image","props":{"top":30,"skin":"new/com/t_tzcg.png","centerX":0},"compId":64}]}],"loadList":["new/com/beijing.png","new/game/jinbi.png","ui/coinNum.png","new/com/bd_xyg.png","new/com/b_zhuye.png","new/com/b_fenxiang.png","new/com/t_tzcg.png"],"loadList3D":[]};
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
		public boxProgress:Laya.Box;
		public imgProgress:Laya.Image;
		public lbProgress:Laya.Label;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"Loading","height":1334,"centerY":0,"centerX":0},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":15},{"type":"Image","props":{"var":"bg","top":0,"skin":"new/com/beijing.png","left":0},"compId":19,"child":[{"type":"Image","props":{"y":0,"x":529,"skin":"new/com/beijing.png"},"compId":20},{"type":"Image","props":{"y":417,"x":0,"skin":"new/com/beijing.png"},"compId":21},{"type":"Image","props":{"y":417,"x":529,"skin":"new/com/beijing.png"},"compId":22},{"type":"Image","props":{"y":834,"x":0,"skin":"new/com/beijing.png"},"compId":23},{"type":"Image","props":{"y":834,"x":529,"skin":"new/com/beijing.png"},"compId":24},{"type":"Image","props":{"y":1243,"x":0,"skin":"new/com/beijing.png"},"compId":25},{"type":"Image","props":{"y":1243,"x":529,"skin":"new/com/beijing.png"},"compId":26}]},{"type":"Box","props":{"x":200,"var":"boxProgress","right":200,"left":200,"height":41,"bottom":320},"compId":9,"child":[{"type":"Image","props":{"width":350,"top":5,"skin":"load/bar1.png","sizeGrid":"0,20,0,20","right":0,"left":0,"height":27,"bottom":9},"compId":10},{"type":"Image","props":{"y":8,"x":5,"width":340,"var":"imgProgress","skin":"load/bar2.png","sizeGrid":"0,20,0,20","height":20},"compId":11}]},{"type":"Label","props":{"var":"lbProgress","text":"Progress","fontSize":22,"color":"#f9f9f9","centerX":0,"bottom":298},"compId":7}],"loadList":["new/com/beijing.png","load/bar1.png","load/bar2.png"],"loadList3D":[]};
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
		public continueBtn:Laya.Image;
		public home:Laya.Image;
		public restart:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"name":"Pause","height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"height":1334,"alpha":0.5},"compId":24,"child":[{"type":"Rect","props":{"width":750,"lineWidth":1,"height":2000,"fillColor":"#000000"},"compId":23}]},{"type":"Image","props":{"width":558,"skin":"new/com/tanchuang.png","sizeGrid":"56,56,56,56","pivotY":-42,"pivotX":-58,"height":662,"centerY":0,"centerX":0},"compId":25,"child":[{"type":"Image","props":{"y":169,"x":279,"var":"continueBtn","skin":"new/com/b_jxyx.png","anchorY":0.5,"anchorX":0.5},"compId":18},{"type":"Image","props":{"y":514,"x":279,"var":"home","text":"退出","strokeColor":"#2c2c2c","stroke":1,"skin":"new/com/b_zcd.png","fontSize":40,"font":"SimHei","color":"#2c2c2c","anchorY":0.5,"anchorX":0.5},"compId":20},{"type":"Image","props":{"y":274,"x":279,"var":"restart","skin":"new/com/b_cxks.png","anchorX":0.5},"compId":22}]}],"loadList":["new/com/tanchuang.png","new/com/b_jxyx.png","new/com/b_zcd.png","new/com/b_cxks.png"],"loadList3D":[]};
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
		public lan:Laya.Image;
		public rank:Laya.Image;
		public pic:Laya.Image;
		public startBtn:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"runtime":"runtime/ImgEffect.ts","name":"Platform","height":1334,"centerY":0,"centerX":0},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":119},{"type":"Image","props":{"top":0,"skin":"ui/bg_1.jpg","right":0,"left":0,"bottom":0},"compId":127},{"type":"Image","props":{"right":0,"left":0,"height":200,"bottom":100,"anchorY":1,"anchorX":0.5},"compId":130,"child":[{"type":"Image","props":{"y":140,"x":189,"var":"set","skin":"new/com/bd_syk.png","centerY":40,"centerX":-186,"anchorY":0.5,"anchorX":0.5},"compId":255},{"type":"Image","props":{"y":140,"x":561,"var":"lan","skin":"new/com/bd_yy.png","centerY":40,"centerX":186,"anchorY":0.5,"anchorX":0.5},"compId":253},{"type":"Image","props":{"y":0,"x":189,"var":"rank","skin":"new/com/bd_phb.png","centerY":-100,"centerX":-186,"anchorY":0.5,"anchorX":0.5},"compId":249},{"type":"Image","props":{"y":0,"x":561,"var":"pic","skin":"new/com/bd_zpq.png","centerY":-100,"centerX":186,"anchorY":0.5,"anchorX":0.5},"compId":251}]},{"type":"Image","props":{"var":"startBtn","skin":"new/com/bd_ksyx.png","name":"startBtn","centerX":14,"bottom":541,"anchorY":0.5,"anchorX":0.5},"compId":244}],"loadList":["ui/bg_1.jpg","new/com/bd_syk.png","new/com/bd_yy.png","new/com/bd_phb.png","new/com/bd_zpq.png","new/com/bd_ksyx.png"],"loadList3D":[]};
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
		public r1:Laya.Image;
		public img_1:Laya.Image;
		public roleName_1:Laya.Label;
		public select_1:Laya.Image;
		public r2:Laya.Image;
		public img_2:Laya.Image;
		public roleName_2:Laya.Label;
		public select_2:Laya.Image;
		public startBtn:Laya.Image;
		public r3:Laya.Image;
		public img_3:Laya.Image;
		public roleName_3:Laya.Label;
		public select_3:Laya.Image;
		public r4:Laya.Image;
		public img_4:Laya.Image;
		public roleName_4:Laya.Label;
		public select_4:Laya.Image;
		public title:Laya.Image;
		public left:Laya.Image;
		public right:Laya.Image;
        public static  uiView:any ={"type":"Scene","props":{"width":750,"height":1334},"compId":2,"child":[{"type":"Script","props":{"top":0,"right":0,"left":0,"bottom":0,"runtime":"laya.ui.Widget"},"compId":3},{"type":"Sprite","props":{"y":0,"x":0,"width":750,"var":"cloudNode","name":"cloudNode","height":1334},"compId":4},{"type":"Image","props":{"y":0,"x":0,"visible":false,"skin":"new/com/beijing.png"},"compId":75,"child":[{"type":"Image","props":{"y":0,"x":529,"skin":"new/com/beijing.png"},"compId":76},{"type":"Image","props":{"y":417,"x":0,"skin":"new/com/beijing.png"},"compId":77},{"type":"Image","props":{"y":417,"x":529,"skin":"new/com/beijing.png"},"compId":78},{"type":"Image","props":{"y":834,"x":0,"skin":"new/com/beijing.png"},"compId":79},{"type":"Image","props":{"y":834,"x":529,"skin":"new/com/beijing.png"},"compId":80},{"type":"Image","props":{"y":1243,"x":0,"skin":"new/com/beijing.png"},"compId":81},{"type":"Image","props":{"y":1243,"x":529,"skin":"new/com/beijing.png"},"compId":82}]},{"type":"Image","props":{"y":79,"x":73,"var":"break","top":26,"skin":"new/com/b_fanhui.png","left":23,"anchorY":0.5,"anchorX":0.5},"compId":22},{"type":"Image","props":{"var":"r1","skin":"new/role/touxiangk.png","centerX":-282,"bottom":80,"anchorY":0.5,"anchorX":0.5},"compId":24,"child":[{"type":"Image","props":{"var":"img_1","skin":"new/role/touxiang_02.png","centerY":0,"centerX":0},"compId":25},{"type":"Image","props":{"skin":"new/role/mingzidi.png","centerX":0,"bottom":-60},"compId":43,"child":[{"type":"Label","props":{"var":"roleName_1","text":"JACK","fontSize":30,"color":"#929b9e","centerY":0,"centerX":0,"bold":true},"compId":42}]},{"type":"Image","props":{"var":"select_1","skin":"new/role/touxiangk2.png","centerY":0,"centerX":0},"compId":44}]},{"type":"Image","props":{"var":"r2","skin":"new/role/touxiangk.png","centerX":-94,"bottom":80},"compId":45,"child":[{"type":"Image","props":{"var":"img_2","skin":"new/role/touxiang_02.png","centerY":0,"centerX":0},"compId":46},{"type":"Image","props":{"skin":"new/role/mingzidi.png","centerX":0,"bottom":-60},"compId":47,"child":[{"type":"Label","props":{"var":"roleName_2","text":"JACK","fontSize":30,"color":"#929b9e","centerY":0,"centerX":0,"bold":true},"compId":48}]},{"type":"Image","props":{"var":"select_2","skin":"new/role/touxiangk2.png","centerY":0,"centerX":0},"compId":49}]},{"type":"Image","props":{"var":"startBtn","skin":"new/com/bd_ksyx.png","name":"startBtn","centerX":0,"bottom":277,"anchorY":0.5,"anchorX":0.5},"compId":39},{"type":"Image","props":{"var":"r3","skin":"new/role/touxiangk.png","centerX":94,"bottom":80},"compId":55,"child":[{"type":"Image","props":{"var":"img_3","skin":"new/role/touxiang_02.png","centerY":0,"centerX":0},"compId":56},{"type":"Image","props":{"skin":"new/role/mingzidi.png","centerX":0,"bottom":-60},"compId":57,"child":[{"type":"Label","props":{"var":"roleName_3","text":"JACK","fontSize":30,"color":"#929b9e","centerY":0,"centerX":0,"bold":true},"compId":58}]},{"type":"Image","props":{"var":"select_3","skin":"new/role/touxiangk2.png","centerY":0,"centerX":0},"compId":59}]},{"type":"Image","props":{"var":"r4","skin":"new/role/touxiangk.png","centerX":282,"bottom":80},"compId":60,"child":[{"type":"Image","props":{"var":"img_4","skin":"new/role/touxiang_02.png","centerY":0,"centerX":0},"compId":61},{"type":"Image","props":{"skin":"new/role/mingzidi.png","centerX":0,"bottom":-60},"compId":62,"child":[{"type":"Label","props":{"var":"roleName_4","text":"JACK","fontSize":30,"color":"#929b9e","centerY":0,"centerX":0,"bold":true},"compId":63}]},{"type":"Image","props":{"var":"select_4","skin":"new/role/touxiangk2.png","centerY":0,"centerX":0},"compId":64}]},{"type":"Image","props":{"y":160,"x":204,"var":"title","skin":"new/com/t_jsxz.png"},"compId":65},{"type":"Image","props":{"var":"left","skin":"new/com/xuanzhuan2.png","left":105,"centerY":-61},"compId":66},{"type":"Image","props":{"var":"right","skin":"new/com/xuanzhuan.png","right":100,"centerY":-55},"compId":72}],"loadList":["new/com/beijing.png","new/com/b_fanhui.png","new/role/touxiangk.png","new/role/touxiang_02.png","new/role/mingzidi.png","new/role/touxiangk2.png","new/com/bd_ksyx.png","new/com/t_jsxz.png","new/com/xuanzhuan2.png","new/com/xuanzhuan.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(RoleSelectUI.uiView);
        }
    }
    REG("ui.view.RoleSelectUI",RoleSelectUI);
}