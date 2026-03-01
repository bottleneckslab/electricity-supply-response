# Electricity Supply Response

Interactive scatter chart comparing wholesale electricity prices vs. new generation capacity across US ISOs/RTOs. Inspired by Owen Zidar's housing economics work (rents vs. building permits across metros).

**Thesis**: Structural barriers to building new generation — queue dysfunction, permitting friction, multi-state coordination — are a key structural factor behind persistently high electricity prices, alongside fuel mix exposure, pipeline constraints, and carbon policy costs. ISOs that build easily (ERCOT, MISO) tend toward lower prices; ISOs that can't build (ISO-NE, NYISO) stay expensive.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173. The chart renders immediately using the curated dataset in `data/verified/iso_scatter_data.json`.

## Regenerating Data

The curated JSON is committed so the chart works out of the box. The single source of truth is `data/audit_all_data.csv`.

### Workflow

```bash
# 1. Edit data/audit_all_data.csv
# 2. Validate
npm run data:validate
# 3. Rebuild JSON from CSV
npm run data:build
# 4. (Optional) Generate HTML audit table
npm run data:audit
```

See [DATA_SOURCES.md](DATA_SOURCES.md) for authoritative sources and annual refresh procedure.

## Tech Stack

- **Chart**: [visx](https://airbnb.io/visx/) (React + D3 primitives) for full SVG control
- **Build**: Vite + TypeScript
- **Data pipeline**: Python (CSV → JSON, no external dependencies)

## Author

Bottlenecks Lab
