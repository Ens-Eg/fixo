"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import {
  Coffee,
  Users,
  LineChart,
  CheckCircle2,
} from "@/components/icons/Icons";

interface Tab {
  id: number;
  titleAr: string;
  titleEn: string;
  labelAr: string;
  labelEn: string;
  icon: React.FC<{ size?: number; className?: string }>;
  textAr: string;
  textEn: string;
  image: string;
  textAltAr?: string;
  textAltEn?: string;
}

export const UsageShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const locale = useLocale();
  const isRTL = locale === "ar";

  const tabs: Tab[] = [
    {
      id: 0,
      titleAr: "أنشئ المنيو الخاص بك في دقائق",
      titleEn: "Create your menu in minutes",
      labelAr: "سهولة وتحكم",
      labelEn: "Easy and Control",
      icon: Coffee,
      textAr:
        "أنشئ منيو إلكتروني احترافي لمطعمك أو كافيهك خلال دقائق بدون أي تعقيد لوحة تحكم بسيطة تتيح لك إضافة الأصناف والصور والأسعار بكل سهولة تحكم كامل في المنيو وحدّثه في أي وقت ليكون جاهزًا دائمًا لعملائك",
      textEn:
        "Create a professional electronic menu for your restaurant or cafe in minutes without any complexity. A simple control panel that allows you to add items, images, and prices easily. Full control over the menu and update it anytime to be always ready for your customers.",
      image: "/images/temp/1sst.jpg",
      textAltAr: "يزيد المبيعات ويُحسن تجربة العملاء",
      textAltEn: "Increases sales and improves customer experience",
    },
    {
      id: 1,
      titleAr: "تحكم كامل واحصائيات متكاملة ",
      titleEn: "Full control and integrated statistics",
      labelAr: "بسهولة وترتيب",
      labelEn: "Easy and Order",
      icon: Users,
      textAr:
        "تحكم كامل وسهل في إضافة القوائم وتعديلها من لوحة تحكم بسيطة ومرنة تتيح لك إدارة كل تفاصيل المنيو بسهولة ومشاهدة إحصائيات كاملة تساعدك على فهم أداء الأصناف وتحسين قراراتك لزيادة المبيعات وتطوير عملك",
      textEn:
        "Full control and easy to add and edit menus from a simple and flexible control panel that allows you to manage all details of the menu easily and view complete statistics that help you understand the performance of the items and improve your decisions to increase sales and develop your business",
      image: "/images/temp/2nd.jpg",
      textAltAr: "لا يحتاج اى خبرة تقنية",
      textAltEn: "No technical experience required",
    },

    {
      id: 2,
      titleAr: "تحكم كامل في التصنيفات",
      titleEn: "Full Control in Categories",
      labelAr: "إدارة ذكية لقوائم مطعمك ",
      labelEn: "Smart management of your restaurant menu",
      icon: LineChart,
      textAr:
        "رتّب الأصناف داخل كل تصنيف، وعدّل الأسماء والترتيب في أي وقت ليظهر المنيو بشكل منظم واحترافي أمام عملائك",
      textEn:
        "Sort items within each category, edit names and order anytime to display the menu in a professional and organized way in front of your customers",
      image: "/images/temp/4rd.jpg",
      textAltAr: "أضف المنتجات بسهولة",
      textAltEn: "Add products easily",
    },
    {
      id: 3,
      titleAr: "تحكم كامل في الأسعار",
      titleEn: "Full Control in Prices",
      labelAr: "تحكم كامل في كل منتج",
      labelEn: "Full control of all products",
      icon: LineChart,
      textAr:
        "أضف منتجات جديدة بسرعة وسهولة من لوحة التحكم، وحدد صورها وأسعارها ووصفها بدون أي تعقيد. يمكنك تفعيل أو تعطيل أي منتج في أي وقت ليظهر فقط ما ترغب بعرضه لعملائك، مع تحديث المنيو فورًا ليكون جاهزًا دائمًا لعملائك",
      textEn:
        "Add new products quickly and easily from the control panel, select their images, prices and descriptions without any complexity. You can enable or disable any product at any time to display only what you want to display to your customers, with the menu updated instantly to be always ready for your customers",
      image: "/images/temp/4rd.jpg",
      textAltAr: "تمنحك مرونة كاملة للتحكم في المنيو",
      textAltEn: "Full control of the menu",
    },
  ];

  const activeTabData = tabs[activeTab];

  return (
    <section className="py-24 bg-white dark:bg-[#0d1117] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6">
            {isRTL ? "استخدم ENSMENU في " : "Use ENSMENU "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {isRTL ? "كل مكان" : "Everywhere"}
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            {isRTL
              ? "تعدد الاستخدامات هو ما يميزنا. اختر الحالة التي تناسب عملك وشاهد كيف تعمل."
              : "Versatility is what sets us apart. Choose the case that suits your business and see how it works."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3 w-full flex flex-col gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-6 rounded-[30px] ${
                  isRTL ? "text-right" : "text-left"
                } transition-all flex items-center gap-6 border-2 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-[#15203c] border-purple-500 shadow-2xl shadow-purple-100 dark:shadow-purple-900/50"
                    : "bg-slate-50 dark:bg-[#15203c]/50 border-transparent hover:bg-slate-100 dark:hover:bg-[#15203c]"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-[#0d1117] text-slate-400"
                  }`}
                >
                  <tab.icon size={28} />
                </div>
                <div className="flex-1">
                  <h4
                    className={`!text-[17px] font-black mb-1 ${
                      activeTab === tab.id
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {isRTL ? tab.titleAr : tab.titleEn}
                  </h4>
                  <p className="text-sm font-medium text-slate-400">
                    {isRTL ? tab.labelAr : tab.labelEn}
                  </p>
                </div>
                {activeTab === tab.id && (
                  <div className="w-1.5 h-10 bg-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="lg:w-2/3 w-full relative">
            <div className="bg-slate-50 dark:bg-[#15203c]/50 rounded-[50px] p-4 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-inner">
              <div key={activeTab} className="space-y-8">
                <div className="px-2">
                  <div
                    className={`bg-white dark:bg-[#0d1117] p-6 rounded-[25px] border border-slate-100 dark:border-slate-800 shadow-sm inline-block max-w-full ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                      {isRTL ? activeTabData.textAr : activeTabData.textEn}
                    </p>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-[40px] shadow-2xl border-4 border-white dark:border-[#0d1117] aspect-[16/9]">
                  {/* LCP image optimization: next/image with priority, WebP/AVIF, responsive sizes */}
                  <Image
                    src={activeTabData.image}
                    alt={isRTL ? activeTabData.titleAr : activeTabData.titleEn}
                    width={1200}
                    height={662}
                    priority={activeTab === 0} // Priority for LCP image (first tab)
                    loading={activeTab === 0 ? undefined : "lazy"}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 590px"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={24} />
                      </div>
                      <span className="text-white text-xl font-black">
                        {isRTL
                          ? activeTabData.textAltAr
                          : activeTabData.textAltEn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageShowcase;
