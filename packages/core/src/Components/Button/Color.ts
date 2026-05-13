// prettier-ignore
export interface ButtonColorItem {
  "base": string;
  "hover": string;
  "focus": string;
}

// prettier-ignore
export interface ButtonColor {
  "none": ButtonColorItem;
  "dark": ButtonColorItem;
  "primary": ButtonColorItem;
  "secondary": ButtonColorItem;
  "success": ButtonColorItem;
  "error": ButtonColorItem;
  "warning": ButtonColorItem;
  "info": ButtonColorItem;
  "white": ButtonColorItem;
  "black": ButtonColorItem;
  "slate": ButtonColorItem;
  "gray": ButtonColorItem;
  "zinc": ButtonColorItem;
  "neutral": ButtonColorItem;
  "stone": ButtonColorItem;
  "red": ButtonColorItem;
  "orange": ButtonColorItem;
  "yellow": ButtonColorItem;
  "amber": ButtonColorItem;
  "lime": ButtonColorItem;
  "green": ButtonColorItem;
  "emerald": ButtonColorItem;
  "teal": ButtonColorItem;
  "cyan": ButtonColorItem;
  "sky": ButtonColorItem;
  "blue": ButtonColorItem;
  "indigo": ButtonColorItem;
  "violet": ButtonColorItem;
  "purple": ButtonColorItem;
  "fuchsia": ButtonColorItem;
  "pink": ButtonColorItem;
  "rose": ButtonColorItem;
}

