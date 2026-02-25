# Methodology

## Overview

This chart plots **average wholesale electricity price** (x-axis) against **new generation capacity per unit of system peak** (y-axis) across the seven major US ISOs/RTOs. The thesis: ISOs with functional interconnection processes and market structures (ERCOT) produce a strong "supply response" — high prices attract new generation that eventually moderates prices. ISOs with dysfunctional queues and permitting friction (ISO-NE, NYISO) exhibit a broken supply response — high prices persist because new supply can't get built.

This mirrors the Zidar housing economics framing: rents vs. building permits across metros, where Austin builds and San Francisco doesn't.

## Data Sources

All data is for calendar year **2024** unless otherwise noted.

### Wholesale Electricity Prices ($/MWh)

Day-ahead or real-time load-weighted average prices from each ISO's independent market monitor:

| ISO | Value | Source |
|-----|-------|--------|
| ERCOT | $27.33 | E3 2024 ERCOT Market Update (ERCOT North Hub DA avg) |
| SPP | $27.56 | SPP 2024 Annual State of the Market Report (DA system avg) |
| MISO | $31.00 | Potomac Economics 2024 MISO State of the Market (RT avg LMP) |
| PJM | $33.74 | Monitoring Analytics 2024 PJM State of the Market (RT LW avg LMP) |
| CAISO | $38.00 | CAISO DMM Q3/Q4 2024 Quarterly Reports (est. annual DA avg) |
| NYISO | $41.81 | NYISO "Impact of National & Global Conditions on Electricity Prices in New York" white paper |
| ISO-NE | $41.47 | ISO-NE Internal Market Monitor 2024 Annual Markets Report (DA avg) |

**Notes:**
- ERCOT 2024 prices dropped ~50% from 2023 ($55.50) due to massive solar/battery additions suppressing peak prices.
- **DA/RT mixing**: ERCOT, SPP, and ISO-NE use day-ahead averages; MISO and PJM use real-time averages. DA prices are typically $1–3/MWh higher than RT. CAISO and NYISO are estimates from available reports. This introduces ~$2–5/MWh noise but the relative ordering is robust.
- NYISO has extreme zonal divergence: Zone J (NYC) averages ~$50+/MWh, upstate Zone A ~$25/MWh. The system-wide average obscures this.
- ISO-NE's all-in cost (energy + capacity + ancillary) was $87/MWh — highest nationally.

### New Generation Capacity (MW)

Generators reaching commercial operation in 2024, from EIA-860M filings and ISO reports:

| ISO | New MW | Primary sources | Key breakdown |
|-----|--------|----------------|---------------|
| ERCOT | 18,700 | E3; IEEFA; Dallas Fed; Amperon | 9.7 GW solar, 4.4 GW battery, 3.4 GW gas, ~1.2 GW wind |
| MISO | 7,500 | Brattle; MISO Capacity Credit Report | ~6.7 GW solar, ~0.8 GW wind + other |
| CAISO | 7,500 | CAISO Battery Storage Report; Amperon | 4.2 GW battery, 3 GW solar |
| PJM | 4,800 | PJM SOM; Amperon | 4.5 GW solar, 0.29 GW wind |
| SPP | 2,500 | SPP ELCC Report; Amperon | 1.2 GW wind, 0.5 GW solar, 0.8 GW battery |
| NYISO | 950 | NYISO Winter Assessment; ESAI Power | Mixed clean energy |
| ISO-NE | 400 | ISO Newswire; Vineyard Wind | 136 MW offshore wind, ~200 MW solar |

### Peak Demand (GW)

System coincident peak from 2024, used to normalize capacity additions and size bubbles:

| ISO | Peak GW | Date | Source |
|-----|---------|------|--------|
| PJM | 152.6 | July 16, 2024 | Amperon; PJM |
| MISO | 121.6 | Aug 26, 2024 | Amperon |
| ERCOT | 85.6 | Aug 20, 2024 | ERCOT (all-time record) |
| SPP | 54.0 | Summer 2024 | SPP State of the Market |
| CAISO | 48.3 | Sept 5, 2024 | Amperon |
| NYISO | 29.0 | July 8, 2024 | NYISO |
| ISO-NE | 24.4 | July 16, 2024 | FEL Power; ISO-NE |

