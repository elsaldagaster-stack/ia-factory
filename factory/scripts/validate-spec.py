#!/usr/bin/env python3
"""Validate that a spec file has all required fields before agent processing."""

import sys
import re
from pathlib import Path


REQUIRED_PATTERNS = [
    (r"^\*\*ID:\*\* SPEC-\d+", "ID field (format: **ID:** SPEC-XXX)"),
    (r"^\*\*Fecha:\*\*", "Fecha field"),
    (r"^\*\*Estado:\*\* (BORRADOR|EN_REVISIÓN|APROBADA|EN_IMPLEMENTACIÓN|COMPLETADA)", "Estado field with valid value"),
    (r"^\*\*Clasificación:\*\* (SIMPLE|COMPLEX)", "Clasificación field (SIMPLE or COMPLEX)"),
    (r"^## Contexto", "Contexto section"),
    (r"^## Criterios de Aceptación", "Criterios de Aceptación section"),
    (r"^## Alcance", "Alcance section"),
    (r"EXPLÍCITAMENTE EXCLUIDO", "EXPLÍCITAMENTE EXCLUIDO subsection"),
    (r"^## Subtareas", "Subtareas section"),
    (r"^## Archivos Esperados a Modificar", "Archivos Esperados section"),
]

MIN_ACCEPTANCE_CRITERIA = 3


def validate_spec(file_path: str) -> tuple[bool, list[str]]:
    path = Path(file_path)
    if not path.exists():
        return False, [f"File not found: {file_path}"]

    content = path.read_text(encoding="utf-8")
    errors = []

    for pattern, description in REQUIRED_PATTERNS:
        if not re.search(pattern, content, re.MULTILINE):
            errors.append(f"Missing: {description}")

    dado_count = len(re.findall(r"^1\. DADO|^2\. DADO|^3\. DADO|^4\. DADO|^5\. DADO", content, re.MULTILINE))
    quando_count = len(re.findall(r"QUANDO", content))
    entonces_count = len(re.findall(r"ENTONCES", content))

    criteria_count = min(dado_count, entonces_count)
    if criteria_count < MIN_ACCEPTANCE_CRITERIA:
        errors.append(
            f"Insufficient acceptance criteria: {criteria_count} found, "
            f"minimum {MIN_ACCEPTANCE_CRITERIA} required (DADO/CUANDO/ENTONCES format)"
        )

    if "[REQUIERE_DECISIÓN_HUMANA" in content:
        pending = re.findall(r"\[REQUIERE_DECISIÓN_HUMANA:[^\]]+\]", content)
        errors.append(f"Spec has {len(pending)} unresolved human decisions: {', '.join(pending[:3])}")

    return len(errors) == 0, errors


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: validate-spec.py <spec-file> [<spec-file> ...]")
        sys.exit(1)

    all_valid = True
    for spec_file in sys.argv[1:]:
        is_valid, errors = validate_spec(spec_file)
        if is_valid:
            print(f"OK  {spec_file}")
        else:
            all_valid = False
            print(f"FAIL {spec_file}")
            for error in errors:
                print(f"     - {error}")

    sys.exit(0 if all_valid else 1)


if __name__ == "__main__":
    main()
