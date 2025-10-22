export type StrategyType =
  | "recommended"
  | "conservative"
  | "saver"
  | "investor";

export interface StrategyCardProps {
  type: StrategyType;
  title: string;
  icon: React.ReactNode;
  allocation: string;
  isRecommended?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  fullHeight?: boolean;
}
