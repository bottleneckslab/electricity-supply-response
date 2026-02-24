"""
Parser for EIA wholesale electricity price data.

Raw file: EIA Wholesale Electricity Prices (bulk Excel download)
Download: https://www.eia.gov/electricity/wholesale/
          → "Download Data (XLS)" link → save to data/raw/

The EIA file contains day-ahead hub prices for major trading hubs.
Hub-to-ISO mapping:
  - ERCOT North Hub → ERCOT
  - SPP South Hub   → SPP   (not always present — see fallback)
  - Indiana Hub     → MISO
  - SP15            → CAISO (CAISO South/SP15 is the load-weighted reference)
  - PJM West Hub    → PJM
  - Zone J NYC      → NYISO (not always present — see fallback)
  - Mass Hub        → ISO-NE

Note: The EIA bulk file inconsistently covers NYISO and SPP hubs.
For those ISOs we use fallback values sourced from ISO Market Monitor
reports. These are updated manually — check the comments below for
the specific report and vintage.
"""

from pathlib import Path

import pandas as pd


# Hub name substrings in EIA data → ISO name.
# We match on substring because the EIA column headers vary across vintages.
_HUB_TO_ISO = {
    "ERCOT": "ERCOT",
    "ercot north": "ERCOT",
    "Indiana": "MISO",
    "indiana hub": "MISO",
    "SP15": "CAISO",
    "sp-15": "CAISO",
    "sp 15": "CAISO",
    "PJM West": "PJM",
    "pjm west": "PJM",
    "pjm-west": "PJM",
    "Mass Hub": "ISO-NE",
    "mass hub": "ISO-NE",
    "nepool": "ISO-NE",
}

# Fallback prices for ISOs whose hubs are not reliably in the EIA file.
# Sources and vintage noted inline so they can be audited.
_FALLBACK_PRICES: dict[str, tuple[float, str]] = {
    # SPP 2024 Annual State of the Market Report, Potomac Economics
    # Day-ahead system-wide average LMP, $/MWh
    "SPP": (27.56, "SPP 2024 Annual SOM Report (DA system avg)"),
    # Potomac Economics 2024 NYISO State of the Market (est. system-wide DA avg)
    # Zone-weighted: upstate ~$25, NYC Zone J ~$50+, system avg ~$38
    "NYISO": (38.0, "Potomac Economics 2024 NYISO SOM (est. system-wide DA avg)"),
}


def parse_wholesale_prices(filepath: Path) -> dict[str, float]:
    """Parse EIA wholesale price Excel file and return ISO → avg $/MWh.

    Args:
        filepath: Path to the EIA wholesale prices Excel file.

    Returns:
        Dictionary mapping ISO name to annual average wholesale price ($/MWh).
        Includes fallback values for ISOs not found in the file.

    Raises:
        FileNotFoundError: If the filepath doesn't exist.
        ValueError: If the file can't be parsed into a usable format.
    """
    if not filepath.exists():
        raise FileNotFoundError(f"Wholesale price file not found: {filepath}")

    # The EIA file structure varies, but typically has a header row with hub
    # names and monthly or annual price columns. Try common sheet names.
    df = _read_price_sheet(filepath)

    prices: dict[str, float] = {}

    # Walk columns looking for hub name matches.
    for col in df.columns:
        col_lower = str(col).lower()
        for hub_substr, iso in _HUB_TO_ISO.items():
            if hub_substr.lower() in col_lower:
                # Take the mean of non-null numeric values in the column.
                series = pd.to_numeric(df[col], errors="coerce").dropna()
                if len(series) > 0:
                    prices[iso] = round(float(series.mean()), 2)
                break

    # Apply fallbacks for missing ISOs.
    for iso, (price, _source) in _FALLBACK_PRICES.items():
        if iso not in prices:
            prices[iso] = price

    return prices


def _read_price_sheet(filepath: Path) -> pd.DataFrame:
    """Try common sheet names and header rows to find the price data."""
    # Some EIA files have the data on sheet 0, others on a named sheet.
    for sheet in [0, "Hub Prices", "Wholesale Prices", "Data"]:
        try:
            # Try multiple header rows — EIA files often have multi-row headers.
            for header_row in [0, 1, 2, 3]:
                df = pd.read_excel(
                    filepath,
                    sheet_name=sheet,
                    header=header_row,
                )
                # Sanity check: we need at least a few numeric columns.
                numeric_cols = df.select_dtypes(include="number").columns
                if len(numeric_cols) >= 2:
                    return df
        except (ValueError, KeyError):
            continue

    raise ValueError(
        f"Could not find price data in {filepath}. "
        "Check that the file is an EIA wholesale price Excel download."
    )
