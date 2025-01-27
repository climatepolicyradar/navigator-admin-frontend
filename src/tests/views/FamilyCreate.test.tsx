import { screen } from '@testing-library/react'
import { renderRoute } from '../utilsTest/renderRoute'
import { setupUser } from '../helpers.ts'

describe('FamilyForm create', () => {
  it('allows selection of multiple authors for Reports', async () => {
    setupUser('GCF')
    const { user } = renderRoute('/family/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new family' }),
    ).toBeInTheDocument()

    await user.type(
      await screen.findByRole('textbox', { name: 'Title' }),
      'Test family',
    )

    await user.click(screen.getByRole('combobox', { name: 'Corpus' }))

    const corpus_option = screen.getByRole('option', {
      name: 'Climate Investment Funds Guidance',
    })
    await user.click(corpus_option)

    expect(
      screen.getByText('Climate Investment Funds Guidance'),
    ).toBeInTheDocument()

    expect(await screen.findByText('Metadata')).toBeInTheDocument()

    expect(screen.queryByLabelText('Project Id')).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText('Implementing Agency'),
    ).not.toBeInTheDocument()
    expect(
      await screen.findByRole('textbox', { name: 'External Id' }),
    ).toBeInTheDocument()

    const authorInput = await screen.findByRole('textbox', {
      name: 'Author',
    })
    await user.type(authorInput, 'Test Author 1')
    await user.keyboard('[Enter]')
    await user.type(authorInput, 'Test Author 2')
    await user.keyboard('[Enter]')

    expect(screen.getByText('Test Author 1')).toBeInTheDocument()
    expect(screen.getByText('Test Author 2')).toBeInTheDocument()

    const author_type_dropdown = screen.getByRole('combobox', {
      name: 'Author Type',
    })
    await user.click(author_type_dropdown)
    await user.click(
      screen.getByRole('option', {
        name: 'Type One',
      }),
    )
    await user.click(author_type_dropdown)
    await user.click(
      screen.getByRole('option', {
        name: 'Type Two',
      }),
    )

    expect(screen.getByText('Type One')).toBeInTheDocument()
    expect(screen.getByText('Type Two')).toBeInTheDocument()
  })
})
