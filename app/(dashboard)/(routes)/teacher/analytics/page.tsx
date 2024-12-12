import { getAnalytics } from "@/actions/get-analytics";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { redirect } from "next/navigation";
import { Chart } from "./_components/chart";
import { DataCard } from "./_components/data-card";

const AnalyticsPage = async () => {
  const { userId } = await getServerUserSession();

  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  console.log("analytics", { data, totalRevenue, totalSales });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
