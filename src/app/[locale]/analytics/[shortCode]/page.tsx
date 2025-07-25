import type { Metadata } from 'next';

type Props = {
  params: { shortCode: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Analytics for ${params.shortCode}`,
  };
}

export default async function Page({ params }: Props) {
  return (
    <div>
      <h1>Analytics for {params.shortCode}</h1>
      {/* Analytics components will go here */}
    </div>
  );
}
