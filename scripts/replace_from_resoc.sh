#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-resoc-repo> [branch]" >&2
  echo "Example: $0 ../resoc gh-pages" >&2
  exit 1
fi

RESOC_PATH="$1"
RESOC_BRANCH="${2:-main}"

if [[ ! -d "$RESOC_PATH/.git" ]]; then
  echo "Error: '$RESOC_PATH' is not a git repository." >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pushd "$RESOC_PATH" >/dev/null
git fetch --all --prune >/dev/null
if git show-ref --verify --quiet "refs/heads/$RESOC_BRANCH"; then
  git checkout "$RESOC_BRANCH" >/dev/null
else
  git checkout -B "$RESOC_BRANCH" "origin/$RESOC_BRANCH" >/dev/null
fi
popd >/dev/null

pushd "$REPO_ROOT" >/dev/null

git rm -r . >/dev/null
rsync -a --exclude ".git" --exclude ".gitignore" "$RESOC_PATH/" "$REPO_ROOT/" >/dev/null

git add .

cat <<'EOM'
Replacement complete. Review changes and commit:
  git status
  git commit -m "Replace GZ.R3 with resoc site"
  git push origin HEAD
EOM
