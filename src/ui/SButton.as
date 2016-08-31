package ui 
{
	import laya.display.Sprite;
	import laya.events.Event;
	import laya.resource.Texture;
	import laya.utils.Handler;
	/**
	 * ...
	 * @author anling
	 */
	public class SButton extends Sprite
	{
		private var _normal:Texture;
		private var _selected:Texture;
		
		private var _callback:Handler;
		
		public function SButton(nurl:String, surl:String) 
		{
			_normal = Laya.loader.getRes(nurl);
			_selected = Laya.loader.getRes(surl);
			
			this.graphics.drawTexture(_normal, 0, 0);
			this.pivot(_selected.width / 2, _selected.height / 2);
			this.size(_selected.width, _selected.height);
			
			this.on(Event.MOUSE_DOWN, this, onMouseDown);
			this.on(Event.MOUSE_UP, this, onMouseUp);
			this.on(Event.MOUSE_OUT, this, onMouseOut);
		}
		
		private function onMouseDown(e:Event):void
		{
			this.graphics.clear();
			this.graphics.drawTexture(_selected, 0, 0);
		}
		
		private function onMouseUp(e:Event):void
		{
			this.graphics.clear();
			this.graphics.drawTexture(_normal, 0, 0);
			
			_callback.runWith();
		}
		
		private function onMouseOut(e:Event):void
		{
			this.graphics.clear();
			this.graphics.drawTexture(_normal, 0, 0);
		}
		
		public function setCallback(callback:Handler):void
		{
			_callback = callback;
		}
	}

}