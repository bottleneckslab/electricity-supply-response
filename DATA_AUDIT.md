# Data Audit & Citation Document

## Purpose

This document provides a field-by-field audit trail for every data point in `data/verified/iso_scatter_data.json`. Each value is paired with its primary source citation, methodology annotation, and a verification checkbox. The goal: any reviewer can independently verify every number in the dataset without re-reading the methodology doc or hunting through source reports.

**Scope:** 7 ISOs, ~15 fields each, calendar year 2024 data.
**Data vintage:** Compiled 2026-02-24, primary data year 2024.
**Author:** Bottlenecks Lab

## How to Use This Document

1. Find the ISO section for the value you want to verify
2. Locate the field row in the table
3. Follow the source citation to the primary document
4. Check the methodology column for any transformations, estimates, or caveats
5. Mark the verification column with the appropriate status

## Verification Key

| Marker | Meaning |
|--------|---------|
| `[ ]`  | Not yet verified against primary source |
| `[✓]`  | Verified — value matches primary source exactly |
| `[~]`  | Approximately confirmed (tolerance noted in cell) |
| `[!]`  | Discrepancy found (details noted in cell) |

---

## 1. ERCOT — Electric Reliability Council of Texas

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $27.33 | E3 2024 ERCOT Market Update [1] | ERCOT North Hub day-ahead average, 2024 annual. Down ~50% from 2023 ($55.50) due to massive solar/battery additions suppressing peak prices. | `[ ]` |
| `all_in_price_mwh` | $27.33 | Same as wholesale [1] | Energy-only market — no capacity payments. All-in = wholesale. | `[ ]` |
| Capacity adder | $0.00 | N/A | ERCOT has no capacity market or capacity auction mechanism. | `[ ]` |
| `capacity_additions_mw` | 18,700 MW | E3 [1]; IEEFA [2]; Dallas Fed [3]; Amperon [4] | Gross nameplate MW reaching COD in 2024. Breakdown: 9.7 GW solar, 4.4 GW battery, 3.4 GW gas, ~1.2 GW wind. Not net of retirements. | `[ ]` |
| `capacity_additions_elcc_mw` | 9,800 MW | Derived from nameplate using ELCC factors | Approximate ELCC factors: solar ~30%, battery ~85%, gas 95%, wind ~15–20%. See cross-cutting note [A]. | `[ ]` |
| `project_count` | 180 | EIA-860M unit-level filings [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 85.2 GW | ERCOT settled value [6] | Aug 20, 2024. Revised down from preliminary 85.6 GW. Below 2023 record of 85.5 GW — not an all-time record. | `[ ]` |
| `queue_completion_pct` | 42.6% | Brattle/Grid Strategies/AEU Scorecard [7] | **2018–2020 entry cohort** — narrower than other ISOs' 2000–2019 cohort. See cross-cutting note [B]. Structural advantages: isolated grid, no FERC jurisdiction, single-state, energy-only market reduces speculative entries. | `[ ]` |
| `queue_cohort` | 2018–2020 | Brattle/AEU Scorecard [7] | Narrower cohort than other ISOs. See comparability note [B]. | `[ ]` |
| `price_2023_mwh` | $55.50 | E3 [1] | Prior-year reference. 2024 price is the *result* of supply response triggered by 2021–2023 price signals. | `[ ]` |
| `color_group` | functional | Bottlenecks Lab classification | Rationale: highest queue throughput (42.6%), highest supply response intensity (219.5 MW/GW nameplate), active market-driven building. | `[ ]` |
| Derived: MW/GW (nameplate) | 219.5 | Calculated: 18,700 / 85.2 | Corrected from 218.5 (which used preliminary 85.6 GW peak). METHODOLOGY.md updated. | `[✓]` |
| Derived: MW/GW (ELCC) | 115.0 | Calculated: 9,800 / 85.2 | Corrected from 114.5 (same peak correction). METHODOLOGY.md updated. | `[✓]` |

---

## 2. SPP — Southwest Power Pool

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $27.56 | SPP 2024 Annual State of the Market Report [8] | Day-ahead system average, 2024 annual. | `[ ]` |
| `all_in_price_mwh` | $29.00 | SPP SOM [8]; capacity estimate | Wholesale ($27.56) + capacity adder (~$1.44). | `[ ]` |
| Capacity adder | ~$1.44 | SPP capacity market data | Minimal capacity market. Adder is approximate $/MWh equivalent. | `[ ]` |
| `capacity_additions_mw` | 2,500 MW | SPP ELCC Report [9]; Amperon [4] | Gross nameplate MW reaching COD in 2024. Breakdown: 1.2 GW wind, 0.5 GW solar, 0.8 GW battery. | `[ ]` |
| `capacity_additions_elcc_mw` | 1,675 MW | SPP ELCC Report [9] | SPP-specific ELCC factors: wind ~20–25% (per SPP ELCC study), solar ~30%, battery ~90%. | `[ ]` |
| `project_count` | 30 | EIA-860M [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 54.0 GW | SPP 2024 State of the Market [8] | Summer 2024, estimated ~3% below 2023. Exact date not specified. | `[ ]` |
| `queue_completion_pct` | 15% | LBNL Queued Up 2025 [10] | 2000–2019 entry cohort (LBNL aggregate). Brattle Scorecard reports <10% for narrower 2018–2020 cohort. | `[ ]` |
| `queue_cohort` | 2000–2019 | LBNL Queued Up [10]; Brattle [7] | Broader cohort than ERCOT. | `[ ]` |
| `color_group` | intermediate | Bottlenecks Lab classification | Reclassified from "functional." Rationale: 15% queue completion and 46.3 MW/GW supply response are closer to PJM than to ERCOT. Low prices reflect abundant wind resource and cheap fuel, not queue efficiency. | `[ ]` |
| Derived: MW/GW (nameplate) | 46.3 | Calculated: 2,500 / 54.0 | Matches METHODOLOGY.md. ✓ | `[ ]` |
| Derived: MW/GW (ELCC) | 31.0 | Calculated: 1,675 / 54.0 | Matches METHODOLOGY.md. ✓ | `[ ]` |

---

## 3. MISO — Midcontinent ISO

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $31.00 | Potomac Economics 2024 MISO State of the Market [11] | **Real-time** load-weighted average LMP, 2024 annual. DA prices would be ~$1–3/MWh higher. See note [D]. | `[ ]` |
| `all_in_price_mwh` | $33.00 | Potomac Economics [11]; MISO PRA results [12] | Wholesale ($31.00) + capacity adder (~$2.00). | `[ ]` |
| Capacity adder | ~$2.00 | MISO Planning Resource Auction (PRA) results [12] | Approximate $/MWh equivalent from PRA clearing prices. | `[ ]` |
| `capacity_additions_mw` | 7,500 MW | MISO confirmed via Brattle [7]; MISO reports | Gross nameplate MW reaching COD in 2024. Breakdown: ~6.7 GW solar, ~0.8 GW wind + other. Not net of retirements (~1.8 GW coal retired: South Oak Creek, Rush Island). | `[ ]` |
| `capacity_additions_elcc_mw` | 3,300 MW | MISO Capacity Credit Report [12] | MISO-specific: summer solar capacity credit of ~50% (MISO PRA rules), not generic 30–35%. This explains 3,300 from 7,500 (~44% weighted ELCC). | `[ ]` |
| `project_count` | 90 | EIA-860M [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 121.6 GW | Amperon [4] | Aug 26, 2024. | `[ ]` |
| `queue_completion_pct` | 28% | Brattle/Grid Strategies/AEU Scorecard [7]; LBNL Queued Up [10] | Brattle reports 28.3% for 2018–2020 cohort. LBNL reports ~28% for 2000–2019 aggregate. Corrected from earlier 30% figure. | `[ ]` |
| `queue_cohort` | 2000–2019 | LBNL Queued Up [10] | Both LBNL long-window and Brattle short-window rates converge at ~28%. | `[ ]` |
| `color_group` | functional | Bottlenecks Lab classification | Rationale: second-highest queue throughput (28%), large absolute additions (7.5 GW), active solar buildout. Queue reforms (MTEP cycles) improving throughput. | `[ ]` |
| Derived: MW/GW (nameplate) | 61.7 | Calculated: 7,500 / 121.6 = 61.68 | Matches METHODOLOGY.md. ✓ | `[ ]` |
| Derived: MW/GW (ELCC) | 27.1 | Calculated: 3,300 / 121.6 = 27.14 | Matches METHODOLOGY.md. ✓ | `[ ]` |

---

## 4. CAISO — California ISO

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $38.00 | CAISO DMM Q3/Q4 2024 Quarterly Reports [13] | **Estimated** annual DA average from quarterly reports. Not a final annual figure. Duck curve dynamics suppress midday prices. | `[ ]` |
| `all_in_price_mwh` | $43.00 | CAISO DMM [13]; CPUC RA reports [14] | Wholesale ($38.00) + capacity adder (~$5.00). | `[ ]` |
| Capacity adder | ~$5.00 | CPUC Resource Adequacy (RA) program cost estimates [14] | RA costs are bilateral and less transparent than auction-based capacity markets. $5/MWh is an estimate. | `[ ]` |
| `capacity_additions_mw` | 7,500 MW | CAISO 2024 Battery Storage Special Report [15]; Amperon [4] | Gross nameplate MW reaching COD in 2024. Breakdown: 4.2 GW battery, 3 GW solar. **Note:** EIA projected ~4.8 GW solar for CAISO in 2024; the 3 GW figure is conservative pending final EIA-860M filing confirmation and may understate solar by 1–2 GW. | `[ ]` |
| `capacity_additions_elcc_mw` | 4,640 MW | Derived from nameplate using ELCC factors | CAISO-specific: battery 85–90% (4-hour duration), solar ~30% (high penetration saturation). | `[ ]` |
| `project_count` | 110 | EIA-860M [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 48.3 GW | Amperon [4] | Sept 5, 2024. | `[ ]` |
| `queue_completion_pct` | 10% | LBNL Queued Up [10]; Concentric Energy Advisors [16] | 2000–2019 entry cohort. Brattle Scorecard reports <10% for 2018–2020 cohort. Low completion reflects speculative queue entries. | `[ ]` |
| `queue_cohort` | 2000–2019 | LBNL Queued Up [10] | Standard long-window cohort. | `[ ]` |
| `color_group` | intermediate | Bottlenecks Lab classification | Rationale: high building (7,500 MW, 155 MW/GW) despite low queue completion (10%). Additions are mandate-driven (SB 100) rather than market-driven. Policy overrides queue dysfunction as building driver. | `[ ]` |
| Derived: MW/GW (nameplate) | 155.3 | Calculated: 7,500 / 48.3 = 155.28 | Matches METHODOLOGY.md. ✓ | `[ ]` |
| Derived: MW/GW (ELCC) | 96.1 | Calculated: 4,640 / 48.3 = 96.07 | Matches METHODOLOGY.md. ✓ | `[ ]` |

---

## 5. PJM — PJM Interconnection

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $33.74 | Monitoring Analytics 2024 PJM State of the Market [17] | **Real-time** load-weighted average LMP, 2024 annual. DA would be ~$1–3/MWh higher. See note [D]. | `[ ]` |
| `all_in_price_mwh` | $36.00 | Monitoring Analytics [17]; PJM RPM BRA [18] | Wholesale ($33.74) + capacity adder (~$2.26). | `[ ]` |
| Capacity adder | ~$2.26 | PJM RPM Base Residual Auction 2024/2025 [18] | BRA clearing price $28.92/MW-day ≈ $2/MWh. Note: 2025/2026 BRA jumped to $269.92/MW-day (~$18/MWh) — not reflected here since chart uses 2024 delivery year. | `[ ]` |
| `capacity_additions_mw` | 4,800 MW | PJM SOM [17]; Amperon [4] | Gross nameplate MW reaching COD in 2024. Breakdown: 4.5 GW solar, 0.29 GW wind, 43 MW storage. Not net of retirements (~0.6 GW: Homer City coal). | `[ ]` |
| `capacity_additions_elcc_mw` | 1,650 MW | Derived from nameplate using ELCC factors | Approximate: solar ~35%, wind ~20%, storage ~85%. Low ELCC ratio (34%) reflects solar-dominated mix. | `[ ]` |
| `project_count` | 75 | EIA-860M [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 152.6 GW | Amperon [4]; PJM [18] | July 16, 2024. Largest US ISO by peak demand. Data center load growth outpacing new supply. | `[ ]` |
| `queue_completion_pct` | 12% | LBNL Queued Up [10]; RMI [19] | 2000–2019 entry cohort. Brattle Scorecard reports <10% for 2018–2020 cohort. Queue backlog of 260+ GW. "Speed to power" crisis (RMI). | `[ ]` |
| `queue_cohort` | 2000–2019 | LBNL Queued Up [10] | Standard long-window cohort. | `[ ]` |
| `color_group` | intermediate | Bottlenecks Lab classification | Rationale: building occurs (4,800 MW) but queue completion is low (12%), and data center demand growth deflates MW/GW ratio. Structural headwind from demand-side growth. | `[ ]` |
| Derived: MW/GW (nameplate) | 31.4 | Calculated: 4,800 / 152.6 = 31.45 | Matches METHODOLOGY.md (rounded). ✓ | `[ ]` |
| Derived: MW/GW (ELCC) | 10.8 | Calculated: 1,650 / 152.6 = 10.81 | Matches METHODOLOGY.md. ✓ | `[ ]` |

---

## 6. NYISO — New York ISO

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $41.81 | NYISO "Impact of National & Global Conditions on Electricity Prices in New York" white paper [20] | 2024 average wholesale price. **Estimated** — system-wide average obscures extreme zonal divergence: Zone J (NYC) ~$50+/MWh, upstate Zone A ~$25/MWh. | `[ ]` |
| `all_in_price_mwh` | $50.00 | NYISO white paper [20]; NYISO ICAP monthly reports [21] | Wholesale ($41.81) + capacity adder (~$8.19). | `[ ]` |
| Capacity adder | ~$8.19 | NYISO Installed Capacity (ICAP) spot + demand curve [21] | ICAP clearing prices converted to approximate $/MWh equivalent. Varies significantly by zone. | `[ ]` |
| `capacity_additions_mw` | 950 MW | NYISO Winter Assessment [22]; ESAI Power [23] | Gross nameplate MW reaching COD in 2024. ~452 MW pre-summer, ~935 MW total (ESAI). Mixed clean energy. | `[ ]` |
| `capacity_additions_elcc_mw` | 570 MW | Derived from nameplate using ELCC factors | ~60% weighted ELCC overall. Technology-specific factors not published for NYISO additions. | `[ ]` |
| `project_count` | 18 | EIA-860M [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 29.0 GW | NYISO [22] | July 8, 2024. Actual 2024 peak. | `[ ]` |
| `queue_completion_pct` | 10% | LBNL Queued Up [10]; Brattle/AEU Scorecard [7] | 2000–2019 entry cohort. Brattle reports <10% for 2018–2020 cohort. Offshore wind procurement delays and Article 10 siting friction. | `[ ]` |
| `queue_cohort` | 2000–2019 | LBNL Queued Up [10] | Standard long-window cohort. | `[ ]` |
| `color_group` | broken | Bottlenecks Lab classification | Rationale: minimal new supply (950 MW, 32.8 MW/GW) despite high prices ($50 all-in). Severe queue dysfunction, offshore wind delays, CLCPA mandate mismatch. | `[ ]` |
| Derived: MW/GW (nameplate) | 32.8 | Calculated: 950 / 29.0 = 32.76 | Matches METHODOLOGY.md. ✓ | `[ ]` |
| Derived: MW/GW (ELCC) | 19.7 | Calculated: 570 / 29.0 = 19.66 | Matches METHODOLOGY.md. ✓ | `[ ]` |

---

## 7. ISO-NE — ISO New England

| Field | Value | Source | Methodology | Verification |
|-------|-------|--------|-------------|--------------|
| `wholesale_price_mwh` | $41.47 | ISO-NE Internal Market Monitor 2024 Annual Markets Report [24] | Day-ahead average, 2024 annual. | `[ ]` |
| `all_in_price_mwh` | $51.00 | ISO-NE IMM [24]; FCA results [25] | Wholesale ($41.47) + capacity adder (~$9.53). **Not** the published $87/MWh total, which includes RECs, RGGI, ancillary, and transmission. $51 is the comparable energy + FCA figure. | `[ ]` |
| Capacity adder | ~$9.53 | ISO-NE Forward Capacity Auction (FCA) [25] | FCA clearing price converted to approximate $/MWh equivalent. Highest capacity adder among ISOs with capacity markets. | `[ ]` |
| `capacity_additions_mw` | 400 MW | ISO Newswire [26]; Vineyard Wind [27] | Gross nameplate MW reaching COD in 2024. Breakdown: 136 MW offshore wind (Vineyard Wind), ~200 MW solar, ~64 MW other. Not net of retirements (~1.4 GW: Mystic CC, June 2024). | `[ ]` |
| `capacity_additions_elcc_mw` | 200 MW | Derived from nameplate using ELCC factors | ~50% weighted ELCC overall. Vineyard Wind blade failure (July 2024) shut down all 136 MW for ~6 months; operational contribution in 2024 was severely limited despite reaching COD. | `[ ]` |
| `project_count` | 15 | EIA-860M [5] | Distinct generators reaching COD in 2024. | `[ ]` |
| `peak_demand_gw` | 24.4 GW | FEL Power [28]; ISO-NE [24] | July 16, 2024. | `[ ]` |
| `queue_completion_pct` | 8% | LBNL Queued Up [10]; Brattle/AEU Scorecard [7] | 2000–2019 entry cohort. Worst queue completion rate nationally. Brattle reports <10% for 2018–2020 cohort. | `[ ]` |
| `queue_cohort` | 2000–2019 | LBNL Queued Up [10] | Standard long-window cohort. | `[ ]` |
| `color_group` | broken | Bottlenecks Lab classification | Rationale: minimal new supply (400 MW, 16.4 MW/GW) despite highest all-in prices ($51). Gas dependence + pipeline constraints drive winter spikes. Worst queue completion. High prices substantially reflect fuel mix / RGGI, not solely building barriers. | `[ ]` |
| Derived: MW/GW (nameplate) | 16.4 | Calculated: 400 / 24.4 = 16.39 | Matches METHODOLOGY.md. ✓ | `[ ]` |
| Derived: MW/GW (ELCC) | 8.2 | Calculated: 200 / 24.4 = 8.20 | Matches METHODOLOGY.md. ✓ | `[ ]` |

---

## Cross-Cutting Methodology Notes

### [A] ELCC Factors and Accreditation

ELCC (Effective Load Carrying Capability) adjusts nameplate MW to reflect each technology's contribution to meeting peak demand. Generic starting factors:

| Technology | Generic ELCC | Notes |
|-----------|-------------|-------|
| Natural gas | 95% | High availability, near-firm |
| Battery storage (4hr) | 85% | Derated for events exceeding 4-hour duration |
| Offshore wind | 35–40% | Higher capacity factor than onshore, moderate ELCC |
| Solar | 30–35% | Peak contribution limited to daytime; varies by region and penetration |
| Onshore wind | 15–25% | Low correlation with summer peak; higher for winter-peaking systems |

**ISO-specific overrides used in this dataset:**

| ISO | Override | Source |
|-----|----------|--------|
| MISO | Solar at ~50% summer capacity credit | MISO Planning Resource Auction rules [12] |
| SPP | Wind per SPP ELCC study (~20–25%); battery ~90% | SPP ELCC Report [9] |
| CAISO | Battery 85–90%; solar ~30% (saturation effects) | CAISO accreditation [15] |
| ERCOT | Close to generic: solar ~30%, battery ~85%, gas 95% | ERCOT capacity reports |

ELCC varies by ISO, season, penetration level, and vintage. All ELCC MW values are estimates. Actual ELCC depends on portfolio effects (marginal ELCC declines as penetration increases).

### [B] Queue Cohort Comparability

**Critical comparability issue.** ERCOT uses the 2018–2020 entry cohort (Brattle/AEU Scorecard), while all other ISOs use the 2000–2019 aggregate cohort (LBNL Queued Up).

- Narrower recent cohorts naturally show higher completion because projects have had adequate time to complete but haven't yet been exposed to the full attrition window.
- Brattle reports all non-ERCOT ISOs at "<10%" for the 2018–2020 cohort, confirming the gap is real but the magnitude depends on cohort choice.
- MISO converges at ~28% regardless of cohort (Brattle 2018–2020: 28.3%; LBNL 2000–2019: ~28%).

**Comparability matrix:**

| ISO | LBNL 2000–2019 | Brattle 2018–2020 | Used in dataset |
|-----|---------------|-------------------|-----------------|
| ERCOT | N/A | 42.6% | 42.6% (Brattle) |
| MISO | ~28% | 28.3% | 28% (Brattle) |
| SPP | 15% | <10% | 15% (LBNL) |
| PJM | 12% | <10% | 12% (LBNL) |
| CAISO | 10% | <10% | 10% (LBNL) |
| NYISO | 10% | <10% | 10% (LBNL) |
| ISO-NE | 8% | <10% | 8% (LBNL) |

### [C] ERCOT Derived Metric Discrepancy

METHODOLOGY.md previously reported ERCOT supply response intensity as 218.5 MW/GW (nameplate) and 114.5 MW/GW (ELCC). These values were computed using the preliminary peak demand of 85.6 GW, which was corrected to 85.2 GW in Round 2 audit corrections.

**Resolved.** METHODOLOGY.md has been updated to the correct values:
- Nameplate: 18,700 / 85.2 = **219.5** MW/GW (was 218.5)
- ELCC: 9,800 / 85.2 = **115.0** MW/GW (was 114.5)

### [D] DA/RT Price Mixing

The dataset mixes day-ahead and real-time price bases:

| Basis | ISOs |
|-------|------|
| Day-ahead (DA) | ERCOT, SPP, ISO-NE |
| Real-time load-weighted (RT) | MISO, PJM |
| Estimated | CAISO, NYISO |

DA prices are typically $1–3/MWh higher than RT. This introduces ~$2–3/MWh noise in cross-ISO comparisons. The relative ordering is robust (the cheapest-to-most-expensive spread is ~$14/MWh), but precise pairwise comparisons carry this uncertainty. Standardizing to one basis was not done because both are valid metrics reported by respective market monitors, and imputing a DA/RT spread varies by ISO and year.

### [E] Gross vs. Net Capacity

All `capacity_additions_mw` values are **gross** nameplate additions — they do not subtract retirements. Material 2024 retirements:

| ISO | Retirement | MW | Source |
|-----|------------|-----|--------|
| MISO | South Oak Creek, Rush Island (coal) | ~1,800 | MISO retirement filings |
| ISO-NE | Mystic CC (June 2024) | ~1,400 | ISO-NE |
| PJM | Homer City (coal) | ~600 | PJM |

Net capacity additions = gross - retirements. For ISOs with large retirements, gross figures significantly overstate net:
- MISO net: 7,500 - 1,800 = ~5,700 MW
- ISO-NE net: 400 - 1,400 = **-1,000 MW** (net capacity loss)
- PJM net: 4,800 - 600 = ~4,200 MW

### [F] Capacity Adder Methodology

Capacity adders convert auction clearing prices ($/MW-day or similar) to approximate $/MWh equivalents using load-weighted conversion. They vary by delivery year, zone, and resource type. Key nuances:

- **ERCOT**: $0 — energy-only market, no capacity mechanism
- **SPP**: Minimal capacity market, ~$1.44/MWh
- **MISO**: Planning Resource Auction (PRA), ~$2/MWh
- **PJM**: RPM BRA 2024/2025 at $28.92/MW-day ≈ $2/MWh. **The 2025/2026 BRA cleared at $269.92/MW-day (~$18/MWh)** — this is not reflected in the 2024 data but would dramatically raise PJM's all-in to ~$52/MWh
- **CAISO**: Resource Adequacy (RA) via bilateral procurement, less transparent, ~$5/MWh estimate from CPUC
- **NYISO**: ICAP spot + demand curve, ~$8.19/MWh, significant zonal variation
- **ISO-NE**: FCA, ~$9.53/MWh. Published total of $87/MWh includes RECs, RGGI, ancillary, and transmission — only the energy + FCA portion ($51/MWh) is used for comparability

---

## Source Bibliography

| # | Source | Type | Used For |
|---|--------|------|----------|
| [1] | E3, "2024 ERCOT Market Update" | Market report | ERCOT wholesale price, capacity, 2023 price |
| [2] | IEEFA (Institute for Energy Economics and Financial Analysis) | Analysis | ERCOT capacity cross-reference |
| [3] | Federal Reserve Bank of Dallas | Economic analysis | ERCOT capacity cross-reference |
| [4] | Amperon | Grid analytics platform | Capacity breakdowns, peak demand (ERCOT, SPP, MISO, CAISO, PJM, ISO-NE) |
| [5] | EIA Form 860M (Monthly Generator Inventory) | Federal filing | Project counts (all ISOs) |
| [6] | ERCOT, official settled peak demand data | ISO data | ERCOT peak demand |
| [7] | Brattle Group / Grid Strategies / Americans for a Clean Energy Grid (AEU), "Generator Interconnection Scorecard" | Industry report | Queue completion rates (ERCOT 2018–2020, MISO, cross-reference for others) |
| [8] | SPP, "2024 Annual State of the Market Report" | Market monitor | SPP wholesale price, peak demand |
| [9] | SPP ELCC Report | ISO study | SPP capacity additions, ELCC factors |
| [10] | Lawrence Berkeley National Laboratory (LBNL), "Queued Up" 2025 Edition | Federal lab report | Queue completion rates (2000–2019 cohort, all ISOs except ERCOT primary) |
| [11] | Potomac Economics, "2024 MISO State of the Market Report" | Independent market monitor | MISO wholesale price |
| [12] | MISO Planning Resource Auction results; MISO Capacity Credit Report | ISO data | MISO capacity adder, MISO-specific ELCC (solar 50%) |
| [13] | CAISO Department of Market Monitoring, Q3/Q4 2024 Quarterly Reports | Market monitor | CAISO wholesale price (estimated annual DA avg) |
| [14] | CPUC Resource Adequacy (RA) program reports | Regulator data | CAISO capacity adder (~$5/MWh) |
| [15] | CAISO, "2024 Battery Storage Special Report" | ISO report | CAISO capacity additions (4.2 GW battery) |
| [16] | Concentric Energy Advisors | Consultancy | CAISO queue completion cross-reference |
| [17] | Monitoring Analytics, "2024 PJM State of the Market Report" | Independent market monitor | PJM wholesale price, capacity data |
| [18] | PJM RPM Base Residual Auction results (2024/2025 delivery year) | ISO data | PJM capacity adder ($28.92/MW-day), peak demand |
| [19] | Rocky Mountain Institute (RMI) | Analysis | PJM queue dynamics, "speed to power" crisis |
| [20] | NYISO, "Impact of National & Global Conditions on Electricity Prices in New York" (2024 white paper) | ISO publication | NYISO wholesale price |
| [21] | NYISO ICAP monthly auction reports | ISO data | NYISO capacity adder |
| [22] | NYISO Winter Assessment; NYISO operational data | ISO data | NYISO capacity additions, peak demand |
| [23] | ESAI Power | Industry analysis | NYISO capacity additions (~452 MW pre-summer, ~935 MW total) |
| [24] | ISO-NE Internal Market Monitor, "2024 Annual Markets Report" | Market monitor | ISO-NE wholesale price, peak demand |
| [25] | ISO-NE Forward Capacity Auction results | ISO data | ISO-NE capacity adder |
| [26] | ISO Newswire | Industry news | ISO-NE capacity additions |
| [27] | Vineyard Wind | Developer data | Offshore wind (136 MW, blade failure July 2024) |
| [28] | FEL Power | Industry analysis | ISO-NE peak demand |

---

## Arithmetic Verification Summary

Supply response intensity (MW/GW) should equal `capacity_additions_mw / peak_demand_gw`. Cross-check:

| ISO | Capacity MW | Peak GW | Nameplate MW/GW | ELCC MW | ELCC MW/GW | Match? |
|-----|------------|---------|-----------------|---------|------------|--------|
| ERCOT | 18,700 | 85.2 | 219.5 | 9,800 | 115.0 | ✓ (METHODOLOGY.md corrected) |
| SPP | 2,500 | 54.0 | 46.3 | 1,675 | 31.0 | ✓ |
| MISO | 7,500 | 121.6 | 61.7 | 3,300 | 27.1 | ✓ |
| CAISO | 7,500 | 48.3 | 155.3 | 4,640 | 96.1 | ✓ |
| PJM | 4,800 | 152.6 | 31.4 | 1,650 | 10.8 | ✓ |
| NYISO | 950 | 29.0 | 32.8 | 570 | 19.7 | ✓ |
| ISO-NE | 400 | 24.4 | 16.4 | 200 | 8.2 | ✓ |

All-in price should equal `wholesale_price_mwh + capacity_adder`:

| ISO | Wholesale | + Adder | = All-In | Match? |
|-----|-----------|---------|----------|--------|
| ERCOT | $27.33 | $0.00 | $27.33 | ✓ |
| SPP | $27.56 | ~$1.44 | $29.00 | ✓ |
| MISO | $31.00 | ~$2.00 | $33.00 | ✓ |
| PJM | $33.74 | ~$2.26 | $36.00 | ✓ |
| CAISO | $38.00 | ~$5.00 | $43.00 | ✓ |
| NYISO | $41.81 | ~$8.19 | $50.00 | ✓ |
| ISO-NE | $41.47 | ~$9.53 | $51.00 | ✓ (rounded) |
