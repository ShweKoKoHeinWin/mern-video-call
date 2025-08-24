import { create } from 'zustand'
import { THEMES } from '../constants';
import utils from '../lib/utils';

const useTheme = create((set) => ({
    theme: utils.LocalStorage('theme') || THEMES[0].name,
    setTheme: (t) => { set({ theme: t }); 
    utils.LocalStorage.set('theme', t) },
}))

export default useTheme;