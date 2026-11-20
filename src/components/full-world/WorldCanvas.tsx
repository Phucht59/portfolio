import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { useGLTF, useTexture, MeshReflectorMaterial } from '@react-three/drei';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { AgXToneMapping, FogExp2, BackSide, BufferAttribute, Color, DataTexture, DoubleSide, MathUtils, Mesh, MeshDepthMaterial, MeshPhysicalMaterial, PCFShadowMap, SRGBColorSpace, PMREMGenerator, RGBADepthPacking, RepeatWrapping, ShaderMaterial, Vector2, Vector3, Vector4, type DirectionalLight, type HemisphereLight, type PerspectiveCamera, type Texture } from 'three';
import { worldAssets } from './assetRegistry';
import { clothMaterial, loadNativeCloth, type ClothAtlas, type ClothUniforms } from './NativeCloth';
import { environmentBlend, makeNightSky } from './FabricLighting';
import { makeMarble } from './MarbleMaterial';
import { LowerRibbon } from './LowerRibbon';
import type { MeshReflectorMaterial as ReflectorMaterialImpl } from '@react-three/drei/materials/MeshReflectorMaterial';

import type { SceneLayout } from '../scene/useSceneLayout';
type Props={layout:SceneLayout;night:boolean;paused:boolean;reduced:boolean;hidden:boolean;onReady:()=>void;onFail:(e:Error)=>void};
const skyVertex=`varying vec3 worldDirection;void main(){worldDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const skyFragment=`varying vec3 worldDirection;uniform float nightMix;uniform sampler2D tSky,tSkyMoon;
 #include <common>
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
 void main(){vec3 d=normalize(worldDirection);float horizon=pow(max(d.y,0.),.45);vec3 day=mix(vec3(.44,.63,.80),vec3(.08,.25,.50),horizon),moon=mix(vec3(.055,.092,.17),vec3(.006,.015,.046),horizon);
 vec2 p=d.xz/max(.15,d.y+.22)*1.7;float cloud=.57*noise(p)+.28*noise(p*2.1)+.15*noise(p*4.3);cloud=smoothstep(.48,.75,cloud)*smoothstep(-.05,.28,d.y);day=mix(day,vec3(1.,.96,.87),cloud*.72);moon=mix(moon,vec3(.13,.20,.31),cloud*.42);
 float orb=dot(d,normalize(vec3(.38,.25,-.89)));moon+=vec3(.035,.047,.08)*pow(max(orb,0.),1600.);
 vec3 photograph=texture2D(tSky,equirectUv(d)).rgb;
 float cloudPhoto=smoothstep(.34,.8,dot(photograph,vec3(.2126,.7152,.0722)));
 day=mix(mix(vec3(.055,.24,.52),vec3(.018,.10,.34),horizon),vec3(1.4,1.38,1.30),cloudPhoto*.90);
 moon=texture2D(tSkyMoon,equirectUv(d)).rgb*2.2+vec3(.003,.009,.023);
 vec3 md=normalize(vec3(.38,.25,-.89)),mr=normalize(cross(md,vec3(0.,1.,0.))),mu=cross(mr,md);vec2 lunar=vec2(dot(d,mr),dot(d,mu))/.035;
 float lunarDetail=.62+.23*noise(lunar*7.)+.15*noise(lunar*19.);
 moon+=vec3(.61,.69,.82)*lunarDetail*smoothstep(.99935,.99945,orb);
 gl_FragColor=vec4(mix(day,moon,nightMix),1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`;
function World(props:Props){
 const {onFail}=props;
 const {gl,scene,camera,size,invalidate}=useThree();
 const tier = useMemo(
  () => window.innerWidth <= 1024 || matchMedia('(pointer:coarse)').matches ? 'balanced' : 'high',
  [],
 );
 const gltf=useGLTF(worldAssets[tier]),architecture=useGLTF(worldAssets.architecture);
 const skyTexture=useLoader(HDRLoader,'/textures/atrium-sky-2k.hdr');
 const nightSky=useMemo(()=>makeNightSky(skyTexture),[skyTexture]);
 const environment=useMemo(()=>({night:{value:0},moon:{value:null as Texture|null}}),[]);
 const [normalMap,roughMap,coverageMap]=useTexture([worldAssets.normal,worldAssets.roughness,tier==='balanced'?worldAssets.coverage.replace('-2k','-1k'):worldAssets.coverage]);
 const cloth=useMemo(()=>clone(gltf.scene),[gltf.scene]),arch=useMemo(()=>clone(architecture.scene),[architecture.scene]);
 const [atlas,setAtlas]=useState<ClothAtlas|null>(null);const [bReady,setBReady]=useState(false);const onBReady=useCallback(()=>setBReady(true),[]);
 const [floorVisible,setFloorVisible]=useState(false);const floorVisibility=useRef(false);
 const floorMaterial=useRef<ReflectorMaterialImpl|null>(null);
 const bindFloorMaterial=useCallback((material:ReflectorMaterialImpl|null)=>{floorMaterial.current=material;if(material){environmentBlend(material,environment.night,environment.moon);const compile=material.onBeforeCompile;material.onBeforeCompile=shader=>{compile.call(material,shader);shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>','#include <lights_fragment_end>\n reflectedLight.directSpecular*=mix(1.,.05,phucNight);reflectedLight.indirectSpecular*=mix(1.,.20,phucNight);');};material.customProgramCacheKey=()=> 'V51-floor-moon-glare-control-v1';}},[environment]);
 const phase=useRef(0),speed=useRef(1);
 const clock=useRef(0),blend=useRef(props.night?1:0),key=useRef<DirectionalLight>(null),fill=useRef<HemisphereLight>(null),back=useRef<DirectionalLight>(null),reported=useRef(false);
 const uniforms=useMemo<ClothUniforms>(()=>({clipStride:{value:0},body:{value:1},pointer:{value:new Vector4(9,9,0,0)},obstacle:{value:new Vector4(9,9,10,10)},interaction:{value:1},a:{value:0},b:{value:0},mix:{value:0},time:{value:0},edge:{value:0},packedNormal:{value:0},positions:{value:new DataTexture()},normals:{value:new DataTexture()},shape:{value:new Vector4(1,1,1,1)}}),[]);
 const sky=useMemo(()=>new ShaderMaterial({side:BackSide,vertexShader:skyVertex,fragmentShader:skyFragment,uniforms:{nightMix:{value:0},tSky:{value:skyTexture},tSkyMoon:{value:nightSky}},depthWrite:false}),[skyTexture,nightSky]);
 const fabric=useMemo(()=>new MeshPhysicalMaterial({color:'#f5ecd8',roughness:.67,metalness:0,anisotropy:.40,sheen:.55,sheenColor:new Color('#fff7e5'),sheenRoughness:.50,side:DoubleSide,transparent:true,opacity:.82,depthWrite:false,forceSinglePass:true,specularIntensity:.65,normalMap,normalScale:new Vector2(.16,.16),roughnessMap:roughMap,alphaMap:coverageMap,envMapIntensity:.20}),[normalMap,roughMap,coverageMap]);
 const shadow=useMemo(()=>new MeshDepthMaterial({depthPacking:RGBADepthPacking,side:DoubleSide,opacity:.58,alphaHash:true}),[]);
 const [marbleColor,marbleNormal,marbleRough]=useTexture(['/textures/carrara-color-2k.jpg','/textures/carrara-normal-2k.jpg','/textures/carrara-roughness-2k.jpg']);
 const stone=useMemo(()=>makeMarble(environment.night,environment.moon,marbleColor,marbleNormal,marbleRough),[environment,marbleColor,marbleNormal,marbleRough]);
 useEffect(()=>{marbleColor.colorSpace=SRGBColorSpace;for(const t of [marbleColor,marbleNormal,marbleRough]){t.wrapS=t.wrapT=RepeatWrapping;t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());t.repeat.set(16,20);t.needsUpdate=true;}scene.fog=new FogExp2('#a7c9d8',.0025);return()=>{scene.fog=null;};},[gl,scene,marbleColor,marbleNormal,marbleRough]);
 const pointerTarget=useRef(new Vector4(9,9,0,0));
 useEffect(()=>{const move=(event:PointerEvent)=>{if(event.pointerType==='touch')return;pointerTarget.current.set(event.clientX/size.width*2-1,1-event.clientY/size.height*2,0,1);invalidate();};const leave=()=>{pointerTarget.current.w=0;invalidate();};window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',leave);return()=>{window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);};},[size,invalidate]);
 useEffect(()=>{let cancelled=false;void loadNativeCloth(`loop-${tier}`).then(a=>{if(!cancelled){setAtlas(a);uniforms.clipStride.value=a.meta.framesPerClip??0;uniforms.positions.value=a.positions;uniforms.normals.value=a.normals;uniforms.packedNormal.value=a.meta.normalEncoding==='unorm8'?1:0;uniforms.shape.value=new Vector4(a.meta.width,a.meta.height,a.meta.rowsPerFrame,a.meta.vertexCount);invalidate();}}).catch(props.onFail);return()=>{cancelled=true;};},[tier,uniforms,invalidate,props.onFail]);
 useEffect(()=>{normalMap.wrapS=normalMap.wrapT=coverageMap.wrapS=coverageMap.wrapT=RepeatWrapping;normalMap.repeat.set(.002/.255,.002/.255);roughMap.wrapS=roughMap.wrapT=RepeatWrapping;roughMap.repeat.copy(normalMap.repeat);roughMap.anisotropy=normalMap.anisotropy=coverageMap.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());
  cloth.traverse(o=>{if(o instanceof Mesh){o.geometry=o.geometry.clone();o.geometry.computeTangents();const id=o.geometry.getAttribute('_phuc_id')??o.geometry.getAttribute('_PHUC_ID');if(!id)throw new Error('Missing native cloth vertex IDs');const ids=new Float32Array(id.count),grid=new Float32Array(id.count*2);for(let i=0;i<id.count;i++){const k=Math.round(id.getX(i));ids[i]=k;grid[i*2]=Math.floor(k/41)/256;grid[i*2+1]=(k%41)/40;}o.geometry.setAttribute('phucId',new BufferAttribute(ids,1));o.geometry.setAttribute('phucGrid',new BufferAttribute(grid,2));
   const uv=o.geometry.getAttribute('uv'),rowWidths=new Map<number,number>(),widths=new Float32Array(id.count);
   for(let i=0;i<id.count;i++){const v=grid[i*2+1];if(v>.1)rowWidths.set(Math.floor(Math.round(id.getX(i))/41),uv.getY(i)*.002/v);}
   for(let i=0;i<id.count;i++)widths[i]=rowWidths.get(Math.floor(Math.round(id.getX(i))/41))??8;
   o.geometry.setAttribute('phucWidth',new BufferAttribute(widths,1));
   // Hero cameras remain parallel to the Z axis. Back-to-front triangle order
   // prevents opaque-like self occlusion without a per-frame CPU cloth copy.
   const index=o.geometry.index,position=o.geometry.getAttribute('position');
   if(index){const triangles=[];for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);triangles.push({a,b,c,z:position.getZ(a)+position.getZ(b)+position.getZ(c)});}triangles.sort((a,b)=>a.z-b.z);o.geometry.setIndex(triangles.flatMap(t=>[t.a,t.b,t.c]));}
   o.material=fabric;o.customDepthMaterial=shadow;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
  cloth.traverse(o=>{if(o instanceof Mesh){const g=o.geometry,normal=g.getAttribute('normal'),tangent=g.getAttribute('tangent'),weft=new Float32Array(normal.count*3),n=new Vector3(),t=new Vector3(),b=new Vector3();for(let i=0;i<normal.count;i++){n.fromBufferAttribute(normal,i);t.fromBufferAttribute(tangent,i);b.crossVectors(n,t).multiplyScalar(tangent.getW(i)).normalize().toArray(weft,i*3);}g.setAttribute('phucWeft',new BufferAttribute(weft,3));g.setAttribute('phucPin',g.getAttribute('_phuc_pin')??new BufferAttribute(new Float32Array(normal.count),1));}});
  clothMaterial(fabric,uniforms,false,true);environmentBlend(fabric,environment.night,environment.moon);clothMaterial(shadow,uniforms,true);arch.traverse(o=>{if(o instanceof Mesh){if(o.name.includes('column')||o.name.includes('threshold'))o.material=stone;else if(o.name.includes('floor'))o.visible=false;else {const materials=Array.isArray(o.material)?o.material:[o.material];const copies=materials.map(m=>{const copy=m.clone();if('envMapIntensity' in copy)copy.envMapIntensity=.25;if('alphaMap' in copy&&'transparent' in copy&&copy.transparent){copy.transparent=false;copy.alphaTest=.38;if('color' in copy)(copy.color as Color).multiply(new Color('#a2ac72'));copy.alphaToCoverage=true;copy.depthWrite=true;}environmentBlend(copy,environment.night,environment.moon);return copy;});o.material=Array.isArray(o.material)?copies:copies[0];}o.castShadow=true;o.receiveShadow=true;}});return()=>{cloth.traverse(o=>{if(o instanceof Mesh)o.geometry.dispose();});};
 },[cloth,arch,fabric,shadow,stone,tier,normalMap,roughMap,coverageMap,gl,uniforms,environment]);
 useEffect(()=>{const generator=new PMREMGenerator(gl),day=generator.fromEquirectangular(skyTexture),moon=generator.fromEquirectangular(nightSky);scene.environment=day.texture;environment.moon.value=moon.texture;invalidate();return()=>{scene.environment=null;scene.background=null;day.dispose();moon.dispose();generator.dispose();};},[gl,scene,invalidate,skyTexture,nightSky,environment]);
 useEffect(()=>{const lost=(e:Event)=>{e.preventDefault();onFail(new Error('WebGL context lost'));};gl.domElement.addEventListener('webglcontextlost',lost);const scroll=()=>invalidate();window.addEventListener('scroll',scroll,{passive:true});return()=>{gl.domElement.removeEventListener('webglcontextlost',lost);window.removeEventListener('scroll',scroll);};},[gl,invalidate,onFail]);
 useEffect(()=>{invalidate();},[props.night,props.paused,props.reduced,invalidate]);
 useEffect(()=>()=>{fabric.dispose();shadow.dispose();stone.dispose();sky.dispose();},[fabric,shadow,stone,sky]);
 useFrame((_,dt)=>{
  const d = Math.min(dt, .1);
  const paused = props.paused || props.reduced || props.hidden;
  if (!paused) clock.current += d;
  blend.current=MathUtils.damp(blend.current,props.night?1:0,5,d);const night=blend.current;sky.uniforms.nightMix.value=night;environment.night.value=night;
  if(floorMaterial.current){floorMaterial.current.roughness=MathUtils.lerp(.28,.62,night);floorMaterial.current.mixStrength=MathUtils.lerp(.6,.30,night);floorMaterial.current.mirror=MathUtils.lerp(.35,.55,night);floorMaterial.current.color.copy(new Color('#f1eee6')).lerp(new Color('#4a5e79'),night);}
  key.current?.color.copy(new Color('#ffe0ac')).lerp(new Color('#d2e1f7'),night);if(key.current){key.current.intensity=MathUtils.lerp(3.2,4.0,night);key.current.position.copy(new Vector3(-32,44,30)).lerp(new Vector3(38,25,-89),night);}if(fill.current){fill.current.intensity=MathUtils.lerp(.22,.20,night);fill.current.color.copy(new Color('#bbd5e1')).lerp(new Color('#819bc8'),night);}if(back.current){back.current.intensity=MathUtils.lerp(.65,.65,night);back.current.position.copy(new Vector3(15,34,-22)).lerp(new Vector3(-20,35,30),night);back.current.color.copy(new Color('#f3e3ca')).lerp(new Color('#aebfe4'),night);}fabric.envMapIntensity=MathUtils.lerp(.20,.75,night);
  if(atlas){
    speed.current = MathUtils.damp(speed.current, .85, 2, d);
    if (!paused) phase.current += d * 30 * speed.current;
    const frame = 1 + phase.current % (atlas.meta.nativeFrames.at(-1)! - 1);
    const frames=atlas.meta.nativeFrames.slice(0,atlas.meta.framesPerClip??atlas.meta.frameCount);let lo=0,hi=frames.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(frames[mid]<=frame)lo=mid;else hi=mid;}const x=lo+MathUtils.clamp((frame-frames[lo])/(frames[hi]-frames[lo]),0,1);

   uniforms.a.value=lo;uniforms.b.value=hi;uniforms.mix.value=x-lo;uniforms.time.value=clock.current;if(!paused)uniforms.edge.value=MathUtils.damp(uniforms.edge.value,.055,4,d);
   if(bReady&&!reported.current){reported.current=true;props.onReady();}
  }
  uniforms.pointer.value.lerp(pointerTarget.current,1-Math.exp(-d*5));if(paused)uniforms.pointer.value.w=0;
  const obstacle=document.querySelector('[data-phuc-obstacle]')?.getBoundingClientRect();if(obstacle&&obstacle.bottom>0&&obstacle.top<size.height){uniforms.obstacle.value.set(obstacle.left/size.width*2-1,1-obstacle.bottom/size.height*2,obstacle.right/size.width*2-1,1-obstacle.top/size.height*2);}else uniforms.obstacle.value.set(9,9,10,10);
  if(scene.fog instanceof FogExp2)scene.fog.color.copy(new Color('#a7c9d8')).lerp(new Color('#122c48'),night);
  const c=camera as PerspectiveCamera,mobile=size.width<760;
   const anchors=[['hero',30],['about',20],['threshold',8],['work',-10],['featured',-24],['more-work',-36],['resume',-45],['contact',-51]] as const;
   const y=window.scrollY;let lower=0;
   const stops=anchors.map(([id,worldY])=>({id,worldY,top:Math.max(0,(document.getElementById(id)?.getBoundingClientRect().top??0)+y-85)}));
   for(let i=0;i<stops.length;i++)if(y>=stops[i].top)lower=i;
   const a=stops[lower],b=stops[Math.min(lower+1,stops.length-1)];const f=MathUtils.clamp((y-a.top)/Math.max(1,b.top-a.top),0,1);
   const worldY=MathUtils.lerp(a.worldY,b.worldY,f);
   const mobileX=MathUtils.lerp(3,6,MathUtils.smoothstep(20-worldY,0,35));
   c.position.set(mobile?mobileX:6,worldY,mobile?82:48);c.fov=mobile?50:44;c.lookAt(c.position.x,c.position.y,-6);
  const showFloor=c.position.y<-12;if(showFloor!==floorVisibility.current){floorVisibility.current=showFloor;setFloorVisible(showFloor);}
  if(key.current){const center=new Vector3(6,c.position.y-8,-8);key.current.target.position.copy(center);key.current.target.updateMatrixWorld();key.current.position.add(center);}
  c.updateProjectionMatrix();if(Math.abs(night-(props.night?1:0))>.002)invalidate();
 });
 return <><mesh material={sky}><sphereGeometry args={[2000,32,24]}/></mesh><hemisphereLight ref={fill} args={['#c8dcdf','#847563',.8]}/><directionalLight ref={key} position={[-18,50,30]} intensity={3.1} color="#fff0d1" castShadow shadow-mapSize={[tier==='high'?2048:1024,tier==='high'?2048:1024]} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-45} shadow-camera-near={.5} shadow-camera-far={210} shadow-normalBias={.035} shadow-radius={4}/><directionalLight ref={back} position={[15,34,-22]} intensity={1.0} color="#f3e3ca"/><primitive object={arch}/>{floorVisible&&<mesh name="Existing lower floor reflective finish" position={[3,-62.29,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[100,130]}/><MeshReflectorMaterial ref={bindFloorMaterial} resolution={tier==='high'?1024:512} blur={[0,0]} mirror={.35} mixStrength={.6} envMapIntensity={0} roughness={.28} metalness={0} color="#f1eee6" map={marbleColor} normalMap={marbleNormal} normalScale={[.12,.12]} /></mesh>}<primitive object={cloth}/>
  <LowerRibbon tier={tier} sourceUniforms={uniforms} fabric={fabric} shadow={shadow}
    night={environment.night} moon={environment.moon} onReady={onBReady} onFail={props.onFail}/>
 </>;
}
export default function WorldCanvas(props:Props){return <Canvas camera={{position:[6,25,48],fov:44,near:.1,far:3000}} dpr={props.layout.mobile?[1,2]:[1,1.75]} shadows="percentage" gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} frameloop={props.hidden?'never':props.paused||props.reduced?'demand':'always'} onCreated={({gl})=>{gl.outputColorSpace=SRGBColorSpace;gl.toneMapping=AgXToneMapping;gl.toneMappingExposure=1.0;gl.shadowMap.type=PCFShadowMap;}}><World {...props}/></Canvas>;}
