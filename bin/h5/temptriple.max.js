var document=document || {};var window=window || {document:document}
/***********************************/
/*http://www.layabox.com 2016/05/19*/
/***********************************/
var Laya=window.Laya=(function(window,document){
	var Laya={
		__internals:[],
		__packages:{},
		__classmap:{'Object':Object,'Function':Function,'Array':Array,'String':String},
		__sysClass:{'object':'Object','array':'Array','string':'String','dictionary':'Dictionary'},
		__propun:{writable: true,enumerable: false,configurable: true},
		__presubstr:String.prototype.substr,
		__substr:function(ofs,sz){return arguments.length==1?Laya.__presubstr.call(this,ofs):Laya.__presubstr.call(this,ofs,sz>0?sz:(this.length+sz));},
		__init:function(_classs){_classs.forEach(function(o){o.__init$ && o.__init$();});},
		__isClass:function(o){return o && (o.__isclass || o==Object || o==String || o==Array);},
		__newvec:function(sz,value){
			var d=[];
			d.length=sz;
			for(var i=0;i<sz;i++) d[i]=value;
			return d;
		},
		__extend:function(d,b){
			for (var p in b){
				if (!b.hasOwnProperty(p)) continue;
				var g = Object.getOwnPropertyDescriptor(b, p).get, s = Object.getOwnPropertyDescriptor(b, p).set; 
				if ( g || s ) {
					g && Object.defineProperty(d, p, g);
					s && Object.defineProperty(d, p, s);
				}
				else d[p] = b[p];
			}
			function __() { Laya.un(this,'constructor',d); }__.prototype=b.prototype;d.prototype=new __();Laya.un(d.prototype,'__imps',Laya.__copy({},b.prototype.__imps));
		},
		__copy:function(dec,src){
			if(!src) return null;
			dec=dec||{};
			for(var i in src) dec[i]=src[i];
			return dec;
		},
		__package:function(name,o){
			if(Laya.__packages[name]) return;
			Laya.__packages[name]=true;
			var p=window,strs=name.split('.');
			if(strs.length>1){
				for(var i=0,sz=strs.length-1;i<sz;i++){
					var c=p[strs[i]];
					p=c?c:(p[strs[i]]={});
				}
			}
			p[strs[strs.length-1]] || (p[strs[strs.length-1]]=o||{});
		},
		__hasOwnProperty:function(name,o){
			o=o ||this;
		    function classHas(name,o){
				if(Object.hasOwnProperty.call(o.prototype,name)) return true;
				var s=o.prototype.__super;
				return s==null?null:classHas(name,s);
			}
			return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
		},
		__typeof:function(o,value){
			if(!o || !value) return false;
			if(value==String) return (typeof o=='string');
			if(value==Number) return (typeof o=='number');
			if(value.__interface__) value=value.__interface__;
			else if(typeof value!='string')  return (o instanceof value);
			return (o.__imps && o.__imps[value]) || (o.__class==value);
		},
		__as:function(value,type){
			return (this.__typeof(value,type))?value:null;
		},		
		interface:function(name,_super){
			Laya.__package(name,{});
			var ins=Laya.__internals;
			var a=ins[name]=ins[name] || {};
			a.self=name;
			if(_super)a.extend=ins[_super]=ins[_super] || {};
			var o=window,words=name.split('.');
			for(var i=0;i<words.length-1;i++) o=o[words[i]];o[words[words.length-1]]={__interface__:name};
		},
		class:function(o,fullName,_super,miniName){
			_super && Laya.__extend(o,_super);
			if(fullName){
				Laya.__package(fullName,o);
				Laya.__classmap[fullName]=o;
				if(fullName.indexOf('.')>0){
					if(fullName.indexOf('laya.')==0){
						var paths=fullName.split('.');
						miniName=miniName || paths[paths.length-1];
						if(miniName!="Image")
						{
							if(Laya[miniName]) console.log("Warning!,this class["+miniName+"] already exist:",Laya[miniName]);
							Laya[miniName]=o;
						}
					}
				}
				else {
					if(fullName=="Main")
						window.Main=o;
					else{
						if(Laya[fullName]){
							console.log("Error!,this class["+fullName+"] already exist:",Laya[fullName]);
						}
						Laya[fullName]=o;
					}
				}
			}
			var un=Laya.un,p=o.prototype;
			un(p,'hasOwnProperty',Laya.__hasOwnProperty);
			un(p,'__class',o);
			un(p,'__super',_super);
			un(p,'__className',fullName);
			un(o,'__super',_super);
			un(o,'__className',fullName);
			un(o,'__isclass',true);
			un(o,'super',function(o){this.__super.call(o);});
		},
		imps:function(dec,src){
			if(!src) return null;
			var d=dec.__imps|| Laya.un(dec,'__imps',{});
			for(var i in src){
				d[i]=src[i];
				var c=i;
				while((c=this.__internals[c]) && (c=c.extend) ){
					c=c.self;d[c]=true;
				}
			}
		},		
		getset:function(isStatic,o,name,getfn,setfn){
			if(!isStatic){
				getfn && Laya.un(o,'_$get_'+name,getfn);
				setfn && Laya.un(o,'_$set_'+name,setfn);
			}
			else{
				getfn && (o['_$GET_'+name]=getfn);
				setfn && (o['_$SET_'+name]=setfn);
			}
			if(getfn && setfn) 
				Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
			else{
				getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
				setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
			}
		},
		static:function(_class,def){
				for(var i=0,sz=def.length;i<sz;i+=2){
					if(def[i]=='length') 
						_class.length=def[i+1].call(_class);
					else{
						function tmp(){
							var name=def[i];
							var getfn=def[i+1];
							Object.defineProperty(_class,name,{
								get:function(){delete this[name];return this[name]=getfn.call(this);},
								set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
						}
						tmp();
					}
				}
		},		
		un:function(obj,name,value){
			value || (value=obj[name]);
			Laya.__propun.value=value;
			Object.defineProperty(obj, name, Laya.__propun);
			return value;
		},
		uns:function(obj,names){
			names.forEach(function(o){Laya.un(obj,o)});
		}
	};

	window.console=window.console || ({log:function(){}});
	window.trace=window.console.log;
	Error.prototype.throwError=function(){throw arguments;};
	String.prototype.substr=Laya.__substr;
	Object.defineProperty(Array.prototype,'fixed',{enumerable: false});

	return Laya;
})(window,document);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
	Laya.interface('laya.filters.IFilterAction');
	Laya.interface('laya.webgl.shapes.IShape');
	Laya.interface('laya.display.ILayout');
	Laya.interface('laya.runtime.IConchNode');
	Laya.interface('laya.resource.IDispose');
	Laya.interface('laya.webgl.text.ICharSegment');
	Laya.interface('laya.runtime.IMarket');
	Laya.interface('laya.webgl.canvas.save.ISaveData');
	Laya.interface('laya.webgl.resource.IMergeAtlasBitmap');
	Laya.interface('laya.webgl.submit.ISubmit');
	Laya.interface('laya.filters.IFilterActionGL','laya.filters.IFilterAction');
	/**
	*@private
	*/
	//class laya.utils.RunDriver
	var RunDriver=(function(){
		function RunDriver(){};
		__class(RunDriver,'laya.utils.RunDriver');
		RunDriver.FILTER_ACTIONS=[];
		RunDriver.pixelRatio=-1;
		RunDriver._charSizeTestDiv=null
		RunDriver.now=function(){
			return Date.now();
		}

		RunDriver.getWindow=function(){
			return window;
		}

		RunDriver.newWebGLContext=function(canvas,webGLName){
			return canvas.getContext(webGLName,{stencil:true,alpha:false,antialias:Config.isAntialias,premultipliedAlpha:false});
		}

		RunDriver.getPixelRatio=function(){
			if (RunDriver.pixelRatio < 0){
				var ctx=Browser.context;
				var backingStore=ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
				RunDriver.pixelRatio=(Browser.window.devicePixelRatio || 1)/ backingStore;
			}
			return RunDriver.pixelRatio;
		}

		RunDriver.getIncludeStr=function(name){
			return null;
		}

		RunDriver.createShaderCondition=function(conditionScript){
			var fn="(function() {return "+conditionScript+";})";
			return Browser.window.eval(fn);
		}

		RunDriver.measureText=function(txt,font){
			if (Render.isConchApp){
				var ctx=ConchTextCanvas;
				ctx.font=font;
				return ctx.measureText(txt);
			}
			if (RunDriver._charSizeTestDiv==null){
				RunDriver._charSizeTestDiv=Browser.createElement('div');
				RunDriver._charSizeTestDiv.style.cssText="z-index:10000000;padding:0px;position: absolute;left:0px;visibility:hidden;top:0px;background:white";
				Browser.container.appendChild(RunDriver._charSizeTestDiv);
			}
			RunDriver._charSizeTestDiv.style.font=font;
			RunDriver._charSizeTestDiv.innerText=txt==" " ? "i" :txt;
			return {width:RunDriver._charSizeTestDiv.offsetWidth,height:RunDriver._charSizeTestDiv.offsetHeight};
		}

		RunDriver.beginFlush=function(){
		};

		RunDriver.endFinish=function(){
		};

		RunDriver.addToAtlas=null
		RunDriver.flashFlushImage=function(atlasWebGLCanvas){
		};

		RunDriver.drawToCanvas=function(sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
			var canvas=HTMLCanvas.create("2D");
			var context=new RenderContext(canvasWidth,canvasHeight,canvas);
			RenderSprite.renders[_renderType]._fun(sprite,context,offsetX,offsetY);
			return canvas;
		}

		RunDriver.createParticleTemplate2D=null
		RunDriver.createGLTextur=null;
		RunDriver.createWebGLContext2D=null;
		RunDriver.changeWebGLSize=function(w,h){
		};

		RunDriver.createRenderSprite=function(type,next){
			return new RenderSprite(type,next);
		}

		RunDriver.createFilterAction=function(type){
			return new ColorFilterAction();
		}

		RunDriver.createGraphics=function(){
			return new Graphics();
		}

		RunDriver.clear=function(value){
			Render._context.ctx.clear();
		}

		RunDriver.clearAtlas=function(value){
		};

		RunDriver.addTextureToAtlas=function(value){
		};

		RunDriver.getTexturePixels=function(value,x,y,width,height){
			return null;
		}

		RunDriver.fillTextureShader=function(value,x,y,width,height){
			return null;
		}

		RunDriver.skinAniSprite=function(){
			return null;
		}

		return RunDriver;
	})()


	/**
	*<code>Laya</code> 是全局对象的引用入口集。
	*/
	//class Laya
	var ___Laya=(function(){
		//function Laya(){};
		/**
		*表示是否捕获全局错误并弹出提示。
		*/
		__getset(1,Laya,'alertGlobalError',null,function(value){
			var erralert=0;
			if (value){
				Browser.window.onerror=function (msg,url,line,column,detail){
					if (erralert++< 5 && detail)
						alert("出错啦，请把此信息截图给研发商\n"+msg+"\n"+detail.stack);
				}
				}else {
				Browser.window.onerror=null;
			}
		});

		Laya.init=function(width,height,__plugins){
			var plugins=[];for(var i=2,sz=arguments.length;i<sz;i++)plugins.push(arguments[i]);
			Browser.__init__();
			Context.__init__();
			Graphics.__init__();
			Laya.timer=new Timer();
			Laya.loader=new LoaderManager();
			for (var i=0,n=plugins.length;i < n;i++){
				if (plugins[i].enable)plugins[i].enable();
			}
			Font.__init__();
			Style.__init__();
			ResourceManager.__init__();
			CacheManger.beginCheck();
			Laya.stageBox=Laya.stage=new Stage();
			Laya.stage.model&&Laya.stage.model.setRootNode();
			var location=Browser.window.location;
			var pathName=location.pathname;
			pathName=pathName.charAt(2)==':' ? pathName.substring(1):pathName;
			URL.rootPath=URL.basePath=URL.getPath(location.protocol=="file:" ? pathName :location.origin+pathName);
			Laya.render=new Render(50,50);
			Laya.stage.size(width,height);
			RenderSprite.__init__();
			KeyBoardManager.__init__();
			MouseManager.instance.__init__(Laya.stage,Render.canvas);
			Input.__init__();
			SoundManager.autoStopMusic=true;
			return Render.canvas;
		}

		Laya.stage=null;
		Laya.timer=null;
		Laya.loader=null;
		Laya.render=null
		Laya.version="1.2.0";
		Laya.stageBox=null
		__static(Laya,
		['conchMarket',function(){return this.conchMarket=window.conch?conchMarket:null;}
		]);
		return Laya;
	})()


	/**
	*<code>EventDispatcher</code> 类是可调度事件的所有类的基类。
	*/
	//class laya.events.EventDispatcher
	var EventDispatcher=(function(){
		var EventHandler;
		function EventDispatcher(){
			this._events=null;
		}

		__class(EventDispatcher,'laya.events.EventDispatcher');
		var __proto=EventDispatcher.prototype;
		/**
		*检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
		*@param type 事件的类型。
		*@return 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
		*/
		__proto.hasListener=function(type){
			var listener=this._events && this._events[type];
			return !!listener;
		}

		/**
		*派发事件。
		*@param type 事件类型。
		*@param data 回调数据。
		*<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
		*@return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
		*/
		__proto.event=function(type,data){
			if (!this._events || !this._events[type])return false;
			var listeners=this._events[type];
			if (listeners.run){
				if (listeners.once)delete this._events[type];
				data !=null ? listeners.runWith(data):listeners.run();
				}else {
				for (var i=0,n=listeners.length;i < n;i++){
					var listener=listeners[i];
					if (listener){
						(data !=null)? listener.runWith(data):listener.run();
					}
					if (!listener || listener.once){
						listeners.splice(i,1);
						i--;
						n--;
					}
				}
				if (listeners.length===0)delete this._events[type];
			}
			return true;
		}

		/**
		*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args 事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.on=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,false);
		}

		/**
		*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args 事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.once=function(type,caller,listener,args){
			return this._createListener(type,caller,listener,args,true);
		}

		__proto._createListener=function(type,caller,listener,args,once){
			this.off(type,caller,listener,once);
			var handler=EventHandler.create(caller || this,listener,args,once);
			this._events || (this._events={});
			var events=this._events;
			if (!events[type])events[type]=handler;
			else {
				if (!events[type].run)events[type].push(handler);
				else events[type]=[events[type],handler];
			}
			return this;
		}

		/**
		*从 EventDispatcher 对象中删除侦听器。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param onceOnly 如果值为 true ,则只移除通过 once 方法添加的侦听器。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.off=function(type,caller,listener,onceOnly){
			(onceOnly===void 0)&& (onceOnly=false);
			if (!this._events || !this._events[type])return this;
			var listeners=this._events[type];
			if (listener !=null){
				if (listeners.run){
					if ((!caller || listeners.caller===caller)&& listeners.method===listener && (!onceOnly || listeners.once)){
						delete this._events[type];
						listeners.recover();
					}
					}else {
					var count=0;
					for (var i=0,n=listeners.length;i < n;i++){
						var item=listeners[i];
						if (item && (!caller || item.caller===caller)&& item.method===listener && (!onceOnly || item.once)){
							count++;
							listeners[i]=null;
							item.recover();
						}
					}
					if (count===n)delete this._events[type];
				}
			}
			return this;
		}

		/**
		*从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
		*@param type 事件类型，如果值为 null，则移除本对象所有类型的侦听器。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.offAll=function(type){
			var events=this._events;
			if (!events)return this;
			if (type){
				this._recoverHandlers(events[type]);
				delete events[type];
				}else {
				for (var name in events){
					this._recoverHandlers(events[name]);
				}
				this._events=null;
			}
			return this;
		}

		__proto._recoverHandlers=function(arr){
			if(!arr)return;
			if (arr.run){
				arr.recover();
				}else {
				for (var i=arr.length-1;i >-1;i--){
					if (arr[i]){
						arr[i].recover();
						arr[i]=null;
					}
				}
			}
		}

		/**
		*检测指定事件类型是否是鼠标事件。
		*@param type 事件的类型。
		*@return 如果是鼠标事件，则值为 true;否则，值为 false。
		*/
		__proto.isMouseEvent=function(type){
			return EventDispatcher.MOUSE_EVENTS[type];
		}

		EventDispatcher.MOUSE_EVENTS={"rightmousedown":true,"rightmouseup":true,"rightclick":true,"mousedown":true,"mouseup":true,"mousemove":true,"mouseover":true,"mouseout":true,"click":true,"doubleclick":true};
		EventDispatcher.__init$=function(){
			/**@private */
			//class EventHandler extends laya.utils.Handler
			EventHandler=(function(_super){
				function EventHandler(caller,method,args,once){
					EventHandler.__super.call(this,caller,method,args,once);
				}
				__class(EventHandler,'',_super);
				var __proto=EventHandler.prototype;
				__proto.recover=function(){
					if (this._id > 0){
						this._id=0;
						EventHandler._pool.push(this.clear());
					}
				}
				EventHandler.create=function(caller,method,args,once){
					(once===void 0)&& (once=true);
					if (EventHandler._pool.length)return EventHandler._pool.pop().setTo(caller,method,args,once);
					return new EventHandler(caller,method,args,once);
				}
				EventHandler._pool=[];
				return EventHandler;
			})(Handler)
		}

		return EventDispatcher;
	})()


	/**
	*<p><code>Handler</code> 是事件处理器类。</p>
	*<p>推荐使用 Handler.create()方法从对象池创建，减少对象创建消耗。</p>
	*<p><b>注意：</b>由于鼠标事件也用本对象池，不正确的回收及调用，可能会影响鼠标事件的执行。</p>
	*/
	//class laya.utils.Handler
	var Handler=(function(){
		function Handler(caller,method,args,once){
			//this.caller=null;
			//this.method=null;
			//this.args=null;
			this.once=false;
			this._id=0;
			(once===void 0)&& (once=false);
			this.setTo(caller,method,args,once);
		}

		__class(Handler,'laya.utils.Handler');
		var __proto=Handler.prototype;
		/**
		*设置此对象的指定属性值。
		*@param caller 执行域(this)。
		*@param method 回调方法。
		*@param args 携带的参数。
		*@param once 是否只执行一次，如果为true，执行后执行recover()进行回收。
		*@return 返回 handler 本身。
		*/
		__proto.setTo=function(caller,method,args,once){
			this._id=Handler._gid++;
			this.caller=caller;
			this.method=method;
			this.args=args;
			this.once=once;
			return this;
		}

		/**
		*执行处理器。
		*/
		__proto.run=function(){
			if (this.method==null)return null;
			var id=this._id;
			var result=this.method.apply(this.caller,this.args);
			this._id===id && this.once && this.recover();
			return result;
		}

		/**
		*执行处理器，携带额外数据。
		*@param data 附加的回调数据，可以是单数据或者Array(作为多参)。
		*/
		__proto.runWith=function(data){
			if (this.method==null)return null;
			var id=this._id;
			if (data==null)
				var result=this.method.apply(this.caller,this.args);
			else if (!this.args && !data.unshift)result=this.method.call(this.caller,data);
			else if (this.args)result=this.method.apply(this.caller,this.args.concat(data));
			else result=this.method.apply(this.caller,data);
			this._id===id && this.once && this.recover();
			return result;
		}

		/**
		*清理对象引用。
		*/
		__proto.clear=function(){
			this.caller=null;
			this.method=null;
			this.args=null;
			return this;
		}

		/**
		*清理并回收到 Handler 对象池内。
		*/
		__proto.recover=function(){
			if (this._id > 0){
				this._id=0;
				Handler._pool.push(this.clear());
			}
		}

		Handler.create=function(caller,method,args,once){
			(once===void 0)&& (once=true);
			if (Handler._pool.length)return Handler._pool.pop().setTo(caller,method,args,once);
			return new Handler(caller,method,args,once);
		}

		Handler._pool=[];
		Handler._gid=1;
		return Handler;
	})()


	/**
	*...
	*@author anling
	*/
	//class GameInfo
	var GameInfo=(function(){
		function GameInfo(){}
		__class(GameInfo,'GameInfo');
		GameInfo.ITEM_TYPE_NUM=8;
		GameInfo.ITEM_WIDTH=80;
		GameInfo.ITEM_HEIGHT=80;
		GameInfo.GAME_WIDTH=640;
		GameInfo.GAME_HEIGHT=1136;
		GameInfo.FALL_HEIGHT=800;
		GameInfo.ITEM_AREA_Y=1136-640;
		GameInfo.ROW_NUM=8;
		GameInfo.COLUMN_NUM=8;
		GameInfo.EAT_DURATION=200;
		return GameInfo;
	})()


	/**
	*...
	*@author anling
	*/
	//class Main
	var Main=(function(){
		function Main(){
			Laya.init(640,1136,WebGL);
			Laya.stage.scaleMode="showall";
			Laya.stage.bgColor="#ffffff";
			Stat.show();
			Laya.loader.load("res/fruit.json",new Handler(this,this.initGame),null,"atlas");
		}

		__class(Main,'Main');
		var __proto=Main.prototype;
		__proto.initGame=function(){
			var mainScene=new MainScene();
			Laya.stage.addChild(mainScene);
		}

		return Main;
	})()


	/**
	*...
	*@author anling
	*/
	//class manager.StomachManager
	var StomachManager=(function(){
		function StomachManager(){
			this._layer=null;
		}

		__class(StomachManager,'manager.StomachManager');
		var __proto=StomachManager.prototype;
		__proto.isFill=function(){
			return this._layer.isFill();
		}

		__proto.pushItem=function(item){
			this.layer.pushItem(item);
		}

		__proto.spitItem=function(){
			return this._layer.spitItem();
		}

		__proto.showExtraItem=function(){
			this._layer.showExtraItem();
		}

		__getset(0,__proto,'layer',function(){
			return this._layer;
			},function(ui){
			this._layer=ui;
		});

		StomachManager.getInstance=function(){
			if (StomachManager._instance==null){
				StomachManager._instance=new StomachManager();
			}
			return StomachManager._instance;
		}

		StomachManager._instance=null;
		return StomachManager;
	})()


	/**
	*双向链表
	*头尾均为无数据的哨兵节点，仅用于定位
	*哨兵节点与含数据的首尾节点为单向连接
	*遍历时节点为null结束
	*/
	//class utils.LinkList
	var LinkList=(function(){
		function LinkList(){
			this._length=0;
			this.headNode=null;
			this.tailNode=null;
			this.headNode=new ListNode(null);
			this.tailNode=new ListNode(null);
		}

		__class(LinkList,'utils.LinkList');
		var __proto=LinkList.prototype;
		// 向后添加
		__proto.pushBack=function(data){
			if (data==null)return;
			var node=new ListNode(data);
			var lastNode=this.tailNode.prev;
			if (!lastNode){
				this.headNode.next=node;
			}
			else {
				node.prev=lastNode;
				lastNode.next=node;
			}
			this.tailNode.prev=node;
			this._length+=1;
		}

		// 向后删除
		__proto.popBack=function(){
			var deleteNode=this.tailNode.prev;
			if (!deleteNode){
				return null;
			}
			else {
				var lastNode=deleteNode.prev;
				if (!lastNode){
					this.headNode.next=null;
					this.tailNode.prev=null;
				}
				else {
					this.tailNode.prev=lastNode;
					lastNode.next=null;
				}
				this._length-=1;
				return deleteNode.data;
			}
		}

		// 向前添加
		__proto.pushFront=function(data){
			if (data==null)return;
			var node=new ListNode(data);
			var firstNode=this.headNode.next;
			if (!firstNode){
				this.tailNode.prev=node;
			}
			else {
				node.next=firstNode;
				firstNode.prev=node;
			}
			this.headNode.next=node;
			this._length+=1;
		}

		// 向前删除
		__proto.popFront=function(){
			var deleteNode=this.headNode.next;
			if (!deleteNode){
				return null;
			}
			else {
				var firstNode=deleteNode.next;
				if (!firstNode){
					this.headNode.next=null;
					this.tailNode.prev=null;
				}
				else {
					this.headNode.next=firstNode;
					firstNode.prev=null;
				}
				this._length-=1;
				return deleteNode.data;
			}
		}

		// 插入 寻找到的第一个preData之后
		__proto.insert=function(preData,data){
			if (data==null)return;
			var prevNode=this.tailNode.prev;
			if (prevNode==null || prevNode.data==preData){
				this.pushBack(data);
				return;
			}
			prevNode=this.findNode(preData);
			if (prevNode !=null){
				var node=new ListNode(data);
				var nextNode=prevNode.next;
				prevNode.next=node;
				node.prev=prevNode;
				node.next=nextNode;
				nextNode.prev=node;
				this._length+=1;
				return;
			}
		}

		// 移除 寻找到的第一个data
		__proto.remove=function(data){
			if (data==null || this._length==0)return null;
			var node=this.tailNode.prev;
			if (node.data==data){
				return this.popBack();
			}
			node=this.headNode.next;
			if (node.data==data){
				return this.popFront();
			}
			node=this.findNode(data);
			if (node !=null){
				var prevNode=node.prev;
				var nextNode=node.next;
				prevNode.next=nextNode;
				nextNode.prev=prevNode;
				this._length-=1;
				return node.data;
			}
			return null;
		}

		// 从两端查找该数据的节点
		__proto.findNode=function(data){
			var prevNode=this.headNode.next;
			var nextNode=this.tailNode.prev;
			if (!prevNode)return null;
			while (1){
				if (prevNode.data==data)return prevNode;
				if (nextNode.data==data)return nextNode;
				if (prevNode==nextNode){
					if (prevNode && prevNode.data==data)return prevNode;
					else return null;
				}
				if (prevNode.next==nextNode)return null;
				prevNode=prevNode.next;
				nextNode=nextNode.prev;
			}
			return null;
		}

		// 清空
		__proto.clear=function(){
			var node=this.headNode.next;
			while (node !=null){
				var nextNode=node.next;
				node.data=null;
				node.prev=null;
				node.next=null;
				node=nextNode;
			}
			this.headNode.next=null;
			this.tailNode.prev=null;
			this._length=0;
		}

		// 转为字符串
		__proto.toString=function(){
			var str="";
			var node=this.headNode.next;
			var id=0;
			for (node;node !=null;node=node.next){
				str+="[id: "+id+", data: "+node.data+"]\n";
				id+=1;
			}
			return str;
		}

		// 取得长度
		__getset(0,__proto,'length',function(){
			return this._length;
		});

		return LinkList;
	})()


	//class utils.ListNode
	var ListNode=(function(){
		function ListNode(data){
			this._data=null;
			this._prev=null;
			this._next=null;
			this._data=data;
			this._prev=this._next=null;
		}

		__class(ListNode,'utils.ListNode');
		var __proto=ListNode.prototype;
		__getset(0,__proto,'data',function(){
			return this._data;
			},function(data){
			this._data=data;
		});

		__getset(0,__proto,'next',function(){
			return this._next;
			},function(node){
			this._next=node;
		});

		__getset(0,__proto,'prev',function(){
			return this._prev;
			},function(node){
			this._prev=node;
		});

		return ListNode;
	})()


	/**
	*Config 用于配置一些全局参数。
	*/
	//class Config
	var Config=(function(){
		function Config(){};
		__class(Config,'Config');
		Config.WebGLTextCacheCount=500;
		Config.atlasEnable=false;
		Config.showCanvasMark=false;
		Config.CPUMemoryLimit=120 *1024 *1024;
		Config.GPUMemoryLimit=160 *1024 *1024;
		Config.animationInterval=30;
		Config.isAntialias=true;
		return Config;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.ShaderValue
	var ShaderValue=(function(){
		function ShaderValue(){}
		__class(ShaderValue,'laya.webgl.shader.ShaderValue');
		return ShaderValue;
	})()


	/**
	*<code>Graphics</code> 类用于创建绘图显示对象。
	*@see laya.display.Sprite#graphics
	*/
	//class laya.display.Graphics
	var Graphics=(function(){
		function Graphics(){
			//this._sp=null;
			this._one=null;
			this._cmds=null;
			//this._temp=null;
			//this._bounds=null;
			//this._rstBoundPoints=null;
			//this._vectorgraphArray=null;
			this._render=this._renderEmpty;
			this._render=this._renderEmpty;
			if (Render.isConchNode){
				this._nativeObj=new _conchGraphics();;
				this.id=this._nativeObj.conchID;;
			}
		}

		__class(Graphics,'laya.display.Graphics');
		var __proto=Graphics.prototype;
		/**
		*<p>销毁此对象。</p>
		*/
		__proto.destroy=function(){
			this.clear();
			this._temp=null;
			this._bounds=null;
			this._rstBoundPoints=null;
			this._sp && (this._sp._renderType=0);
			this._sp=null;
		}

		/**
		*<p>清空绘制命令。</p>
		*/
		__proto.clear=function(){
			this._one=null;
			this._render=this._renderEmpty;
			this._cmds=null;
			this._temp && (this._temp.length=0);
			this._sp && (this._sp._renderType &=~0x01);
			this._sp && (this._sp._renderType &=~0x100);
			this._repaint();
			if (this._vectorgraphArray){
				for (var i=0,n=this._vectorgraphArray.length;i < n;i++){
					VectorGraphManager.getInstance().deleteShape(this._vectorgraphArray[i]);
				}
				this._vectorgraphArray.length=0;
			}
		}

		/**
		*@private
		*重绘此对象。
		*/
		__proto._repaint=function(){
			this._temp && (this._temp.length=0);
			this._sp && this._sp.repaint();
		}

		/**@private */
		__proto._isOnlyOne=function(){
			return !this._cmds || this._cmds.length===0;
		}

		/**
		*获取位置及宽高信息矩阵(比较耗，尽量少用)。
		*@return 位置与宽高组成的 一个 Rectangle 对象。
		*/
		__proto.getBounds=function(){
			if (!this._bounds || !this._temp || this._temp.length < 1){
				this._bounds=Rectangle._getWrapRec(this.getBoundPoints(),this._bounds)
			}
			return this._bounds;
		}

		/**
		*@private
		*获取端点列表。
		*/
		__proto.getBoundPoints=function(){
			if (!this._temp || this._temp.length < 1)
				this._temp=this._getCmdPoints();
			return this._rstBoundPoints=Utils.copyArray(this._rstBoundPoints,this._temp);
		}

		__proto._addCmd=function(a){
			this._cmds=this._cmds || [];
			a.callee=a.shift();
			this._cmds.push(a);
		}

		__proto._getCmdPoints=function(){
			var context=Render._context;
			var cmds=this._cmds;
			var rst;
			rst=this._temp || (this._temp=[]);
			rst.length=0;
			if (!cmds && this._one !=null){
				Graphics._tempCmds.length=0;
				Graphics._tempCmds.push(this._one);
				cmds=Graphics._tempCmds;
			}
			if (!cmds)
				return rst;
			var matrixs;
			matrixs=Graphics._tempMatrixArrays;
			matrixs.length=0;
			var tMatrix=Graphics._initMatrix;
			tMatrix.identity();
			var tempMatrix=Graphics._tempMatrix;
			var cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				cmd=cmds[i];
				switch (cmd.callee){
					case context.save:
					case 7:
						matrixs.push(tMatrix);
						tMatrix=tMatrix.clone();
						break ;
					case context.restore:
					case 8:
						tMatrix=matrixs.pop();
						break ;
					case context._scale:
					case 5:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[2],-cmd[3]);
						tempMatrix.scale(cmd[0],cmd[1]);
						tempMatrix.translate(cmd[2],cmd[3]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._rotate:
					case 3:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.rotate(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._translate:
					case 6:
						tempMatrix.identity();
						tempMatrix.translate(cmd[0],cmd[1]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case context._transform:
					case 4:
						tempMatrix.identity();
						tempMatrix.translate(-cmd[1],-cmd[2]);
						tempMatrix.concat(cmd[0]);
						tempMatrix.translate(cmd[1],cmd[2]);
						this._switchMatrix(tMatrix,tempMatrix);
						break ;
					case 16:
					case 24:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case 17:
						tMatrix.copyTo(tempMatrix);
						tempMatrix.concat(cmd[4]);
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tempMatrix);
						break ;
					case context._drawTexture:
					case context._fillTexture:
						if (cmd[3] && cmd[4]){
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
							}else {
							var tex=cmd[0];
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tMatrix);
						}
						break ;
					case context._drawTextureWithTransform:
						tMatrix.copyTo(tempMatrix);
						tempMatrix.concat(cmd[5]);
						if (cmd[3] && cmd[4]){
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],cmd[3],cmd[4]),tempMatrix);
							}else {
							tex=cmd[0];
							Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[1],cmd[2],tex.width,tex.height),tempMatrix);
						}
						break ;
					case context._drawRect:
					case 13:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0],cmd[1],cmd[2],cmd[3]),tMatrix);
						break ;
					case context._drawCircle:
					case context._fillCircle:
					case 14:
						Graphics._addPointArrToRst(rst,Rectangle._getBoundPointS(cmd[0]-cmd[2],cmd[1]-cmd[2],cmd[2]+cmd[2],cmd[2]+cmd[2]),tMatrix);
						break ;
					case context._drawLine:
					case 20:
						Graphics._tempPoints.length=0;
						var lineWidth=NaN;
						lineWidth=cmd[5] *0.5;
						if (cmd[0]==cmd[2]){
							Graphics._tempPoints.push(cmd[0]+lineWidth,cmd[1],cmd[2]+lineWidth,cmd[3],cmd[0]-lineWidth,cmd[1],cmd[2]-lineWidth,cmd[3]);
							}else if (cmd[1]==cmd[3]){
							Graphics._tempPoints.push(cmd[0],cmd[1]+lineWidth,cmd[2],cmd[3]+lineWidth,cmd[0],cmd[1]-lineWidth,cmd[2],cmd[3]-lineWidth);
							}else {
							Graphics._tempPoints.push(cmd[0],cmd[1],cmd[2],cmd[3]);
						}
						Graphics._addPointArrToRst(rst,Graphics._tempPoints,tMatrix);
						break ;
					case context._drawCurves:
					case 22:
						Graphics._addPointArrToRst(rst,Bezier.I.getBezierPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPoly:
					case context._drawLines:
					case 18:
						Graphics._addPointArrToRst(rst,cmd[2],tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPath:
					case 19:
						Graphics._addPointArrToRst(rst,this._getPathPoints(cmd[2]),tMatrix,cmd[0],cmd[1]);
						break ;
					case context._drawPie:
					case 15:
						Graphics._addPointArrToRst(rst,this._getPiePoints(cmd[0],cmd[1],cmd[2],cmd[3],cmd[4]),tMatrix);
						break ;
					}
			}
			if (rst.length > 200){
				rst=Utils.copyArray(rst,Rectangle._getWrapRec(rst)._getBoundPoints());
			}else if (rst.length > 8)
			rst=GrahamScan.scanPList(rst);
			return rst;
		}

		__proto._switchMatrix=function(tMatix,tempMatrix){
			tempMatrix.concat(tMatix);
			tempMatrix.copyTo(tMatix);
		}

		/**
		*绘制纹理。
		*@param tex 纹理。
		*@param x X 轴偏移量。
		*@param y Y 轴偏移量。
		*@param width 宽度。
		*@param height 高度。
		*@param m 矩阵信息。
		*/
		__proto.drawTexture=function(tex,x,y,width,height,m){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			if (!tex)return;
			if (!width)width=tex.sourceWidth;
			if (!height)height=tex.sourceHeight;
			width=width-tex.sourceWidth+tex.width;
			height=height-tex.sourceHeight+tex.height;
			if (tex.loaded && (width <=0 || height <=0))return;
			x+=tex.offsetX;
			y+=tex.offsetY;
			this._sp && (this._sp._renderType |=0x100);
			var args=[tex,x,y,width,height,m];
			args.callee=m ? Render._context._drawTextureWithTransform :Render._context._drawTexture;
			if (this._one==null && !m){
				this._one=args;
				this._render=this._renderOneImg;
				}else {
				this._saveToCmd(args.callee,args);
			}
			if (!tex.loaded){
				tex.once("loaded",this,this._textureLoaded,[tex,args]);
			}
			this._repaint();
		}

		/**
		*用texture填充
		*@param tex 纹理。
		*@param x X 轴偏移量。
		*@param y Y 轴偏移量。
		*@param width 宽度。
		*@param height 高度。
		*@param type 填充类型 repeat|repeat-x|repeat-y|no-repeat
		*@param offset 贴图纹理偏移
		*
		*/
		__proto.fillTexture=function(tex,x,y,width,height,type,offset){
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(type===void 0)&& (type="repeat");
			if (!tex)return;
			var args=[tex,x,y,width,height,type,offset];
			if (!tex.loaded){
				tex.once("loaded",this,this._textureLoaded,[tex,args]);
			}
			if (Render.isWebGL){
				var tFillTextureSprite=RunDriver.fillTextureShader(tex,x,y,width,height);
				args.push(tFillTextureSprite);
			}
			this._saveToCmd(Render._context._fillTexture,args);
		}

		__proto._textureLoaded=function(tex,param){
			param[3]=param[3] || tex.width;
			param[4]=param[4] || tex.height;
			this._repaint();
		}

		/**
		*@private
		*保存到命令流。
		*/
		__proto._saveToCmd=function(fun,args){
			this._sp && (this._sp._renderType |=0x100);
			if (this._one==null){
				this._one=args;
				this._render=this._renderOne;
				}else {
				this._sp && (this._sp._renderType &=~0x01);
				this._render=this._renderAll;
				(this._cmds || (this._cmds=[])).length===0 && this._cmds.push(this._one);
				this._cmds.push(args);
			}
			args.callee=fun;
			this._temp && (this._temp.length=0);
			this._repaint();
			return args;
		}

		/**
		*设置剪裁区域，超出剪裁区域的坐标不显示。
		*@param x X 轴偏移量。
		*@param y Y 轴偏移量。
		*@param width 宽度。
		*@param height 高度。
		*/
		__proto.clipRect=function(x,y,width,height){
			this._saveToCmd(Render._context._clipRect,[x,y,width,height]);
		}

		/**
		*在画布上绘制文本。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字号和字体，比如"20px Arial"。
		*@param color 定义文本颜色，比如"#ff0000"。
		*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
		*/
		__proto.fillText=function(text,x,y,font,color,textAlign){
			this._saveToCmd(Render._context._fillText,[text,x,y,font || Font.defaultFont,color,textAlign]);
		}

		/**
		*在画布上绘制“被填充且镶边的”文本。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号，比如"20px Arial"。
		*@param fillColor 定义文本颜色，比如"#ff0000"。
		*@param borderColor 定义镶边文本颜色。
		*@param lineWidth 镶边线条宽度。
		*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
		*/
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			this._saveToCmd(Render._context._fillBorderText,[text,x,y,font || Font.defaultFont,fillColor,borderColor,lineWidth,textAlign]);
		}

		/**
		*在画布上绘制文本（没有填色）。文本的默认颜色是黑色。
		*@param text 在画布上输出的文本。
		*@param x 开始绘制文本的 x 坐标位置（相对于画布）。
		*@param y 开始绘制文本的 y 坐标位置（相对于画布）。
		*@param font 定义字体和字号，比如"20px Arial"。
		*@param color 定义文本颜色，比如"#ff0000"。
		*@param lineWidth 线条宽度。
		*@param textAlign 文本对齐方式，可选值："left"，"center"，"right"。
		*/
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this._saveToCmd(Render._context._strokeText,[text,x,y,font || Font.defaultFont,color,lineWidth,textAlign]);
		}

		/**
		*设置透明度。
		*@param value 透明度。
		*/
		__proto.alpha=function(value){
			this._saveToCmd(Render._context._alpha,[value]);
		}

		/**
		*替换绘图的当前转换矩阵。
		*@param mat 矩阵。
		*@param pivotX 水平方向轴心点坐标。
		*@param pivotY 垂直方向轴心点坐标。
		*/
		__proto.transform=function(matrix,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._transform,[matrix,pivotX,pivotY]);
		}

		/**
		*旋转当前绘图。
		*@param angle 旋转角度，以弧度计。
		*@param pivotX 水平方向轴心点坐标。
		*@param pivotY 垂直方向轴心点坐标。
		*/
		__proto.rotate=function(angle,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._rotate,[angle,pivotX,pivotY]);
		}

		/**
		*缩放当前绘图至更大或更小。
		*@param scaleX 水平方向缩放值。
		*@param scaleY 垂直方向缩放值。
		*@param pivotX 水平方向轴心点坐标。
		*@param pivotY 垂直方向轴心点坐标。
		*/
		__proto.scale=function(scaleX,scaleY,pivotX,pivotY){
			(pivotX===void 0)&& (pivotX=0);
			(pivotY===void 0)&& (pivotY=0);
			this._saveToCmd(Render._context._scale,[scaleX,scaleY,pivotX,pivotY]);
		}

		/**
		*重新映射画布上的 (0,0)位置。
		*@param x 添加到水平坐标（x）上的值。
		*@param y 添加到垂直坐标（y）上的值。
		*/
		__proto.translate=function(x,y){
			this._saveToCmd(Render._context._translate,[x,y]);
		}

		/**
		*保存当前环境的状态。
		*/
		__proto.save=function(){
			this._saveToCmd(Render._context._save,[]);
		}

		/**
		*返回之前保存过的路径状态和属性。
		*/
		__proto.restore=function(){
			this._saveToCmd(Render._context._restore,[]);
		}

		/**
		*@private
		*替换文本内容。
		*@param text 文本内容。
		*@return 替换成功则值为true，否则值为flase。
		*/
		__proto.replaceText=function(text){
			this._repaint();
			var cmds=this._cmds;
			if (!cmds){
				if (this._one && this._isTextCmd(this._one.callee)){
					if (this._one[0].toUpperCase)this._one[0]=text;
					else this._one[0].setText(text);
					return true;
				}
				}else {
				for (var i=cmds.length-1;i >-1;i--){
					if (this._isTextCmd(cmds[i].callee)){
						if (cmds[i][0].toUpperCase)cmds[i][0]=text;
						else cmds[i][0].setText(text);
						return true;
					}
				}
			}
			return false;
		}

		/**@private */
		__proto._isTextCmd=function(fun){
			return fun===Render._context._fillText || fun===Render._context._fillBorderText || fun===Render._context._strokeText;
		}

		/**
		*@private
		*替换文本颜色。
		*@param color 颜色。
		*/
		__proto.replaceTextColor=function(color){
			this._repaint();
			var cmds=this._cmds;
			if (!cmds){
				if (this._one && this._isTextCmd(this._one.callee)){
					this._one[4]=color;
					if (!this._one[0].toUpperCase)this._one[0].changed=true;
				}
				}else {
				for (var i=cmds.length-1;i >-1;i--){
					if (this._isTextCmd(cmds[i].callee)){
						cmds[i][4]=color;
						if (!cmds[i][0].toUpperCase)cmds[i][0].changed=true;
					}
				}
			}
		}

		/**
		*加载并显示一个图片。
		*@param url 图片地址。
		*@param x 显示图片的x位置。
		*@param y 显示图片的y位置。
		*@param width 显示图片的宽度，设置为0表示使用图片默认宽度。
		*@param height 显示图片的高度，设置为0表示使用图片默认高度。
		*@param complete 加载完成回调。
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			var tex=Loader.getRes(url);
			if (tex)onloaded(tex);
			else Laya.loader.load(url,Handler.create(null,onloaded),null,"image");
			function onloaded (tex){
				if (tex){
					_$this.drawTexture(tex,x,y,width,height);
					if (complete !=null)complete.call(_$this._sp,tex);
				}
			}
		}

		/**
		*@private
		*/
		__proto._renderEmpty=function(sprite,context,x,y){}
		/**
		*@private
		*/
		__proto._renderAll=function(sprite,context,x,y){
			var cmds=this._cmds,cmd;
			for (var i=0,n=cmds.length;i < n;i++){
				(cmd=cmds[i]).callee.call(context,x,y,cmd);
			}
		}

		/**
		*@private
		*/
		__proto._renderOne=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
		}

		/**
		*@private
		*/
		__proto._renderOneImg=function(sprite,context,x,y){
			this._one.callee.call(context,x,y,this._one);
			if (sprite._renderType!==2305){
				sprite._renderType |=0x01;
			}
		}

		/**
		*绘制一条线。
		*@param fromX X 轴开始位置。
		*@param fromY Y 轴开始位置。
		*@param toX X 轴结束位置。
		*@param toY Y 轴结束位置。
		*@param lineColor 颜色。
		*@param lineWidth 线条宽度。
		*/
		__proto.drawLine=function(fromX,fromY,toX,toY,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[fromX+0.5,fromY+0.5,toX+0.5,toY+0.5,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawLine,arr);
		}

		/**
		*绘制一系列线段。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param points 线段的点集合。格式:[x1,y1,x2,y2,x3,y3...]。
		*@param lineColor 线段颜色，或者填充绘图的渐变对象。
		*@param lineWidth 线段宽度。
		*/
		__proto.drawLines=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+0.5,y+0.5,points,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawLines,arr);
		}

		/**
		*绘制一系列曲线。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param points 线段的点集合，格式[startx,starty,ctrx,ctry,startx,starty...]。
		*@param lineColor 线段颜色，或者填充绘图的渐变对象。
		*@param lineWidth 线段宽度。
		*/
		__proto.drawCurves=function(x,y,points,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var arr=[x+0.5,y+0.5,points,lineColor,lineWidth];
			this._saveToCmd(Render._context._drawCurves,arr);
		}

		/**
		*绘制矩形。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param width 矩形宽度。
		*@param height 矩形高度。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawRect=function(x,y,width,height,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var arr=[x+offset,y+offset,width,height,fillColor,lineColor,lineWidth];
			this._saveToCmd(Render._context._drawRect,arr);
		}

		/**
		*绘制圆形。
		*@param x 圆点X 轴位置。
		*@param y 圆点Y 轴位置。
		*@param radius 半径。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawCircle=function(x,y,radius,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+offset,y+offset,radius,fillColor,lineColor,lineWidth,tId];
			this._saveToCmd(Render._context._drawCircle,arr);
		}

		/**
		*绘制扇形。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param radius 扇形半径。
		*@param startAngle 开始角度。
		*@param endAngle 结束角度。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawPie=function(x,y,radius,startAngle,endAngle,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
			};
			var arr=[x+offset,y+offset,radius,startAngle,endAngle,fillColor,lineColor,lineWidth,tId];
			arr[3]=Utils.toRadian(startAngle);
			arr[4]=Utils.toRadian(endAngle);
			this._saveToCmd(Render._context._drawPie,arr);
		}

		__proto._getPiePoints=function(x,y,radius,startAngle,endAngle){
			var rst=Graphics._tempPoints;
			Graphics._tempPoints.length=0;
			rst.push(x,y);
			var dP=Math.PI / 10;
			var i=NaN;
			for (i=startAngle;i < endAngle;i+=dP){
				rst.push(x+radius *Math.cos(i),y+radius *Math.sin(i));
			}
			if (endAngle !=i){
				rst.push(x+radius *Math.cos(endAngle),y+radius *Math.sin(endAngle));
			}
			return rst;
		}

		/**
		*绘制多边形。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param points 多边形的点集合。
		*@param fillColor 填充颜色，或者填充绘图的渐变对象。
		*@param lineColor 边框颜色，或者填充绘图的渐变对象。
		*@param lineWidth 边框宽度。
		*/
		__proto.drawPoly=function(x,y,points,fillColor,lineColor,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var offset=lineColor ? 0.5 :0;
			var tId=0;
			if (Render.isWebGL){
				tId=VectorGraphManager.getInstance().getId();
				if (this._vectorgraphArray==null)this._vectorgraphArray=[];
				this._vectorgraphArray.push(tId);
				var tIsConvexPolygon=false;
				if (points.length > 6){
					tIsConvexPolygon=false;
					}else {
					tIsConvexPolygon=true;
				}
			};
			var arr=[x+offset,y+offset,points,fillColor,lineColor,lineWidth,tId,tIsConvexPolygon];
			this._saveToCmd(Render._context._drawPoly,arr);
		}

		__proto._getPathPoints=function(paths){
			var i=0,len=0;
			var rst=Graphics._tempPoints;
			rst.length=0;
			len=paths.length;
			var tCMD;
			for (i=0;i < len;i++){
				tCMD=paths[i];
				if (tCMD.length > 1){
					rst.push(tCMD[1],tCMD[2]);
					if (tCMD.length > 3){
						rst.push(tCMD[3],tCMD[4]);
					}
				}
			}
			return rst;
		}

		/**
		*绘制路径。
		*@param x 开始绘制的 X 轴位置。
		*@param y 开始绘制的 Y 轴位置。
		*@param paths 路径集合，路径支持以下格式：[["moveTo",x,y],["lineTo",x,y,x,y,x,y],["arcTo",x1,y1,x2,y2,r],["closePath"]]。
		*@param brush 刷子定义，支持以下设置{fillStyle}。
		*@param pen 画笔定义，支持以下设置{strokeStyle,lineWidth,lineJoin,lineCap,miterLimit}。
		*/
		__proto.drawPath=function(x,y,paths,brush,pen){
			var arr=[x+0.5,y+0.5,paths,brush,pen];
			this._saveToCmd(Render._context._drawPath,arr);
		}

		/**@private */
		/**
		*@private
		*命令流。
		*/
		__getset(0,__proto,'cmds',function(){
			return this._cmds;
			},function(value){
			this._sp && (this._sp._renderType |=0x100);
			this._cmds=value;
			this._render=this._renderAll;
			this._repaint();
		});

		Graphics.__init__=function(){
			if (Render.isConchNode){
				var from=laya.display.Graphics.prototype;
				var to=ConchGraphics.prototype;
				var list=["clear","destroy","alpha","rotate","transform","scale","translate","save","restore","clipRect","blendMode","fillText","fillBorderText","_fands","drawRect","drawCircle","drawPie","drawPoly","drawPath","drawImageM","drawLine","drawLines","_drawPs","drawCurves","replaceText","replaceTextColor","_fillImage","fillTexture"];
				for (var i=0,len=list.length;i <=len;i++){
					var temp=list[i];
					from[temp]=to[temp];
				}
				from._saveToCmd=null;
				from.drawTexture=function (tex,x,y,width,height,m){
					(x===void 0)&& (x=0);
					(y===void 0)&& (y=0);
					(width===void 0)&& (width=0);
					(height===void 0)&& (height=0);
					if (!(tex.loaded && tex.bitmap && tex.source)){
						return;
					}
					if (!width)width=tex.sourceWidth;
					if (!height)height=tex.sourceHeight;
					width=width-tex.sourceWidth+tex.width;
					height=height-tex.sourceHeight+tex.height;
					if (width <=0 || height <=0)return;
					x+=tex.offsetX;
					y+=tex.offsetY;
					var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
					this.drawImageM(tex.bitmap.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x,y,width,height,m);
				}
				from.fillTexture=function (tex,x,y,width,height,type,offset){
					(width===void 0)&& (width=0);
					(height===void 0)&& (height=0);
					(type===void 0)&& (type="repeat");
					if (tex.loaded){
						var ctxi=Render._context.ctx;
						var w=tex.bitmap.width,h=tex.bitmap.height,uv=tex.uv;
						var pat;
						if (tex.uv !=Texture.DEF_UV){
							pat=ctxi.createPattern(tex.bitmap.source,type,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h);
							}else {
							pat=ctxi.createPattern(tex.bitmap.source,type);
						};
						var sX=0,sY=0;
						if (offset){
							x+=offset.x % tex.width;
							y+=offset.y % tex.height;
							sX-=offset.x % tex.width;
							sY-=offset.y % tex.height;
						}
						this._fillImage(pat,x,y,sX,sY,width,height);
					}
				}
			}
		}

		Graphics._addPointArrToRst=function(rst,points,matrix,dx,dy){
			(dx===void 0)&& (dx=0);
			(dy===void 0)&& (dy=0);
			var i=0,len=0;
			len=points.length;
			for (i=0;i < len;i+=2){
				Graphics._addPointToRst(rst,points[i]+dx,points[i+1]+dy,matrix);
			}
		}

		Graphics._addPointToRst=function(rst,x,y,matrix){
			var _tempPoint=Point.TEMP;
			_tempPoint.setTo(x ? x :0,y ? y :0);
			matrix.transformPoint(_tempPoint);
			rst.push(_tempPoint.x,_tempPoint.y);
		}

		Graphics._tempPoints=[];
		Graphics._tempMatrixArrays=[];
		Graphics._tempCmds=[];
		__static(Graphics,
		['_tempMatrix',function(){return this._tempMatrix=new Matrix();},'_initMatrix',function(){return this._initMatrix=new Matrix();}
		]);
		return Graphics;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.ShaderDefines
	var ShaderDefines=(function(){
		function ShaderDefines(name2int,int2name,int2nameMap){
			this._value=0;
			//this._name2int=null;
			//this._int2name=null;
			//this._int2nameMap=null;
			this._name2int=name2int;
			this._int2name=int2name;
			this._int2nameMap=int2nameMap;
		}

		__class(ShaderDefines,'laya.webgl.shader.ShaderDefines');
		var __proto=ShaderDefines.prototype;
		__proto.add=function(value){
			if ((typeof value=='string'))value=this._name2int[value];
			this._value |=value;
			return this._value;
		}

		__proto.addInt=function(value){
			this._value |=value;
			return this._value;
		}

		__proto.remove=function(value){
			if ((typeof value=='string'))value=this._name2int[value];
			this._value &=(~value);
			return this._value;
		}

		__proto.isDefine=function(def){
			return (this._value & def)===def;
		}

		__proto.getValue=function(){
			return this._value;
		}

		__proto.setValue=function(value){
			this._value=value;
		}

		__proto.toNameDic=function(){
			var r=this._int2nameMap[this._value];
			return r?r:ShaderDefines._toText(this._value,this._int2name,this._int2nameMap);
		}

		ShaderDefines._reg=function(name,value,_name2int,_int2name){
			_name2int[name]=value;
			_int2name[value]=name;
		}

		ShaderDefines._toText=function(value,_int2name,_int2nameMap){
			var r=_int2nameMap[value];
			if (r)return r;
			var o={};
			var d=1;
			for (var i=0;i < 32;i++){
				d=1 << i;
				if (d > value)break ;
				if (value & d){
					var name=_int2name[d];
					name && (o[name]="");
				}
			}
			_int2nameMap[value]=o;
			return o;
		}

		ShaderDefines._toInt=function(names,_name2int){
			var words=names.split('.');
			var num=0;
			for (var i=0,n=words.length;i < n;i++){
				var value=_name2int[words[i]];
				if (!value)throw new Error("Defines to int err:"+names+"/"+words[i]);
				num |=value;
			}
			return num;
		}

		return ShaderDefines;
	})()


	/**
	*<code>BitmapFont</code> 是位图字体类，用于定义位图字体信息。
	*/
	//class laya.display.BitmapFont
	var BitmapFont=(function(){
		function BitmapFont(){
			this.fontSize=12;
			this.autoScaleSize=false;
			this._texture=null;
			this._fontCharDic={};
			this._complete=null;
			this._path=null;
			this._maxHeight=0;
			this._maxWidth=0;
			this._spaceWidth=10;
			this._leftPadding=0;
			this._rightPadding=0;
			this._letterSpacing=0;
		}

		__class(BitmapFont,'laya.display.BitmapFont');
		var __proto=BitmapFont.prototype;
		/**
		*通过指定位图字体文件路径，加载位图字体文件。
		*@param path 位图字体文件的路径。
		*@param complete 加载完成的回调，通知上层字体文件已经完成加载并解析。
		*/
		__proto.loadFont=function(path,complete){
			this._path=path;
			this._complete=complete;
			Laya.loader.load([{url:this._path,type:"xml"},{url:this._path.replace(".fnt",".png"),type:"image"}],Handler.create(this,this.onLoaded));
		}

		__proto.onLoaded=function(){
			this.parseFont(Loader.getRes(this._path),Loader.getRes(this._path.replace(".fnt",".png")));
			this._complete && this._complete.run();
		}

		/**
		*解析字体文件。
		*@param xml 字体文件XML。
		*@param texture 字体的纹理。
		*/
		__proto.parseFont=function(xml,texture){
			if (xml==null || texture==null)return;
			this._texture=texture;
			var tX=0;
			var tScale=1;
			var tInfo=xml.getElementsByTagName("info");
			this.fontSize=parseInt(tInfo[0].attributes["size"].nodeValue);
			var tPadding=tInfo[0].attributes["padding"].nodeValue;
			var tPaddingArray=tPadding.split(",");
			var tUpPadding=parseInt(tPaddingArray[0]);
			var tDownPadding=parseInt(tPaddingArray[2]);
			this._leftPadding=parseInt(tPaddingArray[3]);
			this._rightPadding=parseInt(tPaddingArray[1]);
			var chars=xml.getElementsByTagName("char");
			var i=0;
			for (i=0;i < chars.length;i++){
				var tAttribute=chars[i].attributes;
				var tId=parseInt(tAttribute["id"].nodeValue);
				var xOffset=parseInt(tAttribute["xoffset"].nodeValue)/ tScale;
				var yOffset=parseInt(tAttribute["yoffset"].nodeValue)/ tScale;
				var xAdvance=parseInt(tAttribute["xadvance"].nodeValue)/ tScale;
				var region=new Rectangle();
				region.x=parseInt(tAttribute["x"].nodeValue);
				region.y=parseInt(tAttribute["y"].nodeValue);
				region.width=parseInt(tAttribute["width"].nodeValue);
				region.height=parseInt(tAttribute["height"].nodeValue);
				var tTexture=Texture.create(texture,region.x,region.y,region.width,region.height,xOffset,yOffset);
				this._maxHeight=Math.max(this._maxHeight,tUpPadding+tDownPadding+tTexture.height);
				this._maxWidth=Math.max(this._maxWidth,tTexture.width);
				this._fontCharDic[tId]=tTexture;
			}
			if (this.getCharTexture(" "))this.setSpaceWidth(this.getCharWidth(" "));
		}

		/**
		*获取指定字符的字体纹理对象。
		*@param char 字符。
		*@return 指定的字体纹理对象。
		*/
		__proto.getCharTexture=function(char){
			return this._fontCharDic[char.charCodeAt(0)];
		}

		/**
		*销毁位图字体，调用Text.unregisterBitmapFont 时，默认会销毁。
		*/
		__proto.destroy=function(){
			var tTexture=null;
			for (var p in this._fontCharDic){
				tTexture=this._fontCharDic[p];
				if (tTexture)tTexture.destroy();
				delete this._fontCharDic[p];
			}
			this._texture.destroy();
		}

		/**
		*设置空格的宽（如果字体库有空格，这里就可以不用设置了）。
		*@param spaceWidth 宽度，单位为像素。
		*/
		__proto.setSpaceWidth=function(spaceWidth){
			this._spaceWidth=spaceWidth;
		}

		/**
		*获取指定字符的宽度。
		*@param char 字符。
		*@return 宽度。
		*/
		__proto.getCharWidth=function(char){
			if (char==" ")return this._spaceWidth+this._letterSpacing;
			var tTexture=this.getCharTexture(char)
			if (tTexture)return tTexture.width+tTexture.offsetX *2+this._letterSpacing;
			return 0;
		}

		/**
		*获取指定文本内容的宽度。
		*@param text 文本内容。
		*@return 宽度。
		*/
		__proto.getTextWidth=function(text){
			var tWidth=0;
			for (var i=0,n=text.length;i < n;i++){
				tWidth+=this.getCharWidth(text.charAt(i));
			}
			return tWidth;
		}

		/**
		*获取最大字符宽度。
		*/
		__proto.getMaxWidth=function(){
			return this._maxWidth+this._letterSpacing;
		}

		/**
		*获取最大字符高度。
		*/
		__proto.getMaxHeight=function(){
			return this._maxHeight;
		}

		/**
		*@private
		*将指定的文本绘制到指定的显示对象上。
		*/
		__proto.drawText=function(text,sprite,drawX,drawY,align,width){
			var tWidth=0;
			var tTexture;
			for (var i=0,n=text.length;i < n;i++){
				tWidth+=this.getCharWidth(text.charAt(i));
			};
			var dx=this._leftPadding;
			align==="center" && (dx=(width-tWidth)/ 2);
			align==="right" && (dx=(width-tWidth)-this._rightPadding);
			var tX=0;
			for (i=0,n=text.length;i < n;i++){
				tTexture=this.getCharTexture(text.charAt(i));
				if (tTexture)sprite.graphics.drawTexture(tTexture,drawX+tX+dx,drawY,tTexture.width,tTexture.height);
				tX+=this.getCharWidth(text.charAt(i));
			}
		}

		/**
		*设置字符之间的间距（以像素为单位）。
		*/
		/**
		*获取字符之间的间距（以像素为单位）。
		*/
		__getset(0,__proto,'letterSpacing',function(){
			return this._letterSpacing;
			},function(value){
			this._letterSpacing=value;
		});

		return BitmapFont;
	})()


	/**
	*@private
	*<code>Style</code> 类是元素样式定义类。
	*/
	//class laya.display.css.Style
	var Style=(function(){
		function Style(){
			this.alpha=1;
			this.visible=true;
			this.scrollRect=null;
			this.blendMode=null;
			this._type=0;
			this._tf=Style._TF_EMPTY;
		}

		__class(Style,'laya.display.css.Style');
		var __proto=Style.prototype;
		__proto.getTransform=function(){
			return this._tf;
		}

		__proto.setTransform=function(value){
			this._tf=value==='none' || !value ? Style._TF_EMPTY :value;
		}

		__proto.setTranslateX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.translateX=value;
		}

		__proto.setTranslateY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.translateY=value;
		}

		__proto.setScaleX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.scaleX=value;
		}

		__proto.setScaleY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.scaleY=value;
		}

		__proto.setRotate=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.rotate=value;
		}

		__proto.setSkewX=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.skewX=value;
		}

		__proto.setSkewY=function(value){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.skewY=value;
		}

		/**销毁此对象。*/
		__proto.destroy=function(){
			this.scrollRect=null;
		}

		/**@private */
		__proto.render=function(sprite,context,x,y){}
		/**@private */
		__proto.getCSSStyle=function(){
			return CSSStyle.EMPTY;
		}

		/**@private */
		__proto._enableLayout=function(){
			return false;
		}

		/**X 轴缩放值。*/
		__getset(0,__proto,'scaleX',function(){
			return this._tf.scaleX;
			},function(value){
			this.setScaleX(value);
		});

		/**元素应用的 2D 或 3D 转换的值。该属性允许我们对元素进行旋转、缩放、移动或倾斜。*/
		__getset(0,__proto,'transform',function(){
			return this.getTransform();
			},function(value){
			this.setTransform(value);
		});

		/**定义转换，只是用 X 轴的值。*/
		__getset(0,__proto,'translateX',function(){
			return this._tf.translateX;
			},function(value){
			this.setTranslateX(value);
		});

		/**定义转换，只是用 Y 轴的值。*/
		__getset(0,__proto,'translateY',function(){
			return this._tf.translateY;
			},function(value){
			this.setTranslateY(value);
		});

		/**Y 轴缩放值。*/
		__getset(0,__proto,'scaleY',function(){
			return this._tf.scaleY;
			},function(value){
			this.setScaleY(value);
		});

		/**表示元素是否显示为块级元素。*/
		__getset(0,__proto,'block',function(){
			return (this._type & 0x1)!=0;
		});

		/**定义沿着 Y 轴的 2D 倾斜转换。*/
		__getset(0,__proto,'skewY',function(){
			return this._tf.skewY;
			},function(value){
			this.setSkewY(value);
		});

		/**定义旋转角度。*/
		__getset(0,__proto,'rotate',function(){
			return this._tf.rotate;
			},function(value){
			this.setRotate(value);
		});

		/**定义沿着 X 轴的 2D 倾斜转换。*/
		__getset(0,__proto,'skewX',function(){
			return this._tf.skewX;
			},function(value){
			this.setSkewX(value);
		});

		/**表示元素的左内边距。*/
		__getset(0,__proto,'paddingLeft',function(){
			return 0;
		});

		/**表示元素的上内边距。*/
		__getset(0,__proto,'paddingTop',function(){
			return 0;
		});

		/**是否为绝对定位。*/
		__getset(0,__proto,'absolute',function(){
			return true;
		});

		Style.__init__=function(){
			Style._TF_EMPTY=Style._createTransform();
			Style.EMPTY=new Style();
		}

		Style._createTransform=function(){
			return {translateX:0,translateY:0,scaleX:1,scaleY:1,rotate:0,skewX:0,skewY:0};
		}

		Style.EMPTY=null
		Style._TF_EMPTY=null
		return Style;
	})()


	/**
	*@private
	*<code>Font</code> 类是字体显示定义类。
	*/
	//class laya.display.css.Font
	var Font=(function(){
		function Font(src){
			this._type=0;
			this._weight=0;
			this._decoration=null;
			this._text=null;
			this.indent=0;
			this._color=Color.create(Font.defaultColor);
			this.family=Font.defaultFamily;
			this.stroke=Font._STROKE;
			this.size=Font.defaultSize;
			src && src!==Font.EMPTY && src.copyTo(this);
		}

		__class(Font,'laya.display.css.Font');
		var __proto=Font.prototype;
		/**
		*字体样式字符串。
		*/
		__proto.set=function(value){
			this._text=null;
			var strs=value.split(' ');
			for (var i=0,n=strs.length;i < n;i++){
				var str=strs[i];
				switch (str){
					case 'italic':
						this.italic=true;
						continue ;
					case 'bold':
						this.bold=true;
						continue ;
					}
				if (str.indexOf('px')> 0){
					this.size=parseInt(str);
					this.family=strs[i+1];
					i++;
					continue ;
				}
			}
		}

		/**
		*返回字体样式字符串。
		*@return 字体样式字符串。
		*/
		__proto.toString=function(){
			this._text=""
			this.italic && (this._text+="italic ");
			this.bold && (this._text+="bold ");
			return this._text+=this.size+"px "+this.family;
		}

		/**
		*将当前的属性值复制到传入的 <code>Font</code> 对象。
		*@param dec 一个 Font 对象。
		*/
		__proto.copyTo=function(dec){
			dec._type=this._type;
			dec._text=this._text;
			dec._weight=this._weight;
			dec._color=this._color;
			dec.family=this.family;
			dec.stroke=this.stroke !=Font._STROKE ? this.stroke.slice():Font._STROKE;
			dec.indent=this.indent;
			dec.size=this.size;
		}

		/**
		*表示是否为密码格式。
		*/
		__getset(0,__proto,'password',function(){
			return (this._type & 0x400)!==0;
			},function(value){
			value ? (this._type |=0x400):(this._type &=~0x400);
		});

		/**
		*表示颜色字符串。
		*/
		__getset(0,__proto,'color',function(){
			return this._color.strColor;
			},function(value){
			this._color=Color.create(value);
		});

		/**
		*表示是否为斜体。
		*/
		__getset(0,__proto,'italic',function(){
			return (this._type & 0x200)!==0;
			},function(value){
			value ? (this._type |=0x200):(this._type &=~0x200);
		});

		/**
		*表示是否为粗体。
		*/
		__getset(0,__proto,'bold',function(){
			return (this._type & 0x800)!==0;
			},function(value){
			value ? (this._type |=0x800):(this._type &=~0x800);
		});

		/**
		*文本的粗细。
		*/
		__getset(0,__proto,'weight',function(){
			return ""+this._weight;
			},function(value){
			var weight=0;
			switch (value){
				case 'normal':
					break ;
				case 'bold':
					this.bold=true;
					weight=700;
					break ;
				case 'bolder':
					weight=800;
					break ;
				case 'lighter':
					weight=100;
					break ;
				default :
					weight=parseInt(value);
				}
			this._weight=weight;
			this._text=null;
		});

		/**
		*规定添加到文本的修饰。
		*/
		__getset(0,__proto,'decoration',function(){
			return this._decoration ? this._decoration.value :"none";
			},function(value){
			var strs=value.split(' ');
			this._decoration || (this._decoration={});
			switch (strs[0]){
				case '_':
					this._decoration.type='underline'
					break ;
				case '-':
					this._decoration.type='line-through'
					break ;
				case 'overline':
					this._decoration.type='overline'
					break ;
				default :
					this._decoration.type=strs[0];
				}
			strs[1] && (this._decoration.color=Color.create(strs));
			this._decoration.value=value;
		});

		Font.__init__=function(){
			Font.EMPTY=new Font(null);
		}

		Font.EMPTY=null
		Font.defaultColor="#000000";
		Font.defaultSize=12;
		Font.defaultFamily="Arial";
		Font.defaultFont="12px Arial";
		Font._STROKE=[0,"#000000"];
		Font._ITALIC=0x200;
		Font._PASSWORD=0x400;
		Font._BOLD=0x800;
		return Font;
	})()


	/**
	*<code>Event</code> 是事件类型的集合。
	*/
	//class laya.events.Event
	var Event=(function(){
		function Event(){
			//this.type=null;
			//this.nativeEvent=null;
			//this.target=null;
			//this.currentTarget=null;
			//this._stoped=false;
			//this.touchId=0;
			//this.keyCode=0;
		}

		__class(Event,'laya.events.Event');
		var __proto=Event.prototype;
		/**
		*设置事件数据。
		*@param type 事件类型。
		*@param currentTarget 事件目标触发对象。
		*@param target 事件当前冒泡对象。
		*@return 返回当前 Event 对象。
		*/
		__proto.setTo=function(type,currentTarget,target){
			this.type=type;
			this.currentTarget=currentTarget;
			this.target=target;
			return this;
		}

		/**
		*防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
		*/
		__proto.stopPropagation=function(){
			this._stoped=true;
		}

		/**
		*包含按下或释放的键的字符代码值。字符代码值为英文键盘值。
		*/
		__getset(0,__proto,'charCode',function(){
			return this.nativeEvent.charCode;
		});

		/**
		*触摸点列表。
		*/
		__getset(0,__proto,'touches',function(){
			var arr=this.nativeEvent.touches;
			if (arr){
				for (var i=0,n=arr.length;i < n;i++){
					var e=arr[i];
					var point=Point.TEMP;
					point.setTo(e.clientX,e.clientY);
					Laya.stage._canvasTransform.invertTransformPoint(point);
					e.stageX=point.x;
					e.stageY=point.y;
				}
			}
			return arr;
		});

		/**
		*表示键在键盘上的位置。这对于区分在键盘上多次出现的键非常有用。<br>
		*例如，您可以根据此属性的值来区分左 Shift 键和右 Shift 键：左 Shift 键的值为 KeyLocation.LEFT，右 Shift 键的值为 KeyLocation.RIGHT。另一个示例是区分标准键盘 (KeyLocation.STANDARD)与数字键盘 (KeyLocation.NUM_PAD)上按下的数字键。
		*/
		__getset(0,__proto,'keyLocation',function(){
			return this.nativeEvent.keyLocation;
		});

		/**
		*表示 Ctrl 键是处于活动状态 (true)还是非活动状态 (false)。
		*/
		__getset(0,__proto,'ctrlKey',function(){
			return this.nativeEvent.ctrlKey;
		});

		/**
		*表示 Alt 键是处于活动状态 (true)还是非活动状态 (false)。
		*/
		__getset(0,__proto,'altKey',function(){
			return this.nativeEvent.altKey;
		});

		/**
		*表示 Shift 键是处于活动状态 (true)还是非活动状态 (false)。
		*/
		__getset(0,__proto,'shiftKey',function(){
			return this.nativeEvent.shiftKey;
		});

		Event.EMPTY=new Event();
		Event.MOUSE_DOWN="mousedown";
		Event.MOUSE_UP="mouseup";
		Event.CLICK="click";
		Event.RIGHT_MOUSE_DOWN="rightmousedown";
		Event.RIGHT_MOUSE_UP="rightmouseup";
		Event.RIGHT_CLICK="rightclick";
		Event.MOUSE_MOVE="mousemove";
		Event.MOUSE_OVER="mouseover";
		Event.MOUSE_OUT="mouseout";
		Event.MOUSE_WHEEL="mousewheel";
		Event.ROLL_OVER="mouseover";
		Event.ROLL_OUT="mouseout";
		Event.DOUBLE_CLICK="doubleclick";
		Event.CHANGE="change";
		Event.CHANGED="changed";
		Event.RESIZE="resize";
		Event.ADDED="added";
		Event.REMOVED="removed";
		Event.DISPLAY="display";
		Event.UNDISPLAY="undisplay";
		Event.ERROR="error";
		Event.COMPLETE="complete";
		Event.LOADED="loaded";
		Event.PROGRESS="progress";
		Event.INPUT="input";
		Event.RENDER="render";
		Event.OPEN="open";
		Event.MESSAGE="message";
		Event.CLOSE="close";
		Event.KEY_DOWN="keydown";
		Event.KEY_PRESS="keypress";
		Event.KEY_UP="keyup";
		Event.FRAME="enterframe";
		Event.DRAG_START="dragstart";
		Event.DRAG_MOVE="dragmove";
		Event.DRAG_END="dragend";
		Event.ENTER="enter";
		Event.SELECT="select";
		Event.BLUR="blur";
		Event.FOCUS="focus";
		Event.PLAYED="played";
		Event.PAUSED="paused";
		Event.STOPPED="stopped";
		Event.START="start";
		Event.END="end";
		Event.ENABLED_CHANGED="enabledchanged";
		Event.COMPONENT_ADDED="componentadded";
		Event.COMPONENT_REMOVED="componentremoved";
		Event.ACTIVE_CHANGED="activechanged";
		Event.LAYER_CHANGED="layerchanged";
		Event.HIERARCHY_LOADED="hierarchyloaded";
		Event.RECOVERING="recovering";
		Event.RECOVERED="recovered";
		Event.RELEASED="released";
		Event.LINK="link";
		Event.LABEL="label";
		Event.FULL_SCREEN_CHANGE="fullscreenchange";
		Event.DEVICE_LOST="devicelost";
		Event.MESH_CHANGED="meshchanged";
		Event.MATERIAL_CHANGED="materialchanged";
		Event.RENDERQUEUE_CHANGED="renderqueuechanged";
		Event.WORLDMATRIX_NEEDCHANGE="worldmatrixneedchanged";
		return Event;
	})()


	/**
	*<code>Keyboard</code> 类的属性是一些常数，这些常数表示控制游戏时最常用的键。
	*/
	//class laya.events.Keyboard
	var Keyboard=(function(){
		function Keyboard(){};
		__class(Keyboard,'laya.events.Keyboard');
		Keyboard.NUMBER_0=48;
		Keyboard.NUMBER_1=49;
		Keyboard.NUMBER_2=50;
		Keyboard.NUMBER_3=51;
		Keyboard.NUMBER_4=52;
		Keyboard.NUMBER_5=53;
		Keyboard.NUMBER_6=54;
		Keyboard.NUMBER_7=55;
		Keyboard.NUMBER_8=56;
		Keyboard.NUMBER_9=57;
		Keyboard.A=65;
		Keyboard.B=66;
		Keyboard.C=67;
		Keyboard.D=68;
		Keyboard.E=69;
		Keyboard.F=70;
		Keyboard.G=71;
		Keyboard.H=72;
		Keyboard.I=73;
		Keyboard.J=74;
		Keyboard.K=75;
		Keyboard.L=76;
		Keyboard.M=77;
		Keyboard.N=78;
		Keyboard.O=79;
		Keyboard.P=80;
		Keyboard.Q=81;
		Keyboard.R=82;
		Keyboard.S=83;
		Keyboard.T=84;
		Keyboard.U=85;
		Keyboard.V=86;
		Keyboard.W=87;
		Keyboard.X=88;
		Keyboard.Y=89;
		Keyboard.Z=90;
		Keyboard.F1=112;
		Keyboard.F2=113;
		Keyboard.F3=114;
		Keyboard.F4=115;
		Keyboard.F5=116;
		Keyboard.F6=117;
		Keyboard.F7=118;
		Keyboard.F8=119;
		Keyboard.F9=120;
		Keyboard.F10=121;
		Keyboard.F11=122;
		Keyboard.F12=123;
		Keyboard.F13=124;
		Keyboard.F14=125;
		Keyboard.F15=126;
		Keyboard.NUMPAD=21;
		Keyboard.NUMPAD_0=96;
		Keyboard.NUMPAD_1=97;
		Keyboard.NUMPAD_2=98;
		Keyboard.NUMPAD_3=99;
		Keyboard.NUMPAD_4=100;
		Keyboard.NUMPAD_5=101;
		Keyboard.NUMPAD_6=102;
		Keyboard.NUMPAD_7=103;
		Keyboard.NUMPAD_8=104;
		Keyboard.NUMPAD_9=105;
		Keyboard.NUMPAD_ADD=107;
		Keyboard.NUMPAD_DECIMAL=110;
		Keyboard.NUMPAD_DIVIDE=111;
		Keyboard.NUMPAD_ENTER=108;
		Keyboard.NUMPAD_MULTIPLY=106;
		Keyboard.NUMPAD_SUBTRACT=109;
		Keyboard.SEMICOLON=186;
		Keyboard.EQUAL=187;
		Keyboard.COMMA=188;
		Keyboard.MINUS=189;
		Keyboard.PERIOD=190;
		Keyboard.SLASH=191;
		Keyboard.BACKQUOTE=192;
		Keyboard.LEFTBRACKET=219;
		Keyboard.BACKSLASH=220;
		Keyboard.RIGHTBRACKET=221;
		Keyboard.QUOTE=222;
		Keyboard.ALTERNATE=18;
		Keyboard.BACKSPACE=8;
		Keyboard.CAPS_LOCK=20;
		Keyboard.COMMAND=15;
		Keyboard.CONTROL=17;
		Keyboard.DELETE=46;
		Keyboard.ENTER=13;
		Keyboard.ESCAPE=27;
		Keyboard.PAGE_UP=33;
		Keyboard.PAGE_DOWN=34;
		Keyboard.END=35;
		Keyboard.HOME=36;
		Keyboard.LEFT=37;
		Keyboard.UP=38;
		Keyboard.RIGHT=39;
		Keyboard.DOWN=40;
		Keyboard.SHIFT=16;
		Keyboard.SPACE=32;
		Keyboard.TAB=9;
		Keyboard.INSERT=45;
		return Keyboard;
	})()


	/**
	*<p><code>KeyBoardManager</code> 是键盘事件管理类。</p>
	*<p>该类从浏览器中接收键盘事件，并派发该事件。
	*派发事件时若 Stage.focus 为空则只从 Stage 上派发该事件，否则将从 Stage.focus 对象开始一直冒泡派发该事件。
	*所以在 Laya.stage 上监听键盘事件一定能够收到，如果在其他地方监听，则必须处在Stage.focus的冒泡链上才能收到该事件。</p>
	*<p>用户可以通过代码 Laya.stage.focus=someNode 的方式来设置focus对象。</p>
	*<p>用户可统一的根据事件对象中 e.keyCode 来判断按键类型，该属性兼容了不同浏览器的实现。</p>
	*/
	//class laya.events.KeyBoardManager
	var KeyBoardManager=(function(){
		function KeyBoardManager(){};
		__class(KeyBoardManager,'laya.events.KeyBoardManager');
		KeyBoardManager.__init__=function(){
			KeyBoardManager._addEvent("keydown");
			KeyBoardManager._addEvent("keypress");
			KeyBoardManager._addEvent("keyup");
		}

		KeyBoardManager._addEvent=function(type){
			Browser.document.addEventListener(type,function(e){
				laya.events.KeyBoardManager._dispatch(e,type);
			},true);
		}

		KeyBoardManager._dispatch=function(e,type){
			if (!KeyBoardManager.enabled)return;
			KeyBoardManager._event._stoped=false;
			KeyBoardManager._event.nativeEvent=e;
			KeyBoardManager._event.keyCode=e.keyCode || e.which || e.charCode;
			if (type==="keydown")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=true;
			else if (type==="keyup")KeyBoardManager._pressKeys[KeyBoardManager._event.keyCode]=null;
			var target=(Laya.stage.focus && (Laya.stage.focus.event !=null))? Laya.stage.focus :Laya.stage;
			var ct=target;
			while (ct){
				ct.event(type,KeyBoardManager._event.setTo(type,ct,target));
				ct=ct.parent;
			}
		}

		KeyBoardManager.hasKeyDown=function(key){
			return KeyBoardManager._pressKeys[key];
		}

		KeyBoardManager._pressKeys={};
		KeyBoardManager.enabled=true;
		__static(KeyBoardManager,
		['_event',function(){return this._event=new Event();}
		]);
		return KeyBoardManager;
	})()


	/**
	*<code>MouseManager</code> 是鼠标、触摸交互管理器。
	*/
	//class laya.events.MouseManager
	var MouseManager=(function(){
		function MouseManager(){
			this.mouseX=0;
			this.mouseY=0;
			this.disableMouseEvent=false;
			this.mouseDownTime=0;
			this._stage=null;
			this._target=null;
			this._lastOvers=[];
			this._currOvers=[];
			this._lastClickTimer=0;
			this._lastMoveTimer=0;
			this._isDoubleClick=false;
			this._isLeftMouse=false;
			this._eventList=[];
			this._event=new Event();
			this._matrix=new Matrix();
			this._point=new Point();
			this._rect=new Rectangle();
		}

		__class(MouseManager,'laya.events.MouseManager');
		var __proto=MouseManager.prototype;
		/**
		*@private
		*初始化。
		*/
		__proto.__init__=function(stage,canvas){
			this._stage=stage;
			var _this=this;
			var list=this._eventList;
			canvas.oncontextmenu=function (e){
				if (MouseManager.enabled)return false;
			}
			canvas.addEventListener('mousedown',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
					_this.mouseDownTime=Browser.now();
				}
			});
			canvas.addEventListener('mouseup',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
					_this.mouseDownTime=-Browser.now();
				}
			},true);
			canvas.addEventListener('mousemove',function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					var now=Browser.now();
					if (now-_this._lastMoveTimer < 10)return;
					_this._lastMoveTimer=now;
					list.push(e);
				}
			},true);
			canvas.addEventListener("mouseout",function(e){
				if (MouseManager.enabled)list.push(e);
			})
			canvas.addEventListener("mouseover",function(e){
				if (MouseManager.enabled)list.push(e);
			})
			canvas.addEventListener("touchstart",function(e){
				if (MouseManager.enabled){
					if(!Input.IOS_IFRAME)e.preventDefault();
					list.push(e);
					_this.mouseDownTime=Browser.now();
				}
			});
			canvas.addEventListener("touchend",function(e){
				if (MouseManager.enabled){
					if(!Input.IOS_IFRAME)e.preventDefault();
					list.push(e);
					_this.mouseDownTime=-Browser.now();
				}
			},true);
			canvas.addEventListener("touchmove",function(e){
				if (MouseManager.enabled){
					e.preventDefault();
					list.push(e);
				}
			},true);
			canvas.addEventListener('mousewheel',function(e){
				if (MouseManager.enabled)list.push(e);
			});
			canvas.addEventListener('DOMMouseScroll',function(e){
				if (MouseManager.enabled)list.push(e);
			});
		}

		__proto.initEvent=function(e,nativeEvent){
			var _this=this;
			_this._event._stoped=false;
			_this._event.nativeEvent=nativeEvent || e;
			_this._target=null;
			this._point.setTo(e.clientX,e.clientY);
			this._stage._canvasTransform.invertTransformPoint(this._point);
			_this.mouseX=this._point.x;
			_this.mouseY=this._point.y;
			_this._event.touchId=e.identifier;
		}

		__proto.checkMouseWheel=function(e){
			this._event.delta=e.wheelDelta ? e.wheelDelta *0.025 :-e.detail;
			for (var i=0,n=this._lastOvers.length;i < n;i++){
				var ele=this._lastOvers[i];
				ele.event("mousewheel",this._event.setTo("mousewheel",ele,this._target));
			}
		}

		__proto.checkMouseOut=function(){
			if (this.disableMouseEvent)return;
			for (var i=0,n=this._lastOvers.length;i < n;i++){
				var ele=this._lastOvers[i];
				if (!ele.destroyed && this._currOvers.indexOf(ele)< 0){
					ele._set$P("$_MOUSEOVER",false);
					ele.event("mouseout",this._event.setTo("mouseout",ele,this._target));
				}
			};
			var temp=this._lastOvers;
			this._lastOvers=this._currOvers;
			this._currOvers=temp;
			this._currOvers.length=0;
		}

		__proto.onMouseMove=function(ele){
			this.sendMouseMove(ele);
			this._event._stoped=false;
			this.sendMouseOver(this._target);
		}

		__proto.sendMouseMove=function(ele){
			ele.event("mousemove",this._event.setTo("mousemove",ele,this._target));
			!this._event._stoped && ele.parent && this.sendMouseMove(ele.parent);
		}

		__proto.sendMouseOver=function(ele){
			if (ele.parent){
				if (!ele._get$P("$_MOUSEOVER")){
					ele._set$P("$_MOUSEOVER",true);
					ele.event("mouseover",this._event.setTo("mouseover",ele,this._target));
				}
				this._currOvers.push(ele);
			}
			!this._event._stoped && ele.parent && this.sendMouseOver(ele.parent);
		}

		__proto.onMouseDown=function(ele){
			if (this._isLeftMouse){
				ele._set$P("$_MOUSEDOWN",true);
				ele.event("mousedown",this._event.setTo("mousedown",ele,this._target));
				}else {
				ele._set$P("$_RIGHTMOUSEDOWN",true);
				ele.event("rightmousedown",this._event.setTo("rightmousedown",ele,this._target));
			}
			!this._event._stoped && ele.parent && this.onMouseDown(ele.parent);
		}

		__proto.onMouseUp=function(ele){
			var type=this._isLeftMouse ? "mouseup" :"rightmouseup";
			this.sendMouseUp(ele,type);
			this._event._stoped=false;
			this.sendClick(this._target,type);
		}

		__proto.sendMouseUp=function(ele,type){
			ele.event(type,this._event.setTo(type,ele,this._target));
			!this._event._stoped && ele.parent && this.sendMouseUp(ele.parent,type);
		}

		__proto.sendClick=function(ele,type){
			if (ele.destroyed)return;
			if (type==="mouseup" && ele._get$P("$_MOUSEDOWN")){
				ele._set$P("$_MOUSEDOWN",false);
				ele.event("click",this._event.setTo("click",ele,this._target));
				this._isDoubleClick && ele.event("doubleclick",this._event.setTo("doubleclick",ele,this._target));
				}else if (type==="rightmouseup" && ele._get$P("$_RIGHTMOUSEDOWN")){
				ele._set$P("$_RIGHTMOUSEDOWN",false);
				ele.event("rightclick",this._event.setTo("rightclick",ele,this._target));
			}
			!this._event._stoped && ele.parent && this.sendClick(ele.parent,type);
		}

		__proto.check=function(sp,mouseX,mouseY,callBack){
			var transform=sp.transform || this._matrix;
			var pivotX=sp.pivotX;
			var pivotY=sp.pivotY;
			if (pivotX===0 && pivotY===0){
				transform.setTranslate(sp.x,sp.y);
				}else {
				if (transform===this._matrix){
					transform.setTranslate(sp.x-pivotX,sp.y-pivotY);
					}else {
					var cos=transform.cos;
					var sin=transform.sin;
					transform.setTranslate(sp.x-(pivotX *cos-pivotY *sin)*sp.scaleX,sp.y-(pivotX *sin+pivotY *cos)*sp.scaleY);
				}
			}
			transform.invertTransformPoint(this._point.setTo(mouseX,mouseY));
			transform.setTranslate(0,0);
			mouseX=this._point.x;
			mouseY=this._point.y;
			var scrollRect=sp.scrollRect;
			if (scrollRect){
				this._rect.setTo(0,0,scrollRect.width,scrollRect.height);
				var isHit=this._rect.contains(mouseX,mouseY);
				if (!isHit)return false;
			}
			if (!this.disableMouseEvent){
				var flag=false;
				if (sp.hitTestPrior && !sp.mouseThrough && !this.hitTest(sp,mouseX,mouseY)){
					return false;
				}
				for (var i=sp._childs.length-1;i >-1;i--){
					var child=sp._childs[i];
					if (!child.destroyed && child.mouseEnabled && child.visible){
						flag=this.check(child,mouseX+(scrollRect ? scrollRect.x :0),mouseY+(scrollRect ? scrollRect.y :0),callBack);
						if (flag)return true;
					}
				}
			}
			isHit=this.hitTest(sp,mouseX,mouseY);
			if (isHit){
				this._target=sp;
				callBack.call(this,sp);
				}else if (callBack===this.onMouseUp && sp===this._stage){
				this._target=this._stage;
				callBack.call(this,this._target);
			}
			return isHit;
		}

		__proto.hitTest=function(sp,mouseX,mouseY){
			var isHit=false;
			if ((sp.hitArea instanceof laya.utils.HitArea )){
				return sp.hitArea.isHit(mouseX,mouseY);
			}
			if (sp.width > 0 && sp.height > 0 || sp.mouseThrough || sp.hitArea){
				var hitRect=this._rect;
				if (!sp.mouseThrough){
					if (sp.hitArea)hitRect=sp.hitArea;
					else hitRect.setTo(0,0,sp.width,sp.height);
					isHit=hitRect.contains(mouseX,mouseY);
					}else {
					isHit=sp.getGraphicBounds().contains(mouseX,mouseY);
				}
			}
			return isHit;
		}

		/**
		*执行事件处理。
		*/
		__proto.runEvent=function(){
			var len=this._eventList.length;
			if (!len)return;
			var _this=this;
			var i=0;
			while (i < len){
				var evt=this._eventList[i];
				switch (evt.type){
					case 'mousedown':
						if (!MouseManager._isTouchRespond){
							_this._isLeftMouse=evt.button===0;
							_this.initEvent(evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}
						else
						MouseManager._isTouchRespond=false;
						break ;
					case 'mouseup':
						_this._isLeftMouse=evt.button===0;
						var now=Browser.now();
						_this._isDoubleClick=(now-_this._lastClickTimer)< 300;
						_this._lastClickTimer=now;
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						break ;
					case 'mousemove':
						_this.initEvent(evt);
						_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						_this.checkMouseOut();
						break ;
					case "touchstart":
						MouseManager._isTouchRespond=true;
						_this._isLeftMouse=true;
						var touches=evt.changedTouches;
						for (var j=0,n=touches.length;j < n;j++){
							_this.initEvent(touches[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseDown);
						}
						break ;
					case "touchend":
						MouseManager._isTouchRespond=true;
						_this._isLeftMouse=true;
						now=Browser.now();
						_this._isDoubleClick=(now-_this._lastClickTimer)< 300;
						_this._lastClickTimer=now;
						var touchends=evt.changedTouches;
						for (j=0,n=touchends.length;j < n;j++){
							_this.initEvent(touchends[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseUp);
						}
						break ;
					case "touchmove":;
						var touchemoves=evt.changedTouches;
						for (j=0,n=touchemoves.length;j < n;j++){
							_this.initEvent(touchemoves[j],evt);
							_this.check(_this._stage,_this.mouseX,_this.mouseY,_this.onMouseMove);
						}
						_this.checkMouseOut();
						break ;
					case "wheel":
					case "mousewheel":
					case "DOMMouseScroll":
						_this.checkMouseWheel(evt);
						break ;
					case "mouseout":
						_this._stage.event("mouseout",_this._event.setTo("mouseout",_this._stage,_this._stage));
						break ;
					case "mouseover":
						_this._stage.event("mouseover",_this._event.setTo("mouseover",_this._stage,_this._stage));
						break ;
					}
				i++;
			}
			this._eventList.length=0;
		}

		MouseManager.enabled=true;
		MouseManager._isTouchRespond=false;
		__static(MouseManager,
		['instance',function(){return this.instance=new MouseManager();}
		]);
		return MouseManager;
	})()


	/**
	*<code>Filter</code> 是滤镜基类。
	*/
	//class laya.filters.Filter
	var Filter=(function(){
		function Filter(){
			this._action=null;
		}

		__class(Filter,'laya.filters.Filter');
		var __proto=Filter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		/**@private */
		__proto.callNative=function(sp){}
		/**@private 滤镜类型。*/
		__getset(0,__proto,'type',function(){return-1});
		/**@private 滤镜动作。*/
		__getset(0,__proto,'action',function(){return this._action });
		Filter.BLUR=0x10;
		Filter.COLOR=0x20;
		Filter.GLOW=0x08;
		Filter._filterStart=null
		Filter._filterEnd=null
		Filter._EndTarget=null
		Filter._recycleScope=null
		Filter._filter=null
		Filter._useSrc=null
		Filter._endSrc=null
		Filter._useOut=null
		Filter._endOut=null
		return Filter;
	})()


	/**
	*<code>ColorFilterAction</code> 是一个颜色滤镜应用类。
	*/
	//class laya.filters.ColorFilterAction
	var ColorFilterAction=(function(){
		function ColorFilterAction(){
			this.data=null;
		}

		__class(ColorFilterAction,'laya.filters.ColorFilterAction');
		var __proto=ColorFilterAction.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterAction":true})
		/**
		*给指定的对象应用颜色滤镜。
		*@param srcCanvas 需要应用画布对象。
		*@return 应用了滤镜后的画布对象。
		*/
		__proto.apply=function(srcCanvas){
			var ctx=srcCanvas.ctx.ctx;
			var canvas=srcCanvas.ctx.ctx.canvas;
			if (canvas.width==0 || canvas.height==0)return canvas;
			var imgdata=ctx.getImageData(0,0,canvas.width,canvas.height);
			var data=imgdata.data;
			var nData;
			for (var i=0,n=data.length;i < n;i+=4){
				nData=this.getColor(data[i],data[i+1],data[i+2],data[i+3]);
				if (data[i+3]==0)continue ;
				data[i]=nData[0];
				data[i+1]=nData[1];
				data[i+2]=nData[2];
				data[i+3]=nData[3];
			}
			ctx.putImageData(imgdata,0,0);
			return srcCanvas;
		}

		__proto.getColor=function(red,green,blue,alpha){
			var rst=[];
			if (this.data._mat && this.data._alpha){
				var mat=this.data._mat;
				var tempAlpha=this.data._alpha;
				rst[0]=mat[0] *red+mat[1] *green+mat[2] *blue+mat[3] *alpha+tempAlpha[0];
				rst[1]=mat[4] *red+mat[5] *green+mat[6] *blue+mat[7] *alpha+tempAlpha[1];
				rst[2]=mat[8] *red+mat[9] *green+mat[10] *blue+mat[11] *alpha+tempAlpha[2];
				rst[3]=mat[12] *red+mat[13] *green+mat[14] *blue+mat[15] *alpha+tempAlpha[3];
			}
			return rst;
		}

		return ColorFilterAction;
	})()


	//class laya.filters.webgl.FilterActionGL
	var FilterActionGL=(function(){
		function FilterActionGL(){}
		__class(FilterActionGL,'laya.filters.webgl.FilterActionGL');
		var __proto=FilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValue=function(shader){}
		__proto.setValueMix=function(shader){}
		__proto.apply3d=function(scope,sprite,context,x,y){return null;}
		__proto.apply=function(srcCanvas){return null;}
		__getset(0,__proto,'typeMix',function(){
			return 0;
		});

		return FilterActionGL;
	})()


	/**
	*@private
	*/
	//class laya.maths.Arith
	var Arith=(function(){
		function Arith(){};
		__class(Arith,'laya.maths.Arith');
		Arith.formatR=function(r){
			if (r > Math.PI)r-=Math.PI *2;
			if (r <-Math.PI)r+=Math.PI *2;
			return r;
		}

		Arith.isPOT=function(w,h){
			return (w > 0 && (w & (w-1))===0 && h > 0 && (h & (h-1))===0);
		}

		Arith.setMatToArray=function(mat,array){
			mat.a,mat.b,0,0,mat.c,mat.d,0,0,0,0,1,0,mat.tx+20,mat.ty+20,0,1
			array[0]=mat.a;
			array[1]=mat.b;
			array[4]=mat.c;
			array[5]=mat.d;
			array[12]=mat.tx;
			array[13]=mat.ty;
		}

		return Arith;
	})()


	/**
	*@private
	*计算贝塞尔曲线的工具类。
	*/
	//class laya.maths.Bezier
	var Bezier=(function(){
		function Bezier(){
			this._controlPoints=[new Point(),new Point(),new Point()];
			this._calFun=this.getPoint2;
		}

		__class(Bezier,'laya.maths.Bezier');
		var __proto=Bezier.prototype;
		/**@private */
		__proto._switchPoint=function(x,y){
			var tPoint=this._controlPoints.shift();
			tPoint.setTo(x,y);
			this._controlPoints.push(tPoint);
		}

		/**
		*计算二次贝塞尔点。
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint2=function(t,rst){
			var p1=this._controlPoints[0];
			var p2=this._controlPoints[1];
			var p3=this._controlPoints[2];
			var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
			var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
			rst.push(lineX,lineY);
		}

		/**
		*计算三次贝塞尔点
		*@param t
		*@param rst
		*
		*/
		__proto.getPoint3=function(t,rst){
			var p1=this._controlPoints[0];
			var p2=this._controlPoints[1];
			var p3=this._controlPoints[2];
			var p4=this._controlPoints[3];
			var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
			var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
			rst.push(lineX,lineY);
		}

		/**
		*计算贝塞尔点序列
		*@param count
		*@param rst
		*
		*/
		__proto.insertPoints=function(count,rst){
			var i=NaN;
			count=count > 0 ? count :5;
			var dLen=NaN;
			dLen=1 / count;
			for (i=0;i <=1;i+=dLen){
				this._calFun(i,rst);
			}
		}

		/**
		*获取贝塞尔曲线上的点。
		*@param pList 控制点[x0,y0,x1,y1...]
		*@param inSertCount 每次曲线的插值数量
		*@return
		*
		*/
		__proto.getBezierPoints=function(pList,inSertCount,count){
			(inSertCount===void 0)&& (inSertCount=5);
			(count===void 0)&& (count=2);
			var i=0,len=0;
			len=pList.length;
			if (len < (count+1)*2)return [];
			var rst;
			rst=[];
			switch (count){
				case 2:
					this._calFun=this.getPoint2;
					break ;
				case 3:
					this._calFun=this.getPoint3;
					break ;
				default :
					return [];
				}
			for (i=0;i < count *2;i+=2){
				this._switchPoint(pList[i],pList[i+1]);
			}
			for (i=count *2;i < len;i+=2){
				this._switchPoint(pList[i],pList[i+1]);
				if ((i / 2)% count==0)
					this.insertPoints(inSertCount,rst);
			}
			return rst;
		}

		__static(Bezier,
		['I',function(){return this.I=new Bezier();}
		]);
		return Bezier;
	})()


	/**
	*@private
	*凸包算法。
	*/
	//class laya.maths.GrahamScan
	var GrahamScan=(function(){
		function GrahamScan(){};
		__class(GrahamScan,'laya.maths.GrahamScan');
		GrahamScan.multiply=function(p1,p2,p0){
			return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
		}

		GrahamScan.dis=function(p1,p2){
			return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
		}

		GrahamScan._getPoints=function(count,tempUse,rst){
			(tempUse===void 0)&& (tempUse=false);
			if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
			while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
			if (!rst)rst=[];
			rst.length=0;
			if (tempUse){
				GrahamScan.getFrom(rst,GrahamScan._mPointList,count);
				}else {
				GrahamScan.getFromR(rst,GrahamScan._mPointList,count);
			}
			return rst;
		}

		GrahamScan.getFrom=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src[i]);
			}
			return rst;
		}

		GrahamScan.getFromR=function(rst,src,count){
			var i=0;
			for (i=0;i < count;i++){
				rst.push(src.pop());
			}
			return rst;
		}

		GrahamScan.pListToPointList=function(pList,tempUse){
			(tempUse===void 0)&& (tempUse=false);
			var i=0,len=pList.length / 2,rst=GrahamScan._getPoints(len,tempUse,GrahamScan._tempPointList);
			for (i=0;i < len;i++){
				rst[i].setTo(pList[i+i],pList[i+i+1]);
			}
			return rst;
		}

		GrahamScan.pointListToPlist=function(pointList){
			var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
			rst.length=0;
			for (i=0;i < len;i++){
				tPoint=pointList[i];
				rst.push(tPoint.x,tPoint.y);
			}
			return rst;
		}

		GrahamScan.scanPList=function(pList){
			return Utils.copyArray(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
		}

		GrahamScan.scan=function(PointSet){
			var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
			var _tmpDic={};
			var key;
			ch=GrahamScan._temArr;
			ch.length=0;
			n=PointSet.length;
			for (i=n-1;i >=0;i--){
				tmp=PointSet[i];
				key=tmp.x+"_"+tmp.y;
				if (!_tmpDic.hasOwnProperty(key)){
					_tmpDic[key]=true;
					ch.push(tmp);
				}
			}
			n=ch.length;
			Utils.copyArray(PointSet,ch);
			for (i=1;i < n;i++)
			if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
				k=i;
			tmp=PointSet[0];
			PointSet[0]=PointSet[k];
			PointSet[k]=tmp;
			for (i=1;i < n-1;i++){
				k=i;
				for (j=i+1;j < n;j++)
				if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
					k=j;
				tmp=PointSet[i];
				PointSet[i]=PointSet[k];
				PointSet[k]=tmp;
			}
			ch=GrahamScan._temArr;
			ch.length=0;
			if (PointSet.length < 3){
				return Utils.copyArray(ch,PointSet);
			}
			ch.push(PointSet[0],PointSet[1],PointSet[2]);
			for (i=3;i < n;i++){
				while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
				PointSet[i] && ch.push(PointSet[i]);
			}
			return ch;
		}

		GrahamScan._mPointList=null
		GrahamScan._tempPointList=[];
		GrahamScan._temPList=[];
		GrahamScan._temArr=[];
		return GrahamScan;
	})()


	/**
	*<code>Matrix</code> 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
	*/
	//class laya.maths.Matrix
	var Matrix=(function(){
		function Matrix(a,b,c,d,tx,ty){
			this.cos=1;
			this.sin=0;
			//this.a=NaN;
			//this.b=NaN;
			//this.c=NaN;
			//this.d=NaN;
			//this.tx=NaN;
			//this.ty=NaN;
			this.inPool=false;
			this.bTransform=false;
			(a===void 0)&& (a=1);
			(b===void 0)&& (b=0);
			(c===void 0)&& (c=0);
			(d===void 0)&& (d=1);
			(tx===void 0)&& (tx=0);
			(ty===void 0)&& (ty=0);
			this.a=a;
			this.b=b;
			this.c=c;
			this.d=d;
			this.tx=tx;
			this.ty=ty;
			this._checkTransform();
		}

		__class(Matrix,'laya.maths.Matrix');
		var __proto=Matrix.prototype;
		/**
		*为每个矩阵属性设置一个值。
		*@return 返回当前矩形。
		*/
		__proto.identity=function(){
			this.a=this.d=1;
			this.b=this.tx=this.ty=this.c=0;
			this.bTransform=false;
			return this;
		}

		/**@private*/
		__proto._checkTransform=function(){
			return this.bTransform=(this.a!==1 || this.b!==0 || this.c!==0 || this.d!==1);
		}

		/**
		*设置沿 x 、y 轴平移每个点的距离。
		*@param x 沿 x 轴平移每个点的距离。
		*@param y 沿 y 轴平移每个点的距离。
		*@return 返回对象本身
		*/
		__proto.setTranslate=function(x,y){
			this.tx=x;
			this.ty=y;
			return this;
		}

		/**
		*沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
		*@param x 沿 x 轴向右移动的量（以像素为单位）。
		*@param y 沿 y 轴向下移动的量（以像素为单位）。
		*@return 返回此矩形。
		*/
		__proto.translate=function(x,y){
			this.tx+=x;
			this.ty+=y;
			return this;
		}

		/**
		*对矩阵应用缩放转换。
		*@param x 用于沿 x 轴缩放对象的乘数。
		*@param y 用于沿 y 轴缩放对象的乘数。
		*/
		__proto.scale=function(x,y){
			this.a *=x;
			this.d *=y;
			this.c *=x;
			this.b *=y;
			this.tx *=x;
			this.ty *=y;
			this.bTransform=true;
		}

		/**
		*对 Matrix 对象应用旋转转换。
		*@param angle 以弧度为单位的旋转角度。
		*/
		__proto.rotate=function(angle){
			var cos=this.cos=Math.cos(angle);
			var sin=this.sin=Math.sin(angle);
			var a1=this.a;
			var c1=this.c;
			var tx1=this.tx;
			this.a=a1 *cos-this.b *sin;
			this.b=a1 *sin+this.b *cos;
			this.c=c1 *cos-this.d *sin;
			this.d=c1 *sin+this.d *cos;
			this.tx=tx1 *cos-this.ty *sin;
			this.ty=tx1 *sin+this.ty *cos;
			this.bTransform=true;
		}

		/**
		*对 Matrix 对象应用倾斜转换。
		*@param x 沿着 X 轴的 2D 倾斜弧度。
		*@param y 沿着 Y 轴的 2D 倾斜弧度。
		*@return 当前 Matrix 对象。
		*/
		__proto.skew=function(x,y){
			var tanX=Math.tan(x);
			var tanY=Math.tan(y);
			var a1=this.a;
			var b1=this.b;
			this.a+=tanY *this.c;
			this.b+=tanY *this.d;
			this.c+=tanX *a1;
			this.d+=tanX *b1;
			return this;
		}

		/**
		*对指定的点应用当前矩阵的逆转化并返回此点。
		*@param out 待转化的点 Point 对象。
		*@return 返回out
		*/
		__proto.invertTransformPoint=function(out){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			var a2=d1 / n;
			var b2=-b1 / n;
			var c2=-c1 / n;
			var d2=a1 / n;
			var tx2=(c1 *this.ty-d1 *tx1)/ n;
			var ty2=-(a1 *this.ty-b1 *tx1)/ n;
			return out.setTo(a2 *out.x+c2 *out.y+tx2,b2 *out.x+d2 *out.y+ty2);
		}

		/**
		*将 Matrix 对象表示的几何转换应用于指定点。
		*@param out 用来设定输出结果的点。
		*@return 返回out
		*/
		__proto.transformPoint=function(out){
			return out.setTo(this.a *out.x+this.c *out.y+this.tx,this.b *out.x+this.d *out.y+this.ty);
		}

		/**
		*@private
		*将 Matrix 对象表示的几何转换应用于指定点。
		*@param data 点集合。
		*@param out 存储应用转化的点的列表。
		*@return 返回out数组
		*/
		__proto.transformPointArray=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y+this.tx;
				out[i+1]=this.b *x+this.d *y+this.ty;
			}
			return out;
		}

		/**
		*@private
		*将 Matrix 对象表示的几何缩放转换应用于指定点。
		*@param data 点集合。
		*@param out 存储应用转化的点的列表。
		*@return 返回out数组
		*/
		__proto.transformPointArrayScale=function(data,out){
			var len=data.length;
			for (var i=0;i < len;i+=2){
				var x=data[i],y=data[i+1];
				out[i]=this.a *x+this.c *y;
				out[i+1]=this.b *x+this.d *y;
			}
			return out;
		}

		/**
		*获取 X 轴缩放值。
		*@return X 轴缩放值。
		*/
		__proto.getScaleX=function(){
			return this.b===0 ? this.a :Math.sqrt(this.a *this.a+this.b *this.b);
		}

		/**
		*获取 Y 轴缩放值。
		*@return Y 轴缩放值。
		*/
		__proto.getScaleY=function(){
			return this.c===0 ? this.d :Math.sqrt(this.c *this.c+this.d *this.d);
		}

		/**
		*执行原始矩阵的逆转换。
		*@return 当前矩阵对象。
		*/
		__proto.invert=function(){
			var a1=this.a;
			var b1=this.b;
			var c1=this.c;
			var d1=this.d;
			var tx1=this.tx;
			var n=a1 *d1-b1 *c1;
			this.a=d1 / n;
			this.b=-b1 / n;
			this.c=-c1 / n;
			this.d=a1 / n;
			this.tx=(c1 *this.ty-d1 *tx1)/ n;
			this.ty=-(a1 *this.ty-b1 *tx1)/ n;
			return this;
		}

		/**
		*将 Matrix 的成员设置为指定值。
		*@param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
		*@param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
		*@param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
		*@param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
		*@param tx 沿 x 轴平移每个点的距离。
		*@param ty 沿 y 轴平移每个点的距离。
		*@return 当前矩阵对象。
		*/
		__proto.setTo=function(a,b,c,d,tx,ty){
			this.a=a,this.b=b,this.c=c,this.d=d,this.tx=tx,this.ty=ty;
			return this;
		}

		/**
		*将指定矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
		*@param matrix 要连接到源矩阵的矩阵。
		*@return 当前矩阵。
		*/
		__proto.concat=function(matrix){
			var a=this.a;
			var c=this.c;
			var tx=this.tx;
			this.a=a *matrix.a+this.b *matrix.c;
			this.b=a *matrix.b+this.b *matrix.d;
			this.c=c *matrix.a+this.d *matrix.c;
			this.d=c *matrix.b+this.d *matrix.d;
			this.tx=tx *matrix.a+this.ty *matrix.c+matrix.tx;
			this.ty=tx *matrix.b+this.ty *matrix.d+matrix.ty;
			return this;
		}

		/**
		*返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
		*@return 一个 Matrix 对象。
		*/
		__proto.clone=function(){
			var no=Matrix._cache;
			var dec=!no._length ? (new Matrix()):no[--no._length];
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		/**
		*将当前 Matrix 对象中的所有矩阵数据复制到指定的 Matrix 对象中。
		*@param dec 要复制当前矩阵数据的 Matrix 对象。
		*@return 已复制当前矩阵数据的 Matrix 对象。
		*/
		__proto.copyTo=function(dec){
			dec.a=this.a;
			dec.b=this.b;
			dec.c=this.c;
			dec.d=this.d;
			dec.tx=this.tx;
			dec.ty=this.ty;
			dec.bTransform=this.bTransform;
			return dec;
		}

		/**
		*返回列出该 Matrix 对象属性的文本值。
		*@return 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
		*/
		__proto.toString=function(){
			return this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty;
		}

		/**
		*销毁此对象。
		*/
		__proto.destroy=function(){
			if (this.inPool)return;
			var cache=Matrix._cache;
			this.inPool=true;
			cache._length || (cache._length=0);
			cache[cache._length++]=this;
			this.a=this.d=1;
			this.b=this.c=this.tx=this.ty=0;
			this.bTransform=false;
		}

		Matrix.mul=function(m1,m2,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			var ba=m2.a,bb=m2.b,bc=m2.c,bd=m2.d,btx=m2.tx,bty=m2.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPre=function(m1,ba,bb,bc,bd,btx,bty,out){
			var aa=m1.a,ab=m1.b,ac=m1.c,ad=m1.d,atx=m1.tx,aty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.mulPos=function(m1,aa,ab,ac,ad,atx,aty,out){
			var ba=m1.a,bb=m1.b,bc=m1.c,bd=m1.d,btx=m1.tx,bty=m1.ty;
			if (bb!==0 || bc!==0){
				out.a=aa *ba+ab *bc;
				out.b=aa *bb+ab *bd;
				out.c=ac *ba+ad *bc;
				out.d=ac *bb+ad *bd;
				out.tx=ba *atx+bc *aty+btx;
				out.ty=bb *atx+bd *aty+bty;
				}else {
				out.a=aa *ba;
				out.b=ab *bd;
				out.c=ac *ba;
				out.d=ad *bd;
				out.tx=ba *atx+btx;
				out.ty=bd *aty+bty;
			}
			return out;
		}

		Matrix.preMul=function(parent,self,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			var na=self.a,nb=self.b,nc=self.c,nd=self.d,ntx=self.tx,nty=self.ty;
			out.a=na *pa;
			out.b=out.c=0;
			out.d=nd *pd;
			out.tx=ntx *pa+parent.tx;
			out.ty=nty *pd+parent.ty;
			if (nb!==0 || nc!==0 || pb!==0 || pc!==0){
				out.a+=nb *pc;
				out.d+=nc *pb;
				out.b+=na *pb+nb *pd;
				out.c+=nc *pa+nd *pc;
				out.tx+=nty *pc;
				out.ty+=ntx *pb;
			}
			return out;
		}

		Matrix.preMulXY=function(parent,x,y,out){
			var pa=parent.a,pb=parent.b,pc=parent.c,pd=parent.d;
			out.a=pa;
			out.b=pb;
			out.c=pc;
			out.d=pd;
			out.tx=x *pa+parent.tx+y *pc;
			out.ty=y *pd+parent.ty+x *pb;
			return out;
		}

		Matrix.create=function(){
			var cache=Matrix._cache;
			var mat=!cache._length ? (new Matrix()):cache[--cache._length];
			mat.inPool=false;
			return mat;
		}

		Matrix.EMPTY=new Matrix();
		Matrix.TEMP=new Matrix();
		Matrix._cache=[];
		return Matrix;
	})()


	/**
	*<code>Point</code> 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
	*/
	//class laya.maths.Point
	var Point=(function(){
		function Point(x,y){
			//this.x=NaN;
			//this.y=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			this.x=x;
			this.y=y;
		}

		__class(Point,'laya.maths.Point');
		var __proto=Point.prototype;
		/**
		*将 <code>Point</code> 的成员设置为指定值。
		*@param x 水平坐标。
		*@param y 垂直坐标。
		*@return 当前 Point 对象。
		*/
		__proto.setTo=function(x,y){
			this.x=x;
			this.y=y;
			return this;
		}

		/**
		*计算当前点和目标x，y点的距离
		*@param x 水平坐标。
		*@param y 垂直坐标。
		*@return 返回之间的距离
		*/
		__proto.distance=function(x,y){
			return Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y));
		}

		/**返回包含 x 和 y 坐标的值的字符串。*/
		__proto.toString=function(){
			return this.x+","+this.y;
		}

		/**
		*标准化向量
		*/
		__proto.normalize=function(){
			var d=Math.sqrt(this.x *this.x+this.y *this.y);
			if (d > 0){
				var id=1.0 / d;
				this.x *=id;
				this.y *=id;
			}
		}

		Point.TEMP=new Point();
		Point.EMPTY=new Point();
		return Point;
	})()


	/**
	*<code>Rectangle</code> 对象是按其位置（由它左上角的点 (x,y)确定）以及宽度和高度定义的区域。
	*/
	//class laya.maths.Rectangle
	var Rectangle=(function(){
		function Rectangle(x,y,width,height){
			//this.x=NaN;
			//this.y=NaN;
			//this.width=NaN;
			//this.height=NaN;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
		}

		__class(Rectangle,'laya.maths.Rectangle');
		var __proto=Rectangle.prototype;
		/**
		*将 Rectangle 的属性设置为指定值。
		*@param x x 矩形左上角的 X 轴坐标。
		*@param y x 矩形左上角的 Y 轴坐标。
		*@param width 矩形的宽度。
		*@param height 矩形的高。
		*@return 返回属性值修改后的矩形对象本身。
		*/
		__proto.setTo=function(x,y,width,height){
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*复制 source 对象的属性值到此矩形对象中。
		*@param sourceRect 源 Rectangle 对象。
		*@return 返回属性值修改后的矩形对象本身。
		*/
		__proto.copyFrom=function(source){
			this.x=source.x;
			this.y=source.y;
			this.width=source.width;
			this.height=source.height;
			return this;
		}

		/**
		*检测此矩形对象是否包含指定的点。
		*@param x 点的 X 轴坐标值（水平位置）。
		*@param y 点的 Y 轴坐标值（垂直位置）。
		*@return 如果 Rectangle 对象包含指定的点，则值为 true；否则为 false。
		*/
		__proto.contains=function(x,y){
			if (this.width <=0 || this.height <=0)return false;
			if (x >=this.x && x < this.right){
				if (y >=this.y && y < this.bottom){
					return true;
				}
			}
			return false;
		}

		/**
		*检测传入的矩形对象是否与此对象相交。
		*@param rect Rectangle 对象。
		*@return 如果传入的矩形对象与此对象相交，则返回 true 值，否则返回 false。
		*/
		__proto.intersects=function(rect){
			return !(rect.x > this.right || rect.right < this.x || rect.y > this.bottom || rect.bottom < this.y);
		}

		/**
		*获取此对象与传入的矩形对象的相交区域。并将相交区域赋值给传入的输出矩形对象。
		*@param rect 待比较的矩形区域。
		*@param out 待输出的矩形区域。建议：尽量用此对象复用对象，减少对象创建消耗。
		*@return 返回相交的矩形区域对象。
		*/
		__proto.intersection=function(rect,out){
			if (!this.intersects(rect))return null;
			out || (out=new Rectangle());
			out.x=Math.max(this.x,rect.x);
			out.y=Math.max(this.y,rect.y);
			out.width=Math.min(this.right,rect.right)-out.x;
			out.height=Math.min(this.bottom,rect.bottom)-out.y;
			return out;
		}

		/**
		*矩形联合，通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
		*@param 目标矩形对象。
		*@param out 待输出结果的矩形对象。建议：尽量用此对象复用对象，减少对象创建消耗。
		*@return 两个矩形后联合的 Rectangle 对象 out 。
		*/
		__proto.union=function(source,out){
			out || (out=new Rectangle());
			this.clone(out);
			if (source.width <=0 || source.height <=0)return out;
			out.addPoint(source.x,source.y);
			out.addPoint(source.right,source.bottom);
			return this;
		}

		/**
		*返回一个 Rectangle 对象，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
		*@param out 待输出的矩形对象。建议：尽量用此对象复用对象，减少对象创建消耗。
		*@return Rectangle 对象 out ，其 x、y、width 和 height 属性的值与当前 Rectangle 对象的对应值相同。
		*/
		__proto.clone=function(out){
			out || (out=new Rectangle());
			out.x=this.x;
			out.y=this.y;
			out.width=this.width;
			out.height=this.height;
			return out;
		}

		/**
		*当前 Rectangle 对象的水平位置 x 和垂直位置 y 以及高度 width 和宽度 height 以逗号连接成的字符串。
		*/
		__proto.toString=function(){
			return this.x+","+this.y+","+this.width+","+this.height;
		}

		/**
		*检测传入的 Rectangle 对象的属性是否与当前 Rectangle 对象的属性 x、y、width、height 属性值都相等。
		*@param rect 待比较的 Rectangle 对象。
		*@return 如果判断的属性都相等，则返回 true ,否则返回 false。
		*/
		__proto.equals=function(rect){
			if (!rect || rect.x!==this.x || rect.y!==this.y || rect.width!==this.width || rect.height!==this.height)return false;
			return true;
		}

		/**
		*在当前矩形区域中加一个点。
		*@param x 点的 X 坐标。
		*@param y 点的 Y 坐标。
		*@return 返回此 Rectangle 对象。
		*/
		__proto.addPoint=function(x,y){
			this.x > x && (this.width+=this.x-x,this.x=x);
			this.y > y && (this.height+=this.y-y,this.y=y);
			if (this.width < x-this.x)this.width=x-this.x;
			if (this.height < y-this.y)this.height=y-this.y;
			return this;
		}

		/**
		*@private
		*返回代表当前矩形的顶点数据。
		*@return 顶点数据。
		*/
		__proto._getBoundPoints=function(){
			var rst=Rectangle._temB;
			rst.length=0;
			if (this.width==0 || this.height==0)return rst;
			rst.push(this.x,this.y,this.x+this.width,this.y,this.x,this.y+this.height,this.x+this.width,this.y+this.height);
			return rst;
		}

		/**确定此 Rectangle 对象是否为空。*/
		__proto.isEmpty=function(){
			if (this.width <=0 || this.height <=0)return true;
			return false;
		}

		/**此矩形的右边距。 x 和 width 属性的和。*/
		__getset(0,__proto,'right',function(){
			return this.x+this.width;
		});

		/**此矩形的底边距。y 和 height 属性的和。*/
		__getset(0,__proto,'bottom',function(){
			return this.y+this.height;
		});

		Rectangle._getBoundPointS=function(x,y,width,height){
			var rst=Rectangle._temA;
			rst.length=0;
			if (width==0 || height==0)return rst;
			rst.push(x,y,x+width,y,x,y+height,x+width,y+height);
			return rst;
		}

		Rectangle._getWrapRec=function(pointList,rst){
			if (!pointList || pointList.length < 1)return rst ? rst.setTo(0,0,0,0):Rectangle.TEMP.setTo(0,0,0,0);
			rst=rst ? rst :new Rectangle();
			var i,len=pointList.length,minX,maxX,minY,maxY,tPoint=Point.TEMP;
			minX=minY=99999;
			maxX=maxY=-minX;
			for (i=0;i < len;i+=2){
				tPoint.x=pointList[i];
				tPoint.y=pointList[i+1];
				minX=minX < tPoint.x ? minX :tPoint.x;
				minY=minY < tPoint.y ? minY :tPoint.y;
				maxX=maxX > tPoint.x ? maxX :tPoint.x;
				maxY=maxY > tPoint.y ? maxY :tPoint.y;
			}
			return rst.setTo(minX,minY,maxX-minX,maxY-minY);
		}

		Rectangle.EMPTY=new Rectangle();
		Rectangle.TEMP=new Rectangle();
		Rectangle._temB=[];
		Rectangle._temA=[];
		return Rectangle;
	})()


	/**
	*<code>SoundManager</code> 是一个声音管理类。
	*/
	//class laya.media.SoundManager
	var SoundManager=(function(){
		function SoundManager(){};
		__class(SoundManager,'laya.media.SoundManager');
		/**
		*设置是否失去焦点后自动停止背景音乐。
		*@param v Boolean 值。
		*
		*/
		/**
		*表示是否失去焦点后自动停止背景音乐。
		*@return
		*/
		__getset(1,SoundManager,'autoStopMusic',function(){
			return SoundManager._autoStopMusic;
			},function(v){
			Laya.stage.off("blur",null,SoundManager._stageOnBlur);
			Laya.stage.off("focus",null,SoundManager._stageOnFocus);
			SoundManager._autoStopMusic=v;
			if (v){
				Laya.stage.on("blur",null,SoundManager._stageOnBlur);
				Laya.stage.on("focus",null,SoundManager._stageOnFocus);
			}
		});

		/**
		*表示是否静音。
		*/
		__getset(1,SoundManager,'muted',function(){
			return SoundManager._muted;
			},function(value){
			if (value){
				SoundManager.stopAll();
			}
			SoundManager._muted=value;
		});

		/**表示是否使背景音乐静音。*/
		__getset(1,SoundManager,'musicMuted',function(){
			return SoundManager._musicMuted;
			},function(value){
			if (value){
				if (SoundManager._tMusic)
					SoundManager.stopSound(SoundManager._tMusic);
				SoundManager._musicMuted=value;
				}else {
				SoundManager._musicMuted=value;
				if (SoundManager._tMusic){
					SoundManager.playMusic(SoundManager._tMusic);
				}
			}
		});

		/**表示是否使音效静音。*/
		__getset(1,SoundManager,'soundMuted',function(){
			return SoundManager._soundMuted;
			},function(value){
			SoundManager._soundMuted=value;
		});

		SoundManager.addChannel=function(channel){
			if (SoundManager._channels.indexOf(channel)>=0)return;
			SoundManager._channels.push(channel);
		}

		SoundManager.removeChannel=function(channel){
			var i=0;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				if (SoundManager._channels[i]==channel){
					SoundManager._channels.splice(i,1);
				}
			}
		}

		SoundManager._stageOnBlur=function(){
			if (SoundManager._musicChannel){
				if (!SoundManager._musicChannel.isStopped){
					SoundManager._blurPaused=true;
					SoundManager._musicLoops=SoundManager._musicChannel.loops;
					SoundManager._musicCompleteHandler=SoundManager._musicChannel.completeHandler;
					SoundManager._musicPosition=SoundManager._musicChannel.position;
					SoundManager._musicChannel.stop();
				}
			}
		}

		SoundManager._stageOnFocus=function(){
			if (SoundManager._blurPaused){
				SoundManager.playMusic(SoundManager._tMusic,SoundManager._musicLoops,SoundManager._musicCompleteHandler,SoundManager._musicPosition);
				SoundManager._blurPaused=false;
			}
		}

		SoundManager.playSound=function(url,loops,complete,soundClass,startTime){
			(loops===void 0)&& (loops=1);
			(startTime===void 0)&& (startTime=0);
			if (SoundManager._muted)
				return null;
			if (url==SoundManager._tMusic){
				if (SoundManager._musicMuted)return null;
				}else {
				if (SoundManager._soundMuted)return null;
			};
			var tSound=Laya.loader.getRes(url);
			if (!soundClass)soundClass=SoundManager._soundClass;
			if (!tSound){
				tSound=new soundClass();
				tSound.load(url);
				Loader.cacheRes(url,tSound);
			};
			var channel;
			channel=tSound.play(startTime,loops);
			channel.url=url;
			channel.volume=(url==SoundManager._tMusic)? SoundManager.musicVolume :SoundManager.soundVolume;
			channel.completeHandler=complete;
			return channel;
		}

		SoundManager.destroySound=function(url){
			var tSound=Laya.loader.getRes(url);
			if (tSound){
				Loader.clearRes(url);
				tSound.dispose();
			}
		}

		SoundManager.playMusic=function(url,loops,complete,startTime){
			(loops===void 0)&& (loops=0);
			(startTime===void 0)&& (startTime=0);
			SoundManager._tMusic=url;
			if (SoundManager._musicChannel)
				SoundManager._musicChannel.stop();
			return SoundManager._musicChannel=SoundManager.playSound(url,loops,complete,null,startTime);
		}

		SoundManager.stopSound=function(url){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.stop();
				}
			}
		}

		SoundManager.stopAll=function(){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				channel.stop();
			}
		}

		SoundManager.stopMusic=function(){
			if (SoundManager._musicChannel)
				SoundManager._musicChannel.stop();
		}

		SoundManager.setSoundVolume=function(volume,url){
			if (url){
				SoundManager._setVolume(url,volume);
				}else {
				SoundManager.soundVolume=volume;
			}
		}

		SoundManager.setMusicVolume=function(volume){
			SoundManager.musicVolume=volume;
			SoundManager._setVolume(SoundManager._tMusic,volume);
		}

		SoundManager._setVolume=function(url,volume){
			var i=0;
			var channel;
			for (i=SoundManager._channels.length-1;i >=0;i--){
				channel=SoundManager._channels[i];
				if (channel.url==url){
					channel.volume=volume;
				}
			}
		}

		SoundManager.musicVolume=1;
		SoundManager.soundVolume=1;
		SoundManager._muted=false;
		SoundManager._soundMuted=false;
		SoundManager._musicMuted=false;
		SoundManager._tMusic=null;
		SoundManager._musicChannel=null;
		SoundManager._channels=[];
		SoundManager._autoStopMusic=false;
		SoundManager._blurPaused=false;
		SoundManager._musicLoops=0;
		SoundManager._musicPosition=0;
		SoundManager._musicCompleteHandler=null;
		SoundManager._soundClass=null
		return SoundManager;
	})()


	/**
	*<p> <code>URL</code> 类用于定义地址信息。</p>
	*/
	//class laya.net.URL
	var URL=(function(){
		function URL(url){
			this._url=null;
			this._path=null;
			this._url=URL.formatURL(url);
			this._path=URL.getPath(url);
		}

		__class(URL,'laya.net.URL');
		var __proto=URL.prototype;
		/**地址的路径。*/
		__getset(0,__proto,'path',function(){
			return this._path;
		});

		/**格式化后的地址。*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		URL.formatURL=function(url,base){
			if (URL.customFormat !=null)url=URL.customFormat(url,base);
			if (!url)return "null path";
			if (Render.isConchApp==false){
				URL.version[url] && (url+="?v="+URL.version[url]);
			}
			if (url.charAt(0)=='~')return URL.rootPath+url.substring(1);
			if (URL.isAbsolute(url))return url;
			var retVal=(base || URL.basePath)+url;
			return retVal;
		}

		URL.formatRelativePath=function(value){
			if (value.indexOf("../")>-1){
				var parts=value.split("/");
				for (var i=0,len=parts.length;i < len;i++){
					if (parts[i]=='..'){
						parts.splice(i-1,2);
						i-=2;
					}
				}
				return parts.join('/');
			}
			return value;
		}

		URL.isAbsolute=function(url){
			return url.indexOf(":")> 0 || url.charAt(0)=='/';
		}

		URL.getPath=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(0,ofs+1):"";
		}

		URL.getFileName=function(url){
			var ofs=url.lastIndexOf('/');
			return ofs > 0 ? url.substr(ofs+1):url;
		}

		URL.version={};
		URL.basePath="";
		URL.rootPath="";
		URL.customFormat=null
		return URL;
	})()


	/**
	*@private
	*<code>Render</code> 是渲染管理类。它是一个单例，可以使用 Laya.render 访问。
	*/
	//class laya.renders.Render
	var Render=(function(){
		/**
		*初始化引擎。
		*@param width 游戏窗口宽度。
		*@param height 游戏窗口高度。
		*/
		function Render(width,height){
			var style=Render._mainCanvas.source.style;
			style.position='absolute';
			style.top=style.left="0px";
			style.background="#000000";
			Render._mainCanvas.source.id="layaCanvas";
			var isWebGl=laya.renders.Render.isWebGL;
			isWebGl && Render.WebGL.init(Render._mainCanvas,width,height);
			Browser.container.appendChild(Render._mainCanvas.source);
			Render._context=new RenderContext(width,height,isWebGl ? null :Render._mainCanvas);
			Render._context.ctx.setIsMainContext();
			Browser.window.requestAnimationFrame(loop);
			function loop (){
				Laya.stage._loop();
				Browser.window.requestAnimationFrame(loop);
			}
		}

		__class(Render,'laya.renders.Render');
		var __proto=Render.prototype;
		/**@private */
		__proto._enterFrame=function(e){
			Laya.stage._loop();
		}

		/**是否是加速器 只读*/
		__getset(1,Render,'isConchApp',function(){
			return (window.ConchRenderType & 0x04)==0x04;
		});

		/**目前使用的渲染器。*/
		__getset(1,Render,'context',function(){
			return Render._context;
		});

		/**加速器模式下设置是否是节点模式 如果是否就是非节点模式 默认为canvas模式 如果设置了isConchWebGL则是webGL模式*/
		__getset(1,Render,'isConchNode',function(){
			return (window.ConchRenderType & 5)==5;
			},function(b){
			if (b){
				window.ConchRenderType |=0x01;
				}else {
				window.ConchRenderType &=~ 0x01;
			}
		});

		/**加速器模式下设置是否是WebGL模式*/
		__getset(1,Render,'isConchWebGL',function(){
			return window.ConchRenderType==6;
			},function(b){
			if (b){
				Render.isConchNode=false;
				window.ConchRenderType |=0x02;
				}else {
				window.ConchRenderType &=~ 0x02;
			}
		});

		/**渲染使用的原生画布引用。 */
		__getset(1,Render,'canvas',function(){
			return Render._mainCanvas.source;
		});

		Render._context=null
		Render._mainCanvas=null
		Render.WebGL=null
		Render.NODE=0x01;
		Render.WEBGL=0x02;
		Render.CONCH=0x04;
		Render.isWebGL=false;
		Render.is3DMode=false;
		Render.optimizeTextureMemory=function(url,texture){
			return true;
		}

		Render.__init$=function(){
			window.ConchRenderType=window.ConchRenderType||1;;
			window.ConchRenderType|=(!window.conch?0:0x04);;
		}

		return Render;
	})()


	/**
	*@private
	*渲染环境
	*/
	//class laya.renders.RenderContext
	var RenderContext=(function(){
		function RenderContext(width,height,canvas){
			this.x=0;
			this.y=0;
			//this.canvas=null;
			//this.ctx=null;
			this._drawTexture=function(x,y,args){
				if (args[0].loaded)this.ctx.drawTexture(args[0],args[1],args[2],args[3],args[4],x,y);
			}
			this._fillTexture=function(x,y,args){
				if (args[0].loaded){
					var texture=args[0];
					var ctxi=this.ctx;
					var pat;
					if (Render.isWebGL){
						var tSprite=args[7];
						if (tSprite){
							if (args[6]){
								tSprite.initTexture(texture,args[1],args[2],args[3],args[4],args[6].x,args[6].y);
								}else {
								tSprite.initTexture(texture,args[1],args[2],args[3],args[4],0,0);
							};
							var ctx=this.ctx;
							tSprite.render(ctx,x,y);
						}
						return;
					}
					if (!Render.isConchApp){
						if (texture.uv !=Texture.DEF_UV){
							var canvas=new HTMLCanvas("2D");
							canvas.getContext('2d');
							canvas.size(texture.width,texture.height);
							canvas.context.drawTexture(texture,0,0,texture.width,texture.height,0,0);
							args[0]=texture=new Texture(canvas);
						}
						pat=args[7] ? args[7] :args[7]=ctxi.createPattern(texture.bitmap.source,args[5]);
						}else {
						if (texture.uv !=Texture.DEF_UV){
							var w=texture.bitmap.width,h=texture.bitmap.height,uv=texture.uv;
							pat=args[7] ? args[7] :args[7]=ctxi.createPattern(texture.bitmap.source,args[5],uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h);
							}else {
							pat=args[7] ? args[7] :args[7]=ctxi.createPattern(texture.bitmap.source,args[5]);
						}
					};
					var oX=x+args[1],oY=y+args[2];
					var sX=0,sY=0;
					if (args[6]){
						oX+=args[6].x % texture.width;
						oY+=args[6].y % texture.height;
						sX-=args[6].x % texture.width;
						sY-=args[6].y % texture.height;
					}
					ctxi.translate(oX,oY);
					ctxi.fillStyle=pat;
					ctxi.fillRect(sX,sY,args[3],args[4]);
					ctxi.translate(-oX,-oY);
				}else {}
			}
			this._drawTextureWithTransform=function(x,y,args){
				if (args[0].loaded)this.ctx.drawTextureWithTransform(args[0],args[1],args[2],args[3],args[4],args[5],x,y);
			}
			this._fillQuadrangle=function(x,y,args){
				this.ctx.fillQuadrangle(args[0],args[1],args[2],args[3],args[4]);
			}
			this._drawRect=function(x,y,args){
				var ctx=this.ctx;
				if (args[4] !=null){
					ctx.fillStyle=args[4];
					ctx.fillRect(x+args[0],y+args[1],args[2],args[3],null);
				}
				if (args[5] !=null){
					ctx.strokeStyle=args[5];
					ctx.lineWidth=args[6];
					ctx.strokeRect(x+args[0],y+args[1],args[2],args[3],args[6]);
				}
			}
			this._drawPie=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[8]);
				ctx.beginPath();
				if (Render.isWebGL){
					ctx.movePath(args[0]+x,args[1]+y);
					ctx.moveTo(0,0);
					}else {
					ctx.moveTo(x+args[0],y+args[1]);
				}
				ctx.arc(x+args[0],y+args[1],args[2],args[3],args[4]);
				ctx.closePath();
				this._fillAndStroke(args[5],args[6],args[7],true);
			}
			this._clipRect=function(x,y,args){
				this.ctx.clipRect(x+args[0],y+args[1],args[2],args[3]);
			}
			this._fillRect=function(x,y,args){
				this.ctx.fillRect(x+args[0],y+args[1],args[2],args[3],args[4]);
			}
			this._drawCircle=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[6]);
				Stat.drawCall++;
				ctx.beginPath();
				Render.isWebGL && ctx.movePath(args[0]+x,args[1]+y);
				ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
				ctx.closePath();
				this._fillAndStroke(args[3],args[4],args[5],true);
			}
			this._fillCircle=function(x,y,args){
				Stat.drawCall++;
				var ctx=this.ctx;
				ctx.beginPath();
				ctx.fillStyle=args[3];
				ctx.arc(args[0]+x,args[1]+y,args[2],0,RenderContext.PI2);
				ctx.fill();
			}
			this._setShader=function(x,y,args){
				this.ctx.setShader(args[0]);
			}
			this._drawLine=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[6]);
				ctx.beginPath();
				ctx.strokeStyle=args[4];
				ctx.lineWidth=args[5];
				if (Render.isWebGL){
					ctx.movePath(x,y);
					ctx.moveTo(args[0],args[1]);
					ctx.lineTo(args[2],args[3]);
					}else {
					ctx.moveTo(x+args[0],y+args[1]);
					ctx.lineTo(x+args[2],y+args[3]);
				}
				ctx.stroke();
			}
			this._drawLines=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(args[5]);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				Render.isWebGL && ctx.movePath(x,y);
				ctx.strokeStyle=args[3];
				ctx.lineWidth=args[4];
				var points=args[2];
				var i=2,n=points.length;
				if (Render.isWebGL){
					ctx.moveTo(points[0],points[1]);
					while (i < n){
						ctx.lineTo(points[i++],points[i++]);
					}
					}else {
					ctx.moveTo(x+points[0],y+points[1]);
					while (i < n){
						ctx.lineTo(x+points[i++],y+points[i++]);
					}
				}
				ctx.stroke();
			}
			this._drawLinesWebGL=function(x,y,args){
				this.ctx.drawLines(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4]);
			}
			this._drawCurves=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(-1);
				ctx.beginPath();
				ctx.strokeStyle=args[3];
				ctx.lineWidth=args[4];
				var points=args[2];
				x+=args[0],y+=args[1];
				ctx.moveTo(x+points[0],y+points[1]);
				var i=2,n=points.length;
				while (i < n){
					ctx.quadraticCurveTo(x+points[i++],y+points[i++],x+points[i++],y+points[i++]);
				}
				ctx.stroke();
			}
			this._draw=function(x,y,args){
				args[0].call(null,this,x,y);
			}
			this._transformByMatrix=function(x,y,args){
				this.ctx.transformByMatrix(args[0]);
			}
			this._setTransform=function(x,y,args){
				this.ctx.setTransform(args[0],args[1],args[2],args[3],args[4],args[5]);
			}
			this._setTransformByMatrix=function(x,y,args){
				this.ctx.setTransformByMatrix(args[0]);
			}
			this._save=function(x,y,args){
				this.ctx.save();
			}
			this._restore=function(x,y,args){
				this.ctx.restore();
			}
			this._translate=function(x,y,args){
				this.ctx.translate(args[0],args[1]);
			}
			this._transform=function(x,y,args){
				this.ctx.translate(args[1]+x,args[2]+y);
				var mat=args[0];
				this.ctx.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
				this.ctx.translate(-x-args[1],-y-args[2]);
			}
			this._rotate=function(x,y,args){
				this.ctx.translate(args[1]+x,args[2]+y);
				this.ctx.rotate(args[0]);
				this.ctx.translate(-x-args[1],-y-args[2]);
			}
			this._scale=function(x,y,args){
				this.ctx.translate(args[2]+x,args[3]+y);
				this.ctx.scale(args[0],args[1]);
				this.ctx.translate(-x-args[2],-y-args[3]);
			}
			this._alpha=function(x,y,args){
				this.ctx.globalAlpha *=args[0];
			}
			this._setAlpha=function(x,y,args){
				this.ctx.globalAlpha=args[0];
			}
			this._fillText=function(x,y,args){
				this.ctx.fillText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5]);
			}
			this._strokeText=function(x,y,args){
				this.ctx.strokeText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6]);
			}
			this._fillBorderText=function(x,y,args){
				this.ctx.fillBorderText(args[0],args[1]+x,args[2]+y,args[3],args[4],args[5],args[6],args[7]);
			}
			this._blendMode=function(x,y,args){
				this.ctx.globalCompositeOperation=args[0];
			}
			this._beginClip=function(x,y,args){
				this.ctx.beginClip && this.ctx.beginClip(x+args[0],y+args[1],args[2],args[3]);
			}
			this._setIBVB=function(x,y,args){
				this.ctx.setIBVB(args[0]+x,args[1]+y,args[2],args[3],args[4],args[5],args[6],args[7]);
			}
			this._fillTrangles=function(x,y,args){
				this.ctx.fillTrangles(args[0],args[1]+x,args[2]+y,args[3],args[4]);
			}
			this._drawPath=function(x,y,args){
				var ctx=this.ctx;
				Render.isWebGL && ctx.setPathId(-1);
				ctx.beginPath();
				x+=args[0],y+=args[1];
				var paths=args[2];
				for (var i=0,n=paths.length;i < n;i++){
					var path=paths[i];
					switch (path[0]){
						case "moveTo":
							ctx.moveTo(x+path[1],y+path[2]);
							break ;
						case "lineTo":
							ctx.lineTo(x+path[1],y+path[2]);
							break ;
						case "arcTo":
							ctx.arcTo(x+path[1],y+path[2],x+path[3],y+path[4],path[5]);
							break ;
						case "closePath":
							ctx.closePath();
							break ;
						}
				};
				var brush=args[3];
				if (brush !=null){
					ctx.fillStyle=brush.fillStyle;
					ctx.fill();
				};
				var pen=args[4];
				if (pen !=null){
					ctx.strokeStyle=pen.strokeStyle;
					ctx.lineWidth=pen.lineWidth || 1;
					ctx.lineJoin=pen.lineJoin;
					ctx.lineCap=pen.lineCap;
					ctx.miterLimit=pen.miterLimit;
					ctx.stroke();
				}
			}
			this.drawPoly=function(x,y,args){
				this.ctx.drawPoly(x+this.x+args[0],y+this.y+args[1],args[2],args[3],args[4],args[5],args[6]);
			}
			this._drawPoly=function(x,y,args){
				var ctx=this.ctx;
				var points=args[2];
				var i=2,n=points.length;
				if (Render.isWebGL){
					ctx.setPathId(args[6]);
					ctx.beginPath();
					x+=args[0],y+=args[1];
					ctx.movePath(x,y);
					ctx.moveTo(points[0],points[1]);
					while (i < n){
						ctx.lineTo(points[i++],points[i++]);
					}
					}else {
					ctx.beginPath();
					x+=args[0],y+=args[1];
					ctx.moveTo(x+points[0],y+points[1]);
					while (i < n){
						ctx.lineTo(x+points[i++],y+points[i++]);
					}
				}
				ctx.closePath();
				this._fillAndStroke(args[3],args[4],args[5],args[7]);
			}
			this._drawSkin=function(x,y,args){
				var tSprite=args[0];
				if (tSprite){
					var ctx=this.ctx;
					tSprite.render(ctx,x,y);
				}
			}
			this._drawParticle=function(x,y,args){
				this.ctx.drawParticle(x+this.x,y+this.y,args[0]);
			}
			if (canvas){
				this.ctx=canvas.getContext('2d');
				}else {
				canvas=HTMLCanvas.create("3D");
				this.ctx=RunDriver.createWebGLContext2D(canvas);
				canvas._setContext(this.ctx);
			}
			canvas.size(width,height);
			this.canvas=canvas;
		}

		__class(RenderContext,'laya.renders.RenderContext');
		var __proto=RenderContext.prototype;
		/**销毁当前渲染环境*/
		__proto.destroy=function(){
			if (this.canvas){
				this.canvas.destroy();
				this.canvas=null;
			}
			if (this.ctx){
				this.ctx.destroy();
				this.ctx=null;
			}
		}

		__proto.drawTexture=function(tex,x,y,width,height){
			if (tex.loaded)this.ctx.drawTexture(tex,x,y,width,height,this.x,this.y);
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m){
			if (tex.loaded)this.ctx.drawTextureWithTransform(tex,x,y,width,height,m,this.x,this.y);
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			this.ctx.fillQuadrangle(tex,x,y,point4,m);
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			this.ctx.drawCanvas(canvas,x+this.x,y+this.y,width,height);
		}

		__proto.drawRect=function(x,y,width,height,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.strokeRect(x+this.x,y+this.y,width,height,lineWidth);
		}

		__proto._fillAndStroke=function(fillColor,strokeColor,lineWidth,isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			var ctx=this.ctx;
			if (fillColor !=null){
				ctx.fillStyle=fillColor;
				if (Render.isWebGL){
					ctx.fill(isConvexPolygon);
					}else {
					ctx.fill();
				}
			}
			if (strokeColor !=null && lineWidth > 0){
				ctx.strokeStyle=strokeColor;
				ctx.lineWidth=lineWidth;
				ctx.stroke();
			}
		}

		//ctx.translate(-x-args[0],-y-args[1]);
		__proto.clipRect=function(x,y,width,height){
			this.ctx.clipRect(x+this.x,y+this.y,width,height);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			this.ctx.fillRect(x+this.x,y+this.y,width,height,fillStyle);
		}

		__proto.drawCircle=function(x,y,radius,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.stroke();
		}

		__proto.fillCircle=function(x,y,radius,color){
			Stat.drawCall++;
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.fillStyle=color;
			ctx.arc(x+this.x,y+this.y,radius,0,RenderContext.PI2);
			ctx.fill();
		}

		__proto.setShader=function(shader){
			this.ctx.setShader(shader);
		}

		__proto.drawLine=function(fromX,fromY,toX,toY,color,lineWidth){
			(lineWidth===void 0)&& (lineWidth=1);
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.strokeStyle=color;
			ctx.lineWidth=lineWidth;
			ctx.moveTo(this.x+fromX,this.y+fromY);
			ctx.lineTo(this.x+toX,this.y+toY);
			ctx.stroke();
		}

		__proto.clear=function(){
			this.ctx.clear();
		}

		__proto.transformByMatrix=function(value){
			this.ctx.transformByMatrix(value);
		}

		__proto.setTransform=function(a,b,c,d,tx,ty){
			this.ctx.setTransform(a,b,c,d,tx,ty);
		}

		__proto.setTransformByMatrix=function(value){
			this.ctx.setTransformByMatrix(value);
		}

		__proto.save=function(){
			this.ctx.save();
		}

		__proto.restore=function(){
			this.ctx.restore();
		}

		__proto.translate=function(x,y){
			this.ctx.translate(x,y);
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			this.ctx.transform(a,b,c,d,tx,ty);
		}

		__proto.rotate=function(angle){
			this.ctx.rotate(angle);
		}

		__proto.scale=function(scaleX,scaleY){
			this.ctx.scale(scaleX,scaleY);
		}

		__proto.alpha=function(value){
			this.ctx.globalAlpha *=value;
		}

		__proto.setAlpha=function(value){
			this.ctx.globalAlpha=value;
		}

		__proto.fillWords=function(words,x,y,font,color){
			this.ctx.fillWords(words,x,y,font,color);
		}

		__proto.fillText=function(text,x,y,font,color,textAlign){
			this.ctx.fillText(text,x+this.x,y+this.y,font,color,textAlign);
		}

		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			this.ctx.strokeText(text,x+this.x,y+this.y,font,color,lineWidth,textAlign);
		}

		__proto.blendMode=function(type){
			this.ctx.globalCompositeOperation=type;
		}

		__proto.flush=function(){
			this.ctx.flush && this.ctx.flush();
		}

		__proto.addRenderObject=function(o){
			this.ctx.addRenderObject(o);
		}

		__proto.beginClip=function(x,y,w,h){
			this.ctx.beginClip && this.ctx.beginClip(x,y,w,h);
		}

		__proto.endClip=function(){
			this.ctx.endClip && this.ctx.endClip();
		}

		__proto.fillTrangles=function(x,y,args){
			this.ctx.fillTrangles(args[0],args[1],args[2],args[3],args.length > 4 ? args[4] :null);
		}

		RenderContext.PI2=2 *Math.PI;
		return RenderContext;
	})()


	/**
	*@private
	*精灵渲染器
	*/
	//class laya.renders.RenderSprite
	var RenderSprite=(function(){
		function RenderSprite(type,next){
			//this._next=null;
			//this._fun=null;
			this._next=next || RenderSprite.NORENDER;
			switch (type){
				case 0:
					this._fun=this._no;
					return;
				case 0x01:
					this._fun=this._image;
					return;
				case 0x02:
					this._fun=this._alpha;
					return;
				case 0x04:
					this._fun=this._transform;
					return;
				case 0x20:
					this._fun=this._blend;
					return;
				case 0x08:
					this._fun=this._canvas;
					return;
				case 0x40:
					this._fun=this._clip;
					return;
				case 0x80:
					this._fun=this._style;
					return;
				case 0x100:
					this._fun=this._graphics;
					return;
				case 0x800:
					this._fun=this._childs;
					return;
				case 0x200:
					this._fun=this._custom;
					return;
				case 0x01 | 0x100:
					this._fun=this._image2;
					return;
				case 0x01 | 0x04 | 0x100:
					this._fun=this._image2;
					return;
				case 0x10:
					this._fun=Filter._filter;
					return;
				case 0x11111:
					this._fun=RenderSprite._initRenderFun;
					return;
				}
			this.onCreate(type);
		}

		__class(RenderSprite,'laya.renders.RenderSprite');
		var __proto=RenderSprite.prototype;
		__proto.onCreate=function(type){}
		__proto._style=function(sprite,context,x,y){
			sprite._style.render(sprite,context,x,y);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._no=function(sprite,context,x,y){}
		__proto._custom=function(sprite,context,x,y){
			sprite.customRender(context,x,y);
			var tf=sprite._style._tf;
			this._next._fun.call(this._next,sprite,context,x-tf.translateX,y-tf.translateY);
		}

		__proto._clip=function(sprite,context,x,y){
			var next=this._next;
			if (next==RenderSprite.NORENDER)return;
			var r=sprite._style.scrollRect;
			context.ctx.save();
			context.ctx.clipRect(x,y,r.width,r.height);
			next._fun.call(next,sprite,context,x-r.x,y-r.y);
			context.ctx.restore();
		}

		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			if (style.blendMode){
				context.ctx.globalCompositeOperation=style.blendMode;
			};
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
			var mask=sprite.mask;
			if (mask){
				context.ctx.globalCompositeOperation="destination-in";
				if (mask.numChildren > 0 || !mask.graphics._isOnlyOne()){
					mask.cacheAsBitmap=true;
				}
				mask.render(context,x,y);
			}
			context.ctx.globalCompositeOperation="source-over";
		}

		__proto._graphics=function(sprite,context,x,y){
			var tf=sprite._style._tf;
			sprite._graphics && sprite._graphics._render(sprite,context,x-tf.translateX,y-tf.translateY);
			var next=this._next;
			next._fun.call(next,sprite,context,x,y);
		}

		__proto._image=function(sprite,context,x,y){
			var style=sprite._style;
			context.ctx.drawTexture2(x,y,style._tf.translateX,style._tf.translateY,sprite.transform,style.alpha,style.blendMode,sprite._graphics._one);
		}

		__proto._image2=function(sprite,context,x,y){
			var tf=sprite._style._tf;
			context.ctx.drawTexture2(x,y,tf.translateX,tf.translateY,sprite.transform,1,null,sprite._graphics._one);
		}

		__proto._alpha=function(sprite,context,x,y){
			var style=sprite._style;
			var alpha;
			if ((alpha=style.alpha)> 0.01){
				var temp=context.ctx.globalAlpha;
				context.ctx.globalAlpha *=alpha;
				var next=this._next;
				next._fun.call(next,sprite,context,x,y);
				context.ctx.globalAlpha=temp;
			}
		}

		__proto._transform=function(sprite,context,x,y){
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				context.save();
				context.transform(transform.a,transform.b,transform.c,transform.d,transform.tx+x,transform.ty+y);
				_next._fun.call(_next,sprite,context,0,0);
				context.restore();
			}else
			_next._fun.call(_next,sprite,context,x,y);
		}

		__proto._childs=function(sprite,context,x,y){
			var style=sprite._style;
			x+=-style._tf.translateX+style.paddingLeft;
			y+=-style._tf.translateY+style.paddingTop;
			var words=sprite._getWords();
			words && context.fillWords(words,x,y,(style).font,(style).color);
			var childs=sprite._childs,n=childs.length,ele;
			if (!sprite.optimizeScrollRect || sprite.scrollRect==null){
				for (var i=0;i < n;++i)
				(ele=(childs [i]))._style.visible && ele.render(context,x,y);
				}else {
				var rect=sprite.scrollRect;
				for (i=0;i < n;++i){
					ele=childs [i];
					if (ele._style.visible && rect.intersects(Rectangle.TEMP.setTo(ele.x,ele.y,ele.width,ele.height)))
						ele.render(context,x,y);
				}
			}
		}

		__proto._canvas=function(sprite,context,x,y){
			var _cacheCanvas=sprite._$P.cacheCanvas;
			var _next=this._next;
			if (!_cacheCanvas){
				_next._fun.call(_next,sprite,tx,x,y);
				return;
			};
			var tx=_cacheCanvas.ctx;
			var _repaint=sprite._needRepaint()|| (!tx);
			var canvas;
			var left;
			var top;
			var tRec;
			_cacheCanvas.type==='bitmap' ? (Stat.canvasBitmap++):(Stat.canvasNormal++);
			if (_repaint){
				if (!_cacheCanvas._cacheRec)
					_cacheCanvas._cacheRec=new Rectangle();
				var w,h;
				tRec=sprite.getSelfBounds();
				if (Render.isWebGL && _cacheCanvas.type==='bitmap' && (tRec.width > 2048 || tRec.height > 2048)){
					console.log("cache bitmap size larger than 2048,cache ignored");
					_next._fun.call(_next,sprite,tx,x,y);
					return;
				}
				tRec.x-=sprite.pivotX;
				tRec.y-=sprite.pivotY;
				tRec.x-=10;
				tRec.y-=10;
				tRec.width+=20;
				tRec.height+=20;
				tRec.x=Math.floor(tRec.x+x)-x;
				tRec.y=Math.floor(tRec.y+y)-y;
				tRec.width=Math.floor(tRec.width);
				tRec.height=Math.floor(tRec.height);
				_cacheCanvas._cacheRec.copyFrom(tRec);
				tRec=_cacheCanvas._cacheRec;
				var scaleX=Render.isWebGL?1:Browser.pixelRatio *Laya.stage.clientScaleX;
				var scaleY=Render.isWebGL?1:Browser.pixelRatio *Laya.stage.clientScaleY;
				if (!Render.isWebGL){
					var chainScaleX=1;
					var chainScaleY=1;
					var tar;
					tar=sprite;
					while (tar && tar !=Laya.stage){
						chainScaleX *=tar.scaleX;
						chainScaleY *=tar.scaleY;
						tar=tar.parent;
					}
					if (chainScaleX > 1)scaleX *=chainScaleX;
					if (chainScaleY > 1)scaleY *=chainScaleY;
				}
				w=tRec.width *scaleX;
				h=tRec.height *scaleY;
				left=tRec.x;
				top=tRec.y;
				if (!tx){
					tx=_cacheCanvas.ctx=Pool.getItem("RenderContext")||new RenderContext(w,h,HTMLCanvas.create("AUTO"));
					tx.ctx.sprite=sprite;
				}
				canvas=tx.canvas;
				if (_cacheCanvas.type==='bitmap')canvas.context.asBitmap=true;
				canvas.clear();
				(canvas.width !=w || canvas.height !=h)&& canvas.size(w,h);
				var t;
				if (scaleX!=1||scaleY!=1){
					var ctx=(tx).ctx;
					ctx.save();
					ctx.scale(scaleX,scaleY);
					if (!Render.isConchWebGL&&Render.isConchApp){
						t=sprite._$P.cf;
						t&&ctx.setFilterMatrix&&ctx.setFilterMatrix(t._mat,t._alpha);
					}
					_next._fun.call(_next,sprite,tx,-left,-top);
					ctx.restore();
					if(!Render.isConchApp||Render.isConchWebGL)sprite._applyFilters();
					}else {
					ctx=(tx).ctx;
					if (!Render.isConchWebGL&&Render.isConchApp){
						t=sprite._$P.cf;
						t&&ctx.setFilterMatrix&&ctx.setFilterMatrix(t._mat,t._alpha);
					}
					_next._fun.call(_next,sprite,tx,-left,-top);
					if(!Render.isConchApp||Render.isConchWebGL)sprite._applyFilters();
				}
				if (sprite._$P.staticCache)_cacheCanvas.reCache=false;
				Stat.canvasReCache++;
				}else {
				tRec=_cacheCanvas._cacheRec;
				left=tRec.x;
				top=tRec.y;
				canvas=tx.canvas;
			}
			context.drawCanvas(canvas,x+left,y+top,tRec.width,tRec.height);
		}

		RenderSprite.__init__=function(){
			var i=0,len=0;
			var initRender;
			initRender=RunDriver.createRenderSprite(0x11111,null);
			len=RenderSprite.renders.length=0x800 *2;
			for (i=0;i < len;i++)
			RenderSprite.renders[i]=initRender;
			RenderSprite.renders[0]=RunDriver.createRenderSprite(0,null);
			function _initSame (value,o){
				var n=0;
				for (var i=0;i < value.length;i++){
					n |=value[i];
					RenderSprite.renders[n]=o;
				}
			}
			_initSame([0x01,0x100,0x04,0x02],new RenderSprite(0x01,null));
			RenderSprite.renders[0x01 | 0x100]=RunDriver.createRenderSprite(0x01 | 0x100,null);
			RenderSprite.renders[0x01 | 0x04 | 0x100]=new RenderSprite(0x01 | 0x04 | 0x100,null);
		}

		RenderSprite._initRenderFun=function(sprite,context,x,y){
			var type=sprite._renderType;
			var r=RenderSprite.renders[type]=RenderSprite._getTypeRender(type);
			r._fun(sprite,context,x,y);
		}

		RenderSprite._getTypeRender=function(type){
			var rst=null;
			var tType=0x800;
			while (tType > 1){
				if (tType & type)
					rst=RunDriver.createRenderSprite(tType,rst);
				tType=tType >> 1;
			}
			return rst;
		}

		RenderSprite.IMAGE=0x01;
		RenderSprite.ALPHA=0x02;
		RenderSprite.TRANSFORM=0x04;
		RenderSprite.CANVAS=0x08;
		RenderSprite.FILTERS=0x10;
		RenderSprite.BLEND=0x20;
		RenderSprite.CLIP=0x40;
		RenderSprite.STYLE=0x80;
		RenderSprite.GRAPHICS=0x100;
		RenderSprite.CUSTOM=0x200;
		RenderSprite.CHILDS=0x800;
		RenderSprite.INIT=0x11111;
		RenderSprite.renders=[];
		RenderSprite.NORENDER=new RenderSprite(0,null);
		return RenderSprite;
	})()


	/**
	*@private
	*Context扩展类
	*/
	//class laya.resource.Context
	var Context=(function(){
		function Context(){
			//this._canvas=null;
			this._repaint=false;
		}

		__class(Context,'laya.resource.Context');
		var __proto=Context.prototype;
		__proto.setIsMainContext=function(){}
		/***@private */
		__proto.drawCanvas=function(canvas,x,y,width,height){
			Stat.drawCall++;
			this.drawImage(canvas.source,x,y,width,height);
		}

		/***@private */
		__proto.fillRect=function(x,y,width,height,style){
			Stat.drawCall++;
			style && (this.fillStyle=style);
			this.__fillRect(x,y,width,height);
		}

		/***@private */
		__proto.fillText=function(text,x,y,font,color,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.fillStyle=color;
				this.textAlign=textAlign;
				this.textBaseline="top";
			}
			this.__fillText(text,x,y);
		}

		/***@private */
		__proto.fillBorderText=function(text,x,y,font,fillColor,borderColor,lineWidth,textAlign){
			Stat.drawCall++;
			this.font=font;
			this.fillStyle=fillColor;
			this.textBaseline="top";
			this.strokeStyle=borderColor;
			this.lineWidth=lineWidth;
			this.textAlign=textAlign;
			this.__strokeText(text,x,y);
			this.__fillText(text,x,y);
		}

		/***@private */
		__proto.strokeText=function(text,x,y,font,color,lineWidth,textAlign){
			Stat.drawCall++;
			if (arguments.length > 3 && font !=null){
				this.font=font;
				this.strokeStyle=color;
				this.lineWidth=lineWidth;
				this.textAlign=textAlign;
				this.textBaseline="top";
			}
			this.__strokeText(text,x,y);
		}

		/***@private */
		__proto.transformByMatrix=function(value){
			this.transform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.setTransformByMatrix=function(value){
			this.setTransform(value.a,value.b,value.c,value.d,value.tx,value.ty);
		}

		/***@private */
		__proto.clipRect=function(x,y,width,height){
			Stat.drawCall++;
			this.beginPath();
			this.rect(x,y,width,height);
			this.clip();
		}

		/***@private */
		__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x+tx,y+ty,width,height);
		}

		/***@private */
		__proto.drawTextureWithTransform=function(tex,x,y,width,height,m,tx,ty){
			Stat.drawCall++;
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			this.save();
			this.transform(m.a,m.b,m.c,m.d,m.tx+tx,m.ty+ty);
			this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,x ,y,width,height);
			this.restore();
		}

		/***@private */
		__proto.drawTexture2=function(x,y,pivotX,pivotY,m,alpha,blendMode,args2){
			'use strict';
			var tex=args2[0];
			if (!(tex.loaded && tex.bitmap && tex.source)){
				return;
			}
			Stat.drawCall++;
			var alphaChanged=alpha!==1;
			if (alphaChanged){
				var temp=this.globalAlpha;
				this.globalAlpha *=alpha;
			};
			var uv=tex.uv,w=tex.bitmap.width,h=tex.bitmap.height;
			if (m){
				this.save();
				this.transform(m.a,m.b,m.c,m.d,m.tx+x,m.ty+y);
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX ,args2[2]-pivotY,args2[3],args2[4]);
				this.restore();
				}else {
				this.drawImage(tex.source,uv[0] *w,uv[1] *h,(uv[2]-uv[0])*w,(uv[5]-uv[3])*h,args2[1]-pivotX+x ,args2[2]-pivotY+y,args2[3],args2[4]);
			}
			if (alphaChanged)this.globalAlpha=temp;
		}

		/***@private */
		__proto.flush=function(){
			return 0;
		}

		/***@private */
		__proto.fillWords=function(words,x,y,font,color){
			font && (this.font=font);
			color && (this.fillStyle=color);
			var _this=this;
			this.textBaseline="top";
			this.textAlign='left';
			for (var i=0,n=words.length;i < n;i++){
				var a=words[i];
				this.__fillText(a.char,a.x+x,a.y+y);
			}
		}

		/***@private */
		__proto.destroy=function(){
			this.canvas.width=this.canvas.height=0;
		}

		/***@private */
		__proto.clear=function(){
			this.clearRect(0,0,this._canvas.width,this._canvas.height);
			this._repaint=false;
		}

		Context.__init__=function(){
			var from=laya.resource.Context.prototype;
			var to=CanvasRenderingContext2D.prototype;
			to.__fillText=to.fillText;
			to.__fillRect=to.fillRect;
			to.__strokeText=to.strokeText;
			var funs=['fillWords','setIsMainContext','fillRect','strokeText','fillText','transformByMatrix','setTransformByMatrix','clipRect','drawTexture','drawTexture2','drawTextureWithTransform','flush','clear','destroy','drawCanvas','fillBorderText'];
			funs.forEach(function(i){
				to[i]=from[i];
			});
		}

		Context._default=new Context();
		return Context;
	})()


	/**
	*<code>ResourceManager</code> 是资源管理类。它用于资源的载入、获取、销毁。
	*/
	//class laya.resource.ResourceManager
	var ResourceManager=(function(){
		function ResourceManager(){
			this._id=0;
			this._name=null;
			this._resources=null;
			this._memorySize=0;
			this._garbageCollectionRate=NaN;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=0;
			this._id=++ResourceManager._uniqueIDCounter;
			this._name="Content Manager";
			ResourceManager._isResourceManagersSorted=false;
			this._memorySize=0;
			this._isOverflow=false;
			this.autoRelease=false;
			this.autoReleaseMaxSize=1024 *1024 *512;
			this._garbageCollectionRate=0.2;
			ResourceManager._resourceManagers.push(this);
			this._resources=[];
		}

		__class(ResourceManager,'laya.resource.ResourceManager');
		var __proto=ResourceManager.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		/**
		*获取指定索引的资源 Resource 对象。
		*@param 索引。
		*@return 资源 Resource 对象。
		*/
		__proto.getResourceByIndex=function(index){
			return this._resources[index];
		}

		/**
		*获取此管理器所管理的资源个数。
		*@return 资源个数。
		*/
		__proto.getResourcesLength=function(){
			return this._resources.length;
		}

		/**
		*添加指定资源。
		*@param resource 需要添加的资源 Resource 对象。
		*@return 是否添加成功。
		*/
		__proto.addResource=function(resource){
			if (resource.resourceManager)
				resource.resourceManager.removeResource(resource);
			var index=this._resources.indexOf(resource);
			if (index===-1){
				resource._resourceManager=this;
				this._resources.push(resource);
				this.addSize(resource.memorySize);
				return true;
			}
			return false;
		}

		/**
		*移除指定资源。
		*@param resource 需要移除的资源 Resource 对象
		*@return 是否移除成功。
		*/
		__proto.removeResource=function(resource){
			var index=this._resources.indexOf(resource);
			if (index!==-1){
				this._resources.splice(index,1);
				resource._resourceManager=null;
				this._memorySize-=resource.memorySize;
				return true;
			}
			return false;
		}

		/**
		*卸载此资源管理器载入的资源。
		*/
		__proto.unload=function(){
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*设置唯一名字。
		*@param newName 名字，如果名字重复则自动加上“-copy”。
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				if (ResourceManager._resourceManagers[i]._name!==newName || ResourceManager._resourceManagers[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					ResourceManager._isResourceManagersSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**释放资源。*/
		__proto.dispose=function(){
			if (this===ResourceManager._systemResourceManager)
				throw new Error("systemResourceManager不能被释放！");
			ResourceManager._resourceManagers.splice(ResourceManager._resourceManagers.indexOf(this),1);
			ResourceManager._isResourceManagersSorted=false;
			var tempResources=this._resources.slice(0,this._resources.length);
			for (var i=0;i < tempResources.length;i++){
				var resource=tempResources[i];
				resource.resourceManager.removeResource(resource);
				resource.dispose();
			}
			tempResources.length=0;
		}

		/**
		*增加内存。
		*@param add 需要增加的内存大小。
		*/
		__proto.addSize=function(add){
			if (add){
				if (this.autoRelease && add > 0)
					((this._memorySize+add)> this.autoReleaseMaxSize)&& (this.garbageCollection((1-this._garbageCollectionRate)*this.autoReleaseMaxSize));
				this._memorySize+=add;
			}
		}

		/**
		*垃圾回收。
		*@param reserveSize 保留尺寸。
		*/
		__proto.garbageCollection=function(reserveSize){
			var all=this._resources;
			all=all.slice();
			all.sort(function(a,b){
				if (!a || !b)
					throw new Error("a或b不能为空！");
				if (a.released && b.released)
					return 0;
				else if (a.released)
				return 1;
				else if (b.released)
				return-1;
				return a.lastUseFrameCount-b.lastUseFrameCount;
			});
			var currentFrameCount=Stat.loopCount;
			for (var i=0,n=all.length;i < n;i++){
				var resou=all[i];
				if (currentFrameCount-resou.lastUseFrameCount > 1){
					resou.releaseResource();
					}else {
					if (this._memorySize >=reserveSize)
						this._isOverflow=true;
					return;
				}
				if (this._memorySize < reserveSize){
					this._isOverflow=false;
					return;
				}
			}
		}

		/**
		*唯一标识 ID 。
		*/
		__getset(0,__proto,'id',function(){
			return this._id;
		});

		/**
		*名字。
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this._name!==value){
				this._name=value;
				ResourceManager._isResourceManagersSorted=false;
			}
		});

		/**
		*此管理器所管理资源的累计内存，以字节为单位。
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
		});

		/**
		*系统资源管理器。
		*/
		__getset(1,ResourceManager,'systemResourceManager',function(){
			(ResourceManager._systemResourceManager===null)&& (ResourceManager._systemResourceManager=new ResourceManager(),ResourceManager._systemResourceManager._name="System Resource Manager");
			return ResourceManager._systemResourceManager;
		});

		/**
		*排序后的资源管理器列表。
		*/
		__getset(1,ResourceManager,'sortedResourceManagersByName',function(){
			if (!ResourceManager._isResourceManagersSorted){
				ResourceManager._isResourceManagersSorted=true;
				ResourceManager._resourceManagers.sort(ResourceManager.compareResourceManagersByName);
			}
			return ResourceManager._resourceManagers;
		});

		ResourceManager.__init__=function(){
			ResourceManager.currentResourceManager=ResourceManager.systemResourceManager;
		}

		ResourceManager.getLoadedResourceManagerByIndex=function(index){
			return ResourceManager._resourceManagers[index];
		}

		ResourceManager.getLoadedResourceManagersCount=function(){
			return ResourceManager._resourceManagers.length;
		}

		ResourceManager.recreateContentManagers=function(force){
			(force===void 0)&& (force=false);
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					ResourceManager.currentResourceManager._resources[j].releaseResource(force);
					ResourceManager.currentResourceManager._resources[j].activeResource(force);
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.releaseContentManagers=function(force){
			(force===void 0)&& (force=false);
			var temp=ResourceManager.currentResourceManager;
			for (var i=0;i < ResourceManager._resourceManagers.length;i++){
				ResourceManager.currentResourceManager=ResourceManager._resourceManagers[i];
				for (var j=0;j < ResourceManager.currentResourceManager._resources.length;j++){
					var resource=ResourceManager.currentResourceManager._resources[j];
					(!resource.released)&& (resource.releaseResource(force));
				}
			}
			ResourceManager.currentResourceManager=temp;
		}

		ResourceManager.compareResourceManagersByName=function(left,right){
			if (left==right)
				return 0;
			var x=left._name;
			var y=right._name;
			if (x==null){
				if (y==null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right._name;
						return x.localeCompare(y);
					}
				}
			}
		}

		ResourceManager._uniqueIDCounter=0;
		ResourceManager._systemResourceManager=null
		ResourceManager._isResourceManagersSorted=false;
		ResourceManager._resourceManagers=[];
		ResourceManager.currentResourceManager=null
		return ResourceManager;
	})()


	/**
	*@private
	*/
	//class laya.system.System
	var System=(function(){
		function System(){};
		__class(System,'laya.system.System');
		System.changeDefinition=function(name,classObj){
			Laya[name]=classObj;
			var str=name+"=classObj";
			eval(str);
		}

		System.__init__=function(){
			if (Render.isConchApp){
				conch.disableConchResManager();
				conch.disableConchAutoRestoreLostedDevice();
			}
		}

		return System;
	})()


	SoundManager;
	/**
	*<code>Browser</code> 是浏览器代理类。封装浏览器及原生 js 提供的一些功能。
	*/
	//class laya.utils.Browser
	var Browser=(function(){
		function Browser(){};
		__class(Browser,'laya.utils.Browser');
		/**设备像素比。*/
		__getset(1,Browser,'pixelRatio',function(){
			Browser.__init__();
			return RunDriver.getPixelRatio();
		});

		/**浏览器物理高度。*/
		__getset(1,Browser,'height',function(){
			Browser.__init__();
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientWidth :Browser.clientHeight)*Browser.pixelRatio;
		});

		/**浏览器可视宽度。*/
		__getset(1,Browser,'clientWidth',function(){
			Browser.__init__();
			return Browser.window.innerWidth || Browser.document.body.clientWidth;
		});

		/**浏览器原生 window 对象的引用。*/
		__getset(1,Browser,'window',function(){
			Browser.__init__();
			return Browser._window;
		});

		/**浏览器可视高度。*/
		__getset(1,Browser,'clientHeight',function(){
			Browser.__init__();
			return Browser.window.innerHeight || Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight;
		});

		/**浏览器物理宽度，。*/
		__getset(1,Browser,'width',function(){
			Browser.__init__();
			return ((Laya.stage && Laya.stage.canvasRotation)? Browser.clientHeight :Browser.clientWidth)*Browser.pixelRatio;
		});

		/**画布容器，用来盛放画布的容器。方便对画布进行控制*/
		__getset(1,Browser,'container',function(){
			Browser.__init__();
			if (!Browser._container){
				Browser._container=Browser.createElement("div");
				Browser._container.id="layaContainer";
				Browser._container.style.cssText="width:100%;height:100%";
				Browser.document.body.appendChild(Browser._container);
			}
			return Browser._container;
			},function(value){
			Browser._container=value;
		});

		/**浏览器原生 document 对象的引用。*/
		__getset(1,Browser,'document',function(){
			Browser.__init__();
			return Browser._document;
		});

		Browser.__init__=function(){
			if (Browser._window)return;
			Browser._window=RunDriver.getWindow();
			Browser._document=Browser.window.document;
			Browser.document.__createElement=Browser.document.createElement;
			window.requestAnimationFrame=(function(){return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||function (c){return window.setTimeout(c,1000 / 60);};})();
			var $BS=window.document.body.style;$BS.margin=0;$BS.overflow='hidden';;
			var metas=window.document.getElementsByTagName('meta');;
			var i=0,flag=false,content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no';;
			while(i<metas.length){var meta=metas[i];if(meta.name=='viewport'){meta.content=content;flag=true;break;}i++;};
			if(!flag){meta=document.createElement('meta');meta.name='viewport',meta.content=content;document.getElementsByTagName('head')[0].appendChild(meta);};
			Browser.userAgent=/*[SAFE]*/ Browser.window.navigator.userAgent;
			Browser.u=/*[SAFE]*/ Browser.userAgent;
			Browser.onIOS=/*[SAFE]*/ !!Browser.u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
			Browser.onMobile=/*[SAFE]*/ Browser.u.indexOf("Mobile")>-1;
			Browser.onIPhone=/*[SAFE]*/ Browser.u.indexOf("iPhone")>-1;
			Browser.onIPad=/*[SAFE]*/ Browser.u.indexOf("iPad")>-1;
			Browser.onAndriod=/*[SAFE]*/ Browser.u.indexOf('Android')>-1 || Browser.u.indexOf('Adr')>-1;
			Browser.onWP=/*[SAFE]*/ Browser.u.indexOf("Windows Phone")>-1;
			Browser.onQQBrowser=/*[SAFE]*/ Browser.u.indexOf("QQBrowser")>-1;
			Browser.onMQQBrowser=/*[SAFE]*/ Browser.u.indexOf("MQQBrowser")>-1;
			Browser.onWeiXin=/*[SAFE]*/ Browser.u.indexOf('MicroMessenger')>-1;
			Browser.onPC=/*[SAFE]*/ !Browser.onMobile;
			Browser.onSafari=/*[SAFE]*/ ! !Browser.u.match(/Version\/\d\.\d\x20Mobile\/\S+\x20Safari/);
			Browser.httpProtocol=/*[SAFE]*/ Browser.window.location.protocol=="http:";
			Browser.webAudioEnabled=/*[SAFE]*/ Browser.window["AudioContext"] || Browser.window["webkitAudioContext"] || Browser.window["mozAudioContext"] ? true :false;
			Browser.soundType=/*[SAFE]*/ Browser.webAudioEnabled ? "WEBAUDIOSOUND" :"AUDIOSOUND";
			Sound=Browser.webAudioEnabled?WebAudioSound:AudioSound;;
			if (Browser.webAudioEnabled)WebAudioSound.initWebAudio();;
			Browser.enableTouch=(('ontouchstart' in window)|| window.DocumentTouch && document instanceof DocumentTouch);
			window.focus();
			SoundManager._soundClass=Sound;;
			Render._mainCanvas=Render._mainCanvas||HTMLCanvas.create('2D');
			if (Browser.canvas)return;
			Browser.canvas=HTMLCanvas.create('2D');
			Browser.context=Browser.canvas.getContext('2d');
		}

		Browser.createElement=function(type){
			Browser.__init__();
			return Browser.document.__createElement(type);
		}

		Browser.getElementById=function(type){
			Browser.__init__();
			return Browser.document.getElementById(type);
		}

		Browser.removeElement=function(ele){
			if (ele && ele.parentNode)ele.parentNode.removeChild(ele);
		}

		Browser.now=function(){
			return RunDriver.now();
		}

		Browser._window=null
		Browser._document=null
		Browser._container=null
		Browser.userAgent=null
		Browser.u=null
		Browser.onIOS=false;
		Browser.onMobile=false;
		Browser.onIPhone=false;
		Browser.onIPad=false;
		Browser.onAndriod=false;
		Browser.onWP=false;
		Browser.onQQBrowser=false;
		Browser.onMQQBrowser=false;
		Browser.onSafari=false;
		Browser.onWeiXin=false;
		Browser.onPC=false;
		Browser.httpProtocol=false;
		Browser.webAudioEnabled=false;
		Browser.soundType=null
		Browser.enableTouch=false;
		Browser.canvas=null
		Browser.context=null
		Browser.__init$=function(){
			AudioSound;
			WebAudioSound;
		}

		return Browser;
	})()


	/**
	*
	*<code>Byte</code> 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
	*/
	//class laya.utils.Byte
	var Byte=(function(){
		function Byte(data){
			this._xd_=true;
			this._allocated_=8;
			//this._d_=null;
			//this._u8d_=null;
			this._pos_=0;
			this._length=0;
			if (data){
				this._u8d_=new Uint8Array(data);
				this._d_=new DataView(this._u8d_.buffer);
				this._length=this._d_.byteLength;
				}else {
				this.___resizeBuffer(this._allocated_);
			}
		}

		__class(Byte,'laya.utils.Byte');
		var __proto=Byte.prototype;
		/**@private */
		__proto.___resizeBuffer=function(len){
			try {
				var newByteView=new Uint8Array(len);
				if (this._u8d_ !=null){
					if (this._u8d_.length <=len)newByteView.set(this._u8d_);
					else newByteView.set(this._u8d_.subarray(0,len));
				}
				this._u8d_=newByteView;
				this._d_=new DataView(newByteView.buffer);
				}catch (err){
				throw "___resizeBuffer err:"+len;
			}
		}

		/**
		*读取字符型值。
		*@return
		*/
		__proto.getString=function(){
			return this.rUTF(this.getUint16());
		}

		/**
		*从指定的位置读取指定长度的数据用于创建一个 Float32Array 对象并返回此对象。
		*@param start 开始位置。
		*@param len 需要读取的字节长度。
		*@return 读出的 Float32Array 对象。
		*/
		__proto.getFloat32Array=function(start,len){
			var v=new Float32Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*从指定的位置读取指定长度的数据用于创建一个 Uint8Array 对象并返回此对象。
		*@param start 开始位置。
		*@param len 需要读取的字节长度。
		*@return 读出的 Uint8Array 对象。
		*/
		__proto.getUint8Array=function(start,len){
			var v=new Uint8Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*从指定的位置读取指定长度的数据用于创建一个 Int16Array 对象并返回此对象。
		*@param start 开始位置。
		*@param len 需要读取的字节长度。
		*@return 读出的 Uint8Array 对象。
		*/
		__proto.getInt16Array=function(start,len){
			var v=new Int16Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*在指定字节偏移量位置处读取 Float32 值。
		*@return Float32 值。
		*/
		__proto.getFloat32=function(){
			var v=this._d_.getFloat32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		/**
		*在当前字节偏移量位置处写入 Float32 值。
		*@param value 需要写入的 Float32 值。
		*/
		__proto.writeFloat32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setFloat32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*在当前字节偏移量位置处读取 Int32 值。
		*@return Int32 值。
		*/
		__proto.getInt32=function(){
			var float=this._d_.getInt32(this._pos_,this._xd_);
			this._pos_+=4;
			return float;
		}

		/**
		*在当前字节偏移量位置处读取 Uint32 值。
		*@return Uint32 值。
		*/
		__proto.getUint32=function(){
			var v=this._d_.getUint32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		/**
		*在当前字节偏移量位置处写入 Int32 值。
		*@param value 需要写入的 Int32 值。
		*/
		__proto.writeInt32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setInt32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*在当前字节偏移量位置处写入 Uint32 值。
		*@param value 需要写入的 Uint32 值。
		*/
		__proto.writeUint32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setUint32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*在当前字节偏移量位置处读取 Int16 值。
		*@return Int16 值。
		*/
		__proto.getInt16=function(){
			var us=this._d_.getInt16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		/**
		*在当前字节偏移量位置处读取 Uint16 值。
		*@return Uint16 值。
		*/
		__proto.getUint16=function(){
			var us=this._d_.getUint16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		/**
		*在当前字节偏移量位置处写入 Uint16 值。
		*@param value 需要写入的Uint16 值。
		*/
		__proto.writeUint16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setUint16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		/**
		*在当前字节偏移量位置处写入 Int16 值。
		*@param value 需要写入的 Int16 值。
		*/
		__proto.writeInt16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setInt16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		/**
		*在当前字节偏移量位置处读取 Uint8 值。
		*@return Uint8 值。
		*/
		__proto.getUint8=function(){
			return this._d_.getUint8(this._pos_++);
		}

		/**
		*在当前字节偏移量位置处写入 Uint8 值。
		*@param value 需要写入的 Uint8 值。
		*/
		__proto.writeUint8=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setUint8(this._pos_,value,this._xd_);
			this._pos_++;
		}

		/**
		*@private
		*在指定位置处读取 Uint8 值。
		*@param pos 字节读取位置。
		*@return Uint8 值。
		*/
		__proto._getUInt8=function(pos){
			return this._d_.getUint8(pos);
		}

		/**
		*@private
		*在指定位置处读取 Uint16 值。
		*@param pos 字节读取位置。
		*@return Uint16 值。
		*/
		__proto._getUint16=function(pos){
			return this._d_.getUint16(pos,this._xd_);
		}

		/**
		*@private
		*使用 getFloat32()读取6个值，用于创建并返回一个 Matrix 对象。
		*@return Matrix 对象。
		*/
		__proto._getMatrix=function(){
			var rst=new Matrix(this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32());
			return rst;
		}

		/**
		*@private
		*读取指定长度的 UTF 型字符串。
		*@param len 需要读取的长度。
		*@return 读出的字符串。
		*/
		__proto.rUTF=function(len){
			var v="",max=this._pos_+len,c=0,c2=0,c3=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (this._pos_ < max){
				c=u[this._pos_++];
				if (c < 0x80){
					if (c !=0){
						v+=f(c);
					}
					}else if (c < 0xE0){
					v+=f(((c & 0x3F)<< 6)| (u[this._pos_++] & 0x7F));
					}else if (c < 0xF0){
					c2=u[this._pos_++];
					v+=f(((c & 0x1F)<< 12)| ((c2 & 0x7F)<< 6)| (u[this._pos_++] & 0x7F));
					}else {
					c2=u[this._pos_++];
					c3=u[this._pos_++];
					v+=f(((c & 0x0F)<< 18)| ((c2 & 0x7F)<< 12)| ((c3 << 6)& 0x7F)| (u[this._pos_++] & 0x7F));
				}
				i++;
			}
			return v;
		}

		/**
		*字符串读取。
		*@param len
		*@return
		*/
		__proto.getCustomString=function(len){
			var v="",ulen=0,c=0,c2=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (len > 0){
				c=u[this._pos_];
				if (c < 0x80){
					v+=f(c);
					this._pos_++;
					len--;
					}else {
					ulen=c-0x80;
					this._pos_++;
					len-=ulen;
					while (ulen > 0){
						c=u[this._pos_++];
						c2=u[this._pos_++];
						v+=f((c2 << 8)| c);
						ulen--;
					}
				}
			}
			return v;
		}

		/**
		*清除数据。
		*/
		__proto.clear=function(){
			this._pos_=0;
			this.length=0;
		}

		/**
		*@private
		*获取此对象的 ArrayBuffer 引用。
		*@return
		*/
		__proto.__getBuffer=function(){
			return this._d_.buffer;
		}

		/**
		*写入字符串，该方法写的字符串要使用 readUTFBytes 方法读取。
		*@param value 要写入的字符串。
		*/
		__proto.writeUTFBytes=function(value){
			value=value+"";
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					this.writeByte(c);
					}else if (c <=0x7FF){
					this.writeByte(0xC0 | (c >> 6));
					this.writeByte(0x80 | (c & 63));
					}else if (c <=0xFFFF){
					this.writeByte(0xE0 | (c >> 12));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
					}else {
					this.writeByte(0xF0 | (c >> 18));
					this.writeByte(0x80 | ((c >> 12)& 63));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
				}
			}
		}

		/**
		*将 UTF-8 字符串写入字节流。
		*@param value 要写入的字符串值。
		*/
		__proto.writeUTFString=function(value){
			var tPos=0;
			tPos=this.pos;
			this.writeUint16(1);
			this.writeUTFBytes(value);
			var dPos=0;
			dPos=this.pos-tPos-2;
			this._d_.setUint16(tPos,dPos,this._xd_);
		}

		/**
		*读取 UTF-8 字符串。
		*@return 读出的字符串。
		*/
		__proto.readUTFString=function(){
			var tPos=0;
			tPos=this.pos;
			var len=0;
			len=this.getUint16();
			return this.readUTFBytes(len);
		}

		/**
		*读字符串，必须是 writeUTFBytes 方法写入的字符串。
		*@param len 要读的buffer长度,默认将读取缓冲区全部数据。
		*@return 读取的字符串。
		*/
		__proto.readUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			if(len==0)return "";
			len=len > 0 ? len :this.bytesAvailable;
			return this.rUTF(len);
		}

		/**
		*在字节流中写入一个字节。
		*@param value
		*/
		__proto.writeByte=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setInt8(this._pos_,value);
			this._pos_+=1;
		}

		/**
		*在字节流中读一个字节。
		*/
		__proto.readByte=function(){
			return this._d_.getInt8(this._pos_++);
		}

		/**
		*指定该字节流的长度。
		*@param lengthToEnsure 指定的长度。
		*/
		__proto.ensureWrite=function(lengthToEnsure){
			if (this._length < lengthToEnsure)this._length=lengthToEnsure;
			if (this._allocated_ < lengthToEnsure)this.length=lengthToEnsure;
		}

		/**
		*写入指定的 Arraybuffer 对象。
		*@param arraybuffer 需要写入的 Arraybuffer 对象。
		*@param offset 偏移量（以字节为单位）
		*@param length 长度（以字节为单位）
		*/
		__proto.writeArrayBuffer=function(arraybuffer,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0)throw "writeArrayBuffer error - Out of bounds";
			if (length==0)length=arraybuffer.byteLength-offset;
			this.ensureWrite(this._pos_+length);
			var uint8array=new Uint8Array(arraybuffer);
			this._u8d_.set(uint8array.subarray(offset,offset+length),this._pos_);
			this._pos_+=length;
		}

		/**
		*获取此对象的 ArrayBuffer数据,数据只包含有效数据部分 。
		*/
		__getset(0,__proto,'buffer',function(){
			var rstBuffer=this._d_.buffer;
			if (rstBuffer.byteLength==this.length)return rstBuffer;
			return rstBuffer.slice(0,this.length);
		});

		/**
		*字节顺序。
		*/
		__getset(0,__proto,'endian',function(){
			return this._xd_ ? "littleEndian" :"bigEndian";
			},function(endianStr){
			this._xd_=(endianStr=="littleEndian");
		});

		/**
		*字节长度。
		*/
		__getset(0,__proto,'length',function(){
			return this._length;
			},function(value){
			if (this._allocated_ < value)
				this.___resizeBuffer(this._allocated_=Math.floor(Math.max(value,this._allocated_ *2)));
			else if (this._allocated_ > value)
			this.___resizeBuffer(this._allocated_=value);
			this._length=value;
		});

		/**
		*当前读取到的位置。
		*/
		__getset(0,__proto,'pos',function(){
			return this._pos_;
			},function(value){
			this._pos_=value;
			this._d_.byteOffset=value;
		});

		/**
		*可从字节流的当前位置到末尾读取的数据的字节数。
		*/
		__getset(0,__proto,'bytesAvailable',function(){
			return this.length-this._pos_;
		});

		Byte.getSystemEndian=function(){
			if (!Byte._sysEndian){
				var buffer=new ArrayBuffer(2);
				new DataView(buffer).setInt16(0,256,true);
				Byte._sysEndian=(new Int16Array(buffer))[0]===256 ? "littleEndian" :"bigEndian";
			}
			return Byte._sysEndian;
		}

		Byte.BIG_ENDIAN="bigEndian";
		Byte.LITTLE_ENDIAN="littleEndian";
		Byte._sysEndian=null;
		return Byte;
	})()


	/**
	*对象缓存统一管理类
	*/
	//class laya.utils.CacheManger
	var CacheManger=(function(){
		function CacheManger(){}
		__class(CacheManger,'laya.utils.CacheManger');
		CacheManger.regCacheByFunction=function(disposeFunction,getCacheListFunction){
			CacheManger.unRegCacheByFunction(disposeFunction,getCacheListFunction);
			var cache;
			cache={
				tryDispose:disposeFunction,
				getCacheList:getCacheListFunction
			};
			CacheManger._cacheList.push(cache);
		}

		CacheManger.unRegCacheByFunction=function(disposeFunction,getCacheListFunction){
			var i=0,len=0;
			len=CacheManger._cacheList.length;
			for (i=0;i < len;i++){
				if (CacheManger._cacheList[i].tryDispose==disposeFunction && CacheManger._cacheList[i].getCacheList==getCacheListFunction){
					CacheManger._cacheList.splice(i,1);
					return;
				}
			}
		}

		CacheManger.forceDispose=function(){
			var i=0,len=CacheManger._cacheList.length;
			for(i=0;i<len;i++){
				CacheManger._cacheList[i].tryDispose(true);
			}
		}

		CacheManger.beginCheck=function(waitTime){
			(waitTime===void 0)&& (waitTime=15000);
			Laya.timer.loop(waitTime,null,CacheManger._checkLoop);
		}

		CacheManger.stopCheck=function(){
			Laya.timer.clear(null,CacheManger._checkLoop);
		}

		CacheManger._checkLoop=function(){
			var cacheList=CacheManger._cacheList;
			if (cacheList.length < 1)return;
			var tTime=Browser.now();
			var count=0;
			var len=0;
			len=count=cacheList.length;
			while (count > 0){
				CacheManger._index++;
				CacheManger._index=CacheManger._index % len;
				cacheList[CacheManger._index].tryDispose(false);
				if (Browser.now()-tTime > CacheManger.loopTimeLimit)break ;
				count--;
			}
		}

		CacheManger.loopTimeLimit=2;
		CacheManger._cacheList=[];
		CacheManger._index=0;
		return CacheManger;
	})()


	/**
	*<code>Color</code> 是一个颜色值处理类。
	*/
	//class laya.utils.Color
	var Color=(function(){
		function Color(str){
			this._color=[];
			//this.strColor=null;
			//this.numColor=0;
			//this._drawStyle=null;
			if ((typeof str=='string')){
				this.strColor=str;
				if (str===null)str="#000000";
				str.charAt(0)=='#' && (str=str.substr(1));
				var color=this.numColor=parseInt(str,16);
				var flag=(str.length==8);
				if (flag){
					this._color=[parseInt(str.substr(0,2),16)/ 255,((0x00FF0000 & color)>> 16)/ 255,((0x0000FF00 & color)>> 8)/ 255,(0x000000FF & color)/ 255];
					return;
				}
				}else {
				color=this.numColor=str;
				this.strColor=Utils.toHexColor(color);
			}
			this._color=[((0xFF0000 & color)>> 16)/ 255,((0xFF00 & color)>> 8)/ 255,(0xFF & color)/ 255,1];
			(this._color).__id=++Color._COLODID;
		}

		__class(Color,'laya.utils.Color');
		Color._initDefault=function(){
			Color._DEFAULT={};
			for (var i in Color._COLOR_MAP)Color._SAVE[i]=Color._DEFAULT[i]=new Color(Color._COLOR_MAP[i]);
			return Color._DEFAULT;
		}

		Color._initSaveMap=function(){
			Color._SAVE_SIZE=0;
			Color._SAVE={};
			for (var i in Color._DEFAULT)Color._SAVE[i]=Color._DEFAULT[i];
		}

		Color.create=function(str){
			var color=Color._SAVE[str+""];
			if (color !=null)return color;
			(Color._SAVE_SIZE < 1000)|| Color._initSaveMap();
			return Color._SAVE[str+""]=new Color(str);
		}

		Color._SAVE={};
		Color._SAVE_SIZE=0;
		Color._COLOR_MAP={"white":'#FFFFFF',"red":'#FF0000',"green":'#00FF00',"blue":'#0000FF',"black":'#000000',"yellow":'#FFFF00','gray':'#AAAAAA'};
		Color._DEFAULT=Color._initDefault();
		Color._COLODID=1;
		return Color;
	})()


	/**
	*<code>Dragging</code> 类是触摸滑动控件。
	*/
	//class laya.utils.Dragging
	var Dragging=(function(){
		function Dragging(){
			//this.target=null;
			this.ratio=0.92;
			this.maxOffset=60;
			//this.area=null;
			//this.hasInertia=false;
			//this.elasticDistance=NaN;
			//this.elasticBackTime=NaN;
			//this.data=null;
			this._dragging=false;
			this._clickOnly=true;
			//this._elasticRateX=NaN;
			//this._elasticRateY=NaN;
			//this._lastX=NaN;
			//this._lastY=NaN;
			//this._offsetX=NaN;
			//this._offsetY=NaN;
			//this._offsets=null;
			//this._disableMouseEvent=false;
			//this._tween=null;
		}

		__class(Dragging,'laya.utils.Dragging');
		var __proto=Dragging.prototype;
		/**
		*开始拖拽。
		*@param target 待拖拽的 <code>Sprite</code> 对象。
		*@param area 滑动范围。
		*@param hasInertia 拖动是否有惯性。
		*@param elasticDistance 橡皮筋最大值。
		*@param elasticBackTime 橡皮筋回弹时间，单位为毫秒。
		*@param data 事件携带数据。
		*@param disableMouseEvent 鼠标事件是否有效。
		*/
		__proto.start=function(target,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent){
			this.clearTimer();
			this.target=target;
			this.area=area;
			this.hasInertia=hasInertia;
			this.elasticDistance=elasticDistance;
			this.elasticBackTime=elasticBackTime;
			this.data=data;
			this._disableMouseEvent=disableMouseEvent;
			this._clickOnly=true;
			this._dragging=true;
			this._elasticRateX=this._elasticRateY=1;
			this._lastX=Laya.stage.mouseX;
			this._lastY=Laya.stage.mouseY;
			Laya.stage.on("mouseup",this,this.onStageMouseUp);
			Laya.stage.on("mouseout",this,this.onStageMouseUp);
			Laya.timer.frameLoop(1,this,this.loop);
		}

		/**
		*清除计时器。
		*/
		__proto.clearTimer=function(){
			Laya.timer.clear(this,this.loop);
			Laya.timer.clear(this,this.tweenMove);
			if (this._tween){
				this._tween.recover();
				this._tween=null;
			}
		}

		/**
		*停止拖拽。
		*/
		__proto.stop=function(){
			if (this._dragging){
				MouseManager.instance.disableMouseEvent=false;
				Laya.stage.off("mouseup",this,this.onStageMouseUp);
				Laya.stage.off("mouseout",this,this.onStageMouseUp);
				this._dragging=false;
				this.target && this.area && this.backToArea();
				this.clear();
			}
		}

		/**
		*拖拽的循环处理函数。
		*/
		__proto.loop=function(){
			var mouseX=Laya.stage.mouseX;
			var mouseY=Laya.stage.mouseY;
			var offsetX=mouseX-this._lastX;
			var offsetY=mouseY-this._lastY;
			if (this._clickOnly){
				if (Math.abs(offsetX *Laya.stage._canvasTransform.getScaleX())> 1 || Math.abs(offsetY *Laya.stage._canvasTransform.getScaleY())> 1){
					this._clickOnly=false;
					this._offsets || (this._offsets=[]);
					this._offsets.length=0;
					this.target.event("dragstart",this.data);
					MouseManager.instance.disableMouseEvent=this._disableMouseEvent;
					this.target._set$P("$_MOUSEDOWN",false);
				}else return;
				}else {
				this._offsets.push(offsetX,offsetY);
			}
			if (offsetX===0 && offsetY===0)return;
			this._lastX=mouseX;
			this._lastY=mouseY;
			this.target.x+=offsetX *this._elasticRateX;
			this.target.y+=offsetY *this._elasticRateY;
			this.area && this.checkArea();
			this.target.event("dragmove",this.data);
		}

		/**
		*拖拽区域检测。
		*/
		__proto.checkArea=function(){
			if (this.elasticDistance <=0){
				this.backToArea();
				}else {
				if (this.target.x < this.area.x){
					var offsetX=this.area.x-this.target.x;
					}else if (this.target.x > this.area.x+this.area.width){
					offsetX=this.target.x-this.area.x-this.area.width;
					}else {
					offsetX=0;
				}
				this._elasticRateX=Math.max(0,1-(offsetX / this.elasticDistance));
				if (this.target.y < this.area.y){
					var offsetY=this.area.y-this.target.y;
					}else if (this.target.y > this.area.y+this.area.height){
					offsetY=this.target.y-this.area.y-this.area.height;
					}else {
					offsetY=0;
				}
				this._elasticRateY=Math.max(0,1-(offsetY / this.elasticDistance));
			}
		}

		/**
		*移动至设定的拖拽区域。
		*/
		__proto.backToArea=function(){
			this.target.x=Math.min(Math.max(this.target.x,this.area.x),this.area.x+this.area.width);
			this.target.y=Math.min(Math.max(this.target.y,this.area.y),this.area.y+this.area.height);
		}

		/**
		*舞台的抬起事件侦听函数。
		*@param e Event 对象。
		*/
		__proto.onStageMouseUp=function(e){
			MouseManager.instance.disableMouseEvent=false;
			Laya.stage.off("mouseup",this,this.onStageMouseUp);
			Laya.stage.off("mouseout",this,this.onStageMouseUp);
			Laya.timer.clear(this,this.loop);
			if (this._clickOnly || !this.target)return;
			if (this.hasInertia){
				if (this._offsets.length < 1){
					this._offsets.push(Laya.stage.mouseX-this._lastX,Laya.stage.mouseY-this._lastY);
				}
				this._offsetX=this._offsetY=0;
				var len=this._offsets.length;
				var n=Math.min(len,6);
				var m=this._offsets.length-n;
				for (var i=len-1;i > m;i--){
					this._offsetY+=this._offsets[i--];
					this._offsetX+=this._offsets[i];
				}
				this._offsetX=this._offsetX / n *2;
				this._offsetY=this._offsetY / n *2;
				if (Math.abs(this._offsetX)> this.maxOffset)this._offsetX=this._offsetX > 0 ? this.maxOffset :-this.maxOffset;
				if (Math.abs(this._offsetY)> this.maxOffset)this._offsetY=this._offsetY > 0 ? this.maxOffset :-this.maxOffset;
				Laya.timer.frameLoop(1,this,this.tweenMove);
				}else if (this.elasticDistance > 0){
				this.checkElastic();
				}else {
				this.clear();
			}
		}

		/**
		*橡皮筋效果检测。
		*/
		__proto.checkElastic=function(){
			var tx=NaN;
			var ty=NaN;
			if (this.target.x < this.area.x)tx=this.area.x;
			else if (this.target.x > this.area.x+this.area.width)tx=this.area.x+this.area.width;
			if (this.target.y < this.area.y)ty=this.area.y;
			else if (this.target.y > this.area.y+this.area.height)ty=this.area.y+this.area.height;
			if (!isNaN(tx)|| !isNaN(ty)){
				var obj={};
				if (!isNaN(tx))obj.x=tx;
				if (!isNaN(ty))obj.y=ty;
				this._tween=Tween.to(this.target,obj,this.elasticBackTime,Ease.sineOut,Handler.create(this,this.clear),0,false,false);
				}else {
				this.clear();
			}
		}

		/**
		*移动。
		*/
		__proto.tweenMove=function(){
			this._offsetX *=this.ratio *this._elasticRateX;
			this._offsetY *=this.ratio *this._elasticRateY;
			this.target.x+=this._offsetX;
			this.target.y+=this._offsetY;
			this.area && this.checkArea();
			this.target.event("dragmove",this.data);
			if ((Math.abs(this._offsetX)< 1 && Math.abs(this._offsetY)< 1)|| this._elasticRateX < 0.5 || this._elasticRateY < 0.5){
				Laya.timer.clear(this,this.tweenMove);
				if (this.elasticDistance > 0)this.checkElastic();
				else this.clear();
			}
		}

		/**
		*结束拖拽。
		*/
		__proto.clear=function(){
			if (this.target){
				this.clearTimer();
				var sp=this.target;
				this.target=null;
				sp.event("dragend",this.data);
			}
		}

		return Dragging;
	})()


	/**
	*<code>Ease</code> 类定义了缓动函数，以便实现 <code>Tween</code> 动画的缓动效果。
	*/
	//class laya.utils.Ease
	var Ease=(function(){
		function Ease(){};
		__class(Ease,'laya.utils.Ease');
		Ease.linearNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearIn=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearInOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.linearOut=function(t,b,c,d){
			return c *t / d+b;
		}

		Ease.bounceIn=function(t,b,c,d){
			return c-Ease.bounceOut(d-t,0,c,d)+b;
		}

		Ease.bounceInOut=function(t,b,c,d){
			if (t < d *0.5)return Ease.bounceIn(t *2,0,c,d)*.5+b;
			else return Ease.bounceOut(t *2-d,0,c,d)*.5+c *.5+b;
		}

		Ease.bounceOut=function(t,b,c,d){
			if ((t /=d)< (1 / 2.75))return c *(7.5625 *t *t)+b;
			else if (t < (2 / 2.75))return c *(7.5625 *(t-=(1.5 / 2.75))*t+.75)+b;
			else if (t < (2.5 / 2.75))return c *(7.5625 *(t-=(2.25 / 2.75))*t+.9375)+b;
			else return c *(7.5625 *(t-=(2.625 / 2.75))*t+.984375)+b;
		}

		Ease.backIn=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *(t /=d)*t *((s+1)*t-s)+b;
		}

		Ease.backInOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			if ((t /=d *0.5)< 1)return c *0.5 *(t *t *(((s *=(1.525))+1)*t-s))+b;
			return c / 2 *((t-=2)*t *(((s *=(1.525))+1)*t+s)+2)+b;
		}

		Ease.backOut=function(t,b,c,d,s){
			(s===void 0)&& (s=1.70158);
			return c *((t=t / d-1)*t *((s+1)*t+s)+1)+b;
		}

		Ease.elasticIn=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return-(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
		}

		Ease.elasticInOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d *0.5)==2)return b+c;
			if (!p)p=d *(.3 *1.5);
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			if (t < 1)return-.5 *(a *Math.pow(2,10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p))+b;
			return a *Math.pow(2,-10 *(t-=1))*Math.sin((t *d-s)*Ease.PI2 / p)*.5+c+b;
		}

		Ease.elasticOut=function(t,b,c,d,a,p){
			(a===void 0)&& (a=0);
			(p===void 0)&& (p=0);
			var s;
			if (t==0)return b;
			if ((t /=d)==1)return b+c;
			if (!p)p=d *.3;
			if (!a || (c > 0 && a < c)|| (c < 0 && a <-c)){
				a=c;
				s=p / 4;
			}else s=p / Ease.PI2 *Math.asin(c / a);
			return (a *Math.pow(2,-10 *t)*Math.sin((t *d-s)*Ease.PI2 / p)+c+b);
		}

		Ease.strongIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.strongInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.strongOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.sineInOut=function(t,b,c,d){
			return-c *0.5 *(Math.cos(Math.PI *t / d)-1)+b;
		}

		Ease.sineIn=function(t,b,c,d){
			return-c *Math.cos(t / d *Ease.HALF_PI)+c+b;
		}

		Ease.sineOut=function(t,b,c,d){
			return c *Math.sin(t / d *Ease.HALF_PI)+b;
		}

		Ease.quintIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t *t+b;
		}

		Ease.quintInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t *t+b;
			return c *0.5 *((t-=2)*t *t *t *t+2)+b;
		}

		Ease.quintOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t *t *t+1)+b;
		}

		Ease.quartIn=function(t,b,c,d){
			return c *(t /=d)*t *t *t+b;
		}

		Ease.quartInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t *t+b;
			return-c *0.5 *((t-=2)*t *t *t-2)+b;
		}

		Ease.quartOut=function(t,b,c,d){
			return-c *((t=t / d-1)*t *t *t-1)+b;
		}

		Ease.cubicIn=function(t,b,c,d){
			return c *(t /=d)*t *t+b;
		}

		Ease.cubicInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t *t+b;
			return c *0.5 *((t-=2)*t *t+2)+b;
		}

		Ease.cubicOut=function(t,b,c,d){
			return c *((t=t / d-1)*t *t+1)+b;
		}

		Ease.quadIn=function(t,b,c,d){
			return c *(t /=d)*t+b;
		}

		Ease.quadInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return c *0.5 *t *t+b;
			return-c *0.5 *((--t)*(t-2)-1)+b;
		}

		Ease.quadOut=function(t,b,c,d){
			return-c *(t /=d)*(t-2)+b;
		}

		Ease.expoIn=function(t,b,c,d){
			return (t==0)? b :c *Math.pow(2,10 *(t / d-1))+b-c *0.001;
		}

		Ease.expoInOut=function(t,b,c,d){
			if (t==0)return b;
			if (t==d)return b+c;
			if ((t /=d *0.5)< 1)return c *0.5 *Math.pow(2,10 *(t-1))+b;
			return c *0.5 *(-Math.pow(2,-10 *--t)+2)+b;
		}

		Ease.expoOut=function(t,b,c,d){
			return (t==d)? b+c :c *(-Math.pow(2,-10 *t / d)+1)+b;
		}

		Ease.circIn=function(t,b,c,d){
			return-c *(Math.sqrt(1-(t /=d)*t)-1)+b;
		}

		Ease.circInOut=function(t,b,c,d){
			if ((t /=d *0.5)< 1)return-c *0.5 *(Math.sqrt(1-t *t)-1)+b;
			return c *0.5 *(Math.sqrt(1-(t-=2)*t)+1)+b;
		}

		Ease.circOut=function(t,b,c,d){
			return c *Math.sqrt(1-(t=t / d-1)*t)+b;
		}

		Ease.HALF_PI=Math.PI *0.5;
		Ease.PI2=Math.PI *2;
		return Ease;
	})()


	/**
	*鼠标点击区域类
	*/
	//class laya.utils.HitArea
	var HitArea=(function(){
		function HitArea(){
			this.hit=null;
			this.unHit=null;
		}

		__class(HitArea,'laya.utils.HitArea');
		var __proto=HitArea.prototype;
		/**
		*是否包含某个点
		*@param x
		*@param y
		*@return
		*
		*/
		__proto.isHit=function(x,y){
			if (!HitArea.isHitGraphic(x,y,this.hit))return false;
			return !HitArea.isHitGraphic(x,y,this.unHit);
		}

		HitArea.isHitGraphic=function(x,y,graphic){
			if (!graphic)return false;
			var cmds;
			cmds=graphic.cmds;
			if (!cmds&&graphic._one){
				cmds=HitArea._tCmds;
				cmds.length=1;
				cmds[0]=graphic._one;
			}
			if (!cmds)return false;
			var i=0,len=0;
			len=cmds.length;
			var cmd;
			for (i=0;i < len;i++){
				cmd=cmds[i];
				if (!cmd)continue ;
				var context=Render._context;
				switch (cmd.callee){
					case context._translate:
					case 6:
						x-=cmd[0];
						y-=cmd[1];
					default :
					}
				if (HitArea.isHitCmd(x,y,cmd))return true;
			}
			return false;
		}

		HitArea.isHitCmd=function(x,y,cmd){
			if (!cmd)return false;
			var context=Render._context;
			switch (cmd.callee){
				case context._drawRect:
				case 13:
					HitArea._rec.setTo(cmd[0],cmd[1],cmd[2],cmd[3]);
					return HitArea._rec.contains(x,y);
					break ;
				case context._drawCircle:
				case context._fillCircle:
				case 14:;
					var d=NaN;
					x-=cmd[0];
					y-=cmd[1];
					d=x *x+y *y;
					return d < cmd[2] *cmd[2];
					break ;
				case context._drawPoly:
				case 18:
					x-=cmd[0];
					y-=cmd[1];
					return HitArea.ptInPolygon(x,y,cmd[2]);
					break ;
				default :
					return false;
				}
			return false;
		}

		HitArea.ptInPolygon=function(x,y,areaPoints){
			var p;
			p=HitArea._ptPoint;
			p.setTo(x,y);
			var nCross=0;
			var p1x=NaN,p1y=NaN,p2x=NaN,p2y=NaN;
			var len=0;
			len=areaPoints.length;
			for (var i=0;i < len;i+=2){
				p1x=areaPoints[i];
				p1y=areaPoints[i+1];
				p2x=areaPoints[(i+2)% len];
				p2y=areaPoints[(i+3)% len];
				var p1=areaPoints[i];
				var p2=areaPoints[(i+1)% areaPoints.length];
				if (p1y==p2y)
					continue ;
				if (p.y < Math.min(p1y,p2y))
					continue ;
				if (p.y >=Math.max(p1y,p2y))
					continue ;
				var x=(p.y-p1y)*(p2x-p1x)/ (p2y-p1y)+p1x;
				if (x > p.x){
					nCross++;
				}
			}
			return (nCross % 2==1);
		}

		HitArea._tCmds=[];
		__static(HitArea,
		['_rec',function(){return this._rec=new Rectangle();},'_ptPoint',function(){return this._ptPoint=new Point();}
		]);
		return HitArea;
	})()


	/**
	*<code>HTMLChar</code> 是一个 HTML 字符类。
	*/
	//class laya.utils.HTMLChar
	var HTMLChar=(function(){
		function HTMLChar(char,w,h,style){
			//this._sprite=null;
			//this._x=NaN;
			//this._y=NaN;
			//this._w=NaN;
			//this._h=NaN;
			//this.isWord=false;
			//this.char=null;
			//this.charNum=NaN;
			//this.style=null;
			this.char=char;
			this.charNum=char.charCodeAt(0);
			this._x=this._y=0;
			this.width=w;
			this.height=h;
			this.style=style;
			this.isWord=!HTMLChar._isWordRegExp.test(char);
		}

		__class(HTMLChar,'laya.utils.HTMLChar');
		var __proto=HTMLChar.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**
		*设置与此对象绑定的显示对象 <code>Sprite</code> 。
		*@param sprite 显示对象 <code>Sprite</code> 。
		*/
		__proto.setSprite=function(sprite){
			this._sprite=sprite;
		}

		/**
		*获取与此对象绑定的显示对象 <code>Sprite</code>。
		*@return
		*/
		__proto.getSprite=function(){
			return this._sprite;
		}

		/**@private */
		__proto._isChar=function(){
			return true;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this.style;
		}

		/**
		*宽度。
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
			},function(value){
			this._w=value;
		});

		/**
		*此对象存储的 X 轴坐标值。
		*当设置此值时，如果此对象有绑定的 Sprite 对象，则改变 Sprite 对象的属性 x 的值。
		*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this._sprite){
				this._sprite.x=value;
			}
			this._x=value;
		});

		/**
		*此对象存储的 Y 轴坐标值。
		*当设置此值时，如果此对象有绑定的 Sprite 对象，则改变 Sprite 对象的属性 y 的值。
		*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this._sprite){
				this._sprite.y=value;
			}
			this._y=value;
		});

		/**
		*高度。
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
			},function(value){
			this._h=value;
		});

		HTMLChar._isWordRegExp=new RegExp("[\\w\.]","");
		return HTMLChar;
	})()


	/**
	*<code>Pool</code> 是对象池类，用于对象的存贮、重复使用。
	*/
	//class laya.utils.Pool
	var Pool=(function(){
		function Pool(){};
		__class(Pool,'laya.utils.Pool');
		Pool.getPoolBySign=function(sign){
			return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
		}

		Pool.clearBySign=function(sign){
			if (Pool._poolDic[sign])Pool._poolDic[sign].length=0;
		}

		Pool.recover=function(sign,item){
			if (item["__InPool"])return;
			item["__InPool"]=true;
			Pool.getPoolBySign(sign).push(item);
		}

		Pool.getItemByClass=function(sign,cls){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():new cls();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItemByCreateFun=function(sign,createFun){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():createFun();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItem=function(sign){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():null;
			if (rst){
				rst["__InPool"]=false;
			}
			return rst;
		}

		Pool._poolDic={};
		Pool.InPoolSign="__InPool";
		return Pool;
	})()


	/**
	*<code>Stat</code> 用于显示帧率统计信息。
	*/
	//class laya.utils.Stat
	var Stat=(function(){
		function Stat(){};
		__class(Stat,'laya.utils.Stat');
		/**
		*点击帧频显示区域的处理函数。
		*/
		__getset(1,Stat,'onclick',null,function(fn){
			Stat._canvas.source.onclick=fn;
			Stat._canvas.source.style.pointerEvents='';
		});

		Stat.show=function(x,y){
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			if (Render.isConchApp){
				conch.showFPS&&conch.showFPS(x,y);
				return;
			};
			var pixel=Browser.pixelRatio;
			Stat._width=pixel *120;
			Stat._vx=pixel *70;
			Stat._view[0]={title:"FPS(Canvas)",value:"_fpsStr",color:"yellow",units:"int"};
			Stat._view[1]={title:"Sprite",value:"spriteCount",color:"white",units:"int"};
			Stat._view[2]={title:"DrawCall",value:"drawCall",color:"white",units:"int"};
			Stat._view[3]={title:"CurMem",value:"currentMemorySize",color:"yellow",units:"M"};
			if (Render.isWebGL){
				Stat._view[4]={title:"Shader",value:"shaderCall",color:"white",units:"int"};
				if (!Render.is3DMode){
					Stat._view[0].title="FPS(WebGL)";
					Stat._view[5]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
					}else {
					Stat._view[0].title="FPS(3D)";
					Stat._view[5]={title:"TriFaces",value:"trianglesFaces",color:"white",units:"int"};
				}
				}else {
				Stat._view[4]={title:"Canvas",value:"_canvasStr",color:"white",units:"int"};
			}
			Stat._fontSize=12 *pixel;
			for (var i=0;i < Stat._view.length;i++){
				Stat._view[i].x=4;
				Stat._view[i].y=i *Stat._fontSize+2 *pixel;
			}
			Stat._height=pixel *(Stat._view.length *12+3 *pixel);
			if (!Stat._canvas){
				Stat._canvas=new HTMLCanvas('2D');
				Stat._canvas.size(Stat._width,Stat._height);
				Stat._ctx=Stat._canvas.getContext('2d');
				Stat._ctx.textBaseline="top";
				Stat._ctx.font=Stat._fontSize+"px Sans-serif";
				Stat._canvas.source.style.cssText="pointer-events:none;background:rgba(150,150,150,0.8);z-index:100000;position: absolute;left:"+x+"px;top:"+y+"px;width:"+(Stat._width / pixel)+"px;height:"+(Stat._height / pixel)+"px;";
			}
			Stat._first=true;
			Stat.loop();
			Stat._first=false;
			Browser.container.appendChild(Stat._canvas.source);
			Stat.enable();
		}

		Stat.enable=function(){
			Laya.timer.frameLoop(1,Stat,Stat.loop);
		}

		Stat.hide=function(){
			Browser.removeElement(Stat._canvas.source);
			Laya.timer.clear(Stat,Stat.loop);
		}

		Stat.clear=function(){
			Stat.trianglesFaces=Stat.drawCall=Stat.shaderCall=Stat.spriteCount=Stat.canvasNormal=Stat.canvasBitmap=Stat.canvasReCache=0;
		}

		Stat.loop=function(){
			Stat._count++;
			var timer=Browser.now();
			if (timer-Stat._timer < 1000)return;
			var count=Stat._count;
			Stat.FPS=Math.round((count *1000)/ (timer-Stat._timer));
			if (Stat._canvas){
				Stat.trianglesFaces=Math.round(Stat.trianglesFaces / count);
				Stat.drawCall=Math.round(Stat.drawCall / count)-2;
				Stat.shaderCall=Math.round(Stat.shaderCall / count);
				Stat.spriteCount=Math.round(Stat.spriteCount / count)-1;
				Stat.canvasNormal=Math.round(Stat.canvasNormal / count);
				Stat.canvasBitmap=Math.round(Stat.canvasBitmap / count);
				Stat.canvasReCache=Math.ceil(Stat.canvasReCache / count);
				Stat._fpsStr=Stat.FPS+(Stat.renderSlow ? " slow" :"");
				Stat._canvasStr=Stat.canvasReCache+"/"+Stat.canvasNormal+"/"+Stat.canvasBitmap;
				Stat.currentMemorySize=ResourceManager.systemResourceManager.memorySize;
				var ctx=Stat._ctx;
				ctx.clearRect(Stat._first ? 0 :Stat._vx,0,Stat._width,Stat._height);
				for (var i=0;i < Stat._view.length;i++){
					var one=Stat._view[i];
					if (Stat._first){
						ctx.fillStyle="white";
						ctx.fillText(one.title,one.x,one.y,null,null,null);
					}
					ctx.fillStyle=one.color;
					var value=Stat[one.value];
					(one.units=="M")&& (value=Math.floor(value / (1024 *1024)*100)/ 100+" M");
					ctx.fillText(value+"",one.x+Stat._vx,one.y,null,null,null);
				}
				Stat.clear();
			}
			Stat._count=0;
			Stat._timer=timer;
		}

		Stat.loopCount=0;
		Stat.shaderCall=0;
		Stat.drawCall=0;
		Stat.trianglesFaces=0;
		Stat.spriteCount=0;
		Stat.FPS=0;
		Stat.canvasNormal=0;
		Stat.canvasBitmap=0;
		Stat.canvasReCache=0;
		Stat.renderSlow=false;
		Stat.currentMemorySize=0;
		Stat._fpsStr=null
		Stat._canvasStr=null
		Stat._canvas=null
		Stat._ctx=null
		Stat._timer=0;
		Stat._count=0;
		Stat._width=120;
		Stat._height=100;
		Stat._view=[];
		Stat._fontSize=12;
		Stat._first=false;
		Stat._vx=NaN
		return Stat;
	})()


	/**
	*<code>StringKey</code> 类用于存取字符串对应的数字。
	*/
	//class laya.utils.StringKey
	var StringKey=(function(){
		function StringKey(){
			this._strs={};
			this._length=0;
		}

		__class(StringKey,'laya.utils.StringKey');
		var __proto=StringKey.prototype;
		/**
		*添加一个字符。
		*@param str 字符，将作为key 存储相应生成的数字。
		*@return 此字符对应的数字。
		*/
		__proto.add=function(str){
			var index=this._strs[str];
			if (index !=null)return index;
			return this._strs[str]=this._length++;
		}

		/**
		*获取指定字符对应的数字。
		*@param str key 字符。
		*@return 此字符对应的数字。
		*/
		__proto.get=function(str){
			var index=this._strs[str];
			return index==null ?-1 :index;
		}

		return StringKey;
	})()


	/**
	*<code>Timer</code> 是时钟管理类。它是一个单例，可以通过 Laya.timer 访问。
	*/
	//class laya.utils.Timer
	var Timer=(function(){
		var TimerHandler;
		function Timer(){
			this.scale=1;
			this.currFrame=0;
			this._mid=1;
			this._map=[];
			this._laters=[];
			this._handlers=[];
			this._temp=[];
			this._count=0;
			this.currTimer=Browser.now();
			this._lastTimer=Browser.now();
			Laya.timer && Laya.timer.frameLoop(1,this,this._update);
		}

		__class(Timer,'laya.utils.Timer');
		var __proto=Timer.prototype;
		/**
		*@private
		*帧循环处理函数。
		*/
		__proto._update=function(){
			if (this.scale <=0){
				this._lastTimer=Browser.now();
				return;
			};
			var frame=this.currFrame=this.currFrame+this.scale;
			var now=Browser.now();
			Timer.delta=now-this._lastTimer;
			var timer=this.currTimer=this.currTimer+Timer.delta *this.scale;
			this._lastTimer=now;
			var handlers=this._handlers;
			this._count=0;
			for (i=0,n=handlers.length;i < n;i++){
				handler=handlers[i];
				if (handler.method!==null){
					var t=handler.userFrame ? frame :timer;
					if (t >=handler.exeTime){
						if (handler.repeat){
							if (t > handler.exeTime){
								handler.exeTime+=handler.delay;
								handler.run(false);
								if (t > handler.exeTime){
									handler.exeTime+=Math.ceil((t-handler.exeTime)/ handler.delay)*handler.delay;
								}
							}
							}else {
							handler.run(true);
						}
					}
					}else {
					this._count++;
				}
			}
			if (this._count > 30 || frame % 200===0)this._clearHandlers();
			var laters=this._laters;
			for (var i=0,n=laters.length-1;i <=n;i++){
				var handler=laters[i];
				handler.method!==null && handler.run(false);
				this._recoverHandler(handler);
				i===n && (n=laters.length-1);
			}
			laters.length=0;
		}

		/**@private */
		__proto._clearHandlers=function(){
			var handlers=this._handlers;
			for (var i=0,n=handlers.length;i < n;i++){
				var handler=handlers[i];
				if (handler.method!==null)this._temp.push(handler);
				else this._recoverHandler(handler);
			}
			this._handlers=this._temp;
			this._temp=handlers;
			this._temp.length=0;
		}

		/**@private */
		__proto._recoverHandler=function(handler){
			this._map[handler.key]=null;
			handler.clear();
			Timer._pool.push(handler);
		}

		/**@private */
		__proto._create=function(useFrame,repeat,delay,caller,method,args,coverBefore){
			if (!delay){
				method.apply(caller,args);
				return;
			}
			if (coverBefore){
				var handler=this._getHandler(caller,method);
				if (handler){
					handler.repeat=repeat;
					handler.userFrame=useFrame;
					handler.delay=delay;
					handler.caller=caller;
					handler.method=method;
					handler.args=args;
					handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer);
					return;
				}
			}
			handler=Timer._pool.length > 0 ? Timer._pool.pop():new TimerHandler();
			handler.repeat=repeat;
			handler.userFrame=useFrame;
			handler.delay=delay;
			handler.caller=caller;
			handler.method=method;
			handler.args=args;
			handler.exeTime=delay+(useFrame ? this.currFrame :this.currTimer);
			this._indexHandler(handler);
			this._handlers.push(handler);
		}

		/**@private */
		__proto._indexHandler=function(handler){
			var caller=handler.caller;
			var method=handler.method;
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			handler.key=cid+mid;
			this._map[handler.key]=handler;
		}

		/**
		*定时执行一次。
		*@param delay 延迟时间(单位为毫秒)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.once=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行。
		*@param delay 间隔时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.loop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行一次(基于帧率)。
		*@param delay 延迟几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行(基于帧率)。
		*@param delay 间隔几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**返回统计信息。*/
		__proto.toString=function(){
			return "callLater:"+this._laters.length+" handlers:"+this._handlers.length+" pool:"+Timer._pool.length;
		}

		/**
		*清理定时器。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*/
		__proto.clear=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler){
				this._map[handler.key]=null;handler.key=0;
				handler.clear();
			}
		}

		/**
		*清理对象身上的所有定时器。
		*@param caller 执行域(this)。
		*/
		__proto.clearAll=function(caller){
			for (var i=0,n=this._handlers.length;i < n;i++){
				var handler=this._handlers[i];
				if (handler.caller===caller){
					this._map[handler.key]=null;handler.key=0;
					handler.clear();
				}
			}
		}

		/**@private */
		__proto._getHandler=function(caller,method){
			var cid=caller ? caller.$_GID || (caller.$_GID=Utils.getGID()):0;
			var mid=method.$_TID || (method.$_TID=(this._mid++)*100000);
			return this._map[cid+mid];
		}

		/**
		*延迟执行。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*@param args 回调参数。
		*/
		__proto.callLater=function(caller,method,args){
			if (this._getHandler(caller,method)==null){
				if (Timer._pool.length)
					var handler=Timer._pool.pop();
				else handler=new TimerHandler();
				handler.caller=caller;
				handler.method=method;
				handler.args=args;
				this._indexHandler(handler);
				this._laters.push(handler);
			}
		}

		/**
		*立即执行 callLater 。
		*@param caller 执行域(this)。
		*@param method 定时器回调函数。
		*/
		__proto.runCallLater=function(caller,method){
			var handler=this._getHandler(caller,method);
			if (handler && handler.method !=null){
				this._map[handler.key]=null;
				handler.run(true);
			}
		}

		Timer.delta=0;
		Timer._pool=[];
		Timer.__init$=function(){
			/**@private */
			//class TimerHandler
			TimerHandler=(function(){
				function TimerHandler(){
					this.key=0;
					this.repeat=false;
					this.delay=0;
					this.userFrame=false;
					this.exeTime=0;
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__class(TimerHandler,'');
				var __proto=TimerHandler.prototype;
				__proto.clear=function(){
					this.caller=null;
					this.method=null;
					this.args=null;
				}
				__proto.run=function(widthClear){
					var caller=this.caller;
					if (caller && caller.destroyed)return this.clear();
					var method=this.method;
					var args=this.args;
					widthClear && this.clear();
					if (method==null)return;
					args ? method.apply(caller,args):method.call(caller);
				}
				return TimerHandler;
			})()
		}

		return Timer;
	})()


	/**
	*<code>Tween</code> 是一个缓动类。使用实现目标对象属性的渐变。
	*/
	//class laya.utils.Tween
	var Tween=(function(){
		function Tween(){
			//this._complete=null;
			//this._target=null;
			//this._ease=null;
			//this._props=null;
			//this._duration=0;
			//this._delay=0;
			//this._startTimer=0;
			//this._usedTimer=0;
			//this._usedPool=false;
			this.gid=0;
			//this.update=null;
		}

		__class(Tween,'laya.utils.Tween');
		var __proto=Tween.prototype;
		/**
		*缓动对象的props属性到目标值。
		*@param target 目标对象(即将更改属性值的对象)。
		*@param props 变化的属性列表，比如{x:100,y:20}。
		*@param duration 花费的时间，单位毫秒。
		*@param ease 缓动类型，默认为匀速运动。
		*@param complete 结束回调函数。
		*@param delay 延迟执行时间。
		*@param coverBefore 是否覆盖之前的缓动。
		*@return 返回Tween对象。
		*/
		__proto.to=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,true,false,true);
		}

		/**
		*从props属性，缓动到当前状态。
		*@param target 目标对象(即将更改属性值的对象)。
		*@param props 变化的属性列表，比如{x:100,y:20}。
		*@param duration 花费的时间，单位毫秒。
		*@param ease 缓动类型，默认为匀速运动。
		*@param complete 结束回调函数。
		*@param delay 延迟执行时间。
		*@param coverBefore 是否覆盖之前的缓动。
		*@return 返回Tween对象。
		*/
		__proto.from=function(target,props,duration,ease,complete,delay,coverBefore){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			return this._create(target,props,duration,ease,complete,delay,coverBefore,false,false,true);
		}

		/**@private */
		__proto._create=function(target,props,duration,ease,complete,delay,coverBefore,isTo,usePool,runNow){
			if (!target)throw new Error("Tween:target is null");
			this._target=target;
			this._duration=duration||props.duration||0;
			this._ease=ease || props.ease || Tween.easeNone;
			this._complete=complete || props.complete;
			this._delay=delay;
			this._props=[];
			this._usedTimer=0;
			this._startTimer=Browser.now();
			this._usedPool=usePool;
			this.update=props.update;
			var gid=(target.$_GID || (target.$_GID=Utils.getGID()));
			if (!Tween.tweenMap[gid]){
				Tween.tweenMap[gid]=[this];
				}else {
				if (coverBefore)Tween.clearTween(target);
				Tween.tweenMap[gid].push(this);
			}
			if (runNow){
				if (delay <=0)this.firstStart(target,props,isTo);
				else Laya.timer.once(delay,this,this.firstStart,[target,props,isTo]);
				}else {
				this._initProps(target,props,isTo);
			}
			return this;
		}

		__proto.firstStart=function(target,props,isTo){
			this._initProps(target,props,isTo);
			this._beginLoop();
		}

		__proto._initProps=function(target,props,isTo){
			for (var p in props){
				if ((typeof (target[p])=='number')){
					var start=isTo ? target[p] :props[p];
					var end=isTo ? props[p] :target[p];
					this._props.push([p,start,end-start]);
				}
			}
		}

		__proto._beginLoop=function(){
			Laya.timer.frameLoop(1,this,this._doEase);
		}

		/**执行缓动**/
		__proto._doEase=function(){
			this._updateEase(Browser.now());
		}

		/**@private */
		__proto._updateEase=function(time){
			var target=this._target;
			if (target.destroyed)return Tween.clearTween(target);
			var usedTimer=this._usedTimer=time-this._startTimer-this._delay;
			if (usedTimer < 0)return;
			if (usedTimer >=this._duration)return this.complete();
			var ratio=usedTimer > 0 ? this._ease(usedTimer,0,1,this._duration):0;
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+(ratio *prop[2]);
			}
			if (this.update)this.update.run();
		}

		/**
		*立即结束缓动并到终点。
		*/
		__proto.complete=function(){
			if (!this._target)return;
			var target=this._target;
			var props=this._props;
			var handler=this._complete;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				target[prop[0]]=prop[1]+prop[2];
			}
			if (this.update)this.update.run();
			this.clear();
			handler && handler.run();
		}

		/**
		*暂停缓动，可以通过resume或restart重新开始。
		*/
		__proto.pause=function(){
			Laya.timer.clear(this,this._beginLoop);
			Laya.timer.clear(this,this._doEase);
		}

		/**
		*设置开始时间。
		*@param startTime 开始时间。
		*/
		__proto.setStartTime=function(startTime){
			this._startTimer=startTime;
		}

		/**
		*停止并清理当前缓动。
		*/
		__proto.clear=function(){
			if (this._target){
				this._remove();
				this._clear();
			}
		}

		/**
		*@private
		*/
		__proto._clear=function(){
			this.pause();
			Laya.timer.clear(this,this.firstStart);
			this._complete=null;
			this._target=null;
			this._ease=null;
			this._props=null;
			if (this._usedPool){
				this.update=null;
				Pool.recover("tween",this);
			}
		}

		/**回收到对象池。*/
		__proto.recover=function(){
			this._usedPool=true;
			this._clear();
		}

		__proto._remove=function(){
			var tweens=Tween.tweenMap[this._target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					if (tweens[i]===this){
						tweens.splice(i,1);
						break ;
					}
				}
			}
		}

		/**
		*重新开始暂停的缓动。
		*/
		__proto.restart=function(){
			this.pause();
			this._usedTimer=0;
			this._startTimer=Browser.now();
			var props=this._props;
			for (var i=0,n=props.length;i < n;i++){
				var prop=props[i];
				this._target[prop[0]]=prop[1];
			}
			Laya.timer.once(this._delay,this,this._beginLoop);
		}

		/**
		*恢复暂停的缓动。
		*/
		__proto.resume=function(){
			if (this._usedTimer >=this._duration)return;
			this._startTimer=Browser.now()-this._usedTimer-this._delay;
			this._beginLoop();
		}

		/**设置当前执行比例**/
		__getset(0,__proto,'progress',null,function(v){
			var uTime=v*this._duration;
			this._startTimer=Browser.now()-this._delay-uTime;
		});

		Tween.to=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(autoRecover===void 0)&& (autoRecover=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,true,autoRecover,true);
		}

		Tween.from=function(target,props,duration,ease,complete,delay,coverBefore,autoRecover){
			(delay===void 0)&& (delay=0);
			(coverBefore===void 0)&& (coverBefore=false);
			(autoRecover===void 0)&& (autoRecover=true);
			return Pool.getItemByClass("tween",Tween)._create(target,props,duration,ease,complete,delay,coverBefore,false,autoRecover,true);
		}

		Tween.clearAll=function(target){
			if (!target || !target.$_GID)return;
			var tweens=Tween.tweenMap[target.$_GID];
			if (tweens){
				for (var i=0,n=tweens.length;i < n;i++){
					tweens[i]._clear();
				}
				tweens.length=0;
			}
		}

		Tween.clear=function(tween){
			tween.clear();
		}

		Tween.clearTween=function(target){
			Tween.clearAll(target);
		}

		Tween.easeNone=function(t,b,c,d){
			return c *t / d+b;
		}

		Tween.tweenMap={};
		return Tween;
	})()


	/**
	*<code>Utils</code> 是工具类。
	*/
	//class laya.utils.Utils
	var Utils=(function(){
		function Utils(){};
		__class(Utils,'laya.utils.Utils');
		Utils.toRadian=function(angle){
			return angle *Utils._pi2;
		}

		Utils.toAngle=function(radian){
			return radian *Utils._pi;
		}

		Utils.toHexColor=function(color){
			if (color < 0 || isNaN(color))return null;
			var str=color.toString(16);
			while (str.length < 6)str="0"+str;
			return "#"+str;
		}

		Utils.getGID=function(){
			return Utils._gid++;
		}

		Utils.concatArray=function(source,array){
			if (!array)return source;
			if (!source)return array;
			var i=0,len=array.length;
			for (i=0;i < len;i++){
				source.push(array[i]);
			}
			return source;
		}

		Utils.clearArray=function(array){
			if (!array)return array;
			array.length=0;
			return array;
		}

		Utils.copyArray=function(source,array){
			source || (source=[]);
			if (!array)return source;
			source.length=array.length;
			var i=0,len=array.length;
			for (i=0;i < len;i++){
				source[i]=array[i];
			}
			return source;
		}

		Utils.getGlobalRecByPoints=function(sprite,x0,y0,x1,y1){
			var newLTPoint;
			newLTPoint=new Point(x0,y0);
			newLTPoint=sprite.localToGlobal(newLTPoint);
			var newRBPoint;
			newRBPoint=new Point(x1,y1);
			newRBPoint=sprite.localToGlobal(newRBPoint);
			return Rectangle._getWrapRec([newLTPoint.x,newLTPoint.y,newRBPoint.x,newRBPoint.y]);
		}

		Utils.getGlobalPosAndScale=function(sprite){
			return Utils.getGlobalRecByPoints(sprite,0,0,1,1);
		}

		Utils.bind=function(fun,scope){
			var rst=fun;
			rst=fun.bind(scope);;
			return rst;
		}

		Utils.measureText=function(txt,font){
			return RunDriver.measureText(txt,font);
		}

		Utils.updateOrder=function(childs){
			if ((!childs)|| childs.length < 2)return false;
			var c=childs[0];
			var i=1,sz=childs.length;
			var z=c._zOrder,low=NaN,high=NaN,mid=NaN,zz=NaN;
			var repaint=false;
			for (i=1;i < sz;i++){
				c=childs [i];
				if (!c)continue ;
				if ((z=c._zOrder)< 0)z=c._zOrder;
				if (z < childs[i-1]._zOrder){
					mid=low=0;
					high=i-1;
					while (low <=high){
						mid=(low+high)>>> 1;
						if (!childs[mid])break ;
						zz=childs[mid]._zOrder;
						if (zz < 0)zz=childs[mid]._zOrder;
						if (zz < z)
							low=mid+1;
						else if (zz > z)
						high=mid-1;
						else break ;
					}
					if (z > childs[mid]._zOrder)mid++;
					var f=c.parent;
					childs.splice(i,1);
					childs.splice(mid,0,c);
					if (f && f.model){
						f.model&&f.model.removeChild(c.model);
						f.model && f.model.addChildAt(c.model,mid);
					}
					repaint=true;
				}
			}
			return repaint;
		}

		Utils.transPointList=function(points,x,y){
			var i=0,len=points.length;
			for (i=0;i < len;i+=2){
				points[i]+=x;
				points[i+1]+=y;
			}
		}

		Utils.parseInt=function(str,radix){
			(radix===void 0)&& (radix=0);
			var result=Browser.window.parseInt(str,radix);
			if (isNaN(result))return 0;
			return result;
		}

		Utils._gid=1;
		Utils._pi=180 / Math.PI;
		Utils._pi2=Math.PI / 180;
		Utils.parseXMLFromString=function(value){
			var rst;
			value=value.replace(/>\s+</g,'><');
			rst=(new DOMParser()).parseFromString(value,'text/xml');
			if (rst.firstChild.textContent.indexOf("This page contains the following errors")>-1){
				throw new Error(rst.firstChild.firstChild.textContent);
			}
			return rst;
		}

		return Utils;
	})()


	/**
	*...
	*@author
	*/
	//class laya.utils.VectorGraphManager
	var VectorGraphManager=(function(){
		function VectorGraphManager(){
			this.useDic={};
			this.shapeDic={};
			this.shapeLineDic={};
			this._id=0;
			this._checkKey=false;
			this._freeIdArray=[];
			if (Render.isWebGL){
				CacheManger.regCacheByFunction(Utils.bind(this.startDispose,this),Utils.bind(this.getCacheList,this));
			}
		}

		__class(VectorGraphManager,'laya.utils.VectorGraphManager');
		var __proto=VectorGraphManager.prototype;
		/**
		*得到个空闲的ID
		*@return
		*/
		__proto.getId=function(){
			if (this._freeIdArray.length > 0){
				return this._freeIdArray.pop();
			}
			return this._id++;
		}

		/**
		*添加一个图形到列表中
		*@param id
		*@param shape
		*/
		__proto.addShape=function(id,shape){
			this.shapeDic[id]=shape;
			if (!this.useDic[id]){
				this.useDic[id]=true;
			}
		}

		/**
		*添加一个线图形到列表中
		*@param id
		*@param Line
		*/
		__proto.addLine=function(id,Line){
			this.shapeLineDic[id]=Line;
			if (!this.shapeLineDic[id]){
				this.shapeLineDic[id]=true;
			}
		}

		/**
		*检测一个对象是否在使用中
		*@param id
		*/
		__proto.getShape=function(id){
			if (this._checkKey){
				if (this.useDic[id] !=null){
					this.useDic[id]=true;
				}
			}
		}

		/**
		*删除一个图形对象
		*@param id
		*/
		__proto.deleteShape=function(id){
			if (this.shapeDic[id]){
				this.shapeDic[id]=null;
				delete this.shapeDic[id];
			}
			if (this.shapeLineDic[id]){
				this.shapeLineDic[id]=null;
				delete this.shapeLineDic[id];
			}
			if (this.useDic[id] !=null){
				delete this.useDic[id];
			}
			this._freeIdArray.push(id);
		}

		/**
		*得到缓存列表
		*@return
		*/
		__proto.getCacheList=function(){
			var str;
			var list=[];
			for (str in this.shapeDic){
				list.push(this.shapeDic[str]);
			}
			for (str in this.shapeLineDic){
				list.push(this.shapeLineDic[str]);
			}
			return list;
		}

		/**
		*开始清理状态，准备销毁
		*/
		__proto.startDispose=function(key){
			var str;
			for (str in this.useDic){
				this.useDic[str]=false;
			}
			this._checkKey=true;
		}

		/**
		*确认销毁
		*/
		__proto.endDispose=function(){
			if (this._checkKey){
				var str;
				for (str in this.useDic){
					if (!this.useDic[str]){
						this.deleteShape(str);
					}
				}
				this._checkKey=false;
			}
		}

		VectorGraphManager.getInstance=function(){
			return VectorGraphManager.instance=VectorGraphManager.instance|| new VectorGraphManager();
		}

		VectorGraphManager.instance=null
		return VectorGraphManager;
	})()


	/**
	*@private
	*/
	//class laya.utils.WordText
	var WordText=(function(){
		function WordText(){
			this.id=NaN;
			this.save=[];
			this.toUpperCase=null;
			this.changed=false;
			this._text=null;
		}

		__class(WordText,'laya.utils.WordText');
		var __proto=WordText.prototype;
		__proto.setText=function(txt){
			this.changed=true;
			this._text=txt;
		}

		__proto.toString=function(){
			return this._text;
		}

		__proto.charCodeAt=function(i){
			return this._text ? this._text.charCodeAt(i):NaN;
		}

		__proto.charAt=function(i){
			return this._text ? this._text.charAt(i):null;
		}

		__getset(0,__proto,'length',function(){
			return this._text ? this._text.length :0;
		});

		return WordText;
	})()


	//class laya.webgl.atlas.AtlasGrid
	var AtlasGrid=(function(){
		var TexRowInfo,TexMergeTexSize;
		function AtlasGrid(width,height,atlasID){
			this._atlasID=0;
			this._width=0;
			this._height=0;
			this._texCount=0;
			this._rowInfo=null;
			this._cells=null;
			this._failSize=new TexMergeTexSize();
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			(atlasID===void 0)&& (atlasID=0);
			this._cells=null;
			this._rowInfo=null;
			this._init(width,height);
			this._atlasID=atlasID;
		}

		__class(AtlasGrid,'laya.webgl.atlas.AtlasGrid');
		var __proto=AtlasGrid.prototype;
		//------------------------------------------------------------------------------
		__proto.getAltasID=function(){
			return this._atlasID;
		}

		//------------------------------------------------------------------------------
		__proto.setAltasID=function(atlasID){
			if (atlasID >=0){
				this._atlasID=atlasID;
			}
		}

		//------------------------------------------------------------------
		__proto.addTex=function(type,width,height){
			var result=this._get(width,height);
			if (result.ret==false){
				return result;
			}
			this._fill(result.x,result.y,width,height,type);
			this._texCount++;
			return result;
		}

		//------------------------------------------------------------------------------
		__proto._release=function(){
			if (this._cells !=null){
				this._cells.length=0;
				this._cells=null;
			}
			if (this._rowInfo){
				this._rowInfo.length=0;
				this._rowInfo=null;
			}
		}

		//------------------------------------------------------------------------------
		__proto._init=function(width,height){
			this._width=width;
			this._height=height;
			this._release();
			if (this._width==0)return false;
			this._cells=new Uint8Array(this._width *this._height*3);
			this._rowInfo=__newvec(this._height);
			for (var i=0;i < this._height;i++){
				this._rowInfo[i]=new TexRowInfo();
			}
			this._clear();
			return true;
		}

		//------------------------------------------------------------------
		__proto._get=function(width,height){
			var pFillInfo=new MergeFillInfo();
			if (width >=this._failSize.width && height >=this._failSize.height){
				return pFillInfo;
			};
			var rx=-1;
			var ry=-1;
			var nWidth=this._width;
			var nHeight=this._height;
			var pCellBox=this._cells;
			for (var y=0;y < nHeight;y++){
				if (this._rowInfo[y].spaceCount < width)continue ;
				for (var x=0;x < nWidth;){
					var tm=(y *nWidth+x)*3;
					if (pCellBox[tm] !=0 || pCellBox[tm+1] < width || pCellBox[tm+2] < height){
						x+=pCellBox[tm+1];
						continue ;
					}
					rx=x;
					ry=y;
					for (var xx=0;xx < width;xx++){
						if (pCellBox[3*xx+tm+2] < height){
							rx=-1;
							break ;
						}
					}
					if (rx < 0){
						x+=pCellBox[tm+1];
						continue ;
					}
					pFillInfo.ret=true;
					pFillInfo.x=rx;
					pFillInfo.y=ry;
					return pFillInfo;
				}
			}
			return pFillInfo;
		}

		//------------------------------------------------------------------
		__proto._fill=function(x,y,w,h,type){
			var nWidth=this._width;
			var nHeghit=this._height;
			this._check((x+w)<=nWidth && (y+h)<=nHeghit);
			for (var yy=y;yy < (h+y);++yy){
				this._check(this._rowInfo[yy].spaceCount >=w);
				this._rowInfo[yy].spaceCount-=w;
				for (var xx=0;xx < w;xx++){
					var tm=(x+yy *nWidth+xx)*3;
					this._check(this._cells[tm]==0);
					this._cells[tm]=type;
					this._cells[tm+1]=w;
					this._cells[tm+2]=h;
				}
			}
			if (x > 0){
				for (yy=0;yy < h;++yy){
					var s=0;
					for (xx=x-1;xx >=0;--xx,++s){
						if (this._cells[((y+yy)*nWidth+xx)*3] !=0)break ;
					}
					for (xx=s;xx > 0;--xx){
						this._cells[((y+yy)*nWidth+x-xx)*3+1]=xx;
						this._check(xx > 0);
					}
				}
			}
			if (y > 0){
				for (xx=x;xx < (x+w);++xx){
					s=0;
					for (yy=y-1;yy >=0;--yy,s++){
						if (this._cells[(xx+yy *nWidth)*3] !=0)break ;
					}
					for (yy=s;yy > 0;--yy){
						this._cells[(xx+(y-yy)*nWidth)*3+2]=yy;
						this._check(yy > 0);
					}
				}
			}
		}

		__proto._check=function(ret){
			if (ret==false){
				console.log("xtexMerger 错误啦");
			}
		}

		//------------------------------------------------------------------
		__proto._clear=function(){
			this._texCount=0;
			for (var y=0;y < this._height;y++){
				this._rowInfo[y].spaceCount=this._width;
			}
			for (var i=0;i < this._height;i++){
				for (var j=0;j < this._width;j++){
					var tm=(i *this._width+j)*3;
					this._cells[tm]=0;
					this._cells[tm+1]=this._width-j;
					this._cells[tm+2]=this._width-i;
				}
			}
			this._failSize.width=this._width+1;
			this._failSize.height=this._height+1;
		}

		AtlasGrid.__init$=function(){
			//------------------------------------------------------------------------------
			//class TexRowInfo
			TexRowInfo=(function(){
				function TexRowInfo(){
					this.spaceCount=0;
				}
				__class(TexRowInfo,'');
				return TexRowInfo;
			})()
			//------------------------------------------------------------------------------
			//class TexMergeTexSize
			TexMergeTexSize=(function(){
				function TexMergeTexSize(){
					this.width=0;
					this.height=0;
				}
				__class(TexMergeTexSize,'');
				return TexMergeTexSize;
			})()
		}

		return AtlasGrid;
	})()


	//class laya.webgl.atlas.AtlasResourceManager
	var AtlasResourceManager=(function(){
		function AtlasResourceManager(width,height,gridSize,maxTexNum){
			this._currentAtlasCount=0;
			this._maxAtlaserCount=0;
			this._width=0;
			this._height=0;
			this._gridSize=0;
			this._gridNumX=0;
			this._gridNumY=0;
			this._init=false;
			this._curAtlasIndex=0;
			this._setAtlasParam=false;
			this._atlaserArray=null;
			this._needGC=false;
			this._setAtlasParam=true;
			this._width=width;
			this._height=height;
			this._gridSize=gridSize;
			this._maxAtlaserCount=maxTexNum;
			this._gridNumX=width / gridSize;
			this._gridNumY=height / gridSize;
			this._curAtlasIndex=0;
			this._atlaserArray=[];
		}

		__class(AtlasResourceManager,'laya.webgl.atlas.AtlasResourceManager');
		var __proto=AtlasResourceManager.prototype;
		__proto.setAtlasParam=function(width,height,gridSize,maxTexNum){
			if (this._setAtlasParam==true){
				AtlasResourceManager._sid_=0;
				this._width=width;
				this._height=height;
				this._gridSize=gridSize;
				this._maxAtlaserCount=maxTexNum;
				this._gridNumX=width / gridSize;
				this._gridNumY=height / gridSize;
				this._curAtlasIndex=0;
				this.freeAll();
				return true;
				}else {
				console.log("设置大图合集参数错误，只能在开始页面设置各种参数");
				throw-1;
				return false;
			}
			return false;
		}

		//添加 图片到大图集
		__proto.pushData=function(texture){
			var tex=texture;
			this._setAtlasParam=false;
			var bFound=false;
			var nImageGridX=(Math.ceil((texture.bitmap.width+2)/ this._gridSize));
			var nImageGridY=(Math.ceil((texture.bitmap.height+2)/ this._gridSize));
			var bSuccess=false;
			for (var k=0;k < 2;k++){
				var maxAtlaserCount=this._maxAtlaserCount;
				for (var i=0;i < maxAtlaserCount;i++){
					var altasIndex=(this._curAtlasIndex+i)% maxAtlaserCount;
					(this._atlaserArray.length-1>=altasIndex)|| (this._atlaserArray.push(new Atlaser(this._gridNumX,this._gridNumY,this._width,this._height,AtlasResourceManager._sid_++)));
					var atlas=this._atlaserArray[altasIndex];
					var bitmap=texture.bitmap;
					var webGLImageIndex=atlas.inAtlasWebGLImagesKey.indexOf(bitmap);
					var offsetX=0,offsetY=0;
					if (webGLImageIndex==-1){
						var fillInfo=atlas.addTex(1,nImageGridX,nImageGridY);
						if (fillInfo.ret){
							offsetX=fillInfo.x *this._gridSize+1;
							offsetY=fillInfo.y *this._gridSize+1;
							bitmap.lock=true;
							atlas.addToAtlasTexture((bitmap),offsetX,offsetY);
							atlas.addToAtlas(texture,offsetX,offsetY);
							bSuccess=true;
							this._curAtlasIndex=altasIndex;
							break ;
						}
						}else {
						var offset=atlas.InAtlasWebGLImagesOffsetValue[webGLImageIndex];
						offsetX=offset[0];
						offsetY=offset[1];
						atlas.addToAtlas(texture,offsetX,offsetY);
						bSuccess=true;
						this._curAtlasIndex=altasIndex;
						break ;
					}
				}
				if (bSuccess)
					break ;
				this._atlaserArray.push(new Atlaser(this._gridNumX,this._gridNumY,this._width,this._height,AtlasResourceManager._sid_++));
				this._needGC=true;
				this.garbageCollection();
				this._curAtlasIndex=this._atlaserArray.length-1;
			}
			if (!bSuccess){
				console.log(">>>AtlasManager pushData error");
			}
			return bSuccess;
		}

		__proto.addToAtlas=function(tex){
			laya.webgl.atlas.AtlasResourceManager.instance.pushData(tex);
		}

		/**
		*回收大图合集,不建议手动调用
		*@return
		*/
		__proto.garbageCollection=function(){
			if (this._needGC===true){
				var n=this._atlaserArray.length-this._maxAtlaserCount;
				for (var i=0;i < n;i++)
				this._atlaserArray[i].dispose();
				this._atlaserArray.splice(0,n);
				this._needGC=false;
			}
			return true;
		}

		__proto.freeAll=function(){
			for (var i=0,n=this._atlaserArray.length;i < n;i++){
				this._atlaserArray[i].dispose();
			}
			this._atlaserArray.length=0;
			this._curAtlasIndex=0;
		}

		__proto.getAtlaserCount=function(){
			return this._atlaserArray.length;
		}

		__proto.getAtlaserByIndex=function(index){
			return this._atlaserArray[index];
		}

		__getset(1,AtlasResourceManager,'instance',function(){
			if (!AtlasResourceManager._Instance){
				AtlasResourceManager._Instance=new AtlasResourceManager(laya.webgl.atlas.AtlasResourceManager.atlasTextureWidth,laya.webgl.atlas.AtlasResourceManager.atlasTextureHeight,16,laya.webgl.atlas.AtlasResourceManager.maxTextureCount);
			}
			return AtlasResourceManager._Instance;
		});

		__getset(1,AtlasResourceManager,'enabled',function(){
			return AtlasResourceManager._enabled;
		});

		__getset(1,AtlasResourceManager,'atlasLimitWidth',function(){
			return AtlasResourceManager._atlasLimitWidth;
			},function(value){
			AtlasResourceManager._atlasLimitWidth=value;
		});

		__getset(1,AtlasResourceManager,'atlasLimitHeight',function(){
			return AtlasResourceManager._atlasLimitHeight;
			},function(value){
			AtlasResourceManager._atlasLimitHeight=value;
		});

		AtlasResourceManager._enable=function(){
			AtlasResourceManager._enabled=true;
			Config.atlasEnable=true;
		}

		AtlasResourceManager._disable=function(){
			AtlasResourceManager._enabled=false;
			Config.atlasEnable=false;
		}

		AtlasResourceManager.__init__=function(){
			AtlasResourceManager.atlasTextureWidth=2048;
			AtlasResourceManager.atlasTextureHeight=2048;
			AtlasResourceManager.maxTextureCount=6;
			AtlasResourceManager.atlasLimitWidth=512;
			AtlasResourceManager.atlasLimitHeight=512;
		}

		AtlasResourceManager._enabled=false;
		AtlasResourceManager._atlasLimitWidth=0;
		AtlasResourceManager._atlasLimitHeight=0;
		AtlasResourceManager.gridSize=16;
		AtlasResourceManager.atlasTextureWidth=0;
		AtlasResourceManager.atlasTextureHeight=0;
		AtlasResourceManager.maxTextureCount=0;
		AtlasResourceManager._atlasRestore=0;
		AtlasResourceManager.BOARDER_TYPE_NO=0;
		AtlasResourceManager.BOARDER_TYPE_RIGHT=1;
		AtlasResourceManager.BOARDER_TYPE_LEFT=2;
		AtlasResourceManager.BOARDER_TYPE_BOTTOM=4;
		AtlasResourceManager.BOARDER_TYPE_TOP=8;
		AtlasResourceManager.BOARDER_TYPE_ALL=15;
		AtlasResourceManager._sid_=0;
		AtlasResourceManager._Instance=null;
		return AtlasResourceManager;
	})()


	//class laya.webgl.atlas.MergeFillInfo
	var MergeFillInfo=(function(){
		function MergeFillInfo(){
			this.x=0;
			this.y=0;
			this.ret=false;
			this.ret=false;
			this.x=0;
			this.y=0;
		}

		__class(MergeFillInfo,'laya.webgl.atlas.MergeFillInfo');
		return MergeFillInfo;
	})()


	;
	//class laya.webgl.canvas.BlendMode
	var BlendMode=(function(){
		function BlendMode(){};
		__class(BlendMode,'laya.webgl.canvas.BlendMode');
		BlendMode._init_=function(gl){
			BlendMode.fns=[BlendMode.BlendNormal,BlendMode.BlendAdd,BlendMode.BlendMultiply,BlendMode.BlendScreen,BlendMode.BlendOverlay,BlendMode.BlendLight,BlendMode.BlendMask];
			BlendMode.targetFns=[BlendMode.BlendNormalTarget,BlendMode.BlendAddTarget,BlendMode.BlendMultiplyTarget,BlendMode.BlendScreenTarget,BlendMode.BlendOverlayTarget,BlendMode.BlendLightTarget,BlendMode.BlendMask];
		}

		BlendMode.BlendNormal=function(gl){
			gl.blendFunc(0x0302,0x0303);
		}

		BlendMode.BlendAdd=function(gl){
			gl.blendFunc(0x0302,0x0304);
		}

		BlendMode.BlendMultiply=function(gl){
			gl.blendFunc(0x0306,0x0303);
		}

		BlendMode.BlendScreen=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendOverlay=function(gl){
			gl.blendFunc(1,0x0301);
		}

		BlendMode.BlendLight=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendNormalTarget=function(gl){
			gl.blendFuncSeparate(0x0302,0x0303,1,0x0303);
		}

		BlendMode.BlendAddTarget=function(gl){
			gl.blendFunc(0x0302,0x0304);
		}

		BlendMode.BlendMultiplyTarget=function(gl){
			gl.blendFunc(0x0306,0x0303);
		}

		BlendMode.BlendScreenTarget=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendOverlayTarget=function(gl){
			gl.blendFunc(1,0x0301);
		}

		BlendMode.BlendLightTarget=function(gl){
			gl.blendFunc(0x0302,1);
		}

		BlendMode.BlendMask=function(gl){
			gl.blendFunc(0,0x0302);
		}

		BlendMode.activeBlendFunction=null;
		BlendMode.NAMES=["normal","add","multiply","screen","overlay","light","mask"];
		BlendMode.TOINT={"normal":0,"add":1,"multiply":2,"screen":3 ,"lighter":1,"overlay":4,"light":5,"mask":6};
		BlendMode.NORMAL="normal";
		BlendMode.ADD="add";
		BlendMode.MULTIPLY="multiply";
		BlendMode.SCREEN="screen";
		BlendMode.LIGHT="light";
		BlendMode.OVERLAY="overlay";
		BlendMode.fns=[];
		BlendMode.targetFns=[];
		return BlendMode;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.DrawStyle
	var DrawStyle=(function(){
		function DrawStyle(value){
			this._color=Color.create("black");
			this.setValue(value);
		}

		__class(DrawStyle,'laya.webgl.canvas.DrawStyle');
		var __proto=DrawStyle.prototype;
		__proto.setValue=function(value){
			if (value){
				if ((typeof value=='string')){
					this._color=Color.create(value);
					return;
				}
				if ((value instanceof laya.utils.Color )){
					this._color=value;
					return;
				}
			}
		}

		__proto.reset=function(){
			this._color=Color.create("black");
		}

		__proto.equal=function(value){
			if ((typeof value=='string'))return this._color.strColor===value;
			if ((value instanceof laya.utils.Color ))return this._color.numColor===(value).numColor;
			return false;
		}

		__proto.toColorStr=function(){
			return this._color.strColor;
		}

		DrawStyle.create=function(value){
			if (value){
				var color;
				if ((typeof value=='string'))color=Color.create(value);
				else if ((value instanceof laya.utils.Color ))color=value;
				if (color){
					return color._drawStyle || (color._drawStyle=new DrawStyle(value));
				}
			}
			return null;
		}

		DrawStyle.DEFAULT=new DrawStyle("#000000");
		return DrawStyle;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.Path
	var Path=(function(){
		function Path(){
			this._x=0;
			this._y=0;
			//this._rect=null;
			//this.ib=null;
			//this.vb=null;
			this.dirty=false;
			//this.geomatrys=null;
			//this._curGeomatry=null;
			this.offset=0;
			this.count=0;
			this.geoStart=0;
			this.tempArray=[];
			this.closePath=false;
			this.geomatrys=[];
			var gl=WebGL.mainContext;
			this.ib=IndexBuffer2D.create(0x88E8);
			this.vb=VertexBuffer2D.create(5);
		}

		__class(Path,'laya.webgl.canvas.Path');
		var __proto=Path.prototype;
		__proto.addPoint=function(pointX,pointY){
			this.tempArray.push(pointX,pointY);
		}

		__proto.getEndPointX=function(){
			return this.tempArray[this.tempArray.length-2];
		}

		__proto.getEndPointY=function(){
			return this.tempArray[this.tempArray.length-1];
		}

		__proto.polygon=function(x,y,points,color,borderWidth,borderColor){
			var geo;
			this.geomatrys.push(this._curGeomatry=geo=new Polygon(x,y,points,color,borderWidth,borderColor));
			if (!color)geo.fill=false;
			if (borderColor==undefined)geo.borderWidth=0;
			return geo;
		}

		__proto.setGeomtry=function(shape){
			this.geomatrys.push(this._curGeomatry=shape);
		}

		__proto.drawLine=function(x,y,points,width,color){
			var geo;
			if (this.closePath){
				this.geomatrys.push(this._curGeomatry=geo=new LoopLine(x,y,points,width,color));
				}else {
				this.geomatrys.push(this._curGeomatry=geo=new Line(x,y,points,width,color));
			}
			geo.fill=false;
			return geo;
		}

		__proto.update=function(){
			var si=this.ib.byteLength;
			var len=this.geomatrys.length;
			this.offset=si;
			for (var i=this.geoStart;i < len;i++){
				this.geomatrys[i].getData(this.ib,this.vb,this.vb.byteLength / (5 *4));
			}
			this.geoStart=len;
			this.count=(this.ib.byteLength-si)/ CONST3D2D.BYTES_PIDX;
		}

		__proto.reset=function(){
			this.vb.clear();
			this.ib.clear();
			this.offset=this.count=this.geoStart=0;
			this.geomatrys.length=0;
		}

		return Path;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveBase
	var SaveBase=(function(){
		function SaveBase(){
			//this._valueName=null;
			//this._value=null;
			//this._dataObj=null;
			//this._newSubmit=false;
		}

		__class(SaveBase,'laya.webgl.canvas.save.SaveBase');
		var __proto=SaveBase.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			this._dataObj[this._valueName]=this._value;
			SaveBase._cache[SaveBase._cache._length++]=this;
			this._newSubmit && (context._curSubmit=Submit.RENDERBASE);
		}

		SaveBase._createArray=function(){
			var value=[];
			value._length=0;
			return value;
		}

		SaveBase._init=function(){
			var namemap=SaveBase._namemap={};
			namemap[0x1]="ALPHA";
			namemap[0x2]="fillStyle";
			namemap[0x8]="font";
			namemap[0x100]="lineWidth";
			namemap[0x200]="strokeStyle";
			namemap[0x2000]="_mergeID";
			namemap[0x400]=
			namemap[0x800]=
			namemap[0x1000]=[];
			namemap[0x4000]="textBaseline";
			namemap[0x8000]="textAlign";
			namemap[0x10000]="_nBlendType";
			namemap[0x80000]="shader";
			namemap[0x100000]="filters";
			return namemap;
		}

		SaveBase.save=function(context,type,dataObj,newSubmit){
			if ((context._saveMark._saveuse & type)!==type){
				context._saveMark._saveuse |=type;
				var cache=SaveBase._cache;
				var o=cache._length > 0 ?cache[--cache._length] :(new SaveBase());
				o._value=dataObj[ o._valueName=SaveBase._namemap[type]];
				o._dataObj=dataObj;
				o._newSubmit=newSubmit;
				var _save=context._save;
				_save[_save._length++]=o;
			}
		}

		SaveBase._cache=laya.webgl.canvas.save.SaveBase._createArray();
		SaveBase._namemap=SaveBase._init();
		return SaveBase;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveClipRect
	var SaveClipRect=(function(){
		function SaveClipRect(){
			//this._clipSaveRect=null;
			//this._submitScissor=null;
			this._clipRect=new Rectangle();
		}

		__class(SaveClipRect,'laya.webgl.canvas.save.SaveClipRect');
		var __proto=SaveClipRect.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			context._clipRect=this._clipSaveRect;
			SaveClipRect._cache[SaveClipRect._cache._length++]=this;
			this._submitScissor.submitLength=context._submits._length-this._submitScissor.submitIndex;
			context._curSubmit=Submit.RENDERBASE;
		}

		SaveClipRect.save=function(context,submitScissor){
			if ((context._saveMark._saveuse & 0x20000)==0x20000)return;
			context._saveMark._saveuse |=0x20000;
			var cache=SaveClipRect._cache;
			var o=cache._length > 0?cache[--cache._length]:(new SaveClipRect());
			o._clipSaveRect=context._clipRect;
			context._clipRect=o._clipRect.copyFrom(context._clipRect);
			o._submitScissor=submitScissor;
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveClipRect._cache=SaveBase._createArray();
		return SaveClipRect;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveMark
	var SaveMark=(function(){
		function SaveMark(){
			this._saveuse=0;
			//this._preSaveMark=null;
			;
		}

		__class(SaveMark,'laya.webgl.canvas.save.SaveMark');
		var __proto=SaveMark.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){
			return true;
		}

		__proto.restore=function(context){
			context._saveMark=this._preSaveMark;
			SaveMark._no[SaveMark._no._length++]=this;
		}

		SaveMark.Create=function(context){
			var no=SaveMark._no;
			var o=no._length > 0?no[--no._length]:(new SaveMark());
			o._saveuse=0;
			o._preSaveMark=context._saveMark;
			context._saveMark=o;
			return o;
		}

		SaveMark._no=SaveBase._createArray();
		return SaveMark;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveTransform
	var SaveTransform=(function(){
		function SaveTransform(){
			//this._savematrix=null;
			this._matrix=new Matrix();
		}

		__class(SaveTransform,'laya.webgl.canvas.save.SaveTransform');
		var __proto=SaveTransform.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			context._curMat=this._savematrix;
			SaveTransform._no[SaveTransform._no._length++]=this;
		}

		SaveTransform.save=function(context){
			var _saveMark=context._saveMark;
			if ((_saveMark._saveuse & 0x800)===0x800)return;
			_saveMark._saveuse |=0x800;
			var no=SaveTransform._no;
			var o=no._length > 0?no[--no._length]:(new SaveTransform());
			o._savematrix=context._curMat;
			context._curMat=context._curMat.copyTo(o._matrix);
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveTransform._no=SaveBase._createArray();
		return SaveTransform;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.save.SaveTranslate
	var SaveTranslate=(function(){
		function SaveTranslate(){
			//this._x=NaN;
			//this._y=NaN;
		}

		__class(SaveTranslate,'laya.webgl.canvas.save.SaveTranslate');
		var __proto=SaveTranslate.prototype;
		Laya.imps(__proto,{"laya.webgl.canvas.save.ISaveData":true})
		__proto.isSaveMark=function(){return false;}
		__proto.restore=function(context){
			var mat=context._curMat;
			context._x=this._x;
			context._y=this._y;
			SaveTranslate._no[SaveTranslate._no._length++]=this;
		}

		SaveTranslate.save=function(context){
			var no=SaveTranslate._no;
			var o=no._length > 0?no[--no._length]:(new SaveTranslate());
			o._x=context._x;
			o._y=context._y;
			var _save=context._save;
			_save[_save._length++]=o;
		}

		SaveTranslate._no=SaveBase._createArray();
		return SaveTranslate;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.resource.RenderTargetMAX
	var RenderTargetMAX=(function(){
		var OneTarget;
		function RenderTargetMAX(){
			this.targets=null;
			this.oneTargets=null;
			this.repaint=false;
			this._width=NaN;
			this._height=NaN;
			this._clipRect=new Rectangle();
		}

		__class(RenderTargetMAX,'laya.webgl.resource.RenderTargetMAX');
		var __proto=RenderTargetMAX.prototype;
		__proto.size=function(w,h){
			if (this._width===w && this._height===h)return;
			this.repaint=true;
			this._width=w;
			this._height=h;
			if (!this.oneTargets)
				this.oneTargets=new OneTarget(w,h);
			else
			this.oneTargets.target.size(w,h);
		}

		__proto._flushToTarget=function(context,target){
			var worldScissorTest=RenderState2D.worldScissorTest;
			var preworldClipRect=RenderState2D.worldClipRect;
			RenderState2D.worldClipRect=this._clipRect;
			this._clipRect.x=this._clipRect.y=0;
			this._clipRect.width=this._width;
			this._clipRect.height=this._height;
			RenderState2D.worldScissorTest=false;
			WebGL.mainContext.disable(0x0C11);
			var preAlpha=RenderState2D.worldAlpha;
			var preMatrix4=RenderState2D.worldMatrix4;
			var preMatrix=RenderState2D.worldMatrix;
			var preFilters=RenderState2D.worldFilters;
			var preShaderDefines=RenderState2D.worldShaderDefines;
			RenderState2D.worldMatrix=RenderTargetMAX._matrixDefault;
			RenderState2D.restoreTempArray();
			RenderState2D.worldMatrix4=RenderState2D.TEMPMAT4_ARRAY;
			RenderState2D.worldAlpha=1;
			RenderState2D.worldFilters=null;
			RenderState2D.worldShaderDefines=null;
			Shader.activeShader=null;
			target.start();
			Config.showCanvasMark ? target.clear(0,1,0,0.3):target.clear(0,0,0,0);
			context.flush();
			target.end();
			Shader.activeShader=null;
			RenderState2D.worldAlpha=preAlpha;
			RenderState2D.worldMatrix4=preMatrix4;
			RenderState2D.worldMatrix=preMatrix;
			RenderState2D.worldFilters=preFilters;
			RenderState2D.worldShaderDefines=preShaderDefines;
			RenderState2D.worldScissorTest=worldScissorTest
			if (worldScissorTest){
				var y=RenderState2D.height-preworldClipRect.y-preworldClipRect.height;
				WebGL.mainContext.scissor(preworldClipRect.x,y,preworldClipRect.width,preworldClipRect.height);
				WebGL.mainContext.enable(0x0C11);
			}
			RenderState2D.worldClipRect=preworldClipRect;
		}

		__proto.flush=function(context){
			if (this.repaint){
				this._flushToTarget(context,this.oneTargets.target);
				this.repaint=false;
			}
		}

		__proto.drawTo=function(context,x,y,width,height){
			context.drawTexture(this.oneTargets.target.getTexture(),x,y,width,height,0,0);
		}

		__proto.destroy=function(){
			if (this.oneTargets){
				this.oneTargets.target.destroy();
				this.oneTargets.target=null;
				this.oneTargets=null;
			}
		}

		__static(RenderTargetMAX,
		['_matrixDefault',function(){return this._matrixDefault=new Matrix();}
		]);
		RenderTargetMAX.__init$=function(){
			//class OneTarget
			OneTarget=(function(){
				function OneTarget(w,h){
					//this.x=NaN;
					//this.y=NaN;
					//this.width=NaN;
					//this.height=NaN;
					//this.target=null;
					this.width=w;
					this.height=h;
					this.target=RenderTarget2D.create(w,h);
				}
				__class(OneTarget,'');
				return OneTarget;
			})()
		}

		return RenderTargetMAX;
	})()


	/**
	*...
	*@author
	*/
	//class laya.webgl.shader.d2.fillTexture.FillTextureSprite
	var FillTextureSprite=(function(){
		function FillTextureSprite(){
			this.mVBBuffer=null;
			this.mIBBuffer=null;
			this.mVBData=null;
			this.mIBData=null;
			this.mEleNum=0;
			this.mShaderValue=null;
			this.mTexture=null;
			this.transform=null;
		}

		__class(FillTextureSprite,'laya.webgl.shader.d2.fillTexture.FillTextureSprite');
		var __proto=FillTextureSprite.prototype;
		__proto.initTexture=function(texture,x,y,width,height,offsetX,offsetY){
			this.mTexture=texture;
			if (this.mVBBuffer){
				this.mVBBuffer.dispose();
			}
			if (this.mIBBuffer){
				this.mIBBuffer.dispose();
			}
			this.mVBBuffer=VertexBuffer2D.create();
			this.mIBBuffer=IndexBuffer2D.create();
			this.mIBData=new Uint16Array();
			var tVBArray;
			var tIBArray;
			tVBArray=[];
			var w=texture.bitmap.width,h=texture.bitmap.height,uv=texture.uv;
			var tTextureX=uv[0] *w;
			var tTextureY=uv[1] *h;
			var tTextureW=(uv[2]-uv[0])*w;
			var tTextureH=(uv[5]-uv[3])*h;
			var tU=width / tTextureW;
			var tV=height / tTextureH;
			var tWidth=width;
			var tHeight=height;
			var tRed=1;
			var tGreed=1;
			var tBlue=1;
			var tAlpha=1;
			tVBArray.push(x,y,0,0,tRed,tGreed,tBlue,tAlpha);
			tVBArray.push(x+tWidth,y,tU,0,tRed,tGreed,tBlue,tAlpha);
			tVBArray.push(x+tWidth,y+tHeight,tU,tV,tRed,tGreed,tBlue,tAlpha);
			tVBArray.push(x,y+tHeight,0,tV,tRed,tGreed,tBlue,tAlpha);
			tIBArray=[];
			tIBArray.push(0,1,3,3,1,2);
			this.mEleNum=tIBArray.length;
			this.mVBData=new Float32Array(tVBArray);
			this.mIBData=new Uint16Array(tIBArray);
			this.mVBBuffer.append(this.mVBData);
			this.mIBBuffer.append(this.mIBData);
			this.mTexture=texture;
			if (this.mShaderValue==null){
				this.mShaderValue=new FillTextureShaderValue();
			}
			this.mShaderValue.u_offset[0]=-offsetX / tTextureW;
			this.mShaderValue.u_offset[1]=-offsetY / tTextureH;
			this.mShaderValue.u_texRange[0]=tTextureX / w;
			this.mShaderValue.u_texRange[1]=tTextureW / w;
			this.mShaderValue.u_texRange[2]=tTextureY / h;
			this.mShaderValue.u_texRange[3]=tTextureH / h;
		}

		__proto.render=function(context,x,y){
			if (Render.isWebGL){
				this.mShaderValue.textureHost=this.mTexture;
				context.setIBVB(x,y,this.mIBBuffer,this.mVBBuffer,this.mEleNum,this.transform,FillTextureShader.shader,this.mShaderValue,0,0);
			}
		}

		return FillTextureSprite;
	})()


	//class laya.webgl.shader.d2.Shader2D
	var Shader2D=(function(){
		function Shader2D(){
			this.ALPHA=1;
			//this.glTexture=null;
			//this.shader=null;
			//this.filters=null;
			this.shaderType=0;
			//this.colorAdd=null;
			//this.strokeStyle=null;
			//this.fillStyle=null;
			this.defines=new ShaderDefines2D();
		}

		__class(Shader2D,'laya.webgl.shader.d2.Shader2D');
		Shader2D.__init__=function(){
			Shader.addInclude("parts/ColorFilter_ps_uniform.glsl","uniform vec4 colorAlpha;\nuniform mat4 colorMat;");
			Shader.addInclude("parts/ColorFilter_ps_logic.glsl","gl_FragColor = gl_FragColor * colorMat + colorAlpha/255.0;");
			Shader.addInclude("parts/GlowFilter_ps_uniform.glsl","uniform vec4 u_color;\nuniform float u_strength;\nuniform float u_blurX;\nuniform float u_blurY;\nuniform float u_offsetX;\nuniform float u_offsetY;\nuniform float u_textW;\nuniform float u_textH;");
			Shader.addInclude("parts/GlowFilter_ps_logic.glsl","const float c_IterationTime = 10.0;\nfloat floatIterationTotalTime = c_IterationTime * c_IterationTime;\nvec4 vec4Color = vec4(0.0,0.0,0.0,0.0);\nvec2 vec2FilterDir = vec2(-(u_offsetX)/u_textW,-(u_offsetY)/u_textH);\nvec2 vec2FilterOff = vec2(u_blurX/u_textW/c_IterationTime * 2.0,u_blurY/u_textH/c_IterationTime * 2.0);\nfloat maxNum = u_blurX * u_blurY;\nvec2 vec2Off = vec2(0.0,0.0);\nfloat floatOff = c_IterationTime/2.0;\nfor(float i = 0.0;i<=c_IterationTime; ++i){\n	for(float j = 0.0;j<=c_IterationTime; ++j){\n		vec2Off = vec2(vec2FilterOff.x * (i - floatOff),vec2FilterOff.y * (j - floatOff));\n		vec4Color += texture2D(texture, v_texcoord + vec2FilterDir + vec2Off)/floatIterationTotalTime;\n	}\n}\ngl_FragColor = vec4(u_color.rgb,vec4Color.a * u_strength);");
			Shader.addInclude("parts/BlurFilter_ps_logic.glsl","gl_FragColor=vec4(0.0);\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 0])*0.004431848411938341;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 1])*0.05399096651318985;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 2])*0.2419707245191454;\ngl_FragColor += texture2D(texture, v_texcoord        )*0.3989422804014327;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 3])*0.2419707245191454;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 4])*0.05399096651318985;\ngl_FragColor += texture2D(texture, vBlurTexCoords[ 5])*0.004431848411938341;");
			Shader.addInclude("parts/BlurFilter_ps_uniform.glsl","varying vec2 vBlurTexCoords[6];");
			Shader.addInclude("parts/BlurFilter_vs_uniform.glsl","uniform float strength;\nvarying vec2 vBlurTexCoords[6];");
			Shader.addInclude("parts/BlurFilter_vs_logic.glsl","\nvBlurTexCoords[ 0] = v_texcoord + vec2(-0.012 * strength, 0.0);\nvBlurTexCoords[ 1] = v_texcoord + vec2(-0.008 * strength, 0.0);\nvBlurTexCoords[ 2] = v_texcoord + vec2(-0.004 * strength, 0.0);\nvBlurTexCoords[ 3] = v_texcoord + vec2( 0.004 * strength, 0.0);\nvBlurTexCoords[ 4] = v_texcoord + vec2( 0.008 * strength, 0.0);\nvBlurTexCoords[ 5] = v_texcoord + vec2( 0.012 * strength, 0.0);");
			Shader.addInclude("parts/ColorAdd_ps_uniform.glsl","uniform vec4 colorAdd;\n");
			Shader.addInclude("parts/ColorAdd_ps_logic.glsl","gl_FragColor = vec4(colorAdd.rgb,colorAdd.a*gl_FragColor.a);");
			var vs,ps;
			vs="attribute vec4 position;\nattribute vec2 texcoord;\nuniform vec2 size;\n\n#ifdef WORLDMAT\nuniform mat4 mmat;\n#endif\nvarying vec2 v_texcoord;\n\n#include?BLUR_FILTER  \"parts/BlurFilter_vs_uniform.glsl\";\nvoid main() {\n  #ifdef WORLDMAT\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  #else\n  gl_Position =vec4((position.x/size.x-0.5)*2.0,(0.5-position.y/size.y)*2.0,position.z,1.0);\n  #endif\n  \n  v_texcoord = texcoord;\n  #include?BLUR_FILTER  \"parts/BlurFilter_vs_logic.glsl\";\n}";
			ps="precision mediump float;\n//precision highp float;\nvarying vec2 v_texcoord;\nuniform sampler2D texture;\nuniform float alpha;\n#include?BLUR_FILTER  \"parts/BlurFilter_ps_uniform.glsl\";\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\n#include?GLOW_FILTER \"parts/GlowFilter_ps_uniform.glsl\";\n#include?COLOR_ADD \"parts/ColorAdd_ps_uniform.glsl\";\n\nvoid main() {\n   vec4 color= texture2D(texture, v_texcoord);\n   color.a*=alpha;\n   gl_FragColor=color;\n   #include?COLOR_ADD \"parts/ColorAdd_ps_logic.glsl\";   \n   #include?BLUR_FILTER  \"parts/BlurFilter_ps_logic.glsl\";\n   #include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n   #include?GLOW_FILTER \"parts/GlowFilter_ps_logic.glsl\";\n}";
			Shader.preCompile(0,0x01,vs,ps,null);
			vs="attribute vec4 position;\nuniform vec2 size;\nuniform mat4 mmat;\nvoid main() {\n  vec4 pos=mmat*position;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n}";
			ps="precision mediump float;\nuniform vec4 color;\nuniform float alpha;\n#include?COLOR_FILTER \"parts/ColorFilter_ps_uniform.glsl\";\nvoid main() {\n	vec4 a = vec4(color.r, color.g, color.b, color.a);\n	a.w = alpha;\n	gl_FragColor = a;\n	#include?COLOR_FILTER \"parts/ColorFilter_ps_logic.glsl\";\n}";
			Shader.preCompile(0,0x02,vs,ps,null);
			vs="attribute vec4 position;\nattribute vec3 a_color;\nuniform mat4 mmat;\nuniform mat4 u_mmat2;\nuniform vec2 u_pos;\nuniform vec2 size;\nvarying vec3 color;\nvoid main(){\n  vec4 tPos = vec4(position.x + u_pos.x,position.y + u_pos.y,position.z,position.w);\n  vec4 pos=mmat*u_mmat2*tPos;\n  gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  color=a_color;\n}";
			ps="precision mediump float;\n//precision mediump float;\nvarying vec3 color;\nuniform float alpha;\nvoid main(){\n	//vec4 a=vec4(color.r, color.g, color.b, 1);\n	//a.a*=alpha;\n    gl_FragColor=vec4(color.r, color.g, color.b, alpha);\n}";
			Shader.preCompile(0,0x04,vs,ps,null);
		}

		return Shader2D;
	})()


	/**
	*这里销毁的问题，后面待确认
	*@author ...
	*/
	//class laya.webgl.shader.d2.skinAnishader.SkinMesh
	var SkinMesh=(function(){
		function SkinMesh(){
			this.mVBBuffer=null;
			this.mIBBuffer=null;
			this.mVBData=null;
			this.mIBData=null;
			this.mEleNum=0;
			this.mShaderValue=null;
			this.mTexture=null;
			this.transform=null;
		}

		__class(SkinMesh,'laya.webgl.shader.d2.skinAnishader.SkinMesh');
		var __proto=SkinMesh.prototype;
		__proto.init=function(texture,vs,ps){
			this.mVBBuffer=VertexBuffer2D.create();
			this.mIBBuffer=IndexBuffer2D.create();
			this.mIBData=new Uint16Array();
			var tVBArray;
			var tIBArray;
			if (vs){
				tVBArray=vs;
				}else {
				tVBArray=[];
				var tWidth=texture.width;
				var tHeight=texture.height;
				var tRed=1;
				var tGreed=1;
				var tBlue=1;
				var tAlpha=1;
				tVBArray.push(0,0,0,0,tRed,tGreed,tBlue,tAlpha);
				tVBArray.push(tWidth,0,1,0,tRed,tGreed,tBlue,tAlpha);
				tVBArray.push(tWidth,tHeight,1,1,tRed,tGreed,tBlue,tAlpha);
				tVBArray.push(0,tHeight,0,1,tRed,tGreed,tBlue,tAlpha);
			}
			if (ps){
				tIBArray=ps;
				}else {
				tIBArray=[];
				tIBArray.push(0,1,3,3,1,2);
			}
			this.mEleNum=tIBArray.length;
			this.mVBData=new Float32Array(tVBArray);
			this.mIBData=new Uint16Array(tIBArray);
			this.mVBBuffer.append(this.mVBData);
			this.mIBBuffer.append(this.mIBData);
			this.mTexture=texture;
			if (this.mShaderValue==null){
				this.mShaderValue=new aniShaderValue1();
			}
		}

		__proto.render=function(context,x,y){
			if (Render.isWebGL){
				this.mShaderValue.textureHost=this.mTexture;
				(context).setIBVB(x,y,this.mIBBuffer,this.mVBBuffer,this.mEleNum,this.transform,SkinAniShader1.shader,this.mShaderValue,0,0);
			}
		}

		return SkinMesh;
	})()


	//此类可以减少代码
	//class laya.webgl.shapes.BasePoly
	var BasePoly=(function(){
		function BasePoly(x,y,width,height,edges,color,borderWidth,borderColor,round){
			//this.x=NaN;
			//this.y=NaN;
			//this.r=NaN;
			//this.width=NaN;
			//this.height=NaN;
			//this.edges=NaN;
			this.r0=0
			//this.color=0;
			//this.borderColor=NaN;
			//this.borderWidth=NaN;
			//this.round=0;
			this.fill=true;
			this.r1=Math.PI / 2;
			(round===void 0)&& (round=0);
			this.x=x;
			this.y=y;
			this.width=width;
			this.height=height;
			this.edges=edges;
			this.color=color;
			this.borderWidth=borderWidth;
			this.borderColor=borderColor;
		}

		__class(BasePoly,'laya.webgl.shapes.BasePoly');
		var __proto=BasePoly.prototype;
		Laya.imps(__proto,{"laya.webgl.shapes.IShape":true})
		__proto.getData=function(ib,vb,start){}
		__proto.sector=function(outVert,outIndex,start){
			var x=this.x,y=this.y,edges=this.edges,seg=(this.r1-this.r0)/ edges;
			var w=this.width,h=this.height,color=this.color;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			outVert.push(x,y,r,g,b);
			for (var i=0;i < edges+1;i++){
				outVert.push(x+Math.sin(seg *i+this.r0)*w,y+Math.cos(seg *i+this.r0)*h);
				outVert.push(r,g,b);
			}
			for (i=0;i < edges;i++){
				outIndex.push(start,start+i+1,start+i+2);
			}
		}

		//用于画线
		__proto.createLine2=function(p,indices,lineWidth,len,outVertex,indexCount){
			var points=p.concat();
			var result=outVertex;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			var length=points.length / 2;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[2];
			p2y=points[3];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx+this.x,p1y-perpy+this.y,r,g,b,p1x+perpx+this.x,p1y+perpy+this.y,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*2];
				p1y=points[(i-1)*2+1];
				p2x=points[(i)*2];
				p2y=points[(i)*2+1];
				p3x=points[(i+1)*2];
				p3y=points[(i+1)*2+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx+this.x,p2y-perpy+this.y,r,g,b,p2x+perpx+this.x,p2y+perpy+this.y,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px+this.x,py+this.y,r,g,b,p2x-(px-p2x)+this.x,p2y-(py-p2y)+this.y,r,g,b);
			}
			p1x=points[points.length-4];
			p1y=points[points.length-3];
			p2x=points[points.length-2];
			p2y=points[points.length-1];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p2x-perpx+this.x,p2y-perpy+this.y,r,g,b,p2x+perpx+this.x,p2y+perpy+this.y,r,g,b);
			var groupLen=indexCount;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			return result;
		}

		//用于比如 扇形 不带两直线
		__proto.createLine=function(p,indices,lineWidth,len){
			var points=p.concat();
			var result=p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			points.splice(0,5);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			p1x=points[points.length-10];
			p1y=points[points.length-9];
			p2x=points[points.length-5];
			p2y=points[points.length-4];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			return result;
		}

		//闭合路径
		__proto.createLoopLine=function(p,indices,lineWidth,len,outVertex,outIndex){
			var points=p.concat();
			var result=outVertex ? outVertex :p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			points.splice(0,5);
			var firstPoint=[points[0],points[1]];
			var lastPoint=[points[points.length-5],points[points.length-4]];
			var midPointX=lastPoint[0]+(firstPoint[0]-lastPoint[0])*0.5;
			var midPointY=lastPoint[1]+(firstPoint[1]-lastPoint[1])*0.5;
			points.unshift(midPointX,midPointY,0,0,0);
			points.push(midPointX,midPointY,0,0,0);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			if (outIndex){
				indices=outIndex;
			};
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+1,iStart+1,iStart,iStart+(i-1)*2);
			return result;
		}

		return BasePoly;
	})()


	/**
	*...
	*@author River
	*/
	//class laya.webgl.submit.Submit
	var Submit=(function(){
		function Submit(renderType){
			//this._selfVb=null;
			//this._ib=null;
			//this._blendFn=null;
			//this._renderType=0;
			//this._vb=null;
			//this._startIdx=0;
			//this._numEle=0;
			//this.shaderValue=null;
			(renderType===void 0)&& (renderType=1);
			this._renderType=renderType;
		}

		__class(Submit,'laya.webgl.submit.Submit');
		var __proto=Submit.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.releaseRender=function(){
			var cache=Submit._cache;
			cache[cache._length++]=this;
			this.shaderValue.release();
			this._vb=null;
		}

		__proto.getRenderType=function(){
			return this._renderType;
		}

		__proto.renderSubmit=function(){
			if (this._numEle===0)return 1;
			var _tex=this.shaderValue.textureHost;
			if (_tex){
				var source=_tex.source;
				if (!_tex.bitmap || !source)
					return 1;
				this.shaderValue.texture=source;
			}
			this._vb.bind_upload(this._ib);
			var gl=WebGL.mainContext;
			this.shaderValue.upload();
			if (BlendMode.activeBlendFunction!==this._blendFn){
				gl.enable(0x0BE2);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle / 3;
			gl.drawElements(0x0004,this._numEle,0x1403,this._startIdx);
			return 1;
		}

		Submit.__init__=function(){
			var s=Submit.RENDERBASE=new Submit(-1);
			s.shaderValue=new Value2D(0,0);
			s.shaderValue.ALPHA=-1234;
		}

		Submit.create=function(context,ib,vb,pos,sv){
			var o=Submit._cache._length ? Submit._cache[--Submit._cache._length] :new Submit();
			if (vb==null){
				vb=o._selfVb || (o._selfVb=VertexBuffer2D.create(-1));
				vb.clear();
				pos=0;
			}
			o._ib=ib;
			o._vb=vb;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			var blendType=context._nBlendType;
			o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			var filters=context._shader2D.filters;
			filters && o.shaderValue.setFilters(filters);
			return o;
		}

		Submit.createShape=function(ctx,ib,vb,numEle,offset,sv){
			var o=(!Submit._cache._length)? (new Submit()):Submit._cache[--Submit._cache._length];
			o._ib=ib;
			o._vb=vb;
			o._numEle=numEle;
			o._startIdx=offset;
			o.shaderValue=sv;
			o.shaderValue.setValue(ctx._shader2D);
			var blendType=ctx._nBlendType;
			o._blendFn=ctx._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			return o;
		}

		Submit.TYPE_2D=1;
		Submit.TYPE_CANVAS=3;
		Submit.TYPE_CMDSETRT=4;
		Submit.TYPE_CUSTOM=5;
		Submit.TYPE_BLURRT=6;
		Submit.TYPE_CMDDESTORYPRERT=7;
		Submit.TYPE_DISABLESTENCIL=8;
		Submit.TYPE_OTHERIBVB=9;
		Submit.TYPE_PRIMITIVE=10;
		Submit.TYPE_RT=11;
		Submit.TYPE_BLUR_RT=12;
		Submit.TYPE_TARGET=13;
		Submit.TYPE_CHANGE_VALUE=14;
		Submit.TYPE_SHAPE=15;
		Submit.TYPE_TEXTURE=16;
		Submit.RENDERBASE=null
		Submit._cache=(Submit._cache=[],Submit._cache._length=0,Submit._cache);
		return Submit;
	})()


	//class laya.webgl.submit.SubmitCMD
	var SubmitCMD=(function(){
		function SubmitCMD(){
			this.fun=null;
			this.args=null;
		}

		__class(SubmitCMD,'laya.webgl.submit.SubmitCMD');
		var __proto=SubmitCMD.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			this.fun.apply(null,this.args);
			return 1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitCMD._cache;
			cache[cache._length++]=this;
		}

		SubmitCMD.create=function(args,fun){
			var o=SubmitCMD._cache._length?SubmitCMD._cache[--SubmitCMD._cache._length]:new SubmitCMD();
			o.fun=fun;
			o.args=args;
			return o;
		}

		SubmitCMD._cache=(SubmitCMD._cache=[],SubmitCMD._cache._length=0,SubmitCMD._cache);
		return SubmitCMD;
	})()


	//class laya.webgl.submit.SubmitCMDScope
	var SubmitCMDScope=(function(){
		function SubmitCMDScope(){
			this.variables={};
		}

		__class(SubmitCMDScope,'laya.webgl.submit.SubmitCMDScope');
		var __proto=SubmitCMDScope.prototype;
		__proto.getValue=function(name){
			return this.variables[name];
		}

		__proto.addValue=function(name,value){
			return this.variables[name]=value;
		}

		__proto.setValue=function(name,value){
			if(this.variables.hasOwnProperty(name)){
				return this.variables[name]=value;
			}
			return null;
		}

		__proto.clear=function(){
			for(var key in this.variables){
				delete this.variables[key];
			}
		}

		__proto.recycle=function(){
			this.clear();
			SubmitCMDScope.POOL.push(this);
		}

		SubmitCMDScope.create=function(){
			var scope=SubmitCMDScope.POOL.pop();
			scope||(scope=new SubmitCMDScope());
			return scope;
		}

		SubmitCMDScope.POOL=[];
		return SubmitCMDScope;
	})()


	/**
	*...
	*@author wk
	*/
	//class laya.webgl.submit.SubmitOtherIBVB
	var SubmitOtherIBVB=(function(){
		function SubmitOtherIBVB(){
			this.offset=0;
			//this._vb=null;
			//this._ib=null;
			//this._blendFn=null;
			//this._mat=null;
			//this._shader=null;
			//this._shaderValue=null;
			//this._numEle=0;
			this.startIndex=0;
			;
			this._mat=Matrix.create();
		}

		__class(SubmitOtherIBVB,'laya.webgl.submit.SubmitOtherIBVB');
		var __proto=SubmitOtherIBVB.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.releaseRender=function(){
			var cache=SubmitOtherIBVB._cache;
			cache[cache._length++]=this;
		}

		__proto.getRenderType=function(){
			return 9;
		}

		__proto.renderSubmit=function(){
			var _tex=this._shaderValue.textureHost;
			if (_tex){
				var source=_tex.source;
				if (!_tex.bitmap || !source)
					return 1;
				this._shaderValue.texture=source;
			}
			this._vb.bind_upload(this._ib);
			var w=RenderState2D.worldMatrix4;
			var wmat=Matrix.TEMP;
			Matrix.mulPre(this._mat,w[0],w[1],w[4],w[5],w[12],w[13],wmat);
			var tmp=RenderState2D.worldMatrix4=SubmitOtherIBVB.tempMatrix4;
			tmp[0]=wmat.a;
			tmp[1]=wmat.b;
			tmp[4]=wmat.c;
			tmp[5]=wmat.d;
			tmp[12]=wmat.tx;
			tmp[13]=wmat.ty;
			this._shader._offset=this.offset;
			this._shaderValue.refresh();
			this._shader.upload(this._shaderValue);
			this._shader._offset=0;
			var gl=WebGL.mainContext;
			if (BlendMode.activeBlendFunction!==this._blendFn){
				gl.enable(0x0BE2);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle/3;
			gl.drawElements(0x0004,this._numEle,0x1403,this.startIndex);
			RenderState2D.worldMatrix4=w;
			Shader.activeShader=null;
			return 1;
		}

		SubmitOtherIBVB.create=function(context,vb,ib,numElement,shader,shaderValue,startIndex,offset){
			var o=(!SubmitOtherIBVB._cache._length)?(new SubmitOtherIBVB()):SubmitOtherIBVB._cache[--SubmitOtherIBVB._cache._length];
			o._ib=ib;
			o._vb=vb;
			o._numEle=numElement;
			o._shader=shader;
			o._shaderValue=shaderValue;
			var blendType=context._nBlendType;
			o._blendFn=context._targets?BlendMode.targetFns[blendType]:BlendMode.fns[blendType];
			o.offset=0;
			o.startIndex=offset / (CONST3D2D.BYTES_PE *vb.vertexStride)*1.5;
			o.startIndex *=CONST3D2D.BYTES_PIDX;
			return o;
		}

		SubmitOtherIBVB._cache=(SubmitOtherIBVB._cache=[],SubmitOtherIBVB._cache._length=0,SubmitOtherIBVB._cache);
		SubmitOtherIBVB.tempMatrix4=[
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1,];
		return SubmitOtherIBVB;
	})()


	//class laya.webgl.submit.SubmitScissor
	var SubmitScissor=(function(){
		function SubmitScissor(){
			this.submitIndex=0;
			this.submitLength=0;
			this.context=null;
			this.clipRect=new Rectangle();
			this.screenRect=new Rectangle();
		}

		__class(SubmitScissor,'laya.webgl.submit.SubmitScissor');
		var __proto=SubmitScissor.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto._scissor=function(x,y,w,h){
			var m=RenderState2D.worldMatrix4;
			var a=m[0],d=m[5],tx=m[12],ty=m[13];
			x=x *a+tx;
			y=y *d+ty;
			w *=a;
			h *=d;
			if (w < 1 || h < 1){
				return false;
			};
			var r=x+w;
			var b=y+h;
			x < 0 && (x=0,w=r-x);
			y < 0 && (y=0,h=b-y);
			var screen=RenderState2D.worldClipRect;
			x=Math.max(x,screen.x);
			y=Math.max(y,screen.y);
			w=Math.min(r,screen.right)-x;
			h=Math.min(b,screen.bottom)-y;
			if (w < 1 || h < 1){
				return false;
			};
			var worldScissorTest=RenderState2D.worldScissorTest;
			this.screenRect.copyFrom(screen);
			screen.x=x;
			screen.y=y;
			screen.width=w;
			screen.height=h;
			RenderState2D.worldScissorTest=true;
			y=RenderState2D.height-y-h;
			WebGL.mainContext.scissor(x,y,w,h);
			WebGL.mainContext.enable(0x0C11);
			this.context.submitElement(this.submitIndex,this.submitIndex+this.submitLength);
			if (worldScissorTest){
				y=RenderState2D.height-this.screenRect.y-this.screenRect.height;
				WebGL.mainContext.scissor(this.screenRect.x,y,this.screenRect.width,this.screenRect.height);
				WebGL.mainContext.enable(0x0C11);
			}
			else{
				WebGL.mainContext.disable(0x0C11);
				RenderState2D.worldScissorTest=false;
			}
			screen.copyFrom(this.screenRect);
			return true;
		}

		__proto._scissorWithTagart=function(x,y,w,h){
			if (w < 1 || h < 1){
				return false;
			};
			var r=x+w;
			var b=y+h;
			x < 0 && (x=0,w=r-x);
			y < 0 && (y=0,h=b-y);
			var screen=RenderState2D.worldClipRect;
			x=Math.max(x,screen.x);
			y=Math.max(y,screen.y);
			w=Math.min(r,screen.right)-x;
			h=Math.min(b,screen.bottom)-y;
			if (w < 1 || h < 1){
				return false;
			};
			var worldScissorTest=RenderState2D.worldScissorTest;
			this.screenRect.copyFrom(screen);
			RenderState2D.worldScissorTest=true;
			screen.x=x;
			screen.y=y;
			screen.width=w;
			screen.height=h;
			y=RenderState2D.height-y-h;
			WebGL.mainContext.scissor(x,y,w,h);
			WebGL.mainContext.enable(0x0C11);
			this.context.submitElement(this.submitIndex,this.submitIndex+this.submitLength);
			if (worldScissorTest){
				y=RenderState2D.height-this.screenRect.y-this.screenRect.height;
				WebGL.mainContext.scissor(this.screenRect.x,y,this.screenRect.width,this.screenRect.height);
				WebGL.mainContext.enable(0x0C11);
			}
			else{
				WebGL.mainContext.disable(0x0C11);
				RenderState2D.worldScissorTest=false;
			}
			screen.copyFrom(this.screenRect);
			return true;
		}

		__proto.renderSubmit=function(){
			this.submitLength=Math.min(this.context._submits._length-1,this.submitLength);
			if (this.submitLength < 1 || this.clipRect.width < 1 || this.clipRect.height < 1)
				return this.submitLength+1;
			if (this.context._targets)
				this._scissorWithTagart(this.clipRect.x,this.clipRect.y,this.clipRect.width,this.clipRect.height);
			else this._scissor(this.clipRect.x,this.clipRect.y,this.clipRect.width,this.clipRect.height);
			return this.submitLength+1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitScissor._cache;
			cache[cache._length++]=this;
			this.context=null;
		}

		SubmitScissor.create=function(context){
			var o=SubmitScissor._cache._length?SubmitScissor._cache[--SubmitScissor._cache._length]:new SubmitScissor();
			o.context=context;
			return o;
		}

		SubmitScissor._cache=(SubmitScissor._cache=[],SubmitScissor._cache._length=0,SubmitScissor._cache);
		return SubmitScissor;
	})()


	//class laya.webgl.submit.SubmitStencil
	var SubmitStencil=(function(){
		function SubmitStencil(){
			this.step=0;
			this.blendMode=null;
			this.level=0;
		}

		__class(SubmitStencil,'laya.webgl.submit.SubmitStencil');
		var __proto=SubmitStencil.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			switch(this.step){
				case 1:
					this.do1();
					break ;
				case 2:
					this.do2();
					break ;
				case 3:
					this.do3();
					break ;
				case 4:
					this.do4();
					break ;
				case 5:
					this.do5();
					break ;
				case 6:
					this.do6();
					break ;
				}
			return 1;
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitStencil._cache;
			cache[cache._length++]=this;
		}

		__proto.do1=function(){
			var gl=WebGL.mainContext;
			gl.enable(0x0B90);
			gl.clear(0x00000400);
			gl.colorMask(false,false,false,false);
			gl.stencilFunc(0x0202,this.level,0xFF);
			gl.stencilOp(0x1E00,0x1E00,0x1E02);
		}

		//gl.stencilOp(WebGLContext.KEEP,WebGLContext.KEEP,WebGLContext.INVERT);//测试通过给模版缓冲 写入值 一开始是0 现在是 0xFF (模版缓冲中不知道是多少位的数据)
		__proto.do2=function(){
			var gl=WebGL.mainContext;
			gl.stencilFunc(0x0202,this.level+1,0xFF);
			gl.colorMask(true,true,true,true);
			gl.stencilOp(0x1E00,0x1E00,0x1E00);
		}

		__proto.do3=function(){
			var gl=WebGL.mainContext;
			gl.colorMask(true,true,true,true);
			gl.stencilOp(0x1E00,0x1E00,0x1E00);
			gl.clear(0x00000400);
			gl.disable(0x0B90);
		}

		__proto.do4=function(){
			var gl=WebGL.mainContext;
			gl.enable(0x0B90);
			gl.clear(0x00000400);
			gl.colorMask(false,false,false,false);
			gl.stencilFunc(0x0207,this.level,0xFF);
			gl.stencilOp(0x1E00,0x1E00,0x150A);
		}

		__proto.do5=function(){
			var gl=WebGL.mainContext;
			gl.stencilFunc(0x0202,0xff,0xFF);
			gl.colorMask(true,true,true,true);
			gl.stencilOp(0x1E00,0x1E00,0x1E00);
		}

		__proto.do6=function(){
			var gl=WebGL.mainContext;
			BlendMode.targetFns[BlendMode.TOINT[this.blendMode]](gl);
		}

		SubmitStencil.create=function(step){
			var o=SubmitStencil._cache._length?SubmitStencil._cache[--SubmitStencil._cache._length]:new SubmitStencil();
			o.step=step;
			return o;
		}

		SubmitStencil._cache=(SubmitStencil._cache=[],SubmitStencil._cache._length=0,SubmitStencil._cache);
		return SubmitStencil;
	})()


	//class laya.webgl.submit.SubmitTarget
	var SubmitTarget=(function(){
		function SubmitTarget(){
			this._renderType=0;
			this._vb=null;
			this._ib=null;
			this._startIdx=0;
			this._numEle=0;
			this.shaderValue=null;
			this.blendType=0;
			this.proName=null;
			this.scope=null;
		}

		__class(SubmitTarget,'laya.webgl.submit.SubmitTarget');
		var __proto=SubmitTarget.prototype;
		Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
		__proto.renderSubmit=function(){
			this._vb.bind_upload(this._ib);
			var target=this.scope.getValue(this.proName);
			if (target){
				this.shaderValue.texture=target.source;
				this.shaderValue.upload();
				this.blend();
				Stat.drawCall++;
				Stat.trianglesFaces+=this._numEle/3;
				WebGL.mainContext.drawElements(0x0004,this._numEle,0x1403,this._startIdx);
			}
			return 1;
		}

		__proto.blend=function(){
			if (BlendMode.activeBlendFunction!==BlendMode.fns[this.blendType]){
				var gl=WebGL.mainContext;
				gl.enable(0x0BE2);
				BlendMode.fns[this.blendType](gl);
				BlendMode.activeBlendFunction=BlendMode.fns[this.blendType];
			}
		}

		__proto.getRenderType=function(){
			return 0;
		}

		__proto.releaseRender=function(){
			var cache=SubmitTarget._cache;
			cache[cache._length++]=this;
		}

		SubmitTarget.create=function(context,ib,vb,pos,sv,proName){
			var o=SubmitTarget._cache._length?SubmitTarget._cache[--SubmitTarget._cache._length]:new SubmitTarget();
			o._ib=ib;
			o._vb=vb;
			o.proName=proName;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			o.blendType=context._nBlendType;
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			return o;
		}

		SubmitTarget._cache=(SubmitTarget._cache=[],SubmitTarget._cache._length=0,SubmitTarget._cache);
		return SubmitTarget;
	})()


	/**
	*...特殊的字符，如泰文，必须重新实现这个类
	*@author rivetr
	*/
	//class laya.webgl.text.CharSegment
	var CharSegment=(function(){
		function CharSegment(){
			this._sourceStr=null;
		}

		__class(CharSegment,'laya.webgl.text.CharSegment');
		var __proto=CharSegment.prototype;
		Laya.imps(__proto,{"laya.webgl.text.ICharSegment":true})
		__proto.textToSpit=function(str){
			this._sourceStr=str;
		}

		__proto.getChar=function(i){
			return this._sourceStr.charAt(i);
		}

		__proto.getCharCode=function(i){
			return this._sourceStr.charCodeAt(i);
		}

		__proto.length=function(){
			return this._sourceStr.length;
		}

		return CharSegment;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.text.DrawText
	var DrawText=(function(){
		var CharValue;
		function DrawText(){};
		__class(DrawText,'laya.webgl.text.DrawText');
		DrawText.__init__=function(){
			DrawText._charsTemp=new Array;
			DrawText._drawValue=new CharValue();
			DrawText._charSeg=new CharSegment();
		}

		DrawText.customCharSeg=function(charseg){
			DrawText._charSeg=charseg;
		}

		DrawText.getChar=function(char,id,drawValue){
			return DrawText._charsCache[id]=DrawTextChar.createOneChar(char,drawValue);
		}

		DrawText._drawSlow=function(save,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy){
			var drawValue=DrawText._drawValue.value(font,fillColor,borderColor,lineWidth,sx,sy);
			var i=0,n=0;
			var chars=DrawText._charsTemp;
			var width=0,oneChar,htmlWord,id=NaN;
			if (words){
				chars.length=words.length;
				for (i=0,n=words.length;i < n;i++){
					htmlWord=words[i];
					id=htmlWord.charNum+drawValue.txtID;
					chars[i]=oneChar=DrawText._charsCache[id] || DrawText.getChar(htmlWord.char,id,drawValue);
					oneChar.active();
				}
				}else {
				if ((txt instanceof laya.utils.WordText ))
					DrawText._charSeg.textToSpit((txt).toString());
				else
				DrawText._charSeg.textToSpit(txt);
				var len=/*if err,please use iflash.method.xmlLength()*/DrawText._charSeg.length();
				chars.length=len;
				for (i=0,n=len;i < n;i++){
					id=DrawText._charSeg.getCharCode(i)+drawValue.txtID;
					chars[i]=oneChar=DrawText._charsCache[id] || DrawText.getChar(DrawText._charSeg.getChar(i),id,drawValue);
					oneChar.active();
					width+=oneChar.width;
				}
			};
			var dx=0;
			if (textAlign!==null && textAlign!=="left")
				dx=-(textAlign=="center" ? (width / 2):width);
			var uv,bdSz=NaN,texture,value,saveLength=0;
			if (words){
				for (i=0,n=chars.length;i < n;i++){
					oneChar=chars[i];
					if (!oneChar.isSpace){
						htmlWord=words[i];
						bdSz=oneChar.borderSize;
						texture=oneChar.texture;
						ctx._drawText(texture,x+dx+htmlWord.x *sx-bdSz,y+htmlWord.y *sy-bdSz,texture.width,texture.height,curMat,0,0,0,0);
					}
				}
				}else {
				for (i=0,n=chars.length;i < n;i++){
					oneChar=chars[i];
					if (!oneChar.isSpace){
						bdSz=oneChar.borderSize;
						texture=oneChar.texture;
						ctx._drawText(texture,x+dx-bdSz,y-bdSz,texture.width,texture.height,curMat,0,0,0,0);
						save && (value=save[saveLength++],value || (value=save[saveLength-1]=[]),value[0]=texture,value[1]=dx-bdSz,value[2]=-bdSz);
					}
					dx+=oneChar.width;
				}
				save && (save.length=saveLength);
			}
		}

		DrawText._drawFast=function(save,ctx,curMat,x,y){
			var texture,value;
			for (var i=0,n=save.length;i < n;i++){
				value=save[i];
				texture=value[0];
				texture.active();
				ctx._drawText(texture,x+value[1],y+value[2],texture.width,texture.height,curMat,0,0,0,0);
			}
		}

		DrawText.drawText=function(ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y){
			if ((txt && txt.length===0)|| (words && words.length===0))
				return;
			var sx=curMat.a,sy=curMat.d;
			(curMat.b!==0 || curMat.c!==0)&& (sx=sy=1);
			var scale=sx!==1 || sy!==1;
			if (scale && Laya.stage.transform){
				var t=Laya.stage.transform;
				scale=t.a===sx && t.d===sy;
			}else scale=false;
			if (scale){
				curMat=curMat.copyTo(WebGLContext2D._tmpMatrix);
				curMat.scale(1 / sx,1 / sy);
				curMat._checkTransform();
				x *=sx;
				y *=sy;
			}else sx=sy=1;
			if (words){
				DrawText._drawSlow(null,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy);
				}else {
				if (txt.toUpperCase===null){
					var idNum=sx+sy*100000;
					var myCache=txt;
					if (!myCache.changed && myCache.id===idNum){
						DrawText._drawFast(myCache.save,ctx,curMat,x,y);
					}
					else{
						myCache.id=idNum;
						myCache.changed=false;
						DrawText._drawSlow(myCache.save,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy);
					}
					return;
				};
				var id=txt+font.toString()+fillColor+borderColor+lineWidth+sx+sy+textAlign;
				var cache=DrawText._textsCache[id];
				if (cache){
					DrawText._drawFast(cache,ctx,curMat,x,y);
					}else {
					DrawText._textsCache.__length || (DrawText._textsCache.__length=0);
					if (DrawText._textsCache.__length >Config.WebGLTextCacheCount){
						DrawText._textsCache={};
						DrawText._textsCache.__length=0;
						DrawText._curPoolIndex=0;
					}
					DrawText._textCachesPool[DrawText._curPoolIndex] ? (cache=DrawText._textsCache[id]=DrawText._textCachesPool[DrawText._curPoolIndex],cache.length=0):(DrawText._textCachesPool[DrawText._curPoolIndex]=cache=DrawText._textsCache[id]=[]);
					DrawText._textsCache.__length++
					DrawText._curPoolIndex++;
					DrawText._drawSlow(cache,ctx,txt,words,curMat,font,textAlign,fillColor,borderColor,lineWidth,x,y,sx,sy);
				}
			}
		}

		DrawText._charsTemp=null
		DrawText._textCachesPool=[];
		DrawText._curPoolIndex=0;
		DrawText._charsCache={};
		DrawText._textsCache={};
		DrawText._drawValue=null
		DrawText.d=[];
		DrawText._charSeg=null;
		DrawText.__init$=function(){
			//class CharValue
			CharValue=(function(){
				function CharValue(){
					//this.txtID=NaN;
					//this.font=null;
					//this.fillColor=null;
					//this.borderColor=null;
					//this.lineWidth=0;
					//this.scaleX=NaN;
					//this.scaleY=NaN;
				}
				__class(CharValue,'');
				var __proto=CharValue.prototype;
				__proto.value=function(font,fillColor,borderColor,lineWidth,scaleX,scaleY){
					this.font=font;
					this.fillColor=fillColor;
					this.borderColor=borderColor;
					this.lineWidth=lineWidth;
					this.scaleX=scaleX;
					this.scaleY=scaleY;
					var key=font.toString()+scaleX+scaleY+lineWidth+fillColor+borderColor;
					this.txtID=CharValue._keymap[key];
					if (!this.txtID){
						this.txtID=(++CharValue._keymapCount)*0.0000001;
						CharValue._keymap[key]=this.txtID;
					}
					return this;
				}
				CharValue.clear=function(){
					CharValue._keymap={};
					CharValue._keymapCount=1;
				}
				CharValue._keymap={};
				CharValue._keymapCount=1;
				return CharValue;
			})()
		}

		return DrawText;
	})()


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.text.DrawTextChar
	var DrawTextChar=(function(){
		function DrawTextChar(content,drawValue){
			//this.xs=NaN;
			//this.ys=NaN;
			//this.width=0;
			//this.height=0;
			//this.char=null;
			//this.fillColor=null;
			//this.borderColor=null;
			//this.borderSize=0;
			//this.font=null;
			//this.fontSize=0;
			//this.texture=null;
			//this.lineWidth=0;
			//this.UV=null;
			//this.isSpace=false;
			this.char=content;
			this.isSpace=content===' ';
			this.xs=drawValue.scaleX;
			this.ys=drawValue.scaleY;
			this.font=drawValue.font.toString();
			this.fontSize=drawValue.font.size;
			this.fillColor=drawValue.fillColor;
			this.borderColor=drawValue.borderColor;
			this.lineWidth=drawValue.lineWidth;
			var bIsConchApp=Render.isConchApp;
			if (bIsConchApp){
				var pCanvas=ConchTextCanvas;
				pCanvas._source=ConchTextCanvas;
				pCanvas._source.canvas=ConchTextCanvas;
				this.texture=new Texture(new WebGLCharImage(pCanvas,this));
			}
			else{
				this.texture=new Texture(new WebGLCharImage(Browser.canvas.source,this));
			}
		}

		__class(DrawTextChar,'laya.webgl.text.DrawTextChar');
		var __proto=DrawTextChar.prototype;
		__proto.active=function(){
			this.texture.active();
		}

		DrawTextChar.createOneChar=function(content,drawValue){
			var char=new DrawTextChar(content,drawValue);
			return char;
		}

		return DrawTextChar;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.text.FontInContext
	var FontInContext=(function(){
		function FontInContext(font){
			//this._text=null;
			//this._words=null;
			this._index=0;
			this._size=14;
			this._italic=-2;
			this.setFont(font || "14px Arial");
		}

		__class(FontInContext,'laya.webgl.text.FontInContext');
		var __proto=FontInContext.prototype;
		__proto.setFont=function(value){
			this._words=value.split(' ');
			for (var i=0,n=this._words.length;i < n;i++){
				if (this._words[i].indexOf('px')> 0){
					this._index=i;
					break ;
				}
			}
			this._size=parseInt(this._words[this._index]);
			this._text=null;
			this._italic=-2;
		}

		__proto.getItalic=function(){
			this._italic===-2 && (this._italic=this.hasType("italic"));
			return this._italic;
		}

		__proto.hasType=function(name){
			for (var i=0,n=this._words.length;i < n;i++)
			if (this._words[i]===name)return i;
			return-1;
		}

		__proto.removeType=function(name){
			for (var i=0,n=this._words.length;i < n;i++)
			if (this._words[i]===name){
				this._words.splice(i,1);
				if (this._index > i)this._index--;
				break ;
			}
			this._text=null;
			this._italic=-2;
		}

		__proto.copyTo=function(dec){
			dec._text=this._text;
			dec._size=this._size;
			dec._index=this._index;
			dec._words=this._words.slice();
			dec._italic=-2;
			return dec;
		}

		__proto.toString=function(){
			return this._text?this._text:(this._text=this._words.join(' '));
		}

		__getset(0,__proto,'size',function(){
			return this._size;
			},function(value){
			this._size=value;
			this._words[this._index]=value+"px";
			this._text=null;
		});

		FontInContext.create=function(font){
			var r=FontInContext._cache[font];
			if (r)return r;
			r=FontInContext._cache[font]=new FontInContext(font);
			return r;
		}

		FontInContext.EMPTY=new FontInContext();
		FontInContext._cache={};
		return FontInContext;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.CONST3D2D
	var CONST3D2D=(function(){
		function CONST3D2D(){};
		__class(CONST3D2D,'laya.webgl.utils.CONST3D2D');
		CONST3D2D.defaultMatrix4=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		CONST3D2D.defaultMinusYMatrix4=[1,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,1];
		CONST3D2D.uniformMatrix3=[1,0,0,0,0,1,0,0,0,0,1,0];
		CONST3D2D._TMPARRAY=[];
		CONST3D2D._OFFSETX=0;
		CONST3D2D._OFFSETY=0;
		__static(CONST3D2D,
		['BYTES_PE',function(){return this.BYTES_PE=Float32Array.BYTES_PER_ELEMENT;},'BYTES_PIDX',function(){return this.BYTES_PIDX=Uint16Array.BYTES_PER_ELEMENT;}
		]);
		return CONST3D2D;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.GlUtils
	var GlUtils=(function(){
		function GlUtils(){};
		__class(GlUtils,'laya.webgl.utils.GlUtils');
		GlUtils.make2DProjection=function(width,height,depth){
			return [2.0 / width,0,0,0,0,-2.0 / height,0,0,0,0,2.0 / depth,0,-1,1,0,1,];
		}

		GlUtils.fillIBQuadrangle=function(buffer,count){
			if (count > 65535 / 4){
				throw Error("IBQuadrangle count:"+count+" must<:"+Math.floor(65535 / 4));
				return false;
			}
			count=Math.floor(count);
			buffer._resizeBuffer((count+1)*6 *2,false);
			buffer.byteLength=buffer.bufferLength;
			var bufferData=buffer.getUint16Array();
			var idx=0;
			for (var i=0;i < count;i++){
				bufferData[idx++]=i *4;
				bufferData[idx++]=i *4+2;
				bufferData[idx++]=i *4+1;
				bufferData[idx++]=i *4;
				bufferData[idx++]=i *4+3;
				bufferData[idx++]=i *4+2;
			}
			buffer.setNeedUpload();
			return true;
		}

		GlUtils.expandIBQuadrangle=function(buffer,count){
			buffer.bufferLength >=(count *6 *2)|| GlUtils.fillIBQuadrangle(buffer,count);
		}

		GlUtils.mathCeilPowerOfTwo=function(value){
			value--;
			value |=value >> 1;
			value |=value >> 2;
			value |=value >> 4;
			value |=value >> 8;
			value |=value >> 16;
			value++;
			return value;
		}

		GlUtils.fillQuadrangleImgVb=function(vb,x,y,point4,uv,m,_x,_y){
			'use strict';
			var vpos=(vb._byteLength >> 2)+16;
			vb.byteLength=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=16;
			vbdata[vpos+2]=uv[0];
			vbdata[vpos+3]=uv[1];
			vbdata[vpos+6]=uv[2];
			vbdata[vpos+7]=uv[3];
			vbdata[vpos+10]=uv[4];
			vbdata[vpos+11]=uv[5];
			vbdata[vpos+14]=uv[6];
			vbdata[vpos+15]=uv[7];
			var a=m.a,b=m.b,c=m.c,d=m.d;
			if (a!==1 || b!==0 || c!==0 || d!==1){
				m.bTransform=true;
				var tx=m.tx+_x,ty=m.ty+_y;
				vbdata[vpos]=(point4[0]+x)*a+(point4[1]+y)*c+tx;
				vbdata[vpos+1]=(point4[0]+x)*b+(point4[1]+y)*d+ty;
				vbdata[vpos+4]=(point4[2]+x)*a+(point4[3]+y)*c+tx;
				vbdata[vpos+5]=(point4[2]+x)*b+(point4[3]+y)*d+ty;
				vbdata[vpos+8]=(point4[4]+x)*a+(point4[5]+y)*c+tx;
				vbdata[vpos+9]=(point4[4]+x)*b+(point4[5]+y)*d+ty;
				vbdata[vpos+12]=(point4[6]+x)*a+(point4[7]+y)*c+tx;
				vbdata[vpos+13]=(point4[6]+x)*b+(point4[7]+y)*d+ty;
				}else {
				m.bTransform=false;
				x+=m.tx+_x;
				y+=m.ty+_y;
				vbdata[vpos]=x+point4[0];
				vbdata[vpos+1]=y+point4[1];
				vbdata[vpos+4]=x+point4[2];
				vbdata[vpos+5]=y+point4[3];
				vbdata[vpos+8]=x+point4[4];
				vbdata[vpos+9]=y+point4[5];
				vbdata[vpos+12]=x+point4[6];
				vbdata[vpos+13]=y+point4[7];
			}
			vb._upload=true;
			return true;
		}

		GlUtils.fillTranglesVB=function(vb,x,y,points,m,_x,_y){
			'use strict';
			var vpos=(vb._byteLength >> 2)+points.length;
			vb.byteLength=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=points.length;
			var len=points.length;
			var a=m.a,b=m.b,c=m.c,d=m.d;
			for (var i=0;i < len;i+=4){
				vbdata[vpos+i+2]=points[i+2];
				vbdata[vpos+i+3]=points[i+3];
				if (a!==1 || b!==0 || c!==0 || d!==1){
					m.bTransform=true;
					var tx=m.tx+_x,ty=m.ty+_y;
					vbdata[vpos+i]=(points[i]+x)*a+(points[i+1]+y)*c+tx;
					vbdata[vpos+i+1]=(points[i]+x)*b+(points[i+1]+y)*d+ty;
					}else {
					m.bTransform=false;
					x+=m.tx+_x;
					y+=m.ty+_y;
					vbdata[vpos+i]=x+points[i];
					vbdata[vpos+i+1]=y+points[i+1];
				}
			}
			vb._upload=true;
			return true;
		}

		GlUtils.fillRectImgVb=function(vb,clip,x,y,width,height,uv,m,_x,_y,dx,dy,round){
			(round===void 0)&& (round=false);
			'use strict';
			var mType=1;
			var toBx,toBy,toEx,toEy;
			var cBx,cBy,cEx,cEy;
			var w0,h0,tx,ty;
			var finalX,finalY,offsetX,offsetY;
			var a=m.a,b=m.b,c=m.c,d=m.d;
			var useClip=false;
			if (a!==1 || b!==0 || c!==0 || d!==1){
				m.bTransform=true;
				if (b===0 && c===0){
					mType=useClip ? 30 :23;
					w0=width+x,h0=height+y;
					tx=m.tx+_x,ty=m.ty+_y;
					toBx=a *x+tx;
					toEx=a *w0+tx;
					toBy=d *y+ty;
					toEy=d *h0+ty;
				}
				}else {
				mType=useClip ? 30 :23;
				m.bTransform=false;
				toBx=x+m.tx+_x;
				toEx=toBx+width;
				toBy=y+m.ty+_y;
				toEy=toBy+height;
			}
			if (useClip){
				cBx=clip.x,cBy=clip.y,cEx=clip.width+cBx,cEy=clip.height+cBy;
			}
			if (mType!==1 && (toBx >=cEx || toBy >=cEy || toEx <=cBx || toEy <=cBy))
				return false;
			var vpos=(vb._byteLength >> 2)+16;
			vb.byteLength=(vpos << 2);
			var vbdata=vb.getFloat32Array();
			vpos-=16;
			vbdata[vpos+2]=uv[0];
			vbdata[vpos+3]=uv[1];
			vbdata[vpos+6]=uv[2];
			vbdata[vpos+7]=uv[3];
			vbdata[vpos+10]=uv[4];
			vbdata[vpos+11]=uv[5];
			vbdata[vpos+14]=uv[6];
			vbdata[vpos+15]=uv[7];
			switch (mType){
				case 1:
					tx=m.tx+_x,ty=m.ty+_y;
					w0=width+x,h0=height+y;
					var w1=x,h1=y;
					var aw1=a *w1,ch1=c *h1,dh1=d *h1,bw1=b *w1;
					var aw0=a *w0,ch0=c *h0,dh0=d *h0,bw0=b *w0;
					if (round){
						finalX=aw1+ch1+tx;
						offsetX=Math.round(finalX)-finalX;
						finalY=dh1+bw1+ty;
						offsetY=Math.round(finalY)-finalY;
						vbdata[vpos]=finalX+offsetX;
						vbdata[vpos+1]=finalY+offsetY;
						vbdata[vpos+4]=aw0+ch1+tx+offsetX;
						vbdata[vpos+5]=dh1+bw0+ty+offsetY;
						vbdata[vpos+8]=aw0+ch0+tx+offsetX;
						vbdata[vpos+9]=dh0+bw0+ty+offsetY;
						vbdata[vpos+12]=aw1+ch0+tx+offsetX;
						vbdata[vpos+13]=dh0+bw1+ty+offsetY;
						}else {
						vbdata[vpos]=aw1+ch1+tx;
						vbdata[vpos+1]=dh1+bw1+ty;
						vbdata[vpos+4]=aw0+ch1+tx;
						vbdata[vpos+5]=dh1+bw0+ty;
						vbdata[vpos+8]=aw0+ch0+tx;
						vbdata[vpos+9]=dh0+bw0+ty;
						vbdata[vpos+12]=aw1+ch0+tx;
						vbdata[vpos+13]=dh0+bw1+ty;
					}
					break ;
				case 23:
					if (round){
						finalX=toBx+dx;
						offsetX=Math.round(finalX)-finalX;
						finalY=toBy;
						offsetY=Math.round(finalY)-finalY;
						vbdata[vpos]=finalX+offsetX;
						vbdata[vpos+1]=finalY+offsetY;
						vbdata[vpos+4]=toEx+dx+offsetX;
						vbdata[vpos+5]=toBy+offsetY;
						vbdata[vpos+8]=toEx+offsetX;
						vbdata[vpos+9]=toEy+offsetY;
						vbdata[vpos+12]=toBx+offsetX;
						vbdata[vpos+13]=toEy+offsetY;
						}else {
						vbdata[vpos]=toBx+dx;
						vbdata[vpos+1]=toBy;
						vbdata[vpos+4]=toEx+dx;
						vbdata[vpos+5]=toBy;
						vbdata[vpos+8]=toEx;
						vbdata[vpos+9]=toEy;
						vbdata[vpos+12]=toBx;
						vbdata[vpos+13]=toEy;
					}
					break ;
				case 30:
					if (toBx < cBx || toBy < cBy || toEx > cEx || toEy > cEy){
						var dcx=cBx-toBx,dcty=cBy-toBy,decr=toEx-cEx,decb=toEy-cEy;
						if (dcx > 0){
							toBx=cBx;
							vbdata[vpos+14]=vbdata[vpos+2]=vbdata[vpos+2]+dcx / (width *a)*(vbdata[vpos+6]-vbdata[vpos+2])
						}
						if (dcty > 0){
							toBy=cBy;
							vbdata[vpos+7]=vbdata[vpos+3]=vbdata[vpos+3]+dcty / (height *d)*(vbdata[vpos+11]-vbdata[vpos+7])
						}
						if (decr > 0){
							toEx=cEx;
							vbdata[vpos+6]=vbdata[vpos+10]=vbdata[vpos+6]-decr / (width *a)*(vbdata[vpos+6]-vbdata[vpos+2])
						}
						if (decb > 0){
							toEy=cEy;
							vbdata[vpos+11]=vbdata[vpos+15]=vbdata[vpos+15]-decb / (height *d)*(vbdata[vpos+11]-vbdata[vpos+7])
						}
					}
					if (round){
						finalX=toBx+dx;
						offsetX=Math.round(finalX)-finalX;
						finalY=toBy;
						offsetY=Math.round(finalY)-finalY;
						vbdata[vpos]=finalX+offsetX;
						vbdata[vpos+1]=finalY+offsetY;
						vbdata[vpos+4]=toEx+dx+offsetX;
						vbdata[vpos+5]=toBy+offsetY;
						vbdata[vpos+8]=toEx+offsetX;
						vbdata[vpos+9]=toEy+offsetY;
						vbdata[vpos+12]=toBx+offsetX;
						vbdata[vpos+13]=toEy+offsetY;
						}else {
						vbdata[vpos]=toBx+dx;
						vbdata[vpos+1]=toBy;
						vbdata[vpos+4]=toEx+dx;
						vbdata[vpos+5]=toBy;
						vbdata[vpos+8]=toEx;
						vbdata[vpos+9]=toEy;
						vbdata[vpos+12]=toBx;
						vbdata[vpos+13]=toEy;
					}
				}
			vb._upload=true;
			return true;
		}

		GlUtils.fillLineVb=function(vb,clip,fx,fy,tx,ty,width,mat){
			'use strict';
			var linew=width *.5;
			var data=GlUtils._fillLineArray;
			var perpx=-(fy-ty),perpy=fx-tx;
			var dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx /=dist,perpy /=dist,perpx *=linew,perpy *=linew;
			data[0]=fx-perpx,data[1]=fy-perpy,data[4]=fx+perpx,data[5]=fy+perpy,data[8]=tx+perpx,data[9]=ty+perpy,data[12]=tx-perpx,data[13]=ty-perpy;
			mat && mat.transformPointArray(data,data);
			var vpos=(vb._byteLength >> 2)+16;
			vb.byteLength=(vpos << 2);
			vb.insertData(data,vpos-16);
			return true;
		}

		GlUtils._fillLineArray=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		return GlUtils;
	})()


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.utils.MatirxArray
	var MatirxArray=(function(){
		function MatirxArray(){}
		__class(MatirxArray,'laya.webgl.utils.MatirxArray');
		MatirxArray.ArrayMul=function(a,b,o){
			if (!a){
				MatirxArray.copyArray(b,o);
				return;
			}
			if (!b){
				MatirxArray.copyArray(a,o);
				return;
			};
			var ai0=NaN,ai1=NaN,ai2=NaN,ai3=NaN;
			for (var i=0;i < 4;i++){
				ai0=a[i];
				ai1=a[i+4];
				ai2=a[i+8];
				ai3=a[i+12];
				o[i]=ai0 *b[0]+ai1 *b[1]+ai2 *b[2]+ai3 *b[3];
				o[i+4]=ai0 *b[4]+ai1 *b[5]+ai2 *b[6]+ai3 *b[7];
				o[i+8]=ai0 *b[8]+ai1 *b[9]+ai2 *b[10]+ai3 *b[11];
				o[i+12]=ai0 *b[12]+ai1 *b[13]+ai2 *b[14]+ai3 *b[15];
			}
		}

		MatirxArray.copyArray=function(f,t){
			if (!f)return;
			if (!t)return;
			for (var i=0;i < f.length;i++){
				t[i]=f[i];
			}
		}

		return MatirxArray;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.RenderState2D
	var RenderState2D=(function(){
		function RenderState2D(){};
		__class(RenderState2D,'laya.webgl.utils.RenderState2D');
		RenderState2D.getMatrArray=function(){
			return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		}

		RenderState2D.mat2MatArray=function(mat,matArray){
			var m=mat;
			var m4=matArray;
			m4[0]=m.a;
			m4[1]=m.b;
			m4[4]=m.c;
			m4[5]=m.d;
			m4[12]=m.tx;
			m4[13]=m.ty;
			return matArray;
		}

		RenderState2D.restoreTempArray=function(){
			RenderState2D.TEMPMAT4_ARRAY[0]=1;
			RenderState2D.TEMPMAT4_ARRAY[1]=0;
			RenderState2D.TEMPMAT4_ARRAY[4]=0;
			RenderState2D.TEMPMAT4_ARRAY[5]=1;
			RenderState2D.TEMPMAT4_ARRAY[12]=0;
			RenderState2D.TEMPMAT4_ARRAY[13]=0;
		}

		RenderState2D.clear=function(){
			RenderState2D.worldScissorTest=false;
			RenderState2D.worldShaderDefines=null;
			RenderState2D.worldFilters=null;
			RenderState2D.worldAlpha=1;
			RenderState2D.worldClipRect.x=RenderState2D.worldClipRect.y=0;
			RenderState2D.worldClipRect.width=RenderState2D.width;
			RenderState2D.worldClipRect.height=RenderState2D.height;
			RenderState2D.curRenderTarget=null;
		}

		RenderState2D._MAXSIZE=99999999;
		RenderState2D.TEMPMAT4_ARRAY=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		RenderState2D.worldMatrix4=RenderState2D.TEMPMAT4_ARRAY;
		RenderState2D.worldAlpha=1.0;
		RenderState2D.worldScissorTest=false;
		RenderState2D.worldFilters=null
		RenderState2D.worldShaderDefines=null
		RenderState2D.worldClipRect=new Rectangle(0,0,99999999,99999999);
		RenderState2D.curRenderTarget=null
		RenderState2D.width=0;
		RenderState2D.height=0;
		__static(RenderState2D,
		['worldMatrix',function(){return this.worldMatrix=new Matrix();}
		]);
		return RenderState2D;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.ShaderCompile
	var ShaderCompile=(function(){
		var ShaderScriptBlock;
		function ShaderCompile(name,vs,ps,nameMap,includeFiles){
			//this._VS=null;
			//this._PS=null;
			//this._VSTXT=null;
			//this._PSTXT=null;
			//this._nameMap=null;
			this._VSTXT=vs;
			this._PSTXT=ps;
			function split (str){
				var words=str.split(' ');
				var out=[];
				for (var i=0;i < words.length;i++)
				words[i].length > 0 && out.push(words[i]);
				return out;
			}
			function c (script){
				var i=0,n=0,ofs=0,words,condition;
				var top=new ShaderScriptBlock(0,null,null,null);
				var parent=top;
				var lines=script.split('\n');
				for (i=0,n=lines.length;i < n;i++){
					var line=lines[i];
					if (line.indexOf("#ifdef")>=0){
						words=split(line);
						parent=new ShaderScriptBlock(1,words[1],"",parent);
						continue ;
					}
					if (line.indexOf("#else")>=0){
						condition=parent.condition;
						parent=new ShaderScriptBlock(2,null,"",parent.parent);
						parent.condition=condition;
						continue ;
					}
					if (line.indexOf("#endif")>=0){
						parent=parent.parent;
						continue ;
					}
					if (line.indexOf("#include")>=0){
						words=split(line);
						var fname=words[1];
						var chr=fname.charAt(0);
						if (chr==='"' || chr==="'"){
							fname=fname.substr(1,fname.length-2);
							ofs=fname.lastIndexOf(chr);
							if (ofs > 0)fname=fname.substr(0,ofs);
						}
						ofs=words[0].indexOf('?');
						var str=ofs > 0?words[0].substr(ofs+1):words[0];
						new ShaderScriptBlock(1,str,includeFiles[fname],parent);
						continue ;
					}
					if (parent.childs.length > 0 && parent.childs[parent.childs.length-1].type===0){
						parent.childs[parent.childs.length-1].text+="\n"+line;
					}
					else new ShaderScriptBlock(0,null,line,parent);
				}
				return top;
			}
			this._VS=c(vs);
			this._PS=c(ps);
			this._nameMap=nameMap;
		}

		__class(ShaderCompile,'laya.webgl.utils.ShaderCompile');
		var __proto=ShaderCompile.prototype;
		__proto.createShader=function(define,shaderName,createShader){
			var defMap={};
			var defineStr="";
			if (define){
				for (var i in define){
					defineStr+="#define "+i+"\n";
					defMap[i]=true;
				}
			};
			var vs=this._VS.toscript(defMap,[]);
			var ps=this._PS.toscript(defMap,[]);
			return (createShader || Shader.create)(defineStr+vs.join('\n'),defineStr+ps.join('\n'),shaderName,this._nameMap);
		}

		ShaderCompile.IFDEF_NO=0;
		ShaderCompile.IFDEF_YES=1;
		ShaderCompile.IFDEF_ELSE=2;
		ShaderCompile.__init$=function(){
			//class ShaderScriptBlock
			ShaderScriptBlock=(function(){
				function ShaderScriptBlock(type,condition,text,parent){
					//this.type=0;
					//this.condition=null;
					//this.text=null;
					//this.parent=null;
					this.childs=new Array;
					this.type=type;
					this.text=text;
					this.parent=parent;
					parent && parent.childs.push(this);
					if (!condition)return;
					var newcondition="";
					var preIsParam=false,isParam=false;
					for (var i=0,n=condition.length;i < n;i++){
						var c=condition.charAt(i);
						isParam="!&|() \t".indexOf(c)< 0;
						if (preIsParam !=isParam){
							isParam && (newcondition+="this.");
							preIsParam=isParam;
						}
						newcondition+=c;
					}
					this.condition=RunDriver.createShaderCondition(newcondition);
				}
				__class(ShaderScriptBlock,'');
				var __proto=ShaderScriptBlock.prototype;
				__proto.toscript=function(def,out){
					if (this.type===0){
						this.text && out.push(this.text);
					}
					if (this.childs.length < 1 && !this.text)return out;
					if (this.type!==0){
						var ifdef=!!this.condition.call(def);
						this.type===2 && (ifdef=!ifdef);
						if (!ifdef)return out;
						this.text && out.push(this.text);
					}
					this.childs.length>0 && this.childs.forEach(function(o,index,arr){o.toscript(def,out)});
					return out;
				}
				return ShaderScriptBlock;
			})()
		}

		return ShaderCompile;
	})()


	/**
	*@private
	*/
	//class laya.webgl.WebGL
	var WebGL=(function(){
		function WebGL(){};
		__class(WebGL,'laya.webgl.WebGL');
		WebGL.Float32ArraySlice=function(){
			var _this=this;
			var sz=_this.length;
			var dec=new Float32Array(_this.length);
			for (var i=0;i < sz;i++)dec[i]=_this[i];
			return dec;
		}

		WebGL.expandContext=function(){
			var from=Context.prototype;
			var to=CanvasRenderingContext2D.prototype;
			to.fillTrangles=from.fillTrangles;
			Buffer2D.__int__(null);
			to.setIBVB=function (x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset){
				(startIndex===void 0)&& (startIndex=0);
				(offset===void 0)&& (offset=0);
				if (ib===null){
					this._ib=this._ib || IndexBuffer2D.QuadrangleIB;
					ib=this._ib;
					GlUtils.expandIBQuadrangle(ib,(vb.byteLength / (4 *16)+8));
				}
				this._setIBVB(x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset);
			};
			to.fillTrangles=function (tex,x,y,points,m){
				this._curMat=this._curMat || Matrix.create();
				this._vb=this._vb || VertexBuffer2D.create();
				if (!this._ib){
					this._ib=IndexBuffer2D.create();
					GlUtils.fillIBQuadrangle(this._ib,length / 4);
				};
				var vb=this._vb;
				var length=points.length >> 4;
				GlUtils.fillTranglesVB(vb,x,y,points,m || this._curMat,0,0);
				GlUtils.expandIBQuadrangle(this._ib,(vb.byteLength / (4 *16)+8));
				var shaderValues=new Value2D(0x01,0);
				shaderValues.textureHost=tex;
				var sd=new Shader2X("attribute vec2 position; attribute vec2 texcoord; uniform vec2 size; uniform mat4 mmat; varying vec2 v_texcoord; void main() { vec4 p=vec4(position.xy,0.0,1.0);vec4 pos=mmat*p; gl_Position =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0); v_texcoord = texcoord; }","precision mediump float; varying vec2 v_texcoord; uniform sampler2D texture; void main() {vec4 color= texture2D(texture, v_texcoord); color.a*=1.0; gl_FragColor= color;}");
				vb._vertType=3;
				this._setIBVB(x,y,this._ib,vb,length *6,m,sd,shaderValues,0,0);
			}
		}

		WebGL.enable=function(){
			if (Render.isConchApp){
				if (!Render.isConchWebGL){
					WebGL.expandContext();
					return false;
				}
			}
			if (!WebGL.isWebGLSupported())return false;
			if (Render.isWebGL)return true;
			HTMLImage.create=function (src){
				return new WebGLImage(src);
			}
			Render.WebGL=WebGL;
			Render.isWebGL=true;
			DrawText.__init__();
			RunDriver.createRenderSprite=function (type,next){
				return new RenderSprite3D(type,next);
			}
			RunDriver.createWebGLContext2D=function (c){
				return new WebGLContext2D(c);
			}
			RunDriver.changeWebGLSize=function (width,height){
				laya.webgl.WebGL.onStageResize(width,height);
			}
			RunDriver.createGraphics=function (){
				return new GraphicsGL();
			};
			var action=RunDriver.createFilterAction;
			RunDriver.createFilterAction=action ? action :function (type){
				return new ColorFilterActionGL()
			}
			RunDriver.clear=function (color){
				RenderState2D.worldScissorTest && laya.webgl.WebGL.mainContext.disable(0x0C11);
				if (color==null){
					Render.context.ctx.clearBG(0,0,0,0);
					}else {
					var c=Color.create(color)._color;
					Render.context.ctx.clearBG(c[0],c[1],c[2],c[3]);
				}
				RenderState2D.clear();
			}
			RunDriver.addToAtlas=function (texture,force){
				(force===void 0)&& (force=false);
				var bitmap=texture.bitmap;
				if (!Render.optimizeTextureMemory(texture.url,texture)){
					(bitmap).enableMerageInAtlas=false;
					return;
				}
				if ((Laya.__typeof(bitmap,'laya.webgl.resource.IMergeAtlasBitmap'))&& ((bitmap).allowMerageInAtlas)){
					bitmap.on("recovered",texture,texture.addTextureToAtlas);
				}
			}
			AtlasResourceManager._enable();
			RunDriver.beginFlush=function (){
				var atlasResourceManager=AtlasResourceManager.instance;
				var count=atlasResourceManager.getAtlaserCount();
				for (var i=0;i < count;i++){
					var atlerCanvas=atlasResourceManager.getAtlaserByIndex(i).texture;
					(atlerCanvas._flashCacheImageNeedFlush)&& (RunDriver.flashFlushImage(atlerCanvas));
				}
			}
			RunDriver.drawToCanvas=function (sprite,_renderType,canvasWidth,canvasHeight,offsetX,offsetY){
				var renderTarget=new RenderTarget2D(canvasWidth,canvasHeight,0x1908,0x1401,0,false);
				renderTarget.start();
				renderTarget.clear(1.0,0.0,0.0,1.0);
				sprite.render(Render.context,-offsetX,RenderState2D.height-canvasHeight-offsetY);
				Render.context.flush();
				renderTarget.end();
				var pixels=renderTarget.getData(0,0,renderTarget.width,renderTarget.height);
				renderTarget.dispose();
				return pixels;
			}
			RunDriver.createFilterAction=function (type){
				var action;
				switch (type){
					case 0x20:
						action=new ColorFilterActionGL();
						break ;
					}
				return action;
			}
			RunDriver.addTextureToAtlas=function (texture){
				texture._uvID++;
				AtlasResourceManager._atlasRestore++;
				((texture.bitmap).enableMerageInAtlas)&& (AtlasResourceManager.instance.addToAtlas(texture));
			}
			RunDriver.getTexturePixels=function (value,x,y,width,height){
				var tSprite=new Sprite();
				tSprite.x=-x;
				tSprite.y=-y;
				tSprite.graphics.drawTexture(value,0,0,value.sourceWidth,value.sourceHeight);
				var tRenderTarget=RenderTarget2D.create(width,height);
				tRenderTarget.start();
				tRenderTarget.clear(0,0,0,0);
				tSprite.render(Render.context,0,0);
				(Render.context.ctx).flush();
				tRenderTarget.end();
				var tUint8Array=tRenderTarget.getData(0,0,width,height);
				var tArray=[];
				var tIndex=0;
				for (var i=height-1;i >=0;i--){
					for (var j=0;j < width;j++){
						tIndex=(i *width+j)*4;
						tArray.push(tUint8Array[tIndex]);
						tArray.push(tUint8Array[tIndex+1]);
						tArray.push(tUint8Array[tIndex+2]);
						tArray.push(tUint8Array[tIndex+3]);
					}
				}
				return tArray;
			}
			RunDriver.fillTextureShader=function (value,x,y,width,height){
				var tFillTetureSprite=new FillTextureSprite();
				return tFillTetureSprite;
			}
			RunDriver.skinAniSprite=function (){
				var tSkinSprite=new SkinMesh()
				return tSkinSprite;
			}
			Filter._filterStart=function (scope,sprite,context,x,y){
				var b=scope.getValue("bounds");
				var source=RenderTarget2D.create(b.width,b.height);
				source.start();
				source.clear(0,0,0,0);
				scope.addValue("src",source);
				scope.addValue("ScissorTest",RenderState2D.worldScissorTest);
				if (RenderState2D.worldScissorTest){
					var tClilpRect=new Rectangle();
					tClilpRect.copyFrom((context.ctx)._clipRect)
					scope.addValue("clipRect",tClilpRect);
					RenderState2D.worldScissorTest=false;
					laya.webgl.WebGL.mainContext.disable(0x0C11);
				}
			}
			Filter._filterEnd=function (scope,sprite,context,x,y){
				var b=scope.getValue("bounds");
				var source=scope.getValue("src");
				source.end();
				var out=RenderTarget2D.create(b.width,b.height);
				out.start();
				out.clear(0,0,0,0);
				scope.addValue("out",out);
				sprite._set$P('_filterCache',out);
				sprite._set$P('_isHaveGlowFilter',scope.getValue("_isHaveGlowFilter"));
			}
			Filter._EndTarget=function (scope,context){
				var source=scope.getValue("src");
				source.recycle();
				var out=scope.getValue("out");
				out.end();
				var b=scope.getValue("ScissorTest");
				if (b){
					RenderState2D.worldScissorTest=true;
					laya.webgl.WebGL.mainContext.enable(0x0C11);
					context.ctx.save();
					var tClipRect=scope.getValue("clipRect");
					(context.ctx).clipRect(tClipRect.x,tClipRect.y,tClipRect.width,tClipRect.height);
				}
			}
			Filter._useSrc=function (scope){
				var source=scope.getValue("out");
				source.end();
				source=scope.getValue("src");
				source.start();
				source.clear(0,0,0,0);
			}
			Filter._endSrc=function (scope){
				var source=scope.getValue("src");
				source.end();
			}
			Filter._useOut=function (scope){
				var source=scope.getValue("src");
				source.end();
				source=scope.getValue("out");
				source.start();
				source.clear(0,0,0,0);
			}
			Filter._endOut=function (scope){
				var source=scope.getValue("out");
				source.end();
			}
			Filter._recycleScope=function (scope){
				scope.recycle();
			}
			Filter._filter=function (sprite,context,x,y){
				var next=this._next;
				if (next){
					var filters=sprite.filters,len=filters.length;
					if (len==1 && (filters[0].type==0x20)){
						context.ctx.save();
						context.ctx.setFilters([filters[0]]);
						next._fun.call(next,sprite,context,x,y);
						context.ctx.restore();
						return;
					};
					var shaderValue;
					var b;
					var scope=SubmitCMDScope.create();
					var p=Point.TEMP;
					var tMatrix=context.ctx._getTransformMatrix();
					var mat=Matrix.create();
					tMatrix.copyTo(mat);
					var tPadding=0;
					var tHalfPadding=0;
					var tIsHaveGlowFilter=false;
					var out=sprite._$P._filterCache ? sprite._$P._filterCache :null;
					if (!out || sprite._repaint){
						tIsHaveGlowFilter=sprite._isHaveGlowFilter();
						scope.addValue("_isHaveGlowFilter",tIsHaveGlowFilter);
						if (tIsHaveGlowFilter){
							tPadding=50;
							tHalfPadding=25;
						}
						b=new Rectangle();
						b.copyFrom((sprite).getBounds());
						var tSX=b.x;
						var tSY=b.y;
						b.width+=tPadding;
						b.height+=tPadding;
						p.x=b.x *mat.a+b.y *mat.c;
						p.y=b.y *mat.d+b.x *mat.b;
						b.x=p.x;
						b.y=p.y;
						p.x=b.width *mat.a+b.height *mat.c;
						p.y=b.height *mat.d+b.width *mat.b;
						b.width=p.x;
						b.height=p.y;
						if (b.width <=0 || b.height <=0){
							return;
						}
						out && out.recycle();
						scope.addValue("bounds",b);
						var submit=SubmitCMD.create([scope,sprite,context,0,0],Filter._filterStart);
						context.addRenderObject(submit);
						(context.ctx)._shader2D.glTexture=null;
						var tX=sprite.x-tSX+tHalfPadding;
						var tY=sprite.y-tSY+tHalfPadding;
						next._fun.call(next,sprite,context,tX,tY);
						submit=SubmitCMD.create([scope,sprite,context,0,0],Filter._filterEnd);
						context.addRenderObject(submit);
						for (var i=0;i < len;i++){
							if (i !=0){
								submit=SubmitCMD.create([scope],Filter._useSrc);
								context.addRenderObject(submit);
								shaderValue=Value2D.create(0x01,0);
								Matrix.TEMP.identity();
								context.ctx.drawTarget(scope,0,0,b.width,b.height,Matrix.TEMP,"out",shaderValue,null,BlendMode.TOINT.overlay);
								submit=SubmitCMD.create([scope],Filter._useOut);
								context.addRenderObject(submit);
							};
							var fil=filters[i];
							fil.action.apply3d(scope,sprite,context,0,0);
						}
						submit=SubmitCMD.create([scope,context],Filter._EndTarget);
						context.addRenderObject(submit);
						}else {
						tIsHaveGlowFilter=sprite._$P._isHaveGlowFilter ? sprite._$P._isHaveGlowFilter :false;
						if (tIsHaveGlowFilter){
							tPadding=50;
							tHalfPadding=25;
						}
						b=sprite.getBounds();
						if (b.width <=0 || b.height <=0){
							return;
						}
						b.width+=tPadding;
						b.height+=tPadding;
						p.x=b.x *mat.a+b.y *mat.c;
						p.y=b.y *mat.d+b.x *mat.b;
						b.x=p.x;
						b.y=p.y;
						p.x=b.width *mat.a+b.height *mat.c;
						p.y=b.height *mat.d+b.width *mat.b;
						b.width=p.x;
						b.height=p.y;
						scope.addValue("out",out);
					}
					x=x-tHalfPadding-sprite.x;
					y=y-tHalfPadding-sprite.y;
					p.setTo(x,y);
					mat.transformPoint(p);
					x=p.x+b.x;
					y=p.y+b.y;
					shaderValue=Value2D.create(0x01,0);
					Matrix.TEMP.identity();
					(context.ctx).drawTarget(scope,x,y,b.width,b.height,Matrix.TEMP,"out",shaderValue,null,BlendMode.TOINT.overlay);
					submit=SubmitCMD.create([scope],Filter._recycleScope);
					context.addRenderObject(submit);
					mat.destroy();
				}
			}
			Float32Array.prototype.slice || (Float32Array.prototype.slice=WebGL.Float32ArraySlice);
			return true;
		}

		WebGL.isWebGLSupported=function(){
			var canvas=Browser.createElement('canvas');
			var gl;
			var names=["webgl","experimental-webgl","webkit-3d","moz-webgl"];
			for (var i=0;i < names.length;i++){
				try {
					gl=canvas.getContext(names[i]);
				}catch (e){}
				if (gl)return names[i];
			}
			return null;
		}

		WebGL.onStageResize=function(width,height){
			WebGL.mainContext.viewport(0,0,width,height);
			RenderState2D.width=width;
			RenderState2D.height=height;
		}

		WebGL.isExperimentalWebgl=function(){
			return WebGL._isExperimentalWebgl;
		}

		WebGL.addRenderFinish=function(){
			if (WebGL._isExperimentalWebgl || Render.isFlash){
				RunDriver.endFinish=function (){
					Render.context.ctx.finish();
				}
			}
		}

		WebGL.removeRenderFinish=function(){
			if (WebGL._isExperimentalWebgl){
				RunDriver.endFinish=function (){}
			}
		}

		WebGL.onInvalidGLRes=function(){
			AtlasResourceManager.instance.freeAll();
			ResourceManager.releaseContentManagers(true);
			WebGL.doNodeRepaint(Laya.stage);
			WebGL.mainContext.viewport(0,0,RenderState2D.width,RenderState2D.height);
			Laya.stage.event("devicelost");
		}

		WebGL.doNodeRepaint=function(sprite){
			(sprite.numChildren==0)&& (sprite.repaint());
			for (var i=0;i < sprite.numChildren;i++)
			WebGL.doNodeRepaint(sprite.getChildAt(i));
		}

		WebGL.init=function(canvas,width,height){
			WebGL.mainCanvas=canvas;
			HTMLCanvas._createContext=function (canvas){
				return new WebGLContext2D(canvas);
			};
			var webGLName=WebGL.isWebGLSupported();
			var gl=WebGL.mainContext=RunDriver.newWebGLContext(canvas,webGLName);
			WebGL._isExperimentalWebgl=(webGLName !="webgl" && (Browser.onWeiXin || Browser.onMQQBrowser));
			WebGL.frameShaderHighPrecision=false;
			try {
				var precisionFormat=laya.webgl.WebGL.mainContext.getShaderPrecisionFormat(0x8B30,0x8DF2);
				precisionFormat.precision ? WebGL.frameShaderHighPrecision=true :WebGL.frameShaderHighPrecision=false;
			}catch (e){}
			Browser.window.SetupWebglContext && Browser.window.SetupWebglContext(gl);
			WebGL.onStageResize(width,height);
			if (WebGL.mainContext==null)
				throw new Error("webGL getContext err!");
			System.__init__();
			AtlasResourceManager.__init__();
			ShaderDefines2D.__init__();
			Submit.__init__();
			WebGLContext2D.__init__();
			Value2D.__init__();
			Shader2D.__init__();
			Buffer2D.__int__(gl);
			BlendMode._init_(gl);
			if (Render.isConchApp){
				conch.setOnInvalidGLRes(WebGL.onInvalidGLRes);
			}
		}

		WebGL.mainCanvas=null
		WebGL.mainContext=null
		WebGL.antialias=true;
		WebGL.frameShaderHighPrecision=false;
		WebGL._bg_null=[0,0,0,0];
		WebGL._isExperimentalWebgl=false;
		return WebGL;
	})()


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.WebGLContext
	var WebGLContext=(function(){
		function WebGLContext(){};
		__class(WebGLContext,'laya.webgl.WebGLContext');
		WebGLContext.UseProgram=function(program){
			if (WebGLContext._useProgram===program)return false;
			WebGL.mainContext.useProgram(program);
			WebGLContext._useProgram=program;
			return true;
		}

		WebGLContext.setDepthTest=function(gl,value){
			value!==WebGLContext._depthTest && (WebGLContext._depthTest=value,value?gl.enable(0x0B71):gl.disable(0x0B71));
		}

		WebGLContext.setDepthMask=function(gl,value){
			value!==WebGLContext._depthMask && (WebGLContext._depthMask=value,gl.depthMask(value));
		}

		WebGLContext.setBlend=function(gl,value){
			value!==WebGLContext._blend && (WebGLContext._blend=value,value?gl.enable(0x0BE2):gl.disable(0x0BE2));
		}

		WebGLContext.setBlendFunc=function(gl,sFactor,dFactor){
			(sFactor!==WebGLContext._sFactor||dFactor!==WebGLContext._dFactor)&& (WebGLContext._sFactor=sFactor,WebGLContext._dFactor=dFactor,gl.blendFunc(sFactor,dFactor));
		}

		WebGLContext.setCullFace=function(gl,value){
			value!==WebGLContext._cullFace && (WebGLContext._cullFace=value,value?gl.enable(0x0B44):gl.disable(0x0B44));
		}

		WebGLContext.setFrontFaceCCW=function(gl,value){
			value!==WebGLContext._frontFace && (WebGLContext._frontFace=value,gl.frontFace(value));
		}

		WebGLContext.bindTexture=function(gl,target,texture){
			gl.bindTexture(target,texture);
			WebGLContext.curBindTexTarget=target;
			WebGLContext.curBindTexValue=texture;
		}

		WebGLContext._useProgram=null;
		WebGLContext._depthTest=true;
		WebGLContext._depthMask=1;
		WebGLContext._depthFunc=0x0203;
		WebGLContext._blend=false;
		WebGLContext._sFactor=1;
		WebGLContext._dFactor=0;
		WebGLContext._cullFace=false;
		WebGLContext._frontFace=0x0901;
		WebGLContext.curBindTexTarget=null
		WebGLContext.curBindTexValue=null
		WebGLContext.__init$=function(){
			;
		}

		return WebGLContext;
	})()


	/**
	*<code>Node</code> 类用于创建节点对象，节点是最基本的元素。
	*/
	//class laya.display.Node extends laya.events.EventDispatcher
	var Node=(function(_super){
		function Node(){
			this.name="";
			this.destroyed=false;
			this._displayedInStage=false;
			this._parent=null;
			this.model=null;
			Node.__super.call(this);
			this._childs=Node.ARRAY_EMPTY;
			this.timer=Laya.timer;
			this._$P=Node.PROP_EMPTY;
			this.model=Render.isConchNode ? new ConchNode():null;
		}

		__class(Node,'laya.display.Node',_super);
		var __proto=Node.prototype;
		/**
		*<p>销毁此对象。</p>
		*@param destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
		*/
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			this.destroyed=true;
			this._parent && this._parent.removeChild(this);
			if (this._childs){
				if (destroyChild)this.destroyChildren();
				else this.removeChildren();
			}
			this._childs=null;
			this._$P=null;
			this.offAll();
		}

		/**
		*销毁所有子对象，不销毁自己本身。
		*/
		__proto.destroyChildren=function(){
			if (this._childs){
				for (var i=this._childs.length-1;i >-1;i--){
					this._childs[i].destroy(true);
				}
			}
		}

		/**
		*添加子节点。
		*@param node 节点对象
		*@return 返回添加的节点
		*/
		__proto.addChild=function(node){
			if (node===this)return node;
			if (node._parent===this){
				this._childs.splice(this.getChildIndex(node),1);
				this._childs.push(node);
				if (this.model){
					this.model.removeChild(node.model);
					this.model.addChildAt(node.model,this._childs.length-1);
				}
				this._childChanged();
				}else {
				node.parent && node.parent.removeChild(node);
				this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
				this._childs.push(node);
				this.model && this.model.addChildAt(node.model,this._childs.length-1);
				node.parent=this;
			}
			return node;
		}

		/**
		*批量增加子节点
		*@param ...args 无数子节点。
		*/
		__proto.addChildren=function(__args){
			var args=arguments;
			var i=0,n=args.length;
			while (i < n){
				this.addChild(args[i++]);
			}
		}

		/**
		*添加子节点到指定的索引位置。
		*@param node 节点对象。
		*@param index 索引位置。
		*@return 返回添加的节点。
		*/
		__proto.addChildAt=function(node,index){
			if (node===this)return node;
			if (index >=0 && index <=this._childs.length){
				if (node._parent===this){
					var oldIndex=this.getChildIndex(node);
					this._childs.splice(oldIndex,1);
					this._childs.splice(index,0,node);
					if (this.model){
						this.model.removeChild(node.model);
						this.model.addChildAt(node.model,index);
					}
					this._childChanged();
					}else {
					node.parent && node.parent.removeChild(node);
					this._childs===Node.ARRAY_EMPTY && (this._childs=[]);
					this._childs.splice(index,0,node);
					this.model && this.model.addChildAt(node.model,index);
					node.parent=this;
				}
				return node;
				}else {
				throw new Error("appendChildAt:The index is out of bounds");
			}
		}

		/**
		*根据子节点对象，获取子节点的索引位置。
		*@param node 子节点。
		*@return 子节点所在的索引位置。
		*/
		__proto.getChildIndex=function(node){
			return this._childs.indexOf(node);
		}

		/**
		*根据子节点的名字，获取子节点对象。
		*@param name 子节点的名字。
		*@return 节点对象。
		*/
		__proto.getChildByName=function(name){
			var nodes=this._childs;
			for (var i=0,n=nodes.length;i < n;i++){
				var node=nodes[i];
				if (node.name===name)return node;
			}
			return null;
		}

		/**@private */
		__proto._get$P=function(key){
			return this._$P[key];
		}

		/**@private */
		__proto._set$P=function(key,value){
			this._$P===Node.PROP_EMPTY && (this._$P={});
			this._$P[key]=value;
			return value;
		}

		/**
		*根据子节点的索引位置，获取子节点对象。
		*@param index 索引位置
		*@return 子节点
		*/
		__proto.getChildAt=function(index){
			return this._childs[index];
		}

		/**
		*设置子节点的索引位置。
		*@param node 子节点。
		*@param index 新的索引。
		*@return 返回子节点本身。
		*/
		__proto.setChildIndex=function(node,index){
			var childs=this._childs;
			if (index < 0 || index >=childs.length){
				throw new Error("setChildIndex:The index is out of bounds.");
			};
			var oldIndex=this.getChildIndex(node);
			if (oldIndex < 0)throw new Error("setChildIndex:node is must child of this object.");
			childs.splice(oldIndex,1);
			childs.splice(index,0,node);
			if (this.model){
				this.model.removeChild(node.model);
				this.model.addChildAt(node.model,index);
			}
			this._childChanged();
			return node;
		}

		/**
		*@private
		*子节点发生改变。
		*@param child 子节点。
		*/
		__proto._childChanged=function(child){}
		/**
		*删除子节点。
		*@param node 子节点
		*@return 被删除的节点
		*/
		__proto.removeChild=function(node){
			if (!this._childs)return node;
			var index=this._childs.indexOf(node);
			return this.removeChildAt(index);
		}

		/**
		*从父容器删除自己，如已经被删除不会抛出异常。
		*@return 当前节点（ Node ）对象。
		*/
		__proto.removeSelf=function(){
			this._parent && this._parent.removeChild(this);
			return this;
		}

		/**
		*根据子节点名字删除对应的子节点对象，如果找不到不会抛出异常。
		*@param name 对象名字。
		*@return 查找到的节点（ Node ）对象。
		*/
		__proto.removeChildByName=function(name){
			var node=this.getChildByName(name);
			node && this.removeChild(node);
			return node;
		}

		/**
		*根据子节点索引位置，删除对应的子节点对象。
		*@param index 节点索引位置。
		*@return 被删除的节点。
		*/
		__proto.removeChildAt=function(index){
			var node=this.getChildAt(index);
			if (node){
				this._childs.splice(index,1);
				this.model && this.model.removeChild(node.model);
				node.parent=null;
			}
			return node;
		}

		/**
		*删除指定索引区间的所有子对象。
		*@param beginIndex 开始索引。
		*@param endIndex 结束索引。
		*@return 当前节点对象。
		*/
		__proto.removeChildren=function(beginIndex,endIndex){
			(beginIndex===void 0)&& (beginIndex=0);
			(endIndex===void 0)&& (endIndex=0x7fffffff);
			if (this._childs.length > 0){
				var childs=this._childs;
				if (beginIndex===0 && endIndex >=n){
					var arr=childs;
					this._childs=Node.ARRAY_EMPTY;
					}else {
					arr=childs.splice(beginIndex,endIndex-beginIndex);
				}
				for (var i=0,n=arr.length;i < n;i++){
					arr[i].parent=null;
					this.model && this.model.removeChild(arr[i].model);
				}
			}
			return this;
		}

		/**
		*替换子节点。
		*@internal 将传入的新节点对象替换到已有子节点索引位置处。
		*@param newNode 新节点。
		*@param oldNode 老节点。
		*@return 返回新节点。
		*/
		__proto.replaceChild=function(newNode,oldNode){
			var index=this._childs.indexOf(oldNode);
			if (index >-1){
				this._childs.splice(index,1,newNode);
				if (this.model){
					this.model.removeChild(oldNode.model);
					this.model.addChildAt(newNode.model,index);
				}
				oldNode.parent=null;
				newNode.parent=this;
				return newNode;
			}
			return null;
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (this._displayedInStage!==value){
				this._displayedInStage=value;
				if (value)this.event("display");
				else this.event("undisplay");
			}
		}

		/**
		*@private
		*设置指定节点对象是否可见(是否在渲染列表中)。
		*@param node 节点。
		*@param display 是否可见。
		*/
		__proto._displayChild=function(node,display){
			var childs=node._childs;
			if (childs){
				for (var i=childs.length-1;i >-1;i--){
					var child=childs[i];
					child._setDisplay(display);
					child._childs.length && this._displayChild(child,display);
				}
			}
			node._setDisplay(display);
		}

		/**
		*当前容器是否包含 <code>node</code> 节点。
		*@param node 某一个节点 <code>Node</code>。
		*@return 一个布尔值表示是否包含<code>node</code>节点。
		*/
		__proto.contains=function(node){
			if (node===this)return true;
			while (node){
				if (node.parent===this.parent)return true;
				node=node.parent;
			}
			return false;
		}

		/**
		*定时重复执行某函数。
		*@param delay 间隔时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为true。
		*/
		__proto.timerLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(false,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行某函数一次。
		*@param delay 延迟时间(单位毫秒)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为true。
		*/
		__proto.timerOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(false,false,delay,caller,method,args,coverBefore);
		}

		/**
		*定时重复执行某函数(基于帧率)。
		*@param delay 间隔几帧(单位为帧)。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*@param args 回调参数。
		*@param coverBefore 是否覆盖之前的延迟执行，默认为true。
		*/
		__proto.frameLoop=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(true,true,delay,caller,method,args,coverBefore);
		}

		/**
		*定时执行一次某函数(基于帧率)。
		*@param delay 延迟几帧(单位为帧)。
		*@param caller 执行域(this)
		*@param method 结束时的回调方法
		*@param args 回调参数
		*@param coverBefore 是否覆盖之前的延迟执行，默认为true
		*/
		__proto.frameOnce=function(delay,caller,method,args,coverBefore){
			(coverBefore===void 0)&& (coverBefore=true);
			this.timer._create(true,false,delay,caller,method,args,coverBefore);
		}

		/**
		*清理定时器。
		*@param caller 执行域(this)。
		*@param method 结束时的回调方法。
		*/
		__proto.clearTimer=function(caller,method){
			this.timer.clear(caller,method);
		}

		/**
		*子对象数量。
		*/
		__getset(0,__proto,'numChildren',function(){
			return this._childs.length;
		});

		/**父节点。*/
		__getset(0,__proto,'parent',function(){
			return this._parent;
			},function(value){
			if (this._parent!==value){
				if (value){
					this._parent=value;
					this.event("added");
					value.displayedInStage && this._displayChild(this,true);
					value._childChanged(this);
					}else {
					this.event("removed");
					this._parent._childChanged();
					this._displayChild(this,false);
					this._parent=value;
				}
			}
		});

		/**表示是否在显示列表中显示。是否在显示渲染列表中。*/
		__getset(0,__proto,'displayedInStage',function(){
			return this._displayedInStage;
		});

		Node.ARRAY_EMPTY=[];
		Node.PROP_EMPTY={};
		return Node;
	})(EventDispatcher)


	/**
	*...
	*@author anling
	*/
	//class NotifyCenter extends laya.events.EventDispatcher
	var NotifyCenter=(function(_super){
		function NotifyCenter(){
			NotifyCenter.__super.call(this);
		}

		__class(NotifyCenter,'NotifyCenter',_super);
		NotifyCenter.getInstance=function(){
			if (NotifyCenter._instance==null){
				NotifyCenter._instance=new NotifyCenter();
			}
			return NotifyCenter._instance;
		}

		NotifyCenter.KEYBORADCTRL="keyboardCtrl";
		NotifyCenter._instance=null;
		return NotifyCenter;
	})(EventDispatcher)


	/**
	*<code>Resource</code> 是一个资源存取类。
	*/
	//class laya.resource.Resource extends laya.events.EventDispatcher
	var Resource=(function(_super){
		function Resource(){
			this._id=0;
			this._lastUseFrameCount=0;
			this._memorySize=0;
			this._name=null;
			this._released=false;
			this._resourceManager=null;
			this.lock=false;
			Resource.__super.call(this);
			this._$1__id=++Resource._uniqueIDCounter;
			Resource._loadedResources.push(this);
			Resource._isLoadedResourcesSorted=false;
			this._released=true;
			this.lock=false;
			this._memorySize=0;
			this._lastUseFrameCount=-1;
			(ResourceManager.currentResourceManager)&& (ResourceManager.currentResourceManager.addResource(this));
		}

		__class(Resource,'laya.resource.Resource',_super);
		var __proto=Resource.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		/**重新创建资源。override it，同时修改memorySize属性、处理startCreate()和compoleteCreate()方法。*/
		__proto.recreateResource=function(){
			this.startCreate();
			this.compoleteCreate();
		}

		/**销毁资源，override it,同时修改memorySize属性。*/
		__proto.detoryResource=function(){}
		/**
		*激活资源，使用资源前应先调用此函数激活。
		*@param force 是否强制创建。
		*/
		__proto.activeResource=function(force){
			(force===void 0)&& (force=false);
			this._lastUseFrameCount=Stat.loopCount;
			if (this._released || force){
				this.recreateResource();
			}
		}

		/**
		*释放资源。
		*@param force 是否强制释放。
		*@return 是否成功释放。
		*/
		__proto.releaseResource=function(force){
			(force===void 0)&& (force=false);
			if (!force && this.lock)
				return false;
			if (!this._released || force){
				this.detoryResource();
				this._released=true;
				this._lastUseFrameCount=-1;
				this.event("released",this);
				return true;
				}else {
				return false;
			}
		}

		/**
		*设置唯一名字,如果名字重复则自动加上“-copy”。
		*@param newName 名字。
		*/
		__proto.setUniqueName=function(newName){
			var isUnique=true;
			for (var i=0;i < Resource._loadedResources.length;i++){
				if (Resource._loadedResources[i]._name!==newName || Resource._loadedResources[i]===this)
					continue ;
				isUnique=false;
				return;
			}
			if (isUnique){
				if (this.name !=newName){
					this.name=newName;
					Resource._isLoadedResourcesSorted=false;
				}
				}else{
				this.setUniqueName(newName.concat("-copy"));
			}
		}

		/**
		*<p>彻底清理资源。</p>
		*<p><b>注意：</b>会强制解锁清理。</p>
		*/
		__proto.dispose=function(){
			if (this._resourceManager!==null)
				throw new Error("附属于resourceManager的资源不能独立释放！");
			this.lock=false;
			this.releaseResource();
			var index=Resource._loadedResources.indexOf(this);
			if (index!==-1){
				Resource._loadedResources.splice(index,1);
				Resource._isLoadedResourcesSorted=false;
			}
		}

		/**开始资源激活。*/
		__proto.startCreate=function(){
			this.event("recovering",this);
		}

		/**完成资源激活。*/
		__proto.compoleteCreate=function(){
			this._released=false;
			this.event("recovered",this);
		}

		/**
		*获取唯一标识ID(通常用于优化或识别)。
		*/
		__getset(0,__proto,'id',function(){
			return this._$1__id;
		});

		/**
		*是否已释放。
		*/
		__getset(0,__proto,'released',function(){
			return this._released;
		});

		/**
		*设置名字
		*/
		/**
		*获取名字。
		*/
		__getset(0,__proto,'name',function(){
			return this._name;
			},function(value){
			if ((value || value!=="")&& this.name!==value){
				this._name=value;
				Resource._isLoadedResourcesSorted=false;
			}
		});

		/**
		*距离上次使用帧率。
		*/
		__getset(0,__proto,'lastUseFrameCount',function(){
			return this._lastUseFrameCount;
		});

		/**
		*资源管理员。
		*/
		__getset(0,__proto,'resourceManager',function(){
			return this._resourceManager;
		});

		/**
		*占用内存尺寸。
		*/
		__getset(0,__proto,'memorySize',function(){
			return this._memorySize;
			},function(value){
			var offsetValue=value-this._memorySize;
			this._memorySize=value;
			this.resourceManager && this.resourceManager.addSize(offsetValue);
		});

		/**
		*本类型排序后的已载入资源。
		*/
		__getset(1,Resource,'sortedLoadedResourcesByName',function(){
			if (!Resource._isLoadedResourcesSorted){
				Resource._isLoadedResourcesSorted=true;
				Resource._loadedResources.sort(Resource.compareResourcesByName);
			}
			return Resource._loadedResources;
		},laya.events.EventDispatcher._$SET_sortedLoadedResourcesByName);

		Resource.getLoadedResourceByIndex=function(index){
			return Resource._loadedResources[index];
		}

		Resource.getLoadedResourcesCount=function(){
			return Resource._loadedResources.length;
		}

		Resource.compareResourcesByName=function(left,right){
			if (left===right)
				return 0;
			var x=left.name;
			var y=right.name;
			if (x===null){
				if (y===null)
					return 0;
				else
				return-1;
				}else {
				if (y==null)
					return 1;
				else {
					var retval=x.localeCompare(y);
					if (retval !=0)
						return retval;
					else {
						right.setUniqueName(y);
						y=right.name;
						return x.localeCompare(y);
					}
				}
			}
		}

		Resource.animationCache={};
		Resource.meshCache={};
		Resource.materialCache={};
		Resource._uniqueIDCounter=0;
		Resource._loadedResources=[];
		Resource._isLoadedResourcesSorted=false;
		return Resource;
	})(EventDispatcher)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.d2.value.Value2D extends laya.webgl.shader.ShaderValue
	var Value2D=(function(_super){
		function Value2D(mainID,subID){
			this.size=[0,0];
			this.alpha=1.0;
			//this.mmat=null;
			this.ALPHA=1.0;
			//this.shader=null;
			//this.mainID=0;
			this.subID=0;
			//this.filters=null;
			//this.textureHost=null;
			//this.texture=null;
			//this.fillStyle=null;
			//this.color=null;
			//this.strokeStyle=null;
			//this.colorAdd=null;
			//this.glTexture=null;
			//this.u_mmat2=null;
			this.u_pos=[0,0];
			//this._inClassCache=null;
			this._cacheID=0;
			Value2D.__super.call(this);
			this.defines=new ShaderDefines2D();
			this.position=Value2D._POSITION;
			this.mainID=mainID;
			this.subID=subID;
			this.textureHost=null;
			this.texture=null;
			this.fillStyle=null;
			this.color=null;
			this.strokeStyle=null;
			this.colorAdd=null;
			this.glTexture=null;
			this.u_mmat2=null;
			this._cacheID=mainID|subID;
			this._inClassCache=Value2D._cache[this._cacheID];
			if (mainID>0 && !this._inClassCache){
				this._inClassCache=Value2D._cache[this._cacheID]=[];
				this._inClassCache._length=0;
			}
			this.clear();
		}

		__class(Value2D,'laya.webgl.shader.d2.value.Value2D',_super);
		var __proto=Value2D.prototype;
		__proto.setValue=function(value){}
		//throw new Error("todo in subclass");
		__proto.refresh=function(){
			var size=this.size;
			size[0]=RenderState2D.width;
			size[1]=RenderState2D.height;
			this.alpha=this.ALPHA *RenderState2D.worldAlpha;
			this.mmat=RenderState2D.worldMatrix4;
			return this;
		}

		__proto._ShaderWithCompile=function(){
			return Shader.withCompile(0,this.mainID,this.defines.toNameDic(),this.mainID | this.defines._value,Shader2X.create);
		}

		__proto._withWorldShaderDefines=function(){
			var defs=RenderState2D.worldShaderDefines;
			var sd=Shader.sharders [this.mainID | this.defines._value | defs.getValue()];
			if (!sd){
				var def={};
				var dic;
				var name;
				dic=this.defines.toNameDic();for (name in dic)def[name]="";
				dic=defs.toNameDic();for (name in dic)def[name]="";
				sd=Shader.withCompile(0,this.mainID,def,this.mainID | this.defines._value| defs.getValue(),Shader2X.create);
			};
			var worldFilters=RenderState2D.worldFilters;
			if (!worldFilters)return sd;
			var n=worldFilters.length,f;
			for (var i=0;i < n;i++){
				((f=worldFilters[i]))&& f.action.setValue(this);
			}
			return sd;
		}

		__proto.upload=function(){
			var renderstate2d=RenderState2D;
			this.alpha=this.ALPHA *renderstate2d.worldAlpha;
			if (RenderState2D.worldMatrix4!==RenderState2D.TEMPMAT4_ARRAY)this.defines.add(0x80);
			var sd=renderstate2d.worldShaderDefines?this._withWorldShaderDefines():(Shader.sharders [this.mainID | this.defines._value] || this._ShaderWithCompile());
			var params;
			this.size[0]=renderstate2d.width,this.size[1]=renderstate2d.height;
			this.mmat=renderstate2d.worldMatrix4;
			if (Shader.activeShader!==sd){
				if (sd._shaderValueWidth!==renderstate2d.width || sd._shaderValueHeight!==renderstate2d.height){
					sd._shaderValueWidth=renderstate2d.width;
					sd._shaderValueHeight=renderstate2d.height;
				}
				else{
					params=sd._params2dQuick2 || sd._make2dQuick2();
				}
				sd.upload(this,params);
			}
			else{
				if (sd._shaderValueWidth!==renderstate2d.width || sd._shaderValueHeight!==renderstate2d.height){
					sd._shaderValueWidth=renderstate2d.width;
					sd._shaderValueHeight=renderstate2d.height;
				}
				else{
					params=(sd._params2dQuick1)|| sd._make2dQuick1();
				}
				sd.upload(this,params);
			}
		}

		__proto.setFilters=function(value){
			this.filters=value;
			if (!value)
				return;
			var n=value.length,f;
			for (var i=0;i < n;i++){
				f=value[i]
				if (f){
					this.defines.add(f.type);
					f.action.setValue(this);
				}
			}
		}

		__proto.clear=function(){
			this.defines.setValue(this.subID);
		}

		__proto.release=function(){
			this._inClassCache[this._inClassCache._length++]=this;
			this.fillStyle=null;
			this.strokeStyle=null;
			this.clear();
		}

		Value2D._initone=function(type,classT){
			Value2D._typeClass[type]=classT;
			Value2D._cache[type]=[];
			Value2D._cache[type]._length=0;
		}

		Value2D.__init__=function(){
			Value2D._POSITION=[2,0x1406,false,4 *CONST3D2D.BYTES_PE,0];
			Value2D._TEXCOORD=[2,0x1406,false,4 *CONST3D2D.BYTES_PE,2 *CONST3D2D.BYTES_PE];
			Value2D._initone(0x02,Color2dSV);
			Value2D._initone(0x04,PrimitiveSV);
			Value2D._initone(0x01,TextureSV);
			Value2D._initone(0x01 | 0x40,TextSV);
			Value2D._initone(0x01 | 0x08,TextureSV);
		}

		Value2D.create=function(mainType,subType){
			var types=Value2D._cache[mainType|subType];
			if (types._length)
				return types[--types._length];
			else
			return new Value2D._typeClass[mainType|subType](subType);
		}

		Value2D._POSITION=null
		Value2D._TEXCOORD=null
		Value2D._cache=[];
		Value2D._typeClass=[];
		Value2D.TEMPMAT4_ARRAY=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		return Value2D;
	})(ShaderValue)


	/**
	*<code>Texture</code> 是一个纹理处理类。
	*/
	//class laya.resource.Texture extends laya.events.EventDispatcher
	var Texture=(function(_super){
		function Texture(bitmap,uv){
			//this.bitmap=null;
			//this.uv=null;
			this.offsetX=0;
			this.offsetY=0;
			this.sourceWidth=0;
			this.sourceHeight=0;
			//this._loaded=false;
			this._w=0;
			this._h=0;
			//this.$_GID=NaN;
			//this.url=null;
			this._uvID=0;
			Texture.__super.call(this);
			if (bitmap){
				bitmap.useNum++;
			}
			this.setTo(bitmap,uv);
		}

		__class(Texture,'laya.resource.Texture',_super);
		var __proto=Texture.prototype;
		/**
		*设置此对象的位图资源、UV数据信息。
		*@param bitmap 位图资源
		*@param uv UV数据信息
		*/
		__proto.setTo=function(bitmap,uv){
			this.bitmap=bitmap;
			this.uv=uv || Texture.DEF_UV;
			if (bitmap){
				this._w=bitmap.width;
				this._h=bitmap.height;
				this.sourceWidth=this.sourceWidth || this._w;
				this.sourceHeight=this.sourceHeight || this._h
				this._loaded=this._w > 0;
				var _this=this;
				if (this._loaded){
					RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
					}else {
					var bm=bitmap;
					if ((bm instanceof laya.resource.HTMLImage )&& bm.image)
						bm.image.addEventListener('load',function(e){
						RunDriver.addToAtlas && RunDriver.addToAtlas(_this);
					},false);
				}
			}
		}

		/**@private 激活资源。*/
		__proto.active=function(){
			this.bitmap.activeResource();
		}

		/**
		*销毁纹理（分直接销毁，跟计数销毁两种）
		*@param foreDiposeTexture true为强制销毁主纹理，false是通过计数销毁纹理
		*/
		__proto.destroy=function(foreDiposeTexture){
			(foreDiposeTexture===void 0)&& (foreDiposeTexture=false);
			if (this.bitmap && (this.bitmap).useNum > 0){
				if (foreDiposeTexture){
					this.bitmap.dispose();
					(this.bitmap).useNum=0;
					}else {
					(this.bitmap).useNum--;
					if ((this.bitmap).useNum==0){
						this.bitmap.dispose();
					}
				}
				this.bitmap=null;
				if (this.url)Laya.loader.clearRes(this.url);
				this._loaded=false;
			}
		}

		/**
		*加载指定地址的图片。
		*@param url 图片地址。
		*/
		__proto.load=function(url){
			var _$this=this;
			this._loaded=false;
			var fileBitmap=(this.bitmap || (this.bitmap=HTMLImage.create(URL.formatURL(url))));
			if (fileBitmap){
				fileBitmap.useNum++;
			};
			var _this=this;
			fileBitmap.onload=function (){
				fileBitmap.onload=null;
				_this._loaded=true;
				_$this.sourceWidth=_$this._w=fileBitmap.width;
				_$this.sourceHeight=_$this._h=fileBitmap.height;
				_this.event("loaded",this);
				(RunDriver.addToAtlas)&& (RunDriver.addToAtlas(_this));
			};
		}

		/**@private */
		__proto.addTextureToAtlas=function(e){
			RunDriver.addTextureToAtlas(this);
		}

		/**
		*获取Texture上的某个区域的像素点
		*@param x
		*@param y
		*@param width
		*@param height
		*@return 返回像素点集合
		*/
		__proto.getPixels=function(x,y,width,height){
			if (Render.isWebGL){
				return RunDriver.getTexturePixels(this,x,y,width,height);
				}else {
				Browser.canvas.size(x+width,y+height);
				Browser.context.drawImage(this.bitmap.source,0,0);
				Browser.document.body.appendChild(Browser.canvas.source);
				var info=Browser.context.getImageData(x,y,width,height);
			}
			return info.data;
		}

		/**激活并获取资源。*/
		__getset(0,__proto,'source',function(){
			this.bitmap.activeResource();
			return this.bitmap.source;
		});

		/**
		*表示是否加载成功，只能表示初次载入成功（通常包含下载和载入）,并不能完全表示资源是否可立即使用（资源管理机制释放影响等）。
		*/
		__getset(0,__proto,'loaded',function(){
			return this._loaded;
		});

		/**
		*表示资源是否已释放。
		*/
		__getset(0,__proto,'released',function(){
			return this.bitmap.released;
		});

		/**实际宽度。*/
		__getset(0,__proto,'width',function(){
			if (this._w)return this._w;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[2]-this.uv[0])*this.bitmap.width :this.bitmap.width;
			},function(value){
			this._w=value;
			this.sourceWidth || (this.sourceWidth=value);
		});

		/**
		*通过外部设置是否启用纹理平铺(后面要改成在着色器里计算)
		*/
		/**
		*获取当前纹理是否启用了纹理平铺
		*/
		__getset(0,__proto,'repeat',function(){
			if (Render.isWebGL && this.bitmap){
				return this.bitmap.repeat;
			}
			return true;
			},function(value){
			if (value){
				if (Render.isWebGL && this.bitmap){
					this.bitmap.repeat=value;
					if (value){
						this.bitmap.enableMerageInAtlas=false;
					}
				}
			}
		});

		/**实际高度。*/
		__getset(0,__proto,'height',function(){
			if (this._h)return this._h;
			return (this.uv && this.uv!==Texture.DEF_UV)? (this.uv[5]-this.uv[1])*this.bitmap.height :this.bitmap.height;
			},function(value){
			this._h=value;
			this.sourceHeight || (this.sourceHeight=value);
		});

		/**
		*设置线性采样的状态（目前只能第一次绘制前设置false生效,来关闭线性采样）
		*/
		/**
		*获取当前纹理是否启用了线性采样
		*/
		__getset(0,__proto,'isLinearSampling',function(){
			return Render.isWebGL ? (this.bitmap.minFifter !=0x2600):true;
			},function(value){
			if (!value && Render.isWebGL){
				if (!value && (this.bitmap.minFifter==-1)&& (this.bitmap.magFifter==-1)){
					this.bitmap.minFifter=0x2600;
					this.bitmap.magFifter=0x2600;
					this.bitmap.enableMerageInAtlas=false;
				}
			}
		});

		Texture.moveUV=function(offsetX,offsetY,uv){
			for (var i=0;i < 8;i+=2){
				uv[i]+=offsetX;
				uv[i+1]+=offsetY;
			}
			return uv;
		}

		Texture.create=function(source,x,y,width,height,offsetX,offsetY,sourceWidth,sourceHeight){
			(offsetX===void 0)&& (offsetX=0);
			(offsetY===void 0)&& (offsetY=0);
			(sourceWidth===void 0)&& (sourceWidth=0);
			(sourceHeight===void 0)&& (sourceHeight=0);
			var btex=(source instanceof laya.resource.Texture );
			var uv=btex ? source.uv :Texture.DEF_UV;
			var bitmap=btex ? source.bitmap :source;
			var tex=new Texture(bitmap,null);
			tex.width=width;
			tex.height=height;
			tex.offsetX=offsetX;
			tex.offsetY=offsetY;
			tex.sourceWidth=sourceWidth || width;
			tex.sourceHeight=sourceHeight || height;
			var dwidth=1 / bitmap.width;
			var dheight=1 / bitmap.height;
			x *=dwidth;
			y *=dheight;
			width *=dwidth;
			height *=dheight;
			var u1=tex.uv[0],v1=tex.uv[1],u2=tex.uv[4],v2=tex.uv[5];
			var inAltasUVWidth=(u2-u1),inAltasUVHeight=(v2-v1);
			var oriUV=Texture.moveUV(uv[0],uv[1],[x,y,x+width,y,x+width,y+height,x,y+height]);
			tex.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
			return tex;
		}

		Texture.createFromTexture=function(texture,x,y,width,height){
			var rect=Rectangle.TEMP.setTo(x-texture.offsetX,y-texture.offsetY,width,height);
			var result=rect.intersection(Texture._rect1.setTo(0,0,texture.width,texture.height),Texture._rect2);
			if (result)
				var tex=Texture.create(texture,result.x,result.y,result.width,result.height,result.x-rect.x,result.y-rect.y,width,height);
			else return null;
			tex.bitmap.useNum--;
			return tex;
		}

		Texture.DEF_UV=[0,0,1.0,0,1.0,1.0,0,1.0];
		Texture.INV_UV=[0,1,1.0,1,1.0,0.0,0,0.0];
		Texture._rect1=new Rectangle();
		Texture._rect2=new Rectangle();
		return Texture;
	})(EventDispatcher)


	/**
	*<p> <code>LoaderManager</code> 类用于用于批量加载资源、数据。</p>
	*<p>批量加载器，单例，可以通过Laya.loader访问。</p>
	*多线程(默认5个线程)，5个优先级(0最快，4最慢,默认为1)
	*某个资源加载失败后，会按照最低优先级重试加载(属性retryNum决定重试几次)，如果重试后失败，则调用complete函数，并返回null
	*/
	//class laya.net.LoaderManager extends laya.events.EventDispatcher
	var LoaderManager=(function(_super){
		var ResInfo;
		function LoaderManager(){
			this.retryNum=1;
			this.maxLoader=5;
			this._loaders=[];
			this._loaderCount=0;
			this._resInfos=[];
			this._resMap={};
			this._infoPool=[];
			this._maxPriority=5;
			this._failRes={};
			LoaderManager.__super.call(this);
			for (var i=0;i < this._maxPriority;i++)this._resInfos[i]=[];
		}

		__class(LoaderManager,'laya.net.LoaderManager',_super);
		var __proto=LoaderManager.prototype;
		/**
		*加载资源。
		*@param url 地址，或者资源对象数组(简单数组：["a.png","b.png"]，复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}])。
		*@param complete 结束回调，如果加载失败，则返回 null 。
		*@param progress 进度回调，回调参数为当前文件加载的进度信息(0-1)。
		*@param type 资源类型。
		*@param priority 优先级，0-4，五个优先级，0优先级最高，默认为1。
		*@param cache 是否缓存加载结果。
		*@return 此 LoaderManager 对象。
		*/
		__proto.load=function(url,complete,progress,type,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			if ((url instanceof Array))return this._loadAssets(url,complete,progress,priority,cache);
			url=URL.formatURL(url);
			var content=Loader.getRes(url);
			if (content !=null){
				complete && complete.runWith(content);
				this._loaderCount || this.event("complete");
				}else {
				var info=this._resMap[url];
				if (!info){
					info=this._infoPool.length ? this._infoPool.pop():new ResInfo();
					info.url=url;
					info.type=type;
					info.cache=cache;
					complete && info.on("complete",complete.caller,complete.method,complete.args);
					progress && info.on("progress",progress.caller,progress.method,progress.args);
					this._resMap[url]=info;
					priority=priority < this._maxPriority ? priority :this._maxPriority-1;
					this._resInfos[priority].push(info);
					this._next();
					}else {
					complete && info.on("complete",complete.caller,complete.method,complete.args);
					progress && info.on("progress",progress.caller,progress.method,progress.args);
				}
			}
			return this;
		}

		__proto._next=function(){
			if (this._loaderCount >=this.maxLoader)return;
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				if (infos.length > 0){
					var info=infos.shift();
					if (info)return this._doLoad(info);
				}
			}
			this._loaderCount || this.event("complete");
		}

		__proto._doLoad=function(resInfo){
			this._loaderCount++;
			var loader=this._loaders.length ? this._loaders.pop():new Loader();
			loader.on("complete",null,onLoaded);
			loader.on("progress",null,function(num){
				resInfo.event("progress",num);
			});
			loader.on("error",null,function(msg){
				onLoaded(null);
			});
			var _this=this;
			function onLoaded (data){
				loader.offAll();
				loader._data=null;
				_this._loaders.push(loader);
				_this._endLoad(resInfo,data);
				_this._loaderCount--;
				_this._next();
			}
			loader.load(resInfo.url,resInfo.type,resInfo.cache);
		}

		__proto._endLoad=function(resInfo,content){
			if (content===null){
				var errorCount=this._failRes[resInfo.url] || 0;
				if (errorCount < this.retryNum){
					console.log("[warn]Retry to load:",resInfo.url);
					this._failRes[resInfo.url]=errorCount+1;
					this._resInfos[this._maxPriority-1].push(resInfo);
					return;
					}else {
					console.log("[error]Failed to load:",resInfo.url);
					this.event("error",resInfo.url);
				}
			}
			delete this._resMap[resInfo.url];
			resInfo.event("complete",content);
			resInfo.offAll();
			this._infoPool.push(resInfo);
		}

		/**
		*清理指定资源地址缓存。
		*@param url 资源地址。
		*/
		__proto.clearRes=function(url){
			Loader.clearRes(url);
		}

		/**
		*获取指定资源地址的资源。
		*@param url 资源地址。
		*@return 返回资源。
		*/
		__proto.getRes=function(url){
			return Loader.getRes(url);
		}

		/**清理当前未完成的加载，所有未加载的内容全部停止加载。*/
		__proto.clearUnLoaded=function(){
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				for (var j=infos.length-1;j >-1;j--){
					var info=infos[j];
					if (info){
						info.offAll();
						this._infoPool.push(info);
					}
				}
				infos.length=0;
			}
			this._loaderCount=0;
			this._resMap={};
		}

		/**
		*根据地址集合清理掉未加载的内容
		*@param urls 资源地址集合
		*/
		__proto.cancelLoadByUrls=function(urls){
			if (!urls)return;
			for (var i=0,n=urls.length;i < n;i++){
				this.cancelLoadByUrl(urls[i]);
			}
		}

		/**
		*根据地址清理掉未加载的内容
		*@param url 资源地址
		*/
		__proto.cancelLoadByUrl=function(url){
			url=URL.formatURL(url);
			for (var i=0;i < this._maxPriority;i++){
				var infos=this._resInfos[i];
				for (var j=infos.length-1;j >-1;j--){
					var info=infos[j];
					if (info && info.url===url){
						infos[j]=null;
						info.offAll();
						this._infoPool.push(info);
					}
				}
			}
			if (this._resMap[url])delete this._resMap[url];
		}

		/**
		*@private
		*加载数组里面的资源。
		*@param arr 简单：["a.png","b.png"]，复杂[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}]*/
		__proto._loadAssets=function(arr,complete,progress,priority,cache){
			(priority===void 0)&& (priority=1);
			(cache===void 0)&& (cache=true);
			var itemCount=arr.length;
			var loadedSize=0;
			var totalSize=0;
			var items=[];
			for (var i=0;i < itemCount;i++){
				var item=arr[i];
				if ((typeof item=='string'))item={url:item,type:"image",size:1,priority:priority};
				if (!item.size)item.size=1;
				item.progress=0;
				totalSize+=item.size;
				items.push(item);
				var progressHandler=progress ? Handler.create(this,loadProgress,[item],false):null;
				this.load(item.url,Handler.create(item,loadComplete,[item]),progressHandler,item.type,item.priority || 1,cache);
			}
			function loadComplete (item,content){
				loadedSize++;
				item.progress=1;
				if (loadedSize===itemCount && complete){
					complete.run();
				}
			}
			function loadProgress (item,value){
				if (progress !=null){
					item.progress=value;
					var num=0;
					var count=items.length;
					for (var j=0;j < count;j++){
						var item1=items[j];
						num+=item1.size *item1.progress;
					};
					var v=num / totalSize;
					progress.runWith(v);
				}
			}
			return this;
		}

		LoaderManager.cacheRes=function(url,data){
			Loader.cacheRes(url,data);
		}

		LoaderManager.__init$=function(){
			//class ResInfo extends laya.events.EventDispatcher
			ResInfo=(function(_super){
				function ResInfo(){
					this.url=null;
					this.type=null;
					this.cache=false;
					ResInfo.__super.call(this);
				}
				__class(ResInfo,'',_super);
				return ResInfo;
			})(EventDispatcher)
		}

		return LoaderManager;
	})(EventDispatcher)


	/**
	*@private
	*使用Audio标签播放声音
	*/
	//class laya.media.h5audio.AudioSound extends laya.events.EventDispatcher
	var AudioSound=(function(_super){
		function AudioSound(){
			this.url=null;
			this.audio=null;
			this.loaded=false;
			AudioSound.__super.call(this);
		}

		__class(AudioSound,'laya.media.h5audio.AudioSound',_super);
		var __proto=AudioSound.prototype;
		/**
		*释放声音
		*
		*/
		__proto.dispose=function(){
			var ad=AudioSound._audioCache[this.url];
			if (ad){
				ad.src="";
				delete AudioSound._audioCache[this.url];
			}
		}

		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){
			this.url=url;
			var ad=AudioSound._audioCache[url];
			if (ad && ad.readyState >=2){
				this.event("complete");
				return;
			}
			if (!ad){
				ad=Browser.createElement("audio");
				ad.src=url;
				AudioSound._audioCache[url]=ad;
			}
			ad.addEventListener("canplaythrough",onLoaded);
			ad.addEventListener("error",onErr);
			var me=this;
			function onLoaded (){
				offs();
				me.loaded=true;
				me.event("complete");
			}
			function onErr (){
				offs();
				me.event("error");
			}
			function offs (){
				ad.removeEventListener("canplaythrough",onLoaded);
				ad.removeEventListener("error",onErr);
			}
			this.audio=ad;
			ad.load();
		}

		/**
		*播放声音
		*@param startTime 起始时间
		*@param loops 循环次数
		*@return
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			if (!this.url)return null;
			var ad;
			ad=AudioSound._audioCache[this.url];
			if (!ad)return null;
			var tAd;
			tAd=Pool.getItem("audio:"+this.url);
			tAd=tAd?tAd:ad.cloneNode(true);
			var channel=new AudioSoundChannel(tAd);
			channel.url=this.url;
			channel.loops=loops;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		AudioSound._audioCache={};
		return AudioSound;
	})(EventDispatcher)


	/**
	*<code>SoundChannel</code> 用来控制程序中的声音。
	*/
	//class laya.media.SoundChannel extends laya.events.EventDispatcher
	var SoundChannel=(function(_super){
		function SoundChannel(){
			this.url=null;
			this.loops=0;
			this.startTime=NaN;
			this.isStopped=false;
			this.completeHandler=null;
			SoundChannel.__super.call(this);
		}

		__class(SoundChannel,'laya.media.SoundChannel',_super);
		var __proto=SoundChannel.prototype;
		/**
		*播放。
		*/
		__proto.play=function(){}
		/**
		*停止。
		*/
		__proto.stop=function(){}
		/**
		*private
		*/
		__proto.__runComplete=function(handler){
			if (handler){
				handler.run();
			}
		}

		/**
		*音量。
		*/
		__getset(0,__proto,'volume',function(){
			return 1;
			},function(v){
		});

		/**
		*获取当前播放时间。
		*/
		__getset(0,__proto,'position',function(){
			return 0;
		});

		return SoundChannel;
	})(EventDispatcher)


	/**
	*<code>Sound</code> 类是用来播放控制声音的类。
	*/
	//class laya.media.Sound extends laya.events.EventDispatcher
	var Sound=(function(_super){
		function Sound(){Sound.__super.call(this);;
		};

		__class(Sound,'laya.media.Sound',_super);
		var __proto=Sound.prototype;
		/**
		*加载声音。
		*@param url 地址。
		*
		*/
		__proto.load=function(url){}
		/**
		*播放声音。
		*@param startTime 开始时间,单位秒
		*@param loops 循环次数,0表示一直循环
		*@return 声道 SoundChannel 对象。
		*
		*/
		__proto.play=function(startTime,loops){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			return null;
		}

		/**
		*释放声音资源。
		*
		*/
		__proto.dispose=function(){}
		return Sound;
	})(EventDispatcher)


	/**
	*@private
	*web audio api方式播放声音
	*/
	//class laya.media.webaudio.WebAudioSound extends laya.events.EventDispatcher
	var WebAudioSound=(function(_super){
		function WebAudioSound(){
			this.url=null;
			this.loaded=false;
			this.data=null;
			this.audioBuffer=null;
			this.__toPlays=null;
			WebAudioSound.__super.call(this);
		}

		__class(WebAudioSound,'laya.media.webaudio.WebAudioSound',_super);
		var __proto=WebAudioSound.prototype;
		/**
		*加载声音
		*@param url
		*
		*/
		__proto.load=function(url){
			var me=this;
			this.url=url;
			this.audioBuffer=WebAudioSound._dataCache[url];
			if (this.audioBuffer){
				this._loaded(this.audioBuffer);
				return;
			}
			WebAudioSound.e.on("loaded:"+url,this,this._loaded);
			WebAudioSound.e.on("err:"+url,this,this._err);
			if (WebAudioSound.__loadingSound[url]){
				return;
			}
			WebAudioSound.__loadingSound[url]=true;
			var request=new Browser.window.XMLHttpRequest();
			request.open("GET",url,true);
			request.responseType="arraybuffer";
			request.onload=function (){
				me.data=request.response;
				WebAudioSound.buffs.push({"buffer":me.data,"url":me.url});
				WebAudioSound.decode();
			};
			request.send();
		}

		__proto._err=function(){
			this._removeLoadEvents();
			this.event("error");
		}

		__proto._loaded=function(audioBuffer){
			this._removeLoadEvents();
			this.audioBuffer=audioBuffer;
			WebAudioSound._dataCache[this.url]=this.audioBuffer;
			this.loaded=true;
			this.event("complete");
		}

		__proto._removeLoadEvents=function(){
			WebAudioSound.e.off("loaded:"+this.url,this,this._loaded);
			WebAudioSound.e.off("err:"+this.url,this,this._err);
		}

		__proto.__playAfterLoaded=function(){
			if (!this.__toPlays)return;
			var i=0,len=0;
			var toPlays;
			toPlays=this.__toPlays;
			len=toPlays.length;
			var tParams;
			for (i=0;i < len;i++){
				tParams=toPlays[i];
				if(tParams[2]&&!(tParams [2]).isStopped){
					this.play(tParams[0],tParams[1],tParams[2]);
				}
			}
			this.__toPlays.length=0;
		}

		/**
		*播放声音
		*@param startTime 起始时间
		*@param loops 循环次数
		*@return
		*
		*/
		__proto.play=function(startTime,loops,channel){
			(startTime===void 0)&& (startTime=0);
			(loops===void 0)&& (loops=0);
			channel=channel ? channel :new WebAudioSoundChannel();
			if (!this.audioBuffer){
				if (this.url){
					if (!this.__toPlays)this.__toPlays=[];
					this.__toPlays.push([startTime,loops,channel]);
					this.once("complete",this,this.__playAfterLoaded);
					this.load(this.url);
				}
			}
			channel.url=this.url;
			channel.loops=loops;
			channel["audioBuffer"]=this.audioBuffer;
			channel.startTime=startTime;
			channel.play();
			SoundManager.addChannel(channel);
			return channel;
		}

		__proto.dispose=function(){
			delete WebAudioSound._dataCache[this.url];
			delete WebAudioSound.__loadingSound[this.url];
		}

		WebAudioSound.decode=function(){
			if (WebAudioSound.buffs.length <=0 || WebAudioSound.isDecoding){
				return;
			}
			WebAudioSound.isDecoding=true;
			WebAudioSound.tInfo=WebAudioSound.buffs.shift();
			WebAudioSound.ctx.decodeAudioData(WebAudioSound.tInfo["buffer"],WebAudioSound._done,WebAudioSound._fail);
		}

		WebAudioSound._done=function(audioBuffer){
			WebAudioSound.e.event("loaded:"+WebAudioSound.tInfo.url,audioBuffer);
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._fail=function(){
			WebAudioSound.e.event("err:"+WebAudioSound.tInfo.url,null);
			WebAudioSound.isDecoding=false;
			WebAudioSound.decode();
		}

		WebAudioSound._playEmptySound=function(){
			if (WebAudioSound.ctx==null){return;};
			var source=WebAudioSound.ctx.createBufferSource();
			source.buffer=WebAudioSound._miniBuffer;
			source.connect(WebAudioSound.ctx.destination);
			source.start(0,0,0);
		}

		WebAudioSound._unlock=function(){
			if (WebAudioSound._unlocked){return;}
				WebAudioSound._playEmptySound();
			if (WebAudioSound.ctx.state=="running"){
				Browser.document.removeEventListener("mousedown",WebAudioSound._unlock,true);
				Browser.document.removeEventListener("touchend",WebAudioSound._unlock,true);
				WebAudioSound._unlocked=true;
			}
		}

		WebAudioSound.initWebAudio=function(){
			if (WebAudioSound.ctx.state !="running"){
				WebAudioSound._unlock();
				Browser.document.addEventListener("mousedown",WebAudioSound._unlock,true);
				Browser.document.addEventListener("touchend",WebAudioSound._unlock,true);
			}
		}

		WebAudioSound._dataCache={};
		WebAudioSound.buffs=[];
		WebAudioSound.isDecoding=false;
		WebAudioSound._unlocked=false;
		WebAudioSound.tInfo=null
		WebAudioSound.__loadingSound={};
		__static(WebAudioSound,
		['window',function(){return this.window=Browser.window;},'webAudioEnabled',function(){return this.webAudioEnabled=WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"];},'ctx',function(){return this.ctx=WebAudioSound.webAudioEnabled ? new (WebAudioSound.window["AudioContext"] || WebAudioSound.window["webkitAudioContext"] || WebAudioSound.window["mozAudioContext"])():undefined;},'_miniBuffer',function(){return this._miniBuffer=WebAudioSound.ctx.createBuffer(1,1,22050);},'e',function(){return this.e=new EventDispatcher();}
		]);
		return WebAudioSound;
	})(EventDispatcher)


	/**
	*<code>HttpRequest</code> 通过 HTTP 协议传送或接收 XML 及其他数据。
	*/
	//class laya.net.HttpRequest extends laya.events.EventDispatcher
	var HttpRequest=(function(_super){
		function HttpRequest(){
			this._responseType=null;
			this._data=null;
			HttpRequest.__super.call(this);
			this._http=new Browser.window.XMLHttpRequest();
		}

		__class(HttpRequest,'laya.net.HttpRequest',_super);
		var __proto=HttpRequest.prototype;
		/**
		*发送请求。
		*@param url 请求的地址。
		*@param data 发送的数据，可选。
		*@param method 发送数据方式，值为“get”或“post”，默认为 “get”方式。
		*@param responseType 返回消息类型，可设置为"text"，"json"，"xml","arraybuffer"。
		*@param headers 头信息，key value数组，比如["Content-Type","application/json"]。
		*/
		__proto.send=function(url,data,method,responseType,headers){
			(method===void 0)&& (method="get");
			(responseType===void 0)&& (responseType="text");
			this._responseType=responseType;
			this._data=null;
			var _this=this;
			var http=this._http;
			http.open(method,url,true);
			if (headers){
				for (var i=0;i < headers.length;i++){
					http.setRequestHeader(headers[i++],headers[i]);
				}
				}else {
				if (!data || (typeof data=='string'))http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				else http.setRequestHeader("Content-Type","application/json");
			}
			http.responseType=responseType!=="arraybuffer" ? "text" :"arraybuffer";
			http.onerror=function (e){
				_this._onError(e);
			}
			http.onabort=function (e){
				_this._onAbort(e);
			}
			http.onprogress=function (e){
				_this._onProgress(e);
			}
			http.onload=function (e){
				_this._onLoad(e);
			}
			http.send(data);
		}

		/**
		*@private
		*请求进度的侦听处理函数。
		*@param e 事件对象。
		*/
		__proto._onProgress=function(e){
			if (e && e.lengthComputable)this.event("progress",e.loaded / e.total);
		}

		/**
		*@private
		*请求中断的侦听处理函数。
		*@param e 事件对象。
		*/
		__proto._onAbort=function(e){
			this.error("Request was aborted by user");
		}

		/**
		*@private
		*请求出错侦的听处理函数。
		*@param e 事件对象。
		*/
		__proto._onError=function(e){
			this.error("Request failed Status:"+this._http.status+" text:"+this._http.statusText);
		}

		/**
		*@private
		*请求消息返回的侦听处理函数。
		*@param e 事件对象。
		*/
		__proto._onLoad=function(e){
			var http=this._http;
			var status=http.status!==undefined ? http.status :200;
			if (status===200 || status===204 || status===0){
				this.complete();
				}else {
				this.error("["+http.status+"]"+http.statusText+":"+http.responseURL);
			}
		}

		/**
		*@private
		*请求错误的处理函数。
		*@param message 错误信息。
		*/
		__proto.error=function(message){
			this.clear();
			this.event("error",message);
		}

		/**
		*@private
		*请求成功完成的处理函数。
		*/
		__proto.complete=function(){
			this.clear();
			try {
				if (this._responseType==="json"){
					this._data=JSON.parse(this._http.responseText);
					}else if (this._responseType==="xml"){
					this._data=Utils.parseXMLFromString(this._http.responseText);
					}else {
					this._data=this._http.response || this._http.responseText;
				}
				this.event("complete",(this._data instanceof Array)? [this._data] :this._data);
				}catch (e){
				this.error(e.message);
			}
		}

		/**
		*@private
		*清除当前请求。
		*/
		__proto.clear=function(){
			var http=this._http;
			http.onerror=http.onabort=http.onprogress=http.onload=null;
		}

		/**请求的地址。*/
		__getset(0,__proto,'url',function(){
			return this._http.responseURL;
		});

		/**返回的数据。*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		return HttpRequest;
	})(EventDispatcher)


	/**
	*<code>Loader</code> 类可用来加载文本、JSON、XML、二进制、图像等资源。
	*/
	//class laya.net.Loader extends laya.events.EventDispatcher
	var Loader=(function(_super){
		function Loader(){
			this._data=null;
			this._url=null;
			this._type=null;
			this._cache=false;
			this._http=null;
			Loader.__super.call(this);
		}

		__class(Loader,'laya.net.Loader',_super);
		var __proto=Loader.prototype;
		/**
		*加载资源。
		*@param url 地址
		*@param type 类型，如果为null，则根据文件后缀，自动分析类型。
		*@param cache 是否缓存数据。
		*/
		__proto.load=function(url,type,cache){
			(cache===void 0)&& (cache=true);
			url=URL.formatURL(url);
			this._url=url;
			this._type=type || (type=this.getTypeFromUrl(url));
			this._cache=cache;
			this._data=null;
			if (Loader.loadedMap[url]){
				this._data=Loader.loadedMap[url];
				this.event("progress",1);
				this.event("complete",this._data);
				return;
			}
			if (Loader.parserMap[type] !=null){
				if (((Loader.parserMap[type])instanceof laya.utils.Handler ))Loader.parserMap[type].runWith(this);
				else Loader.parserMap[type].call(null,this);
				return;
			}
			if (type==="image" || type==="htmlimage" || type==="nativeimage")return this._loadImage(url);
			if (type==="sound")return this._loadSound(url);
			if (!this._http){
				this._http=new HttpRequest();
				this._http.on("progress",this,this.onProgress);
				this._http.on("error",this,this.onError);
				this._http.on("complete",this,this.onLoaded);
			}
			this._http.send(url,null,"get",type!=="atlas" ? type :"json");
		}

		/**
		*获取指定资源地址的数据类型。
		*@param url 资源地址。
		*@return 数据类型。
		*/
		__proto.getTypeFromUrl=function(url){
			Loader._extReg.lastIndex=url.lastIndexOf(".");
			var result=Loader._extReg.exec(url);
			if (result && result.length > 1){
				return Loader.typeMap[result[1].toLowerCase()];
			}
			console.log("Not recognize the resources suffix",url);
			return "text";
		}

		/**
		*@private
		*加载图片资源。
		*@param url 资源地址。
		*/
		__proto._loadImage=function(url){
			if (this._type==="nativeimage"){
				var image=new Browser.window.Image();
				image.crossOrigin="";
				image.src=url;
				}else {
				image=new HTMLImage.create(url);
			};
			var _this=this;
			image.onload=function (){
				clear();
				_this.onLoaded(image);
			};
			image.onerror=function (){
				clear();
				_this.event("error","Load image filed");
			}
			function clear (){
				image.onload=null;
				image.onerror=null;
			}
		}

		/**
		*@private
		*加载声音资源。
		*@param url 资源地址。
		*/
		__proto._loadSound=function(url){
			var sound=(new SoundManager._soundClass());
			var _this=this;
			sound.on("complete",this,soundOnload);
			sound.on("error",this,soundOnErr);
			sound.load(url);
			function soundOnload (){
				clear();
				_this.onLoaded(sound);
			}
			function soundOnErr (){
				clear();
				_this.event("error","Load sound filed");
			}
			function clear (){
				sound.offAll();
			}
		}

		/**@private */
		__proto.onProgress=function(value){
			if (this._type==="atlas")this.event("progress",value *0.3);
			else this.event("progress",value);
		}

		/**@private */
		__proto.onError=function(message){
			this.event("error",message);
		}

		/**
		*资源加载完成的处理函数。
		*@param data 数据。
		*/
		__proto.onLoaded=function(data){
			var type=this._type;
			if (type==="image"){
				var tex=new Texture(data);
				tex.url=this._url;
				this.complete(tex);
				}else if (type==="sound" || type==="htmlimage" || type==="nativeimage"){
				this.complete(data);
				}else if (type==="atlas"){
				if (!data.src){
					if (!this._data){
						this._data=data;
						if (data.meta && data.meta.image){
							var toloadPics=data.meta.image.split(",");
							var split=this._url.indexOf("/")>=0 ? "/" :"\\";
							var idx=this._url.lastIndexOf(split);
							var folderPath=idx >=0 ? this._url.substr(0,idx+1):"";
							idx=this._url.indexOf("?");
							var ver;
							ver=idx >=0 ? this._url.substr(idx):"";
							for (var i=0,len=toloadPics.length;i < len;i++){
								toloadPics[i]=folderPath+toloadPics[i]+ver;
							}
							}else {
							toloadPics=[this._url.replace(".json",".png")];
						}
						toloadPics.reverse();
						data.toLoads=toloadPics;
						data.pics=[];
					}
					this.event("progress",0.3+1 / toloadPics.length *0.6);
					return this._loadImage(URL.formatURL(toloadPics.pop()));
					}else {
					this._data.pics.push(data);
					if (this._data.toLoads.length > 0){
						this.event("progress",0.3+1 / this._data.toLoads.length *0.6);
						return this._loadImage(URL.formatURL(this._data.toLoads.pop()));
					};
					var frames=this._data.frames;
					var directory=(this._data.meta && this._data.meta.prefix)? URL.basePath+this._data.meta.prefix :this._url.substring(0,this._url.lastIndexOf("."))+"/";
					var pics=this._data.pics;
					var map=Loader.atlasMap[this._url] || (Loader.atlasMap[this._url]=[]);
					for (var name in frames){
						var obj=frames[name];
						var tPic=pics[obj.frame.idx ? obj.frame.idx :0];
						var url=directory+name;
						Loader.loadedMap[url]=Texture.create(tPic,obj.frame.x,obj.frame.y,obj.frame.w,obj.frame.h,obj.spriteSourceSize.x,obj.spriteSourceSize.y,obj.sourceSize.w,obj.sourceSize.h);
						Loader.loadedMap[url].url=url;
						map.push(url);
					}
					this.complete(this._data);
				}
				}else {
				this.complete(data);
			}
		}

		/**
		*加载完成。
		*@param data 加载的数据。
		*/
		__proto.complete=function(data){
			this._data=data;
			Loader._loaders.push(this);
			if (!Loader._isWorking)Loader.checkNext();
		}

		/**
		*结束加载，处理是否缓存及派发完成事件 <code>Event.COMPLETE</code> 。
		*@param content 加载后的数据
		*/
		__proto.endLoad=function(content){
			content && (this._data=content);
			if (this._cache)Loader.loadedMap[this._url]=this._data;
			this.event("progress",1);
			this.event("complete",(this.data instanceof Array)? [this.data] :this.data);
		}

		/**加载地址。*/
		__getset(0,__proto,'url',function(){
			return this._url;
		});

		/**返回的数据。*/
		__getset(0,__proto,'data',function(){
			return this._data;
		});

		/**是否缓存。*/
		__getset(0,__proto,'cache',function(){
			return this._cache;
		});

		/**加载类型。*/
		__getset(0,__proto,'type',function(){
			return this._type;
		});

		Loader.checkNext=function(){
			Loader._isWorking=true;
			var startTimer=Browser.now();
			var thisTimer=startTimer;
			while (Loader._startIndex < Loader._loaders.length){
				thisTimer=Browser.now();
				Loader._loaders[Loader._startIndex].endLoad();
				Loader._startIndex++;
				if (Browser.now()-startTimer > Loader.maxTimeOut){
					console.log("loader callback cost a long time:"+(Browser.now()-startTimer)+" url="+Loader._loaders[Loader._startIndex-1].url);
					Laya.timer.frameOnce(1,null,Loader.checkNext);
					return;
				}
			}
			Loader._loaders.length=0;
			Loader._startIndex=0;
			Loader._isWorking=false;
		}

		Loader.clearRes=function(url){
			url=URL.formatURL(url);
			var arr=Loader.atlasMap[url];
			if (arr){
				for (var i=0,n=arr.length;i < n;i++){
					var resUrl=arr[i];
					var tex=Loader.getRes(resUrl);
					if (tex)tex.destroy();
					delete Loader.loadedMap[resUrl];
				}
				arr.length=0;
				delete Loader.atlasMap[url];
				delete Loader.loadedMap[url];
				}else {
				var res=Loader.loadedMap[url];
				if ((res instanceof laya.resource.Texture )&& res.bitmap){
					(res).destroy();
					delete Loader.loadedMap[url];
				}
			}
		}

		Loader.getRes=function(url){
			return Loader.loadedMap[URL.formatURL(url)];
		}

		Loader.getAtlas=function(url){
			return Loader.atlasMap[URL.formatURL(url)];
		}

		Loader.cacheRes=function(url,data){
			Loader.loadedMap[URL.formatURL(url)]=data;
		}

		Loader.TEXT="text";
		Loader.JSON="json";
		Loader.XML="xml";
		Loader.BUFFER="arraybuffer";
		Loader.IMAGE="image";
		Loader.SOUND="sound";
		Loader.ATLAS="atlas";
		Loader.typeMap={"png":"image","jpg":"image","jpeg":"image","txt":"text","json":"json","xml":"xml","als":"atlas","mp3":"sound","ogg":"sound","wav":"sound","part":"json"};
		Loader.parserMap={};
		Loader.loadedMap={};
		Loader.maxTimeOut=100;
		Loader.atlasMap={};
		Loader._loaders=[];
		Loader._isWorking=false;
		Loader._startIndex=0;
		Loader._extReg=/\.(\w+)\??/g;
		return Loader;
	})(EventDispatcher)


	/**
	*<code>TimeLine</code> 是一个用来创建时间轴动画的类。
	*/
	//class laya.utils.TimeLine extends laya.events.EventDispatcher
	var TimeLine=(function(_super){
		var tweenData;
		function TimeLine(){
			this._labelDic=null;
			this._tweenDic={};
			this._tweenDataList=[];
			this._endTweenDataList=null;
			this._currTime=0;
			this._lastTime=0;
			this._startTime=0;
			this._index=0;
			this._gidIndex=0;
			this._firstTweenDic={};
			this._startTimeSort=false;
			this._endTimeSort=false;
			this._loopKey=false;
			this.scale=1;
			this._frameRate=60;
			this._frameIndex=0;
			this._total=0;
			TimeLine.__super.call(this);
		}

		__class(TimeLine,'laya.utils.TimeLine',_super);
		var __proto=TimeLine.prototype;
		/**
		*控制一个对象，从当前点移动到目标点。
		*@param target 要控制的对象。
		*@param props 要控制对象的属性。
		*@param duration 对象TWEEN的时间。
		*@param ease 缓动类型
		*@param offset 相对于上一个对象，偏移多长时间（单位：毫秒）。
		*/
		__proto.to=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return this._create(target,props,duration,ease,offset,true);
		}

		/**
		*从 props 属性，缓动到当前状态。
		*@param target target 目标对象(即将更改属性值的对象)
		*@param props 要控制对象的属性
		*@param duration 对象TWEEN的时间
		*@param ease 缓动类型
		*@param offset 相对于上一个对象，偏移多长时间（单位：毫秒）
		*/
		__proto.from=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return this._create(target,props,duration,ease,offset,false);
		}

		/**@private */
		__proto._create=function(target,props,duration,ease,offset,isTo){
			var tTweenData=new tweenData();
			tTweenData.isTo=isTo;
			tTweenData.type=0;
			tTweenData.target=target;
			tTweenData.duration=duration;
			tTweenData.data=props;
			tTweenData.startTime=this._startTime+offset;
			tTweenData.endTime=tTweenData.startTime+tTweenData.duration;
			tTweenData.ease=ease;
			this._startTime=Math.max(tTweenData.endTime,this._startTime);
			this._tweenDataList.push(tTweenData);
			this._startTimeSort=true;
			this._endTimeSort=true;
			return this;
		}

		/**
		*在时间队列中加入一个标签。
		*@param label 标签名称。
		*@param offset 标签相对于上个动画的偏移时间(单位：毫秒)。
		*/
		__proto.addLabel=function(label,offset){
			var tTweenData=new tweenData();
			tTweenData.type=1;
			tTweenData.data=label;
			tTweenData.endTime=tTweenData.startTime=this._startTime+offset;
			this._labelDic || (this._labelDic={});
			this._labelDic[label]=tTweenData;
			this._tweenDataList.push(tTweenData);
			return this;
		}

		/**
		*移除指定的标签
		*@param label
		*/
		__proto.removeLabel=function(label){
			if (this._labelDic && this._labelDic[label]){
				var tTweenData=this._labelDic[label];
				if (tTweenData){
					var tIndex=this._tweenDataList.indexOf(tTweenData);
					if (tIndex >-1){
						this._tweenDataList.splice(tIndex,1);
					}
				}
				delete this._labelDic[label];
			}
		}

		/**
		*动画从整个动画的某一时间开始。
		*@param time(单位：毫秒)。
		*/
		__proto.gotoTime=function(time){
			if (this._tweenDataList==null || this._tweenDataList.length==0)return;
			var tTween;
			var tObject;
			for (var p in this._firstTweenDic){
				tObject=this._firstTweenDic[p];
				if (tObject){
					for (var tDataP in tObject){
						if (tObject.diyTarget.hasOwnProperty(tDataP)){
							tObject.diyTarget[tDataP]=tObject[tDataP];
						}
					}
				}
			}
			for (p in this._tweenDic){
				tTween=this._tweenDic[p];
				tTween.clear();
				delete this._tweenDic[p];
			}
			this._index=0;
			this._gidIndex=0;
			this._currTime=time;
			this._lastTime=Browser.now();
			var tTweenDataCopyList;
			if (this._endTweenDataList==null || this._endTimeSort){
				this._endTimeSort=false;
				this._endTweenDataList=tTweenDataCopyList=this._tweenDataList.concat();
				function Compare (paraA,paraB){
					if (paraA.endTime > paraB.endTime){
						return 1;
						}else if (paraA.endTime < paraB.endTime){
						return-1;
						}else {
						return 0;
					}
				}
				tTweenDataCopyList.sort(Compare);
				}else {
				tTweenDataCopyList=this._endTweenDataList
			};
			var tTweenData;
			for (var i=0,n=tTweenDataCopyList.length;i < n;i++){
				tTweenData=tTweenDataCopyList[i];
				if (tTweenData.type==0){
					if (time >=tTweenData.endTime){
						this._index=Math.max(this._index,i+1);
						var props=tTweenData.data;
						for (var tP in props){
							if (tTweenData.isTo){
								tTweenData.target[tP]=props[tP];
							}
						}
						}else {
						break ;
					}
				}
			}
			for (i=0,n=this._tweenDataList.length;i < n;i++){
				tTweenData=this._tweenDataList[i];
				if (tTweenData.type==0){
					if (time >=tTweenData.startTime && time < tTweenData.endTime){
						this._index=Math.max(this._index,i+1);
						this._gidIndex++;
						tTween=Pool.getItemByClass("tween",Tween);
						tTween._create(tTweenData.target,tTweenData.data,tTweenData.duration,tTweenData.ease,Handler.create(this,this._animComplete,[this._gidIndex]),0,false,tTweenData.isTo,true,false);
						tTween.setStartTime(this._currTime-(time-tTweenData.startTime));
						tTween._updateEase(this._currTime);
						tTween.gid=this._gidIndex;
						this._tweenDic[this._gidIndex]=tTween;
					}
				}
			}
		}

		/**
		*从指定的标签开始播。
		*@param Label 标签名。
		*/
		__proto.gotoLabel=function(Label){
			if (this._labelDic==null)return;
			var tLabelData=this._labelDic[Label];
			if (tLabelData)this.gotoTime(tLabelData.startTime);
		}

		/**
		*暂停整个动画。
		*/
		__proto.pause=function(){
			Laya.timer.clear(this,this._update);
		}

		/**
		*恢复暂停动画的播放。
		*/
		__proto.resume=function(){
			this.play(this._currTime,this._loopKey);
		}

		/**
		*播放动画。
		*@param timeOrLabel 开启播放的时间点或标签名。
		*@param loop 是否循环播放。
		*/
		__proto.play=function(timeOrLabel,loop){
			(timeOrLabel===void 0)&& (timeOrLabel=0);
			(loop===void 0)&& (loop=false);
			if (this._startTimeSort){
				this._startTimeSort=false;
				function Compare (paraA,paraB){
					if (paraA.startTime > paraB.startTime){
						return 1;
						}else if (paraA.startTime < paraB.startTime){
						return-1;
						}else {
						return 0;
					}
				}
				this._tweenDataList.sort(Compare);
				for (var i=0,n=this._tweenDataList.length;i < n;i++){
					var tTweenData=this._tweenDataList[i];
					if (tTweenData !=null && tTweenData.type==0){
						var tTarget=tTweenData.target;
						var gid=(tTarget.$_GID || (tTarget.$_GID=Utils.getGID()));
						var tSrcData=null;
						if (this._firstTweenDic[gid]==null){
							tSrcData={};
							tSrcData.diyTarget=tTarget;
							this._firstTweenDic[gid]=tSrcData;
							}else {
							tSrcData=this._firstTweenDic[gid];
						}
						for (var p in tTweenData.data){
							if (tSrcData[p]==null){
								tSrcData[p]=tTarget[p];
							}
						}
					}
				}
			}
			if ((typeof timeOrLabel=='string')){
				this.gotoLabel(timeOrLabel);
				}else {
				this.gotoTime(timeOrLabel);
			}
			this._loopKey=loop;
			this._lastTime=Browser.now();
			Laya.timer.frameLoop(1,this,this._update);
		}

		/**
		*更新当前动画。
		*/
		__proto._update=function(){
			if (this._currTime >=this._startTime){
				if (this._loopKey){
					this._complete();
					this.gotoTime(0);
					}else {
					this._complete();
					this.pause();
					return;
				}
			};
			var tNow=Browser.now();
			var tFrameTime=tNow-this._lastTime;
			var tCurrTime=this._currTime+=tFrameTime *this.scale;
			this._lastTime=tNow;
			var tTween;
			if (this._tweenDataList.length !=0 && this._index < this._tweenDataList.length){
				var tTweenData=this._tweenDataList[this._index];
				if (tCurrTime >=tTweenData.startTime){
					this._index++;
					if (tTweenData.type==0){
						this._gidIndex++;
						tTween=new Tween();
						tTween._create(tTweenData.target,tTweenData.data,tTweenData.duration,tTweenData.ease,new Handler(this,this._animComplete,[this._gidIndex]),0,false,tTweenData.isTo,true,false);
						tTween.setStartTime(tCurrTime);
						tTween.gid=this._gidIndex;
						this._tweenDic[this._gidIndex]=tTween;
						}else {
						this.event("label",tTweenData.data);
					}
				}
			}
			for (var p in this._tweenDic){
				tTween=this._tweenDic[p];
				tTween._updateEase(tCurrTime);
			}
		}

		/**
		*指定的动画索引处的动画播放完成后，把此动画从列表中删除。
		*@param index
		*/
		__proto._animComplete=function(index){
			var tTween=this._tweenDic[index];
			if (tTween)delete this._tweenDic[index];
		}

		/**@private */
		__proto._complete=function(){
			this.event("complete");
		}

		/**
		*重置所有对象，复用对象的时候使用。
		*/
		__proto.reset=function(){
			var p;
			if (this._labelDic){
				for (p in this._labelDic){
					delete this._labelDic[p];
				}
			};
			var tTween;
			for (p in this._tweenDic){
				tTween=this._tweenDic[p];
				tTween.clear();
				delete this._tweenDic[p];
			}
			for (p in this._firstTweenDic){
				delete this._firstTweenDic[p];
			}
			this._endTweenDataList=null;
			this._tweenDataList.length=0;
			this._currTime=0;
			this._lastTime=0;
			this._startTime=0;
			this._index=0;
			this._gidIndex=0;
			this.scale=1;
			Laya.timer.clear(this,this._update);
		}

		/**
		*彻底销毁此对象。
		*/
		__proto.destroy=function(){
			this.reset();
			this._labelDic=null;
			this._tweenDic=null;
			this._tweenDataList=null;
			this._firstTweenDic=null;
		}

		/**
		*@private
		*设置帧索引
		*/
		/**
		*@private
		*得到帧索引
		*/
		__getset(0,__proto,'index',function(){
			return this._frameIndex;
			},function(value){
			this._frameIndex=value;
			this.gotoTime(this._frameIndex / this._frameRate *1000);
		});

		/**
		*得到总帧数据
		*/
		__getset(0,__proto,'total',function(){
			this._total=Math.floor(this._startTime / 1000 *this._frameRate);
			return this._total;
		});

		TimeLine.to=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return (new TimeLine()).to(target,props,duration,ease,offset);
		}

		TimeLine.from=function(target,props,duration,ease,offset){
			(offset===void 0)&& (offset=0);
			return (new TimeLine()).from(target,props,duration,ease,offset);
		}

		TimeLine.__init$=function(){
			//class tweenData
			tweenData=(function(){
				function tweenData(){
					this.type=0;
					this.isTo=true;
					this.startTime=NaN;
					this.endTime=NaN;
					this.target=null;
					this.duration=NaN;
					this.ease=null;
					this.data=null;
				}
				__class(tweenData,'');
				return tweenData;
			})()
		}

		return TimeLine;
	})(EventDispatcher)


	//class laya.webgl.display.GraphicsGL extends laya.display.Graphics
	var GraphicsGL=(function(_super){
		function GraphicsGL(){
			GraphicsGL.__super.call(this);
		}

		__class(GraphicsGL,'laya.webgl.display.GraphicsGL',_super);
		var __proto=GraphicsGL.prototype;
		__proto.setShader=function(shader){
			this._saveToCmd(Render.context._setShader,[shader]);
		}

		__proto.setIBVB=function(x,y,ib,vb,numElement,shader){
			this._saveToCmd(Render.context._setIBVB,[x,y,ib,vb,numElement,shader]);
		}

		__proto.drawParticle=function(x,y,ps){
			var pt=RunDriver.createParticleTemplate2D(ps);
			pt.x=x;
			pt.y=y;
			this._saveToCmd(Render.context._drawParticle,[pt]);
		}

		return GraphicsGL;
	})(Graphics)


	/**
	*@private
	*<code>CSSStyle</code> 类是元素CSS样式定义类。
	*/
	//class laya.display.css.CSSStyle extends laya.display.css.Style
	var CSSStyle=(function(_super){
		function CSSStyle(ower){
			this._bgground=null;
			this._border=null;
			//this._ower=null;
			this._rect=null;
			this.lineHeight=0;
			CSSStyle.__super.call(this);
			this._padding=CSSStyle._PADDING;
			this._spacing=CSSStyle._SPACING;
			this._aligns=CSSStyle._ALIGNS;
			this._font=Font.EMPTY;
			this._ower=ower;
		}

		__class(CSSStyle,'laya.display.css.CSSStyle',_super);
		var __proto=CSSStyle.prototype;
		/**@inheritDoc */
		__proto.destroy=function(){
			this._ower=null;
			this._font=null;
			this._rect=null;
		}

		/**
		*复制传入的 CSSStyle 属性值。
		*@param src 待复制的 CSSStyle 对象。
		*/
		__proto.inherit=function(src){
			this._font=src._font;
			this._spacing=src._spacing===CSSStyle._SPACING ? CSSStyle._SPACING :src._spacing.slice();
			this.lineHeight=src.lineHeight;
		}

		/**@private */
		__proto._widthAuto=function(){
			return (this._type & 0x40000)!==0;
		}

		/**@inheritDoc */
		__proto.widthed=function(sprite){
			return (this._type & 0x8)!=0;
		}

		__proto._calculation=function(type,value){
			if (value.indexOf('%')< 0)return false;
			var ower=this._ower;
			var parent=ower.parent;
			var rect=this._rect;
			function getValue (pw,w,nums){
				return (pw *nums[0]+w *nums[1]+nums[2]);
			}
			function onParentResize (type){
				var pw=parent.width,w=ower.width;
				rect.width && (ower.width=getValue(pw,w,rect.width));
				rect.height && (ower.height=getValue(pw,w,rect.height));
				rect.left && (ower.x=getValue(pw,w,rect.left));
				rect.top && (ower.y=getValue(pw,w,rect.top));
			}
			if (rect===null){
				parent._getCSSStyle()._type |=0x80000;
				parent.on("resize",this,onParentResize);
				this._rect=rect={input:{}};
			};
			var nums=value.split(' ');
			nums[0]=parseFloat(nums[0])/ 100;
			if (nums.length==1)
				nums[1]=nums[2]=0;
			else {
				nums[1]=parseFloat(nums[1])/ 100;
				nums[2]=parseFloat(nums[2]);
			}
			rect[type]=nums;
			rect.input[type]=value;
			onParentResize(type);
			return true;
		}

		/**
		*是否已设置高度。
		*@param sprite 显示对象 Sprite。
		*@return 一个Boolean 表示是否已设置高度。
		*/
		__proto.heighted=function(sprite){
			return (this._type & 0x2000)!=0;
		}

		/**
		*设置宽高。
		*@param w 宽度。
		*@param h 高度。
		*/
		__proto.size=function(w,h){
			var ower=this._ower;
			var resize=false;
			if (w!==-1 && w !=this._ower.width){
				this._type |=0x8;
				this._ower.width=w;
				resize=true;
			}
			if (h!==-1 && h !=this._ower.height){
				this._type |=0x2000;
				this._ower.height=h;
				resize=true;
			}
			if (resize){
				ower._layoutLater();
				(this._type & 0x80000)&& ower.event("resize",this);
			}
		}

		/**@private */
		__proto._getAlign=function(){
			return this._aligns[0];
		}

		/**@private */
		__proto._getValign=function(){
			return this._aligns[1];
		}

		/**@private */
		__proto._getCssFloat=function(){
			return (this._type & 0x8000)!=0 ? 0x8000 :0;
		}

		__proto._createFont=function(){
			return (this._type & 0x1000)? this._font :(this._type |=0x1000,this._font=new Font(this._font));
		}

		/**@inheritDoc */
		__proto.render=function(sprite,context,x,y){
			var w=sprite.width;
			var h=sprite.height;
			x-=sprite.pivotX;
			y-=sprite.pivotY;
			this._bgground && this._bgground.color !=null && context.ctx.fillRect(x,y,w,h,this._bgground.color);
			this._border && this._border.color && context.drawRect(x,y,w,h,this._border.color.strColor,this._border.size);
		}

		/**@inheritDoc */
		__proto.getCSSStyle=function(){
			return this;
		}

		/**
		*设置 CSS 样式字符串。
		*@param text CSS样式字符串。
		*/
		__proto.cssText=function(text){
			this.attrs(CSSStyle.parseOneCSS(text,';'));
		}

		/**
		*根据传入的属性名、属性值列表，设置此对象的属性值。
		*@param attrs 属性名与属性值列表。
		*/
		__proto.attrs=function(attrs){
			if (attrs){
				for (var i=0,n=attrs.length;i < n;i++){
					var attr=attrs[i];
					this[attr[0]]=attr[1];
				}
			}
		}

		/**@inheritDoc */
		__proto.setTransform=function(value){
			(value==='none')? (this._tf=Style._TF_EMPTY):this.attrs(CSSStyle.parseOneCSS(value,','));
		}

		/**
		*定义 X 轴、Y 轴移动转换。
		*@param x X 轴平移量。
		*@param y Y 轴平移量。
		*/
		__proto.translate=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.translateX=x;
			this._tf.translateY=y;
		}

		/**
		*定义 缩放转换。
		*@param x X 轴缩放值。
		*@param y Y 轴缩放值。
		*/
		__proto.scale=function(x,y){
			this._tf===Style._TF_EMPTY && (this._tf=Style._createTransform());
			this._tf.scaleX=x;
			this._tf.scaleY=y;
		}

		/**@private */
		__proto._enableLayout=function(){
			return (this._type & 0x2)===0 && (this._type & 0x4)===0;
		}

		/**
		*是否显示为块级元素。
		*/
		__getset(0,__proto,'block',_super.prototype._$get_block,function(value){
			value ? (this._type |=0x1):(this._type &=(~0x1));
		});

		/**
		*垂直对齐方式。
		*/
		__getset(0,__proto,'valign',function(){
			return CSSStyle._valigndef[this._aligns[1]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[1]=CSSStyle._valigndef[value];
		});

		/**
		*高度。
		*/
		__getset(0,__proto,'height',null,function(h){
			this._type |=0x2000;
			if ((typeof h=='string')){
				if (this._calculation("height",h))return;
				h=parseInt(h);
			}
			this.size(-1,h);
		});

		/**
		*宽度。
		*/
		__getset(0,__proto,'width',null,function(w){
			this._type |=0x8;
			if ((typeof w=='string')){
				var offset=w.indexOf('auto');
				if (offset >=0){
					this._type |=0x40000;
					w=w.substr(0,offset);
				}
				if (this._calculation("width",w))return;
				w=parseInt(w);
			}
			this.size(w,-1);
		});

		/**
		*字体粗细。
		*/
		__getset(0,__proto,'fontWeight',function(){
			return this._font.weight;
			},function(value){
			this._createFont().weight=value;
		});

		/**
		*表示左边距。
		*/
		__getset(0,__proto,'left',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="center")
					value="50% -50% 0";
				else if (value==="right")
				value="100% -100% 0";
				if (this._calculation("left",value))return;
				value=parseInt(value);
			}
			ower.x=value;
		});

		__getset(0,__proto,'_translate',null,function(value){
			this.translate(value[0],value[1]);
		});

		/**@inheritDoc */
		__getset(0,__proto,'absolute',function(){
			return (this._type & 0x4)!==0;
		});

		/**
		*表示上边距。
		*/
		__getset(0,__proto,'top',null,function(value){
			var ower=this._ower;
			if (((typeof value=='string'))){
				if (value==="middle")
					value="50% -50% 0";
				else if (value==="bottom")
				value="100% -100% 0";
				if (this._calculation("top",value))return;
				value=parseInt(value);
			}
			ower.y=value;
		});

		/**
		*水平对齐方式。
		*/
		__getset(0,__proto,'align',function(){
			return CSSStyle._aligndef[this._aligns[0]];
			},function(value){
			this._aligns===CSSStyle._ALIGNS && (this._aligns=[0,0,0]);
			this._aligns[0]=CSSStyle._aligndef[value];
		});

		/**
		*表示是否加粗。
		*/
		__getset(0,__proto,'bold',function(){
			return this._font.bold;
			},function(value){
			this._createFont().bold=value;
		});

		/**
		*边距信息。
		*/
		__getset(0,__proto,'padding',function(){
			return this._padding;
			},function(value){
			this._padding=value;
		});

		/**
		*行间距。
		*/
		__getset(0,__proto,'leading',function(){
			return this._spacing[1];
			},function(d){
			((typeof d=='string'))&& (d=parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[1]=d;
		});

		/**
		*是否是行元素。
		*/
		__getset(0,__proto,'lineElement',function(){
			return (this._type & 0x10000)!=0;
			},function(value){
			value ? (this._type |=0x10000):(this._type &=(~0x10000));
		});

		/**
		*浮动方向。
		*/
		__getset(0,__proto,'cssFloat',function(){
			return (this._type & 0x8000)!=0 ? "right" :"left";
			},function(value){
			this.lineElement=false;
			value==="right" ? (this._type |=0x8000):(this._type &=(~0x8000));
		});

		/**
		*添加到文本的修饰。
		*/
		__getset(0,__proto,'textDecoration',function(){
			return this._font.decoration;
			},function(value){
			this._createFont().decoration=value;
		});

		/**
		*设置如何处理元素内的空白。
		*/
		__getset(0,__proto,'whiteSpace',function(){
			return (this._type & 0x20000)? "nowrap" :"";
			},function(type){
			type==="nowrap" && (this._type |=0x20000);
			type==="none" && (this._type &=~0x20000);
		});

		__getset(0,__proto,'background',null,function(value){
			if (!value){
				this._bgground=null;
				return;
			}
			this._bgground || (this._bgground={});
			this._bgground.color=value;
			this._ower.model && this._ower.model.bgColor(value);
			this._type |=0x4000;
			this._ower._renderType |=0x80;
		});

		/**
		*表示是否换行。
		*/
		__getset(0,__proto,'wordWrap',function(){
			return (this._type & 0x20000)===0;
			},function(value){
			value ? (this._type &=~0x20000):(this._type |=0x20000);
		});

		/**
		*字体颜色。
		*/
		__getset(0,__proto,'color',function(){
			return this._font.color;
			},function(value){
			this._createFont().color=value;
		});

		/**
		*<p>指定文本字段是否是密码文本字段。</p>
		*如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
		*/
		__getset(0,__proto,'password',function(){
			return this._font.password;
			},function(value){
			this._createFont().password=value;
		});

		/**
		*背景颜色。
		*/
		__getset(0,__proto,'backgroundColor',function(){
			return this._bgground ? this._bgground.color :null;
			},function(value){
			if (value==='none')this._bgground=null;
			else (this._bgground || (this._bgground={}),this._bgground.color=value);
			this._ower.model && this._ower.model.bgColor(value);
			this._ower._renderType |=0x80;
		});

		/**
		*字体信息。
		*/
		__getset(0,__proto,'font',function(){
			return this._font.toString();
			},function(value){
			this._createFont().set(value);
		});

		/**
		*文本的粗细。
		*/
		__getset(0,__proto,'weight',null,function(value){
			this._createFont().weight=value;
		});

		/**
		*间距。
		*/
		__getset(0,__proto,'letterSpacing',function(){
			return this._spacing[0];
			},function(d){
			((typeof d=='string'))&& (d=parseInt(d+""));
			this._spacing===CSSStyle._SPACING && (this._spacing=[0,0]);
			this._spacing[0]=d;
		});

		/**
		*字体大小。
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._font.size;
			},function(value){
			this._createFont().size=value;
		});

		/**
		*表示是否为斜体。
		*/
		__getset(0,__proto,'italic',function(){
			return this._font.italic;
			},function(value){
			this._createFont().italic=value;
		});

		/**
		*字体系列。
		*/
		__getset(0,__proto,'fontFamily',function(){
			return this._font.family;
			},function(value){
			this._createFont().family=value;
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*@default 0
		*/
		__getset(0,__proto,'stroke',function(){
			return this._font.stroke[0];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[0]=value;
		});

		/**
		*<p>描边颜色，以字符串表示。</p>
		*@default "#000000";
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._font.stroke[1];
			},function(value){
			if (this._createFont().stroke===Font._STROKE)this._font.stroke=[0,"#000000"];
			this._font.stroke[1]=value;
		});

		/**
		*边框属性。
		*/
		__getset(0,__proto,'border',function(){
			return this._border ? this._border.value :"";
			},function(value){
			if (value=='none'){
				this._border=null;
				return;
			}
			this._border || (this._border={});
			this._border.value=value;
			var values=value.split(' ');
			this._border.color=Color.create(values[values.length-1]);
			if (values.length==1){
				this._border.size=1;
				this._border.type='solid';
				return;
			};
			var i=0;
			if (values[0].indexOf('px')> 0){
				this._border.size=parseInt(values[0]);
				i++;
			}else this._border.size=1;
			this._border.type=values[i];
			this._ower._renderType |=0x80;
		});

		/**
		*边框的颜色。
		*/
		__getset(0,__proto,'borderColor',function(){
			return (this._border && this._border.color)? this._border.color.strColor :null;
			},function(value){
			if (!value){
				this._border=null;
				return;
			}
			this._border || (this._border={size:1,type:'solid'});
			this._border.color=(value==null)? null :Color.create(value);
			this._ower.model && this._ower.model.border(this._border.color.strColor);
			this._ower._renderType |=0x80;
		});

		/**
		*元素的定位类型。
		*/
		__getset(0,__proto,'position',function(){
			return (this._type & 0x4)? "absolute" :"";
			},function(value){
			value=="absolute" ? (this._type |=0x4):(this._type &=~0x4);
		});

		/**
		*规定元素应该生成的框的类型。
		*/
		__getset(0,__proto,'display',null,function(value){
			switch (value){
				case '':
					this._type &=~0x2;
					this.visible=true;
					break ;
				case 'none':
					this._type |=0x2;
					this.visible=false;
					this._ower._layoutLater();
					break ;
				}
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingLeft',function(){
			return this.padding[3];
		});

		/**@inheritDoc */
		__getset(0,__proto,'paddingTop',function(){
			return this.padding[0];
		});

		__getset(0,__proto,'_scale',null,function(value){
			this._ower.scale(value[0],value[1]);
		});

		__getset(0,__proto,'_rotate',null,function(value){
			this._ower.rotation=value;
		});

		CSSStyle.parseOneCSS=function(text,clipWord){
			var out=[];
			var attrs=text.split(clipWord);
			var valueArray;
			for (var i=0,n=attrs.length;i < n;i++){
				var attr=attrs[i];
				var ofs=attr.indexOf(':');
				var name=attr.substr(0,ofs).replace(/^\s+|\s+$/g,'');
				if (name.length==0)
					continue ;
				var value=attr.substr(ofs+1).replace(/^\s+|\s+$/g,'');
				var one=[name,value];
				switch (name){
					case 'italic':
					case 'bold':
						one[1]=value=="true";
						break ;
					case 'line-height':
						one[0]='lineHeight';
						one[1]=parseInt(value);
						break ;
					case 'font-size':
						one[0]='fontSize';
						one[1]=parseInt(value);
						break ;
					case 'padding':
						valueArray=value.split(' ');
						valueArray.length > 1 || (valueArray[1]=valueArray[2]=valueArray[3]=valueArray[0]);
						one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1]),parseInt(valueArray[2]),parseInt(valueArray[3])];
						break ;
					case 'rotate':
						one[0]="_rotate";
						one[1]=parseFloat(value);
						break ;
					case 'scale':
						valueArray=value.split(' ');
						one[0]="_scale";
						one[1]=[parseFloat(valueArray[0]),parseFloat(valueArray[1])];
						break ;
					case 'translate':
						valueArray=value.split(' ');
						one[0]="_translate";
						one[1]=[parseInt(valueArray[0]),parseInt(valueArray[1])];
						break ;
					default :
						(one[0]=CSSStyle._CSSTOVALUE[name])|| (one[0]=name);
					}
				out.push(one);
			}
			return out;
		}

		CSSStyle.parseCSS=function(text,uri){
			var one;
			while ((one=CSSStyle._parseCSSRegExp.exec(text))!=null){
				CSSStyle.styleSheets[one[1]]=CSSStyle.parseOneCSS(one[2],';');
			}
		}

		CSSStyle.EMPTY=new CSSStyle(null);
		CSSStyle._CSSTOVALUE={'letter-spacing':'letterSpacing','line-spacing':'lineSpacing','white-space':'whiteSpace','line-height':'lineHeight','scale-x':'scaleX','scale-y':'scaleY','translate-x':'translateX','translate-y':'translateY','font-family':'fontFamily','font-weight':'fontWeight','vertical-align':'valign','text-decoration':'textDecoration','background-color':'backgroundColor','border-color':'borderColor','float':'cssFloat'};
		CSSStyle._parseCSSRegExp=new RegExp("([\.\#]\\w+)\\s*{([\\s\\S]*?)}","g");
		CSSStyle._aligndef={'left':0,'center':1,'right':2,0:'left',1:'center',2:'right'};
		CSSStyle._valigndef={'top':0,'middle':1,'bottom':2,0:'top',1:'middle',2:'bottom'};
		CSSStyle.styleSheets={};
		CSSStyle.ALIGN_CENTER=1;
		CSSStyle.ALIGN_RIGHT=2;
		CSSStyle.VALIGN_MIDDLE=1;
		CSSStyle.VALIGN_BOTTOM=2;
		CSSStyle._CSS_BLOCK=0x1;
		CSSStyle._DISPLAY_NONE=0x2;
		CSSStyle._ABSOLUTE=0x4;
		CSSStyle._WIDTH_SET=0x8;
		CSSStyle._PADDING=[0,0,0,0];
		CSSStyle._RECT=[-1,-1,-1,-1];
		CSSStyle._SPACING=[0,0];
		CSSStyle._ALIGNS=[0,0,0];
		CSSStyle.ADDLAYOUTED=0x200;
		CSSStyle._NEWFONT=0x1000;
		CSSStyle._HEIGHT_SET=0x2000;
		CSSStyle._BACKGROUND_SET=0x4000;
		CSSStyle._FLOAT_RIGHT=0x8000;
		CSSStyle._LINE_ELEMENT=0x10000;
		CSSStyle._NOWARP=0x20000;
		CSSStyle._WIDTHAUTO=0x40000;
		CSSStyle._LISTERRESZIE=0x80000;
		return CSSStyle;
	})(Style)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.d2.ShaderDefines2D extends laya.webgl.shader.ShaderDefines
	var ShaderDefines2D=(function(_super){
		function ShaderDefines2D(){
			ShaderDefines2D.__super.call(this,ShaderDefines2D.__name2int,ShaderDefines2D.__int2name,ShaderDefines2D.__int2nameMap);
		}

		__class(ShaderDefines2D,'laya.webgl.shader.d2.ShaderDefines2D',_super);
		ShaderDefines2D.__init__=function(){
			ShaderDefines2D.reg("TEXTURE2D",0x01);
			ShaderDefines2D.reg("COLOR2D",0x02);
			ShaderDefines2D.reg("PRIMITIVE",0x04);
			ShaderDefines2D.reg("GLOW_FILTER",0x08);
			ShaderDefines2D.reg("BLUR_FILTER",0x10);
			ShaderDefines2D.reg("COLOR_FILTER",0x20);
			ShaderDefines2D.reg("COLOR_ADD",0x40);
			ShaderDefines2D.reg("WORLDMAT",0x80);
		}

		ShaderDefines2D.reg=function(name,value){
			ShaderDefines._reg(name,value,ShaderDefines2D.__name2int,ShaderDefines2D.__int2name);
		}

		ShaderDefines2D.toText=function(value,int2name,int2nameMap){
			return ShaderDefines._toText(value,int2name,int2nameMap);
		}

		ShaderDefines2D.toInt=function(names){
			return ShaderDefines._toInt(names,ShaderDefines2D.__name2int);
		}

		ShaderDefines2D.TEXTURE2D=0x01;
		ShaderDefines2D.COLOR2D=0x02;
		ShaderDefines2D.PRIMITIVE=0x04;
		ShaderDefines2D.FILTERGLOW=0x08;
		ShaderDefines2D.FILTERBLUR=0x10;
		ShaderDefines2D.FILTERCOLOR=0x20;
		ShaderDefines2D.COLORADD=0x40;
		ShaderDefines2D.WORLDMAT=0x80;
		ShaderDefines2D.__name2int={};
		ShaderDefines2D.__int2name=[];
		ShaderDefines2D.__int2nameMap=[];
		return ShaderDefines2D;
	})(ShaderDefines)


	/**
	*<p><code>ColorFilter</code> 是颜色滤镜。</p>
	*/
	//class laya.filters.ColorFilter extends laya.filters.Filter
	var ColorFilter=(function(_super){
		function ColorFilter(mat){
			//this._mat=null;
			//this._alpha=null;
			ColorFilter.__super.call(this);
			if (!mat){
				mat=[0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0];
			}
			this._mat=new Float32Array(16);
			this._alpha=new Float32Array(4);
			var j=0;
			var z=0;
			for (var i=0;i < 20;i++){
				if (i % 5 !=4){
					this._mat[j++]=mat[i];
					}else {
					this._alpha[z++]=mat[i];
				}
			}
			this._action=RunDriver.createFilterAction(0x20);
			this._action.data=this;
		}

		__class(ColorFilter,'laya.filters.ColorFilter',_super);
		var __proto=ColorFilter.prototype;
		Laya.imps(__proto,{"laya.filters.IFilter":true})
		/**
		*@private 通知微端
		*/
		__proto.callNative=function(sp){
			var t=sp._$P.cf=this;
			sp.model && sp.model.setFilterMatrix&&sp.model.setFilterMatrix(this._mat,this._alpha);
		}

		/**@private */
		__getset(0,__proto,'type',function(){
			return 0x20;
		});

		/**@private */
		__getset(0,__proto,'action',function(){
			return this._action;
		});

		__getset(1,ColorFilter,'DEFAULT',function(){
			if (!ColorFilter._DEFAULT){
				ColorFilter._DEFAULT=new ColorFilter([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]);
			}
			return ColorFilter._DEFAULT;
		},laya.filters.Filter._$SET_DEFAULT);

		__getset(1,ColorFilter,'GRAY',function(){
			if (!ColorFilter._GRAY){
				ColorFilter._GRAY=new ColorFilter([0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0]);
			}
			return ColorFilter._GRAY;
		},laya.filters.Filter._$SET_GRAY);

		ColorFilter._DEFAULT=null
		ColorFilter._GRAY=null
		return ColorFilter;
	})(Filter)


	//class laya.filters.webgl.ColorFilterActionGL extends laya.filters.webgl.FilterActionGL
	var ColorFilterActionGL=(function(_super){
		function ColorFilterActionGL(){
			this.data=null;
			ColorFilterActionGL.__super.call(this);
		}

		__class(ColorFilterActionGL,'laya.filters.webgl.ColorFilterActionGL',_super);
		var __proto=ColorFilterActionGL.prototype;
		Laya.imps(__proto,{"laya.filters.IFilterActionGL":true})
		__proto.setValue=function(shader){
			shader.colorMat=this.data._mat;
			shader.colorAlpha=this.data._alpha;
		}

		__proto.apply3d=function(scope,sprite,context,x,y){
			var b=scope.getValue("bounds");
			var shaderValue=Value2D.create(0x01,0);
			shaderValue.setFilters([this.data]);
			var tMatrix=Matrix.EMPTY;
			tMatrix.identity();
			context.ctx.drawTarget(scope,0,0,b.width,b.height,tMatrix,"src",shaderValue);
		}

		return ColorFilterActionGL;
	})(FilterActionGL)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.canvas.WebGLContext2D extends laya.resource.Context
	var WebGLContext2D=(function(_super){
		var ContextParams;
		function WebGLContext2D(c){
			this._x=0;
			this._y=0;
			this._id=++WebGLContext2D._COUNT;
			//this._other=null;
			this._path=null;
			//this._primitiveValue2D=null;
			this._drawCount=1;
			this._maxNumEle=0;
			this._clear=false;
			this._isMain=false;
			this._atlasResourceChange=0;
			this._submits=[];
			this._curSubmit=null;
			this._ib=null;
			this._vb=null;
			//this._curMat=null;
			this._nBlendType=0;
			//this._save=null;
			//this._targets=null;
			this._saveMark=null;
			//this.sprite=null;
			this.mId=-1;
			this.mHaveKey=false;
			this.mHaveLineKey=false;
			this.mX=0;
			this.mY=0;
			WebGLContext2D.__super.call(this);
			this._width=99999999;
			this._height=99999999;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			this._shader2D=new Shader2D();
			this.mOutPoint
			this.drawTexture=this._drawTextureM;
			this._canvas=c;
			this._curMat=Matrix.create();
			if (Render.isFlash){
				this._ib=IndexBuffer2D.create(0x88E4);
				GlUtils.fillIBQuadrangle(this._ib,16);
			}else this._ib=IndexBuffer2D.QuadrangleIB;
			this._vb=VertexBuffer2D.create(-1);
			this._other=ContextParams.DEFAULT;
			this._save=[SaveMark.Create(this)];
			this._save.length=10;
			this.clear();
		}

		__class(WebGLContext2D,'laya.webgl.canvas.WebGLContext2D',_super);
		var __proto=WebGLContext2D.prototype;
		__proto.setIsMainContext=function(){
			this._isMain=true;
		}

		__proto.clearBG=function(r,g,b,a){
			var gl=WebGL.mainContext;
			gl.clearColor(r,g,b,a);
			gl.clear(0x00004000 | 0x00000100);
		}

		__proto._getSubmits=function(){
			return this._submits;
		}

		__proto.destroy=function(){
			this._curMat && this._curMat.destroy();
			this._targets && this._targets.destroy();
			this._vb && this._vb.releaseResource();
			this._ib && (this._ib !=IndexBuffer2D.QuadrangleIB)&& this._ib.releaseResource();
		}

		__proto.clear=function(){
			this._vb.clear();
			this._targets && (this._targets.repaint=true);
			this._other=ContextParams.DEFAULT;
			this._clear=true;
			this._repaint=false;
			this._drawCount=1;
			this._other.lineWidth=this._shader2D.ALPHA=1.0;
			this._nBlendType=0;
			this._clipRect=WebGLContext2D.MAXCLIPRECT;
			this._curSubmit=Submit.RENDERBASE;
			this._shader2D.glTexture=null;
			this._shader2D.fillStyle=this._shader2D.strokeStyle=DrawStyle.DEFAULT;
			for (var i=0,n=this._submits._length;i < n;i++)
			this._submits[i].releaseRender();
			this._submits._length=0;
			this._curMat.identity();
			this._other.clear();
			this._saveMark=this._save[0];
			this._save._length=1;
		}

		__proto.size=function(w,h){
			this._width=w;
			this._height=h;
			this._targets && (this._targets.size(w,h));
		}

		__proto._getTransformMatrix=function(){
			return this._curMat;
		}

		__proto.translate=function(x,y){
			if (x!==0 || y!==0){
				SaveTranslate.save(this);
				if (this._curMat.bTransform){
					SaveTransform.save(this);
					this._curMat.transformPoint(Point.TEMP.setTo(x,y));
					x=Point.TEMP.x;
					y=Point.TEMP.y;
				}
				this._x+=x;
				this._y+=y;
			}
		}

		__proto.save=function(){
			this._save[this._save._length++]=SaveMark.Create(this);
		}

		__proto.restore=function(){
			var sz=this._save._length;
			if (sz < 1)
				return;
			for (var i=sz-1;i >=0;i--){
				var o=this._save[i];
				o.restore(this);
				if (o.isSaveMark()){
					this._save._length=i;
					return;
				}
			}
		}

		__proto.measureText=function(text){
			return RunDriver.measureText(text,this._other.font.toString());
		}

		__proto._fillText=function(txt,words,x,y,fontStr,color,textAlign){
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			var font=fontStr ? FontInContext.create(fontStr):this._other.font;
			if (AtlasResourceManager.enabled){
				if (shader.ALPHA!==curShader.ALPHA)
					shader.glTexture=null;
				DrawText.drawText(this,txt,words,this._curMat,font,textAlign || this._other.textAlign,color,null,-1,x,y);
				}else {
				var preDef=this._shader2D.defines.getValue();
				var colorAdd=color ? Color.create(color)._color :shader.colorAdd;
				if (shader.ALPHA!==curShader.ALPHA || colorAdd!==shader.colorAdd || curShader.colorAdd!==shader.colorAdd){
					shader.glTexture=null;
					shader.colorAdd=colorAdd;
				}
				DrawText.drawText(this,txt,words,this._curMat,font,textAlign || this._other.textAlign,color,null,-1,x,y);
			}
		}

		//shader.defines.setValue(preDef);
		__proto.fillWords=function(words,x,y,fontStr,color){
			words.length > 0 && this._fillText(null,words,x,y,fontStr,color,null);
		}

		__proto.fillText=function(txt,x,y,fontStr,color,textAlign){
			txt.length > 0 && this._fillText(txt,null,x,y,fontStr,color,textAlign);
		}

		__proto.strokeText=function(txt,x,y,fontStr,color,lineWidth,textAlign){
			if (txt.length===0)
				return;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			if (AtlasResourceManager.enabled){
				if (shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
				}
				DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,null,color,lineWidth || 1,x,y);
				}else {
				var preDef=this._shader2D.defines.getValue();
				var colorAdd=color ? Color.create(color)._color :shader.colorAdd;
				if (shader.ALPHA!==curShader.ALPHA || colorAdd!==shader.colorAdd || curShader.colorAdd!==shader.colorAdd){
					shader.glTexture=null;
					shader.colorAdd=colorAdd;
				}
				DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,null,color,lineWidth || 1,x,y);
			}
		}

		//shader.defines.setValue(preDef);
		__proto.fillBorderText=function(txt,x,y,fontStr,fillColor,borderColor,lineWidth,textAlign){
			if (txt.length===0)
				return;
			if (!AtlasResourceManager.enabled){
				this.strokeText(txt,x,y,fontStr,borderColor,lineWidth,textAlign);
				this.fillText(txt,x,y,fontStr,fillColor,textAlign);
				return;
			};
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			if (shader.ALPHA!==curShader.ALPHA)
				shader.glTexture=null;
			var font=fontStr ? (WebGLContext2D._fontTemp.setFont(fontStr),WebGLContext2D._fontTemp):this._other.font;
			DrawText.drawText(this,txt,null,this._curMat,font,textAlign || this._other.textAlign,fillColor,borderColor,lineWidth || 1,x,y);
		}

		__proto.fillRect=function(x,y,width,height,fillStyle){
			var vb=this._vb;
			if (GlUtils.fillRectImgVb(vb,this._clipRect,x,y,width,height,Texture.DEF_UV,this._curMat,this._x,this._y,0,0)){
				var pre=this._shader2D.fillStyle;
				fillStyle && (this._shader2D.fillStyle=DrawStyle.create(fillStyle));
				var shader=this._shader2D;
				var curShader=this._curSubmit.shaderValue;
				if (shader.fillStyle!==curShader.fillStyle || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					var submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength-16 *4)/ 32)*3,Value2D.create(0x02,0));
					submit.shaderValue.color=shader.fillStyle._color._color;
					submit.shaderValue.ALPHA=shader.ALPHA;
					this._submits[this._submits._length++]=submit;
				}
				this._curSubmit._numEle+=6;
				this._shader2D.fillStyle=pre;
			}
		}

		__proto.setShader=function(shader){
			SaveBase.save(this,0x80000,this._shader2D,true);
			this._shader2D.shader=shader;
		}

		__proto.setFilters=function(value){
			SaveBase.save(this,0x100000,this._shader2D,true);
			this._shader2D.filters=value;
			this._curSubmit=Submit.RENDERBASE;
			this._drawCount++;
		}

		__proto.drawTexture=function(tex,x,y,width,height,tx,ty){
			this._drawTextureM(tex,x,y,width,height,tx,ty,null);
		}

		__proto._drawTextureM=function(tex,x,y,width,height,tx,ty,m){
			if (!(tex.loaded && tex.bitmap && tex.source)){
				if (this.sprite){
					Laya.timer.callLater(this,this._repaintSprite);
				}
				return;
			};
			var webGLImg=tex.bitmap;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			this._drawCount++;
			if (this._curSubmit._renderType!==16 || shader.glTexture!==webGLImg || shader.ALPHA!==curShader.ALPHA){
				shader.glTexture=webGLImg;
				var vb=this._vb;
				var submit=null;
				var vbSize=(vb._byteLength / 32)*3;
				submit=SubmitTexture.create(this,this._ib,vb,vbSize,Value2D.create(0x01,0));
				this._submits[this._submits._length++]=submit;
				submit.shaderValue.textureHost=tex;
				submit._renderType=16;
				submit._preIsSameTextureShader=this._curSubmit._renderType===16 && shader.ALPHA===curShader.ALPHA;
				this._curSubmit=submit;
			};
			var finalVB=this._curSubmit._vb || this._vb;
			if (GlUtils.fillRectImgVb(finalVB,this._clipRect,x+tx,y+ty,width || tex.width,height || tex.height,tex.uv,m || this._curMat,this._x,this._y,0,0)){
				if (AtlasResourceManager.enabled && !this._isMain)
					(this._curSubmit).addTexture(tex,(finalVB._byteLength >> 2)-16);
				this._curSubmit._numEle+=6;
				this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
			}
		}

		__proto._repaintSprite=function(){
			this.sprite.repaint();
		}

		//}
		__proto._drawText=function(tex,x,y,width,height,m,tx,ty,dx,dy){
			var webGLImg=tex.bitmap;
			var shader=this._shader2D;
			var curShader=this._curSubmit.shaderValue;
			this._drawCount++;
			if (this._curSubmit._renderType!==16 || shader.glTexture!==webGLImg || shader.ALPHA!==curShader.ALPHA){
				shader.glTexture=webGLImg;
				var vb=this._vb;
				var submit=null;
				var submitID=NaN;
				var vbSize=(vb._byteLength / 32)*3;
				if (AtlasResourceManager.enabled){
					submit=SubmitTexture.create(this,this._ib,vb,vbSize,Value2D.create(0x01,0));
					}else {
					submit=SubmitTexture.create(this,this._ib,vb,vbSize,TextSV.create());
				}
				submit._preIsSameTextureShader=this._curSubmit._renderType===16 && shader.ALPHA===curShader.ALPHA;
				this._submits[this._submits._length++]=submit;
				submit.shaderValue.textureHost=tex;
				submit._renderType=16;
				this._curSubmit=submit;
			}
			tex.active();
			var finalVB=this._curSubmit._vb || this._vb;
			if (GlUtils.fillRectImgVb(finalVB,this._clipRect,x+tx,y+ty,width || tex.width,height || tex.height,tex.uv,m || this._curMat,this._x,this._y,dx,dy,true)){
				if (AtlasResourceManager.enabled && !this._isMain){
					(this._curSubmit).addTexture(tex,(finalVB._byteLength >> 2)-16);
				}
				this._curSubmit._numEle+=6;
				this._maxNumEle=Math.max(this._maxNumEle,this._curSubmit._numEle);
			}
		}

		__proto.drawTextureWithTransform=function(tex,x,y,width,height,transform,tx,ty){
			var curMat=this._curMat;
			(tx!==0 || ty!==0)&& (this._x=tx *curMat.a+ty *curMat.c,this._y=ty *curMat.d+tx *curMat.b);
			if (transform && curMat.bTransform){
				Matrix.mul(transform,curMat,WebGLContext2D._tmpMatrix);
				transform=WebGLContext2D._tmpMatrix;
				transform._checkTransform();
				}else {
				this._x+=curMat.tx;
				this._y+=curMat.ty;
			}
			this._drawTextureM(tex,x,y,width,height,0,0,transform);
			this._x=this._y=0;
		}

		__proto.fillQuadrangle=function(tex,x,y,point4,m){
			var submit=this._curSubmit;
			var vb=this._vb;
			var shader=this._shader2D;
			var curShader=submit.shaderValue;
			if (tex.bitmap){
				var t_tex=tex.bitmap;
				if (shader.glTexture !=t_tex || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=t_tex;
					submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength)/ 32)*3,Value2D.create(0x01,0));
					submit.shaderValue.glTexture=t_tex;
					this._submits[this._submits._length++]=submit;
				}
				GlUtils.fillQuadrangleImgVb(vb,x,y,point4,tex.uv,m || this._curMat,this._x,this._y);
				}else {
				if (!submit.shaderValue.fillStyle || !submit.shaderValue.fillStyle.equal(tex)|| shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength)/ 32)*3,Value2D.create(0x02,0));
					submit.shaderValue.defines.add(0x02);
					submit.shaderValue.fillStyle=DrawStyle.create(tex);
					this._submits[this._submits._length++]=submit;
				}
				GlUtils.fillQuadrangleImgVb(vb,x,y,point4,Texture.DEF_UV,m || this._curMat,this._x,this._y);
			}
			submit._numEle+=6;
		}

		__proto.drawTexture2=function(x,y,pivotX,pivotY,transform,alpha,blendMode,args){
			var curMat=this._curMat;
			this._x=x *curMat.a+y *curMat.c;
			this._y=y *curMat.d+x *curMat.b;
			if (transform){
				if (curMat.bTransform || transform.bTransform){
					Matrix.mul(transform,curMat,WebGLContext2D._tmpMatrix);
					transform=WebGLContext2D._tmpMatrix;
					}else {
					this._x+=transform.tx+curMat.tx;
					this._y+=transform.ty+curMat.ty;
					transform=Matrix.EMPTY;
				}
			}
			if (alpha===1 && !blendMode)
				this._drawTextureM(args[0],args[1]-pivotX,args[2]-pivotY,args[3],args[4],0,0,transform);
			else {
				var preAlpha=this._shader2D.ALPHA;
				var preblendType=this._nBlendType;
				this._shader2D.ALPHA=alpha;
				blendMode && (this._nBlendType=BlendMode.TOINT(blendMode));
				this._drawTextureM(args[0],args[1]-pivotX,args[2]-pivotY,args[3],args[4],0,0,transform);
				this._shader2D.ALPHA=preAlpha;
				this._nBlendType=preblendType;
			}
			this._x=this._y=0;
		}

		__proto.drawCanvas=function(canvas,x,y,width,height){
			var src=canvas.context;
			if (src._targets){
				this._submits[this._submits._length++]=SubmitCanvas.create(src,0,null);
				this._curSubmit=Submit.RENDERBASE;
				src._targets.drawTo(this,x,y,width,height);
				}else {
				var submit=this._submits[this._submits._length++]=SubmitCanvas.create(src,this._shader2D.ALPHA,this._shader2D.filters);
				var sx=width / canvas.width;
				var sy=height / canvas.height;
				var mat=submit._matrix;
				this._curMat.copyTo(mat);
				sx !=1 && sy !=1 && mat.scale(sx,sy);
				var tx=mat.tx,ty=mat.ty;
				mat.tx=mat.ty=0;
				mat.transformPoint(Point.TEMP.setTo(x,y));
				mat.translate(Point.TEMP.x+tx,Point.TEMP.y+ty);
				this._curSubmit=Submit.RENDERBASE;
			}
			if (Config.showCanvasMark){
				this.save();
				this.lineWidth=4;
				this.strokeStyle=src._targets ? "yellow" :"green";
				this.strokeRect(x-1,y-1,width+2,height+2,1);
				this.strokeRect(x,y,width,height,1);
				this.restore();
			}
		}

		__proto.drawTarget=function(scope,x,y,width,height,m,proName,shaderValue,uv,blend){
			(blend===void 0)&& (blend=-1);
			var vb=this._vb;
			if (GlUtils.fillRectImgVb(vb,this._clipRect,x,y,width,height,uv || Texture.DEF_UV,m || this._curMat,this._x,this._y,0,0)){
				var shader=this._shader2D;
				shader.glTexture=null;
				var curShader=this._curSubmit.shaderValue;
				var submit=this._curSubmit=SubmitTarget.create(this,this._ib,vb,((vb._byteLength-16 *4)/ 32)*3,shaderValue,proName);
				if (blend==-1){
					submit.blendType=this._nBlendType;
					}else {
					submit.blendType=blend;
				}
				submit.scope=scope;
				this._submits[this._submits._length++]=submit;
				this._curSubmit._numEle+=6;
			}
		}

		__proto.transform=function(a,b,c,d,tx,ty){
			SaveTransform.save(this);
			Matrix.mul(Matrix.TEMP.setTo(a,b,c,d,tx,ty),this._curMat,this._curMat);
			this._curMat._checkTransform();
		}

		__proto.setTransformByMatrix=function(value){
			value.copyTo(this._curMat);
		}

		__proto.transformByMatrix=function(value){
			SaveTransform.save(this);
			Matrix.mul(value,this._curMat,this._curMat);
			this._curMat._checkTransform();
		}

		__proto.rotate=function(angle){
			SaveTransform.save(this);
			this._curMat.rotate(angle);
		}

		__proto.scale=function(scaleX,scaleY){
			SaveTransform.save(this);
			this._curMat.scale(scaleX,scaleY);
		}

		__proto.clipRect=function(x,y,width,height){
			width *=this._curMat.a;
			height *=this._curMat.d;
			var p=Point.TEMP;
			this._curMat.transformPoint(p.setTo(x,y));
			var submit=this._curSubmit=SubmitScissor.create(this);
			this._submits[this._submits._length++]=submit;
			submit.submitIndex=this._submits._length;
			submit.submitLength=9999999;
			SaveClipRect.save(this,submit);
			var clip=this._clipRect;
			var x1=clip.x,y1=clip.y;
			var r=p.x+width,b=p.y+height;
			x1 < p.x && (clip.x=p.x);
			y1 < p.y && (clip.y=p.y);
			clip.width=Math.min(r,x1+clip.width)-clip.x;
			clip.height=Math.min(b,y1+clip.height)-clip.y;
			this._shader2D.glTexture=null;
			submit.clipRect.copyFrom(clip);
			this._curSubmit=Submit.RENDERBASE;
		}

		__proto.setIBVB=function(x,y,ib,vb,numElement,mat,shader,shaderValues,startIndex,offset){
			(startIndex===void 0)&& (startIndex=0);
			(offset===void 0)&& (offset=0);
			if (ib===null){
				if (!Render.isFlash){
					ib=this._ib;
					}else {
					var falshVB=vb;
					(falshVB._selfIB)|| (falshVB._selfIB=IndexBuffer2D.create(0x88E4));
					falshVB._selfIB.clear();
					ib=falshVB._selfIB;
				}
				GlUtils.expandIBQuadrangle(ib,(vb.byteLength / (4 *vb.vertexStride *4)));
			}
			if (!shaderValues || !shader)
				throw Error("setIBVB must input:shader shaderValues");
			var submit=SubmitOtherIBVB.create(this,vb,ib,numElement,shader,shaderValues,startIndex,offset);
			mat || (mat=Matrix.EMPTY);
			mat.translate(x,y);
			Matrix.mul(mat,this._curMat,submit._mat);
			mat.translate(-x,-y);
			this._submits[this._submits._length++]=submit;
			this._curSubmit=Submit.RENDERBASE;
		}

		__proto.addRenderObject=function(o){
			this._submits[this._submits._length++]=o;
		}

		__proto.fillTrangles=function(tex,x,y,points,m){
			var submit=this._curSubmit;
			var vb=this._vb;
			var shader=this._shader2D;
			var curShader=submit.shaderValue;
			var length=points.length >> 4;
			var t_tex=tex.bitmap;
			if (shader.glTexture !=t_tex || shader.ALPHA!==curShader.ALPHA){
				submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength)/ 32)*3,Value2D.create(0x01,0));
				submit.shaderValue.textureHost=tex;
				this._submits[this._submits._length++]=submit;
			}
			GlUtils.fillTranglesVB(vb,x,y,points,m || this._curMat,this._x,this._y);
			submit._numEle+=length *6;
		}

		__proto.submitElement=function(start,end){
			var renderList=this._submits;
			end < 0 && (end=renderList._length);
			while (start < end){
				start+=renderList[start].renderSubmit();
			}
		}

		__proto.finish=function(){
			WebGL.mainContext.finish();
		}

		__proto.flush=function(){
			var maxNum=Math.max(this._vb.byteLength / (4 *16),this._maxNumEle / 6)+8;
			if (maxNum > (this._ib.bufferLength / (6 *2))){
				GlUtils.expandIBQuadrangle(this._ib,maxNum);
			}
			if (!this._isMain && AtlasResourceManager.enabled && AtlasResourceManager._atlasRestore > this._atlasResourceChange){
				this._atlasResourceChange=AtlasResourceManager._atlasRestore;
				var renderList=this._submits;
				for (var i=0,s=renderList._length;i < s;i++){
					var submit=renderList [i];
					if (submit.getRenderType()===16)
						(submit).checkTexture();
				}
			}
			this.submitElement(0,this._submits._length);
			this._path && this._path.reset();
			this._curSubmit=Submit.RENDERBASE;
			return this._submits._length;
		}

		__proto.setPathId=function(id){
			this.mId=id;
			if (this.mId !=-1){
				this.mHaveKey=false;
				var tVGM=VectorGraphManager.getInstance();
				if (tVGM.shapeDic[this.mId]){
					this.mHaveKey=true;
				}
				this.mHaveLineKey=false;
				if (tVGM.shapeLineDic[this.mId]){
					this.mHaveLineKey=true;
				}
			}
		}

		__proto.movePath=function(x,y){
			this.mX+=x;
			this.mY+=y;
		}

		__proto.beginPath=function(){
			var tPath=this._getPath();
			tPath.tempArray.length=0;
			tPath.closePath=false;
			this.mX=0;
			this.mY=0;
		}

		__proto.closePath=function(){
			this._path.closePath=true;
		}

		__proto.fill=function(isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			var tPath=this._getPath();
			this.drawPoly(0,0,tPath.tempArray,this.fillStyle._color.numColor,0,0,isConvexPolygon);
		}

		__proto.stroke=function(){
			var tPath=this._getPath();
			if (this.lineWidth > 0){
				if (this.mId==-1){
					tPath.drawLine(0,0,tPath.tempArray,this.lineWidth,this.strokeStyle._color.numColor);
					}else {
					if (this.mHaveLineKey){
						var tShapeLine=VectorGraphManager.getInstance().shapeLineDic[this.mId];
						tPath.setGeomtry(tShapeLine);
						}else {
						VectorGraphManager.getInstance().addLine(this.mId,tPath.drawLine(0,0,tPath.tempArray,this.lineWidth,this.strokeStyle._color.numColor));
					}
				}
				tPath.update();
				var tArray=RenderState2D.getMatrArray();
				RenderState2D.mat2MatArray(this._curMat,tArray);
				var tPosArray=[this.mX,this.mY];
				var tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(0x04,0));
				tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
				tempSubmit.shaderValue.u_pos=tPosArray;
				tempSubmit.shaderValue.u_mmat2=tArray;
				this._submits[this._submits._length++]=tempSubmit;
			}
		}

		__proto.line=function(fromX,fromY,toX,toY,lineWidth,mat){
			var submit=this._curSubmit;
			var vb=this._vb;
			if (GlUtils.fillLineVb(vb,this._clipRect,fromX,fromY,toX,toY,lineWidth,mat)){
				var shader=this._shader2D;
				var curShader=submit.shaderValue;
				if (shader.strokeStyle!==curShader.strokeStyle || shader.ALPHA!==curShader.ALPHA){
					shader.glTexture=null;
					submit=this._curSubmit=Submit.create(this,this._ib,vb,((vb._byteLength-16 *4)/ 32)*3,Value2D.create(0x02,0));
					submit.shaderValue.strokeStyle=shader.strokeStyle;
					submit.shaderValue.mainID=0x02;
					submit.shaderValue.ALPHA=shader.ALPHA;
					this._submits[this._submits._length++]=submit;
				}
				submit._numEle+=6;
			}
		}

		__proto.moveTo=function(x,y){
			var tPath=this._getPath();
			tPath.addPoint(x,y);
		}

		__proto.lineTo=function(x,y){
			var tPath=this._getPath();
			tPath.addPoint(x,y);
		}

		__proto.arcTo=function(x1,y1,x2,y2,r){
			if (this.mId !=-1){
				if (this.mHaveKey){
					return;
				}
			};
			var tPath=this._getPath();
			var x0=tPath.getEndPointX();
			var y0=tPath.getEndPointY();
			var dx0=NaN,dy0=NaN,dx1=NaN,dy1=NaN,a=NaN,d=NaN,cx=NaN,cy=NaN,a0=NaN,a1=NaN;
			var dir=false;
			dx0=x0-x1;
			dy0=y0-y1;
			dx1=x2-x1;
			dy1=y2-y1;
			Point.TEMP.setTo(dx0,dy0);
			Point.TEMP.normalize();
			dx0=Point.TEMP.x;
			dy0=Point.TEMP.y;
			Point.TEMP.setTo(dx1,dy1);
			Point.TEMP.normalize();
			dx1=Point.TEMP.x;
			dy1=Point.TEMP.y;
			a=Math.acos(dx0 *dx1+dy0 *dy1);
			var tTemp=Math.tan(a / 2.0);
			d=r / tTemp;
			if (d > 10000){
				this.lineTo(x1,y1);
				return;
			}
			if (dx0 *dy1-dx1 *dy0 <=0.0){
				cx=x1+dx0 *d+dy0 *r;
				cy=y1+dy0 *d-dx0 *r;
				a0=Math.atan2(dx0,-dy0);
				a1=Math.atan2(-dx1,dy1);
				dir=false;
				}else {
				cx=x1+dx0 *d-dy0 *r;
				cy=y1+dy0 *d+dx0 *r;
				a0=Math.atan2(-dx0,dy0);
				a1=Math.atan2(dx1,-dy1);
				dir=true;
			}
			this.arc(cx,cy,r,a0,a1,dir);
		}

		__proto.arc=function(cx,cy,r,startAngle,endAngle,counterclockwise){
			(counterclockwise===void 0)&& (counterclockwise=false);
			if (this.mId !=-1){
				if (this.mHaveKey){
					return;
				}
				cx=0;
				cy=0;
			};
			var a=0,da=0,hda=0,kappa=0;
			var dx=0,dy=0,x=0,y=0,tanx=0,tany=0;
			var px=0,py=0,ptanx=0,ptany=0;
			var i=0,ndivs=0,nvals=0;
			da=endAngle-startAngle;
			if (!counterclockwise){
				if (Math.abs(da)>=Math.PI *2){
					da=Math.PI *2;
					}else {
					while (da < 0.0){
						da+=Math.PI *2;
					}
				}
				}else {
				if (Math.abs(da)>=Math.PI *2){
					da=-Math.PI *2;
					}else {
					while (da > 0.0){
						da-=Math.PI *2;
					}
				}
			}
			if (r < 101){
				ndivs=Math.max(10,da *r / 5);
				}else if (r < 201){
				ndivs=Math.max(10,da *r / 20);
				}else {
				ndivs=Math.max(10,da *r / 40);
			}
			hda=(da / ndivs)/ 2.0;
			kappa=Math.abs(4 / 3 *(1-Math.cos(hda))/ Math.sin(hda));
			if (counterclockwise)
				kappa=-kappa;
			nvals=0;
			var tPath=this._getPath();
			for (i=0;i <=ndivs;i++){
				a=startAngle+da *(i / ndivs);
				dx=Math.cos(a);
				dy=Math.sin(a);
				x=cx+dx *r;
				y=cy+dy *r;
				if (x !=this._path.getEndPointX()|| y !=this._path.getEndPointY()){
					tPath.addPoint(x,y);
				}
			}
			dx=Math.cos(endAngle);
			dy=Math.sin(endAngle);
			x=cx+dx *r;
			y=cy+dy *r;
			if (x !=this._path.getEndPointX()|| y !=this._path.getEndPointY()){
				tPath.addPoint(x,y);
			}
		}

		__proto.quadraticCurveTo=function(cpx,cpy,x,y){
			var tBezier=Bezier.I;
			var tResultArray=[];
			var tArray=tBezier.getBezierPoints([this._path.getEndPointX(),this._path.getEndPointY(),cpx,cpy,x,y],30,2);
			for (var i=0,n=tArray.length / 2;i < n;i++){
				this.lineTo(tArray[i *2],tArray[i *2+1]);
			}
			this.lineTo(x,y);
		}

		__proto.rect=function(x,y,width,height){
			this._other=this._other.make();
			this._other.path || (this._other.path=new Path());
			this._other.path.rect(x,y,width,height);
		}

		__proto.strokeRect=function(x,y,width,height,parameterLineWidth){
			var tW=parameterLineWidth *0.5;
			this.line(x-tW,y,x+width+tW,y,parameterLineWidth,this._curMat);
			this.line(x+width,y,x+width,y+height,parameterLineWidth,this._curMat);
			this.line(x,y,x,y+height,parameterLineWidth,this._curMat);
			this.line(x-tW,y+height,x+width+tW,y+height,parameterLineWidth,this._curMat);
		}

		__proto.clip=function(){}
		/**
		*画多边形(用)
		*@param x
		*@param y
		*@param points
		*/
		__proto.drawPoly=function(x,y,points,color,lineWidth,boderColor,isConvexPolygon){
			(isConvexPolygon===void 0)&& (isConvexPolygon=false);
			this._shader2D.glTexture=null;
			var tPath=this._getPath();
			if (this.mId==-1){
				tPath.polygon(x,y,points,color,lineWidth ? lineWidth :1,boderColor)
				}else {
				if (this.mHaveKey){
					var tShape=VectorGraphManager.getInstance().shapeDic[this.mId];
					tPath.setGeomtry(tShape);
					}else {
					VectorGraphManager.getInstance().addShape(this.mId,tPath.polygon(x,y,points,color,lineWidth ? lineWidth :1,boderColor));
				}
			}
			tPath.update();
			var tPosArray=[this.mX,this.mY];
			var tArray=RenderState2D.getMatrArray();
			RenderState2D.mat2MatArray(this._curMat,tArray);
			var tempSubmit;
			if (!isConvexPolygon){
				var submit=SubmitStencil.create(4);
				this.addRenderObject(submit);
				tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(0x04,0));
				tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
				tempSubmit.shaderValue.u_pos=tPosArray;
				tempSubmit.shaderValue.u_mmat2=tArray;
				this._submits[this._submits._length++]=tempSubmit;
				submit=SubmitStencil.create(5);
				this.addRenderObject(submit);
			}
			tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(0x04,0));
			tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
			tempSubmit.shaderValue.u_pos=tPosArray;
			tempSubmit.shaderValue.u_mmat2=tArray;
			this._submits[this._submits._length++]=tempSubmit;
			if (!isConvexPolygon){
				submit=SubmitStencil.create(3);
				this.addRenderObject(submit);
			}
			if (lineWidth > 0){
				if (this.mHaveLineKey){
					var tShapeLine=VectorGraphManager.getInstance().shapeLineDic[this.mId];
					tPath.setGeomtry(tShapeLine);
					}else {
					VectorGraphManager.getInstance().addShape(this.mId,tPath.drawLine(x,y,points,lineWidth,boderColor));
				}
				tPath.update();
				tempSubmit=Submit.createShape(this,tPath.ib,tPath.vb,tPath.count,tPath.offset,Value2D.create(0x04,0));
				tempSubmit.shaderValue.ALPHA=this._shader2D.ALPHA;
				tempSubmit.shaderValue.u_mmat2=tArray;
				this._submits[this._submits._length++]=tempSubmit;
			}
		}

		/*******************************************end矢量绘制***************************************************/
		__proto.drawParticle=function(x,y,pt){
			pt.x=x;
			pt.y=y;
			this._submits[this._submits._length++]=pt;
		}

		__proto._getPath=function(){
			return this._path || (this._path=new Path());
		}

		/*,_shader2D.ALPHA=1*/
		__getset(0,__proto,'globalCompositeOperation',function(){
			return BlendMode.NAMES[this._nBlendType];
			},function(value){
			var n=BlendMode.TOINT[value];
			n==null || (this._nBlendType===n)|| (SaveBase.save(this,0x10000,this,true),this._curSubmit=Submit.RENDERBASE,this._nBlendType=n);
		});

		__getset(0,__proto,'strokeStyle',function(){
			return this._shader2D.strokeStyle;
			},function(value){
			this._shader2D.strokeStyle.equal(value)|| (SaveBase.save(this,0x200,this._shader2D,false),this._shader2D.strokeStyle=DrawStyle.create(value));
		});

		__getset(0,__proto,'globalAlpha',function(){
			return this._shader2D.ALPHA;
			},function(value){
			value=Math.floor(value *1000)/ 1000;
			if (value !=this._shader2D.ALPHA){
				SaveBase.save(this,0x1,this._shader2D,true);
				this._shader2D.ALPHA=value;
			}
		});

		__getset(0,__proto,'asBitmap',null,function(value){
			if (value){
				this._targets || (this._targets=new RenderTargetMAX());
				this._targets.repaint=true;
				if (!this._width || !this._height)throw Error("asBitmap no size!");
				this._targets.size(this._width,this._height);
			}else this._targets=null;
		});

		__getset(0,__proto,'fillStyle',function(){
			return this._shader2D.fillStyle;
			},function(value){
			this._shader2D.fillStyle.equal(value)|| (SaveBase.save(this,0x2,this._shader2D,false),this._shader2D.fillStyle=DrawStyle.create(value));
		});

		__getset(0,__proto,'textAlign',function(){
			return this._other.textAlign;
			},function(value){
			(this._other.textAlign===value)|| (this._other=this._other.make(),SaveBase.save(this,0x8000,this._other,false),this._other.textAlign=value);
		});

		__getset(0,__proto,'lineWidth',function(){
			return this._other.lineWidth;
			},function(value){
			(this._other.lineWidth===value)|| (this._other=this._other.make(),SaveBase.save(this,0x100,this._other,false),this._other.lineWidth=value);
		});

		__getset(0,__proto,'textBaseline',function(){
			return this._other.textBaseline;
			},function(value){
			(this._other.textBaseline===value)|| (this._other=this._other.make(),SaveBase.save(this,0x4000,this._other,false),this._other.textBaseline=value);
		});

		__getset(0,__proto,'font',null,function(str){
			if (str==this._other.font.toString())
				return;
			this._other=this._other.make();
			SaveBase.save(this,0x8,this._other,false);
			this._other.font===FontInContext.EMPTY ? (this._other.font=new FontInContext(str)):(this._other.font.setFont(str));
		});

		WebGLContext2D.__init__=function(){
			ContextParams.DEFAULT=new ContextParams();
		}

		WebGLContext2D._SUBMITVBSIZE=32000;
		WebGLContext2D._MAXSIZE=99999999;
		WebGLContext2D._RECTVBSIZE=16;
		WebGLContext2D.MAXCLIPRECT=new Rectangle(0,0,99999999,99999999);
		WebGLContext2D._COUNT=0;
		WebGLContext2D._tmpMatrix=new Matrix();
		__static(WebGLContext2D,
		['_fontTemp',function(){return this._fontTemp=new FontInContext();},'_drawStyleTemp',function(){return this._drawStyleTemp=new DrawStyle(null);}
		]);
		WebGLContext2D.__init$=function(){
			//class ContextParams
			ContextParams=(function(){
				function ContextParams(){
					this.lineWidth=1;
					this.path=null;
					this.textAlign=null;
					this.textBaseline=null;
					this.font=FontInContext.EMPTY;
				}
				__class(ContextParams,'');
				var __proto=ContextParams.prototype;
				__proto.clear=function(){
					this.lineWidth=1;
					this.path && this.path.clear();
					this.textAlign=this.textBaseline=null;
					this.font=FontInContext.EMPTY;
				}
				__proto.make=function(){
					return this===ContextParams.DEFAULT ? new ContextParams():this;
				}
				ContextParams.DEFAULT=null
				return ContextParams;
			})()
		}

		return WebGLContext2D;
	})(Context)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.RenderSprite3D extends laya.renders.RenderSprite
	var RenderSprite3D=(function(_super){
		function RenderSprite3D(type,next){
			RenderSprite3D.__super.call(this,type,next);
		}

		__class(RenderSprite3D,'laya.webgl.utils.RenderSprite3D',_super);
		var __proto=RenderSprite3D.prototype;
		__proto.onCreate=function(type){
			switch (type){
				case 0x20:
					this._fun=this._blend;
					return;
				case 0x04:
					this._fun=this._transform;
					return;
				}
		}

		__proto._blend=function(sprite,context,x,y){
			var style=sprite._style;
			var next=this._next;
			var mask=sprite.mask;
			var submitCMD;
			var submitStencil;
			context.ctx.save();
			if (mask){
				var preBlendMode=(context.ctx).globalCompositeOperation;
				var tRect=new Rectangle();
				tRect.copyFrom(mask.getBounds());
				if (tRect.width > 0 && tRect.height > 0){
					var scope=SubmitCMDScope.create();
					scope.addValue("bounds",tRect);
					submitCMD=SubmitCMD.create([scope,context],laya.webgl.utils.RenderSprite3D.tmpTarget);
					context.addRenderObject(submitCMD);
					mask.render(context,-tRect.x,-tRect.y);
					submitCMD=SubmitCMD.create([scope],laya.webgl.utils.RenderSprite3D.endTmpTarget);
					context.addRenderObject(submitCMD);
					context.ctx.save();
					context.clipRect(x+tRect.x,y+tRect.y,tRect.width,tRect.height);
					next._fun.call(next,sprite,context,x,y);
					context.ctx.restore();
					submitStencil=SubmitStencil.create(6);
					preBlendMode=(context.ctx).globalCompositeOperation;
					submitStencil.blendMode="mask";
					context.addRenderObject(submitStencil);
					Matrix.TEMP.identity();
					var shaderValue=Value2D.create(0x01,0);
					(context.ctx).drawTarget(scope,x+tRect.x,y+tRect.y,tRect.width,tRect.height,Matrix.TEMP,"tmpTarget",shaderValue,Texture.INV_UV,6);
					submitCMD=SubmitCMD.create([scope],laya.webgl.utils.RenderSprite3D.recycleTarget);
					context.addRenderObject(submitCMD);
					submitStencil=SubmitStencil.create(6);
					submitStencil.blendMode=preBlendMode;
					context.addRenderObject(submitStencil);
				}
				}else {
				context.ctx.globalCompositeOperation=style.blendMode;
				next=this._next;
				next._fun.call(next,sprite,context,x,y);
			}
			context.ctx.restore();
		}

		__proto._transform=function(sprite,context,x,y){
			'use strict';
			var transform=sprite.transform,_next=this._next;
			if (transform && _next !=RenderSprite.NORENDER){
				var ctx=context.ctx;
				var style=sprite._style;
				transform.tx=x;
				transform.ty=y;
				var m2=ctx._getTransformMatrix();
				var m1=m2.clone();
				Matrix.mul(transform,m2,m2);
				m2._checkTransform();
				_next._fun.call(_next,sprite,context,0,0);
				m1.copyTo(m2);
				m1.destroy();
				transform.tx=transform.ty=0;
				}else {
				_next._fun.call(_next,sprite,context,x,y);
			}
		}

		RenderSprite3D.tmpTarget=function(scope,context){
			var b=scope.getValue("bounds");
			var tmpTarget=RenderTarget2D.create(b.width,b.height);
			tmpTarget.start();
			tmpTarget.clear(0,0,0,0);
			scope.addValue("tmpTarget",tmpTarget);
		}

		RenderSprite3D.endTmpTarget=function(scope){
			var tmpTarget=scope.getValue("tmpTarget");
			tmpTarget.end();
		}

		RenderSprite3D.recycleTarget=function(scope){
			var tmpTarget=scope.getValue("tmpTarget");
			tmpTarget.recycle();
			scope.recycle();
		}

		return RenderSprite3D;
	})(RenderSprite)


	//class laya.webgl.atlas.Atlaser extends laya.webgl.atlas.AtlasGrid
	var Atlaser=(function(_super){
		function Atlaser(gridNumX,gridNumY,width,height,atlasID){
			this._atlasCanvas=null;
			this._inAtlasTextureKey=null;
			this._inAtlasTextureBitmapValue=null;
			this._inAtlasTextureOriUVValue=null;
			this._InAtlasWebGLImagesKey=null;
			this._InAtlasWebGLImagesOffsetValue=null;
			Atlaser.__super.call(this,gridNumX,gridNumY,atlasID);
			this._inAtlasTextureKey=[];
			this._inAtlasTextureBitmapValue=[];
			this._inAtlasTextureOriUVValue=[];
			this._InAtlasWebGLImagesKey=[];
			this._InAtlasWebGLImagesOffsetValue=[];
			this._atlasCanvas=new AtlasWebGLCanvas();
			this._atlasCanvas.width=width;
			this._atlasCanvas.height=height;
			this._atlasCanvas.activeResource();
			this._atlasCanvas.lock=true;
		}

		__class(Atlaser,'laya.webgl.atlas.Atlaser',_super);
		var __proto=Atlaser.prototype;
		__proto.computeUVinAtlasTexture=function(texture,oriUV,offsetX,offsetY){
			var tex=texture;
			var _width=AtlasResourceManager.atlasTextureWidth;
			var _height=AtlasResourceManager.atlasTextureHeight;
			var u1=offsetX / _width,v1=offsetY / _height,u2=(offsetX+texture.bitmap.width)/ _width,v2=(offsetY+texture.bitmap.height)/ _height;
			var inAltasUVWidth=texture.bitmap.width / _width,inAltasUVHeight=texture.bitmap.height / _height;
			texture.uv=[u1+oriUV[0] *inAltasUVWidth,v1+oriUV[1] *inAltasUVHeight,u2-(1-oriUV[2])*inAltasUVWidth,v1+oriUV[3] *inAltasUVHeight,u2-(1-oriUV[4])*inAltasUVWidth,v2-(1-oriUV[5])*inAltasUVHeight,u1+oriUV[6] *inAltasUVWidth,v2-(1-oriUV[7])*inAltasUVHeight];
		}

		/**
		*
		*@param inAtlasRes
		*@return 是否已经存在队列中
		*/
		__proto.addToAtlasTexture=function(mergeAtlasBitmap,offsetX,offsetY){
			((mergeAtlasBitmap instanceof laya.webgl.resource.WebGLImage ))&& (this._InAtlasWebGLImagesKey.push(mergeAtlasBitmap),this._InAtlasWebGLImagesOffsetValue.push([offsetX,offsetY]));
			this._atlasCanvas.texSubImage2D(offsetX,offsetY,mergeAtlasBitmap.atlasSource);
			mergeAtlasBitmap.clearAtlasSource();
		}

		__proto.addToAtlas=function(texture,offsetX,offsetY){
			var oriUV=texture.uv.slice();
			var oriBitmap=texture.bitmap;
			this._inAtlasTextureKey.push(texture);
			this._inAtlasTextureOriUVValue.push(oriUV);
			this._inAtlasTextureBitmapValue.push(oriBitmap);
			this.computeUVinAtlasTexture(texture,oriUV,offsetX,offsetY);
			texture.bitmap=this._atlasCanvas;
		}

		__proto.clear=function(){
			for (var i=0,n=this._inAtlasTextureKey.length;i < n;i++){
				this._inAtlasTextureKey[i].bitmap=this._inAtlasTextureBitmapValue[i];
				this._inAtlasTextureKey[i].uv=this._inAtlasTextureOriUVValue[i];
				this._inAtlasTextureKey[i].bitmap.lock=false;
				this._inAtlasTextureKey[i].bitmap.releaseResource();
			}
			this._inAtlasTextureKey.length=0;
			this._inAtlasTextureBitmapValue.length=0;
			this._inAtlasTextureOriUVValue.length=0;
			this._InAtlasWebGLImagesKey.length=0;
			this._InAtlasWebGLImagesOffsetValue.length=0;
		}

		__proto.dispose=function(){
			this.clear();
			this._atlasCanvas.dispose();
		}

		__getset(0,__proto,'InAtlasWebGLImagesOffsetValue',function(){
			return this._InAtlasWebGLImagesOffsetValue;
		});

		__getset(0,__proto,'texture',function(){
			return this._atlasCanvas;
		});

		__getset(0,__proto,'inAtlasWebGLImagesKey',function(){
			return this._InAtlasWebGLImagesKey;
		});

		return Atlaser;
	})(AtlasGrid)


	//class laya.webgl.shapes.Line extends laya.webgl.shapes.BasePoly
	var Line=(function(_super){
		function Line(x,y,points,borderWidth,color){
			this._points=[];
			var tCurrX=NaN;
			var tCurrY=NaN;
			var tLastX=-1;
			var tLastY=-1;
			var tLen=points.length / 2-1;
			for (var i=0;i < tLen;i++){
				tCurrX=points[i *2];
				tCurrY=points[i *2+1];
				if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)>0.01){
					this._points.push(tCurrX,tCurrY);
				}
				tLastX=tCurrX;
				tLastY=tCurrY;
			}
			tCurrX=points[tLen *2];
			tCurrY=points[tLen *2+1];
			tLastX=this._points[0];
			tLastY=this._points[1];
			if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)>0.01){
				this._points.push(tCurrX,tCurrY);
			}
			Line.__super.call(this,x,y,0,0,0,color,borderWidth,color,0);
		}

		__class(Line,'laya.webgl.shapes.Line',_super);
		var __proto=Line.prototype;
		__proto.getData=function(ib,vb,start){
			var indices=[];
			var verts=[];
			(this.borderWidth > 0)&& this.createLine2(this._points,indices,this.borderWidth,start,verts,this._points.length / 2);
			ib.append(new Uint16Array(indices));
			vb.append(new Float32Array(verts));
		}

		return Line;
	})(BasePoly)


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.shapes.LoopLine extends laya.webgl.shapes.BasePoly
	var LoopLine=(function(_super){
		function LoopLine(x,y,points,width,color){
			this._points=[];
			var tCurrX=NaN;
			var tCurrY=NaN;
			var tLastX=-1;
			var tLastY=-1;
			var tLen=points.length / 2-1;
			for (var i=0;i < tLen;i++){
				tCurrX=points[i *2];
				tCurrY=points[i *2+1];
				if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)>0.01){
					this._points.push(tCurrX,tCurrY);
				}
				tLastX=tCurrX;
				tLastY=tCurrY;
			}
			tCurrX=points[tLen *2];
			tCurrY=points[tLen *2+1];
			tLastX=this._points[0];
			tLastY=this._points[1];
			if (Math.abs(tLastX-tCurrX)> 0.01 || Math.abs(tLastY-tCurrY)>0.01){
				this._points.push(tCurrX,tCurrY);
			}
			LoopLine.__super.call(this,x,y,0,0,this._points.length / 2,0,width,color);
		}

		__class(LoopLine,'laya.webgl.shapes.LoopLine',_super);
		var __proto=LoopLine.prototype;
		__proto.getData=function(ib,vb,start){
			if (this.borderWidth > 0){
				var color=this.color;
				var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
				var verts=[];
				var tLastX=-1,tLastY=-1;
				var tCurrX=0,tCurrY=0;
				var indices=[];
				var tLen=Math.floor(this._points.length / 2);
				for (var i=0;i < tLen;i++){
					tCurrX=this._points[i *2];
					tCurrY=this._points[i *2+1];
					verts.push(this.x+tCurrX,this.y+tCurrY,r,g,b);
				}
				this.createLoopLine(verts,indices,this.borderWidth,start+verts.length / 5);
				ib.append(new Uint16Array(indices));
				vb.append(new Float32Array(verts));
			}
		}

		__proto.createLoopLine=function(p,indices,lineWidth,len,outVertex,outIndex){
			var tLen=p.length / 5;
			var points=p.concat();
			var result=outVertex ? outVertex :p;
			var color=this.borderColor;
			var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
			var firstPoint=[points[0],points[1]];
			var lastPoint=[points[points.length-5],points[points.length-4]];
			var midPointX=lastPoint[0]+(firstPoint[0]-lastPoint[0])*0.5;
			var midPointY=lastPoint[1]+(firstPoint[1]-lastPoint[1])*0.5;
			points.unshift(midPointX,midPointY,0,0,0);
			points.push(midPointX,midPointY,0,0,0);
			var length=points.length / 5;
			var iStart=len,w=lineWidth / 2;
			var px,py,p1x,p1y,p2x,p2y,p3x,p3y;
			var perpx,perpy,perp2x,perp2y,perp3x,perp3y;
			var a1,b1,c1,a2,b2,c2;
			var denom,pdist,dist;
			p1x=points[0];
			p1y=points[1];
			p2x=points[5];
			p2y=points[6];
			perpx=-(p1y-p2y);
			perpy=p1x-p2x;
			dist=Math.sqrt(perpx *perpx+perpy *perpy);
			perpx=perpx / dist *w;
			perpy=perpy / dist *w;
			result.push(p1x-perpx,p1y-perpy,r,g,b,p1x+perpx,p1y+perpy,r,g,b);
			for (var i=1;i < length-1;i++){
				p1x=points[(i-1)*5];
				p1y=points[(i-1)*5+1];
				p2x=points[(i)*5];
				p2y=points[(i)*5+1];
				p3x=points[(i+1)*5];
				p3y=points[(i+1)*5+1];
				perpx=-(p1y-p2y);
				perpy=p1x-p2x;
				dist=Math.sqrt(perpx *perpx+perpy *perpy);
				perpx=perpx / dist *w;
				perpy=perpy / dist *w;
				perp2x=-(p2y-p3y);
				perp2y=p2x-p3x;
				dist=Math.sqrt(perp2x *perp2x+perp2y *perp2y);
				perp2x=perp2x / dist *w;
				perp2y=perp2y / dist *w;
				a1=(-perpy+p1y)-(-perpy+p2y);
				b1=(-perpx+p2x)-(-perpx+p1x);
				c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);
				a2=(-perp2y+p3y)-(-perp2y+p2y);
				b2=(-perp2x+p2x)-(-perp2x+p3x);
				c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);
				denom=a1 *b2-a2 *b1;
				if (Math.abs(denom)< 0.1){
					denom+=10.1;
					result.push(p2x-perpx,p2y-perpy,r,g,b,p2x+perpx,p2y+perpy,r,g,b);
					continue ;
				}
				px=(b1 *c2-b2 *c1)/ denom;
				py=(a2 *c1-a1 *c2)/ denom;
				pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);
				result.push(px,py,r,g,b,p2x-(px-p2x),p2y-(py-p2y),r,g,b);
			}
			if (outIndex){
				indices=outIndex;
			};
			var groupLen=this.edges+1;
			for (i=1;i < groupLen;i++){
				indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+i *2+1,iStart+i *2+1,iStart+i *2,iStart+(i-1)*2);
			}
			indices.push(iStart+(i-1)*2,iStart+(i-1)*2+1,iStart+1,iStart+1,iStart,iStart+(i-1)*2);
			return result;
		}

		return LoopLine;
	})(BasePoly)


	//class laya.webgl.shapes.Polygon extends laya.webgl.shapes.BasePoly
	var Polygon=(function(_super){
		function Polygon(x,y,points,color,borderWidth,borderColor){
			this._points=null;
			this.mUint16Array=null;
			this.mFloat32Array=null;
			this._points=points.slice(0,points.length);
			Polygon.__super.call(this,x,y,0,0,this._points.length / 2,color,borderWidth,borderColor);
		}

		__class(Polygon,'laya.webgl.shapes.Polygon',_super);
		var __proto=Polygon.prototype;
		__proto.getData=function(ib,vb,start){
			if (!(this.mUint16Array && this.mFloat32Array)){
				var indices=[];
				var verts=[];
				var color=this.color;
				var r=((color >> 16)& 0x0000ff)/ 255,g=((color >> 8)& 0xff)/ 255,b=(color & 0x0000ff)/ 255;
				var tArray;
				tArray=this._points;
				var i=0,tLen=Math.floor(tArray.length / 2);
				for (i=0;i < tLen;i++){
					verts.push(this.x+tArray[i *2],this.y+tArray[i *2+1],r,g,b);
				}
				for (i=2;i < tLen;i++){
					indices.push(start,start+i-1,start+i);
				}
				this.mUint16Array=new Uint16Array(indices);
				this.mFloat32Array=new Float32Array(verts);
			}
			ib.append(this.mUint16Array);
			vb.append(this.mFloat32Array);
		}

		return Polygon;
	})(BasePoly)


	/**
	*...
	*@author wk
	*/
	//class laya.webgl.submit.SubmitCanvas extends laya.webgl.submit.Submit
	var SubmitCanvas=(function(_super){
		function SubmitCanvas(){
			//this._ctx_src=null;
			this._matrix=new Matrix();
			this._matrix4=CONST3D2D.defaultMatrix4.concat();
			SubmitCanvas.__super.call(this,1);
			this.shaderValue=new Value2D(0,0);
		}

		__class(SubmitCanvas,'laya.webgl.submit.SubmitCanvas',_super);
		var __proto=SubmitCanvas.prototype;
		__proto.renderSubmit=function(){
			if (this._ctx_src._targets){
				this._ctx_src._targets.flush(this._ctx_src);
				return 1;
			};
			var preAlpha=RenderState2D.worldAlpha;
			var preMatrix4=RenderState2D.worldMatrix4;
			var preMatrix=RenderState2D.worldMatrix;
			var preFilters=RenderState2D.worldFilters;
			var preWorldShaderDefines=RenderState2D.worldShaderDefines;
			var v=this.shaderValue;
			var m=this._matrix;
			var m4=this._matrix4;
			var mout=Matrix.TEMP;
			Matrix.mul(m,preMatrix,mout);
			m4[0]=mout.a;
			m4[1]=mout.b;
			m4[4]=mout.c;
			m4[5]=mout.d;
			m4[12]=mout.tx;
			m4[13]=mout.ty;
			RenderState2D.worldMatrix=mout.clone();
			RenderState2D.worldMatrix4=m4;
			RenderState2D.worldAlpha=RenderState2D.worldAlpha *v.alpha;
			if (v.filters && v.filters.length){
				RenderState2D.worldFilters=v.filters;
				RenderState2D.worldShaderDefines=v.defines;
			}
			this._ctx_src.flush();
			RenderState2D.worldAlpha=preAlpha;
			RenderState2D.worldMatrix4=preMatrix4;
			RenderState2D.worldMatrix.destroy();
			RenderState2D.worldMatrix=preMatrix;
			RenderState2D.worldFilters=preFilters;
			RenderState2D.worldShaderDefines=preWorldShaderDefines;
			return 1;
		}

		__proto.releaseRender=function(){
			var cache=SubmitCanvas._cache;
			cache[cache._length++]=this;
		}

		__proto.getRenderType=function(){
			return 3;
		}

		SubmitCanvas.create=function(ctx_src,alpha,filters){
			var o=(!SubmitCanvas._cache._length)?(new SubmitCanvas()):SubmitCanvas._cache[--SubmitCanvas._cache._length];
			o._ctx_src=ctx_src;
			var v=o.shaderValue;
			v.alpha=alpha;
			v.defines.setValue(0);
			filters && filters.length && v.setFilters(filters);
			return o;
		}

		SubmitCanvas._cache=(SubmitCanvas._cache=[],SubmitCanvas._cache._length=0,SubmitCanvas._cache);
		return SubmitCanvas;
	})(Submit)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.submit.SubmitTexture extends laya.webgl.submit.Submit
	var SubmitTexture=(function(_super){
		function SubmitTexture(renderType){
			this._preIsSameTextureShader=false;
			this._isSameTexture=true;
			this._texs=new Array;
			this._texsID=new Array;
			this._vbPos=new Array;
			(renderType===void 0)&& (renderType=1);
			SubmitTexture.__super.call(this,renderType);
		}

		__class(SubmitTexture,'laya.webgl.submit.SubmitTexture',_super);
		var __proto=SubmitTexture.prototype;
		__proto.releaseRender=function(){
			var cache=SubmitTexture._cache;
			cache[cache._length++]=this;
			this.shaderValue.release();
			this._preIsSameTextureShader=false;
			this._vb=null;
			this._texs.length=0;
			this._isSameTexture=true;
		}

		__proto.addTexture=function(tex,vbpos){
			this._texsID[this._texs.length]=tex._uvID;
			this._texs.push(tex);
			this._vbPos.push(vbpos);
		}

		//检查材质是否修改，修改UV，设置是否是同一材质
		__proto.checkTexture=function(){
			if (this._texs.length < 1){
				this._isSameTexture=true;
				return;
			};
			var _tex=this.shaderValue.textureHost;
			var webGLImg=_tex.bitmap;
			if (webGLImg===null)return;
			var vbdata=this._vb.getFloat32Array();
			for (var i=0,s=this._texs.length;i < s;i++){
				var tex=this._texs[i];
				tex.active();
				var newUV=tex.uv;
				if (this._texsID[i]!==tex._uvID){
					this._texsID[i]=tex._uvID;
					var vbPos=this._vbPos[i];
					vbdata[vbPos+2]=newUV[0];
					vbdata[vbPos+3]=newUV[1];
					vbdata[vbPos+6]=newUV[2];
					vbdata[vbPos+7]=newUV[3];
					vbdata[vbPos+10]=newUV[4];
					vbdata[vbPos+11]=newUV[5];
					vbdata[vbPos+14]=newUV[6];
					vbdata[vbPos+15]=newUV[7];
					this._vb.setNeedUpload();
				}
				if (tex.bitmap!==webGLImg){
					this._isSameTexture=false;
				}
			}
		}

		__proto.renderSubmit=function(){
			if (this._numEle===0)return 1;
			var _tex=this.shaderValue.textureHost;
			if (_tex){
				var source=_tex.source;
				if (!_tex.bitmap || !source){
					SubmitTexture._shaderSet=false;
					return 1;
				}
				this.shaderValue.texture=source;
			}
			this._vb.bind_upload(this._ib);
			var gl=WebGL.mainContext;
			if (BlendMode.activeBlendFunction!==this._blendFn){
				gl.enable(0x0BE2);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			Stat.drawCall++;
			Stat.trianglesFaces+=this._numEle / 3;
			if (this._preIsSameTextureShader && Shader.activeShader && SubmitTexture._shaderSet)
				Shader.activeShader.uploadTexture2D(this.shaderValue.texture);
			else this.shaderValue.upload();
			SubmitTexture._shaderSet=true;
			if (this._texs.length > 1 && !this._isSameTexture){
				var webGLImg=_tex.bitmap;
				var index=0;
				var shader=Shader.activeShader;
				for (var i=0,s=this._texs.length;i < s;i++){
					var tex2=this._texs[i];
					if (tex2.bitmap!==webGLImg || (i+1)===s){
						shader.uploadTexture2D(tex2.source);
						gl.drawElements(0x0004,(i-index+1)*6,0x1403,this._startIdx+index *6 *CONST3D2D.BYTES_PIDX);
						webGLImg=tex2.bitmap;
						index=i;
					}
				}
				}else {
				gl.drawElements(0x0004,this._numEle,0x1403,this._startIdx);
			}
			return 1;
		}

		SubmitTexture.create=function(context,ib,vb,pos,sv){
			var o=SubmitTexture._cache._length ? SubmitTexture._cache[--SubmitTexture._cache._length] :new SubmitTexture();
			if (vb==null){
				vb=o._selfVb || (o._selfVb=VertexBuffer2D.create(-1));
				vb.clear();
				pos=0;
			}
			o._ib=ib;
			o._vb=vb;
			o._startIdx=pos *CONST3D2D.BYTES_PIDX;
			o._numEle=0;
			var blendType=context._nBlendType;
			o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
			o.shaderValue=sv;
			o.shaderValue.setValue(context._shader2D);
			var filters=context._shader2D.filters;
			filters && o.shaderValue.setFilters(filters);
			return o;
		}

		SubmitTexture._cache=(SubmitTexture._cache=[],SubmitTexture._cache._length=0,SubmitTexture._cache);
		SubmitTexture._shaderSet=true;
		return SubmitTexture;
	})(Submit)


	/**
	*<p> <code>Sprite</code> 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。</p>
	*
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Sprite;
		*import laya.events.Event;
		*
		*public class Sprite_Example
		*{
			*private var sprite:Sprite;
			*private var shape:Sprite
			*public function Sprite_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*onInit();
				*}
			*private function onInit():void
			*{
				*sprite=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
				*sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
				*sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
				*sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
				*sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
				*sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
				*Laya.stage.addChild(sprite);//将此 sprite 对象添加到显示列表。
				*sprite.on(Event.CLICK,this,onClickSprite);//给 sprite 对象添加点击事件侦听。
				*shape=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
				*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
				*shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
				*shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
				*shape.width=100;//设置 shape 对象的宽度。
				*shape.height=100;//设置 shape 对象的高度。
				*shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
				*shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
				*Laya.stage.addChild(shape);//将此 shape 对象添加到显示列表。
				*shape.on(Event.CLICK,this,onClickShape);//给 shape 对象添加点击事件侦听。
				*}
			*private function onClickSprite():void
			*{
				*trace("点击 sprite 对象。");
				*sprite.rotation+=5;//旋转 sprite 对象。
				*}
			*private function onClickShape():void
			*{
				*trace("点击 shape 对象。");
				*shape.rotation+=5;//旋转 shape 对象。
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*var sprite;
	*var shape;
	*Sprite_Example();
	*function Sprite_Example()
	*{
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*onInit();
		*}
	*function onInit()
	*{
		*sprite=new laya.display.Sprite();//创建一个 Sprite 类的实例对象 sprite 。
		*sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
		*sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
		*sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
		*sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
		*sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
		*Laya.stage.addChild(sprite);//将此 sprite 对象添加到显示列表。
		*sprite.on(Event.CLICK,this,onClickSprite);//给 sprite 对象添加点击事件侦听。
		*shape=new laya.display.Sprite();//创建一个 Sprite 类的实例对象 sprite 。
		*shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
		*shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
		*shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
		*shape.width=100;//设置 shape 对象的宽度。
		*shape.height=100;//设置 shape 对象的高度。
		*shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
		*shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
		*Laya.stage.addChild(shape);//将此 shape 对象添加到显示列表。
		*shape.on(laya.events.Event.CLICK,this,onClickShape);//给 shape 对象添加点击事件侦听。
		*}
	*function onClickSprite()
	*{
		*console.log("点击 sprite 对象。");
		*sprite.rotation+=5;//旋转 sprite 对象。
		*}
	*function onClickShape()
	*{
		*console.log("点击 shape 对象。");
		*shape.rotation+=5;//旋转 shape 对象。
		*}
	*</listing>
	*<listing version="3.0">
	*import Sprite=laya.display.Sprite;
	*class Sprite_Example {
		*private sprite:Sprite;
		*private shape:Sprite
		*public Sprite_Example(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*this.onInit();
			*}
		*private onInit():void {
			*this.sprite=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
			*this.sprite.loadImage("resource/ui/bg.png");//加载并显示图片。
			*this.sprite.x=200;//设置 sprite 对象相对于父容器的水平方向坐标值。
			*this.sprite.y=200;//设置 sprite 对象相对于父容器的垂直方向坐标值。
			*this.sprite.pivotX=0;//设置 sprite 对象的水平方法轴心点坐标。
			*this.sprite.pivotY=0;//设置 sprite 对象的垂直方法轴心点坐标。
			*Laya.stage.addChild(this.sprite);//将此 sprite 对象添加到显示列表。
			*this.sprite.on(laya.events.Event.CLICK,this,this.onClickSprite);//给 sprite 对象添加点击事件侦听。
			*this.shape=new Sprite();//创建一个 Sprite 类的实例对象 sprite 。
			*this.shape.graphics.drawRect(0,0,100,100,"#ccff00","#ff0000",2);//绘制一个有边框的填充矩形。
			*this.shape.x=400;//设置 shape 对象相对于父容器的水平方向坐标值。
			*this.shape.y=200;//设置 shape 对象相对于父容器的垂直方向坐标值。
			*this.shape.width=100;//设置 shape 对象的宽度。
			*this.shape.height=100;//设置 shape 对象的高度。
			*this.shape.pivotX=50;//设置 shape 对象的水平方法轴心点坐标。
			*this.shape.pivotY=50;//设置 shape 对象的垂直方法轴心点坐标。
			*Laya.stage.addChild(this.shape);//将此 shape 对象添加到显示列表。
			*this.shape.on(laya.events.Event.CLICK,this,this.onClickShape);//给 shape 对象添加点击事件侦听。
			*}
		*private onClickSprite():void {
			*console.log("点击 sprite 对象。");
			*this.sprite.rotation+=5;//旋转 sprite 对象。
			*}
		*private onClickShape():void {
			*console.log("点击 shape 对象。");
			*this.shape.rotation+=5;//旋转 shape 对象。
			*}
		*}
	*</listing>
	*/
	//class laya.display.Sprite extends laya.display.Node
	var Sprite=(function(_super){
		function Sprite(){
			this.mouseThrough=false;
			this._transform=null;
			this._tfChanged=false;
			this._x=0;
			this._y=0;
			this._width=0;
			this._height=0;
			this._repaint=1;
			this._mouseEnableState=0;
			this._zOrder=0;
			this._graphics=null;
			this._renderType=0;
			this.autoSize=false;
			this.hitTestPrior=false;
			this._optimizeScrollRect=false;
			Sprite.__super.call(this);
			this._style=Style.EMPTY;
		}

		__class(Sprite,'laya.display.Sprite',_super);
		var __proto=Sprite.prototype;
		Laya.imps(__proto,{"laya.display.ILayout":true})
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._style && this._style.destroy();
			this._transform=null;
			this._style=null;
			this._graphics=null;
		}

		/**根据zOrder进行重新排序。*/
		__proto.updateZOrder=function(){
			Utils.updateOrder(this._childs)&& this.repaint();
		}

		/**在设置cacheAs或staticCache=true的情况下，调用此方法会重新刷新缓存。*/
		__proto.reCache=function(){
			if (this._$P.cacheCanvas)this._$P.cacheCanvas.reCache=true;
		}

		/**
		*设置bounds大小，如果有设置，则不再通过getBounds计算
		*@param bound bounds矩形区域
		*/
		__proto.setBounds=function(bound){
			this._set$P("uBounds",bound);
		}

		/**
		*获取本对象在父容器坐标系的矩形显示区域。
		*<p><b>注意：</b>计算量较大，尽量少用。</p>
		*@return 矩形区域。
		*/
		__proto.getBounds=function(){
			if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
			return Rectangle._getWrapRec(this._boundPointsToParent(),this._$P.mBounds);
		}

		/**
		*获取本对象在自己坐标系的矩形显示区域。
		*<p><b>注意：</b>计算量较大，尽量少用。</p>
		*@return 矩形区域。
		*/
		__proto.getSelfBounds=function(){
			if (!this._$P.mBounds)this._set$P("mBounds",new Rectangle());
			return Rectangle._getWrapRec(this._getBoundPointsM(false),this._$P.mBounds);
		}

		/**
		*@private
		*获取本对象在父容器坐标系的显示区域多边形顶点列表。
		*当显示对象链中有旋转时，返回多边形顶点列表，无旋转时返回矩形的四个顶点。
		*@param ifRotate 之前的对象链中是否有旋转。
		*@return 顶点列表。结构：[x1,y1,x2,y2,x3,y3,...]。
		*/
		__proto._boundPointsToParent=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var pX=0,pY=0;
			if (this._style){
				pX=this._style._tf.translateX;
				pY=this._style._tf.translateY;
				ifRotate=ifRotate || (this._style._tf.rotate!==0);
				if (this._style.scrollRect){
					pX+=this._style.scrollRect.x;
					pY+=this._style.scrollRect.y;
				}
			};
			var pList=this._getBoundPointsM(ifRotate);
			if (!pList || pList.length < 1)return pList;
			if (pList.length !=8){
				pList=ifRotate ? GrahamScan.scanPList(pList):Rectangle._getWrapRec(pList,Rectangle.TEMP)._getBoundPoints();
			}
			if (!this.transform){
				Utils.transPointList(pList,this.x-pX,this.y-pY);
				return pList;
			};
			var tPoint=Point.TEMP;
			var i=0,len=pList.length;
			for (i=0;i < len;i+=2){
				tPoint.x=pList[i];
				tPoint.y=pList[i+1];
				this.toParentPoint(tPoint);
				pList[i]=tPoint.x;
				pList[i+1]=tPoint.y;
			}
			return pList;
		}

		/**
		*返回此实例中的绘图对象（ <code>Graphics</code> ）的显示区域。
		*@return 一个 Rectangle 对象，表示获取到的显示区域。
		*/
		__proto.getGraphicBounds=function(){
			if (!this._graphics)return Rectangle.TEMP.setTo(0,0,0,0);
			return this._graphics.getBounds();
		}

		/**
		*@private
		*获取自己坐标系的显示区域多边形顶点列表
		*@param ifRotate 当前的显示对象链是否由旋转
		*@return 顶点列表。结构：[x1,y1,x2,y2,x3,y3,...]。
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			if (this._$P.uBounds)return this._$P.uBounds._getBoundPoints();
			if (!this._$P.temBM)this._set$P("temBM",[]);
			if (this.scrollRect){
				var rst=Utils.clearArray(this._$P.temBM);
				var rec=Rectangle.TEMP;
				rec.copyFrom(this.scrollRect);
				Utils.concatArray(rst,rec._getBoundPoints());
				return rst;
			};
			var pList=this._graphics ? this._graphics.getBoundPoints():Utils.clearArray(this._$P.temBM);
			var child;
			var cList;
			var __childs;
			__childs=this._childs;
			for (var i=0,n=__childs.length;i < n;i++){
				child=__childs [i];
				if ((child instanceof laya.display.Sprite )&& child.visible==true){
					cList=child._boundPointsToParent(ifRotate);
					if (cList)
						pList=pList ? Utils.concatArray(pList,cList):cList;
				}
			}
			return pList;
		}

		/**
		*@private
		*获取样式。
		*@return 样式 Style 。
		*/
		__proto.getStyle=function(){
			this._style===Style.EMPTY && (this._style=new Style());
			return this._style;
		}

		/**
		*@private
		*设置样式。
		*@param value 样式。
		*/
		__proto.setStyle=function(value){
			this._style=value;
		}

		/**@private */
		__proto._adjustTransform=function(){
			'use strict';
			this._tfChanged=false;
			var style=this._style;
			var tf=style._tf;
			var sx=tf.scaleX,sy=tf.scaleY;
			var m;
			if (tf.rotate || sx!==1 || sy!==1 || tf.skewX || tf.skewY){
				m=this._transform || (this._transform=Matrix.create());
				m.bTransform=true;
				if (tf.rotate){
					var angle=tf.rotate *0.0174532922222222;
					var cos=m.cos=Math.cos(angle);
					var sin=m.sin=Math.sin(angle);
					m.a=sx *cos;
					m.b=sx *sin;
					m.c=-sy *sin;
					m.d=sy *cos;
					m.tx=m.ty=0;
					return m;
					}else {
					m.a=sx;
					m.d=sy;
					m.c=m.b=m.tx=m.ty=0;
					if (tf.skewX || tf.skewY){
						return m.skew(tf.skewX *0.0174532922222222,tf.skewY *0.0174532922222222);
					}
					return m;
				}
				}else {
				this._transform && this._transform.destroy();
				this._transform=null;
				this._renderType &=~0x04;
			}
			return m;
		}

		/**
		*设置坐标位置。
		*@param x X 轴坐标。
		*@param y Y 轴坐标。
		*@return 返回对象本身。
		*/
		__proto.pos=function(x,y){
			if (this._x!==x || this._y!==y){
				this.x=x;
				this.y=y;
			}
			return this;
		}

		/**
		*设置轴心点。
		*@param x X轴心点。
		*@param y Y轴心点。
		*@return 返回对象本身。
		*/
		__proto.pivot=function(x,y){
			this.pivotX=x;
			this.pivotY=y;
			return this;
		}

		/**
		*设置宽高。
		*@param width 宽度。
		*@param hegiht 高度。
		*@return 返回对象本身。
		*/
		__proto.size=function(width,height){
			this.width=width;
			this.height=height;
			return this;
		}

		/**
		*设置缩放。
		*@param scaleX X轴缩放比例。
		*@param scaleY Y轴缩放比例。
		*@return 返回对象本身。
		*/
		__proto.scale=function(scaleX,scaleY){
			this.scaleX=scaleX;
			this.scaleY=scaleY;
			return this;
		}

		/**
		*设置倾斜角度。
		*@param skewX 水平倾斜角度。
		*@param skewY 垂直倾斜角度。
		*@return 返回对象本身
		*/
		__proto.skew=function(skewX,skewY){
			this.skewX=skewX;
			this.skewY=skewY;
			return this;
		}

		/**
		*更新、呈现显示对象。
		*@param context 渲染的上下文引用。
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*/
		__proto.render=function(context,x,y){
			Stat.spriteCount++;
			RenderSprite.renders[this._renderType]._fun(this,context,x+this._x,y+this._y);
			this._repaint=0;
		}

		/**
		*绘制 <code>Sprite</code> 到 <code>canvas</code> 上。
		*@param canvasWidth 画布宽度。
		*@param canvasHeight 画布高度。
		*@param x 绘制的 X 轴偏移量。
		*@param y 绘制的 Y 轴偏移量。
		*@return HTMLCanvas 对象。
		*/
		__proto.drawToCanvas=function(canvasWidth,canvasHeight,offsetX,offsetY){
			return RunDriver.drawToCanvas(this,this._renderType,canvasWidth,canvasHeight,offsetX,offsetY);
		}

		/**
		*自定义更新、呈现显示对象。
		*<p><b>注意</b>不要在此函数内增加或删除树节点，否则会树节点遍历照成影响。</p>
		*@param context 渲染的上下文引用。
		*@param x X轴坐标。
		*@param y Y轴坐标。
		*/
		__proto.customRender=function(context,x,y){
			this._renderType |=0x200;
		}

		/**
		*@private
		*应用滤镜。
		*/
		__proto._applyFilters=function(){
			if (Render.isWebGL)return;
			var _filters;
			_filters=this._$P.filters;
			if (!_filters || _filters.length < 1)return;
			for (var i=0,n=_filters.length;i < n;i++){
				_filters[i].action.apply(this._$P.cacheCanvas);
			}
		}

		/**
		*@private
		*查看当前原件中是否包含发光滤镜。
		*@return 一个 Boolean 值，表示当前原件中是否包含发光滤镜。
		*/
		__proto._isHaveGlowFilter=function(){
			var i=0,len=0;
			if (this.filters){
				for (i=0;i < this.filters.length;i++){
					if (this.filters[i].type==0x08){
						return true;
					}
				}
			}
			for (i=0,len=this._childs.length;i < len;i++){
				if (this._childs[i]._isHaveGlowFilter()){
					return true;
				}
			}
			return false;
		}

		/**
		*本地坐标转全局坐标。
		*@param point 本地坐标点。
		*@param createNewPoint 用于存储转换后的坐标的点。
		*@return 转换后的坐标的点。
		*/
		__proto.localToGlobal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (!this._displayedInStage || !point)return point;
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			while (ele){
				if (ele==Laya.stage)break ;
				point=ele.toParentPoint(point);
				ele=ele.parent;
			}
			return point;
		}

		/**
		*全局坐标转本地坐标。
		*@param point 全局坐标点。
		*@param createNewPoint 用于存储转换后的坐标的点。
		*@return 转换后的坐标的点。
		*/
		__proto.globalToLocal=function(point,createNewPoint){
			(createNewPoint===void 0)&& (createNewPoint=false);
			if (!this._displayedInStage || !point)return point;
			if (createNewPoint===true){
				point=new Point(point.x,point.y);
			};
			var ele=this;
			var list=[];
			while (ele){
				if (ele==Laya.stage)break ;
				list.push(ele);
				ele=ele.parent;
			};
			var i=list.length-1;
			while (i >=0){
				ele=list[i];
				point=ele.fromParentPoint(point);
				i--;
			}
			return point;
		}

		/**
		*将本地坐标系坐标转换到父容器坐标系。
		*@param point 本地坐标点。
		*@return 转换后的点。
		*/
		__proto.toParentPoint=function(point){
			if (!point)return point;
			point.x-=this.pivotX;
			point.y-=this.pivotY;
			if (this.transform){
				this._transform.transformPoint(point);
			}
			point.x+=this._x;
			point.y+=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x-=scroll.x;
				point.y-=scroll.y;
			}
			return point;
		}

		/**
		*将父容器坐标系坐标转换到本地坐标系。
		*@param point 父容器坐标点。
		*@return 转换后的点。
		*/
		__proto.fromParentPoint=function(point){
			if (!point)return point;
			point.x-=this._x;
			point.y-=this._y;
			var scroll=this._style.scrollRect;
			if (scroll){
				point.x+=scroll.x;
				point.y+=scroll.y;
			}
			if (this.transform){
				this._transform.invertTransformPoint(point);
			}
			point.x+=this.pivotX;
			point.y+=this.pivotY;
			return point;
		}

		/**
		*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
		*如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnable 的值为 true。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args 事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.on=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				if (this._displayedInStage)this._$2__onDisplay();
				else laya.events.EventDispatcher.prototype.once.call(this,"display",this,this._$2__onDisplay);
			}
			return laya.events.EventDispatcher.prototype.on.call(this,type,caller,listener,args);
		}

		/**
		*使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
		*如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。
		*@param type 事件的类型。
		*@param caller 事件侦听函数的执行域。
		*@param listener 事件侦听函数。
		*@param args 事件侦听函数的回调参数。
		*@return 此 EventDispatcher 对象。
		*/
		__proto.once=function(type,caller,listener,args){
			if (this._mouseEnableState!==1 && this.isMouseEvent(type)){
				if (this._displayedInStage)this._$2__onDisplay();
				else laya.events.EventDispatcher.prototype.once.call(this,"display",this,this._$2__onDisplay);
			}
			return laya.events.EventDispatcher.prototype.once.call(this,type,caller,listener,args);
		}

		/**@private */
		__proto._$2__onDisplay=function(){
			if (this._mouseEnableState!==1){
				var ele=this;
				while (ele && ele._mouseEnableState!==1){
					ele.mouseEnabled=true;
					ele=ele.parent;
				}
			}
		}

		/**
		*加载并显示一个图片。功能等同于Graphics.loadImage
		*@param url 图片地址。
		*@param x 显示图片的x位置
		*@param y 显示图片的y位置
		*@param width 显示图片的宽度，设置为0表示使用图片默认宽度
		*@param height 显示图片的高度，设置为0表示使用图片默认高度
		*@param complete 加载完成回调
		*@return 返回精灵对象本身
		*/
		__proto.loadImage=function(url,x,y,width,height,complete){
			var _$this=this;
			(x===void 0)&& (x=0);
			(y===void 0)&& (y=0);
			(width===void 0)&& (width=0);
			(height===void 0)&& (height=0);
			function loaded (tex){
				if (!_$this.destroyed){
					_$this.size(x+(width || tex.width),y+(height || tex.height));
					_$this.repaint();
					complete && complete.runWith(tex);
				}
			}
			this.graphics.loadImage(url,x,y,width,height,loaded);
			return this;
		}

		/**cacheAs后，设置自己和父对象缓存失效。*/
		__proto.repaint=function(){
			this.model&&this.model.repaint&&this.model.repaint();
			(this._repaint===0)&& (this._repaint=1,this.parentRepaint());
			if (this._$P && this._$P.maskParent){
				this._$P.maskParent.repaint();
			}
		}

		/**
		*@private
		*获取是否重新缓存。
		*@return 如果重新缓存值为 true，否则值为 false。
		*/
		__proto._needRepaint=function(){
			return (this._repaint!==0)&& this._$P.cacheCanvas && this._$P.cacheCanvas.reCache;
		}

		/**@inheritDoc */
		__proto._childChanged=function(child){
			if (this._childs.length)this._renderType |=0x800;
			else this._renderType &=~0x800;
			if (child && (child).zOrder)Laya.timer.callLater(this,this.updateZOrder);
			this.repaint();
		}

		/**cacheAs时，设置所有父对象缓存失效。 */
		__proto.parentRepaint=function(){
			var p=this._parent;
			p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
		}

		/**
		*开始拖动此对象。
		*@param area 拖动区域，此区域为当前对象注册点活动区域（不包括对象宽高），可选。
		*@param hasInertia 鼠标松开后，是否还惯性滑动，默认为false，可选。
		*@param elasticDistance 橡皮筋效果的距离值，0为无橡皮筋效果，默认为0，可选。
		*@param elasticBackTime 橡皮筋回弹时间，单位为毫秒，默认为300毫秒，可选。
		*@param data 拖动事件携带的数据，可选。
		*@param disableMouseEvent 禁用其他对象的鼠标检测，默认为false，设置为true能提高性能
		*/
		__proto.startDrag=function(area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent){
			(hasInertia===void 0)&& (hasInertia=false);
			(elasticDistance===void 0)&& (elasticDistance=0);
			(elasticBackTime===void 0)&& (elasticBackTime=300);
			(disableMouseEvent===void 0)&& (disableMouseEvent=false);
			this._$P.dragging || (this._set$P("dragging",new Dragging()));
			this._$P.dragging.start(this,area,hasInertia,elasticDistance,elasticBackTime,data,disableMouseEvent);
		}

		/**停止拖动此对象。*/
		__proto.stopDrag=function(){
			this._$P.dragging && this._$P.dragging.stop();
		}

		/**@private */
		__proto._setDisplay=function(value){
			if (!value && this._$P.cacheCanvas && this._$P.cacheCanvas.ctx){
				Pool.recover("RenderContext",this._$P.cacheCanvas.ctx);
				this._$P.cacheCanvas.ctx=null;
			}
			if (!value){
				var fc=this._$P._filterCache;
				if (fc){
					fc.destroy();
					fc.recycle();
					this._set$P('_filterCache',null);
				}
				this._$P._isHaveGlowFilter && this._set$P('_isHaveGlowFilter',false);
			}
			_super.prototype._setDisplay.call(this,value);
		}

		/**
		*检测某个点是否在此对象内。
		*@param x 全局x坐标。
		*@param y 全局y坐标。
		*@return 表示是否在对象内。
		*/
		__proto.hitTestPoint=function(x,y){
			var point=this.globalToLocal(Point.TEMP.setTo(x,y));
			var rect=this._$P.hitArea ? this._$P.hitArea :Rectangle.EMPTY.setTo(0,0,this._width,this._height);
			return rect.contains(point.x,point.y);
		}

		/**获得相对于本对象上的鼠标坐标信息。*/
		__proto.getMousePoint=function(){
			return this.globalToLocal(Point.TEMP.setTo(Laya.stage.mouseX,Laya.stage.mouseY));
		}

		/**@private */
		__proto._getWords=function(){
			return null;
		}

		/**@private */
		__proto._addChildsToLayout=function(out){
			var words=this._getWords();
			if (words==null && this._childs.length==0)return false;
			if (words){
				for (var i=0,n=words.length;i < n;i++){
					out.push(words[i]);
				}
			}
			this._childs.forEach(function(o){
				o._style._enableLayout()&& o._addToLayout(out);
			});
			return true;
		}

		/**@private */
		__proto._addToLayout=function(out){
			if (this._style.absolute)return;
			this._style.block ? out.push(this):(this._addChildsToLayout(out)&& (this.x=this.y=0));
		}

		/**@private */
		__proto._isChar=function(){
			return false;
		}

		/**@private */
		__proto._getCSSStyle=function(){
			return this._style.getCSSStyle();
		}

		/**
		*@private
		*设置指定属性名的属性值。
		*@param name 属性名。
		*@param value 属性值。
		*/
		__proto._setAttributes=function(name,value){
			switch (name){
				case 'x':
					this.x=parseFloat(value);
					break ;
				case 'y':
					this.y=parseFloat(value);
					break ;
				case 'width':
					this.width=parseFloat(value);
					break ;
				case 'height':
					this.height=parseFloat(value);
					break ;
				default :
					this[name]=value;
				}
		}

		/**
		*@private
		*/
		__proto._layoutLater=function(){
			this.parent && (this.parent)._layoutLater();
		}

		/**
		*<p>指定是否对使用了 scrollRect 的显示对象进行优化处理。</p>
		*<p>默认为false(不优化)。</p>
		*<p>当值为ture时：将对此对象使用了scrollRect 设定的显示区域以外的显示内容不进行渲染，以提高性能。</p>
		*/
		__getset(0,__proto,'optimizeScrollRect',function(){
			return this._optimizeScrollRect;
			},function(b){
			if (this._optimizeScrollRect !=b){
				this._optimizeScrollRect=b;
				this.model && this.model.optimizeScrollRect(b);
			}
		});

		/**
		*开启自定义渲染，只有开启自定义渲染，才能使用customRender函数渲染
		*/
		__getset(0,__proto,'customRenderEnable',null,function(b){
			if (b){
				this._renderType |=0x200;
				if (Render.isConchNode){
					laya.display.Sprite.CustomList.push(this);
					var canvas=new HTMLCanvas("2d");
					canvas._setContext(new CanvasRenderingContext2D());
					this.customContext=new RenderContext(0,0,canvas);
					canvas.context.setCanvasType && canvas.context.setCanvasType(2);
					this.model.custom(canvas.context);
				}
			}
		});

		/**
		*指定显示对象是否缓存为静态图像。功能同cacheAs的normal模式。
		*/
		__getset(0,__proto,'cacheAsBitmap',function(){
			return this.cacheAs!=="none";
			},function(value){
			this.cacheAs=value ? (this._$P["hasFilter"] ? "none" :"normal"):"none";
		});

		/**
		*<p>指定显示对象是否缓存为静态图像，cacheAs时，子对象发生变化，会自动重新缓存，同时也可以手动调用reCache方法更新缓存。</p>
		*建议把不经常变化的复杂内容缓存为静态图像，能极大提高渲染性能，有"none"，"normal"和"bitmap"三个值可选。
		*<li>默认为"none"，不做任何缓存。</li>
		*<li>当值为"normal"时，canvas下进行画布缓存，webgl模式下进行命令缓存。</li>
		*<li>当值为"bitmap"时，canvas下进行依然是画布缓存，webgl模式下使用renderTarget缓存。</li>
		*webgl下renderTarget缓存模式有最大2048大小限制，会额外增加内存开销，不断重绘时开销比较大，但是会减少drawcall，渲染性能最高。
		*webgl下命令缓存模式只会减少节点遍历及命令组织，不会减少drawcall，性能中等。
		*/
		__getset(0,__proto,'cacheAs',function(){
			return this._$P.cacheCanvas==null ? "none" :this._$P.cacheCanvas.type;
			},function(value){
			var cacheCanvas=this._$P.cacheCanvas;
			if (value===(cacheCanvas ? cacheCanvas.type :"none"))return;
			if (value!=="none"){
				cacheCanvas || (cacheCanvas=this._set$P("cacheCanvas",Pool.getItemByClass("cacheCanvas",Object)));
				cacheCanvas.type=value;
				cacheCanvas.reCache=true;
				this._renderType |=0x08;
				if (value=="bitmap")this.model && this.model.cacheAs(1);
				this._set$P("cacheForFilters",false);
				}else {
				if (this._$P["hasFilter"]){
					this._set$P("cacheForFilters",true);
					}else {
					if (cacheCanvas)Pool.recover("cacheCanvas",cacheCanvas);
					this._$P.cacheCanvas=null;
					this._renderType &=~0x08;
					this.model && this.model.cacheAs(0);
				}
			}
			this.repaint();
		});

		/**z排序，更改此值，按照值的大小进行显示层级排序。*/
		__getset(0,__proto,'zOrder',function(){
			return this._zOrder;
			},function(value){
			if (this._zOrder !=value){
				this._zOrder=value;
				this._parent && Laya.timer.callLater(this._parent,this.updateZOrder);
			}
		});

		/**旋转角度，默认值为0。*/
		__getset(0,__proto,'rotation',function(){
			return this._style._tf.rotate;
			},function(value){
			var style=this.getStyle();
			if (style._tf.rotate!==value){
				style.setRotate(value);
				this._tfChanged=true;
				this.model && this.model.rotate(value);
				this._renderType |=0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**
		*表示显示对象的宽度，以像素为单位。
		*/
		__getset(0,__proto,'width',function(){
			if (!this.autoSize)return this._width;
			return this.getSelfBounds().width;
			},function(value){
			this._width!==value && (this._width=value,this.model && this.model.size(value,this._height),this.repaint());
		});

		/**表示显示对象相对于父容器的水平方向坐标值。*/
		__getset(0,__proto,'x',function(){
			return this._x;
			},function(value){
			if (this.destroyed)return;
			var p=this._parent;
			this._x!==value && (this._x=value,this.model && this.model.pos(value,this._y),p && p._repaint===0 && (p._repaint=1,p.parentRepaint()),this._$P.maskParent && this._$P.maskParent._repaint===0 && (this._$P.maskParent._repaint=1,this._$P.maskParent.parentRepaint()));
		});

		/**
		*获得全局Y轴缩放值
		*/
		__getset(0,__proto,'globalScaleY',function(){
			var scale=1;
			var ele=this;
			while (ele){
				if (ele===Laya.stage)break ;
				scale *=ele.scaleX;
				ele=ele.parent;
			}
			return scale;
		});

		/**手动设置的可点击区域，或者一个HitArea区域。*/
		__getset(0,__proto,'hitArea',function(){
			return this._$P.hitArea;
			},function(value){
			this._set$P("hitArea",value);
		});

		/**设置cacheAs为非空时此值才有效，staticCache=true时，子对象变化时不会自动更新缓存，只能通过调用reCache方法手动刷新。*/
		__getset(0,__proto,'staticCache',function(){
			return this._$P.staticCache;
			},function(value){
			this._set$P("staticCache",value);
			if (!value && this._$P.cacheCanvas){
				this._$P.cacheCanvas.reCache=true;
			}
		});

		/**表示显示对象相对于父容器的垂直方向坐标值。*/
		__getset(0,__proto,'y',function(){
			return this._y;
			},function(value){
			if (this.destroyed)return;
			var p=this._parent;
			this._y!==value && (this._y=value,this.model && this.model.pos(this._x,value),p && p._repaint===0 && (p._repaint=1,p.parentRepaint()),this._$P.maskParent && this._$P.maskParent._repaint===0 && (this._$P.maskParent._repaint=1,this._$P.maskParent.parentRepaint()));
		});

		/**
		*表示显示对象的高度，以像素为单位。
		*/
		__getset(0,__proto,'height',function(){
			if (!this.autoSize)return this._height;
			return this.getSelfBounds().height;
			},function(value){
			this._height!==value && (this._height=value,this.model && this.model.size(this._width,value),this.repaint());
		});

		/**指定要使用的混合模式。*/
		__getset(0,__proto,'blendMode',function(){
			return this._style.blendMode;
			},function(value){
			this.getStyle().blendMode=value;
			this.model && this.model.blendMode(value);
			if (value && value !="source-over")this._renderType |=0x20;
			else this._renderType &=~0x20;
			this.parentRepaint();
		});

		/**X轴缩放值，默认值为1。*/
		__getset(0,__proto,'scaleX',function(){
			return this._style._tf.scaleX;
			},function(value){
			var style=this.getStyle();
			if (style._tf.scaleX!==value){
				style.setScaleX(value);
				this._tfChanged=true;
				this.model && this.model.scale(value,style._tf.scaleY);
				this._renderType |=0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**Y轴缩放值，默认值为1。*/
		__getset(0,__proto,'scaleY',function(){
			return this._style._tf.scaleY;
			},function(value){
			var style=this.getStyle();
			if (style._tf.scaleY!==value){
				style.setScaleY(value);
				this._tfChanged=true;
				this.model && this.model.scale(style._tf.scaleX,value);
				this._renderType |=0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**对舞台 <code>stage</code> 的引用。*/
		__getset(0,__proto,'stage',function(){
			return Laya.stage;
		});

		/**水平倾斜角度，默认值为0。*/
		__getset(0,__proto,'skewX',function(){
			return this._style._tf.skewX;
			},function(value){
			var style=this.getStyle();
			if (style._tf.skewX!==value){
				style.setSkewX(value);
				this._tfChanged=true;
				this._renderType |=0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**显示对象的滚动矩形范围。*/
		__getset(0,__proto,'scrollRect',function(){
			return this._style.scrollRect;
			},function(value){
			this.getStyle().scrollRect=value;
			this.repaint();
			if (value){
				this._renderType |=0x40;
				this.model && this.model.scrollRect(value.x,value.y,value.width,value.height);
				}else {
				this._renderType &=~0x40;
				this.model && this.model.removeType(0x40);
			}
		});

		/**垂直倾斜角度，默认值为0。*/
		__getset(0,__proto,'skewY',function(){
			return this._style._tf.skewY;
			},function(value){
			var style=this.getStyle();
			if (style._tf.skewY!==value){
				style.setSkewY(value);
				this._tfChanged=true;
				this.model && this.model.skew(style._tf.skewX,value);
				this._renderType |=0x04;
				var p=this._parent;
				p && p._repaint===0 && (p._repaint=1,p.parentRepaint());
			}
		});

		/**
		*对象的矩阵信息。
		*/
		__getset(0,__proto,'transform',function(){
			return this._tfChanged ? this._adjustTransform():this._transform;
			},function(value){
			this._tfChanged=false;
			this._transform=value;
			if (value){
				this._x=value.tx;
				this._y=value.ty;
				value.tx=value.ty=0;
				this.model && this.model.transform(value.a,value.b,value.c,value.d,this._x,this._y);
			}
			if (value)this._renderType |=0x04;
			else {
				this._renderType &=~0x04;
				this.model && this.model.removeType(0x04);
			}
			this.parentRepaint();
		});

		/**X轴 轴心点的位置，单位为像素，默认为0，轴心点会影响对象位置，缩放，旋转。*/
		__getset(0,__proto,'pivotX',function(){
			return this._style._tf.translateX;
			},function(value){
			this.getStyle().setTranslateX(value);
			this.model && this.model.pivot(value,this._style._tf.translateY);
			this.repaint();
		});

		/**Y轴 轴心点的位置，单位为像素，默认为0，轴心点会影响对象位置，缩放，旋转。*/
		__getset(0,__proto,'pivotY',function(){
			return this._style._tf.translateY;
			},function(value){
			this.getStyle().setTranslateY(value);
			this.model && this.model.pivot(this._style._tf.translateX,value);
			this.repaint();
		});

		/**透明度，值为0-1，默认值为1，表示不透明。*/
		__getset(0,__proto,'alpha',function(){
			return this._style.alpha;
			},function(value){
			if (this._style && this._style.alpha!==value){
				value=value < 0 ? 0 :(value > 1 ? 1 :value);
				this.getStyle().alpha=value;
				this.model && this.model.alpha(value);
				if (value!==1)this._renderType |=0x02;
				else this._renderType &=~0x02;
				this.parentRepaint();
			}
		});

		/**表示是否可见，默认为true。*/
		__getset(0,__proto,'visible',function(){
			return this._style.visible;
			},function(value){
			if (this._style && this._style.visible!==value){
				this.getStyle().visible=value;
				this.model && this.model.visible(value);
				this.parentRepaint();
			}
		});

		/**绘图对象。*/
		__getset(0,__proto,'graphics',function(){
			return this._graphics || (this.graphics=RunDriver.createGraphics());
			},function(value){
			if (this._graphics)this._graphics._sp=null;
			this._graphics=value;
			if (value){
				this._renderType &=~0x01;
				this._renderType |=0x100;
				value._sp=this;
				this.model && this.model.graphics(this._graphics);
				}else {
				this._renderType &=~0x100;
				this._renderType &=~0x01;
				this.model && this.model.removeType(0x100);
			}
			this.repaint();
		});

		/**滤镜集合。*/
		__getset(0,__proto,'filters',function(){
			return this._$P.filters;
			},function(value){
			value && value.length===0 && (value=null);
			if (this._$P.filters==value)return;
			this._set$P("filters",value ? value.slice():null);
			if (Render.isConchApp){
				this.model && this.model.removeType(0x10);
				if (this._$P.filters && this._$P.filters.length==1){
					this._$P.filters[0].callNative(this);
				}
			}
			if (Render.isWebGL){
				if (value && value.length){
					this._renderType |=0x10;
					}else {
					this._renderType &=~0x10;
				}
			}
			if (value && value.length > 0){
				if (!(Render.isWebGL && value.length==1 && (((value[0])instanceof laya.filters.ColorFilter )))){
					if (this.cacheAs !="bitmap"){
						if (!Render.isConchNode)this.cacheAs="bitmap";
						this._set$P("cacheForFilters",true);
					}
					this._set$P("hasFilter",true);
				}
				}else {
				this._set$P("hasFilter",false);
				if (this._$P["cacheForFilters"] && this.cacheAs=="bitmap"){
					this.cacheAs="none";
				}
			}
			this.repaint();
		});

		/**遮罩，可以设置一个对象或者图片，根据对象形状进行遮罩显示。*/
		__getset(0,__proto,'mask',function(){
			return this._$P._mask;
			},function(value){
			if (value && this.mask && this.mask._$P.maskParent)return;
			if (value){
				this.cacheAs="bitmap";
				this._set$P("_mask",value);
				value._set$P("maskParent",this);
				}else {
				this.cacheAs="none";
				this.mask && this.mask._set$P("maskParent",null);
				this._set$P("_mask",value);
			}
			this.model && this.model.mask(value ? value.model :null);
			this._renderType |=0x20;
			this.parentRepaint();
		});

		/**
		*是否接受鼠标事件。
		*默认为false，如果监听鼠标事件，则会自动设置本对象及父节点的属性 mouseEnable 的值都为 true（如果父节点手动设置为false，则不会更改）。
		**/
		__getset(0,__proto,'mouseEnabled',function(){
			return this._mouseEnableState > 1;
			},function(value){
			this._mouseEnableState=value ? 2 :1;
		});

		/**
		*获得全局X轴缩放值
		*/
		__getset(0,__proto,'globalScaleX',function(){
			var scale=1;
			var ele=this;
			while (ele){
				if (ele===Laya.stage)break ;
				scale *=ele.scaleX;
				ele=ele.parent;
			}
			return scale;
		});

		/**
		*表示鼠标在此对象上的 X 轴坐标信息。
		*/
		__getset(0,__proto,'mouseX',function(){
			return this.getMousePoint().x;
		});

		/**
		*表示鼠标在此对象上的 Y 轴坐标信息。
		*/
		__getset(0,__proto,'mouseY',function(){
			return this.getMousePoint().y;
		});

		Sprite.fromImage=function(url){
			return new Sprite().loadImage(url);
		}

		Sprite.CustomList=[];
		return Sprite;
	})(Node)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.Shader extends laya.resource.Resource
	var Shader=(function(_super){
		function Shader(vs,ps,saveName,nameMap){
			this.customCompile=false;
			//this._nameMap=null;
			//this._vs=null;
			//this._ps=null;
			this._curActTexIndex=0;
			//this._reCompile=false;
			this.tag={};
			//this._vshader=null;
			//this._pshader=null;
			this._program=null;
			this._params=null;
			this._paramsMap={};
			this._offset=0;
			//this._id=0;
			Shader.__super.call(this);
			if ((!vs)|| (!ps))throw "Shader Error";
			if (Render.isConchApp || Render.isFlash){
				this.customCompile=true;
			}
			this._id=++Shader._count;
			this._vs=vs;
			this._ps=ps;
			this._nameMap=nameMap ? nameMap :{};
			saveName !=null && (Shader.sharders[saveName]=this);
		}

		__class(Shader,'laya.webgl.shader.Shader',_super);
		var __proto=Shader.prototype;
		__proto.recreateResource=function(){
			this.startCreate();
			this._compile();
			this.compoleteCreate();
			this.memorySize=0;
		}

		//忽略尺寸尺寸
		__proto.detoryResource=function(){
			WebGL.mainContext.deleteShader(this._vshader);
			WebGL.mainContext.deleteShader(this._pshader);
			WebGL.mainContext.deleteProgram(this._program);
			this._vshader=this._pshader=this._program=null;
			this._params=null;
			this._paramsMap={};
			this.memorySize=0;
			this._curActTexIndex=0;
		}

		__proto._compile=function(){
			if (!this._vs || !this._ps || this._params)
				return;
			this._reCompile=true;
			this._params=[];
			var text=[this._vs,this._ps];
			var result;
			if (this.customCompile)
				result=this._preGetParams(this._vs,this._ps);
			var gl=WebGL.mainContext;
			this._program=gl.createProgram();
			this._vshader=Shader._createShader(gl,text[0],0x8B31);
			this._pshader=Shader._createShader(gl,text[1],0x8B30);
			gl.attachShader(this._program,this._vshader);
			gl.attachShader(this._program,this._pshader);
			gl.linkProgram(this._program);
			if (!this.customCompile && !gl.getProgramParameter(this._program,0x8B82)){
				throw gl.getProgramInfoLog(this._program);
			};
			var one,i=0,j=0,n=0,location;
			var attribNum=this.customCompile?result.attributes.length:gl.getProgramParameter(this._program,0x8B89);
			for (i=0;i < attribNum;i++){
				var attrib=this.customCompile?result.attributes[i]:gl.getActiveAttrib(this._program,i);
				location=gl.getAttribLocation(this._program,attrib.name);
				one={vartype:"attribute",ivartype:0,attrib:attrib,location:location,name:attrib.name,type:attrib.type,isArray:false,isSame:false,preValue:null,indexOfParams:0};
				this._params.push(one);
			};
			var nUniformNum=this.customCompile?result.uniforms.length:gl.getProgramParameter(this._program,0x8B86);
			for (i=0;i < nUniformNum;i++){
				var uniform=this.customCompile?result.uniforms[i]:gl.getActiveUniform(this._program,i);
				location=gl.getUniformLocation(this._program,uniform.name);
				one={vartype:"uniform",ivartype:1,attrib:attrib,location:location,name:uniform.name,type:uniform.type,isArray:false,isSame:false,preValue:null,indexOfParams:0};
				if (one.name.indexOf('[0]')> 0){
					one.name=one.name.substr(0,one.name.length-3);
					one.isArray=true;
					one.location=gl.getUniformLocation(this._program,one.name);
				}
				this._params.push(one);
			}
			for (i=0,n=this._params.length;i < n;i++){
				one=this._params[i];
				one.indexOfParams=i;
				one.index=1;
				one.value=[one.location,null];
				one.codename=one.name;
				one.name=this._nameMap[one.codename] ? this._nameMap[one.codename] :one.codename;
				this._paramsMap[one.name]=one;
				one._this=this;
				one.saveValue=[];
				if (one.vartype==="attribute"){
					one.fun=this._attribute;
					continue ;
				}
				switch (one.type){
					case 0x1406:
						one.fun=one.isArray ? this._uniform1fv :this._uniform1f;
						break ;
					case 0x8B50:
						one.fun=this._uniform_vec2;
						break ;
					case 0x8B51:
						one.fun=this._uniform_vec3;
						break ;
					case 0x8B52:
						one.fun=this._uniform_vec4;
						break ;
					case 0x8B5E:
						one.fun=this._uniform_sampler2D;
						break ;
					case 0x8B60:
						one.fun=this._uniform_samplerCube;
						break ;
					case 0x8B5C:
						one.fun=this._uniformMatrix4fv;
						break ;
					case 0x8B56:
						one.fun=this._uniform1i;
						break ;
					case 0x8B5A:
					case 0x8B5B:
						throw new Error("compile shader err!");
						break ;
					default :
						throw new Error("compile shader err!");
						break ;
					}
			}
		}

		/**
		*根据变量名字获得
		*@param name
		*@return
		*/
		__proto.getUniform=function(name){
			return this._paramsMap[name];
		}

		__proto._attribute=function(one,value){
			var gl=WebGL.mainContext;
			gl.enableVertexAttribArray(one.location);
			gl.vertexAttribPointer(one.location,value[0],value[1],value[2],value[3],value[4]+this._offset);
			return 2;
		}

		__proto._uniformMatrix4fv=function(one,value){
			WebGL.mainContext.uniformMatrix4fv(one.location,false,value);
			return 1;
		}

		__proto._uniform1i=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value){
				WebGL.mainContext.uniform1i(one.location,saveValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform1f=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value){
				WebGL.mainContext.uniform1f(one.location,saveValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform1fv=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value){
				WebGL.mainContext.uniform1fv(one.location,saveValue[0]=value);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec2=function(one,value){
			var saveValue=one.saveValue;
			if (saveValue[0]!==value[0] || saveValue[1]!==value[1]){
				WebGL.mainContext.uniform2f(one.location,saveValue[0]=value[0],saveValue[1]=value[1]);
				return 1;
			}
			return 0;
		}

		__proto._uniform_vec3=function(one,value){
			WebGL.mainContext.uniform3f(one.location,value[0],value[1],value[2]);
			return 1;
		}

		__proto._uniform_vec4=function(one,value){
			WebGL.mainContext.uniform4f(one.location,value[0],value[1],value[2],value[3]);
			return 1;
		}

		__proto._uniform_sampler2D=function(one,value){
			var gl=WebGL.mainContext;
			var saveValue=one.saveValue;
			if (saveValue[0]==null){
				saveValue[0]=this._curActTexIndex;
				gl.uniform1i(one.location,this._curActTexIndex);
				gl.activeTexture(Shader._TEXTURES[this._curActTexIndex]);
				WebGLContext.bindTexture(gl,0x0DE1,value);
				this._curActTexIndex++;
				return 1;
			}
			else{
				gl.activeTexture(Shader._TEXTURES[saveValue[0]]);
				WebGLContext.bindTexture(gl,0x0DE1,value);
				return 0;
			}
		}

		__proto._uniform_samplerCube=function(one,value){
			var gl=WebGL.mainContext;
			var saveValue=one.saveValue;
			if (saveValue[0]==null){
				saveValue[0]=this._curActTexIndex;
				gl.uniform1i(one.location,this._curActTexIndex);
				gl.activeTexture(Shader._TEXTURES[this._curActTexIndex]);
				WebGLContext.bindTexture(gl,0x8513,value);
				this._curActTexIndex++;
				return 1;
			}
			else{
				gl.activeTexture(Shader._TEXTURES[saveValue[0]]);
				WebGLContext.bindTexture(gl,0x8513,value);
				return 0;
			}
		}

		__proto._noSetValue=function(one){
			console.log("no....:"+one.name);
		}

		//throw new Error("upload shader err,must set value:"+one.name);
		__proto.uploadOne=function(name,value){
			this.activeResource();
			WebGLContext.UseProgram(this._program);
			var one=this._paramsMap[name];
			one.fun.call(this,one,value);
		}

		__proto.uploadTexture2D=function(value){
			Stat.shaderCall++;
			var gl=WebGL.mainContext;
			gl.activeTexture(0x84C0);
			WebGLContext.bindTexture(gl,0x0DE1,value);
		}

		/**
		*提交shader到GPU
		*@param shaderValue
		*/
		__proto.upload=function(shaderValue,params){
			Shader.activeShader=this;
			this.activeResource();
			WebGLContext.UseProgram(this._program);
			if (this._reCompile){
				params=this._params;
				this._reCompile=false;
				}else {
				params=params || this._params;
			};
			var one,value,n=params.length,shaderCall=0;
			for (var i=0;i < n;i++){
				one=params[i];
				((value=shaderValue[one.name])!==null)&& (shaderCall+=one.fun.call(this,one,value));
			}
			Stat.shaderCall+=shaderCall;
		}

		/**
		*按数组的定义提交
		*@param shaderValue 数组格式[name,[value,id],...]
		*/
		__proto.uploadArray=function(shaderValue,length,_bufferUsage){
			Shader.activeShader=this;
			this.activeResource();
			var sameProgram=!WebGLContext.UseProgram(this._program);
			var params=this._params,value;
			var one,shaderCall=0,uploadArrayCount=Shader._uploadArrayCount++;
			for (var i=length-2;i >=0;i-=2){
				one=this._paramsMap[shaderValue[i]];
				if (!one || one._uploadArrayCount===uploadArrayCount)
					continue ;
				one._uploadArrayCount=uploadArrayCount;
				var v=shaderValue[i+1];
				var uid=v[1];
				if (sameProgram && one.ivartype===1 && uid > 0 && uid===one.__uploadid)
					continue ;
				value=v[0];
				if (value !=null){
					_bufferUsage && _bufferUsage[one.name] && _bufferUsage[one.name].bind();
					shaderCall+=one.fun.call(this,one,value);
					one.__uploadid=uid;
				}
			}
			Stat.shaderCall+=shaderCall;
		}

		/**
		*得到编译后的变量及相关预定义
		*@return
		*/
		__proto.getParams=function(){
			return this._params;
		}

		__proto._preGetParams=function(vs,ps){
			var text=[vs,ps];
			var result={};
			var attributes=[];
			var uniforms=[];
			var definesInfo={};
			var definesName=[];
			result.attributes=attributes;
			result.uniforms=uniforms;
			result.defines=definesInfo;
			var removeAnnotation=new RegExp("(/\\*([^*]|[\\r\\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/)|(//.*)","g");
			var reg=new RegExp("(\".*\")|('.*')|([#\\w\\*-\\.+/()=<>{}\\\\]+)|([,;:\\\\])","g");
			var i=0,n=0,one;
			for (var s=0;s < 2;s++){
				text[s]=text[s].replace(removeAnnotation,"");
				var words=text[s].match(reg);
				var tempelse;
				for (i=0,n=words.length;i < n;i++){
					var word=words[i];
					if (word !="attribute" && word !="uniform"){
						if (word=="#define"){
							word=words[++i];
							definesName[word]=1;
							continue ;
						}
						else if (word=="#ifdef"){
							tempelse=words[++i];
							var def=definesInfo[tempelse]=definesInfo[tempelse]||[];
							for (i++;i < n;i++){
								word=words[i];
								if (word !="attribute" && word !="uniform"){
									if (word=="#else"){
										for (i++;i < n;i++){
											word=words[i];
											if (word !="attribute" && word !="uniform"){
												if (word=="#endif"){
													break ;
												}
												continue ;
											}
											i=this.parseOne(attributes,uniforms,words,i,word,!definesName[tempelse]);
										}
									}
									continue ;
								}
								i=this.parseOne(attributes,uniforms,words,i,word,definesName[tempelse]);
							}
						}
						continue ;
					}
					i=this.parseOne(attributes,uniforms,words,i,word,true);
				}
			}
			return result;
		}

		__proto.parseOne=function(attributes,uniforms,words,i,word,b){
			var one={type:Shader.shaderParamsMap[words[i+1]],name:words[i+2],size:isNaN(parseInt(words[i+3]))? 1 :parseInt(words[i+3])};
			if (b){
				if (word=="attribute"){
					attributes.push(one);
					}else {
					uniforms.push(one);
				}
			}
			if (words[i+3]==':'){
				one.type=words[i+4];
				i+=2;
			}
			i+=2;
			return i;
		}

		__proto.dispose=function(){
			this.resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		Shader.getShader=function(name){
			return Shader.sharders[name];
		}

		Shader.create=function(vs,ps,saveName,nameMap){
			return new Shader(vs,ps,saveName,nameMap);
		}

		Shader.withCompile=function(nameID,mainID,define,shaderName,createShader){
			if (shaderName && Shader.sharders[shaderName])
				return Shader.sharders[shaderName];
			var pre=Shader._preCompileShader[0.0002 *nameID+mainID];
			if (!pre)
				throw new Error("withCompile shader err!"+nameID+" "+mainID);
			return pre.createShader(define,shaderName,createShader);
		}

		Shader.addInclude=function(fileName,txt){
			if (!txt || txt.length===0)
				throw new Error("add shader include file err:"+fileName);
			if (Shader._includeFiles[fileName])
				throw new Error("add shader include file err, has add:"+fileName);
			Shader._includeFiles[fileName]=txt;
		}

		Shader.preCompile=function(nameID,mainID,vs,ps,nameMap){
			var id=0.0002 *nameID+mainID;
			Shader._preCompileShader[id]=new ShaderCompile(id,vs,ps,nameMap,Shader._includeFiles);
		}

		Shader._createShader=function(gl,str,type){
			var shader=gl.createShader(type);
			gl.shaderSource(shader,str);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader,0x8B81)){
				throw gl.getShaderInfoLog(shader);
			}
			return shader;
		}

		Shader._TEXTURES=[0x84C0,0x84C1,0x84C2,0x84C3,0x84C4,0x84C5,0x84C6,,0x84C7,0x84C8];
		Shader._includeFiles={};
		Shader._count=0;
		Shader._preCompileShader={};
		Shader._uploadArrayCount=1;
		Shader.SHADERNAME2ID=0.0002;
		Shader.activeShader=null
		Shader.sharders=(Shader.sharders=[],Shader.sharders.length=0x20,Shader.sharders);
		__static(Shader,
		['shaderParamsMap',function(){return this.shaderParamsMap={"float":0x1406,"int":0x1404,"bool":0x8B56,"vec2":0x8B50,"vec3":0x8B51,"vec4":0x8B52,"ivec2":0x8B53,"ivec3":0x8B54,"ivec4":0x8B55,"bvec2":0x8B57,"bvec3":0x8B58,"bvec4":0x8B59,"mat2":0x8B5A,"mat3":0x8B5B,"mat4":0x8B5C,"sampler2D":0x8B5E,"samplerCube":0x8B60};},'nameKey',function(){return this.nameKey=new StringKey();}
		]);
		return Shader;
	})(Resource)


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.utils.Buffer extends laya.resource.Resource
	var Buffer=(function(_super){
		function Buffer(){
			this._glBuffer=null;
			this._buffer=null;
			this._bufferType=0;
			this._bufferUsage=0;
			this._byteLength=0;
			Buffer.__super.call(this);
			Buffer._gl=WebGL.mainContext;
		}

		__class(Buffer,'laya.webgl.utils.Buffer',_super);
		var __proto=Buffer.prototype;
		__proto._bind=function(){
			this.activeResource();
			(Buffer._bindActive[this._bufferType]===this._glBuffer)|| (Buffer._gl.bindBuffer(this._bufferType,Buffer._bindActive[this._bufferType]=this._glBuffer),Shader.activeShader=null);
		}

		__proto.recreateResource=function(){
			this.startCreate();
			this._glBuffer || (this._glBuffer=Buffer._gl.createBuffer());
			this.compoleteCreate();
		}

		__proto.detoryResource=function(){
			if (this._glBuffer){
				WebGL.mainContext.deleteBuffer(this._glBuffer);
				this._glBuffer=null;
			}
			this.memorySize=0;
		}

		__proto.dispose=function(){
			this.resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		//TODO:私有
		__getset(0,__proto,'byteLength',function(){
			return this._byteLength;
		});

		__getset(0,__proto,'bufferType',function(){
			return this._bufferType;
		});

		__getset(0,__proto,'bufferUsage',function(){
			return this._bufferUsage;
		});

		Buffer._gl=null
		Buffer._bindActive={};
		return Buffer;
	})(Resource)


	/**
	*@private
	*<code>Bitmap</code> 是图片资源类。
	*/
	//class laya.resource.Bitmap extends laya.resource.Resource
	var Bitmap=(function(_super){
		function Bitmap(){
			//this._source=null;
			//this._w=NaN;
			//this._h=NaN;
			this.useNum=0;
			Bitmap.__super.call(this);
			this._w=0;
			this._h=0;
		}

		__class(Bitmap,'laya.resource.Bitmap',_super);
		var __proto=Bitmap.prototype;
		/**
		*彻底清理资源。
		*/
		__proto.dispose=function(){
			this._resourceManager.removeResource(this);
			_super.prototype.dispose.call(this);
		}

		/***
		*宽度。
		*/
		__getset(0,__proto,'width',function(){
			return this._w;
		});

		/***
		*高度。
		*/
		__getset(0,__proto,'height',function(){
			return this._h;
		});

		/***
		*HTML Image 或 HTML Canvas 或 WebGL Texture 。
		*/
		__getset(0,__proto,'source',function(){
			return this._source;
		});

		return Bitmap;
	})(Resource)


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.shader.d2.fillTexture.FillTextureShaderValue extends laya.webgl.shader.d2.value.Value2D
	var FillTextureShaderValue=(function(_super){
		function FillTextureShaderValue(){
			this.texcoord=null;
			this.u_texRange=[0,1,0,1];
			this.u_offset=[0.5,0.5];
			FillTextureShaderValue.__super.call(this,0,0);
			var _vlen=8 *CONST3D2D.BYTES_PE;
			this.position=[2,0x1406,false,_vlen,0];
			this.texcoord=[2,0x1406,false,_vlen,2 *CONST3D2D.BYTES_PE];
			this.color=[4,0x1406,false,_vlen,4 *CONST3D2D.BYTES_PE];
		}

		__class(FillTextureShaderValue,'laya.webgl.shader.d2.fillTexture.FillTextureShaderValue',_super);
		FillTextureShaderValue.instance=function(){
			return FillTextureShaderValue._fillTextureShaderValue=FillTextureShaderValue._fillTextureShaderValue|| new FillTextureShaderValue();
		}

		FillTextureShaderValue._fillTextureShaderValue=null
		return FillTextureShaderValue;
	})(Value2D)


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.shader.d2.skinAnishader.aniShaderValue extends laya.webgl.shader.d2.value.Value2D
	var aniShaderValue1=(function(_super){
		function aniShaderValue(){
			this.texcoord=null;
			aniShaderValue.__super.call(this,0,0);
			var _vlen=8 *CONST3D2D.BYTES_PE;
			this.position=[2,0x1406,false,_vlen,0];
			this.texcoord=[2,0x1406,false,_vlen,2 *CONST3D2D.BYTES_PE];
			this.color=[4,0x1406,false,_vlen,4 *CONST3D2D.BYTES_PE];
		}

		__class(aniShaderValue,'laya.webgl.shader.d2.skinAnishader.aniShaderValue',_super,'aniShaderValue1');
		aniShaderValue.instance=function(){
			return aniShaderValue._aniShaderValue=aniShaderValue._aniShaderValue|| new aniShaderValue();
		}

		aniShaderValue._aniShaderValue=null
		return aniShaderValue;
	})(Value2D)


	//class laya.webgl.shader.d2.value.Color2dSV extends laya.webgl.shader.d2.value.Value2D
	var Color2dSV=(function(_super){
		function Color2dSV(args){
			Color2dSV.__super.call(this,0x02,0);
			this.color=[];
		}

		__class(Color2dSV,'laya.webgl.shader.d2.value.Color2dSV',_super);
		var __proto=Color2dSV.prototype;
		__proto.setValue=function(value){
			value.fillStyle&&(this.color=value.fillStyle._color._color);
			value.strokeStyle&&(this.color=value.strokeStyle._color._color);
		}

		return Color2dSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.TextureSV extends laya.webgl.shader.d2.value.Value2D
	var TextureSV=(function(_super){
		function TextureSV(subID){
			this.u_colorMatrix=null;
			this.strength=0;
			this.colorMat=null;
			this.colorAlpha=null;
			this.texcoord=Value2D._TEXCOORD;
			(subID===void 0)&& (subID=0);
			TextureSV.__super.call(this,0x01,subID);
		}

		__class(TextureSV,'laya.webgl.shader.d2.value.TextureSV',_super);
		var __proto=TextureSV.prototype;
		__proto.setValue=function(vo){
			this.ALPHA=vo.ALPHA;
			vo.filters && this.setFilters(vo.filters);
		}

		__proto.clear=function(){
			this.texture=null;
			this.shader=null;
			this.defines.setValue(0);
		}

		return TextureSV;
	})(Value2D)


	//class laya.webgl.shader.d2.value.PrimitiveSV extends laya.webgl.shader.d2.value.Value2D
	var PrimitiveSV=(function(_super){
		function PrimitiveSV(args){
			this.a_color=null;
			PrimitiveSV.__super.call(this,0x04,0);
			this.position=[2,0x1406,false,5 *CONST3D2D.BYTES_PE,0];
			this.a_color=[3,0x1406,false,5 *CONST3D2D.BYTES_PE,2 *CONST3D2D.BYTES_PE];
		}

		__class(PrimitiveSV,'laya.webgl.shader.d2.value.PrimitiveSV',_super);
		return PrimitiveSV;
	})(Value2D)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.resource.RenderTarget2D extends laya.resource.Texture
	var RenderTarget2D=(function(_super){
		function RenderTarget2D(width,height,surfaceFormat,surfaceType,depthStencilFormat,mipMap,repeat,minFifter,magFifter){
			this._type=0;
			this._svWidth=NaN;
			this._svHeight=NaN;
			this._preRenderTarget=null;
			this._alreadyResolved=false;
			this._looked=false;
			this._surfaceFormat=0;
			this._surfaceType=0;
			this._depthStencilFormat=0;
			this._mipMap=false;
			this._repeat=false;
			this._minFifter=0;
			this._magFifter=0;
			this._destroy=false;
			(surfaceFormat===void 0)&& (surfaceFormat=0x1908);
			(surfaceType===void 0)&& (surfaceType=0x1401);
			(depthStencilFormat===void 0)&& (depthStencilFormat=0x81A5);
			(mipMap===void 0)&& (mipMap=false);
			(repeat===void 0)&& (repeat=false);
			(minFifter===void 0)&& (minFifter=-1);
			(magFifter===void 0)&& (magFifter=-1);
			this._type=1;
			this._w=width;
			this._h=height;
			this._surfaceFormat=surfaceFormat;
			this._surfaceType=surfaceType;
			this._depthStencilFormat=depthStencilFormat;
			this._mipMap=mipMap;
			this._repeat=repeat;
			this._minFifter=minFifter;
			this._magFifter=magFifter;
			this._createWebGLRenderTarget();
			this.bitmap.lock=true;
			RenderTarget2D.__super.call(this,this.bitmap,Texture.INV_UV);
		}

		__class(RenderTarget2D,'laya.webgl.resource.RenderTarget2D',_super);
		var __proto=RenderTarget2D.prototype;
		Laya.imps(__proto,{"laya.resource.IDispose":true})
		//TODO:临时......................................................
		__proto.getType=function(){
			return this._type;
		}

		//*/
		__proto.getTexture=function(){
			return this;
		}

		__proto.size=function(w,h){
			if (this.bitmap && this._w==w && this._h==h)
				return;
			this._w=w;
			this._h=h;
			this.release();
			this._createWebGLRenderTarget();
		}

		__proto.release=function(){
			this.destroy();
		}

		__proto.recycle=function(){
			RenderTarget2D.POOL.push(this);
		}

		__proto.start=function(){
			var gl=WebGL.mainContext;
			this._preRenderTarget=RenderState2D.curRenderTarget;
			RenderState2D.curRenderTarget=this;
			gl.bindFramebuffer(0x8D40,this.bitmap.frameBuffer);
			this._alreadyResolved=false;
			if (this._type==1){
				gl.viewport(0,0,this._w,this._h);
				this._svWidth=RenderState2D.width;
				this._svHeight=RenderState2D.height;
				RenderState2D.width=this._w;
				RenderState2D.height=this._h;
				Shader.activeShader=null;
			}
			return this;
		}

		__proto.clear=function(r,g,b,a){
			(r===void 0)&& (r=0.0);
			(g===void 0)&& (g=0.0);
			(b===void 0)&& (b=0.0);
			(a===void 0)&& (a=1.0);
			var gl=WebGL.mainContext;
			gl.clearColor(r,g,b,a);
			var clearFlag=0x00004000;
			switch (this._depthStencilFormat){
				case 0x81A5:
					clearFlag |=0x00000100;
					break ;
				case 0x8D48:
					clearFlag |=0x00000400;
					break ;
				case 0x84F9:
					clearFlag |=0x00000100;
					clearFlag |=0x00000400
					break ;
				}
			gl.clear(clearFlag);
		}

		__proto.end=function(){
			var gl=WebGL.mainContext;
			gl.bindFramebuffer(0x8D40,this._preRenderTarget ? this._preRenderTarget.bitmap.frameBuffer :null);
			this._alreadyResolved=true;
			RenderState2D.curRenderTarget=this._preRenderTarget;
			if (this._type==1){
				gl.viewport(0,0,this._svWidth,this._svHeight);
				RenderState2D.width=this._svWidth;
				RenderState2D.height=this._svHeight;
				Shader.activeShader=null;
			}else gl.viewport(0,0,Laya.stage.width,Laya.stage.height);
		}

		__proto.getData=function(x,y,width,height){
			var gl=WebGL.mainContext;
			gl.bindFramebuffer(0x8D40,(this.bitmap).frameBuffer);
			var canRead=(gl.checkFramebufferStatus(0x8D40)===0x8CD5);
			if (!canRead){
				gl.bindFramebuffer(0x8D40,null);
				return null;
			};
			var pixels=new Uint8Array(this._w *this._h *4);
			gl.readPixels(x,y,width,height,this._surfaceFormat,this._surfaceType,pixels);
			gl.bindFramebuffer(0x8D40,null);
			return pixels;
		}

		/**彻底清理资源,注意会强制解锁清理*/
		__proto.destroy=function(foreDiposeTexture){
			(foreDiposeTexture===void 0)&& (foreDiposeTexture=false);
			if (!this._destroy){
				this._loaded=false;
				this.bitmap.dispose();
				this.bitmap=null;
				this._destroy=true;
				_super.prototype.destroy.call(this);
			}
		}

		//待测试
		__proto.dispose=function(){}
		__proto._createWebGLRenderTarget=function(){
			this.bitmap=new WebGLRenderTarget(this.width,this.height,this._surfaceFormat,this._surfaceType,this._depthStencilFormat,this._mipMap,this._repeat,this._minFifter,this._magFifter);
			this.bitmap.activeResource();
			this._alreadyResolved=true;
			this._destroy=false;
			this._loaded=true;
		}

		__getset(0,__proto,'surfaceFormat',function(){
			return this._surfaceFormat;
		});

		__getset(0,__proto,'magFifter',function(){
			return this._magFifter;
		});

		__getset(0,__proto,'surfaceType',function(){
			return this._surfaceType;
		});

		__getset(0,__proto,'mipMap',function(){
			return this._mipMap;
		});

		__getset(0,__proto,'depthStencilFormat',function(){
			return this._depthStencilFormat;
		});

		//}
		__getset(0,__proto,'minFifter',function(){
			return this._minFifter;
		});

		/**返回RenderTarget的Texture*/
		__getset(0,__proto,'source',function(){
			if (this._alreadyResolved)
				return _super.prototype._$get_source.call(this);
			throw new Error("RenderTarget  还未准备好！");
		});

		RenderTarget2D.create=function(w,h,surfaceFormat,surfaceType,depthStencilFormat,mipMap,repeat,minFifter,magFifter){
			(surfaceFormat===void 0)&& (surfaceFormat=0x1908);
			(surfaceType===void 0)&& (surfaceType=0x1401);
			(depthStencilFormat===void 0)&& (depthStencilFormat=0x81A5);
			(mipMap===void 0)&& (mipMap=false);
			(repeat===void 0)&& (repeat=false);
			(minFifter===void 0)&& (minFifter=-1);
			(magFifter===void 0)&& (magFifter=-1);
			var t=RenderTarget2D.POOL.pop();
			t || (t=new RenderTarget2D(w,h));
			if (!t.bitmap ||
				t._w !=w ||
			t._h !=h ||
			t._surfaceFormat !=surfaceFormat ||
			t._surfaceType !=surfaceType ||
			t._depthStencilFormat !=depthStencilFormat ||
			t._mipMap !=mipMap ||
			t._repeat !=repeat ||
			t._minFifter !=minFifter ||
			t._magFifter !=magFifter){
				t._w=w;
				t._h=h;
				t._surfaceFormat=surfaceFormat;
				t._surfaceType=surfaceType;
				t._depthStencilFormat=depthStencilFormat;
				t._mipMap=mipMap;
				t._repeat=repeat;
				t._minFifter=minFifter;
				t._magFifter=magFifter;
				t.release();
				t._createWebGLRenderTarget();
			}
			return t;
		}

		RenderTarget2D.TYPE2D=1;
		RenderTarget2D.TYPE3D=2;
		RenderTarget2D.POOL=[];
		return RenderTarget2D;
	})(Texture)


	/**
	*@private
	*audio标签播放声音的音轨控制
	*/
	//class laya.media.h5audio.AudioSoundChannel extends laya.media.SoundChannel
	var AudioSoundChannel=(function(_super){
		function AudioSoundChannel(audio){
			this._audio=null;
			this._onEnd=null;
			this._resumePlay=null;
			AudioSoundChannel.__super.call(this);
			this._onEnd=Utils.bind(this.__onEnd,this);
			this._resumePlay=Utils.bind(this.__resumePlay,this);
			audio.addEventListener("ended",this._onEnd);
			this._audio=audio;
		}

		__class(AudioSoundChannel,'laya.media.h5audio.AudioSoundChannel',_super);
		var __proto=AudioSoundChannel.prototype;
		__proto.__onEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
					this.completeHandler=null;
				}
				this.stop();
				this.event("complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto.__resumePlay=function(){
			try {
				this._audio.removeEventListener("canplay",this._resumePlay);
				this._audio.currentTime=this.startTime;
				Browser.container.appendChild(this._audio);
				this._audio.play();
				}catch (e){
				this.event("error");
			}
		}

		/**
		*播放
		*/
		__proto.play=function(){
			try {
				this._audio.currentTime=this.startTime;
				}catch (e){
				this._audio.addEventListener("canplay",this._resumePlay);
				return;
			}
			Browser.container.appendChild(this._audio);
			this._audio.play();
		}

		/**
		*停止播放
		*
		*/
		__proto.stop=function(){
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
			if (!this._audio)
				return;
			this._audio.pause();
			this._audio.removeEventListener("ended",this._onEnd);
			this._audio.removeEventListener("canplay",this._resumePlay);
			Pool.recover("audio:"+this.url,this._audio);
			Browser.removeElement(this._audio);
			this._audio=null;
		}

		/**
		*当前播放到的位置
		*@return
		*
		*/
		__getset(0,__proto,'position',function(){
			if (!this._audio)
				return 0;
			return this._audio.currentTime;
		});

		/**
		*设置音量
		*@param v
		*
		*/
		/**
		*获取音量
		*@return
		*
		*/
		__getset(0,__proto,'volume',function(){
			if (!this._audio)return 1;
			return this._audio.volume;
			},function(v){
			if (!this._audio)return;
			this._audio.volume=v;
		});

		return AudioSoundChannel;
	})(SoundChannel)


	/**
	*@private
	*web audio api方式播放声音的音轨控制
	*/
	//class laya.media.webaudio.WebAudioSoundChannel extends laya.media.SoundChannel
	var WebAudioSoundChannel=(function(_super){
		function WebAudioSoundChannel(){
			this.audioBuffer=null;
			this.gain=null;
			this.bufferSource=null;
			this._currentTime=0;
			this._volume=1;
			this._startTime=0;
			this._onPlayEnd=null;
			this.context=WebAudioSound.ctx;
			WebAudioSoundChannel.__super.call(this);
			this._onPlayEnd=Utils.bind(this.__onPlayEnd,this);
			if (this.context["createGain"]){
				this.gain=this.context["createGain"]();
				}else {
				this.gain=this.context["createGainNode"]();
			}
		}

		__class(WebAudioSoundChannel,'laya.media.webaudio.WebAudioSoundChannel',_super);
		var __proto=WebAudioSoundChannel.prototype;
		/**
		*播放声音
		*/
		__proto.play=function(){
			this._clearBufferSource();
			if (!this.audioBuffer)return;
			var context=this.context;
			var gain=this.gain;
			var bufferSource=context.createBufferSource();
			this.bufferSource=bufferSource;
			bufferSource.buffer=this.audioBuffer;
			bufferSource.connect(gain);
			if (gain)
				gain.disconnect();
			gain.connect(context.destination);
			bufferSource.onended=this._onPlayEnd;
			this._startTime=Browser.now();
			this.gain.gain.value=this._volume;
			if (this.loops==0){
				bufferSource.loop=true;
			}
			bufferSource.start(0,this.startTime);
			this._currentTime=0;
		}

		__proto.__onPlayEnd=function(){
			if (this.loops==1){
				if (this.completeHandler){
					Laya.timer.once(10,this,this.__runComplete,[this.completeHandler],false);
					this.completeHandler=null;
				}
				this.stop();
				this.event("complete");
				return;
			}
			if (this.loops > 0){
				this.loops--;
			}
			this.play();
		}

		__proto._clearBufferSource=function(){
			if (this.bufferSource){
				var sourceNode=this.bufferSource;
				if (sourceNode.stop){
					sourceNode.stop(0);
					}else {
					sourceNode.noteOff(0);
				}
				sourceNode.disconnect(0);
				sourceNode.onended=null;
				if (!WebAudioSoundChannel._tryCleanFailed)this._tryClearBuffer(sourceNode);
				this.bufferSource=null;
			}
		}

		__proto._tryClearBuffer=function(sourceNode){
			try {sourceNode.buffer=WebAudioSound._miniBuffer;}catch (e){WebAudioSoundChannel._tryCleanFailed=true;}
		}

		/**
		*停止播放
		*/
		__proto.stop=function(){
			this._clearBufferSource();
			this.audioBuffer=null;
			if (this.gain)
				this.gain.disconnect();
			this.isStopped=true;
			SoundManager.removeChannel(this);
			this.completeHandler=null;
		}

		/**
		*获取当前播放位置
		*/
		__getset(0,__proto,'position',function(){
			if (this.bufferSource){
				return (Browser.now()-this._startTime)/ 1000+this.startTime;
			}
			return 0;
		});

		/**
		*设置音量
		*/
		/**
		*获取音量
		*/
		__getset(0,__proto,'volume',function(){
			return this._volume;
			},function(v){
			if (this.isStopped){
				return;
			}
			this._volume=v;
			this.gain.gain.value=v;
		});

		WebAudioSoundChannel._tryCleanFailed=false;
		return WebAudioSoundChannel;
	})(SoundChannel)


	/**
	*...
	*@author anling
	*/
	//class entity.Entity extends laya.display.Sprite
	var Entity=(function(_super){
		function Entity(){
			this._tag=0;
			this._row=0;
			this._column=0;
			Entity.__super.call(this);
		}

		__class(Entity,'entity.Entity',_super);
		var __proto=Entity.prototype;
		__proto.site=function(row,column){
			this._row=row;
			this._column=column;
		}

		__getset(0,__proto,'tag',function(){
			return this._tag;
			},function(value){
			this._tag=value;
		});

		__getset(0,__proto,'row',function(){
			return this._row;
		});

		__getset(0,__proto,'column',function(){
			return this._column;
		});

		return Entity;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class layer.GameLayer extends laya.display.Sprite
	var GameLayer=(function(_super){
		function GameLayer(){
			this._itemArr=[];
			this._player=null;
			this._gameMgr=null;
			GameLayer.__super.call(this);
			this.initItemArea();
			this.initPlayer();
			this.introAnime();
		}

		__class(GameLayer,'layer.GameLayer',_super);
		var __proto=GameLayer.prototype;
		__proto.initItemArea=function(){
			var beginX=1136-640;
			for (var row=0;row < 8;row++){
				var arr=[];
				for (var column=0;column < 8;column++){
					var item=Pool.getItemByClass("item",Item);
					this.addChild(item);
					item.site(row,column);
					item.pos((column+0.5)*80,
					beginX+row *80-800);
					arr.push(item);
				}
				this._itemArr.push(arr);
			}
		}

		__proto.initPlayer=function(){
			this._player=new PacMan();
			this.addChild(this._player);
			var row=Math.floor(Math.random()*this._itemArr.length);
			var column=Math.floor(Math.random()*this._itemArr[0].length);
			var item=this._itemArr[row] [column];
			this._player.pos(item.x,item.y);
			this._player.site(row,column);
			this._itemArr[row][column]=this._player;
			item.removeSelf();
			Pool.recover("item",item);
		}

		__proto.introAnime=function(){
			for (var column=0;column < this._itemArr[0].length;column++){
				for (var row=0;row < this._itemArr[0].length;row++){
					var item=this._itemArr[row] [column];
					Tween.to(item,{y:item.y+800},500+50 *(this._itemArr.length-row+1));
				}
			}
			this.timerOnce(500+50 *(this._itemArr.length+1),this,this.startGame);
		}

		__proto.startGame=function(){
			this._gameMgr=GameManager.getInstance();
			this.addChild(this._gameMgr);
			this._gameMgr.init(this._itemArr,this._player);
			NotifyCenter.getInstance().on(NotifyCenter.KEYBORADCTRL,this,this.setKeyboardCtrl);
			Laya.stage.on("keyup",this,this.onKeyUp);
		}

		__proto.onKeyUp=function(e){
			switch(e.keyCode){
				case 38:
					this._player.turnTo(270);
					this._gameMgr.gameStep(-1,0);
					break ;
				case 40:
					this._player.turnTo(90);
					this._gameMgr.gameStep(1,0);
					break ;
				case 37:
					this._player.turnTo(180);
					this._gameMgr.gameStep(0,-1);
					break ;
				case 39:
					this._player.turnTo(0);
					this._gameMgr.gameStep(0,1);
					break ;
				case 32:
					this._gameMgr.spitAll();
					break ;
				}
		}

		__proto.setKeyboardCtrl=function(value){
			if (value){
				Laya.stage.on("keyup",this,this.onKeyUp);
				}else {
				Laya.stage.off("keyup",this,this.onKeyUp);
			}
		}

		return GameLayer;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class layer.HUDLayer extends laya.display.Sprite
	var HUDLayer=(function(_super){
		function HUDLayer(){
			this.stomach=null;
			HUDLayer.__super.call(this);
			this.stomach=new Sprite();
			this.addChild(this.stomach);
			this.stomach.loadImage("fruit/stomach.png");
			this.stomach.pos(0,300);
		}

		__class(HUDLayer,'layer.HUDLayer',_super);
		return HUDLayer;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class layer.StomachLayer extends laya.display.Sprite
	var StomachLayer=(function(_super){
		function StomachLayer(){
			this._stomach=null;
			StomachLayer.__super.call(this);
			this._stomach=new Sprite();
			this.addChild(this._stomach);
			this._stomach.loadImage("fruit/stomach.png");
			this._stomach.pos(0,300);
		}

		__class(StomachLayer,'layer.StomachLayer',_super);
		var __proto=StomachLayer.prototype;
		__proto.pushItem=function(item){
			this._stomach.addChild(item);
			item.scale(0.1,0.1);
			if (this._stomach._childs.length > 8){
				item.pos(70 *(this._stomach._childs.length-8),40);
				item.visible=false;
				return;
			}
			item.pos(70 *this._stomach._childs.length,40);
			Tween.to(item,{scaleX:0.8,scaleY:0.8},500,Ease.bounceOut);
		}

		__proto.showExtraItem=function(){
			for (var i=0;i < this._stomach._childs.length;i++){
				var item=this._stomach._childs [i];
				if (!item.visible){
					item.visible=true;
					Tween.to(item,{scaleX:0.8,scaleY:0.8},500,Ease.bounceOut);
				}
			}
		}

		__proto.isFill=function(){
			if (this._stomach._childs.length >=8){
				return true;
			}
			return false;
		}

		__proto.spitItem=function(){
			return this._stomach._childs;
		}

		return StomachLayer;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class manager.GameManager extends laya.display.Sprite
	var GameManager=(function(_super){
		function GameManager(itemArr,player){
			this._itemArr=null;
			this._player=null;
			this._fallList=null;
			this._removeArr=[];
			this._oneTypeArr=[];
			this._bottomArr=[];
			this._hasEliminate=false;
			GameManager.__super.call(this);
		}

		__class(GameManager,'manager.GameManager',_super);
		var __proto=GameManager.prototype;
		__proto.init=function(itemArr,player){
			this._itemArr=itemArr;
			this._player=player;
			for (var i=0;i < 8;i++){
				this._removeArr.push([]);
			}
			this._fallList=new LinkList();
		}

		__proto.gameStep=function(offsetR,offsetC){
			var row=this._player.row+offsetR;
			var column=this._player.column+offsetC;
			if (row > this._itemArr.length-1 || row < 0){
				return;
			}
			if (column > this._itemArr.length-1 || column < 0){
				return;
			}
			if (this._itemArr[row][column]==null){
				return;
			}
			NotifyCenter.getInstance().event(NotifyCenter.KEYBORADCTRL,[false]);
			var item=this._itemArr[row] [column];
			if (StomachManager.getInstance().isFill()){
				this._itemArr[this._player.row][this._player.column]=item;
				item.site(this._player.row,this._player.column);
				Tween.to(this._player,{x:item.x,y:item.y},200);
				Tween.to(item,{x:this._player.x,y:this._player.y},200);
				this._fallList.pushBack(item);
				this.timerOnce(200,this,this.eliminate);
				}else {
				Tween.to(this._player,{x:item.x,y:item.y},200);
				this._player.eatItem(item);
				this._itemArr[this._player.row][this._player.column]=null;
				this.timerOnce(200,this,this.fallByEat);
			}
			this._itemArr[row][column]=this._player;
			this._player.site(row,column);
		}

		// 根据被吃项下落
		__proto.fallByEat=function(){
			var row=this._player.row;
			var column=this._player.column;
			var fallNum=0;
			if (this._player.dir==2){
				var siteY=0;
				if (column==0 || !this._itemArr[row][column-1]){
					siteY=column+1;
				}
				else if (column==this._itemArr[0].length || !this._itemArr[row][column+1]){
					siteY=column-1;
				}
				else {
					siteY=(Math.random()> 0.5)? column+1 :column-1;
				};
				var item=this._itemArr[row] [siteY];
				this._itemArr[row][siteY]=null;
				this._itemArr[row+1][column]=item;
				item.site(row+1,column);
				this._fallList.pushBack(item);
				Tween.to(item,{x:this._player.x,y:item.y+80},
				200,null,Handler.create(this,this.fallByUp,[row,siteY]));
			}
			else if (this._player.dir==3){
				fallNum=this.fallLine(row-1,column);
			}
			else if (this._player.dir==0){
				fallNum=this.fallLine(row,column+1);
			}
			else if (this._player.dir==1){
				fallNum=this.fallLine(row,column-1);
			}
			this.timerOnce(200+50 *fallNum,this,this.eliminate);
		}

		__proto.fallByUp=function(row,column){
			var fallNum=this.fallLine(row,column);
			this.timerOnce(200+50 *fallNum,this,this.eliminate);
		}

		// 下落一竖行 返回下落的个数
		__proto.fallLine=function(row,column){
			if (row > this._itemArr.length-1 || row < 0){
				return;
			}
			if (column > this._itemArr.length-1 || column < 0){
				return;
			}
			if (this._itemArr[row][column] !=null){
				return;
			};
			var itemCount=0;
			var blankCount=1;
			for (var i=row-1;i >=0;i--){
				var item=this._itemArr[i] [column];
				if (item==null){
					blankCount++;
					continue ;
				}
				Tween.to(item,{y:item.y+80 *blankCount},200+50 *itemCount);
				if (item.tag !=0){
					this._fallList.pushBack(item);
				}
				this._itemArr[i+blankCount][column]=item;
				item.site(i+blankCount,column);
				itemCount++;
			}
			for (var j=0;j < blankCount;j++){
				this._itemArr[j][column]=null;
			}
			return itemCount;
		}

		// 遍历下落项 消除相同的物品
		__proto.eliminate=function(){
			this._hasEliminate=false;
			var node=this._fallList.headNode.next;
			for (node;node !=null;node=node.next){
				this.findAround(node.data,node.data.tag);
				if (this._oneTypeArr.length < 3){
					for (var i=0;i < this._oneTypeArr.length;i++){
						var item=this._oneTypeArr [i];
						item.sign=false;
					}
				}
				else {
					this._hasEliminate=true;
					for (var j=0;j < this._oneTypeArr.length;j++){
						var item=this._oneTypeArr [j];
						this._removeArr[item.column].push(item);
					}
				}
				this._oneTypeArr=[];
			}
			if (!this._hasEliminate){
				this.addItem();
				return;
			}
			this.findFallPoint();
			for (var i=0;i < this._removeArr.length;i++){
				for (var j=0;j < this._removeArr[i].length;j++){
					var item=this._removeArr[i] [j];
					this._itemArr[item.row][item.column]=null;
					item.removeAction();
				}
				this._removeArr[i]=[];
			}
			this.timerOnce(250,this,this.fallByEliminate);
		}

		// 寻找下落的基准点
		__proto.findFallPoint=function(){
			for (var i=0;i < this._removeArr.length;i++){
				var bottomItem=null;
				var bottomRow=0;
				for (var j=0;j < this._removeArr[i].length;j++){
					var item=this._removeArr[i] [j];
					if (item.row > bottomRow){
						bottomRow=item.row;
						bottomItem=item;
					}
				}
				if (bottomItem !=null){
					this._bottomArr.push(new Point(bottomItem.row,bottomItem.column));
				}
			}
		}

		// 递归下落项的四个方向
		__proto.findAround=function(item,tag){
			if (item==null || item.tag !=tag || item.sign){
				return;
			}
			this._fallList.remove(item);
			this._oneTypeArr.push(item);
			item.sign=true;
			var row=item.row;
			var column=item.column;
			if (column-1 >=0){
				this.findAround(this._itemArr[row][column-1],tag);
			}
			if (column+1 < this._itemArr.length){
				this.findAround(this._itemArr[row][column+1],tag);
			}
			if (row-1 >=0){
				this.findAround(this._itemArr[row-1][column],tag);
			}
			if (row+1 < this._itemArr.length){
				this.findAround(this._itemArr[row+1][column],tag);
			}
		}

		// 根据消除项下落
		__proto.fallByEliminate=function(){
			var fallNum=0;
			for (var i=0;i < this._bottomArr.length;i++){
				var pos=this._bottomArr [i];
				var count=this.fallLine(pos.x,pos.y);
				if (count > fallNum){
					fallNum=count;
				}
			}
			this._bottomArr=[];
			this.timerOnce(300+50 *fallNum,this,this.eliminate);
		}

		// 补充物品
		__proto.addItem=function(){
			for (var row=0;row < this._itemArr.length;row++){
				for (var column=0;column < this._itemArr[0].length;column++){
					if (this._itemArr[row][column]==null){
						var item=Pool.getItemByClass("item",Item);
						item.reset();
						this._itemArr[row][column]=item;
						item.site(row,column);
						this.parent.addChild(item);
						item.pos((column+0.5)*80,GameInfo.ITEM_AREA_Y+row *80);
					}
				}
			}
			NotifyCenter.getInstance().event(NotifyCenter.KEYBORADCTRL,[true]);
		}

		// 吐出所有物品
		__proto.spitAll=function(){
			if (!StomachManager.getInstance().isFill()){
				return;
			};
			var row=0;
			var column=0;
			var playerRow=this._player.row;
			var playerIsTop=false;
			for (column=0;column < this._itemArr[0].length;column++){
				var entity=this._itemArr[0] [column];
				if (entity.tag==0){
					playerIsTop=true;
					continue ;
				}
				Tween.to(entity,{y:entity.y-80},200,null,
				new Handler(entity,(entity).removeAction));
				this._itemArr[0][column]=null;
			}
			if (playerIsTop){
				for (column=0;column < this._itemArr[1].length;column++){
					var entity=this._itemArr[1] [column];
					if (column==this._player.column){
						this._player.eatItem(entity);
						}else {
						Tween.to(entity,{y:entity.y-80},200);
						this._itemArr[0][column]=entity;
						entity.site(0,column);
						this._itemArr[1][column]=null;
					}
				}
			}
			else {
				for (row=1;row <=playerRow;row++){
					for (column=0;column < this._itemArr[0].length;column++){
						var entity=this._itemArr[row] [column];
						Tween.to(entity,{y:entity.y-80},200);
						this._itemArr[row-1][column]=entity;
						entity.site(row-1,column);
						this._itemArr[row][column]=null;
					}
				}
			}
			if (playerIsTop)playerRow++;
			var spitArr=StomachManager.getInstance().spitItem();
			for (column=7;column >=0;column--){
				var item=spitArr [column];
				item.scale(1,1);
				this.parent.addChild(item);
				item.pos((column+0.5)*80,
				GameInfo.ITEM_AREA_Y+playerRow *80);
				this._itemArr[playerRow][column]=item;
				item.site(playerRow,column);
				item.playAddAnime();
			}
			StomachManager.getInstance().showExtraItem();
		}

		// 显示数据
		__proto.showData=function(){
			for (var row=0;row < this._itemArr.length;row++){
				var line="";
				for (var column=0;column < this._itemArr[row].length;column++){
					var item=this._itemArr[row] [column];
					if (item==null){
						line+="null  ";
						}else {
						line+=item.tag+"  ";
					}
				}
				console.log(line);
			}
		}

		GameManager.getInstance=function(){
			if (GameManager._instance==null){
				GameManager._instance=new GameManager();
			}
			return GameManager._instance;
		}

		GameManager._instance=null;
		return GameManager;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class scene.GameScene extends laya.display.Sprite
	var GameScene=(function(_super){
		function GameScene(){
			GameScene.__super.call(this);
			var bg=new Sprite();
			this.addChild(bg);
			bg.loadImage("res/playBG.png");
			var stomachLayer=new StomachLayer();
			this.addChild(stomachLayer);
			var stomachMgr=StomachManager.getInstance();
			stomachMgr.layer=stomachLayer;
			var gameLayer=new GameLayer();
			this.addChild(gameLayer);
		}

		__class(GameScene,'scene.GameScene',_super);
		return GameScene;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class scene.MainScene extends laya.display.Sprite
	var MainScene=(function(_super){
		function MainScene(){
			this._startBtn=null;
			MainScene.__super.call(this);
			var bg=new Sprite();
			this.addChild(bg);
			bg.loadImage("res/mainBG.png");
			this._startBtn=new SButton("fruit/btn_start1.png","fruit/btn_start2.png");
			this.addChild(this._startBtn);
			this._startBtn.pos(Laya.stage.width / 2,Laya.stage.height / 2+90);
			this._startBtn.setCallback(new Handler(this,this.enterGame));
		}

		__class(MainScene,'scene.MainScene',_super);
		var __proto=MainScene.prototype;
		__proto.enterGame=function(){
			var gameScene=new GameScene();
			Laya.stage.addChild(gameScene);
			this.destroy();
		}

		return MainScene;
	})(Sprite)


	/**
	*...
	*@author anling
	*/
	//class ui.SButton extends laya.display.Sprite
	var SButton=(function(_super){
		function SButton(nurl,surl){
			this._normal=null;
			this._selected=null;
			this._callback=null;
			SButton.__super.call(this);
			this._normal=Laya.loader.getRes(nurl);
			this._selected=Laya.loader.getRes(surl);
			this.graphics.drawTexture(this._normal,0,0);
			this.pivot(this._selected.width / 2,this._selected.height / 2);
			this.size(this._selected.width,this._selected.height);
			this.on("mousedown",this,this.onMouseDown);
			this.on("mouseup",this,this.onMouseUp);
			this.on("mouseout",this,this.onMouseOut);
		}

		__class(SButton,'ui.SButton',_super);
		var __proto=SButton.prototype;
		__proto.onMouseDown=function(e){
			this.graphics.clear();
			this.graphics.drawTexture(this._selected,0,0);
		}

		__proto.onMouseUp=function(e){
			this.graphics.clear();
			this.graphics.drawTexture(this._normal,0,0);
			this._callback.runWith();
		}

		__proto.onMouseOut=function(e){
			this.graphics.clear();
			this.graphics.drawTexture(this._normal,0,0);
		}

		__proto.setCallback=function(callback){
			this._callback=callback;
		}

		return SButton;
	})(Sprite)


	/**
	*<p> <code>Text</code> 类用于创建显示对象以显示文本。</p>
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Text;
		*public class Text_Example
		*{
			*public function Text_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*onInit();
				*}
			*private function onInit():void
			*{
				*var text:Text=new Text();//创建一个 Text 类的实例对象 text 。
				*text.text="这个是一个 Text 文本示例。";
				*text.color="#008fff";//设置 text 的文本颜色。
				*text.font="Arial";//设置 text 的文本字体。
				*text.bold=true;//设置 text 的文本显示为粗体。
				*text.fontSize=30;//设置 text 的字体大小。
				*text.wordWrap=true;//设置 text 的文本自动换行。
				*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
				*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
				*text.width=300;//设置 text 的宽度。
				*text.height=200;//设置 text 的高度。
				*text.italic=true;//设置 text 的文本显示为斜体。
				*text.borderColor="#fff000";//设置 text 的文本边框颜色。
				*Laya.stage.addChild(text);//将 text 添加到显示列表。
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*Text_Example();
	*function Text_Example()
	*{
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*onInit();
		*}
	*function onInit()
	*{
		*var text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
		*text.text="这个是一个 Text 文本示例。";
		*text.color="#008fff";//设置 text 的文本颜色。
		*text.font="Arial";//设置 text 的文本字体。
		*text.bold=true;//设置 text 的文本显示为粗体。
		*text.fontSize=30;//设置 text 的字体大小。
		*text.wordWrap=true;//设置 text 的文本自动换行。
		*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
		*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
		*text.width=300;//设置 text 的宽度。
		*text.height=200;//设置 text 的高度。
		*text.italic=true;//设置 text 的文本显示为斜体。
		*text.borderColor="#fff000";//设置 text 的文本边框颜色。
		*Laya.stage.addChild(text);//将 text 添加到显示列表。
		*}
	*</listing>
	*<listing version="3.0">
	*class Text_Example {
		*constructor(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*this.onInit();
			*}
		*private onInit():void {
			*var text:laya.display.Text=new laya.display.Text();//创建一个 Text 类的实例对象 text 。
			*text.text="这个是一个 Text 文本示例。";
			*text.color="#008fff";//设置 text 的文本颜色。
			*text.font="Arial";//设置 text 的文本字体。
			*text.bold=true;//设置 text 的文本显示为粗体。
			*text.fontSize=30;//设置 text 的字体大小。
			*text.wordWrap=true;//设置 text 的文本自动换行。
			*text.x=100;//设置 text 对象的属性 x 的值，用于控制 text 对象的显示位置。
			*text.y=100;//设置 text 对象的属性 y 的值，用于控制 text 对象的显示位置。
			*text.width=300;//设置 text 的宽度。
			*text.height=200;//设置 text 的高度。
			*text.italic=true;//设置 text 的文本显示为斜体。
			*text.borderColor="#fff000";//设置 text 的文本边框颜色。
			*Laya.stage.addChild(text);//将 text 添加到显示列表。
			*}
		*}
	*</listing>
	*/
	//class laya.display.Text extends laya.display.Sprite
	var Text=(function(_super){
		function Text(){
			this._clipPoint=null;
			this._currBitmapFont=null;
			this._text=null;
			this._isChanged=false;
			this._textWidth=0;
			this._textHeight=0;
			this._lines=[];
			this._lineWidths=[];
			this._startX=NaN;
			this._startY=NaN;
			this._lastVisibleLineIndex=-1;
			this._words=null;
			this._charSize={};
			this.underline=false;
			this.underlineColor=null;
			Text.__super.call(this);
			this.overflow=Text.VISIBLE;
			this._style=new CSSStyle(this);
			(this._style).wordWrap=false;
		}

		__class(Text,'laya.display.Text',_super);
		var __proto=Text.prototype;
		/**@inheritDoc */
		__proto.destroy=function(destroyChild){
			(destroyChild===void 0)&& (destroyChild=true);
			_super.prototype.destroy.call(this,destroyChild);
			this._lines=null;
			if (this._words){
				this._words.length=0;
				this._words=null;
			}
		}

		/**
		*@private
		*@inheritDoc
		*/
		__proto._getBoundPointsM=function(ifRotate){
			(ifRotate===void 0)&& (ifRotate=false);
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec._getBoundPoints();
		}

		/**
		*@inheritDoc
		*/
		__proto.getGraphicBounds=function(){
			var rec=Rectangle.TEMP;
			rec.setTo(0,0,this.width,this.height);
			return rec;
		}

		/**
		*@private
		*@inheritDoc
		*/
		__proto._getCSSStyle=function(){
			return this._style;
		}

		/**
		*<p>根据指定的文本，从语言包中取当前语言的文本内容。并对此文本中的{i}文本进行替换。</p>
		*<p>例如：
		*<li>（1）text 的值为“我的名字”，先取到这个文本对应的当前语言版本里的值“My name”，将“My name”设置为当前文本的内容。</li>
		*<li>（2）text 的值为“恭喜你赢得{0}个钻石，{1}经验。”，arg1 的值为100，arg2 的值为200。
		*则先取到这个文本对应的当前语言版本里的值“Congratulations on your winning {0}diamonds,{1}experience.”，
		*然后将文本里的{0}、{1}，依据括号里的数字从0开始替换为 arg1、arg2 的值。
		*将替换处理后的文本“Congratulations on your winning 100 diamonds,200 experience.”设置为当前文本的内容。
		*</li>
		*</p>
		*@param text 文本内容。
		*@param ...args 文本替换参数。
		*/
		__proto.lang=function(text,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10){
			text=Text.langPacks && Text.langPacks[text] ? Text.langPacks[text] :text;
			if (arguments.length < 2){
				this._text=text;
				}else {
				for (var i=0,n=arguments.length;i < n;i++){
					text=text.replace("{"+i+"}",arguments[i+1]);
				}
				this._text=text;
			}
		}

		/**
		*渲染文字。
		*@param begin 开始渲染的行索引。
		*@param visibleLineCount 渲染的行数。
		*/
		__proto.renderText=function(begin,visibleLineCount){
			var graphics=this.graphics;
			graphics.clear();
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.context.font=ctxFont;
			var padding=this.padding;
			var startX=padding[3];
			var textAlgin="left";
			var lines=this._lines;
			var lineHeight=this.leading+this._charSize.height;
			var tCurrBitmapFont=this._currBitmapFont;
			if (tCurrBitmapFont){
				lineHeight=this.leading+tCurrBitmapFont.getMaxHeight();
			};
			var startY=padding[0];
			if ((!tCurrBitmapFont)&& this._width > 0 && this._textWidth <=this._width){
				if (this.align=="right"){
					textAlgin="right";
					startX=this._width-padding[1];
					}else if (this.align=="center"){
					textAlgin="center";
					startX=this._width *0.5+padding[3]-padding[1];
				}
			}
			if (this._height > 0){
				var tempVAlign=(this._textHeight > this._height)? "top" :this.valign;
				if (tempVAlign==="middle")
					startY=(this._height-visibleLineCount *lineHeight)*0.5+padding[0]-padding[2];
				else if (tempVAlign==="bottom")
				startY=this._height-visibleLineCount *lineHeight-padding[2];
			};
			var style=this._style;
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var bitmapScale=tCurrBitmapFont.fontSize / this.fontSize;
			}
			if (this._clipPoint){
				graphics.save();
				if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
					var tClipWidth=0;
					var tClipHeight=0;
					this._width ? tClipWidth=(this._width-padding[3]-padding[1]):tClipWidth=this._textWidth;
					this._height ? tClipHeight=(this._height-padding[0]-padding[2]):tClipHeight=this._textHeight;
					tClipWidth *=bitmapScale;
					tClipHeight *=bitmapScale;
					graphics.clipRect(padding[3],padding[0],tClipWidth,tClipHeight);
					}else {
					graphics.clipRect(padding[3],padding[0],this._width ? (this._width-padding[3]-padding[1]):this._textWidth,this._height ? (this._height-padding[0]-padding[2]):this._textHeight);
				}
			};
			var password=style.password;
			if (("prompt" in this)&& this['prompt']==this._text)
				password=false;
			var x=0,y=0;
			var end=Math.min(this._lines.length,visibleLineCount+begin)|| 1;
			for (var i=begin;i < end;i++){
				var word=lines[i];
				var _word;
				if (password){
					var len=word.length;
					word="";
					for (var j=len;j > 0;j--){
						word+="·";
					}
				}
				x=startX-(this._clipPoint ? this._clipPoint.x :0);
				y=startY+lineHeight *i-(this._clipPoint ? this._clipPoint.y :0);
				this.underline && this.drawUnderline(textAlgin,x,y,i);
				if (tCurrBitmapFont){
					var tWidth=this.width;
					if (tCurrBitmapFont.autoScaleSize){
						tWidth=this.width *bitmapScale;
					}
					tCurrBitmapFont.drawText(word,this,x,y,this.align,tWidth);
					}else {
					if (Render.isWebGL){
						this._words || (this._words=[]);
						_word=this._words.length > (i-begin)? this._words[i-begin] :new WordText();
						_word.setText(word);
						}else {
						_word=word;
					}
					style.stroke ? graphics.fillBorderText(_word,x,y,ctxFont,this.color,style.strokeColor,style.stroke,textAlgin):graphics.fillText(_word,x,y,ctxFont,this.color,textAlgin);
				}
			}
			if (tCurrBitmapFont && tCurrBitmapFont.autoScaleSize){
				var tScale=1 / bitmapScale;
				this.scale(tScale,tScale);
			}
			if (this._clipPoint)
				graphics.restore();
			this._startX=startX;
			this._startY=startY;
		}

		/**
		*绘制下划线
		*@param x 本行坐标
		*@param y 本行坐标
		*@param lineIndex 本行索引
		*/
		__proto.drawUnderline=function(align,x,y,lineIndex){
			var lineWidth=this._lineWidths[lineIndex];
			switch (align){
				case 'center':
					x-=lineWidth / 2;
					break ;
				case 'right':
					x-=lineWidth;
					break ;
				case 'left':
				default :
					break ;
				}
			y+=this._charSize.height;
			this._graphics.drawLine(x,y,x+lineWidth,y,this.underlineColor || this.color,1);
		}

		/**
		*<p>排版文本。</p>
		*<p>进行宽高计算，渲染、重绘文本。</p>
		*/
		__proto.typeset=function(){
			this._isChanged=false;
			if (!this._text){
				this._clipPoint=null;
				this._textWidth=this._textHeight=0;
				this.graphics.clear();
				return;
			}
			Browser.context.font=this._getCSSStyle().font;
			this._lines.length=0;
			this._lineWidths.length=0;
			this.parseLines(this._text);
			this.evalTextSize();
			if (this.checkEnabledViewportOrNot())
				this._clipPoint || (this._clipPoint=new Point(0,0));
			else
			this._clipPoint=null;
			var endLine=this._lines.length;
			if (this.overflow !=Text.VISIBLE){
				var func=this.overflow==Text.HIDDEN ? Math.floor :Math.ceil;
				endLine=Math.min(endLine,func((this.height-this.padding[0]-this.padding[2])/ (this.leading+this._charSize.height)));
			}
			this.renderText(0,endLine);
			this.repaint();
		}

		__proto.evalTextSize=function(){
			var nw=NaN,nh=NaN;
			nw=Math.max.apply(this,this._lineWidths);
			if (this._currBitmapFont)
				nh=this._lines.length *(this._currBitmapFont.getMaxHeight()+this.leading)+this.padding[0]+this.padding[2];
			else
			nh=this._lines.length *(this._charSize.height+this.leading)+this.padding[0]+this.padding[2];
			if (nw !=this._textWidth || nh !=this._textHeight){
				this._textWidth=nw;
				this._textHeight=nh;
				if(!this._width||!this._height)
					this.model&&this.model.size(this._width||this._textWidth,this._height||this._textHeight);
			}
		}

		__proto.checkEnabledViewportOrNot=function(){
			return this.overflow==Text.SCROLL && ((this._width > 0 && this._textWidth > this._width)|| (this._height > 0 && this._textHeight > this._height));
		}

		/**
		*快速更改显示文本。不进行排版计算，效率较高。
		*<p>如果只更改文字内容，不更改文字样式，建议使用此接口，能提高效率。</p>
		*@param text 文本内容。
		*/
		__proto.changeText=function(text){
			if (this._text!==text){
				this.lang(text+"");
				if (this._graphics && this._graphics.replaceText(this._text)){
					}else {
					this.typeset();
				}
			}
		}

		/**
		*@private
		*分析文本换行。
		*/
		__proto.parseLines=function(text){
			var needWordWrapOrTruncate=this.wordWrap || this.overflow==Text.HIDDEN;
			if (needWordWrapOrTruncate){
				var wordWrapWidth=this.getWordWrapWidth();
			};
			var measureResult=Browser.context.measureText("阳");
			this._charSize.width=measureResult.width;
			this._charSize.height=(measureResult.height || this.fontSize);
			var lines=text.replace(/\r\n/g,"\n").split("\n");
			for (var i=0,n=lines.length;i < n;i++){
				if (i < n-1)
					lines[i]+="\n";
				var line=lines[i];
				if (needWordWrapOrTruncate)
					this.parseLine(line,wordWrapWidth);
				else {
					this._lineWidths.push(this.getTextWidth(line));
					this._lines.push(line);
				}
			}
		}

		/**
		*@private
		*解析行文本。
		*@param line 某行的文本。
		*@param wordWrapWidth 文本的显示宽度。
		*/
		__proto.parseLine=function(line,wordWrapWidth){
			var ctx=Browser.context;
			var lines=this._lines;
			var maybeIndex=0;
			var execResult;
			var charsWidth=NaN;
			var wordWidth=NaN;
			var startIndex=0;
			charsWidth=this.getTextWidth(line);
			if (charsWidth <=wordWrapWidth){
				lines.push(line);
				this._lineWidths.push(charsWidth);
				return;
			}
			charsWidth=this._currBitmapFont ? this._currBitmapFont.getMaxWidth():this._charSize.width;
			maybeIndex=Math.floor(wordWrapWidth / charsWidth);
			(maybeIndex==0)&& (maybeIndex=1);
			charsWidth=this.getTextWidth(line.substring(0,maybeIndex));
			wordWidth=charsWidth;
			for (var j=maybeIndex,m=line.length;j < m;j++){
				charsWidth=this.getTextWidth(line.charAt(j));
				wordWidth+=charsWidth;
				if (wordWidth > wordWrapWidth){
					if (this.wordWrap){
						var newLine=line.substring(startIndex,j);
						if (newLine.charCodeAt(newLine.length-1)< 255){
							execResult=/[^\x20-]+$/.exec(newLine);
							if (execResult){
								j=execResult.index+startIndex;
								if (execResult.index==0)
									j+=newLine.length;
								else
								newLine=line.substring(startIndex,j);
							}
						}
						lines.push(newLine);
						this._lineWidths.push(wordWidth-charsWidth);
						startIndex=j;
						if (j+maybeIndex < m){
							j+=maybeIndex;
							charsWidth=this.getTextWidth(line.substring(startIndex,j));
							wordWidth=charsWidth;
							j--;
							}else {
							lines.push(line.substring(startIndex,m));
							this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
							startIndex=-1;
							break ;
						}
						}else if (this.overflow==Text.HIDDEN){
						lines.push(line.substring(0,j));
						this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
						return;
					}
				}
			}
			if (this.wordWrap && startIndex !=-1){
				lines.push(line.substring(startIndex,m));
				this._lineWidths.push(this.getTextWidth(lines[lines.length-1]));
			}
		}

		__proto.getTextWidth=function(text){
			if (this._currBitmapFont)
				return this._currBitmapFont.getTextWidth(text);
			else
			return Browser.context.measureText(text).width;
		}

		/**
		*获取换行所需的宽度。
		*/
		__proto.getWordWrapWidth=function(){
			var p=this.padding;
			var w=NaN;
			if (this._currBitmapFont && this._currBitmapFont.autoScaleSize)
				w=this._width *(this._currBitmapFont.fontSize / this.fontSize);
			else
			w=this._width;
			if (w <=0){
				w=this.wordWrap ? 100 :Browser.width;
			}
			w <=0 && (w=100);
			return w-p[3]-p[1];
		}

		/**
		*返回字符的位置信息。
		*@param charIndex 索引位置。
		*@param out 输出的Point引用。
		*@return 返回Point位置信息。
		*/
		__proto.getCharPoint=function(charIndex,out){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			var len=0,lines=this._lines,startIndex=0;
			for (var i=0,n=lines.length;i < n;i++){
				len+=lines[i].length;
				if (charIndex < len){
					var line=i;
					break ;
				}
				startIndex=len;
			};
			var ctxFont=(this.italic ? "italic " :"")+(this.bold ? "bold " :"")+this.fontSize+"px "+this.font;
			Browser.context.font=ctxFont;
			var width=this.getTextWidth(this._text.substring(startIndex,charIndex));
			var point=out || new Point();
			return point.setTo(this._startX+width-(this._clipPoint ? this._clipPoint.x :0),this._startY+line *(this._charSize.height+this.leading)-(this._clipPoint ? this._clipPoint.y :0));
		}

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'width',function(){
			if (this._width)
				return this._width;
			return this.textWidth;
			},function(value){
			if (value !=this._width){
				_super.prototype._$set_width.call(this,value);
				this.isChanged=true;
			}
		});

		/**
		*表示文本的宽度，以像素为单位。
		*/
		__getset(0,__proto,'textWidth',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textWidth;
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'height',function(){
			if (this._height)return this._height;
			return this.textHeight;
			},function(value){
			if (value !=this._height){
				_super.prototype._$set_height.call(this,value);
				this.isChanged=true;
			}
		});

		/**
		*表示文本的高度，以像素为单位。
		*/
		__getset(0,__proto,'textHeight',function(){
			this._isChanged && Laya.timer.runCallLater(this,this.typeset);
			return this._textHeight;
		});

		/**
		*边距信息。
		*<p>数据格式：[上边距，右边距，下边距，左边距]（边距以像素为单位）。</p>
		*/
		__getset(0,__proto,'padding',function(){
			return this._getCSSStyle().padding;
			},function(value){
			this._getCSSStyle().padding=value;
			this.isChanged=true;
		});

		/**
		*指定文本是否为粗体字。
		*<p>默认值为 false，这意味着不使用粗体字。如果值为 true，则文本为粗体字。</p>
		*/
		__getset(0,__proto,'bold',function(){
			return this._getCSSStyle().bold;
			},function(value){
			this._getCSSStyle().bold=value;
			this.isChanged=true;
		});

		/**当前文本的内容字符串。*/
		__getset(0,__proto,'text',function(){
			return this._text || "";
			},function(value){
			if (this._text!==value){
				this.lang(value+"");
				this.isChanged=true;
				this.event("change");
			}
		});

		/**
		*表示文本的颜色值。可以通过 <code>Text.defaultColor</code> 设置默认颜色。
		*<p>默认值为黑色。</p>
		*/
		__getset(0,__proto,'color',function(){
			return this._getCSSStyle().color;
			},function(value){
			if (this._getCSSStyle().color !=value){
				this._getCSSStyle().color=value;
				if (!this._isChanged && this._graphics){
					this._graphics.replaceTextColor(this.color)
					}else {
					this.isChanged=true;
				}
			}
		});

		/**
		*<p>指定文本字段是否是密码文本字段。</p>
		*<p>如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。</p>
		*<p>默认值为false。</p>
		*/
		__getset(0,__proto,'asPassword',function(){
			return this._getCSSStyle().password;
			},function(value){
			this._getCSSStyle().password=value;
			this.isChanged=true;
		});

		/**
		*文本的字体名称，以字符串形式表示。
		*<p>默认值为："Arial"，可以通过Text.defaultFont设置默认字体。</p> *
		*@see laya.display.css.Font#defaultFamily
		*/
		__getset(0,__proto,'font',function(){
			return this._getCSSStyle().fontFamily;
			},function(value){
			if (this._currBitmapFont){
				this._currBitmapFont=null;
				this.scale(1,1);
			}
			if (Text._bitmapFonts && Text._bitmapFonts[value]){
				this._currBitmapFont=Text._bitmapFonts[value];
			}
			this._getCSSStyle().fontFamily=value;
			this.isChanged=true;
		});

		/**
		*指定文本的字体大小（以像素为单位）。
		*<p>默认为20像素，可以通过 <code>Text.defaultSize</code> 设置默认大小。</p>
		*/
		__getset(0,__proto,'fontSize',function(){
			return this._getCSSStyle().fontSize;
			},function(value){
			this._getCSSStyle().fontSize=value;
			this.isChanged=true;
		});

		/**
		*表示使用此文本格式的文本是否为斜体。
		*<p>默认值为 false，这意味着不使用斜体。如果值为 true，则文本为斜体。</p>
		*/
		__getset(0,__proto,'italic',function(){
			return this._getCSSStyle().italic;
			},function(value){
			this._getCSSStyle().italic=value;
			this.isChanged=true;
		});

		/**
		*表示文本的水平显示方式。
		*<p><b>取值：</b>
		*<li>"left"： 居左对齐显示。</li>
		*<li>"center"： 居中对齐显示。</li>
		*<li>"right"： 居右对齐显示。</li>
		*</p>
		*/
		__getset(0,__proto,'align',function(){
			return this._getCSSStyle().align;
			},function(value){
			this._getCSSStyle().align=value;
			this.isChanged=true;
		});

		/**
		*表示文本的垂直显示方式。
		*<p><b>取值：</b>
		*<li>"top"： 居顶部对齐显示。</li>
		*<li>"middle"： 居中对齐显示。</li>
		*<li>"bottom"： 居底部对齐显示。</li>
		*</p>
		*/
		__getset(0,__proto,'valign',function(){
			return this._getCSSStyle().valign;
			},function(value){
			this._getCSSStyle().valign=value;
			this.isChanged=true;
		});

		/**
		*表示文本是否自动换行，默认为false。
		*<p>若值为true，则自动换行；否则不自动换行。</p>
		*/
		__getset(0,__proto,'wordWrap',function(){
			return this._getCSSStyle().wordWrap;
			},function(value){
			this._getCSSStyle().wordWrap=value;
			this.isChanged=true;
		});

		/**
		*垂直行间距（以像素为单位）。
		*/
		__getset(0,__proto,'leading',function(){
			return this._getCSSStyle().leading;
			},function(value){
			this._getCSSStyle().leading=value;
			this.isChanged=true;
		});

		/**
		*文本背景颜色，以字符串表示。
		*/
		__getset(0,__proto,'bgColor',function(){
			return this._getCSSStyle().backgroundColor;
			},function(value){
			this._getCSSStyle().backgroundColor=value;
			this.isChanged=true;
		});

		/**
		*文本边框背景颜色，以字符串表示。
		*/
		__getset(0,__proto,'borderColor',function(){
			return this._getCSSStyle().borderColor;
			},function(value){
			this._getCSSStyle().borderColor=value;
			this.isChanged=true;
		});

		/**
		*<p>描边宽度（以像素为单位）。</p>
		*默认值0，表示不描边。
		*/
		__getset(0,__proto,'stroke',function(){
			return this._getCSSStyle().stroke;
			},function(value){
			this._getCSSStyle().stroke=value;
			this.isChanged=true;
		});

		/**
		*<p>描边颜色，以字符串表示。</p>
		*默认值为 "#000000"（黑色）;
		*/
		__getset(0,__proto,'strokeColor',function(){
			return this._getCSSStyle().strokeColor;
			},function(value){
			this._getCSSStyle().strokeColor=value;
			this.isChanged=true;
		});

		/**
		*一个布尔值，表示文本的属性是否有改变。若为true表示有改变。
		*/
		__getset(0,__proto,'isChanged',null,function(value){
			if (this._isChanged!==value){
				this._isChanged=value;
				value && Laya.timer.callLater(this,this.typeset);
			}
		});

		/**
		*设置横向滚动量。
		*<p>即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。</p>
		*/
		/**
		*获取横向滚动量。
		*/
		__getset(0,__proto,'scrollX',function(){
			if (!this._clipPoint)
				return 0;
			return this._clipPoint.x;
			},function(value){
			if (this.overflow !=Text.SCROLL || (this.textWidth < this._width || !this._clipPoint))
				return;
			value=value < this.padding[3] ? this.padding[3] :value;
			var maxScrollX=this._textWidth-this._width;
			value=value > maxScrollX ? maxScrollX :value;
			var visibleLineCount=this._height / (this._charSize.height+this.leading)| 0+1;
			this._clipPoint.x=value;
			this.renderText(this._lastVisibleLineIndex,visibleLineCount);
		});

		/**
		*设置纵向滚动量（px)。即使设置超出滚动范围的值，也会被自动限制在可能的最大值处。
		*/
		/**
		*获取纵向滚动量。
		*/
		__getset(0,__proto,'scrollY',function(){
			if (!this._clipPoint)
				return 0;
			return this._clipPoint.y;
			},function(value){
			if (this.overflow !=Text.SCROLL || (this.textHeight < this._height || !this._clipPoint))
				return;
			value=value < this.padding[0] ? this.padding[0] :value;
			var maxScrollY=this._textHeight-this._height;
			value=value > maxScrollY ? maxScrollY :value;
			var startLine=value / (this._charSize.height+this.leading)| 0;
			this._lastVisibleLineIndex=startLine;
			var visibleLineCount=(this._height / (this._charSize.height+this.leading)| 0)+1;
			this._clipPoint.y=value;
			this.renderText(startLine,visibleLineCount);
		});

		/**
		*获取横向可滚动最大值。
		*/
		__getset(0,__proto,'maxScrollX',function(){
			return (this.textWidth < this._width)? 0 :this._textWidth-this._width;
		});

		/**
		*获取纵向可滚动最大值。
		*/
		__getset(0,__proto,'maxScrollY',function(){
			return (this.textHeight < this._height)? 0 :this._textHeight-this._height;
		});

		__getset(0,__proto,'lines',function(){
			return this._lines;
		});

		Text.registerBitmapFont=function(name,bitmapFont){
			Text._bitmapFonts || (Text._bitmapFonts={});
			Text._bitmapFonts[name]=bitmapFont;
		}

		Text.unregisterBitmapFont=function(name,destroy){
			(destroy===void 0)&& (destroy=true);
			if (Text._bitmapFonts && Text._bitmapFonts[name]){
				var tBitmapFont=Text._bitmapFonts[name];
				if (destroy){
					tBitmapFont.destroy();
				}
				delete Text._bitmapFonts[name];
			}
		}

		Text.langPacks=null
		Text.VISIBLE="visible";
		Text.SCROLL="scroll";
		Text.HIDDEN="hidden";
		Text._bitmapFonts=null
		return Text;
	})(Sprite)


	/**
	*<p> <code>Stage</code> 类是显示对象的根节点。</p>
	*可以通过 Laya.stage 访问。
	*/
	//class laya.display.Stage extends laya.display.Sprite
	var Stage=(function(_super){
		function Stage(){
			this.focus=null;
			this._offset=null;
			this.frameRate="fast";
			this.desginWidth=0;
			this.desginHeight=0;
			this.canvasRotation=false;
			this.canvasDegree=0;
			this.renderingEnabled=true;
			this._screenMode="none";
			this._scaleMode="noscale";
			this._alignV="top";
			this._alignH="left";
			this._bgColor="black";
			this._mouseMoveTime=0;
			this._renderCount=0;
			this._safariOffsetY=0;
			Stage.__super.call(this);
			this.offset=new Point();
			this._canvasTransform=new Matrix();
			this.mouseEnabled=true;
			this.hitTestPrior=true;
			this._displayedInStage=true;
			var _this=this;
			var window=Browser.window;
			window.addEventListener("focus",function(){
				_this.event("focus");
			});
			window.addEventListener("blur",function(){
				_this.event("blur");
				if (_this._isInputting())Input["inputElement"].target.focus=false;
			});
			var hidden="hidden",state="visibilityState",visibilityChange="visibilitychange";
			var document=window.document;
			if (typeof document.hidden!=="undefined"){
				visibilityChange="visibilitychange";
				state="visibilityState";
				}else if (typeof document.mozHidden!=="undefined"){
				visibilityChange="mozvisibilitychange";
				state="mozVisibilityState";
				}else if (typeof document.msHidden!=="undefined"){
				visibilityChange="msvisibilitychange";
				state="msVisibilityState";
				}else if (typeof document.webkitHidden!=="undefined"){
				visibilityChange="webkitvisibilitychange";
				state="webkitVisibilityState";
			}
			window.document.addEventListener(visibilityChange,visibleChangeFun);
			function visibleChangeFun (){
				if (Browser.document[state]=="hidden"){
					_this.event("blur");
					if (_this._isInputting())Input["inputElement"].target.focus=false;
					}else {
					_this.event("focus");
				}
			}
			window.addEventListener("resize",function(){
				if (_this._isInputting())return;
				if (Browser.onSafari)
					_this._safariOffsetY=(Browser.document.body.clientHeight || Browser.document.documentElement.clientHeight)-Browser.window.innerHeight;
				_this._resetCanvas();
			});
			window.addEventListener("orientationchange",function(e){
				if (_this._isInputting())Input["inputElement"].target.focus=false;
				_this._resetCanvas();
			});
			this.on("mousemove",this,this._onmouseMove);
		}

		__class(Stage,'laya.display.Stage',_super);
		var __proto=Stage.prototype;
		/**
		*在移动端输入时，输入法弹出期间不进行画布尺寸重置。
		*/
		__proto._isInputting=function(){
			return (Browser.onMobile && Input.isInputting);
		}

		/**@private */
		__proto._changeCanvasSize=function(){
			this.setScreenSize(Browser.clientWidth *Browser.pixelRatio,Browser.clientHeight *Browser.pixelRatio);
		}

		/**@private */
		__proto._resetCanvas=function(){
			var canvas=Render._mainCanvas;
			var canvasStyle=canvas.source.style;
			canvas.size(1,1);
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="";
			this.renderingEnabled=false;
			Laya.timer.once(100,this,this._changeCanvasSize);
		}

		/**
		*设置屏幕大小，场景会根据屏幕大小进行适配。
		*@param screenWidth 屏幕宽度。
		*@param screenHeight 屏幕高度。
		*/
		__proto.setScreenSize=function(screenWidth,screenHeight){
			var rotation=false;
			if (this._screenMode!=="none"){
				var screenType=screenWidth / screenHeight < 1 ? "vertical" :"horizontal";
				rotation=screenType!==this._screenMode;
				if (rotation){
					var temp=screenHeight;
					screenHeight=screenWidth;
					screenWidth=temp;
				}
			}
			this.canvasRotation=rotation;
			var canvas=Render._mainCanvas;
			var canvasStyle=canvas.source.style;
			var mat=this._canvasTransform.identity();
			var scaleMode=this._scaleMode;
			var scaleX=screenWidth / this.desginWidth;
			var scaleY=screenHeight / this.desginHeight;
			var canvasWidth=this.desginWidth;
			var canvasHeight=this.desginHeight;
			var realWidth=screenWidth;
			var realHeight=screenHeight;
			var pixelRatio=Browser.pixelRatio;
			this._width=this.desginWidth;
			this._height=this.desginHeight;
			switch (scaleMode){
				case "noscale":
					scaleX=scaleY=1;
					realWidth=this.desginWidth;
					realHeight=this.desginHeight;
					break ;
				case "showall":
					scaleX=scaleY=Math.min(scaleX,scaleY);
					canvasWidth=realWidth=Math.round(this.desginWidth *scaleX);
					canvasHeight=realHeight=Math.round(this.desginHeight *scaleY);
					break ;
				case "noborder":
					scaleX=scaleY=Math.max(scaleX,scaleY);
					realWidth=Math.round(this.desginWidth *scaleX);
					realHeight=Math.round(this.desginHeight *scaleY);
					break ;
				case "full":
					scaleX=scaleY=1;
					this._width=canvasWidth=screenWidth;
					this._height=canvasHeight=screenHeight;
					break ;
				case "fixedwidth":
					scaleY=scaleX;
					this._height=screenHeight / scaleX;
					canvasHeight=Math.round(screenHeight / scaleX);
					break ;
				case "fixedheight":
					scaleX=scaleY;
					this._width=screenWidth / scaleY;
					canvasWidth=Math.round(screenWidth / scaleY);
					break ;
				}
			scaleX *=this.scaleX;
			scaleY *=this.scaleY;
			if (scaleX===1 && scaleY===1){
				this.transform && this.transform.identity();
				}else {
				this.transform || (this.transform=new Matrix());
				this.transform.a=scaleX / (realWidth / canvasWidth);
				this.transform.d=scaleY / (realHeight / canvasHeight);
				this.model && this.model.scale(this.transform.a,this.transform.d);
			}
			canvas.size(canvasWidth,canvasHeight);
			RunDriver.changeWebGLSize(canvasWidth,canvasHeight);
			mat.scale(realWidth / canvasWidth / pixelRatio,realHeight / canvasHeight / pixelRatio);
			if (this._alignH==="left")this.offset.x=0;
			else if (this._alignH==="right")this.offset.x=screenWidth-realWidth;
			else this.offset.x=(screenWidth-realWidth)*0.5 / pixelRatio;
			if (this._alignV==="top")this.offset.y=0;
			else if (this._alignV==="bottom")this.offset.y=screenHeight-realHeight;
			else this.offset.y=(screenHeight-realHeight)*0.5 / pixelRatio;
			if (!this._offset){
				this._offset=new Point(parseInt(canvasStyle.left)|| 0,parseInt(canvasStyle.top)|| 0);
				canvasStyle.left=canvasStyle.top="0px";
			}
			this.offset.x+=this._offset.x;
			this.offset.y+=this._offset.y;
			this.offset.x=Math.round(this.offset.x);
			this.offset.y=Math.round(this.offset.y);
			canvasStyle.top=this._safariOffsetY+"px";
			mat.translate(this.offset.x,this.offset.y);
			this.canvasDegree=0;
			if (rotation){
				if (this._screenMode==="horizontal"){
					mat.rotate(Math.PI / 2);
					mat.translate(screenHeight / pixelRatio,0);
					this.canvasDegree=90;
					}else {
					mat.rotate(-Math.PI / 2);
					mat.translate(0,screenWidth / pixelRatio);
					this.canvasDegree=-90;
				}
			}
			if (mat.a < 0.00000000000001)mat.a=mat.d=0;
			if (mat.tx < 0.00000000000001)mat.tx=0;
			if (mat.ty < 0.00000000000001)mat.ty=0;
			canvasStyle.transformOrigin=canvasStyle.webkitTransformOrigin=canvasStyle.msTransformOrigin=canvasStyle.mozTransformOrigin=canvasStyle.oTransformOrigin="0px 0px 0px";
			canvasStyle.transform=canvasStyle.webkitTransform=canvasStyle.msTransform=canvasStyle.mozTransform=canvasStyle.oTransform="matrix("+mat.toString()+")";
			this.renderingEnabled=true;
			this._repaint=1;
			this.event("resize");
		}

		/**@inheritDoc */
		__proto.repaint=function(){
			this._repaint=1;
		}

		/**@inheritDoc */
		__proto.parentRepaint=function(){}
		/**@private */
		__proto._loop=function(){
			this.render(Render.context,0,0);
			return true;
		}

		/**@private */
		__proto._onmouseMove=function(e){
			this._mouseMoveTime=Browser.now();
		}

		/**@inheritDoc */
		__proto.render=function(context,x,y){
			Render.isFlash && this.repaint();
			this._renderCount++;
			var frameMode=this.frameRate==="mouse" ? (((Browser.now()-this._mouseMoveTime)< 2000)? "fast" :"slow"):this.frameRate;
			var isFastMode=(frameMode!=="slow");
			var isDoubleLoop=(this._renderCount % 2===0);
			var ctx=context;
			Stat.renderSlow=!isFastMode;
			if (isFastMode || isDoubleLoop){
				Stat.loopCount++;
				MouseManager.instance.runEvent();
				Laya.timer._update();
				if (Render.isConchNode){
					var customList=Sprite.CustomList;
					for (var i=0,n=customList.length;i < n;i++){
						customList[i].customRender(customList[i].customContext,0,0);
					}
					return;
				}
				if (this.renderingEnabled){
					Render.isWebGL ? ctx.clear():RunDriver.clear(this._bgColor);
					_super.prototype.render.call(this,context,x,y);
				}
			}
			if (Render.isConchNode)return;
			if (this.renderingEnabled && (isFastMode || !isDoubleLoop)){
				Render.isWebGL && RunDriver.clear(this._bgColor);
				RunDriver.beginFlush();
				context.flush();
				RunDriver.endFinish();
			}
			VectorGraphManager.instance && VectorGraphManager.getInstance().endDispose();
		}

		/**@private */
		__proto._requestFullscreen=function(){
			var element=Browser.document.documentElement;
			if (element.requestFullscreen){
				element.requestFullscreen();
				}else if (element.mozRequestFullScreen){
				element.mozRequestFullScreen();
				}else if (element.webkitRequestFullscreen){
				element.webkitRequestFullscreen();
				}else if (element.msRequestFullscreen){
				element.msRequestFullscreen();
			}
		}

		/**@private */
		__proto._fullScreenChanged=function(){
			Laya.stage.event("fullscreenchange");
		}

		/**退出全屏*/
		__proto.exitFullscreen=function(){
			var document=Browser.document;
			if (document.exitFullscreen){
				document.exitFullscreen();
				}else if (document.mozCancelFullScreen){
				document.mozCancelFullScreen();
				}else if (document.webkitExitFullscreen){
				document.webkitExitFullscreen();
			}
		}

		/**鼠标在 Stage 上的 Y 轴坐标。*/
		__getset(0,__proto,'mouseY',function(){
			return Math.round(MouseManager.instance.mouseY / this.clientScaleY);
		});

		/**当前视窗由缩放模式导致的 Y 轴缩放系数。*/
		__getset(0,__proto,'clientScaleY',function(){
			return this._transform ? this._transform.getScaleY():1;
		});

		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			this.desginWidth=value;
			_super.prototype._$set_width.call(this,value);
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*水平对齐方式。
		*<p><ul>取值范围：
		*<li>"left" ：居左对齐；</li>
		*<li>"center" ：居中对齐；</li>
		*<li>"right" ：居右对齐；</li>
		*</ul></p>
		*默认值为"left"。
		*/
		__getset(0,__proto,'alignH',function(){
			return this._alignH;
			},function(value){
			this._alignH=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			this.desginHeight=value;
			_super.prototype._$set_height.call(this,value);
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*<p>缩放模式。</p>
		*<p><ul>取值范围：
		*<li>"noscale" ：不缩放；</li>
		*<li>"exactfit" ：全屏不等比缩放；</li>
		*<li>"showall" ：最小比例缩放；</li>
		*<li>"noborder" ：最大比例缩放；</li>
		*<li>"full" ：不缩放，stage的宽高等于屏幕宽高；</li>
		*<li>"fixedwidth" ：宽度不变，高度根据屏幕比缩放；</li>
		*<li>"fixedheight" ：高度不变，宽度根据屏幕比缩放；</li>
		*</ul></p>
		*默认值为 "noscale"。
		*/
		__getset(0,__proto,'scaleMode',function(){
			return this._scaleMode;
			},function(value){
			this._scaleMode=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**
		*垂直对齐方式。
		*<p><ul>取值范围：
		*<li>"top" ：居顶部对齐；</li>
		*<li>"middle" ：居中对齐；</li>
		*<li>"bottom" ：居底部对齐；</li>
		*</ul></p>
		*/
		__getset(0,__proto,'alignV',function(){
			return this._alignV;
			},function(value){
			this._alignV=value;
			Laya.timer.callLater(this,this._changeCanvasSize);
		});

		/**舞台的背景颜色，默认为黑色，null为透明。*/
		__getset(0,__proto,'bgColor',function(){
			return this._bgColor;
			},function(value){
			this._bgColor=value;
			this.model && this.model.bgColor(value);
			if (value){
				Render.canvas.style.background=value;
				}else {
				Render.canvas.style.background="none";
			}
		});

		/**当前视窗由缩放模式导致的 X 轴缩放系数。*/
		__getset(0,__proto,'clientScaleX',function(){
			return this._transform ? this._transform.getScaleX():1;
		});

		/**鼠标在 Stage 上的 X 轴坐标。*/
		__getset(0,__proto,'mouseX',function(){
			return Math.round(MouseManager.instance.mouseX / this.clientScaleX);
		});

		/**
		*场景布局类型。
		*<p><ul>取值范围：
		*<li>"none" ：不更改屏幕</li>
		*<li>"horizontal" ：自动横屏</li>
		*<li>"vertical" ：自动竖屏</li>
		*</ul></p>
		*/
		__getset(0,__proto,'screenMode',function(){
			return this._screenMode;
			},function(value){
			this._screenMode=value;
		});

		/**是否开启全屏，用户点击后进入全屏*/
		__getset(0,__proto,'fullScreenEnabled',null,function(value){
			var document=Browser.document;
			var canvas=Render.canvas;
			if (value){
				canvas.addEventListener('mousedown',this._requestFullscreen);
				canvas.addEventListener('touchstart',this._requestFullscreen);
				document.addEventListener("fullscreenchange",this._fullScreenChanged);
				document.addEventListener("mozfullscreenchange",this._fullScreenChanged);
				document.addEventListener("webkitfullscreenchange",this._fullScreenChanged);
				document.addEventListener("msfullscreenchange",this._fullScreenChanged);
				}else {
				canvas.removeEventListener('mousedown',this._requestFullscreen);
				canvas.removeEventListener('touchstart',this._requestFullscreen);
				document.removeEventListener("fullscreenchange",this._fullScreenChanged);
				document.removeEventListener("mozfullscreenchange",this._fullScreenChanged);
				document.removeEventListener("webkitfullscreenchange",this._fullScreenChanged);
				document.removeEventListener("msfullscreenchange",this._fullScreenChanged);
			}
		});

		Stage.SCALE_NOSCALE="noscale";
		Stage.SCALE_EXACTFIT="exactfit";
		Stage.SCALE_SHOWALL="showall";
		Stage.SCALE_NOBORDER="noborder";
		Stage.SCALE_FULL="full";
		Stage.SCALE_FIXED_WIDTH="fixedwidth";
		Stage.SCALE_FIXED_HEIGHT="fixedheight";
		Stage.ALIGN_LEFT="left";
		Stage.ALIGN_RIGHT="right";
		Stage.ALIGN_CENTER="center";
		Stage.ALIGN_TOP="top";
		Stage.ALIGN_MIDDLE="middle";
		Stage.ALIGN_BOTTOM="bottom";
		Stage.SCREEN_NONE="none";
		Stage.SCREEN_HORIZONTAL="horizontal";
		Stage.SCREEN_VERTICAL="vertical";
		Stage.FRAME_FAST="fast";
		Stage.FRAME_SLOW="slow";
		Stage.FRAME_MOUSE="mouse";
		return Stage;
	})(Sprite)


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.shader.d2.fillTexture.FillTextureShader extends laya.webgl.shader.Shader
	var FillTextureShader=(function(_super){
		function FillTextureShader(){
			var vs="attribute vec2 position;\nattribute vec2 texcoord;\nattribute vec4 color;\nuniform vec2 size;\nuniform mat4 mmat;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\nvoid main() {\n  vec4 pos=mmat*vec4(position.x,position.y,0,1 );\n  gl_Position = vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  v_color = color;\n  v_texcoord = texcoord;  \n}";
			var ps="precision mediump float;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\nuniform sampler2D texture;\nuniform vec4 u_texRange;\nuniform vec2 u_offset;\nvoid main() {\n	vec2 newTexCoord;\n	newTexCoord.x = mod(((u_offset.x + v_texcoord.x) * u_texRange.y),u_texRange.y) + u_texRange.x;\n	newTexCoord.y = mod(((u_offset.y + v_texcoord.y) * u_texRange.w),u_texRange.w) + u_texRange.z;\n	vec4 t_color = texture2D(texture, newTexCoord);\n	gl_FragColor = t_color.rgba;\n}";
			FillTextureShader.__super.call(this,vs,ps,"fillTextureShader");
		}

		__class(FillTextureShader,'laya.webgl.shader.d2.fillTexture.FillTextureShader',_super);
		__static(FillTextureShader,
		['shader',function(){return this.shader=new FillTextureShader();}
		]);
		return FillTextureShader;
	})(Shader)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.shader.d2.Shader2X extends laya.webgl.shader.Shader
	var Shader2X=(function(_super){
		function Shader2X(vs,ps,saveName,nameMap){
			this._params2dQuick1=null;
			this._params2dQuick2=null;
			this._shaderValueWidth=NaN;
			this._shaderValueHeight=NaN;
			Shader2X.__super.call(this,vs,ps,saveName,nameMap);
		}

		__class(Shader2X,'laya.webgl.shader.d2.Shader2X',_super);
		var __proto=Shader2X.prototype;
		__proto.upload2dQuick1=function(shaderValue){
			this.upload(shaderValue,this._params2dQuick1 || this._make2dQuick1());
		}

		__proto._make2dQuick1=function(){
			if (!this._params2dQuick1){
				this.activeResource();
				this._params2dQuick1=[];
				var params=this._params,one;
				for (var i=0,n=params.length;i < n;i++){
					one=params[i];
					if (!Render.isFlash && (one.name==="size" || one.name==="mmat" || one.name==="position" || one.name==="texcoord"))continue ;
					this._params2dQuick1.push(one);
				}
			}
			return this._params2dQuick1;
		}

		__proto.detoryResource=function(){
			_super.prototype.detoryResource.call(this);
			this._params2dQuick1=null;
			this._params2dQuick2=null;
		}

		__proto.upload2dQuick2=function(shaderValue){
			this.upload(shaderValue,this._params2dQuick2 || this._make2dQuick2());
		}

		__proto._make2dQuick2=function(){
			if (!this._params2dQuick2){
				this.activeResource();
				this._params2dQuick2=[];
				var params=this._params,one;
				for (var i=0,n=params.length;i < n;i++){
					one=params[i];
					if (!Render.isFlash && (one.name==="size"))continue ;
					this._params2dQuick2.push(one);
				}
			}
			return this._params2dQuick2;
		}

		Shader2X.create=function(vs,ps,saveName,nameMap){
			return new Shader2X(vs,ps,saveName,nameMap);
		}

		return Shader2X;
	})(Shader)


	/**
	*...
	*@author ...
	*/
	//class laya.webgl.shader.d2.skinAnishader.SkinAniShader extends laya.webgl.shader.Shader
	var SkinAniShader1=(function(_super){
		function SkinAniShader(){
			var vs="attribute vec2 position;\nattribute vec2 texcoord;\nattribute vec4 color;\nuniform vec2 size;\nuniform mat4 mmat;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\nvoid main() {\n  vec4 pos=mmat*vec4(position.x,position.y,0,1 );\n  gl_Position = vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,pos.z,1.0);\n  v_color = color;\n  v_texcoord = texcoord;  \n}";
			var ps="precision mediump float;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\nuniform sampler2D texture;\nvoid main() {\n	vec4 t_color = texture2D(texture, v_texcoord);\n	gl_FragColor = t_color.rgba;\n}";
			SkinAniShader.__super.call(this,vs,ps,"SpineShader");
		}

		__class(SkinAniShader,'laya.webgl.shader.d2.skinAnishader.SkinAniShader',_super,'SkinAniShader1');
		__static(SkinAniShader,
		['shader',function(){return this.shader=new SkinAniShader();}
		]);
		return SkinAniShader;
	})(Shader)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.Buffer2D extends laya.webgl.utils.Buffer
	var Buffer2D=(function(_super){
		function Buffer2D(){
			this._maxsize=0;
			this._upload=true;
			this._uploadSize=0;
			Buffer2D.__super.call(this);
			this.lock=true;
		}

		__class(Buffer2D,'laya.webgl.utils.Buffer2D',_super);
		var __proto=Buffer2D.prototype;
		__proto._bufferData=function(){
			this._maxsize=Math.max(this._maxsize,this._byteLength);
			if (Stat.loopCount % 30==0){
				if (this._buffer.byteLength > (this._maxsize+64)){
					this.memorySize=this._buffer.byteLength;
					this._buffer=this._buffer.slice(0,this._maxsize+64);
					this._checkArrayUse();
				}
				this._maxsize=this._byteLength;
			}
			if (this._uploadSize < this._buffer.byteLength){
				this._uploadSize=this._buffer.byteLength;
				Buffer._gl.bufferData(this._bufferType,this._uploadSize,this._bufferUsage);
				this.memorySize=this._uploadSize;
			}
			Buffer._gl.bufferSubData(this._bufferType,0,this._buffer);
		}

		__proto._bufferSubData=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			this._maxsize=Math.max(this._maxsize,this._byteLength);
			if (Stat.loopCount % 30==0){
				if (this._buffer.byteLength > (this._maxsize+64)){
					this.memorySize=this._buffer.byteLength;
					this._buffer=this._buffer.slice(0,this._maxsize+64);
					this._checkArrayUse();
				}
				this._maxsize=this._byteLength;
			}
			if (this._uploadSize < this._buffer.byteLength){
				this._uploadSize=this._buffer.byteLength;
				Buffer._gl.bufferData(this._bufferType,this._uploadSize,this._bufferUsage);
				this.memorySize=this._uploadSize;
			}
			if (dataStart || dataLength){
				var subBuffer=this._buffer.slice(dataStart,dataLength);
				Buffer._gl.bufferSubData(this._bufferType,offset,subBuffer);
				}else {
				Buffer._gl.bufferSubData(this._bufferType,offset,this._buffer);
			}
		}

		__proto._checkArrayUse=function(){}
		__proto._bind_upload=function(){
			if (!this._upload)
				return false;
			this._upload=false;
			this._bind();
			this._bufferData();
			return true;
		}

		__proto._bind_subUpload=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			if (!this._upload)
				return false;
			this._upload=false;
			this._bind();
			this._bufferSubData(offset,dataStart,dataLength);
			return true;
		}

		__proto._resizeBuffer=function(nsz,copy){
			if (nsz < this._buffer.byteLength)
				return this;
			this.memorySize=nsz;
			if (copy && this._buffer && this._buffer.byteLength > 0){
				var newbuffer=new ArrayBuffer(nsz);
				var n=new Uint8Array(newbuffer);
				n.set(new Uint8Array(this._buffer),0);
				this._buffer=newbuffer;
			}else
			this._buffer=new ArrayBuffer(nsz);
			this._checkArrayUse();
			this._upload=true;
			return this;
		}

		__proto.append=function(data){
			this._upload=true;
			var byteLen=0,n;
			byteLen=data.byteLength;
			if ((data instanceof Uint8Array)){
				this._resizeBuffer(this._byteLength+byteLen,true);
				n=new Uint8Array(this._buffer,this._byteLength);
				}else if ((data instanceof Uint16Array)){
				this._resizeBuffer(this._byteLength+byteLen,true);
				n=new Uint16Array(this._buffer,this._byteLength);
				}else if ((data instanceof Float32Array)){
				this._resizeBuffer(this._byteLength+byteLen,true);
				n=new Float32Array(this._buffer,this._byteLength);
			}
			n.set(data,0);
			this._byteLength+=byteLen;
			this._checkArrayUse();
		}

		__proto.getBuffer=function(){
			return this._buffer;
		}

		__proto.setNeedUpload=function(){
			this._upload=true;
		}

		__proto.getNeedUpload=function(){
			return this._upload;
		}

		__proto.upload=function(){
			var scuess=this._bind_upload();
			Buffer._gl.bindBuffer(this._bufferType,null);
			Buffer._bindActive[this._bufferType]=null;
			Shader.activeShader=null
			return scuess;
		}

		__proto.subUpload=function(offset,dataStart,dataLength){
			(offset===void 0)&& (offset=0);
			(dataStart===void 0)&& (dataStart=0);
			(dataLength===void 0)&& (dataLength=0);
			var scuess=this._bind_subUpload();
			Buffer._gl.bindBuffer(this._bufferType,null);
			Buffer._bindActive[this._bufferType]=null;
			Shader.activeShader=null
			return scuess;
		}

		__proto.detoryResource=function(){
			_super.prototype.detoryResource.call(this);
			this._upload=true;
			this._uploadSize=0;
		}

		__proto.clear=function(){
			this._byteLength=0;
			this._upload=true;
		}

		__getset(0,__proto,'bufferLength',function(){
			return this._buffer.byteLength;
		});

		__getset(0,__proto,'byteLength',_super.prototype._$get_byteLength,function(value){
			if (this._byteLength===value)
				return;
			value <=this._buffer.byteLength || (this._resizeBuffer(value *2+256,true));
			this._byteLength=value;
		});

		Buffer2D.__int__=function(gl){
			IndexBuffer2D.QuadrangleIB=IndexBuffer2D.create(0x88E4);
			GlUtils.fillIBQuadrangle(IndexBuffer2D.QuadrangleIB,16);
		}

		Buffer2D.UNICOLOR="UNICOLOR";
		Buffer2D.MVPMATRIX="MVPMATRIX";
		Buffer2D.MATRIX1="MATRIX1";
		Buffer2D.MATRIX2="MATRIX2";
		Buffer2D.DIFFUSETEXTURE="DIFFUSETEXTURE";
		Buffer2D.NORMALTEXTURE="NORMALTEXTURE";
		Buffer2D.SPECULARTEXTURE="SPECULARTEXTURE";
		Buffer2D.EMISSIVETEXTURE="EMISSIVETEXTURE";
		Buffer2D.AMBIENTTEXTURE="AMBIENTTEXTURE";
		Buffer2D.REFLECTTEXTURE="REFLECTTEXTURE";
		Buffer2D.MATRIXARRAY0="MATRIXARRAY0";
		Buffer2D.FLOAT0="FLOAT0";
		Buffer2D.UVAGEX="UVAGEX";
		Buffer2D.CAMERAPOS="CAMERAPOS";
		Buffer2D.ALBEDO="ALBEDO";
		Buffer2D.ALPHATESTVALUE="ALPHATESTVALUE";
		Buffer2D.FOGCOLOR="FOGCOLOR";
		Buffer2D.FOGSTART="FOGSTART";
		Buffer2D.FOGRANGE="FOGRANGE";
		Buffer2D.MATERIALAMBIENT="MATERIALAMBIENT";
		Buffer2D.MATERIALDIFFUSE="MATERIALDIFFUSE";
		Buffer2D.MATERIALSPECULAR="MATERIALSPECULAR";
		Buffer2D.MATERIALREFLECT="MATERIALREFLECT";
		Buffer2D.LIGHTDIRECTION="LIGHTDIRECTION";
		Buffer2D.LIGHTDIRDIFFUSE="LIGHTDIRDIFFUSE";
		Buffer2D.LIGHTDIRAMBIENT="LIGHTDIRAMBIENT";
		Buffer2D.LIGHTDIRSPECULAR="LIGHTDIRSPECULAR";
		Buffer2D.POINTLIGHTPOS="POINTLIGHTPOS";
		Buffer2D.POINTLIGHTRANGE="POINTLIGHTRANGE";
		Buffer2D.POINTLIGHTATTENUATION="POINTLIGHTATTENUATION";
		Buffer2D.POINTLIGHTDIFFUSE="POINTLIGHTDIFFUSE";
		Buffer2D.POINTLIGHTAMBIENT="POINTLIGHTAMBIENT";
		Buffer2D.POINTLIGHTSPECULAR="POINTLIGHTSPECULAR";
		Buffer2D.SPOTLIGHTPOS="SPOTLIGHTPOS";
		Buffer2D.SPOTLIGHTDIRECTION="SPOTLIGHTDIRECTION";
		Buffer2D.SPOTLIGHTSPOT="SPOTLIGHTSPOT";
		Buffer2D.SPOTLIGHTRANGE="SPOTLIGHTRANGE";
		Buffer2D.SPOTLIGHTATTENUATION="SPOTLIGHTATTENUATION";
		Buffer2D.SPOTLIGHTDIFFUSE="SPOTLIGHTDIFFUSE";
		Buffer2D.SPOTLIGHTAMBIENT="SPOTLIGHTAMBIENT";
		Buffer2D.SPOTLIGHTSPECULAR="SPOTLIGHTSPECULAR";
		Buffer2D.TIME="TIME";
		Buffer2D.VIEWPORTSCALE="VIEWPORTSCALE";
		Buffer2D.CURRENTTIME="CURRENTTIME";
		Buffer2D.DURATION="DURATION";
		Buffer2D.GRAVITY="GRAVITY";
		Buffer2D.ENDVELOCITY="ENDVELOCITY";
		Buffer2D.FLOAT32=4;
		Buffer2D.SHORT=2;
		return Buffer2D;
	})(Buffer)


	/**
	*@private
	*<code>FileBitmap</code> 是图片文件资源类。
	*/
	//class laya.resource.FileBitmap extends laya.resource.Bitmap
	var FileBitmap=(function(_super){
		function FileBitmap(){
			this._src=null;
			this._onload=null;
			this._onerror=null;
			FileBitmap.__super.call(this);
		}

		__class(FileBitmap,'laya.resource.FileBitmap',_super);
		var __proto=FileBitmap.prototype;
		/**
		*文件路径全名。
		*/
		__getset(0,__proto,'src',function(){
			return this._src;
			},function(value){
			this._src=value;
		});

		/**
		*载入完成处理函数。
		*/
		__getset(0,__proto,'onload',null,function(value){
		});

		/**
		*错误处理函数。
		*/
		__getset(0,__proto,'onerror',null,function(value){
		});

		return FileBitmap;
	})(Bitmap)


	/**
	*<code>HTMLCanvas</code> 是 Html Canvas 的代理类，封装了 Canvas 的属性和方法。。请不要直接使用 new HTMLCanvas！
	*/
	//class laya.resource.HTMLCanvas extends laya.resource.Bitmap
	var HTMLCanvas=(function(_super){
		function HTMLCanvas(type){
			//this._ctx=null;
			this._is2D=false;
			HTMLCanvas.__super.call(this);
			var _$this=this;
			this._source=this;
			if (type==="2D" || (type==="AUTO" && !Render.isWebGL)){
				this._is2D=true;
				this._source=Browser.createElement("canvas");
				var o=this;
				o.getContext=function (contextID,other){
					if (_$this._ctx)return _$this._ctx;
					var ctx=_$this._ctx=_$this._source.getContext(contextID,other);
					if (ctx){
						ctx._canvas=o;
						if(!Render.isFlash)ctx.size=function (w,h){
						};
					}
					return ctx;
				}
			}else this._source={};
		}

		__class(HTMLCanvas,'laya.resource.HTMLCanvas',_super);
		var __proto=HTMLCanvas.prototype;
		/**
		*清空画布内容。
		*/
		__proto.clear=function(){
			this._ctx && this._ctx.clear();
		}

		/**
		*销毁。
		*/
		__proto.destroy=function(){
			this._ctx && this._ctx.destroy();
			this._ctx=null;
		}

		/**
		*释放。
		*/
		__proto.release=function(){}
		/**
		*@private
		*设置 Canvas 渲染上下文。
		*@param context Canvas 渲染上下文。
		*/
		__proto._setContext=function(context){
			this._ctx=context;
		}

		/**
		*获取 Canvas 渲染上下文。
		*@param contextID 上下文ID.
		*@param other
		*@return Canvas 渲染上下文 Context 对象。
		*/
		__proto.getContext=function(contextID,other){
			return this._ctx ? this._ctx :(this._ctx=HTMLCanvas._createContext(this));
		}

		/**
		*获取内存大小。
		*@return 内存大小。
		*/
		__proto.getMemSize=function(){
			return 0;
		}

		/**
		*设置宽高。
		*@param w 宽度。
		*@param h 高度。
		*/
		__proto.size=function(w,h){
			if (this._w !=w || this._h !=h){
				this._w=w;
				this._h=h;
				this._ctx && this._ctx.size(w,h);
				this._source && (this._source.height=h,this._source.width=w);
			}
		}

		/**
		*Canvas 渲染上下文。
		*/
		__getset(0,__proto,'context',function(){
			return this._ctx;
		});

		/**
		*是否当作 Bitmap 对象。
		*/
		__getset(0,__proto,'asBitmap',null,function(value){
		});

		HTMLCanvas.create=function(type){
			return new HTMLCanvas(type);
		}

		HTMLCanvas.TYPE2D="2D";
		HTMLCanvas.TYPE3D="3D";
		HTMLCanvas.TYPEAUTO="AUTO";
		HTMLCanvas._createContext=null
		return HTMLCanvas;
	})(Bitmap)


	//class laya.webgl.atlas.AtlasWebGLCanvas extends laya.resource.Bitmap
	var AtlasWebGLCanvas=(function(_super){
		function AtlasWebGLCanvas(){
			this._flashCacheImage=null;
			this._flashCacheImageNeedFlush=false;
			AtlasWebGLCanvas.__super.call(this);
		}

		__class(AtlasWebGLCanvas,'laya.webgl.atlas.AtlasWebGLCanvas',_super);
		var __proto=AtlasWebGLCanvas.prototype;
		/***重新创建资源*/
		__proto.recreateResource=function(){
			this.startCreate();
			var gl=WebGL.mainContext;
			var glTex=this._source=gl.createTexture();
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,0x0DE1,glTex);
			gl.texImage2D(0x0DE1,0,0x1908,this._w,this._h,0,0x1908,0x1401,null);
			gl.texParameteri(0x0DE1,0x2801,0x2601);
			gl.texParameteri(0x0DE1,0x2800,0x2601);
			gl.texParameteri(0x0DE1,0x2802,0x812F);
			gl.texParameteri(0x0DE1,0x2803,0x812F);
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
			this.memorySize=this._w *this._h *4;
			this.compoleteCreate();
		}

		/***销毁资源*/
		__proto.detoryResource=function(){
			if (this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this.memorySize=0;
			}
		}

		/**采样image到WebGLTexture的一部分*/
		__proto.texSubImage2D=function(xoffset,yoffset,bitmap){
			if (!Render.isFlash){
				var gl=WebGL.mainContext;
				var preTarget=WebGLContext.curBindTexTarget;
				var preTexture=WebGLContext.curBindTexValue;
				WebGLContext.bindTexture(gl,0x0DE1,this._source);
				(xoffset-1 >=0)&& (gl.texSubImage2D(0x0DE1,0,xoffset-1,yoffset,0x1908,0x1401,bitmap));
				(xoffset+1 <=this._w)&& (gl.texSubImage2D(0x0DE1,0,xoffset+1,yoffset,0x1908,0x1401,bitmap));
				(yoffset-1 >=0)&& (gl.texSubImage2D(0x0DE1,0,xoffset,yoffset-1,0x1908,0x1401,bitmap));
				(yoffset+1 <=this._h)&& (gl.texSubImage2D(0x0DE1,0,xoffset,yoffset+1,0x1908,0x1401,bitmap));
				gl.texSubImage2D(0x0DE1,0,xoffset,yoffset,0x1908,0x1401,bitmap);
				(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
				}else {
				if (!this._flashCacheImage){
					this._flashCacheImage=HTMLImage.create(null);
					this._flashCacheImage.image.createCanvas(this._w,this._h);
				};
				var bmData=bitmap.bitmapdata;
				(xoffset-1 >=0)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width-1,bmData.height,xoffset,yoffset));
				(xoffset+1 <=this._w)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width+1,bmData.height,xoffset,yoffset));
				(yoffset-1 >=0)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width,bmData.height-1,xoffset,yoffset));
				(yoffset+1 <=this._h)&& (this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width+1,bmData.height,xoffset,yoffset));
				this._flashCacheImage.image.copyPixels(bmData,0,0,bmData.width,bmData.height,xoffset,yoffset);
				(this._flashCacheImageNeedFlush)|| (this._flashCacheImageNeedFlush=true);
			}
		}

		/**采样image到WebGLTexture的一部分*/
		__proto.texSubImage2DPixel=function(xoffset,yoffset,width,height,pixel){
			var gl=WebGL.mainContext;
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,0x0DE1,this._source);
			var pixels=new Uint8Array(pixel.data);
			gl.texSubImage2D(0x0DE1,0,xoffset,yoffset,width,height,0x1908,0x1401,pixels);
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
		}

		/***
		*设置图片宽度
		*@param value 图片宽度
		*/
		__getset(0,__proto,'width',_super.prototype._$get_width,function(value){
			this._w=value;
		});

		/***
		*设置图片高度
		*@param value 图片高度
		*/
		__getset(0,__proto,'height',_super.prototype._$get_height,function(value){
			this._h=value;
		});

		return AtlasWebGLCanvas;
	})(Bitmap)


	/**
	*...
	*@author
	*/
	//class laya.webgl.resource.WebGLCharImage extends laya.resource.Bitmap
	var WebGLCharImage=(function(_super){
		function WebGLCharImage(canvas,char){
			this.borderSize=12;
			//this._ctx=null;
			//this._allowMerageInAtlas=false;
			//this._enableMerageInAtlas=false;
			//this.canvas=null;
			//this.char=null;
			WebGLCharImage.__super.call(this);
			this.canvas=canvas;
			this.char=char;
			this._enableMerageInAtlas=true;
			var bIsConchApp=Render.isConchApp;
			if (bIsConchApp){
				this._ctx=canvas;
				}else {
				this._ctx=canvas.getContext('2d',undefined);
			};
			var xs=char.xs,ys=char.ys;
			var t=null;
			if (bIsConchApp){
				this._ctx.font=char.font;
				t=this._ctx.measureText(char.char);
				char.width=t.width *xs;
				char.height=t.height *ys;
				}else {
				t=Utils.measureText(char.char,char.font);
				char.width=t.width *xs;
				char.height=t.height *ys;
			}
			this.onresize(char.width+this.borderSize *2,char.height+this.borderSize *2);
		}

		__class(WebGLCharImage,'laya.webgl.resource.WebGLCharImage',_super);
		var __proto=WebGLCharImage.prototype;
		Laya.imps(__proto,{"laya.webgl.resource.IMergeAtlasBitmap":true})
		__proto.recreateResource=function(){
			this.startCreate();
			var char=this.char;
			var bIsConchApp=Render.isConchApp;
			var xs=char.xs,ys=char.ys;
			this.onresize(char.width+this.borderSize *2,char.height+this.borderSize *2);
			this.canvas && (this.canvas.height=this._h,this.canvas.width=this._w);
			if (bIsConchApp){
				var nFontSize=char.fontSize;
				if (xs !=1 || ys !=1){
					nFontSize=parseInt(nFontSize*((xs>ys)?xs:ys)+"");
				};
				var sFont="normal 100 "+nFontSize+"px Arial";
				if (char.borderColor){
					sFont+=" 1 "+char.borderColor;
				}
				this._ctx.font=sFont;
				this._ctx.textBaseline="top";
				this._ctx.fillStyle=char.fillColor;
				this._ctx.fillText(char.char,this.borderSize,this.borderSize,null,null,null);
				}else {
				this._ctx.save();
				(this._ctx).clearRect(0,0,char.width+this.borderSize *2,char.height+this.borderSize *2);
				this._ctx.font=char.font;
				this._ctx.textBaseline="top";
				this._ctx.translate(this.borderSize,this.borderSize);
				if (xs !=1 || ys !=1){
					this._ctx.scale(xs,ys);
				}
				if (char.fillColor && char.borderColor){
					this._ctx.strokeStyle=char.borderColor;
					this._ctx.lineWidth=char.lineWidth;
					this._ctx.strokeText(char.char,0,0,null,null,0,null);
					this._ctx.fillStyle=char.fillColor;
					this._ctx.fillText(char.char,0,0,null,null,null);
					}else {
					if (char.lineWidth===-1){
						this._ctx.fillStyle=char.fillColor ? char.fillColor :"white";
						this._ctx.fillText(char.char,0,0,null,null,null);
						}else {
						this._ctx.strokeStyle=char.borderColor?char.borderColor:'white';
						this._ctx.lineWidth=char.lineWidth;
						this._ctx.strokeText(char.char,0,0,null,null,0,null);
					}
				}
				this._ctx.restore();
			}
			char.borderSize=this.borderSize;
			this.compoleteCreate();
		}

		__proto.onresize=function(w,h){
			this._w=w;
			this._h=h;
			if ((this._w < AtlasResourceManager.atlasLimitWidth && this._h < AtlasResourceManager.atlasLimitHeight)){
				this._allowMerageInAtlas=true
				}else {
				this._allowMerageInAtlas=false;
				throw new Error("文字尺寸超出大图合集限制！");
			}
		}

		__proto.clearAtlasSource=function(){}
		/**
		*是否创建私有Source
		*@return 是否创建
		*/
		__getset(0,__proto,'allowMerageInAtlas',function(){
			return this._allowMerageInAtlas;
		});

		__getset(0,__proto,'atlasSource',function(){
			return this.canvas;
		});

		/**
		*是否创建私有Source,通常禁止修改
		*@param value 是否创建
		*/
		/**
		*是否创建私有Source
		*@return 是否创建
		*/
		__getset(0,__proto,'enableMerageInAtlas',function(){
			return this._enableMerageInAtlas;
			},function(value){
			this._enableMerageInAtlas=value;
		});

		return WebGLCharImage;
	})(Bitmap)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.resource.WebGLRenderTarget extends laya.resource.Bitmap
	var WebGLRenderTarget=(function(_super){
		function WebGLRenderTarget(width,height,surfaceFormat,surfaceType,depthStencilFormat,mipMap,repeat,minFifter,magFifter){
			//this._frameBuffer=null;
			//this._depthStencilBuffer=null;
			//this._surfaceFormat=0;
			//this._surfaceType=0;
			//this._depthStencilFormat=0;
			//this._mipMap=false;
			//this._repeat=false;
			//this._minFifter=0;
			//this._magFifter=0;
			(surfaceFormat===void 0)&& (surfaceFormat=0x1908);
			(surfaceType===void 0)&& (surfaceType=0x1401);
			(depthStencilFormat===void 0)&& (depthStencilFormat=0x81A5);
			(mipMap===void 0)&& (mipMap=false);
			(repeat===void 0)&& (repeat=false);
			(minFifter===void 0)&& (minFifter=-1);
			(magFifter===void 0)&& (magFifter=1);
			WebGLRenderTarget.__super.call(this);
			this._w=width;
			this._h=height;
			this._surfaceFormat=surfaceFormat;
			this._surfaceType=surfaceType;
			this._depthStencilFormat=depthStencilFormat;
			this._mipMap=mipMap;
			this._repeat=repeat;
			this._minFifter=minFifter;
			this._magFifter=magFifter;
		}

		__class(WebGLRenderTarget,'laya.webgl.resource.WebGLRenderTarget',_super);
		var __proto=WebGLRenderTarget.prototype;
		__proto.recreateResource=function(){
			this.startCreate();
			var gl=WebGL.mainContext;
			this._frameBuffer || (this._frameBuffer=gl.createFramebuffer());
			this._source || (this._source=gl.createTexture());
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,0x0DE1,this._source);
			gl.texImage2D(0x0DE1,0,0x1908,this._w,this._h,0,this._surfaceFormat,this._surfaceType,null);
			var minFifter=this._minFifter;
			var magFifter=this._magFifter;
			var repeat=this._repeat ? 0x2901 :0x812F;
			var isPot=Arith.isPOT(this._w,this._h);
			if (isPot){
				if (this._mipMap)
					(minFifter!==-1)|| (minFifter=0x2703);
				else
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2802,repeat);
				gl.texParameteri(0x0DE1,0x2803,repeat);
				this._mipMap && gl.generateMipmap(0x0DE1);
				}else {
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2802,0x812F);
				gl.texParameteri(0x0DE1,0x2803,0x812F);
			}
			gl.bindFramebuffer(0x8D40,this._frameBuffer);
			gl.framebufferTexture2D(0x8D40,0x8CE0,0x0DE1,this._source,0);
			if (this._depthStencilFormat){
				this._depthStencilBuffer || (this._depthStencilBuffer=gl.createRenderbuffer());
				gl.bindRenderbuffer(0x8D41,this._depthStencilBuffer);
				gl.renderbufferStorage(0x8D41,this._depthStencilFormat,this._w,this._h);
				switch (this._depthStencilFormat){
					case 0x81A5:
						gl.framebufferRenderbuffer(0x8D40,0x8D00,0x8D41,this._depthStencilBuffer);
						break ;
					case 0x8D48:
						gl.framebufferRenderbuffer(0x8D40,0x8D20,0x8D41,this._depthStencilBuffer);
						break ;
					case 0x84F9:
						gl.framebufferRenderbuffer(0x8D40,0x821A,0x8D41,this._depthStencilBuffer);
						break ;
					}
			}
			gl.bindFramebuffer(0x8D40,null);
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
			gl.bindRenderbuffer(0x8D41,null);
			this.memorySize=this._w *this._h *4;
			this.compoleteCreate();
		}

		__proto.detoryResource=function(){
			if (this._frameBuffer){
				WebGL.mainContext.deleteTexture(this._source);
				WebGL.mainContext.deleteFramebuffer(this._frameBuffer);
				WebGL.mainContext.deleteRenderbuffer(this._depthStencilBuffer);
				this._source=null;
				this._frameBuffer=null;
				this._depthStencilBuffer=null;
				this.memorySize=0;
			}
		}

		__getset(0,__proto,'depthStencilBuffer',function(){
			return this._depthStencilBuffer;
		});

		__getset(0,__proto,'frameBuffer',function(){
			return this._frameBuffer;
		});

		return WebGLRenderTarget;
	})(Bitmap)


	//class laya.webgl.shader.d2.value.TextSV extends laya.webgl.shader.d2.value.TextureSV
	var TextSV=(function(_super){
		function TextSV(args){
			TextSV.__super.call(this,0x40);
			this.defines.add(0x40);
		}

		__class(TextSV,'laya.webgl.shader.d2.value.TextSV',_super);
		var __proto=TextSV.prototype;
		__proto.release=function(){
			TextSV.pool[TextSV._length++]=this;
			this.clear();
		}

		__proto.clear=function(){
			_super.prototype.clear.call(this);
		}

		TextSV.create=function(){
			if (TextSV._length)return TextSV.pool[--TextSV._length];
			else return new TextSV(null);
		}

		TextSV.pool=[];
		TextSV._length=0;
		return TextSV;
	})(TextureSV)


	/**
	*...
	*@author anling
	*/
	//class entity.Item extends entity.Entity
	var Item=(function(_super){
		function Item(){
			this._sign=false;
			Item.__super.call(this);
			this.tag=Math.round(Math.random()*(8-2))+1;
			this.loadImage("fruit/item_"+this.tag+".png");
			this.size(80,80);
			this.pivot(this.width / 2,this.height / 2);
		}

		__class(Item,'entity.Item',_super);
		var __proto=Item.prototype;
		__proto.removeAction=function(){
			Tween.to(this,{scaleX:0,scaleY:0},200,null,Handler.create(this,this.remove));
		}

		__proto.remove=function(){
			this.removeSelf();
			Pool.recover("item",this);
		}

		__proto.reset=function(){
			this.tag=Math.round(Math.random()*(8-2))+1;
			this.sign=false;
			var texture=Laya.loader.getRes("fruit/item_"+this.tag+".png");
			this.graphics.clear();
			this.graphics.drawTexture(texture,0,0);
			this.playAddAnime();
		}

		__proto.playAddAnime=function(){
			var scaleAction=new TimeLine();
			scaleAction.to(this,{scaleX:1.5,scaleY:1.5},100)
			.to(this,{scaleX:1.0,scaleY:1.0},100);
			scaleAction.play();
		}

		__getset(0,__proto,'sign',function(){
			return this._sign;
			},function(value){
			this._sign=value;
		});

		return Item;
	})(Entity)


	/**
	*...
	*@author anling
	*/
	//class entity.PacMan extends entity.Entity
	var PacMan=(function(_super){
		function PacMan(){
			this._dir=1;
			this._stomach=null;
			PacMan.__super.call(this);
			this.tag=0;
			this._stomach=StomachManager.getInstance();
			this.loadImage("fruit/pacMan.png");
			this.size(80,80);
			this.pivot(this.width / 2,this.height / 2);
		}

		__class(PacMan,'entity.PacMan',_super);
		var __proto=PacMan.prototype;
		__proto.eatItem=function(item){
			var action=new TimeLine();
			var flipX=this._dir==0 ?-1 :1;
			action.to(this,{scaleX:1.5 *flipX,scaleY:1.5},200 / 2)
			.to(this,{scaleX:1.0 *flipX,scaleY:1.0},200 / 2);
			action.play();
			this._stomach.pushItem(item);
		}

		__proto.turnTo=function(angle){
			if (angle==0){
				this._dir=1;
				}else if (angle==90){
				this._dir=3;
				}else if (angle==180){
				this._dir=0;
				this.rotation=0;
				this.scale(-1,1);
				return;
				}else if (angle==270){
				this._dir=2;
			}
			this.scale(1,1);
			this.rotation=angle;
		}

		__getset(0,__proto,'dir',function(){
			return this._dir;
		});

		PacMan.LEFT=0;
		PacMan.RIGHT=1;
		PacMan.UP=2;
		PacMan.DOWN=3;
		return PacMan;
	})(Entity)


	/**
	*<p><code>Input</code> 类用于创建显示对象以显示和输入文本。</p>
	*
	*@example 以下示例代码，创建了一个 <code>Text</code> 实例。
	*<listing version="3.0">
	*package
	*{
		*import laya.display.Input;
		*import laya.events.Event;
		*public class Input_Example
		*{
			*private var input:Input;
			*public function Input_Example()
			*{
				*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
				*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
				*onInit();
				*}
			*private function onInit():void
			*{
				*input=new Input();//创建一个 Input 类的实例对象 input 。
				*input.text="这个是一个 Input 文本示例。";
				*input.color="#008fff";//设置 input 的文本颜色。
				*input.font="Arial";//设置 input 的文本字体。
				*input.bold=true;//设置 input 的文本显示为粗体。
				*input.fontSize=30;//设置 input 的字体大小。
				*input.wordWrap=true;//设置 input 的文本自动换行。
				*input.x=100;//设置 input 对象的属性 x 的值，用于控制 input 对象的显示位置。
				*input.y=100;//设置 input 对象的属性 y 的值，用于控制 input 对象的显示位置。
				*input.width=300;//设置 input 的宽度。
				*input.height=200;//设置 input 的高度。
				*input.italic=true;//设置 input 的文本显示为斜体。
				*input.borderColor="#fff000";//设置 input 的文本边框颜色。
				*Laya.stage.addChild(input);//将 input 添加到显示列表。
				*input.on(Event.FOCUS,this,onFocus);//给 input 对象添加获得焦点事件侦听。
				*input.on(Event.BLUR,this,onBlur);//给 input 对象添加失去焦点事件侦听。
				*input.on(Event.INPUT,this,onInput);//给 input 对象添加输入字符事件侦听。
				*input.on(Event.ENTER,this,onEnter);//给 input 对象添加敲回车键事件侦听。
				*}
			*private function onFocus():void
			*{
				*trace("输入框 input 获得焦点。");
				*}
			*private function onBlur():void
			*{
				*trace("输入框 input 失去焦点。");
				*}
			*private function onInput():void
			*{
				*trace("用户在输入框 input 输入字符。文本内容：",input.text);
				*}
			*private function onEnter():void
			*{
				*trace("用户在输入框 input 内敲回车键。");
				*}
			*}
		*}
	*</listing>
	*<listing version="3.0">
	*var input;
	*Input_Example();
	*function Input_Example()
	*{
		*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
		*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
		*onInit();
		*}
	*function onInit()
	*{
		*input=new laya.display.Input();//创建一个 Input 类的实例对象 input 。
		*input.text="这个是一个 Input 文本示例。";
		*input.color="#008fff";//设置 input 的文本颜色。
		*input.font="Arial";//设置 input 的文本字体。
		*input.bold=true;//设置 input 的文本显示为粗体。
		*input.fontSize=30;//设置 input 的字体大小。
		*input.wordWrap=true;//设置 input 的文本自动换行。
		*input.x=100;//设置 input 对象的属性 x 的值，用于控制 input 对象的显示位置。
		*input.y=100;//设置 input 对象的属性 y 的值，用于控制 input 对象的显示位置。
		*input.width=300;//设置 input 的宽度。
		*input.height=200;//设置 input 的高度。
		*input.italic=true;//设置 input 的文本显示为斜体。
		*input.borderColor="#fff000";//设置 input 的文本边框颜色。
		*Laya.stage.addChild(input);//将 input 添加到显示列表。
		*input.on(laya.events.Event.FOCUS,this,onFocus);//给 input 对象添加获得焦点事件侦听。
		*input.on(laya.events.Event.BLUR,this,onBlur);//给 input 对象添加失去焦点事件侦听。
		*input.on(laya.events.Event.INPUT,this,onInput);//给 input 对象添加输入字符事件侦听。
		*input.on(laya.events.Event.ENTER,this,onEnter);//给 input 对象添加敲回车键事件侦听。
		*}
	*function onFocus()
	*{
		*console.log("输入框 input 获得焦点。");
		*}
	*function onBlur()
	*{
		*console.log("输入框 input 失去焦点。");
		*}
	*function onInput()
	*{
		*console.log("用户在输入框 input 输入字符。文本内容：",input.text);
		*}
	*function onEnter()
	*{
		*console.log("用户在输入框 input 内敲回车键。");
		*}
	*</listing>
	*<listing version="3.0">
	*import Input=laya.display.Input;
	*class Input_Example {
		*private input:Input;
		*constructor(){
			*Laya.init(640,800);//设置游戏画布宽高、渲染模式。
			*Laya.stage.bgColor="#efefef";//设置画布的背景颜色。
			*this.onInit();
			*}
		*private onInit():void {
			*this.input=new Input();//创建一个 Input 类的实例对象 input 。
			*this.input.text="这个是一个 Input 文本示例。";
			*this.input.color="#008fff";//设置 input 的文本颜色。
			*this.input.font="Arial";//设置 input 的文本字体。
			*this.input.bold=true;//设置 input 的文本显示为粗体。
			*this.input.fontSize=30;//设置 input 的字体大小。
			*this.input.wordWrap=true;//设置 input 的文本自动换行。
			*this.input.x=100;//设置 input 对象的属性 x 的值，用于控制 input 对象的显示位置。
			*this.input.y=100;//设置 input 对象的属性 y 的值，用于控制 input 对象的显示位置。
			*this.input.width=300;//设置 input 的宽度。
			*this.input.height=200;//设置 input 的高度。
			*this.input.italic=true;//设置 input 的文本显示为斜体。
			*this.input.borderColor="#fff000";//设置 input 的文本边框颜色。
			*Laya.stage.addChild(this.input);//将 input 添加到显示列表。
			*this.input.on(laya.events.Event.FOCUS,this,this.onFocus);//给 input 对象添加获得焦点事件侦听。
			*this.input.on(laya.events.Event.BLUR,this,this.onBlur);//给 input 对象添加失去焦点事件侦听。
			*this.input.on(laya.events.Event.INPUT,this,this.onInput);//给 input 对象添加输入字符事件侦听。
			*this.input.on(laya.events.Event.ENTER,this,this.onEnter);//给 input 对象添加敲回车键事件侦听。
			*}
		*private onFocus():void {
			*console.log("输入框 input 获得焦点。");
			*}
		*private onBlur():void {
			*console.log("输入框 input 失去焦点。");
			*}
		*private onInput():void {
			*console.log("用户在输入框 input 输入字符。文本内容：",this.input.text);
			*}
		*private onEnter():void {
			*console.log("用户在输入框 input 内敲回车键。");
			*}
		*}
	*</listing>
	*/
	//class laya.display.Input extends laya.display.Text
	var Input=(function(_super){
		function Input(){
			this._focus=false;
			this._multiline=false;
			this._editable=true;
			this._restrictPattern=null;
			this.inputElementXAdjuster=0;
			this.inputElementYAdjuster=0;
			this._prompt='';
			this._promptColor="#A9A9A9";
			this._originColor="#000000";
			this._content='';
			Input.__super.call(this);
			this._maxChars=1E5;
			this._width=100;
			this._height=20;
			this.multiline=false;
			this.overflow=Text.SCROLL;
			this.on("mousedown",this,this._onMouseDown);
			this.on("undisplay",this,this._onUnDisplay);
		}

		__class(Input,'laya.display.Input',_super);
		var __proto=Input.prototype;
		/**@private */
		__proto._onUnDisplay=function(e){
			this.focus=false;
		}

		/**@private */
		__proto._onMouseDown=function(e){
			this.focus=true;
			Browser.document.addEventListener(Browser.enableTouch ? "touchstart" :"mousedown",laya.display.Input._checkBlur);
		}

		/**@inheritDoc*/
		__proto.render=function(context,x,y){
			laya.display.Sprite.prototype.render.call(this,context,x,y);
		}

		/**
		*在输入期间，如果 Input 实例的位置改变，调用该方法同步输入框的位置。
		*/
		__proto._syncInputTransform=function(){
			var style=this.nativeInput.style;
			var stage=Laya.stage;
			var rec;
			rec=Utils.getGlobalPosAndScale(this);
			var a=stage._canvasTransform.a,d=stage._canvasTransform.d;
			var x=(rec.x+this.padding[3]+this.inputElementXAdjuster)*stage.clientScaleX *a+Math.max(0,stage.offset.x);
			var y=(rec.y+this.padding[0]+this.inputElementYAdjuster)*stage.clientScaleY *d+Math.max(0,stage.offset.y);
			Input.inputContainer.setPos(x,y);
			var inputWid=this._width-this.padding[1]-this.padding[3];
			var inputHei=this._height-this.padding[0]-this.padding[2];
			this.nativeInput.setSize(inputWid,inputHei);
			if (Render.isConchApp){
				this.nativeInput.setPos(x,y);
			}
			if (!this._getVisible())this.focus=false;
			if (stage.transform || rec.width !=1 || rec.height !=1 || a !=1 || d !=1){
				x=stage.clientScaleX *a *rec.width;
				y=stage.clientScaleY *d *rec.height;
				var ts="scale("+x+","+y+")";
				if (ts !=style.transform){
					style.transform=ts;
					if (Render.isConchApp){
						this.nativeInput.setScale(x,y);
					}
				}
			}
		}

		/**@private */
		__proto._getVisible=function(){
			var target=this;
			while (target){
				if (target.visible===false)return false;
				target=target.parent;
			}
			return true;
		}

		/**选中所有文本。*/
		__proto.select=function(){
			this.nativeInput.select();
		}

		/**@private 设置输入法（textarea或input）*/
		__proto._setInputMethod=function(){
			Input.input.parentElement && (Input.inputContainer.removeChild(Input.input));
			Input.area.parentElement && (Input.inputContainer.removeChild(Input.area));
			Input.inputElement=(this._multiline ? Input.area :Input.input);
			Input.inputContainer.appendChild(Input.inputElement);
		}

		/**@private */
		__proto._focusIn=function(){
			var input=this.nativeInput;
			this._focus=true;
			var cssStyle=input.style;
			cssStyle.whiteSpace=(this.wordWrap ? "pre-wrap" :"nowrap");
			this._setPromptColor();
			input.readOnly=!this._editable;
			input.maxLength=this._maxChars;
			var padding=this.padding;
			input.value=this._content;
			input.type=this.asPassword ? "password" :"text";
			input.placeholder=this._prompt;
			Laya.stage.off("keydown",this,this._onKeyDown);
			Laya.stage.on("keydown",this,this._onKeyDown);
			Laya.stage.focus=this;
			this.event("focus");
			if (Browser.onPC)input.focus();
			var temp=this._text;
			this._text=null;
			this.typeset();
			input.setColor(this._originColor);
			input.setFontSize(this.fontSize);
			input.setFontFace(this.font);
			if (Render.isConchApp){
				input.setMultiAble && input.setMultiAble(this._multiline);
			}
			cssStyle.lineHeight=(this.leading+this.fontSize)+"px";
			cssStyle.fontStyle=(this.italic ? "italic" :"normal");
			cssStyle.fontWeight=(this.bold ? "bold" :"normal");
			cssStyle.textAlign=this.align;
			cssStyle.padding="0 0";
			this._syncInputTransform();
			if (!Render.isConchApp && Browser.onPC)
				Laya.timer.frameLoop(1,this,this._syncInputTransform);
		}

		// 设置DOM输入框提示符颜色。
		__proto._setPromptColor=function(){
			Input.promptStyleDOM=Browser.getElementById("promptStyle");
			if (!Input.promptStyleDOM){
				Input.promptStyleDOM=Browser.createElement("style");
				Browser.document.head.appendChild(Input.promptStyleDOM);
			}
			Input.promptStyleDOM.innerText="input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {"+"color:"+this._promptColor+"}"+"input:-moz-placeholder, textarea:-moz-placeholder {"+"color:"+this._promptColor+"}"+"input::-moz-placeholder, textarea::-moz-placeholder {"+"color:"+this._promptColor+"}"+"input:-ms-input-placeholder, textarea:-ms-input-placeholder {"+"color:"+this._promptColor+"}";
		}

		/**@private */
		__proto._focusOut=function(){
			this._focus=false;
			this._text=null;
			this._content=Input.inputElement.value;
			if (!this._content){
				_super.prototype._$set_text.call(this,this._prompt);
				_super.prototype._$set_color.call(this,this._promptColor);
			}
			else{
				_super.prototype._$set_text.call(this,this._content);
				_super.prototype._$set_color.call(this,this._originColor);
			}
			Laya.stage.off("keydown",this,this._onKeyDown);
			Laya.stage.focus=null;
			this.event("blur");
			if (Render.isConchApp)this.nativeInput.blur();
			Browser.onPC && Laya.timer.clear(this,this._syncInputTransform);
			Browser.document.removeEventListener(Browser.enableTouch ? "touchstart" :"mousedown",laya.display.Input._checkBlur);
		}

		/**@private */
		__proto._onKeyDown=function(e){
			if (e.keyCode===13){
				if (Browser.onMobile && !this._multiline)
					this.focus=false;
				this.event("enter");
			}
		}

		/**@inheritDoc */
		__getset(0,__proto,'color',_super.prototype._$get_color,function(value){
			if (this._focus)
				this.nativeInput.setColor(value);
			_super.prototype._$set_color.call(this,this._content?value:this._promptColor);
			this._originColor=value;
		});

		/**表示是否是多行输入框。*/
		__getset(0,__proto,'multiline',function(){
			return this._multiline;
			},function(value){
			this._multiline=value;
			this.valign=value ? "top" :"middle";
		});

		/**
		*字符数量限制，默认为10000。
		*设置字符数量限制时，小于等于0的值将会限制字符数量为10000。
		*/
		__getset(0,__proto,'maxChars',function(){
			return this._maxChars;
			},function(value){
			if (value <=0)
				value=1E5;
			this._maxChars=value;
		});

		/**@inheritDoc */
		__getset(0,__proto,'text',function(){
			if (this._focus)
				return this.nativeInput.value;
			else
			return this._text || "";
			},function(value){
			_super.prototype._$set_color.call(this,this._originColor);
			value+='';
			if (this._focus){
				this.nativeInput.value=value || '';
				this.event("change");
			}
			else{
				if (!this._multiline)
					value=value.replace(/\r?\n/g,'');
				this._content=value;
				if(value)
					_super.prototype._$set_text.call(this,value);
				else{
					_super.prototype._$set_text.call(this,this._prompt);
					_super.prototype._$set_color.call(this,this.promptColor);
				}
			}
		});

		/**
		*获取对输入框的引用实例。
		*/
		__getset(0,__proto,'nativeInput',function(){
			return this._multiline ? Input.area :Input.input;
		});

		/**
		*设置输入提示符。
		*/
		__getset(0,__proto,'prompt',function(){
			return this._prompt;
			},function(value){
			if (!this._text && value)
				_super.prototype._$set_color.call(this,this._promptColor);
			this.promptColor=this._promptColor;
			if(this._text)
				_super.prototype._$set_text.call(this,(this._text==this._prompt)?value:this._text);
			else
			_super.prototype._$set_text.call(this,value);
			this._prompt=value;
		});

		// 因此 调用focus接口是无法都在移动平台立刻弹出键盘的
		/**
		*表示焦点是否在显示对象上。
		*/
		__getset(0,__proto,'focus',function(){
			return this._focus;
			},function(value){
			var input=this.nativeInput;
			if (this._focus!==value){
				laya.display.Input.isInputting=value;
				if (value){
					input.target && (input.target.focus=false);
					input.target=this;
					this._setInputMethod();
					Browser.container.appendChild(Input.inputContainer);
					this._focusIn();
				}
				else{
					input.target=null;
					this._focusOut();
					Browser.container.removeChild(Input.inputContainer);
					if (Render.isConchApp){
						input.setPos(-10000,-10000);
					}
				}
			}
		});

		/**限制输入的字符。*/
		__getset(0,__proto,'restrict',function(){
			if (this._restrictPattern){
				return this._restrictPattern.source;
			}
			return "";
			},function(pattern){
			if (pattern){
				pattern="[^"+pattern+"]";
				if (pattern.indexOf("^^")>-1)
					pattern=pattern.replace("^^","");
				this._restrictPattern=new RegExp(pattern,"g");
			}
			else
			this._restrictPattern=null;
		});

		/**
		*是否可编辑。
		*/
		__getset(0,__proto,'editable',function(){
			return this._editable;
			},function(value){
			this._editable=value;
		});

		/**
		*设置输入提示符颜色。
		*/
		__getset(0,__proto,'promptColor',function(){
			return this._promptColor;
			},function(value){
			this._promptColor=value;
			if (!this._content)_super.prototype._$set_color.call(this,value);
		});

		Input.__init__=function(){
			Input._createInputElement();
			if (Browser.onMobile){
				Render.canvas.addEventListener(Input.IOS_IFRAME ? "click" :"touchend",Input._popupInputMethod);
			}
		}

		Input._popupInputMethod=function(){
			if (!laya.display.Input.isInputting)return;
			var input=laya.display.Input.inputElement;
			input.selectionStart=input.selectionEnd=input.value.length;
			input.focus();
			Laya.timer.once(300,null,function(){
				input.scrollIntoView();
			});
		}

		Input._createInputElement=function(){
			Input._initInput(Input.area=Browser.createElement("textarea"));
			Input._initInput(Input.input=Browser.createElement("input"));
			Input.inputContainer=Browser.createElement("div");
			Input.inputContainer.style.position="absolute";
			Input.inputContainer.appendChild(Input.input);
			Input.inputContainer.appendChild(Input.area);
			Input.inputContainer.setPos=function (x,y){Input.inputContainer.style.left=x+'px';Input.inputContainer.style.top=y+'px';};
		}

		Input._initInput=function(input){
			var style=input.style;
			style.cssText="position:absolute;overflow:hidden;resize:none;z-index:999;transform-origin:0 0;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-o-transform-origin:0 0;";
			style.resize='none';
			style.backgroundColor='transparent';
			style.border='none';
			style.outline='none';
			input.addEventListener('input',Input._processInputting);
			input.addEventListener('mousemove',Input._stopEvent);
			input.addEventListener('mousedown',Input._stopEvent);
			input.addEventListener('touchmove',Input._stopEvent);
			if(!Render.isConchApp){
				input.setColor=function (color){input.style.color=color;};
				input.setFontSize=function (fontSize){input.style.fontSize=fontSize+'px';};
				input.setSize=function (w,h){input.style.width=w+'px';input.style.height=h+'px';};
			}
			input.setFontFace=function (fontFace){input.style.fontFamily=fontFace;};
		}

		Input._processInputting=function(e){
			var input=laya.display.Input.inputElement.target;
			var value=laya.display.Input.inputElement.value;
			if (input._restrictPattern){
				value=value.replace(input._restrictPattern,"");
				var prevIndex=Input.inputElement.selectionStart;
				laya.display.Input.inputElement.value=value;
				laya.display.Input.inputElement.selectionStart=laya.display.Input.inputElement.selectionEnd=prevIndex;
			}
			input._text=value;
			input.event("input");
		}

		Input._stopEvent=function(e){
			if(e.type=='touchmove')
				e.preventDefault();
			e.stopPropagation && e.stopPropagation();
		}

		Input._checkBlur=function(e){
			if (e.target !=laya.display.Input.input && e.target !=laya.display.Input.area && e.target !=Input.confirmButton){
				laya.display.Input.inputElement.target.focus=false;
			}
		}

		Input.input=null
		Input.area=null
		Input.inputElement=null
		Input.inputContainer=null
		Input.confirmButton=null
		Input.promptStyleDOM=null
		Input.inputHeight=45;
		Input.isInputting=false;
		__static(Input,
		['IOS_IFRAME',function(){return this.IOS_IFRAME=(Browser.onIOS && Browser.window.top !=Browser.window.self);}
		]);
		return Input;
	})(Text)


	/**
	*<code>HTMLImage</code> 用于创建 HTML Image 元素。
	*/
	//class laya.resource.HTMLImage extends laya.resource.FileBitmap
	var HTMLImage=(function(_super){
		function HTMLImage(src){
			this._recreateLock=false;
			this._needReleaseAgain=false;
			HTMLImage.__super.call(this);
			this._init_(src);
		}

		__class(HTMLImage,'laya.resource.HTMLImage',_super);
		var __proto=HTMLImage.prototype;
		__proto._init_=function(src){
			this._src=src;
			this._source=new Browser.window.Image();
			if (src.indexOf("data:image")!=0)this._source.crossOrigin="";
			(src)&& (this._source.src=src);
		}

		/**
		*@inheritDoc
		*/
		__proto.recreateResource=function(){
			var _$this=this;
			if (this._src==="")
				throw new Error("src no null！");
			this._needReleaseAgain=false;
			if (!this._source){
				this._recreateLock=true;
				this.startCreate();
				var _this=this;
				this._source=new Browser.window.Image();
				this._source.crossOrigin="";
				this._source.onload=function (){
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._source.onload=null;
						_this._source=null;
						return;
					}
					_this._source.onload=null;
					_this.memorySize=_$this._w *_$this._h *4;
					_this._recreateLock=false;
					_this.compoleteCreate();
				};
				this._source.src=this._src;
				}else {
				if (this._recreateLock)
					return;
				this.startCreate();
				this.memorySize=this._w *this._h *4;
				this._recreateLock=false;
				this.compoleteCreate();
			}
		}

		/**
		*@inheritDoc
		*/
		__proto.detoryResource=function(){
			if (this._recreateLock)
				this._needReleaseAgain=true;
			(this._source)&& (this._source=null,this.memorySize=0);
		}

		/***调整尺寸。*/
		__proto.onresize=function(){
			this._w=this._source.width;
			this._h=this._source.height;
		}

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._source && (this._source.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/**
		*@inheritDoc
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._source && (this._source.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		HTMLImage.create=function(src){
			return new HTMLImage(src);
		}

		return HTMLImage;
	})(FileBitmap)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.IndexBuffer2D extends laya.webgl.utils.Buffer2D
	var IndexBuffer2D=(function(_super){
		function IndexBuffer2D(bufferUsage){
			this._uint8Array=null;
			this._uint16Array=null;
			(bufferUsage===void 0)&& (bufferUsage=0x88E4);
			IndexBuffer2D.__super.call(this);
			this._bufferUsage=bufferUsage;
			this._bufferType=0x8893;
			Render.isFlash || (this._buffer=new ArrayBuffer(8));
		}

		__class(IndexBuffer2D,'laya.webgl.utils.IndexBuffer2D',_super);
		var __proto=IndexBuffer2D.prototype;
		__proto._checkArrayUse=function(){
			this._uint8Array && (this._uint8Array=new Uint8Array(this._buffer));
			this._uint16Array && (this._uint16Array=new Uint16Array(this._buffer));
		}

		__proto.getUint8Array=function(){
			return this._uint8Array || (this._uint8Array=new Uint8Array(this._buffer));
		}

		__proto.getUint16Array=function(){
			return this._uint16Array || (this._uint16Array=new Uint16Array(this._buffer));
		}

		IndexBuffer2D.QuadrangleIB=null
		IndexBuffer2D.create=function(bufferUsage){
			(bufferUsage===void 0)&& (bufferUsage=0x88E4);
			return new IndexBuffer2D(bufferUsage);
		}

		return IndexBuffer2D;
	})(Buffer2D)


	/**
	*...
	*@author laya
	*/
	//class laya.webgl.utils.VertexBuffer2D extends laya.webgl.utils.Buffer2D
	var VertexBuffer2D=(function(_super){
		function VertexBuffer2D(vertexStride,bufferUsage){
			this._floatArray32=null;
			this._vertexStride=0;
			VertexBuffer2D.__super.call(this);
			this._vertexStride=vertexStride;
			this._bufferUsage=bufferUsage;
			this._bufferType=0x8892;
			Render.isFlash || (this._buffer=new ArrayBuffer(8));
			this.getFloat32Array();
		}

		__class(VertexBuffer2D,'laya.webgl.utils.VertexBuffer2D',_super);
		var __proto=VertexBuffer2D.prototype;
		__proto.getFloat32Array=function(){
			return this._floatArray32 || (this._floatArray32=new Float32Array(this._buffer));
		}

		__proto.bind=function(ibBuffer){
			(ibBuffer)&& (ibBuffer._bind());
			this._bind();
		}

		__proto.insertData=function(data,pos){
			var vbdata=this.getFloat32Array();
			vbdata.set(data,pos);
			this._upload=true;
		}

		__proto.bind_upload=function(ibBuffer){
			(ibBuffer._bind_upload())|| (ibBuffer._bind());
			(this._bind_upload())|| (this._bind());
		}

		__proto._checkArrayUse=function(){
			this._floatArray32 && (this._floatArray32=new Float32Array(this._buffer));
		}

		__proto.detoryResource=function(){
			_super.prototype.detoryResource.call(this);
			for (var i=0;i < 10;i++)
			WebGL.mainContext.disableVertexAttribArray(i);
		}

		__getset(0,__proto,'vertexStride',function(){
			return this._vertexStride;
		});

		VertexBuffer2D.create=function(vertexStride,bufferUsage){
			(bufferUsage===void 0)&& (bufferUsage=0x88E8);
			return new VertexBuffer2D(vertexStride,bufferUsage);
		}

		return VertexBuffer2D;
	})(Buffer2D)


	/**
	*...
	*@author
	*/
	//class laya.webgl.resource.WebGLImage extends laya.resource.HTMLImage
	var WebGLImage=(function(_super){
		function WebGLImage(src){
			this._image=null;
			this._allowMerageInAtlas=false;
			this._enableMerageInAtlas=false;
			this.repeat=false;
			this.mipmap=false;
			this.minFifter=0;
			this.magFifter=0;
			WebGLImage.__super.call(this,src);
			this.repeat=false;
			this.mipmap=false;
			this.minFifter=-1;
			this.magFifter=-1;
			this._src=src;
			this._image=new Browser.window.Image();
			this._image.crossOrigin="";
			(src)&& (this._image.src=src);
			this._enableMerageInAtlas=true;
		}

		__class(WebGLImage,'laya.webgl.resource.WebGLImage',_super);
		var __proto=WebGLImage.prototype;
		Laya.imps(__proto,{"laya.webgl.resource.IMergeAtlasBitmap":true})
		__proto._init_=function(src){}
		__proto._createWebGlTexture=function(){
			if (!this._image){
				throw "create GLTextur err:no data:"+this._image;
			};
			var gl=WebGL.mainContext;
			var glTex=this._source=gl.createTexture();
			var preTarget=WebGLContext.curBindTexTarget;
			var preTexture=WebGLContext.curBindTexValue;
			WebGLContext.bindTexture(gl,0x0DE1,glTex);
			gl.texImage2D(0x0DE1,0,0x1908,0x1908,0x1401,this._image);
			var minFifter=this.minFifter;
			var magFifter=this.magFifter;
			var repeat=this.repeat ? 0x2901 :0x812F;
			var isPot=Arith.isPOT(this._w,this._h);
			if (isPot){
				if (this.mipmap)
					(minFifter!==-1)|| (minFifter=0x2703);
				else
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2802,repeat);
				gl.texParameteri(0x0DE1,0x2803,repeat);
				this.mipmap && gl.generateMipmap(0x0DE1);
				}else {
				(minFifter!==-1)|| (minFifter=0x2601);
				(magFifter!==-1)|| (magFifter=0x2601);
				gl.texParameteri(0x0DE1,0x2801,minFifter);
				gl.texParameteri(0x0DE1,0x2800,magFifter);
				gl.texParameteri(0x0DE1,0x2802,0x812F);
				gl.texParameteri(0x0DE1,0x2803,0x812F);
			}
			(preTarget && preTexture)&& (WebGLContext.bindTexture(gl,preTarget,preTexture));
			this._image.onload=null;
			this._image=null;
			if (isPot)
				this.memorySize=this._w *this._h *4 *(1+1 / 3);
			else
			this.memorySize=this._w *this._h *4;
			this._recreateLock=false;
		}

		/***重新创建资源，如果异步创建中被强制释放再创建，则需等待释放完成后再重新加载创建。*/
		__proto.recreateResource=function(){
			var _$this=this;
			if (this._src==null || this._src==="")
				return;
			this._needReleaseAgain=false;
			if (!this._image){
				this._recreateLock=true;
				this.startCreate();
				var _this=this;
				this._image=new Browser.window.Image();
				this._image.crossOrigin="";
				this._image.onload=function (){
					if (_this._needReleaseAgain){
						_this._needReleaseAgain=false;
						_this._image.onload=null;
						_this._image=null;
						return;
					}
					(!(_this._allowMerageInAtlas && _this._enableMerageInAtlas))? (_this._createWebGlTexture()):(_$this.memorySize=0,_$this._recreateLock=false);
					_this.compoleteCreate();
				};
				this._image.src=this._src;
				}else {
				if (this._recreateLock){
					return;
				}
				this.startCreate();
				(!(this._allowMerageInAtlas && this._enableMerageInAtlas))? (this._createWebGlTexture()):(this.memorySize=0,this._recreateLock=false);
				this.compoleteCreate();
			}
		}

		/***销毁资源*/
		__proto.detoryResource=function(){
			if (this._recreateLock){
				this._needReleaseAgain=true;
			}
			if (this._source){
				WebGL.mainContext.deleteTexture(this._source);
				this._source=null;
				this._image=null;
				this.memorySize=0;
			}
		}

		/***调整尺寸*/
		__proto.onresize=function(){
			this._w=this._image.width;
			this._h=this._image.height;
			(AtlasResourceManager.enabled)&& (this._w < AtlasResourceManager.atlasLimitWidth && this._h < AtlasResourceManager.atlasLimitHeight)? this._allowMerageInAtlas=true :this._allowMerageInAtlas=false;
		}

		__proto.clearAtlasSource=function(){
			this._image=null;
		}

		/**
		*返回HTML Image,as3无internal货friend，通常禁止开发者修改image内的任何属性
		*@param HTML Image
		*/
		__getset(0,__proto,'image',function(){
			return this._image;
		});

		/**
		*是否创建私有Source
		*@return 是否创建
		*/
		__getset(0,__proto,'allowMerageInAtlas',function(){
			return this._allowMerageInAtlas;
		});

		__getset(0,__proto,'atlasSource',function(){
			return this._image;
		});

		/**
		*是否创建私有Source,通常禁止修改
		*@param value 是否创建
		*/
		/**
		*是否创建私有Source
		*@return 是否创建
		*/
		__getset(0,__proto,'enableMerageInAtlas',function(){
			return this._enableMerageInAtlas;
			},function(value){
			this._enableMerageInAtlas=value;
		});

		/***
		*设置onload函数
		*@param value onload函数
		*/
		__getset(0,__proto,'onload',null,function(value){
			var _$this=this;
			this._onload=value;
			this._image && (this._image.onload=this._onload !=null ? (function(){
				_$this.onresize();
				_$this._onload();
			}):null);
		});

		/***
		*设置onerror函数
		*@param value onerror函数
		*/
		__getset(0,__proto,'onerror',null,function(value){
			var _$this=this;
			this._onerror=value;
			this._image && (this._image.onerror=this._onerror !=null ? (function(){
				_$this._onerror()
			}):null);
		});

		return WebGLImage;
	})(HTMLImage)


	Laya.__init([EventDispatcher,TimeLine,Render,Browser,WebGLContext,WebGLContext2D,LoaderManager,RenderTargetMAX,Timer,DrawText,AtlasGrid,ShaderCompile]);
	new Main();

})(window,document,Laya);
