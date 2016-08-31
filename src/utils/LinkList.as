package utils
{
	/**
	 * 双向链表
	 * 头尾均为无数据的哨兵节点，仅用于定位
	 * 哨兵节点与含数据的首尾节点为单向连接
	 * 遍历时节点为null结束
	 */
	public class LinkList 
	{
		private var _length:int = 0;
		
		public var headNode:ListNode;
		public var tailNode:ListNode;
		
		public function LinkList() 
		{
			headNode = new ListNode(null); 
			tailNode = new ListNode(null);
		}
		
		// 向后添加
		public function pushBack(data:*):void
		{
			if (data == null) return;
			var node:ListNode = new ListNode(data);
			
			var lastNode:ListNode = tailNode.prev;
			
			if (!lastNode) {
				headNode.next = node;
			}
			else {
				node.prev = lastNode;
				lastNode.next = node;
			}
			
			tailNode.prev = node;
			_length += 1;
		}
		
		// 向后删除
		public function popBack():*
		{
			var deleteNode:ListNode = tailNode.prev;
			if (!deleteNode) {
				return null;
			}
			else {
				var lastNode:ListNode = deleteNode.prev;
				if (!lastNode) {
					headNode.next = null;
					tailNode.prev = null;
				}
				else {
					tailNode.prev = lastNode;
					lastNode.next = null;
				}
				_length -= 1;
				
				return deleteNode.data;
			}
		}
		
		// 向前添加
		public function pushFront(data:*):void
		{
			if (data == null) return;
			var node:ListNode = new ListNode(data);
			
			var firstNode:ListNode = headNode.next;
			
			if (!firstNode) {
				tailNode.prev = node;
			}
			else {
				node.next = firstNode;
				firstNode.prev = node;
			}
			
			headNode.next = node;
			_length += 1;
		}
		
		// 向前删除
		public function popFront():*
		{
			var deleteNode:ListNode = headNode.next;
			if (!deleteNode) {
				return null;
			}
			else {
				var firstNode:ListNode = deleteNode.next;
				if (!firstNode) {
					headNode.next = null;
					tailNode.prev = null;
				}
				else {
					headNode.next = firstNode;
					firstNode.prev = null;
				}
				_length -= 1;
				
				return deleteNode.data;
			}
		}
		
		// 插入 寻找到的第一个preData之后
		public function insert(preData:*, data:*):void
		{
			if (data == null) return;
			// 排除无节点和尾节点的情况
			var prevNode:ListNode = tailNode.prev;
			if (prevNode == null || prevNode.data == preData) {
				pushBack(data);
				return;
			}
			// 寻找data节点
			prevNode = findNode(preData);
			if (prevNode != null)
			{
				// 插入逻辑
				var node:ListNode = new ListNode(data);
				var nextNode:ListNode = prevNode.next;
				prevNode.next = node;
				node.prev = prevNode;
				node.next = nextNode;
				nextNode.prev = node;
				
				_length += 1;
				return;
			}
		}
		
		// 移除 寻找到的第一个data
		public function remove(data:*):*
		{
			if (data == null || _length == 0) return null;
			// 判断尾部
			var node:ListNode = tailNode.prev;
			if (node.data == data) {
				return popBack();
			}
			// 判断头部
			node = headNode.next;
			if (node.data == data) {
				return popFront();
			}
			// 寻找data节点
			node = findNode(data);
			if (node != null) {
				// 移除逻辑
				var prevNode:ListNode = node.prev;
				var nextNode:ListNode = node.next;
				prevNode.next = nextNode;
				nextNode.prev = prevNode;
				
				_length -= 1;
				return node.data;
			}
			return null;
		}
		
		// 从两端查找该数据的节点
		public function findNode(data:*):ListNode
		{
			var prevNode:ListNode = headNode.next;
			var nextNode:ListNode = tailNode.prev;
			
			if (!prevNode) return null;
			
			while (1)
			{
				if (prevNode.data == data) return prevNode;
				if (nextNode.data == data) return nextNode;
				
				// 奇数情况 退出
				if (prevNode == nextNode) 
				{
					if (prevNode && prevNode.data == data) return prevNode;
					else return null;
				}
				// 偶数情况 退出
				if (prevNode.next == nextNode) return null;
				
				prevNode = prevNode.next;
				nextNode = nextNode.prev;
			}
			
			return null;
		}
		
		// 清空
		public function clear():void
		{
			var node:ListNode = headNode.next;
			while (node != null)
			{
				var nextNode:ListNode = node.next;
				node.data = null;
				node.prev = null;
				node.next = null;
				node = nextNode;
			}
			headNode.next = null;
			tailNode.prev = null;
			
			_length = 0;
		}
		
		// 转为字符串
		public function toString():String
		{
			var str:String = "";
			var node:ListNode = headNode.next;
			var id:int = 0;
			
			for (node; node != null; node = node.next)
			{
				str += "[id: " + id + ", data: " + node.data + "]\n";
				id += 1;
			}
			
			return str;
		}
		
		// 取得长度
		public function get length():int
		{
			return _length;
		}
	}
	
}