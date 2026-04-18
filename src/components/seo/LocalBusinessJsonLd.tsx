import { buildLocalBusinessJsonLd } from "@/lib/seo/jsonld";

import JsonLd from "./JsonLd";

export default function LocalBusinessJsonLd() {
  return <JsonLd data={buildLocalBusinessJsonLd()} />;
}
