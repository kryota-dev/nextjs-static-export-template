import 'server-only'

import { RootLayoutPresentation } from './presentation'

import type { ComponentProps } from 'react'

type Props = Pick<
  ComponentProps<typeof RootLayoutPresentation>,
  'children' | 'jsonld'
>

/**
 * RootLayoutContainer
 * @description Server Components上でのデータフェッチなどのサーバーサイド処理を行うコンテナコンポーネント
 */
export const RootLayoutContainer = (props: Props) => {
  return <RootLayoutPresentation {...props} />
}
