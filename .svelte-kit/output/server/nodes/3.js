

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/example/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BsS-twbQ.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.BimAYb2Z.js","_app/immutable/chunks/Passcode.Dv_V19DV.js"];
export const stylesheets = ["_app/immutable/assets/3.bJWG_8JG.css","_app/immutable/assets/Passcode.x-DzQ7Fz.css"];
export const fonts = [];
