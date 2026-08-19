// Every import here resolves to a contract solid-checker ships and version-pins,
// so the reactive graph this file builds is followed end to end and the project
// certifies.
import { createMemo, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

const [count] = createSignal(0);
const doubled = createMemo(() => count() * 2);

export function mount(target: HTMLElement) {
  return render(() => <span>{doubled()}</span>, target);
}
