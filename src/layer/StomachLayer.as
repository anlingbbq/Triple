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
			item.pos(70 * _stomach._childs.length, 40);
			
			Tween.to(item, {scaleX:0.8, scaleY:0.8}, 500, Ease.bounceOut);
		}
		
		public function isFill():Boolean
		{
			if (_stomach._childs.length >= 8) {
				return true;
			}
			return false;
		}
	}

}