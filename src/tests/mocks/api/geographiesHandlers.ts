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
      {
        code: 'BB-1',
        name: 'Subdivision 2',
        type: 'State',
        country_alpha_2: 'BB',
        country_alpha_3: 'BBB',
      },
      {
        code: 'AF-BAL',
        name: 'Balkh',
        type: 'Province',
        country_alpha_2: 'AF',
        country_alpha_3: 'AFG',
      },
    ])
  }),
]
