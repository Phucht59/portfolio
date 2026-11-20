import assert from 'node:assert/strict';import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
const root=new URL('../public/full-world/',import.meta.url);
for(const tier of ['high','balanced','b-high','b-balanced']){
 const b=fs.readFileSync(new URL(`ribbon-${tier}.glb`,root));assert.equal(b.toString('ascii',0,4),'glTF');const n=b.readUInt32LE(12),g=JSON.parse(b.toString('utf8',20,20+n));const primitive=g.meshes[0].primitives[0];
 assert(primitive.attributes._PHUC_ID!==undefined);assert(primitive.attributes._PHUC_PIN!==undefined);assert(primitive.attributes.NORMAL!==undefined);assert(primitive.attributes.TEXCOORD_0!==undefined);
 const meta=JSON.parse(fs.readFileSync(new URL(`loop-${tier}-motion.json`,root)));assert(meta.nativeFrames.length===meta.frameCount);assert.equal(meta.frameCount,153);assert.equal(meta.framesPerClip,51);assert.deepEqual(meta.clipOrder,['calm','light','gust']);assert.deepEqual(meta.clipOffsets,[0,51,102]);assert.equal(meta.nativeFrames.at(-1),150);assert.equal(meta.loop,true);assert.equal(meta.baseFrame,1);assert.equal(meta.normalEncoding,"unorm8");
 for(const kind of ['positions','normals']){const bytes=gunzipSync(fs.readFileSync(new URL(`loop-${tier}-${kind}.bin.gz`,root)));assert.equal(bytes.byteLength,meta.width*meta.height*(kind==="normals"?4:8));}
 console.log(tier,meta.vertexCount,'vertices;',meta.frameCount,'native-derived runtime samples; glTF ID/pin/normal/UV and atlas sizes valid');
}
for (const [lod, size] of [['1k', 1024], ['2k', 2048]]) {
 const image = fs.readFileSync(new URL(`weave-coverage-${lod}.png`, root));
 assert.equal(image.readUInt32BE(0), 0x89504e47);
 assert.equal(image.readUInt32BE(16), size);
 assert.equal(image.readUInt32BE(20), size);
}
const architecture = fs.readFileSync(new URL('architecture-v5.glb', root));
assert.equal(architecture.toString('ascii', 0, 4), 'glTF');
assert.equal(architecture.readUInt32LE(8), architecture.length);
console.log('Architecture GLB and UV coverage maps valid.');
