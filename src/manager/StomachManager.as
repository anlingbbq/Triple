package manager 
{
	import entity.Item;
	import layer.StomachLayer;
	/**
	 * ...
	 * @author anling
	 */
	public class StomachManager 
	{
		private static var _instance:StomachManager = null;
		
		private var _layer:StomachLayer;
		
		public function StomachManager() {};
		
		public static function getInstance():StomachManager
		{
			if (_instance == null) {
				_instance = new StomachManager();
			}
			
			return _instance;
		}
		
		public function isFill():Boolean
		{
			return _layer.isFill();
		}
		
		public function set layer(ui:StomachLayer):void
		{
			_layer = ui;
		}
		
		public function get layer():StomachLayer
		{
			return _layer;
		}
		
		public function pushItem(item:Item):void
		{
			layer.pushItem(item);
		}
		
		public function spitItem():Array
		{
			return layer._childs;
		}
	}

}