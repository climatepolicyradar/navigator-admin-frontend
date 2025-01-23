import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagInput from '../../../../components/forms/fields/MultiValueInput'

describe('TagInput', () => {
  it('should add tags when Enter is pressed', async () => {
    render(<TagInput />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'tag1{enter}')
    await userEvent.type(input, 'tag2{enter}')

    const buttons = await screen.findAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveTextContent('tag1')
    expect(buttons[1]).toHaveTextContent('tag2')
  })

  it('should not add empty tags', async () => {
    render(<TagInput />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, '   {enter}') // only spaces

    const button = screen.queryByRole('button')
    expect(button).toBeNull() // no button should be added
  })
})
