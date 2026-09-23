import { MotionConfig } from "motion/react";
import { BrowserRouter } from "react-router";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { Layout } from "@/components/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <SmoothScrollProvider>
          <Layout />
        </SmoothScrollProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
