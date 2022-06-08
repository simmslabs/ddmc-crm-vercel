import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import ant_css from "antd/dist/antd.css";
import styles_css from "~/styles/app.css";
import { RecoilRoot } from "recoil";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "CRM",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => ([
  {
    rel: "stylesheet",
    href: ant_css
  },
  {
    rel: "stylesheet",
    href: styles_css
  },
  {
    rel: "stylesheet",
    href: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css"
  }
]);

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <RecoilRoot>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </RecoilRoot>
      </body>
    </html>
  );
}
