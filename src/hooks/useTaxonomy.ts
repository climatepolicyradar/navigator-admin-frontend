import {
  IConfigTaxonomyCCLW,
  IConfigTaxonomyMCF,
  IConfigTaxonomyUNFCCC,
} from '@/interfaces/Config'
import { useMemo } from 'react'

const useTaxonomy = (
  corpus_type?: string,
  corpus_taxonomy?:
    | IConfigTaxonomyCCLW
    | IConfigTaxonomyUNFCCC
    | IConfigTaxonomyMCF,
) => {
  return useMemo(() => {
    if (corpus_type === 'Law and Policies')
      return corpus_taxonomy as IConfigTaxonomyCCLW
    else if (corpus_type === 'Intl. agreements')
      return corpus_taxonomy as IConfigTaxonomyUNFCCC
    else return corpus_taxonomy
  }, [corpus_type, corpus_taxonomy])
}

export default useTaxonomy
