import type { RoutingArea, RoutingAreaForm } from "@/types/routing-areas";
import apiClient from ".";

export const getRoutingAreas = async (): Promise<{
  routingAreas: RoutingArea[];
}> => {
  const response = await apiClient.get("/routingArea");
  return response.data as { routingAreas: RoutingArea[] };
};

export const getSearchRoutingAreas = async ({
  query,
}: {
  query: string;
}): Promise<{ routingAreas: RoutingArea[] }> => {
  const response = await apiClient.get("/routingArea", {
    params: { q: query, status: "ACTIVE" },
  });
  return response.data as { routingAreas: RoutingArea[] };
};

export const createRoutingArea = async ({
  area,
  deliverId,
}: RoutingAreaForm): Promise<RoutingArea> => {
  const response = await apiClient.post("/routingArea", {
    area,
    deliverId,
  });
  return response.data as RoutingArea;
};

export const updateRoutingArea = async ({
  id,
  area,
  deliverId,
  status,
}: RoutingAreaForm): Promise<RoutingArea> => {
  const response = await apiClient.put(`/routingArea/${id}`, {
    area,
    deliverId,
    status,
  });
  return response.data as RoutingArea;
};

export const deleteRoutingArea = async (id: string): Promise<void> => {
  await apiClient.delete(`/routingArea/${id}`);
};
