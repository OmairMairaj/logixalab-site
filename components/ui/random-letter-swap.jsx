"use client";

import { useMemo, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import debounce from "lodash/debounce";

function deterministicShuffle(length, seedText) {
  const indices = Array.from({ length }, (_, i) => i);
  let seed = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }

  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

export function RandomLetterSwapForward({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}) {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);

  const mergeTransition = (t, i) => ({
    ...t,
    delay: i * staggerDuration,
  });

  const shuffledIndices = useMemo(
    () => deterministicShuffle(label.length, `forward:${label}`),
    [label],
  );

  const hoverStart = debounce(
    () => {
      if (blocked) return;
      setBlocked(true);

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i];
        animate(
          `.letter-${randomIndex}`,
          { y: reverse ? "100%" : "-100%" },
          mergeTransition(transition, i),
        ).then(() => {
          animate(
            `.letter-${randomIndex}`,
            { y: 0 },
            { duration: 0 },
          );
        });

        animate(
          `.letter-secondary-${randomIndex}`,
          { top: "0%" },
          mergeTransition(transition, i),
        )
          .then(() => {
            animate(
              `.letter-secondary-${randomIndex}`,
              { top: reverse ? "-100%" : "100%" },
              { duration: 0 },
            );
          })
          .then(() => {
            if (i === label.length - 1) {
              setBlocked(false);
            }
          });
      }
    },
    100,
    { leading: true, trailing: true },
  );

  return (
    <motion.span
      className={`inline-flex items-baseline justify-center relative overflow-hidden ${className ?? ""}`}
      onHoverStart={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter, i) => (
        <span
          className="relative flex overflow-hidden whitespace-pre"
          style={{ minHeight: "1.15em" }}
          key={i}
        >
          <motion.span className={`relative pb-0.5 letter-${i}`} style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className={`absolute letter-secondary-${i}`}
            aria-hidden
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function RandomLetterSwapPingPong({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.8,
  },
  staggerDuration = 0.02,
  className,
  onClick,
  ...props
}) {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);

  const mergeTransition = (t, i) => ({
    ...t,
    delay: i * staggerDuration,
  });

  const shuffledIndices = useMemo(
    () => deterministicShuffle(label.length, `pingpong:${label}`),
    [label],
  );

  const hoverStart = debounce(
    () => {
      if (blocked) return;
      setBlocked(true);

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i];
        animate(
          `.letter-${randomIndex}`,
          { y: reverse ? "100%" : "-100%" },
          mergeTransition(transition, i),
        );

        animate(
          `.letter-secondary-${randomIndex}`,
          { top: "0%" },
          mergeTransition(transition, i),
        );
      }
    },
    100,
    { leading: true, trailing: true },
  );

  const hoverEnd = debounce(
    () => {
      setBlocked(false);

      for (let i = 0; i < label.length; i++) {
        const randomIndex = shuffledIndices[i];
        animate(
          `.letter-${randomIndex}`,
          { y: 0 },
          mergeTransition(transition, i),
        );

        animate(
          `.letter-secondary-${randomIndex}`,
          { top: reverse ? "-100%" : "100%" },
          mergeTransition(transition, i),
        );
      }
    },
    100,
    { leading: true, trailing: true },
  );

  return (
    <motion.span
      className={`inline-flex items-baseline justify-center relative overflow-hidden ${className ?? ""}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter, i) => (
        <span
          className="relative flex overflow-hidden whitespace-pre"
          style={{ minHeight: "1.15em" }}
          key={i}
        >
          <motion.span className={`relative pb-0.5 letter-${i}`} style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className={`absolute letter-secondary-${i}`}
            aria-hidden
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
