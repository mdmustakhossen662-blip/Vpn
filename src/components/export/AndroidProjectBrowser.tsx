import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  ShieldCheck,
  BookOpen,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { ANDROID_SOURCE_FILES, AndroidCodeFile } from '../../data/androidSourceFiles';

interface AndroidProjectBrowserProps {
  onDownloadApk?: () => void;
}

export const AndroidProjectBrowser: React.FC<AndroidProjectBrowserProps> = ({ onDownloadApk }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(ANDROID_SOURCE_FILES[0].path);
  const [copied, setCopied] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const selectedFile = ANDROID_SOURCE_FILES.find((f) => f.path === selectedFilePath) || ANDROID_SOURCE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // Populate files into zip with full directory hierarchy
      ANDROID_SOURCE_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add project root auxiliary files
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "BD VPN"
include(":app")`
      );

      zip.file(
        'build.gradle.kts',
        `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.gms.google.services) apply false
}`
      );

      zip.file(
        'gradle/libs.versions.toml',
        `[versions]
agp = "8.6.0"
kotlin = "2.0.0"
googleServices = "4.4.2"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version = "1.13.1" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
google-gms-google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bd-vpn-android-studio-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="w-full bg-[#07090F] border border-[#1E2638] rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F2FF] to-cyan-500 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-[#07090F] rounded-[11px] flex items-center justify-center text-[#00F2FF]">
                <FolderTree className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-orbitron text-lg font-bold text-white tracking-wider">
                Android Studio Project Explorer
              </h2>
              <p className="text-xs text-slate-400">
                Official Android VpnService, Jetpack Compose, WireGuard Tunnel &amp; Firebase Architecture
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Actions: Direct APK & Source ZIP */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onDownloadApk && (
            <button
              id="btn-download-apk-from-browser"
              onClick={onDownloadApk}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download APK (.apk)</span>
            </button>
          )}

          <button
            id="btn-download-android-zip"
            onClick={handleDownloadZip}
            disabled={isExportingZip}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FF] to-cyan-500 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingZip ? 'Packaging ZIP Archive...' : 'Download Android Studio Code (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: File Tree Sidebar */}
        <div className="md:col-span-4 bg-[#0D121F] border border-[#1E2638] rounded-2xl p-4 flex flex-col h-[650px] overflow-hidden">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">
            Project Source Files ({ANDROID_SOURCE_FILES.length})
          </span>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {ANDROID_SOURCE_FILES.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#0B1524] border border-[#00F2FF] text-white shadow-sm shadow-cyan-950/20'
                      : 'hover:bg-slate-800/40 text-slate-400 border border-transparent'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#00F2FF]' : 'text-slate-500'
                    }`}
                  />
                  <div className="overflow-hidden">
                    <div className="font-mono text-xs font-semibold truncate text-white">
                      {file.path.split('/').pop()}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-[#1E2638] text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF88] shrink-0" />
            <span>Compliant with Android 14 VpnService specification.</span>
          </div>
        </div>

        {/* Right: Code Editor & Viewer */}
        <div className="md:col-span-8 bg-[#0D121F] border border-[#1E2638] rounded-2xl overflow-hidden flex flex-col h-[650px]">
          {/* Editor Header Bar */}
          <div className="bg-[#111728] px-4 py-3 border-b border-[#1E2638] flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                <span className="text-[#00F2FF]">{selectedFile.language.toUpperCase()}</span>
                <span>·</span>
                <span className="truncate">{selectedFile.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00FF88]" />
                  <span className="text-[#00FF88]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Editor Code Canvas */}
          <div className="flex-1 overflow-auto bg-[#05060A] p-4 text-slate-200 font-mono text-xs leading-relaxed selection:bg-[#00F2FF]/30">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
