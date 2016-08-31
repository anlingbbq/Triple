package 
{
	import laya.events.EventDispatcher;
	/**
	 * ...
	 * @author anling
	 */
	public class NotifyCenter extends EventDispatcher
	{
		/*
		 * 自定义消息
		 */
		public static var KEYBORADCTRL:String = "keyboardCtrl";
		 
		private static var _instance:NotifyCenter = null;
		
		public function NotifyCenter() 
		{
			
		}
		
		public static function getInstance():NotifyCenter
		{
			if (_instance == null)
			{
				_instance = new NotifyCenter();
			}
			
			return _instance;
		}
		
		
	}

}