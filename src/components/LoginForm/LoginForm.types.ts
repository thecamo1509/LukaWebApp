export interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
  showRegisterLink?: boolean;
  onboardingMode?: boolean;
  onBeforeSignIn?: () => Promise<void>;
}
