import { prisma } from '../config/db';
import { z } from 'zod';
import { createFieldSchema, updateFieldSchema } from '../schemas/field.schema';

type CreateFieldInput = z.infer<typeof createFieldSchema>['body'];
type UpdateFieldInput = z.infer<typeof updateFieldSchema>['body'];

export class FieldService {
  static getFieldStatus(stage: string, updatedAt: Date): 'Completed' | 'Active' | 'At Risk' {
    if (stage === 'Harvested') return 'Completed';

    const now = new Date();
    const daysSinceUpdate = (now.getTime() - new Date(updatedAt).getTime()) / (1000 * 3600 * 24);

    if (daysSinceUpdate > 7) {
      return 'At Risk';
    }

    if (stage === 'Growing' && daysSinceUpdate > 14) {
      // Though theoretically caught by the > 7 rule above, explicitly highlighting business logic limit
      return 'At Risk';
    }

    return 'Active';
  }

  static enrichWithStatus(field: any) {
    return {
      ...field,
      status: this.getFieldStatus(field.current_stage, field.updatedAt),
    };
  }

  static async createField(adminId: string, data: CreateFieldInput) {
    const field = await prisma.field.create({
      data: {
        name: data.name,
        crop_type: data.crop_type,
        planting_date: new Date(data.planting_date),
        assigned_agent_id: data.assigned_agent_id,
        created_by_id: adminId,
      },
    });
    return this.enrichWithStatus(field);
  }

  static async updateField(fieldId: string, data: UpdateFieldInput) {
    const field = await prisma.field.update({
      where: { id: fieldId },
      data: {
        ...data,
        planting_date: data.planting_date ? new Date(data.planting_date) : undefined,
      },
    });
    return this.enrichWithStatus(field);
  }

  static async assignAgent(fieldId: string, agentId: string) {
    const field = await prisma.field.update({
      where: { id: fieldId },
      data: { assigned_agent_id: agentId },
    });
    return this.enrichWithStatus(field);
  }

  static async getAllFields() {
    const fields = await prisma.field.findMany({
      include: {
        assigned_agent: { select: { id: true, name: true } },
      },
    });
    return fields.map((f: any) => this.enrichWithStatus(f));
  }

  static async getAssignedFields(agentId: string) {
    const fields = await prisma.field.findMany({
      where: { assigned_agent_id: agentId },
    });
    return fields.map((f: any) => this.enrichWithStatus(f));
  }
}
