"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TimelineMilestone {
  year: string
  title: string
  description: string
}

interface TimelineProps {
  milestones: TimelineMilestone[]
  visibleCount?: number
  onShowMore?: () => void
  showMoreText?: string
  showLessText?: string
}

export function Timeline({
  milestones,
  visibleCount,
  onShowMore,
  showMoreText = "Show All",
  showLessText = "Show Less",
}: TimelineProps) {
  const displayMilestones = visibleCount !== undefined ? milestones.slice(0, visibleCount) : milestones
  const showingAll = visibleCount !== undefined && visibleCount >= milestones.length

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 70%"],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Key Milestones
          </h2>
          <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            A journey of faith spanning five decades of ministry and service.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-amber-200 dark:bg-amber-900/40" />

          <motion.div
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 w-0.5 origin-top"
            style={{ scaleY: lineScaleY, height: "100%" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500" />
          </motion.div>

          <div className="space-y-12">
            {displayMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <motion.div
                    className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      className="text-3xl font-bold text-amber-700 dark:text-amber-400 block"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      {milestone.year}
                    </motion.span>
                    <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-2 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  className="hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full border-4 border-stone-100 dark:border-stone-800 z-10 flex-shrink-0"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: 0.25,
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  <span className="text-white font-bold text-sm">
                    {milestone.year.slice(-2)}
                  </span>
                </motion.div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {onShowMore && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={onShowMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
            >
              {showingAll ? (
                <>
                  {showLessText}
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {showMoreText}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
