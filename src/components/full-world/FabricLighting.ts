import { DataTexture, DataUtils, FloatType, RGBAFormat, ShaderChunk, type Material, type Texture, type IUniform } from 'three';

/** A separate low energy night probe derived from the licensed sky.
 * Bright daytime solar values are clamped before grading. Moonlight is supplied
 * by the scene directional source, rather than inherited daytime IBL.
 */
export function makeNightSky(source: DataTexture): DataTexture {
 const image=source.image as {data:Uint16Array|Float32Array;width:number;height:number};
 const values=new Float32Array(image.data.length);
 for(let i=0;i<values.length;i+=4){
  for(let c=0;c<3;c++){
   const input=image.data instanceof Uint16Array?DataUtils.fromHalfFloat(image.data[i+c]):image.data[i+c];
   values[i+c]=Math.pow(Math.min(1.5,Math.max(0,input)),.85)*[.055,.075,.115][c];
  }
  values[i+3]=1;
 }
 const result=new DataTexture(values,image.width,image.height,RGBAFormat,FloatType);
 result.mapping=source.mapping;result.needsUpdate=true;return result;
}

/** Both probes are prepared once. Interpolate radiance in linear light, avoiding
 * GLB reloads, shader recompilation and a discontinuous environment switch.
 */
export function environmentBlend(material:Material,night:IUniform<number>,moon:IUniform<Texture|null>){
 const previous=material.onBeforeCompile;
 material.onBeforeCompile=(shader,renderer)=>{
  previous.call(material,shader,renderer);
  shader.uniforms.phucNight=night;shader.uniforms.phucMoonEnv=moon;
  const source=ShaderChunk.envmap_physical_pars_fragment.replaceAll('textureCubeUV( envMap,','phucEnvironment(');
  shader.fragmentShader=shader.fragmentShader.replace('#include <envmap_physical_pars_fragment>',`
   uniform float phucNight;uniform sampler2D phucMoonEnv;
   #if defined(USE_ENVMAP) && defined(ENVMAP_TYPE_CUBE_UV)
   vec4 phucEnvironment(vec3 direction,float r){vec4 radiance=vec4(0.);if(phucNight<.001){radiance=textureCubeUV(envMap,direction,r);}else if(phucNight>.999){radiance=textureCubeUV(phucMoonEnv,direction,r);}else{radiance=mix(textureCubeUV(envMap,direction,r),textureCubeUV(phucMoonEnv,direction,r),phucNight);}return radiance;}
   #endif
   ${source}
  `);
 };
 const old=material.customProgramCacheKey.bind(material);
 material.customProgramCacheKey=()=>old()+'-linear-day-moon-probes-v1';
 material.needsUpdate=true;
}
