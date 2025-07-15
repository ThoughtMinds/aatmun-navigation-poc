from json import load
from typing import List, Dict
from app.core.config import settings
from os import path


def load_sample_navigation_data() -> List[Dict]:
    """Load sample navigation intents from a JSON file for database initialization purposes.

    Returns:
        List[Dict]: A list of dictionaries dictionary with navigation intents

    """
    if not path.isfile(settings.DATABASE_INIT_DATA):
        return []

    try:
        with open(settings.DATABASE_INIT_DATA) as f:
            sample_navigation_intents = load(f)
    except Exception as e:
        print(f"Failed to load navigation intents due to: {e}")
        sample_navigation_intents = []

    return sample_navigation_intents
