import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import '../setup'
import { renderRoute } from '../utilsTest/renderRoute'

import '@testing-library/jest-dom'

describe('OrganisationCreate', () => {
  it('successfully creates a new organisation when all required fields are provided', async () => {
    const { user } = renderRoute('/organisation/new')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Create new organisation',
      }),
    ).toBeInTheDocument()

    const shorthandInput = screen.getByRole('textbox', { name: 'Shorthand' })
    await user.type(shorthandInput, 'Test shorthand')
    expect(shorthandInput).toHaveValue('Test shorthand')

    const descriptionInput = screen.getByRole('textbox', {
      name: 'Description',
    })
    await user.type(descriptionInput, 'Test description')
    expect(descriptionInput).toHaveValue('Test description')

    const organisationTypeInput = screen.getByRole('textbox', {
      name: 'Organisation Type',
    })
    await user.type(organisationTypeInput, 'Test Organisation Type')
    expect(organisationTypeInput).toHaveValue('Test Organisation Type')

    const attributionLinkInput = screen.getByRole('textbox', {
      name: 'Attribution Link',
    })
    await user.type(attributionLinkInput, 'test_attribution_link.com')
    expect(attributionLinkInput).toHaveValue('test_attribution_link.com')

    await user.click(
      screen.getByRole('button', { name: 'Create new Organisation' }),
    )

    expect(
      await screen.findByText('Organisation create has not been implemented'),
    )
  })
})
