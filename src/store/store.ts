import { create } from "zustand";

type AuthFlowState = {
  email: string;
  otp: string;
  token: string;

  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setToken: (token: string) => void;
  reset: () => void;
};

export const useForgetPassStore = create<AuthFlowState>((set, get) => ({
  email: "",
  otp: "",
  token: "",

  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
  setToken: (token) => set({ token }),

  reset: () =>
    set({
      email: "",
      otp: "",
      token: "",
    }),
}));

type RegUserState = {
  email: string;
  isOtpPass: boolean;

  setEmail: (email: string) => void;
  setOtpPass: (otp: boolean) => void;
  reset: () => void;
};

export const useRegUserStore = create<RegUserState>((set, get) => ({
  email: "",
  isOtpPass: false,
  setEmail: (email) => set({ email }),
  setOtpPass: (otp) => set({ isOtpPass: otp }),

  reset: () =>
    set({
      email: "",
      isOtpPass: false,
    }),
}));

interface StepStore {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  memberID: string;
  isUpdateMode: boolean;
  setMemberID: (memberID: string) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepCompleted: (step: number) => void;
  resetSteps: () => void;
  setIsUpdateMode: (value: boolean) => void;
}

export const useAddMemberStore = create<StepStore>((set, get) => ({
  currentStep: 0,
  completedSteps: [],
  totalSteps: 12,
  memberID: "",
  isUpdateMode: false,

  setMemberID: (memberID: string) => set({ memberID }),
  setIsUpdateMode: (value: boolean) => set({ isUpdateMode: value }),

  setCurrentStep: (step: number) => {
    const { totalSteps } = get();
    if (step >= 0 && step < totalSteps) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  markStepCompleted: (step: number) => {
    const { completedSteps } = get();
    if (!completedSteps.includes(step)) {
      set({ completedSteps: [...completedSteps, step] });
    }
  },

  resetSteps: () => {
    set({ currentStep: 0, completedSteps: [] });
  },
}));
