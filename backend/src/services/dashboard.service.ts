import { prisma } from '../config/db';
import { FieldService } from './field.service';

export class DashboardService {
  static async getAdminDashboard() {
    const fields = await prisma.field.findMany();
    const enrichedFields = fields.map((f: any) => FieldService.enrichWithStatus(f));

    let active_fields = 0;
    let at_risk_fields = 0;
    let completed_fields = 0;

    enrichedFields.forEach((f: any) => {
      if (f.status === 'Active') active_fields++;
      if (f.status === 'At Risk') at_risk_fields++;
      if (f.status === 'Completed') completed_fields++;
    });

    const recent_updates = await prisma.fieldUpdate.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        field: { select: { name: true } },
        updated_by: { select: { name: true } },
      },
    });

    return {
      total_fields: fields.length,
      active_fields,
      at_risk_fields,
      completed_fields,
      recent_updates,
    };
  }

  static async getAgentDashboard(agentId: string) {
    const fields = await prisma.field.findMany({ where: { assigned_agent_id: agentId } });
    const enrichedFields = fields.map((f: any) => FieldService.enrichWithStatus(f));

    const fields_needing_updates = enrichedFields.filter((f: any) => f.status === 'At Risk');

    const recent_activity = await prisma.fieldUpdate.findMany({
      where: { updated_by_id: agentId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        field: { select: { name: true } },
      },
    });

    return {
      assigned_fields: enrichedFields,
      fields_needing_updates,
      recent_activity,
    };
  }
}
