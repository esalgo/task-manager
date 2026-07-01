import { prisma } from '../../lib/prisma.js';

export async function getStatistics() {
  const [totalTasks, totalUsers, tasksByStatus] = await Promise.all([
    prisma.task.count(),
    prisma.user.count(),
    prisma.task.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const pendingTasks =
    tasksByStatus.find((g) => g.status === 'Pendiente')?._count._all ?? 0;
  const completedTasks =
    tasksByStatus.find((g) => g.status === 'Completada')?._count._all ?? 0;

  return { totalTasks, pendingTasks, completedTasks, totalUsers };
}
