import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Webbplatsinställningar",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Rubrik", type: "string" }),
        defineField({ name: "subheading", title: "Underrubrik", type: "text" }),
        defineField({
          name: "image",
          title: "Bild",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "about",
      title: "Om konstnären",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Rubrik", type: "string" }),
        defineField({
          name: "body",
          title: "Text",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "image",
          title: "Bild",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Kontakt",
      type: "object",
      fields: [
        defineField({ name: "phone", title: "Telefonnummer", type: "string" }),
        defineField({
          name: "swishPhone",
          title: "Swish-nummer",
          type: "string",
          description:
            "Visas för kunder som väljer att betala med Swish i kassan.",
        }),
        defineField({
          name: "instagramUrl",
          title: "Instagram-länk",
          type: "url",
          initialValue: "https://www.instagram.com/jonnyeriksson.art",
        }),
        defineField({
          name: "konstSeUrl",
          title: "Konst.se-länk",
          type: "url",
          initialValue: "https://www.konst.se/jonnyeriksson",
        }),
        defineField({
          name: "location",
          title: "Ort",
          type: "string",
          initialValue: "Hallsberg, Sverige",
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Sidfot",
      type: "object",
      fields: [defineField({ name: "text", title: "Text", type: "text" })],
    }),
    defineField({
      name: "announcement",
      title: "Meddelandefält",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Aktiverat",
          type: "boolean",
          initialValue: false,
        }),
        defineField({ name: "text", title: "Text", type: "string" }),
      ],
    }),
  ],
});
