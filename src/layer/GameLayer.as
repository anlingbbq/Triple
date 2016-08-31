package layer 
{
	import laya.display.Sprite;
	import entity.Entity;
	import entity.Item;
	import entity.PacMan;
	import laya.events.Event;
	import laya.events.Keyboard;
	import laya.maths.Point;
	import laya.utils.Handler;
	import laya.utils.Tween;
	import laya.utils.Pool;
	import manager.GameManager;
	/**
	 * ...
	 * @author anling
	 */
	public class GameLayer extends Sprite
	{
		private var _itemArr:Array = [];
		
		private var _player:PacMan;
		
		private var _gameMgr:GameManager;
		
		public function GameLayer() 
		{
			initItemArea();
			initPlayer(); 
			
			introAnime();
		}
		
		private function initItemArea():void
		{
			var beginX:int = GameInfo.GAME_HEIGHT - GameInfo.GAME_WIDTH;
			
			for (var row:int = 0; row < GameInfo.ROW_NUM; row++)
			{
				var arr:Array = [];
				for (var column:int = 0; column < GameInfo.COLUMN_NUM; column++)
				{
					var item:Item = Pool.getItemByClass("item", Item);
					this.addChild(item);
					item.site(row, column);
					item.pos((column + 0.5) * GameInfo.ITEM_WIDTH, 
						beginX + row * GameInfo.ITEM_HEIGHT - GameInfo.FALL_HEIGHT);
					
					arr.push(item);
				}
				_itemArr.push(arr);
			}
		}
		
		private function initPlayer():void
		{
			_player = new PacMan();
			this.addChild(_player);
			
			var row:int = Math.floor(Math.random() * _itemArr.length);
			var column:int = Math.floor(Math.random() * _itemArr[0].length);
			
			var item:Entity = _itemArr[row][column] as Entity;
			_player.pos(item.x, item.y);
			_player.site(row, column);
			
			_itemArr[row][column] = _player;
			item.removeSelf();
			Pool.recover("item", item);
		}
		
		private function introAnime():void
		{
			for (var column:int = 0; column < _itemArr[0].length; column++)
			{
				for (var row:int = 0; row < _itemArr[0].length; row++)
				{
					var item:Entity = _itemArr[row][column] as Entity;
					Tween.to(item, {y:item.y + GameInfo.FALL_HEIGHT}, 500 + 50 * (_itemArr.length - row + 1));
				}
			}
			this.timerOnce(500 + 50 * (_itemArr.length + 1), this, startGame);
		}
		
		private function startGame():void
		{
			_gameMgr = GameManager.getInstance();
			this.addChild(_gameMgr);
			_gameMgr.init(_itemArr, _player);
			
			NotifyCenter.getInstance().on(NotifyCenter.KEYBORADCTRL, this, setKeyboardCtrl);
			Laya.stage.on(Event.KEY_UP, this, onKeyUp);
		}

		private function onKeyUp(e:Event):void
		{
			switch(e.keyCode)
			{
				case Keyboard.UP:
					_player.turnTo(270);
					_gameMgr.gameStep(-1, 0);
					break;
				case Keyboard.DOWN:
					_player.turnTo(90);
					_gameMgr.gameStep(1, 0);
					break;
				case Keyboard.LEFT:
					_player.turnTo(180);
					_gameMgr.gameStep(0, -1);
					break;
				case Keyboard.RIGHT:
					_player.turnTo(0);
					_gameMgr.gameStep(0, 1);
					break;
				case Keyboard.SPACE:
					_gameMgr.spitAll();
					break;
			}
		}
		
		private function setKeyboardCtrl(value:Boolean):void
		{
			if (value) {
				Laya.stage.on(Event.KEY_UP, this, onKeyUp);
			} else {
				Laya.stage.off(Event.KEY_UP, this, onKeyUp);
			}
		}
	}

}