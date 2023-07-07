import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEmployeeProfileById, updateEmployeeProfileById } from 'apiSdk/employee-profiles';
import { Error } from 'components/error';
import { employeeProfileValidationSchema } from 'validationSchema/employee-profiles';
import { EmployeeProfileInterface } from 'interfaces/employee-profile';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function EmployeeProfileEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EmployeeProfileInterface>(
    () => (id ? `/employee-profiles/${id}` : null),
    () => getEmployeeProfileById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EmployeeProfileInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEmployeeProfileById(id, values);
      mutate(updated);
      resetForm();
      router.push('/employee-profiles');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EmployeeProfileInterface>({
    initialValues: data,
    validationSchema: employeeProfileValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Employee Profile
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="job_title" mb="4" isInvalid={!!formik.errors?.job_title}>
              <FormLabel>Job Title</FormLabel>
              <Input type="text" name="job_title" value={formik.values?.job_title} onChange={formik.handleChange} />
              {formik.errors.job_title && <FormErrorMessage>{formik.errors?.job_title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="department" mb="4" isInvalid={!!formik.errors?.department}>
              <FormLabel>Department</FormLabel>
              <Input type="text" name="department" value={formik.values?.department} onChange={formik.handleChange} />
              {formik.errors.department && <FormErrorMessage>{formik.errors?.department}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'employee_profile',
    operation: AccessOperationEnum.UPDATE,
  }),
)(EmployeeProfileEditPage);
