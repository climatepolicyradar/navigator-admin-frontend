import { FamilyForm } from '@/components/forms/FamilyForm';
import { screen } from '@testing-library/react';
import { mockFamiliesData } from '@/tests/utilsTest/mocks'

import '@testing-library/jest-dom';
import { customRender } from '@/tests/utilsTest/render';

jest.mock('@/api/Config', () => ({
  getConfig: jest.fn(),
}));
jest.mock('@/api/Collections', () => ({
  getCollections: jest.fn(),
}));
jest.mock('@/api/Events', () => ({
  getEvent: jest.fn(),
}));
jest.mock('@/api/Families', () => ({
  createFamily: jest.fn(),
  updateFamily: jest.fn(),
}));
jest.mock('@/api/Documents', () => ({
  deleteDocument: jest.fn(),
}));

let mockFamilyData = mockFamiliesData[0]

test('renders family data', () => {
  customRender(<FamilyForm family={mockFamilyData} />);
  
  expect(screen.getByLabelText(/title/i)).toHaveValue(mockFamilyData.title);
  expect(screen.getByLabelText(/summary/i)).toHaveTextContent(mockFamilyData.summary);
});


// TEST: isDirty & external navigation & internal navigation

// TET: not isDirty & external navigation & internal navigation

// TEST: Validators
