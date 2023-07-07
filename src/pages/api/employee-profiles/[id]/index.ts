import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { employeeProfileValidationSchema } from 'validationSchema/employee-profiles';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.employee_profile
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEmployeeProfileById();
    case 'PUT':
      return updateEmployeeProfileById();
    case 'DELETE':
      return deleteEmployeeProfileById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmployeeProfileById() {
    const data = await prisma.employee_profile.findFirst(convertQueryToPrismaUtil(req.query, 'employee_profile'));
    return res.status(200).json(data);
  }

  async function updateEmployeeProfileById() {
    await employeeProfileValidationSchema.validate(req.body);
    const data = await prisma.employee_profile.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEmployeeProfileById() {
    const data = await prisma.employee_profile.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
