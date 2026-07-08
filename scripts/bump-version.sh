#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: npm run bump-version -- <version>

Bump workspace package versions and @bridge-ui/core peer dependency ranges.

Arguments:
  version    Semver (e.g. 0.1.0, 1.0.0-beta.1). "v" prefix is optional.

Options:
  -h, --help Show this help message.

Examples:
  npm run bump-version -- 0.1.0
  npm run bump-version -- 1.0.0-beta.1
EOF
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VERSION=""

for arg in "$@"; do
  case "$arg" in
    -h | --help)
      usage
      exit 0
      ;;
    -*)
      echo "Unknown option: $arg"
      usage
      exit 1
      ;;
    *)
      if [ -n "$VERSION" ]; then
        echo "Unexpected argument: $arg"
        usage
        exit 1
      fi
      VERSION="$arg"
      ;;
  esac
done

if [ -z "$VERSION" ]; then
  usage
  exit 1
fi

VERSION="${VERSION#v}"

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z]+(\.[0-9A-Za-z]+)*)?(\+[0-9A-Za-z]+(\.[0-9A-Za-z]+)*)?$ ]]; then
  echo "Invalid semver: $VERSION"
  exit 1
fi

npm version "$VERSION" -w @bridge-ui/core --no-git-tag-version
npm version "$VERSION" -w @bridge-ui/react --no-git-tag-version
npm version "$VERSION" -w @bridge-ui/vue --no-git-tag-version

npm pkg set "peerDependencies.@bridge-ui/core=^${VERSION}" -w @bridge-ui/react
npm pkg set "peerDependencies.@bridge-ui/core=^${VERSION}" -w @bridge-ui/vue

echo ""
echo "Bumped to $VERSION"
echo ""
echo "Commit with message: chore(release): $VERSION"
