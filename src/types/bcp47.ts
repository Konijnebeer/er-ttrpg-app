import z from "zod";

export const bcp47Schema = z.string().refine(
  (v) => {
    try {
      // getCanonicalLocales will throw for invalid tags
      const canonical = Intl.getCanonicalLocales(v);

      return Array.isArray(canonical) && canonical.length > 0;
    } catch {
      return false;
    }
  },
  { message: "Invalid BCP-47 language tag (e.g. en-US, nl-NL, sv-SE)" }
);
// .transform((v) => {
//   // safe because refine already validated it
//   try {
//     return Intl.getCanonicalLocales(v)[0];
//   } catch {
//     return v;
//   }
// });
