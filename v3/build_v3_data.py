#!/usr/bin/env python3
"""Genera los JSON de la versión 3 desde la planilla maestra, sin subir el Excel."""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from generate_data import build, public_view  # noqa: E402


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    args = parser.parse_args()
    strategy, tracking = build(args.input)
    strategy, tracking = public_view(strategy, tracking)
    folder = Path(__file__).resolve().parent / 'data'
    folder.mkdir(exist_ok=True)
    for name, payload in [('strategy.json', strategy), ('tracking.json', tracking)]:
        target = folder / name
        target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"v3: {len(strategy['krs'])} KR, {len(tracking['records'])} reportes, "
          f"{len({r['id'] for r in tracking['records']})} KR reportados; "
          f"{tracking['metadata']['demo_records']} reportes DEMO.")


if __name__ == '__main__':
    main()
