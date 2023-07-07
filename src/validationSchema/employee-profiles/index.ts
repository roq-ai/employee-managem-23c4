import * as yup from 'yup';

export const employeeProfileValidationSchema = yup.object().shape({
  job_title: yup.string(),
  department: yup.string(),
  user_id: yup.string().nullable(),
});
