import type { ImgHTMLAttributes } from "react";
import python from "../assets/brand/python.svg";
import pytorch from "../assets/brand/pytorch.svg";
import postgresql from "../assets/brand/postgresql.svg";
import react from "../assets/brand/react.svg";
import sqlite from "../assets/brand/sqlite.svg";
import flask from "../assets/brand/flask.svg";
import opencv from "../assets/brand/opencv.svg";
import scikitlearn from "../assets/brand/scikitlearn.svg";
import streamlit from "../assets/brand/streamlit.svg";
import dotnet from "../assets/brand/dotnet.svg";

const MARKS: Record<string, string> = {
  Python: python,
  PyTorch: pytorch,
  PostgreSQL: postgresql,
  React: react,
  "React 19": react,
  SQLite: sqlite,
  Flask: flask,
  OpenCV: opencv,
  "scikit-learn": scikitlearn,
  Streamlit: streamlit,
  ".NET": dotnet,
  ".NET 8": dotnet,
  "ASP.NET Core": dotnet,
};

type BrandMarkProps = {
  name: string;
  decorative?: boolean;
} & ImgHTMLAttributes<HTMLImageElement>;

// Kept public for the stack-pill renderer and content validation.
// eslint-disable-next-line react-refresh/only-export-components
export function hasBrandMark(name: string): boolean {
  return Boolean(MARKS[name]);
}

export function BrandMark({
  name,
  decorative = true,
  ...rest
}: BrandMarkProps) {
  const src = MARKS[name];
  if (!src) return <span className="brand-text">{name}</span>;
  return (
    <img
      src={src}
      alt={decorative ? "" : name}
      width={24}
      height={24}
      {...rest}
    />
  );
}

export function StackPills({ items }: { items: string[] }) {
  return (
    <ul className="stack-list">
      {items.map((item) => (
        <li key={item} className="stack-pill">
          {hasBrandMark(item) ? <BrandMark name={item} /> : null}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
