"""
FitVision AI – Database Package
  from database.connection    import get_connection
  from database.tracker       import ProgressTracker
  from database.setup         import setup_database
"""

from .connection import get_connection
from .tracker    import ProgressTracker
from .setup      import setup_database

__all__ = ["get_connection", "ProgressTracker", "setup_database"]
