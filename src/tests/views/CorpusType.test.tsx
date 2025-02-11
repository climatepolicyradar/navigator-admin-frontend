import { renderRoute } from '../utilsTest/renderRoute'
import { screen } from '@testing-library/react'

describe('Corpus Type create', () => {
  it('allows creation of corpus type', async () => {
    const { user } = renderRoute('/corpus-type/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new corpus type' }),
    ).toBeInTheDocument()

    await user.type(
      screen.getByRole('textbox', { name: 'Title' }),
      'Test corpus type',
    )

    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'Test corpus type description',
    )

    expect(screen.getByText('Taxonomy')).toBeInTheDocument()

    await user.type(
      screen.getByRole('textbox', { name: 'Name' }),
      'Taxonomy field 1',
    )

    expect(
      screen.getByRole('checkbox', { name: 'Allow any' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Allow blanks' }))

    const allowedValuesInput = screen.getByRole('textbox', {
      name: 'Allowed values',
    })
    await user.type(allowedValuesInput, 'Test value 1')
    await user.keyboard('[Enter]')
    await user.type(allowedValuesInput, 'Test value 2')
    await user.keyboard('[Enter]')

    await user.click(screen.getByRole('button', { name: 'Add' }))

    // expect(screen.getByText('Taxonomy field 1')).toBeInTheDocument()
    // expect(screen.getByText('Test value 1')).toBeInTheDocument()
    // expect(screen.getByText('Test value 2')).toBeInTheDocument()
    // expect(screen.getByText('Allow any: false')).toBeInTheDocument()
    // expect(screen.getByText('Allow blanks: true')).toBeInTheDocument()
  })
})
