# Full replacement of GZ.R3 with resoc site content

This guide documents the steps and helper script to replace **all** content in this
repository with the site content from the `resoc` repo (which backs the
`https://step3dlab.github.io/resoc/` deployment).

## Prerequisites
- You have a local clone of the `resoc` repository (or access to it).
- You know the branch that powers the GitHub Pages site (commonly `gh-pages` or `main`).

## One-time replacement using the helper script

```bash
# From the root of this repo
./scripts/replace_from_resoc.sh <path-to-resoc-repo> <branch>

# Example
./scripts/replace_from_resoc.sh ../resoc gh-pages
```

The script will:
- Check out the requested branch in the `resoc` repo.
- Remove all tracked files in this repo.
- Copy the contents of `resoc` into this repo (excluding `.git`).

After it runs, commit and push:

```bash
git status
git commit -m "Replace GZ.R3 with resoc site"
git push origin HEAD
```

## Manual replacement (no script)

```bash
# In this repo
git rm -r .

# Copy in files from resoc
rsync -a --exclude ".git" --exclude ".gitignore" ../resoc/ ./

git add .
git commit -m "Replace GZ.R3 with resoc site"
git push origin HEAD
```

## Notes
- Confirm which branch powers the Pages site (Settings → Pages in the `resoc` repo).
- If Pages is built from a `/docs` directory, copy only that folder's contents.
