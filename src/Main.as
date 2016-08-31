package
{
	import laya.utils.Browser;
	import laya.utils.Stat;
	import scene.MainScene;
	import laya.net.Loader;
	import laya.utils.Handler;
	import laya.webgl.WebGL;
	/**
	 * ...
	 * @author anling
	 */
	public class Main
	{
		
		public function Main() 
		{
			Laya.init(GameInfo.GAME_WIDTH, GameInfo.GAME_HEIGHT, WebGL);
			Laya.stage.scaleMode = "showall";
			Laya.stage.bgColor = "#ffffff";
			Stat.show();
			
			Laya.loader.load("res/fruit.json", new Handler(this, initGame), null, Loader.ATLAS);
		}
		
		private function initGame():void
		{
			var mainScene:MainScene = new MainScene();
			Laya.stage.addChild(mainScene);
		}
	}
	
}