// prettier-ignore
export const flatProps: ButtonColor = {
  "none": {
    "base": "",
    "hover": "",
    "focus": "",
  },
  "dark": {
    "base": "text-dark-600 dark:text-dark-400",
    "hover": "hover:text-dark-700 hover:bg-dark-400/25 dark:hover:text-dark-300/90 dark:hover:bg-dark-600/15",
    "focus": "focus:ring-offset-0 focus:text-dark-700 focus:bg-dark-400/25 focus:ring-dark-600 dark:focus:text-dark-300/90 dark:focus:bg-dark-400/15 dark:focus:ring-dark-500",
  },
  "primary": {
    "base": "text-primary-600",
    "hover": "hover:text-primary-700 hover:bg-primary-400/25 dark:hover:text-primary-500 dark:hover:bg-primary-600/15",
    "focus": "focus:ring-offset-0 focus:text-primary-700 focus:bg-primary-400/25 focus:ring-primary-600 dark:focus:text-primary-500 dark:focus:bg-primary-600/15 dark:focus:ring-primary-700",
  },
  "secondary": {
    "base": "text-secondary-600",
    "hover": "hover:text-secondary-700 hover:bg-secondary-400/25 dark:hover:text-secondary-500 dark:hover:bg-secondary-600/15",
    "focus": "focus:ring-offset-0 focus:text-secondary-700 focus:bg-secondary-400/25 focus:ring-secondary-600 dark:focus:text-secondary-500 dark:focus:bg-secondary-600/15 dark:focus:ring-secondary-700",
  },
  "success": {
    "base": "text-success-600 dark:text-success-500/90",
    "hover": "hover:text-success-700 hover:bg-success-400/25 dark:hover:text-success-500 dark:hover:bg-success-600/15",
    "focus": "focus:ring-offset-0 focus:text-success-700 focus:bg-success-400/25 focus:ring-success-600 dark:focus:text-success-500 dark:focus:bg-success-600/15 dark:focus:ring-success-700",
  },
  "error": {
    "base": "text-error-600",
    "hover": "hover:text-error-700 hover:bg-error-400/25 dark:hover:text-error-500 dark:hover:bg-error-600/15",
    "focus": "focus:ring-offset-0 focus:text-error-700 focus:bg-error-400/25 focus:ring-error-600 dark:focus:text-error-500 dark:focus:bg-error-600/15 dark:focus:ring-error-700",
  },
  "warning": {
    "base": "text-warning-600",
    "hover": "hover:text-warning-700 hover:bg-warning-300/25 dark:hover:text-warning-500 dark:hover:bg-warning-600/15",
    "focus": "focus:ring-offset-0 focus:text-warning-700 focus:bg-warning-400/25 focus:ring-warning-600 dark:focus:text-warning-500 dark:focus:bg-warning-600/15 dark:focus:ring-warning-700",
  },
  "info": {
    "base": "text-info-600",
    "hover": "hover:text-info-700 hover:bg-info-400/25 dark:hover:text-info-500 dark:hover:bg-info-600/15",
    "focus": "focus:ring-offset-0 focus:text-info-700 focus:bg-info-400/25 focus:ring-info-600 dark:focus:text-info-500 dark:focus:bg-info-600/15 dark:focus:ring-info-700",
  },
  "white": {
    "base": "text-white dark:text-white/80",
    "hover": "hover:text-slate-100 hover:bg-slate-100/25 focus:ring-offset-dark-900 dark:hover:text-slate-100/100 dark:hover:bg-slate-600/15",
    "focus": "focus:ring-offset-0 focus:text-slate-100 focus:bg-slate-100/25 focus:ring-white dark:focus:text-slate-100/100 dark:focus:bg-slate-400/15 dark:focus:ring-white/70",
  },
  "black": {
    "base": "text-black",
    "hover": "hover:text-black hover:bg-black/10 dark:hover:text-black dark:hover:bg-black/20",
    "focus": "focus:ring-offset-0 focus:text-black focus:bg-black/10 focus:ring-black dark:focus:text-black dark:focus:bg-black/20 dark:focus:ring-black",
  },
  "slate": {
    "base": "text-slate-600 dark:text-slate-400",
    "hover": "hover:text-slate-700 hover:bg-slate-400/25 dark:hover:text-slate-300 dark:hover:bg-slate-600/15",
    "focus": "focus:ring-offset-0 focus:text-slate-700 focus:bg-slate-400/25 focus:ring-slate-600 dark:focus:text-slate-300 dark:focus:bg-slate-400/15 dark:focus:ring-slate-500",
  },
  "gray": {
    "base": "text-gray-600 dark:text-gray-400",
    "hover": "hover:text-gray-700 hover:bg-gray-400/25 dark:hover:text-gray-300 dark:hover:bg-gray-600/15",
    "focus": "focus:ring-offset-0 focus:text-gray-700 focus:bg-gray-400/25 focus:ring-gray-600 dark:focus:text-gray-300 dark:focus:bg-gray-400/15 dark:focus:ring-gray-500",
  },
  "zinc": {
    "base": "text-zinc-600 dark:text-zinc-400",
    "hover": "hover:text-zinc-700 hover:bg-zinc-400/25 dark:hover:text-zinc-300 dark:hover:bg-zinc-600/15",
    "focus": "focus:ring-offset-0 focus:text-zinc-700 focus:bg-zinc-400/25 focus:ring-zinc-600 dark:focus:text-zinc-300 dark:focus:bg-zinc-400/15 dark:focus:ring-zinc-500",
  },
  "neutral": {
    "base": "text-neutral-600 dark:text-neutral-400",
    "hover": "hover:text-neutral-700 hover:bg-neutral-400/25 dark:hover:text-neutral-300/90 dark:hover:bg-neutral-600/15",
    "focus": "focus:ring-offset-0 focus:text-neutral-700 focus:bg-neutral-400/25 focus:ring-neutral-600 dark:focus:text-neutral-300/90 dark:focus:bg-neutral-400/15 dark:focus:ring-neutral-500",
  },
  "stone": {
    "base": "text-stone-600 dark:text-stone-400",
    "hover": "hover:text-stone-700 hover:bg-stone-400/25 dark:hover:text-stone-300/90 dark:hover:bg-stone-600/15",
    "focus": "focus:ring-offset-0 focus:text-stone-700 focus:bg-stone-400/25 focus:ring-stone-600 dark:focus:text-stone-300/90 dark:focus:bg-stone-400/15 dark:focus:ring-stone-500",
  },
  "red": {
    "base": "text-red-600",
    "hover": "hover:text-red-700 hover:bg-red-400/25 dark:hover:text-red-500 dark:hover:bg-red-600/15",
    "focus": "focus:ring-offset-0 focus:text-red-700 focus:bg-red-400/25 focus:ring-red-600 dark:focus:text-red-500 dark:focus:bg-red-600/15 dark:focus:ring-red-700",
  },
  "orange": {
    "base": "text-orange-600",
    "hover": "hover:text-orange-700 hover:bg-orange-400/25 dark:hover:text-orange-500 dark:hover:bg-orange-600/15",
    "focus": "focus:ring-offset-0 focus:text-orange-700 focus:bg-orange-400/25 focus:ring-orange-600 dark:focus:text-orange-500 dark:focus:bg-orange-600/15 dark:focus:ring-orange-700",
  },
  "yellow": {
    "base": "text-yellow-600",
    "hover": "hover:text-yellow-700 hover:bg-yellow-400/25 dark:hover:text-yellow-500 dark:hover:bg-yellow-600/15",
    "focus": "focus:ring-offset-0 focus:text-yellow-700 focus:bg-yellow-400/25 focus:ring-yellow-600 dark:focus:text-yellow-500 dark:focus:bg-yellow-600/15 dark:focus:ring-yellow-700",
  },
  "amber": {
    "base": "text-amber-600",
    "hover": "hover:text-amber-700 hover:bg-amber-400/25 dark:hover:text-amber-500 dark:hover:bg-amber-600/15",
    "focus": "focus:ring-offset-0 focus:text-amber-700 focus:bg-amber-400/25 focus:ring-amber-600 dark:focus:text-amber-500 dark:focus:bg-amber-600/15 dark:focus:ring-amber-700",
  },
  "lime": {
    "base": "text-lime-600",
    "hover": "hover:text-lime-700 hover:bg-lime-400/25 dark:hover:text-lime-500 dark:hover:bg-lime-600/15",
    "focus": "focus:ring-offset-0 focus:text-lime-700 focus:bg-lime-400/25 focus:ring-lime-600 dark:focus:text-lime-500 dark:focus:bg-lime-600/15 dark:focus:ring-lime-700",
  },
  "green": {
    "base": "text-green-600",
    "hover": "hover:text-green-700 hover:bg-green-400/25 dark:hover:text-green-500 dark:hover:bg-green-600/15",
    "focus": "focus:ring-offset-0 focus:text-green-700 focus:bg-green-400/25 focus:ring-green-600 dark:focus:text-green-500 dark:focus:bg-green-600/15 dark:focus:ring-green-700",
  },
  "emerald": {
    "base": "text-emerald-600 dark:text-emerald-500/90",
    "hover": "hover:text-emerald-700 hover:bg-emerald-400/25 dark:hover:text-emerald-500 dark:hover:bg-emerald-600/15",
    "focus": "focus:ring-offset-0 focus:text-emerald-700 focus:bg-emerald-400/25 focus:ring-emerald-600 dark:focus:text-emerald-500 dark:focus:bg-emerald-600/15 dark:focus:ring-emerald-700",
  },
  "teal": {
    "base": "text-teal-600 dark:text-teal-500/90",
    "hover": "hover:text-teal-700 hover:bg-teal-400/25 dark:hover:text-teal-500 dark:hover:bg-teal-600/15",
    "focus": "focus:ring-offset-0 focus:text-teal-700 focus:bg-teal-400/25 focus:ring-teal-600 dark:focus:text-teal-500 dark:focus:bg-teal-600/15 dark:focus:ring-teal-700",
  },
  "cyan": {
    "base": "text-cyan-600 dark:text-cyan-500/90",
    "hover": "hover:text-cyan-700 hover:bg-cyan-400/25 dark:hover:text-cyan-500 dark:hover:bg-cyan-600/15",
    "focus": "focus:ring-offset-0 focus:text-cyan-700 focus:bg-cyan-400/25 focus:ring-cyan-600 dark:focus:text-cyan-500 dark:focus:bg-cyan-600/15 dark:focus:ring-cyan-700",
  },
  "sky": {
    "base": "text-sky-600 dark:text-sky-500/90",
    "hover": "hover:text-sky-700 hover:bg-sky-400/25 dark:hover:text-sky-500 dark:hover:bg-sky-600/15",
    "focus": "focus:ring-offset-0 focus:text-sky-700 focus:bg-sky-400/25 focus:ring-sky-600 dark:focus:text-sky-500 dark:focus:bg-sky-600/15 dark:focus:ring-sky-700",
  },
  "blue": {
    "base": "text-blue-600",
    "hover": "hover:text-blue-700 hover:bg-blue-400/25 dark:hover:text-blue-500 dark:hover:bg-blue-600/15",
    "focus": "focus:ring-offset-0 focus:text-blue-700 focus:bg-blue-400/25 focus:ring-blue-600 dark:focus:text-blue-500 dark:focus:bg-blue-600/15 dark:focus:ring-blue-700",
  },
  "indigo": {
    "base": "text-indigo-600",
    "hover": "hover:text-indigo-700 hover:bg-indigo-400/25 dark:hover:text-indigo-500 dark:hover:bg-indigo-600/15",
    "focus": "focus:ring-offset-0 focus:text-indigo-700 focus:bg-indigo-400/25 focus:ring-indigo-600 dark:focus:text-indigo-500 dark:focus:bg-indigo-600/15 dark:focus:ring-indigo-700",
  },
  "violet": {
    "base": "text-violet-600",
    "hover": "hover:text-violet-700 hover:bg-violet-400/25 dark:hover:text-violet-500 dark:hover:bg-violet-600/15",
    "focus": "focus:ring-offset-0 focus:text-violet-700 focus:bg-violet-400/25 focus:ring-violet-600 dark:focus:text-violet-500 dark:focus:bg-violet-600/15 dark:focus:ring-violet-700",
  },
  "purple": {
    "base": "text-purple-600",
    "hover": "hover:text-purple-700 hover:bg-purple-400/25 dark:hover:text-purple-500 dark:hover:bg-purple-600/15",
    "focus": "focus:ring-offset-0 focus:text-purple-700 focus:bg-purple-400/25 focus:ring-purple-600 dark:focus:text-purple-500 dark:focus:bg-purple-600/15 dark:focus:ring-purple-700",
  },
  "fuchsia": {
    "base": "text-fuchsia-600",
    "hover": "hover:text-fuchsia-700 hover:bg-fuchsia-400/25 dark:hover:text-fuchsia-500 dark:hover:bg-fuchsia-600/15",
    "focus": "focus:ring-offset-0 focus:text-fuchsia-700 focus:bg-fuchsia-400/25 focus:ring-fuchsia-600 dark:focus:text-fuchsia-500 dark:focus:bg-fuchsia-600/15 dark:focus:ring-fuchsia-700",
  },
  "pink": {
    "base": "text-pink-600",
    "hover": "hover:text-pink-700 hover:bg-pink-400/25 dark:hover:text-pink-500 dark:hover:bg-pink-600/15",
    "focus": "focus:ring-offset-0 focus:text-pink-700 focus:bg-pink-400/25 focus:ring-pink-600 dark:focus:text-pink-500 dark:focus:bg-pink-600/15 dark:focus:ring-pink-700",
  },
  "rose": {
    "base": "text-rose-600",
    "hover": "hover:text-rose-700 hover:bg-rose-400/25 dark:hover:text-rose-500 dark:hover:bg-rose-600/15",
    "focus": "focus:ring-offset-0 focus:text-rose-700 focus:bg-rose-400/25 focus:ring-rose-600 dark:focus:text-rose-500 dark:focus:bg-rose-600/15 dark:focus:ring-rose-700",
  },
};

