import { ICorpus } from '@/interfaces/Corpus'
import { ICorpusType } from '@/interfaces/CorpusType'
import { http, HttpResponse } from 'msw'

const mockCorpora: ICorpus[] = [
  {
    import_id: 'CCLW.corpus.1.0',
    title: 'Test Corpus 1',
    description: 'Test corpus description',
    corpus_type_name: 'Laws and Policies',
    corpus_type_description: 'Test corpus type description',
    corpus_text: 'Test corpus text',
    corpus_image_url: null,
    organisation_id: 1,
    organisation_name: 'CCLW',
    attribution_url: null,
  },
]

const mockCorpusTypes: ICorpusType[] = [
  { name: 'Laws and Policies', description: 'Test corpus type description' },
]

const notFound = () =>
  HttpResponse.json({ detail: 'Not found' }, { status: 404 })

export const corpusHandlers = [
  http.get('*/v1/corpora/', () => HttpResponse.json([])),
  http.get('*/v1/corpora/:importId', ({ params }) => {
    const corpus = mockCorpora.find((c) => c.import_id === params.importId)
    return corpus ? HttpResponse.json(corpus) : notFound()
  }),
  http.get('*/v1/corpus-types', () => HttpResponse.json([])),
  http.get('*/v1/corpus-types/:name', ({ params }) => {
    const corpusType = mockCorpusTypes.find((t) => t.name === params.name)
    return corpusType ? HttpResponse.json(corpusType) : notFound()
  }),
]
