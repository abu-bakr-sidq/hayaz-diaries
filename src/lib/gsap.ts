"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin, useGSAP };

/** Animations only run when the visitor hasn't asked for reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
