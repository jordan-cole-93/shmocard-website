import parse from "html-react-parser";

import "./legal.css";
import Section from "@/components/layout/Section";
import { getShopPolicy, type PolicyHandle } from "@/lib/shopify/policies";

type Props = {
  handle: PolicyHandle;
  /** Hardcoded fallback title when policy fetch returns null. */
  fallbackTitle: string;
};

export default async function PolicyPage({ handle, fallbackTitle }: Props) {
  const policy = await getShopPolicy(handle);

  if (!policy) {
    return (
      <Section bg="marsh" nextBg="marsh" ariaLabel={`${fallbackTitle} page`}>
        <div className="legal-page legal-page--empty">
          <h1 className="legal-page__title">{fallbackTitle}</h1>
          <p className="legal-page__empty-msg">
            This policy has not yet been configured. Please check back shortly.
          </p>
        </div>
      </Section>
    );
  }

  // Body is already Liquid-substituted + sanitize-html-cleaned by the helper.
  // Parse to React elements at server-render time (avoids the React
  // HTML-injection prop entirely; also lets us hook in custom renderers later).
  return (
    <Section bg="marsh" nextBg="marsh" ariaLabel={`${policy.title} page`}>
      <div className="legal-page">
        <h1 className="legal-page__title">{policy.title}</h1>
        <div className="legal-page__body shm-prose">{parse(policy.body)}</div>
      </div>
    </Section>
  );
}