// prettier-ignore
export const lightProps: ButtonColor = {
  "none": {
    "base": "",
    "hover": "",
    "focus": "",
  },
  "dark": {
    "base": "text-dark-600 bg-dark-300/60 dark:bg-dark-600/60 dark:text-dark-400",
    "hover": "hover:text-dark-800 hover:bg-dark-400/60 dark:hover:text-dark-400 dark:hover:bg-dark-500/30",
    "focus": "focus:ring-offset-2 focus:text-dark-800 focus:bg-dark-400/60 focus:ring-dark-400 dark:focus:text-dark-400 dark:focus:bg-dark-500/30 dark:focus:ring-dark-700",
  },
  "primary": {
    "base": "text-primary-600 bg-primary-300/60 dark:bg-primary-600/60 dark:text-primary-400",
    "hover": "hover:text-primary-800 hover:bg-primary-400/60 dark:hover:text-primary-400 dark:hover:bg-primary-500/30",
    "focus": "focus:ring-offset-2 focus:text-primary-800 focus:bg-primary-400/60 focus:ring-primary-400 dark:focus:text-primary-400 dark:focus:bg-primary-500/30 dark:focus:ring-primary-700",
  },
  "secondary": {
    "base": "text-secondary-600 bg-secondary-300/60 dark:bg-secondary-600/60 dark:text-secondary-400",
    "hover": "hover:text-secondary-800 hover:bg-secondary-400/60 dark:hover:text-secondary-400 dark:hover:bg-secondary-500/30",
    "focus": "focus:ring-offset-2 focus:text-secondary-800 focus:bg-secondary-400/60 focus:ring-secondary-400 dark:focus:text-secondary-400 dark:focus:bg-secondary-500/30 dark:focus:ring-secondary-700",
  },
  "success": {
    "base": "text-success-600 bg-success-300/60 dark:bg-success-600/60 dark:text-success-500",
    "hover": "hover:text-success-800 hover:bg-success-400/60 dark:hover:text-success-400 dark:hover:bg-success-500/30",
    "focus": "focus:ring-offset-2 focus:text-success-800 focus:bg-success-400/60 focus:ring-success-400 dark:focus:text-success-400 dark:focus:bg-success-500/30 dark:focus:ring-success-700",
  },
  "error": {
    "base": "text-error-600 bg-error-300/60 dark:bg-error-600/60 dark:text-error-500",
    "hover": "hover:text-error-800 hover:bg-error-400/60 dark:hover:text-error-400 dark:hover:bg-error-500/30",
    "focus": "focus:ring-offset-2 focus:text-error-800 focus:bg-error-400/60 focus:ring-error-400 dark:focus:text-error-400 dark:focus:bg-error-500/30 dark:focus:ring-error-700",
  },
  "warning": {
    "base": "text-warning-600 bg-warning-300/60 dark:bg-warning-600/60 dark:text-warning-500",
    "hover": "hover:text-warning-800 hover:bg-warning-400/60 dark:hover:text-warning-400 dark:hover:bg-warning-500/30",
    "focus": "focus:ring-offset-2 focus:text-warning-800 focus:bg-warning-400/60 focus:ring-warning-400 dark:focus:text-warning-400 dark:focus:bg-warning-500/30 dark:focus:ring-warning-700",
  },
  "info": {
    "base": "text-info-600 bg-info-300/60 dark:bg-info-600/60 dark:text-info-400",
    "hover": "hover:text-info-800 hover:bg-info-400/60 dark:hover:text-info-400 dark:hover:bg-info-500/30",
    "focus": "focus:ring-offset-2 focus:text-info-800 focus:bg-info-400/60 focus:ring-info-400 dark:focus:text-info-400 dark:focus:bg-info-500/30 dark:focus:ring-info-700",
  },
  "white": {
    "base": "text-white bg-white/20",
    "hover": "hover:bg-white/30",
    "focus": "focus:ring-offset-2 focus:bg-white/35 focus:ring-white/60",
  },
  "black": {
    "base": "text-black bg-black/20",
    "hover": "hover:bg-black/30",
    "focus": "focus:ring-offset-2 focus:bg-black/35 focus:ring-black/60",
  },
  "slate": {
    "base": "text-slate-600 bg-slate-300/60 dark:bg-slate-500/60 dark:text-slate-400",
    "hover": "hover:text-slate-800 hover:bg-slate-400/60 dark:hover:text-slate-400 dark:hover:bg-slate-400/30",
    "focus": "focus:ring-offset-2 focus:text-slate-800 focus:bg-slate-400/60 focus:ring-slate-400 dark:focus:text-slate-400 dark:focus:bg-slate-400/30 dark:focus:ring-slate-700",
  },
  "gray": {
    "base": "text-gray-600 bg-gray-300/60 dark:bg-gray-500/60 dark:text-gray-400",
    "hover": "hover:text-gray-800 hover:bg-gray-400/60 dark:hover:text-gray-400 dark:hover:bg-gray-400/30",
    "focus": "focus:ring-offset-2 focus:text-gray-800 focus:bg-gray-400/60 focus:ring-gray-400 dark:focus:text-gray-400 dark:focus:bg-gray-400/30 dark:focus:ring-gray-700",
  },
  "zinc": {
    "base": "text-zinc-600 bg-zinc-300/60 dark:bg-zinc-500/60 dark:text-zinc-400",
    "hover": "hover:text-zinc-800 hover:bg-zinc-400/60 dark:hover:text-zinc-400 dark:hover:bg-zinc-400/30",
    "focus": "focus:ring-offset-2 focus:text-zinc-800 focus:bg-zinc-400/60 focus:ring-zinc-400 dark:focus:text-zinc-400 dark:focus:bg-zinc-400/30 dark:focus:ring-zinc-700",
  },
  "neutral": {
    "base": "text-neutral-600 bg-neutral-300/60 dark:bg-neutral-500/60 dark:text-neutral-400",
    "hover": "hover:text-neutral-800 hover:bg-neutral-400/60 dark:hover:text-neutral-400 dark:hover:bg-neutral-400/30",
    "focus": "focus:ring-offset-2 focus:text-neutral-800 focus:bg-neutral-400/60 focus:ring-neutral-400 dark:focus:text-neutral-400 dark:focus:bg-neutral-400/30 dark:focus:ring-neutral-700",
  },
  "stone": {
    "base": "text-stone-600 bg-stone-300/60 dark:bg-stone-500/60 dark:text-stone-400",
    "hover": "hover:text-stone-800 hover:bg-stone-400/60 dark:hover:text-stone-400 dark:hover:bg-stone-400/30",
    "focus": "focus:ring-offset-2 focus:text-stone-800 focus:bg-stone-400/60 focus:ring-stone-400 dark:focus:text-stone-400 dark:focus:bg-stone-400/30 dark:focus:ring-stone-700",
  },
  "red": {
    "base": "text-red-600 bg-red-300/60 dark:bg-red-600/60 dark:text-red-500",
    "hover": "hover:text-red-800 hover:bg-red-400/60 dark:hover:text-red-400 dark:hover:bg-red-500/30",
    "focus": "focus:ring-offset-2 focus:text-red-800 focus:bg-red-400/60 focus:ring-red-400 dark:focus:text-red-400 dark:focus:bg-red-500/30 dark:focus:ring-red-700",
  },
  "orange": {
    "base": "text-orange-600 bg-orange-300/60 dark:bg-orange-600/60 dark:text-orange-400",
    "hover": "hover:text-orange-800 hover:bg-orange-400/60 dark:hover:text-orange-400 dark:hover:bg-orange-500/30",
    "focus": "focus:ring-offset-2 focus:text-orange-800 focus:bg-orange-400/60 focus:ring-orange-400 dark:focus:text-orange-400 dark:focus:bg-orange-500/30 dark:focus:ring-orange-700",
  },
  "yellow": {
    "base": "text-yellow-600 bg-yellow-300/60 dark:bg-yellow-600/60 dark:text-yellow-500",
    "hover": "hover:text-yellow-800 hover:bg-yellow-400/60 dark:hover:text-yellow-400 dark:hover:bg-yellow-500/30",
    "focus": "focus:ring-offset-2 focus:text-yellow-800 focus:bg-yellow-400/60 focus:ring-yellow-400 dark:focus:text-yellow-400 dark:focus:bg-yellow-500/30 dark:focus:ring-yellow-700",
  },
  "amber": {
    "base": "text-amber-600 bg-amber-300/60 dark:bg-amber-600/60 dark:text-amber-500",
    "hover": "hover:text-amber-800 hover:bg-amber-400/60 dark:hover:text-amber-400 dark:hover:bg-amber-500/30",
    "focus": "focus:ring-offset-2 focus:text-amber-800 focus:bg-amber-400/60 focus:ring-amber-400 dark:focus:text-amber-400 dark:focus:bg-amber-500/30 dark:focus:ring-amber-700",
  },
  "lime": {
    "base": "text-lime-600 bg-lime-300/60 dark:bg-lime-600/60 dark:text-lime-400",
    "hover": "hover:text-lime-800 hover:bg-lime-400/60 dark:hover:text-lime-400 dark:hover:bg-lime-500/30",
    "focus": "focus:ring-offset-2 focus:text-lime-800 focus:bg-lime-400/60 focus:ring-lime-400 dark:focus:text-lime-400 dark:focus:bg-lime-500/30 dark:focus:ring-lime-700",
  },
  "green": {
    "base": "text-green-600 bg-green-300/60 dark:bg-green-600/60 dark:text-green-400",
    "hover": "hover:text-green-800 hover:bg-green-400/60 dark:hover:text-green-400 dark:hover:bg-green-500/30",
    "focus": "focus:ring-offset-2 focus:text-green-800 focus:bg-green-400/60 focus:ring-green-400 dark:focus:text-green-400 dark:focus:bg-green-500/30 dark:focus:ring-green-700",
  },
  "emerald": {
    "base": "text-emerald-600 bg-emerald-300/60 dark:bg-emerald-600/60 dark:text-emerald-400",
    "hover": "hover:text-emerald-800 hover:bg-emerald-400/60 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/30",
    "focus": "focus:ring-offset-2 focus:text-emerald-800 focus:bg-emerald-400/60 focus:ring-emerald-400 dark:focus:text-emerald-400 dark:focus:bg-emerald-500/30 dark:focus:ring-emerald-700",
  },
  "teal": {
    "base": "text-teal-600 bg-teal-300/60 dark:bg-teal-600/60 dark:text-teal-400",
    "hover": "hover:text-teal-800 hover:bg-teal-400/60 dark:hover:text-teal-400 dark:hover:bg-teal-500/30",
    "focus": "focus:ring-offset-2 focus:text-teal-800 focus:bg-teal-400/60 focus:ring-teal-400 dark:focus:text-teal-400 dark:focus:bg-teal-500/30 dark:focus:ring-teal-700",
  },
  "cyan": {
    "base": "text-cyan-600 bg-cyan-300/60 dark:bg-cyan-600/60 dark:text-cyan-400",
    "hover": "hover:text-cyan-800 hover:bg-cyan-400/60 dark:hover:text-cyan-400 dark:hover:bg-cyan-500/30",
    "focus": "focus:ring-offset-2 focus:text-cyan-800 focus:bg-cyan-400/60 focus:ring-cyan-400 dark:focus:text-cyan-400 dark:focus:bg-cyan-500/30 dark:focus:ring-cyan-700",
  },
  "sky": {
    "base": "text-sky-600 bg-sky-300/60 dark:bg-sky-600/60 dark:text-sky-400",
    "hover": "hover:text-sky-800 hover:bg-sky-400/60 dark:hover:text-sky-400 dark:hover:bg-sky-500/30",
    "focus": "focus:ring-offset-2 focus:text-sky-800 focus:bg-sky-400/60 focus:ring-sky-400 dark:focus:text-sky-400 dark:focus:bg-sky-500/30 dark:focus:ring-sky-700",
  },
  "blue": {
    "base": "text-blue-600 bg-blue-300/60 dark:bg-blue-600/60 dark:text-blue-400",
    "hover": "hover:text-blue-800 hover:bg-blue-400/60 dark:hover:text-blue-400 dark:hover:bg-blue-500/30",
    "focus": "focus:ring-offset-2 focus:text-blue-800 focus:bg-blue-400/60 focus:ring-blue-400 dark:focus:text-blue-400 dark:focus:bg-blue-500/30 dark:focus:ring-blue-700",
  },
  "indigo": {
    "base": "text-indigo-600 bg-indigo-300/60 dark:bg-indigo-600/60 dark:text-indigo-400",
    "hover": "hover:text-indigo-800 hover:bg-indigo-400/60 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/30",
    "focus": "focus:ring-offset-2 focus:text-indigo-800 focus:bg-indigo-400/60 focus:ring-indigo-400 dark:focus:text-indigo-400 dark:focus:bg-indigo-500/30 dark:focus:ring-indigo-700",
  },
  "violet": {
    "base": "text-violet-600 bg-violet-300/60 dark:bg-violet-600/60 dark:text-violet-400",
    "hover": "hover:text-violet-800 hover:bg-violet-400/60 dark:hover:text-violet-400 dark:hover:bg-violet-500/30",
    "focus": "focus:ring-offset-2 focus:text-violet-800 focus:bg-violet-400/60 focus:ring-violet-400 dark:focus:text-violet-400 dark:focus:bg-violet-500/30 dark:focus:ring-violet-700",
  },
  "purple": {
    "base": "text-purple-600 bg-purple-300/60 dark:bg-purple-600/60 dark:text-purple-400",
    "hover": "hover:text-purple-800 hover:bg-purple-400/60 dark:hover:text-purple-400 dark:hover:bg-purple-500/30",
    "focus": "focus:ring-offset-2 focus:text-purple-800 focus:bg-purple-400/60 focus:ring-purple-400 dark:focus:text-purple-400 dark:focus:bg-purple-500/30 dark:focus:ring-purple-700",
  },
  "fuchsia": {
    "base": "text-fuchsia-600 bg-fuchsia-300/60 dark:bg-fuchsia-600/60 dark:text-fuchsia-400",
    "hover": "hover:text-fuchsia-800 hover:bg-fuchsia-400/60 dark:hover:text-fuchsia-400 dark:hover:bg-fuchsia-500/30",
    "focus": "focus:ring-offset-2 focus:text-fuchsia-800 focus:bg-fuchsia-400/60 focus:ring-fuchsia-400 dark:focus:text-fuchsia-400 dark:focus:bg-fuchsia-500/30 dark:focus:ring-fuchsia-700",
  },
  "pink": {
    "base": "text-pink-600 bg-pink-300/60 dark:bg-pink-600/60 dark:text-pink-400",
    "hover": "hover:text-pink-800 hover:bg-pink-400/60 dark:hover:text-pink-400 dark:hover:bg-pink-500/30",
    "focus": "focus:ring-offset-2 focus:text-pink-800 focus:bg-pink-400/60 focus:ring-pink-400 dark:focus:text-pink-400 dark:focus:bg-pink-500/30 dark:focus:ring-pink-700",
  },
  "rose": {
    "base": "text-rose-600 bg-rose-300/60 dark:bg-rose-600/60 dark:text-rose-400",
    "hover": "hover:text-rose-800 hover:bg-rose-400/60 dark:hover:text-rose-400 dark:hover:bg-rose-500/30",
    "focus": "focus:ring-offset-2 focus:text-rose-800 focus:bg-rose-400/60 focus:ring-rose-400 dark:focus:text-rose-400 dark:focus:bg-rose-500/30 dark:focus:ring-rose-700",
  },
};

