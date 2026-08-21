import type { Component } from 'solid-js';

type Props = { title: string };

export const Card: Component<Props> = (props) => <h2>{props.title}</h2>;
