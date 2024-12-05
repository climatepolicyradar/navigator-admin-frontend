import { IConfigTaxonomyCCLW, IConfigTaxonomyUNFCCC } from '@/interfaces/Config'
import { useMemo } from 'react'

// TODO: Not sure whether we need to maintain this?
const useTaxonomy = (
  corpus_type?: string,
  corpus_taxonomy?: IConfigTaxonomyCCLW | IConfigTaxonomyUNFCCC,
) => {
  return useMemo(() => {
    if (corpus_type === 'Law and Policies')
      return corpus_taxonomy as IConfigTaxonomyCCLW
    else if (corpus_type === 'Intl. agreements')
      return corpus_taxonomy as IConfigTaxonomyUNFCCC
    else if (corpus_type === 'AF') return corpus_taxonomy
    else return corpus_taxonomy
  }, [corpus_type, corpus_taxonomy])
}

export default useTaxonomy
