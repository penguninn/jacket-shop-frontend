import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Profile() {
  return (
    <main className="col-span-12 md:col-span-10 md:row-start-2">
      <div className="flex h-full flex-col">
        <div className="col-span-12 md:col-span-9 md:row-start-1">
          <div className="h-full border-b bg-card">
            <div className="px-4 py-5">
              <h2 className="text-lg font-semibold">My Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage and protect your account
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-8 p-8">
          {/* Form Column */}
          <div className="col-span-12 md:col-span-8">
            <div className="grid auto-rows-min gap-4">
              <Row>
                <Label className="col-span-3 text-right">Username</Label>
                <div className="col-span-9 text-sm">shoplinhkien05</div>
              </Row>
              <Row>
                <Label htmlFor="fullName" className="col-span-3 text-right">
                  Name
                </Label>
                <div className="col-span-9">
                  <Input id="fullName" placeholder="Your name" />
                </div>
              </Row>
              <Row>
                <Label className="col-span-3 text-right">Phone Number</Label>
                <div className="col-span-9 flex items-center gap-4">
                  <div className="text-sm">*********50</div>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Change
                  </Link>
                </div>
              </Row>
              <Row alignTop>
                <Label className="col-span-3 pt-2 text-right">Gender</Label>
                <div className="col-span-9">
                  <RadioGroup defaultValue="male" className="flex gap-6">
                    <RG value="male" label="Male" />
                    <RG value="female" label="Female" />
                    <RG value="other" label="Other" />
                  </RadioGroup>
                </div>
              </Row>
              <Row>
                <Label className="col-span-3 text-right">Date of birth</Label>
                <div className="col-span-9 flex items-center gap-4">
                  <div className="text-sm">**/**/2000</div>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Change
                  </Link>
                </div>
              </Row>
            </div>
            <div className="mt-8">
              <Button>Save</Button>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="relative col-span-12 hidden md:col-span-1 md:block">
            <Separator
              orientation="vertical"
              className="absolute left-1/2 top-0 h-full -translate-x-1/2"
            />
          </div>

          {/* Avatar Column */}
          <div className="col-span-12 md:col-span-3">
            <div className="grid place-items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">U</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Select Image
              </Button>
              <div className="space-y-1 text-center text-xs text-muted-foreground">
                <p>File size: maximum 1 MB</p>
                <p>File extensions: .JPEG, .PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({
  children,
  alignTop,
}: {
  children: React.ReactNode;
  alignTop?: boolean;
}) {
  return (
    <div
      className={`grid min-h-12 grid-cols-12 gap-3 ${alignTop ? "items-start" : "items-center"}`}
    >
      {children}
    </div>
  );
}

function RG({ value, label }: { value: string; label: string }) {
  const id = `rg-${value}`;
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
