import { DataTexture, HalfFloatType, UnsignedByteType, RGBAFormat, NearestFilter, type Vector4, type Material } from 'three';
export type MotionMeta={width:number;height:number;rowsPerFrame:number;frameCount:number;vertexCount:number;nativeFrames:number[];sampleFPS:number;columns:number;nativeStride:number;normalEncoding?:string;framesPerClip?:number;clips?:Record<'calm'|'light'|'gust'|'recovery',[number,number]>};
export type ClothAtlas={meta:MotionMeta;positions:DataTexture;normals:DataTexture};
const cache=new Map<string,Promise<ClothAtlas>>();
async function texture(url:string,meta:MotionMeta,normal=false){
 const r=await fetch(url);if(!r.ok)throw new Error(`Cloth cache ${r.status}`);
 if(!r.body)throw new Error('Empty cloth cache');
 // Fetch already decodes a Content-Encoding:gzip response. Static hosts that
 // serve the .gz bytes without that header need the explicit stream decoder.
 const bytes=r.headers.get('content-encoding')?.includes('gzip')?await r.arrayBuffer():await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 const packed=normal&&meta.normalEncoding==='unorm8';
 if(bytes.byteLength!==meta.width*meta.height*(packed?4:8))throw new Error('Cloth cache size mismatch');
 const t=new DataTexture(packed?new Uint8Array(bytes):new Uint16Array(bytes),meta.width,meta.height,RGBAFormat,packed?UnsignedByteType:HalfFloatType);t.minFilter=t.magFilter=NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;
}
export function loadNativeCloth(tier:string){
 if(!cache.has(tier))cache.set(tier,(async()=>{const r=await fetch(`/full-world/${tier}-motion.json`);if(!r.ok)throw new Error('Missing motion metadata');const meta=await r.json() as MotionMeta;const [positions,normals]=await Promise.all([texture(`/full-world/${tier}-positions.bin.gz`,meta),texture(`/full-world/${tier}-normals.bin.gz`,meta,true)]);return {meta,positions,normals};})());
 return cache.get(tier)!;
}
export type ClothUniforms={clipStride:{value:number};body:{value:number};pointer:{value:Vector4};obstacle:{value:Vector4};interaction:{value:number};a:{value:number};b:{value:number};mix:{value:number};time:{value:number};edge:{value:number};packedNormal:{value:number};positions:{value:DataTexture};normals:{value:DataTexture};shape:{value:{x:number;y:number;z:number;w:number}}};
export function clothMaterial(material:Material,u:ClothUniforms,depth=false,silk=true){
 material.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{phucClipStride:u.clipStride,phucBody:u.body,phucA:u.a,phucB:u.b,phucMix:u.mix,phucTime:u.time,phucEdge:u.edge,phucPackedNormal:u.packedNormal,phucPositions:u.positions,phucNormals:u.normals,phucAtlas:u.shape,phucPointer:u.pointer,phucObstacle:u.obstacle,phucInteraction:u.interaction});
  s.vertexShader=s.vertexShader.replace('#include <common>',`#include <common>
  uniform sampler2D phucPositions,phucNormals;uniform vec4 phucAtlas,phucPointer,phucObstacle;uniform float phucInteraction;uniform float phucClipStride,phucBody,phucA,phucB,phucMix,phucTime,phucEdge,phucPackedNormal;
  attribute float phucId,phucPin,phucWidth;attribute vec2 phucGrid;attribute vec3 phucWeft;
  vec2 phucTexel(float frame){float row=floor(phucId/phucAtlas.x);return vec2((mod(phucId,phucAtlas.x)+.5)/phucAtlas.x,(frame*phucAtlas.z+row+.5)/phucAtlas.y);}
  vec3 phucPair(sampler2D data,float offset){return mix(texture2D(data,phucTexel(phucA+offset)).xyz,texture2D(data,phucTexel(phucB+offset)).xyz,phucMix);}
  vec3 phucRead(sampler2D data){float a=floor(clamp(phucBody,0.,2.)),b=min(2.,a+1.);return mix(phucPair(data,a*phucClipStride),phucPair(data,b*phucClipStride),fract(min(phucBody,1.99999)));}
  float phucNoise(float x){float a=floor(x),q=fract(x);q=q*q*(3.-2.*q);return mix(fract(sin(a*127.1)*43758.5453),fract(sin((a+1.)*127.1)*43758.5453),q)*2.-1.;}
  float phucAngle(vec2 q){float edge=pow(abs(q.y*2.-1.),8.);float p=phucNoise(phucTime*2.4-q.x*13.7)+.31*phucNoise(phucTime*4.7-q.x*27.2);return edge*p*phucEdge*(1.-smoothstep(.05,.85,phucPin));}
  vec2 phucCurl(){float v=phucGrid.y;if(v>.18&&v<.82)return vec2(0.);float b=v<.18?.18:.82,r=(v-b)*phucWidth;vec2 delta=vec2(0.);for(int i=0;i<4;i++){float a=phucAngle(vec2(phucGrid.x,mix(b,v,(float(i)+.5)/4.)));delta+=vec2(cos(a)-1.,sin(a))*r/4.;}return delta;}
  `);
  s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   vec3 clothNormal=${depth?'normalize(phucRead(phucNormals)*mix(1.,2.,phucPackedNormal)-phucPackedNormal)':'phucBodyNormal'};vec3 clothWeft=normalize(phucWeft-clothNormal*dot(phucWeft,clothNormal));vec2 curl=phucCurl();transformed+=phucRead(phucPositions)+clothWeft*curl.x+clothNormal*curl.y;
   vec4 projected=projectionMatrix*modelViewMatrix*vec4(transformed,1.);vec2 screenPoint=projected.xy/projected.w;
   float brush=exp(-dot(screenPoint-phucPointer.xy,screenPoint-phucPointer.xy)/.018)*phucPointer.w;
   vec2 nearest=clamp(screenPoint,phucObstacle.xy,phucObstacle.zw);float clearance=length(screenPoint-nearest);
   float avoid=(1.-smoothstep(.015,.10,clearance))*phucInteraction;
   float freeCloth=1.-smoothstep(.05,.85,phucPin);
   transformed+=clothNormal*(brush*.23*phucInteraction*freeCloth)+vec3(avoid*.32*freeCloth,0.,0.);

  `);
  if(!depth)s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
   vec3 phucBodyNormal=normalize(phucRead(phucNormals)*mix(1.,2.,phucPackedNormal)-phucPackedNormal);objectNormal=phucBodyNormal;float angle=phucAngle(phucGrid);vec3 weft=normalize(phucWeft-objectNormal*dot(phucWeft,objectNormal));objectNormal=normalize(objectNormal*cos(angle)-weft*sin(angle));
   #ifdef USE_TANGENT
    objectTangent=normalize(cross(weft,objectNormal))*tangent.w;
   #endif
  `);
  if(!depth&&silk){s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 #ifdef USE_ROUGHNESSMAP
 roughnessFactor=.49+.13*texture2D(roughnessMap,vRoughnessMapUv).g;
 #endif`);s.fragmentShader=s.fragmentShader.replace('#include <alphamap_fragment>',`#ifdef USE_ALPHAMAP
   diffuseColor.a *= mix(.92,1.0,texture2D(alphaMap,vAlphaMapUv).g);
  #endif`);s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   float opticalPath=1./max(.24,abs(dot(nonPerturbedNormal,normalize(vViewPosition))));
   diffuseColor.a=min(.92,1.-pow(max(.001,1.-diffuseColor.a),opticalPath));
  `);s.fragmentShader=s.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
   #if NUM_DIR_LIGHTS > 0
   for(int i=0;i<NUM_DIR_LIGHTS;i++){
    float through=pow(max(dot(-normal,directionalLights[i].direction),0.),1.2);
    float grazing=pow(1.-abs(dot(normal,normalize(vViewPosition))),2.);
    reflectedLight.directDiffuse+=diffuseColor.rgb*directionalLights[i].color*through*(.14+.32*grazing);
   }
   #endif
  `);}
 };
 material.customProgramCacheKey=()=>`PHUC-native-vertex-cache-v51-tangent-corrected-${depth?'shadow':silk?'silk':'clay'}`;
}
