import { createFileRoute } from "@tanstack/react-router";

import { getResource } from "~/component/crm/resources";
import { ResourceForm } from "~/component/crm/resource-form";
import { UnknownEntity } from "~/component/crm/unknown-entity";

export const Route = createFileRoute("/_authed/$entity/new")({
  validateSearch: (search: Record<string, unknown>) => search,
  component: Page,
});

function Page() {
  const { entity } = Route.useParams();
  const search = Route.useSearch();
  const resource = getResource(entity);
  return resource ? (
    <ResourceForm resource={resource} initial={search as Record<string, any>} />
  ) : (
    <UnknownEntity entity={entity} />
  );
}