// prettier-ignore
export const solidProps: ButtonColor = {
  "none": {
    "base": "",
    "hover": "",
    "focus": "",
  },
  "dark": {
    "base": "text-white bg-dark-500 dark:bg-dark-700",
    "hover": "hover:text-white hover:bg-dark-600 dark:hover:bg-dark-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-dark-600 focus:ring-dark-600 dark:focus:bg-dark-600 dark:focus:ring-dark-600",
  },
  "primary": {
    "base": "text-white bg-primary-500 dark:bg-primary-700",
    "hover": "hover:text-white hover:bg-primary-600 dark:hover:bg-primary-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-primary-600 focus:ring-primary-600 dark:focus:bg-primary-600 dark:focus:ring-primary-600",
  },
  "secondary": {
    "base": "text-white bg-secondary-500 dark:bg-secondary-700",
    "hover": "hover:text-white hover:bg-secondary-600 dark:hover:bg-secondary-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-secondary-600 focus:ring-secondary-600 dark:focus:bg-secondary-600 dark:focus:ring-secondary-600",
  },
  "success": {
    "base": "text-white bg-success-500 dark:bg-success-700",
    "hover": "hover:text-white hover:bg-success-600 dark:hover:bg-success-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-success-600 focus:ring-success-600 dark:focus:bg-success-600 dark:focus:ring-success-600",
  },
  "error": {
    "base": "text-white bg-error-500 dark:bg-error-700",
    "hover": "hover:text-white hover:bg-error-600 dark:hover:bg-error-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-error-600 focus:ring-error-600 dark:focus:bg-error-600 dark:focus:ring-error-600",
  },
  "warning": {
    "base": "text-white bg-warning-500 dark:bg-warning-700",
    "hover": "hover:text-white hover:bg-warning-600 dark:hover:bg-warning-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-warning-600 focus:ring-warning-600 dark:focus:bg-warning-600 dark:focus:ring-warning-600",
  },
  "info": {
    "base": "text-white bg-info-500 dark:bg-info-700",
    "hover": "hover:text-white hover:bg-info-600 dark:hover:bg-info-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-info-600 focus:ring-info-600 dark:focus:bg-info-600 dark:focus:ring-info-600",
  },
  "white": {
    "base": "bg-white text-slate-500 dark:text-slate-100 dark:bg-white dark:text-slate-700",
    "hover": "hover:text-slate-600 hover:bg-slate-50 dark:hover:text-black dark:hover:bg-white",
    "focus": "focus:text-slate-600 focus:bg-slate-50 focus:ring-white focus:ring-offset-dark-900 dark:focus:bg-white dark:focus:ring-white",
  },
  "black": {
    "base": "bg-black text-white dark:border-slate-700 dark:bg-slate-700",
    "hover": "hover:text-white hover:bg-slate-900 dark:hover:bg-slate-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-slate-900 focus:ring-black dark:focus:bg-slate-600 dark:focus:ring-slate-600",
  },
  "slate": {
    "base": "text-white bg-slate-500 dark:bg-slate-700",
    "hover": "hover:text-white hover:bg-slate-600 dark:hover:bg-slate-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-slate-600 focus:ring-slate-600 dark:focus:bg-slate-600 dark:focus:ring-slate-600",
  },
  "gray": {
    "base": "text-white bg-gray-500 dark:bg-gray-700",
    "hover": "hover:text-white hover:bg-gray-600 dark:hover:bg-gray-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-gray-600 focus:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-gray-600",
  },
  "zinc": {
    "base": "text-white bg-zinc-500 dark:bg-zinc-700",
    "hover": "hover:text-white hover:bg-zinc-600 dark:hover:bg-zinc-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-zinc-600 focus:ring-zinc-600 dark:focus:bg-zinc-600 dark:focus:ring-zinc-600",
  },
  "neutral": {
    "base": "text-white bg-neutral-500 dark:bg-neutral-700",
    "hover": "hover:text-white hover:bg-neutral-600 dark:hover:bg-neutral-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-neutral-600 focus:ring-neutral-600 dark:focus:bg-neutral-600 dark:focus:ring-neutral-600",
  },
  "stone": {
    "base": "text-white bg-stone-500 dark:bg-stone-700",
    "hover": "hover:text-white hover:bg-stone-600 dark:hover:bg-stone-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-stone-600 focus:ring-stone-600 dark:focus:bg-stone-600 dark:focus:ring-stone-600",
  },
  "red": {
    "base": "text-white bg-red-500 dark:bg-red-700",
    "hover": "hover:text-white hover:bg-red-600 dark:hover:bg-red-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-red-600 focus:ring-red-600 dark:focus:bg-red-600 dark:focus:ring-red-600",
  },
  "orange": {
    "base": "text-white bg-orange-500 dark:bg-orange-700",
    "hover": "hover:text-white hover:bg-orange-600 dark:hover:bg-orange-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-orange-600 focus:ring-orange-600 dark:focus:bg-orange-600 dark:focus:ring-orange-600",
  },
  "yellow": {
    "base": "text-white bg-yellow-500 dark:bg-yellow-700",
    "hover": "hover:text-white hover:bg-yellow-600 dark:hover:bg-yellow-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-yellow-600 focus:ring-yellow-600 dark:focus:bg-yellow-600 dark:focus:ring-yellow-600",
  },
  "amber": {
    "base": "text-white bg-amber-500 dark:bg-amber-700",
    "hover": "hover:text-white hover:bg-amber-600 dark:hover:bg-amber-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-amber-600 focus:ring-amber-600 dark:focus:bg-amber-600 dark:focus:ring-amber-600",
  },
  "lime": {
    "base": "text-white bg-lime-500 dark:bg-lime-700",
    "hover": "hover:text-white hover:bg-lime-600 dark:hover:bg-lime-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-lime-600 focus:ring-lime-600 dark:focus:bg-lime-600 dark:focus:ring-lime-600",
  },
  "green": {
    "base": "text-white bg-green-500 dark:bg-green-700",
    "hover": "hover:text-white hover:bg-green-600 dark:hover:bg-green-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-green-600 focus:ring-green-600 dark:focus:bg-green-600 dark:focus:ring-green-600",
  },
  "emerald": {
    "base": "text-white bg-emerald-500 dark:bg-emerald-700",
    "hover": "hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-emerald-600 focus:ring-emerald-600 dark:focus:bg-emerald-600 dark:focus:ring-emerald-600",
  },
  "teal": {
    "base": "text-white bg-teal-500 dark:bg-teal-700",
    "hover": "hover:text-white hover:bg-teal-600 dark:hover:bg-teal-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-teal-600 focus:ring-teal-600 dark:focus:bg-teal-600 dark:focus:ring-teal-600",
  },
  "cyan": {
    "base": "text-white bg-cyan-500 dark:bg-cyan-700",
    "hover": "hover:text-white hover:bg-cyan-600 dark:hover:bg-cyan-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-cyan-600 focus:ring-cyan-600 dark:focus:bg-cyan-600 dark:focus:ring-cyan-600",
  },
  "sky": {
    "base": "text-white bg-sky-500 dark:bg-sky-700",
    "hover": "hover:text-white hover:bg-sky-600 dark:hover:bg-sky-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-sky-600 focus:ring-sky-600 dark:focus:bg-sky-600 dark:focus:ring-sky-600",
  },
  "blue": {
    "base": "text-white bg-blue-500 dark:bg-blue-700",
    "hover": "hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-blue-600 focus:ring-blue-600 dark:focus:bg-blue-600 dark:focus:ring-blue-600",
  },
  "indigo": {
    "base": "text-white bg-indigo-500 dark:bg-indigo-700",
    "hover": "hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-indigo-600 focus:ring-indigo-600 dark:focus:bg-indigo-600 dark:focus:ring-indigo-600",
  },
  "violet": {
    "base": "text-white bg-violet-500 dark:bg-violet-700",
    "hover": "hover:text-white hover:bg-violet-600 dark:hover:bg-violet-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-violet-600 focus:ring-violet-600 dark:focus:bg-violet-600 dark:focus:ring-violet-600",
  },
  "purple": {
    "base": "text-white bg-purple-500 dark:bg-purple-700",
    "hover": "hover:text-white hover:bg-purple-600 dark:hover:bg-purple-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-purple-600 focus:ring-purple-600 dark:focus:bg-purple-600 dark:focus:ring-purple-600",
  },
  "fuchsia": {
    "base": "text-white bg-fuchsia-500 dark:bg-fuchsia-700",
    "hover": "hover:text-white hover:bg-fuchsia-600 dark:hover:bg-fuchsia-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-fuchsia-600 focus:ring-fuchsia-600 dark:focus:bg-fuchsia-600 dark:focus:ring-fuchsia-600",
  },
  "pink": {
    "base": "text-white bg-pink-500 dark:bg-pink-700",
    "hover": "hover:text-white hover:bg-pink-600 dark:hover:bg-pink-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-pink-600 focus:ring-pink-600 dark:focus:bg-pink-600 dark:focus:ring-pink-600",
  },
  "rose": {
    "base": "text-white bg-rose-500 dark:bg-rose-700",
    "hover": "hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600",
    "focus": "focus:text-white focus:ring-offset-2 focus:bg-rose-600 focus:ring-rose-600 dark:focus:bg-rose-600 dark:focus:ring-rose-600",
  },
};

