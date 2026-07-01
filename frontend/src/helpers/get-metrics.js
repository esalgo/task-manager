import {getAllData} from "../services/crud.js";

export async function getMetrics() {
    const stats = await getAllData("/statistics")
    if (!stats || typeof stats !== "object") return [0, 0, 0, 0]
    return [stats.totalTasks, stats.pendingTasks, stats.completedTasks, stats.totalUsers]
}
