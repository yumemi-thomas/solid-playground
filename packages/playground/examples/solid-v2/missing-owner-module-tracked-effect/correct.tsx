import { createTrackedEffect } from 'solid-js';

export function App() {
  createTrackedEffect(() => console.log('inside owner'));
  return <p>ready</p>;
}
