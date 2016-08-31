package manager 
{
	import entity.Entity;
	import entity.Item;
	import entity.PacMan;
	import laya.display.Sprite;
	import laya.events.Event;
	import laya.maths.Point;
	import laya.utils.Handler;
	import laya.utils.Pool;
	import laya.utils.Tween;
	import utils.LinkList;
	import utils.ListNode;
	/**
	 * ...
	 * @author anling
	 */
	public class GameManager extends Sprite
	{
		private static var _instance:GameManager = null;
		
		private var _itemArr:Array;
		
		private var _player:PacMan;
		
		// 下落的物品，用于判断消除 
		private var _fallList:LinkList;
		
		// 保存所有消除的物品
		private var _removeArr:Array = [];
		
		// 保存一种待消除的物品
		private var _oneTypeArr:Array = [];
		
		// 保存消除项中同列最后一个的位置 以此为下落基准
		private var _bottomArr:Array = [];
		
		// 是否有消除物品
		private var _hasEliminate:Boolean;
		
		public function GameManager(itemArr:Array, player:PacMan) {};
		
		public static function getInstance():GameManager
		{
			if (_instance == null) {
				_instance = new GameManager();
			}
			return _instance;
		}
		
		public function init(itemArr:Array, player:PacMan)
		{
			this._itemArr = itemArr;
			this._player = player;
			
			for (var i:int = 0; i < GameInfo.COLUMN_NUM; i++)
			{
				_removeArr.push([]);
			}
			
			_fallList = new LinkList();
		}
		
		public function gameStep(offsetR:int, offsetC:int):void
		{
			var row = _player.row + offsetR;
			var column = _player.column + offsetC;
			
			if (row > _itemArr.length - 1 || row < 0) {
				return;
			}
			if (column > _itemArr.length - 1 || column < 0) {
				return;
			}
			if (_itemArr[row][column] == null) {
				return;
			}
			
			NotifyCenter.getInstance().event(NotifyCenter.KEYBORADCTRL, [false]);
			
			var item:Entity = _itemArr[row][column] as Entity;
			if (StomachManager.getInstance().isFill()) {
				// 替换位置
				_itemArr[_player.row][_player.column] = item;
				item.site(_player.row, _player.column);
				
				Tween.to(_player, {x:item.x, y:item.y}, 200);
				Tween.to(item, {x:_player.x, y:_player.y}, 200);
				
				_fallList.pushBack(item);
				this.timerOnce(200, this, eliminate);
			} else {
				// 吃掉
				_player.eatItem(item);
				
				// 数组中移除
				_itemArr[_player.row][_player.column] = null;
				
				this.timerOnce(GameInfo.EAT_DURATION, this, fallByEat);
			}
		
			// 设置pacMan数组位置
			_itemArr[row][column] = _player;
			_player.site(row, column);
		}
		
		// 根据被吃项下落
		private function fallByEat():void
		{
			var row:int = _player.row;
			var column:int = _player.column;
			
			var fallNum:int = 0;
			
			if (_player.dir == PacMan.UP) {
				var siteY:int;
				if (column == 0 || !_itemArr[row][column-1]) {
					siteY = column + 1;
				} 
				else if (column == _itemArr[0].length || !_itemArr[row][column+1]) {
					siteY = column - 1;
				}
				else {
					siteY = (Math.random() > 0.5) ? column + 1 : column - 1;
				}
				
				var item:Entity = _itemArr[row][siteY] as Entity;
				
				_itemArr[row][siteY] = null;
				_itemArr[row + 1][column] = item;
				item.site(row + 1, column);
				
				// 加入到下落链表中，用于判断消除
				 _fallList.pushBack(item);
				
				Tween.to(item, {x:_player.x, y:item.y + GameInfo.ITEM_HEIGHT},
					200, null, Handler.create(this, fallByUp, [row, siteY]));
			}
			else if (_player.dir == PacMan.DOWN) {
				fallNum = fallLine(row - 1, column);	
			}
			else if (_player.dir == PacMan.LEFT) {
				fallNum = fallLine(row, column + 1);
			}
			else if (_player.dir == PacMan.RIGHT) {
				fallNum = fallLine(row, column - 1);
			}
			
			this.timerOnce(200 + 50 * fallNum, this, eliminate);
		}
		
		private function fallByUp(row:int, column:int):void 
		{
			var fallNum:int = fallLine(row, column);
			this.timerOnce(200 + 50 * fallNum, this, eliminate);
		}
		
		// 下落一竖行 返回下落的个数
		private function fallLine(row:int, column:int):int
		{
			if (row > _itemArr.length - 1 || row < 0) {
				return;
			}
			if (column > _itemArr.length - 1 || column < 0) {
				return;
			}
			if (_itemArr[row][column] != null) {
				return;
			}
			
			var itemCount:int = 0;
			var blankCount:int = 1;
			for (var i:int = row - 1; i >= 0; i--)
			{
				var item:Entity = _itemArr[i][column] as Entity;
				if (item == null) {
					blankCount++;
					continue;
				}
				
				Tween.to(item, {y:item.y + GameInfo.ITEM_HEIGHT * blankCount}, 200 + 50 * itemCount);
				
				if (item.tag != 0) {
					// 加入到下落链表中
					_fallList.pushBack(item);
				}
				
				_itemArr[i + blankCount][column] = item;
				item.site(i + blankCount, column);
				
				itemCount++;
			}
			
			for (var j:int = 0; j < blankCount; j++) {
				_itemArr[j][column] = null;
			}
			
			return itemCount;
		}
		
		// 遍历下落项 消除相同的物品
		private function eliminate():void
		{
			// 预设没有消除项
			_hasEliminate = false;
			
			// 收集下落物品周围的相同物品
			var node:ListNode = _fallList.headNode.next;
			for (node; node != null; node = node.next) {
				findAround(node.data, node.data.tag);
				
				// 小于消除条件复原
				if (_oneTypeArr.length < 3) {
					for (var i:int = 0; i < _oneTypeArr.length; i++)
					{
						var item:Item = _oneTypeArr[i] as Item;
						item.sign = false;
					}
				} 
				// 否则加入到消除数组
				else {
					_hasEliminate = true;
					for (var j:int = 0; j < _oneTypeArr.length; j++)
					{
						var item:Item = _oneTypeArr[j] as Item;
						_removeArr[item.column].push(item);
					}
				}
				_oneTypeArr = [];
			}
			
			// 没有消除物品时 添加
			if (!_hasEliminate) {
				addItem();
				return;
			}
			
			// 保存下落基准点
			findFallPoint();
			
			// 移除要消除的物品
			for (var i:int = 0; i < _removeArr.length; i++)
			{
				for (var j:int = 0; j < _removeArr[i].length; j++) 
				{
					var item:Item = _removeArr[i][j] as Item;
					_itemArr[item.row][item.column] = null;
					item.removeAction();
				}
				_removeArr[i] = [];
			}
			
			this.timerOnce(250, this, fallByEliminate);
		}
		
		// 寻找下落的基准点
		private function findFallPoint():void
		{
			for (var i:int = 0; i < _removeArr.length; i++)
			{
				var bottomItem:Item = null;
				var bottomRow:int = 0;
				for (var j:int = 0; j < _removeArr[i].length; j++)
				{
					var item:Item = _removeArr[i][j] as Item;
					if (item.row > bottomRow) {
						bottomRow = item.row;
						bottomItem = item;
					}
				}
				if (bottomItem != null) {
					_bottomArr.push(new Point(bottomItem.row, bottomItem.column));
				}
			}
		}
		
		// 递归下落项的四个方向
		private function findAround(item:Item, tag:int):void
		{
			if (item == null || item.tag != tag || item.sign) {
				return;
			}
			
			// 从下落物品中移除
			_fallList.remove(item);
			
			// 添加到同类数组 待消除
			_oneTypeArr.push(item);
			item.sign = true;
			
			var row:int = item.row;
			var column:int = item.column;
			
			// 检查左边的物品
			if (column - 1 >= 0) {
				findAround(_itemArr[row][column-1], tag);
			}
			// 检查右边的物品
			if (column + 1 < _itemArr.length) {
				findAround(_itemArr[row][column + 1], tag);
			}
			// 检查上边的物品
			if (row - 1 >= 0) {
				findAround(_itemArr[row - 1][column], tag);
			}
			// 检查下边的物品
			if (row + 1 < _itemArr.length) {
				findAround(_itemArr[row + 1][column], tag);
			}
		}
		
		// 根据消除项下落
		private function fallByEliminate():void
		{
			var fallNum:int = 0;
			for (var i:int = 0; i < _bottomArr.length; i++)
			{
				var pos:Point = _bottomArr[i] as Point;
				var count:int = fallLine(pos.x, pos.y);
				if (count > fallNum) {
					fallNum = count;
				}
			}
			_bottomArr = [];
			this.timerOnce(300 + 50 * fallNum, this, eliminate);
		}
		
		// 补充物品
		private function addItem():void
		{
			var beginX:int = GameInfo.GAME_HEIGHT - GameInfo.GAME_WIDTH;
			for (var row:int = 0; row < _itemArr.length; row++)
			{
				for (var column:int = 0; column < _itemArr[0].length; column++)
				{
					if (_itemArr[row][column] == null) {
						var item:Item = Pool.getItemByClass("item", Item);
						item.reset();
						
						_itemArr[row][column] = item;
						item.site(row, column);
						
						parent.addChild(item);
						item.pos((column + 0.5) * GameInfo.ITEM_WIDTH, beginX + row * GameInfo.ITEM_HEIGHT);
					}
				}
			}
			
			NotifyCenter.getInstance().event(NotifyCenter.KEYBORADCTRL, [true]);
		}
	
		// 吐出所有物品
		public function spitAll():void
		{
			var arr:Array = StomachManager.getInstance().spitItem();
			// 移除最上一排
			for (var i:int = 0; i < _itemArr[0].length; i++) 
			{
				var item:Item = _itemArr[0][i] as Item;
				_itemArr[0][i] = null;
				item.remove();
			}
			
			// 玩家及其以上物品上移一排
			var playerRow:int = _player.row;
			for (var i:int = 1; i < playerRow; i++):void
			{
				for (var j:int = 0; j < _itemArr[i].length; j++)
				{
					var entity:Entity = _itemArr[i][j] as Entity;
					
				}
			}
		}
		
		// 显示数据
		public function showData():void
		{
			for (var row:int = 0; row < _itemArr.length; row++)
			{
				var line:String = "";
				for (var column:int = 0; column < _itemArr[row].length; column++)
				{
					var item:Item = _itemArr[row][column] as Item;
					if (item == null) {
						line += "null  ";
					} else {
						line += item.tag + "  ";
					}
				}
				trace(line);
			}
		}
	}

}