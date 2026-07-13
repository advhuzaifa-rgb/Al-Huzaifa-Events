import { notFound } from 'next/navigation'
import { articles, getArticleBySlug } from '../../Components/Journal/data'
import Footer from '../../Components/Footer/Footer'
import JournalArticle from '../../Components/JournalArticle/JournalArticle'

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {}
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      images: [{ url: article.image.src }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
      images: [article.image.src],
    },
  }
}

export default async function JournalArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      <JournalArticle article={article} />
      <Footer />
    </>
  )
}
