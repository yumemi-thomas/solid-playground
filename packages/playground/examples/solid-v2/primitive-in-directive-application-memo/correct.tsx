function tooltip() {
  return (element: HTMLElement) => {
    element.title = 'Save';
  };
}

export function App() {
  return <button ref={tooltip()}>Save</button>;
}
