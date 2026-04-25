/**
 * Future: leaderboard aggregation.
 *
 * Suggested implementation:
 *  - onSchedule (Cloud Scheduler) runs every hour
 *  - Queries players collection, orders by score desc, limit 100
 *  - Writes result to a single leaderboard/{snapshot} document
 *  - Client reads that document — avoids expensive fan-out queries
 */

// Placeholder — no export until leaderboard is implemented
