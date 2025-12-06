import { Link } from "react-router-dom";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Mail, Twitter, Facebook, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Newsletter CTA */}
      <section className="container mx-auto px-4">
        <div className="relative z-10 -mb-20">
          <div className="rounded-3xl bg-black text-white px-6 py-8 md:px-12 md:py-8">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl uppercase">
                Stay up to date about
                <br className="hidden md:block" />
                our latest offers
              </h2>

              {/* Email form */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-4 md:items-end"
              >
                <div className="w-full max-w-md">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="pl-10 h-12 rounded-full bg-white text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                      aria-label="Email address"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full max-w-md rounded-full bg-white text-black hover:bg-white/90"
                >
                  Subscribe to Newsletter
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <section className="w-full">
        <div className=" bg-gray-100 px-6 pb-8 pt-32 md:px-12">
          <div className="container mx-auto grid gap-10 md:grid-cols-6">
            {/* Brand + blurb */}
            <div className="md:col-span-2">
              <Link to="/" className="inline-flex items-center">
                <img src="/logo.png" alt="Shop.co" className="h-8 w-auto" />
              </Link>
              <p className="mt-4 max-w-sm text-sm text-gray-600">
                We have clothes that suits your style and which you’re proud to
                wear. From women to men.
              </p>

              {/* Socials */}
              <div className="mt-5 flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="rounded-full border border-zinc-200 hover:bg-zinc-50">
                  <a
                    href="#"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="rounded-full border border-zinc-200 hover:bg-zinc-50">
                  <a
                    href="#"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="rounded-full border border-zinc-200 hover:bg-zinc-50">
                  <a
                    href="#"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="rounded-full border border-zinc-200 hover:bg-zinc-50">
                  <a
                    href="https://github.com/penguninn"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Columns */}
            <FooterColumn
              title="Company"
              links={[
                { label: "About", to: "/about" },
                { label: "Features", to: "/features" },
                { label: "Works", to: "/works" },
                { label: "Career", to: "/career" },
              ]}
            />
            <FooterColumn
              title="Help"
              links={[
                { label: "Customer Support", to: "/support" },
                { label: "Delivery Details", to: "/delivery" },
                { label: "Terms & Conditions", to: "/terms" },
                { label: "Privacy Policy", to: "/privacy" },
              ]}
            />
            <FooterColumn
              title="FAQ"
              links={[
                { label: "Account", to: "/account" },
                { label: "Manage Deliveries", to: "/deliveries" },
                { label: "Orders", to: "/orders" },
                { label: "Payments", to: "/payments" },
              ]}
            />
            <FooterColumn
              title="Resources"
              links={[
                { label: "Free eBooks", to: "/ebooks" },
                { label: "Development Tutorial", to: "/tutorials" },
                { label: "How to - Blog", to: "/blog" },
                { label: "Youtube Playlist", to: "/playlist" },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="my-8 h-px w-full bg-zinc-200" />

          {/* Bottom row */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-zinc-600">
              ThreadCity.co © 2025, All Rights Reserved
            </p>

            <div className="flex items-center gap-3">
              <PaymentBadge src="/payments/visa.svg" alt="VISA" />
              <PaymentBadge src="/payments/mastercard.svg" alt="Mastercard" />
              <PaymentBadge src="/payments/paypal.svg" alt="PayPal" />
              <PaymentBadge src="/payments/applepay.svg" alt="Apple Pay" />
              <PaymentBadge src="/payments/googlepay.svg" alt="Google Pay" />
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

/* ---------- Subcomponents ---------- */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs tracking-widest text-zinc-800 font-semibold uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaymentBadge({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
      {src ? (
        <img src={src} alt={alt} className="h-5 w-auto" />
      ) : (
        <span className="text-xs font-medium text-zinc-700">{alt}</span>
      )}
    </span>
  );
}
