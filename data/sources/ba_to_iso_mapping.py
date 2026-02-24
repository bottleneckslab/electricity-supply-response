"""
Mapping of EIA Balancing Authority (BA) codes to ISO/RTO names.

EIA uses BA-level identifiers in its bulk data files (e.g., EIA-860M, EIA-930).
This module maps those codes to the seven major ISO/RTOs we track.

Source: EIA-930 Balancing Authority list
        https://www.eia.gov/electricity/gridmonitor/about
"""

# BA code → ISO/RTO name.
# Only includes BAs that belong to an organized wholesale market.
# Non-ISO BAs (e.g., TVA, BPA, WAPA) are intentionally excluded.
BA_TO_ISO: dict[str, str] = {
    # ERCOT — single BA
    "ERCO": "ERCOT",
    # SPP — single consolidated BA in EIA-930
    "SWPP": "SPP",
    # MISO — multiple BAs report under MISO umbrella
    "MISO": "MISO",
    "EEI": "MISO",      # Entergy (MISO South)
    "LGEE": "MISO",     # LG&E and KU (Louisville Gas & Electric)
    "ALTW": "MISO",     # Alliant West
    "AMIL": "MISO",     # Ameren Illinois
    "AMMO": "MISO",     # Ameren Missouri
    "CONS": "MISO",     # Consumers Energy
    "CWEP": "MISO",     # Commonwealth Edison (sometimes appears separately)
    "DECO": "MISO",     # DTE Energy
    "GRE": "MISO",      # Great River Energy
    "MDU": "MISO",      # Montana-Dakota Utilities
    "MEC": "MISO",      # MidAmerican Energy
    "MIUP": "MISO",     # MISO Upper Peninsula
    "MP": "MISO",       # Minnesota Power
    "NSB": "MISO",      # Northern States Power
    "OTP": "MISO",      # Otter Tail Power
    "SMP": "MISO",      # Southern Minnesota Municipal Power Agency
    "WEC": "MISO",      # Wisconsin Electric Power
    "WPS": "MISO",      # Wisconsin Public Service
    "NIPS": "MISO",     # Northern Indiana Public Service
    "IPL": "MISO",      # Indianapolis Power & Light
    "SIPC": "MISO",     # Southern Illinois Power Cooperative
    "CWLP": "MISO",     # City Water Light & Power (Springfield, IL)
    # CAISO — single BA
    "CISO": "CAISO",
    # PJM — multiple BAs
    "PJM": "PJM",
    "AEP": "PJM",       # American Electric Power
    "AP": "PJM",        # Allegheny Power
    "ATSI": "PJM",      # American Transmission Systems Inc (FirstEnergy)
    "CE": "PJM",        # Commonwealth Edison
    "DAY": "PJM",       # Dayton Power & Light
    "DEOK": "PJM",      # Duke Energy Ohio/Kentucky
    "DOM": "PJM",       # Dominion Virginia
    "DPL": "PJM",       # Delmarva Power & Light
    "DUK": "PJM",       # Duke Energy Carolinas (PJM portion)
    "EKPC": "PJM",      # East Kentucky Power Cooperative
    "JC": "PJM",        # Jersey Central Power & Light
    "ME": "PJM",        # Metropolitan Edison
    "OVEC": "PJM",      # Ohio Valley Electric Corp
    "PE": "PJM",        # PECO Energy
    "PEP": "PJM",       # Potomac Electric Power
    "PL": "PJM",        # PPL Electric Utilities
    "PN": "PJM",        # Pennsylvania Electric (Penelec)
    "PS": "PJM",        # Public Service Electric & Gas
    "RECO": "PJM",      # Rockland Electric
    # NYISO — single BA
    "NYIS": "NYISO",
    # ISO-NE — single BA
    "ISNE": "ISO-NE",
}

# Canonical list of ISOs we track, in display order.
ISO_LIST = ["ERCOT", "SPP", "MISO", "CAISO", "PJM", "NYISO", "ISO-NE"]


def get_iso_for_ba(ba_code: str) -> str | None:
    """Return the ISO/RTO name for a given EIA Balancing Authority code.

    Args:
        ba_code: EIA Balancing Authority code (e.g., "ERCO", "CISO").

    Returns:
        ISO name string (e.g., "ERCOT", "CAISO") or None if the BA
        doesn't belong to a tracked ISO/RTO.
    """
    return BA_TO_ISO.get(ba_code.strip().upper())
