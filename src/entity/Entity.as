package entity 
{
	import laya.display.Sprite;
	/**
	 * ...
	 * @author anling
	 */
	public class Entity extends Sprite
	{
		private var _tag:int;
		
		// 二维数组中的行列
		private var _row:int;
		private var _column:int;
		
		public function Entity() 
		{
			
		}
		
		public function get row():int
		{
			return _row;
		}
		
		public function get column():int
		{
			return _column;
		}
		
		public function site(row:int, column:int):void
		{
			_row = row;
			_column = column;
		}
		
		public function get tag():int
		{
			return _tag;
		}
		
		public function set tag(value:int):void
		{
			_tag = value;
		}
	}

}