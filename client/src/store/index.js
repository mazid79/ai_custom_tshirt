import { proxy } from 'valtio';

const state = proxy({
    intro: true,
    color: '#6a23f7',
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './mazid.png',
    fullDecal: './mazid.png',
});

export default state;