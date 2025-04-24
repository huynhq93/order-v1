import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SetupPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Thiết lập kết nối Google Sheets</CardTitle>
          <CardDescription>Nhập thông tin để kết nối với Google Sheets của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-id">Google Sheet ID</Label>
            <Input id="sheet-id" placeholder="Nhập ID của Google Sheet" />
            <p className="text-xs text-muted-foreground">
              ID nằm trong URL của Google Sheet: https://docs.google.com/spreadsheets/d/[Sheet-ID]/edit
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-email">Client Email</Label>
            <Input id="client-email" placeholder="Email của Service Account" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="private-key">Private Key</Label>
            <Input id="private-key" placeholder="Private Key của Service Account" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Kết nối</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
