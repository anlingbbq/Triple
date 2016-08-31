package scene 
{
	
	import laya.display.Sprite;
	import layer.GameLayer;
	import layer.HUDLayer;
	import layer.StomachLayer;
	import manager.StomachManager;
	
	/**
	 * ...
	 * @author anling
	 */
	public class GameScene extends Sprite
	{
		
		
		public function GameScene() 
		{
			var bg:Sprite = new Sprite();
			this.addChild(bg);
			bg.loadImage("res/playBG.png");
			
			//var hudLayer:HUDLayer = new HUDLayer();
			//this.addChild(hudLayer);
			
			var stomachLayer:StomachLayer = new StomachLayer();
			this.addChild(stomachLayer);
			
			var stomachMgr:StomachManager = StomachManager.getInstance();
			stomachMgr.layer = stomachLayer;
			
			var gameLayer:GameLayer = new GameLayer();
			this.addChild(gameLayer);
		}
		
	}

}