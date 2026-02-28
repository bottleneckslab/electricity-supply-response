#!/usr/bin/env python3
"""Generate an HTML audit table from audit_all_data.csv.

Usage: python3 data/build_audit_html.py
Output: data/audit.html
"""

import csv
import os
from datetime import date

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DATA_DIR, "audit_all_data.csv")
OUT_PATH = os.path.join(DATA_DIR, "audit.html")

# Columns to display (in order), plus derived columns computed on the fly
DISPLAY_COLUMNS = [
    "view", "year", "id", "name", "region", "is_estimate", "color_group",
    "confidence",
    "wholesale_price_mwh", "all_in_price_mwh", "retail_price_cents_kwh",
    "price_2023_mwh",
    "capacity_additions_mw", "capacity_additions_elcc_mw", "project_count",
    "peak_demand_gw", "queue_completion_pct", "queue_cohort",
    "mw_per_gw_peak", "elcc_mw_per_gw_peak",  # derived
    "qualitative_note",
    "source_price", "source_capacity", "source_peak", "source_queue",
]

COLOR_MAP = {
    "functional": "#4CAF50",
    "intermediate": "#FF9800",
    "broken": "#F44336",
}


def compute_derived(row):
    """Add derived columns to a row dict."""
    try:
        cap = float(row.get("capacity_additions_mw", "") or 0)
        peak = float(row.get("peak_demand_gw", "") or 0)
        if peak > 0:
            row["mw_per_gw_peak"] = f"{cap / peak:.1f}"
        else:
            row["mw_per_gw_peak"] = ""
    except (ValueError, ZeroDivisionError):
        row["mw_per_gw_peak"] = ""

    try:
        elcc = float(row.get("capacity_additions_elcc_mw", "") or 0)
        peak = float(row.get("peak_demand_gw", "") or 0)
        if peak > 0 and elcc > 0:
            row["elcc_mw_per_gw_peak"] = f"{elcc / peak:.1f}"
        else:
            row["elcc_mw_per_gw_peak"] = ""
    except (ValueError, ZeroDivisionError):
        row["elcc_mw_per_gw_peak"] = ""

    return row


def escape_html(text):
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def build_html(rows):
    today = date.today().isoformat()
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Electricity Supply Response — Data Audit ({today})</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #fafafa; }}
  h1 {{ font-size: 1.4rem; margin-bottom: 4px; }}
  .meta {{ color: #666; font-size: 0.85rem; margin-bottom: 16px; }}
  table {{ border-collapse: collapse; font-size: 0.75rem; width: 100%; }}
  th, td {{ border: 1px solid #ddd; padding: 4px 6px; text-align: left; white-space: nowrap; }}
  th {{ background: #333; color: #fff; position: sticky; top: 0; z-index: 1; }}
  tr:nth-child(even) {{ background: #f5f5f5; }}
  tr:hover {{ background: #e8f0fe; }}
  td.num {{ text-align: right; font-variant-numeric: tabular-nums; }}
  td.note {{ white-space: normal; max-width: 300px; font-size: 0.7rem; }}
  td.source {{ white-space: normal; max-width: 250px; font-size: 0.7rem; color: #555; }}
  .color-badge {{ display: inline-block; padding: 1px 6px; border-radius: 3px; color: #fff; font-size: 0.7rem; }}
  .group-header {{ background: #e0e0e0; font-weight: bold; }}
  .group-header td {{ padding: 8px 6px; font-size: 0.85rem; }}
</style>
</head>
<body>
<h1>Electricity Supply Response — Data Audit</h1>
<p class="meta">Generated {today} from <code>data/audit_all_data.csv</code> · {len(rows)} rows · Bottlenecks Lab</p>
<table>
<thead><tr>
"""
    for col in DISPLAY_COLUMNS:
        label = col.replace("_", " ").title()
        html += f"  <th>{escape_html(label)}</th>\n"
    html += "</tr></thead>\n<tbody>\n"

    NUM_COLS = {
        "wholesale_price_mwh", "all_in_price_mwh", "retail_price_cents_kwh",
        "price_2023_mwh", "capacity_additions_mw", "capacity_additions_elcc_mw",
        "project_count", "peak_demand_gw", "queue_completion_pct",
        "mw_per_gw_peak", "elcc_mw_per_gw_peak",
    }
    NOTE_COLS = {"qualitative_note"}
    SOURCE_COLS = {"source_price", "source_capacity", "source_peak", "source_queue"}

    current_group = None
    for row in rows:
        group_key = f"{row['view'].upper()} — {row['year']}"
        if group_key != current_group:
            current_group = group_key
            html += f'<tr class="group-header"><td colspan="{len(DISPLAY_COLUMNS)}">{escape_html(group_key)}</td></tr>\n'

        html += "<tr>"
        for col in DISPLAY_COLUMNS:
            val = row.get(col, "")
            if col == "color_group":
                color = COLOR_MAP.get(val, "#999")
                html += f'<td><span class="color-badge" style="background:{color}">{escape_html(val)}</span></td>'
            elif col in NUM_COLS:
                html += f'<td class="num">{escape_html(val)}</td>'
            elif col in NOTE_COLS:
                html += f'<td class="note">{escape_html(val)}</td>'
            elif col in SOURCE_COLS:
                html += f'<td class="source">{escape_html(val)}</td>'
            else:
                html += f"<td>{escape_html(val)}</td>"
        html += "</tr>\n"

    html += """</tbody>
</table>
</body>
</html>
"""
    return html


def main():
    with open(CSV_PATH, newline="") as f:
        reader = csv.DictReader(f)
        rows = [compute_derived(row) for row in reader]

    html = build_html(rows)
    with open(OUT_PATH, "w") as f:
        f.write(html)

    print(f"Wrote {len(rows)} rows to {OUT_PATH}")


if __name__ == "__main__":
    main()
