import React, { SyntheticEvent, useMemo, useState } from 'react'

import Autocomplete, { createFilterOptions } from '@mui/joy/Autocomplete'
import AutocompleteOption from '@mui/joy/AutocompleteOption'
import { FilterOptionsState } from '@mui/material'

import { useGetTagsQuery } from '@services/api'
import CreateTagModal from '../CreateTagModal'

interface ITagInputProps {
  children?: React.ReactNode
  onChange: (values: Models.Tag[]) => void
  defaultValue?: number[]
  value?: Models.Tag[]
  onAddTag?: (tag: Models.Tag) => void
}

interface TagOption extends Models.Tag {
  inputValue?: string
}

const filter = createFilterOptions<TagOption>({})

const TagInput: React.FC<ITagInputProps> = ({
  onChange,
  defaultValue,
  value = [],
  onAddTag = () => { },
}) => {
  const [tagToCreate, setTagToCreate] = useState<string | undefined>(undefined)
  const { data: options = [], refetch } = useGetTagsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const _defaultValue = useMemo<TagOption[]>(
    () => options.filter((option) => defaultValue?.includes(option.id)),
    [options, defaultValue]
  )

  const handleChange = (_: SyntheticEvent<Element, Event>, newValue: (string | TagOption)[]) => {
    const lastValue = newValue[newValue.length - 1]
    if (typeof lastValue === 'string') {
      setTimeout(() => setTagToCreate(lastValue))
    } else if (newValue && lastValue.inputValue) {
      setTagToCreate(lastValue.inputValue)
    } else {
      const nextValue = newValue as TagOption[]
      onChange(nextValue)
    }
  }

  const handleFilterOptions = (options: TagOption[], params: FilterOptionsState<TagOption>) => {
    const filtered = filter(options, params)

    if (params.inputValue !== '') {
      filtered.push({
        inputValue: params.inputValue,
        name: `Add "${params.inputValue}"`,
        description: 'Add a new tag',
        created_at: '',
        updated_at: '',
        id: 0,
      })
    }

    return filtered
  }

  return (
    <>
      <Autocomplete
        multiple
        placeholder="Select tags"
        value={value}
        defaultValue={_defaultValue}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={handleFilterOptions}
        options={options}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option
          if (option.inputValue) return option.inputValue
          return option.name
        }}
        freeSolo
        selectOnFocus
        clearOnBlur
        renderOption={(props, option) => (
          <AutocompleteOption {...props} key={option.id}>
            {option.name}
          </AutocompleteOption>
        )}
      />

      <CreateTagModal
        onCreateTag={(newTag) => {
          onAddTag(newTag)
          refetch()
        }}
        show={Boolean(tagToCreate)}
        defaultValue={{ name: tagToCreate }}
        onClose={() => setTagToCreate(undefined)}
      />
    </>
  )
}

export default TagInput
