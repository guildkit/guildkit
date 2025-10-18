#!/usr/bin/env nu

use ../_libs *

container compose down --rmi local --volumes --remove-orphans
