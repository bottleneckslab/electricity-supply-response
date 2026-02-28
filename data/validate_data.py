#!/usr/bin/env python3
"""Validate audit_all_data.csv for structural and logical errors.

Usage: python3 data/validate_data.py
"""

import csv
import os
import sys

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DATA_DIR, "audit_all_data.csv")

REQUIRED_COLUMNS = [
    "view", "year", "id", "name", "region", "is_estimate", "color_group",
    "confidence", "wholesale_price_mwh", "all_in_price_mwh",
    "retail_price_cents_kwh", "price_2023_mwh",
    "capacity_additions_mw", "capacity_additions_elcc_mw", "project_count",
    "peak_demand_gw", "queue_completion_pct", "queue_cohort",
    "qualitative_note",
    "source_price", "source_capacity", "source_peak", "source_queue",
]

VALID_COLOR_GROUPS = {"functional", "intermediate", "broken"}
VALID_VIEWS = {"iso", "state"}
VALID_IS_ESTIMATE = {"True", "False"}

NUMERIC_FIELDS = [
    "wholesale_price_mwh", "all_in_price_mwh", "retail_price_cents_kwh",
    "price_2023_mwh", "capacity_additions_mw", "capacity_additions_elcc_mw",
    "project_count", "peak_demand_gw", "queue_completion_pct",
]

SOURCE_COLUMNS = ["source_price", "source_capacity", "source_peak", "source_queue"]


def parse_float(val):
    if val is None or val.strip() == "":
        return None
    return float(val)


def validate(rows):
    errors = []
    warnings = []

    # Check required columns
    if rows:
        header = list(rows[0].keys())
        missing = [c for c in REQUIRED_COLUMNS if c not in header]
        if missing:
            errors.append(f"Missing columns: {missing}")
        extra = [c for c in header if c not in REQUIRED_COLUMNS]
        if extra:
            warnings.append(f"Extra columns (ignored): {extra}")

    # Check for duplicate (view, year, id)
    seen = set()
    for i, row in enumerate(rows, 2):  # CSV line numbers start at 2
        key = (row["view"], row["year"], row["id"])
        if key in seen:
            errors.append(f"Line {i}: Duplicate row {key}")
        seen.add(key)

    for i, row in enumerate(rows, 2):
        prefix = f"Line {i} ({row['view']}/{row['year']}/{row['id']})"

        # View validation
        if row["view"] not in VALID_VIEWS:
            errors.append(f"{prefix}: Invalid view '{row['view']}'")

        # color_group validation
        if row["color_group"] not in VALID_COLOR_GROUPS:
            errors.append(f"{prefix}: Invalid color_group '{row['color_group']}'")

        # is_estimate validation
        if row["is_estimate"] not in VALID_IS_ESTIMATE:
            errors.append(f"{prefix}: Invalid is_estimate '{row['is_estimate']}'")

        # Numeric fields
        for field in NUMERIC_FIELDS:
            val = row.get(field, "").strip()
            if val:
                try:
                    float(val)
                except ValueError:
                    errors.append(f"{prefix}: Non-numeric {field}='{val}'")

        # all_in_price_mwh >= wholesale_price_mwh
        wholesale = parse_float(row.get("wholesale_price_mwh", ""))
        all_in = parse_float(row.get("all_in_price_mwh", ""))
        if wholesale is not None and all_in is not None:
            if all_in < wholesale:
                errors.append(
                    f"{prefix}: all_in_price ({all_in}) < wholesale_price ({wholesale})"
                )

        # capacity_additions_elcc_mw <= capacity_additions_mw
        cap = parse_float(row.get("capacity_additions_mw", ""))
        elcc = parse_float(row.get("capacity_additions_elcc_mw", ""))
        if cap is not None and elcc is not None:
            if elcc > cap:
                errors.append(
                    f"{prefix}: ELCC ({elcc}) > nameplate capacity ({cap})"
                )

        # ISO rows should have all 4 source columns
        if row["view"] == "iso":
            for col in SOURCE_COLUMNS:
                if not row.get(col, "").strip():
                    errors.append(f"{prefix}: Missing {col} for ISO row")

    return errors, warnings


def main():
    with open(CSV_PATH, newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Validating {len(rows)} rows from {CSV_PATH}")
    errors, warnings = validate(rows)

    for w in warnings:
        print(f"  WARNING: {w}")

    if errors:
        print(f"\n  {len(errors)} error(s) found:")
        for e in errors:
            print(f"    {e}")
        sys.exit(1)
    else:
        print("  All checks passed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
