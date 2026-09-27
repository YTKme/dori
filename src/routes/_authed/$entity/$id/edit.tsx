import { createFileRoute } from "@tanstack/react-router";

import { getResource } from "~/component/crm/resources";
import { ResourceForm } from "~/component/crm/resource-form";
import { UnknownEntity } from "~/component/crm/unknown-entity";

export const Route = createFileRoute("/_authed/$entity/$id/edit")({
  component: Page,
});

function Page() {
  const { entity, id } = Route.useParams();
  const resource = getResource(entity);
  return resource ? (
    <ResourceForm resource={resource} id={id} />
  ) : (
    <UnknownEntity entity={entity} />
  );
}
