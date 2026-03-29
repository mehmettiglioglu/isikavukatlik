"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay: i * 0.08 },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function MotionDiv({ children, ...props }: MotionDivProps) {
  return <motion.div {...props}>{children}</motion.div>;
}

export function MotionSection({ children, ...props }: MotionDivProps) {
  return <motion.section {...props}>{children}</motion.section>;
}

export function MotionLi({ children, ...props }: HTMLMotionProps<"li"> & { children: React.ReactNode }) {
  return <motion.li {...props}>{children}</motion.li>;
}

export function MotionH1({ children, ...props }: HTMLMotionProps<"h1"> & { children: React.ReactNode }) {
  return <motion.h1 {...props}>{children}</motion.h1>;
}

export function MotionP({ children, ...props }: HTMLMotionProps<"p"> & { children: React.ReactNode }) {
  return <motion.p {...props}>{children}</motion.p>;
}
