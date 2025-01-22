import React, { useState, ChangeEvent, KeyboardEvent } from 'react'

const TagInput: React.FC = () => {
  const [value, setValue] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (value.trim() !== '') {
        setTags([...tags, value])
        setValue('')
      }
    }
  }

  return (
    <div>
      <input
        type='text'
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div>
        {tags.map((tag, index) => (
          <button key={index}>{tag}</button>
        ))}
      </div>
    </div>
  )
}

export default TagInput
