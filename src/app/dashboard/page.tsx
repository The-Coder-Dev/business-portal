import { getSession } from "@/lib/auth/session";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EmptyBusinessState } from "@/components/dashboard/empty-business-state";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const userBusinesses = await db
    .select()
    .from(businesses)
    .where(eq(businesses.ownerId, session.user.id));

  const hasBusiness = userBusinesses.length > 0;
  const pendingBusiness = userBusinesses.find(b => b.status === "pending_review" || b.status === "draft");
  const approvedBusiness = userBusinesses.find(b => b.status === "active");

  if (!hasBusiness) {
    return <EmptyBusinessState userName={session.user.name} />;
  }

  if (pendingBusiness && !approvedBusiness) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Registration Pending</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Your business <strong>{pendingBusiness.name}</strong> has been submitted and is currently under review by our staff. You will be notified once it is approved.
        </p>
      </div>
    );
  }

  // Fallback for when we haven't implemented the owner dashboard
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to your Dashboard</h2>
      <p className="text-muted-foreground mb-8 text-lg">
        The Business Owner Dashboard is currently under construction. Please check back later.
      </p>
    </div>
  );
}
