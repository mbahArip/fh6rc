import { motion } from "motion/react";
import type * as React from "react";
import SVG from "~/assets/logo.svg";
import { APP_NAME } from "~/constant";

export function Logo(
  props: Omit<React.ComponentProps<typeof motion.img>, "src">,
) {
  return <motion.img src={SVG} alt={`${APP_NAME} Logo`} {...props} />;
}
