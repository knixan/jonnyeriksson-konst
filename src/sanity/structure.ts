import { CogIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings"];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innehåll")
    .items([
      S.listItem()
        .title("Webbplatsinställningar")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as string),
      ),
    ]);
