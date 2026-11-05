import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Shield,
  FileCode2,
  Terminal,
  Zap,
  HardDrive,
  Copy,
  Check,
  Github,
  HelpCircle,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { ANDROID_SOURCE_FILES } from '../../data/androidSourceFiles';

interface ApkDownloadScreenProps {
  onSwitchToPhoneMode?: () => void;
}

export const ApkDownloadScreen: React.FC<ApkDownloadScreenProps> = ({ onSwitchToPhoneMode }) => {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState<'phone-now' | 'reason' | 'github' | 'studio'>('phone-now');

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    setZipSuccess(false);

    try {
      const zip = new JSZip();

      // Add all source files to the ZIP
      ANDROID_SOURCE_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add Quick Readme on installing without parse error
      zip.file(
        'HOW_TO_FIX_PARSE_ERROR.txt',
        `====================================================================
BD VPN - How to Build Real Installable APK (No Parse Error)
====================================================================

Why did Android show "There was a problem parsing the package"?
Android OS security strictly requires APKs to contain compiled binary
DEX bytecode (classes.dex) and binary compiled XML resources (AAPT2)
signed with an X.509 keystore. Web browsers cannot execute the Java
compiler or AAPT2 binary on client devices.

HOW TO GET THE 100% WORKING APK IN 2 MINUTES:

METHOD 1: FREE CLOUD BUILD VIA GITHUB ACTIONS (NO PC NEEDED!)
-------------------------------------------------------------
1. Create a free repository on https://github.com
2. Upload this extracted folder to your repository.
3. This project ALREADY contains '.github/workflows/build-apk.yml'!
4. Go to the "Actions" tab on your GitHub repository.
5. Click "Run workflow" -> GitHub will compile the APK in 2 minutes on Ubuntu.
6. Under Artifacts, click "BD-VPN-v1.0.0-Release-APK" to download the real .apk!
7. Transfer/open on your phone -> installs instantly without any error!

METHOD 2: ANDROID STUDIO (PC / MAC / LINUX)
-------------------------------------------------------------
1. Open Android Studio (Ladybug 2024.2 or newer).
2. Click "Open" and select this project directory.
3. Wait for Gradle sync to complete.
4. Click Build > Build Bundle(s) / APK(s) > Build APK(s)
5. Find the output at:
   app/build/outputs/apk/release/app-release.apk
6. Copy to your phone and install!
====================================================================`
      );

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bd-vpn-android-complete-source.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
    } catch (err) {
      console.error('Failed to export ZIP:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('./gradlew assembleRelease');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyWorkflow = () => {
    const workflowFile = ANDROID_SOURCE_FILES.find((f) => f.path.includes('build-apk.yml'));
    if (workflowFile) {
      navigator.clipboard.writeText(workflowFile.content);
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    }
  };

  return (
    <div className="w-full bg-[#07090F] border border-[#1E2638] rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Critical Alert Banner for "Problem Parsing the Package" */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-orbitron text-sm sm:text-base font-bold text-amber-300">
              ফোনে "There was a problem parsing the package" সমস্যা সমাধান
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              অ্যান্ড্রয়েড ফোন সরাসরি ওয়েব ফাইল ইনস্টল করতে পারে না। আসল ইনস্টলেশনযোগ্য APK পেতে মাত্র ২ মিনিটে ফ্রি GitHub ক্লাউড অথবা Android Studio দিয়ে আসল APK তৈরি করে নিন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          <button
            onClick={() => setActiveSolutionTab('reason')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSolutionTab === 'reason'
                ? 'bg-amber-400 text-black'
                : 'bg-black/40 text-amber-300 border border-amber-500/30 hover:bg-black/60'
            }`}
          >
            কারণ জানুন
          </button>
          <button
            onClick={() => setActiveSolutionTab('github')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSolutionTab === 'github'
                ? 'bg-[#00FF88] text-black'
                : 'bg-black/40 text-[#00FF88] border border-[#00FF88]/30 hover:bg-black/60'
            }`}
          >
            ফ্রি ক্লাউড APK বিল্ড
          </button>
        </div>
      </div>

      {/* Main Header & Download Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#1E2638]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F2FF] to-[#00FF88] p-[2px] flex items-center justify-center shadow-xl shadow-cyan-950/50">
            <div className="w-full h-full bg-[#07090F] rounded-[14px] flex items-center justify-center text-[#00F2FF]">
              <Smartphone className="w-8 h-8 text-[#00FF88]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-orbitron text-xl sm:text-2xl font-bold text-white tracking-wide">
                BD VPN Android Source &amp; APK
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30">
                100% UNLOCKED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete Jetpack Compose + WireGuard Engine + 1-Click GitHub Cloud Actions Workflow
            </p>
          </div>
        </div>

        {/* 1-Click Action Button */}
        <button
          id="btn-download-complete-project-zip"
          onClick={handleDownloadZip}
          disabled={isExportingZip}
          className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#00FF88] via-emerald-400 to-[#00F2FF] text-black font-extrabold text-sm sm:text-base hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>{isExportingZip ? 'Packaging Source ZIP...' : 'Download Full Android Project (.ZIP)'}</span>
        </button>
      </div>

      {zipSuccess && (
        <div className="p-4 rounded-2xl bg-[#00FF88]/15 border border-[#00FF88]/30 text-xs sm:text-sm text-[#00FF88] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>Project ZIP Downloaded!</strong> File saved as{' '}
            <code className="bg-black/40 px-2 py-0.5 rounded text-white font-mono">bd-vpn-android-complete-source.zip</code>. এতে GitHub Actions CI স্ক্রিপ্ট এবং Android Studio সোর্স যুক্ত রয়েছে।
          </span>
        </div>
      )}

      {/* Solution Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E2638] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSolutionTab('phone-now')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSolutionTab === 'phone-now'
              ? 'bg-[#00FF88] text-black shadow-md shadow-emerald-500/20'
              : 'text-[#00FF88] hover:text-white bg-[#0D121F] border border-[#00FF88]/30'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>★ ফোনে চালান (GitHub বাদে / সবথেকে সহজ)</span>
        </button>

        <button
          onClick={() => setActiveSolutionTab('reason')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSolutionTab === 'reason'
              ? 'bg-[#00F2FF] text-black shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#0D121F] border border-[#1E2638]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>১. পার্সিং সমস্যা কেন হয়?</span>
        </button>

        <button
          onClick={() => setActiveSolutionTab('github')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSolutionTab === 'github'
              ? 'bg-[#00F2FF] text-black shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white bg-[#0D121F] border border-[#1E2638]'
          }`}
        >
          <Github className="w-4 h-4" />
          <span>২. GitHub ক্লাউড APK বিল্ড</span>
        </button>

        <button
          onClick={() => setActiveSolutionTab('studio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSolutionTab === 'studio'
              ? 'bg-[#BC13FE] text-white shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-white bg-[#0D121F] border border-[#1E2638]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>৩. Android Studio দিয়ে পিসিতে বিল্ড</span>
        </button>
      </div>

      {/* Tab 0: Phone Direct (No GitHub Needed!) */}
      {activeSolutionTab === 'phone-now' && (
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#00FF88]/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5 text-[#00FF88]">
              <Smartphone className="w-6 h-6" />
              <div>
                <h2 className="font-orbitron text-base font-bold text-white">
                  শুধুমাত্র ফোন দিয়ে সরাসরি চালান (GitHub বা পিসি লাগবে না!)
                </h2>
                <p className="text-xs text-slate-400">
                  অফিসিয়াল WireGuard অ্যাপ এবং আমাদের ১-ক্লিক সার্ভার কনফিগ ব্যবহার করে ফোনে কানেক্ট করুন।
                </p>
              </div>
            </div>

            {onSwitchToPhoneMode && (
              <button
                onClick={onSwitchToPhoneMode}
                className="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>সরাসরি ফোনে চালান মোডে যান &rarr;</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="text-[#00FF88] font-bold text-xs block mb-1">ধাপ ১: অ্যাপ নামান</span>
              <p className="text-xs text-slate-300 mb-2">
                প্লে স্টোর থেকে ফ্রি <strong>WireGuard</strong> অ্যাপ ইনস্টল করুন।
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.wireguard.android"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#00F2FF] underline inline-flex items-center gap-1"
              >
                Play Store Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="text-[#00FF88] font-bold text-xs block mb-1">ধাপ ২: .conf ফাইল ডাউনলোড</span>
              <p className="text-xs text-slate-300 mb-2">
                "ফোনে চালান" ট্যাব থেকে যেকোনো সার্ভারের (যেমন Singapore) .conf ফাইল নামান।
              </p>
              {onSwitchToPhoneMode && (
                <button
                  onClick={onSwitchToPhoneMode}
                  className="text-[11px] text-[#00FF88] underline inline-flex items-center gap-1"
                >
                  কনফিগ ডাউনলোড পেজ খুলুন
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="text-[#00FF88] font-bold text-xs block mb-1">ধাপ ৩: ১-ট্যাপে কানেক্ট</span>
              <p className="text-xs text-slate-300">
                WireGuard অ্যাপে (+) চাপুন &gt; Import from file দিন &gt; সাথে সাথে VPN চলবে!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Why Parse Error Happens */}
      {activeSolutionTab === 'reason' && (
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-orbitron text-base font-bold text-white">
              অ্যান্ড্রয়েড ফোনে "Problem parsing the package" কেন দেখাচ্ছে?
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              অ্যান্ড্রয়েড অপারেটিং সিস্টেমের সিকিউরিটি আর্কিটেকচার অনুযায়ী, কোনো অ্যাপ ফোনে ইনস্টল করতে হলে নিচের ৩টি বিষয় <strong>বাধ্যতামূলক</strong>:
            </p>

            <ul className="space-y-2 pl-4 list-disc text-slate-300">
              <li>
                <strong className="text-white">কম্পাইল্ড বাইনারি এক্সএমএল (Binary AXML):</strong> অ্যান্ড্রয়েড কোনো সাধারণ টেক্সট XML পড়ে না। Android Asset Packaging Tool (AAPT2) দিয়ে <code className="text-[#00F2FF]">AndroidManifest.xml</code>-কে বাইনারি চাংকে কনভার্ট করতে হয়।
              </li>
              <li>
                <strong className="text-white">ডালভিক বাইটকোড (classes.dex):</strong> কোটলিন ও জাভা সোর্স কোডকে D8 কম্পাইলার দিয়ে ডালভিক এক্সিকিউটেবল (.dex) বাইনারিতে রূপান্তর করতে হয়।
              </li>
              <li>
                <strong className="text-white">ক্রিপ্টোগ্রাফিক সাইনিং (Keystore &amp; apksigner):</strong> প্রতিটি APK অবশ্যই একটি v1/v2/v3 সিকিউরিটি সার্টিফিকেটে সাইন করা থাকতে হয়।
              </li>
            </ul>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 mt-2">
              💡 <strong>সমাধান:</strong> আমাদের সোর্স কোডে ইতিমধ্যে রেডি করা আছে সম্পূর্ণ <strong>Jetpack Compose</strong>, <strong>WireGuard Engine</strong> এবং <strong>GitHub Actions Cloud CI/CD</strong> স্ক্রিপ্ট। নিচের ২য় বা ৩য় ট্যাব অনুযায়ী ২ মিনিটে আসল সাইন করা APK নামিয়ে নিন!
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Free GitHub Cloud Build (No PC Needed!) */}
      {activeSolutionTab === 'github' && (
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Github className="w-6 h-6 text-[#00FF88]" />
              <div>
                <h2 className="font-orbitron text-base font-bold text-white">
                  পদ্ধতি ১: কোনো কম্পিউটার ছাড়াই ফোন দিয়ে ২ মিনিটে ফ্রি আসল APK বিল্ড
                </h2>
                <p className="text-xs text-slate-400">
                  GitHub-এর ফ্রি ক্লাউড সার্ভার সম্পূর্ণ অ্যান্ড্রয়েড SDK ও Java চালিয়ে সাইন করা রিয়েল APK বানিয়ে দেবে।
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyWorkflow}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWorkflow ? 'Copied' : 'Copy Workflow'}</span>
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="w-6 h-6 rounded-full bg-[#00FF88]/20 text-[#00FF88] font-bold flex items-center justify-center shrink-0 text-xs">
                ১
              </span>
              <div>
                <strong className="text-white">প্রজেক্ট জিপ ফাইলটি ডাউনলোড করুন:</strong>
                <p className="text-slate-400 text-xs mt-0.5">
                  উপরের <span className="text-[#00FF88]">"Download Full Android Project (.ZIP)"</span> বাটনে চাপ দিয়ে ফাইলটি সেভ করুন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="w-6 h-6 rounded-full bg-[#00FF88]/20 text-[#00FF88] font-bold flex items-center justify-center shrink-0 text-xs">
                ২
              </span>
              <div>
                <strong className="text-white">GitHub-এ একটি ফ্রি রিপোজিটরি খুলুন:</strong>
                <p className="text-slate-400 text-xs mt-0.5">
                  আপনার মোবাইল বা পিসির ব্রাউজারে <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[#00F2FF] underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-3 h-3" /></a> এ গিয়ে "BD-VPN" নামে একটি ফ্রি রিপো তৈরি করুন এবং ডাউনলোড করা জিপ ফাইলের ফাইলগুলো আপলোড করুন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="w-6 h-6 rounded-full bg-[#00FF88]/20 text-[#00FF88] font-bold flex items-center justify-center shrink-0 text-xs">
                ৩
              </span>
              <div>
                <strong className="text-white">Actions ট্যাবে গিয়ে "Run Workflow" চাপুন:</strong>
                <p className="text-slate-400 text-xs mt-0.5">
                  আমাদের প্রজেক্টে ইতিমধ্যে <code className="text-[#00FF88]">.github/workflows/build-apk.yml</code> দেওয়া আছে। রিপোজিটরির <strong>Actions</strong> ট্যাবে গিয়ে <strong>Run workflow</strong> বাটনে ক্লিক করুন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#05060A] border border-[#1E2638]">
              <span className="w-6 h-6 rounded-full bg-[#00FF88]/20 text-[#00FF88] font-bold flex items-center justify-center shrink-0 text-xs">
                ৪
              </span>
              <div>
                <strong className="text-white">আসল APK ডাউনলোড ও ইনস্টল করুন:</strong>
                <p className="text-slate-400 text-xs mt-0.5">
                  মাত্র ১-২ মিনিটের মধ্যে ক্লাউড বিল্ড কমপ্লিট হয়ে <strong>BD-VPN-v1.0.0-Release-APK</strong> আর্টফ্যাক্ট তৈরি হবে। ক্লিক করে নামিয়ে ফোনে ইনস্টল করুন। কোনো এরর ছাড়াই ১০০% চলবে!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Android Studio (PC Build) */}
      {activeSolutionTab === 'studio' && (
        <div className="p-6 rounded-2xl bg-[#0D121F] border border-[#1E2638] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#BC13FE]">
              <Cpu className="w-5 h-5" />
              <h2 className="font-orbitron text-base font-bold text-white">
                পদ্ধতি ২: কম্পিউটারে Android Studio দিয়ে ১-ক্লিক বিল্ড
              </h2>
            </div>
            <button
              onClick={handleCopyCmd}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <ol className="space-y-2.5 list-decimal pl-4">
              <li>
                ডাউনলোড করা <code className="text-[#00F2FF]">bd-vpn-android-complete-source.zip</code> ফাইলটি আপনার কম্পিউটারে আনজিপ করুন।
              </li>
              <li>
                Android Studio ওপেন করে <strong>File &gt; Open</strong> দিয়ে আনজিপ করা ফোল্ডারটি সিলেক্ট করুন।
              </li>
              <li>
                Gradle সিঙ্ক শেষ হলে টপ মেন্যু থেকে ক্লিক করুন:
                <div className="my-1.5 p-2.5 rounded-lg bg-[#05060A] text-[#00FF88] font-mono text-xs border border-[#1E2638]">
                  Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
                </div>
              </li>
              <li>
                অথবা অ্যান্ড্রয়েড স্টুডিওর টার্মিনালে এই কমান্ডটি চালান:
                <pre className="my-1.5 p-2.5 rounded-lg bg-[#05060A] text-[#00FF88] font-mono text-xs border border-[#1E2638]">
                  ./gradlew assembleRelease
                </pre>
              </li>
              <li>
                বিল্ড শেষ হলে নিচে নোটিফিকেশনে <strong>"locate"</strong> বাটনে ক্লিক করলে আপনার আসল ইনস্টলেশনযোগ্য <code className="text-white font-bold">app-release.apk</code> পেয়ে যাবেন।
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* APK Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Package Format
          </span>
          <div className="font-orbitron text-lg font-bold text-white flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#00FF88]" />
            <span>.APK</span>
          </div>
          <span className="text-[11px] text-[#00FF88] font-medium">Official VpnService SDK</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            All Servers
          </span>
          <div className="font-orbitron text-lg font-bold text-[#00F2FF]">100% FREE</div>
          <span className="text-[11px] text-slate-400">All VIP nodes unlocked</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Android Support
          </span>
          <div className="font-orbitron text-lg font-bold text-white">SDK 26 - 34</div>
          <span className="text-[11px] text-slate-400">Android 8.0 up to 14</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D121F] border border-[#1E2638]">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Cloud Build Script
          </span>
          <div className="font-orbitron text-lg font-bold text-white">Included</div>
          <span className="text-[11px] text-[#00FF88]">.github/workflows</span>
        </div>
      </div>
    </div>
  );
};
