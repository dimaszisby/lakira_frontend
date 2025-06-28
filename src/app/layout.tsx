import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Lakira - Your Personal Growth Tracker",
  description: "Track and monitor your progress seamlessly. Set goals, view trends, and stay motivated!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
