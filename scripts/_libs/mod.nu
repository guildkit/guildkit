def type [cmd] {
  return (0 < (which $cmd | length))
}

export def --wrapped container [ ...args ] {
  if (type podman) {
    (podman ...$args)
  } else if (type docker) {
    (docker ...$args)
  } else {
    print "[ERROR] Neither Docker nor Podman are found. Please install one of them."
    exit 1
  }
}
