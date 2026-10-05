"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/pos');
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full font-sans antialiased selection:bg-[#D8B56A]/30">
      {/* Cột trái: Background collage & Branding */}
      <div className="relative hidden w-1/2 min-h-screen overflow-hidden bg-[#071F17] lg:block">
        {/* Lưới hình ảnh nền 3 cột */}
        <div className="absolute inset-0 p-4 grid grid-cols-3 gap-3 auto-rows-[230px] opacity-75">
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg1.png"
              alt="VTea decor"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg2.png"
              alt="VTea coffee machine"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg3.png"
              alt="VTea cozy lights"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg4.png"
              alt="VTea seating area"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg5.png"
              alt="VTea matcha latte"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg6.png"
              alt="VTea ambiance"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg2.png"
              alt="VTea coffee machine"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg3.png"
              alt="VTea drink"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-inner">
            <Image
              src="/images/login/bg1.png"
              alt="VTea bakery"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Lớp phủ gradient làm dịu ảnh và tôn phong cách Xanh trà */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B2C]/90 via-[#0B3B2C]/65 to-black/60 backdrop-blur-[1px]" />

        {/* Khối Thông tin Thương hiệu bên trái */}
        <div className="relative z-10 flex h-full flex-col justify-center px-10 xl:px-14 text-white">
          {/* Logo container bo góc trắng sang trọng */}
          <div className="mb-8 w-[100px] h-[100px] bg-white rounded-2xl shadow-xl p-2.5 flex items-center justify-center border border-white/40">
            <div className="relative w-full h-full">
              <Image
                src="/images/logo.png"
                alt="VTea Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Tên thương hiệu & slogan */}
          <div className="space-y-1">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              VTea
            </h1>
            <p className="text-xl xl:text-2xl font-medium text-[#D8B56A] tracking-wide">
              Cafe & Trà Sữa
            </p>
          </div>

          {/* Dải phân cách màu Vàng Champagne */}
          <div className="mt-4 mb-3 h-1 w-16 bg-[#D8B56A] rounded-full shadow-sm" />

          {/* Slogan italic */}
          <p className="italic text-gray-200/90 text-sm xl:text-base mb-8">
            &ldquo;Nơi hương vị gặp gỡ cảm xúc&rdquo;
          </p>

          {/* Danh sách cam kết / điểm nổi bật */}
          <ul className="space-y-3.5 text-sm xl:text-base font-normal text-gray-100/95">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#D8B56A] ring-4 ring-[#D8B56A]/25" />
              <span>Nguyên liệu tươi mới mỗi ngày</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#D8B56A] ring-4 ring-[#D8B56A]/25" />
              <span>Không gian ấm cúng, hiện đại</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#D8B56A] ring-4 ring-[#D8B56A]/25" />
              <span>Phục vụ tận tâm, chu đáo</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Cột phải: Form Đăng nhập trên nền Kem #F7F0E1 */}
      <div className="flex flex-1 items-center justify-center bg-[#F7F0E1] px-6 py-12">
        <div className="w-full max-w-[430px] rounded-3xl bg-white p-8 md:p-10 shadow-[0_20px_50px_rgba(11,59,44,0.08)] border border-[#0B3B2C]/5">
          {/* Header form */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B3B2C] tracking-tight">
              Đăng nhập
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Chào mừng bạn quay trở lại!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tên đăng nhập */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2"
              >
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#0B3B2C] focus:ring-2 focus:ring-[#0B3B2C]/20"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#0B3B2C] focus:ring-2 focus:ring-[#0B3B2C]/20"
              />
            </div>

            {/* Checkbox hiện mật khẩu & Quên mật khẩu */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#0B3B2C] focus:ring-[#0B3B2C]"
                />
                <span>Hiển thị mật khẩu</span>
              </label>

              <button
                type="button"
                className="font-medium text-[#0B3B2C] hover:text-[#D8B56A] transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Nút Đăng nhập */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#0B3B2C] py-3.5 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#08291F] active:scale-[0.99] transition duration-200 disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
