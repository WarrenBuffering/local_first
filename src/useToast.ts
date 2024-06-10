import {create} from 'zustand';

import type {ToastProps} from './components/Toast';
import {Status} from './enums';

type ToastOptions = Partial<Omit<ToastState, 'show' | 'isVisible'>>;
type WithStatusToastOptions = Partial<Omit<ToastOptions, 'status'>>;

type ToastActions = {
  hide(): void;
  onHide(): void;
  show(title: string, options?: ToastOptions): void;
  showError(title: string, options?: WithStatusToastOptions): void;
  showSuccess(title: string, options?: WithStatusToastOptions): void;
};

export type ToastState = ToastProps & ToastActions;

export const initialState: ToastProps = {
  actionText: '',
  animatedBottomOffset: undefined,
  animationDuration: undefined,
  description: '',
  isVisible: false,
  onAnimateInBegin: undefined,
  onAnimateInEnd: undefined,
  onAnimateOutBegin: undefined,
  onAnimateOutEnd: undefined,
  onPress: undefined,
  pauseDuration: undefined,
  status: Status.ERROR,
  themeOverride: undefined,
  title: '',
};

// Create Zustand store
export const useToast = create<ToastState>((set, get) => ({
  ...initialState,
  onHide: () => set(initialState),
  show: (title, options) => {
    let pauseDuration: number | undefined;
    if (!!options?.actionText && !!options.onActionPress) {
      pauseDuration = 5000;
    }

    set({
      title,
      ...options,
      pauseDuration,
      isVisible: true,
      onAnimateOutEnd: get().onHide,
    });
  },
  showError: (title, options) =>
    get().show(title, {...options, status: Status.ERROR}),
  showSuccess: (title, options) =>
    get().show(title, {...options, status: Status.SUCCESS}),
  hide: () => set(initialState),
}));
