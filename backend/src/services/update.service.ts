import { prisma } from '../config/db';

const STAGE_ORDER = ['Planted', 'Growing', 'Ready', 'Harvested'];

export class UpdateService {
  static async addUpdate(fieldId: string, agentId: string, stage: string, notes?: string) {
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) throw new Error('Field not found');

    if (field.assigned_agent_id !== agentId) {
      throw new Error('Unauthorized: You are not assigned to this field');
    }

    const currentStageIndex = STAGE_ORDER.indexOf(field.current_stage);
    const newStageIndex = STAGE_ORDER.indexOf(stage);

    if (newStageIndex < currentStageIndex) {
      throw new Error('Invalid stage transition (skipping backward not allowed)');
    }
    
    // We update the field to the new stage and create a FieldUpdate log within a transaction.
    const [updateLog, updatedField] = await prisma.$transaction([
      prisma.fieldUpdate.create({
        data: {
          field_id: fieldId,
          updated_by_id: agentId,
          stage: stage as any,
          notes,
        },
      }),
      prisma.field.update({
        where: { id: fieldId },
        data: { current_stage: stage as any },
      }),
    ]);

    return { updateLog, field: updatedField };
  }

  static async getAllUpdates() {
    return prisma.fieldUpdate.findMany({
      include: {
        field: { select: { id: true, name: true } },
        updated_by: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
