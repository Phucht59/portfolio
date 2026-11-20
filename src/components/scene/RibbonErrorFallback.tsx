import { Component, type ReactNode } from "react";

type Props = {
  onFail: (error: Error) => void;
  children: ReactNode;
};

type State = { failed: boolean };

export class RibbonErrorFallback extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error): void {
    console.warn(
      "[PortfolioScene] WebGL ribbon failed; semantic content remains available.",
      error,
    );
    this.props.onFail(error);
  }

  render(): ReactNode {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
