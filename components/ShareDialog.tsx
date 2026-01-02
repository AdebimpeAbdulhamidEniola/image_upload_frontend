"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

interface ShareDialogProps {
  pageUrl: string
}

const ShareDialog = ({ pageUrl }: ShareDialogProps) => {
    const linkRef = useRef<HTMLInputElement>(null)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            // Use modern Clipboard API
            await navigator.clipboard.writeText(pageUrl)
            setCopied(true)
            
            // Reset after 2 seconds
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch {
            // Fallback for older browsers
            linkRef.current?.select()
            document.execCommand("copy")
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-lg px-4 py-2">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#0f1724]">
        <div className="flex items-start justify-between">
          <DialogHeader className="p-0">
            <DialogTitle className="text-lg font-semibold">Share Image</DialogTitle>
          </DialogHeader>
        </div>

        {/* Inline input + copy button */}
        <div className="mt-2 flex items-center gap-3">
          <Input
            id="link"
            value={pageUrl}
            readOnly
            ref={linkRef}
            className="flex-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#071025] text-sm px-3 py-2"
          />

          <Button
            type="button"
            onClick={handleCopy}
            variant={copied ? "default" : "outline"}
            className={
              copied
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-md px-4 py-2"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm rounded-md px-4 py-2"
            }
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </>
            )}
          </Button>
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-md px-4 py-2">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
