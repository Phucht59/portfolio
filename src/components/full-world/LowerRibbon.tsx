import {useEffect,useMemo} from 'react';
import {useThree,useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {BufferAttribute,DataTexture,Mesh,Vector3,Vector4,type MeshPhysicalMaterial,type MeshDepthMaterial,type Texture} from 'three';
import {clothMaterial,loadNativeCloth,type ClothUniforms} from './NativeCloth';
import {environmentBlend} from './FabricLighting';

/** A separately authored and simulated continuous lower-world textile. */
export function LowerRibbon({tier,sourceUniforms,fabric,shadow,night,moon,onReady,onFail}:{tier:string;sourceUniforms:ClothUniforms;fabric:MeshPhysicalMaterial;shadow:MeshDepthMaterial;night:{value:number};moon:{value:Texture|null};onReady:()=>void;onFail:(e:Error)=>void}){
 const gltf=useGLTF(`/full-world/ribbon-b-${tier}.glb`),{invalidate}=useThree();
 const object=useMemo(()=>clone(gltf.scene),[gltf.scene]);
 const material=useMemo(()=>fabric.clone(),[fabric]),depth=useMemo(()=>shadow.clone(),[shadow]);
 useFrame(()=>{material.envMapIntensity=.20+.55*night.value;});
 const u=useMemo<ClothUniforms>(()=>({...sourceUniforms,clipStride:{value:0},interaction:{value:0},positions:{value:new DataTexture()},normals:{value:new DataTexture()},shape:{value:new Vector4(1,1,1,1)}}),[sourceUniforms]);
 useEffect(()=>{let cancelled=false;void loadNativeCloth('loop-b-'+tier).then(a=>{if(cancelled)return;u.clipStride.value=a.meta.framesPerClip??0;u.positions.value=a.positions;u.normals.value=a.normals;u.shape.value=new Vector4(a.meta.width,a.meta.height,a.meta.rowsPerFrame,a.meta.vertexCount);onReady();invalidate();}).catch(onFail);return()=>{cancelled=true;};},[tier,u,onReady,onFail,invalidate]);
 useEffect(()=>{
  object.traverse(o=>{if(!(o instanceof Mesh))return;o.geometry=o.geometry.clone();const g=o.geometry;g.computeTangents();const id=g.getAttribute('_phuc_id')??g.getAttribute('_PHUC_ID');if(!id)throw Error('Ribbon B missing IDs');
   const ids=new Float32Array(id.count),grid=new Float32Array(id.count*2),width=new Float32Array(id.count),weft=new Float32Array(id.count*3),uv=g.getAttribute('uv'),n=g.getAttribute('normal'),t=g.getAttribute('tangent');const vn=new Vector3(),vt=new Vector3(),vb=new Vector3(),widths=new Map<number,number>();
   for(let i=0;i<id.count;i++){const k=Math.round(id.getX(i)),v=(k%41)/40;if(v>.1)widths.set(Math.floor(k/41),uv.getY(i)*.002/v);}
   for(let i=0;i<id.count;i++){const k=Math.round(id.getX(i));ids[i]=k;grid[i*2]=Math.floor(k/41)/256;grid[i*2+1]=(k%41)/40;width[i]=widths.get(Math.floor(k/41))??8;vn.fromBufferAttribute(n,i);vt.fromBufferAttribute(t,i);vb.crossVectors(vn,vt).multiplyScalar(t.getW(i)).normalize().toArray(weft,i*3);}
   g.setAttribute('phucId',new BufferAttribute(ids,1));g.setAttribute('phucGrid',new BufferAttribute(grid,2));g.setAttribute('phucWidth',new BufferAttribute(width,1));g.setAttribute('phucWeft',new BufferAttribute(weft,3));g.setAttribute('phucPin',g.getAttribute('_phuc_pin')??new BufferAttribute(new Float32Array(id.count),1));
   const ix=g.index,p=g.getAttribute('position');if(ix){const tris=[];for(let i=0;i<ix.count;i+=3){const a=ix.getX(i),b=ix.getX(i+1),c=ix.getX(i+2);tris.push({a,b,c,z:p.getZ(a)+p.getZ(b)+p.getZ(c)});}tris.sort((a,b)=>a.z-b.z);g.setIndex(tris.flatMap(t=>[t.a,t.b,t.c]));}
   o.material=material;o.customDepthMaterial=depth;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
  });
  clothMaterial(material,u,false,true);environmentBlend(material,night,moon);clothMaterial(depth,u,true);
  return()=>{object.traverse(o=>{if(o instanceof Mesh)o.geometry.dispose();});material.dispose();depth.dispose();};
 },[object,tier,material,depth,u,night,moon]);
 return <primitive object={object}/>;
}
