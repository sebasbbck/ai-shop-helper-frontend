import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ReferralScreen from "@/features/referrals/ReferralScreen";

export default function ReferralsPage() {
  return (
    <Suspense fallback={<CircularProgress sx={{ m: 4 }} />}>
      <ReferralScreen />
    </Suspense>
  );
}
