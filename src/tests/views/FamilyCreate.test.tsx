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
      await screen.findByText('Family has been successfully created'),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Editing: GCF Family',
      }),
    ).toBeInTheDocument()
  })

  it('allows selecting subdivisions', async () => {
    setupUser({ organisationName: 'GCF', orgId: 6 })
    const { user } = renderRoute('/family/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new family' }),
    ).toBeInTheDocument()

    const subdivisionInput = await screen.findByRole('combobox', {
      name: 'Subdivisions',
    })
    expect(screen.queryByText('Subdivision 1')).not.toBeInTheDocument()

    expect(subdivisionInput).toBeInTheDocument()
    await user.click(subdivisionInput)

    const subdivisionOption = screen.getByRole('option', {
      name: 'Subdivision 1',
    })
    await user.click(subdivisionOption)

    expect(screen.getByText('Subdivision 1')).toBeInTheDocument()
  })

  it('selecting a geography filters the subdivision list accordingly', async () => {
    setupUser({ organisationName: 'GCF', orgId: 6 })
    const { user } = renderRoute('/family/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new family' }),
    ).toBeInTheDocument()

    const subdivisionInput = await screen.findByRole('combobox', {
      name: 'Subdivisions',
    })

    expect(subdivisionInput).toBeInTheDocument()

    await user.click(subdivisionInput)

    // check all subdivisions present when no geography selected
    expect(screen.getByText('Subdivision 1')).toBeInTheDocument()
    expect(screen.getByText('Subdivision 2')).toBeInTheDocument()

    const geographiesInput = await screen.findByRole('combobox', {
      name: 'Geographies',
    })

    await user.click(geographiesInput)

    expect(screen.getByText('Country 1')).toBeInTheDocument()
    expect(screen.getByText('Country 2')).toBeInTheDocument()

    const geographyOption = screen.getByRole('option', {
      name: 'Country 2',
    })

    // select a geography
    await user.click(geographyOption)

    await user.click(subdivisionInput)

    // check that only subdivisions of the selected geography present
    expect(screen.queryByText('Subdivision 1')).not.toBeInTheDocument()
    expect(screen.getByText('Subdivision 2')).toBeInTheDocument()
  })

  it('allows selecting subdivisions for multiple different selected geographies', async () => {
    setupUser({ organisationName: 'GCF', orgId: 6 })
    const { user } = renderRoute('/family/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create new family' }),
    ).toBeInTheDocument()

    const geographiesInput = await screen.findByRole('combobox', {
      name: 'Geographies',
    })

    await user.click(geographiesInput)

    expect(screen.getByText('Country 1')).toBeInTheDocument()
    expect(screen.getByText('Country 2')).toBeInTheDocument()

    // select first geography
    const geographyOption1 = screen.getByRole('option', {
      name: 'Country 1',
    })
    await user.click(geographyOption1)

    const subdivisionInput = screen.getByRole('combobox', {
      name: 'Subdivisions',
    })

    // select first geography subdivision
    await user.click(subdivisionInput)
    const subdivisionOption1 = screen.getByRole('option', {
      name: 'Subdivision 1',
    })
    await user.click(subdivisionOption1)

    // select second geography
    await user.click(geographiesInput)
    const geographyOption2 = screen.getByRole('option', {
      name: 'Country 2',
    })
    await user.click(geographyOption2)

    // select second geography subdivision
    await user.click(subdivisionInput)
    const subdivisionOption2 = screen.getByRole('option', {
      name: 'Subdivision 2',
    })
    await user.click(subdivisionOption2)

    // check that both geographies and subdivisions are displayed
    expect(screen.getByText('Country 1')).toBeInTheDocument()
    expect(screen.getByText('Country 2')).toBeInTheDocument()
    expect(screen.getByText('Subdivision 1')).toBeInTheDocument()
    expect(screen.getByText('Subdivision 2')).toBeInTheDocument()
  })
})
