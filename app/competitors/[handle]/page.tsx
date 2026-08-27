import { ReelRadarApp } from "../../reelradar-app";

export default async function CompetitorPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ReelRadarApp initialView="analysis" initialHandle={handle} />;
}
