"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
}

interface ButtonAsLink extends BaseProps {
  href: string;
  onClick?: undefined;
}

type PrimaryButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "flex w-full items-center justify-center rounded-full py-4 text-[15px] font-semibold transition-transform active:translate-y-[2px] active:shadow-none";

const enabled = "bg-accent text-on-accent shadow-edge-accent cursor-pointer";
const disabledClasses =
  "bg-surface text-on-accent shadow-none cursor-not-allowed";

export default function PrimaryButton(props: PrimaryButtonProps) {
  const classes = [base, props.disabled ? disabledClasses : enabled, props.className ?? ""].join(" ");

  if ("href" in props && props.href) {
    if (props.disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {props.children}
        </span>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className={classes}
    >
      {buttonProps.children}
    </button>
  );
}
