// Render published pages by slug
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import React from 'react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

async function getPage(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching published page:', error);
  }
  console.log('getPage slug', slug, 'result', data);
  return data;
}

export async function generateMetadata({ params }: PageProps) {
  const page = await getPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.meta_description || undefined,
  };
}

export default async function PublishedPage({ params }: PageProps) {
  const page = await getPage(params.slug);
  if (!page) notFound();

  return (
    <main className="container mx-auto px-4 py-12 prose text-right max-w-3xl">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
