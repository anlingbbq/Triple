package laya.d3.graphics {
	import laya.d3.core.MeshSprite3D;
	import laya.d3.core.Sprite3D;
	import laya.d3.core.material.Material;
	import laya.d3.core.render.IRenderable;
	import laya.d3.core.render.RenderElement;
	import laya.d3.core.render.RenderQueue;
	import laya.d3.core.render.RenderState;
	import laya.d3.core.scene.BaseScene;
	import laya.d3.math.Matrix4x4;
	import laya.d3.shader.ShaderDefines3D;
	import laya.d3.utils.Utils3D;
	import laya.utils.Stat;
	import laya.webgl.WebGLContext;
	import laya.webgl.shader.Shader;
	import laya.webgl.utils.Buffer2D;
	import laya.webgl.utils.ValusArray;
	
	/**
	 * @private
	 * <code>StaticBatch</code> 类用于静态批处理。
	 */
	public class StaticBatch implements IRenderable {
		public static var maxVertexCount:int = 65535;
		
		private static function _addToRenderQueueStaticBatch(scene:BaseScene, sprite3D:Sprite3D):void {
			var i:int, n:int;
			if ((sprite3D is MeshSprite3D) && (sprite3D.isStatic))//TODO:可能会移除,目前只针对MeshSprite3D
			{
				var renderElements:Vector.<RenderElement> = (sprite3D as MeshSprite3D).meshRender.renderCullingObject._renderElements;
				for (i = 0, n = renderElements.length; i < n; i++) {
					var renderElement:RenderElement = renderElements[i];
					if (renderElement.renderObj.VertexBufferCount === 1)//VertexBufferCount必须等于1
						scene._staticBatchManager._addPrepareRenderElement(renderElement);
				}
			}
			
			for (i = 0, n = sprite3D.numChildren; i < n; i++)
				_addToRenderQueueStaticBatch(scene, sprite3D._childs[i] as Sprite3D);
		}
		
		/**
		 * 合并节点为静态批处理。
		 * @param staticBatchRoot 静态批处理根节点。
		 */
		public static function combine(staticBatchRoot:Sprite3D):void {
			var scene:BaseScene = staticBatchRoot.scene;
			if (!scene)
				throw new Error("BaseScene: staticBatchRoot is not a part of scene.");
			
			_addToRenderQueueStaticBatch(scene, staticBatchRoot);
			scene._staticBatchManager._finishCombineStaticBatch(staticBatchRoot);
		}
		
		public var _vertexDeclaration:VertexDeclaration;
		public var _material:Material;
		
		private var _vertexBuffer:VertexBuffer3D;
		private var _indexBuffer:IndexBuffer3D;
		private var _renderElements:Vector.<RenderElement>;
		
		private var _combineRenderElementPool:Vector.<RenderElement>;
		private var _combineRenderElementPoolIndex:int;
		
		private var _combineRenderElements:Vector.<RenderElement>;
		private var _currentCombineVertexCount:int;
		private var _currentCombineIndexCount:int;
		
		private var _needFinishCombine:Boolean;
		
		public var _rootSprite:Sprite3D;
		
		public function get indexOfHost():int {
			return 0;
		}
		
		public function get VertexBufferCount():int {
			return 1;
		}
		
		public function get triangleCount():int {
			return _indexBuffer.indexCount / 3;
		}
		
		public function getVertexBuffer(index:int = 0):VertexBuffer3D {
			if (index === 0)
				return _vertexBuffer;
			else
				return null;
		}
		
		public function getIndexBuffer():IndexBuffer3D {
			return _indexBuffer;
		}
		
		public function StaticBatch(rootSprite:Sprite3D, vertexDeclaration:VertexDeclaration, material:Material) {
			_currentCombineVertexCount = 0;
			_currentCombineIndexCount = 0;
			_needFinishCombine = false;
			_renderElements = new Vector.<RenderElement>();
			_combineRenderElements = new Vector.<RenderElement>();
			
			_combineRenderElementPool = new Vector.<RenderElement>();
			_combineRenderElementPoolIndex = 0;
			
			_rootSprite = rootSprite;
			_vertexDeclaration = vertexDeclaration;
			_material = material;
		}
		
		private function _getShader(state:RenderState, vertexBuffer:VertexBuffer3D, material:Material):Shader {
			if (!material)
				return null;
			var def:int = 0;
			var shaderAttribute:* = vertexBuffer.vertexDeclaration.shaderAttribute;
			(shaderAttribute.UV) && (def |= material.shaderDef);
			(shaderAttribute.COLOR) && (def |= ShaderDefines3D.COLOR);
			(state.scene.enableFog) && (def |= ShaderDefines3D.FOG);
			def > 0 && state.shaderDefs.addInt(def);
			var shader:Shader = material.getShader(state);
			return shader;
		}
		
		private function _getCombineRenderElementFromPool():RenderElement {
			var renderElement:RenderElement = _combineRenderElementPool[_combineRenderElementPoolIndex++];
			return renderElement || (_combineRenderElementPool[_combineRenderElementPoolIndex - 1] = new RenderElement());
		}
		
		public function _addCombineRenderObjTest(renderElement:RenderElement):Boolean {
			var renderObj:IRenderable = renderElement.renderObj;
			var vertexCount:int = _currentCombineVertexCount + renderObj.getVertexBuffer().vertexCount;
			if (vertexCount > maxVertexCount) {
				return false;
			}
			return true;
		}
		
		public function _addCombineRenderObj(renderElement:RenderElement):void {
			var renderObj:IRenderable = renderElement.renderObj;
			_combineRenderElements.push(renderElement);
			renderElement._staticBatch = this;
			_currentCombineIndexCount = _currentCombineIndexCount + renderObj.getIndexBuffer().indexCount;
			_currentCombineVertexCount = _currentCombineVertexCount + renderObj.getVertexBuffer().vertexCount;
			_needFinishCombine = true;
		}
		
		public function _deleteCombineRenderObj(renderElement:RenderElement):void {
			var renderObj:IRenderable = renderElement.renderObj;
			var index:int = _combineRenderElements.indexOf(renderElement);
			if (index !== -1) {
				_combineRenderElements.splice(index, 1);
				renderElement._staticBatch = null;
				_currentCombineIndexCount = _currentCombineIndexCount - renderObj.getIndexBuffer().indexCount;
				_currentCombineVertexCount = _currentCombineVertexCount - renderObj.getVertexBuffer().vertexCount;
				_needFinishCombine = true;
			}
		}
		
		public function _finshCombine():void {
			if (_needFinishCombine) {//TODO:合并前应处理排序
				var curMerVerCount:int = 0;
				var curIndexCount:int = 0;
				
				var vertexDatas:Float32Array = new Float32Array(_vertexDeclaration.vertexStride / 4 * _currentCombineVertexCount);
				var indexDatas:Uint16Array = new Uint16Array(_currentCombineIndexCount);
				
				if (_vertexBuffer) {
					_vertexBuffer.dispose();
					_indexBuffer.dispose();
				}
				_vertexBuffer = VertexBuffer3D.create(_vertexDeclaration, _currentCombineVertexCount, WebGLContext.STATIC_DRAW);
				_indexBuffer = IndexBuffer3D.create(IndexBuffer3D.INDEXTYPE_USHORT, _currentCombineIndexCount, WebGLContext.STATIC_DRAW);
				
				for (var i:int = 0, n:int = _combineRenderElements.length; i < n; i++) {
					var renderElement:RenderElement = _combineRenderElements[i];
					var subVertexDatas:Float32Array = renderElement.getStaticBatchBakedVertexs(0);
					var subIndexDatas:Uint16Array = renderElement.getBakedIndices();
					
					var indexOffset:int = curMerVerCount / (_vertexDeclaration.vertexStride / 4);
					var indexStart:int = curIndexCount;
					var indexEnd:int = indexStart + subIndexDatas.length;
					
					renderElement._batchIndexStart = indexStart;
					renderElement._batchIndexEnd = indexEnd;
					
					indexDatas.set(subIndexDatas, curIndexCount);
					for (var k:int = indexStart; k < indexEnd; k++)
						indexDatas[k] = indexOffset + indexDatas[k];
					curIndexCount += subIndexDatas.length;
					
					vertexDatas.set(subVertexDatas, curMerVerCount);
					curMerVerCount += subVertexDatas.length;
				}
				
				_vertexBuffer.setData(vertexDatas);
				_indexBuffer.setData(indexDatas);
				_needFinishCombine = false;
			}
		}
		
		public function _clearRenderElements():void {
			_renderElements.length = 0;
		}
		
		public function _addRenderElement(renderElement:RenderElement):void {
			for (var i:int = 0, n:int = _renderElements.length; i < n; i++) {
				if (_renderElements[i]._batchIndexStart > renderElement._batchIndexStart) {
					_renderElements.splice(i, 0, renderElement);
					return;
				}
			}
			_renderElements.push(renderElement);
		}
		
		public function _getRenderElement(mergeElements:Array):void {
			_combineRenderElementPoolIndex = 0;//归零对象池
			
			var length:int = _renderElements.length;
			var merageElement:RenderElement = _getCombineRenderElementFromPool();
			merageElement._type = 1;//代表StaticBatch
			merageElement._staticBatch = null;
			merageElement.renderObj = this;
			
			merageElement._batchIndexStart = _renderElements[0]._batchIndexStart;
			merageElement._batchIndexEnd = _renderElements[0]._batchIndexEnd;
			merageElement._material = _material;
			merageElement._material = _material;
			mergeElements.push(merageElement);
			
			if (length > 1) {
				for (var i:int = 1; i < length; i++) {
					var renderElement:RenderElement = _renderElements[i];
					if (_renderElements[i - 1]._batchIndexEnd !== renderElement._batchIndexStart) {
						merageElement = _getCombineRenderElementFromPool();
						merageElement._type = 1;//代表StaticBatch
						merageElement._staticBatch = null;
						merageElement.renderObj = this;
						
						merageElement._batchIndexStart = renderElement._batchIndexStart;
						merageElement._batchIndexEnd = renderElement._batchIndexEnd;
						merageElement._material = _material;
						mergeElements.push(merageElement);
					} else {
						merageElement._batchIndexEnd = renderElement._batchIndexEnd;
					}
				}
			}
		
		}
		
		public function _addToRenderQueue(scene:BaseScene):void {
			(_renderElements.length > 0) && (scene.getRenderQueue(_material.renderQueue)._addStaticBatch(this));//TODO:>0移到外层
		}
		
		public function _render(state:RenderState):Boolean {
			var vb:VertexBuffer3D = _vertexBuffer;
			var ib:IndexBuffer3D = _indexBuffer;
			var material:Material = state.renderElement._material;
			
			//if (material.normalTexture && !vb.vertexDeclaration.shaderAttribute[VertexElementUsage.TANGENT0]) {
			////是否放到事件触发。
			//var vertexDatas:Float32Array = vb.getData();
			//var newVertexDatas:Float32Array = Utils3D.generateTangent(vertexDatas, vb.vertexDeclaration.vertexStride / 4, vb.vertexDeclaration.shaderAttribute[VertexElementUsage.POSITION0][4] / 4, vb.vertexDeclaration.shaderAttribute[VertexElementUsage.TEXTURECOORDINATE0][4] / 4, ib.getData());
			//var vertexDeclaration:VertexDeclaration = Utils3D.getVertexTangentDeclaration(vb.vertexDeclaration.getVertexElements());
			//
			//var newVB:VertexBuffer3D = VertexBuffer3D.create(vertexDeclaration, WebGLContext.STATIC_DRAW);
			//newVB.setData(newVertexDatas);
			//vb.dispose();
			//_vertexBuffer = vb = newVB;
			//}
			
			vb._bind();
			ib._bind();
			
			if (material) {
				var shader:Shader = _getShader(state, vb, material);
				var presz:int = state.shaderValue.length;
				state.shaderValue.pushArray(vb.vertexDeclaration.shaderValues);
				var worldMat:Matrix4x4 = _rootSprite.transform.worldMatrix;
				state.shaderValue.pushValue(Buffer2D.MATRIX1, worldMat.elements, -1);
				Matrix4x4.multiply(state.projectionViewMatrix, worldMat, _rootSprite.wvpMatrix);
				state.shaderValue.pushValue(Buffer2D.MVPMATRIX, _rootSprite.wvpMatrix.elements, /*state.camera.transform._worldTransformModifyID + state.camera._projectionMatrixModifyID,从结构上应该从Mesh更新*/ -1);
				if (!material.upload(state, null, shader)) {
					state.shaderValue.length = presz;
					return false;
				}
				state.shaderValue.length = presz;
			}
			var indexCount:int = state._batchIndexEnd - state._batchIndexStart;
			state.context.drawElements(WebGLContext.TRIANGLES, indexCount, WebGLContext.UNSIGNED_SHORT, state._batchIndexStart * 2);
			Stat.drawCall++;
			Stat.trianglesFaces += indexCount / 3;
			return true;
		}
	}

}