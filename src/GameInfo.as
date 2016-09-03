package 
{
	/**
	 * ...
	 * @author anling
	 */
	public class GameInfo 
	{
		// 物体种类数量
		public static const ITEM_TYPE_NUM:int = 8;
		
		// 物体宽高
		public static const ITEM_WIDTH:int = 80;
		public static const ITEM_HEIGHT:int = 80;
		
		// 游戏宽高
		public static const GAME_WIDTH:int = 640;
		public static const GAME_HEIGHT:int = 1136;
		
		// 开局下落高度
		public static const FALL_HEIGHT:int = 800;
		
		// 游戏区域的y坐标
		public static const ITEM_AREA_Y:int = GAME_HEIGHT - GAME_WIDTH;
		
		// 游戏行列数
		public static const ROW_NUM:int = 8;
		public static const COLUMN_NUM:int = 8;
		
		public static const EAT_DURATION:int = 200;
		
		public function GameInfo() 
		{
			
		}
		
	}

}