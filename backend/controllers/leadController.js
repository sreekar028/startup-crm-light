import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────────
// Helper: build a date at the start of a given month
// ─────────────────────────────────────────────────────────────
const startOfMonth = (year, month) => new Date(year, month, 1);
const endOfMonth = (year, month) => new Date(year, month + 1, 0, 23, 59, 59, 999);

// ─────────────────────────────────────────────────────────────
// GET /api/leads
// Enhanced with pagination, sorting, status, source, date range, search
// ─────────────────────────────────────────────────────────────
/**
 * @param {string} [status]    - Filter by pipeline stage
 * @param {string} [source]    - Filter by lead source
 * @param {string} [search]    - Free-text search across name, company, email
 * @param {string} [dateFrom]  - ISO date — createdAt >= dateFrom
 * @param {string} [dateTo]    - ISO date — createdAt <= dateTo
 * @param {number} [page=1]    - Page index (1-based)
 * @param {number} [limit=20]  - Records per page
 * @param {string} [sortBy=createdAt]    - Sort field
 * @param {string} [sortOrder=desc]      - 'asc' | 'desc'
 * @returns Paginated leads with { total, page, limit, pages, hasNext, hasPrev }
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      status,
      source,
      search,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // 1. Build dynamic filter
    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // 2. Pagination params
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'company', 'value', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // 3. Execute in parallel: data + count
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Lead.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages,
        hasNext: parsedPage < pages,
        hasPrev: parsedPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/leads
// ─────────────────────────────────────────────────────────────
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, value, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      value: Number(value) || 0,
      status,
      source,
      notes,
      owner: req.user._id,
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/leads/:id
// ─────────────────────────────────────────────────────────────
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return errorResponse(res, 'Lead not found', 404);
    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/leads/:id
// ─────────────────────────────────────────────────────────────
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    const updateFields = { ...req.body };
    delete updateFields.owner; // Never allow owner re-assignment

    Object.keys(updateFields).forEach((key) => {
      lead[key] = updateFields[key];
    });

    await lead.save();
    return successResponse(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/leads/:id/status
// ─────────────────────────────────────────────────────────────
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    lead.status = status;
    await lead.save();
    return successResponse(res, lead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/leads/:id
// ─────────────────────────────────────────────────────────────
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    await lead.deleteOne();
    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/leads/stats/summary
// Single aggregation pipeline — much more efficient than loading all docs
// Returns: totalLeads, statusBreakdown, sourceBreakdown, conversionRate,
//          pipelineValue, wonRevenue, avgSalesCycle, thisMonthLeads,
//          lastMonthLeads, growthRate
// ─────────────────────────────────────────────────────────────
export const getLeadStats = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();
    const thisMonthStart = startOfMonth(now.getFullYear(), now.getMonth());
    const lastMonthStart = startOfMonth(now.getFullYear(), now.getMonth() - 1);
    const lastMonthEnd = endOfMonth(now.getFullYear(), now.getMonth() - 1);

    const [result] = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $facet: {
          // 1. Overall counts
          overview: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                pipelineValue: {
                  $sum: { $cond: [{ $ne: ['$status', 'Lost'] }, '$value', 0] },
                },
                wonRevenue: {
                  $sum: { $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0] },
                },
              },
            },
          ],
          // 2. Status breakdown
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          // 3. Source breakdown
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
          ],
          // 4. Won leads for avg sales cycle
          wonLeads: [
            {
              $match: {
                status: 'Won',
                wonAt: { $exists: true },
                createdAt: { $exists: true },
              },
            },
            {
              $project: {
                cycleDays: {
                  $divide: [
                    { $subtract: ['$wonAt', '$createdAt'] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                avgSalesCycle: { $avg: '$cycleDays' },
              },
            },
          ],
          // 5. This month
          thisMonth: [
            { $match: { createdAt: { $gte: thisMonthStart } } },
            { $count: 'count' },
          ],
          // 6. Last month
          lastMonth: [
            {
              $match: {
                createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    // Parse the faceted output
    const overview = result.overview[0] || { totalLeads: 0, pipelineValue: 0, wonRevenue: 0 };
    const totalLeads = overview.totalLeads;
    const pipelineValue = overview.pipelineValue || 0;
    const wonRevenue = overview.wonRevenue || 0;

    // Status breakdown as an object
    const statusBreakdown = {};
    result.byStatus.forEach(({ _id, count }) => {
      if (_id) statusBreakdown[_id] = count;
    });
    const wonCount = statusBreakdown['Won'] || 0;
    const lostCount = statusBreakdown['Lost'] || 0;

    // Source breakdown as an object
    const sourceBreakdown = {};
    result.bySource.forEach(({ _id, count }) => {
      if (_id) sourceBreakdown[_id] = count;
    });

    // Rates — safe division
    const conversionRate = totalLeads > 0 ? Number(((wonCount / totalLeads) * 100).toFixed(1)) : 0;
    const lostRate = totalLeads > 0 ? Number(((lostCount / totalLeads) * 100).toFixed(1)) : 0;

    // Avg sales cycle in days
    const avgSalesCycle = result.wonLeads[0]
      ? Math.round(Math.abs(result.wonLeads[0].avgSalesCycle))
      : 0;

    // Month-over-month growth
    const thisMonthLeads = result.thisMonth[0]?.count || 0;
    const lastMonthLeads = result.lastMonth[0]?.count || 0;
    const growthRate =
      lastMonthLeads > 0
        ? Number((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1))
        : thisMonthLeads > 0
        ? 100
        : 0;

    const stats = {
      totalLeads,
      wonLeads: wonCount,
      lostLeads: lostCount,
      conversionRate,
      lostRate,
      pipelineValue,
      wonRevenue,
      avgSalesCycle,
      statusBreakdown,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate,
    };

    return successResponse(res, stats, 'Lead statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/leads/stats/monthly
// Returns last 6 months with zero-fill for months with no leads.
// Each item: { month: 'Jan 2025', total, won, lost, conversionRate }
// ─────────────────────────────────────────────────────────────
export const getMonthlyStats = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();

    // Build the 6-month window boundaries
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(), // 0-indexed
        label: d.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        start: startOfMonth(d.getFullYear(), d.getMonth()),
        end: endOfMonth(d.getFullYear(), d.getMonth()),
      });
    }

    // Aggregate from oldest month start to now
    const windowStart = months[0].start;

    const rawData = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: windowStart },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }, // 1-indexed in MongoDB
          },
          total: { $sum: 1 },
          won: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] },
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] },
          },
        },
      },
    ]);

    // Build a lookup map: "YYYY-M(0-indexed)" -> data
    const dataMap = {};
    rawData.forEach((d) => {
      const key = `${d._id.year}-${d._id.month - 1}`; // convert to 0-indexed
      dataMap[key] = d;
    });

    // Zero-fill all 6 months
    const monthlyStats = months.map((m) => {
      const key = `${m.year}-${m.month}`;
      const raw = dataMap[key] || { total: 0, won: 0, lost: 0 };
      const conversionRate =
        raw.total > 0 ? Number(((raw.won / raw.total) * 100).toFixed(1)) : 0;
      return {
        month: m.label,
        total: raw.total,
        won: raw.won,
        lost: raw.lost,
        conversionRate,
      };
    });

    return successResponse(res, monthlyStats, 'Monthly statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/leads/search?q=ali&limit=5
// Quick autocomplete search — returns only essential fields
// ─────────────────────────────────────────────────────────────
/**
 * @param {string} q      - Search term (min 1 char)
 * @param {number} [limit=5] - Max results (capped at 10)
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length === 0) {
      return successResponse(res, [], 'No query provided');
    }

    const parsedLimit = Math.min(10, Math.max(1, parseInt(limit) || 5));

    const leads = await Lead.find(
      {
        owner: req.user._id,
        $or: [
          { name: { $regex: q.trim(), $options: 'i' } },
          { company: { $regex: q.trim(), $options: 'i' } },
          { email: { $regex: q.trim(), $options: 'i' } },
        ],
      },
      // Projection — only return essential fields for autocomplete
      { _id: 1, name: 1, company: 1, email: 1, status: 1 }
    ).limit(parsedLimit);

    return successResponse(res, leads, 'Search results retrieved');
  } catch (error) {
    next(error);
  }
};
