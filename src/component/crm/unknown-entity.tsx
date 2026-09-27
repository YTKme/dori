export function UnknownEntity({ entity }: { entity: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
      <p className="text-muted-foreground">
        Unknown section <span className="font-mono">{entity}</span>.
      </p>
    </div>
  );
}
