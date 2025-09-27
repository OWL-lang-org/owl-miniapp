import clsx from 'clsx';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * This component is a simple page layout component to help with design consistency
 * Modified for better miniapp compatibility - no height restrictions, full scrollability
 */
export const Page = (props: { children: ReactNode; className?: string }) => {
  return (
    <div className={twMerge(clsx('flex min-h-screen flex-col w-full overflow-y-auto', props.className))}>
      {props.children}
    </div>
  );
};

const Header = (props: { children: ReactNode; className?: string }) => {
  return (
    <header
      className={twMerge(
        'bg-white flex flex-col justify-center px-6 pt-6 pb-3 z-10',
        clsx(props.className),
      )}
    >
      {props.children}
    </header>
  );
};

const Main = (props: { children: ReactNode; className?: string }) => {
  return (
    <main
      className={twMerge(
        clsx('flex-1 p-6 pt-3 pb-8 min-h-0', props.className),
      )}
    >
      {props.children}
    </main>
  );
};

const Footer = (props: { children: ReactNode; className?: string }) => {
  return (
    <footer className={twMerge('px-6 pb-[35px]', clsx(props.className))}>
      {props.children}
    </footer>
  );
};

Page.Header = Header;
Page.Main = Main;
Page.Footer = Footer;
