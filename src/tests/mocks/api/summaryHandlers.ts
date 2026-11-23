import { ISummary } from '@/interfaces/Summary'
import { http, HttpResponse } from 'msw'

const mockSummary: ISummary = {
  n_documents: 0,
  n_families: 0,
  n_collections: 0,
  n_events: 0,
}

export const summaryHandlers = [
  http.get('*/v1/analytics/summary', () => HttpResponse.json(mockSummary)),
]
