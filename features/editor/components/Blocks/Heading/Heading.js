import { Editable } from '../../Editable'
import { FreeTranslation } from '../FreeTranslation'

export function Heading(props) {
  const { block } = props

  return (
    <>
      <Editable block={block} type={'heading'} />
      <FreeTranslation />
    </>
  )
}
