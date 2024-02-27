import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { mockFamiliesData } from '@/tests/utilsTest/mocks'
import { customRender } from '@/tests/utilsTest/render'
import { FamilyForm } from '@/components/forms/FamilyForm'

// useBlocker only can ba used in a router context
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useBlocker: jest.fn(),
}))

jest.mock('@/api/Collections', () => ({
  getCollections: jest.fn(),
}))
jest.mock('@/api/Events', () => ({
  getEvent: jest.fn(),
}))
jest.mock('@/api/Families', () => ({
  createFamily: jest.fn(),
  updateFamily: jest.fn(),
}))
jest.mock('@/api/Documents', () => ({
  deleteDocument: jest.fn(),
}))
jest.mock('@/hooks/useCollections', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    collections: [],
    error: null,
    loading: false,
  })),
}))

jest.mock('@/api/Documents', () => ({
  getDocument: jest.fn().mockResolvedValue({
    response: {
      data: {
        id: 'mockDocumentId',
        title: 'Mock Document Title',
        content: 'Mock content of the document',
      },
    },
  }),
}))

// jest.mock('@/api/Events', () => ({
//   getEvent: jest.fn().mockResolvedValue({
//     response: {
//       data: {
//         import_id: '1',
//         event_title: 'Mock Event Title',
//         date: '2024-02-21',
//         event_type_value: 'Mock Event Type',
//         event_status: 'active',
//         family_import_id: 'family1',
//         family_document_import_id: 'document1', // Asume que es opcional y podría tener un valor
//         // Asegúrate de incluir cualquier otro campo necesario de la interfaz IEvent
//       }
//     }
//   })
// }));

let mockFamilyData = mockFamiliesData[0]

test('renders family data', () => {
  customRender(<FamilyForm family={mockFamilyData} />)

  expect(screen.getByLabelText(/title/i)).toHaveValue(mockFamilyData.title)
  expect(screen.getByLabelText(/summary/i)).toHaveTextContent(
    mockFamilyData.summary,
  )
})

// TEST: isDirty & external navigation & internal navigation

// TET: not isDirty & external navigation & internal navigation

// TEST: Validators
