import { createFileRoute } from "@tanstack/react-router";

import { getResource } from "~/component/crm/resources";
import { ResourceDetail } from "~/component/crm/resource-detail";
import { UnknownEntity } from "~/component/crm/unknown-entity";

export const Route = createFileRoute("/_authed/$entity/$id/")({
  component: Page,
});

function Page() {
  const { entity, id } = Route.useParams();
  const resource = getResource(entity);
  return resource ? (
    <ResourceDetail resource={resource} id={id} />
  ) : (
    <UnknownEntity entity={entity} />
  );
}
