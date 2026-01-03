"use client";
import { RootState } from "@/redux/store";
import { fetchUserSubscriptionData, fetchHistoryData } from "@/redux/userSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const UsageTrack: React.FC = () => {
  const { user } = useUser();
  const { data, loading, error, userSubscriptionDetails, totalHistoryText } = useAppSelector(
    (state: RootState) => state?.user,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    if (!data.length) {
      dispatch(
        fetchHistoryData({
          userEmail: user?.primaryEmailAddress?.emailAddress,
          page: 1,
          limit: 10,
        }),
      );
    }

    if (!userSubscriptionDetails?.length) {
      dispatch(
        fetchUserSubscriptionData(user?.primaryEmailAddress?.emailAddress),
      );
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  const currentCredit = totalHistoryText || 0;
  const maxCredit = useMemo(
    () =>
      userSubscriptionDetails && userSubscriptionDetails[0]?.active
        ? 1000000
        : 10000,
    [userSubscriptionDetails],
  );

  const creditPercentage = useMemo(
    () => (currentCredit / maxCredit) * 100,
    [currentCredit, maxCredit],
  );

  // GSAP animation ref
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate progress bar when creditPercentage changes
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${Math.min(creditPercentage || 0, 100)}%`,
        duration: 1.2,
        ease: "power2.out",
      });
    }
  }, [creditPercentage]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="mx-4 mb-6 mt-auto" ref={containerRef}>
      <div 
        className="rounded-2xl p-5 bg-pink-600"

      >
        {/* Credits Title */}
        <h3 className="text-2xl font-bold text-white mb-3">Credits</h3>
        
        {/* Credits Info Row */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-white">
            <span className="text-xs font-semibold">
              {loading && (!userSubscriptionDetails || userSubscriptionDetails.length === 0) && data?.length === 0 ? "..." : formatNumber(currentCredit)}
            </span>
            <span className="text-white/80 ml-1 text-xs">Words Used</span>
          </div>
          <div className="text-white">
            <span className="text-xs font-semibold">
              {formatNumber(maxCredit)}
            </span>
            <span className="text-white/80 ml-1 text-xs">Total</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full rounded-full bg-white/90 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full rounded-full bg-green-500"
            style={{ 
              width: "0%",
            }}
          ></div>
        </div>

        {/* Renewal Text */}
        <p className="text-white/90 mt-4 text-sm font-medium">
          {userSubscriptionDetails && userSubscriptionDetails[0]?.active 
            ? "Pro Plan Active" 
            : "Renews monthly"}
        </p>
      </div>

      {/* Upgrade Button */}
      <div className="mt-3 w-full">
        {userSubscriptionDetails && userSubscriptionDetails[0]?.active ? (
          <Button
            disabled={true}
            size="sm"
            variant="default"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold"
          >
            ✨ Pro User
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="default" 
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold"
          >
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
};

export default UsageTrack;
