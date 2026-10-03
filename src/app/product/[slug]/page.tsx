import { redirect } from "next/navigation";

export interface Props {
  params: {
    slug: string;
  };
}

export default function ProductLegacyRedirectPage({ params }: Props) {
  redirect(`/buy-materials/${params.slug}`);
}
