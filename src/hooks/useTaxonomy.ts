import {
  ICorpusTypeLawsAndPolicies,
  ICorpusTypeIntAgreements,
} from '@/interfaces/Config'
import { useMemo } from 'react'

const useTaxonomy = (
  corpus_type?: string,
  corpus_taxonomy?: ICorpusTypeLawsAndPolicies | ICorpusTypeIntAgreements,
) => {
  return useMemo(() => {
    if (corpus_type === 'Law and Policies')
      return corpus_taxonomy as ICorpusTypeLawsAndPolicies
    else if (corpus_type === 'Intl. agreements')
      return corpus_taxonomy as ICorpusTypeIntAgreements
    else return corpus_taxonomy
  }, [corpus_type, corpus_taxonomy])
}

export default useTaxonomy
