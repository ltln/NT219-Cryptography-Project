import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog, DialogTrigger } from "./ui/Dialog";

export default function MFAModal({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-6">
                <h1>Hello World!</h1>
            </DialogContent>
        </Dialog>
    )
}