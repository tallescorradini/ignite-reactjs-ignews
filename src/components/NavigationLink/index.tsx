import Link from "next/link";
import { useRouter } from "next/router";
import { cloneElement } from "react";

export function NavigationLink({ children, href, activeClassName, ...rest }) {
  const { asPath } = useRouter();

  const className = asPath === href ? activeClassName : "";

  return (
    <Link href={href} {...rest}>
      {cloneElement(children, { className })}
    </Link>
  );
}
