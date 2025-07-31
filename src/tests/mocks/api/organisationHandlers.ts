import { IOrganisation, IOrganisationFormPost } from '@/interfaces/Organisation'
import { http, HttpResponse } from 'msw'

const mockOrganisations: IOrganisation[] = [
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
    const updateData = await request.json()
    const id = mockOrganisations.length + 1
    mockOrganisations.push({ ...(updateData as IOrganisationFormPost), id: id })
    return HttpResponse.json(id)
  }),
]
