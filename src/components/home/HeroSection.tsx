"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
    return (
        <Link
            href="/collections/all"
            className="block relative w-full overflow-hidden h-[65vh] min-h-[400px] md:h-[85vh] md:min-h-[500px] group cursor-pointer"
        >
            {/* Background image */}
            <Image
                src="/images/hero-new.jpg"
                alt="RALYS Collection Urban Ghost"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                style={{ objectPosition: "center 30%" }}
                priority
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Content — bottom-left */}
            <div
                className="absolute inset-0 flex flex-col justify-end px-6 pb-10 md:px-[50px] md:pb-[60px]"
            >
                {/* Collection tag */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-white/70 uppercase text-[12px] tracking-[0.3em] font-light mb-3"
                >
                    Early Spring 2026
                </motion.p>

                {/* Main title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-white uppercase text-[2rem] md:text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[0.08em] leading-[1.1] mb-[10px]"
                >
                    New Season Drop
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="text-white/60 uppercase text-[13px] tracking-[0.2em] font-light md:mb-7"
                >
                    10% Off · Limited Time
                </motion.p>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={20} strokeWidth={1} className="text-white/50" />
                </motion.div>
            </motion.div>
        </Link>
    );
}
