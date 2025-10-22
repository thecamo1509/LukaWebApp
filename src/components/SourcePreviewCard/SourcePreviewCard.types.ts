import type {
  SourceSubtype,
  SourceType,
} from "@/store/useOnboardingStore.types";

export interface SourcePreviewCardProps {
  name: string;
  type: SourceType;
  subtype: SourceSubtype;
  balance: number;
  color: string;
  sourceNumber: string;
  userName?: string;
}
