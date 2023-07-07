import * as yup from 'yup';

export const timeTrackingValidationSchema = yup.object().shape({
  start_time: yup.date(),
  end_time: yup.date(),
  user_id: yup.string().nullable(),
});
