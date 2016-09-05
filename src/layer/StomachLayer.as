package layer 
{
	import entity.Item;
	import laya.display.Sprite;
	import laya.utils.Ease;
	import laya.utils.TimeLine;
	import laya.utils.Tween;
	/**
	 * ...
	 * @author anling
	 */
	public class StomachLayer extends Sprite
	{
		private var _stomach:Sprite;
		
		public function StomachLayer() 
		{
			_stomach = new Sprite();
			this.addChild(_stomach);
			
			_stomach.loadImage("fruit/stomach.png");
			_stomach.pos(0, 300);
		}
		
		public function pushItem(item:Item):void
		{
			_stomach.addChild(item);
			item.scale(0.1, 0.1);
			
			// 额外的物品
			if (_stomach._childs.length > 8)
			{
				item.pos(70 * (_stomach._childs.length - 8), 40);
				item.visible = false;
				return;
			}
			
			item.pos(70 * _stomach._childs.length, 40);
			Tween.to(item, {scaleX:0.8, scaleY:0.8}, 500, Ease.bounceOut);
		}
		
		public function showExtraItem():void
		{
			for (var i:int = 0; i < _stomach._childs.length; i++)
			{
				var item:Item = _stomach._childs[i] as Item;
				if (!item.visible) {
					item.visible = true;
					Tween.to(item, {scaleX:0.8, scaleY:0.8}, 500, Ease.bounceOut);
				}
			}
		}
		
		public function isFill():Boolean
		{
			if (_stomach._childs.length >= 8) {
				return true;
			}
			return false;
		}
		
		public function spitItem():Array
		{
			return _stomach._childs;
		}
	}

}