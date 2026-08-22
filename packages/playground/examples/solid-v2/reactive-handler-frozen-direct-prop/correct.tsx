import { createStore } from 'solid-js';

function noop() {}

function Button(props: { onClick: () => void }) {
  return <button onClick={() => props.onClick()}>Save</button>;
}

const [handlers, setHandlers] = createStore({ click: noop });

export function App() {
  return (
    <>
      <Button onClick={handlers.click} />
      <button
        onClick={() =>
          setHandlers((draft) => {
            draft.click = () => console.log('new handler');
          })
        }
      >
        Replace handler
      </button>
    </>
  );
}
