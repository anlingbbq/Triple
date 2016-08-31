package scene 
{
	import laya.display.Sprite;
	import laya.events.Event;
	import laya.utils.Handler;
	import ui.SButton;
	/**
	 * ...
	 * @author anling
	 */
	public class MainScene extends Sprite
	{
		private var _startBtn:SButton;
		
		public function MainScene() 
		{
			var bg:Sprite = new Sprite();
			this.addChild(bg);
			bg.loadImage("res/mainBG.png");
			
			_startBtn = new SButton("fruit/btn_start1.png", "fruit/btn_start2.png");
			this.addChild(_startBtn);
			_startBtn.pos(Laya.stage.width / 2, Laya.stage.height / 2 + 90);
			_startBtn.setCallback(new Handler(this, enterGame));
		}
		
		private function enterGame():void
		{
			var gameScene:GameScene = new GameScene();
			Laya.stage.addChild(gameScene);
			
			this.destroy();
		}
	}

}