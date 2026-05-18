import { http, HttpResponse } from 'msw'

export const geographiesHandlers = [
  http.get('*/geographies/subdivisions', () => {
    return HttpResponse.json([
      {
        code: 'AA-1',
        name: 'Subdivision 1',
        type: 'State',
        country_alpha_2: 'AA',
        country_alpha_3: 'AAA',
      },
    ])
  }),
]
