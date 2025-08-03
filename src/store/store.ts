import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  setUsername: (newUsername: string) => void;
  clearUsername: () => void;
}

export const useStore = create<User>()(
  persist(
    (set, _get, api) => ({
      username: "",
      setUsername: (newUsername) => set({ username: newUsername }),
      clearUsername: () => {
        // Clear the state
        set({ username: "" });
        // Remove the persisted data from localStorage
        api.persist.clearStorage();
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export const clear = () => {
  useStore.persist.clearStorage();
  useStore.getState().clearUsername();
};

interface RegUser {
  step: number;
  email: string;
  otp: string;
  userInfo: {
    name: string;
    password: string;
  };
  error: string;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setUserInfo: (userInfo: { name: string; password: string }) => void;
  setError: (error: string) => void;
  nextStep: (state: any) => void;
  prevStep: (state: any) => void;
}

export const useFormStore = create<RegUser>()((set) => ({
  step: 1,
  email: "",
  otp: "",
  userInfo: { name: "", password: "" },
  error: "",
  setEmail: (email) => set({ email }),
  setOtp: (otp) => set({ otp }),
  setUserInfo: (userInfo) => set({}),
  setError: (error) => set({ error }),
  nextStep: () => set((state: any) => ({ step: state.step + 1 })),
  prevStep: () => set((state: any) => ({ step: state.step - 1 })),
}));

// type FormState = {
//   contactType: string;
//   contactNumber: string;
//   isPrimary: boolean;
// };

interface AddMember {
  // forms: FormState[];
  // addForm: ()=> void;
  // updateForm: (index:number, field: keyof FormState, value: string | boolean) => void;
  // submitForms: () => void;
  step: number;
  error: string;
  setError: (error: string) => void;
  nextStep: (state: any) => void;
  prevStep: (state: any) => void;
}

// export const useMemberStore = create<AddMember>()(
//   persist((set, get)=>({
//     forms: [{ contactType: '', contactNumber: '', isPrimary: false }],
//     addForm: () => set((state)=>({forms: [...state.forms, { contactType: '', contactNumber: '', isPrimary: false }]})),
//     updateForm: (index, field, value)=>set((state)=>({
//       forms: state.forms.map((form, i)=> i === index ? {...form, [field]: value}: form)
//     })),
//     step: 1,
//   error: '',
//   setError: (error)=> set({error}),
//   nextStep: () => set((state:any) => ({ step: state.step + 1 })),
//   prevStep: () => set((state:any) => ({ step: state.step - 1 })),
//   }), {name: 'member-storage'})
//   //   {
//   //   }
//   )

export const useMemberStore = create<AddMember>()(
  persist(
    (set, get) => ({
      step: 1,
      error: "",
      setError: (error: string) => set((state) => ({ error })),
      nextStep: () => set((state) => ({ step: state.step + 1 })), // Increment step
      prevStep: () => set((state) => ({ step: state.step - 1 })),
    }),
    { name: "member-store", partialize: (state) => ({ step: state.step }) }
  )
);

interface AddForgetToken {
  token: string;
  setToken: (token: string) => void;
}
export const useForgetTokenStore = create<AddForgetToken>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token: string) => set({ token }),
    }),
    { name: "forget-token-store" }
  )
);

//=======================================================================

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
  currentStep: number
  completedSteps: number[]
  totalSteps: number
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  markStepCompleted: (step: number) => void
  resetSteps: () => void
}

export const useStepStore = create<StepStore>((set, get) => ({
  currentStep: 0,
  completedSteps: [],
  totalSteps: 11,

  setCurrentStep: (step: number) => {
    const { totalSteps } = get()
    if (step >= 0 && step < totalSteps) {
      set({ currentStep: step })
    }
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },

  markStepCompleted: (step: number) => {
    const { completedSteps } = get()
    if (!completedSteps.includes(step)) {
      set({ completedSteps: [...completedSteps, step] })
    }
  },

  resetSteps: () => {
    set({ currentStep: 0, completedSteps: [] })
  },
}))
