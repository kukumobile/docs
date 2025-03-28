import React from 'react'
import type { GetServerSideProps } from 'next'

import { MainContextT, MainContext, getMainContext } from 'components/context/MainContext'

import { DefaultLayout } from 'components/DefaultLayout'
import { useTranslation } from 'components/hooks/useTranslation'
import { ArticleList } from 'src/landings/components/ArticleList'
import { HomePageHero } from 'src/landings/components/HomePageHero'
import type { ProductGroupT } from 'src/landings/components/ProductSelections'
import { ProductSelections } from 'src/landings/components/ProductSelections'

type FeaturedLink = {
  href: string
  title: string
  intro: string
}

type Props = {
  mainContext: MainContextT
  popularLinks: Array<FeaturedLink>
  gettingStartedLinks: Array<FeaturedLink>
  productGroups: Array<ProductGroupT>
}

export default function MainHomePage({
  mainContext,
  gettingStartedLinks,
  popularLinks,
  productGroups,
}: Props) {
  return (
    <MainContext.Provider value={mainContext}>
      <DefaultLayout>
        <HomePage
          gettingStartedLinks={gettingStartedLinks}
          popularLinks={popularLinks}
          productGroups={productGroups}
        />
      </DefaultLayout>
    </MainContext.Provider>
  )
}

type HomePageProps = {
  popularLinks: Array<FeaturedLink>
  gettingStartedLinks: Array<FeaturedLink>
  productGroups: Array<ProductGroupT>
}
function HomePage(props: HomePageProps) {
  const { gettingStartedLinks, popularLinks, productGroups } = props
  const { t } = useTranslation(['toc'])

  // Adding external links here due to accessibility design changes where we removed the sidebar on the homepage
  // docs-team 2965
  if (!productGroups.find((group) => group.name === 'More docs')) {
    productGroups.push({
      name: 'More docs',
      octicon: 'PencilIcon',
      children: [
        {
          id: 'electron',
          name: 'Electron',
          href: 'https://www.electronjs.org/docs/latest',
          versions: [],
          external: true,
        },
        {
          id: 'codeql',
          name: 'CodeQL',
          href: 'https://codeql.github.com/docs/',
          versions: [],
          external: true,
        },
        {
          id: 'npm',
          name: 'npm',
          href: 'https://docs.npmjs.com/',
          versions: [],
          external: true,
        },
      ],
    })
  }

  return (
    <div>
      <HomePageHero />
      <ProductSelections productGroups={productGroups} />
      <div className="mt-6 px-3 px-md-6 container-xl">
        <div className="container-xl">
          <div className="gutter gutter-xl-spacious clearfix">
            <div className="col-12 col-lg-6 mb-md-4 mb-lg-0 float-left">
              <ArticleList title={t('toc:getting_started')} articles={gettingStartedLinks} />
            </div>

            <div className="col-12 col-lg-6 float-left">
              <ArticleList title={t('toc:popular')} articles={popularLinks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const req = context.req as any
  const res = context.res as any

  return {
    props: {
      mainContext: await getMainContext(req, res),
      productGroups: req.context.productGroups,
      gettingStartedLinks: req.context.featuredLinks.gettingStarted.map(
        ({ title, href, intro }: any) => ({ title, href, intro }),
      ),
      popularLinks: req.context.featuredLinks.popular.map(({ title, href, intro }: any) => ({
        title,
        href,
        intro,
      })),
    },
  }
}
