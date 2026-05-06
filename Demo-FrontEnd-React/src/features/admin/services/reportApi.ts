import { eventApprovalApi } from "./eventApprovalApi";
import { userApi } from "./userApi";
import type { SystemReport } from "../types/admin.types";

export const reportApi = {
  async getSystemReport(): Promise<SystemReport> {
    // TODO: replace this aggregation with a backend report endpoint, for example GET /api/admin/reports/summary.
    const [users, events] = await Promise.all([userApi.getUsers(), eventApprovalApi.getEvents()]);
    return {
      totalUsers: users.length,
      totalOrganizers: users.filter((user) => user.roleName === "ORGANIZER" || user.roleId === 2).length,
      totalEvents: events.length,
      approvedEvents: events.filter((event) => event.approvalStatus === "APPROVED").length,
      pendingEvents: events.filter((event) => event.approvalStatus === "PENDING").length,
      totalRevenue: 0,
      totalCommission: 0,
    };
  },
};
