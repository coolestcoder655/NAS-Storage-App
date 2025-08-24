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
        <Files
          onDisconnect={() => setConnected(false)}
          ip="192.168.1.100"
          port={22}
        />
      )}
    </>
  );
}

export default App;