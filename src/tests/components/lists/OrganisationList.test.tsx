import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '../../setup'
import { TestWrapper } from '@/tests/utilsTest/render'
import '@testing-library/jest-dom'
import OrganisationList from '@/components/lists/OrganisationList'
import { server } from '@/tests/mocks/server'
import { http, HttpResponse } from 'msw'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useNavigate: () => vi.fn(),
  }
})

const renderComponent = () => {
  return render(
    <TestWrapper>
      <OrganisationList />
    </TestWrapper>,
  )
}

describe('OrganisationList', () => {
  it('shows loading state', () => {
    renderComponent()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays correct table headings', async () => {
    renderComponent()

    expect(
      await screen.findByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Description' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Type' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Attribution Link' }),
    ).toBeInTheDocument()
  })

  it('displays organisation data in correct columns', async () => {
    renderComponent()

    const firstTableRow = await screen.findByRole('row', {
      name: /Test Organisation 1/,
    })
    expect(firstTableRow).toBeInTheDocument()
    expect(
      within(firstTableRow).getByRole('cell', { name: 'Test Description 1' }),
    ).toBeInTheDocument()
    expect(
      within(firstTableRow).getByRole('cell', { name: 'TYPE 1' }),
    ).toBeInTheDocument()
    expect(
      within(firstTableRow).getByRole('cell', {
        name: 'test_attribution_link_1.com',
      }),
    ).toBeInTheDocument()
    expect(
      within(firstTableRow).getByRole('button', {
        name: 'Edit organisation',
      }),
    ).toBeInTheDocument()

    const secondTableRow = await screen.findByRole('row', {
      name: /Test Organisation 2/,
    })
    expect(secondTableRow).toBeInTheDocument()
    expect(
      within(secondTableRow).getByRole('cell', { name: 'Test Description 2' }),
    ).toBeInTheDocument()
    expect(
      within(secondTableRow).getByRole('cell', { name: 'TYPE 2' }),
    ).toBeInTheDocument()
    expect(
      within(secondTableRow).getByRole('cell', {
        name: 'test_attribution_link_2.com',
      }),
    ).toBeInTheDocument()
    expect(
      within(secondTableRow).getByRole('button', {
        name: 'Edit organisation',
      }),
    ).toBeInTheDocument()
  })

  it('shows error state', async () => {
    server.use(
      http.get('*/v1/organisations', () => {
        return HttpResponse.error()
      }),
    )

    renderComponent()
    expect(await screen.findByText(/Network Error/i)).toBeInTheDocument()
  })

  it('edit button links to the corresponding organisation edit page', async () => {
    renderComponent()

    const firstTableRow = await screen.findByRole('row', {
      name: /Test Organisation 1/,
    })
    const firstRowEditButton = within(firstTableRow).getByRole('button', {
      name: 'Edit organisation',
    })
    const firstRowLink = firstRowEditButton.closest('a')

    const secondTableRow = await screen.findByRole('row', {
      name: /Test Organisation 2/,
    })
    const secondRowEditButton = within(secondTableRow).getByRole('button', {
      name: 'Edit organisation',
    })
    const secondRowLink = secondRowEditButton.closest('a')

    expect(firstRowLink).toHaveAttribute('href', `/organisation/1/edit`)
    expect(secondRowLink).toHaveAttribute('href', `/organisation/2/edit`)
  })
})
