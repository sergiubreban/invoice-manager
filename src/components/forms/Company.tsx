import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAppToast, useCuiList } from '../../Hooks';
import { useForm } from 'react-hook-form';
import { CompanyType } from '../../types';


interface CompanyFormProps extends CompanyType {
  isLoading: boolean;
  actionText: string,
  model: 'Client' | 'Company',
  onSubmit: (data: CompanyType) => void,
}

const CompanyForm = (props: CompanyFormProps) => {
  const cuis = useCuiList(props.model)
  const toast = useAppToast();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitForm = async (data: CompanyType) => {
    const { line1, line2, line3, line4, line5, name, cui } = data;
    if (cui && cuis.indexOf(cui) === -1) {
      props.onSubmit({
        name: name!,
        cui,
        line1,
        line2,
        line3,
        line4,
        line5
      });
    } else {
      toast({
        title: t('Please provide a unique cui'),
        status: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit((data: any) => submitForm(data))} data-testid="form">
      <Stack gap="2">
        <FormControl>
          <FormLabel htmlFor="name"  {...(errors.name && { color: 'red' })}>{'Name *'}</FormLabel>
          <Input
            id="name"
            data-testid="input__name"
            type="text"
            defaultValue={props.name}
            {...register("name", { required: true })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="cui"  {...(errors.cui && { color: 'red' })}>{'reg number *'}</FormLabel>
          <Input
            id="cui"
            data-testid="input__cui"
            defaultValue={props.cui}
            type="text"
            {...register("cui", { required: true })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="line1"  {...(errors.line1 && { color: 'red' })}>{'line1 *'}</FormLabel>
          <Input
            id="line1"
            data-testid="input__line1"
            defaultValue={props.line1}
            type="text"
            {...register("line1", { required: true })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="line2"  {...(errors.line2 && { color: 'red' })}>{'line2 *'}</FormLabel>
          <Input
            id="line2"
            data-testid="input__line2"
            defaultValue={props.line2}
            type="text"
            {...register("line2", { required: true })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="line3"  {...(errors.line3 && { color: 'red' })}>{'line3'}</FormLabel>
          <Input
            id="line3"
            data-testid="input__line3"
            defaultValue={props.line3}
            type="text"
            {...register("line3")}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="line4"  {...(errors.line4 && { color: 'red' })}>{'line4'}</FormLabel>
          <Input
            id="line4"
            data-testid="input__line4"
            defaultValue={props.line4}
            type="text"
            {...register("line4")}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="line5"  {...(errors.line5 && { color: 'red' })}>{'line5'}</FormLabel>
          <Input
            id="line5"
            data-testid="input__line5"
            defaultValue={props.line5}
            type="text"
            {...register("line5")}
          />
        </FormControl>
        <Button isLoading={props.isLoading} type="submit" variant="ghost" alignSelf="flex-end" data-testid="submit-btn">
          {props.actionText}
        </Button>
      </Stack>
    </form>
  );
};
export default CompanyForm;
