"""
Fetch peak demand data from the EIA API v2.

API endpoint: https://api.eia.gov/v2/electricity/rto/region-data/data/
Documentation: https://www.eia.gov/opendata/documentation.php

This module queries hourly demand data for each Balancing Authority,
finds the maximum hourly value in the target year, and maps it to ISOs.

Requirements:
  - An EIA API key (free registration at https://www.eia.gov/opendata/register.php)
  - Set as EIA_API_KEY environment variable or pass directly to the function.

The API returns demand in megawatts. We convert to gigawatts in the output.
"""

import time
from datetime import datetime

import requests

from .ba_to_iso_mapping import ISO_LIST


# EIA API v2 endpoint for RTO region-level data.
_API_URL = "https://api.eia.gov/v2/electricity/rto/region-data/data/"

# EIA-930 respondent codes for each ISO.
# These are the BA codes used in the RTO region-data endpoint.
_ISO_TO_RESPONDENT = {
    "ERCOT": "ERCO",
    "SPP": "SWPP",
    "MISO": "MISO",
    "CAISO": "CISO",
    "PJM": "PJM",
    "NYISO": "NYIS",
    "ISO-NE": "ISNE",
}

# Seconds to wait between API requests to stay under rate limits.
_REQUEST_DELAY = 0.5


def fetch_peak_demand(
    api_key: str,
    year: int = 2024,
) -> dict[str, float]:
    """Fetch annual peak demand for each ISO from the EIA API.

    Queries hourly demand data for the target year and returns the
    maximum observed value for each ISO.

    Args:
        api_key: EIA API v2 key.
        year: Target year (default 2024).

    Returns:
        Dictionary mapping ISO name to peak demand in GW.

    Raises:
        ValueError: If api_key is empty.
        requests.HTTPError: On API errors.
    """
    if not api_key or not api_key.strip():
        raise ValueError("EIA API key is required. Register at https://www.eia.gov/opendata/register.php")

    peaks: dict[str, float] = {}

    for iso in ISO_LIST:
        respondent = _ISO_TO_RESPONDENT.get(iso)
        if not respondent:
            continue

        peak_mw = _fetch_peak_for_respondent(api_key, respondent, year)
        if peak_mw is not None:
            peaks[iso] = round(peak_mw / 1000, 1)  # MW → GW

        time.sleep(_REQUEST_DELAY)

    return peaks


def _fetch_peak_for_respondent(
    api_key: str,
    respondent: str,
    year: int,
) -> float | None:
    """Query the EIA API for the peak hourly demand of a single respondent.

    The API supports sorting and limiting, so we request the single highest
    demand value rather than downloading the full year of hourly data.
    """
    params = {
        "api_key": api_key,
        "frequency": "hourly",
        "data[0]": "value",
        "facets[respondent][]": respondent,
        "facets[type-name][]": "Demand",
        "start": f"{year}-01-01T00",
        "end": f"{year}-12-31T23",
        "sort[0][column]": "value",
        "sort[0][direction]": "desc",
        "length": 1,
    }

    try:
        resp = requests.get(_API_URL, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        records = data.get("response", {}).get("data", [])
        if not records:
            return None

        value = records[0].get("value")
        if value is None:
            return None

        return float(value)

    except (requests.RequestException, KeyError, ValueError, TypeError) as exc:
        print(f"  Warning: EIA API request failed for {respondent}: {exc}")
        return None
