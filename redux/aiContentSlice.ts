import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { chatSession } from "@/utils/AiModal";
import { db } from "@/utils/db";
import { AIResponse } from "@/utils/schema";
import moment from "moment";
import { fetchHistoryData, setTotalHistoryText } from "./userSlice";

interface AiContentState {
  aiOutput: string;
  loading: boolean;
  error: string | null;
  historyData: string | null;
}

const initialState: AiContentState = {
  aiOutput: "",
  loading: false,
  error: null,
  historyData: null,
};

export const generateAiContent = createAsyncThunk(
  "aiContent/generateAiContent",
  async (
    { formData, selectedPrompt, slug, userEmail }: any,
    { dispatch, rejectWithValue },
  ) => {
    const finalPrompt = JSON.stringify(formData) + " ," + selectedPrompt;
    try {
      const result = await chatSession.sendMessage(finalPrompt);
      const aiResponse = await result?.response?.text();
      if (aiResponse !== "" && userEmail) {
        await db.insert(AIResponse).values({
          formData: JSON.stringify(formData),
          aiResponse: aiResponse,
          tamplateSlug: slug,
          createdBy: userEmail,
          createdAt: moment().format("YYYY-MM-DD"),
        });

        await dispatch(
          fetchHistoryData({
            userEmail,
            page: 1,
            limit: 10,
          }),
        );
        
        // Removed manual calculation as fetchHistoryData now updates state correctly
        // const updatedHistory = ...
        // const totalHistoryText = ...
        // dispatch(setTotalHistoryText(totalHistoryText));

        return aiResponse;
      }
      return aiResponse;
    } catch (error) {
      console.log("aicontent ", error);

      return rejectWithValue(error);
    }
  },
);

const aiContentSlice = createSlice({
  name: "aiContent",
  initialState,
  reducers: {
    setHistoryData: (state, action: PayloadAction<string>) => {
      state.aiOutput = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAiContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        generateAiContent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.aiOutput = action.payload;
          state.loading = false;
        },
      )
      .addCase(
        generateAiContent.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export default aiContentSlice.reducer;
