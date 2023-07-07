import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmployeeProfileInterface {
  id?: string;
  user_id?: string;
  job_title?: string;
  department?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface EmployeeProfileGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  job_title?: string;
  department?: string;
}
