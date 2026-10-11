#!/usr/bin/env nu

#MISE raw=true # Required for the spinner by podman compose down.

do --ignore-errors { podman compose down --rmi local --volumes --remove-orphans }
do --ignore-errors { docker compose down --rmi local --volumes --remove-orphans }
