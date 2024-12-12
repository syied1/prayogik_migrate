import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  // matcher: ["/courses/[slug]:path*"], // Protect these routes
  // matcher: ["/courses/[slug]/:path*"], // Protect deeper paths only
  matcher: ["/courses/:path*"], // Protect deeper paths only
};
