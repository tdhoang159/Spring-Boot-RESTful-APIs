import { userApi } from "./userApi";
import type { UserPayload, UserRecord } from "../types/admin.types";

export const organizerApi = {
  async getOrganizers(): Promise<UserRecord[]> {
    const users = await userApi.getUsers();
    return users.filter((user) => user.roleName === "ORGANIZER" || user.roleId === 2);
  },
  async getOrganizer(id: number): Promise<UserRecord> {
    return userApi.getUser(id);
  },
  async createOrganizer(payload: Omit<UserPayload, "roleId">): Promise<UserRecord> {
    return userApi.createUser({ ...payload, roleId: 2 });
  },
  async updateOrganizer(id: number, payload: Omit<UserPayload, "roleId">): Promise<UserRecord> {
    return userApi.updateUser(id, { ...payload, roleId: 2 });
  },
  async deleteOrganizer(id: number): Promise<void> {
    await userApi.deleteUser(id);
  },
};
