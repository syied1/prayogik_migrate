//@ts-nocheck

"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "কোর্স ", href: "/courses/category" },
  { name: "আমদের সম্পর্কে", href: "/about" },
  { name: "টেস্টিমোনিয়াল", href: "/testimonial" },
  { name: "যোগাযোগ", href: "/contact" },
  { name: "ব্লগ", href: "/blog" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">প্রায়োগীক</span>
            <Image
              src="/prayogik-logo.png"
              width={130}
              height={130}
              className="h-auto w-[170px]"
              alt="prayogik logo"
              priority
            />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 mr-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              id={item.href}
              className="text-xl font-semibold leading-6 text-slate hover:text-primary-600"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className=" hidden lg:flex items-center justify-end gap-x-6">
          {status === "authenticated" && session?.user?.id ? (
            <>
              <button
                onClick={() => signOut()}
                className="text-xl font-semibold leading-6 text-slate hover:text-primary-600"
              >
                লগআউট
              </button>
              <Link
                href="/dashboard"
                className="block rounded-lg px-5 py-2 font-semibold bg-[#0D9488] text-base text-white hover:bg-primary-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                ড্যাশবোর্ড
              </Link>
            </>
          ) : (
            <Link
              href="/signin"
              className="block rounded-lg px-5 py-2 font-semibold bg-[#0D9488] text-base text-white hover:bg-primary-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              লগইন
            </Link>
          )}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      {/* mobile menu */}
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed bg-white inset-y-0 right-0 z-10 w-full overflow-y-auto bg-shadeBase px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between gap-x-6">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">প্রায়োগীক</span>
              <Image
                src="/prayogik-logo.png"
                width={130}
                height={130}
                className="h-auto w-[170px]"
                alt="prayogik logo"
                priority
              />
            </Link>
            <Button
              className="-m-2.5 ml-32 rounded-md p-2.5 text-gray-700 bg-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-slate hover:text-primary-600"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="lg:hidden flex flex-col items-start gap-y-6">
                {status === "authenticated" && session?.user?.id ? (
                  <>
                    <button
                      onClick={() => signOut()}
                      className="text-2xl font-semibold leading-6 text-slate hover:text-primary-600"
                    >
                      লগআউট
                    </button>
                    <Link
                      href="/dashboard"
                      className="block rounded-lg px-5 py-2 font-semibold bg-[#0D9488] text-xl text-white hover:bg-primary-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      ড্যাশবোর্ড
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="block rounded-lg px-5 py-2 font-semibold bg-[#0D9488] text-base text-white hover:bg-primary-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    লগইন
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