// prettier-ignore
export const outlineProps: ButtonColor = {
  "none": {
    "base": "",
    "hover": "",
    "focus": "",
  },
  "dark": {
    "base": "text-dark-600 border border-dark-600 dark:text-dark-400 dark:border-dark-400",
    "hover": "hover:text-dark-700 hover:bg-dark-400/25 dark:hover:text-dark-300/90 dark:hover:bg-dark-400/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-dark-700 focus:bg-dark-400/25 focus:ring-dark-600 dark:focus:text-dark-300/90 dark:focus:bg-dark-400/15 dark:focus:ring-dark-500",
  },
  "primary": {
    "base": "text-primary-600 border border-primary-600",
    "hover": "hover:text-primary-700 hover:bg-primary-400/25 dark:hover:text-primary-500 dark:hover:bg-primary-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-primary-700 focus:bg-primary-400/25 focus:ring-primary-600 dark:focus:text-primary-500 dark:focus:bg-primary-600/15 dark:focus:ring-primary-700",
  },
  "secondary": {
    "base": "text-secondary-600 border border-secondary-600",
    "hover": "hover:text-secondary-700 hover:bg-secondary-400/25 dark:hover:text-secondary-500 dark:hover:bg-secondary-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-secondary-700 focus:bg-secondary-400/25 focus:ring-secondary-600 dark:focus:text-secondary-500 dark:focus:bg-secondary-600/15 dark:focus:ring-secondary-700",
  },
  "success": {
    "base": "text-success-600 border border-success-600 dark:text-success-500/90 dark:border-success-500/80",
    "hover": "hover:text-success-700 hover:bg-success-400/25 dark:hover:text-success-500 dark:hover:bg-success-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-success-700 focus:bg-success-400/25 focus:ring-success-600 dark:focus:text-success-500 dark:focus:bg-success-600/15 dark:focus:ring-success-700",
  },
  "error": {
    "base": "text-error-600 border border-error-600",
    "hover": "hover:text-error-700 hover:bg-error-400/25 dark:hover:text-error-500 dark:hover:bg-error-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-error-700 focus:bg-error-400/25 focus:ring-error-600 dark:focus:text-error-500 dark:focus:bg-error-600/15 dark:focus:ring-error-700",
  },
  "warning": {
    "base": "text-warning-600 border border-warning-600",
    "hover": "hover:text-warning-700 hover:bg-warning-400/25 dark:hover:text-warning-500 dark:hover:bg-warning-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-warning-700 focus:bg-warning-400/25 focus:ring-warning-600 dark:focus:text-warning-500 dark:focus:bg-warning-600/15 dark:focus:ring-warning-700",
  },
  "info": {
    "base": "text-info-600 border border-info-600",
    "hover": "hover:text-info-700 hover:bg-info-400/25 dark:hover:text-info-500 dark:hover:bg-info-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-info-700 focus:bg-info-400/25 focus:ring-info-600 dark:focus:text-info-500 dark:focus:bg-info-600/15 dark:focus:ring-info-700",
  },
  "white": {
    "base": "text-white border border-white dark:border-white/80",
    "hover": "hover:text-white hover:bg-white/30 dark:hover:text-white dark:hover:bg-white",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-white focus:bg-slate-100/25 focus:ring-white focus:ring-offset-dark-900 dark:focus:text-white dark:focus:bg-white dark:focus:ring-white/80",
  },
  "black": {
    "base": "text-black border border-black dark:border-black",
    "hover": "hover:text-black hover:bg-black/10 dark:hover:text-black dark:hover:bg-black",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-black focus:bg-black/10 focus:ring-black dark:focus:text-black dark:focus:bg-black dark:focus:ring-black",
  },
  "slate": {
    "base": "text-slate-600 border border-slate-600 dark:text-slate-400 dark:border-slate-400",
    "hover": "hover:text-slate-700 hover:bg-slate-400/25 dark:hover:text-slate-300 dark:hover:bg-slate-400/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-slate-700 focus:bg-slate-400/25 focus:ring-slate-600 dark:focus:text-slate-300 dark:focus:bg-slate-400/15 dark:focus:ring-slate-400",
  },
  "gray": {
    "base": "text-gray-600 border border-gray-600 dark:text-gray-400 dark:border-gray-400",
    "hover": "hover:text-gray-700 hover:bg-gray-400/25 dark:hover:text-gray-300 dark:hover:bg-gray-400/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-gray-700 focus:bg-gray-400/25 focus:ring-gray-600 dark:focus:text-gray-300 dark:focus:bg-gray-400/15 dark:focus:ring-gray-400",
  },
  "zinc": {
    "base": "text-zinc-600 border border-zinc-600 dark:text-zinc-400 dark:border-zinc-400",
    "hover": "hover:text-zinc-700 hover:bg-zinc-400/25 dark:hover:text-zinc-300 dark:hover:bg-zinc-400/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-zinc-700 focus:bg-zinc-400/25 focus:ring-zinc-600 dark:focus:text-zinc-300 dark:focus:bg-zinc-400/15 dark:focus:ring-zinc-400",
  },
  "neutral": {
    "base": "text-neutral-600 border border-neutral-600 dark:text-neutral-400 dark:border-neutral-400",
    "hover": "hover:text-neutral-700 hover:bg-neutral-400/25 dark:hover:text-neutral-300 dark:hover:bg-neutral-400/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-neutral-700 focus:bg-neutral-400/25 focus:ring-neutral-600 dark:focus:text-neutral-300 dark:focus:bg-neutral-400/15 dark:focus:ring-neutral-400",
  },
  "stone": {
    "base": "text-stone-600 border border-stone-600 dark:text-stone-400 dark:border-stone-400",
    "hover": "hover:text-stone-700 hover:bg-stone-400/25 dark:hover:text-stone-300 dark:hover:bg-stone-400/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-stone-700 focus:bg-stone-400/25 focus:ring-stone-600 dark:focus:text-stone-300 dark:focus:bg-stone-400/15 dark:focus:ring-stone-400",
  },
  "red": {
    "base": "text-red-600 border border-red-600",
    "hover": "hover:text-red-700 hover:bg-red-400/25 dark:hover:text-red-500 dark:hover:bg-red-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-red-700 focus:bg-red-400/25 focus:ring-red-600 dark:focus:text-red-500 dark:focus:bg-red-600/15 dark:focus:ring-red-700",
  },
  "orange": {
    "base": "text-orange-600 border border-orange-600",
    "hover": "hover:text-orange-700 hover:bg-orange-400/25 dark:hover:text-orange-500 dark:hover:bg-orange-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-orange-700 focus:bg-orange-400/25 focus:ring-orange-600 dark:focus:text-orange-500 dark:focus:bg-orange-600/15 dark:focus:ring-orange-700",
  },
  "yellow": {
    "base": "text-yellow-600 border border-yellow-600",
    "hover": "hover:text-yellow-700 hover:bg-yellow-400/25 dark:hover:text-yellow-500 dark:hover:bg-yellow-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-yellow-700 focus:bg-yellow-400/25 focus:ring-yellow-600 dark:focus:text-yellow-500 dark:focus:bg-yellow-600/15 dark:focus:ring-yellow-700",
  },
  "amber": {
    "base": "text-amber-600 border border-amber-600",
    "hover": "hover:text-amber-700 hover:bg-amber-400/25 dark:hover:text-amber-500 dark:hover:bg-amber-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-amber-700 focus:bg-amber-400/25 focus:ring-amber-600 dark:focus:text-amber-500 dark:focus:bg-amber-600/15 dark:focus:ring-amber-700",
  },
  "lime": {
    "base": "text-lime-600 border border-lime-600",
    "hover": "hover:text-lime-700 hover:bg-lime-400/25 dark:hover:text-lime-500 dark:hover:bg-lime-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-lime-700 focus:bg-lime-400/25 focus:ring-lime-600 dark:focus:text-lime-500 dark:focus:bg-lime-600/15 dark:focus:ring-lime-700",
  },
  "green": {
    "base": "text-green-600 border border-green-600",
    "hover": "hover:text-green-700 hover:bg-green-400/25 dark:hover:text-green-500 dark:hover:bg-green-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-green-700 focus:bg-green-400/25 focus:ring-green-600 dark:focus:text-green-500 dark:focus:bg-green-600/15 dark:focus:ring-green-700",
  },
  "emerald": {
    "base": "text-emerald-600 border border-emerald-600 dark:text-emerald-500/90 dark:border-emerald-500/80",
    "hover": "hover:text-emerald-700 hover:bg-emerald-400/25 dark:hover:text-emerald-500 dark:hover:bg-emerald-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-emerald-700 focus:bg-emerald-400/25 focus:ring-emerald-600 dark:focus:text-emerald-500 dark:focus:bg-emerald-600/15 dark:focus:ring-emerald-700",
  },
  "teal": {
    "base": "text-teal-600 border border-teal-600 dark:text-teal-500/90 dark:border-teal-500/80",
    "hover": "hover:text-teal-700 hover:bg-teal-400/25 dark:hover:text-teal-500 dark:hover:bg-teal-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-teal-700 focus:bg-teal-400/25 focus:ring-teal-600 dark:focus:text-teal-500 dark:focus:bg-teal-600/15 dark:focus:ring-teal-500/80",
  },
  "cyan": {
    "base": "text-cyan-600 border border-cyan-600",
    "hover": "hover:text-cyan-700 hover:bg-cyan-400/25 dark:hover:text-cyan-500 dark:hover:bg-cyan-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-cyan-700 focus:bg-cyan-400/25 focus:ring-cyan-600 dark:focus:text-cyan-500 dark:focus:bg-cyan-600/15 dark:focus:ring-cyan-700",
  },
  "sky": {
    "base": "text-sky-600 border border-sky-600",
    "hover": "hover:text-sky-700 hover:bg-sky-400/25 dark:hover:text-sky-500 dark:hover:bg-sky-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-sky-700 focus:bg-sky-400/25 focus:ring-sky-600 dark:focus:text-sky-500 dark:focus:bg-sky-600/15 dark:focus:ring-sky-700",
  },
  "blue": {
    "base": "text-blue-600 border border-blue-600",
    "hover": "hover:text-blue-700 hover:bg-blue-400/25 dark:hover:text-blue-500 dark:hover:bg-blue-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-blue-700 focus:bg-blue-400/25 focus:ring-blue-600 dark:focus:text-blue-500 dark:focus:bg-blue-600/15 dark:focus:ring-blue-700",
  },
  "indigo": {
    "base": "text-indigo-600 border border-indigo-600",
    "hover": "hover:text-indigo-700 hover:bg-indigo-400/25 dark:hover:text-indigo-500 dark:hover:bg-indigo-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-indigo-700 focus:bg-indigo-400/25 focus:ring-indigo-600 dark:focus:text-indigo-500 dark:focus:bg-indigo-600/15 dark:focus:ring-indigo-700",
  },
  "violet": {
    "base": "text-violet-600 border border-violet-600",
    "hover": "hover:text-violet-700 hover:bg-violet-400/25 dark:hover:text-violet-500 dark:hover:bg-violet-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-violet-700 focus:bg-violet-400/25 focus:ring-violet-600 dark:focus:text-violet-500 dark:focus:bg-violet-600/15 dark:focus:ring-violet-700",
  },
  "purple": {
    "base": "text-purple-600 border border-purple-600",
    "hover": "hover:text-purple-700 hover:bg-purple-400/25 dark:hover:text-purple-500 dark:hover:bg-purple-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-purple-700 focus:bg-purple-400/25 focus:ring-purple-600 dark:focus:text-purple-500 dark:focus:bg-purple-600/15 dark:focus:ring-purple-700",
  },
  "fuchsia": {
    "base": "text-fuchsia-600 border border-fuchsia-600",
    "hover": "hover:text-fuchsia-700 hover:bg-fuchsia-400/25 dark:hover:text-fuchsia-500 dark:hover:bg-fuchsia-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-fuchsia-700 focus:bg-fuchsia-400/25 focus:ring-fuchsia-600 dark:focus:text-fuchsia-500 dark:focus:bg-fuchsia-600/15 dark:focus:ring-fuchsia-700",
  },
  "pink": {
    "base": "text-pink-600 border border-pink-600",
    "hover": "hover:text-pink-700 hover:bg-pink-400/25 dark:hover:text-pink-500 dark:hover:bg-pink-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-pink-700 focus:bg-pink-400/25 focus:ring-pink-600 dark:focus:text-pink-500 dark:focus:bg-pink-600/15 dark:focus:ring-pink-700",
  },
  "rose": {
    "base": "text-rose-600 border border-rose-600",
    "hover": "hover:text-rose-700 hover:bg-rose-400/25 dark:hover:text-rose-500 dark:hover:bg-rose-600/15",
    "focus": "focus:border-transparent dark:focus:border-transparent focus:ring-offset-0 focus:text-rose-700 focus:bg-rose-400/25 focus:ring-rose-600 dark:focus:text-rose-500 dark:focus:bg-rose-600/15 dark:focus:ring-rose-700",
  },
};
