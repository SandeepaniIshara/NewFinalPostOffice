import { Request, Response } from "express";
import { RoutingAreaSchema } from "../schema/routingArea";
import { prisma } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Status, UserRole, UserStatus } from "@prisma/client";

export const GetRoutingAreas = async (req: Request, res: Response) => {
  const { q, status } = req.query;
  const searchQuery = typeof q === "string" ? q : "";

  const routingAreas = await prisma.routingArea.findMany({
    where: {
      OR: [
        { area: { contains: searchQuery,  } },
        {
          deliver: {
            fName: {
              contains: searchQuery,
             
            },
            lName: {
              contains: searchQuery,
             
            },
            username: {
              contains: searchQuery,
             
            },
          },
        },
      ],
      AND: [
        {
          status: status ? (status as Status) : undefined,
        },
      ],
    },
    include: {
      deliver: {
        select: {
          id: true,
          username: true,
          fName: true,
          lName: true,
          email: true,
          phoneNum: true,
          address: true,
          role: true,
          status: true,
        },
      },
    },
  });
  if (routingAreas.length === 0) {
    return res.json({ routingAreas: [] });
  }

  console.log(
    `LOG_BOOK routingArea=${searchQuery} ${status} searched by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ routingAreas: routingAreas });
};

export const GetRoutingAreaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    throw new NotFoundException(
      "Routing Area ID is required!",
      ErrorCode.BAD_REQUEST
    );
  }

  const routingArea = await prisma.routingArea.findUnique({
    where: { id: Number(id) },
    include: {
      deliver: {
        select: {
          id: true,
          username: true,
          fName: true,
          lName: true,
          email: true,
          phoneNum: true,
          address: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!routingArea) {
    throw new NotFoundException(
      "Routing Area not found!",
      ErrorCode.ROUTING_AREA_NOT_FOUND
    );
  }

  console.log(
    `LOG_BOOK routingArea= ${id}  Routing Area ID by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ routingArea: routingArea });
};

export const CreateRoutingArea = async (req: Request, res: Response) => {
  RoutingAreaSchema.parse(req.body);

  const { area, deliverId } = req.body;

  const deliver = await prisma.employee.findUnique({
    where: { id: Number(deliverId) },
    select: {
      role: true,
      status: true,
    },
  });

  if (
    !deliver ||
    deliver?.status !== UserStatus.ACTIVE ||
    deliver?.role !== UserRole.MAIL_DELIVERER
  ) {
    throw new NotFoundException(
      "Deliver not found!",
      ErrorCode.DELIVER_NOT_FOUND
    );
  }

  const routingArea = await prisma.routingArea.create({
    data: {
      area,
      deliverId: Number(deliverId),
    },
  });
  console.log(
    `LOG_BOOK routingArea= ${routingArea?.id} added by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  res.json({ routingArea: routingArea });
};

export const UpdateRoutingArea = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    throw new NotFoundException(
      "Routing Area ID is required!",
      ErrorCode.BAD_REQUEST
    );
  }

  RoutingAreaSchema.parse(req.body);

  const { area, deliverId, status } = req.body;

  let routingArea = await prisma.routingArea.findUnique({
    where: { id: Number(id) },
  });
  if (!routingArea) {
    throw new NotFoundException(
      "Routing Area not found!",
      ErrorCode.ROUTING_AREA_NOT_FOUND
    );
  }

  routingArea = await prisma.routingArea.update({
    where: { id: Number(id) },
    data: {
      area,
      deliverId: Number(deliverId),
      status,
    },
  });

  console.log(
    `LOG_BOOK routingArea= ${routingArea?.id} updated by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ routingArea: routingArea });
};

export const DeleteRoutingArea = async (req: Request, res: Response) => {
  const { id } = req.params;

  const routingArea = await prisma.routingArea.update({
    where: { id: Number(id) },
    data: {
      status: Status.INACTIVE,
    },
  });
  if (!routingArea) {
    throw new NotFoundException(
      "Routing Area not found!",
      ErrorCode.ROUTING_AREA_NOT_FOUND
    );
  }
  console.log(
    `LOG_BOOK routing area= ${routingArea?.id} deleted by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  res.json({ message: "Routing area deleted successfully!" });
};
