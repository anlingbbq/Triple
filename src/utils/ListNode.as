package utils
{
	public class ListNode 
	{
		private var _data:*;
		
		private var _prev:ListNode;
		private var _next:ListNode;
		
		public function ListNode(data:*) 
		{
			_data = data;
			_prev = _next = null;
		}
		
		public function get data():*
		{
			return _data;
		}
		
		public function set data(data:*):void
		{
			_data = data;
		}
		
		public function get prev():ListNode
		{
			return _prev;
		}
		
		public function set prev(node:ListNode):void
		{
			_prev = node;
		}
		
		public function get next():ListNode
		{
			return _next;
		}
		
		public function set next(node:ListNode):void
		{
			_next = node;
		}
	}
	
}