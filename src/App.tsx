import { useState } from "react";
import ConnectionScreen from "./components/ConnectionScreen";
import Files from "./components/Files";

const App = () => {
  const [connected, setConnected] = useState(false);

  return (
    <>
      {!connected ? (
        <ConnectionScreen onConnect={() => setConnected(true)} />
      ) : (
        <Files onDisconnect={() => setConnected(false)} />
      )}
    </>
  );
}

export default App;