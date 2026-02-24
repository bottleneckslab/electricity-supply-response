import { ElectricityScatter } from "./components/ElectricityScatter";
import dataset from "../data/verified/iso_scatter_data.json";
import type { ISOScatterDataset } from "./lib/types";

const data = dataset as ISOScatterDataset;

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        minHeight: "100vh",
        background: "#fff",
      }}
    >
      <ElectricityScatter data={data.isos} />
    </div>
  );
}
