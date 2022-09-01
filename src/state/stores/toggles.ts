import { atom } from 'nanostores';

export const isMenuVisible = atom(true);
export const isExtendedMenuVisible = atom(false);
export const isListVisible = atom(false);
export const currentView = atom<'Editor' | 'Markdown'>('Editor');

export const toggleMenuVisibility = () => isMenuVisible.set(!isMenuVisible.get());
export const toggleExtendedMenuVisibility = () =>
    isExtendedMenuVisible.set(!isExtendedMenuVisible.get());
export const toggleListVisibility = () => isListVisible.set(!isListVisible.get());
export const toggleCurrentView = () =>
    currentView.set(currentView.get() === 'Editor' ? 'Markdown' : 'Editor');

export const closeAll = () => {
    isExtendedMenuVisible.set(false);
    isListVisible.set(false);
};
