import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/utils/db";
import { AIResponse, UserSubscription } from "@/utils/schema";

interface HISTORY {
  id: number;
  formData: string;
  aiResponse: string | null;
  tamplateSlug: string;
  createdBy: string | null;
  createdAt: string | null;
}

interface USER_SUBSCRIPTION {
  id: number;
  email: string;
  username: string | null;
  active: boolean;
  paymentId: string | null;
  joinDate: string | null;
}

interface DataState {
  data: HISTORY[];
  totalHistoryText: number;
  totalHistoryNo: number;
  userSubscriptionDetails: USER_SUBSCRIPTION[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  word_count: number;
}

function calculateTotal(data: HISTORY[]): number {
  return data.reduce((acc, e) => acc + (e.aiResponse?.length || 0), 0);
}

export const fetchHistoryData = createAsyncThunk(
  "data/fetchHistoryData",
  async (
    {
      userEmail,
      page,
      limit,
    }: { userEmail: string; page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      const offset = (page - 1) * limit;

      const results: HISTORY[] = await db
        .select()
        .from(AIResponse)
        .where(eq(AIResponse.createdBy, userEmail))
        .orderBy(desc(AIResponse.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(AIResponse)
        .where(eq(AIResponse.createdBy, userEmail));

      const [{ totalUsage }] = await db
        .select({ totalUsage: sql<number>`sum(array_length(regexp_split_to_array(${AIResponse.aiResponse}, '\\s+'), 1))` })
        .from(AIResponse)
        .where(eq(AIResponse.createdBy, userEmail));

      return {
        results,
        total: count,
        totalUsage: totalUsage,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const fetchUserSubscriptionData = createAsyncThunk(
  "data/fetchUserSubscriptionData",
  async (userEmail: string, { rejectWithValue }) => {
    try {
      // @ts-ignore
      const results: USER_SUBSCRIPTION[] = await db
        .select()
        .from(UserSubscription)
        .where(eq(UserSubscription?.email, userEmail));

      return results;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

const initialState: DataState = {
  data: [],
  totalHistoryText: 0,
  totalHistoryNo: 0,
  loading: false,
  error: null,
  userSubscriptionDetails: null,
  page: 1,
  limit: 10,
  total: 0,
  word_count: 0,
};

const userSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setTotalHistoryText(state, action: PayloadAction<number>) {
      state.totalHistoryText = action.payload;
    },
    calculateTotalHistory(state, action: PayloadAction<HISTORY[]>) {
      // This reducer might be deprecated if we move to server-side calc, 
      // but keeping it for now if used elsewhere. 
      // Ideally we shouldn't use it to overwrite true server totals.
      state.totalHistoryText = calculateTotal(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoryData.fulfilled, (state, action) => {
        state.data = action.payload.results;
        state.loading = false;
        // Update totals based on server response (GLOBAL totals)
        state.totalHistoryNo = action.payload.total; 
        state.totalHistoryText = action.payload.totalUsage || 0;
        state.total = action.payload.total;
      })
      .addCase(fetchHistoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserSubscriptionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptionData.fulfilled, (state, action) => {
        state.userSubscriptionDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserSubscriptionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTotalHistoryText, calculateTotalHistory } = userSlice.actions;
export default userSlice.reducer;