### Interconnection Queue Completion Rates (%)

Share of projects entering the interconnection queue that reach commercial operation. From LBNL "Queued Up" 2025 Edition and the Brattle/AEU Generator Interconnection Scorecard:

| ISO | Rate | Cohort | Source |
|-----|------|--------|--------|
| ERCOT | 42.6% | 2018–2020 | Brattle/AEU Scorecard |
| MISO | 30% | 2000–2019 | Concentric Energy Advisors; LBNL |
| SPP | 15% | 2000–2019 | LBNL; Brattle |
| PJM | 12% | 2000–2019 | LBNL; RMI |
| CAISO | 10% | 2000–2019 | Concentric Energy Advisors; LBNL |
| NYISO | 10% | 2000–2019 | LBNL; Brattle |
| ISO-NE | 8% | 2000–2019 | LBNL; Brattle/AEU Scorecard |

National average: only 13% of capacity requesting interconnection (2000–2019) reached COD by end of 2024.

## Derived Metrics

### Supply Response Intensity (MW per GW peak)

New capacity additions normalized by system peak demand:

```
supply_response = capacity_additions_mw / peak_demand_gw
```

| ISO | MW/GW |
|-----|-------|
| ERCOT | 218.5 |
| CAISO | 155.3 |
| MISO | 61.7 |
| SPP | 46.3 |
| NYISO | 32.8 |
| PJM | 31.4 |
| ISO-NE | 16.4 |

### Bubble Sizing

Bubble radius uses a square-root scale of peak demand (area-proportional representation):

```
radius = sqrt_scale(peak_demand_gw, domain=[24, 153], range=[14px, 48px])
```

## Color Groups

| Group | ISOs | Rationale |
|-------|------|-----------|
| Functional (blue) | ERCOT, SPP, MISO | High queue throughput, active building |
| Intermediate (purple/gray) | CAISO, PJM | Building occurs but queue backlog is severe |
| Broken (red) | NYISO, ISO-NE | Minimal new supply despite high prices |

## Caveats

1. **Price comparability**: The dataset mixes DA averages (ERCOT, SPP, ISO-NE) with RT averages (MISO, PJM) and estimates (CAISO, NYISO). DA prices are typically $1–3/MWh higher. ERCOT uses a single hub (North Hub) while others use system-wide or load-weighted averages. The relative ordering is robust despite this noise.
2. **ERCOT outlier year**: 2024 prices were anomalously low due to the solar/battery buildout. 2023 ($55.50) was more typical — the supply response worked *so well* it crashed prices.
3. **CAISO's position**: High capacity additions are driven by state mandates (SB 100) and battery storage policy, not purely market signals. The low queue completion rate reflects speculative queue entries.
4. **Queue cohort timing**: ERCOT's 42.6% uses 2018–2020 cohorts (Brattle/AEU Scorecard); others use 2000–2019 (LBNL). Newer cohorts inherently show lower completion rates because less time has elapsed. The Brattle scorecard reports SPP, PJM, NYISO, and ISO-NE all at "<10%" for the 2018–2020 cohort — the values shown here (8–15%) draw from LBNL's longer cohort and are therefore not strictly comparable to ERCOT's.
5. **Peak demand normalization**: Using nameplate MW vs. peak GW overstates variable resources (solar, wind) relative to firm capacity. An alternative metric using ELCC-weighted additions would show even starker differences.
6. **Gross vs. net capacity**: All capacity figures are gross nameplate additions, not net of retirements. Significant coal retirements occurred in MISO and PJM in 2024 that are not reflected.
7. **ERCOT peak demand**: The 85.6 GW figure reflects ERCOT's preliminary real-time value (Aug 20, 2024). Settled data shows 85.2 GW, slightly below the 2023 record of 85.5 GW. Whether 2024 was an all-time record depends on data vintage.
