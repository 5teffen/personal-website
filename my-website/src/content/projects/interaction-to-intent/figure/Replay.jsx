import ProvenanceReplay from "./ProvenanceReplay.jsx";
import sample from "../data/sample.json";

// Hydrated as an island. Uses only bundled data, so it works when the demo backend is down.
export default function Replay(props) {
  return <ProvenanceReplay data={sample} {...props} />;
}
