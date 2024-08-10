import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.eAUGSsBX.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.BimAYb2Z.js","_app/immutable/chunks/Passcode.Dv_V19DV.js"];
export const stylesheets = ["_app/immutable/assets/4.DDqFzPXY.css","_app/immutable/assets/Passcode.x-DzQ7Fz.css"];
export const fonts = [];
