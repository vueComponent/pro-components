export interface AffixProps {
  offsetBottom: number;
  offsetTop: number;
  target?: () => HTMLElement;

  onChange?: (affixed: boolean) => void;
}
