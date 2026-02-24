"""
Parser for LBNL Queued Up interconnection queue data.

Raw file: LBNL "Queued Up" dataset (Excel)
Download: https://emp.lbl.gov/queues/
          → "Download Data" → save to data/raw/

The dataset tracks every generator interconnection request filed across
US ISOs/RTOs. Key columns:
  - Region or ISO/RTO (the ISO the project applied to)
  - Queue Date or Year Entered (when the project entered the queue)
  - Status (Active, Withdrawn, Operational/COD, Suspended, etc.)
  - COD (Commercial Operation Date) if the project was built

We calculate a completion rate: the share of projects that reached
commercial operation ("Operational" or have a COD) out of all projects
that entered the queue, grouped by ISO. This uses historical cohorts
(typically 2000-2020 entry years) since recent entries haven't had
time to complete.
"""

from pathlib import Path

import pandas as pd

from .ba_to_iso_mapping import ISO_LIST


# LBNL uses its own ISO naming. Map to our canonical names.
_LBNL_ISO_NAMES = {
    "ERCOT": "ERCOT",
    "SPP": "SPP",
    "MISO": "MISO",
    "CAISO": "CAISO",
    "California ISO": "CAISO",
    "PJM": "PJM",
    "NYISO": "NYISO",
    "New York ISO": "NYISO",
    "ISO-NE": "ISO-NE",
    "ISO New England": "ISO-NE",
    "ISONE": "ISO-NE",
}

# Statuses that indicate a project reached commercial operation.
_COMPLETED_STATUSES = {
    "operational",
    "op",
    "completed",
    "commercial operation",
    "built",
    "active - operational",
    "in service",
}

# Only include entry cohorts old enough to have had a fair chance at completion.
# Projects entering after 2020 are still in the pipeline.
_COHORT_CUTOFF_YEAR = 2020


def parse_queue_completion(filepath: Path) -> dict[str, float]:
    """Parse LBNL Queued Up data and return queue completion rates by ISO.

    Completion rate = projects reaching COD / total projects entered,
    using entry cohorts from 2000 through the cutoff year.

    Args:
        filepath: Path to the LBNL Queued Up Excel file.

    Returns:
        Dictionary mapping ISO name to completion rate as a percentage
        (e.g., 42.6 means 42.6%).

    Raises:
        FileNotFoundError: If the filepath doesn't exist.
        ValueError: If required columns are missing.
    """
    if not filepath.exists():
        raise FileNotFoundError(f"LBNL Queued Up file not found: {filepath}")

    df = _read_queue_sheet(filepath)
    df = _normalize_columns(df)

    # Validate required columns.
    if "iso" not in df.columns:
        raise ValueError(
            "Could not find ISO/region column in the LBNL data. "
            f"Available columns: {list(df.columns)}"
        )

    # Normalize ISO names to our canonical form.
    df["iso"] = df["iso"].astype(str).str.strip().map(_LBNL_ISO_NAMES)
    df = df.dropna(subset=["iso"])

    # Filter to mature cohorts if we have an entry year column.
    if "entry_year" in df.columns:
        df["entry_year"] = pd.to_numeric(df["entry_year"], errors="coerce")
        df = df[
            (df["entry_year"] >= 2000)
            & (df["entry_year"] <= _COHORT_CUTOFF_YEAR)
        ]

    # Determine which projects completed.
    df["completed"] = _is_completed(df)

    # Calculate completion rate per ISO.
    rates: dict[str, float] = {}
    for iso in ISO_LIST:
        iso_df = df[df["iso"] == iso]
        total = len(iso_df)
        if total == 0:
            continue
        completed = iso_df["completed"].sum()
        rates[iso] = round(100.0 * completed / total, 1)

    return rates


def _is_completed(df: pd.DataFrame) -> pd.Series:
    """Return a boolean Series: True if the project reached commercial operation."""
    result = pd.Series(False, index=df.index)

    # Check status column.
    if "status" in df.columns:
        status_lower = df["status"].astype(str).str.strip().str.lower()
        result |= status_lower.isin(_COMPLETED_STATUSES)

    # Also check if a COD (commercial operation date) is present.
    if "cod" in df.columns:
        result |= df["cod"].notna() & (df["cod"].astype(str).str.strip() != "")

    return result


def _read_queue_sheet(filepath: Path) -> pd.DataFrame:
    """Read the main data sheet from the LBNL workbook."""
    sheet_names_to_try = [
        "Data",
        "data",
        "All Projects",
        "Queue",
        0,
    ]
    for sheet in sheet_names_to_try:
        try:
            df = pd.read_excel(filepath, sheet_name=sheet, header=0)
            if len(df) > 10:
                return df
        except (ValueError, KeyError):
            continue

    return pd.read_excel(filepath, sheet_name=0, header=1)


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize LBNL column names to canonical forms."""
    col_aliases = {
        "region": "iso",
        "iso/rto": "iso",
        "iso": "iso",
        "rto": "iso",
        "entity": "iso",
        "queue date": "entry_year",
        "queue year": "entry_year",
        "year entered": "entry_year",
        "year": "entry_year",
        "entry year": "entry_year",
        "q_date": "entry_year",
        "status": "status",
        "queue status": "status",
        "project status": "status",
        "current status": "status",
        "cod": "cod",
        "commercial operation date": "cod",
        "commercial_operation_date": "cod",
        "in-service date": "cod",
        "actual cod": "cod",
    }
    rename_map = {}
    for col in df.columns:
        col_lower = str(col).strip().lower()
        if col_lower in col_aliases:
            rename_map[col] = col_aliases[col_lower]
    return df.rename(columns=rename_map)
