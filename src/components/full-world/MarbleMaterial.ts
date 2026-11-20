import { MeshStandardMaterial, Color, type Texture } from 'three';
import { environmentBlend } from './FabricLighting';

/** World-space stone variation; albedo is linear and tone mapping happens once. */
export function makeMarble(night: {value:number}, moon: {value:Texture|null}, colorMap:Texture, normalMap:Texture, roughMap:Texture) {
  const material = new MeshStandardMaterial({color:'#f3eee6',roughness:.44,metalness:0,envMapIntensity:.32});
  environmentBlend(material,night,moon);
  const previous=material.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{
    previous.call(material,shader,renderer);
    shader.uniforms.marbleColorMap={value:colorMap};shader.uniforms.marbleNormalMap={value:normalMap};shader.uniforms.marbleRoughMap={value:roughMap};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 stonePosition;');
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nstonePosition=(modelMatrix*vec4(position,1.)).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 stonePosition;
      uniform sampler2D marbleColorMap,marbleNormalMap,marbleRoughMap;
      vec3 marbleProjection(sampler2D tex,vec3 p){vec3 n=abs(normalize(cross(dFdx(stonePosition),dFdy(stonePosition))));n=pow(n,vec3(4.));n/=max(.001,n.x+n.y+n.z);return texture2D(tex,p.yz).rgb*n.x+texture2D(tex,p.xz).rgb*n.y+texture2D(tex,p.xy).rgb*n.z;}
      float marbleHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float marbleNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(marbleHash(i),marbleHash(i+vec3(1,0,0)),f.x),mix(marbleHash(i+vec3(0,1,0)),marbleHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(marbleHash(i+vec3(0,0,1)),marbleHash(i+vec3(1,0,1)),f.x),mix(marbleHash(i+vec3(0,1,1)),marbleHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec3 sp=stonePosition*vec3(.55,.7,.55);
      float grain=marbleNoise(sp*13.);
      float warp=marbleNoise(sp*.44)*3.+marbleNoise(sp*1.2)*.65;
      float vein=1.-smoothstep(.035,.10,abs(sin(sp.x*.65+sp.y*.8+sp.z*.4+warp)));
      diffuseColor.rgb*=mix(vec3(1.04,1.025,1.),vec3(.72,.72,.70),vein*.30)*( .97+grain*.06);
      diffuseColor.rgb*=mix(vec3(1.),marbleProjection(marbleColorMap,stonePosition*.12),.72);
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n roughnessFactor=clamp(.24+.36*marbleProjection(marbleRoughMap,stonePosition*.12).r,.24,.6);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      vec3 stoneWorldNormal=inverseTransformDirection(normal,viewMatrix);
      vec3 weights=pow(abs(stoneWorldNormal),vec3(4.));weights/=max(.001,weights.x+weights.y+weights.z);
      vec2 nx=texture2D(marbleNormalMap,stonePosition.yz*.12).xy*2.-1.;
      vec2 ny=texture2D(marbleNormalMap,stonePosition.xz*.12).xy*2.-1.;
      vec2 nz=texture2D(marbleNormalMap,stonePosition.xy*.12).xy*2.-1.;
      vec3 detail=vec3(0.,nx.x,nx.y)*weights.x+vec3(ny.x,0.,ny.y)*weights.y+vec3(nz.x,nz.y,0.)*weights.z;
      detail-=stoneWorldNormal*dot(detail,stoneWorldNormal);
      normal=normalize(mat3(viewMatrix)*(stoneWorldNormal+detail*.14));
    `);
  };
  material.customProgramCacheKey=()=> 'V51-triplanar-carrara-linear-probe-v3-normal';
  material.color=new Color('#f3eee6');
  return material;
}
