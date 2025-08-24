import React from "react";
import useTheme from "../stores/useThemeStore";
import { THEMES } from "../constants";
import { PaletteIcon } from "lucide-react";

const ThemeSelecter = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
                <PaletteIcon className="size-5" />
            </button>

            <div className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto">
                <div className="space-y-1">
                    {THEMES.map(tm => (
                        <button onClick={() => setTheme(tm.name)} key={tm.name} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${theme === tm.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`}>
                            <PaletteIcon className="size-5" />
                            {tm.label}

                            <div className="ml-auto flex gap-1">
                                {tm.colors.map((c, i) => (
                                    <span key={i} className="size-2 rounded-lg" style={{backgroundColor: c}}/>
                                ))}
                                
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelecter;
