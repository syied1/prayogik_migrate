import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-center h-screen">
        <div>
          <Image
            src="/assets/img/not-found.svg"
            alt="notfound placeholder"
            className="max-w-[30rem] w-full h-[auto]"
            width={0}
            height={0}
            priority
          />
          <p className=" mt-6 max-w-lg  text-2xl text-center text-secondary-600 font-semibold">
            404 - Page Not Found
          </p>
          <p className=" mt-4 max-w-lg  text-lg text-center text-secondary-500 font-medium">
            Oops! Looks like you followed a bad link. If you think this is a
            problem with us, please{" "}
            <Link href="/contact" className="text-primary-600">
              contact us
            </Link>
            .
          </p>

          <div className="mt-6 flex items-center justify-center">
            <Link href="/">
              <Button>Go back home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
