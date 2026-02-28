import { useState, useCallback } from "react";
import { ElectricityScatter } from "./components/ElectricityScatter";
import isoDataset from "../data/verified/iso_scatter_data.json";
import isoDataset2023 from "../data/verified/iso_scatter_data_2023.json";
import isoDataset2025 from "../data/verified/iso_scatter_data_2025_est.json";
import stateDataset from "../data/verified/state_scatter_data.json";
import stateDataset2023 from "../data/verified/state_scatter_data_2023.json";
import type { ISOScatterDataset, ISODataPoint } from "./lib/types";

type StateDataset = { metadata: ISOScatterDataset["metadata"]; states: ISODataPoint[] };

const isoData2024 = (isoDataset as ISOScatterDataset).isos;
const isoData2023 = (isoDataset2023 as ISOScatterDataset).isos;
const isoData2025 = (isoDataset2025 as ISOScatterDataset).isos;
const stateData2024 = (stateDataset as StateDataset).states;
const stateData2023 = (stateDataset2023 as StateDataset).states;

export type YearKey = "2023" | "2024" | "2025";

const isoDataByYear: Record<YearKey, ISODataPoint[]> = {
  "2023": isoData2023,
  "2024": isoData2024,
  "2025": isoData2025,
};

const availableYears: YearKey[] = ["2023", "2024", "2025"];
const stateYears: YearKey[] = ["2023", "2024"];
const allIsoData: ISODataPoint[] = [...isoData2023, ...isoData2024, ...isoData2025];
const allStateData: ISODataPoint[] = [...stateData2023, ...stateData2024];

const stateDataByYear: Record<YearKey, ISODataPoint[]> = {
  "2023": stateData2023,
  "2024": stateData2024,
  "2025": stateData2024, // No 2025 state data; fall back to 2024
};

export default function App() {
  const [year, setYear] = useState<YearKey>("2024");

  const handleYearChange = useCallback((y: YearKey) => {
    setYear(y);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px 12px",
        minHeight: "100vh",
        background: "#fff",
      }}
    >
      <ElectricityScatter
        isoData={isoDataByYear[year]}
        allIsoData={allIsoData}
        isoDataByYear={isoDataByYear}
        stateData={stateDataByYear[year]}
        allStateData={allStateData}
        stateDataByYear={stateDataByYear}
        year={year}
        availableYears={availableYears}
        stateYears={stateYears}
        onYearChange={handleYearChange}
      />
    </div>
  );
}
