import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { renderRoute } from '../utilsTest/renderRoute'

describe('Collection form', () => {
  it('successfully creates collection', async () => {
    const { user } = renderRoute('/collection/new')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Create new collection',
      }),
    ).toBeInTheDocument()

    const newTitle = 'Test collection'
    await user.type(screen.getByRole('textbox', { name: 'Title' }), newTitle)
    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'Test description',
    )
    await user.click(
      screen.getByRole('button', { name: 'Create new Collection' }),
    )

    expect(
      await screen.findByText('Collection has been successfully created'),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: `Editing: ${newTitle}`,
      }),
    ).toBeInTheDocument()
  })
})
