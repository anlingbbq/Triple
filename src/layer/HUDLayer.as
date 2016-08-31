package layer 
{
	import laya.display.Sprite;
	/**
	 * ...
	 * @author anling
	 */
	public class HUDLayer extends Sprite
	{
		private var stomach:Sprite;
		
		public function HUDLayer() 
		{
			stomach = new Sprite();
			this.addChild(stomach);
			
			stomach.loadImage("fruit/stomach.png");
			stomach.pos(0, 300);
		}
	}

}