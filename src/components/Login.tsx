import { Button, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = { username?: string; password?: string }

const Login = ({ login }: { login: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [credentialsErr, setCredentialsErr] = useState(false)

  const onSubmit = ({ username, password }: FormData) => {
    if (username === process.env.REACT_APP_USERNAME && password === process.env.REACT_APP_PASSWORD) {
      login()
    } else {
      setCredentialsErr(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="username" {...(errors.username && { color: 'red' })}>
            username
          </FormLabel>
          <Input id="username" placeholder="username" {...register('username', { required: true })} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password" {...(errors.password && { color: 'red' })}>
            password
          </FormLabel>
          <Input id="password" type="password" placeholder="password" {...register('password', { required: true })} />
        </FormControl>
        <Flex width="100%" justify="space-between" direction="row-reverse">
          <Button type="submit">submit</Button>
          {credentialsErr && (
            <Text color="red" fontSize={'12px'}>
              wrong credentials
            </Text>
          )}
        </Flex>
      </VStack>
    </form>
  )
}

export default Login
