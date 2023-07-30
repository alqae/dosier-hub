import React, { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import FormControl from '@mui/joy/FormControl'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Textarea from '@mui/joy/Textarea'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'

import { useCreateTagMutation } from '@services/api'

interface ICreateTagModalProps {
  children?: React.ReactNode
  show: boolean
  onClose: () => void
  onCreateTag?: (tag: Models.Tag) => void
  defaultValue?: Partial<Models.Tag>
}

interface CreateTagForm {
  name: string
  description: string
}

const createTagFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required(),
})

const CreateTagModal: React.FC<ICreateTagModalProps> = ({
  show,
  onClose,
  defaultValue,
  onCreateTag = () => { },
}) => {
  const [createTag] = useCreateTagMutation()
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

  const onCreate = async (values: CreateTagForm) => {
    const response = await createTag(values)
    if ('error' in response) return
    onCreateTag(response.data)
    onClose()
    reset()
  }

  useEffect(() => {
    if (defaultValue && defaultValue.name) {
      setValue('name', defaultValue.name)
    }
  }, [defaultValue])

  return (


    <Modal open={show} onClose={onClose}>
      <ModalDialog>
        <form onSubmit={(e) => {
          handleSubmit(onCreate)(e)
          e.stopPropagation() // This prevents the parent form from being submitted
        }}>
          <Typography component="h2" level="inherit" fontSize="1.25em" mb="0.25em">
            Add a new tag
          </Typography>

          <Typography textColor="text.tertiary" mt={0.5} mb={2}>
            Did you miss any tags on your list? Please, add it!
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
              <Button variant="plain" color="neutral" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </Stack>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}

export default CreateTagModal
