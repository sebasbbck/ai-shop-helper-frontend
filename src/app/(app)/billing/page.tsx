import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import BillingScreen from "@/features/billing/BillingScreen";

export default function BillingPage() {
  return (
    <Suspense fallback={<CircularProgress sx={{ m: 4 }} />}>
      <BillingScreen />
    </Suspense>
  );
}
