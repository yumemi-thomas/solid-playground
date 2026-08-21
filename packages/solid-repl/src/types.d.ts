/// <reference types="vite/client" />

declare module 'solid-repl' {
  export interface Tab {
    name: string;
    source: string;
    id?: string;
  }

  export const defaultTabs: Tab[];

  export interface EditorPersistedState {
    anchor: number;
    head: number;
    topPos: number;
  }

  export interface ReplStorage {
    getLayout?(): import('dockview-core').SerializedDockview | undefined;
    setLayout?(layout: import('dockview-core').SerializedDockview): void;
    getEditorState?(fileId: string): EditorPersistedState | undefined;
    setEditorState?(fileId: string, state: EditorPersistedState | null): void;
  }
}

declare module 'solid-repl/dist/repl' {
  import type { ReplStorage } from 'solid-repl';

  export type Repl = import('solid-js').Component<{
    compiler: Worker;
    formatter: Worker;
    linter: Worker;
    dark: boolean;
    tabs: Tab[];
    id: string;
    version?: string;
    exampleRule?: string;
    hideDevtools?: boolean;
    setTabs: (tab: Tab[]) => void;
    /**
     * File names to open and reveal. Pass a fresh array to request it again;
     * the first name that resolves to a file becomes the active tab.
     */
    openFiles?: string[];
    reset: () => void;
    onUserEdit?: () => void;
    storage?: ReplStorage;
  }>;
  const Repl: Repl;
  export default Repl;
}

declare module '*.css';
