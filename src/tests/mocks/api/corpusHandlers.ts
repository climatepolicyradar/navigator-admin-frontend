import { http, HttpResponse } from 'msw'

export const corpusHandlers = [
  http.get('*/v1/corpora/', () => HttpResponse.json([])),
  http.get('*/v1/corpus-types', () => HttpResponse.json([])),
]
