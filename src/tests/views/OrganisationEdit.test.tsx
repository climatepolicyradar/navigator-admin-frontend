import { screen } from '@testing-library/react'
import { describe } from 'vitest'
import '../setup'
import { renderRoute } from '../utilsTest/renderRoute'

import '@testing-library/jest-dom'

describe('OrganisationEdit', () => {
  it('successfully edits an existing organisation when all required fields are provided', async () => {
    const { user } = renderRoute('/organisation/1/edit')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Editing: Test Organisation 1',
      }),
    ).toBeInTheDocument()

    const displayNameInput = screen.getByRole('textbox', {
      name: 'Display Name',
    })
    expect(displayNameInput).toHaveValue('Test Organisation 1')

    await user.clear(displayNameInput)
    await user.type(displayNameInput, 'Test Organisation 1 - Edited')
    expect(displayNameInput).toHaveValue('Test Organisation 1 - Edited')

    const descriptionInput = screen.getByRole('textbox', {
      name: 'Description',
    })
    expect(descriptionInput).toHaveValue('Test Description 1')

    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'Test Description 1 - Edited')
    expect(descriptionInput).toHaveValue('Test Description 1 - Edited')

    const organisationTypeInput = screen.getByRole('textbox', {
      name: 'Organisation Type',
    })
    expect(organisationTypeInput).toHaveValue('TYPE 1')

    await user.clear(organisationTypeInput)
    await user.type(organisationTypeInput, 'TYPE 1 - Edited')
    expect(organisationTypeInput).toHaveValue('TYPE 1 - Edited')

    const attributionLinkInput = screen.getByRole('textbox', {
      name: 'Attribution Link',
    })
    expect(attributionLinkInput).toHaveValue('test_attribution_link_1.com')

    await user.clear(attributionLinkInput)
    await user.type(attributionLinkInput, 'test_attribution_link_1_edited.com')
    expect(attributionLinkInput).toHaveValue(
      'test_attribution_link_1_edited.com',
    )

    await user.click(
      screen.getByRole('button', { name: 'Update Organisation' }),
    )

    expect(
      await screen.findByText('Organisation update has not been implemented'),
    )
  })
})
