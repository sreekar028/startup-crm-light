/**
 * Sample leads data used as fallback when no real API data is available.
 * Rich dataset with realistic Indian startup deal values, spread across last 6 months.
 */
const now = new Date();
const mo = (offset, day = 10) => {
  const d = new Date(now.getFullYear(), now.getMonth() + offset, day);
  return d.toISOString();
};

export const sampleLeads = [
  // ── Won deals ────────────────────────────────────────────────────────────────
  {
    id: 'lead-1', name: 'Amit Sharma', company: 'Tata Consultancy Services',
    email: 'amit.sharma@tcs.com', phone: '+91 98765 43210',
    status: 'Won', source: 'Referral', value: 185000, owner: 'Sarah',
    createdAt: mo(-5, 5), contactedAt: mo(-5, 8), meetingAt: mo(-5, 14),
    proposalAt: mo(-5, 18), wonAt: mo(-5, 25),
  },
  {
    id: 'lead-2', name: 'Karan Mehta', company: 'Paytm',
    email: 'karan.mehta@paytm.com', phone: '+91 90123 45678',
    status: 'Won', source: 'LinkedIn', value: 240000, owner: 'Sarah',
    createdAt: mo(-4, 3), contactedAt: mo(-4, 6), meetingAt: mo(-4, 10),
    proposalAt: mo(-4, 15), wonAt: mo(-4, 22),
  },
  {
    id: 'lead-3', name: 'Rahul Verma', company: 'Swiggy',
    email: 'rahul.verma@swiggy.com', phone: '+91 70123 45678',
    status: 'Won', source: 'Website', value: 130000, owner: 'David',
    createdAt: mo(-3, 2), contactedAt: mo(-3, 5), meetingAt: mo(-3, 9),
    proposalAt: mo(-3, 14), wonAt: mo(-3, 20),
  },
  {
    id: 'lead-4', name: 'Arjun Kapoor', company: "BYJU'S",
    email: 'arjun.kapoor@byjus.com', phone: '+91 91234 09876',
    status: 'Won', source: 'Referral', value: 95000, owner: 'Alex',
    createdAt: mo(-3, 8), contactedAt: mo(-3, 11), meetingAt: mo(-3, 16),
    proposalAt: mo(-3, 21), wonAt: mo(-3, 28),
  },
  {
    id: 'lead-5', name: 'Neha Kulkarni', company: 'MakeMyTrip',
    email: 'neha.k@mmt.com', phone: '+91 88901 23456',
    status: 'Won', source: 'LinkedIn', value: 175000, owner: 'Sarah',
    createdAt: mo(-2, 4), contactedAt: mo(-2, 7), meetingAt: mo(-2, 12),
    proposalAt: mo(-2, 18), wonAt: mo(-2, 26),
  },
  {
    id: 'lead-6', name: 'Aditya Rao', company: 'Zepto',
    email: 'aditya.rao@zepto.com', phone: '+91 97654 32109',
    status: 'Won', source: 'Cold Call', value: 88000, owner: 'David',
    createdAt: mo(-1, 5), contactedAt: mo(-1, 8), meetingAt: mo(-1, 13),
    proposalAt: mo(-1, 18), wonAt: mo(-1, 24),
  },
  {
    id: 'lead-7', name: 'Pooja Iyer', company: 'Groww',
    email: 'pooja.iyer@groww.in', phone: '+91 86543 21098',
    status: 'Won', source: 'Website', value: 210000, owner: 'Alex',
    createdAt: mo(-1, 9), contactedAt: mo(-1, 12), meetingAt: mo(-1, 17),
    proposalAt: mo(-1, 22), wonAt: mo(-1, 28),
  },

  // ── Active pipeline ───────────────────────────────────────────────────────────
  {
    id: 'lead-8', name: 'Priya Patel', company: 'Reliance Industries',
    email: 'priya.patel@ril.com', phone: '+91 98234 56789',
    status: 'Proposal Sent', source: 'Website', value: 320000, owner: 'Alex',
    createdAt: mo(-1, 15), contactedAt: mo(-1, 18), meetingAt: mo(-1, 23),
    proposalAt: mo(0, 2),
  },
  {
    id: 'lead-9', name: 'Divya Nair', company: 'Flipkart',
    email: 'divya.nair@flipkart.com', phone: '+91 80987 65432',
    status: 'Proposal Sent', source: 'Referral', value: 145000, owner: 'Sarah',
    createdAt: mo(-1, 20), contactedAt: mo(-1, 23), meetingAt: mo(0, 2),
    proposalAt: mo(0, 7),
  },
  {
    id: 'lead-10', name: 'Sneha Reddy', company: 'Wipro',
    email: 'sneha.reddy@wipro.com', phone: '+91 88776 65544',
    status: 'Meeting Scheduled', source: 'Cold Call', value: 165000, owner: 'David',
    createdAt: mo(0, 2), contactedAt: mo(0, 5), meetingAt: mo(0, 9),
  },
  {
    id: 'lead-11', name: 'Vikram Singh', company: 'HDFC Bank',
    email: 'vikram.singh@hdfc.com', phone: '+91 77665 54433',
    status: 'Meeting Scheduled', source: 'Email Campaign', value: 290000, owner: 'Alex',
    createdAt: mo(0, 4), contactedAt: mo(0, 7), meetingAt: mo(0, 11),
  },
  {
    id: 'lead-12', name: 'Meera Joshi', company: 'Ola',
    email: 'meera.joshi@ola.com', phone: '+91 60987 65432',
    status: 'Contacted', source: 'LinkedIn', value: 78000, owner: 'Sarah',
    createdAt: mo(0, 6), contactedAt: mo(0, 9),
  },
  {
    id: 'lead-13', name: 'Rajan Kapoor', company: 'PhonePe',
    email: 'rajan.k@phonepe.com', phone: '+91 93456 78901',
    status: 'Contacted', source: 'Website', value: 115000, owner: 'David',
    createdAt: mo(0, 7), contactedAt: mo(0, 10),
  },
  {
    id: 'lead-14', name: 'Sanya Malhotra', company: 'Dunzo',
    email: 'sanya.m@dunzo.com', phone: '+91 84321 09876',
    status: 'New', source: 'Referral', value: 55000, owner: 'Alex',
    createdAt: mo(0, 10),
  },
  {
    id: 'lead-15', name: 'Rohan Das', company: 'Infosys',
    email: 'rohan.das@infosys.com', phone: '+91 91234 56789',
    status: 'New', source: 'Email Campaign', value: 200000, owner: 'Sarah',
    createdAt: mo(0, 11),
  },
  {
    id: 'lead-16', name: 'Tanvi Bhatt', company: 'Urban Company',
    email: 'tanvi.b@urbancompany.com', phone: '+91 85432 10987',
    status: 'New', source: 'LinkedIn', value: 67000, owner: 'David',
    createdAt: mo(0, 12),
  },

  // ── Lost deals ────────────────────────────────────────────────────────────────
  {
    id: 'lead-17', name: 'Ananya Sen', company: 'Zomato',
    email: 'ananya.sen@zomato.com', phone: '+91 99887 76655',
    status: 'Lost', source: 'Other', value: 48000, owner: 'David',
    createdAt: mo(-4, 12), contactedAt: mo(-4, 15),
  },
  {
    id: 'lead-18', name: 'Shruti Agarwal', company: 'Nykaa',
    email: 'shruti.agarwal@nykaa.com', phone: '+91 82345 67890',
    status: 'Lost', source: 'Cold Call', value: 35000, owner: 'Alex',
    createdAt: mo(-3, 16), contactedAt: mo(-3, 19), meetingAt: mo(-3, 24),
  },
  {
    id: 'lead-19', name: 'Mohan Yadav', company: 'Snapdeal',
    email: 'mohan.y@snapdeal.com', phone: '+91 75432 18765',
    status: 'Lost', source: 'Website', value: 62000, owner: 'Sarah',
    createdAt: mo(-2, 18), contactedAt: mo(-2, 21),
  },
];
