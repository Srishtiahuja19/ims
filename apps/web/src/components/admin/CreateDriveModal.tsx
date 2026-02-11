import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface CreateDriveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDriveCreated: () => void;
}

interface DriveForm {
    name: string;
    date: string;
}

export function CreateDriveModal({ isOpen, onClose, onDriveCreated }: CreateDriveModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<DriveForm>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const onSubmit = async (data: DriveForm) => {
        setIsSubmitting(true);
        try {
            await axios.post("http://localhost:3001/api/drives", data); // TODO: Add Auth Header later
            onDriveCreated();
            reset();
            onClose();
        } catch (error) {
            console.error("Failed to create drive", error);
            showToast("Failed to create drive", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Drive">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Drive Name"
                    placeholder="e.g. Placement Drive 2026"
                    {...register("name", { required: "Name is required" })}
                    error={errors.name?.message}
                />

                <Input
                    label="Drive Date"
                    type="date"
                    {...register("date", { required: "Date is required" })}
                    error={errors.date?.message}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Drive"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
