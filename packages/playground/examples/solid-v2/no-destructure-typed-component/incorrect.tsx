import type { Component } from 'solid-js';

type Props = { title: string };

// The explicit Component type does not turn a setup-time destructure into a
// reactive read, especially when this exported value has unknown call sites.
export const Card: Component<Props> = ({ title }) => <h2>{title}</h2>;
