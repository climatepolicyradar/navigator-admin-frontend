import { customRender } from "@/tests/utilsTest/render";
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import FamilyList from "@/components/lists/FamilyList";

jest.mock('@/api/Families', () => ({
  getFamilies: jest.fn(),
  deleteFamily: jest.fn(),
}));

const mockFamiliesData = [
  {
    import_id: '1',
    title: 'Family One',
    category: 'Category One',
    geography: 'Geography One',
    published_date: '2021-01-01',
    last_updated_date: '2021-02-01',
    last_modified: '2021-03-01',
    created: '2021-04-01',
    status: 'active',
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: () => ({
    response: { data: mockFamiliesData },
  }),
}));


describe('FamilyList', () => {
  it('renders without crashing', () => {
    customRender(<FamilyList />);

    // Verify mock family is there
    expect(screen.getByText('Family One')).toBeInTheDocument();
    expect(screen.getByText('Category One')).toBeInTheDocument();
    expect(screen.getByText('Geography One')).toBeInTheDocument();
  });
});