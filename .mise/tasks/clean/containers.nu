#!/usr/bin/env nu

#MISE raw=true # Required for the spinner by podman compose down.

use ../_libs *

do --ignore-errors { container compose down --rmi local --volumes --remove-orphans }
