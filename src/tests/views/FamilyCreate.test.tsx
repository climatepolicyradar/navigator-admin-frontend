import { screen } from '@testing-library/react'
import { renderRoute } from '../utilsTest/renderRoute'
import { setupUser } from '../helpers.ts'

describe('FamilyForm create', () => {
  it('allows selection of multiple authors for Reports', async () => {
    setupUser({ organisationName: 'GCF', orgId: 6 })
    const { user } = renderRoute('/family/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new family' }),
    ).toBeInTheDocument()

    await user.type(
      await screen.findByRole('textbox', { name: 'Title' }),
      'GCF Family',
    )
    await user.click(screen.getByRole('combobox', { name: 'Geographies' }))
    const geo_option = screen.getByRole('option', {
      name: 'Afghanistan',
    })
    await user.click(geo_option)

    const corpus_name = 'Climate Investment Funds Guidance'
    await user.click(screen.getByRole('combobox', { name: 'Corpus' }))
    const corpus_option = screen.getByRole('option', {
      name: corpus_name,
    })
    await user.click(corpus_option)
    expect(screen.getByText(corpus_name)).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Reports (Guidance)' }))

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
        name: 'Individual',
      }),
    )
    await user.click(author_type_dropdown)
    await user.click(
      screen.getByRole('option', {
        name: 'Academic/Research',
      }),
    )

    expect(screen.getByText('Individual')).toBeInTheDocument()
    expect(screen.getByText('Academic/Research')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create Family' }))

    expect(
      screen.getByText('Family has been successfully created'),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Editing: GCF Family',
      }),
    ).toBeInTheDocument()
  })
})
