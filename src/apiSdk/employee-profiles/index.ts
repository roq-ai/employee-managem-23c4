import axios from 'axios';
import queryString from 'query-string';
import { EmployeeProfileInterface, EmployeeProfileGetQueryInterface } from 'interfaces/employee-profile';
import { GetQueryInterface } from '../../interfaces';

export const getEmployeeProfiles = async (query?: EmployeeProfileGetQueryInterface) => {
  const response = await axios.get(`/api/employee-profiles${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmployeeProfile = async (employeeProfile: EmployeeProfileInterface) => {
  const response = await axios.post('/api/employee-profiles', employeeProfile);
  return response.data;
};

export const updateEmployeeProfileById = async (id: string, employeeProfile: EmployeeProfileInterface) => {
  const response = await axios.put(`/api/employee-profiles/${id}`, employeeProfile);
  return response.data;
};

export const getEmployeeProfileById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/employee-profiles/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmployeeProfileById = async (id: string) => {
  const response = await axios.delete(`/api/employee-profiles/${id}`);
  return response.data;
};
