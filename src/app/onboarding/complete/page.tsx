import { actionCompleteAfterAuth } from "@/actions/onboarding/complete-after-auth";

export default async function CompleteOnboardingPage() {
  // Call the Server Action to complete onboarding
  // This will handle authentication check, data processing, cookie cleanup, and redirect
  await actionCompleteAfterAuth();

  // This line will never be reached due to redirect() in the action
  return null;
}
