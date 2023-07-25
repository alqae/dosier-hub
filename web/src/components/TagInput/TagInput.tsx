import React, { useMemo, useState } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Autocomplete, { createFilterOptions } from '@mui/joy/Autocomplete'
import AutocompleteOption from '@mui/joy/AutocompleteOption'
import FormControl from '@mui/joy/FormControl'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'

import { useCreateTagMutation, useGetTagsQuery } from '@services/api'
import Textarea from '@mui/joy/Textarea'

interface ITagInputProps {
  children?: React.ReactNode
  onChange: (values: Models.Tag['id'][]) => void
  defaultValue?: number[]
}

interface CreateTagForm {
  name: string
  description: string
}

type TagOption =  {
  inputValue?: string
  description: string
  name: string
  id: number
}

const createTagFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required(),
})

const filter = createFilterOptions<TagOption>({})

const TagInput: React.FC<ITagInputProps> = ({
  onChange,
  defaultValue,
}) => {
  const { data: tags } = useGetTagsQuery()
  // const [value, setValue] = useState<TagOption[]>()
  const [createTag] = useCreateTagMutation()

  const [show, setShow] = useState<boolean>(false)

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTagForm>({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: yupResolver(createTagFormSchema)
  })

  const onCreateTag = async (values: CreateTagForm) => {
    const response = await createTag(values)
    if ('error' in response) return
    reset()
    setShow(false)
    
  }

  const options = useMemo<TagOption[]>(
    () => tags?.map((tag: Models.Tag) => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
    })) || [],
    [tags]
  )

  return (
    <>
      <Autocomplete
        multiple
        placeholder="Select tags"
        defaultValue={
          defaultValue
            ?.map((tag) => options.find((option) => option.id === tag))
            .filter((tag) => !!tag) as TagOption[]
        }
        onChange={(_, newValue) => {
          const lastValue = newValue[newValue.length - 1]
          if (typeof lastValue === 'string') {
            setTimeout(() => {
              setShow(true)
              setValue('name', lastValue)
            })
          } else if (newValue && lastValue.inputValue) {
            setShow(true)
            setValue('name', lastValue.inputValue)
          } else {
            const nextValue = newValue as TagOption[]
            onChange(nextValue.map((tag) => tag.id))
          }
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(options, params) => {
          // const filtered = options.filter((option) => {
          //   const value = params.inputValue.toLowerCase().trim()
          //   const inputValue = option.name.toLowerCase().trim()

          //   if ()
          // })
          const filtered = filter(options, params)

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
              description: 'Add a new tag',
              id: 0,
            })
          }

          return filtered
        }}
        options={options}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option
          }
          if (option.inputValue) {
            return option.inputValue
          }
          return option.name
        }}
        freeSolo
        selectOnFocus
        clearOnBlur
        renderOption={(props, option) => (
          <AutocompleteOption {...props} key={option.id}>{option.name}</AutocompleteOption>
        )}
      />
      <Modal open={show} onClose={() => setShow(false)}>
        <ModalDialog>
          <form onSubmit={handleSubmit(onCreateTag)}>
            <Typography
              id="basic-modal-dialog-title"
              component="h2"
              level="inherit"
              fontSize="1.25em"
              mb="0.25em"
            >
              Add a new film
            </Typography>
            <Typography
              id="basic-modal-dialog-description"
              mt={0.5}
              mb={2}
              textColor="text.tertiary"
            >
              Did you miss any film in our list? Please, add it!
            </Typography>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  size="lg"
                  placeholder="John Doe"
                  autoComplete="off"
                  error={!!errors.name}
                  {...register('name')}
                />

                {!!errors.name && <Typography level="body2" color="danger" alignSelf="flex-end">
                  {errors.name.message}
                </Typography>}
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  size="lg"
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                  minRows={2}
                  error={!!errors.description}
                  {...register('description')}
                />

                {!!errors.description && <Typography level="body2" color="danger" alignSelf="flex-end">
                  {errors.description.message}
                </Typography>}
              </FormControl>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="plain" color="neutral" onClick={() => setShow(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  )
}

export default TagInput
