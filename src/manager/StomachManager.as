package manager 
{
	import data.EffectData;
	import entity.Item;
	import layer.StomachLayer;
	/**
	 * 管理吃下的物品以及特效类型判断
	 * @author anling
	 */
	public class StomachManager 
	{
		private static var _instance:StomachManager = null;
		
		private var _layer:StomachLayer;
		
		private var lastTag:int = 0;
		private var sameCount:int = 0;
		
		public var effectData:EffectData = new EffectData();
		
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
			adjustEffectType();
		}
		
		public function spitItem():Array
		{
			return _layer.spitItem();
		}
		
		public function showExtraItem():void
		{
			_layer.showExtraItem();
		}
		
		public function adjustEffectType():void
		{
			var stomachArr:Array = layer.spitItem();
			if (stomachArr.length >= 3) {
				var arr:Array = [];
				for (var i:int = 0; i < stomachArr.length; i++)
				{
					var item:Item = stomachArr[i] as Item;
					if (lastTag == item.tag) {
						sameCount++;
						arr.push(item);
					} 
					else {
						sameCount = 1;
						arr = [];
						arr.push(item);
					}
					if (sameCount >= 3) {
						for (var j:int = 0; j < sameCount; j++)
						{
							var effectItem:Item = stomachArr[j] as Item;
							effectItem.effectStat();
						}
						
						if (stomachArr.length == 8)
							effectData.sameArr.push(arr);
							
						sameCount = 0;
					}
					lastTag = item.tag;
				}
			}
		}
	}

}