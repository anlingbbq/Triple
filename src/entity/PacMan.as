package entity 
{
	import laya.display.Sprite;
	import laya.events.Event;
	import laya.events.Keyboard;
	import laya.maths.Point;
	import laya.utils.Handler;
	import laya.utils.TimeLine;
	import laya.utils.Tween;
	import manager.StomachManager;
	/**
	 * ...
	 * @author anling
	 */
	public class PacMan extends Entity
	{
		public static const LEFT:int = 0;
		public static const RIGHT:int = 1;
		public static const UP:int = 2;
		public static const DOWN:int = 3;
		
		private var _dir:int = 1;
		
		private var _stomach:StomachManager;
		
		public function PacMan() 
		{
			tag = 0;
			
			_stomach = StomachManager.getInstance();
			
			this.loadImage("fruit/pacMan.png");
			this.size(GameInfo.ITEM_WIDTH, GameInfo.ITEM_HEIGHT);
			this.pivot(this.width / 2, this.height / 2);
		}
		
		public function eatItem(item:Item):void
		{
			Tween.to(this, {x:item.x, y:item.y}, GameInfo.EAT_DURATION);
			
			var anime:TimeLine = new TimeLine();
			var flipX:int = _dir == LEFT ? -1 : 1;
			anime.to(this, {scaleX:1.5 * flipX, scaleY:1.5}, GameInfo.EAT_DURATION / 2)
				 .to(this, {scaleX:1.0 * flipX, scaleY:1.0}, GameInfo.EAT_DURATION / 2);
			anime.play();
			
			_stomach.pushItem(item);
		}
		
		public function turnTo(angle:int):void
		{
			if (angle == 0) {
				_dir = RIGHT;
			} else if (angle == 90) {
				_dir = DOWN;
			} else if (angle == 180) {
				_dir = LEFT;
				this.rotation = 0;
				this.scale( -1, 1);
				return;
			} else if (angle == 270) {
				_dir = UP;
			}
			this.scale(1, 1);
			this.rotation = angle;
		}
		
		public function get dir():int
		{
			return _dir;
		}
	}

}