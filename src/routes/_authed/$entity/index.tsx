import { createFileRoute } from "@tanstack/react-router";

import { getResource } from "~/component/crm/resources";
import { ResourceList } from "~/component/crm/resource-list";
import { UnknownEntity } from "~/component/crm/unknown-entity";

export const Route = createFileRoute("/_authed/$entity/")({
  component: Page,
});

function Page() {
  const { entity } = Route.useParams();
  const resource = getResource(entity);
  return resource ? (
    <ResourceList resource={resource} />
  ) : (
    <UnknownEntity entity={entity} />
  );
}
