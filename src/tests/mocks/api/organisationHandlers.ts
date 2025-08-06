import { IOrganisation } from '@/interfaces/Organisation'
import { http, HttpResponse } from 'msw'

let mockOrganisations: IOrganisation[] = [
  {
    id: 1,
    internal_name: 'Test Organisation 1',
    display_name: 'Test Organisation 1',
    description: 'Test Description 1',
    type: 'TYPE 1',
    attribution_url: 'test_attribution_link_1.com',
  },
  {
    id: 2,
    internal_name: 'Test Organisation 2',
    display_name: 'Test Organisation 2',
    description: 'Test Description 2',
    type: 'TYPE 2',
    attribution_url: 'test_attribution_link_2.com',
  },
]

export const organisationHandlers = [
  http.get('*/v1/organisations', () => {
    return HttpResponse.json(mockOrganisations)
  }),
  http.get('*/v1/organisations/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json(
      mockOrganisations.find((org) => org.id.toString() === id),
    )
  }),
  http.post('*/v1/organisations', async ({ request }) => {
    const data = await request.json()
    const id = mockOrganisations.length + 1
    mockOrganisations.push({ ...(data as IOrganisation), id: id })
    return HttpResponse.json(id)
  }),
  http.put('*/v1/organisations/:id', async ({ params, request }) => {
    const { id } = params
    const data = await request.json()

    mockOrganisations = mockOrganisations.map((org) =>
      org.id.toString() === id ? { ...org, ...(data as IOrganisation) } : org,
    )
    return HttpResponse.json(
      mockOrganisations.find((org) => org.id.toString() === id),
    )
  }),
]
