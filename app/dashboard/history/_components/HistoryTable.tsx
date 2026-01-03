"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import Loading from "../../loading";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/redux/store";
import { calculateTotalHistory, fetchHistoryData } from "@/redux/userSlice";
import { useSelector } from "react-redux";

function calculateTotalPages(total: number, limit: number): number {
  if (limit <= 0 || total <= 0) return 1;
  return Math.floor((total - 1) / limit) + 1;
}

function HistoryTable() {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const limit = 8;
  const dispatch = useAppDispatch();
  
  const { data, loading, totalHistoryText, totalHistoryNo, total } =
    useAppSelector((state: RootState) => state.user);

  const totalPages = useMemo(() => {
    return calculateTotalPages(total, limit)
  },[total, limit])

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      dispatch(
        fetchHistoryData({
          userEmail: user.primaryEmailAddress.emailAddress,
          page,
          limit,
        }),
      );
    } else {
      console.error("User email is not available");
    }

    return;
  }, [user?.primaryEmailAddress?.emailAddress, page]);

  // useEffect(() => {
  //   dispatch(calculateTotalHistory(data));
  // }, [data, dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="remove-scrollbar h-full overflow-y-auto bg-white p-4 dark:bg-slate-900 sm:p-6 lg:p-8">
      {/* Header */}
      <h2 className="mb-6 text-base font-semibold dark:text-white sm:text-lg md:text-xl lg:text-2xl">
        No of History ({totalHistoryNo})
      </h2>

      {/* Table wrapper for horizontal scroll on mobile */}
      <div className="mb-6 overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Template</TableHead>
                <TableHead className="min-w-[200px] font-semibold sm:min-w-[300px]">
                  AI Response
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold">
                  Date
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold">
                  Words Count
                </TableHead>
                <TableHead className="whitespace-nowrap font-semibold">
                  Copy
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="line-clamp-2 max-w-[150px] sm:max-w-none">
                      {item?.tamplateSlug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{item?.aiResponse}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item?.createdAt}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {item?.aiResponse?.trim().split(/\s+/).length || 0}
                  </TableCell>
                  <TableCell>
                    <Button variant="bgColor" size="sm">
                      Copy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Total Words Count
                </TableCell>
                <TableCell className="text-center font-bold">
                  {totalHistoryText}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          variant="outline"
          size="default"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>

        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="default"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default HistoryTable;
