import './globals.css';
import type { Metadata } from 'next';
import { Sidebar } from 'components/sidebar';
import { ThemeProvider } from 'config/material-tailwind-theme-provider';
import ReactQueryClientProvider from 'config/ReactQueryClientProvider';

export const metadata: Metadata = {
  title: '카페 마스터즈',
  description: '개발중인 프로젝트입니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ReactQueryClientProvider>
          <ThemeProvider>
            <Sidebar />
            {children}
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
