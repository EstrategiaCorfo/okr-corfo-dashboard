#!/usr/bin/env python3
"""Genera el catálogo completo y los reportes de v4, sin publicar el Excel."""

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
    catalog_count = len(strategy['krs'])
    reported_ids = {record['id'] for record in tracking['records']}
    strategy, tracking = public_view(strategy, tracking)
    strategy['metadata'].update({
        'visibility': 'full-catalog',
        'catalog_kr_count': catalog_count,
        'reported_kr_count': len(reported_ids),
    })
    tracking['metadata']['reported_kr_count'] = len(reported_ids)
    folder = Path(__file__).resolve().parent / 'data'
    folder.mkdir(exist_ok=True)
    for name, payload in [('strategy.json', strategy), ('tracking.json', tracking)]:
        (folder / name).write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
        )
    print(f"v4: {len(reported_ids)} KR reportados de {catalog_count} definidos, "
          f"{len(tracking['records'])} reportes; "
          f"{tracking['metadata']['demo_records']} reportes DEMO.")


if __name__ == '__main__':
    main()
