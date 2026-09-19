const cn = (
  ...classes: Array<Record<string, boolean | undefined> | string | undefined>
): string =>
  classes
    .map((entry) =>
      typeof entry === "string"
        ? entry
        : Object.entries(entry || {})
            .filter(([, append]) => append)
            .map(([className]) => className)
            .join(" ")
    )
    .filter(Boolean)
    .join(" ");

export default cn;
