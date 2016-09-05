package entity 
{
	import laya.display.Sprite;
	import laya.resource.Texture;
	import laya.utils.Handler;
	import laya.utils.Pool;
	import laya.utils.TimeLine;
	import laya.utils.Tween;
	/**
	 * ...
	 * @author anling
	 */
	public class Item extends Entity
	{
		// 标记是否要移除
		public var _sign:Boolean = false;
		
		public function Item() 
		{
			tag = Math.round(Math.random() * (GameInfo.ITEM_TYPE_NUM - 2)) + 1;
			
			this.loadImage("fruit/item_" + tag + ".png");
			
			this.size(GameInfo.ITEM_WIDTH, GameInfo.ITEM_HEIGHT);
			this.pivot(this.width / 2, this.height / 2);
		}
		
		public function removeAction():void
		{
			Tween.to(this, {scaleX:0, scaleY:0}, 200, null, Handler.create(this, remove));
		}
		
		public function remove():void
		{
			this.removeSelf();
			Pool.recover("item", this);
		}
		
		public function reset():void
		{
			tag = Math.round(Math.random() * (GameInfo.ITEM_TYPE_NUM - 2)) + 1;
			
			sign = false;
			
			var texture:Texture = Laya.loader.getRes("fruit/item_" + tag + ".png");
			this.graphics.clear();
			this.graphics.drawTexture(texture, 0, 0);
			
			playAddAnime();
		}
		
		public function playAddAction():void
		{
			var scaleAction:TimeLine = new TimeLine();
			scaleAction.to(this, {scaleX:1.5, scaleY:1.5}, 100)
				.to(this, {scaleX:1.0, scaleY:1.0}, 100);
			
			scaleAction.play();
		}
		
		public function effectStat():void
		{
			var texture:Texture = Laya.loader.getRes("fruit/item_" + tag + "_1.png");
			this.graphics.clear();
			this.graphics.drawTexture(texture, 0, 0);
		}
		
		public function get sign():Boolean
		{
			return _sign;
		}
		
		public function set sign(value:Boolean):void
		{
			_sign = value;
		}
	}

}